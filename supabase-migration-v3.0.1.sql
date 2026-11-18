-- Reino de Aethra v3.0.1 — amplia os RPCs táticos para os onze tabuleiros oficiais.
-- Execute UMA VEZ no Supabase depois da atualização dos arquivos.
-- Não apaga nem altera campanhas, fichas, personagens ou eventos existentes.
-- Apenas atualiza as listas de mapas permitidos para solicitações de movimento e interação.

create or replace function public.request_map_move(
  p_campaign_id uuid,
  p_map_id text,
  p_x integer,
  p_y integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
  v_actor_name text;
  v_status text;
  v_game_state jsonb;
  v_event public.campaign_events;
begin
  if auth.uid() is null then
    raise exception 'É necessário estar autenticado para solicitar movimento.';
  end if;

  select m.role, m.display_name into v_role, v_actor_name
  from public.campaign_members m
  where m.campaign_id = p_campaign_id and m.user_id = auth.uid();

  if v_role is distinct from 'player' then
    raise exception 'Somente jogadores participantes podem solicitar movimento.';
  end if;

  if not exists (
    select 1 from public.campaign_members m
    where m.campaign_id = p_campaign_id and m.user_id = auth.uid() and m.character is not null
  ) then
    raise exception 'Crie seu personagem antes de solicitar movimento.';
  end if;

  if p_map_id is null or p_map_id not in ('eldoria-road', 'brumafolha', 'watchtower', 'root-sanctuary', 'thalassor-reef', 'niveria-crystal', 'solaria-dais', 'drakmor-citadel', 'umbrafunda-cavern', 'drakmor-lava-cave', 'niveria-deep-cave') then
    raise exception 'Mapa não reconhecido.';
  end if;
  if p_x is null or p_y is null or p_x < 0 or p_x > 9 or p_y < 0 or p_y > 7 then
    raise exception 'Coordenada fora dos limites do mapa.';
  end if;

  select c.status, c.game_state into v_status, v_game_state
  from public.campaigns c where c.id = p_campaign_id;

  if v_status is distinct from 'active' then
    raise exception 'A sessão não está ativa.';
  end if;
  if coalesce(v_game_state->'exploration'->>'mapId', 'eldoria-road') is distinct from p_map_id then
    raise exception 'O mapa mudou. Atualize a sala antes de solicitar movimento.';
  end if;

  insert into public.campaign_events(campaign_id, actor_id, event_type, payload)
  values (
    p_campaign_id,
    auth.uid(),
    'map_move_request',
    jsonb_build_object(
      'map_id', p_map_id,
      'x', p_x,
      'y', p_y,
      'player_name', left(coalesce(v_actor_name, 'Aventureiro'), 80)
    )
  )
  returning * into v_event;

  return to_jsonb(v_event);
end;
$$;

create or replace function public.request_map_interaction(
  p_campaign_id uuid,
  p_map_id text,
  p_marker_id text,
  p_action text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
  v_actor_name text;
  v_status text;
  v_game_state jsonb;
  v_marker jsonb;
  v_event public.campaign_events;
begin
  if auth.uid() is null then
    raise exception 'É necessário estar autenticado para interagir com o mapa.';
  end if;

  select m.role, m.display_name into v_role, v_actor_name
  from public.campaign_members m
  where m.campaign_id = p_campaign_id and m.user_id = auth.uid();
  if v_role is distinct from 'player' then
    raise exception 'Somente jogadores participantes podem solicitar interações.';
  end if;
  if not exists (
    select 1 from public.campaign_members m
    where m.campaign_id = p_campaign_id and m.user_id = auth.uid() and m.character is not null
  ) then
    raise exception 'Crie seu personagem antes de interagir com objetos.';
  end if;
  if p_map_id is null or p_map_id not in ('eldoria-road', 'brumafolha', 'watchtower', 'root-sanctuary', 'thalassor-reef', 'niveria-crystal', 'solaria-dais', 'drakmor-citadel', 'umbrafunda-cavern', 'drakmor-lava-cave', 'niveria-deep-cave') then
    raise exception 'Mapa não reconhecido.';
  end if;
  if p_marker_id is null or length(p_marker_id) > 80 then
    raise exception 'Objeto do mapa inválido.';
  end if;
  if p_action is null or p_action not in ('open_door', 'inspect_altar') then
    raise exception 'Ação de interação não permitida.';
  end if;

  select c.status, c.game_state into v_status, v_game_state
  from public.campaigns c
  where c.id = p_campaign_id;
  if v_status is distinct from 'active' then
    raise exception 'A sessão não está ativa.';
  end if;
  if coalesce(v_game_state->'exploration'->>'mapId', 'eldoria-road') is distinct from p_map_id then
    raise exception 'O mapa mudou. Atualize a sala antes de interagir.';
  end if;

  select marker.value into v_marker
  from jsonb_array_elements(coalesce(v_game_state #> array['exploration','maps',p_map_id,'markers'], '[]'::jsonb)) as marker(value)
  where marker.value->>'id' = p_marker_id
  limit 1;
  if v_marker is null then
    raise exception 'Este objeto não está mais disponível no mapa.';
  end if;
  if p_action = 'open_door' and (v_marker->>'type' is distinct from 'door' or coalesce((v_marker->>'open')::boolean, false)) then
    raise exception 'Esta porta não pode ser aberta agora.';
  end if;
  if p_action = 'inspect_altar' and (v_marker->>'type' is distinct from 'altar' or coalesce((v_marker->>'discovered')::boolean, false)) then
    raise exception 'Este altar já foi examinado ou não está disponível.';
  end if;

  insert into public.campaign_events(campaign_id, actor_id, event_type, payload)
  values (
    p_campaign_id,
    auth.uid(),
    'map_interaction_request',
    jsonb_build_object(
      'map_id', p_map_id,
      'marker_id', p_marker_id,
      'action', p_action,
      'player_name', left(coalesce(v_actor_name, 'Aventureiro'), 80)
    )
  )
  returning * into v_event;
  return to_jsonb(v_event);
end;
$$;

revoke all on function public.request_map_move(uuid, text, integer, integer) from public, anon;
grant execute on function public.request_map_move(uuid, text, integer, integer) to authenticated;
revoke all on function public.request_map_interaction(uuid, text, text, text) from public, anon;
grant execute on function public.request_map_interaction(uuid, text, text, text) to authenticated;
