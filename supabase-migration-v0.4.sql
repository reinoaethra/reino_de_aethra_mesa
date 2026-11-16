-- REINO DE AETHRA v0.4 — migração do banco v0.3 para v0.4
-- Execute este arquivo UMA vez no SQL Editor do Supabase se o banco já estiver na v0.3.
-- Não apaga campanhas, personagens nem histórico. Acrescenta recompensas de XP e regras de combate.
-- Faça backup antes de qualquer atualização importante.

create table if not exists public.campaign_xp_awards (
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  encounter_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  xp integer not null check (xp between 1 and 5000),
  created_at timestamptz not null default now(),
  primary key (campaign_id, encounter_id, user_id)
);

create or replace function public.award_encounter_xp(
  p_campaign_id uuid,
  p_encounter_id text,
  p_xp integer,
  p_user_ids jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
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
  if p_xp is null or p_xp < 1 or p_xp > 5000 then
    raise exception 'A recompensa de XP precisa estar entre 1 e 5000.';
  end if;
  if jsonb_typeof(p_user_ids) is distinct from 'array' then
    raise exception 'A lista de participantes precisa ser uma lista válida.';
  end if;
  if jsonb_array_length(p_user_ids) > 20 then
    raise exception 'A lista de participantes ultrapassa o limite permitido.';
  end if;

  select coalesce(c.game_state->'partyState', '{}'::jsonb)
  into v_party
  from public.campaigns c where c.id = p_campaign_id for update;
  if v_party is null or jsonb_typeof(v_party) is distinct from 'object' then v_party := '{}'::jsonb; end if;

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
    -- Limite defensivo: um valor adulterado nunca pode produzir níveis negativos ou acima do teto.
    v_level := case when coalesce(v_character->>'level','') ~ '^[0-9]{1,2}$' then least(20, greatest(1, (v_character->>'level')::integer)) else 1 end;
    v_new_level := v_level;
    while v_new_level < 20 and v_xp >= (v_new_level * 100) loop
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
      to_jsonb(least(12, (v_attributes->>v_primary)::integer + v_levels_gained)), true
    );

    v_con := case when coalesce(v_attributes->>'constituicao','') ~ '^-?[0-9]{1,3}$' then (v_attributes->>'constituicao')::integer else 4 end;
    v_dex := case when coalesce(v_attributes->>'destreza','') ~ '^-?[0-9]{1,3}$' then (v_attributes->>'destreza')::integer else 4 end;
    v_armor := case when coalesce(v_character #>> '{equipment,armor,defense}','') ~ '^[0-9]{1,3}$' then (v_character #>> '{equipment,armor,defense}')::integer else 0 end;
    v_shield := case when coalesce(v_character #>> '{equipment,shield,defense}','') ~ '^[0-9]{1,3}$' then (v_character #>> '{equipment,shield,defense}')::integer else 0 end;
    v_max_hp := case when coalesce(v_character->>'maxHp','') ~ '^[0-9]{1,5}$' then (v_character->>'maxHp')::integer else 20 + v_con * 2 end;
    v_max_hp := v_max_hp + (v_levels_gained * 5);
    v_defense := 10 + floor((v_dex - 4)::numeric / 2)::integer + v_armor + v_shield;

    -- HP atual é preservado. Cada nível recupera somente os +5 HP concedidos,
    -- sem restaurar toda a vida do personagem ao fim de qualquer encontro.
    v_party_member := coalesce(v_party->v_user_id::text, '{}'::jsonb);
    v_hp := case
      when coalesce(v_party_member->>'hp','') ~ '^[0-9]{1,5}$' then (v_party_member->>'hp')::integer
      when coalesce(v_character->>'hp','') ~ '^[0-9]{1,5}$' then (v_character->>'hp')::integer
      else v_max_hp - (v_levels_gained * 5)
    end;
    v_hp := least(v_max_hp, greatest(0, v_hp + (v_levels_gained * 5)));

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

  update public.campaigns
  set game_state = jsonb_set(coalesce(game_state, '{}'::jsonb), '{partyState}', v_party, true)
  where id = p_campaign_id;

  return jsonb_build_object('awards', v_awards, 'encounter_id', p_encounter_id);
end;
$$;

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
begin
  if auth.uid() is null then
    raise exception 'É necessário estar autenticado para enviar um evento.';
  end if;

  select m.role, m.display_name into v_role, v_actor_name
  from public.campaign_members m
  where m.campaign_id = p_campaign_id and m.user_id = auth.uid();

  if v_role is null then
    raise exception 'Você não participa desta campanha.';
  end if;

  if p_event_type is null or char_length(p_event_type) < 1 or char_length(p_event_type) > 60 then
    raise exception 'Tipo de evento inválido.';
  end if;

  if v_role = 'player' then
    if p_event_type not in ('roll_request', 'damage_request', 'combat_action_request', 'chat_message') then
      raise exception 'Jogadores não podem publicar este tipo de evento.';
    end if;
  else
    if p_event_type not in (
      'dice_prompt', 'dice_result', 'damage_applied', 'damage_rejected',
      'narration', 'encounter_started', 'encounter_ended',
      'session_note', 'turn_changed', 'turn_advanced', 'player_notification', 'combat_action_result', 'monster_attack_result', 'combat_action_rejected', 'encounter_defeated', 'chat_message'
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
    -- Serializa respostas simultâneas do mesmo jogador ao mesmo pedido de D20.
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
  -- O resultado (dado, acerto e dano) é calculado pelo mestre e publicado separadamente.
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
    -- Serializa cliques duplicados no mesmo turno, mesmo que cheguem quase juntos.
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

alter table public.campaign_xp_awards enable row level security;
revoke all on public.campaign_xp_awards from anon, authenticated;
revoke all on function public.award_encounter_xp(uuid, text, integer, jsonb) from public, anon;
revoke all on function public.submit_campaign_event(uuid, text, jsonb) from public, anon;
grant execute on function public.award_encounter_xp(uuid, text, integer, jsonb) to authenticated;
grant execute on function public.submit_campaign_event(uuid, text, jsonb) to authenticated;

-- A migração termina sem alterar dados existentes. Atualize o site para a versão 0.4 após executar.
