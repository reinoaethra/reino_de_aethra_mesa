const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

async function main() {
  const root = path.join(__dirname, '..');
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

  assert(html.includes('v4.1.1'), 'HTML identifies v4.1.1');
  assert(html.includes('app.js?v=4.1.1') && html.includes('styles.css?v=4.1.1'), 'application assets use the v4.1.1 cache key');
  assert(html.includes('src="config.js"'), 'existing config.js reference remains unchanged');
  assert(app.includes("url.searchParams.set('v','4.1.1')"), 'map background cache key is refreshed for v4.1.1');

  for (const feature of [
    'renderV41SessionRoom', 'toggleV41Ready', 'processV41ReadyRequest',
    'renderV41RollModal', 'v41RollForPrompt', 'finalizeV41RollPrompt',
    'renderV41JournalModal', 'v41JournalRows', 'renderV41BestiaryModal',
    'createV41MapPing', 'processV41MapPingRequest', 'renderV41PlayerHelp',
    'createV41Checkpoint', 'restoreV41Checkpoint'
  ]) assert(app.includes(`function ${feature}`) || app.includes(`async function ${feature}`), `${feature} exists`);

  // State normalization preserves existing campaign content and bounds new arrays.
  {
    const start = app.indexOf('  function v41GameData(');
    const end = app.indexOf('  async function toggleV41Ready', start);
    assert(start >= 0 && end > start, 'v4.1 state helpers found');
    const snapshots = Array.from({ length: 5 }, (_, i) => ({ id: `s${i}` }));
    const pings = Array.from({ length: 30 }, (_, i) => ({ id: `p${i}` }));
    const ctx = {
      state: { campaign: { id: 'c1' } },
      defaultGameState: () => ({ v41: {} }),
      cloneData: value => JSON.parse(JSON.stringify(value)),
      localStorage: { getItem: () => '[]', setItem: () => {} },
      currentUserId: () => 'master-1', Date, Math, JSON
    };
    vm.runInNewContext(app.slice(start, end) + '\nthis.v41GameData=v41GameData;this.createV41Checkpoint=createV41Checkpoint;this.v41RollForPrompt=v41RollForPrompt;', ctx);
    const normalized = ctx.v41GameData({ v41: { session: { status: 'paused', readyBy: { p1: true } }, snapshots, mapPings: pings } });
    assert.equal(normalized.snapshots.length, 3, 'only the three newest restore points remain');
    assert.equal(normalized.mapPings.length, 24, 'map pings are bounded to 24');
    assert.equal(normalized.session.readyBy.p1, true, 'ready state is preserved');

    const source = { chapter: 'Capítulo II', v41: { session: { status: 'live' }, snapshots: [{ id: 'old' }], mapPings: [] } };
    const checkpointData = ctx.createV41Checkpoint(source, 'Antes do teste');
    assert.equal(checkpointData.snapshots.length, 2, 'manual checkpoint is appended');
    assert.equal(checkpointData.snapshots[1].gameState.v41.snapshots.length, 0, 'snapshot does not recursively contain snapshots');
    assert.equal(checkpointData.snapshots[1].gameState.chapter, 'Capítulo II', 'checkpoint preserves campaign chapter');

    const member = { user_id: 'p1', character: { attributes: { forca: 16 } } };
    ctx.state.members = [member];
    ctx.normalizeCharacter = c => c;
    ctx.attrMod = value => Math.floor((Number(value) - 10) / 2);
    let values = [4, 18];
    ctx.secureD20 = () => values.shift();
    let roll = ctx.v41RollForPrompt({ attribute: 'Força', bonus: 2, dc: 20, mode: 'advantage' }, 'p1');
    assert.equal(roll.natural, 18, 'advantage chooses the higher D20');
    assert.equal(roll.modifier, 5, 'attribute and extra bonus are combined');
    assert.equal(roll.total, 23, 'smart D20 computes final total');
    assert.equal(roll.success, true, 'DC is evaluated');
    values = [19, 3];
    roll = ctx.v41RollForPrompt({ attribute: 'Força', bonus: 0, dc: 15, mode: 'disadvantage' }, 'p1');
    assert.equal(roll.natural, 3, 'disadvantage chooses the lower D20');
    assert.equal(roll.success, false, 'disadvantage result is compared against DC');
  }

  // Checkpoint restore can replace the full campaign state rather than merge stale keys.
  {
    const start = app.indexOf('  async function updateGameState(');
    const end = app.indexOf('  async function persistLocalCampaign(', start);
    assert(start >= 0 && end > start, 'campaign state writer found');
    const state = { campaign: { game_state: { obsoleteKey: true, chapter: 'Capítulo III' }, status: 'active' }, backendReady: false };
    const ctx = {
      state, isMaster: () => true, isMasterController: () => true,
      defaultGameState: () => ({}), cloneData: value => JSON.parse(JSON.stringify(value)),
      persistLocalCampaign: async () => {}, render: () => {},
      v41GameData: gs => ({ snapshots: gs.v41?.snapshots || [] }), v411GameData: gs => ({revision: gs.v411?.revision||0, undoHistory: gs.v411?.undoHistory||[]}), v411UndoLabel: () => 'Teste', v41CheckpointAge: () => Infinity, createV41Checkpoint: gs => ({snapshots:[], session:{}}), Date, Math
    };
    vm.runInNewContext(app.slice(start, end) + '\nthis.updateGameState=updateGameState;', ctx);
    await ctx.updateGameState({ chapter: 'Capítulo I', v41: { snapshots: [] } }, 'active', true);
    assert.equal(state.campaign.game_state.chapter, 'Capítulo I', 'restore writes the checkpoint chapter');
    assert.equal(state.campaign.game_state.obsoleteKey, undefined, 'restore removes keys that did not exist in the checkpoint');
  }

  // Voice invitations only allow HTTPS links on the selected provider's official domains.
  {
    const start = app.indexOf('  const VOICE_PLAYER_ACTIONS=');
    const end = app.indexOf('  function renderVoiceSessionPanel(', start);
    assert(start >= 0 && end > start, 'voice helpers found');
    const ctx = { URL, state: { events: [] }, Date, location: { href: 'https://example.test/campaign' }, navigator: {}, document: {}, window: {} };
    vm.runInNewContext(app.slice(start, end) + '\nthis.voiceCallUrl=voiceCallUrl;this.voicePlatformName=voicePlatformName;', ctx);
    assert.equal(ctx.voiceCallUrl('discord', 'https://discord.gg/aethra'), 'https://discord.gg/aethra');
    assert.equal(ctx.voiceCallUrl('meet', 'https://meet.google.com/abc-defg-hij'), 'https://meet.google.com/abc-defg-hij');
    assert.equal(ctx.voiceCallUrl('discord', 'http://discord.gg/aethra'), '', 'non-HTTPS invitations are rejected');
    assert.equal(ctx.voiceCallUrl('meet', 'https://example.com/meeting'), '', 'unrelated domains are rejected');
    assert.equal(ctx.voicePlatformName('whatsapp'), 'WhatsApp');
  }

  // Map marker creation is campaign-scoped, typed, and recorded in the shared journal.
  {
    const start = app.indexOf('  async function createV41MapPing(');
    const end = app.indexOf('  async function clearV41MapPings(', start);
    assert(start >= 0 && end > start, 'map ping functions found');
    const gs = { v41: { mapPings: [] }, exploration: { mapId: 'eldoria-road' } };
    const notes = [];
    const ctx = {
      state: { campaign: { game_state: gs }, member: { display_name: 'Mestre' } },
      explorationData: () => ({ mapId: 'eldoria-road' }), activeMapRecord: () => ({}),
      isMaster: () => true, isMasterController: () => true,
      v41GameData: game => ({ version: 1, snapshots: [], mapPings: game.v41.mapPings || [] }),
      updateGameState: async patch => Object.assign(gs, patch),
      createEvent: async (type, payload) => notes.push({ type, payload }),
      Date, Math, String, toast: () => {},
      mapCellVisible: () => true, MAP_WIDTH: 10, MAP_HEIGHT: 8
    };
    vm.runInNewContext(app.slice(start, end) + '\nthis.createV41MapPing=createV41MapPing;', ctx);
    await ctx.createV41MapPing(2, 3, false, 'danger', 'Mestre');
    assert.equal(gs.v41.mapPings.length, 1, 'danger ping is stored');
    assert.equal(gs.v41.mapPings[0].type, 'danger', 'ping type is retained');
    assert.equal(gs.v41.mapPings[0].mapId, 'eldoria-road', 'ping is linked to selected map');
    assert.equal(notes[0].type, 'session_note', 'ping creates a journal event');
  }

  // Journal collects campaign and event records without exposing private notes.
  {
    const start = app.indexOf('  function v41JournalRows(');
    const end = app.indexOf('  function renderV41SessionRoom(', start);
    assert(start >= 0 && end > start, 'journal helpers found');
    const ctx = {
      state: {
        campaign: { game_state: { journalEntries: [{ id: 'j1', kind: 'discovery', text: 'Pista encontrada', createdAt: '2026-11-24T12:00:00Z' }] } },
        events: [{ id: 'e1', event_type: 'encounter_started', payload: {}, created_at: '2026-11-24T12:01:00Z' }, { id: 'e2', event_type: 'voice_action_resolved', payload: { action_label: 'Investigar', player_name: 'Arthos', accepted: true }, created_at: '2026-11-24T12:02:00Z' }]
      }, defaultGameState: () => ({ journalEntries: [] }), Date, Set, Math
    };
    vm.runInNewContext(app.slice(start, end) + '\nthis.v41JournalRows=v41JournalRows;this.v41JournalSummary=v41JournalSummary;', ctx);
    const rows = ctx.v41JournalRows();
    assert(rows.some(r => r.text === 'Pista encontrada'), 'journal entries appear in timeline');
    assert(rows.some(r => r.text === 'Encontro iniciado'), 'encounter events appear in timeline');
    assert(rows.some(r => r.text.includes('Arthos') && r.text.includes('Investigar') && r.text.includes('registrada')), 'resolved voice actions appear in timeline with their outcome');
    assert(rows.some(r => r.kind === 'voice'), 'voice actions can be filtered with the voice category');
    assert(!rows.some(r => /segredo|secret/i.test(r.text)), 'private notes are not included by default');
    assert(ctx.v41JournalSummary().includes('Pista encontrada'), 'session summary can be generated from timeline');
  }

  // UI reachability and permissions for newly added workflows.
  for (const needle of [
    'data-action="start-session"', 'data-action="v41-toggle-ready"', 'data-action="voice-open-call"',
    'data-action="voice-send-action"', 'data-action="voice-resolve-action"',
    'data-action="v41-open-roll"', 'data-action="v41-open-checkpoints"',
    'data-action="open-bestiary"', 'data-action="open-journal"',
    'data-action="v41-clear-map-pings"', 'data-action="v4-open-skill"'
  ]) assert(app.includes(needle), `UI action ${needle} exists`);
  assert(app.includes('v41GameData(gs).mapPings.filter(p=>p.mapId===exploration.mapId'), 'map markers are isolated by map');
  assert(app.includes('opponentMonsterId:options.opponentMonsterId||null'), 'opposed tests can target an encounter monster');
  assert(app.includes("attribute,dc:$('#voice-roll-dc').value,mode:$('#voice-roll-mode').value"), 'quick voice D20 includes attribute, difficulty and advantage mode');
  assert(app.includes('window.confirm(`Restaurar'), 'restoring a checkpoint requires confirmation');
  assert(app.includes('encounterPresets:Array.isArray(data.encounterPresets)?data.encounterPresets.slice(-30):[]'), 'saved encounter presets are bounded');
  assert(app.includes("localStorage.setItem(key,String(text||'').slice(0,12000))"), 'master private notes remain local to master browser');
  assert(app.includes('update_campaign_state'), 'campaign state uses the existing Supabase RPC');

  for (const rule of ['.v41-session-room', '.v41-bestiary-grid', '.v41-timeline', '.v41-map-ping', '.v41-player-help', '.v41-checkpoint-list']) {
    assert(css.includes(rule), `style ${rule} exists`);
  }
  console.log('Reino de Aethra v4.1.1: regressão v4.1.0 de sessão, D20, convites, mapas, diário, checkpoints e compatibilidade aprovada.');
}

main().catch(error => { console.error(error); process.exit(1); });
