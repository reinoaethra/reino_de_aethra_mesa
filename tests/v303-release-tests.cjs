const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const schema = fs.readFileSync(path.join(root, 'supabase-schema.sql'), 'utf8');
const migration = fs.readFileSync(path.join(root, 'supabase-migration-v3.0.3.sql'), 'utf8');
const mapDataSource = fs.readFileSync(path.join(root, 'assets/maps/maps-data.js'), 'utf8');

// A biblioteca oficial é única e aponta para os onze novos fundos do projeto exportado pelo mestre.
const vm = require('node:vm');
const context = { window: {} };
vm.runInNewContext(mapDataSource, context, { timeout: 1000 });
const maps = context.window.AETHRA_MAP_LIBRARY;
assert.equal(maps.length, 11);
assert.equal(context.window.AETHRA_MAP_LIBRARY_VERSION, '2026-11-18T23:08:37.685Z');
assert(html.includes('assets/maps/maps-data.js?v=3.0.3'));
assert(html.includes('app.js?v=3.0.3'));
assert(html.includes('styles.css?v=3.0.3'));
assert(app.includes('new URL(template.image.src,document.baseURI)'));
assert(app.includes('background-image:url(\\"${mapImageUrl}\\")'));
assert(app.includes('function mapTemplate(id){const found=MAP_TEMPLATES.find(m=>m.id===id);if(found)return found;throw new Error'));
assert(!app.includes('const MAP_BOARD_FEATURES ='));
for (const map of maps) {
  assert.equal(map.layout.length, 8, map.id);
  assert(map.layout.every(row => row.length === 10), map.id + ' is 10x8');
  const image = path.join(root, map.image.src);
  assert(fs.existsSync(image), map.id + ' image exists');
  assert(fs.statSync(image).size > 10000, map.id + ' image is not empty');
  assert(map.features.entry && map.features.exit, map.id + ' has routes');
  assert(Array.isArray(map.features.doors) && Array.isArray(map.features.points), map.id + ' includes POIs/doors');
}
// No older background assets remain under the old map folder: app.js reads only maps-v3 assets.
assert(!fs.readdirSync(path.join(root, 'assets/maps')).some(f => f.endsWith('.webp')));
assert(css.includes('background: rgba(2, 5, 8, .70)'));
assert(css.includes('.map-board.map-board-image .map-cell.tile-floor'));
assert(css.includes('.map-board.map-board-image .map-cell.tile-door'));
assert(css.includes('background-image: none !important'));

// Cada forma de criatura tem arquivo individual de miniatura, inclusive chefes.
const start = app.indexOf('  function mapMonsterSprite(');
const end = app.indexOf('  function equipmentPropSvg', start);
assert(start >= 0 && end > start);
const forms = [...app.slice(start, end).matchAll(/^\s*'([^']+)'\s*:/gm)].map(m => m[1]);
assert.equal(forms.length, 32, '32 unique monster/boss silhouettes are catalogued');
const slug = id => id.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9-]/g, '');
const pngIds = new Set(['lobo-cinzento','espectro-ruptura','campeao-orc','drakthar','aranha-umbrafunda','cultista-cinzento','golem-basalto','sereia-abissal','cavaleiro-solar']);
for (const id of forms) {
  if (id === 'goblin-cinzas') {
    assert(fs.existsSync(path.join(root, 'assets/minis/monster-goblin.png')));
    continue;
  }
  const ext = pngIds.has(id) ? 'png' : 'svg';
  const file = path.join(root, 'assets/minis/monsters', `monster-${slug(id)}.${ext}`);
  assert(fs.existsSync(file), `miniature asset exists for ${id}`);
  assert(fs.statSync(file).size > 500, `miniature asset is not empty for ${id}`);
}
assert(app.includes('function mapMonsterMiniature(token)'));
assert(app.includes("rasterIds.has(id)?'png':'svg'"));
assert(app.includes('monster-miniature-image'));

// Client actions and server-side procedures are both present. Authorization is checked inside SECURITY DEFINER functions.
for (const action of ['delete-campaign', 'leave-campaign', 'remove-participant']) assert(app.includes(`action==='${action}'`), action);
for (const helper of ['deleteCampaignById', 'removeCampaignParticipant', 'leaveCurrentCampaign', 'canDeleteCurrentCampaign']) assert(app.includes(`function ${helper}`) || app.includes(`async function ${helper}`), helper);
for (const fn of ['delete_campaign', 'remove_campaign_member', 'leave_campaign', 'join_campaign']) {
  assert(migration.includes(`create or replace function public.${fn}`), `${fn} migration exists`);
  assert(schema.includes(`create or replace function public.${fn}`), `${fn} schema exists`);
  const chunk = migration.slice(migration.indexOf(`create or replace function public.${fn}`), migration.indexOf('$$;', migration.indexOf(`create or replace function public.${fn}`)) + 3);
  assert(chunk.includes('security definer'));
}
assert(migration.includes("v_owner_id <> auth.uid() or not public.is_campaign_master(p_campaign_id)"));
assert(migration.includes("v_target_role <> 'player'"));
assert(migration.includes("v_role <> 'player'"));
assert(migration.includes("'member_removed'"));
assert(migration.includes("'member_left'"));
assert(migration.includes("jsonb_build_object('user_id', p_user_id, 'display_name', v_target_name, 'character', v_target_character)"));
assert(migration.includes("e.event_type in ('member_left','member_removed')"));
assert(migration.includes('character = coalesce(existing_member.character, excluded.character)'));
assert(app.includes("ev.event_type==='member_removed'&&ev.payload?.user_id===currentUserId()"));
assert(app.includes('O mestre removeu você da campanha.'));


// Exercita os três fluxos de gestão com um adaptador Supabase simulado.
async function runCampaignAction(actionName, state, isMasterValue, isControllerValue) {
  const a = app.indexOf('  function canDeleteCurrentCampaign()');
  const b = app.indexOf('  function pendingDamageFrom(', a);
  const calls = [];
  const ctx = {
    state,
    isMaster: () => isMasterValue,
    isMasterController: () => isControllerValue,
    window: { confirm: () => true },
    clearActiveCampaignId: () => {},
    closeModal: () => {},
    render: () => {},
    toast: () => {},
    loadCloudCampaigns: async () => {},
    refreshCloudCampaign: async () => {},
    writeLocalCampaigns: () => {},
    localCampaignById: id => state.localCampaigns?.find(c => c.id === id),
    currentUserId: () => state.user?.id || 'local-user',
    calls
  };
  state.backend = state.backend || { rpc: async (name, args) => { calls.push({ name, args }); return { error: null }; }, removeChannel: () => {} };
  vm.runInNewContext(app.slice(a, b) + `\nthis.${actionName}=${actionName};`, ctx, { timeout: 1000 });
  return { ctx, calls, fn: ctx[actionName] };
}
(async () => {
  const masterState = { backendReady: true, user: { id: 'master-1' }, campaign: null, channel: null, view: 'campaigns', cloudCampaigns: [{ id: 'camp-1', owner_id: 'master-1', name: 'Crônica' }] };
  const del = await runCampaignAction('deleteCampaignById', masterState, true, true);
  await del.fn('camp-1');
  assert.equal(del.calls[0]?.name, 'delete_campaign', 'only the campaign creator invokes server-side deletion');

  const participantState = { backendReady: true, user: { id: 'master-1' }, campaign: { id: 'camp-1', name: 'Crônica' }, channel: null, view: 'lobby', members: [{ user_id: 'player-1', role: 'player', display_name: 'Aventureiro' }] };
  const remove = await runCampaignAction('removeCampaignParticipant', participantState, true, true);
  await remove.fn('player-1');
  assert.equal(remove.calls[0]?.name, 'remove_campaign_member');
  assert.equal(remove.calls[0]?.args.p_user_id, 'player-1');

  const playerState = { backendReady: true, user: { id: 'player-1' }, campaign: { id: 'camp-1', name: 'Crônica' }, member: { user_id: 'player-1', role: 'player' }, channel: null, channelPresence: [], view: 'session', events: [], members: [] };
  const leave = await runCampaignAction('leaveCurrentCampaign', playerState, false, false);
  await leave.fn();
  assert.equal(leave.calls[0]?.name, 'leave_campaign');
  assert.equal(playerState.campaign, null, 'a player who leaves clears their local campaign session');

  const playerCannotDelete = { backendReady: true, user: { id: 'player-1' }, campaign: null, cloudCampaigns: [{ id: 'camp-1', owner_id: 'master-1', name: 'Crônica' }] };
  const denied = await runCampaignAction('deleteCampaignById', playerCannotDelete, false, false);
  await assert.rejects(() => denied.fn('camp-1'), /Somente o mestre que criou esta campanha/);
  assert.equal(denied.calls.length, 0, 'a non-owner cannot issue a deletion RPC');
})().then(() => console.log(`v3.0.3 release checks passed: ${maps.length} maps, ${forms.length} unique monster forms, 3 secured campaign operations.`)).catch(err => { console.error(err); process.exitCode = 1; });
