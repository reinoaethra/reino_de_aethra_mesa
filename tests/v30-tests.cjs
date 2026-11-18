const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

async function main() {
  const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');

  class MemoryStorage {
    constructor() { this.data = new Map(); }
    getItem(key) { return this.data.has(key) ? this.data.get(key) : null; }
    setItem(key, value) { this.data.set(String(key), String(value)); }
    removeItem(key) { this.data.delete(String(key)); }
    clear() { this.data.clear(); }
  }

  // Adaptador real do Supabase: visitante por aba, conta permanente por aparelho.
  {
    const start = source.indexOf('  function storedAuthUser(');
    const end = source.indexOf('  function getActiveCampaignId()', start);
    assert(start >= 0 && end > start, 'auth storage helpers found');
    const localStorage = new MemoryStorage();
    const sessionStorage = new MemoryStorage();
    const context = { localStorage, sessionStorage };
    vm.runInNewContext(source.slice(start, end) + '\nthis.createAuthStorage = createAuthStorage;', context);
    const storage = context.createAuthStorage();
    const anonymous = JSON.stringify({ user: { id: 'guest', is_anonymous: true }, access_token: 'guest-token' });
    const permanent = JSON.stringify({ user: { id: 'account', is_anonymous: false, email: 'player@example.test' }, access_token: 'account-token' });
    await storage.setItem('sb-auth', anonymous);
    assert.equal(sessionStorage.getItem('sb-auth'), anonymous, 'visitor session goes to sessionStorage');
    assert.equal(localStorage.getItem('sb-auth'), null, 'visitor session not persisted in localStorage');
    await storage.setItem('sb-auth', permanent);
    assert.equal(localStorage.getItem('sb-auth'), permanent, 'permanent account goes to localStorage');
    assert.equal(sessionStorage.getItem('sb-auth'), null, 'permanent login replaces tab visitor session');
    localStorage.setItem('legacy', anonymous);
    assert.equal(await storage.getItem('legacy'), anonymous, 'legacy visitor token is returned during migration');
    assert.equal(localStorage.getItem('legacy'), null, 'legacy visitor token removed from persistent storage');
    assert.equal(sessionStorage.getItem('legacy'), anonymous, 'legacy visitor token moved to tab storage');
    const nested = JSON.stringify({ currentSession: { user: { id: 'nested', is_anonymous: true } } });
    await storage.setItem('nested-auth', nested);
    assert.equal(sessionStorage.getItem('nested-auth'), nested, 'nested anonymous session is treated as temporary');
    await storage.removeItem('sb-auth');
    assert.equal(localStorage.getItem('sb-auth'), null);
    assert.equal(sessionStorage.getItem('sb-auth'), null);
  }

  // O identificador da campanha segue a mesma regra temporária/permanente da autenticação.
  {
    const start = source.indexOf('  function getActiveCampaignId()');
    const end = source.indexOf('  function esc(', start);
    assert(start >= 0 && end > start, 'active campaign storage helpers found');
    const localStorage = new MemoryStorage();
    const sessionStorage = new MemoryStorage();
    const KEYS = { active: 'aethra.active.campaign.v1' };
    const state = { backendReady: true, user: { is_anonymous: true } };
    const context = { localStorage, sessionStorage, KEYS, state, isAnonymousUser: () => !!state.user?.is_anonymous };
    vm.runInNewContext(source.slice(start, end) + '\nthis.getActiveCampaignId=getActiveCampaignId;this.setActiveCampaignId=setActiveCampaignId;', context);
    context.setActiveCampaignId('visitor-campaign');
    assert.equal(sessionStorage.getItem(KEYS.active), 'visitor-campaign', 'visitor active campaign is tab-scoped');
    assert.equal(localStorage.getItem(KEYS.active), null, 'visitor active campaign is not persisted');
    state.user = { is_anonymous: false };
    context.setActiveCampaignId('permanent-campaign');
    assert.equal(localStorage.getItem(KEYS.active), 'permanent-campaign', 'permanent account active campaign remains on device');
    assert.equal(sessionStorage.getItem(KEYS.active), null, 'permanent account removes stale visitor campaign key');
    state.backendReady = false;
    state.user = null;
    context.setActiveCampaignId('offline-guest');
    assert.equal(sessionStorage.getItem(KEYS.active), 'offline-guest', 'offline local mode also remains temporary');
  }

  // Uma instalação antiga não deve reatribuir o cache de outro visitante a um usuário anônimo novo.
  {
    const start = source.indexOf('  function readLocalCampaigns()');
    const end = source.indexOf('  function writeLocalCampaigns()', start);
    assert(start >= 0 && end > start, 'legacy local campaign reader found');
    const localStorage = new MemoryStorage();
    const sessionStorage = new MemoryStorage();
    const KEYS = { local: 'aethra.local.campaigns.v1' };
    localStorage.setItem(KEYS.local, JSON.stringify([{ id: 'old-visitor-campaign' }]));
    const context = { localStorage, sessionStorage, KEYS };
    vm.runInNewContext(source.slice(start, end) + '\nthis.readLocalCampaigns = readLocalCampaigns;', context);
    assert.equal(context.readLocalCampaigns().length, 0, 'legacy guest campaign is not resurrected for a new visitor');
    assert.equal(localStorage.getItem(KEYS.local), null, 'legacy guest campaign cache is removed');
    sessionStorage.setItem(KEYS.local, JSON.stringify([{ id: 'same-tab' }]));
    assert.equal(context.readLocalCampaigns()[0].id, 'same-tab', 'temporary progress remains available during the same tab session');
  }

  // Dados temporários antigos são eliminados ao entrar/sair de uma conta permanente.
  {
    const start = source.indexOf('  function discardTemporaryProgress()');
    const end = source.indexOf('  function clearCampaignContext()', start);
    assert(start >= 0 && end > start, 'temporary progress helper found');
    const localStorage = new MemoryStorage();
    const sessionStorage = new MemoryStorage();
    const state = { localCampaigns: [{ id: 'guest-campaign' }] };
    const KEYS = { local: 'aethra.local.campaigns.v1' };
    localStorage.setItem(KEYS.local, 'legacy-cache');
    sessionStorage.setItem(KEYS.local, 'guest-cache');
    const context = { localStorage, sessionStorage, state, KEYS };
    vm.runInNewContext(source.slice(start, end) + '\nthis.discardTemporaryProgress = discardTemporaryProgress;', context);
    context.discardTemporaryProgress();
    assert.equal(state.localCampaigns.length, 0, 'in-memory guest campaigns cleared');
    assert.equal(localStorage.getItem(KEYS.local), null, 'legacy persistent guest cache cleared');
    assert.equal(sessionStorage.getItem(KEYS.local), null, 'tab guest cache cleared');
    assert(source.slice(source.indexOf('async function signOutAccount()'), source.indexOf('function isMaster()', source.indexOf('async function signOutAccount()'))).includes('discardTemporaryProgress()'), 'signing out begins a clean visitor session');
  }

  // Funções reais de iniciativa e avanço de turno.
  {
    const start = source.indexOf('  function activeCombatTurn(');
    const end = source.indexOf('  function primaryAttributeForClass(', start);
    assert(start >= 0 && end > start, 'combat turn helpers found');
    const p1 = { user_id: 'p1', role: 'player', character: { name: 'A', hp: 12, maxHp: 12, attributes: { destreza: 5 } } };
    const p2 = { user_id: 'p2', role: 'player', character: { name: 'B', hp: 12, maxHp: 12, attributes: { destreza: 5 } } };
    const p3 = { user_id: 'p3', role: 'player', character: { name: 'C', hp: 0, maxHp: 12, attributes: { destreza: 5 } } };
    const context = {
      state: { members: [p1, p2, p3], campaign: { game_state: { partyState: {} } }, member: p1 },
      normalizeCharacter: c => c,
      currentUserId: () => 'p1',
      currentPartyVitals: () => ({ hp: 12 }),
      classRule: () => ({}),
      secureDie: () => 10,
      attrMod: () => 0,
      equipmentBonuses: () => ({ defense: 0 })
    };
    vm.runInNewContext(source.slice(start, end) + '\nthis.advanceCombatTurn=advanceCombatTurn;this.combatantAvailable=combatantAvailable;this.activeCombatTurn=activeCombatTurn;this.buildTurnOrder=buildTurnOrder;', context);
    const encounter = {
      round: 1, turnIndex: 0,
      turnOrder: [
        { kind: 'player', user_id: 'p1', name: 'A' },
        { kind: 'monster', id: 'm1', name: 'Monstro' },
        { kind: 'player', user_id: 'p2', name: 'B' },
        { kind: 'player', user_id: 'p3', name: 'C' }
      ],
      enemies: [{ id: 'm1', name: 'Monstro', hp: 20, defeated: false }], defeated: false
    };
    const stateOneDown = { p1: { hp: 0 }, p2: { hp: 10 }, p3: { hp: 0 } };
    const afterDownedTurn = context.advanceCombatTurn(encounter, stateOneDown);
    assert.equal(afterDownedTurn.turnIndex, 1, 'dead player is skipped in initiative');
    assert.equal(afterDownedTurn.partyDefeated, false);
    const everyoneDown = { p1: { hp: 0 }, p2: { hp: 0 }, p3: { hp: 0 } };
    const afterLastPlayerFalls = context.advanceCombatTurn({ ...encounter, turnIndex: 1 }, everyoneDown);
    assert.equal(afterLastPlayerFalls.partyDefeated, true, 'party defeat is detected before monsters take another turn');
    assert.equal(afterLastPlayerFalls.turnOrder.length, 0, 'no further turns after party defeat');
    const defeatedMonster = context.advanceCombatTurn({ ...encounter, turnIndex: 0, enemies: [{ id: 'm1', hp: 0, defeated: true }] }, { p1: { hp: 10 }, p2: { hp: 10 } });
    assert.equal(defeatedMonster.defeated, true, 'all defeated enemies close the encounter as a victory');
    assert.equal(defeatedMonster.partyDefeated, false);
    const rebuilt = context.buildTurnOrder(encounter, [p1, p2, p3], { p1: { hp: 10 }, p2: { hp: 0 }, p3: { hp: 0 } });
    assert.equal(rebuilt.filter(x => x.kind === 'player').length, 1, 'new initiative excludes downed players');
    assert.equal(rebuilt.filter(x => x.kind === 'monster').length, 1, 'new initiative includes only active enemies');
    const anonymousName = context.buildTurnOrder({ ...encounter, enemies: [{ id: 'm2', hp: 4, defeated: false }] }, [p1], { p1: { hp: 10 } });
    assert.equal(anonymousName.length, 2, 'initiative sorting tolerates older enemies without display names');
  }

  // Regressões de modais, ações e miniaturas.
  assert(!source.includes('Esta sessão visitante já está ligada a uma campanha neste dispositivo'), 'old visitor-login blocker removed');
  const loginBody = source.slice(source.indexOf('async function signInExistingAccount('), source.indexOf('async function sendPasswordReset('));
  assert(loginBody.includes('const wasVisitor=isAnonymousUser();') && loginBody.includes('discardTemporaryProgress()'), 'existing account login replaces guest mode and discards its cache');
  const createBody = source.slice(source.indexOf('async function createCampaign('), source.indexOf('function normalizeCampaign('));
  assert(createBody.indexOf('closeModal()') < createBody.indexOf('await openCloudCampaign(c.id)'), 'create modal closes before async campaign loading');
  const saveBody = source.slice(source.indexOf('async function saveCharacter('), source.indexOf('function memberIsOnline('));
  assert(saveBody.indexOf('closeModal()') < saveBody.indexOf('await refreshCloudCampaign()'), 'character modal closes before cloud refresh');
  assert(source.includes("if(form.dataset.busy==='true')return;"), 'forms block duplicate submissions');
  assert(source.includes("if(!b||b.dataset.busy==='true')return;"), 'character wizard blocks repeated save clicks');
  const incoming = source.slice(source.indexOf('async function handleIncomingEvent('), source.indexOf('async function processRollRequest('));
  const damageFx = "if(ev.event_type==='damage_applied')showCombatFX";
  assert.equal(incoming.split(damageFx).length - 1, 1, 'damage FX is not duplicated in incoming event handling');
  assert(source.includes("if(vitals.hp<=0){await rejectCombatAction(ev,'Um aventureiro sem pontos de vida não pode agir.');"), 'zero HP action is rejected');
  assert(source.includes("if(vitals.hp>=vitals.maxHp){await rejectCombatAction(ev,'Seus pontos de vida já estão completos; guarde a poção.');"), 'full HP potion use is rejected');
  assert(css.includes('.map-token.miniature,.map-token.miniature .map-token-art,.map-token.monster-token'), 'table miniatures stay static');
  assert(css.includes('.combat-fx-critical') && css.includes('.combat-fx-miss'), 'critical and miss visual effects are styled');
  assert(css.includes('@media(max-width:620px)') && css.includes('overscroll-behavior:contain'), 'modals are adapted to touch screens');
  assert(source.includes("case'party_defeated':title='Derrota da companhia'"), 'party defeat is readable in the event log');
  assert(loginBody.includes('finally{') && loginBody.includes('modalRoot.replaceChildren()'), 'login dialog closes even if campaign loading takes time or fails');
  const signOutBody = source.slice(source.indexOf('async function signOutAccount('), source.indexOf('function isMaster()', source.indexOf('async function signOutAccount(')));
  assert(signOutBody.indexOf('closeModal()') < signOutBody.indexOf('signInAnonymously()'), 'logout closes the dialog before the replacement visitor session is created');
  const authHandler = source.slice(source.indexOf('function handleAuthStateChange('), source.indexOf('async function linkGuestAccount('));
  assert(authHandler.includes("event==='SIGNED_IN'") && authHandler.includes("event==='SIGNED_OUT'"), 'auth events close the account modal on login and logout');

  // Todos os tabuleiros devem ser plantas 10x8 e os Pontos de Interesse precisam estar em casas acessíveis.
  {
    const a = source.indexOf('const MAP_TEMPLATES = [') + 'const MAP_TEMPLATES = '.length;
    const b = source.indexOf(';\n  // Camada de tabuleiro', a);
    const c = source.indexOf('const MAP_BOARD_FEATURES = ') + 'const MAP_BOARD_FEATURES = '.length;
    const d = source.indexOf(';\n  function mapBoardFeatures', c);
    assert(a >= 0 && b > a && c >= 0 && d > c, 'map board definitions found');
    // Evaluate the two literal declarations together so the test uses the actual in-app map data.
    const dataContext = {};
    vm.runInNewContext('this.templates='+source.slice(a,b)+';this.features='+source.slice(c,d)+';', dataContext, { timeout: 1000 });
    assert.equal(dataContext.templates.length, 11, 'eleven official tactical boards are present');
    for (const map of dataContext.templates) {
      assert.equal(map.layout.length, 8, map.id + ' has eight rows');
      for (let y=0; y<8; y++) assert.equal(map.layout[y].length, 10, map.id + ' row ' + (y+1) + ' has ten columns');
      const features = dataContext.features[map.id] || {};
      for (const poi of (features.points || [])) {
        assert(poi.x>=0 && poi.x<10 && poi.y>=0 && poi.y<8, map.id + ' ' + poi.name + ' is inside the board');
        assert(!'bthcrw'.includes(map.layout[poi.y][poi.x]), map.id + ' ' + poi.name + ' is placed on accessible terrain');
      }
      for (const route of ['entry','exit']) {
        const point = features[route];
        assert(point && point.x>=0 && point.x<10 && point.y>=0 && point.y<8, map.id + ' has a valid ' + route);
        assert(!'bthcrw'.includes(map.layout[point.y][point.x]), map.id + ' ' + route + ' is accessible from the board');
      }
      for (const door of (features.doors || [])) assert(door.x>=0 && door.x<10 && door.y>=0 && door.y<8, map.id + ' ' + door.name + ' is inside the board');
      const describedDoorCells = new Set((features.doors || []).map(door => door.x + ',' + door.y));
      for (let y=0; y<8; y++) for (let x=0; x<10; x++) if (map.layout[y][x] === 'd') describedDoorCells.add(x + ',' + y);
      assert(describedDoorCells.size >= (features.doors || []).length, map.id + ' door cells are represented in the board data');
    }
  }
  assert(source.indexOf('if(marker)return !marker.open') < source.indexOf('if(mapTileInfo(mapTile(mapId,x,y)).blocked)'), 'an explicit door can open a passage over a wall or building tile');
  assert(source.includes('layout-door-') && source.includes("filter(m=>m.type==='door')"), 'all door tiles are generated and listed in the inspector');
  assert(css.includes('width:100%;max-width:none') && css.includes('grid-template-columns:repeat(10,minmax(0,1fr))') && source.includes('PLANTA TÁTICA'), 'main experience and tactical board use the available width');

  console.log('v3.0.1: all targeted assertions passed, including map and modal regressions.');
}

main().catch(err => { console.error(err); process.exitCode = 1; });
