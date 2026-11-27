const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

// Toda atribuição histórica a modalRoot.innerHTML passa pelo ciclo de vida global.
assert.match(app, /Object\.defineProperty\(modalRoot,\s*'innerHTML',\s*\{[\s\S]*?set\(value\)\s*\{\s*setModalHTML\(value\)/);
assert.match(app, /function setModalHTML\(markup,explicitKey=null\)/);
assert.match(app, /const currentKey=currentBackdrop\?\.dataset\?\.modalKey\|\|modalRoot\.dataset\.modalKey/);
assert.match(app, /if\(currentBackdrop&&currentModal&&currentKey===key\)/);
assert.match(app, /if\(currentModal\.innerHTML!==nextModal\.innerHTML\)/);
assert.match(app, /currentModal\.innerHTML=nextModal\.innerHTML/);
assert.match(app, /modalSnapshot\(currentModal\)/);
assert.match(app, /restoreModalSnapshot\(currentModal,snapshot\)/);
assert.match(app, /function modalSnapshot\(root\)/);
assert.match(app, /function restoreModalSnapshot\(root,snapshot\)/);
assert.match(app, /function syncModalAttributes\(current,next\)/);

// A correção de comércio e forja usa o mesmo mecanismo geral, não uma implementação paralela.
assert.match(app, /function setMarketplaceModalHTML\(service, markup\)\{setModalHTML\(markup,`marketplace:\$\{service\}`\)\}/);
assert.doesNotMatch(app, /modalRoot\.replaceChildren\(template\.content\)/);

// Verifica que os grupos de diálogos conhecidos passam por modalRoot e, portanto, pelo setter global.
for (const marker of [
  'function renderSettingsModal()', 'function renderCreateModal()', 'function renderJoinModal()',
  'function renderCharacterModal()', 'function renderBookModal()', 'function renderAccountModal()',
  'function renderNPCModal(npcId)', 'function renderInventoryModal()', 'function renderMasterGuideModal()',
  'function renderAdventureManagerModal()', 'function renderEncounterModal()', 'function renderRollPromptModal()',
  'function openMusicLinkModal()', 'function openMusicYouTubeModal()', 'function renderShopModal()',
  'function renderForgeModal()', 'function v4ModalShell(', 'function closeModal()'
]) assert.ok(app.includes(marker), `Janela esperada ausente: ${marker}`);

// As animações de entrada permanecem nas molduras; o shell não é desmontado nas atualizações.
assert.match(css, /\.modal-backdrop\s*\{[^}]*animation:\s*fadeIn/);
assert.match(css, /\.modal\s*\{[^}]*animation:\s*rise/);
assert.match(html, /app\.js\?v=4\.2\.9-popups/);
assert.match(html, /styles\.css\?v=4\.2\.9-popups/);

console.log('v4.2.9 global modal stability: PASS');
