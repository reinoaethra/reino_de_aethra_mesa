-- REINO DE AETHRA v4.2.8
-- Execute uma única vez no SQL Editor do Supabase, depois das migrações v4.2.0,
-- v4.2.1 corrigida e v4.2.5 (se estiver usando os recursos correspondentes).
-- Mantém os dados de campanha. Atualiza a permissão do Ritual do Clérigo em eventos
-- e cria o RPC seguro para solicitações públicas de comércio e forja.

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
      'v41_ready_request', 'v41_map_ping_request', 'v4_branch_choice_request', 'world_interaction_request', 'class_skill_ritual_request'
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
    if v_action not in ('attack', 'ability', 'item', 'class_skill') then
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
      'skill_id', left(coalesce(v_payload->>'skill_id', ''), 64),
      'ally_target_id', case when coalesce(v_payload->>'ally_target_id','') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then v_payload->>'ally_target_id' else '' end,
      'target_id', left(coalesce(v_payload->>'target_id', ''), 80),
      'item_id', left(coalesce(v_payload->>'item_id', ''), 64),
      'round', v_round,
      'turn_index', v_turn_index,
      'player_name', v_actor_name
    );
  end if;

  -- RITUAL DE RESSURREIÇÃO: somente um Clérigo com a habilidade aprendida
  -- pode solicitar o ritual para um jogador da mesma companhia. O mestre valida
  -- novamente o estado, o inventário e o custo antes de efetivar o retorno.
  if v_role = 'player' and p_event_type = 'class_skill_ritual_request' then
    if v_actor_character is null
      or v_actor_character->>'class' is distinct from 'Clérigo'
      or coalesce(v_actor_character->>'level','0') !~ '^[0-9]{1,2}$'
      or (v_actor_character->>'level')::integer < 28
      or coalesce(v_payload->>'skill_id','') is distinct from 'ritual-ressurreicao'
      or coalesce(v_actor_character #>> '{skillTree,version}','0') <> '2'
      or coalesce(v_actor_character #>> '{skillTree,ranks,ritual-ressurreicao}','0') !~ '^[1-3]$' then
      raise exception 'O personagem não possui o Ritual de Ressurreição habilitado.';
    end if;
    if coalesce(v_payload->>'target_user_id','') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
      raise exception 'Aventureiro alvo inválido.';
    end if;
    if not exists (
      select 1 from public.campaign_members m
      where m.campaign_id = p_campaign_id
        and m.user_id = (v_payload->>'target_user_id')::uuid
        and m.role = 'player'
        and m.character is not null
    ) then
      raise exception 'O alvo não pertence à companhia ou não possui personagem.';
    end if;
    select c.game_state into v_game_state
    from public.campaigns c
    where c.id = p_campaign_id
    for update;
    if coalesce(v_game_state #>> array['partyState',auth.uid()::text,'hp'], v_actor_character->>'hp', '1') !~ '^[0-9]+$'
      or coalesce(v_game_state #>> array['partyState',auth.uid()::text,'hp'], v_actor_character->>'hp', '1')::integer <= 0
      or coalesce(v_game_state #>> array['partyState',auth.uid()::text,'deathStatus'], 'alive') in ('downed','stable','dead') then
      raise exception 'O Clérigo precisa estar consciente para conduzir o Ritual de Ressurreição.';
    end if;
    if coalesce(v_game_state #>> array['partyState',v_payload->>'target_user_id','deathStatus'], 'alive') <> 'dead' then
      raise exception 'O aventureiro selecionado não está marcado como morto.';
    end if;
    perform pg_advisory_xact_lock(hashtextextended(concat_ws(':','aethra-resurrection',p_campaign_id::text,auth.uid()::text),0));
    if exists (
      select 1 from public.campaign_events e
      where e.campaign_id = p_campaign_id
        and e.actor_id = auth.uid()
        and e.event_type = 'class_skill_ritual_request'
        and not exists (
          select 1 from public.campaign_events r
          where r.campaign_id = e.campaign_id
            and r.event_type = 'session_note'
            and r.payload->>'kind' = 'resurrection'
            and r.payload->>'request_id' = e.id::text
        )
    ) then
      raise exception 'Você já possui um Ritual aguardando resolução.';
    end if;
    v_payload := jsonb_build_object(
      'skill_id', 'ritual-ressurreicao',
      'target_user_id', v_payload->>'target_user_id',
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

-- ============================================================================
-- v4.2.8 — Pedidos de comércio e forja compartilhados com aprovação do mestre.
-- O RPC não modifica ouro, mochila ou equipamento: apenas cria uma solicitação
-- imutável. A aplicação do efeito só acontece após a aprovação do mestre.
-- ============================================================================
create or replace function public.submit_marketplace_request(
  p_campaign_id uuid,
  p_service text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_role text;
  v_display_name text;
  v_character jsonb;
  v_game_state jsonb;
  v_event public.campaign_events;
  v_open_path text;
  v_action text;
  v_item_id text;
  v_slot text;
  v_enchantment text;
  v_event_type text;
begin
  if auth.uid() is null then
    raise exception 'Entre na sua conta antes de solicitar este serviço.';
  end if;
  if p_service is null or p_service not in ('shop','forge') then
    raise exception 'Serviço inválido.';
  end if;

  select m.role, m.display_name, m.character
    into v_role, v_display_name, v_character
  from public.campaign_members m
  where m.campaign_id = p_campaign_id and m.user_id = auth.uid();
  if v_role is distinct from 'player' then
    raise exception 'Somente jogadores participantes podem solicitar comércio ou forja.';
  end if;
  if v_character is null or jsonb_typeof(v_character) is distinct from 'object' then
    raise exception 'Crie seu personagem antes de solicitar este serviço.';
  end if;

  select c.game_state into v_game_state
  from public.campaigns c
  where c.id = p_campaign_id
  for update;
  if not found then raise exception 'Campanha não encontrada.'; end if;

  v_open_path := case when p_service = 'shop' then 'shopOpen' else 'forgeOpen' end;
  if coalesce(v_game_state #>> array['v4','marketplace',v_open_path], 'false') not in ('true','t','1') then
    raise exception 'O mestre ainda não abriu este serviço para a companhia.';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(concat_ws(':','aethra-marketplace',p_campaign_id::text,auth.uid()::text),0));
  if exists (
    select 1 from public.campaign_events e
    where e.campaign_id = p_campaign_id
      and e.actor_id = auth.uid()
      and e.event_type in ('trade_request','forge_request')
      and not exists (
        select 1 from public.campaign_events r
        where r.campaign_id = e.campaign_id
          and r.event_type = 'session_note'
          and r.payload->>'kind' in ('trade-request','forge-request')
          and r.payload->>'request_id' = e.id::text
      )
  ) then
    raise exception 'Você já possui um pedido aguardando o mestre. Aguarde a resolução antes de enviar outro.';
  end if;

  v_action := coalesce(p_payload->>'action','');
  v_item_id := coalesce(p_payload->>'item_id','');
  v_slot := coalesce(p_payload->>'slot','');
  v_enchantment := coalesce(p_payload->>'enchantment','');
  if v_item_id !~ '^[[:alnum:]][[:alnum:]_-]{0,79}$' then
    raise exception 'Identificador de item inválido.';
  end if;

  if p_service = 'shop' then
    if v_action not in ('buy','sell') then
      raise exception 'Ação de comércio inválida.';
    end if;
    -- Quantidade fixa em uma unidade nesta edição; o mestre revalida preço,
    -- classe, nível, inventário e ouro antes de aprovar.
    v_event_type := 'trade_request';
    insert into public.campaign_events(campaign_id, actor_id, event_type, payload)
    values (
      p_campaign_id, auth.uid(), v_event_type,
      jsonb_build_object(
        'action', v_action,
        'item_id', v_item_id,
        'quantity', 1,
        'player_name', left(coalesce(v_display_name,'Aventureiro'),80),
        'character_name', left(coalesce(v_character->>'name','Aventureiro'),80)
      )
    ) returning * into v_event;
  else
    if v_action not in ('upgrade','enchant') or v_slot not in ('weapon','armor','shield') then
      raise exception 'Pedido de forja inválido.';
    end if;
    if v_action = 'enchant' then
      if v_enchantment not in ('Precisão','Chama','Guardião')
        or (v_enchantment in ('Precisão','Chama') and v_slot <> 'weapon')
        or (v_enchantment = 'Guardião' and v_slot = 'weapon') then
        raise exception 'Encantamento incompatível com o equipamento.';
      end if;
    else
      v_enchantment := '';
    end if;
    v_event_type := 'forge_request';
    insert into public.campaign_events(campaign_id, actor_id, event_type, payload)
    values (
      p_campaign_id, auth.uid(), v_event_type,
      jsonb_build_object(
        'action', v_action,
        'slot', v_slot,
        'enchantment', v_enchantment,
        'item_id', v_item_id,
        'player_name', left(coalesce(v_display_name,'Aventureiro'),80),
        'character_name', left(coalesce(v_character->>'name','Aventureiro'),80)
      )
    ) returning * into v_event;
  end if;
  return to_jsonb(v_event);
end;
$$;

revoke all on function public.submit_marketplace_request(uuid,text,jsonb) from public, anon;
grant execute on function public.submit_marketplace_request(uuid,text,jsonb) to authenticated;

comment on function public.submit_marketplace_request(uuid,text,jsonb) is
  'Registra um pedido público de compra/venda ou serviço da forja. Não altera inventário; apenas o mestre aprova a fila.';
