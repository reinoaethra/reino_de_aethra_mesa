-- REINO DE AETHRA v4.2.0 — CORREÇÃO JSONB COMPATÍVEL
-- Corrige os eventos enviados por jogadores na sala de preparação, nas votações
-- narrativas e nas marcações de atenção do mapa tático.
-- Base: submit_campaign_event do supabase-schema.sql v3.0.3 fornecido pelo projeto.
-- Execute UMA vez no SQL Editor do Supabase antes de publicar/usar o app v4.2.0.
-- Cria a tabela privada campaign_master_private_state e o bucket de áudio;
-- faz backfill do game_state atual e mantém as campanhas/personagens existentes.

create or replace function public.submit_campaign_event(
  p_campaign_id uuid,
  p_event_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
  v_actor_name text;
  v_actor_character jsonb;
  v_event public.campaign_events;
  v_payload jsonb := coalesce(p_payload, '{}'::jsonb);
  v_game_state jsonb;
  v_prompt jsonb;
  v_text text;
  v_amount numeric;
  v_action text;
  v_encounter_id text;
  v_turn_index integer;
  v_round integer;
  v_current_turn jsonb;
  v_branch jsonb;
  v_campaign_status text;
  v_map_id text;
  v_map_record jsonb;
  v_x integer;
  v_y integer;
  v_world_object_id text;
begin
  if auth.uid() is null then
    raise exception 'É necessário estar autenticado para enviar um evento.';
  end if;

  select m.role, m.display_name, m.character
  into v_role, v_actor_name, v_actor_character
  from public.campaign_members m
  where m.campaign_id = p_campaign_id and m.user_id = auth.uid();

  if v_role is null then
    raise exception 'Você não participa desta campanha.';
  end if;

  if p_event_type is null or char_length(p_event_type) < 1 or char_length(p_event_type) > 60 then
    raise exception 'Tipo de evento inválido.';
  end if;

  if v_role = 'player' then
    if p_event_type not in (
      'roll_request', 'damage_request', 'combat_action_request', 'chat_message',
      'v41_ready_request', 'v41_map_ping_request', 'v4_branch_choice_request', 'world_interaction_request'
    ) then
      raise exception 'Jogadores não podem publicar este tipo de evento.';
    end if;
  else
    if p_event_type not in (
      'dice_prompt', 'dice_result', 'damage_applied', 'damage_rejected',
      'narration', 'encounter_started', 'encounter_ended',
      'session_note', 'turn_changed', 'turn_advanced', 'player_notification',
      'combat_action_result', 'monster_attack_result', 'combat_action_rejected',
      'encounter_defeated', 'chat_message'
    ) then
      raise exception 'Tipo de evento não permitido para o mestre.';
    end if;
  end if;

  -- Chat: texto curto, sem confiar no nome enviado pelo navegador.
  if p_event_type = 'chat_message' then
    v_text := trim(coalesce(v_payload->>'text', ''));
    if char_length(v_text) < 1 or char_length(v_text) > 500 then
      raise exception 'A mensagem deve ter entre 1 e 500 caracteres.';
    end if;
    v_payload := jsonb_build_object('text', v_text, 'display_name', v_actor_name);
  end if;

  -- PRONTIDÃO: evento exclusivo para jogador com ficha, somente durante preparação.
  -- Também aceita temporariamente o envelope legado da v4.1.8, caso uma aba antiga
  -- ainda esteja aberta durante a atualização.
  if v_role = 'player' and (
    p_event_type = 'v41_ready_request'
    or (p_event_type = 'v4_branch_choice_request' and v_payload->>'request_type' = 'session_ready')
  ) then
    if jsonb_typeof(v_payload->'ready') is distinct from 'boolean' then
      raise exception 'A confirmação de prontidão precisa ser verdadeira ou falsa.';
    end if;
    if v_actor_character is null or jsonb_typeof(v_actor_character) is distinct from 'object' then
      raise exception 'Crie seu personagem antes de confirmar que está pronto.';
    end if;

    select c.status, c.game_state
    into v_campaign_status, v_game_state
    from public.campaigns c
    where c.id = p_campaign_id
    for update;

    if not found then
      raise exception 'Campanha não encontrada.';
    end if;
    if v_campaign_status = 'active' or coalesce(v_game_state->>'started', 'false') = 'true' then
      raise exception 'A sessão já começou; a prontidão não pode ser alterada agora.';
    end if;

    if p_event_type = 'v41_ready_request' then
      v_payload := jsonb_build_object('ready', (v_payload->>'ready')::boolean, 'player_name', v_actor_name);
    else
      v_payload := jsonb_build_object('request_type', 'session_ready', 'ready', (v_payload->>'ready')::boolean, 'player_name', v_actor_name);
    end if;
  end if;

  -- VOTAÇÃO NARRATIVA: o jogador só pode votar em uma opção da decisão ativa,
  -- uma única vez por decisão. O mestre continua sendo quem confirma o resultado.
  if v_role = 'player' and p_event_type = 'v4_branch_choice_request'
    and v_payload->>'request_type' is distinct from 'session_ready' then
    if coalesce(v_payload->>'branch_id', '') = '' or char_length(v_payload->>'branch_id') > 100
      or coalesce(v_payload->>'option_id', '') = '' or char_length(v_payload->>'option_id') > 100 then
      raise exception 'A decisão ou opção informada é inválida.';
    end if;

    -- Serializa votos simultâneos do mesmo jogador na mesma decisão.
    perform pg_advisory_xact_lock(hashtextextended(
      concat_ws(':', 'aethra-branch-vote', p_campaign_id::text, v_payload->>'branch_id', auth.uid()::text), 0
    ));

    select c.game_state into v_game_state
    from public.campaigns c
    where c.id = p_campaign_id
    for update;

    v_branch := v_game_state #> '{v4,storyBranches,active}';
    if v_branch is null or jsonb_typeof(v_branch) is distinct from 'object'
      or v_branch->>'id' is distinct from v_payload->>'branch_id'
      or coalesce(v_branch->>'selectedOptionId', '') <> '' then
      raise exception 'Esta decisão não está mais disponível para votação.';
    end if;

    if not exists (
      select 1
      from jsonb_array_elements(coalesce(v_branch->'options', '[]'::jsonb)) as opt(value)
      where opt.value->>'id' = v_payload->>'option_id'
    ) then
      raise exception 'A opção escolhida não pertence a esta decisão.';
    end if;

    if coalesce(v_branch #>> array['votes', auth.uid()::text], '') <> '' or exists (
      select 1 from public.campaign_events e
      where e.campaign_id = p_campaign_id
        and e.actor_id = auth.uid()
        and e.event_type = 'v4_branch_choice_request'
        and e.payload->>'branch_id' = v_payload->>'branch_id'
    ) then
      raise exception 'Você já registrou um voto nesta decisão.';
    end if;

    v_payload := jsonb_build_object(
      'branch_id', v_payload->>'branch_id',
      'option_id', v_payload->>'option_id',
      'player_name', v_actor_name
    );
  end if;

  -- MARCAÇÃO DE ATENÇÃO NO MAPA: jogadores só solicitam marcações simples
  -- no mapa atualmente selecionado e apresentado pela Central do Mestre.
  if v_role = 'player' and p_event_type = 'v41_map_ping_request' then
    if v_actor_character is null or jsonb_typeof(v_actor_character) is distinct from 'object' then
      raise exception 'Crie seu personagem antes de interagir com o mapa.';
    end if;
    v_map_id := coalesce(v_payload->>'map_id', '');
    if v_map_id not in (
      'eldoria-road', 'brumafolha', 'watchtower', 'root-sanctuary', 'thalassor-reef',
      'niveria-crystal', 'solaria-dais', 'drakmor-citadel', 'umbrafunda-cavern',
      'drakmor-lava-cave', 'niveria-deep-cave'
    ) then
      raise exception 'Mapa não reconhecido.';
    end if;
    if coalesce(v_payload->>'x', '') !~ '^[0-9]{1,2}$'
      or coalesce(v_payload->>'y', '') !~ '^[0-9]{1,2}$' then
      raise exception 'Coordenada inválida.';
    end if;
    v_x := (v_payload->>'x')::integer;
    v_y := (v_payload->>'y')::integer;
    if v_x < 0 or v_x > 9 or v_y < 0 or v_y > 7 then
      raise exception 'Coordenada fora dos limites do mapa.';
    end if;

    select c.game_state into v_game_state
    from public.campaigns c
    where c.id = p_campaign_id;
    if not found then
      raise exception 'Campanha não encontrada.';
    end if;
    if coalesce(v_game_state #>> '{exploration,mapId}', 'eldoria-road') is distinct from v_map_id then
      raise exception 'O mapa mudou. Atualize a sala antes de solicitar a marcação.';
    end if;

    v_map_record := v_game_state #> array['exploration', 'maps', v_map_id];
    if jsonb_typeof(v_map_record->'playersVisible') = 'boolean'
      and v_map_record->'playersVisible' = 'false'::jsonb then
      raise exception 'O mestre ainda não apresentou este mapa aos jogadores.';
    end if;

    v_payload := jsonb_build_object(
      'map_id', v_map_id,
      'x', v_x,
      'y', v_y,
      'type', 'attention',
      'player_name', v_actor_name
    );
  end if;

  -- CENA INTERATIVA: jogadores apenas solicitam uma interação; o mestre decide e resolve.
  if v_role = 'player' and p_event_type = 'world_interaction_request' then
    if v_actor_character is null or jsonb_typeof(v_actor_character) is distinct from 'object' then
      raise exception 'Crie seu personagem antes de interagir com a cena.';
    end if;
    select c.status, c.game_state into v_campaign_status, v_game_state
    from public.campaigns c where c.id = p_campaign_id;
    if not found then raise exception 'Campanha não encontrada.'; end if;
    if v_campaign_status is distinct from 'active' then
      raise exception 'A sessão precisa estar ativa para solicitar uma interação.';
    end if;
    v_map_id := coalesce(v_payload->>'map_id', '');
    if v_map_id not in (
      'eldoria-road', 'brumafolha', 'watchtower', 'root-sanctuary', 'thalassor-reef',
      'niveria-crystal', 'solaria-dais', 'drakmor-citadel', 'umbrafunda-cavern',
      'drakmor-lava-cave', 'niveria-deep-cave'
    ) then raise exception 'Região da cena não reconhecida.'; end if;
    if coalesce(v_game_state #>> '{exploration,mapId}', 'eldoria-road') is distinct from v_map_id then
      raise exception 'A cena mudou. Atualize a página antes de solicitar a interação.';
    end if;
    v_world_object_id := coalesce(v_payload->>'object_id', '');
    if v_world_object_id !~ '^[a-z0-9-]{1,80}$' then
      raise exception 'Objeto da cena inválido.';
    end if;
    if coalesce(v_payload->>'action', 'interact') <> 'interact' then
      raise exception 'Ação de exploração não permitida.';
    end if;
    if coalesce(v_game_state #>> array['worldExploration','objectStates',v_world_object_id,'hiddenFromPlayers'], 'false') = 'true' then
      raise exception 'Este objeto ainda não foi apresentado à companhia.';
    end if;
    v_payload := jsonb_build_object(
      'map_id', v_map_id,
      'object_id', v_world_object_id,
      'action', 'interact',
      'player_name', v_actor_name
    );
  end if;

  -- Rolagem: o jogador só responde a uma solicitação ativa direcionada a ele,
  -- e cada participante pode responder uma vez por solicitação.
  if v_role = 'player' and p_event_type = 'roll_request' then
    select c.game_state into v_game_state
    from public.campaigns c where c.id = p_campaign_id;
    v_prompt := v_game_state->'activeRollPrompt';
    if v_prompt is null or v_prompt->>'id' is distinct from v_payload->>'prompt_id' then
      raise exception 'Não existe uma solicitação de rolagem ativa para esta ação.';
    end if;
    if not (coalesce(v_prompt->'target_user_ids', '[]'::jsonb) @> jsonb_build_array(auth.uid()::text)) then
      raise exception 'Esta solicitação de rolagem não foi direcionada a você.';
    end if;
    if (coalesce(v_prompt->'fulfilled_user_ids', '[]'::jsonb) @> jsonb_build_array(auth.uid()::text)) then
      raise exception 'Você já respondeu a esta solicitação.';
    end if;
    perform pg_advisory_xact_lock(hashtextextended(
      concat_ws(':', 'aethra-roll', p_campaign_id::text, v_payload->>'prompt_id', auth.uid()::text), 0
    ));
    if exists (
      select 1 from public.campaign_events e
      where e.campaign_id = p_campaign_id
        and e.actor_id = auth.uid()
        and e.event_type = 'roll_request'
        and e.payload->>'prompt_id' = v_payload->>'prompt_id'
    ) then
      raise exception 'Sua resposta para esta solicitação já foi enviada.';
    end if;
    v_payload := jsonb_build_object('prompt_id', v_payload->>'prompt_id', 'player_name', v_actor_name);
  end if;

  -- Dano declarado é limitado no backend; o mestre ainda precisa aprová-lo.
  if v_role = 'player' and p_event_type = 'damage_request' then
    if coalesce(v_payload->>'amount', '') !~ '^[0-9]{1,4}$' then
      raise exception 'Informe uma quantidade de dano válida.';
    end if;
    v_amount := (v_payload->>'amount')::numeric;
    if v_amount < 1 or v_amount > 1000 then
      raise exception 'O dano deve estar entre 1 e 1000.';
    end if;
    select c.game_state into v_game_state
    from public.campaigns c where c.id = p_campaign_id;
    if jsonb_typeof(v_game_state->'encounter') is distinct from 'object'
      or v_game_state->'encounter'->>'id' is distinct from v_payload->>'encounter_id' then
      raise exception 'O encontro informado não está ativo.';
    end if;
    v_payload := jsonb_build_object(
      'amount', v_amount,
      'note', left(trim(coalesce(v_payload->>'note', '')), 240),
      'player_name', v_actor_name,
      'encounter_id', v_payload->>'encounter_id'
    );
  end if;

  -- Ação de combate: somente o personagem cujo turno está ativo pode agir.
  if v_role = 'player' and p_event_type = 'combat_action_request' then
    select c.status, c.game_state into v_text, v_game_state
    from public.campaigns c where c.id = p_campaign_id;
    if v_text is distinct from 'active' then
      raise exception 'A sessão não está ativa.';
    end if;
    v_encounter_id := coalesce(v_payload->>'encounter_id', '');
    if jsonb_typeof(v_game_state->'encounter') is distinct from 'object'
      or v_game_state->'encounter'->>'id' is distinct from v_encounter_id then
      raise exception 'Não existe este encontro ativo.';
    end if;
    if v_game_state->'encounter'->>'defeated' = 'true' then
      raise exception 'Este encontro já foi concluído.';
    end if;
    v_action := coalesce(v_payload->>'action', '');
    if v_action not in ('attack', 'ability', 'item') then
      raise exception 'Ação de combate inválida.';
    end if;
    if coalesce(v_game_state->'encounter'->>'turnIndex', '') !~ '^[0-9]{1,4}$'
      or coalesce(v_game_state->'encounter'->>'round', '1') !~ '^[0-9]{1,4}$' then
      raise exception 'A ordem de turnos está inválida.';
    end if;
    v_turn_index := (v_game_state->'encounter'->>'turnIndex')::integer;
    v_round := coalesce((v_game_state->'encounter'->>'round')::integer, 1);
    if jsonb_typeof(v_game_state->'encounter'->'turnOrder') is distinct from 'array'
      or v_turn_index >= jsonb_array_length(v_game_state->'encounter'->'turnOrder') then
      raise exception 'Não foi possível identificar o turno atual.';
    end if;
    v_current_turn := (v_game_state->'encounter'->'turnOrder')->v_turn_index;
    if v_current_turn->>'kind' is distinct from 'player'
      or v_current_turn->>'user_id' is distinct from auth.uid()::text then
      raise exception 'Ainda não é o seu turno.';
    end if;
    if coalesce(v_payload->>'round', '') !~ '^[0-9]{1,4}$'
      or coalesce(v_payload->>'turn_index', '') !~ '^[0-9]{1,4}$'
      or (v_payload->>'round')::integer <> v_round
      or (v_payload->>'turn_index')::integer <> v_turn_index then
      raise exception 'O turno mudou. Atualize a sala antes de agir.';
    end if;
    perform pg_advisory_xact_lock(hashtextextended(
      concat_ws(':', 'aethra-combat', p_campaign_id::text, v_encounter_id, v_round::text, v_turn_index::text), 0
    ));
    if exists (
      select 1 from public.campaign_events e
      where e.campaign_id = p_campaign_id
        and e.actor_id = auth.uid()
        and e.event_type = 'combat_action_request'
        and e.payload->>'encounter_id' = v_encounter_id
        and e.payload->>'round' = v_round::text
        and e.payload->>'turn_index' = v_turn_index::text
    ) then
      raise exception 'Você já enviou uma ação neste turno.';
    end if;
    v_payload := jsonb_build_object(
      'encounter_id', v_encounter_id,
      'action', v_action,
      'ability_id', left(coalesce(v_payload->>'ability_id', ''), 64),
      'item_id', left(coalesce(v_payload->>'item_id', ''), 64),
      'round', v_round,
      'turn_index', v_turn_index,
      'player_name', v_actor_name
    );
  end if;

  if octet_length(v_payload::text) > 10000 then
    raise exception 'O evento excede o tamanho permitido.';
  end if;

  -- Limite simples para evitar envio excessivo de eventos por participante.
  if v_role = 'player' and exists (
    select 1 from public.campaign_events e
    where e.campaign_id = p_campaign_id
      and e.actor_id = auth.uid()
      and e.created_at > now() - interval '700 milliseconds'
  ) then
    raise exception 'Aguarde um instante antes de enviar outra ação.';
  end if;

  insert into public.campaign_events(campaign_id, actor_id, event_type, payload)
  values (p_campaign_id, auth.uid(), p_event_type, v_payload)
  returning * into v_event;

  return to_jsonb(v_event);
end;
$$;

revoke all on function public.submit_campaign_event(uuid, text, jsonb) from public, anon;
grant execute on function public.submit_campaign_event(uuid, text, jsonb) to authenticated;

-- Teste manual após executar:
-- 1) Jogador com ficha deve conseguir enviar v41_ready_request na sala de preparação.
-- 2) Jogador deve conseguir votar com v4_branch_choice_request numa decisão ativa.
-- 3) Jogador deve conseguir solicitar v41_map_ping_request se o mapa estiver apresentado.
-- 4) Jogadores continuam sem poder enviar narration, session_note, dice_result ou eventos de mestre.
-- 5) Jogadores podem solicitar interações da Cena Interativa; somente o mestre resolve.



-- Solicitações de movimento e interação tática: além das regras de jogabilidade,
-- o servidor exige que o mapa esteja apresentado aos jogadores.
create or replace function public.request_map_move(
  p_campaign_id uuid,
  p_map_id text,
  p_x integer,
  p_y integer
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
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
  if coalesce(v_game_state #>> array['exploration','maps',p_map_id,'playersVisible'], 'true') = 'false' then
    raise exception 'O mestre ainda não apresentou este mapa aos jogadores.';
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
set search_path = public, pg_temp
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
  if coalesce(v_game_state #>> array['exploration','maps',p_map_id,'playersVisible'], 'true') = 'false' then
    raise exception 'O mestre ainda não apresentou este mapa aos jogadores.';
  end if;

  select marker.value into v_marker
  from jsonb_array_elements(coalesce(v_game_state #> array['exploration','maps',p_map_id,'markers'], '[]'::jsonb)) as marker(value)
  where marker.value->>'id' = p_marker_id
  limit 1;
  if v_marker is null then
    raise exception 'Este objeto não está mais disponível no mapa.';
  end if;
  if coalesce(v_marker->>'hiddenFromPlayers','false') = 'true'
    or coalesce(v_marker->>'visibleToPlayers','true') = 'false' then
    raise exception 'Este objeto ainda não foi apresentado aos jogadores.';
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
revoke all on function public.request_map_interaction(uuid, text, text, text) from public, anon;
grant execute on function public.request_map_move(uuid, text, integer, integer) to authenticated;
grant execute on function public.request_map_interaction(uuid, text, text, text) to authenticated;

-- ============================================================================
-- v4.2.0 — Segurança: estado integral privado do mestre e projeção pública.
-- ============================================================================

create table if not exists public.campaign_master_private_state (
  campaign_id uuid primary key references public.campaigns(id) on delete cascade,
  private_game_state jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);
alter table public.campaign_master_private_state enable row level security;
revoke all on public.campaign_master_private_state from public, anon, authenticated;

-- O limite da tabela precisa acompanhar a validação histórica da RPC (até 50.000 XP).
alter table public.campaign_xp_awards drop constraint if exists campaign_xp_awards_xp_check;
alter table public.campaign_xp_awards add constraint campaign_xp_awards_xp_check check (xp between 1 and 50000);

-- Remove chaves de objetos JSONB sem usar o operador jsonb - text[].
-- Além de ser compatível com versões diferentes do PostgreSQL, a função preserva
-- valores que não sejam objetos (por exemplo, estados antigos ou campos legados).
create or replace function public.aethra_jsonb_without_keys(p_value jsonb, p_keys text[])
returns jsonb
language sql
immutable
parallel safe
set search_path = pg_catalog, public, pg_temp
as $$
  select case
    when jsonb_typeof(p_value) = 'object' then
      coalesce(
        (select jsonb_object_agg(e.key, e.value)
         from jsonb_each(p_value) as e(key, value)
         where not (e.key = any(coalesce(p_keys, array[]::text[])))),
        '{}'::jsonb
      )
    else p_value
  end;
$$;
revoke all on function public.aethra_jsonb_without_keys(jsonb, text[]) from public, anon, authenticated;

-- Retira do JSON entregue aos jogadores os campos que são preparação, segredo ou histórico interno.
-- O estado completo permanece na tabela privada e só é devolvido ao mestre pela RPC abaixo.
create or replace function public.aethra_public_game_state(p_state jsonb)
returns jsonb
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  v_state jsonb := coalesce(p_state, '{}'::jsonb);
  v_quests jsonb;
  v_v4 jsonb;
  v_branch jsonb;
  v_options jsonb;
  v_v41 jsonb;
  v_v411 jsonb;
  v_exploration jsonb;
  v_maps jsonb := '{}'::jsonb;
  v_map record;
  v_map_value jsonb;
  v_markers jsonb;
  v_tokens jsonb;
  v_world jsonb;
  v_presented jsonb;
  v_world_history jsonb;
  v_discovered jsonb;
  v_journal jsonb;
begin
  -- Campos históricos genéricos usados para notas e preparações do mestre.
  v_state := public.aethra_jsonb_without_keys(v_state, array['notes','privateNotes','gmNotes','masterNotes','storyFlags','dialogueChoices','masterPrivate']::text[]);

  -- Jogadores recebem somente missões que já saíram da reserva e foram apresentadas/aceitas.
  if jsonb_typeof(v_state->'quests') = 'array' then
    select coalesce(jsonb_agg(public.aethra_jsonb_without_keys(q, array['gmNotes','privateNotes','secret','solution','gmSolution','hiddenObjectives','privateReward']::text[])), '[]'::jsonb)
      into v_quests
    from jsonb_array_elements(v_state->'quests') q
    where lower(coalesce(q->>'status','available')) not in ('available','hidden','draft','secret','unpublished');
    v_state := jsonb_set(v_state, '{quests}', coalesce(v_quests,'[]'::jsonb), true);
  end if;

  -- Relações privadas, preparação da próxima sessão, notas de mestre e escolhas futuras.
  if jsonb_typeof(v_state->'v4') = 'object' then
    v_v4 := public.aethra_jsonb_without_keys(v_state->'v4', array['npcRelations','nextSessionPrep','lastSessionSummary','lootLog','gmNotes','privateNotes','secretNotes']::text[]);
    if jsonb_typeof(v_v4 #> '{storyBranches,active}') = 'object' then
      v_branch := v_v4 #> '{storyBranches,active}';
      if jsonb_typeof(v_branch->'options') = 'array' then
        select coalesce(jsonb_agg(public.aethra_jsonb_without_keys(o, array['consequence','gmNotes','privateNotes','secret','gmOnly']::text[])), '[]'::jsonb)
          into v_options
        from jsonb_array_elements(v_branch->'options') o;
        v_branch := jsonb_set(v_branch, '{options}', coalesce(v_options,'[]'::jsonb), true);
      end if;
      v_branch := public.aethra_jsonb_without_keys(v_branch, array['gmNotes','privateNotes','secret','gmOnly']::text[]);
      v_v4 := jsonb_set(v_v4, '{storyBranches,active}', v_branch, true);
    end if;
    if jsonb_typeof(v_v4->'storyBranches') = 'object' then
      v_v4 := jsonb_set(v_v4, '{storyBranches}', (v_v4->'storyBranches') - 'history', true);
    end if;
    v_state := jsonb_set(v_state, '{v4}', v_v4, true);
  end if;

  -- Snapshots e histórico de desfazer guardam estados integrais antigos e não podem ir ao cliente jogador.
  if jsonb_typeof(v_state->'v41') = 'object' then
    v_v41 := public.aethra_jsonb_without_keys(v_state->'v41', array['snapshots','privateNotes','gmNotes','privateRollResults']::text[]);
    v_state := jsonb_set(v_state, '{v41}', v_v41, true);
  end if;
  if jsonb_typeof(v_state->'v411') = 'object' then
    v_v411 := public.aethra_jsonb_without_keys(v_state->'v411', array['undoHistory','privateNotes','gmNotes']::text[]);
    v_state := jsonb_set(v_state, '{v411}', v_v411, true);
  end if;

  -- Solicitações de rolagem reservadas ao mestre não aparecem para jogadores.
  if jsonb_typeof(v_state->'activeRollPrompt') = 'object'
     and v_state #>> '{activeRollPrompt,visibility}' = 'master' then
    v_state := jsonb_set(v_state, '{activeRollPrompt}', 'null'::jsonb, true);
  end if;

  -- Mapas ocultos são representados somente por seu estado de visibilidade.
  -- Em mapas apresentados, armadilhas/tesouros não descobertos e peças ocultas são filtrados.
  if jsonb_typeof(v_state->'exploration') = 'object' then
    v_exploration := v_state->'exploration';
    if jsonb_typeof(v_exploration->'maps') = 'object' then
      for v_map in select key, value from jsonb_each(v_exploration->'maps') loop
        v_map_value := v_map.value;
        if coalesce(v_map_value->>'playersVisible','true') = 'false' then
          v_map_value := jsonb_build_object('playersVisible', false);
        else
          v_map_value := public.aethra_jsonb_without_keys(v_map_value, array['gmNotes','privateNotes','secretObjects','masterAnnotations']::text[]);
          if jsonb_typeof(v_map_value->'markers') = 'array' then
            select coalesce(jsonb_agg(m), '[]'::jsonb) into v_markers
            from jsonb_array_elements(v_map_value->'markers') m
            where coalesce(m->>'discovered','false') = 'true'
               or coalesce(m->>'visibleToPlayers','false') = 'true'
               or m->>'type' in ('door','altar');
            v_map_value := jsonb_set(v_map_value, '{markers}', coalesce(v_markers,'[]'::jsonb), true);
          end if;
          if jsonb_typeof(v_map_value->'tokens') = 'object' then
            select coalesce(jsonb_object_agg(k, val), '{}'::jsonb) into v_tokens
            from jsonb_each(v_map_value->'tokens') as t(k,val)
            where coalesce(val->>'hidden','false') <> 'true'
              and coalesce(val->>'visibleToPlayers','true') <> 'false';
            v_map_value := jsonb_set(v_map_value, '{tokens}', coalesce(v_tokens,'{}'::jsonb), true);
          end if;
        end if;
        v_maps := jsonb_set(v_maps, array[v_map.key], v_map_value, true);
      end loop;
      v_exploration := jsonb_set(v_exploration, '{maps}', v_maps, true);
    end if;
    v_exploration := public.aethra_jsonb_without_keys(v_exploration, array['gmNotes','privateNotes','secretNotes']::text[]);
    v_state := jsonb_set(v_state, '{exploration}', v_exploration, true);
  end if;

  -- Só locais apresentados são expostos. Pistas e anotações secretas ficam no estado privado.
  if jsonb_typeof(v_state->'worldExploration') = 'object' then
    v_world := public.aethra_jsonb_without_keys(v_state->'worldExploration', array['gmNotes','privateNotes','secretNotes','masterDiscoveryNotes','masterNotes']::text[]);
    v_presented := case when jsonb_typeof(v_world->'presentedPlaces') = 'array' then v_world->'presentedPlaces' else '[]'::jsonb end;
    v_world := jsonb_set(v_world, '{presentedPlaces}', v_presented, true);
    -- Ocultar também IDs e histórico de locais que o mestre retirou da apresentação.
    if jsonb_typeof(v_world->'discovered') = 'object' then
      select coalesce(jsonb_object_agg(k,val), '{}'::jsonb) into v_discovered
      from jsonb_each(v_world->'discovered') as d(k,val)
      where v_presented ? k;
      v_world := jsonb_set(v_world, '{discovered}', coalesce(v_discovered,'{}'::jsonb), true);
    end if;
    if jsonb_typeof(v_world->'history') = 'array' then
      select coalesce(jsonb_agg(h), '[]'::jsonb) into v_world_history
      from jsonb_array_elements(v_world->'history') h
      where coalesce(h->>'placeId','') = '' or v_presented ? (h->>'placeId');
      v_world := jsonb_set(v_world, '{history}', coalesce(v_world_history,'[]'::jsonb), true);
    end if;
    if jsonb_typeof(v_world->'objectStates') = 'object' then
      select coalesce(jsonb_object_agg(
        k,
        case when coalesce(val->>'hiddenFromPlayers','false') = 'true'
          then jsonb_build_object('hiddenFromPlayers', true)
          else public.aethra_jsonb_without_keys(val, array['hiddenFromPlayers','gmNotes','privateNotes','secretContent']::text[])
        end
      ), '{}'::jsonb)
        into v_tokens
      from jsonb_each(v_world->'objectStates') as t(k,val);
      v_world := jsonb_set(v_world, '{objectStates}', coalesce(v_tokens,'{}'::jsonb), true);
    end if;
    v_state := jsonb_set(v_state, '{worldExploration}', v_world, true);
  end if;

  -- Anotações marcadas como privadas nunca entram no histórico público.
  if jsonb_typeof(v_state->'journalEntries') = 'array' then
    select coalesce(jsonb_agg(
      case when j->>'kind' = 'discovery' and j ? 'text'
        then jsonb_set(public.aethra_jsonb_without_keys(j, array['gmNotes','privateNotes','secret','clue','solution']::text[]), '{text}', to_jsonb(split_part(coalesce(j->>'text',''), '. ', 1) || '.'), true)
        else public.aethra_jsonb_without_keys(j, array['gmNotes','privateNotes','secret','clue','solution']::text[])
      end
    ), '[]'::jsonb) into v_journal
    from jsonb_array_elements(v_state->'journalEntries') j
    where coalesce(j->>'visibility','public') <> 'master'
      and coalesce(j->>'private','false') <> 'true'
      and coalesce(j->>'secret','false') <> 'true';
    v_state := jsonb_set(v_state, '{journalEntries}', coalesce(v_journal,'[]'::jsonb), true);
  end if;

  return v_state;
end;
$$;
revoke all on function public.aethra_public_game_state(jsonb) from public, anon, authenticated;

-- Migra o estado integral atual para a tabela privada antes de publicar a projeção sanitizada.
insert into public.campaign_master_private_state(campaign_id, private_game_state, updated_by, updated_at)
select c.id, c.game_state, c.owner_id, now()
from public.campaigns c
on conflict (campaign_id) do nothing;

update public.campaigns c
set game_state = public.aethra_public_game_state(c.game_state)
where c.game_state is distinct from public.aethra_public_game_state(c.game_state);

create or replace function public.get_campaign_game_state(p_campaign_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_state jsonb;
  v_public_state jsonb;
begin
  if auth.uid() is null or not public.is_campaign_member(p_campaign_id) then
    raise exception 'Você não participa desta campanha.';
  end if;
  select c.game_state into v_public_state from public.campaigns c where c.id = p_campaign_id;
  if not found then raise exception 'Campanha não encontrada.'; end if;
  if public.is_campaign_master(p_campaign_id) then
    select p.private_game_state into v_state
    from public.campaign_master_private_state p where p.campaign_id = p_campaign_id;
    return coalesce(v_state, v_public_state, '{}'::jsonb);
  end if;
  return coalesce(v_public_state, '{}'::jsonb);
end;
$$;

-- Mantém o nome da RPC já usada pelo app. O mestre salva o estado integral na tabela privada;
-- campaigns.game_state recebe somente a projeção apropriada aos jogadores.
create or replace function public.update_campaign_state(p_campaign_id uuid, p_game_state jsonb, p_status text default null)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_campaign public.campaigns;
  v_full_state jsonb;
  v_public_state jsonb;
begin
  if auth.uid() is null or not public.is_campaign_master(p_campaign_id) then
    raise exception 'Somente o mestre pode alterar o estado oficial da campanha.';
  end if;
  if p_game_state is null or jsonb_typeof(p_game_state) is distinct from 'object' then
    raise exception 'O estado da campanha precisa ser um objeto válido.';
  end if;
  if octet_length(p_game_state::text) > 1500000 then
    raise exception 'O estado da campanha excede o limite de segurança.';
  end if;
  if p_status is not null and p_status not in ('paused','active','archived') then
    raise exception 'Estado de campanha inválido.';
  end if;
  v_full_state := p_game_state;
  v_public_state := public.aethra_public_game_state(v_full_state);
  insert into public.campaign_master_private_state(campaign_id,private_game_state,updated_by,updated_at)
  values (p_campaign_id,v_full_state,auth.uid(),now())
  on conflict (campaign_id) do update
    set private_game_state=excluded.private_game_state,updated_by=excluded.updated_by,updated_at=now();
  update public.campaigns
  set game_state=v_public_state,status=coalesce(p_status,status)
  where id=p_campaign_id
  returning * into v_campaign;
  if not found then raise exception 'Campanha não encontrada.'; end if;
  return jsonb_build_object('id',v_campaign.id,'status',v_campaign.status,'game_state',v_public_state,'updated_at',v_campaign.updated_at);
end;
$$;

revoke all on function public.get_campaign_game_state(uuid) from public, anon;
revoke all on function public.update_campaign_state(uuid, jsonb, text) from public, anon;
grant execute on function public.get_campaign_game_state(uuid) to authenticated;
grant execute on function public.update_campaign_state(uuid, jsonb, text) to authenticated;


-- XP: mantém a atualização atômica do estado integral privado e publica somente a projeção filtrada.
-- Esta substituição é necessária porque a versão v3.0.3 atualizava campaigns.game_state diretamente.
create or replace function public.award_encounter_xp(
  p_campaign_id uuid,
  p_encounter_id text,
  p_xp integer,
  p_user_ids jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_item jsonb;
  v_user_id uuid;
  v_member public.campaign_members;
  v_character jsonb;
  v_attributes jsonb;
  v_primary text;
  v_xp integer;
  v_level integer;
  v_new_level integer;
  v_levels_gained integer;
  v_con integer;
  v_dex integer;
  v_armor integer;
  v_shield integer;
  v_max_hp integer;
  v_hp integer;
  v_defense integer;
  v_private_state jsonb;
  v_public_state jsonb;
  v_party jsonb;
  v_party_member jsonb;
  v_awards jsonb := '[]'::jsonb;
  v_rows integer;
begin
  if auth.uid() is null or not public.is_campaign_master(p_campaign_id) then
    raise exception 'Somente o mestre desta campanha pode distribuir experiência.';
  end if;
  if p_encounter_id is null or char_length(p_encounter_id) < 1 or char_length(p_encounter_id) > 100 then
    raise exception 'Identificador do encontro inválido.';
  end if;
  if p_xp is null or p_xp < 1 or p_xp > 50000 then
    raise exception 'A recompensa de XP precisa estar entre 1 e 50000.';
  end if;
  if jsonb_typeof(p_user_ids) is distinct from 'array' then
    raise exception 'A lista de participantes precisa ser uma lista válida.';
  end if;
  if jsonb_array_length(p_user_ids) > 20 then
    raise exception 'A lista de participantes ultrapassa o limite permitido.';
  end if;

  select coalesce(p.private_game_state, c.game_state)
  into v_private_state
  from public.campaigns c
  left join public.campaign_master_private_state p on p.campaign_id = c.id
  where c.id = p_campaign_id
  for update of c;
  if not found then raise exception 'Campanha não encontrada.'; end if;
  if v_private_state is null or jsonb_typeof(v_private_state) is distinct from 'object' then
    v_private_state := '{}'::jsonb;
  end if;
  v_party := coalesce(v_private_state->'partyState', '{}'::jsonb);
  if jsonb_typeof(v_party) is distinct from 'object' then v_party := '{}'::jsonb; end if;

  for v_item in select value from jsonb_array_elements(p_user_ids)
  loop
    begin
      v_user_id := (v_item #>> '{}')::uuid;
    exception when others then
      raise exception 'A lista de participantes contém um identificador inválido.';
    end;

    select * into v_member
    from public.campaign_members m
    where m.campaign_id = p_campaign_id and m.user_id = v_user_id and m.role = 'player'
    for update;
    if not found or v_member.character is null then
      continue;
    end if;

    insert into public.campaign_xp_awards(campaign_id, encounter_id, user_id, xp)
    values (p_campaign_id, p_encounter_id, v_user_id, p_xp)
    on conflict (campaign_id, encounter_id, user_id) do nothing;
    get diagnostics v_rows = row_count;
    if v_rows = 0 then
      continue;
    end if;

    v_character := v_member.character;
    v_attributes := coalesce(v_character->'attributes', '{}'::jsonb);
    v_xp := case when coalesce(v_character->>'xp','') ~ '^[0-9]{1,9}$' then (v_character->>'xp')::integer else 0 end + p_xp;
    v_level := case when coalesce(v_character->>'level','') ~ '^[0-9]{1,2}$' then least(50, greatest(1, (v_character->>'level')::integer)) else 1 end;
    v_new_level := v_level;
    while v_new_level < 50 and v_xp >= (v_new_level * 100) loop
      v_new_level := v_new_level + 1;
    end loop;
    v_levels_gained := v_new_level - v_level;

    v_primary := case v_character->>'class'
      when 'Guerreiro' then 'forca' when 'Paladino' then 'forca'
      when 'Patrulheiro' then 'destreza' when 'Assassino' then 'destreza'
      when 'Arcano' then 'inteligencia' when 'Invocador' then 'inteligencia'
      when 'Clérigo' then 'sabedoria' when 'Druida' then 'sabedoria'
      else 'forca' end;

    if coalesce(v_attributes->>v_primary, '') !~ '^[0-9]{1,2}$' then
      v_attributes := jsonb_set(v_attributes, array[v_primary], to_jsonb(1), true);
    end if;
    v_attributes := jsonb_set(
      v_attributes, array[v_primary],
      to_jsonb(least(30, (v_attributes->>v_primary)::integer + v_levels_gained)), true
    );

    v_con := case when coalesce(v_attributes->>'constituicao','') ~ '^-?[0-9]{1,3}$' then (v_attributes->>'constituicao')::integer else 4 end;
    v_dex := case when coalesce(v_attributes->>'destreza','') ~ '^-?[0-9]{1,3}$' then (v_attributes->>'destreza')::integer else 4 end;
    v_armor := (case when coalesce(v_character #>> '{equipment,armor,defense}','') ~ '^[0-9]{1,3}$' then (v_character #>> '{equipment,armor,defense}')::integer else 0 end) + case coalesce(v_character #>> '{equipment,armor,rarity}','Comum') when 'Incomum' then 3 when 'Raro' then 10 when 'Épico' then 25 when 'Lendário' then 100 when 'Mítico' then 150 else 1 end;
    v_shield := (case when coalesce(v_character #>> '{equipment,shield,defense}','') ~ '^[0-9]{1,3}$' then (v_character #>> '{equipment,shield,defense}')::integer else 0 end) + case coalesce(v_character #>> '{equipment,shield,rarity}','Comum') when 'Incomum' then 3 when 'Raro' then 10 when 'Épico' then 25 when 'Lendário' then 100 when 'Mítico' then 150 else 1 end;
    v_max_hp := case when coalesce(v_character->>'maxHp','') ~ '^[0-9]{1,5}$' then (v_character->>'maxHp')::integer else 20 + v_con * 2 end;
    v_max_hp := v_max_hp + (v_levels_gained * 10);
    v_defense := 10 + floor((v_dex - 4)::numeric / 2)::integer + v_armor + v_shield;

    v_party_member := coalesce(v_party->v_user_id::text, '{}'::jsonb);
    v_hp := case
      when coalesce(v_party_member->>'hp','') ~ '^[0-9]{1,5}$' then (v_party_member->>'hp')::integer
      when coalesce(v_character->>'hp','') ~ '^[0-9]{1,5}$' then (v_character->>'hp')::integer
      else v_max_hp - (v_levels_gained * 10)
    end;
    v_hp := least(v_max_hp, greatest(0, v_hp + (v_levels_gained * 10)));

    v_character := jsonb_set(v_character, '{attributes}', v_attributes, true);
    v_character := jsonb_set(v_character, '{xp}', to_jsonb(v_xp), true);
    v_character := jsonb_set(v_character, '{level}', to_jsonb(v_new_level), true);
    v_character := jsonb_set(v_character, '{maxHp}', to_jsonb(v_max_hp), true);
    v_character := jsonb_set(v_character, '{hp}', to_jsonb(v_hp), true);
    v_character := jsonb_set(v_character, '{defense}', to_jsonb(v_defense), true);
    update public.campaign_members set character = v_character where id = v_member.id;

    v_party_member := v_party_member || jsonb_build_object('hp', v_hp, 'maxHp', v_max_hp, 'defense', v_defense);
    v_party := jsonb_set(v_party, array[v_user_id::text], v_party_member, true);

    v_awards := v_awards || jsonb_build_array(jsonb_build_object(
      'user_id', v_user_id, 'name', coalesce(v_character->>'name', v_member.display_name),
      'xp', p_xp, 'levels_gained', v_levels_gained, 'level', v_new_level
    ));
  end loop;

  v_private_state := jsonb_set(v_private_state, '{partyState}', v_party, true);
  insert into public.campaign_master_private_state(campaign_id, private_game_state, updated_by, updated_at)
  values (p_campaign_id, v_private_state, auth.uid(), now())
  on conflict (campaign_id) do update
    set private_game_state = excluded.private_game_state,
        updated_by = excluded.updated_by,
        updated_at = now();
  v_public_state := public.aethra_public_game_state(v_private_state);
  update public.campaigns set game_state = v_public_state where id = p_campaign_id;

  return jsonb_build_object('awards', v_awards, 'encounter_id', p_encounter_id);
end;
$$;
revoke all on function public.award_encounter_xp(uuid, text, integer, jsonb) from public, anon;
grant execute on function public.award_encounter_xp(uuid, text, integer, jsonb) to authenticated;

-- Descobertas criadas por versões anteriores gravavam a pista completa em eventos/diário públicos.
-- Preserva o texto integral no estado privado já copiado e marca os eventos antigos como privados.
update public.campaign_events
set payload = coalesce(payload, '{}'::jsonb) || jsonb_build_object('visibility','master','private',true)
where event_type = 'session_note'
  and payload->>'kind' = 'discovery'
  ;

-- A lista de eventos também é filtrada por papel; eventos explicitamente privados não são lidos por jogadores.
drop policy if exists "Campaign members can read events" on public.campaign_events;
create policy "Campaign members can read public events and masters can read all"
on public.campaign_events for select to authenticated
using (
  public.is_campaign_member(campaign_id)
  and (
    public.is_campaign_master(campaign_id)
    or (
      coalesce(payload->>'visibility','public') <> 'master'
      and coalesce(payload->>'private','false') <> 'true'
      and coalesce(payload->>'secret','false') <> 'true'
      and event_type not in ('master_note','private_roll_result','gm_secret')
    )
  )
);

-- Música: ficheiros não secretos da playlist num bucket público; só o mestre da campanha pode gerir ficheiros.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values (
  'aethra-campaign-audio','aethra-campaign-audio',true,26214400,
  array['audio/mpeg','audio/mp3','audio/ogg','audio/wav','audio/x-wav','audio/mp4','audio/aac','audio/webm','audio/flac','audio/opus','audio/x-m4a']
)
on conflict (id) do update set
  public=true,
  file_size_limit=26214400,
  allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "Aethra campaign music is publicly readable" on storage.objects;
create policy "Aethra campaign music is publicly readable"
on storage.objects for select to public
using (bucket_id='aethra-campaign-audio');

drop policy if exists "Aethra masters upload campaign music" on storage.objects;
create policy "Aethra masters upload campaign music"
on storage.objects for insert to authenticated
with check (
  bucket_id='aethra-campaign-audio'
  and case when (storage.foldername(name))[1] ~* '^[0-9a-f-]{36}$'
    then public.is_campaign_master(((storage.foldername(name))[1])::uuid)
    else false end
);

drop policy if exists "Aethra masters update campaign music" on storage.objects;
create policy "Aethra masters update campaign music"
on storage.objects for update to authenticated
using (
  bucket_id='aethra-campaign-audio'
  and case when (storage.foldername(name))[1] ~* '^[0-9a-f-]{36}$'
    then public.is_campaign_master(((storage.foldername(name))[1])::uuid)
    else false end
)
with check (
  bucket_id='aethra-campaign-audio'
  and case when (storage.foldername(name))[1] ~* '^[0-9a-f-]{36}$'
    then public.is_campaign_master(((storage.foldername(name))[1])::uuid)
    else false end
);

drop policy if exists "Aethra masters delete campaign music" on storage.objects;
create policy "Aethra masters delete campaign music"
on storage.objects for delete to authenticated
using (
  bucket_id='aethra-campaign-audio'
  and case when (storage.foldername(name))[1] ~* '^[0-9a-f-]{36}$'
    then public.is_campaign_master(((storage.foldername(name))[1])::uuid)
    else false end
);

-- Observações de segurança:
-- 1) players recebem game_state filtrado; o estado integral é entregue apenas ao mestre via RPC.
-- 2) catálogos estáticos ainda existentes nos ficheiros JS/assets públicos não são segredos: ficheiros baixados pelo navegador podem ser inspecionados.
-- 3) bucket de áudio é público para permitir reprodução entre dispositivos; qualquer pessoa com o URL direto pode ouvir o ficheiro.
-- 4) para retirar segredos de catálogos embarcados no app, esses catálogos precisam ser migrados para dados privados do servidor numa etapa posterior.
