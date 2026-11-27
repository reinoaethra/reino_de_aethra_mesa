const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const sql = fs.readFileSync(path.join(root, 'supabase-migration-v4.2.1.sql'), 'utf8');

// Release and cache version.
assert(html.includes('v4.2.6'), 'HTML identifies v4.2.6');
assert(html.includes('styles.css?v=4.2.6') && html.includes('app.js?v=4.2.6'), 'site assets use v4.2.6 cache keys');

// 3D dice experience (detailed checks live in v426-3d-dice-tests.cjs).
assert(app.includes('function showDice(result,player,eventId)'), 'D20 uses the 3D animation entry point');
assert(app.includes('function showUniversalDice(result,eventId)'), 'universal roller uses the 3D animation entry point');
assert(app.includes('launchAethraDice3D(overlay,'), 'public and private rolls launch the 3D stage');
assert(app.includes('dice3DFallback('), 'a readable fallback is provided when WebGL/CDN is unavailable');
assert(app.includes("visibility==='master'"), 'private universal rolls remain reserved to the master');
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
console.log('v4.2.6 dice and music: 3D animation integration, public/private visibility, compact playlist, YouTube embed and synchronized audio controls approved.');
