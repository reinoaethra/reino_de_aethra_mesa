-- Reino de Aethra v2.2: progressão até o nível 50 e HP/atributos por nível.
-- Execute uma única vez no SQL Editor do Supabase após publicar os arquivos v2.2.
-- A tabela campaign_xp_awards e os registros existentes são preservados.

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
  if p_xp is null or p_xp < 1 or p_xp > 50000 then
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

    -- HP atual é preservado. Cada nível recupera somente os +10 HP concedidos,
    -- sem restaurar toda a vida do personagem ao fim de qualquer encontro.
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

  update public.campaigns
  set game_state = jsonb_set(coalesce(game_state, '{}'::jsonb), '{partyState}', v_party, true)
  where id = p_campaign_id;

  return jsonb_build_object('awards', v_awards, 'encounter_id', p_encounter_id);
end;
$$;


revoke all on function public.award_encounter_xp(uuid, text, integer, jsonb) from public, anon;
grant execute on function public.award_encounter_xp(uuid, text, integer, jsonb) to authenticated;
