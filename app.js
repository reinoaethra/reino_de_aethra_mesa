/* Reino de Aethra v0.4 — combate por turnos, iniciativa, equipamentos e progressão básica.
 * Modo local funciona sem backend. Para salas reais, configure Supabase e aplique o schema/migration.
 */
(() => {
  'use strict';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const app = $('#app'), modalRoot = $('#modal-root'), toastRoot = $('#toast-root');
  const KEYS = { config:'aethra.supabase.config.v1', local:'aethra.local.campaigns.v1', active:'aethra.active.campaign.v1' };
  const BOOKS = [
    {id:'master',icon:'♛',title:'Livro do Mestre',subtitle:'Guia reservado',desc:'A campanha completa, segredos, capítulos, NPCs, revelações, encontros e orientações para conduzir a narrativa.',access:'Mestre'},
    {id:'bestiary',icon:'♞',title:'Bestiário de Aethra',subtitle:'Criaturas e monstros',desc:'Criaturas comuns, monstros mágicos, mortos-vivos, demônios, atributos, comportamentos e habilidades.',access:'Todos'},
    {id:'bosses',icon:'♜',title:'Os Grandes Chefes',subtitle:'Inimigos lendários',desc:'Chefes de masmorras, generais, dragões ancestrais, fases de batalha e ações lendárias.',access:'Todos'},
    {id:'atlas',icon:'✥',title:'Atlas dos Cinco Reinos',subtitle:'Mundo e localidades',desc:'Geografia, cidades, vilas, fortalezas, rotas, regiões descobertas e mapas de Aethra.',access:'Todos'},
    {id:'grimoire',icon:'✧',title:'Grimório das Artes Arcanas',subtitle:'Magias e habilidades',desc:'Escolas mágicas, feitiços, requisitos, efeitos, custos e regras de utilização.',access:'Todos'},
    {id:'arsenal',icon:'⚔',title:'Arsenal e Relíquias',subtitle:'Equipamentos e tesouros',desc:'Armas, armaduras, acessórios, poções, raridades, artefatos e itens especiais.',access:'Todos'},
    {id:'adventurer',icon:'⚒',title:'Manual do Aventureiro',subtitle:'Regras para jogadores',desc:'Criação de personagens, atributos, raças, classes, testes, combate, exploração e interpretação.',access:'Todos'}
  ];
  const REALMS = [
    {id:'eldoria',name:'Eldoria',subtitle:'Reino da Natureza',element:'Natureza',desc:'Florestas ancestrais, cidades élficas e guardiões da vida.',bonus:'Afinidade com cura e sobrevivência',emoji:'🌿',className:'realm-eldoria'},
    {id:'drakmor',name:'Drakmor',subtitle:'Reino das Chamas',element:'Fogo',desc:'Montanhas vulcânicas, fortalezas e forjas lendárias.',bonus:'Afinidade com força e resistência',emoji:'🔥',className:'realm-drakmor'},
    {id:'niveria',name:'Nivéria',subtitle:'Reino do Gelo',element:'Gelo',desc:'Terras congeladas, bibliotecas e cidades de cristal.',bonus:'Afinidade com conhecimento e controle',emoji:'❄️',className:'realm-niveria'},
    {id:'thalassor',name:'Thalassor',subtitle:'Reino das Marés',element:'Água',desc:'Ilhas, cidades portuárias e templos submersos.',bonus:'Afinidade com proteção e adaptação',emoji:'🌊',className:'realm-thalassor'},
    {id:'solaria',name:'Solária',subtitle:'Reino da Luz',element:'Luz',desc:'Desertos dourados, templos solares e cidades antigas.',bonus:'Afinidade com luz e determinação',emoji:'☀️',className:'realm-solaria'}
  ];
  const RACES = [
    ['Humano','Versátil e determinado. Adapta-se a diferentes caminhos.'],['Elfo','Ágil, observador e ligado à magia natural.'],['Anão','Resistente, tradicional e habilidoso com forja.'],['Draconato','Descendente de sangue dracônico, com presença imponente.'],['Meio-elfo','Combina adaptabilidade humana e percepção élfica.'],['Orc','Forte, resiliente e guiado por tradições próprias.'],['Fada','Pequeno povo feérico, com afinidade pelo extraordinário.'],['Ser celestial','Descendente de uma linhagem tocada por forças divinas.']
  ];
  const CLASSES = [
    ['Guerreiro','Combate físico, armas, defesa e resistência.','⚔'],['Arcano','Magia, energia, conhecimento e controle.','✧'],['Patrulheiro','Arco, precisão, rastreamento e exploração.','➶'],['Paladino','Proteção, juramentos e poder sagrado.','✥'],['Assassino','Furtividade, mobilidade e golpes precisos.','☾'],['Clérigo','Cura, proteção espiritual e suporte.','✚'],['Druida','Natureza, transformação e forças selvagens.','❧'],['Invocador','Entidades, vínculos e criaturas conjuradas.','◈']
  ];
  const ATTRS = [
    ['forca','Força','Potência física, ataques corpo a corpo e carga.'],['destreza','Destreza','Agilidade, precisão, reflexos e furtividade.'],['constituicao','Constituição','Resistência, vigor e capacidade de suportar dano.'],['inteligencia','Inteligência','Conhecimento, raciocínio e domínio arcano.'],['sabedoria','Sabedoria','Percepção, intuição e leitura do ambiente.'],['carisma','Carisma','Presença, liderança e influência social.']
  ];
  // Regras básicas v0.4. Valores iniciais são simples e foram pensados para a primeira campanha de teste.
  const CLASS_RULES = {
    Guerreiro:{attackAttribute:'forca',abilityId:'golpe-poderoso',abilityName:'Golpe Poderoso',abilityDescription:'Um golpe pesado que acrescenta 1d8 de dano ao ataque.',abilityDie:8,abilityAttackBonus:0},
    Arcano:{attackAttribute:'inteligencia',abilityId:'explosao-arcana',abilityName:'Explosão Arcana',abilityDescription:'Canaliza energia arcana e acrescenta 1d8 de dano ao ataque.',abilityDie:8,abilityAttackBonus:1},
    Patrulheiro:{attackAttribute:'destreza',abilityId:'flecha-certeira',abilityName:'Flecha Certeira',abilityDescription:'Um disparo preciso com +2 no teste de ataque e 1d6 extra.',abilityDie:6,abilityAttackBonus:2},
    Paladino:{attackAttribute:'forca',abilityId:'golpe-radiante',abilityName:'Golpe Radiante',abilityDescription:'Um golpe sagrado que acrescenta 1d8 de dano.',abilityDie:8,abilityAttackBonus:0},
    Assassino:{attackAttribute:'destreza',abilityId:'ataque-das-sombras',abilityName:'Ataque das Sombras',abilityDescription:'Um ataque furtivo com +2 no teste e 1d8 extra.',abilityDie:8,abilityAttackBonus:2},
    Clérigo:{attackAttribute:'sabedoria',abilityId:'luz-restauradora',abilityName:'Luz Restauradora',abilityDescription:'Recupera 1d8 + modificador de Sabedoria de seus pontos de vida.',abilityDie:8,abilityAttackBonus:0,healing:true},
    Druida:{attackAttribute:'sabedoria',abilityId:'raizes-ancestrais',abilityName:'Raízes Ancestrais',abilityDescription:'Raízes mágicas ferem o alvo com 1d8 extra.',abilityDie:8,abilityAttackBonus:1},
    Invocador:{attackAttribute:'inteligencia',abilityId:'espirito-guardiao',abilityName:'Espírito Guardião',abilityDescription:'Uma entidade aliada acrescenta 1d8 de dano ao ataque.',abilityDie:8,abilityAttackBonus:0}
  };
  const STARTER_KITS = {
    Guerreiro:{weapon:{id:'espada-ferro',name:'Espada de Ferro',kind:'weapon',damageDie:8,accuracy:0,description:'Arma confiável de combate corpo a corpo.'},armor:{id:'cota-couro',name:'Cota de Couro Reforçado',kind:'armor',defense:2,description:'Proteção leve reforçada.'},shield:{id:'escudo-madeira',name:'Escudo de Madeira',kind:'shield',defense:1,description:'Ajuda a aparar golpes.'}},
    Arcano:{weapon:{id:'cajado-carvalho',name:'Cajado de Carvalho',kind:'weapon',damageDie:6,accuracy:1,description:'Canaliza energia arcana.'},armor:{id:'manto-aprendiz',name:'Manto de Aprendiz',kind:'armor',defense:1,description:'Manto reforçado para viagens.'}},
    Patrulheiro:{weapon:{id:'arco-caca',name:'Arco de Caça',kind:'weapon',damageDie:8,accuracy:1,description:'Arco leve e preciso.'},armor:{id:'armadura-couro',name:'Armadura de Couro',kind:'armor',defense:2,description:'Permite movimentação silenciosa.'}},
    Paladino:{weapon:{id:'macua-aco',name:'Maça de Aço',kind:'weapon',damageDie:6,accuracy:0,description:'Arma consagrada.'},armor:{id:'cota-paladina',name:'Cota Reforçada',kind:'armor',defense:3,description:'Armadura resistente.'},shield:{id:'escudo-solar',name:'Escudo Solar',kind:'shield',defense:1,description:'Escudo com o símbolo do sol.'}},
    Assassino:{weapon:{id:'adagas-duplas',name:'Adagas Gêmeas',kind:'weapon',damageDie:6,accuracy:1,description:'Duas lâminas leves.'},armor:{id:'couro-sombrio',name:'Couro Sombrio',kind:'armor',defense:2,description:'Proteção discreta.'}},
    Clérigo:{weapon:{id:'martelo-devoto',name:'Martelo do Devoto',kind:'weapon',damageDie:6,accuracy:0,description:'Arma simples de defesa.'},armor:{id:'vestes-consagradas',name:'Vestes Consagradas',kind:'armor',defense:1,description:'Vestes resistentes e confortáveis.'}},
    Druida:{weapon:{id:'cajado-raizes',name:'Cajado das Raízes',kind:'weapon',damageDie:6,accuracy:1,description:'Cajado de madeira viva.'},armor:{id:'manto-folhas',name:'Manto de Folhas',kind:'armor',defense:1,description:'Vestimenta ligada à natureza.'}},
    Invocador:{weapon:{id:'cetro-vinculo',name:'Cetro de Vínculo',kind:'weapon',damageDie:6,accuracy:1,description:'Foco para canalizar entidades.'},armor:{id:'manto-vinculador',name:'Manto do Vinculador',kind:'armor',defense:1,description:'Manto com bolsos para componentes.'}}
  };
  const MONSTERS = [
    {id:'goblin-cinzas',name:'Goblin das Cinzas',kind:'Humanoide corrompido',level:1,defense:12,hp:42,maxHp:42,attackBonus:3,damageDie:6,damageBonus:1,initiativeBonus:2,threat:'CRIATURA COMUM',xpReward:25,emoji:'👺',specialName:'Golpe oportunista',specialDescription:'Se agir primeiro, recebe +1 no ataque.'},
    {id:'lobo-cinzento',name:'Lobo Cinzento',kind:'Fera selvagem',level:2,defense:13,hp:58,maxHp:58,attackBonus:4,damageDie:8,damageBonus:1,initiativeBonus:3,threat:'AMEAÇA MODERADA',xpReward:40,emoji:'🐺',specialName:'Mordida dilacerante',specialDescription:'Em um 18 ou mais no D20, causa +1d6 de dano.'},
    {id:'drakthar',name:'Drakthar, o Devorador',kind:'Dragão ancestral',level:8,defense:18,hp:720,maxHp:720,attackBonus:8,damageDie:10,damageBonus:4,initiativeBonus:3,threat:'CHEFE · AMEAÇA EXTREMA',xpReward:250,emoji:'🐉',specialName:'Sopro das Cinzas',specialDescription:'Uma vez por encontro, pode atingir todos os heróis com 2d8 + 4 de dano.'}
  ];
  function secureDie(sides){const a=new Uint32Array(1);const limit=Math.floor(4294967296/sides)*sides;let x;do{crypto.getRandomValues(a);x=a[0]}while(x>=limit);return (x%sides)+1}
  function rollDamageDie(sides,count=1){let total=0;for(let i=0;i<count;i++)total+=secureDie(sides);return total}
  function attrMod(score){return Math.floor(((Number(score)||1)-4)/2)}
  function classRule(character){return CLASS_RULES[character?.class]||CLASS_RULES.Guerreiro}
  function starterInventory(){return [{id:'pocao-cura',name:'Poção de Cura',kind:'consumable',qty:2,healDie:8,healBonus:2,description:'Recupera 1d8 + 2 pontos de vida.'},{id:'racao-viagem',name:'Rações de Viagem',kind:'utility',qty:3,description:'Alimento para uma jornada.'}]}
  function normalizeCharacter(character){
    const c=JSON.parse(JSON.stringify(character||newCharacterDraft()));
    c.level=Math.max(1,Number(c.level)||1);c.xp=Math.max(0,Number(c.xp)||0);
    c.attributes=c.attributes||{forca:5,destreza:4,constituicao:5,inteligencia:3,sabedoria:4,carisma:3};
    const kit=STARTER_KITS[c.class]||STARTER_KITS.Guerreiro;
    c.equipment=c.equipment||{weapon:kit.weapon,armor:kit.armor,shield:kit.shield||null};
    c.inventory=Array.isArray(c.inventory)?c.inventory:starterInventory();
    if(!c.inventory.some(x=>x.id==='pocao-cura'))c.inventory.push({id:'pocao-cura',name:'Poção de Cura',kind:'consumable',qty:2,healDie:8,healBonus:2,description:'Recupera 1d8 + 2 pontos de vida.'});
    const constitution=Number(c.attributes.constituicao)||4;
    c.maxHp=Math.max(1,Number(c.maxHp)||20+constitution*2);
    c.hp=Math.max(0,Math.min(c.maxHp,Number.isFinite(Number(c.hp))?Number(c.hp):c.maxHp));
    c.defense=10+attrMod(c.attributes.destreza)+(Number(c.equipment.armor?.defense)||0)+(Number(c.equipment.shield?.defense)||0);
    c.ability=classRule(c).abilityName;
    return c;
  }
  function currentPartyVitals(userId,character){
    const c=normalizeCharacter(character);const ps=state.campaign?.game_state?.partyState?.[userId]||{};
    return {hp:Math.max(0,Math.min(Number(ps.maxHp)||c.maxHp,Number.isFinite(Number(ps.hp))?Number(ps.hp):c.hp)),maxHp:Number(ps.maxHp)||c.maxHp,defense:Number(ps.defense)||c.defense,inventory:Array.isArray(ps.inventory)?ps.inventory:c.inventory,abilityUsed:!!ps.abilityUsed};
  }
  function activeCombatTurn(encounter){return encounter?.turnOrder?.[Number(encounter.turnIndex)||0]||null}
  function isPlayersCombatTurn(){const turn=activeCombatTurn(state.campaign?.game_state?.encounter);return !!turn&&turn.kind==='player'&&turn.user_id===currentUserId()}
  function advanceCombatTurn(encounter){const order=encounter.turnOrder||[];if(!order.length)return {...encounter,turnIndex:0,round:(encounter.round||1)+1};let index=(Number(encounter.turnIndex)||0)+1,round=Number(encounter.round)||1;if(index>=order.length){index=0;round++}return {...encounter,turnIndex:index,round}}
  function buildTurnOrder(encounter,members){
    const order=[];
    members.filter(m=>m.role==='player'&&m.character).forEach(m=>{const c=normalizeCharacter(m.character);order.push({kind:'player',user_id:m.user_id,name:c.name||m.display_name,initiative:secureDie(20)+attrMod(c.attributes.destreza)})});
    order.push({kind:'monster',id:encounter.id,name:encounter.name,initiative:secureDie(20)+(Number(encounter.initiativeBonus)||0)});
    return order.sort((a,b)=>b.initiative-a.initiative||a.name.localeCompare(b.name));
  }
  function primaryAttributeForClass(className){return ({Guerreiro:'forca',Paladino:'forca',Patrulheiro:'destreza',Assassino:'destreza',Arcano:'inteligencia',Invocador:'inteligencia',Clérigo:'sabedoria',Druida:'sabedoria'})[className]||'forca'}
  function localGrantXp(character,amount){
    const c=normalizeCharacter(character);const oldLevel=c.level;let xp=c.xp+amount,level=c.level,levelsGained=0;
    while(level<20&&xp>=level*100){level++;levelsGained++}
    const primary=primaryAttributeForClass(c.class);c.attributes[primary]=Math.min(12,(Number(c.attributes[primary])||1)+levelsGained);
    c.level=level;c.xp=xp;c.maxHp+=levelsGained*5;c.hp=Math.min(c.maxHp,c.hp+levelsGained*5);c.defense=10+attrMod(c.attributes.destreza)+(Number(c.equipment.armor?.defense)||0)+(Number(c.equipment.shield?.defense)||0);
    return {character:c,levelsGained,oldLevel,newLevel:level};
  }
  async function awardEncounterRewards(encounter){
    if(!encounter||encounter.xpAwarded)return;
    const ids=Array.isArray(encounter.participantIds)?encounter.participantIds:state.members.filter(m=>m.role==='player'&&m.character).map(m=>m.user_id);
    const reward=Math.max(0,Number(encounter.xpReward)||0);if(!reward||!ids.length){encounter.xpAwarded=true;await updateGameState({encounter});return}
    if(state.backendReady){
      const {data,error}=await state.backend.rpc('award_encounter_xp',{p_campaign_id:state.campaign.id,p_encounter_id:encounter.id,p_xp:reward,p_user_ids:ids});
      if(error)throw error;
      const awards=Array.isArray(data?.awards)?data.awards:[];
      if(awards.length)await createEvent('encounter_defeated',{monster:encounter.name,xp:reward,rewards:awards,description:`${encounter.name} foi derrotado. Cada aventureiro participante recebeu ${reward} XP.`});
      await refreshCloudCampaign({silent:true});
      // A tabela campaign_xp_awards evita distribuir a recompensa novamente, mesmo após reconexão.
      if(state.campaign?.game_state?.encounter?.id===encounter.id){await updateGameState({encounter:{...state.campaign.game_state.encounter,xpAwarded:true}})}
      awards.forEach(r=>{if(Number(r.levels_gained)>0)toast(`${r.name} subiu para o nível ${r.level}!`)});
      return data;
    }
    const partyState={...(state.campaign.game_state?.partyState||{})};const rewards=[];
    ids.forEach(id=>{const member=state.members.find(m=>m.user_id===id);if(!member?.character)return;const result=localGrantXp(member.character,reward);member.character=result.character;const old=partyState[id]||{};const currentHp=Number.isFinite(Number(old.hp))?Number(old.hp):result.character.hp;partyState[id]={...old,hp:Math.min(result.character.maxHp,currentHp+result.levelsGained*5),maxHp:result.character.maxHp,defense:result.character.defense};rewards.push({name:result.character.name,xp:reward,levelsGained:result.levelsGained,level:result.newLevel})});
    encounter.xpAwarded=true;await updateGameState({encounter,partyState});await persistLocalCampaign();await createEvent('encounter_defeated',{monster:encounter.name,xp:reward,rewards,description:`${encounter.name} foi derrotado. Cada aventureiro participante recebeu ${reward} XP.`});
    rewards.forEach(r=>{if(r.levelsGained)toast(`${r.name} subiu para o nível ${r.level}!`)});
    return rewards;
  }
  const state = {
    view:'home', modal:null, backend:null, user:null, backendReady:false, realtimeStatus:'disconnected',
    campaign:null, member:null, members:[], events:[], pendingDamage:[], channel:null, channelPresence:[], processed:new Set(),
    charStep:0, charDraft:null, monsterDraft:85, toastTimer:null, diceOverlayTimer:null, cloudCampaigns:[], prefillJoinCode:null,
    instanceId:null, lastSyncAt:null, rollQueue:Promise.resolve(), combatQueue:Promise.resolve(), isRefreshing:false,
    localCampaigns:readLocalCampaigns(), currentBook:null
  };
  function readLocalCampaigns(){try{return JSON.parse(localStorage.getItem(KEYS.local)||'[]')}catch{return []}}
  function writeLocalCampaigns(){localStorage.setItem(KEYS.local,JSON.stringify(state.localCampaigns))}
  function esc(value=''){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function toast(message,type='ok'){const node=document.createElement('div');node.className='toast '+(type==='error'?'error':'');node.textContent=message;toastRoot.append(node);setTimeout(()=>node.remove(),3800)}
  function setConnection(label,online=false){const el=$('#connection-status');if(!el)return;el.innerHTML=`<i></i> ${esc(label)}`;el.classList.toggle('offline',!online)}
  function refreshConnectionLabel(){
    if(!state.backendReady){setConnection('Modo local',false);return}
    if(state.realtimeStatus==='SUBSCRIBED'){setConnection('Sala sincronizada',true);return}
    if(state.realtimeStatus==='connecting'){setConnection('Conectando à sala',false);return}
    if(state.realtimeStatus==='CHANNEL_ERROR'||state.realtimeStatus==='TIMED_OUT'||state.realtimeStatus==='CLOSED'){setConnection('Reconectando sala',false);return}
    setConnection('Supabase conectado',true);
  }
  function isMaster(){return state.member?.role==='master'}
  function isMasterController(){
    if(!isMaster())return false;
    if(!state.backendReady)return true;
    const hosts=state.channelPresence.filter(p=>p.role==='master').sort((a,b)=>String(a.joined_at||'').localeCompare(String(b.joined_at||''))||String(a.client_id||'').localeCompare(String(b.client_id||'')));
    return hosts.length>0&&hosts[0].client_id===state.instanceId;
  }
  function currentUserId(){return state.user?.id||'local-user'}
  function localCampaignById(id){return state.localCampaigns.find(c=>c.id===id)}
  function defaultGameState(){return {chapter:'Prólogo — A Guerra da Ruptura Celestial',location:'A estrada esquecida de Eldoria',narration:'A chuva cai sobre a antiga estrada de Eldoria. Ao longe, entre as árvores antigas, uma construção abandonada parece guardar um segredo. A primeira crônica de vocês está prestes a começar.',encounter:null,started:false,turn:1,notes:[],activeRollPrompt:null,partyState:{}}}
  function activeRollPrompt(){return state.campaign?.game_state?.activeRollPrompt||null}
  function canCurrentPlayerRoll(){const prompt=activeRollPrompt();return !!prompt&&Array.isArray(prompt.target_user_ids)&&prompt.target_user_ids.includes(currentUserId())&&!(prompt.fulfilled_user_ids||[]).includes(currentUserId())}

  async function init(){
    state.instanceId=crypto.randomUUID?crypto.randomUUID():('tab-'+Date.now()+'-'+Math.random().toString(36).slice(2));
    sessionStorage.setItem('aethra.instance.id',state.instanceId)
    render();
    const cfg=loadConfig();
    if(cfg?.url&&cfg?.key){try{await connectSupabase(cfg.url,cfg.key,true)}catch(e){console.warn(e);setConnection('Modo local',false)}}
    const active=localStorage.getItem(KEYS.active);
    if(active&&!state.campaign){
      const found=state.localCampaigns.find(c=>c.id===active);
      if(found){state.campaign=found;state.member=found.members.find(m=>m.user_id==='local-user')||found.members[0]||null;state.members=found.members;state.events=found.events||[]}
      else if(state.backendReady){try{await openCloudCampaign(active)}catch(e){console.warn('Não foi possível restaurar a última campanha',e)}}
    }
    render();
    if(state.backendReady)loadCloudCampaigns();
    const invite=new URLSearchParams(location.search).get('join');
    if(invite){state.prefillJoinCode=invite.toUpperCase();openModal('join');}
  }
  function loadConfig(){try{const saved=JSON.parse(localStorage.getItem(KEYS.config)||'null');if(saved?.url&&saved?.key)return saved}catch{}const deployed=window.AETHRA_CONFIG||{};return{url:deployed.supabaseUrl||'',key:deployed.supabasePublicKey||deployed.supabaseAnonKey||''}}
  async function connectSupabase(url,key,silent=false){
    if(!window.supabase?.createClient)throw new Error('Não foi possível carregar a biblioteca do Supabase. Verifique sua conexão com a internet.');
    const client=window.supabase.createClient(url.trim(),key.trim(),{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    let {data:{session}}=await client.auth.getSession();
    if(!session){const result=await client.auth.signInAnonymously();if(result.error)throw result.error;session=result.data.session}
    // Testa se o esquema já foi instalado antes de habilitar o modo compartilhado.
    const schemaCheck=await client.from('campaigns').select('id').limit(1);
    if(schemaCheck.error){
      const detail=schemaCheck.error.message||'tabela campaigns indisponível';
      throw new Error(`A autenticação funcionou, mas o banco de Aethra ainda não está pronto (${detail}). Execute o arquivo supabase-schema.sql no SQL Editor do Supabase e tente novamente.`);
    }
    state.backend=client;state.user=session.user;state.backendReady=true;state.realtimeStatus='disconnected';
    localStorage.setItem(KEYS.config,JSON.stringify({url:url.trim(),key:key.trim()}));
    refreshConnectionLabel();
    if(!silent)toast('Supabase conectado e esquema de campanhas localizado.');
    return true;
  }
  function disconnectSupabase(){if(state.channel&&state.backend)state.backend.removeChannel(state.channel);state.channel=null;state.channelPresence=[];state.backend=null;state.user=null;state.backendReady=false;state.realtimeStatus='disconnected';state.modal=null;localStorage.removeItem(KEYS.config);setConnection('Modo local',false);toast('Configuração do Supabase removida.');render()}

  function render(){
    if(state.view==='home')renderHome();
    else if(state.view==='library')renderLibrary();
    else if(state.view==='campaigns')renderCampaigns();
    else if(state.view==='lobby')renderLobby();
    else if(state.view==='session')renderSession();
    else renderHome();
    $$('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.action===({home:'go-home',library:'open-library',campaigns:'my-campaigns'}[state.view]||'')));
    if(state.modal==='settings')renderSettingsModal();
    if(state.modal==='create')renderCreateModal();
    if(state.modal==='join')renderJoinModal();
    if(state.modal==='character')renderCharacterModal();
    if(state.modal==='book')renderBookModal();
    if(state.modal==='rollPrompt')renderRollPromptModal();
    const chatBox=$('.chat-messages');if(chatBox)chatBox.scrollTop=chatBox.scrollHeight;
  }
  function renderHome(){
    app.innerHTML=`
      <section class="hero">
        <div class="hero-copy">
          <div class="eyebrow">Uma aventura compartilhada</div>
          <h1>O destino de <em>Aethra</em><br>está em suas mãos.</h1>
          <p>Reúna seus aventureiros, escolha seus caminhos e enfrente as forças que ameaçam os Cinco Reinos. O mestre conduz a narrativa. Os jogadores escrevem a lenda.</p>
          <div class="hero-actions"><button class="btn btn-primary" data-action="create-campaign">✦ Criar campanha</button><button class="btn btn-secondary" data-action="join-campaign">Entrar com código ↗</button></div>
        </div>
        <div class="hero-art"><div class="hero-seal"><span>✦</span></div><div class="hero-quote">“Quando a esperança se apagar, cinco vontades reacenderão o mundo.”</div></div>
      </section>
      <section class="section">
        <div class="section-heading"><div><div class="page-kicker">A mesa espera por você</div><h2>Um mundo. Muitas crônicas.</h2><p>Ferramentas para que a distância não impeça uma grande aventura.</p></div><button class="btn btn-quiet btn-small" data-action="open-library">Explorar biblioteca →</button></div>
        <div class="feature-grid">
          <article class="feature-card"><div class="feature-icon">♛</div><h3>O mestre conduz</h3><p>Gerencie jogadores, encontros, monstros, missões, segredos e acontecimentos em uma central própria.</p></article>
          <article class="feature-card"><div class="feature-icon">⬡</div><h3>Dados compartilhados</h3><p>Solicite testes de D20, acompanhe resultados e registre as rolagens na crônica da campanha.</p></article>
          <article class="feature-card"><div class="feature-icon">⚔</div><h3>Combates vivos</h3><p>Monstros, pontos de vida, turnos e consequências acompanham todos os participantes.</p></article>
        </div>
      </section>
      <section class="section">
        <div class="section-heading"><div><div class="page-kicker">O mundo conhecido</div><h2>Os Cinco Reinos</h2><p>Cinco territórios, cinco forças e uma deusa desaparecida.</p></div></div>
        <div class="realm-strip">
          ${REALMS.map((r,i)=>`<div class="realm-card realm-bg-${i}"><strong>${r.name}</strong><span>${r.subtitle}</span></div>`).join('')}
        </div>
      </section>
      <section class="section two-col">
        <div class="panel"><div class="page-kicker">A primeira profecia</div><h2 class="page-title">A Guerra da Ruptura Celestial</h2><p class="panel-subtitle" style="margin-top:13px">Antes dos reinos, Elyndra, guardiã da criação, e Vharzun, o Dragão Ancião, coexistiam em equilíbrio. A ambição de Vharzun rompeu essa harmonia. Após uma guerra devastadora, a deusa foi capturada — mas, antes de cair, invocou heróis ligados aos poderes dos cinco reinos.</p><p class="panel-subtitle">Agora, esses heróis devem encontrar as relíquias, enfrentar as forças do dragão e decidir o futuro de Aethra.</p><button class="btn btn-secondary btn-small" data-action="open-book" data-book="atlas">Conhecer Aethra →</button></div>
        <div class="panel"><div class="page-kicker">Continue de onde parou</div><h3>Suas campanhas</h3><p class="panel-subtitle">Campanhas salvas ficam disponíveis para você retomar em outra sessão.</p><button class="btn btn-primary" data-action="my-campaigns">Ver minhas campanhas</button><div class="divider"></div><div class="row between"><span class="muted" style="font-size:10px">Armazenamento</span><span class="tag ${state.backendReady?'green':'gold'}">${state.backendReady?'Nuvem conectada':'Modo local'}</span></div></div>
      </section>`;
  }
  function renderLibrary(){
    app.innerHTML=`<div class="page-header"><div><div class="page-kicker">Conhecimento preservado</div><h1 class="page-title">Biblioteca de Aethra</h1><p>Livros de consulta para mestres e aventureiros. Conteúdo inicial em desenvolvimento.</p></div><button class="btn btn-secondary" data-action="go-home">← Voltar ao início</button></div>
      <div class="notice"><strong>Biblioteca inicial:</strong> esta versão apresenta a estrutura dos sete livros. Os capítulos completos, ilustrações editoriais e PDFs serão desenvolvidos nas próximas etapas. O Livro do Mestre terá acesso reservado ao mestre da campanha.</div>
      <div class="library-grid" style="margin-top:18px">${BOOKS.filter(b=>b.id!=='master'||isMaster()).map(b=>`<article class="book-card"><div class="book-cover"><span>${b.icon}</span></div><div class="book-body"><span class="tag ${b.access==='Mestre'?'gold':'green'}">${b.access==='Mestre'?'Reservado ao mestre':'Consulta geral'}</span><h3>${b.title}</h3><p>${b.desc}</p><button class="btn btn-secondary btn-small" data-action="open-book" data-book="${b.id}">Abrir livro →</button></div></article>`).join('')}</div>`;
  }
  async function loadCloudCampaigns(){
    if(!state.backendReady)return;
    try{
      const {data:members,error}=await state.backend.from('campaign_members').select('campaign_id').eq('user_id',state.user.id);
      if(error)throw error;
      const ids=[...new Set((members||[]).map(m=>m.campaign_id))];
      if(!ids.length){state.cloudCampaigns=[];if(state.view==='campaigns')renderCampaigns();return}
      const {data,error:ce}=await state.backend.from('campaigns').select('*').in('id',ids).order('updated_at',{ascending:false});
      if(ce)throw ce;state.cloudCampaigns=data||[];if(state.view==='campaigns')renderCampaigns();
    }catch(err){console.warn(err);toast('Não foi possível carregar as campanhas da nuvem.','error')}
  }
  function renderCampaigns(){
    const cards=state.backendReady?'':state.localCampaigns.map(c=>`<article class="panel"><div class="row between"><span class="tag ${c.status==='active'?'green':'gold'}">${c.status==='active'?'Sessão ativa':'Pausada'}</span><span class="muted" style="font-size:9px">${c.members?.length||1} participante(s)</span></div><h3 style="margin-top:14px">${esc(c.name)}</h3><p class="panel-subtitle">${esc(c.description||'Uma nova crônica de Aethra.')}</p><div class="row between"><span class="campaign-code">${esc(c.code)}</span><button class="btn btn-primary btn-small" data-action="open-local-campaign" data-id="${c.id}">Abrir →</button></div></article>`).join('');
    const cloudCards=state.cloudCampaigns.map(c=>`<article class="panel"><div class="row between"><span class="tag ${c.status==='active'?'green':'gold'}">${c.status==='active'?'Sessão ativa':'Pausada'}</span><span class="muted" style="font-size:9px">${esc(c.code)}</span></div><h3 style="margin-top:14px">${esc(c.name)}</h3><p class="panel-subtitle">${esc(c.description||'Uma nova crônica de Aethra.')}</p><button class="btn btn-primary btn-small" data-action="open-cloud-campaign" data-id="${c.id}">Abrir campanha →</button></article>`).join('');
    app.innerHTML=`<div class="page-header"><div><div class="page-kicker">Suas jornadas</div><h1 class="page-title">Minhas campanhas</h1><p>Abra uma campanha existente ou prepare uma nova aventura.</p></div><button class="btn btn-primary" data-action="create-campaign">＋ Criar campanha</button></div>
    ${state.backendReady?(cloudCards?`<div class="feature-grid">${cloudCards}</div>`:`<div class="empty-state"><div class="symbol">✦</div><strong>Nenhuma campanha na nuvem</strong><p>Crie uma campanha como mestre ou entre com o código de convite de um amigo.</p><div class="hero-actions" style="justify-content:center"><button class="btn btn-primary" data-action="create-campaign">Criar campanha</button><button class="btn btn-secondary" data-action="join-campaign">Entrar com código</button></div></div>`):cards?`<div class="feature-grid">${cards}</div>`:`<div class="empty-state"><div class="symbol">✦</div><strong>Nenhuma campanha por enquanto</strong><p>Crie uma campanha como mestre ou entre com o código de convite de um amigo.</p><div class="hero-actions" style="justify-content:center"><button class="btn btn-primary" data-action="create-campaign">Criar campanha</button><button class="btn btn-secondary" data-action="join-campaign">Entrar com código</button></div></div>`}`;
  }

  async function createCampaign(name,description){
    if(state.backendReady){
      const {data,error}=await state.backend.rpc('create_campaign',{p_name:name,p_description:description});if(error)throw error;
      const c=normalizeCampaign(data);await openCloudCampaign(c.id);return;
    }
    const code='AETHRA-'+Math.random().toString(36).slice(2,6).toUpperCase();
    const c={id:'local-'+Date.now(),code,name,description,status:'paused',owner_id:'local-user',game_state:defaultGameState(),members:[{id:'local-master',campaign_id:null,user_id:'local-user',display_name:'Mestre da Crônica',role:'master',character:null,status:'online'}],events:[],created_at:new Date().toISOString()};
    c.members[0].campaign_id=c.id;state.localCampaigns.unshift(c);writeLocalCampaigns();state.campaign=c;state.member=c.members[0];state.members=c.members;state.events=[];localStorage.setItem(KEYS.active,c.id);state.view='lobby';state.modal=null;render();toast('Campanha criada. Compartilhe o código com seus jogadores.');
  }
  function normalizeCampaign(c){return c?.campaign||c}
  async function joinCampaign(code,displayName){
    if(state.backendReady){const {data,error}=await state.backend.rpc('join_campaign',{p_code:code,p_display_name:displayName});if(error)throw error;const c=normalizeCampaign(data);await openCloudCampaign(c.id);return}
    const c=state.localCampaigns.find(x=>x.code.toUpperCase()===code.toUpperCase());if(!c)throw new Error('Código não encontrado no modo local. Para convidar pessoas de outros computadores, conecte o Supabase.');
    let m=c.members.find(x=>x.user_id==='local-user');if(!m){m={id:'local-player-'+Date.now(),campaign_id:c.id,user_id:'local-user',display_name:displayName,role:'player',character:null,status:'online'};c.members.push(m)}else m.display_name=displayName;
    state.campaign=c;state.member=m;state.members=c.members;state.events=c.events||[];state.pendingDamage=state.events.filter(e=>e.event_type==='damage_request');localStorage.setItem(KEYS.active,c.id);writeLocalCampaigns();state.view='lobby';state.modal=null;render();toast('Você entrou na campanha.');
  }
  function pendingDamageFrom(events){const resolved=new Set(events.filter(e=>['damage_applied','damage_rejected'].includes(e.event_type)).map(e=>e.payload?.request_id).filter(Boolean));return events.filter(e=>e.event_type==='damage_request'&&!resolved.has(e.id))}
  async function openCloudCampaign(id){
    const [{data:c,error:ce},{data:members,error:me},{data:events,error:ee}]=await Promise.all([
      state.backend.from('campaigns').select('*').eq('id',id).single(),
      state.backend.from('campaign_members').select('*').eq('campaign_id',id),
      state.backend.from('campaign_events').select('*').eq('campaign_id',id).order('created_at',{ascending:false}).limit(100)
    ]);
    if(ce)throw ce;if(me)throw me;if(ee)throw ee;
    state.campaign=c;state.members=members||[];state.member=state.members.find(m=>m.user_id===state.user.id)||null;state.events=(events||[]).reverse();state.pendingDamage=pendingDamageFrom(state.events);state.processed=new Set(state.events.map(ev=>ev.id));state.lastSyncAt=new Date().toISOString();
    if(!state.member)throw new Error('Sua conta não está registrada como participante desta campanha. Entre novamente usando o código de convite.');
    localStorage.setItem(KEYS.active,id);state.view=c.status==='active'?'session':'lobby';state.modal=null;subscribeCampaign();render();
  }
  async function refreshCloudCampaign(options={}){
    if(!state.backendReady||!state.campaign||state.isRefreshing)return;
    state.isRefreshing=true;
    const id=state.campaign.id;
    try{
      const [campaignRes,membersRes,eventsRes]=await Promise.all([
        state.backend.from('campaigns').select('*').eq('id',id).single(),
        state.backend.from('campaign_members').select('*').eq('campaign_id',id),
        state.backend.from('campaign_events').select('*').eq('campaign_id',id).order('created_at',{ascending:false}).limit(100)
      ]);
      if(campaignRes.error)throw campaignRes.error;if(membersRes.error)throw membersRes.error;if(eventsRes.error)throw eventsRes.error;
      if(campaignRes.data)state.campaign=campaignRes.data;
      if(membersRes.data)state.members=membersRes.data;
      if(eventsRes.data){state.events=eventsRes.data.reverse();state.pendingDamage=pendingDamageFrom(state.events);state.processed=new Set(state.events.map(ev=>ev.id))}
      state.member=state.members.find(m=>m.user_id===state.user.id)||state.member;
      state.lastSyncAt=new Date().toISOString();
      render();
      if(isMasterController()){reconcilePendingRollRequests();reconcilePendingCombatActions()}
    }catch(err){console.warn('Falha ao atualizar campanha:',err);if(!options.silent)toast('Não foi possível atualizar todos os dados da campanha.','error')}
    finally{state.isRefreshing=false}
  }
  function subscribeCampaign(){
    if(!state.backendReady||!state.campaign)return;
    if(state.channel){state.backend.removeChannel(state.channel);state.channel=null}
    const id=state.campaign.id;
    state.realtimeStatus='connecting';refreshConnectionLabel();
    state.channel=state.backend.channel('campaign-'+id,{config:{presence:{key:state.instanceId}}})
      .on('presence',{event:'sync'},()=>{state.channelPresence=Object.values(state.channel.presenceState()).flat();if(isMasterController()){reconcilePendingRollRequests();reconcilePendingCombatActions()}render()})
      .on('presence',{event:'join'},({newPresences})=>{state.channelPresence=Object.values(state.channel.presenceState()).flat();(newPresences||[]).forEach(p=>{if(isMasterController()&&p.user_id!==state.user.id)toast(`${p.display_name||'Um aventureiro'} entrou na campanha.`)});render()})
      .on('presence',{event:'leave'},()=>{state.channelPresence=Object.values(state.channel.presenceState()).flat();if(isMasterController()){reconcilePendingRollRequests();reconcilePendingCombatActions()}render()})
      .on('postgres_changes',{event:'UPDATE',schema:'public',table:'campaigns',filter:`id=eq.${id}`},payload=>{
        state.campaign={...state.campaign,...payload.new};
        if(payload.new.status==='active'&&payload.new.game_state?.started&&state.view==='lobby'){state.view='session';toast('O mestre iniciou a sessão. A aventura vai começar!')}
        else if(payload.new.status==='paused'&&state.view==='session'&&!isMaster()){state.view='lobby';toast('O mestre salvou e encerrou a sessão. Sua crônica está guardada.')}render()
      })
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'campaign_events',filter:`campaign_id=eq.${id}`},payload=>handleIncomingEvent(payload.new))
      .on('postgres_changes',{event:'*',schema:'public',table:'campaign_members',filter:`campaign_id=eq.${id}`},()=>refreshCloudCampaign({silent:true}))
      .subscribe(async status=>{
        state.realtimeStatus=status;refreshConnectionLabel();
        if(status==='SUBSCRIBED'){
          try{
            await state.channel.track({user_id:state.user.id,client_id:state.instanceId,display_name:state.member?.display_name||'Aventureiro',role:state.member?.role||'player',joined_at:new Date().toISOString()});
            state.channelPresence=Object.values(state.channel.presenceState()).flat();
            await refreshCloudCampaign({silent:true});
            render();
          }catch(err){console.warn('Falha ao anunciar presença:',err);toast('A sala conectou, mas não foi possível atualizar sua presença.','error')}
        }else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'){
          toast('A conexão em tempo real caiu. A sala tentará reconectar; use Sincronizar ao voltar.','error');
        }
      });
  }
  async function handleIncomingEvent(ev){
    if(!ev||state.processed.has(ev.id))return;state.processed.add(ev.id);state.events.push(ev);if(state.events.length>150)state.events.shift();
    if(isMasterController()&&ev.event_type==='roll_request'){
      state.rollQueue=state.rollQueue.then(()=>processRollRequest(ev)).catch(err=>{console.error(err);toast(err.message||'Não foi possível processar a rolagem.','error')});
    }
    if(isMasterController()&&ev.event_type==='damage_request'){
      state.pendingDamage.push(ev);toast(`${ev.payload?.player_name||'Um jogador'} declarou um ataque. Valide o dano no painel do monstro.`);
    }
    if(isMasterController()&&ev.event_type==='combat_action_request'){
      state.combatQueue=state.combatQueue.then(()=>processCombatAction(ev)).catch(err=>{console.error(err);toast(err.message||'Não foi possível resolver a ação de combate.','error')});
    }
    if(ev.event_type==='damage_applied'||ev.event_type==='damage_rejected')state.pendingDamage=state.pendingDamage.filter(item=>item.id!==ev.payload?.request_id);
    if(ev.event_type==='dice_prompt'&&ev.payload?.target_user_ids?.includes(currentUserId()))toast(`O mestre solicitou um D20: ${ev.payload.reason||'Realize seu teste.'}`);
    if(ev.event_type==='dice_result')showDice(ev.payload?.result,ev.payload?.player_name||'Aventureiro');
    if(ev.event_type==='combat_action_result'&&Number.isInteger(ev.payload?.natural))showDice(ev.payload.natural,ev.payload?.player_name||'Aventureiro');
    if(ev.event_type==='monster_attack_result'&&Number.isInteger(ev.payload?.natural))showDice(ev.payload.natural,ev.payload?.monster||'Monstro');
    render();
  }
  async function processRollRequest(ev){
    const prompt=activeRollPrompt();
    if(!isMasterController()||!prompt?.id||ev.payload?.prompt_id!==prompt.id)return;
    const actorId=ev.actor_id;
    const targets=prompt.target_user_ids||[];
    const fulfilled=prompt.fulfilled_user_ids||[];
    if(!targets.includes(actorId)||fulfilled.includes(actorId))return;
    const alreadyResolved=state.events.find(item=>item.event_type==='dice_result'&&item.payload?.prompt_id===prompt.id&&item.payload?.player_user_id===actorId);
    if(!alreadyResolved){
      const result=secureD20();
      await createEvent('dice_result',{result,player_name:ev.payload?.player_name||'Aventureiro',reason:prompt.reason||'Teste solicitado',natural:result,prompt_id:prompt.id,player_user_id:actorId});
    }
    // O resultado é salvo antes de marcar o alvo como concluído. Se o navegador do mestre
    // fechar no meio do processo, a próxima sincronização encontra o resultado e conclui o prompt.
    const nextFulfilled=[...fulfilled,actorId];
    const nextPrompt=nextFulfilled.length>=targets.length?null:{...prompt,fulfilled_user_ids:nextFulfilled};
    await updateGameState({activeRollPrompt:nextPrompt});
  }
  function reconcilePendingRollRequests(){
    const prompt=activeRollPrompt();if(!prompt?.id||!isMasterController())return;
    const completed=prompt.fulfilled_user_ids||[];
    const pending=state.events.filter(ev=>ev.event_type==='roll_request'&&ev.payload?.prompt_id===prompt.id&&prompt.target_user_ids?.includes(ev.actor_id)&&!completed.includes(ev.actor_id));
    pending.forEach(ev=>{state.rollQueue=state.rollQueue.then(()=>processRollRequest(ev)).catch(err=>{console.error(err);toast(err.message||'Não foi possível recuperar uma rolagem pendente.','error')})});
  }
  function reconcilePendingCombatActions(){
    if(!isMasterController())return;
    const enc=state.campaign?.game_state?.encounter;if(!enc?.id)return;
    const current=activeCombatTurn(enc);if(current?.kind!=='player')return;
    const pending=state.events.filter(ev=>ev.event_type==='combat_action_request'&&ev.actor_id===current.user_id&&ev.payload?.encounter_id===enc.id&&Number(ev.payload?.round)===Number(enc.round)&&Number(ev.payload?.turn_index)===Number(enc.turnIndex));
    pending.forEach(ev=>{state.combatQueue=state.combatQueue.then(()=>processCombatAction(ev)).catch(err=>{console.error(err);toast(err.message||'Não foi possível recuperar uma ação de combate.','error')})});
  }
  async function processCombatAction(ev){
    if(!isMasterController())return;
    const gs=state.campaign?.game_state||defaultGameState();const enc=gs.encounter;
    if(!enc?.id||ev.payload?.encounter_id!==enc.id)return;
    if(state.events.some(item=>['combat_action_result','combat_action_rejected'].includes(item.event_type)&&item.payload?.request_id===ev.id))return;
    const turn=activeCombatTurn(enc);if(!turn||turn.kind!=='player'||turn.user_id!==ev.actor_id||Number(ev.payload?.round)!==Number(enc.round)||Number(ev.payload?.turn_index)!==Number(enc.turnIndex))return;
    const member=state.members.find(m=>m.user_id===ev.actor_id);if(!member?.character)throw new Error('O personagem desta ação não foi encontrado.');
    const character=normalizeCharacter(member.character);const partyState={...(gs.partyState||{})};const vitals=currentPartyVitals(ev.actor_id,character);const rule=classRule(character);
    let natural=null,total=null,hit=null,damage=0,healing=0,description='',abilityUsed=vitals.abilityUsed;
    const action=ev.payload?.action||'attack';
    if(action==='item'){
      if(ev.payload?.item_id!=='pocao-cura')throw new Error('Item não disponível nesta versão.');
      const potion=vitals.inventory.find(item=>item.id==='pocao-cura'&&Number(item.qty)>0);if(!potion)throw new Error('Você não possui Poção de Cura.');
      const die=rollDamageDie(8);healing=die+2;const inventory=vitals.inventory.map(item=>item.id==='pocao-cura'?{...item,qty:Math.max(0,Number(item.qty)-1)}:item);
      partyState[ev.actor_id]={...vitals,hp:Math.min(vitals.maxHp,vitals.hp+healing),inventory};description=`${character.name} usou Poção de Cura e recuperou ${Math.min(healing,vitals.maxHp-vitals.hp)} HP.`;
    } else {
      if(action==='ability'&&abilityUsed)throw new Error('Sua habilidade especial já foi utilizada neste encontro.');
      if(action==='ability'&&ev.payload?.ability_id!==rule.abilityId)throw new Error('Habilidade não corresponde à classe deste personagem.');
      if(action==='ability'&&rule.healing){const die=rollDamageDie(rule.abilityDie);healing=die+attrMod(character.attributes[rule.attackAttribute]);partyState[ev.actor_id]={...vitals,hp:Math.min(vitals.maxHp,vitals.hp+Math.max(1,healing)),abilityUsed:true};description=`${character.name} usou ${rule.abilityName} e recuperou ${Math.min(Math.max(1,healing),vitals.maxHp-vitals.hp)} HP.`;}
      else {
        const weapon=character.equipment?.weapon||STARTER_KITS[character.class]?.weapon||STARTER_KITS.Guerreiro.weapon;
        natural=secureDie(20);const modifier=attrMod(character.attributes[rule.attackAttribute]);total=natural+2+modifier+(Number(weapon.accuracy)||0)+(action==='ability'?rule.abilityAttackBonus:0);
        hit=natural===20||(natural!==1&&total>=Number(enc.defense||12));
        if(hit){const weaponDie=Number(weapon.damageDie)||6;damage=rollDamageDie(weaponDie)+modifier+(action==='ability'?rollDamageDie(rule.abilityDie||8):0);if(natural===20)damage+=rollDamageDie(weaponDie);damage=Math.max(1,damage);enc.hp=Math.max(0,Number(enc.hp)-damage)}
        if(action==='ability')abilityUsed=true;
        partyState[ev.actor_id]={...vitals,abilityUsed};
        description=hit?`${character.name} acertou ${enc.name} e causou ${damage} de dano.`:`${character.name} tentou atacar ${enc.name}, mas não conseguiu acertar.`;
      }
    }
    const defeated=Number(enc.hp)<=0;
    const next=defeated?{...enc,defeated:true,turnOrder:[],turnIndex:0}:advanceCombatTurn(enc);
    await updateGameState({encounter:next,partyState});
    await createEvent('combat_action_result',{request_id:ev.id,player_name:character.name,action,natural,total,hit,damage,healing,description,monster_hp:next.hp,round:next.round,next_turn:activeCombatTurn(next)?.name||'—'});
    if(defeated){await awardEncounterRewards(next);toast(`${next.name} foi derrotado! Experiência distribuída à companhia.`)}
    if(natural!==null){showDice(natural,character.name);if(natural===20&&hit)toast('Acerto crítico! Dano adicional aplicado.')}
    toast(description);
  }
  async function resolveMonsterTurn(){
    if(!isMasterController())throw new Error('Somente o mestre ativo pode resolver o turno do monstro.');
    const gs=state.campaign.game_state||defaultGameState();const enc=gs.encounter;const turn=activeCombatTurn(enc);
    if(!enc||enc.defeated||turn?.kind!=='monster')throw new Error('Não é o turno do monstro.');
    const partyState={...(gs.partyState||{})};
    const targets=state.members.filter(m=>m.role==='player'&&m.character).map(m=>({member:m,character:normalizeCharacter(m.character),vitals:currentPartyVitals(m.user_id,m.character)})).filter(x=>x.vitals.hp>0);
    if(!targets.length)throw new Error('Não há aventureiros com HP para receber o ataque.');
    
    const target=targets[secureDie(targets.length)-1];const natural=secureDie(20);let monsterBonus=Number(enc.attackBonus||0);if(enc.templateId==='goblin-cinzas'&&enc.turnOrder?.[0]?.kind==='monster')monsterBonus+=1;const total=natural+monsterBonus;const hit=natural===20||(natural!==1&&total>=target.vitals.defense);
    let damage=hit?rollDamageDie(Number(enc.damageDie)||6)+Number(enc.damageBonus||0):0;
    if(enc.templateId==='lobo-cinzento'&&hit&&natural>=18)damage+=rollDamageDie(6);
    if(enc.templateId==='drakthar'&&!enc.specialUsed&&natural>=17){damage=rollDamageDie(8,2)+4;const affected=[];targets.forEach(x=>{const amount=Math.min(x.vitals.hp,damage);partyState[x.member.user_id]={...x.vitals,hp:Math.max(0,x.vitals.hp-damage)};affected.push({name:x.character.name,damage:amount,hp:Math.max(0,x.vitals.hp-damage)})});enc.specialUsed=true;const next=advanceCombatTurn(enc);await updateGameState({encounter:next,partyState});await createEvent('monster_attack_result',{monster:enc.name,special:enc.specialName,natural,affected,description:`${enc.name} utiliza ${enc.specialName}!`});showDice(natural,enc.name);return}
    partyState[target.member.user_id]={...target.vitals,hp:Math.max(0,target.vitals.hp-damage)};
    const next=advanceCombatTurn(enc);await updateGameState({encounter:next,partyState});
    await createEvent('monster_attack_result',{monster:enc.name,target:target.character.name,natural,total,hit,damage,hp:Math.max(0,target.vitals.hp-damage),description:hit?`${enc.name} atinge ${target.character.name} e causa ${damage} de dano.`:`${enc.name} ataca ${target.character.name}, mas erra.`});
    showDice(natural,enc.name);toast(hit?`O monstro causou ${damage} de dano a ${target.character.name}.`:'O monstro errou o ataque.');
  }
  async function createEvent(type,payload){
    const event={id:'local-event-'+Date.now()+Math.random(),campaign_id:state.campaign.id,actor_id:currentUserId(),event_type:type,payload,created_at:new Date().toISOString()};
    if(state.backendReady){
      const {data,error}=await state.backend.rpc('submit_campaign_event',{p_campaign_id:state.campaign.id,p_event_type:type,p_payload:payload||{}});
      if(error)throw error;
      if(data?.id&&!state.processed.has(data.id)){
        state.processed.add(data.id);
        state.events.push(data);
        if(state.events.length>100)state.events.shift();
        if(type==='dice_result')showDice(payload?.result,payload?.player_name||'Aventureiro');
        if(type==='damage_request'&&isMaster())state.pendingDamage.push(data);
        render();
      }
      // Os outros participantes recebem a mesma entrada pelo Postgres Changes / Realtime.
      return data||event;
    }else{state.events.push(event);const c=localCampaignById(state.campaign.id);if(c){c.events=state.events;writeLocalCampaigns()}}
    if(!state.backendReady){await handleLocalEvent(event);await persistLocalCampaign()}
    render();return event;
  }
  async function handleLocalEvent(ev){
    if(ev.event_type==='roll_request'){const result=secureD20();const resultEvent={id:'local-event-'+Date.now()+'-result',campaign_id:state.campaign.id,actor_id:'local-master',event_type:'dice_result',payload:{result,player_name:ev.payload.player_name,reason:ev.payload.reason},created_at:new Date().toISOString()};state.events.push(resultEvent);showDice(result,ev.payload.player_name);}
    if(ev.event_type==='damage_request'&&isMaster()){
      const enc=state.campaign.game_state?.encounter;const amount=Math.max(0,Math.min(1000,Number(ev.payload.amount)||0));if(enc&&amount){enc.hp=Math.max(0,enc.hp-amount);await persistLocalCampaign();state.events.push({id:'local-dmg-'+Date.now(),event_type:'damage_applied',payload:{amount,hp:enc.hp,monster:enc.name,player_name:ev.payload.player_name},created_at:new Date().toISOString()})}
    }
    if(ev.event_type==='dice_prompt')toast('O mestre solicitou uma rolagem de D20.');
  }
  async function requestRoll(targetUserId,reason){
    if(!isMaster()||!isMasterController())throw new Error('Apenas a instância ativa do mestre pode solicitar dados.');
    const players=state.members.filter(m=>m.role==='player');
    const targets=targetUserId==='all'?players.map(m=>m.user_id):[targetUserId];
    if(!targets.length)throw new Error('Ainda não há jogadores cadastrados na campanha.');
    const prompt={id:(crypto.randomUUID?crypto.randomUUID():`roll-${Date.now()}-${Math.random()}`),reason:String(reason||'Teste de D20').slice(0,140),target_user_ids:targets,fulfilled_user_ids:[],created_at:new Date().toISOString()};
    await updateGameState({activeRollPrompt:prompt});
    await createEvent('dice_prompt',prompt);
    toast(targets.length===1?'Solicitação enviada ao jogador.':`Solicitação enviada a ${targets.length} jogadores.`);
  }
  function secureD20(){const a=new Uint32Array(1);let x;do{crypto.getRandomValues(a);x=a[0]}while(x>=4294967280);return (x%20)+1}
  async function updateGameState(patch,status){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo desta campanha pode alterar seu estado.');
    const current=state.campaign.game_state||defaultGameState();const next={...current,...patch};
    if(state.backendReady){const {error}=await state.backend.rpc('update_campaign_state',{p_campaign_id:state.campaign.id,p_game_state:next,p_status:status||state.campaign.status});if(error)throw error;state.campaign={...state.campaign,game_state:next,status:status||state.campaign.status}}
    else{state.campaign.game_state=next;if(status)state.campaign.status=status;await persistLocalCampaign()}
    render();
  }
  async function persistLocalCampaign(){const i=state.localCampaigns.findIndex(c=>c.id===state.campaign.id);if(i>=0){state.localCampaigns[i]=state.campaign;state.localCampaigns[i].members=state.members;state.localCampaigns[i].events=state.events;writeLocalCampaigns()}}
  async function saveCharacter(character){
    character=normalizeCharacter(character);
    if(state.backendReady){const {error}=await state.backend.rpc('save_my_character',{p_campaign_id:state.campaign.id,p_character:character,p_display_name:character.name});if(error)throw error;await refreshCloudCampaign()}
    else{state.member.character=character;state.member.display_name=character.name;state.member.status='online';state.members=state.campaign.members;await persistLocalCampaign()}
    state.modal=null;state.view='lobby';render();toast('Personagem salvo na crônica.');
  }

  function memberIsOnline(member){
    if(!state.backendReady)return member.user_id==='local-user';
    return state.channelPresence.some(p=>p.user_id===member.user_id);
  }
  function masterIsOnline(){const master=state.members.find(m=>m.role==='master');return !!master&&memberIsOnline(master)}
  function renderLobby(){
    if(!state.campaign){state.view='home';renderHome();return}
    const c=state.campaign,gs=c.game_state||defaultGameState(),mine=state.member,hasChar=!!mine?.character;
    app.innerHTML=`<div class="page-header"><div><div class="page-kicker">Salão dos aventureiros</div><h1 class="page-title">${esc(c.name)}</h1><p>${esc(c.description||'Uma nova crônica começa aqui.')} · ${c.status==='active'?'Sessão em andamento':'Aguardando o início da sessão'} · Mestre ${masterIsOnline()?'online':'offline'}</p></div><div class="row"><button class="btn btn-quiet" data-action="go-home">Início</button>${isMaster()?`<button class="btn btn-primary" data-action="start-session">${c.status==='active'?'Retomar sessão':'Iniciar sessão'} →</button>`:''}</div></div>
      <div class="campaign-layout"><div class="panel"><div class="row between"><div><div class="small-caps">Código de convite</div><div class="campaign-code" style="margin-top:8px">${esc(c.code)} <button class="icon-button" style="width:27px;height:27px;font-size:12px" data-action="copy-code" title="Copiar código">▣</button><button class="icon-button" style="width:27px;height:27px;font-size:12px" data-action="copy-invite" title="Copiar link de convite">↗</button></div></div><span class="tag ${c.status==='active'?'green':'gold'}">${c.status==='active'?'● Sessão ativa':'◷ Preparação'}</span></div><div class="divider"></div><div class="row between"><h3>Companheiros de jornada</h3><span class="muted" style="font-size:9px">${state.members.length} participante(s)</span></div><div class="member-list">${state.members.map(m=>`<div class="member-row"><div class="avatar">${m.role==='master'?'♛':m.character?.class==='Guerreiro'?'⚔':'✦'}</div><div><strong>${esc(m.display_name||'Aventureiro')}</strong><small>${m.role==='master'?'Mestre da campanha':m.character?`${esc(m.character.class)} · ${esc(m.character.realm)}`:'Personagem ainda não criado'}</small></div><span class="spacer"></span><span class="tag ${memberIsOnline(m)?'green':'gold'}">${memberIsOnline(m)?'● Online':'○ Offline'}</span></div>`).join('')||'<div class="empty-state"><strong>Aguardando aventureiros</strong><p>Compartilhe o código para convidar seus amigos.</p></div>'}</div><div class="divider"></div><div class="row between"><div><h3 style="margin:0 0 5px">Sua ficha</h3><p class="panel-subtitle" style="margin:0">${hasChar?`${esc(mine.character.name)} · ${esc(mine.character.race)} · ${esc(mine.character.class)}`:'Crie seu personagem para entrar na aventura.'}</p></div><button class="btn ${hasChar?'btn-secondary':'btn-primary'} btn-small" data-action="create-character">${hasChar?'Editar ficha':'Criar personagem'}</button></div></div>
      <aside class="panel"><div class="page-kicker">Próximo capítulo</div><h3>${esc(gs.chapter||'A primeira profecia')}</h3><p class="panel-subtitle">${esc(gs.location||'Local ainda não definido')}</p><div class="divider"></div><div class="row between"><span class="muted" style="font-size:10px">Estado da crônica</span><strong style="font-size:10px;color:#e6d5ad">${c.status==='active'?'Em andamento':'Pausada'}</strong></div><div class="divider"></div><p class="panel-subtitle">${isMaster()?'Como mestre, você controla o início da sessão, os encontros e a narrativa.':'Quando o mestre iniciar a sessão, você poderá acompanhar a aventura por aqui.'}</p>${isMaster()?`<button class="btn btn-secondary" style="width:100%" data-action="open-master-guide">Abrir central do mestre</button>`:`<div class="notice">Aguarde o mestre iniciar a sessão. Sua ficha fica salva mesmo quando todos saírem.</div>`}</aside></div>`;
  }
  function renderSession(){
    if(!state.campaign){state.view='home';renderHome();return}
    const c=state.campaign,gs=c.game_state||defaultGameState(),enc=gs.encounter,events=state.events.filter(e=>e.event_type!=='chat_message').slice(-24).reverse(),chatEvents=state.events.filter(e=>e.event_type==='chat_message').slice(-14),prompt=activeRollPrompt(),playerCanRoll=canCurrentPlayerRoll(),ownChar=state.member?.character?normalizeCharacter(state.member.character):null,ownVitals=ownChar?currentPartyVitals(currentUserId(),ownChar):null,activeTurn=activeCombatTurn(enc),ownTurn=isPlayersCombatTurn();
    app.innerHTML=`<div class="session-top"><div><div class="page-kicker">Crônica em andamento · ${esc(c.code)}</div><h1 class="page-title">${esc(c.name)}</h1></div><div class="row"><span class="tag ${masterIsOnline()?'green':'gold'}">${masterIsOnline()?'● Mestre online':'○ Aguardando mestre'}</span><span class="tag">${state.lastSyncAt?'Sync '+new Date(state.lastSyncAt).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}):'Sincronização pendente'}</span>${isMaster()?'<button class="btn btn-secondary btn-small" data-action="pause-session">Salvar e encerrar sessão</button>':''}<button class="btn btn-quiet btn-small" data-action="sync-campaign">⟳ Sincronizar</button><button class="btn btn-quiet btn-small" data-action="open-lobby">Participantes</button></div></div>
    ${!isMaster()&&!masterIsOnline()?'<div class="notice" style="margin-bottom:16px"><strong>O mestre está offline.</strong> A campanha continua salva, mas as ações ao vivo ficarão disponíveis quando o mestre retornar.</div>':''}
    <div class="session-grid"><div><section class="narrative-box"><div class="label">✦ NARRAÇÃO DO MESTRE · ${esc(gs.chapter||'A CRÔNICA')}</div><h3>${esc(gs.location||'Aethra')}</h3><p>${esc(gs.narration||'A aventura aguarda a próxima decisão dos heróis.')}</p></section>
      ${isMaster()?`<div class="session-actions"><button class="btn btn-secondary btn-small" data-action="request-dice">⬡ Solicitar teste D20</button><button class="btn btn-secondary btn-small" data-action="start-encounter">⚔ Iniciar encontro</button><button class="btn btn-secondary btn-small" data-action="open-narration">✎ Narrar acontecimento</button><button class="btn btn-quiet btn-small" data-action="open-master-guide">♛ Central do mestre</button></div>`:`<div class="session-actions"><button class="btn btn-primary btn-small" data-action="roll-dice" ${!masterIsOnline()||!playerCanRoll?'disabled':''}>⬡ ${playerCanRoll?'Responder ao D20':'Aguardando solicitação'}</button><button class="btn btn-secondary btn-small" data-action="open-character-sheet">✧ Minha ficha</button><button class="btn btn-secondary btn-small" data-action="open-inventory">🎒 Inventário</button></div>`}
      ${enc?renderCombatTracker(enc):''}
      ${enc?renderBattleCard(enc):`<div class="panel" style="margin-top:16px"><div class="small-caps">Exploração</div><h3 style="margin-top:10px">O caminho está aberto</h3><p class="panel-subtitle">Ainda não há um encontro ativo. ${isMaster()?'Quando os aventureiros encontrarem uma criatura, inicie um encontro pela central da sessão.':'Aguarde o mestre apresentar o próximo desafio.'}</p></div>`}
      <div class="panel" style="margin-top:16px"><div class="row between"><h3>Diário da sessão</h3><span class="tag">Últimos acontecimentos</span></div><div class="event-feed">${events.length?events.map(formatEvent).join(''):'<div class="empty-state"><strong>A crônica ainda será escrita</strong><p>Rolagens, combates e narrações aparecerão aqui.</p></div>'}</div></div>
      <div class="panel chat-panel" style="margin-top:16px"><div class="row between"><h3>Chat da companhia</h3><span class="tag">Ao vivo</span></div><div class="chat-messages">${chatEvents.length?chatEvents.map(formatChatMessage).join(''):'<div class="empty-state"><strong>O silêncio acompanha a jornada</strong><p>Envie a primeira mensagem para seus companheiros.</p></div>'}</div><form id="chat-form" class="chat-compose"><input class="input" id="chat-input" maxlength="500" placeholder="Escreva uma mensagem para o grupo..." autocomplete="off" required><button class="btn btn-primary btn-small" type="submit">Enviar</button></form></div>
    </div><aside>${ownChar?`<div class="panel"><div class="row between"><h3>${esc(ownChar.name)}</h3><span class="tag gold">Nível ${ownChar.level}</span></div><div class="hp-row"><strong>HP</strong><strong>${ownVitals.hp} / ${ownVitals.maxHp}</strong></div><div class="hp-track"><div class="hp-fill" style="width:${Math.max(0,ownVitals.hp/ownVitals.maxHp*100)}%"></div></div><div class="stat-grid"><div class="stat-card"><small>Defesa</small><strong>${ownVitals.defense}</strong></div><div class="stat-card"><small>XP</small><strong>${ownChar.xp||0}</strong></div></div><p class="panel-subtitle">${esc(ownChar.class)} · ${esc(ownChar.race)} · ${esc(ownChar.realm)}</p><button class="btn btn-secondary btn-small" style="width:100%" data-action="open-inventory">Ver equipamento e mochila</button></div>`:''}<div class="panel"><div class="row between"><h3>Participantes</h3><span class="tag green">${state.members.length} na crônica</span></div><div class="member-list">${state.members.map(m=>{const v=m.character?currentPartyVitals(m.user_id,m.character):null;return `<div class="member-row"><div class="avatar">${m.role==='master'?'♛':'✦'}</div><div><strong>${esc(m.display_name||'Aventureiro')}</strong><small>${m.role==='master'?'Mestre':esc(m.character?.class||'Aventureiro')}${v?` · ${v.hp}/${v.maxHp} HP · DEF ${v.defense}`:''} · ${memberIsOnline(m)?'Online':'Offline'}</small></div></div>`}).join('')}</div></div><div class="panel" style="margin-top:15px"><h3>Rolagem de dados</h3><div class="dice-panel"><div class="dice-mini">20</div><div><strong>Dado de vinte faces</strong><small>Testes, ataques e salvaguardas</small></div></div>${isMaster()?`<button class="btn btn-primary" style="width:100%;margin-top:12px" data-action="request-dice">Solicitar rolagem</button><button class="btn btn-secondary" style="width:100%;margin-top:8px" data-action="roll-dice">Rolagem do mestre</button>${prompt?`<div class="notice" style="margin-top:10px">Solicitação ativa: ${esc(prompt.reason)} · ${prompt.fulfilled_user_ids?.length||0}/${prompt.target_user_ids?.length||0} respostas <button class="btn btn-quiet btn-small" style="margin-top:8px" data-action="cancel-roll-prompt">Cancelar</button></div>`:''}`:`<button class="btn btn-primary" style="width:100%;margin-top:12px" data-action="roll-dice" ${!masterIsOnline()||!playerCanRoll?'disabled':''}>${playerCanRoll?'Responder ao D20':'Aguardando solicitação'}</button>${prompt&&!playerCanRoll?`<p class="panel-subtitle">O mestre solicitou: ${esc(prompt.reason)}</p>`:''}`}<p class="panel-subtitle" style="margin:10px 0 0">Os resultados ficam registrados no diário e são exibidos aos participantes.</p></div><div class="panel" style="margin-top:15px"><h3>Capítulo atual</h3><p class="panel-subtitle">${esc(gs.chapter||'Prólogo')}</p><span class="tag gold">${esc(gs.location||'Aethra')}</span></div></aside></div>`;
  }
  function renderCombatTracker(enc){
    const turn=activeCombatTurn(enc);const order=enc.turnOrder||[];
    return `<section class="panel turn-tracker"><div class="row between"><div><div class="small-caps">Ordem de iniciativa</div><h3 style="margin:6px 0 0">Rodada ${enc.round||1}</h3></div><span class="tag gold">${order.length} participante(s)</span></div><div class="turn-order">${order.map((t,i)=>`<div class="turn-token ${i===Number(enc.turnIndex||0)?'active':''}"><strong>${esc(t.name)}</strong><small>${t.kind==='monster'?'Criatura':'Aventureiro'} · Iniciativa ${t.initiative}</small></div>`).join('')}</div><div class="notice" style="margin-top:12px"><strong>Turno atual:</strong> ${esc(turn?.name||'—')} ${turn?.kind==='monster'?'(monstro)': '(jogador)'}</div>${isMaster()?`<div class="row" style="margin-top:10px">${turn?.kind==='monster'?'<button class="btn btn-danger btn-small" data-action="resolve-monster-turn">Resolver ação do monstro</button>':''}<button class="btn btn-secondary btn-small" data-action="advance-turn">Avançar / pular turno</button></div>`:''}</section>`;
  }
  function renderBattleCard(enc){
    const hp=Math.max(0,Math.min(100,enc.hp/Math.max(1,enc.maxHp)*100));const turn=activeCombatTurn(enc);const own=state.member?.character?normalizeCharacter(state.member.character):null;const ownVitals=own?currentPartyVitals(currentUserId(),own):null;const canAct=isPlayersCombatTurn()&&masterIsOnline()&&!enc.defeated&&Number(enc.hp)>0;const rule=classRule(own||{});const abilityUsed=ownVitals?.abilityUsed;
    let playerActions='';
    if(enc.defeated||Number(enc.hp)<=0){playerActions='<div class="notice"><strong>Vitória!</strong> A criatura foi derrotada. O encontro está concluído.</div>'}
    else if(!isMaster()&&canAct){playerActions=`<div class="battle-controls"><button class="btn btn-primary btn-small" data-action="combat-attack">Ataque básico</button><button class="btn btn-secondary btn-small" data-action="combat-ability" ${abilityUsed?'disabled':''}>${esc(rule.abilityName)}${abilityUsed?' · usada':''}</button><button class="btn btn-quiet btn-small" data-action="combat-potion" ${(ownVitals?.inventory||[]).some(i=>i.id==='pocao-cura'&&i.qty>0)?'':'disabled'}>Usar poção</button></div>`}
    else if(!isMaster())playerActions=`<div class="notice">${turn?.kind==='monster'?'O monstro está agindo. Aguarde o próximo turno.':turn?.user_id===currentUserId()?'Seu turno está disponível.':'Aguarde sua vez na ordem de iniciativa.'}</div>`;
    return `<section class="battle-card"><div class="battle-art">${enc.emoji||'🐉'}</div><div class="battle-content"><span class="tag red">${esc(enc.threat||'CRIATURA HOSTIL')}</span><h3>${esc(enc.name)}</h3><div class="row between"><span class="muted" style="font-size:9px">${esc(enc.kind||'Criatura desconhecida')} · Nível ${esc(enc.level||1)}</span><span class="muted" style="font-size:9px">Defesa ${esc(enc.defense||12)}</span></div><div class="hp-row"><strong>Pontos de vida</strong><strong>${enc.hp} / ${enc.maxHp} HP</strong></div><div class="hp-track"><div class="hp-fill" style="width:${hp}%"></div></div><p class="panel-subtitle" style="margin-top:10px"><strong>${esc(enc.specialName||'Instinto da criatura')}:</strong> ${esc(enc.specialDescription||'Age de acordo com seus instintos.')}</p><p class="panel-subtitle">Recompensa pela vitória: <strong>${Number(enc.xpReward)||0} XP</strong> para cada aventureiro que participou.</p>${playerActions}${isMaster()&&enc.defeated?'<div class="notice"><strong>Encontro concluído.</strong> Experiência distribuída.</div>':''}${isMaster()?`<div class="battle-controls"><input class="input" id="master-damage" type="number" min="0" max="1000" value="10" aria-label="Dano manual"><button class="btn btn-danger btn-small" data-action="master-apply-damage">Aplicar dano manual</button><button class="btn btn-quiet btn-small" data-action="end-encounter">Encerrar</button></div>`:''}</div></section>`;
  }
  function renderInventoryModal(){
    const ch=state.member?.character?normalizeCharacter(state.member.character):null;if(!ch){toast('Crie um personagem para consultar o inventário.','error');return}
    const vitals=currentPartyVitals(currentUserId(),ch);const eq=ch.equipment||{};
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal wide" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="page-kicker">Pertences do aventureiro</div><h2>Equipamentos e mochila</h2><p>${esc(ch.name)} · ${esc(ch.class)} · Nível ${ch.level}</p></div><button class="modal-close" data-action="close-modal">×</button></div><div class="stat-grid"><div class="stat-card"><small>HP atual</small><strong>${vitals.hp}/${vitals.maxHp}</strong></div><div class="stat-card"><small>Defesa</small><strong>${vitals.defense}</strong></div></div><h3>Equipado</h3><div class="member-list">${[['Arma',eq.weapon],['Armadura',eq.armor],['Escudo',eq.shield]].filter(x=>x[1]).map(x=>`<div class="member-row"><div class="avatar">${x[0]==='Arma'?'⚔':'🛡'}</div><div><strong>${esc(x[1].name)}</strong><small>${esc(x[0])} · ${esc(x[1].description||'')}</small></div><span class="spacer"></span><span class="tag">${x[0]==='Arma'?`1d${x[1].damageDie||6}`:`+${x[1].defense||0} DEF`}</span></div>`).join('')||'<p>Nenhum equipamento.</p>'}</div><div class="divider"></div><h3>Mochila</h3><div class="member-list">${vitals.inventory.map(item=>`<div class="member-row"><div class="avatar">${item.kind==='consumable'?'🧪':'🎒'}</div><div><strong>${esc(item.name)}</strong><small>${esc(item.description||'')}</small></div><span class="spacer"></span><span class="tag">x${item.qty||0}</span></div>`).join('')}</div><div class="notice">Poções e consumíveis são utilizados durante o turno do personagem. Os itens consumidos ficam registrados na campanha.</div></section></div>`;
  }
  function formatEvent(ev){const p=ev.payload||{};let title='Acontecimento registrado',desc='';switch(ev.event_type){case'dice_result':title=`D20 · ${p.player_name||'Aventureiro'}`;desc=`Resultado: ${p.result}${p.reason?' · '+p.reason:''}`;break;case'dice_prompt':title='O mestre solicitou um teste';desc=p.reason||'Um aventureiro pode lançar o D20.';break;case'damage_applied':title=`${p.player_name||'Aventureiro'} causou dano`;desc=`${p.amount} de dano em ${p.monster||'a criatura'} · ${p.hp} HP restantes`;break;case'damage_request':title=`${p.player_name||'Aventureiro'} declarou um ataque`;desc=`Dano solicitado: ${p.amount}`;break;case'narration':title='Narração do mestre';desc=p.text||'';break;case'chat_message':title=`${p.display_name||'Aventureiro'} · mensagem`;desc=p.text||'';break;case'encounter_started':title='Encontro iniciado';desc=p.monster||'Uma criatura apareceu.';break;case'combat_action_result':title=`Ação de ${p.player_name||'Aventureiro'}`;desc=p.description||`Rolagem ${p.natural||'—'} · Dano ${p.damage||0}`;break;case'encounter_defeated':title='Vitória da companhia';desc=p.description||`${p.monster||'A criatura'} foi derrotada. XP distribuído.`;break;case'monster_attack_result':title=`Ação de ${p.monster||'Monstro'}`;desc=p.description||'A criatura realizou sua ação.';break;case'turn_advanced':title='Turno avançado';desc=p.description||'A ordem de iniciativa avançou.';break;default:desc=JSON.stringify(p)}return `<div class="event-item"><strong>${esc(title)}</strong><p>${esc(desc)}</p><time>${new Date(ev.created_at||Date.now()).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</time></div>`}

  function formatChatMessage(ev){const p=ev.payload||{};const mine=ev.actor_id===currentUserId();return `<div class="chat-message ${mine?'mine':''}"><div class="chat-message-meta"><strong>${esc(p.display_name||'Aventureiro')}</strong><time>${new Date(ev.created_at||Date.now()).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</time></div><p>${esc(p.text||'')}</p></div>`}

  function renderMasterGuideModal(){
    const c=state.campaign,gs=c?.game_state||defaultGameState();
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal wide" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="page-kicker">Apenas o mestre</div><h2>Central do Mestre</h2><p>Ferramentas rápidas para conduzir a sessão e consultar a crônica.</p></div><button class="modal-close" data-action="close-modal">×</button></div><div class="stat-grid"><div class="stat-card"><small>Participantes</small><strong>${state.members.length}</strong></div><div class="stat-card"><small>Estado</small><strong style="font-size:15px">${c.status==='active'?'Ao vivo':'Pausada'}</strong></div><div class="stat-card"><small>Eventos registrados</small><strong>${state.events.length}</strong></div></div><div class="divider"></div><h3>Preparação da aventura</h3><div class="member-list"><div class="member-row"><div class="avatar">✦</div><div><strong>${esc(gs.chapter||'Prólogo')}</strong><small>Capítulo atual</small></div><span class="spacer"></span><span class="tag gold">Crônica</span></div><div class="member-row"><div class="avatar">⌖</div><div><strong>${esc(gs.location||'Local desconhecido')}</strong><small>Localização atual</small></div></div></div><div class="divider"></div><h3>Ações rápidas</h3><div class="hero-actions"><button class="btn btn-secondary" data-action="request-dice">Solicitar D20</button><button class="btn btn-secondary" data-action="start-encounter">Iniciar encontro</button><button class="btn btn-secondary" data-action="open-narration">Publicar narração</button><button class="btn btn-quiet" data-action="open-book" data-book="master">Livro do Mestre</button></div><div class="divider"></div><div class="notice"><strong>Lembrete:</strong> segredos, estatísticas ocultas e revelações devem permanecer na biblioteca do mestre. O que for narrado na sala será compartilhado com todos.</div></section></div>`;
  }
  function renderSettingsModal(){const cfg=loadConfig()||{};modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><div><h2 id="modal-title">Conexão e armazenamento</h2><p>Configure seu projeto Supabase para ativar campanhas compartilhadas entre computadores.</p></div><button class="modal-close" data-action="close-modal" aria-label="Fechar">×</button></div><div class="notice"><strong>Importante:</strong> use a URL do projeto e a Publishable key (sb_publishable_...). Nunca coloque a Secret/service_role key neste site.</div><form id="settings-form" style="margin-top:18px"><div class="field"><label for="sb-url">SUPABASE PROJECT URL</label><input class="input" id="sb-url" type="url" placeholder="https://seu-projeto.supabase.co" value="${esc(cfg.url||'')}" required><span class="hint">Encontre no Connect dialog ou em Project Settings → API Keys.</span></div><div class="field"><label for="sb-key">PUBLISHABLE KEY (CHAVE PÚBLICA)</label><textarea class="textarea" id="sb-key" rows="3" placeholder="Cole aqui a chave pública do projeto" required>${esc(cfg.key||'')}</textarea><span class="hint">A Publishable key pode ser usada no navegador quando as políticas RLS estiverem configuradas corretamente. Não use uma Secret key.</span></div><div class="notice">Antes de conectar: execute <strong>supabase-schema.sql</strong> no SQL Editor e habilite Anonymous Sign-Ins em Authentication → Providers.</div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="disconnect-backend">Usar modo local</button><button type="submit" class="btn btn-primary">Conectar Supabase</button></div></form></section></div>`}
  async function startEncounter(template){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode iniciar encontros.');
    const participants=state.members.filter(m=>m.role==='player'&&m.character);
    if(!participants.length)throw new Error('É necessário que pelo menos um jogador tenha criado um personagem antes de iniciar o combate.');
    const gs=state.campaign.game_state||defaultGameState();const partyState={...(gs.partyState||{})};
    participants.forEach(m=>{const ch=normalizeCharacter(m.character);const old=partyState[m.user_id]||{};partyState[m.user_id]={hp:Math.max(0,Math.min(Number(old.maxHp)||ch.maxHp,Number.isFinite(Number(old.hp))?Number(old.hp):ch.hp)),maxHp:Number(old.maxHp)||ch.maxHp,defense:ch.defense,inventory:Array.isArray(old.inventory)?old.inventory:ch.inventory,abilityUsed:false}});
    const enc={...template,templateId:template.id,id:crypto.randomUUID?crypto.randomUUID():`enc-${Date.now()}`,round:1,turnIndex:0,specialUsed:false,defeated:false,xpAwarded:false,participantIds:participants.map(m=>m.user_id)};
    enc.turnOrder=buildTurnOrder(enc,state.members);
    await updateGameState({encounter:enc,partyState});await createEvent('encounter_started',{monster:enc.name,round:1,turn_order:enc.turnOrder});toast(`Encontro iniciado: ${enc.name}. A ordem de iniciativa foi definida.`);
  }
  function renderEncounterModal(){
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal wide" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="page-kicker">Preparar combate</div><h2>Escolher criatura</h2><p>Selecione um inimigo do bestiário inicial. A iniciativa será rolada automaticamente.</p></div><button class="modal-close" data-action="close-modal">×</button></div><form id="encounter-form"><div class="choice-grid">${MONSTERS.map((m,i)=>`<label class="choice-card ${i===0?'selected':''}"><input type="radio" name="monster" value="${m.id}" ${i===0?'checked':''} onchange="document.querySelectorAll('.choice-card').forEach(x=>x.classList.remove('selected'));this.closest('.choice-card').classList.add('selected')"><strong>${m.emoji} ${esc(m.name)}</strong><small>${esc(m.kind)} · Nível ${m.level} · ${m.hp} HP · Defesa ${m.defense}</small><small>${esc(m.specialName)}: ${esc(m.specialDescription)}</small></label>`).join('')}</div><input type="hidden" id="monster-template" value="${MONSTERS[0].id}"><div class="notice">Apenas personagens que já possuem ficha entram na ordem de iniciativa. O monstro terá seu próprio turno e poderá atacar automaticamente.</div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button type="submit" class="btn btn-primary">Iniciar encontro</button></div></form></section></div>`;
    modalRoot.querySelectorAll('input[name="monster"]').forEach(r=>r.addEventListener('change',()=>{$('#monster-template').value=r.value}));
  }

  function renderRollPromptModal(){
    const players=state.members.filter(m=>m.role==='player');
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><div><h2>Solicitar teste de D20</h2><p>Escolha quem deverá rolar e explique o teste.</p></div><button class="modal-close" data-action="close-modal">×</button></div><form id="roll-prompt-form"><div class="field"><label for="roll-target">QUEM DEVE ROLAR?</label><select class="select" id="roll-target"><option value="all">Todos os jogadores</option>${players.map(m=>`<option value="${esc(m.user_id)}">${esc(m.display_name||'Aventureiro')}</option>`).join('')}</select></div><div class="field"><label for="roll-reason">QUAL É O TESTE?</label><input class="input" id="roll-reason" maxlength="140" placeholder="Ex.: Teste de percepção para encontrar armadilhas" value="Teste de D20"></div><div class="notice">Cada jogador selecionado poderá responder uma única vez. O navegador do mestre calcula e publica o resultado.</div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button class="btn btn-primary" type="submit" ${players.length?'':'disabled'}>Solicitar rolagem</button></div></form></section></div>`;
  }

  function renderCreateModal(){modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><div><h2>Criar uma nova campanha</h2><p>Você será o mestre e terá controle sobre esta crônica.</p></div><button class="modal-close" data-action="close-modal">×</button></div><form id="create-form"><div class="field"><label for="campaign-name">NOME DA CAMPANHA</label><input class="input" id="campaign-name" maxlength="70" placeholder="Ex.: O Chamado da Deusa" required></div><div class="field"><label for="campaign-desc">DESCRIÇÃO (OPCIONAL)</label><textarea class="textarea" id="campaign-desc" maxlength="500" placeholder="Conte aos jogadores um pouco sobre a aventura..."></textarea></div><div class="notice">A campanha será salva ${state.backendReady?'no Supabase e poderá ser acessada por outros computadores.':'localmente neste navegador. Configure o Supabase para jogar com amigos pela internet.'}</div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button class="btn btn-primary" type="submit">Criar campanha ✦</button></div></form></section></div>`}
  function renderJoinModal(){modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><div><h2>Entrar em uma campanha</h2><p>Informe o código compartilhado pelo mestre.</p></div><button class="modal-close" data-action="close-modal">×</button></div><form id="join-form"><div class="field"><label for="join-code">CÓDIGO DA CAMPANHA</label><input class="input" id="join-code" placeholder="AETHRA-0000" value="${esc(state.prefillJoinCode||'')}" style="text-transform:uppercase;letter-spacing:2px" required></div><div class="field"><label for="join-name">NOME PARA EXIBIÇÃO</label><input class="input" id="join-name" maxlength="40" placeholder="Como os outros jogadores verão você?" required></div><div class="notice">Ao entrar, você aparecerá no salão dos aventureiros. Sua ficha poderá ser criada ou editada antes do início da sessão.</div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button type="submit" class="btn btn-primary">Entrar na campanha →</button></div></form></section></div>`}
  function renderCharacterModal(){const d=state.charDraft||newCharacterDraft(),step=state.charStep;const steps=['Identidade','Origem','Classe','Atributos','Resumo'];let body='';
    if(step===0)body=`<div class="field"><label for="char-name">NOME DO PERSONAGEM</label><input class="input" id="char-name" maxlength="40" placeholder="Ex.: Aldric, o Guardião" value="${esc(d.name)}"></div><div class="field"><label for="char-age">IDADE (OPCIONAL)</label><input class="input" id="char-age" type="number" min="1" max="999" placeholder="Ex.: 27" value="${esc(d.age||'')}"></div><div class="field"><label for="char-personality">PERSONALIDADE E HISTÓRIA</label><textarea class="textarea" id="char-personality" placeholder="Como seu personagem age? O que o trouxe até esta aventura?">${esc(d.personality||'')}</textarea><span class="hint">Não precisa escrever uma biografia inteira. Algumas ideias já ajudam o mestre a criar momentos personalizados.</span></div>`;
    if(step===1)body=`<h3>Escolha o reino de origem</h3><div class="choice-grid">${REALMS.map(r=>`<button type="button" class="choice-card ${d.realm===r.name?'selected':''}" data-choice="realm" data-value="${r.name}"><strong>${r.emoji} ${r.name}</strong><small>${r.subtitle} · ${r.bonus}</small></button>`).join('')}</div><div class="divider"></div><h3>Escolha sua raça</h3><div class="choice-grid">${RACES.map(r=>`<button type="button" class="choice-card ${d.race===r[0]?'selected':''}" data-choice="race" data-value="${r[0]}"><strong>${r[0]}</strong><small>${r[1]}</small></button>`).join('')}</div>`;
    if(step===2)body=`<h3>Escolha sua classe</h3><p class="panel-subtitle">A classe define o estilo de jogo e as habilidades que seu personagem desenvolverá.</p><div class="choice-grid">${CLASSES.map(c=>`<button type="button" class="choice-card ${d.class===c[0]?'selected':''}" data-choice="class" data-value="${c[0]}"><strong>${c[2]} ${c[0]}</strong><small>${c[1]}</small></button>`).join('')}</div>`;
    if(step===3)body=`<h3>Distribua seus atributos</h3><p class="panel-subtitle">Você tem 24 pontos para distribuir. Cada atributo começa em 1 e pode chegar a 8 nesta criação inicial.</p><div class="notice" style="margin:12px 0">Pontos disponíveis: <strong id="points-left">${24-Object.values(d.attributes).reduce((a,b)=>a+b,0)}</strong> · Ajuste os controles para combinar com seu estilo.</div>${ATTRS.map(a=>`<div class="attribute-row"><div><strong>${a[1]}</strong><small>${a[2]}</small></div><input type="range" min="1" max="8" value="${d.attributes[a[0]]}" data-attribute="${a[0]}"><b id="attr-${a[0]}">${d.attributes[a[0]]}</b></div>`).join('')}`;
    if(step===4){const cl=CLASSES.find(x=>x[0]===d.class);const realm=REALMS.find(x=>x.name===d.realm);body=`<div class="panel" style="background:rgba(212,177,109,.045)"><div class="row between"><span class="tag gold">Prévia da ficha</span><span class="tag">Nível 1</span></div><h2 class="page-title" style="margin:15px 0 6px">${esc(d.name||'Aventureiro sem nome')}</h2><p class="panel-subtitle">${esc(d.race)} · ${esc(d.class)} · ${esc(d.realm)}</p><p class="panel-subtitle">${esc(cl?.[1]||'')} ${realm?'Origem: '+esc(realm.subtitle)+'.':''}</p><div class="divider"></div><div class="stat-grid"><div class="stat-card"><small>HP Máximo</small><strong>${normalizeCharacter(d).maxHp}</strong></div><div class="stat-card"><small>Defesa</small><strong>${normalizeCharacter(d).defense}</strong></div><div class="stat-card"><small>Nível</small><strong>1</strong></div></div><div class="divider"></div><div class="stat-grid">${ATTRS.map(a=>`<div class="stat-card"><small>${a[1]}</small><strong>${d.attributes[a[0]]}</strong></div>`).join('')}</div><div class="divider"></div><p class="panel-subtitle"><strong>Habilidade:</strong> ${esc(classRule(d).abilityName)} — ${esc(classRule(d).abilityDescription)}</p><p class="panel-subtitle"><strong>Arma:</strong> ${esc(normalizeCharacter(d).equipment.weapon.name)} · <strong>Armadura:</strong> ${esc(normalizeCharacter(d).equipment.armor.name)}</p><p class="panel-subtitle"><strong>Personalidade:</strong> ${esc(d.personality||'Ainda não definida.')}</p></div><div class="notice" style="margin-top:14px">Sua ficha começa no nível 1. O sistema calcula HP, defesa, equipamento inicial e habilidade de classe. Durante o combate, HP e itens consumidos serão salvos na campanha.</div>`}
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal wide" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="page-kicker">Criação guiada de personagem</div><h2>${steps[step]} · Etapa ${step+1} de 5</h2><p>Leia as orientações e escolha com calma. Você poderá ajustar a ficha antes da aventura.</p></div><button class="modal-close" data-action="close-modal">×</button></div><div class="wizard-progress">${steps.map((_,i)=>`<span class="${i<=step?'done':''}"></span>`).join('')}</div><div id="char-step-body">${body}</div><div class="modal-actions"><button class="btn btn-quiet" data-action="char-prev" ${step===0?'disabled':''}>← Voltar</button><button class="btn btn-primary" data-action="char-next">${step===4?'Salvar personagem':'Continuar →'}</button></div></section></div>`;
  }
  function newCharacterDraft(){return{name:'',age:'',personality:'',realm:'Eldoria',race:'Humano',class:'Guerreiro',level:1,xp:0,attributes:{forca:5,destreza:4,constituicao:5,inteligencia:3,sabedoria:4,carisma:3}}}
  function renderBookModal(){const b=BOOKS.find(x=>x.id===state.currentBook);if(!b){state.modal=null;return}const chapters={master:['A verdade sobre a Guerra da Ruptura','Elyndra e Vharzun','Os cinco chamados','Segredos dos reinos','Estrutura da campanha'],bestiary:['Como ler uma criatura','Criaturas das florestas','Monstros corrompidos','Criaturas das sombras'],bosses:['Chefes e fases de combate','Generais de Vharzun','Dragões ancestrais'],atlas:['A origem de Aethra','Eldoria','Drakmor','Nivéria','Thalassor','Solária'],grimoire:['Princípios da magia','Escolas arcanas','Magias de combate','Magias de suporte'],arsenal:['Raridade e qualidade','Armas','Armaduras','Poções e relíquias'],adventurer:['Criando seu herói','Atributos e testes','Combate e turnos','Interpretação e exploração']}[b.id]||[];modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal wide" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="page-kicker">Biblioteca de Aethra · ${b.access}</div><h2>${b.title}</h2><p>${b.desc}</p></div><button class="modal-close" data-action="close-modal">×</button></div><div class="notice">Este é o sumário estrutural da primeira versão. O conteúdo completo será escrito e diagramado em uma etapa editorial própria.</div><div class="divider"></div><h3>Sumário previsto</h3><div class="member-list">${chapters.map((c,i)=>`<div class="member-row"><div class="avatar">${String(i+1).padStart(2,'0')}</div><div><strong>${c}</strong><small>Capítulo em preparação</small></div><span class="spacer"></span><span class="tag">Em breve</span></div>`).join('')}</div></section></div>`}

  function openModal(which){state.modal=which;if(which==='character'){state.charStep=0;state.charDraft=state.member?.character?JSON.parse(JSON.stringify(state.member.character)):newCharacterDraft()}render()}
  function closeModal(){state.modal=null;state.currentBook=null;modalRoot.innerHTML=''}
  function showDice(result,player){
    const overlay=document.createElement('div');overlay.className='dice-overlay';overlay.innerHTML=`<div class="dice-stage"><div class="dice-cube">${result}</div><h2>${result===20?'Sucesso crítico!':result===1?'Falha crítica!':'Resultado do D20: '+result}</h2><p>${esc(player)} realizou uma rolagem</p><button class="btn btn-secondary btn-small" data-action="dismiss-dice">Continuar</button></div>`;document.body.append(overlay);playDiceSound();setTimeout(()=>{if(overlay.isConnected)overlay.remove()},5200);overlay.querySelector('[data-action="dismiss-dice"]').addEventListener('click',()=>overlay.remove());
  }
  function playDiceSound(){try{const ctx=new(window.AudioContext||window.webkitAudioContext)();const now=ctx.currentTime;for(let i=0;i<5;i++){const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='triangle';osc.frequency.setValueAtTime(260+i*65,now+i*.075);gain.gain.setValueAtTime(.0001,now+i*.075);gain.gain.exponentialRampToValueAtTime(.045,now+i*.075+.012);gain.gain.exponentialRampToValueAtTime(.0001,now+i*.075+.065);osc.connect(gain);gain.connect(ctx.destination);osc.start(now+i*.075);osc.stop(now+i*.075+.07)}setTimeout(()=>ctx.close(),800)}catch(e){}}

  // Ações da interface
  document.addEventListener('click',async e=>{
    const btn=e.target.closest('[data-action]');if(!btn)return;const action=btn.dataset.action;
    if(action==='backdrop-close'&&e.target===btn){closeModal();return}
    try{
      if(action==='go-home'){state.view='home';closeModal();render()}
      else if(action==='open-library'){state.view='library';closeModal();render()}
      else if(action==='my-campaigns'){state.view='campaigns';closeModal();render();loadCloudCampaigns()}
      else if(action==='open-settings')openModal('settings')
      else if(action==='create-campaign')openModal('create')
      else if(action==='join-campaign')openModal('join')
      else if(action==='close-modal')closeModal()
      else if(action==='disconnect-backend')disconnectSupabase()
      else if(action==='open-book'){state.currentBook=btn.dataset.book;state.modal='book';render()}
      else if(action==='open-cloud-campaign'){await openCloudCampaign(btn.dataset.id)}
      else if(action==='open-local-campaign'){const c=localCampaignById(btn.dataset.id);if(c){state.campaign=c;state.member=c.members.find(m=>m.user_id==='local-user')||c.members[0];state.members=c.members;state.events=c.events||[];state.pendingDamage=state.events.filter(e=>e.event_type==='damage_request');localStorage.setItem(KEYS.active,c.id);state.view=c.status==='active'?'session':'lobby';render()}}
      else if(action==='copy-code'){await navigator.clipboard?.writeText(state.campaign.code);toast('Código copiado.');}
      else if(action==='copy-invite'){const link=location.href.split('?')[0]+'?join='+encodeURIComponent(state.campaign.code);await navigator.clipboard?.writeText(link);toast('Link de convite copiado.');}
      else if(action==='create-character')openModal('character')
      else if(action==='char-prev'){if(state.charStep>0){state.charStep--;render()}}
      else if(action==='char-save')await saveCharacter(state.charDraft)
      else if(action==='start-session'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre pode iniciar a sessão.');await updateGameState({started:true},'active');state.view='session';render();toast('A sessão começou. Os aventureiros foram convocados!')}
      else if(action==='pause-session'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre pode encerrar a sessão.');await updateGameState({started:false,activeRollPrompt:null},'paused');state.view='lobby';render();toast('Crônica salva. A sessão foi encerrada.')}
      else if(action==='open-lobby'){state.view='lobby';render()}
      else if(action==='request-dice'){if(state.modal==='masterGuide')closeModal();openModal('rollPrompt')}
      else if(action==='cancel-roll-prompt'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode cancelar a solicitação.');await updateGameState({activeRollPrompt:null});toast('Solicitação de rolagem cancelada.')}
      else if(action==='roll-dice'){
        if(isMaster()){const result=secureD20();await createEvent('dice_result',{result,player_name:state.member.display_name||'Mestre',reason:'Rolagem do mestre',natural:result});if(!state.backendReady)showDice(result,state.member.display_name||'Mestre')}
        else {if(!canCurrentPlayerRoll())throw new Error('Não existe uma solicitação de D20 direcionada a você.');const prompt=activeRollPrompt();await createEvent('roll_request',{prompt_id:prompt.id,player_name:state.member?.display_name||'Aventureiro'});toast('Seu resultado foi enviado ao mestre.')}
      }
      else if(action==='sync-campaign'){await refreshCloudCampaign();toast('Crônica sincronizada.')}
      else if(action==='send-chat'){const input=$('#chat-input');const text=input?.value.trim();if(text){await createEvent('chat_message',{text:text.slice(0,500),display_name:state.member?.display_name||'Aventureiro'});if(input)input.value='';render()}}
      else if(action==='start-encounter'){
        if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode iniciar encontros.');
        renderEncounterModal();
      }
      else if(action==='advance-turn'){
        if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode avançar turnos.');
        const enc=state.campaign.game_state?.encounter;if(!enc)throw new Error('Não existe combate ativo.');
        const next=advanceCombatTurn(enc);await updateGameState({encounter:next});await createEvent('turn_advanced',{description:`Agora é o turno de ${activeCombatTurn(next)?.name||'—'}.`,round:next.round});
      }
      else if(action==='resolve-monster-turn')await resolveMonsterTurn();
      else if(action==='combat-attack'||action==='combat-ability'||action==='combat-potion'){
        if(!isPlayersCombatTurn()||state.campaign.game_state.encounter?.defeated)throw new Error('Ainda não é seu turno ou o encontro já terminou.');
        if(!masterIsOnline())throw new Error('O mestre precisa estar online para resolver o combate.');
        const ch=normalizeCharacter(state.member.character);const rule=classRule(ch);
        const actionType=action==='combat-attack'?'attack':action==='combat-ability'?'ability':'item';
        const payload={encounter_id:state.campaign.game_state.encounter.id,round:state.campaign.game_state.encounter.round,turn_index:state.campaign.game_state.encounter.turnIndex,action:actionType,ability_id:actionType==='ability'?rule.abilityId:null,item_id:actionType==='item'?'pocao-cura':null};
        await createEvent('combat_action_request',payload);toast('Ação enviada ao mestre para resolução.');
      }
      else if(action==='open-inventory')renderInventoryModal();
      else if(action==='approve-damage'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre pode validar ataques.');const req=state.pendingDamage.find(x=>x.id===btn.dataset.id);if(req){const enc=state.campaign.game_state?.encounter;const amount=Math.max(0,Math.min(1000,Number(req.payload?.amount)||0));if(!enc||req.payload?.encounter_id!==enc.id){await createEvent('damage_rejected',{request_id:req.id,player_name:req.payload?.player_name||'Aventureiro',reason:'O encontro correspondente já foi encerrado.'})}else if(amount){const hp=Math.max(0,enc.hp-amount);await updateGameState({encounter:{...enc,hp}});await createEvent('damage_applied',{amount,hp,monster:enc.name,player_name:req.payload?.player_name||'Aventureiro',request_id:req.id})}state.pendingDamage=state.pendingDamage.filter(x=>x.id!==req.id);render()}}
      else if(action==='reject-damage'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre pode validar ataques.');const req=state.pendingDamage.find(x=>x.id===btn.dataset.id);if(req){await createEvent('damage_rejected',{request_id:req.id,player_name:req.payload?.player_name||'Aventureiro'});state.pendingDamage=state.pendingDamage.filter(x=>x.id!==req.id);render()}}
      else if(action==='master-apply-damage'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode alterar o HP.');const amount=Math.max(0,Math.min(1000,Number($('#master-damage')?.value)||0));const enc=state.campaign.game_state.encounter;if(enc&&amount&&!enc.defeated){const hp=Math.max(0,enc.hp-amount);const next={...enc,hp,defeated:hp===0,turnOrder:hp===0?[]:enc.turnOrder,turnIndex:hp===0?0:enc.turnIndex};await updateGameState({encounter:next});await createEvent('damage_applied',{amount,hp,monster:enc.name,player_name:state.member.display_name||'Mestre'});if(hp===0){await awardEncounterRewards(next);toast('Criatura derrotada. XP distribuído à companhia.')}}}
      else if(action==='open-damage'){
        modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal" role="dialog"><div class="modal-head"><div><h2>Registrar ataque</h2><p>Informe o dano causado. O mestre confirma e aplica o valor à criatura.</p></div><button class="modal-close" data-action="close-modal">×</button></div><form id="damage-form"><div class="field"><label for="damage-amount">DANO DECLARADO</label><input class="input" type="number" id="damage-amount" min="1" max="1000" value="12" required></div><div class="field"><label for="damage-note">AÇÃO (OPCIONAL)</label><input class="input" id="damage-note" placeholder="Ex.: Golpe poderoso com espada"></div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button class="btn btn-primary" type="submit">Enviar ao mestre</button></div></form></section></div>`;
      }
      else if(action==='end-encounter'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode encerrar o encontro.');await updateGameState({encounter:null});toast('Encontro encerrado.')}
      else if(action==='open-master-guide'){if(!isMaster())throw new Error('Apenas o mestre possui acesso a esta central.');state.modal='masterGuide';renderMasterGuideModal()}
      else if(action==='open-character-sheet'){const ch=state.member?.character;if(ch){state.charDraft=JSON.parse(JSON.stringify(ch));state.charStep=4;state.modal='character';render()}else toast('Crie sua ficha primeiro.','error')}
      else if(action==='open-narration'){
        modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal" role="dialog"><div class="modal-head"><div><h2>Narrar acontecimento</h2><p>Compartilhe uma descrição com todos os participantes.</p></div><button class="modal-close" data-action="close-modal">×</button></div><form id="narration-form"><div class="field"><label for="narration-text">NARRAÇÃO</label><textarea class="textarea" id="narration-text" required placeholder="Descreva o que os aventureiros veem, ouvem ou descobrem..."></textarea></div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button type="submit" class="btn btn-primary">Publicar narração</button></div></form></section></div>`;
      }
    }catch(err){console.error(err);toast(err.message||'Não foi possível concluir a ação.','error')}
  });

  document.addEventListener('click',e=>{
    const choice=e.target.closest('[data-choice]');if(!choice||!state.charDraft)return;
    state.charDraft[choice.dataset.choice]=choice.dataset.value;renderCharacterModal();
  });
  document.addEventListener('input',e=>{
    if(!state.charDraft)return;
    if(e.target.id==='char-name')state.charDraft.name=e.target.value;
    if(e.target.id==='char-age')state.charDraft.age=e.target.value;
    if(e.target.id==='char-personality')state.charDraft.personality=e.target.value;
    if(e.target.dataset.attribute){
      const attr=e.target.dataset.attribute;const base=Object.values(state.charDraft.attributes).reduce((a,b)=>a+b,0);const old=state.charDraft.attributes[attr];let value=Number(e.target.value);const used=base-old+value;if(used>24){value=old;e.target.value=String(old)}state.charDraft.attributes[attr]=value;const out=$('#attr-'+attr);if(out)out.textContent=value;const left=$('#points-left');if(left)left.textContent=24-Object.values(state.charDraft.attributes).reduce((a,b)=>a+b,0);
    }
  });
  document.addEventListener('submit',async e=>{
    e.preventDefault();const form=e.target;
    try{
      if(form.id==='settings-form'){const url=$('#sb-url').value,key=$('#sb-key').value;await connectSupabase(url,key);closeModal();render()}
      else if(form.id==='create-form'){const name=$('#campaign-name').value.trim(),desc=$('#campaign-desc').value.trim();if(!name)throw new Error('Informe o nome da campanha.');await createCampaign(name,desc)}
      else if(form.id==='join-form'){const code=$('#join-code').value.trim().toUpperCase(),name=$('#join-name').value.trim();state.prefillJoinCode=null;await joinCampaign(code,name)}
      else if(form.id==='damage-form'){const amount=Number($('#damage-amount').value),note=$('#damage-note').value.trim(),encounter=state.campaign.game_state?.encounter;if(!encounter?.id)throw new Error('Não existe um encontro ativo.');if(!amount||amount<1)throw new Error('Informe um valor de dano válido.');await createEvent('damage_request',{amount,note,encounter_id:encounter.id,player_name:state.member?.display_name||'Aventureiro'});closeModal();toast('Ataque enviado. O mestre validará o dano.')}
      else if(form.id==='roll-prompt-form'){const target=$('#roll-target').value,reason=$('#roll-reason').value.trim()||'Teste de D20';await requestRoll(target,reason);closeModal()}
      else if(form.id==='encounter-form'){const template=MONSTERS.find(m=>m.id===$('#monster-template').value);if(!template)throw new Error('Escolha uma criatura válida.');await startEncounter(template);closeModal()}
      else if(form.id==='chat-form'){const input=$('#chat-input');const text=input?.value.trim();if(text){await createEvent('chat_message',{text:text.slice(0,500),display_name:state.member?.display_name||'Aventureiro'});input.value='';render()}}
      else if(form.id==='narration-form'){const text=$('#narration-text').value.trim();if(text){await updateGameState({narration:text});await createEvent('narration',{text});closeModal();toast('Narração compartilhada.') }}
    }catch(err){console.error(err);toast(err.message||'Erro ao enviar formulário.','error')}
  });

  async function characterNext(){
    const d=state.charDraft;
    if(state.charStep===0){d.name=$('#char-name')?.value.trim()||d.name;d.age=$('#char-age')?.value||'';d.personality=$('#char-personality')?.value.trim()||'';if(!d.name)throw new Error('Escolha um nome para seu personagem.')}
    if(state.charStep===1&&(!d.realm||!d.race))throw new Error('Escolha um reino e uma raça.');
    if(state.charStep===2&&!d.class)throw new Error('Escolha uma classe.');
    if(state.charStep===4){await saveCharacter(d);return}
    state.charStep++;renderCharacterModal();
  }

  // Erros de validação de wizard são exibidos sem interromper o restante da interface.
  document.addEventListener('click',e=>{const b=e.target.closest('[data-action="char-next"]');if(!b)return;characterNext().catch(err=>toast(err.message,'error'))});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&state.backendReady&&state.campaign)refreshCloudCampaign({silent:true})});
  window.addEventListener('online',()=>{if(state.backendReady&&state.campaign)refreshCloudCampaign({silent:true})});
  window.addEventListener('beforeunload',()=>{if(state.channel&&state.backend)state.backend.removeChannel(state.channel)});

  init().catch(err=>{console.error(err);setConnection('Modo local',false);render();toast('A aplicação iniciou em modo local.','error')});
})();
