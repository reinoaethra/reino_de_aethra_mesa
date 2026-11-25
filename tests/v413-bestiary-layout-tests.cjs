const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

assert(html.includes('v4.1.3'), 'HTML identifies v4.1.3');
assert(html.includes('app.js?v=4.1.3') && html.includes('styles.css?v=4.1.3'), 'web assets use v4.1.3 cache keys');
assert(html.includes('src="config.js"'), 'Supabase configuration reference is retained');
assert(app.includes("url.searchParams.set('v','4.1.3')"), 'map image cache key is updated');
assert(app.includes("monsterMiniaturePath(id)+'?v=4.1.3'"), 'monster miniature cache key is updated');
assert(app.includes('assets/monster-art/${slug}.webp?v=4.1.3'), 'monster battle art cache key is updated');

const start = app.indexOf('  function renderV41BestiaryModal()');
const end = app.indexOf('  function renderV41JournalModal()', start);
assert(start >= 0 && end > start, 'Bestiary renderer exists');
const renderer = app.slice(start, end);
assert(renderer.includes('v413-bestiary-list-panel'), 'vertical selection list has its own panel');
assert(renderer.includes('v413-monster-option-copy'), 'selection list displays full creature names');
assert(renderer.includes('v413-bestiary-detail'), 'selected creature details are present');
assert(renderer.includes('Miniatura do bestiário'), 'detail view labels its miniature');
assert(renderer.includes('mapMonsterMiniature({templateId:selected.id,name:selected.name'), 'detail view uses the miniature asset');
assert(!renderer.includes('mapMonsterBattleArt({templateId:selected.id'), 'detail view does not use the panoramic background art');
assert(renderer.indexOf('${list}${detail}') >= 0, 'selection panel is rendered before detail panel');
assert(app.includes("state.modal==='v41-bestiary'?'modal wide v413-bestiary-modal'"), 'Bestiary receives the v4.1.3 layout style');
assert(app.includes("state.bestiarySelectedId=MONSTERS[0]?.id||null"), 'first creature is selected by default');

for (const selector of [
  '.modal.wide.v413-bestiary-modal',
  '.v413-bestiary-layout',
  '.v413-bestiary-grid',
  '.v413-monster-option-wrap',
  '.v413-bestiary-detail-main',
  '.v413-bestiary-art .monster-miniature-image',
  '@media(max-width:760px)',
  '@media(max-width:520px)'
]) assert(css.includes(selector), `layout rule exists: ${selector}`);
assert(/\.v413-bestiary-layout\s*\{[^}]*grid-template-columns:minmax\(285px,350px\) minmax\(0,1fr\)/s.test(css), 'desktop layout puts a vertical selection panel beside details');
assert(/\.v413-bestiary-grid\s*\{[^}]*flex-direction:column/s.test(css), 'monster selection is a vertical list');
assert(/\.v413-bestiary-art \.monster-miniature-image\s*\{[^}]*object-fit:contain/s.test(css), 'detail miniature is contained and not cropped');
assert(!/v=4\.1\.2/.test(html), 'stale web cache keys are absent');

console.log('Reino de Aethra v4.1.3: lista vertical com nomes, ficha lateral com miniatura, cache e responsividade aprovados.');
