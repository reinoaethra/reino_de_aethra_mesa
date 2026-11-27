const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const sql = fs.readFileSync(path.join(root, 'supabase-migration-v4.2.1.sql'), 'utf8');

assert(html.includes('v4.2.3'), 'HTML version is v4.2.1');
assert(html.includes('app.js?v=4.2.3') && html.includes('styles.css?v=4.2.3'), 'cache keys updated');
assert(app.includes("createEvent('v41_ready_request',{ready:next})"), 'player readiness sends its dedicated request event');
assert(app.includes("ev.event_type==='v41_ready_request'&&isMasterController()"), 'master processes readiness request');
assert(app.includes("createEvent('v41_map_ping_request',payload)"), 'map attention requests use the dedicated event');
assert(app.includes("createEvent('v4_branch_choice_request',{branch_id:branch.id,option_id:option.id"), 'story voting still uses the branch vote event');

for (const event of ['v41_ready_request', 'v41_map_ping_request', 'v4_branch_choice_request']) {
  assert(sql.includes(`'${event}'`), `${event} is permitted in the SQL migration`);
}
assert(sql.includes("v_payload->>'request_type' is distinct from 'session_ready'"), 'legacy readiness envelope is separated from story voting');
assert(sql.includes("jsonb_typeof(v_payload->'ready') is distinct from 'boolean'"), 'readiness payload is type-checked');
assert(sql.includes("v_actor_character is null"), 'players need a character before confirming ready');
assert(sql.includes("v_campaign_status = 'active'"), 'readiness is rejected after the session starts');
assert(sql.includes("v_branch->>'id' is distinct from v_payload->>'branch_id'"), 'story vote must target the active branch');
assert(sql.includes('Você já registrou um voto nesta decisão.'), 'duplicate narrative votes are rejected');
assert(sql.includes("v_map_record->'playersVisible' = 'false'::jsonb"), 'map attention requests require a map shown to players');
assert(sql.includes('Aguarde um instante antes de enviar outra ação.'), 'existing player event throttle is preserved');
assert(sql.includes("p_event_type = 'combat_action_request'"), 'combat action validation remains present');
assert(sql.includes("p_event_type = 'roll_request'"), 'D20 request validation remains present');
assert(sql.includes("'narration'"), 'master-only event allowlist remains present');
assert(sql.includes("revoke all on function public.submit_campaign_event(uuid, text, jsonb) from public, anon"), 'function execute permissions remain restricted');

console.log('Reino de Aethra v4.2.1: eventos de prontidão, votação e mapa validados; proteções de rolagem, combate e permissões preservadas.');
