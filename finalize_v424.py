from pathlib import Path
p=Path('/mnt/data/aethra_v424_work/app.js')
s=p.read_text()
# Version visible in current interface.
s=s.replace('v4.2.3','v4.2.4')
# Replace the D20 shape branch with a more recognizable ten-vertex/triangular-facet projection.
old="""    else{shape=`<polygon class=\"v424-die-face\" points=\"80,5 135,31 155,82 126,137 80,155 34,137 5,82 25,31\"/><path class=\"v424-die-line\" d=\"M80 5 L80 75 L25 31 M80 75 L135 31 M80 75 L155 82 M80 75 L126 137 M80 75 L80 155 M80 75 L34 137 M80 75 L5 82 M25 31 L5 82 L34 137\"/><path class=\"v424-die-line v424-die-fine\" d=\"M135 31 L155 82 L126 137 M25 31 L80 5 L135 31\"/><polygon points=\"80,5 135,31 80,75 25,31\" fill=\"url(#v424-glow-${sides})\" opacity=\".28\"/>`;}
    return `<span class=\"v424-die-art ${extraClass} v424-die-d${sides}\" role=\"img\" aria-label=\"D${sides}, resultado ${n}\"><svg viewBox=\"0 0 160 160\" aria-hidden=\"true\">${common}${shape}<text class=\"v424-die-number\" x=\"80\" y=\"91\" text-anchor=\"middle\">${n}</text><text class=\"v424-die-mark\" x=\"80\" y=\"116\" text-anchor=\"middle\">${sides===20?'AETHRA':`D${sides}`}</text></svg></span>`;
"""
new="""    else if(sides===20){shape=`<polygon class=\"v424-die-face\" points=\"80,4 126,15 155,53 151,100 119,143 80,157 41,143 9,100 5,53 34,15\"/><path class=\"v424-die-line\" d=\"M80 4 L80 82 L126 15 M80 82 L155 53 M80 82 L151 100 M80 82 L119 143 M80 82 L80 157 M80 82 L41 143 M80 82 L9 100 M80 82 L5 53 M80 82 L34 15 M80 82 L126 15\"/><path class=\"v424-die-line v424-die-fine\" d=\"M34 15 L5 53 L9 100 L41 143 M126 15 L155 53 L151 100 L119 143\"/><polygon points=\"80,4 126,15 80,82 34,15\" fill=\"url(#v424-glow-${sides})\" opacity=\".3\"/>`;}
    return `<span class=\"v424-die-art ${extraClass} v424-die-d${sides}\" role=\"img\" aria-label=\"D${sides}, resultado ${n}\"><svg viewBox=\"0 0 160 160\" aria-hidden=\"true\">${common}${shape}${sides===20?'<g class=\"v424-die-side-numbers\"><text x=\"80\" y=\"28\" text-anchor=\"middle\">12</text><text x=\"132\" y=\"61\" text-anchor=\"middle\">8</text><text x=\"119\" y=\"132\" text-anchor=\"middle\">14</text><text x=\"41\" y=\"132\" text-anchor=\"middle\">3</text><text x=\"28\" y=\"61\" text-anchor=\"middle\">17</text></g>':''}<text class=\"v424-die-number\" x=\"80\" y=\"91\" text-anchor=\"middle\">${n}</text><text class=\"v424-die-mark\" x=\"80\" y=\"116\" text-anchor=\"middle\">${sides===20?'AETHRA':`D${sides}`}</text></svg></span>`;
"""
if old not in s:
    raise SystemExit('D20 shape source block was not found')
s=s.replace(old,new,1)
# Use lighter backdrop and add extra player error handling for YouTube.
s=s.replace("events:{onReady:event=>{if(state.musicYoutube!==record)return;record.player=event.target;record.ready=true;record.resolveReady(record.player);positionMusicYoutubeHost();applyMusicVolume();syncCampaignMusic(true).catch(err=>console.warn('Sincronização do vídeo falhou.',err));},onStateChange:event=>{if(event.data===YT.PlayerState.ENDED&&isMaster()&&isMasterController())musicNextTrack(false).catch(err=>toast(err.message,'error'));},onError:event=>{record.error=event.data;record.resolveReady(null);toast(event.data===101||event.data===150?'Este vídeo não permite reprodução incorporada. Escolha outro vídeo do YouTube.':'O YouTube não conseguiu reproduzir esta faixa.','error');}}});",
"events:{onReady:event=>{if(state.musicYoutube!==record)return;record.player=event.target;record.ready=true;record.resolveReady(record.player);positionMusicYoutubeHost();applyMusicVolume();syncCampaignMusic(true).catch(err=>console.warn('Sincronização do vídeo falhou.',err));},onStateChange:event=>{if(event.data===YT.PlayerState.ENDED&&isMaster()&&isMasterController())musicNextTrack(false).catch(err=>toast(err.message,'error'));},onAutoplayBlocked:()=>{state.musicActivated=false;applyMusicVolume();toast('O navegador bloqueou a reprodução automática. Clique em “Ativar música neste dispositivo” e depois em Reproduzir.');},onError:event=>{record.error=event.data;record.resolveReady(null);const message=event.data===101||event.data===150?'Este vídeo não permite reprodução incorporada. Escolha outro vídeo do YouTube.':event.data===100?'Este vídeo foi removido ou está privado.':event.data===153?'O YouTube não recebeu a identificação de origem necessária. Recarregue o site e tente novamente.':'O YouTube não conseguiu reproduzir esta faixa.';toast(message,'error');}}});",1)
# Rework YouTube player reuse to safely wait for a player while it initializes, then cue the newly selected track.
start=s.index('  async function ensureMusicYoutubePlayer(track){')
end=s.index('  function hideMusicYoutubeHost()', start)
new_func="""  async function ensureMusicYoutubePlayer(track){
    const videoId=track?.youtubeId||extractYouTubeVideoId(track?.url);if(!videoId)throw new Error('Este link do YouTube não contém um vídeo válido.');
    const host=ensureMusicYoutubeHost();positionMusicYoutubeHost();
    const cueExisting=record=>{if(!record?.player||!record.ready)return null;if(record.videoId!==videoId){record.player.cueVideoById({videoId,startSeconds:0});record.videoId=videoId;record.trackId=track.id;record.error=null;}return record.player};
    let record=state.musicYoutube;
    if(record?.player&&!record.ready){
      const ready=await Promise.race([record.readyPromise||Promise.resolve(null),new Promise(resolve=>setTimeout(()=>resolve(null),12000))]);
      record=state.musicYoutube;
      if(!ready&&record?.player&&!record.ready){try{record.player.destroy()}catch{}if(state.musicYoutube===record)state.musicYoutube=null;record=null;}
    }
    if(record?.player&&record.ready){if(record.error&&record.videoId===videoId)throw new Error('Este vídeo do YouTube não pode ser reproduzido nesta incorporação. Escolha outra faixa.');const reused=cueExisting(record);if(reused){positionMusicYoutubeHost();return reused}}
    const YT=await loadYouTubeIframeAPI();
    // Outra sincronização pode ter criado o player enquanto a API carregava.
    record=state.musicYoutube;
    if(record?.player&&!record.ready){const ready=await Promise.race([record.readyPromise||Promise.resolve(null),new Promise(resolve=>setTimeout(()=>resolve(null),12000))]);record=state.musicYoutube;if(!ready&&record?.player&&!record.ready){try{record.player.destroy()}catch{}if(state.musicYoutube===record)state.musicYoutube=null;record=null;}}
    if(record?.player&&record.ready){if(record.error&&record.videoId===videoId)throw new Error('Este vídeo do YouTube não pode ser reproduzido nesta incorporação. Escolha outra faixa.');const reused=cueExisting(record);if(reused){positionMusicYoutubeHost();return reused}}
    if(state.musicYoutube?.player){try{state.musicYoutube.player.destroy()}catch{}state.musicYoutube=null;}
    if(!host.isConnected)ensureMusicYoutubeHost();
    const frame=document.getElementById('aethra-youtube-player-frame');if(!frame)throw new Error('Não foi possível preparar o espaço do player do YouTube.');
    let resolveReady;const readyPromise=new Promise(resolve=>{resolveReady=resolve});
    record={player:null,videoId,trackId:track.id,ready:false,readyPromise,resolveReady,error:null};state.musicYoutube=record;
    const slot=document.querySelector('.music-youtube-slot'),rect=slot?.getBoundingClientRect();const width=Math.max(200,Math.round(rect?.width||360)),height=Math.max(200,Math.round(rect?.height||220));
    record.player=new YT.Player('aethra-youtube-player-frame',{width,height,videoId,playerVars:{autoplay:0,controls:0,disablekb:1,enablejsapi:1,playsinline:1,rel:0,modestbranding:1,iv_load_policy:3,origin:location.origin},events:{onReady:event=>{if(state.musicYoutube!==record)return;record.player=event.target;record.ready=true;record.resolveReady(record.player);positionMusicYoutubeHost();applyMusicVolume();syncCampaignMusic(true).catch(err=>console.warn('Sincronização do vídeo falhou.',err));},onStateChange:event=>{if(event.data===YT.PlayerState.ENDED&&isMaster()&&isMasterController())musicNextTrack(false).catch(err=>toast(err.message,'error'));},onAutoplayBlocked:()=>{state.musicActivated=false;applyMusicVolume();toast('O navegador bloqueou a reprodução automática. Clique em “Ativar música neste dispositivo” e depois em Reproduzir.');},onError:event=>{record.error=event.data;record.resolveReady(null);const message=event.data===101||event.data===150?'Este vídeo não permite reprodução incorporada. Escolha outro vídeo do YouTube.':event.data===100?'Este vídeo foi removido ou está privado.':event.data===153?'O YouTube não recebeu a identificação de origem necessária. Recarregue o site e tente novamente.':'O YouTube não conseguiu reproduzir esta faixa.';toast(message,'error');}}});
    positionMusicYoutubeHost();
    return Promise.race([readyPromise,new Promise(resolve=>setTimeout(()=>resolve(null),12000))]);
  }
"""
s=s[:start]+new_func+s[end:]
# Avoid polling failed embeds continuously and keep error feedback in the current slot.
s=s.replace("    if(track?.source==='youtube'){\n      audio.pause();", "    if(track?.source==='youtube'){\n      if(state.musicYoutube?.videoId===(track.youtubeId||extractYouTubeVideoId(track.url))&&state.musicYoutube?.error)return;\n      audio.pause();",1)
# Group volume and add controls together.
old_markup='''<label class="music-volume-control">Volume geral <input type="range" min="0" max="100" value="${Math.round(m.globalVolume*100)}" data-music-global-volume ${canControl?'':'disabled'}></label><div class="music-add-controls"><button class="btn btn-secondary btn-small" data-action="music-upload" ${canControl?'':'disabled'}>＋ Arquivo</button><button class="btn btn-quiet btn-small" data-action="music-add-link" ${canControl?'':'disabled'}>＋ Link de áudio</button><button class="btn btn-quiet btn-small" data-action="music-add-youtube" ${canControl?'':'disabled'}>＋ YouTube</button><input id="music-file-input" type="file" accept="audio/*,.mp3,.ogg,.wav,.m4a,.aac,.flac,.opus" multiple hidden></div>'''
new_markup='''<div class="music-volume-add-row"><label class="music-volume-control">Volume geral <input type="range" min="0" max="100" value="${Math.round(m.globalVolume*100)}" data-music-global-volume ${canControl?'':'disabled'}></label><div class="music-add-controls"><button class="btn btn-secondary btn-small" data-action="music-upload" ${canControl?'':'disabled'}>＋ Arquivo</button><button class="btn btn-quiet btn-small" data-action="music-add-link" ${canControl?'':'disabled'}>＋ Link</button><button class="btn btn-quiet btn-small" data-action="music-add-youtube" ${canControl?'':'disabled'}>＋ YouTube</button><input id="music-file-input" type="file" accept="audio/*,.mp3,.ogg,.wav,.m4a,.aac,.flac,.opus" multiple hidden></div></div>'''
if old_markup not in s: raise SystemExit('music volume/add markup not found')
s=s.replace(old_markup,new_markup,1)
p.write_text(s)

# CSS tweaks to reduce compositing cost and provide three visible music rows.
cssp=Path('/mnt/data/aethra_v424_work/styles.css')
css=cssp.read_text()
css += """
/* v4.2.4 — animações de dados facetados e central musical otimizada. */
.dice-overlay.v424-dice-overlay{backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);background:rgba(4,8,14,.9);contain:layout paint}
.v424-roll-stage{contain:layout paint;isolation:isolate}
.v424-die-flight{backface-visibility:hidden;transform:translateZ(0);animation-duration:1.02s}
.v424-die-art{backface-visibility:hidden}
.v424-die-side-numbers{fill:#d7bd88;stroke:#352817;stroke-width:1.1;paint-order:stroke;font-family:Cinzel,Georgia,serif;font-size:12px;font-weight:800;opacity:.96}
.v424-die-d20 .v424-die-side-numbers{filter:drop-shadow(0 1px 1px rgba(0,0,0,.65))}
.v424-universal-die{backface-visibility:hidden;animation-duration:.72s}
.music-volume-add-row{display:flex;align-items:center;gap:10px;flex:1 1 410px;min-width:0;flex-wrap:wrap}
.campaign-music-panel .music-volume-add-row .music-volume-control{flex:0 1 185px;min-width:150px;max-width:185px}
.campaign-music-panel .music-volume-add-row .music-add-controls{display:flex;align-items:center;gap:7px;flex:1 1 220px;min-width:0;flex-wrap:wrap;margin-left:0}
.campaign-music-panel .music-volume-add-row .music-add-controls .btn{white-space:nowrap}
.music-playlist-scroll{min-height:160px;max-height:174px}
@media(max-width:760px){
  .music-volume-add-row{flex:1 1 100%}
  .campaign-music-panel .music-volume-add-row .music-add-controls{flex:1 1 100%}
}
@media(max-width:620px){
  .campaign-music-panel .music-volume-add-row .music-volume-control{flex:1 1 100%;max-width:none}
  .campaign-music-panel .music-volume-add-row .music-add-controls{flex:1 1 100%}
  .campaign-music-panel .music-volume-add-row .music-add-controls .btn{flex:1 1 auto}
  .music-playlist-scroll{min-height:160px;max-height:174px}
}
@media(prefers-reduced-motion:reduce){
  .v424-die-flight,.v424-universal-die{animation:none!important;transform:none!important;will-change:auto!important}
}
"""
cssp.write_text(css)
