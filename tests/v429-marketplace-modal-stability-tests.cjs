const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

assert.match(html, /v4\.2\.9/);
assert.match(app, /function setMarketplaceModalHTML\(service, markup\)\{setModalHTML\(markup,`marketplace:\$\{service\}`\)\}/);
assert.match(app, /function setModalHTML\(markup,explicitKey=null\)/);
assert.match(app, /currentBackdrop&&currentModal&&currentKey===key/);
assert.match(app, /currentModal\.innerHTML!==nextModal\.innerHTML/);
assert.match(app, /const snapshot=modalSnapshot\(currentModal\)/);
assert.match(app, /restoreModalSnapshot\(currentModal,snapshot\)/);
assert.doesNotMatch(app, /modalRoot\.replaceChildren\(template\.content\)/);

const shopFn = app.slice(app.indexOf('function renderShopModal()'), app.indexOf('async function requestTrade('));
const forgeFn = app.slice(app.indexOf('function renderForgeModal()'), app.indexOf('async function requestForge('));
assert.equal((shopFn.match(/setMarketplaceModalHTML\('shop'/g) || []).length, 2);
assert.equal((forgeFn.match(/setMarketplaceModalHTML\('forge'/g) || []).length, 2);
assert.doesNotMatch(shopFn, /modalRoot\.innerHTML=`<div class="modal-backdrop"/);
assert.doesNotMatch(forgeFn, /modalRoot\.innerHTML=`<div class="modal-backdrop"/);
console.log('v4.2.9 marketplace/forge modal stability: passed');
