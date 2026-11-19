-- REINO DE AETHRA v3.0.3
-- Gestão segura de campanhas: excluir (somente criador/mestre), remover jogador e sair da campanha.
-- Execute uma vez no Supabase SQL Editor do projeto existente.


-- Ao retornar, um jogador recupera a ficha arquivada no evento de saída/remoção anterior.
create or replace function public.join_campaign(p_code text, p_display_name text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_campaign public.campaigns;
  v_member public.campaign_members;
  v_name text;
  v_character jsonb;
begin
  if auth.uid() is null then
    raise exception 'É necessário estar autenticado para entrar em uma campanha.';
  end if;
  v_name := trim(coalesce(p_display_name, ''));
  if char_length(v_name) < 1 or char_length(v_name) > 40 then
    raise exception 'O nome para exibição deve ter entre 1 e 40 caracteres.';
  end if;

  select * into v_campaign
  from public.campaigns c
  where upper(c.code) = upper(trim(coalesce(p_code, '')))
    and c.status <> 'archived';

  if v_campaign.id is null then
    raise exception 'Código de campanha não encontrado ou campanha arquivada.';
  end if;

  select e.payload->'character' into v_character
  from public.campaign_events e
  where e.campaign_id = v_campaign.id
    and e.event_type in ('member_left','member_removed')
    and e.payload->>'user_id' = auth.uid()::text
    and jsonb_typeof(e.payload->'character') = 'object'
  order by e.created_at desc
  limit 1;

  insert into public.campaign_members as existing_member(campaign_id, user_id, display_name, role, character)
  values (v_campaign.id, auth.uid(), v_name, 'player', v_character)
  on conflict (campaign_id, user_id)
  do update set display_name = excluded.display_name,
                character = coalesce(existing_member.character, excluded.character)
  returning * into v_member;

  return jsonb_build_object(
    'id', v_campaign.id, 'code', v_campaign.code, 'name', v_campaign.name,
    'description', v_campaign.description, 'owner_id', v_campaign.owner_id,
    'status', v_campaign.status, 'game_state', v_campaign.game_state,
    'member_id', v_member.id, 'member_role', v_member.role
  );
end;
$$;

create or replace function public.delete_campaign(p_campaign_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_owner_id uuid;
begin
  if auth.uid() is null then
    raise exception 'É necessário estar autenticado.';
  end if;

  select c.owner_id into v_owner_id
  from public.campaigns c
  where c.id = p_campaign_id
  for update;

  if not found then
    raise exception 'Campanha não encontrada.';
  end if;

  if v_owner_id <> auth.uid() or not public.is_campaign_master(p_campaign_id) then
    raise exception 'Somente o mestre que criou esta campanha pode excluí-la.';
  end if;

  -- Notifica participantes antes da exclusão; o histórico inteiro será removido por CASCADE.
  insert into public.campaign_events(campaign_id, actor_id, event_type, payload)
  values (p_campaign_id, auth.uid(), 'campaign_deleted', jsonb_build_object('deleted_by', auth.uid()));

  -- Os participantes, eventos e recompensas vinculados são removidos por ON DELETE CASCADE.
  delete from public.campaigns where id = p_campaign_id;

  return jsonb_build_object('ok', true, 'campaign_id', p_campaign_id, 'deleted', true);
end;
$$;

create or replace function public.remove_campaign_member(p_campaign_id uuid, p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_owner_id uuid;
  v_target_role text;
  v_target_name text;
  v_target_character jsonb;
  v_deleted integer;
begin
  if auth.uid() is null then
    raise exception 'É necessário estar autenticado.';
  end if;
  if p_user_id is null or p_user_id = auth.uid() then
    raise exception 'O mestre não pode remover a própria conta.';
  end if;

  select c.owner_id into v_owner_id
  from public.campaigns c
  where c.id = p_campaign_id
  for update;

  if not found then
    raise exception 'Campanha não encontrada.';
  end if;
  if v_owner_id <> auth.uid() or not public.is_campaign_master(p_campaign_id) then
    raise exception 'Somente o mestre que criou a campanha pode remover participantes.';
  end if;

  select m.role, m.display_name, m.character into v_target_role, v_target_name, v_target_character
  from public.campaign_members m
  where m.campaign_id = p_campaign_id and m.user_id = p_user_id
  for update;

  if not found then
    raise exception 'Este participante não está na campanha.';
  end if;
  if v_target_role <> 'player' then
    raise exception 'A conta do mestre não pode ser removida por esta ação.';
  end if;

  insert into public.campaign_events(campaign_id, actor_id, event_type, payload)
  values (p_campaign_id, auth.uid(), 'member_removed', jsonb_build_object('user_id', p_user_id, 'display_name', v_target_name, 'character', v_target_character));

  delete from public.campaign_members
  where campaign_id = p_campaign_id and user_id = p_user_id and role = 'player';
  get diagnostics v_deleted = row_count;
  if v_deleted = 0 then
    raise exception 'Não foi possível remover este participante.';
  end if;

  return jsonb_build_object('ok', true, 'campaign_id', p_campaign_id, 'removed_user_id', p_user_id);
end;
$$;

create or replace function public.leave_campaign(p_campaign_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_role text;
  v_display_name text;
  v_character jsonb;
  v_deleted integer;
begin
  if auth.uid() is null then
    raise exception 'É necessário estar autenticado.';
  end if;

  select m.role, m.display_name, m.character into v_role, v_display_name, v_character
  from public.campaign_members m
  where m.campaign_id = p_campaign_id and m.user_id = auth.uid()
  for update;

  if not found then
    raise exception 'Você não participa desta campanha.';
  end if;
  if v_role <> 'player' then
    raise exception 'O mestre que criou a campanha não pode sair dela. Exclua a campanha para encerrá-la.';
  end if;

  insert into public.campaign_events(campaign_id, actor_id, event_type, payload)
  values (p_campaign_id, auth.uid(), 'member_left', jsonb_build_object('user_id', auth.uid(), 'display_name', v_display_name, 'character', v_character));

  delete from public.campaign_members
  where campaign_id = p_campaign_id and user_id = auth.uid() and role = 'player';
  get diagnostics v_deleted = row_count;
  if v_deleted = 0 then
    raise exception 'Não foi possível sair da campanha.';
  end if;

  return jsonb_build_object('ok', true, 'campaign_id', p_campaign_id, 'left', true);
end;
$$;

revoke all on function public.join_campaign(text, text) from public, anon;
revoke all on function public.delete_campaign(uuid) from public, anon;
revoke all on function public.remove_campaign_member(uuid, uuid) from public, anon;
revoke all on function public.leave_campaign(uuid) from public, anon;
grant execute on function public.join_campaign(text, text) to authenticated;
grant execute on function public.delete_campaign(uuid) to authenticated;
grant execute on function public.remove_campaign_member(uuid, uuid) to authenticated;
grant execute on function public.leave_campaign(uuid) to authenticated;
