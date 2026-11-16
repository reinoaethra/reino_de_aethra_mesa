-- Reino de Aethra v0.3: execute após o schema v0.2 já instalado.
-- Atualiza a função de eventos para validar rolagens direcionadas, ataques e chat.

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
    if p_event_type not in ('roll_request', 'damage_request', 'chat_message') then
      raise exception 'Jogadores não podem publicar este tipo de evento.';
    end if;
  else
    if p_event_type not in (
      'dice_prompt', 'dice_result', 'damage_applied', 'damage_rejected',
      'narration', 'encounter_started', 'encounter_ended',
      'session_note', 'turn_changed', 'player_notification', 'chat_message'
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

-- O campo de solicitação ativa fica disponível no estado das campanhas já existentes.
alter table public.campaigns alter column game_state set default '{"chapter":"Prólogo — A Guerra da Ruptura Celestial","location":"A estrada esquecida de Eldoria","narration":"A primeira crônica de Aethra está prestes a começar.","encounter":null,"started":false,"turn":1,"notes":[],"activeRollPrompt":null}'::jsonb;

update public.campaigns
set game_state = game_state || '{"activeRollPrompt":null}'::jsonb
where not (game_state ? 'activeRollPrompt');

-- CREATE OR REPLACE preserva os grants existentes da função v0.2.
