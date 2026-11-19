const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const mapDataSource = fs.readFileSync(path.join(root, 'assets/maps/maps-data.js'), 'utf8');

// Verifica a biblioteca original do mestre, carregada pelo mesmo JS que a aplicação utiliza.
const dataContext = { window: {} };
vm.runInNewContext(mapDataSource, dataContext, { timeout: 1000 });
const maps = dataContext.window.AETHRA_MAP_LIBRARY;
assert.equal(maps.length, 11, 'the imported project contains all eleven tactical maps');
assert(html.indexOf('assets/maps/maps-data.js') < html.indexOf('app.js'), 'map library loads before app.js');
for (const map of maps) {
  assert.equal(map.width, 10, `${map.id} is ten columns wide`);
  assert.equal(map.height, 8, `${map.id} is eight rows high`);
  assert.equal(map.layout.length, 8, `${map.id} has eight layout rows`);
  for (const [rowIndex, row] of map.layout.entries()) {
    assert.equal(row.length, 10, `${map.id} row ${rowIndex + 1} has ten cells`);
  }
  const imagePath = path.join(root, map.image.src.replaceAll('/', path.sep));
  assert(fs.existsSync(imagePath), `${map.id} background image exists`);
  assert(fs.statSync(imagePath).size > 10000, `${map.id} background image is not empty`);
  for (const kind of ['entry', 'exit']) {
    const marker = map.features[kind];
    assert(marker && marker.x >= 0 && marker.x < 10 && marker.y >= 0 && marker.y < 8, `${map.id} has a valid ${kind}`);
  }
  for (const point of map.features.points || []) {
    assert(point.x >= 0 && point.x < 10 && point.y >= 0 && point.y < 8, `${map.id} ${point.name} is inside the board`);
    assert(!'twrhcb'.includes(map.layout[point.y][point.x]), `${map.id} ${point.name} is on walkable terrain`);
    assert(point.name && point.description && point.interaction, `${map.id} ${point.name} has interaction detail`);
  }
  for (const door of map.features.doors || []) {
    assert(door.x >= 0 && door.x < 10 && door.y >= 0 && door.y < 8, `${map.id} ${door.name} is inside the board`);
  }
}

// Exercita as funções de caminho reais do app.js com tabuleiros mínimos controlados.
const posStart = app.indexOf('  function positionFitsFootprint(');
const posEnd = app.indexOf('  function expandedOccupied(', posStart);
const blockedStart = app.indexOf('  function mapCellBlocked(', posEnd);
const blockedEnd = app.indexOf('  function pendingMapMovesFrom(', blockedStart);
assert(posStart >= 0 && posEnd > posStart && blockedStart > posEnd && blockedEnd > blockedStart, 'actual footprint and pathfinding functions are present');
const grid = Array.from({ length: 5 }, () => Array(5).fill('.'));
const context = {
  MAP_WIDTH: 5,
  MAP_HEIGHT: 5,
  grid,
  footprintCells: (x, y, fp = { w: 1, h: 1 }) => {
    const cells = [];
    for (let yy = 0; yy < (fp.h || 1); yy++) for (let xx = 0; xx < (fp.w || 1); xx++) cells.push({ x: x + xx, y: y + yy });
    return cells;
  },
  mapTile: (_id, x, y) => grid[y]?.[x] ?? '#',
  mapTileInfo: code => ({ blocked: 'twrhcb#'.includes(code) }),
  isMaster: () => true,
  mapTokens: () => []
};
const helpers = app.slice(posStart, posEnd) + app.slice(blockedStart, blockedEnd) +
  '\nthis.pathDistance = mapPathDistance; this.cellBlocked = mapCellBlocked;';
vm.runInNewContext(helpers, context, { timeout: 1000 });
assert.equal(context.pathDistance('test', { x: 0, y: 0 }, { x: 1, y: 1 }), 1, 'one open diagonal costs one square');
assert.equal(context.pathDistance('test', { x: 0, y: 0 }, { x: 2, y: 2 }), 2, 'two open diagonals cost two squares');
grid[0][1] = '#';
assert.equal(context.pathDistance('test', { x: 0, y: 0 }, { x: 1, y: 1 }), 2, 'diagonal cannot pass through a single blocked corner; it must route around');
grid[1][0] = '#';
assert.equal(context.pathDistance('test', { x: 0, y: 0 }, { x: 1, y: 1 }), Infinity, 'two blocked side cells prevent diagonal corner cutting');
grid[0][1] = '.'; grid[1][0] = '.';
const closedDoor = { markers: [{ type: 'door', x: 1, y: 1, open: false }] };
assert.equal(context.pathDistance('test', { x: 0, y: 0 }, { x: 1, y: 1 }, [], closedDoor), Infinity, 'closed door blocks movement');
const openDoor = { markers: [{ type: 'door', x: 1, y: 1, open: true }] };
assert.equal(context.pathDistance('test', { x: 0, y: 0 }, { x: 1, y: 1 }, [], openDoor), 1, 'open door passage permits diagonal movement');

// A arte permanece intacta: as casas não caminháveis recebem apenas overlay escuro, sem arte de terreno.
assert(app.includes('mapBoardFeatures(mapId){return AETHRA_IMPORTED_MAPS_BY_ID[mapId]?.features'), 'official imported POIs and doors override fallback data');
assert(!app.includes('const terrainHtml=`<span class="map-terrain-art'), 'terrain icons are not rendered over uploaded map art');
assert(app.includes("${blocked?'blocked':''}"), 'blocked state is still represented per cell');
assert(app.includes('mapImageUrl?`background-image:url(\\\"${mapImageUrl}\\\")`:') && app.includes('new URL(template.image.src,document.baseURI)') && css.includes('background-size:100% 100%'), 'tactical board resolves official full background URLs for GitHub Pages');
assert(css.includes('background:rgba(3,7,10,.68)'), 'blocked cells are darkened without terrain symbols');
assert(app.includes('directions=[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]]'), 'pathfinding evaluates all eight adjacent directions');
assert(app.includes('Diagonais contam como uma casa') && app.includes('dois espaços laterais'), 'movement UI explains diagonal costs and corner restrictions');

console.log('v3.0.3: imported 11 official maps, resolved image assets, blocked overlay and diagonal pathfinding passed.');
