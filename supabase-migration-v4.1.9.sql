-- REINO DE AETHRA v4.1.9
-- Corrige os eventos enviados por jogadores na sala de preparação, nas votações
-- narrativas e nas marcações de atenção do mapa tático.
-- Base: submit_campaign_event do supabase-schema.sql v3.0.3 fornecido pelo projeto.
-- Execute UMA vez no SQL Editor do Supabase antes de publicar/usar o app v4.1.9.
-- Não cria tabelas nem altera dados existentes.

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
      'v41_ready_request', 'v41_map_ping_request', 'v4_branch_choice_request'
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
