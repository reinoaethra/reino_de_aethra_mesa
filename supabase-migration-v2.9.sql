-- REINO DE AETHRA v2.9 — correção da criação de campanhas
-- Execute no SQL Editor do Supabase em bancos já existentes.
-- Não apaga nem recria tabelas ou dados. Substitui apenas a função RPC.
-- A geração do convite usa gen_random_uuid(), nativa do PostgreSQL moderno,
-- evitando depender da localização de pgcrypto/gen_random_bytes no search_path.

create or replace function public.create_campaign(p_name text, p_description text default '')
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_campaign public.campaigns;
  v_code text;
begin
  if auth.uid() is null then
    raise exception 'É necessário estar autenticado para criar uma campanha.';
  end if;
  if p_name is null or char_length(trim(p_name)) < 1 or char_length(trim(p_name)) > 70 then
    raise exception 'O nome da campanha deve ter entre 1 e 70 caracteres.';
  end if;

  loop
    v_code := 'AETHRA-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
    exit when not exists (select 1 from public.campaigns c where c.code = v_code);
  end loop;

  insert into public.campaigns(code, name, description, owner_id)
  values (v_code, trim(p_name), coalesce(trim(p_description), ''), auth.uid())
  returning * into v_campaign;

  insert into public.campaign_members(campaign_id, user_id, display_name, role)
  values (v_campaign.id, auth.uid(), 'Mestre da Crônica', 'master');

  return jsonb_build_object(
    'id', v_campaign.id,
    'code', v_campaign.code,
    'name', v_campaign.name,
    'description', v_campaign.description,
    'owner_id', v_campaign.owner_id,
    'status', v_campaign.status,
    'game_state', v_campaign.game_state,
    'created_at', v_campaign.created_at
  );
end;
$$;

-- Mantém a RPC disponível para usuários autenticados.
grant execute on function public.create_campaign(text, text) to authenticated;
