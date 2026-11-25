const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

assert(html.includes('v4.1.2'), 'HTML identifies v4.1.2');
assert(html.includes('app.js?v=4.1.2') && html.includes('styles.css?v=4.1.2'), 'web assets use v4.1.2 cache keys');
assert(html.includes('src="config.js"'), 'Supabase configuration reference is retained');
assert(app.includes("url.searchParams.set('v','4.1.2')"), 'map image cache key is updated');
assert(app.includes("monsterMiniaturePath(id)+'?v=4.1.2'"), 'monster miniature cache key is updated');
assert(app.includes('assets/monster-art/${slug}.webp?v=4.1.2'), 'monster art cache key is updated');

const renderStart = app.indexOf('  function renderV41BestiaryModal()');
const renderEnd = app.indexOf('  function renderV41JournalModal()', renderStart);
assert(renderStart >= 0 && renderEnd > renderStart, 'Bestiary renderer exists');
const renderer = app.slice(renderStart, renderEnd);
assert(renderer.includes('class="v41-bestiary-list-panel"'), 'search and creature grid are grouped into one layout item');
assert(renderer.includes('class="v41-bestiary-detail-main"'), 'selected creature detail has a structured main area');
assert(renderer.indexOf('${list}${detail}') > -1, 'selection list precedes the selected creature detail');
assert(app.includes("state.modal==='v41-bestiary'?'modal wide v412-bestiary-modal'"), 'Bestiary receives the expanded modal style only');

for (const selector of [
  '.modal.wide.v412-bestiary-modal',
  '.v412-bestiary-modal .v41-bestiary-layout',
  '.v412-bestiary-modal .v41-bestiary-list-panel',
  '.v412-bestiary-modal .v41-bestiary-detail',
  '@media(max-width:760px)',
  '@media(max-width:520px)'
]) assert(css.includes(selector), `responsive layout rule exists: ${selector}`);
assert(/\.v412-bestiary-modal \.v41-bestiary-layout\s*\{[^}]*grid-template-columns:minmax\(0,1fr\)/s.test(css), 'list and detail use a single vertical column');
assert(/\.v412-bestiary-modal \.v41-bestiary-grid\s*\{[^}]*max-height:min\(39vh,430px\)/s.test(css), 'creature selection grid has a bounded scroll region');
assert(!/v=4\.1\.1/.test(html), 'stale HTML asset cache key is absent');

console.log('Reino de Aethra v4.1.2: ampliação do modal do Bestiário, agrupamento da grade, ficha abaixo da seleção, cache e responsividade aprovados.');
