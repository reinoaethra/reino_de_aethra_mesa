-- Reino de Aethra v0.6 — solicitação segura de movimento no mapa tático.
-- Execute este arquivo uma única vez em um banco que já esteja na v0.5.
-- Não apaga campanhas, personagens, eventos ou fichas.



-- v0.6: solicitação de movimento no mapa. O jogador só pode pedir
-- o deslocamento da própria peça; a validação de caminho, turno e obstáculos
-- é feita pela instância ativa do mestre antes de alterar game_state.
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

  if p_map_id is null or p_map_id not in ('eldoria-road', 'brumafolha', 'watchtower', 'root-sanctuary') then
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


revoke all on function public.request_map_move(uuid, text, integer, integer) from public, anon;
grant execute on function public.request_map_move(uuid, text, integer, integer) to authenticated;

-- A tabela campaign_events já está na publicação Realtime nas versões anteriores.
-- Não é necessário recriar tabelas nem alterar permissões de escrita direta.
