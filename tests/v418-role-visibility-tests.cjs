const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

assert(html.includes('v4.2.3'), 'HTML version is v4.2.1');
assert(html.includes('app.js?v=4.2.3') && html.includes('styles.css?v=4.2.3'), 'assets use v4.2.1 cache keys');

// v4.2.1 sends readiness using its own player event; old v4.1.8 envelopes remain readable.
assert(app.includes("createEvent('v41_ready_request',{ready:next})"), 'readiness uses its dedicated RPC event type');
assert(app.includes("ev.event_type==='v4_branch_choice_request'&&ev.payload?.request_type==='session_ready'"), 'legacy readiness events remain compatible');
assert(app.includes("ev.payload?.request_type==='session_ready'&&isMasterController()"), 'master routes the readiness envelope to the readiness processor');
assert(app.includes("ev.payload?.request_type!=='session_ready'"), 'readiness envelopes are not passed to narrative branch voting');
assert(app.includes("async function processV41ReadyRequest(ev)"), 'master-side readiness processor remains available');

// New maps are prepared hidden; legacy map records stay visible unless explicitly hidden.
assert(app.includes('function createBoardRecord(mapId){return {playersVisible:false'), 'new map records default to hidden for players');
assert(app.includes("playersVisible:typeof source.playersVisible==='boolean'?source.playersVisible:true"), 'legacy map records default to visible for compatibility');
assert(app.includes("if(!isMaster()&&!record.playersVisible)return"), 'players receive a placeholder when the master has not presented the map');
assert(app.includes('data-action="toggle-map-player-visibility"'), 'master has a present/hide map control');
assert(app.includes("action==='toggle-map-player-visibility'"), 'map visibility control is wired');
assert(app.includes("rec.playersVisible=!rec.playersVisible"), 'map visibility is stored per map');

// The master alone sees available mission opportunities; players see presented and completed missions.
assert(app.includes("const availableMaster=isMaster()&&available.length?"), 'unpresented missions are rendered only for the master');
assert(app.includes("'Minhas missões'"), 'player mission panel has a player-facing label');
assert(app.includes('data-action="open-adventure-manager"'), 'master retains the journey editor');

// Scene publication stays public while the editor remains a master-only control.
assert(app.includes("if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode gerenciar a jornada.')"), 'journey and scene manager remains master-only');
assert(app.includes('NARRAÇÃO VISÍVEL AO GRUPO') || app.includes('NARRAÇÃO'), 'scene narration remains the shared player-facing content');

for (const cls of ['.map-visibility-control', '.map-hidden-to-players']) {
  assert(css.includes(cls), `${cls} styling exists`);
}

console.log('Reino de Aethra v4.2.1: prontidão por evento permitido, separação de missões, publicação do mapa e papéis da cena aprovados.');
