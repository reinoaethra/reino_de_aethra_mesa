const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

async function main() {
  const root = path.join(__dirname, '..');
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

  assert(html.includes('v4.2.5'), 'HTML identifies the release');
  assert(html.includes('app.js?v=4.2.5') && html.includes('styles.css?v=4.2.5'), 'cache keys are bumped');
  assert(html.includes('src="config.js"'), 'existing config.js is preserved');
  for (const fn of ['v411GameData','undoV411LastAction','scheduleCampaignReconnect','retryCampaignConnection','v411NotificationRows','renderV411ConnectionPanel','renderV411TurnSummary','v411SessionCloseSummary','finishV411Session','v411MarkNotificationsRead']) {
    assert(app.includes(`function ${fn}`) || app.includes(`async function ${fn}`), `${fn} exists`);
  }
  for (const action of ['v411-reconnect','v411-open-notifications','v411-mark-notifications-read','v411-undo-last','pause-session']) {
    assert(app.includes(`data-action="${action}"`) || app.includes(`action==='${action}'`), `${action} is wired`);
  }
  for (const cls of ['.v411-connection-panel','.v411-undo-panel','.v411-notification-list','.v411-turn-summary']) assert(css.includes(cls), `${cls} styled`);

  // The undo history is bounded and stores only the previous values of keys that changed.
  {
    const helperStart = app.indexOf('  function v411GameData(');
    const helperEnd = app.indexOf('  function createV41Checkpoint(', helperStart);
    const updateStart = app.indexOf('  async function updateGameState(', helperEnd);
    const updateEnd = app.indexOf('  async function persistLocalCampaign(', updateStart);
    assert(helperStart >= 0 && helperEnd > helperStart && updateStart > helperEnd && updateEnd > updateStart, 'undo helpers and state writer found');
    const state = { campaign: { id: 'c1', status: 'active', game_state: { chapter: 'Capítulo I', location: 'Estrada', v411: { revision: 0, undoHistory: [] } } }, backendReady: false, isUndoing: false };
    const events = [];
    const ctx = {
      state, Date, Math, JSON, window: { confirm: () => true },
      isMaster: () => true, isMasterController: () => true, currentUserId: () => 'master-1',
      cloneData: value => JSON.parse(JSON.stringify(value)), defaultGameState: () => ({}), compactCheckpointCopies: game => game,
      v41GameData: gs => ({ snapshots: gs.v41?.snapshots || [] }),
      v41CheckpointAge: () => 0, createV41Checkpoint: gs => ({ ...(gs.v41||{}), snapshots: gs.v41?.snapshots||[] }),
      persistLocalCampaign: async () => {}, render: () => {}, toast: () => {},
      createEvent: async (type,payload) => events.push({type,payload})
    };
    vm.runInNewContext(app.slice(helperStart,helperEnd) + app.slice(updateStart,updateEnd) + '\nthis.v411GameData=v411GameData;this.v411LastUndo=v411LastUndo;this.undoV411LastAction=undoV411LastAction;this.updateGameState=updateGameState;', ctx);
    await ctx.updateGameState({ chapter: 'Capítulo II' });
    let data = ctx.v411GameData(state.campaign.game_state);
    assert.equal(state.campaign.game_state.chapter, 'Capítulo II', 'state update is stored');
    assert.equal(data.revision, 1, 'revision advances');
    assert.equal(data.undoHistory.length, 1, 'reversible update is recorded');
    assert.equal(data.undoHistory[0].before.chapter.value, 'Capítulo I', 'undo stores the previous field value');
    assert.equal(ctx.v411LastUndo(state.campaign.game_state).summary, 'Capítulo da aventura', 'latest master action is offered to its author');
    await ctx.undoV411LastAction();
    data = ctx.v411GameData(state.campaign.game_state);
    assert.equal(state.campaign.game_state.chapter, 'Capítulo I', 'undo restores only the changed field');
    assert.equal(data.undoHistory.length, 0, 'used undo entry is removed');
    assert.equal(data.revision, 2, 'undo advances revision to invalidate stale actions');
    assert(events.some(e => e.type === 'session_note' && e.payload.kind === 'undo'), 'undo is recorded in the campaign timeline');
  }

  // Notification list is campaign-event based; own events do not increase unread count.
  {
    const start = app.indexOf('  function v411NotificationRows(');
    const end = app.indexOf('  function renderV411ConnectionPanel(', start);
    const store = new Map();
    const ctx = {
      state: { campaign: { id: 'c1' }, events: [
        { id: 'e1', actor_id: 'player-2', event_type: 'narration', payload: { text: 'A torre surge na névoa.' }, created_at: '2026-11-24T10:00:00Z' },
        { id: 'e2', actor_id: 'player-1', event_type: 'dice_result', payload: { player_name: 'Arthos' }, created_at: '2026-11-24T10:01:00Z' },
        { id: 'e3', actor_id: 'player-2', event_type: 'member_joined', payload: { display_name: 'Lia', text: 'Lia entrou na campanha.' }, created_at: '2026-11-24T10:02:00Z' }
      ] },
      currentUserId: () => 'player-1', localStorage: { getItem: k => store.get(k)||null, setItem: (k,v) => store.set(k,v) }, Date
    };
    vm.runInNewContext(app.slice(start,end) + '\nthis.v411NotificationRows=v411NotificationRows;this.v411NotificationUnread=v411NotificationUnread;', ctx);
    assert.equal(ctx.v411NotificationRows().length, 3, 'relevant campaign events populate notifications');
    assert.equal(ctx.v411NotificationUnread(), 2, 'other participants events count as unread');
    store.set('aethra.v411.notifications-read.c1.player-1', String(Date.parse('2026-11-24T10:00:30Z')));
    assert.equal(ctx.v411NotificationUnread(), 1, 'read marker is local and time-based');
    ctx.v411MarkNotificationsRead();
    assert.equal(ctx.v411NotificationUnread(), 0, 'mark read stores a safe local timestamp');
  }

  // Turn summary uses the existing round/token movement counter and condition list.
  {
    const start = app.indexOf('  function renderV411TurnSummary(');
    const end = app.indexOf('  function v411SessionCloseSummary(', start);
    const ctx = {
      state: { campaign: { game_state: { partyState: { 'p1': { abilityUsed: false } } } }, members: [{ user_id: 'p1', character: { name:'Arthos', level:1, class:'Guerreiro', attributes:{forca:12,destreza:10,constituicao:12,inteligencia:8,sabedoria:10,carisma:8}, equipment:{weapon:{},armor:{},shield:null}, inventory:[] } }] },
      activeCombatTurn: () => ({kind:'player',user_id:'p1',name:'Arthos'}), currentPartyVitals: () => ({hp:20,maxHp:20,conditions:[]}),
      normalizeCharacter: c => c, COMBAT_CONDITIONS: {}, hasCondition: () => false, conditionModifiers: () => ({movement:99}), classRule: () => ({}), stateMember: null,
      esc: v => String(v), attrMod: () => 0
    };
    // Extracted renderer uses only these small helpers for its player branch.
    vm.runInNewContext(app.slice(start,end) + '\nthis.renderV411TurnSummary=renderV411TurnSummary;', ctx);
    const html = ctx.renderV411TurnSummary({round:2,turnIndex:0,turnOrder:[{kind:'player',user_id:'p1',name:'Arthos'}],movementUsed:{'2:p1':3}});
    assert(html.includes('1/4 casas'), 'turn summary displays remaining movement');
    assert(html.includes('Ação principal disponível'), 'turn summary displays current action state');
    ctx.hasCondition = () => true;
    ctx.conditionModifiers = () => ({movement:0});
    const blocked = ctx.renderV411TurnSummary({round:2,turnIndex:0,turnOrder:[{kind:'player',user_id:'p1',name:'Arthos'}],movementUsed:{'2:p1':0}});
    assert(blocked.includes('0/4 casas') && blocked.includes('Ação perdida · Atordoado'), 'turn summary respects rooted and stunned conditions');
  }

  // Joining by invitation creates a campaign event visible in notifications and journal.
  assert(app.includes("await createEvent('member_joined'") && app.includes("member_joined:'Jogador entrou'"), 'player joins are recorded and surfaced as notifications');
  assert(app.includes("state.lastSyncAt=new Date().toISOString();if(isMasterController()){reconcilePendingRollRequests();reconcilePendingCombatActions()}"), 'presence sync updates last-sync status');
  assert(app.includes('if(state.reconnectTimer){clearTimeout(state.reconnectTimer);state.reconnectTimer=null}state.reconnectAttempts=0;\n    if(state.channel&&state.backend)state.backend.removeChannel(state.channel);'), 'leaving a campaign clears pending reconnect timers');

  // Reconnection is exponential, bounded, and only scheduled for an active online campaign.
  {
    const start = app.indexOf('  function scheduleCampaignReconnect(');
    const end = app.indexOf('  async function retryCampaignConnection(', start);
    let timer = null, delay = 0;
    const ctx = { state: { backendReady:true, campaign:{id:'c1'}, reconnectTimer:null, reconnectAttempts:0, channelPresence:[], realtimeStatus:'CHANNEL_ERROR' },
      navigator:{onLine:true}, Date, Math, console:{warn:()=>{}}, refreshConnectionLabel:()=>{},
      setTimeout:(fn,ms)=>{timer=fn;delay=ms;return 1}, clearTimeout:()=>{}, render:()=>{} };
    vm.runInNewContext(app.slice(start,end) + '\nthis.scheduleCampaignReconnect=scheduleCampaignReconnect;', ctx);
    ctx.scheduleCampaignReconnect('timeout');
    assert.equal(delay,1000,'first retry uses a short delay');
    assert.equal(ctx.state.realtimeStatus,'RECONNECTING','state shows that reconnection is underway');
    assert.equal(ctx.state.reconnectAttempts,1,'retry counter advances');
    ctx.state.reconnectTimer=null;ctx.state.reconnectAttempts=2;ctx.scheduleCampaignReconnect('timeout');
    assert.equal(delay,4000,'backoff grows exponentially');
  }

  // Session closeout persists the summary, creates a checkpoint, pauses the campaign and clears readiness for next time.
  {
    const start = app.indexOf('  async function finishV411Session(');
    const end = app.indexOf('  function createV41Checkpoint(', start);
    const captured = [];
    const gs = { chapter:'Capítulo II', location:'Torre dos Vigias', journalEntries:[], v41:{version:1,session:{status:'live',readyBy:{p1:true},startedAt:'2026-11-24T09:00:00Z'},snapshots:[],mapPings:[]}, v4:{version:4} };
    const state = { campaign:{id:'c1',name:'Crônica de Teste',status:'active',game_state:gs}, view:'session', modal:'v411-close-session' };
    const ctx = { state, isMaster:()=>true, isMasterController:()=>true, v41GameData:game=>({version:1,session:{status:'live',readyBy:{p1:true},startedAt:'2026-11-24T09:00:00Z'},snapshots:game.v41.snapshots||[],mapPings:[]}), v4GameData:game=>({...game.v4}), createV41Checkpoint:(game,reason)=>({version:1,session:{status:'live',readyBy:{p1:true},startedAt:'2026-11-24T09:00:00Z'},snapshots:[{id:'snap1',reason,createdAt:new Date().toISOString(),gameState:{chapter:game.chapter}}],mapPings:[]}), updateGameState:async(patch,status)=>{captured.push({patch,status});state.campaign.game_state={...state.campaign.game_state,...patch};state.campaign.status=status;}, createEvent:async(type,payload)=>captured.push({type,payload}), Date, String, toast:()=>{}, render:()=>{}, closeModal:()=>{state.modal=null} };
    vm.runInNewContext(app.slice(start,end) + '\nthis.finishV411Session=finishV411Session;',ctx);
    await ctx.finishV411Session('Os aventureiros chegaram à torre.');
    const update=captured.find(x=>x.patch);
    assert.equal(update.status,'paused','session closeout pauses campaign');
    assert.equal(update.patch.started,false,'session closeout stops the active state');
    assert.equal(update.patch.v41.session.status,'paused','session metadata is paused');
    assert.equal(JSON.stringify(update.patch.v41.session.readyBy),'{}','readiness is cleared for the next session');
    assert.equal(update.patch.v41.snapshots.length,1,'session closeout creates a restore point');
    assert.equal(update.patch.v4.lastSessionSummary,'Os aventureiros chegaram à torre.','summary is saved to campaign data');
    assert.equal(state.view,'lobby','master returns to lobby after closeout');
  }

  console.log('Reino de Aethra v4.2.1: reconexão, histórico/desfazer, notificações, resumo do turno, encerramento e regressão aprovados.');
}

main().catch(error => { console.error(error); process.exit(1); });
