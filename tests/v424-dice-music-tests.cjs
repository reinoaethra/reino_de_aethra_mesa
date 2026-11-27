const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const sql = fs.readFileSync(path.join(root, 'supabase-migration-v4.2.1.sql'), 'utf8');

// Release and cache version.
assert(html.includes('v4.2.5'), 'HTML identifies v4.2.5');
assert(html.includes('styles.css?v=4.2.5') && html.includes('app.js?v=4.2.5'), 'site assets use v4.2.5 cache keys');

// D20 and universal dice visuals.
assert(app.includes('function v424DieMarkup(sides,value,extraClass=\'\')'), 'single reusable SVG die renderer exists');
assert(app.includes('v424-die-side-numbers') && app.includes('80,4 126,15 155,53'), 'D20 shows multiple triangular facets and face markings');
assert(app.includes('function showDice(result,player)'), 'D20 animation helper exists');
assert(app.includes('v424-die-flight') && app.includes('TESTE DE D20'), 'public D20 animation has a rolling die and result overlay');
assert(app.includes('function showUniversalDice(result)'), 'universal dice overlay exists');
assert(app.includes('v424-universal-dice-grid') && app.includes('v424DieMarkup(result.sides,value)'), 'universal roller displays individual dice with matching shape');
assert(app.includes("ev.event_type==='session_note'&&ev.payload?.kind==='dice-roll'"), 'public universal dice events animate on receiving clients');
assert(app.includes("visibility==='master'"), 'private universal rolls remain reserved to the master');
assert(css.includes('@keyframes v424-die-flight') && css.includes('@keyframes v424-universal-die-in'), 'dice animations are implemented in CSS');
assert(css.includes('backdrop-filter:blur(2px)') && css.includes('transform:translateZ(0)'), 'new roll overlay reduces blur/compositing cost');
assert(css.includes('@media(prefers-reduced-motion:reduce)') && css.includes('.v424-universal-die'), 'reduced-motion preference is respected');

// Music panel layout.
assert(app.includes('music-volume-add-row'), 'master volume and add controls share one row container');
assert(app.includes('data-action="music-upload"') && app.includes('data-action="music-add-link"') && app.includes('data-action="music-add-youtube"'), 'file, direct audio and YouTube add actions are available beside volume');
assert(app.includes('music-playlist-scroll') && app.includes('role="list"'), 'playlist has its own scroll container');
assert(css.includes('.music-playlist-scroll{min-height:160px;max-height:174px'), 'playlist keeps a stable height for at least three tracks');
assert(css.includes('overflow-y:auto') && css.includes('overscroll-behavior:contain'), 'playlist scrolling is independent');

// YouTube embed uses the official iframe API, not an audio stream extractor.
assert(app.includes('function extractYouTubeVideoId(value)'), 'YouTube URL parsing exists');
assert(app.includes("url.protocol!=='https:'"), 'YouTube links require HTTPS');
assert(app.includes("host==='youtu.be'") && app.includes("['youtube.com','youtube-nocookie.com'].includes(host)"), 'standard YouTube link formats are supported');
assert(app.includes("/^[A-Za-z0-9_-]{11}$/"), 'video IDs are validated');
assert(app.includes('https://www.youtube.com/iframe_api') && app.includes('new YT.Player('), 'official YouTube IFrame Player API is used');
assert(app.includes('cueVideoById') && app.includes('loadVideoById') && app.includes('playVideo()') && app.includes('pauseVideo()'), 'YouTube player follows shared track and transport state');
assert(app.includes('setVolume(Math.round(m.globalVolume*musicLocalVolume()*100))'), 'YouTube obeys master and per-device volume');
assert(app.includes('onAutoplayBlocked'), 'blocked autoplay is reported to the user');
assert(app.includes('event.data===101||event.data===150'), 'videos that disallow embedding are handled');
assert(app.includes("source:'youtube'"), 'YouTube playlist entries retain a distinct source type');
assert(app.includes('youtubeId'), 'YouTube video ID is stored in the shared playlist state');
assert(app.includes('music-youtube-form') && app.includes('music-add-youtube'), 'YouTube add modal and submit handler are wired');
assert(app.includes('A reprodução pode exigir que cada participante clique em “Ativar música neste dispositivo”'), 'browser audio activation is explained');
assert(app.includes("track?.source==='youtube'"), 'sync routine handles embedded video tracks separately from HTML audio');
assert(sql.includes("'session_note'"), 'public dice roll log reuses existing session_note event; no new event type required');
console.log('v4.2.5 dice and music: SVG facet dice, public/private animation, reduced-motion, compact playlist, YouTube embed and synchronized audio controls approved.');
