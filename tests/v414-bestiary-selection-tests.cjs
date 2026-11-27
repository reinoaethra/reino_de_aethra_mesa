const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

assert(html.includes('v4.2.4'), 'HTML identifica v4.2.1');
assert(html.includes('app.js?v=4.2.4') && html.includes('styles.css?v=4.2.4'), 'HTML usa cache novo');
assert(html.includes('src="config.js"'), 'config.js permanece referenciado');
assert(app.includes("url.searchParams.set('v','4.2.2')"), 'cache dos mapas é atualizado');
assert(app.includes("monsterMiniaturePath(id)+'?v=4.2.1'"), 'cache das miniaturas é atualizado');
assert(app.includes('assets/monster-art/${slug}.webp?v=4.2.1'), 'cache das artes de combate é atualizado');

const start = app.indexOf('  function renderV41BestiaryModal()');
const end = app.indexOf('  function renderV41JournalModal()', start);
assert(start >= 0 && end > start, 'renderizador do Bestiário existe');
const renderer = app.slice(start, end);
assert(renderer.includes('v414-bestiary-list-panel'), 'lista tem painel próprio');
assert(renderer.includes('v414-bestiary-grid'), 'grade quadrada usa classe dedicada');
assert(renderer.includes('v414-monster-option-wrap'), 'cada criatura tem cartão independente');
assert(renderer.includes('aria-label="Selecionar ${esc(m.name)}"'), 'cada miniatura possui nome acessível');
assert(renderer.includes('title="${esc(m.name)}"'), 'nome aparece como dica ao passar o cursor');
assert(!renderer.includes('v413-monster-option-copy'), 'cartões não exibem texto, apenas miniaturas');
assert(!renderer.includes('v413-monster-option-add'), 'cartões não incluem botão adicional que deforme o quadrado');
assert(renderer.includes('mapMonsterMiniature({templateId:m.id'), 'seleção usa miniatura original da criatura');
assert(renderer.includes('mapMonsterMiniature({templateId:selected.id'), 'ficha usa a mesma miniatura da criatura');
assert(renderer.includes('v414-bestiary-detail'), 'ficha possui painel dedicado');
assert(renderer.includes('v416-bestiary-grid'), 'grade recebe classe de espaçamento v4.2.1');
assert(renderer.includes('v41-bestiary-toggle-encounter'), 'adicionar/remover da composição continua na ficha');
assert(renderer.includes('v41-bestiary-start'), 'iniciar encontro individual continua disponível');
assert(renderer.indexOf('${list}${detail}') >= 0, 'lista é renderizada antes da ficha');
assert(app.includes("state.modal==='v41-bestiary'?'modal wide v413-bestiary-modal'"), 'Bestiário conserva modal amplo');

for (const selector of [
  '.v414-bestiary-layout',
  '.v414-bestiary-list-panel',
  '.v414-bestiary-grid',
  '.v414-monster-option-wrap',
  '.v414-monster-option-thumb',
  '.v414-bestiary-detail',
  '.v416-bestiary-grid',
  '.v415-monster-option-wrap',
  '@media(max-width:760px)',
  '@media(max-width:420px)'
]) assert(css.includes(selector), `regra de layout existe: ${selector}`);
assert(/\.v414-bestiary-grid\s*\{[^}]*display:grid/s.test(css), 'seleção usa grade de miniaturas');
assert(/\.v414-monster-option-wrap\s*\{[^}]*aspect-ratio:1\/1/s.test(css), 'cartões são quadrados');
assert(/\.v414-bestiary-grid\s*\{[^}]*overflow-y:auto/s.test(css), 'seleção tem rolagem independente');
assert(/\.v416-bestiary-grid\s*\{[^}]*gap:16px/s.test(css), 'grade tem espaço confortável entre cartões no desktop');
assert(/@media\(max-width:760px\)\s*\{[^}]*\.v415-bestiary-grid\s*\{gap:13px/s.test(css), 'espaçamento responsivo em tablets e celulares');
assert(/@media\(max-width:420px\)\s*\{[^}]*\.v415-bestiary-grid\s*\{gap:11px/s.test(css), 'espaçamento adequado em telas pequenas');
assert(/\.v414-bestiary-detail\s*\{[^}]*overflow-y:auto/s.test(css), 'ficha tem rolagem independente');
assert(/\.v414-monster-option-thumb \.monster-miniature-image\s*\{[^}]*object-fit:contain/s.test(css), 'miniatura não é cortada');
assert(!/v=4\.1\.3/.test(html + app), 'chaves de cache antigas foram removidas do HTML e JavaScript');

console.log('Reino de Aethra v4.2.1: seleção quadrada com espaçamento ampliado, miniaturas, rolagens independentes e ficha aprovadas.');
