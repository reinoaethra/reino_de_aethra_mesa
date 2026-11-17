/* Reino de Aethra v2.1 — raridades mecânicas, requisitos e conjuntos de equipamento.
 * Modo local funciona sem backend. Para salas reais, configure Supabase e aplique o schema/migration.
 */
(() => {
  'use strict';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const app = $('#app'), modalRoot = $('#modal-root'), toastRoot = $('#toast-root');
  const KEYS = { config:'aethra.supabase.config.v1', local:'aethra.local.campaigns.v1', active:'aethra.active.campaign.v1', pendingLinkEmail:'aethra.pending.link.email.v1' };
  const BOOKS = [
    {id:'master',icon:'♛',title:'Livro do Mestre',subtitle:'Guia reservado',desc:'A campanha completa, segredos, capítulos, NPCs, revelações, encontros e orientações para conduzir a narrativa.',access:'Mestre'},
    {id:'bestiary',icon:'♞',title:'Bestiário de Aethra',subtitle:'Criaturas e monstros',desc:'Criaturas comuns, monstros mágicos, mortos-vivos, demônios, atributos, comportamentos e habilidades.',access:'Todos'},
    {id:'bosses',icon:'♜',title:'Os Grandes Chefes',subtitle:'Inimigos lendários',desc:'Chefes de masmorras, generais, dragões ancestrais, fases de batalha e ações lendárias.',access:'Todos'},
    {id:'atlas',icon:'✥',title:'Atlas dos Cinco Reinos',subtitle:'Mundo e localidades',desc:'Geografia, cidades, vilas, fortalezas, rotas, regiões descobertas e mapas de Aethra.',access:'Todos'},
    {id:'grimoire',icon:'✧',title:'Grimório das Artes Arcanas',subtitle:'Magias e habilidades',desc:'Escolas mágicas, feitiços, requisitos, efeitos, custos e regras de utilização.',access:'Todos'},
    {id:'arsenal',icon:'⚔',title:'Arsenal e Relíquias',subtitle:'Equipamentos e tesouros',desc:'Armas, armaduras, acessórios, poções, raridades, artefatos e itens especiais.',access:'Todos'},
    {id:'adventurer',icon:'⚒',title:'Manual do Aventureiro',subtitle:'Regras para jogadores',desc:'Criação de personagens, atributos, raças, classes, testes, combate, exploração e interpretação.',access:'Todos'}
  ];
  const BOOK_CONTENT = {
    master:[
      ['Conduzir uma crônica','O mestre apresenta situações, interpreta personagens do mundo e decide as consequências das ações. Evite retirar a escolha dos jogadores: descreva riscos claros, aceite soluções criativas e use os testes quando houver incerteza relevante.',['Comece cada sessão recapitulando os últimos acontecimentos.','Apresente objetivos imediatos e deixe espaço para exploração.','Registre decisões importantes no diário da campanha.']],
      ['Estrutura da campanha','A campanha ampliada começa em Eldoria e conduz o grupo por cinco grandes arcos: o santuário ferido, as marés de Thalassor, o inverno de Nivéria e as cinzas de Solária. Cada arco apresenta uma relíquia e pistas sobre a prisão de Elyndra.',['Capítulo I: Ecos na Estrada de Eldoria.','Capítulo II: As Raízes Sob a Pedra.','Capítulos III a V: Thalassor, Nivéria e Solária.']],
      ['Ritmo, encontros e recompensas','Alterne investigação, conversas, exploração e combate. Use monstros de nível compatível com o grupo e ajuste HP ou quantidade de inimigos se a luta ficar longa demais. Recompensas narrativas podem abrir caminhos, enquanto XP e tesouros devem ser anotados na ficha.',['Dê pistas antes de um perigo importante.','Ofereça mais de uma forma de resolver objetivos.','Não esconda a única pista necessária atrás de uma única rolagem.']]
    ],
    bestiary:[
      ['Como ler uma criatura','Nível é uma referência de dificuldade; Defesa é o valor que ataques precisam alcançar; HP mede resistência. Bônus de ataque e dano orientam as ações do monstro. A habilidade especial é uma sugestão de comportamento e deve ser aplicada com consistência.',['Use criaturas comuns para pressionar recursos.','Combine tipos diferentes em encontros maiores.','Chefes devem ter sinais claros antes de ataques perigosos.']],
      ['Criaturas catalogadas','O bestiário inicial inclui Goblin das Cinzas, Lobo Cinzento, Espectro da Ruptura e Campeão Orc. A expansão acrescenta Aranha de Umbrafunda, Cultista do Véu Cinzento, Golem de Basalto, Sereia Abissal, Cavaleiro Oco de Solária e Draco de Cristal Niveriano.',['Florestas: lobos e goblins.','Ruínas e galerias: espectros, aranhas e cultistas.','Reinos distantes: golem, sereia, cavaleiro e draco.']],
      ['Comportamento em cena','Uma criatura não precisa lutar até cair. Feras podem recuar, cultistas podem proteger um ritual e construtos podem guardar uma passagem. Use terreno, objetivos e moral para que os encontros contem histórias.',['Descreva sons, rastros e sinais de presença.','Permita negociação ou fuga quando fizer sentido.','Registre criaturas únicas e mudanças feitas pelo mestre.']]
    ],
    bosses:[
      ['Construindo um chefe','Um chefe deve ter presença narrativa, objetivo próprio e uma arena que influencie a luta. Divida a batalha em momentos legíveis, sem depender apenas de uma grande quantidade de HP.',['Anuncie ataques especiais antes de resolvê-los.','Use mudanças de cenário para marcar fases.','Dê aos jogadores oportunidades de interromper ou evitar perigos.']],
      ['Drakthar, o Devorador','Drakthar é um dragão ancestral ligado à captura de Elyndra. Seu sopro das cinzas representa a corrupção que se espalha pelos reinos. A ficha atual contém HP elevado e uma ação de área; o mestre deve ajustar a duração conforme o tamanho e nível do grupo.',['Fase I: medir a força dos heróis.','Fase II: intensificar a pressão e alterar a arena.','Fase III: tornar o sopro e as decisões finais centrais.']],
      ['Generais de Vharzun','Os generais devem ser introduzidos por sinais, relatos e consequências antes de enfrentados. Cada um pode representar uma ameaça regional e um estilo de combate distinto.',['Um general militar com tropas e fortificações.','Um feiticeiro que manipula memórias e juramentos.','Um guardião dracônico ligado às relíquias.']]
    ],
    atlas:[
      ['A origem de Aethra','Aethra é formado por cinco reinos ligados por antigas rotas e por uma história comum. Elyndra, guardiã da criação, foi capturada por Vharzun após a Guerra da Ruptura Celestial. Antes de cair, invocou heróis tocados pelas forças dos reinos.',['Eldoria — natureza e vida.','Drakmor — fogo, forja e resistência.','Nivéria — gelo, memória e conhecimento.','Thalassor — marés, adaptação e mistério.','Solária — luz, determinação e legado.']],
      ['Eldoria e Drakmor','Eldoria reúne florestas ancestrais, vilas de madeira e santuários vivos. Brumafolha serve como ponto de partida da companhia. Drakmor é uma região vulcânica de fortalezas e forjas, onde materiais raros e tradições de ferreiros preservam histórias antigas.',['Locais conhecidos: Estrada de Eldoria, Vila de Brumafolha, Torre dos Vigias e Santuário das Raízes.','Use trilhas, rios e oficinas como pontos de encontro e investigação.']],
      ['Nivéria, Thalassor e Solária','Nivéria guarda bibliotecas e cidades de cristal. Thalassor conecta ilhas, portos e ruínas submersas. Solária abriga desertos dourados e templos solares. Os arcos futuros podem expandir cidades, rotas e mapas conforme a campanha avança.',['Inclua clima e costumes locais na descrição.','Mostre como a corrupção de Vharzun afeta cada reino de modo diferente.']]
    ],
    grimoire:[
      ['Princípios da magia','A magia em Aethra nasce da relação entre intenção, conhecimento e afinidade. O Arcano molda energia; Druidas escutam forças vivas; Clérigos canalizam proteção; Invocadores estabelecem vínculos. As habilidades de classe existentes são a base mecânica atual.',['Descreva a origem visual e sonora de cada conjuração.','Mantenha custos e efeitos claros antes do uso.']],
      ['Escolas e aplicações','Magias podem ser ofensivas, defensivas, restauradoras, de controle ou de exploração. O efeito narrativo deve combinar com a escola e com a situação, sem ultrapassar o que a ficha permite.',['Ofensiva: dano e pressão.','Proteção: defesa, barreiras e resistência.','Suporte: cura, auxílio e percepção.','Controle: restringir movimento ou alterar o terreno.']],
      ['Conjuração na mesa','Quando uma magia tiver resultado incerto, o mestre solicita um teste apropriado. Registre alvos, alcance e duração na narração. Efeitos complexos devem ser acordados antes da rolagem.',['Explique o risco da falha.','Evite resolver efeitos importantes sem informar o jogador.']]
    ],
    arsenal:[
      ['Raridade e qualidade','A interface diferencia visualmente itens Comuns, Incomuns, Raros, Épicos e Lendários. Na versão 1.5, raridade continua sendo metadado visual: não concede bônus automáticos. O mestre define propriedades e valores até a implementação do sistema completo de itens.',['Comum: equipamento cotidiano.','Incomum e Raro: peças especiais ou regionais.','Épico e Lendário: relíquias de grande importância narrativa.']],
      ['Armas e armaduras','Armas são descritas por tipo, dado de dano e precisão; armaduras e escudos podem contribuir para a Defesa. Compare os valores da ficha antes de substituir um item e registre qualquer ajuste manual no inventário.',['Armas leves favorecem agilidade.','Armas pesadas favorecem impacto.','Armaduras e escudos protegem, mas devem respeitar as regras da classe.']],
      ['Poções e relíquias','Poções são consumíveis e relíquias podem abrir caminhos, revelar memórias ou proteger contra forças específicas. Na campanha atual, recompensas descritas nas missões são entregues narrativamente pelo mestre e ainda não são adicionadas automaticamente ao inventário.',['Registre quem recebeu cada recompensa.','Anote cargas, duração e condições de uso.']]
    ],
    adventurer:[
      ['Criando seu herói','Escolha nome, raça, classe e reino de origem. Distribua atributos conforme o assistente de criação e leia a habilidade da classe. A ficha é a referência compartilhada para HP, Defesa, nível, experiência e equipamento.',['Defina uma motivação e um vínculo com outro personagem.','Converse com o grupo sobre papéis e expectativas.']],
      ['Testes e combate','O mestre solicita o D20 quando uma ação tiver risco e resultado incerto. Em combate, acompanhe iniciativa, HP e turnos. Declare intenção e alvo antes de resolver um ataque; o mestre valida o resultado e registra as consequências.',['Descreva o que deseja fazer, não apenas o número que espera obter.','Avise quando estiver usando uma habilidade especial.']],
      ['Exploração e interpretação','Observe pistas, converse com NPCs e use o cenário. Nem todo desafio exige combate: alianças, investigação e criatividade podem resolver objetivos. O diário registra descobertas para que a companhia retome a história em sessões futuras.',['Compartilhe o protagonismo.','Respeite os limites combinados pelo grupo.','Ajude a construir cenas que valorizem as escolhas de todos.']]
    ]
  };

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
    {id:'goblin-cinzas',name:'Goblin das Cinzas',kind:'Humanoide corrompido',level:1,defense:12,hp:42,maxHp:42,attackBonus:3,damageDie:6,damageBonus:1,initiativeBonus:2,threat:'CRIATURA COMUM',xpReward:25,emoji:'👺',portrait:'goblin-ash.webp',specialName:'Golpe oportunista',specialDescription:'Se agir primeiro, recebe +1 no ataque.'},
    {id:'lobo-cinzento',name:'Lobo Cinzento',kind:'Fera selvagem',level:2,defense:13,hp:58,maxHp:58,attackBonus:4,damageDie:8,damageBonus:1,initiativeBonus:3,threat:'AMEAÇA MODERADA',xpReward:40,emoji:'🐺',portrait:'dire-wolf.webp',specialName:'Mordida dilacerante',specialDescription:'Em um 18 ou mais no D20, causa +1d6 de dano.'},
    {id:'espectro-ruptura',name:'Espectro da Ruptura',kind:'Morto-vivo',level:4,defense:15,hp:74,maxHp:74,attackBonus:5,damageDie:8,damageBonus:2,initiativeBonus:4,threat:'AMEAÇA ALTA',xpReward:70,emoji:'👻',portrait:'wraith.webp',specialName:'Toque debilitante',specialDescription:'Em um 18 ou mais no D20, reduz a defesa do alvo em 1 até o fim da próxima rodada.'},
    {id:'campeao-orc',name:'Campeão Orc',kind:'Guerreiro corrompido',level:5,defense:15,hp:96,maxHp:96,attackBonus:6,damageDie:8,damageBonus:2,initiativeBonus:1,threat:'AMEAÇA ALTA',xpReward:90,emoji:'🪓',portrait:'orc-warlord.webp',specialName:'Golpe demolidor',specialDescription:'Em um 19 ou 20 no D20, causa +1d8 de dano.'},
    {id:'drakthar',name:'Drakthar, o Devorador',kind:'Dragão ancestral',level:8,defense:18,hp:720,maxHp:720,attackBonus:8,damageDie:10,damageBonus:4,initiativeBonus:3,threat:'CHEFE · AMEAÇA EXTREMA',xpReward:250,emoji:'🐉',portrait:'drakthar.webp',specialName:'Sopro das Cinzas',specialDescription:'Uma vez por encontro, pode atingir todos os heróis com 2d8 + 4 de dano.'},
    {id:'aranha-umbrafunda',name:'Aranha de Umbrafunda',kind:'Fera das cavernas',level:3,defense:14,hp:66,maxHp:66,attackBonus:4,damageDie:8,damageBonus:1,initiativeBonus:4,threat:'AMEAÇA MODERADA',xpReward:48,emoji:'🕷️',specialName:'Teia sufocante',specialDescription:'Em um 18 ou mais no D20, prende o alvo; o mestre pode exigir um teste de Força para se libertar.'},
    {id:'cultista-cinzento',name:'Cultista do Véu Cinzento',kind:'Humanoide ritualista',level:4,defense:14,hp:78,maxHp:78,attackBonus:5,damageDie:8,damageBonus:2,initiativeBonus:2,threat:'AMEAÇA ALTA',xpReward:65,emoji:'🎭',specialName:'Selo de enfraquecimento',specialDescription:'Marca um herói; o próximo ataque contra ele recebe +2.'},
    {id:'golem-basalto',name:'Golem de Basalto',kind:'Construto elemental',level:5,defense:17,hp:132,maxHp:132,attackBonus:6,damageDie:10,damageBonus:2,initiativeBonus:0,threat:'AMEAÇA ALTA',xpReward:95,emoji:'🗿',specialName:'Punho sísmico',specialDescription:'Um impacto pesado que pode atingir aventureiros próximos, conforme decisão do mestre.'},
    {id:'sereia-abissal',name:'Sereia Abissal',kind:'Criatura das marés',level:6,defense:16,hp:116,maxHp:116,attackBonus:6,damageDie:8,damageBonus:3,initiativeBonus:4,threat:'AMEAÇA ALTA',xpReward:110,emoji:'🧜',specialName:'Canto das profundezas',specialDescription:'Seu canto confunde os sentidos; um alvo que falhe em teste apropriado perde sua próxima reação.'},
    {id:'cavaleiro-solar',name:'Cavaleiro Oco de Solária',kind:'Morto-vivo radiante',level:7,defense:17,hp:148,maxHp:148,attackBonus:7,damageDie:10,damageBonus:3,initiativeBonus:2,threat:'AMEAÇA MUITO ALTA',xpReward:140,emoji:'🛡️',specialName:'Lança do eclipse',specialDescription:'Um golpe de luz sombria que atravessa defesas frágeis.'},
    {id:'draco-niveriano',name:'Draco de Cristal Niveriano',kind:'Dragão menor elemental',level:7,defense:17,hp:160,maxHp:160,attackBonus:7,damageDie:10,damageBonus:3,initiativeBonus:3,threat:'AMEAÇA MUITO ALTA',xpReward:155,emoji:'🐲',specialName:'Estilhaço glacial',specialDescription:'Dispara fragmentos de gelo; o mestre pode reduzir o deslocamento do alvo atingido.'},
    {id:'sabueso-brasas',name:'Sabueso das Brasas',kind:'Fera ígnea',level:4,defense:14,hp:82,maxHp:82,attackBonus:5,damageDie:8,damageBonus:2,initiativeBonus:4,threat:'AMEAÇA ALTA',xpReward:72,emoji:'🐕',specialName:'Investida flamejante',specialDescription:'Ao acertar após se mover, causa +1d6 de dano ígneo.'},
    {id:'guardiao-raiz',name:'Guardião das Raízes',kind:'Construto vegetal',level:5,defense:16,hp:124,maxHp:124,attackBonus:6,damageDie:10,damageBonus:2,initiativeBonus:1,threat:'AMEAÇA ALTA',xpReward:98,emoji:'🌳',specialName:'Laços vivos',specialDescription:'Em um acerto elevado, prende o alvo com raízes até que vença um teste de Força.'},
    {id:'saqueador-afogado',name:'Saqueador Afogado',kind:'Morto-vivo marítimo',level:6,defense:15,hp:108,maxHp:108,attackBonus:6,damageDie:8,damageBonus:3,initiativeBonus:2,threat:'AMEAÇA ALTA',xpReward:105,emoji:'⚓',specialName:'Gancho de coral',specialDescription:'Puxa um aventureiro para perto e dificulta sua retirada.'},
    {id:'revenante-geada',name:'Revenante da Geada',kind:'Morto-vivo niveriano',level:7,defense:17,hp:142,maxHp:142,attackBonus:7,damageDie:10,damageBonus:2,initiativeBonus:3,threat:'AMEAÇA MUITO ALTA',xpReward:145,emoji:'❄️',specialName:'Lamento congelante',specialDescription:'Uma onda de frio que pode reduzir o próximo ataque do alvo.'},
    {id:'escorpiao-solar',name:'Escorpião do Sol Partido',kind:'Fera do deserto',level:8,defense:18,hp:176,maxHp:176,attackBonus:8,damageDie:10,damageBonus:3,initiativeBonus:2,threat:'AMEAÇA MUITO ALTA',xpReward:175,emoji:'🦂',specialName:'Ferrão eclipsado',specialDescription:'Seu veneno enfraquece temporariamente a Defesa.'},
    {id:'general-cinzas',name:'Malgor, General das Cinzas',kind:'Chefe humanoide corrompido',level:10,defense:19,hp:360,maxHp:360,attackBonus:9,damageDie:12,damageBonus:4,initiativeBonus:3,threat:'CHEFE · AMEAÇA EXTREMA',xpReward:280,emoji:'🔥',specialName:'Comando das Cinzas',specialDescription:'Coordena tropas e pode alterar a arena durante o confronto.'},
    {id:'caranguejo-coral',name:'Caranguejo-Catedral',kind:'Guardião crustáceo de Thalassor',level:6,defense:17,hp:138,maxHp:138,attackBonus:6,damageDie:10,damageBonus:2,initiativeBonus:1,threat:'AMEAÇA ALTA',xpReward:112,emoji:'🦀',specialName:'Pinça de Recife',specialDescription:'Prende um alvo; escapar exige um teste de Força ou Destreza.'},
    {id:'sentinela-cristal',name:'Sentinela Prismática',kind:'Construto de cristal de Nivéria',level:8,defense:19,hp:188,maxHp:188,attackBonus:8,damageDie:10,damageBonus:3,initiativeBonus:2,threat:'AMEAÇA MUITO ALTA',xpReward:180,emoji:'💎',specialName:'Refração Arcana',specialDescription:'A primeira magia que a atinge em cada rodada tem seu dano reduzido em 1d8.'},
    {id:'acólito-solar',name:'Acólito do Sol Partido',kind:'Cultista radiante de Solária',level:8,defense:17,hp:154,maxHp:154,attackBonus:8,damageDie:10,damageBonus:3,initiativeBonus:4,threat:'AMEAÇA MUITO ALTA',xpReward:168,emoji:'☀️',specialName:'Lança do Meio-Dia',specialDescription:'Projeta um raio de luz; o alvo deve superar um teste de Constituição para evitar ficar ofuscado.'}
  ];
  MONSTERS.push(
    {id:'vigia-ruinas',name:'Vigia das Ruínas',kind:'Construto guardião',level:5,defense:16,hp:126,maxHp:126,attackBonus:6,damageDie:10,damageBonus:2,initiativeBonus:0,threat:'AMEAÇA ALTA',xpReward:96,emoji:'🗿',specialName:'Selo de contenção',specialDescription:'Ao acertar, pode reduzir o deslocamento do alvo até o próximo turno.'},
    {id:'mariposa-veu',name:'Mariposa do Véu',kind:'Fera espectral',level:6,defense:16,hp:112,maxHp:112,attackBonus:6,damageDie:8,damageBonus:3,initiativeBonus:5,threat:'AMEAÇA ALTA',xpReward:108,emoji:'🦋',specialName:'Poeira de torpor',specialDescription:'Em um resultado elevado, exige teste de Constituição ou impõe desvantagem narrativa à próxima ação.'},
    {id:'colosso-sal',name:'Colosso de Sal',kind:'Elemental costeiro',level:8,defense:18,hp:194,maxHp:194,attackBonus:8,damageDie:10,damageBonus:3,initiativeBonus:0,threat:'AMEAÇA MUITO ALTA',xpReward:185,emoji:'🧂',specialName:'Onda cristalina',specialDescription:'Golpe pesado que pode empurrar o alvo uma casa, se houver espaço livre.'}
  );
  // Conteúdo público da primeira aventura. Segredos importantes do mestre não devem
  // ser colocados nestas constantes: arquivos JavaScript enviados ao navegador são públicos.
  const BOOK_EXPANSION = {
    master:['Preparação de sessões e escolhas','Prepare cada capítulo com uma abertura, três pistas, dois encontros possíveis e uma decisão que altere a situação. Não determine antecipadamente a solução dos jogadores.','Abertura: apresente um problema visível.','Pistas: distribua informações entre pessoas, locais e objetos.','Consequência: registre quem foi ajudado, o que foi perdido e qual ameaça avançou.'],
    bestiary:['Novas criaturas e táticas','As criaturas adicionadas na v1.6 ampliam os encontros em Drakmor, Eldoria, Thalassor, Nivéria e Solária. Ajuste a quantidade ao tamanho do grupo; os valores são referências iniciais, não uma garantia matemática de equilíbrio.','Drakmor: Sabueso das Brasas e Malgor, General das Cinzas.','Eldoria: Guardião das Raízes.','Thalassor: Saqueador Afogado. Nivéria: Revenante da Geada. Solária: Escorpião do Sol Partido.'],
    bosses:['Malgor, General das Cinzas','Malgor comanda as forças que tentam reabrir as forjas de guerra de Drakmor. Ele prefere dividir o grupo, proteger seus conjuradores e recuar para uma posição vantajosa. Sua ficha é regional e deve ser adaptada ao nível real dos heróis.','Primeiro momento: Malgor testa a companhia e chama seus sentinelas.','Segundo momento: abaixo da metade dos HP, altera a arena e intensifica os ataques.','Conclusão: a derrota abre caminho para a fortaleza, mas não encerra a ameaça de Vharzun.'],
    atlas:['Drakmor e as rotas de cinza','Drakmor é um reino de vulcões, minas profundas e cidades-fortaleza. Suas rotas comerciais cruzam campos de cinza e pontes de basalto. As forjas guardam técnicas anteriores à Guerra da Ruptura Celestial.','Cidadela de Braseiro: sede de antigas guildas de ferreiros.','Passagem do Basalto: rota estreita entre paredões vulcânicos.','Forja dos Juramentos: complexo ancestral ligado às cinco relíquias.'],
    grimoire:['Efeitos, duração e resistência','Ao criar uma magia nova, defina seu propósito, alcance, alvo, duração, custo e forma de resistência. Efeitos de controle devem ter uma forma clara de terminar. Não conceda bônus permanentes sem atualizar a ficha e combinar a regra com o grupo.','Dano: informe tipo e quantidade antes da rolagem.','Proteção: determine duração e se acumula com armadura.','Controle: informe o teste para resistir e como escapar.'],
    arsenal:['Relíquias de campanha','Relíquias são objetos únicos que conectam os cinco reinos à história de Elyndra. Nesta edição, seus efeitos ainda são narrativos e o mestre precisa registrar manualmente qualquer bônus mecânico acordado.','Martelo do Primeiro Fogo: símbolo das antigas forjas de Drakmor.','Bússola das Marés: aponta para correntes ocultas.','Selo da Memória: preserva uma lembrança contra o Véu Cinzento.'],
    adventurer:['Exploração e cooperação','Uma boa exploração alterna observação, conversa, deslocamento e risco. Compartilhe informações úteis com o grupo e descreva o que seu personagem tenta fazer, em vez de apenas pedir uma rolagem.','Diga qual detalhe está investigando e como.','Combine planos antes de dividir o grupo.','Registre consumíveis e recompensas recebidas com o mestre.']
  };
  Object.entries(BOOK_EXPANSION).forEach(([id,chapter])=>{if(BOOK_CONTENT[id]&&BOOK_CONTENT[id].length<4)BOOK_CONTENT[id].push([chapter[0],chapter[1],[chapter[2],chapter[3],chapter[4]]]);});
  const BOOK_FIELD_GUIDES={master:['Consequências e continuidade','Ao fim de cada sessão, anote três elementos: uma decisão dos heróis, uma mudança no mundo e uma ameaça que continua ativa. Na sessão seguinte, mostre pelo menos uma consequência concreta.',['Decisão: quem foi protegido, convencido ou contrariado?','Mundo: que local, facção ou recurso mudou?','Ameaça: o que o inimigo fez enquanto os heróis descansavam?']],bestiary:['Ecologia e sinais de criaturas','Antes de apresentar um monstro, descreva sinais que permitam aos jogadores deduzir seu comportamento. Pegadas, marcas, odores, restos de alimento e mudanças no ambiente podem antecipar o encontro.',['Predadores deixam rastros e restos de caça.','Construtos costumam proteger uma área ou mecanismo.','Criaturas inteligentes podem negociar, recuar ou preparar emboscadas.']],bosses:['Arenas e objetivos alternativos','Uma batalha memorável pode ter um objetivo além de reduzir HP: proteger um NPC, interromper um ritual, alcançar um mecanismo ou sobreviver até uma passagem abrir.',['Apresente o objetivo antes da luta começar.','Dê ao cenário pelo menos duas interações úteis.','Permita vitória por estratégia quando a ficção sustentar essa solução.']],atlas:['Rotas, viagens e regiões','Divida uma viagem longa em trechos com uma escolha ou complicação por etapa. Nem todo deslocamento precisa de combate; clima, recursos e encontros sociais também contam a história.',['Defina o destino e o risco antes da partida.','Use pontos de referência para orientar os jogadores.','Registre locais descobertos no diário da companhia.']],grimoire:['Limites e contrajogo mágico','Toda magia de grande impacto deve permitir que a mesa compreenda seus limites e formas de resposta. Resistências, componentes, alcance e consequências tornam os poderes interessantes sem retirar escolhas.',['Declare alcance e alvo.','Informe duração e custo.','Descreva como interromper ou resistir ao efeito.']],arsenal:['Entrega e registro de tesouros','Quando uma recompensa for entregue, confirme quem a recebeu e registre quantidade, descrição e eventual condição de uso. Itens únicos devem possuir identificadores estáveis para evitar duplicação em atualizações.',['Consumíveis acumulam quantidade pelo mesmo identificador.','Relíquias únicas devem ser entregues uma vez por personagem.','Acorde bônus mecânicos antes de aplicá-los à ficha.']],adventurer:['Recompensas e inventário','Confira o inventário depois de cada missão. Poções e materiais podem ser acumulados; relíquias de história devem ser preservadas e descritas na ficha. O mestre deve esclarecer se um tesouro é individual ou compartilhado.',['Confira quantidade e descrição do item.','Avise o grupo quando uma relíquia for importante para a história.','Não presuma bônus que não estejam escritos na ficha.']]};
  Object.entries(BOOK_FIELD_GUIDES).forEach(([id,chapter])=>{if(BOOK_CONTENT[id]&&BOOK_CONTENT[id].length<5)BOOK_CONTENT[id].push([chapter[0],chapter[1],chapter[2]]);});
  const BOOK_ADVANCED_CHAPTERS={master:['Ferramentas para improvisar','Quando os jogadores seguirem um caminho inesperado, preserve a intenção da cena e adapte a forma. Reaproveite pistas, altere a posição de NPCs e transforme obstáculos em escolhas, em vez de bloquear a sessão.',['Se a pista principal for ignorada, apresente outra evidência em uma cena posterior.','Se um NPC não for encontrado, permita que uma mensagem ou testemunha leve até ele.','Se o grupo evitar um combate, registre como a ameaça reage.']],bestiary:['Montagem de encontros por função','Escolha criaturas por função na cena: pressão, controle, resistência ou suporte. Um encontro variado costuma ser mais interessante que vários inimigos idênticos, mas a quantidade deve respeitar o nível e o tamanho do grupo.',['Pressão: inimigos rápidos que ameaçam personagens isolados.','Controle: criaturas que alteram terreno ou limitam deslocamento.','Resistência: guardiões com defesa ou HP elevados.']],bosses:['Telegráfos e janelas de resposta','Ataques de chefe devem ser anunciados com sinais claros. Uma criatura pode preparar um sopro, erguer uma arma ou concentrar energia antes de executar a ação. Isso cria uma janela para defesa, interrupção ou reposicionamento.',['Descreva o sinal antes de aplicar o efeito.','Defina uma resposta possível para cada ataque especial.','Varie o objetivo entre fases para evitar repetição.']],atlas:['Pontos de interesse e exploração','Ao criar uma localidade, pense em três elementos: um marco visual, uma atividade cotidiana e uma tensão local. Esses detalhes tornam a região útil mesmo quando não há combate ou missão ativa.',['Marco: torre, ponte, mercado, ruína ou formação natural.','Vida local: ofício, celebração, rota comercial ou costume.','Tensão: escassez, disputa, perigo ou segredo.']],grimoire:['Conjuração em cenas narrativas','Nem toda magia precisa causar dano. Feitiços podem revelar vestígios, proteger uma travessia, traduzir inscrições ou criar uma distração. O mestre deve distinguir efeito narrativo de bônus mecânico e registrar qualquer regra nova acordada.',['Declare o que a magia pode revelar e o que permanece oculto.','Evite que uma única magia encerre todos os desafios de uma cena.','Mantenha custos e limites consistentes entre sessões.']],arsenal:['Manutenção, carga e itens especiais','Itens consumíveis devem ter quantidade visível e descrição curta. Equipamentos podem receber história, origem e aparência próprias, mas seus bônus mecânicos precisam estar registrados na ficha antes de afetar ataques ou Defesa.',['Registre cargas e usos restantes de itens especiais.','Não venda relíquias de missão sem decisão explícita da mesa.','Separe aparência, raridade e efeito mecânico.']],adventurer:['Planejamento de sessão e recursos','Antes de uma expedição, confira HP, poções, moedas e objetivos ativos. Durante a jornada, comunique ao grupo quando um recurso for gasto ou quando uma decisão puder alterar o rumo da história.',['Combine uma ordem de marcha quando houver perigo.','Defina quem carrega itens importantes.','Reserve recursos para o caminho de volta.']]};
  Object.entries(BOOK_ADVANCED_CHAPTERS).forEach(([id,chapter])=>{if(BOOK_CONTENT[id]&&BOOK_CONTENT[id].length<6)BOOK_CONTENT[id].push([chapter[0],chapter[1],chapter.slice(2)]);});
  const BOOK_CAMPAIGN_CHAPTERS={master:['Campanhas ramificadas','Uma campanha ramificada não exige escrever finais inteiros para cada escolha. Registre fatos persistentes — alianças, recursos, promessas e ameaças — e deixe que eles alterem cenas futuras.',['Use storyFlags para lembrar decisões importantes.','Reapresente consequências em NPCs, preços, rotas e missões.','Evite apagar decisões antigas ao atualizar o estado da campanha.']],bestiary:['Criaturas e equipamento','Encontros devem considerar o equipamento disponível ao grupo. Uma criatura resistente pode exigir armas de maior impacto, enquanto inimigos ágeis desafiam personagens com pouca Defesa.',['Observe o dano-base das armas equipadas.','Considere a Defesa efetiva de armaduras e escudos.','Não aumente a dificuldade apenas para neutralizar uma compra recente.']],bosses:['Chefes contra grupos equipados','Ao criar um chefe, considere o dano potencial da companhia e sua Defesa efetiva. Ofereça ameaças variadas, mas mantenha sinais claros e oportunidades de resposta.',['Teste o encontro com o equipamento atual dos personagens.','Varie pressão, controle e resistência.','Não torne um item recém-adquirido inútil sem uma razão narrativa.']],atlas:['Oficinas e rotas comerciais','Cada reino pode ter oficinas especializadas. Drakmor trabalha metais e armas; Nivéria preserva ligas e cristais; Thalassor negocia materiais marítimos; Solária trabalha ligas leves; Eldoria oferece couro e madeira viva.',['Use preços como referência, não como punição.','Associe mercadorias a recursos e cultura locais.','Registre a origem de equipamentos raros.']],grimoire:['Magia e proteção','Magias defensivas e equipamentos podem coexistir se seus efeitos forem distintos. Defina se uma proteção substitui, soma ou apenas reduz uma consequência específica.',['Evite somar bônus idênticos sem limite combinado.','Declare duração e condição de término.','Registre efeitos temporários separadamente do equipamento.']],arsenal:['Equipamento funcional na v2.0','Armas equipadas definem o dado-base de dano apresentado pela ficha de combate. Armaduras e escudos contribuem para a Defesa efetiva. O mestre confirma trocas no comércio e o estado fica salvo em partyState.',['Arma: slot weapon e propriedade damageDie.','Armadura: slot armor e propriedade defense.','Escudo: slot shield e propriedade defense.']],adventurer:['Equipar, comparar e cuidar','Antes de uma aventura, confira a arma, a armadura, o escudo e a mochila. A troca é conduzida pelo mestre ativo nesta versão para evitar conflitos de sincronização entre jogadores.',['Compare o dado de dano da arma.','Some os bônus de Defesa de armadura e escudo.','Confira moedas e quantidade antes de comprar.']]};
  Object.entries(BOOK_CAMPAIGN_CHAPTERS).forEach(([id,ch])=>{if(BOOK_CONTENT[id]&&BOOK_CONTENT[id].length<7)BOOK_CONTENT[id].push([ch[0],ch[1],ch[2]]);});
  const BOOK_EQUIPMENT_CHAPTERS={master:['Economia e progressão de equipamento','Itens raros devem surgir como recompensa de desafios relevantes ou mercadorias de alto custo. Requisitos de classe e nível ajudam a preservar identidade e progressão sem impedir que a companhia negocie alternativas.',['Apresente o requisito antes da compra.','Use raridade para comunicar valor, não para substituir regras.','Revise o poder do grupo antes de introduzir novas peças.']],bestiary:['Ameaças contra armaduras e armas','Monstros podem desafiar diferentes perfis de equipamento sem anular bônus. Use ataques variados, condições de terreno e objetivos táticos em vez de simplesmente ignorar a Defesa dos heróis.',['Ataques precisos pressionam alvos com Defesa baixa.','Efeitos de área criam decisões de posicionamento.','Resistência elevada deve vir acompanhada de uma fraqueza ou objetivo alternativo.']],bosses:['Tesouros de chefes','Uma recompensa de chefe deve ter vínculo com a criatura ou com o local. Itens de conjunto podem ser distribuídos em etapas, criando objetivos de campanha sem exigir que todas as peças apareçam de uma vez.',['Entregue uma peça como marco de progresso.','Mostre pistas sobre as peças restantes.','Não exija uma combinação específica para vencer o chefe.']],atlas:['Guildas e conjuntos regionais','As guildas de Aethra preservam técnicas próprias. A Vanguarda é um conjunto marcial associado a combatentes de linha de frente; outras regiões podem desenvolver conjuntos ligados a seus materiais e tradições.',['Drakmor: ligas resistentes e armas de impacto.','Nivéria: cristais de foco e precisão.','Eldoria: couro vivo e materiais flexíveis.']],grimoire:['Focos raros e afinidade','Focos arcanos podem melhorar precisão ou dano de uma arma sem alterar automaticamente o custo das magias. Diferencie o ataque com arma do efeito especial de classe e mantenha os bônus visíveis na ficha.',['Precisão é bônus no teste de ataque.','Bônus de dano soma ao dano da arma.','Efeitos de magia continuam seguindo as regras da habilidade.']],arsenal:['Raridades, requisitos e conjuntos','A raridade Rara identifica itens especiais com propriedades mecânicas explícitas. Alguns equipamentos exigem nível mínimo e classes específicas. O conjunto Vanguarda concede +1 Defesa e +1 no ataque quando arma, armadura e escudo do conjunto estão equipados.',['Verifique requiredLevel e requiredClasses antes de equipar.','SetId identifica peças pertencentes ao mesmo conjunto.','Bônus de conjunto só é aplicado quando as três peças estão equipadas.']],adventurer:['Escolha de equipamento','Compare o dado de dano, precisão, bônus de dano e Defesa. Antes de comprar, confira nível e classe exigidos. Uma peça rara pode ser poderosa, mas não será necessariamente melhor para toda construção de personagem.',['Armas alteram dano e/ou precisão.','Armaduras e escudos aumentam Defesa.','Conjuntos completos podem oferecer bônus adicionais.']]};
  Object.entries(BOOK_EQUIPMENT_CHAPTERS).forEach(([id,ch])=>{if(BOOK_CONTENT[id]&&BOOK_CONTENT[id].length<8)BOOK_CONTENT[id].push([ch[0],ch[1],ch[2]]);});
  const STORY_QUESTS = [
    {id:'main-01',title:'Ecos na Estrada de Eldoria',type:'Principal',chapter:'Capítulo I · Ecos na Estrada',giver:'Ilyra Avelorn',status:'active',summary:'Investigue os ataques próximos à antiga torre de vigia e descubra por que criaturas corrompidas estão se aproximando da estrada.',objectives:[{id:'meet-ilyra',text:'Conhecer Ilyra Avelorn, a batedora da vila.',completed:false},{id:'inspect-tracks',text:'Investigar os rastros estranhos na estrada.',completed:false},{id:'defeat-ash-goblins',text:'Derrotar os Goblins das Cinzas que guardam a trilha.',completed:false},{id:'find-omen-fragment',text:'Encontrar o fragmento de cristal na torre antiga.',completed:false}],reward:'Fragmento da Profecia, 40 XP por herói e acesso narrativo ao próximo capítulo.'},
    {id:'main-02',title:'As Raízes Sob a Pedra',type:'Principal',chapter:'Capítulo II · O Santuário Ferido',giver:'Irmão Cael',status:'available',summary:'O fragmento reage às raízes do santuário. Siga a corrupção subterrânea, atravesse as galerias e descubra quem alimenta o véu cinzento.',objectives:[{id:'speak-cael',text:'Levar o fragmento ao Irmão Cael.',completed:false},{id:'enter-root-galleries',text:'Encontrar a entrada das galerias sob o santuário.',completed:false},{id:'defeat-umbra-spider',text:'Derrotar a Aranha de Umbrafunda.',completed:false},{id:'break-ritual-seal',text:'Desfazer o selo ritual que corrompe as raízes.',completed:false}],reward:'Relíquia da Raiz Viva e 90 XP por herói.'},
    {id:'main-03',title:'O Véu sobre as Marés',type:'Principal',chapter:'Capítulo III · Vozes de Thalassor',giver:'Capitã Maera',status:'available',summary:'Uma mensagem cifrada aponta para Thalassor. Nas docas e ruínas submersas, os heróis devem deter o culto antes que ele desperte algo no fundo do mar.',objectives:[{id:'reach-thalassor',text:'Chegar ao porto de Thalassor e encontrar a capitã Maera.',completed:false},{id:'decode-tide-map',text:'Decifrar o mapa das marés ocultas.',completed:false},{id:'defeat-cultist',text:'Vencer o Cultista do Véu Cinzento e seus guardas.',completed:false},{id:'silence-siren',text:'Romper o canto da Sereia Abissal nas ruínas.',completed:false}],reward:'Chave das Marés e 140 XP por herói.'},
    {id:'main-04',title:'O Coração de Cristal',type:'Principal',chapter:'Capítulo IV · O Inverno que Desperta',giver:'Arquivista Vaelis',status:'available',summary:'As pistas levam às bibliotecas de Nivéria. Um draco de cristal guarda a passagem para uma das cinco relíquias capazes de alcançar a prisão de Elyndra.',objectives:[{id:'consult-vaelis',text:'Consultar o arquivista Vaelis em Nivéria.',completed:false},{id:'cross-frost-pass',text:'Atravessar o Passo da Geada.',completed:false},{id:'defeat-crystal-drake',text:'Derrotar o Draco de Cristal Niveriano.',completed:false},{id:'claim-heart-crystal',text:'Recuperar o Coração de Cristal.',completed:false}],reward:'Coração de Cristal e 180 XP por herói.'},
    {id:'main-05',title:'A Coroa do Eclipse',type:'Principal',chapter:'Capítulo V · Cinzas de Solária',giver:'Oráculo Asha',status:'available',summary:'Em Solária, um cavaleiro sem rosto protege um altar eclipsado. A relíquia solar é a última chave antes da marcha contra os generais de Vharzun.',objectives:[{id:'meet-asha',text:'Encontrar o Oráculo Asha no templo solar.',completed:false},{id:'restore-sun-dais',text:'Restaurar o altar das cinco luzes.',completed:false},{id:'defeat-hollow-knight',text:'Derrotar o Cavaleiro Oco de Solária.',completed:false},{id:'claim-eclipse-crown',text:'Tomar a Coroa do Eclipse.',completed:false}],reward:'Coroa do Eclipse e 220 XP por herói.'},
    {id:'side-01',title:'A Carga Perdida de Tovin',type:'Secundária',giver:'Tovin Ferromar',status:'available',summary:'O ferreiro perdeu uma caixa de ferramentas e materiais na trilha entre a vila e a estrada antiga.',objectives:[{id:'meet-tovin',text:'Falar com Tovin na oficina da vila.',completed:false},{id:'recover-crate',text:'Localizar a caixa de ferramentas desaparecida.',completed:false},{id:'return-crate',text:'Devolver a carga a Tovin.',completed:false}],reward:'Poção de Cura e 25 moedas de ouro.'},
    {id:'side-02',title:'Luzes entre as Copas',type:'Secundária',giver:'Ilyra Avelorn',status:'available',summary:'Pequenas luzes aparecem nas copas durante a noite. Ilyra teme que viajantes estejam sendo atraídos para ninhos de criaturas.',objectives:[{id:'follow-canopy-lights',text:'Seguir as luzes sem se perder na mata.',completed:false},{id:'find-hidden-nest',text:'Localizar o ninho escondido.',completed:false},{id:'drive-off-wolves',text:'Afastar os lobos que cercam o ninho.',completed:false}],reward:'Amuleto de Rastreamento e 35 moedas de ouro.'},
    {id:'side-03',title:'O Sino que Não Devia Tocar',type:'Secundária',giver:'Irmão Cael',status:'available',summary:'O sino antigo do santuário toca sozinho ao anoitecer. Descubra o que está preso no campanário abandonado.',objectives:[{id:'inspect-bell',text:'Examinar o sino e suas inscrições.',completed:false},{id:'search-bell-tower',text:'Investigar o campanário abandonado.',completed:false},{id:'lay-restless-spirit',text:'Acalmar o espírito que habita a torre.',completed:false}],reward:'Bênção do Santuário e 50 XP por herói.'},
    {id:'side-04',title:'Sal para os Afogados',type:'Secundária',giver:'Capitã Maera',status:'available',summary:'Pescadores de Thalassor encontraram redes cortadas e marcas de garras nas embarcações. A capitã oferece pagamento por respostas.',objectives:[{id:'talk-fishermen',text:'Ouvir os pescadores no cais.',completed:false},{id:'inspect-wreck',text:'Examinar o naufrágio próximo ao recife.',completed:false},{id:'defeat-reef-threat',text:'Derrotar a criatura que ronda o recife.',completed:false}],reward:'60 moedas de ouro e uma Pérola de Maré.'},
    {id:'main-06',title:'A Forja dos Juramentos',type:'Principal',chapter:'Capítulo VI · O Fogo que Recorda',giver:'Mestre Ferreiro Brann',status:'available',summary:'Uma inscrição encontrada entre as relíquias aponta para Drakmor. Nas forjas antigas, os heróis descobrirão por que Vharzun teme o aço forjado antes da Ruptura.',objectives:[{id:'meet-brann',text:'Encontrar Brann na Cidadela de Braseiro.',completed:false},{id:'cross-basalt-pass',text:'Atravessar a Passagem do Basalto.',completed:false},{id:'defeat-ember-hounds',text:'Derrotar o Sabueso das Brasas que guarda a galeria.',completed:false},{id:'awaken-oath-forge',text:'Despertar a Forja dos Juramentos.',completed:false}],reward:'Marca do Primeiro Fogo e 260 XP por herói.'},
    {id:'main-07',title:'O General das Cinzas',type:'Principal',chapter:'Capítulo VII · A Marcha de Malgor',giver:'Mestre Ferreiro Brann',status:'available',summary:'Malgor reúne tropas para atacar as rotas entre os reinos. Interrompa sua marcha e impeça que a forja seja convertida em arma.',objectives:[{id:'find-malgor-camp',text:'Localizar o acampamento do general.',completed:false},{id:'defeat-ash-general',text:'Derrotar Malgor, General das Cinzas.',completed:false},{id:'secure-forge-heart',text:'Proteger o coração da forja.',completed:false}],reward:'Insígnia da Aliança e 320 XP por herói.'},
    {id:'main-08',title:'O Caminho até Vharzun',type:'Principal',chapter:'Capítulo VIII · A Prisão Celestial',giver:'Irmão Cael',status:'available',summary:'Com as relíquias reunidas, a companhia pode alcançar a prisão de Elyndra. O caminho exige atravessar os últimos guardiões e confrontar a origem do Véu Cinzento.',objectives:[{id:'unite-five-relics',text:'Reunir as cinco relíquias dos reinos.',completed:false},{id:'defeat-frost-revenant',text:'Vencer o Revenante da Geada que guarda o portal.',completed:false},{id:'open-celestial-prison',text:'Abrir a passagem para a prisão celestial.',completed:false},{id:'confront-vharzun',text:'Enfrentar Vharzun e decidir o destino de Elyndra.',completed:false}],reward:'Conclusão do arco principal; o desfecho é decidido pelo grupo e pelo mestre.'},
    {id:'side-05',title:'O Cão de Fogo Perdido',type:'Secundária',giver:'Mestre Ferreiro Brann',status:'available',summary:'Um sabueso ígneo escapou das galerias e ronda os depósitos de carvão. Brann pede que a criatura seja contida antes que alcance a cidade.',objectives:[{id:'track-ember-hound',text:'Seguir as pegadas incandescentes.',completed:false},{id:'defeat-ember-hound',text:'Derrotar o Sabueso das Brasas.',completed:false}],reward:'75 moedas de ouro e uma arma reparada.'},
    {id:'side-06',title:'O Último Canto do Naufrágio',type:'Secundária',giver:'Capitã Maera',status:'available',summary:'Um navio desaparecido voltou à superfície sem tripulação. Algo se move entre os destroços e protege um diário de bordo.',objectives:[{id:'recover-captains-log',text:'Encontrar o diário do capitão.',completed:false},{id:'defeat-drowned-raider',text:'Derrotar o Saqueador Afogado.',completed:false}],reward:'Mapa de uma rota secreta e 90 moedas de ouro.'},
    {id:'side-07',title:'O Silêncio da Biblioteca',type:'Secundária',giver:'Arquivista Vaelis',status:'available',summary:'Uma ala da biblioteca de Nivéria foi tomada por um espírito congelante. Vaelis teme que registros sobre Elyndra sejam destruídos.',objectives:[{id:'enter-silent-archive',text:'Entrar na ala silenciosa.',completed:false},{id:'defeat-frost-wraith',text:'Derrotar o Revenante da Geada.',completed:false}],reward:'Um registro antigo sobre a Guerra da Ruptura Celestial.'}
  ];
  STORY_QUESTS.push(
    {id:'side-08',title:'As Lanternas de Brumafolha',type:'Secundária',giver:'Ilyra Avelorn',status:'available',summary:'Lanternas apagadas surgiram ao longo de uma trilha antiga. Ilyra suspeita que uma criatura espectral esteja atraindo viajantes para as ruínas.',objectives:[{id:'inspect-dark-lanterns',text:'Examinar as lanternas apagadas na trilha.',completed:false},{id:'find-veil-moth',text:'Localizar a criatura entre as ruínas.',completed:false},{id:'defeat-veil-moth',text:'Derrotar a Mariposa do Véu.',completed:false}],reward:'108 XP por herói e materiais recolhidos na trilha.'},
    {id:'side-09',title:'O Guardião sem Memória',type:'Secundária',giver:'Arquivista Vaelis',status:'available',summary:'Um antigo mecanismo de defesa despertou em uma ala esquecida. Vaelis pede que a companhia descubra o que ele protegia.',objectives:[{id:'enter-forgotten-wing',text:'Entrar na ala esquecida dos arquivos.',completed:false},{id:'read-guardian-runes',text:'Decifrar as runas do mecanismo.',completed:false},{id:'defeat-ruin-warden',text:'Desativar o Vigia das Ruínas.',completed:false}],reward:'96 XP por herói e acesso a um registro histórico.'},
    {id:'side-10',title:'A Maré de Pedra',type:'Secundária',giver:'Capitã Maera',status:'available',summary:'Uma formação de sal bloqueia a passagem dos barcos e cresce a cada maré. A capitã precisa que a companhia encontre a origem do fenômeno.',objectives:[{id:'survey-salt-shoal',text:'Investigar o banco de sal que bloqueia o canal.',completed:false},{id:'reach-salt-heart',text:'Encontrar o núcleo elemental na enseada.',completed:false},{id:'defeat-salt-colossus',text:'Derrotar o Colosso de Sal.',completed:false}],reward:'185 XP por herói e 100 moedas de ouro para a companhia.'}
  );
  const STORY_NPCS = [
    {id:'ilyra',name:'Ilyra Avelorn',role:'Batedora de Eldoria',emoji:'🏹',portrait:'npc-ilyra.webp',location:'Vila de Brumafolha',description:'Uma exploradora experiente que conhece cada trilha da floresta. Ilyra percebeu que os animais estão abandonando a região e que marcas de cinzas surgem perto da velha torre.',greeting:'A estrada não está segura. Algo está expulsando as criaturas da mata — e não é um simples bando de goblins.'},
    {id:'tovin',name:'Tovin Ferromar',role:'Ferreiro da vila',emoji:'⚒️',portrait:'npc-tovin.webp',location:'Oficina de Brumafolha',description:'Um ferreiro de fala direta, conhecido por consertar armas e acolher viajantes. Uma caixa com ferramentas raras desapareceu durante uma entrega.',greeting:'Se encontrarem minha caixa de ferramentas, prometo que nenhum de vocês pagará pelo próximo conserto.'},
    {id:'cael',name:'Irmão Cael',role:'Guardião do pequeno santuário',emoji:'✚',portrait:'npc-cael.webp',location:'Santuário das Raízes',description:'Um cuidador sereno que preserva antigas histórias sobre Elyndra. Ele conhece fragmentos de uma oração que menciona cinco luzes e uma prisão de escamas.',greeting:'A esperança não desapareceu. Às vezes, ela apenas aguarda alguém disposto a escutar.'},
    {id:'maera',name:'Capitã Maera Voss',role:'Comandante da guarda portuária',emoji:'⚓',location:'Porto de Thalassor',description:'Uma capitã experiente que conhece as correntes e os perigos das ilhas. Maera investiga navios desaparecidos e sinais de um culto nas ruínas submersas.',greeting:'O mar devolve tudo, aventureiros. A pergunta é o que ele traz de volta.'},
    {id:'vaelis',name:'Arquivista Vaelis',role:'Guardião dos arquivos de cristal',emoji:'📚',location:'Biblioteca de Nivéria',description:'Um estudioso paciente que preserva mapas, registros e fragmentos de memória cristalizados. Vaelis reconhece símbolos antigos ligados às cinco relíquias.',greeting:'O gelo conserva aquilo que o tempo tenta apagar. Vamos descobrir o que esta memória esconde.'},
    {id:'asha',name:'Oráculo Asha',role:'Voz do Templo Solar',emoji:'☀️',location:'Templo Solar de Solária',description:'Uma oráculo que interpreta eclipses e sinais celestes. Asha acredita que a Coroa do Eclipse pode revelar a rota até os generais de Vharzun.',greeting:'Quando a luz encontra a sombra, não nasce apenas escuridão. Às vezes, nasce uma escolha.'},
    {id:'brann',name:'Mestre Ferreiro Brann',role:'Guardião das Forjas Antigas',emoji:'🔥',location:'Cidadela de Braseiro, Drakmor',description:'Um ferreiro veterano que conhece os juramentos gravados nas bigornas de Drakmor. Brann acredita que as cinco relíquias foram criadas para agir em conjunto.',greeting:'O fogo não esquece o que foi forjado nele. Se vieram por respostas, terão de encarar o calor da verdade.'}
  ];
  const STORY_SCENES = [
    {id:'road',title:'A Estrada Esquecida',chapter:'Capítulo I — Ecos na Estrada',location:'Estrada Esquecida de Eldoria',narration:'A chuva fina desenha linhas na poeira da estrada. Pegadas profundas seguem em direção à antiga torre de vigia. Entre as árvores, um sino toca uma única vez — embora a vila esteja distante.'},
    {id:'village',title:'Vila de Brumafolha',chapter:'Capítulo I — Ecos na Estrada',location:'Vila de Brumafolha',narration:'As casas de madeira se agrupam ao redor de uma praça coberta por folhas úmidas. Os moradores falam baixo e evitam olhar para a estrada. Uma batedora observa a chegada dos aventureiros.'},
    {id:'forge',title:'Oficina de Tovin',chapter:'Capítulo I — Ecos na Estrada',location:'Oficina de Brumafolha',narration:'O calor da forja contrasta com o frio da chuva. Ferramentas pendem das paredes e o som do martelo ecoa pelo pequeno salão. O ferreiro interrompe o trabalho ao perceber os aventureiros.'},
    {id:'watchtower',title:'Torre dos Vigias',chapter:'Capítulo I — Ecos na Estrada',location:'Torre dos Vigias',narration:'A torre está tomada por raízes e marcas escuras. O vento atravessa as frestas das pedras. No alto, um brilho azulado pulsa como se algo estivesse tentando respirar.'},
    {id:'sanctuary',title:'Santuário das Raízes',chapter:'Capítulo I — Ecos na Estrada',location:'Santuário das Raízes',narration:'Pequenas velas iluminam um santuário construído em torno de uma árvore antiga. Símbolos de cinco reinos foram entalhados em suas raízes.'}
  ];
  STORY_SCENES.push(
    {id:'braseiro',title:'Cidadela de Braseiro',chapter:'Capítulo VI — O Fogo que Recorda',location:'Cidadela de Braseiro, Drakmor',narration:'A cidadela ergue-se sobre rios de lava escura. O som dos martelos ecoa de galerias profundas, mas várias forjas estão apagadas. Um ferreiro observa os viajantes da entrada, segurando uma peça de metal marcada por cinco símbolos.'},
    {id:'oath-forge',title:'Forja dos Juramentos',chapter:'Capítulo VI — O Fogo que Recorda',location:'Forja dos Juramentos, Drakmor',narration:'A câmara circular permanece aquecida apesar de séculos de abandono. Cinco canais convergem para uma bigorna negra. Quando as relíquias se aproximam, inscrições antigas começam a brilhar.'},
    {id:'malgor-camp',title:'Acampamento de Malgor',chapter:'Capítulo VII — A Marcha de Malgor',location:'Campos de Cinza, Drakmor',narration:'Bandeiras escuras cercam uma fortificação improvisada. O chão está marcado por rodas de máquinas de guerra. Ao longe, uma figura de armadura incandescente observa a estrada.'},
    {id:'celestial-prison',title:'A Prisão Celestial',chapter:'Capítulo VIII — A Prisão Celestial',location:'Limiar Celestial',narration:'O céu parece refletido sob os pés da companhia. Correntes de luz atravessam o vazio e convergem para um portal de escamas antigas. Do outro lado, uma presença desperta.'},
    {id:'voices-reef',title:'Recife das Vozes',chapter:'Capítulo III — Vozes de Thalassor',location:'Recife das Vozes, Thalassor',narration:'A maré recua e revela degraus cobertos de conchas. Um canto distante atravessa a névoa salgada. Entre as pedras, marcas recentes indicam que algo pesado arrastou-se para dentro das ruínas.'},
    {id:'prismatic-gallery',title:'Galeria Prismática',chapter:'Capítulo IV — O Inverno que Desperta',location:'Galeria Prismática, Nivéria',narration:'A luz azul se divide em milhares de reflexos nas paredes de cristal. Cada passo ecoa como se a galeria estivesse vazia e, ao mesmo tempo, repleta de observadores.'},
    {id:'broken-sun-altar',title:'Altar do Sol Partido',chapter:'Capítulo V — Cinzas de Solária',location:'Altar do Sol Partido, Solária',narration:'O calor ondula sobre as pedras douradas. O altar central está rachado e sua luz pulsa em intervalos irregulares. Uma figura encapuzada protege a escadaria.'},
    {id:'citadel-braseiro',title:'Cidadela de Braseiro',chapter:'Capítulo VI — O Fogo que Recorda',location:'Cidadela de Braseiro, Drakmor',narration:'As muralhas negras guardam o calor de antigas fornalhas. Os portões estão abertos, mas nenhuma fumaça sai das chaminés. Alguém apagou as forjas de propósito.'}
  );
  STORY_SCENES.push(
    {id:'forgotten-archive',title:'Ala Esquecida dos Arquivos',chapter:'Capítulo IX — Ecos que Permanecem',location:'Ala Esquecida, Nivéria',narration:'Uma porta de cristal fosco se abre com um estalo. Estantes cobertas por gelo guardam placas de memória, e no centro da sala uma figura de pedra aguarda imóvel.'},
    {id:'lantern-trail',title:'Trilha das Lanternas',chapter:'Crônicas de Eldoria',location:'Trilha das Lanternas, Eldoria',narration:'Pequenas lanternas pendem de galhos baixos. Todas estão apagadas, mas uma poeira azulada brilha sobre o caminho e desaparece entre as ruínas.'},
    {id:'salt-cove',title:'Enseada do Sal',chapter:'Crônicas de Thalassor',location:'Enseada do Sal, Thalassor',narration:'A maré recuou além dos recifes conhecidos. Uma massa cristalina se ergue na enseada, formando colunas que parecem respirar com o movimento das ondas.'}
  );
  // Mapas táticos iniciais (10 colunas x 8 linhas). Os símbolos definem terreno e bloqueios.
  const MAP_TEMPLATES = [
    {id:'eldoria-road',name:'Estrada de Eldoria',subtitle:'Trilha, árvores e um riacho raso',theme:'forest',layout:['..tt....t.','...t.pp...','t...pp..t.','..tpp...t.','.wwwpp....','...ppp..t.','t...p.....','.t....t...']},
    {id:'brumafolha',name:'Vila de Brumafolha',subtitle:'Casas, praça e ruas de pedra',theme:'village',layout:['..h....h..','.h......h.','....p.....','pppppppppp','....p.....','.h..p...h.','..h.p.h...','....p.....']},
    {id:'watchtower',name:'Torre dos Vigias',subtitle:'Pedra antiga, colunas e entrada ao sul',theme:'tower',layout:['bbbbbbbbbb','b........b','b..c..c..b','b........b','b.c....c.b','b........b','b........b','bbbb..bbbb']},
    {id:'root-sanctuary',name:'Santuário das Raízes',subtitle:'Raízes antigas cercam um altar',theme:'sanctuary',layout:['..t....t..','.t......t.','....p.....','..pwwwp...','...www....','....p.....','.t......t.','..t....t..']},
    {id:'thalassor-reef',name:'Recife das Vozes',subtitle:'Docas quebradas, piscinas e ruínas submersas',theme:'water',layout:['ww..p..www','ww..p...ww','...ppp....','.t..p..t..','....p.....','..wwwpp...','..w...p..w','www...pwww']},
    {id:'niveria-crystal',name:'Galeria Prismática',subtitle:'Salões de cristal e corredores congelados',theme:'ice',layout:['bbbbbbbbbb','b..c..c..b','b...r....b','b.pppp...b','b...r....b','b..c..c..b','b........b','bbbb..bbbb']},
    {id:'solaria-dais',name:'Altar do Sol Partido',subtitle:'Pátio dourado, colunas e altar central',theme:'desert',layout:['tt......tt','..c....c..','....p.....','..pppppp..','....p.....','..c....c..','tt......tt','....p.....']},
    {id:'drakmor-citadel',name:'Cidadela de Braseiro',subtitle:'Muralhas de basalto e fornalhas',theme:'volcanic',layout:['bbbbbbbbbb','b..c...c.b','b..p..r..b','b..p.....b','b..pppp..b','b.....r..b','b...c....b','bbbb..bbbb']}
  ];
  const DIALOGUE_CHOICES = {
    ilyra:[{id:'follow-tracks',label:'Pedir que Ilyra mostre os rastros',reply:'Ilyra marca no mapa uma trilha segura até a torre.',flag:'ilyra_trail_known',log:'Ilyra revelou uma trilha segura até a Torre dos Vigias.'},{id:'ask-wildlife',label:'Perguntar sobre os animais desaparecidos',reply:'Ela explica que as criaturas fogem de um cheiro de cinzas vindo do norte.',flag:'wildlife_clue_known',log:'A companhia descobriu que os animais fogem de um odor de cinzas vindo do norte.'}],
    tovin:[{id:'request-discount',label:'Negociar um desconto para a companhia',reply:'Tovin concorda em oferecer preços melhores depois que recuperar suas ferramentas.',flag:'tovin_discount_promised',log:'Tovin prometeu um desconto quando suas ferramentas forem recuperadas.'},{id:'ask-forge',label:'Perguntar sobre as forjas de Drakmor',reply:'O ferreiro conta que antigas marcas de fogo aparecem em armas ligadas a Drakmor.',flag:'drakmor_forge_clue',log:'Tovin compartilhou uma pista sobre as antigas marcas de fogo de Drakmor.'}],
    cael:[{id:'learn-prayer',label:'Aprender a oração das cinco luzes',reply:'Cael ensina os primeiros versos da oração de Elyndra.',flag:'five_lights_prayer',log:'Cael ensinou à companhia os primeiros versos da oração das cinco luzes.'},{id:'ask-protection',label:'Pedir uma bênção para a jornada',reply:'Cael abençoa a companhia e pede que protejam os inocentes.',flag:'cael_blessing',log:'A companhia recebeu a bênção de Cael antes de seguir viagem.'}]
  };
  const SHOP_ITEMS = [
    {id:'pocao-cura',name:'Poção de Cura',kind:'consumable',price:18,qty:1,healDie:8,healBonus:2,description:'Recupera 1d8 + 2 pontos de vida.'},
    {id:'pocao-vigor',name:'Tônico de Vigor',kind:'consumable',price:28,qty:1,description:'Tônico para momentos de esforço; efeito narrativo definido pelo mestre.'},
    {id:'racao-viagem',name:'Rações de Viagem',kind:'utility',price:6,qty:1,description:'Alimento para uma jornada.'},
    {id:'tocha',name:'Tocha',kind:'utility',price:4,qty:1,description:'Ilumina áreas escuras por uma cena.'},
    {id:'kit-aventureiro',name:'Kit de Explorador',kind:'utility',price:22,qty:1,description:'Cordão, pederneira e ferramentas simples.'},
    {id:'espada-aco',name:'Espada de Aço',kind:'equipment',slot:'weapon',price:85,qty:1,damageDie:8,description:'Lâmina confiável; dano base 1d8.'},
    {id:'machado-guerra',name:'Machado de Guerra',kind:'equipment',slot:'weapon',price:110,qty:1,damageDie:10,description:'Arma pesada; dano base 1d10.'},
    {id:'cota-reforcada',name:'Cota Reforçada',kind:'equipment',slot:'armor',price:125,qty:1,defense:3,description:'Armadura reforçada; +3 Defesa.'},
    {id:'broquel-ferro',name:'Broquel de Ferro',kind:'equipment',slot:'shield',price:65,qty:1,defense:1,rarity:'Comum',description:'Escudo leve; +1 Defesa.'},
    {id:'lamina-vanguarda',name:'Lâmina da Vanguarda',kind:'equipment',slot:'weapon',price:240,qty:1,damageDie:10,accuracy:1,damageBonus:1,rarity:'Raro',setId:'vanguarda',requiredLevel:5,requiredClasses:['Guerreiro','Paladino'],description:'Arma rara; 1d10 + 1 dano e +1 no ataque. Parte do conjunto da Vanguarda.'},
    {id:'peitoral-vanguarda',name:'Peitoral da Vanguarda',kind:'equipment',slot:'armor',price:260,qty:1,defense:4,rarity:'Raro',setId:'vanguarda',requiredLevel:5,requiredClasses:['Guerreiro','Paladino'],description:'Armadura rara; +4 Defesa. Parte do conjunto da Vanguarda.'},
    {id:'broquel-vanguarda',name:'Broquel da Vanguarda',kind:'equipment',slot:'shield',price:190,qty:1,defense:2,rarity:'Raro',setId:'vanguarda',requiredLevel:5,requiredClasses:['Guerreiro','Paladino'],description:'Escudo raro; +2 Defesa. Parte do conjunto da Vanguarda.'},
    {id:'arco-lua-prateada',name:'Arco da Lua Prateada',kind:'equipment',slot:'weapon',price:225,qty:1,damageDie:8,accuracy:2,damageBonus:1,rarity:'Raro',requiredLevel:4,requiredClasses:['Patrulheiro','Assassino'],description:'Arma rara; 1d8 + 1 dano e +2 no ataque.'},
    {id:'foco-aurora',name:'Foco da Aurora',kind:'equipment',slot:'weapon',price:230,qty:1,damageDie:8,accuracy:1,damageBonus:1,rarity:'Raro',requiredLevel:4,requiredClasses:['Arcano','Clérigo','Druida','Invocador'],description:'Foco raro; 1d8 + 1 dano e +1 no ataque.'}
  ];
  const MAP_WIDTH = 10, MAP_HEIGHT = 8;
  function cloneData(value){return JSON.parse(JSON.stringify(value))}
  function narrativeState(gs=state.campaign?.game_state||defaultGameState()){
    const saved=Array.isArray(gs.quests)?cloneData(gs.quests):[];
    const savedIds=new Set(saved.map(q=>q.id));
    const quests=[...saved,...cloneData(STORY_QUESTS).filter(q=>!savedIds.has(q.id))];
    return {quests:quests.length?quests:cloneData(STORY_QUESTS),revealedNpcIds:Array.isArray(gs.revealedNpcIds)?gs.revealedNpcIds:[],journalEntries:Array.isArray(gs.journalEntries)?gs.journalEntries:[]};
  }
  function explorationData(gs=state.campaign?.game_state||defaultGameState()){
    const source=gs.exploration||{};
    return {mapId:MAP_TEMPLATES.some(m=>m.id===source.mapId)?source.mapId:'eldoria-road',maps:source.maps&&typeof source.maps==='object'?cloneData(source.maps):{}};
  }
  function activeMapRecord(gs=state.campaign?.game_state||defaultGameState()){
    const exploration=explorationData(gs);const record=exploration.maps[exploration.mapId]||{};
    return {fogEnabled:!!record.fogEnabled,revealedCells:Array.isArray(record.revealedCells)?[...record.revealedCells]:[],tokens:record.tokens&&typeof record.tokens==='object'?cloneData(record.tokens):{},markers:Array.isArray(record.markers)?cloneData(record.markers):[]};
  }
  function setActiveMapRecord(exploration,record){exploration.maps[exploration.mapId]=record;return exploration;}
  function mapTemplate(id){return MAP_TEMPLATES.find(m=>m.id===id)||MAP_TEMPLATES[0]}
  function mapTile(id,x,y){const layout=mapTemplate(id).layout;return layout[y]?.[x]||'b'}
  function mapTileInfo(tile){return ({'.':{name:'Grama',glyph:'',blocked:false,cls:'grass'},p:{name:'Trilha',glyph:'',blocked:false,cls:'path'},t:{name:'Árvore',glyph:'🌳',blocked:true,cls:'tree'},w:{name:'Água',glyph:'💧',blocked:true,cls:'water'},r:{name:'Rocha',glyph:'🪨',blocked:true,cls:'rock'},h:{name:'Casa',glyph:'🏠',blocked:true,cls:'house'},c:{name:'Coluna',glyph:'🏛️',blocked:true,cls:'column'},b:{name:'Muro',glyph:'🧱',blocked:true,cls:'wall'}})[tile]||{name:'Terreno',glyph:'',blocked:false,cls:'grass'};}
  function mapCellKey(x,y){return `${x},${y}`}
  function addRevealedAround(record,x,y,radius=1){const cells=new Set(record.revealedCells||[]);for(let yy=Math.max(0,y-radius);yy<=Math.min(MAP_HEIGHT-1,y+radius);yy++)for(let xx=Math.max(0,x-radius);xx<=Math.min(MAP_WIDTH-1,x+radius);xx++)cells.add(mapCellKey(xx,yy));record.revealedCells=[...cells];}
  const MAP_PARTY_SPAWNS={
    'eldoria-road':[{x:7,y:5},{x:5,y:4},{x:6,y:4},{x:8,y:4}],
    brumafolha:[{x:5,y:4},{x:6,y:4},{x:7,y:4},{x:8,y:4}],
    watchtower:[{x:4,y:4},{x:5,y:4},{x:6,y:4},{x:8,y:4}],
    'root-sanctuary':[{x:6,y:4},{x:7,y:4},{x:8,y:4},{x:9,y:4}],
    'thalassor-reef':[{x:4,y:4},{x:5,y:4},{x:6,y:4},{x:7,y:4}],
    'niveria-crystal':[{x:3,y:4},{x:5,y:4},{x:6,y:4},{x:7,y:4}],
    'solaria-dais':[{x:4,y:4},{x:5,y:4},{x:6,y:4},{x:7,y:4}],
    'drakmor-citadel':[{x:4,y:4},{x:5,y:4},{x:6,y:4},{x:7,y:4}]
  };
  function defaultPartyPositions(mapId){
    const players=state.members.filter(m=>m.role==='player'&&m.character).sort((a,b)=>String(a.joined_at||'').localeCompare(String(b.joined_at||''))||String(a.user_id).localeCompare(String(b.user_id)));
    const preferred=MAP_PARTY_SPAWNS[mapId]||[],candidates=[...preferred];
    for(let y=MAP_HEIGHT-1;y>=4;y--)for(let x=0;x<MAP_WIDTH;x++)candidates.push({x,y});
    const chosen=[],monsterStart={x:7,y:3};
    for(const candidate of candidates){
      if(chosen.length>=players.length)break;
      if(mapTileInfo(mapTile(mapId,candidate.x,candidate.y)).blocked||candidate.x===monsterStart.x&&candidate.y===monsterStart.y||chosen.some(p=>p.x===candidate.x&&p.y===candidate.y))continue;
      const next=[...chosen,candidate];
      const allReachable=next.every(position=>Number.isFinite(mapPathDistance(mapId,monsterStart,position,next.filter(other=>other!==position))));
      if(allReachable)chosen.push(candidate);
    }
    return new Map(players.map((member,index)=>[member.user_id,chosen[index]||{x:1+(index%7),y:6}]));
  }
  function defaultTokenPosition(userId,mapId){return defaultPartyPositions(mapId).get(userId)||{x:1,y:6}}
  function mapTokenPosition(tokenId,record,mapId){if(record.tokens[tokenId])return record.tokens[tokenId];if(tokenId==='monster')return {x:7,y:3};return defaultTokenPosition(tokenId,mapId)}
  function characterMiniatureClass(character){return ({Guerreiro:'warrior',Arcano:'arcane',Patrulheiro:'ranger',Paladino:'paladin',Assassino:'assassin',Clérigo:'cleric',Druida:'druid',Invocador:'summoner'})[character?.class]||'warrior'}
  function characterSigil(character){return ({Guerreiro:'⚔',Arcano:'✧',Patrulheiro:'➶',Paladino:'✥',Assassino:'☾',Clérigo:'✚',Druida:'❧',Invocador:'◈'})[character?.class]||'✦'}
  function tokenInitials(name){return String(name||'A').trim().split(/\s+/).slice(0,2).map(part=>part[0]||'').join('').toUpperCase()||'A'}
  const CLASS_PORTRAITS={Guerreiro:'warrior.webp',Arcano:'arcane.webp',Patrulheiro:'ranger.webp',Paladino:'paladin.webp',Assassino:'assassin.webp',Clérigo:'cleric.webp',Druida:'druid.webp',Invocador:'summoner.webp'};
  function portraitUrl(file){return `assets/portraits/${encodeURIComponent(file||'warrior.webp')}`}
  function classPortrait(character){return CLASS_PORTRAITS[typeof character==='string'?character:character?.class]||'warrior.webp'}
  function portraitImage(file,alt,extra=''){return `<img class="portrait-art ${extra}" src="${portraitUrl(file)}" alt="${esc(alt||'Retrato de Aethra')}" loading="lazy" onerror="this.hidden=true">`}
  function memberPortrait(member,extra=''){return member?.character?portraitImage(member.character.portrait||classPortrait(member.character),member.character.name||member.display_name,extra):`<span class="portrait-fallback ${extra}">${member?.role==='master'?'♛':'✦'}</span>`}
  function monsterPortrait(templateId){return MONSTERS.find(m=>m.id===templateId)?.portrait||'goblin-ash.webp'}
  // Miniaturas vetoriais articuladas para o mapa: membros separados permitem ciclos de movimento reais,
  // sem depender de uma imagem estática ou de uma spritesheet externa.
  function equipmentVisual(item){
    const raw=String(item?.rarity||item?.raridade||'comum').toLowerCase();
    const normalized=raw.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    const allowed=['comum','incomum','raro','epico','lendario'];
    const rarity=allowed.includes(normalized)?normalized:'comum';
    const colors={comum:'#c8cbd0',incomum:'#70c98b',raro:'#68a9ff',epico:'#bd8cff',lendario:'#f4c45e'};
    const custom=String(item?.color||'');
    const color=/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(custom)?custom:colors[rarity];
    return {rarity,color};
  }
  function mapHeroSprite(className='Guerreiro',equipment={}){
    const key=({'Guerreiro':'warrior','warrior':'warrior','Arcano':'mage','arcane':'mage','mage':'mage','Patrulheiro':'ranger','ranger':'ranger','Paladino':'paladin','paladin':'paladin','Assassino':'assassin','assassin':'assassin','Clérigo':'cleric','cleric':'cleric','Druida':'druid','druid':'druid','Invocador':'summoner','summoner':'summoner'})[className]||'warrior';
    const armor=equipment?.armor||{},weapon=equipment?.weapon||{},shield=equipment?.shield||null;
    const armorVisual=equipmentVisual(armor),weaponVisual=equipmentVisual(weapon),shieldVisual=equipmentVisual(shield||{});
    const armorTone=(armor.rarity||armor.raridade||armor.color)?armorVisual.color:(key==='paladin'?'#d8bd70':key==='assassin'?'#34394b':key==='mage'||key==='summoner'?'#7161a5':key==='ranger'||key==='druid'?'#66834d':'#75889a');
    const armorLayer=equipment?.armor?`<path class="sprite-equipped-armor rarity-${armorVisual.rarity}" d="M18 19 Q24 16 30 19 L32 32 Q24 36 16 32Z" style="fill:${armorTone};--item-color:${armorVisual.color}"/><path class="sprite-armor-trim" d="M19 21 L29 21 M18 29 L30 29"/>`:'';
    const weaponShape=key==='ranger'?'M37 17 Q46 26 37 38 M37 17 L37 38 M36 27 L44 27':key==='mage'||key==='druid'||key==='summoner'||key==='cleric'?'M39 37 L43 8 M40 13 L46 13 M43 8 L43 4':key==='assassin'?'M35 30 L43 17 L40 32 M29 31 L34 21':'M37 34 L44 10 M39 31 L45 33 M42 15 L46 7';
    const weaponLayer=`<path class="sprite-equipped-weapon" d="${weaponShape}" style="--item-color:${weaponVisual.color}"/>`;
    const shieldLayer=shield?`<path class="sprite-equipped-shield" d="M9 25 L16 27 L16 38 Q12 43 9 39Z" style="--item-color:${shieldVisual.color}"/>`:'';
    return `<svg class="hero-sprite sprite-${key}" viewBox="0 0 48 58" role="img" aria-label="Aventureiro ${esc(className)}" xmlns="http://www.w3.org/2000/svg"><ellipse class="sprite-shadow" cx="24" cy="54" rx="13" ry="3"/><g class="sprite-body"><g class="sprite-back-arm"><path d="M17 22 Q10 26 11 35"/><circle cx="11" cy="36" r="2.8"/></g><g class="sprite-front-arm"><path d="M30 22 Q38 27 36 34"/><circle cx="36" cy="35" r="2.8"/></g><path class="sprite-cape" d="M17 18 Q8 25 12 43 L20 39 L23 23Z"/><path class="sprite-torso" d="M18 18 Q24 15 30 18 L33 34 Q24 39 15 34Z"/>${armorLayer}<path class="sprite-belt" d="M16 31 Q24 34 32 31 L32 34 Q24 37 16 34Z"/><g class="sprite-head"><circle cx="24" cy="11" r="6.2"/><path class="sprite-hair" d="M18 10 Q18 3 25 4 Q31 5 30 12 L27 9 L23 10 L19 13Z"/></g><g class="sprite-back-leg"><path d="M20 35 L18 47 L16 52"/><path class="sprite-boot" d="M13 51 L19 50 L20 54 L12 54Z"/></g><g class="sprite-front-leg"><path d="M27 35 L29 46 L32 51"/><path class="sprite-boot" d="M29 50 L35 51 L37 54 L29 54Z"/></g><g class="sprite-weapon">${weaponLayer}</g>${shieldLayer}<path class="sprite-highlight" d="M20 20 L23 19 L22 29"/></g></svg>`;
  }
  function mapMonsterSprite(templateId,name='Criatura'){
    const id=String(templateId||'').toLowerCase();
    const forms={
      'goblin-cinzas':'<path d="M11 22 L4 13 L14 16 L18 9 L29 10 L35 17 L44 13 L39 25 L37 39 L30 45 L17 42 L12 34Z"/><path d="M18 25 L22 25 M31 25 L34 25" stroke="#ffe6a4" stroke-width="2"/><path d="M23 33 Q28 37 33 32" fill="none" stroke="#271b1a" stroke-width="2"/>',
      'lobo-cinzento':'<path d="M7 28 L13 18 L24 16 L31 20 L39 17 L45 22 L40 29 L35 31 L31 42 L25 43 L23 32 L16 34 L13 43 L8 42 L10 31Z"/><path d="M15 20 L12 10 L22 17 M34 20 L39 10 L40 22"/><path d="M35 26 L39 26" stroke="#fff1c7" stroke-width="2"/>',
      'espectro-ruptura':'<path d="M12 15 Q24 2 37 16 L39 35 L44 45 L34 40 L28 47 L22 40 L13 47 L16 35Z"/><path d="M18 22 L22 22 M30 22 L34 22" stroke="#bffaff" stroke-width="3"/><path d="M24 28 L28 28" stroke="#bffaff" stroke-width="2"/>',
      'campeao-orc':'<path d="M12 17 L18 10 L32 10 L39 18 L38 37 L31 45 L17 43 L10 34Z"/><path d="M14 21 L6 13 L17 17 M36 21 L44 13 L34 17"/><path d="M18 25 L22 25 M30 25 L34 25" stroke="#fff0ba" stroke-width="3"/><path d="M21 34 L29 34" stroke="#2c1713" stroke-width="3"/>',
      'drakthar':'<path d="M7 31 L4 15 L17 22 L23 8 L30 20 L44 12 L39 31 L35 43 L24 48 L12 42Z"/><path d="M16 25 L9 5 L23 18 M32 22 L43 4 L39 28"/><path d="M17 29 L22 29 M30 29 L35 29" stroke="#fff1a6" stroke-width="3"/><path d="M22 37 Q27 42 32 36" fill="none" stroke="#ffb35c" stroke-width="2"/>',
      'aranha-umbrafunda':'<path d="M24 20 Q15 13 13 24 Q15 35 24 34 Q34 35 35 24 Q33 14 24 20Z"/><path d="M16 22 L5 13 M14 27 L3 31 M18 33 L10 45 M32 22 L43 13 M34 27 L45 31 M30 33 L38 45" fill="none" stroke-width="4"/><circle cx="20" cy="25" r="2" fill="#ffe5a4"/><circle cx="28" cy="25" r="2" fill="#ffe5a4"/>',
      'cultista-cinzento':'<path d="M13 14 L24 5 L35 14 L33 39 L24 47 L15 39Z"/><path d="M15 19 L24 26 L33 19" fill="none" stroke="#d5c9ec" stroke-width="3"/><circle cx="20" cy="23" r="2" fill="#f4d8ff"/><circle cx="28" cy="23" r="2" fill="#f4d8ff"/>',
      'golem-basalto':'<path d="M13 13 L21 6 L34 12 L39 29 L33 44 L14 43 L8 29Z"/><path d="M18 23 L22 23 M29 23 L33 23" stroke="#ffd68b" stroke-width="3"/><path d="M17 34 L31 34" stroke="#4b4039" stroke-width="3"/>',
      'sereia-abissal':'<path d="M24 9 Q35 12 32 25 L28 34 L39 45 L25 41 L14 47 L19 33 Q11 24 16 15Z"/><path d="M16 19 Q24 25 32 19" fill="none" stroke="#b5f3ee" stroke-width="2"/><circle cx="21" cy="17" r="2" fill="#fff"/>',
      'cavaleiro-solar':'<path d="M14 14 L24 5 L34 14 L36 34 L29 45 L18 45 L11 34Z"/><path d="M16 18 L24 25 L32 18" fill="none" stroke="#f9df9b" stroke-width="3"/><path d="M19 30 L29 30" stroke="#f9df9b" stroke-width="3"/>',
      'draco-niveriano':'<path d="M8 32 L5 17 L17 22 L23 8 L31 20 L43 13 L39 34 L30 45 L17 44Z"/><path d="M15 23 L9 7 L23 18 M32 22 L42 6 L39 26"/><path d="M18 29 L22 29 M30 29 L34 29" stroke="#dffaff" stroke-width="3"/>',
      'sabueso-brasas':'<path d="M7 30 L13 19 L25 17 L34 21 L43 18 L40 30 L33 34 L29 44 L23 43 L20 34 L12 38Z"/><path d="M15 20 L12 10 L22 18 M34 21 L40 10 L41 23"/>',
      'guardiao-raiz':'<path d="M13 13 L22 5 L34 13 L39 31 L31 45 L15 44 L8 30Z"/><path d="M15 18 L6 9 M34 18 L43 8 M17 31 L8 39 M32 31 L41 40" fill="none" stroke-width="3"/>',
      'saqueador-afogado':'<path d="M13 14 L24 6 L35 14 L37 36 L28 45 L15 40Z"/><path d="M16 22 L22 22 M29 22 L34 22" stroke="#b9f5ee" stroke-width="3"/><path d="M35 30 L45 37 L39 42" fill="none" stroke-width="3"/>',
      'revenante-geada':'<path d="M12 15 Q24 2 37 16 L39 35 L44 45 L34 40 L28 47 L22 40 L13 47 L16 35Z"/><path d="M18 22 L22 22 M30 22 L34 22" stroke="#e4fbff" stroke-width="3"/><path d="M24 28 L28 28" stroke="#e4fbff" stroke-width="2"/>',
      'escorpiao-solar':'<path d="M10 32 Q7 19 19 17 Q32 15 37 27 Q38 39 24 41 Q12 41 10 32Z"/><path d="M34 24 Q43 16 39 8 L34 5" fill="none" stroke-width="4"/><path d="M13 29 L4 22 M15 37 L5 44 M33 34 L43 42" fill="none" stroke-width="3"/>',
      'caranguejo-coral':'<path d="M10 27 Q12 15 24 18 Q37 15 39 27 L35 39 L14 39Z"/><path d="M12 25 L4 16 L8 31 M36 25 L44 16 L40 31 M16 37 L8 45 M32 37 L40 45" fill="none" stroke-width="4"/><path d="M18 26 L21 26 M28 26 L31 26" stroke="#e5ffff" stroke-width="3"/>',
      'sentinela-cristal':'<path d="M24 4 L39 17 L35 39 L24 48 L12 38 L8 17Z"/><path d="M24 4 L24 48 M8 17 L39 17 M12 38 L35 39" fill="none" stroke="#e5fbff" stroke-width="2"/><circle cx="24" cy="25" r="4" fill="#f5ffff"/>',
      'acólito-solar':'<path d="M14 14 L24 5 L34 14 L36 36 L29 46 L18 46 L11 36Z"/><path d="M24 2 L24 12 M5 25 L14 25 M34 25 L43 25 M11 8 L17 16 M37 8 L31 16" fill="none" stroke="#ffe9a1" stroke-width="3"/><path d="M18 25 L22 25 M29 25 L33 25" stroke="#fff4c4" stroke-width="3"/>',
      'vigia-ruinas':'<path d="M12 13 L20 5 L29 5 L38 14 L36 39 L29 47 L15 43 L9 30Z"/><path d="M17 22 L22 22 M29 22 L33 22" stroke="#e7d9b8" stroke-width="3"/><path d="M18 34 L31 34" stroke="#514a43" stroke-width="3"/>' ,
      'mariposa-veu':'<path d="M23 24 Q7 3 5 18 Q4 34 22 30 Q12 47 23 42 Q34 47 26 30 Q44 34 43 18 Q40 3 25 24Z"/><path d="M24 17 L24 38" stroke="#e6d8ff" stroke-width="3"/><circle cx="15" cy="20" r="2" fill="#fff"/><circle cx="34" cy="20" r="2" fill="#fff"/>' ,
      'colosso-sal':'<path d="M12 15 L20 5 L32 8 L39 20 L36 40 L25 47 L12 39 L7 25Z"/><path d="M16 22 L21 22 M29 22 L34 22" stroke="#f4ffff" stroke-width="3"/><path d="M16 34 L32 34" stroke="#779da6" stroke-width="3"/>' ,
      'general-cinzas':'<path d="M13 14 L24 5 L35 14 L38 37 L30 46 L17 44 L10 34Z"/><path d="M12 18 L5 7 L18 13 M36 18 L43 7 L31 13"/><path d="M17 24 L22 24 M29 24 L34 24" stroke="#ffdf9b" stroke-width="3"/><path d="M18 34 L30 34" stroke="#44251b" stroke-width="3"/>',
    };
    const palette=id.includes('lobo')?['#9aa8b7','#465465']:id.includes('espectro')?['#9be6e6','#385d78']:id.includes('orc')?['#9aab65','#4b6339']:id.includes('aranha')?['#806a9b','#392c50']:id.includes('cultista')?['#766b91','#302941']:id.includes('golem')?['#9b8c79','#51463d']:id.includes('sereia')?['#64b8b1','#245a63']:id.includes('cavaleiro')?['#d5b66f','#6b4c28']:id.includes('draco')?['#8fd6e8','#376a83']:id.includes('sabueso')?['#d9783d','#633323']:id.includes('guardiao')?['#829c58','#3d5734']:id.includes('saqueador')?['#6caaa4','#31545a']:id.includes('revenante')?['#b4e6f2','#456a86']:id.includes('escorpiao')?['#e2bd59','#775026']:id.includes('general')?['#c46a3e','#592a25']:id.includes('caranguejo')?['#d87965','#733f49']:id.includes('sentinela')?['#9de4f0','#3e758c']:id.includes('acólito')?['#e6c46b','#85602e']:id.includes('vigia')?['#a69b89','#514a43']:id.includes('mariposa')?['#b89cda','#59466f']:id.includes('colosso')?['#c7e0df','#557c83']:id.includes('drakthar')?['#d66c43','#612a2c']:['#bd8660','#583c37'];
    return `<svg class="monster-sprite monster-${id||'unknown'}" viewBox="0 0 48 52" role="img" aria-label="${esc(name)}" xmlns="http://www.w3.org/2000/svg"><ellipse cx="24" cy="48" rx="15" ry="3" fill="#000" opacity=".4"/><g class="monster-creature" fill="${palette[0]}" stroke="${palette[1]}" stroke-width="2" stroke-linejoin="round">${forms[id]||forms['goblin-cinzas']}</g></svg>`;
  }
  function mapTokens(record,gs=state.campaign?.game_state||defaultGameState()){
    const mapId=explorationData(gs).mapId,defaults=defaultPartyPositions(mapId);
    const list=state.members.filter(m=>m.role==='player'&&m.character).map(m=>({id:m.user_id,name:m.character.name||m.display_name||'Aventureiro',kind:'player',className:characterMiniatureClass(m.character),equipment:gs.partyState?.[m.user_id]?.equipment||m.character.equipment||{},portrait:m.character.portrait||classPortrait(m.character),sigil:characterSigil(m.character),initials:tokenInitials(m.character.name||m.display_name),position:record.tokens[m.user_id]||defaults.get(m.user_id)||{x:1,y:6}}));
    if(gs.encounter)list.push({id:'monster',name:gs.encounter.name||'Criatura',kind:'monster',className:'monster',templateId:gs.encounter.templateId,portrait:gs.encounter.portrait||monsterPortrait(gs.encounter.templateId),sigil:gs.encounter.emoji||'🐉',initials:'',hp:Math.max(0,Number(gs.encounter.hp)||0),maxHp:Math.max(1,Number(gs.encounter.maxHp)||1),defeated:!!gs.encounter.defeated||Number(gs.encounter.hp)<=0,bossPhase:Number(gs.encounter.bossPhase)||1,position:mapTokenPosition('monster',record,mapId)});
    return list;
  }
  function mapCellBlocked(mapId,x,y,record=null){
    if(mapTileInfo(mapTile(mapId,x,y)).blocked)return true;
    return !!record?.markers?.some(marker=>marker.type==='door'&&!marker.open&&marker.x===x&&marker.y===y);
  }
  function mapCellVisible(x,y,record,gs,tokens=mapTokens(record,gs)){if(isMaster()||!record.fogEnabled)return true;const key=mapCellKey(x,y);if(record.revealedCells.includes(key))return true;return tokens.filter(t=>t.kind==='player').some(t=>Math.max(Math.abs(t.position.x-x),Math.abs(t.position.y-y))<=1)}
  function mapPathDistance(mapId,start,end,occupied=[],record=null){const key=(x,y)=>`${x},${y}`,blocked=new Set(occupied.map(p=>key(p.x,p.y)));const queue=[[start.x,start.y,0]],seen=new Set([key(start.x,start.y)]);while(queue.length){const [x,y,d]=queue.shift();if(x===end.x&&y===end.y)return d;for(const [nx,ny] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]){if(nx<0||ny<0||nx>=MAP_WIDTH||ny>=MAP_HEIGHT||mapCellBlocked(mapId,nx,ny,record)||blocked.has(key(nx,ny)))continue;const k=key(nx,ny);if(!seen.has(k)){seen.add(k);queue.push([nx,ny,d+1])}}}return Infinity}
  function pendingMapMovesFrom(events){const resolved=new Set(events.filter(e=>e.event_type==='session_note'&&e.payload?.kind==='map'&&e.payload?.request_id).map(e=>e.payload.request_id));return events.filter(e=>e.event_type==='map_move_request'&&!resolved.has(e.id))}
  function pendingMapInteractionsFrom(events){const resolved=new Set(events.filter(e=>e.event_type==='session_note'&&e.payload?.kind==='map-interaction'&&e.payload?.request_id).map(e=>e.payload.request_id));return events.filter(e=>e.event_type==='map_interaction_request'&&!resolved.has(e.id))}
  function questProgress(quest){const objectives=quest.objectives||[];const done=objectives.filter(o=>o.completed).length;return {done,total:objectives.length,percent:objectives.length?Math.round(done/objectives.length*100):0}}
  function markObjective(quests,questId,objectiveId){
    const next=cloneData(quests);const quest=next.find(q=>q.id===questId);if(!quest||quest.status==='available'||quest.status==='completed')return {quests:next,changed:false,completed:false};
    const objective=quest.objectives.find(o=>o.id===objectiveId);if(!objective||objective.completed)return {quests:next,changed:false,completed:false};
    objective.completed=true;const done=quest.objectives.every(o=>o.completed);if(done){quest.status='completed';quest.completedAt=new Date().toISOString()}
    return {quests:next,changed:true,completed:done,questTitle:quest.title,objectiveText:objective.text};
  }
  function secureDie(sides){const a=new Uint32Array(1);const limit=Math.floor(4294967296/sides)*sides;let x;do{crypto.getRandomValues(a);x=a[0]}while(x>=limit);return (x%sides)+1}
  function rollDamageDie(sides,count=1){let total=0;for(let i=0;i<count;i++)total+=secureDie(sides);return total}
  function attrMod(score){return Math.floor(((Number(score)||1)-4)/2)}
  function classRule(character){return CLASS_RULES[character?.class]||CLASS_RULES.Guerreiro}
  function starterInventory(){return [{id:'pocao-cura',name:'Poção de Cura',kind:'consumable',qty:2,healDie:8,healBonus:2,description:'Recupera 1d8 + 2 pontos de vida.'},{id:'racao-viagem',name:'Rações de Viagem',kind:'utility',qty:3,description:'Alimento para uma jornada.'}]}
  function equipmentBonuses(equipment={}){
    const pieces=['weapon','armor','shield'].map(slot=>equipment?.[slot]).filter(Boolean);
    const vanguard=pieces.filter(item=>item.setId==='vanguarda').length;
    return {defense:(pieces.reduce((n,item)=>n+(Number(item.defense)||0),0))+(vanguard>=3?1:0),attack:pieces.reduce((n,item)=>n+(Number(item.accuracy)||0),0)+(vanguard>=3?1:0),damage:pieces.reduce((n,item)=>n+(Number(item.damageBonus)||0),0),setName:vanguard>=3?'Vanguarda':null,setPieces:vanguard};
  }
  function equipmentRequirementError(item,character){
    if(Number(character.level||1)<Number(item.requiredLevel||1))return `Este item exige nível ${item.requiredLevel}.`;
    if(Array.isArray(item.requiredClasses)&&item.requiredClasses.length&&!item.requiredClasses.includes(character.class))return `Este item é restrito às classes: ${item.requiredClasses.join(', ')}.`;
    return '';
  }
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
    c.defense=10+attrMod(c.attributes.destreza)+equipmentBonuses(c.equipment).defense;
    c.ability=classRule(c).abilityName;
    c.portrait=c.portrait||classPortrait(c);
    return c;
  }
  function currentPartyVitals(userId,character){
    const c=normalizeCharacter(character);const ps=state.campaign?.game_state?.partyState?.[userId]||{};
    const equipment=ps.equipment||c.equipment||{};const gear=equipmentBonuses(equipment);const calculatedDefense=10+attrMod(c.attributes.destreza)+gear.defense;const activeEncounter=state.campaign?.game_state?.encounter;const round=Number(activeEncounter?.round)||1;const baseDefense=calculatedDefense;const penalty=activeEncounter&&!activeEncounter.defeated&&Number(ps.defensePenaltyUntilRound)>=round?Number(ps.defensePenalty)||0:0;return {hp:Math.max(0,Math.min(Number(ps.maxHp)||c.maxHp,Number.isFinite(Number(ps.hp))?Number(ps.hp):c.hp)),maxHp:Number(ps.maxHp)||c.maxHp,defense:Math.max(0,baseDefense-penalty),baseDefense,defensePenalty:Number(ps.defensePenalty)||0,defensePenaltyUntilRound:Number(ps.defensePenaltyUntilRound)||0,inventory:Array.isArray(ps.inventory)?ps.inventory:c.inventory, equipment,equipmentBonuses:gear,abilityUsed:!!ps.abilityUsed,coins:Math.max(0,Number(ps.coins)||0)};
  }
  function applyBossPhase(encounter){
    if(!encounter||encounter.templateId!=='drakthar')return {...encounter};
    const ratio=Math.max(0,Number(encounter.hp)||0)/Math.max(1,Number(encounter.maxHp)||720);
    const phase=ratio<=.33?3:ratio<=.66?2:1;
    const names={1:'Fase I — O Devorador desperta',2:'Fase II — As escamas se incendeiam',3:'Fase III — Fúria do Dragão Ancião'};
    const descriptions={1:'Drakthar observa os aventureiros e testa suas defesas.',2:'Ferido, o dragão libera brasas ancestrais. Defesa e ataques aumentam.',3:'À beira da derrota, Drakthar abandona qualquer cautela e prepara sopros devastadores.'};
    return {...encounter,bossPhase:phase,bossPhaseName:names[phase],bossPhaseDescription:descriptions[phase],defense:(Number(encounter.baseDefense)||18)+(phase-1),attackBonus:(Number(encounter.baseAttackBonus)||8)+(phase-1)};
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
    c.level=level;c.xp=xp;c.maxHp+=levelsGained*5;c.hp=Math.min(c.maxHp,c.hp+levelsGained*5);c.defense=10+attrMod(c.attributes.destreza)+equipmentBonuses(c.equipment).defense;
    return {character:c,levelsGained,oldLevel,newLevel:level};
  }
  const ENCOUNTER_QUEST_OBJECTIVES = {
    'goblin-cinzas':[['main-01','defeat-ash-goblins']],
    'aranha-umbrafunda':[['main-02','defeat-umbra-spider']],
    'cultista-cinzento':[['main-03','defeat-cultist']],
    'sereia-abissal':[['main-03','silence-siren']],
    'draco-niveriano':[['main-04','defeat-crystal-drake']],
    'cavaleiro-solar':[['main-05','defeat-hollow-knight']],
    'lobo-cinzento':[['side-02','drive-off-wolves']],
    'espectro-ruptura':[['side-03','lay-restless-spirit']],
    'sabueso-brasas':[['main-06','defeat-ember-hounds'],['side-05','defeat-ember-hound']],
    'general-cinzas':[['main-07','defeat-ash-general']],
    'saqueador-afogado':[['side-06','defeat-drowned-raider']],
    'revenante-geada':[['main-08','defeat-frost-revenant'],['side-07','defeat-frost-wraith']],
    'caranguejo-coral':[['side-04','defeat-reef-threat']],
    'vigia-ruinas':[['side-09','defeat-ruin-warden']],
    'mariposa-veu':[['side-08','defeat-veil-moth']],
    'colosso-sal':[['side-10','defeat-salt-colossus']],
    // Sentinela e Acólito ainda não possuem objetivos exclusivos na campanha.
  };
  async function progressEncounterQuestObjectives(encounter){
    if(!isMaster()||!isMasterController())return;
    const targets=ENCOUNTER_QUEST_OBJECTIVES[encounter?.templateId]||[];
    for(const [questId,objectiveId] of targets){
      try{await completeQuestObjective(questId,objectiveId,'encounter');}
      catch(error){console.warn('Não foi possível atualizar o objetivo da missão:',questId,objectiveId,error);}
    }
  }
  async function awardEncounterRewards(encounter){
    if(!encounter||encounter.xpAwarded)return;
    const ids=Array.isArray(encounter.participantIds)?encounter.participantIds:state.members.filter(m=>m.role==='player'&&m.character).map(m=>m.user_id);
    const reward=Math.max(0,Number(encounter.xpReward)||0);if(!reward||!ids.length){encounter.xpAwarded=true;await updateGameState({encounter});await progressEncounterQuestObjectives(encounter);return}
    if(state.backendReady){
      const {data,error}=await state.backend.rpc('award_encounter_xp',{p_campaign_id:state.campaign.id,p_encounter_id:encounter.id,p_xp:reward,p_user_ids:ids});
      if(error)throw error;
      const awards=Array.isArray(data?.awards)?data.awards:[];
      if(awards.length)await createEvent('encounter_defeated',{monster:encounter.name,xp:reward,rewards:awards,description:`${encounter.name} foi derrotado. Cada aventureiro participante recebeu ${reward} XP.`});
      await refreshCloudCampaign({silent:true});
      // A tabela campaign_xp_awards evita distribuir a recompensa novamente, mesmo após reconexão.
      if(state.campaign?.game_state?.encounter?.id===encounter.id){await updateGameState({encounter:{...state.campaign.game_state.encounter,xpAwarded:true}})}
      awards.forEach(r=>{if(Number(r.levels_gained)>0)toast(`${r.name} subiu para o nível ${r.level}!`)});
      await progressEncounterQuestObjectives(encounter);
      return data;
    }
    const partyState={...(state.campaign.game_state?.partyState||{})};const rewards=[];
    ids.forEach(id=>{const member=state.members.find(m=>m.user_id===id);if(!member?.character)return;const result=localGrantXp(member.character,reward);member.character=result.character;const old=partyState[id]||{};const currentHp=Number.isFinite(Number(old.hp))?Number(old.hp):result.character.hp;partyState[id]={...old,hp:Math.min(result.character.maxHp,currentHp+result.levelsGained*5),maxHp:result.character.maxHp,defense:result.character.defense};rewards.push({name:result.character.name,xp:reward,levelsGained:result.levelsGained,level:result.newLevel})});
    encounter.xpAwarded=true;await updateGameState({encounter,partyState});await persistLocalCampaign();await createEvent('encounter_defeated',{monster:encounter.name,xp:reward,rewards,description:`${encounter.name} foi derrotado. Cada aventureiro participante recebeu ${reward} XP.`});
    rewards.forEach(r=>{if(r.levelsGained)toast(`${r.name} subiu para o nível ${r.level}!`)});
    await progressEncounterQuestObjectives(encounter);
    return rewards;
  }
  const state = {
    view:'home', modal:null, backend:null, user:null, backendReady:false, realtimeStatus:'disconnected',
    campaign:null, member:null, members:[], events:[], pendingDamage:[], pendingMapMoves:[], pendingMapInteractions:[], channel:null, channelPresence:[], authSubscription:null, processed:new Set(),
    charStep:0, charDraft:null, monsterDraft:85, toastTimer:null, diceOverlayTimer:null, cloudCampaigns:[], prefillJoinCode:null,
    selectedMapToken:null, selectedMapTool:'move',
    instanceId:null, lastSyncAt:null, rollQueue:Promise.resolve(), combatQueue:Promise.resolve(), isRefreshing:false,
    localCampaigns:readLocalCampaigns(), currentBook:null, accountMode:'home'
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
  function isAnonymousUser(user=state.user){return !!user?.is_anonymous}
  function isPermanentUser(user=state.user){return !!user&&!isAnonymousUser(user)}
  function pendingLinkEmail(){return (localStorage.getItem(KEYS.pendingLinkEmail)||'').trim().toLowerCase()}
  function pendingLinkConfirmed(){
    const pending=pendingLinkEmail();
    if(!pending||!state.user?.email)return false;
    const confirmed=state.user.email_confirmed_at||state.user.confirmed_at;
    return state.user.email.toLowerCase()===pending&&!!confirmed&&!isAnonymousUser();
  }
  function refreshAccountButton(){
    const label=$('#account-label'),button=$('#account-button');if(!label||!button)return;
    if(!state.backendReady){label.textContent='Conta';button.title='Configure o Supabase para criar uma conta sincronizada';return}
    if(isAnonymousUser()){label.textContent='Salvar progresso';button.title='Vincule um e-mail e senha para continuar em outros dispositivos';}
    else{label.textContent='Conta ✓';button.title=state.user?.email||'Conta sincronizada';}
  }
  function authRedirectUrl(){return `${location.origin}${location.pathname}`}
  function clearCampaignContext(){
    if(state.channel&&state.backend)state.backend.removeChannel(state.channel);
    state.channel=null;state.channelPresence=[];state.campaign=null;state.member=null;state.members=[];state.events=[];
    state.pendingDamage=[];state.pendingMapMoves=[];state.pendingMapInteractions=[];state.processed=new Set();state.cloudCampaigns=[];
    localStorage.removeItem(KEYS.active);state.view='campaigns';
  }
  function handleAuthStateChange(event,session){
    const oldId=state.user?.id;const nextUser=session?.user||null;
    state.user=nextUser;
    if(oldId&&nextUser&&oldId!==nextUser.id){clearCampaignContext();Promise.resolve().then(()=>loadCloudCampaigns());}
    if(event==='PASSWORD_RECOVERY'){state.accountMode='recovery-password';state.modal='account';setTimeout(render,0);}
    if(pendingLinkConfirmed()&&state.accountMode!=='set-password'){state.accountMode='set-password';state.modal='account';setTimeout(render,0);}
    refreshAccountButton();
  }
  async function linkGuestAccount(email){
    if(!state.backendReady||!state.user)throw new Error('Conecte o Supabase antes de criar uma conta.');
    if(!isAnonymousUser())throw new Error('Esta sessão já possui uma conta permanente.');
    if(state.member?.campaign_id)toast('A identidade será vinculada à mesma ficha e às mesmas campanhas. Não feche esta aba até confirmar o e-mail.');
    const normalized=email.trim().toLowerCase();
    if(!normalized||!normalized.includes('@'))throw new Error('Informe um endereço de e-mail válido.');
    localStorage.setItem(KEYS.pendingLinkEmail,normalized);
    const {error}=await state.backend.auth.updateUser({email:normalized},{emailRedirectTo:authRedirectUrl()});
    if(error){localStorage.removeItem(KEYS.pendingLinkEmail);if(/manual.*link|link.*disabled/i.test(error.message||''))throw new Error('Ative Manual Linking em Authentication → Configuration no Supabase e tente novamente.');throw error;}
    state.accountMode='await-email';render();toast('E-mail de confirmação solicitado. Abra a mensagem e confirme usando este mesmo navegador.');
  }
  async function finishAccountPassword(password,confirmPassword){
    if(!pendingLinkConfirmed())throw new Error('Primeiro confirme o endereço de e-mail pelo link enviado pelo Supabase.');
    if(password.length<8)throw new Error('Use uma senha com pelo menos 8 caracteres.');
    if(password!==confirmPassword)throw new Error('As duas senhas não coincidem.');
    const {data,error}=await state.backend.auth.updateUser({password});if(error)throw error;
    state.user=data.user||state.user;localStorage.removeItem(KEYS.pendingLinkEmail);state.accountMode='profile';render();toast('Conta criada! A mesma ficha agora pode ser acessada em outros dispositivos.');
  }
  async function signInExistingAccount(email,password){
    if(state.user?.is_anonymous&&state.member?.campaign_id)throw new Error('Esta sessão visitante já está ligada a uma campanha neste dispositivo. Volte e escolha “Salvar progresso” para vincular o e-mail sem perder a ficha.');
    const {data,error}=await state.backend.auth.signInWithPassword({email:email.trim().toLowerCase(),password});if(error)throw error;
    state.user=data.user;clearCampaignContext();state.modal=null;state.view='campaigns';await loadCloudCampaigns();render();toast('Login realizado. Suas campanhas vinculadas à conta foram carregadas.');
  }
  async function sendPasswordReset(email){
    const normalized=email.trim().toLowerCase();if(!normalized.includes('@'))throw new Error('Informe um e-mail válido.');
    const {error}=await state.backend.auth.resetPasswordForEmail(normalized,{redirectTo:authRedirectUrl()});if(error)throw error;
    state.accountMode='reset-sent';render();toast('Se o e-mail estiver cadastrado, o Supabase enviará as instruções de recuperação.');
  }
  async function updateSignedInPassword(password,confirmPassword){
    if(password.length<8)throw new Error('Use uma senha com pelo menos 8 caracteres.');
    if(password!==confirmPassword)throw new Error('As duas senhas não coincidem.');
    const {data,error}=await state.backend.auth.updateUser({password});if(error)throw error;
    state.user=data.user||state.user;state.accountMode='profile';state.modal='account';render();toast('Senha atualizada com sucesso.');
  }
  async function signOutAccount(){
    if(!state.backendReady)throw new Error('Supabase não está conectado.');
    await state.backend.auth.signOut();
    localStorage.removeItem(KEYS.pendingLinkEmail);
    const {data,error}=await state.backend.auth.signInAnonymously();if(error)throw error;
    clearCampaignContext();state.user=data.user;state.accountMode='home';state.modal=null;render();toast('Você saiu da conta neste dispositivo.');
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
  function defaultGameState(){return {chapter:'Capítulo I — Ecos na Estrada',location:'Estrada Esquecida de Eldoria',narration:'A chuva fina desenha linhas na poeira da estrada. Pegadas profundas seguem em direção à antiga torre de vigia. Entre as árvores, um sino toca uma única vez — embora a vila esteja distante.',encounter:null,started:false,turn:1,notes:[],activeRollPrompt:null,partyState:{},quests:cloneData(STORY_QUESTS),revealedNpcIds:[],journalEntries:[],storyFlags:{},dialogueChoices:{},exploration:{mapId:'eldoria-road',maps:{}}}}
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
    if(state.backendReady&&pendingLinkConfirmed()){state.accountMode='set-password';state.modal='account';}
    if(state.backendReady&&new URLSearchParams(location.hash.replace(/^#/, '')).get('type')==='recovery'){state.accountMode='recovery-password';state.modal='account';}
    render();refreshAccountButton();
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
    const schemaCheck=await client.from('campaigns').select('id').limit(1);
    if(schemaCheck.error){const detail=schemaCheck.error.message||'tabela campaigns indisponível';throw new Error(`A autenticação funcionou, mas o banco de Aethra ainda não está pronto (${detail}). Execute o arquivo supabase-schema.sql no SQL Editor do Supabase e tente novamente.`)}
    state.backend=client;state.user=session.user;state.backendReady=true;state.realtimeStatus='disconnected';
    if(state.authSubscription?.unsubscribe)state.authSubscription.unsubscribe();
    const {data:{subscription}}=client.auth.onAuthStateChange((event,nextSession)=>handleAuthStateChange(event,nextSession));
    state.authSubscription=subscription;
    localStorage.setItem(KEYS.config,JSON.stringify({url:url.trim(),key:key.trim()}));
    refreshConnectionLabel();refreshAccountButton();
    if(!silent)toast('Supabase conectado. Entre com sua conta ou salve o progresso do visitante.');
    return true;
  }
  function disconnectSupabase(){
    if(state.channel&&state.backend)state.backend.removeChannel(state.channel);
    if(state.authSubscription?.unsubscribe)state.authSubscription.unsubscribe();
    state.channel=null;state.channelPresence=[];state.authSubscription=null;state.backend=null;state.user=null;state.backendReady=false;state.realtimeStatus='disconnected';state.modal=null;localStorage.removeItem(KEYS.config);setConnection('Modo local',false);refreshAccountButton();toast('Configuração do Supabase removida.');render();
  }

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
    if(state.modal==='account')renderAccountModal();
    refreshAccountButton();
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
      <div class="notice"><strong>Edição v2.1 · raridades e conjuntos:</strong> os sete livros agora possuem capítulos de consulta escritos diretamente na biblioteca. Esta é uma primeira edição digital em expansão; ilustrações editoriais e PDFs diagramados ainda serão produzidos. O Livro do Mestre contém orientações de condução, mas não armazene segredos confidenciais nele: o conteúdo do navegador não é protegido por controle de acesso real.</div>
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
    state.campaign=c;state.member=m;state.members=c.members;state.events=c.events||[];state.pendingDamage=state.events.filter(e=>e.event_type==='damage_request');state.pendingMapMoves=pendingMapMovesFrom(state.events);state.pendingMapInteractions=pendingMapInteractionsFrom(state.events);localStorage.setItem(KEYS.active,c.id);writeLocalCampaigns();state.view='lobby';state.modal=null;render();toast('Você entrou na campanha.');
  }
  function pendingDamageFrom(events){const resolved=new Set(events.filter(e=>['damage_applied','damage_rejected'].includes(e.event_type)).map(e=>e.payload?.request_id).filter(Boolean));return events.filter(e=>e.event_type==='damage_request'&&!resolved.has(e.id))}
  async function openCloudCampaign(id){
    const [{data:c,error:ce},{data:members,error:me},{data:events,error:ee}]=await Promise.all([
      state.backend.from('campaigns').select('*').eq('id',id).single(),
      state.backend.from('campaign_members').select('*').eq('campaign_id',id),
      state.backend.from('campaign_events').select('*').eq('campaign_id',id).order('created_at',{ascending:false}).limit(500)
    ]);
    if(ce)throw ce;if(me)throw me;if(ee)throw ee;
    state.campaign=c;state.members=members||[];state.member=state.members.find(m=>m.user_id===state.user.id)||null;state.events=(events||[]).reverse();state.pendingDamage=pendingDamageFrom(state.events);state.pendingMapMoves=pendingMapMovesFrom(state.events);state.pendingMapInteractions=pendingMapInteractionsFrom(state.events);state.processed=new Set(state.events.map(ev=>ev.id));state.lastSyncAt=new Date().toISOString();
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
        state.backend.from('campaign_events').select('*').eq('campaign_id',id).order('created_at',{ascending:false}).limit(500)
      ]);
      if(campaignRes.error)throw campaignRes.error;if(membersRes.error)throw membersRes.error;if(eventsRes.error)throw eventsRes.error;
      if(campaignRes.data)state.campaign=campaignRes.data;
      if(membersRes.data)state.members=membersRes.data;
      if(eventsRes.data){state.events=eventsRes.data.reverse();state.pendingDamage=pendingDamageFrom(state.events);state.pendingMapMoves=pendingMapMovesFrom(state.events);state.pendingMapInteractions=pendingMapInteractionsFrom(state.events);state.processed=new Set(state.events.map(ev=>ev.id))}
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
    if(ev.event_type==='damage_applied')showCombatFX({damage:ev.payload?.amount,description:`${ev.payload?.amount||0} de dano em ${ev.payload?.monster||'a criatura'}`});
    if(ev.event_type==='damage_applied')showCombatFX({damage:ev.payload?.amount,description:`${ev.payload?.amount||0} de dano em ${ev.payload?.monster||'a criatura'}`});
    if(ev.event_type==='map_move_request'){if(!state.pendingMapMoves.some(item=>item.id===ev.id))state.pendingMapMoves.push(ev);if(isMasterController())toast(`${ev.payload?.player_name||'Um aventureiro'} solicitou movimento no mapa.`)}
    if(ev.event_type==='session_note'&&ev.payload?.kind==='map'&&ev.payload?.request_id)state.pendingMapMoves=state.pendingMapMoves.filter(item=>item.id!==ev.payload.request_id);
    if(ev.event_type==='map_interaction_request'){if(!state.pendingMapInteractions.some(item=>item.id===ev.id))state.pendingMapInteractions.push(ev);if(isMasterController())toast(`${ev.payload?.player_name||'Um aventureiro'} deseja interagir com um objeto do mapa.`)}
    if(ev.event_type==='session_note'&&ev.payload?.kind==='map-interaction'&&ev.payload?.request_id)state.pendingMapInteractions=state.pendingMapInteractions.filter(item=>item.id!==ev.payload.request_id);
    if(ev.event_type==='map_interaction_result'&&ev.payload?.accepted===false)toast(ev.payload.text||'Interação recusada.','error');
    if(ev.event_type==='dice_prompt'&&ev.payload?.target_user_ids?.includes(currentUserId()))toast(`O mestre solicitou um D20: ${ev.payload.reason||'Realize seu teste.'}`);
    if(ev.event_type==='dice_result')showDice(ev.payload?.result,ev.payload?.player_name||'Aventureiro');
    if(ev.event_type==='combat_action_result'){if(Number.isInteger(ev.payload?.natural))showDice(ev.payload.natural,ev.payload?.player_name||'Aventureiro');showCombatFX(ev.payload);}
    if(ev.event_type==='monster_attack_result'){if(Number.isInteger(ev.payload?.natural))showDice(ev.payload.natural,ev.payload?.monster||'Monstro');showCombatFX({...ev.payload,monsterAction:true});}
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
        const weapon=vitals.equipment?.weapon||character.equipment?.weapon||STARTER_KITS[character.class]?.weapon||STARTER_KITS.Guerreiro.weapon;
        natural=secureDie(20);const modifier=attrMod(character.attributes[rule.attackAttribute]);const gear=equipmentBonuses(vitals.equipment||character.equipment||{});total=natural+2+modifier+gear.attack+(action==='ability'?rule.abilityAttackBonus:0);
        hit=natural===20||(natural!==1&&total>=Number(enc.defense||12));
        if(hit){const weaponDie=Number(weapon.damageDie)||6;damage=rollDamageDie(weaponDie)+modifier+gear.damage+(action==='ability'?rollDamageDie(rule.abilityDie||8):0);if(natural===20)damage+=rollDamageDie(weaponDie);damage=Math.max(1,damage);enc.hp=Math.max(0,Number(enc.hp)-damage)}
        if(action==='ability')abilityUsed=true;
        partyState[ev.actor_id]={...vitals,abilityUsed};
        description=hit?`${character.name} acertou ${enc.name} e causou ${damage} de dano.`:`${character.name} tentou atacar ${enc.name}, mas não conseguiu acertar.`;
      }
    }
    const previousBossPhase=Number(enc.bossPhase)||1;
    const phasedEncounter=applyBossPhase(enc);Object.assign(enc,phasedEncounter);
    const bossPhaseChanged=enc.templateId==='drakthar'&&Number(enc.bossPhase)!==previousBossPhase;
    if(bossPhaseChanged)description+=` ${enc.name} entra em ${enc.bossPhaseName}.`;
    const defeated=Number(enc.hp)<=0;
    const next=defeated?{...enc,defeated:true,turnOrder:[],turnIndex:0}:advanceCombatTurn(enc);
    await updateGameState({encounter:next,partyState});
    await createEvent('combat_action_result',{request_id:ev.id,player_name:character.name,actor_id:ev.actor_id,action,natural,total,hit,damage,healing,description,monster_hp:next.hp,round:next.round,next_turn:activeCombatTurn(next)?.name||'—',boss_phase:next.bossPhase||null,boss_phase_changed:bossPhaseChanged});
    if(bossPhaseChanged)toast(enc.bossPhaseName,'error');
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
    if(enc.templateId==='campeao-orc'&&hit&&natural>=19)damage+=rollDamageDie(8);
    if(enc.templateId==='drakthar'&&natural>=17){const phase=Number(enc.bossPhase)||1;const used=Array.isArray(enc.breathPhases)?enc.breathPhases:[];if(!used.includes(phase)){const dice=phase+1,bonus=phase*2+2;damage=rollDamageDie(8,dice)+bonus;const affected=[];targets.forEach(x=>{const amount=Math.min(x.vitals.hp,damage);partyState[x.member.user_id]={...x.vitals,hp:Math.max(0,x.vitals.hp-damage)};affected.push({name:x.character.name,damage:amount,hp:Math.max(0,x.vitals.hp-damage)})});enc.breathPhases=[...used,phase];enc.specialUsed=true;const next=advanceCombatTurn(enc);await updateGameState({encounter:next,partyState});await createEvent('monster_attack_result',{monster:enc.name,special:enc.specialName,natural,affected,boss_phase:phase,description:`${enc.name} libera ${enc.specialName} na fase ${phase}!`});showDice(natural,enc.name);return}}
    const targetState={...target.vitals,hp:Math.max(0,target.vitals.hp-damage)};let specialText='';
    if(enc.templateId==='espectro-ruptura'&&hit&&natural>=18){targetState.defensePenalty=1;targetState.defensePenaltyUntilRound=(Number(enc.round)||1)+1;specialText=' O toque debilitante reduz a Defesa do alvo em 1 até o fim da próxima rodada.';}
    partyState[target.member.user_id]=targetState;
    const next=advanceCombatTurn(enc);await updateGameState({encounter:next,partyState});
    const abilityText=enc.templateId==='campeao-orc'&&hit&&natural>=19?' Golpe demolidor: dano adicional aplicado.':'';
    await createEvent('monster_attack_result',{monster:enc.name,target:target.character.name,target_user_id:target.member.user_id,natural,total,hit,damage,hp:Math.max(0,target.vitals.hp-damage),description:hit?`${enc.name} atinge ${target.character.name} e causa ${damage} de dano.${abilityText}${specialText}`:`${enc.name} ataca ${target.character.name}, mas erra.`});
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
        if(type==='damage_applied')showCombatFX({damage:payload?.amount,description:`${payload?.amount||0} de dano em ${payload?.monster||'a criatura'}`});
        if(type==='combat_action_result')showCombatFX(payload||{});
        if(type==='monster_attack_result')showCombatFX({...payload,monsterAction:true});
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
    if(ev.event_type==='damage_applied')showCombatFX({damage:ev.payload?.amount,description:`${ev.payload?.amount||0} de dano em ${ev.payload?.monster||'a criatura'}`});
    if(ev.event_type==='combat_action_result')showCombatFX(ev.payload||{});
    if(ev.event_type==='monster_attack_result')showCombatFX({...ev.payload,monsterAction:true});
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
  const QUEST_REWARD_PACKAGES={
    'main-01':{coins:40,items:[{id:'fragmento-profecia',name:'Fragmento da Profecia',kind:'quest',qty:1,description:'Fragmento cristalino ligado ao chamado de Elyndra.'}]},
    'main-02':{coins:30,items:[{id:'reliquia-raiz-viva',name:'Relíquia da Raiz Viva',kind:'quest',qty:1,description:'Relíquia ancestral de Eldoria.'}]},
    'main-03':{coins:60,items:[{id:'chave-mares',name:'Chave das Marés',kind:'quest',qty:1,description:'Chave antiga que reage às correntes de Thalassor.'}]},
    'main-04':{coins:70,items:[{id:'coracao-cristal',name:'Coração de Cristal',kind:'quest',qty:1,description:'Relíquia niveriana de energia concentrada.'}]},
    'main-05':{coins:80,items:[{id:'coroa-eclipse',name:'Coroa do Eclipse',kind:'quest',qty:1,description:'Relíquia solar recuperada em Solária.'}]},
    'main-06':{coins:90,items:[{id:'marca-primeiro-fogo',name:'Marca do Primeiro Fogo',kind:'quest',qty:1,description:'Selo da Forja dos Juramentos.'}]},
    'main-07':{coins:110,items:[{id:'insignia-alianca',name:'Insígnia da Aliança',kind:'quest',qty:1,description:'Símbolo da união dos reinos contra Vharzun.'}]},
    'side-01':{coins:25,items:[{id:'pocao-cura',name:'Poção de Cura',kind:'consumable',qty:1,healDie:8,healBonus:2,description:'Recupera 1d8 + 2 pontos de vida.'}]},
    'side-04':{coins:60,items:[{id:'perola-mare',name:'Pérola de Maré',kind:'quest',qty:1,description:'Pérola encontrada no recife de Thalassor.'}]},
    'side-05':{coins:75,items:[{id:'carvao-braseiro',name:'Carvão de Braseiro',kind:'material',qty:2,description:'Material raro para reparos e forja.'}]},
    'side-06':{coins:90,items:[{id:'mapa-rota-secreta',name:'Mapa de Rota Secreta',kind:'quest',qty:1,description:'Mapa recuperado do navio naufragado.'}]}
  };
  async function grantQuestReward(questId){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode entregar recompensas.');
    const gs=state.campaign.game_state||defaultGameState(),data=narrativeState(gs),quest=data.quests.find(q=>q.id===questId);
    if(!quest||quest.status!=='completed')throw new Error('Conclua a missão antes de entregar a recompensa.');
    if(quest.rewardClaimed)throw new Error('Esta recompensa já foi entregue.');
    const pack=QUEST_REWARD_PACKAGES[questId];if(!pack)throw new Error('Esta missão ainda não possui pacote automático; entregue a recompensa manualmente.');
    const partyState={...(gs.partyState||{})},recipients=state.members.filter(m=>m.role==='player'&&m.character);
    if(!recipients.length)throw new Error('Não há aventureiros com ficha para receber a recompensa.');
    for(const member of recipients){
      const ch=normalizeCharacter(member.character),old=partyState[member.user_id]||{},inventory=Array.isArray(old.inventory)?cloneData(old.inventory):cloneData(ch.inventory);
      for(const item of pack.items||[]){const found=inventory.find(x=>x.id===item.id);if(found)found.qty=(Number(found.qty)||0)+item.qty;else inventory.push(cloneData(item));}
      partyState[member.user_id]={...old,inventory,coins:Math.max(0,Number(old.coins)||0)+(Number(pack.coins)||0)};
    }
    quest.rewardClaimed=true;quest.rewardClaimedAt=new Date().toISOString();
    const note=`Recompensa de ${quest.title} entregue a ${recipients.length} aventureiro(s): ${pack.coins||0} PO${(pack.items||[]).length?' e '+pack.items.map(x=>x.name+' x'+x.qty).join(', '):''}.`;
    data.journalEntries=[...data.journalEntries,{id:crypto.randomUUID?crypto.randomUUID():`journal-${Date.now()}`,text:note,kind:'reward',createdAt:new Date().toISOString()}].slice(-50);
    await updateGameState({quests:data.quests,partyState,journalEntries:data.journalEntries});
    await createEvent('session_note',{kind:'reward',text:note,quest_id:questId});toast('Recompensas adicionadas aos inventários da companhia.');
  }
  function renderQuestPanel(gs){
    const data=narrativeState(gs);const active=data.quests.filter(q=>q.status==='active');const available=data.quests.filter(q=>q.status==='available');const completed=data.quests.filter(q=>q.status==='completed');
    const questCard=q=>{const p=questProgress(q);return `<article class="quest-card"><div class="row between"><span class="tag ${q.type==='Principal'?'gold':'green'}">${esc(q.type)}</span><span class="muted quest-progress-label">${p.done}/${p.total} objetivos</span></div><h4>${esc(q.title)}</h4><p>${esc(q.summary)}</p><div class="quest-progress"><span style="width:${p.percent}%"></span></div><div class="quest-objectives">${q.objectives.map(o=>`<div class="quest-objective ${o.completed?'done':''}"><span>${o.completed?'✓':'○'}</span><span>${esc(o.text)}</span></div>`).join('')}</div>${q.status==='completed'?`<div class="quest-reward">Recompensa: ${esc(q.reward)}</div>${isMaster()&&!q.rewardClaimed&&QUEST_REWARD_PACKAGES[q.id]?`<button class="btn btn-secondary btn-small" data-action="grant-quest-reward" data-quest-id="${q.id}">Entregar recompensa à companhia</button>`:''}${q.rewardClaimed?'<span class="tag green">Recompensa entregue</span>':''}`:''}</article>`};
    return `<section class="panel journey-panel"><div class="row between"><div><div class="small-caps">A jornada dos heróis</div><h3 style="margin:5px 0 0">Missões da companhia</h3></div>${isMaster()?'<button class="btn btn-secondary btn-small" data-action="open-adventure-manager">Gerenciar jornada</button>':''}</div>${active.length?active.map(questCard).join(''):'<div class="empty-state"><strong>Nenhuma missão ativa</strong><p>O mestre poderá apresentar novos objetivos durante a aventura.</p></div>'}${available.length?`<div class="quest-available"><div class="small-caps">Oportunidades</div>${available.map(q=>`<div class="quest-mini"><strong>${esc(q.title)}</strong><small>${esc(q.summary)}</small>${isMaster()?`<button class="btn btn-quiet btn-small" data-action="accept-quest" data-quest-id="${q.id}">Aceitar missão</button>`:'<span class="tag">Aguardando apresentação</span>'}</div>`).join('')}</div>`:''}${completed.length?`<details class="completed-quests"><summary>Missões concluídas (${completed.length})</summary>${completed.map(questCard).join('')}</details>`:''}</section>`;
  }
  function npcPortrait(n){return n.portrait?portraitImage(n.portrait,n.name):`<span class=\"npc-fallback-art\" aria-label=\"${esc(n.name)}\">${esc(n.emoji||'✦')}</span>`}
  function renderRevealedNpcs(gs){
    const data=narrativeState(gs);const visible=STORY_NPCS.filter(n=>data.revealedNpcIds.includes(n.id));
    return `<section class="panel" style="margin-top:15px"><div class="row between"><h3>Personagens encontrados</h3><span class="tag">${visible.length}</span></div>${visible.length?`<div class="npc-list">${visible.map(n=>`<button class="npc-card" data-action="open-npc" data-npc-id="${n.id}"><span class="npc-avatar npc-avatar-art">${npcPortrait(n)}</span><span><strong>${esc(n.name)}</strong><small>${esc(n.role)} · ${esc(n.location)}</small></span><span class="spacer"> </span><span>›</span></button>`).join('')}</div>`:'<p class="panel-subtitle">As pessoas que vocês encontrarem durante a aventura aparecerão aqui.</p>'}</section>`;
  }
  function renderJourneyLog(gs){
    const entries=narrativeState(gs).journalEntries.slice(-4).reverse();
    return `<section class="panel" style="margin-top:15px"><div class="row between"><h3>Crônica registrada</h3><span class="tag">Diário</span></div>${entries.length?entries.map(item=>`<div class="journal-entry"><time>${new Date(item.createdAt||Date.now()).toLocaleDateString('pt-BR')}</time><p>${esc(item.text)}</p></div>`).join(''):'<p class="panel-subtitle">As descobertas e decisões importantes serão registradas neste diário.</p>'}</section>`;
  }
  function renderTacticalMap(gs){
    const exploration=explorationData(gs),record=activeMapRecord(gs),template=mapTemplate(exploration.mapId),tokens=mapTokens(record,gs);
    if(isMaster()&&!tokens.some(t=>t.id===state.selectedMapToken))state.selectedMapToken=tokens.find(t=>t.kind==='player')?.id|| (gs.encounter?'monster':null);
    const selected=state.selectedMapToken||currentUserId(),markers=record.markers||[],cells=[];
    for(let y=0;y<MAP_HEIGHT;y++)for(let x=0;x<MAP_WIDTH;x++){
      const tile=mapTile(template.id,x,y),info=mapTileInfo(tile),visible=mapCellVisible(x,y,record,gs,tokens),cellTokens=tokens.filter(t=>t.position.x===x&&t.position.y===y);
      const marker=markers.find(m=>m.x===x&&m.y===y&&(isMaster()||((m.type==='door'||m.type==='altar')&&visible)||m.discovered));
      const tokenHtml=cellTokens.map(t=>`<span class="map-token miniature ${t.kind==='monster'?'monster-token monster-phase-'+t.bossPhase+(t.defeated?' monster-defeated':''):'player-token mini-'+t.className} ${t.id===selected?'token-selected':''}" title="${esc(t.name)}">${t.kind==='player'?mapHeroSprite(t.className,t.equipment):mapMonsterSprite(t.templateId,t.name)}${t.kind==='monster'?`<span class="map-token-health"><i style="width:${Math.max(0,Math.min(100,t.hp/t.maxHp*100))}%"></i></span>`:''}<span class="miniature-sigil">${esc(t.sigil)}</span>${t.kind==='player'?`<span class="miniature-name">${esc(t.initials)}</span>`:''}</span>`).join('');
      const markerIcon=marker?(marker.type==='treasure'?'🧰':marker.type==='trap'?'⚠️':marker.type==='door'?(marker.open?'🚪':'🔒'):(marker.discovered?'✧':'◇')):'';
      const markerHtml=marker?`<span class="map-marker marker-${marker.type} ${marker.open?'marker-open':''}" title="${esc(marker.type==='treasure'?'Baú':marker.type==='trap'?'Armadilha':marker.type==='door'?(marker.open?'Porta aberta':'Porta fechada'):'Altar antigo')}">${markerIcon}</span>`:'';
      const fogged=!visible,doorBlocked=marker?.type==='door'&&!marker.open,blocked=mapCellBlocked(template.id,x,y,record);
      cells.push(`<button class="map-cell tile-${info.cls} ${fogged?'fogged':''} ${cellTokens.some(t=>t.id===selected)?'token-selected':''} ${blocked?'blocked':''} ${doorBlocked?'door-closed':''} ${marker?.type==='altar'?'altar-cell':''}" data-action="map-cell" data-x="${x}" data-y="${y}" ${fogged&&!isMaster()?'disabled':''} aria-label="Casa ${x+1}, linha ${y+1}: ${fogged?'não explorada':marker?.type==='door'?(marker.open?'porta aberta':'porta fechada'):marker?.type==='altar'?'altar':info.name}">${fogged?'?':`${info.glyph?`<span class="terrain-glyph">${info.glyph}</span>`:''}${markerHtml}${tokenHtml}`}</button>`);
    }
    const options=tokens.map(t=>`<option value="${esc(t.id)}" ${selected===t.id?'selected':''}>${esc(t.name)}${t.kind==='monster'?' · Monstro':' · Aventureiro'}</option>`).join('');
    const presets=MAP_TEMPLATES.map(m=>`<button class="map-preset ${m.id===template.id?'active':''}" data-action="map-change" data-map-id="${m.id}" ${isMaster()?'':'disabled'}>${m.name}</button>`).join('');
    const tools=isMaster()?`<div class="map-admin-tools"><label class="map-tool-select">Peça selecionada<select class="select" id="map-token-select">${options||'<option value="">Sem peças</option>'}</select></label><div class="map-tool-buttons"><button class="btn ${state.selectedMapTool==='move'?'btn-primary':'btn-secondary'} btn-small" data-action="map-tool" data-tool="move">Mover peça</button><button class="btn ${state.selectedMapTool==='reveal'?'btn-primary':'btn-secondary'} btn-small" data-action="map-tool" data-tool="reveal">Revelar área</button><button class="btn ${state.selectedMapTool==='treasure'?'btn-primary':'btn-secondary'} btn-small" data-action="map-tool" data-tool="treasure">Colocar baú</button><button class="btn ${state.selectedMapTool==='trap'?'btn-primary':'btn-secondary'} btn-small" data-action="map-tool" data-tool="trap">Colocar armadilha</button><button class="btn ${state.selectedMapTool==='door'?'btn-primary':'btn-secondary'} btn-small" data-action="map-tool" data-tool="door">Porta</button><button class="btn ${state.selectedMapTool==='altar'?'btn-primary':'btn-secondary'} btn-small" data-action="map-tool" data-tool="altar">Altar</button><button class="btn ${state.selectedMapTool==='erase'?'btn-primary':'btn-secondary'} btn-small" data-action="map-tool" data-tool="erase">Remover objeto</button><button class="btn btn-quiet btn-small" data-action="toggle-map-fog">${record.fogEnabled?'Desativar névoa':'Ativar névoa'}</button></div><p class="map-tool-hint">Selecione uma ferramenta e clique em uma casa livre. Com Porta, clique novamente para abrir/fechar a porta. Altar pode ser examinado pelos jogadores ao se aproximarem.</p></div>`:`<div class="notice map-player-help">Clique em uma casa explorada para mover seu personagem. Portas fechadas e altares podem ser examinados ao se aproximar; o mestre valida as interações. ${record.fogEnabled?'As áreas ainda não descobertas permanecem ocultas.':'O mapa está totalmente visível.'}</div>`;
    const pendingMoves=isMaster()&&state.pendingMapMoves.length?`<div class="map-pending"><div class="small-caps">Solicitações de movimento</div>${state.pendingMapMoves.slice(-5).map(ev=>{const who=state.members.find(m=>m.user_id===ev.actor_id);return `<div class="map-request-row"><span><strong>${esc(who?.character?.name||who?.display_name||'Aventureiro')}</strong><small>Casa ${Number(ev.payload?.x)+1}, linha ${Number(ev.payload?.y)+1}</small></span><span class="map-request-actions"><button class="btn btn-primary btn-small" data-action="approve-map-move" data-id="${ev.id}">Aprovar</button><button class="btn btn-quiet btn-small" data-action="reject-map-move" data-id="${ev.id}">Recusar</button></span></div>`}).join('')}</div>`:'';
    const pendingInteractions=isMaster()&&state.pendingMapInteractions.length?`<div class="map-pending"><div class="small-caps">Interações aguardando aprovação</div>${state.pendingMapInteractions.slice(-5).map(ev=>{const who=state.members.find(m=>m.user_id===ev.actor_id);return `<div class="map-request-row"><span><strong>${esc(who?.character?.name||who?.display_name||'Aventureiro')}</strong><small>${ev.payload?.action==='open_door'?'Deseja abrir uma porta':'Deseja examinar um altar'}</small></span><span class="map-request-actions"><button class="btn btn-primary btn-small" data-action="approve-map-interaction" data-id="${ev.id}">Aprovar</button><button class="btn btn-quiet btn-small" data-action="reject-map-interaction" data-id="${ev.id}">Recusar</button></span></div>`}).join('')}</div>`:'';
    return `<section class="panel tactical-map-panel"><div class="row between"><div><div class="small-caps">Exploração compartilhada</div><h3 style="margin:5px 0 0">Mapa tático</h3><p class="panel-subtitle" style="margin:5px 0 0">${esc(template.subtitle)} · ${MAP_WIDTH} × ${MAP_HEIGHT} casas</p></div><span class="tag gold">${tokens.length} peça(s)</span></div><div class="map-presets">${presets}</div>${tools}<div class="map-board-wrap"><div class="map-board map-${template.theme} ${gs.encounter&&!gs.encounter.defeated?'battle-active':''}" style="--map-cols:${MAP_WIDTH}">${cells.join('')}</div><div class="map-axis map-axis-bottom">${Array.from({length:MAP_WIDTH},(_,i)=>`<span>${i+1}</span>`).join('')}</div></div><div class="map-legend"><span><i class="legend-token">⚔</i> Aventureiro</span><span><i class="legend-token">🐉</i> Criatura</span><span>🌳 Obstáculo</span><span>💧 Água</span><span>🔒 Porta fechada</span><span>✧ Altar</span><span>🧰 Baú</span><span>⚠️ Armadilha</span></div>${pendingMoves}${pendingInteractions}<p class="map-footnote">Movimento: até 4 casas por turno em combate. Obstáculos, portas fechadas e outras peças bloqueiam o caminho. O mestre valida os pedidos dos jogadores.</p></section>`;
  }
  function mapCellOccupied(record,gs,x,y,exceptId){return mapTokens(record,gs).some(t=>t.id!==exceptId&&t.position.x===x&&t.position.y===y)}
  function mapVisibleReveal(record,x,y){addRevealedAround(record,x,y,1)}
  async function requestMapMove(x,y){
    if(!state.backendReady)throw new Error('Para solicitar movimento de outro jogador, conecte esta campanha ao Supabase. No modo local, apenas o mestre controla o mapa.');
    const gs=state.campaign.game_state||defaultGameState(),ex=explorationData(gs),rec=activeMapRecord(gs),tile=mapTile(ex.mapId,x,y);
    if(!mapCellVisible(x,y,rec,gs))throw new Error('Esta casa ainda não foi explorada.');
    if(mapCellBlocked(ex.mapId,x,y,rec))throw new Error('Há um obstáculo ou uma porta fechada nesta casa.');
    if(mapTokenPosition(currentUserId(),rec,ex.mapId).x===x&&mapTokenPosition(currentUserId(),rec,ex.mapId).y===y)throw new Error('Seu personagem já está nesta casa.');
    if(mapCellOccupied(rec,gs,x,y,currentUserId()))throw new Error('Outra peça já ocupa esta casa.');
    if(gs.encounter){const turn=activeCombatTurn(gs.encounter);if(turn?.kind!=='player'||turn.user_id!==currentUserId())throw new Error('Durante o combate, você só pode solicitar movimento no seu turno.');}
    const {data,error}=await state.backend.rpc('request_map_move',{p_campaign_id:state.campaign.id,p_map_id:ex.mapId,p_x:x,p_y:y});if(error)throw error;
    if(data?.id&&!state.processed.has(data.id)){state.processed.add(data.id);state.events.push(data);if(!state.pendingMapMoves.some(item=>item.id===data.id))state.pendingMapMoves.push(data);render()}
    toast('Pedido de movimento enviado ao mestre.');
  }
  async function moveMapToken(tokenId,x,y,requestId=null,requestMapId=null){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode validar movimentos.');
    if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>=MAP_WIDTH||y>=MAP_HEIGHT)throw new Error('Casa do mapa inválida.');
    const gs=state.campaign.game_state||defaultGameState(),ex=explorationData(gs),rec=activeMapRecord(gs),tile=mapTile(ex.mapId,x,y),info=mapTileInfo(tile);
    if(requestMapId&&requestMapId!==ex.mapId)throw new Error('O mapa mudou antes da aprovação. Solicite novamente no mapa atual.');
    if(mapCellBlocked(ex.mapId,x,y,rec))throw new Error('Não é possível mover uma peça para um obstáculo ou porta fechada.');
    if(mapCellOccupied(rec,gs,x,y,tokenId))throw new Error('Outra peça já ocupa esta casa.');
    const start=mapTokenPosition(tokenId,rec,ex.mapId),occupied=mapTokens(rec,gs).filter(t=>t.id!==tokenId).map(t=>t.position),distance=mapPathDistance(ex.mapId,start,{x,y},occupied,rec);
    if(!Number.isFinite(distance))throw new Error('Não existe um caminho livre até essa casa.');
    if(distance===0)throw new Error('A peça já está nesta casa.');
    let encounter=gs.encounter?cloneData(gs.encounter):null;
    if(encounter&&!encounter.defeated){
      const turn=activeCombatTurn(encounter);
      if(tokenId==='monster'?(turn?.kind!=='monster'):(turn?.kind!=='player'||turn.user_id!==tokenId))throw new Error('Durante o combate, só a peça cujo turno está ativo pode se deslocar.');
      const usedKey=`${encounter.round||1}:${tokenId}`,used=Number(encounter.movementUsed?.[usedKey]||0),remaining=Math.max(0,4-used);
      if(distance>remaining)throw new Error(`Movimento excede o limite. Restam ${remaining} casa(s) neste turno.`);
      encounter.movementUsed={...(encounter.movementUsed||{}),[usedKey]:used+distance};
    } else if(distance>4)throw new Error('O deslocamento máximo por solicitação é de 4 casas.');
    const tokens={...rec.tokens,[tokenId]:{x,y}},nextRecord={...rec,tokens};mapVisibleReveal(nextRecord,x,y);
    const partyState={...(gs.partyState||{})};let markerText='';
    if(tokenId!=='monster'){
      const marker=nextRecord.markers.find(m=>m.x===x&&m.y===y&&!m.discovered&&!['door','altar'].includes(m.type));
      if(marker){marker.discovered=true;marker.triggeredBy=tokenId;const member=state.members.find(m=>m.user_id===tokenId);const character=member?.character?normalizeCharacter(member.character):null;
        if(marker.type==='treasure'){
          if(character){const vitals=currentPartyVitals(tokenId,character);partyState[tokenId]={...vitals,coins:vitals.coins+Number(marker.gold||15)};markerText=`${character.name} encontrou um baú e recebeu ${Number(marker.gold||15)} moedas de ouro.`;}
          else markerText='A companhia encontrou um baú de moedas.';
        } else if(marker.type==='trap'){
          if(character){const vitals=currentPartyVitals(tokenId,character),damage=Math.min(vitals.hp,Number(marker.damage||5));partyState[tokenId]={...vitals,hp:Math.max(0,vitals.hp-damage)};markerText=`${character.name} acionou uma armadilha e sofreu ${damage} de dano.`;}
          else markerText='Uma armadilha foi acionada.';
        }
      }
    }
    const exploration=setActiveMapRecord(ex,nextRecord);
    const patch={exploration};if(encounter)patch.encounter=encounter;if(Object.keys(partyState).length)patch.partyState=partyState;
    await updateGameState(patch);
    const member=state.members.find(m=>m.user_id===tokenId),name=tokenId==='monster'?(gs.encounter?.name||'Criatura'):(member?.character?.name||member?.display_name||'Aventureiro');
    const movementText=`${name} se deslocou para a casa ${x+1}, linha ${y+1}.`;
    const fullText=markerText?`${movementText} ${markerText}`:movementText;
    await createEvent('session_note',{kind:'map',request_id:requestId||undefined,accepted:true,text:fullText});
    if(markerText){const data=narrativeState({...gs,exploration});const entries=[...data.journalEntries,{id:crypto.randomUUID?crypto.randomUUID():`journal-${Date.now()}`,text:markerText,kind:'discovery',createdAt:new Date().toISOString()}].slice(-50);await updateGameState({journalEntries:entries});}
    toast(markerText||movementText);
  }
  async function requestMapInteraction(action,marker){
    if(!state.backendReady)throw new Error('Interações compartilhadas exigem uma campanha conectada ao Supabase.');
    if(!['open_door','inspect_altar'].includes(action))throw new Error('Interação não reconhecida.');
    const gs=state.campaign.game_state||defaultGameState(),ex=explorationData(gs),rec=activeMapRecord(gs);
    const {data,error}=await state.backend.rpc('request_map_interaction',{p_campaign_id:state.campaign.id,p_map_id:ex.mapId,p_marker_id:marker.id,p_action:action});if(error)throw error;
    if(data?.id&&!state.processed.has(data.id)){state.processed.add(data.id);state.events.push(data);if(!state.pendingMapInteractions.some(item=>item.id===data.id))state.pendingMapInteractions.push(data);render()}
    toast('Pedido de interação enviado ao mestre.');
  }
  async function resolveMapInteraction(ev,accepted){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode validar interações do mapa.');
    const gs=state.campaign.game_state||defaultGameState(),ex=explorationData(gs),rec=activeMapRecord(gs),marker=rec.markers.find(m=>m.id===ev.payload?.marker_id);
    const player=mapTokenPosition(ev.actor_id,rec,ex.mapId),dx=Math.abs(player.x-(marker?.x??99)),dy=Math.abs(player.y-(marker?.y??99));
    if(!marker||!Number.isFinite(dx)||Math.max(dx,dy)>1)accepted=false;
    let text='';
    if(accepted&&ev.payload.action==='open_door'&&marker.type==='door'&&!marker.open){marker.open=true;text=`${ev.payload.player_name||'Um aventureiro'} abriu uma porta antiga.`}
    else if(accepted&&ev.payload.action==='inspect_altar'&&marker.type==='altar'&&!marker.discovered){marker.discovered=true;addRevealedAround(rec,marker.x,marker.y,2);text=`${ev.payload.player_name||'Um aventureiro'} examinou um altar antigo. Runas dos Cinco Reinos começaram a brilhar.`}
    else accepted=false;
    if(!accepted)text='O mestre recusou a interação ou ela não pode mais ser realizada.';
    if(accepted){const data=narrativeState(gs);data.journalEntries=[...data.journalEntries,{id:crypto.randomUUID?crypto.randomUUID():`journal-${Date.now()}`,text,kind:'discovery',createdAt:new Date().toISOString()}].slice(-50);await updateGameState({exploration:setActiveMapRecord(ex,rec),journalEntries:data.journalEntries});}
    await createEvent('session_note',{kind:'map-interaction',request_id:ev.id,accepted,text});
    state.pendingMapInteractions=state.pendingMapInteractions.filter(item=>item.id!==ev.id);render();toast(text,accepted?'ok':'error');
  }
  async function handleMapCellClick(btn){
    const x=Number(btn.dataset.x),y=Number(btn.dataset.y);if(!Number.isInteger(x)||!Number.isInteger(y))return;
    const gs=state.campaign.game_state||defaultGameState(),ex=explorationData(gs),rec=activeMapRecord(gs),tool=state.selectedMapTool||'move';
    if(!isMaster()){
      const targetMarker=rec.markers.find(m=>m.x===x&&m.y===y&&((m.type==='door'&&!m.open)||(m.type==='altar'&&!m.discovered)));
      if(targetMarker?.type==='door')return requestMapInteraction('open_door',targetMarker);
      if(targetMarker?.type==='altar')return requestMapInteraction('inspect_altar',targetMarker);
      return requestMapMove(x,y);
    }
    if(tool==='move'){if(!state.selectedMapToken)throw new Error('Selecione uma peça antes de movê-la.');return moveMapToken(state.selectedMapToken,x,y)}
    if(tool==='reveal'){mapVisibleReveal(rec,x,y);await updateGameState({exploration:setActiveMapRecord(ex,rec)});await createEvent('session_note',{kind:'map',text:`O mestre revelou uma área do mapa de ${mapTemplate(ex.mapId).name}.`});toast('Área revelada aos aventureiros.');return}
    if(tool==='door'){
      const existingDoor=rec.markers.find(m=>m.x===x&&m.y===y&&m.type==='door');
      if(existingDoor){existingDoor.open=!existingDoor.open;await updateGameState({exploration:setActiveMapRecord(ex,rec)});render();toast(existingDoor.open?'Porta aberta.':'Porta fechada.');return;}
    }
    if(['treasure','trap','door','altar'].includes(tool)){
      if(mapTileInfo(mapTile(ex.mapId,x,y)).blocked)throw new Error('Coloque o objeto em uma casa livre.');
      if(rec.markers.some(m=>m.x===x&&m.y===y))throw new Error('Já existe um objeto nesta casa.');
      if(mapCellOccupied(rec,gs,x,y,null))throw new Error('Não coloque objetos embaixo de uma peça.');
      const marker={id:crypto.randomUUID?crypto.randomUUID():`marker-${Date.now()}`,type:tool,x,y,discovered:false,gold:15,damage:5,open:false};rec.markers.push(marker);await updateGameState({exploration:setActiveMapRecord(ex,rec)});toast(({treasure:'Baú secreto colocado.',trap:'Armadilha escondida colocada.',door:'Porta fechada colocada.',altar:'Altar antigo colocado.'})[tool]);render();return;
    }
    if(tool==='erase'){
      const index=rec.markers.findIndex(m=>m.x===x&&m.y===y);if(index<0)throw new Error('Não há objeto nesta casa.');rec.markers.splice(index,1);await updateGameState({exploration:setActiveMapRecord(ex,rec)});render();toast('Objeto removido do mapa.');return;
    }
  }
  async function appendJournalEntry(text,kind='story'){
    const gs=state.campaign.game_state||defaultGameState();const data=narrativeState(gs);const entries=[...data.journalEntries,{id:crypto.randomUUID?crypto.randomUUID():`journal-${Date.now()}`,text:String(text||'').slice(0,600),kind,createdAt:new Date().toISOString()}].slice(-50);
    await updateGameState({journalEntries:entries});
  }
  async function completeQuestObjective(questId,objectiveId,source='manual'){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode atualizar as missões.');
    const gs=state.campaign.game_state||defaultGameState();const data=narrativeState(gs);const result=markObjective(data.quests,questId,objectiveId);if(!result.changed)return;
    const message=`Objetivo concluído: ${result.objectiveText}`+(result.completed?` · Missão concluída: ${result.questTitle}.`:'');
    const entries=[...data.journalEntries,{id:crypto.randomUUID?crypto.randomUUID():`journal-${Date.now()}`,text:message,kind:'quest',createdAt:new Date().toISOString()}].slice(-50);
    await updateGameState({quests:result.quests,journalEntries:entries});
    await createEvent('session_note',{kind:'quest',text:message,source});
    if(result.completed)toast(`Missão concluída: ${result.questTitle}!`);else toast('Progresso da missão atualizado.');
  }
  function renderNPCModal(npcId){
    const npc=STORY_NPCS.find(n=>n.id===npcId);if(!npc||!narrativeState().revealedNpcIds.includes(npcId))throw new Error('Este personagem ainda não foi encontrado.');
    const gs=state.campaign.game_state||defaultGameState(),choices=DIALOGUE_CHOICES[npcId]||[],saved=gs.dialogueChoices?.[npcId]||[];
    const choiceHtml=choices.map(c=>saved.includes(c.id)?`<div class="notice"><strong>Decisão registrada:</strong> ${esc(c.label)}<p>${esc(c.reply)}</p></div>`:saved.length?`<div class="notice"><strong>Outra decisão já foi tomada:</strong> ${esc(c.label)}</div>`:isMaster()&&isMasterController()?`<button class="objective-control" data-action="dialogue-choice" data-npc-id="${npcId}" data-choice-id="${c.id}"><span>✦</span>${esc(c.label)}</button>`:`<div class="notice">${esc(c.label)} <small>O mestre registra esta decisão.</small></div>`).join('');
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="page-kicker">Encontro em Aethra</div><h2>${esc(npc.name)}</h2><p>${esc(npc.role)} · ${esc(npc.location)}</p></div><button class="modal-close" data-action="close-modal">×</button></div><div class="npc-modal-portrait">${npcPortrait(npc)}</div><p class="npc-description">${esc(npc.description)}</p><blockquote class="npc-quote">“${esc(npc.greeting)}”</blockquote>${choices.length?`<div class="divider"></div><h3>O que deseja conversar?</h3><p class="panel-subtitle">As decisões ficam salvas na crônica e podem revelar pistas para a companhia.</p><div class="member-list">${choiceHtml}</div>`:''}<div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Fechar</button></div></section></div>`;
  }
  function renderShopModal(){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode conduzir o comércio.');
    const players=state.members.filter(m=>m.role==='player'&&m.character);if(!players.length)throw new Error('Nenhum jogador possui personagem para comprar itens.');
    const target=players.find(m=>m.user_id===state.shopTargetId)||players[0],v=currentPartyVitals(target.user_id,target.character);
    state.shopTargetId=target.user_id;
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal wide" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="page-kicker">Mercado de Aethra</div><h2>Comércio da companhia</h2><p>O mestre registra compras e vendas no estado compartilhado da campanha.</p></div><button class="modal-close" data-action="close-modal">×</button></div><div class="field"><label for="shop-customer">AVENTUREIRO</label><select class="select" id="shop-customer">${players.map(m=>`<option value="${esc(m.user_id)}" ${m.user_id===target.user_id?'selected':''}>${esc(m.character.name)} — ${esc(m.display_name||'Jogador')}</option>`).join('')}</select></div><div class="stat-grid"><div class="stat-card"><small>Ouro disponível</small><strong>${v.coins} PO</strong></div><div class="stat-card"><small>Itens na mochila</small><strong>${v.inventory.reduce((n,x)=>n+(Number(x.qty)||0),0)}</strong></div></div><h3>Mercadorias</h3><div class="member-list">${SHOP_ITEMS.map(item=>`<div class="member-row"><div class="avatar">${item.kind==='consumable'?'🧪':item.kind==='equipment'?'⚔':'🎒'}</div><div><strong>${esc(item.name)}</strong><small>${esc(item.description)}${item.rarity&&item.rarity!=='Comum'?' · '+esc(item.rarity):''}${item.requiredLevel?' · Nível '+item.requiredLevel+'+':''}${item.requiredClasses?' · '+esc(item.requiredClasses.join('/')):''}</small></div><span class="spacer"></span><span class="tag gold">${item.price} PO</span><button class="btn btn-primary btn-small" data-action="shop-buy" data-item-id="${item.id}">Comprar</button></div>`).join('')}</div><div class="divider"></div><h3>Equipamento do aventureiro</h3><div class="member-list">${(v.equipment||{}).weapon?`<div class="member-row"><strong>Arma: ${esc(v.equipment.weapon.name)}</strong><span class="spacer"></span><span class="tag">1d${v.equipment.weapon.damageDie||6}</span><button class="btn btn-secondary btn-small" data-action="unequip-item" data-slot="weapon">Retirar</button></div>`:''}${(v.equipment||{}).armor?`<div class="member-row"><strong>Armadura: ${esc(v.equipment.armor.name)}</strong><span class="spacer"></span><span class="tag">+${v.equipment.armor.defense||0} DEF</span><button class="btn btn-secondary btn-small" data-action="unequip-item" data-slot="armor">Retirar</button></div>`:''}${(v.equipment||{}).shield?`<div class="member-row"><strong>Escudo: ${esc(v.equipment.shield.name)}</strong><span class="spacer"></span><span class="tag">+${v.equipment.shield.defense||0} DEF</span><button class="btn btn-secondary btn-small" data-action="unequip-item" data-slot="shield">Retirar</button></div>`:''}${v.inventory.filter(i=>i.kind==='equipment'&&Number(i.qty)>0).map(i=>`<div class="member-row"><div><strong>${esc(i.name)}</strong><small>${i.slot==='weapon'?`Dano 1d${i.damageDie||6}`:`+${i.defense||0} Defesa`}</small></div><span class="spacer"></span><span class="tag">x${i.qty}</span><button class="btn btn-primary btn-small" data-action="equip-item" data-item-id="${esc(i.id)}">Equipar</button></div>`).join('')||'<p class="panel-subtitle">Nenhum equipamento adicional na mochila.</p>'}</div><div class="divider"></div><h3>Vender itens comuns</h3><div class="member-list">${v.inventory.filter(i=>i.kind!=='quest'&&i.kind!=='equipment'&&Number(i.qty)>0).map(i=>`<div class="member-row"><div><strong>${esc(i.name)}</strong><small>Quantidade: ${Number(i.qty)||0}</small></div><span class="spacer"></span><span class="tag">${Math.max(1,Math.floor((Number(i.price)||10)*.5))} PO/un.</span><button class="btn btn-secondary btn-small" data-action="shop-sell" data-item-id="${esc(i.id)}">Vender 1</button></div>`).join('')||'<p class="panel-subtitle">Nenhum item comum disponível para venda.</p>'}</div><div class="notice">Itens de missão e equipamentos não podem ser vendidos nesta versão. O comércio é registrado pelo mestre para evitar alterações conflitantes entre jogadores.</div></section></div>`;
    $('#shop-customer',modalRoot)?.addEventListener('change',e=>{state.shopTargetId=e.target.value;renderShopModal()});
  }
  async function transactShop(itemId,mode){
    if(state.shopBusy)return;
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode confirmar transações.');
    state.shopBusy=true;
    try{
      const member=state.members.find(m=>m.user_id===state.shopTargetId&&m.role==='player'&&m.character);if(!member)throw new Error('Escolha um aventureiro válido.');
      const gs=state.campaign.game_state||defaultGameState(),partyState={...(gs.partyState||{})},old=partyState[member.user_id]||{},ch=normalizeCharacter(member.character);
      const inventory=Array.isArray(old.inventory)?cloneData(old.inventory):cloneData(ch.inventory),coins=Math.max(0,Number(old.coins)||0);let nextCoins=coins,description='';
      if(mode==='buy'){
        const item=SHOP_ITEMS.find(x=>x.id===itemId);if(!item)throw new Error('Mercadoria não encontrada.');if(coins<item.price)throw new Error('O aventureiro não possui ouro suficiente.');nextCoins-=item.price;const found=inventory.find(x=>x.id===item.id);if(found)found.qty=(Number(found.qty)||0)+1;else inventory.push({...cloneData(item),qty:1,price:item.price});description=`${member.character.name} comprou ${item.name} por ${item.price} PO.`;
      }else{
        const found=inventory.find(x=>x.id===itemId);if(!found||Number(found.qty)<=0||found.kind==='quest'||found.kind==='equipment')throw new Error('Este item não pode ser vendido.');const value=Math.max(1,Math.floor((Number(found.price)||10)*.5));found.qty-=1;nextCoins+=value;description=`${member.character.name} vendeu 1 ${found.name} por ${value} PO.`;
      }
      partyState[member.user_id]={...old,inventory,coins:nextCoins};const journalEntries=[...(gs.journalEntries||[]),{id:crypto.randomUUID?crypto.randomUUID():`journal-${Date.now()}`,text:description,kind:'trade',createdAt:new Date().toISOString()}].slice(-50);
      await updateGameState({partyState,journalEntries});await createEvent('session_note',{kind:'trade',text:description});toast('Transação registrada na campanha.');
    }finally{state.shopBusy=false;}
    renderShopModal();
  }

  async function changeEquipment(itemId,slot,remove=false){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode alterar equipamentos.');
    const member=state.members.find(m=>m.user_id===state.shopTargetId)||state.members.find(m=>m.user_id===currentUserId());
    const targetId=member?.user_id||currentUserId();const character=member?.character||state.member?.character;if(!character)throw new Error('Personagem não encontrado.');
    const gs=state.campaign.game_state||defaultGameState(),partyState={...(gs.partyState||{})},old=partyState[targetId]||{},inventory=cloneData(Array.isArray(old.inventory)?old.inventory:normalizeCharacter(character).inventory),equipment=cloneData(old.equipment||normalizeCharacter(character).equipment||{});let note='';
    if(remove){if(!['weapon','armor','shield'].includes(slot)||!equipment[slot])throw new Error('Espaço de equipamento inválido.');const prior=equipment[slot];const found=inventory.find(x=>x.id===prior.id);if(found)found.qty=(Number(found.qty)||0)+1;else inventory.push({...prior,qty:1,kind:'equipment',slot});equipment[slot]=null;note=`${character.name} retirou ${prior.name}.`}
    else{const item=inventory.find(x=>x.id===itemId&&x.kind==='equipment'&&Number(x.qty)>0);if(!item||!['weapon','armor','shield'].includes(item.slot))throw new Error('Item não equipável.');const requirement=equipmentRequirementError(item,normalizeCharacter(character));if(requirement)throw new Error(requirement);const targetSlot=item.slot;if(equipment[targetSlot]){const prior=equipment[targetSlot],existing=inventory.find(x=>x.id===prior.id);if(existing)existing.qty=(Number(existing.qty)||0)+1;else inventory.push({...prior,qty:1,kind:'equipment',slot:targetSlot});}equipment[targetSlot]={...item};item.qty-=1;note=`${character.name} equipou ${item.name}.`;}
    const baseDefense=10+attrMod(normalizeCharacter(character).attributes.destreza)+equipmentBonuses(equipment).defense;partyState[targetId]={...old,inventory,equipment,baseDefense,defense:baseDefense};const journalEntries=[...(gs.journalEntries||[]),{id:crypto.randomUUID?crypto.randomUUID():`journal-${Date.now()}`,text:note,kind:'equipment',createdAt:new Date().toISOString()}].slice(-50);await updateGameState({partyState,journalEntries});await createEvent('session_note',{kind:'equipment',text:note});renderShopModal();toast('Equipamento atualizado.');
  }

  function renderAdventureManagerModal(){
    const gs=state.campaign.game_state||defaultGameState();const data=narrativeState(gs);const known=new Set(data.revealedNpcIds);
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal wide adventure-manager" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="page-kicker">Ferramentas narrativas</div><h2>Gerenciar a jornada</h2><p>Altere a cena atual, acompanhe objetivos, apresente NPCs e registre decisões. O que for publicado será visível aos jogadores.</p></div><button class="modal-close" data-action="close-modal">×</button></div>
      <h3>1. Cena e narração</h3><form id="scene-form"><div class="field"><label for="scene-template">CENA PREPARADA</label><select class="select" id="scene-template"><option value="">Manter cena atual / personalizada</option>${STORY_SCENES.map(scene=>`<option value="${scene.id}">${esc(scene.title)}</option>`).join('')}</select><span class="hint">Escolher uma cena preenche capítulo, local e uma sugestão de narração. Você pode editar o texto antes de publicar.</span></div><div class="field"><label for="scene-chapter">CAPÍTULO</label><input class="input" id="scene-chapter" maxlength=100 value="${esc(gs.chapter||'')}"></div><div class="field"><label for="scene-location">LOCAL ATUAL</label><input class="input" id="scene-location" maxlength=100 value="${esc(gs.location||'')}"></div><div class="field"><label for="scene-narration">NARRAÇÃO VISÍVEL AO GRUPO</label><textarea class="textarea" id="scene-narration" maxlength=1800 required>${esc(gs.narration||'')}</textarea></div><button class="btn btn-primary btn-small" type="submit">Publicar cena para todos</button></form>
      <div class="divider"></div><h3>2. Missões e objetivos</h3>${data.quests.map(q=>{const progress=questProgress(q);return `<article class="quest-manage-card"><div class="row between"><div><strong>${esc(q.title)}</strong><small>${esc(q.type)} · ${esc(q.status==='active'?'Em andamento':q.status==='completed'?'Concluída':'Disponível')}</small></div><span class="tag">${progress.done}/${progress.total}</span></div><p>${esc(q.summary)}</p>${q.status==='available'?`<button class="btn btn-secondary btn-small" data-action="accept-quest" data-quest-id="${q.id}">Apresentar e aceitar missão</button>`:q.objectives.map(o=>`<button class="objective-control ${o.completed?'done':''}" data-action="complete-quest-objective" data-quest-id="${q.id}" data-objective-id="${o.id}" ${o.completed||q.status==='completed'?'disabled':''}><span>${o.completed?'✓':'○'}</span>${esc(o.text)}${o.completed?' · concluído':' · marcar conclusão'}</button>`).join('')}<small class="quest-reward">Recompensa prevista: ${esc(q.reward)}</small></article>`}).join('')}
      <div class="divider"></div><h3>3. Personagens não jogáveis</h3><p class="panel-subtitle">Revele um NPC quando o grupo o encontrar. Os jogadores verão sua descrição e frase de apresentação.</p><div class="npc-reveal-grid">${STORY_NPCS.map(n=>`<div class="npc-reveal"><span class="npc-avatar npc-avatar-art">${npcPortrait(n)}</span><div><strong>${esc(n.name)}</strong><small>${esc(n.role)}</small></div>${known.has(n.id)?'<span class="tag green">Revelado</span>':`<button class="btn btn-secondary btn-small" data-action="reveal-npc" data-npc-id="${n.id}">Revelar</button>`}</div>`).join('')}</div>
      <div class="divider"></div><h3>4. Diário da campanha</h3><form id="journal-form"><div class="field"><label for="journal-text">REGISTRAR DESCOBERTA OU DECISÃO</label><textarea class="textarea" id="journal-text" maxlength=600 required placeholder="Ex.: O grupo decidiu seguir os rastros até a torre..."></textarea></div><button class="btn btn-secondary btn-small" type="submit">Adicionar ao diário</button></form>
      <div class="notice" style="margin-top:16px"><strong>Privacidade:</strong> as informações desta tela são públicas para os participantes quando salvas no estado da campanha. Não escreva aqui segredos que devam ser conhecidos apenas pelo mestre. Um módulo de notas privadas será desenvolvido separadamente.</div></section></div>`;
    const sceneSelect=$('#scene-template',modalRoot);sceneSelect?.addEventListener('change',()=>{const scene=STORY_SCENES.find(x=>x.id===sceneSelect.value);if(!scene)return;$('#scene-chapter',modalRoot).value=scene.chapter;$('#scene-location',modalRoot).value=scene.location;$('#scene-narration',modalRoot).value=scene.narration;});
  }
  function renderLobby(){
    if(!state.campaign){state.view='home';renderHome();return}
    const c=state.campaign,gs=c.game_state||defaultGameState(),mine=state.member,hasChar=!!mine?.character;
    app.innerHTML=`<div class="page-header"><div><div class="page-kicker">Salão dos aventureiros</div><h1 class="page-title">${esc(c.name)}</h1><p>${esc(c.description||'Uma nova crônica começa aqui.')} · ${c.status==='active'?'Sessão em andamento':'Aguardando o início da sessão'} · Mestre ${masterIsOnline()?'online':'offline'}</p></div><div class="row"><button class="btn btn-quiet" data-action="go-home">Início</button>${isMaster()?`<button class="btn btn-primary" data-action="start-session">${c.status==='active'?'Retomar sessão':'Iniciar sessão'} →</button>`:''}</div></div>
      <div class="campaign-layout"><div class="panel"><div class="row between"><div><div class="small-caps">Código de convite</div><div class="campaign-code" style="margin-top:8px">${esc(c.code)} <button class="icon-button" style="width:27px;height:27px;font-size:12px" data-action="copy-code" title="Copiar código">▣</button><button class="icon-button" style="width:27px;height:27px;font-size:12px" data-action="copy-invite" title="Copiar link de convite">↗</button></div></div><span class="tag ${c.status==='active'?'green':'gold'}">${c.status==='active'?'● Sessão ativa':'◷ Preparação'}</span></div><div class="divider"></div><div class="row between"><h3>Companheiros de jornada</h3><span class="muted" style="font-size:9px">${state.members.length} participante(s)</span></div><div class="member-list">${state.members.map(m=>`<div class="member-row"><div class="roster-portrait">${memberPortrait(m)}</div><div><strong>${esc(m.display_name||'Aventureiro')}</strong><small>${m.role==='master'?'Mestre da campanha':m.character?`${esc(m.character.class)} · ${esc(m.character.realm)}`:'Personagem ainda não criado'}</small></div><span class="spacer"></span><span class="tag ${memberIsOnline(m)?'green':'gold'}">${memberIsOnline(m)?'● Online':'○ Offline'}</span></div>`).join('')||'<div class="empty-state"><strong>Aguardando aventureiros</strong><p>Compartilhe o código para convidar seus amigos.</p></div>'}</div><div class="divider"></div><div class="row between"><div><h3 style="margin:0 0 5px">Sua ficha</h3><p class="panel-subtitle" style="margin:0">${hasChar?`${esc(mine.character.name)} · ${esc(mine.character.race)} · ${esc(mine.character.class)}`:'Crie seu personagem para entrar na aventura.'}</p></div><button class="btn ${hasChar?'btn-secondary':'btn-primary'} btn-small" data-action="create-character">${hasChar?'Editar ficha':'Criar personagem'}</button></div></div>
      <aside class="panel"><div class="page-kicker">Próximo capítulo</div><h3>${esc(gs.chapter||'A primeira profecia')}</h3><p class="panel-subtitle">${esc(gs.location||'Local ainda não definido')}</p><div class="divider"></div><div class="row between"><span class="muted" style="font-size:10px">Estado da crônica</span><strong style="font-size:10px;color:#e6d5ad">${c.status==='active'?'Em andamento':'Pausada'}</strong></div><div class="divider"></div><p class="panel-subtitle">${isMaster()?'Como mestre, você controla o início da sessão, os encontros e a narrativa.':'Quando o mestre iniciar a sessão, você poderá acompanhar a aventura por aqui.'}</p>${isMaster()?`<button class="btn btn-secondary" style="width:100%" data-action="open-master-guide">Abrir central do mestre</button>`:`<div class="notice">Aguarde o mestre iniciar a sessão. Sua ficha fica salva mesmo quando todos saírem.</div>`}</aside></div>`;
  }
  function renderSession(){
    if(!state.campaign){state.view='home';renderHome();return}
    const c=state.campaign,gs=c.game_state||defaultGameState(),enc=gs.encounter,events=state.events.filter(e=>e.event_type!=='chat_message').slice(-24).reverse(),chatEvents=state.events.filter(e=>e.event_type==='chat_message').slice(-14),prompt=activeRollPrompt(),playerCanRoll=canCurrentPlayerRoll(),ownChar=state.member?.character?normalizeCharacter(state.member.character):null,ownVitals=ownChar?currentPartyVitals(currentUserId(),ownChar):null,activeTurn=activeCombatTurn(enc),ownTurn=isPlayersCombatTurn();
    app.innerHTML=`<div class="session-top"><div><div class="page-kicker">Crônica em andamento · ${esc(c.code)}</div><h1 class="page-title">${esc(c.name)}</h1></div><div class="row"><span class="tag ${masterIsOnline()?'green':'gold'}">${masterIsOnline()?'● Mestre online':'○ Aguardando mestre'}</span><span class="tag">${state.lastSyncAt?'Sync '+new Date(state.lastSyncAt).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}):'Sincronização pendente'}</span>${isMaster()?'<button class="btn btn-secondary btn-small" data-action="pause-session">Salvar e encerrar sessão</button>':''}<button class="btn btn-quiet btn-small" data-action="sync-campaign">⟳ Sincronizar</button><button class="btn btn-quiet btn-small" data-action="open-lobby">Participantes</button></div></div>
    ${!isMaster()&&!masterIsOnline()?'<div class="notice" style="margin-bottom:16px"><strong>O mestre está offline.</strong> A campanha continua salva, mas as ações ao vivo ficarão disponíveis quando o mestre retornar.</div>':''}
    <div class="session-grid"><div><section class="narrative-box"><div class="label">✦ NARRAÇÃO DO MESTRE · ${esc(gs.chapter||'A CRÔNICA')}</div><h3>${esc(gs.location||'Aethra')}</h3><p>${esc(gs.narration||'A aventura aguarda a próxima decisão dos heróis.')}</p></section>
      ${isMaster()?`<div class="session-actions"><button class="btn btn-secondary btn-small" data-action="request-dice">⬡ Solicitar teste D20</button><button class="btn btn-secondary btn-small" data-action="start-encounter">⚔ Iniciar encontro</button><button class="btn btn-secondary btn-small" data-action="open-narration">✎ Narrar acontecimento</button><button class="btn btn-secondary btn-small" data-action="open-adventure-manager">✦ Jornada e missões</button><button class="btn btn-quiet btn-small" data-action="open-master-guide">♛ Central do mestre</button></div>`:`<div class="session-actions"><button class="btn btn-primary btn-small" data-action="roll-dice" ${!masterIsOnline()||!playerCanRoll?'disabled':''}>⬡ ${playerCanRoll?'Responder ao D20':'Aguardando solicitação'}</button><button class="btn btn-secondary btn-small" data-action="open-character-sheet">✧ Minha ficha</button><button class="btn btn-secondary btn-small" data-action="open-inventory">🎒 Inventário</button></div>`}
      ${renderQuestPanel(gs)}
      ${renderTacticalMap(gs)}
      ${enc?renderCombatTracker(enc):''}
      ${enc?renderBattleCard(enc):`<div class="panel" style="margin-top:16px"><div class="small-caps">Exploração</div><h3 style="margin-top:10px">O caminho está aberto</h3><p class="panel-subtitle">Ainda não há um encontro ativo. ${isMaster()?'Quando os aventureiros encontrarem uma criatura, inicie um encontro pela central da sessão.':'Aguarde o mestre apresentar o próximo desafio.'}</p></div>`}
      <div class="panel" style="margin-top:16px"><div class="row between"><h3>Diário da sessão</h3><span class="tag">Últimos acontecimentos</span></div><div class="event-feed">${events.length?events.map(formatEvent).join(''):'<div class="empty-state"><strong>A crônica ainda será escrita</strong><p>Rolagens, combates e narrações aparecerão aqui.</p></div>'}</div></div>
      <div class="panel chat-panel" style="margin-top:16px"><div class="row between"><h3>Chat da companhia</h3><span class="tag">Ao vivo</span></div><div class="chat-messages">${chatEvents.length?chatEvents.map(formatChatMessage).join(''):'<div class="empty-state"><strong>O silêncio acompanha a jornada</strong><p>Envie a primeira mensagem para seus companheiros.</p></div>'}</div><form id="chat-form" class="chat-compose"><input class="input" id="chat-input" maxlength="500" placeholder="Escreva uma mensagem para o grupo..." autocomplete="off" required><button class="btn btn-primary btn-small" type="submit">Enviar</button></form></div>
    </div><aside>${ownChar?`<div class="panel character-side-card"><div class="character-side-portrait">${portraitImage(ownChar.portrait||classPortrait(ownChar),ownChar.name)}</div><div class="row between"><h3>${esc(ownChar.name)}</h3><span class="tag gold">Nível ${ownChar.level}</span></div><div class="hp-row"><strong>HP</strong><strong>${ownVitals.hp} / ${ownVitals.maxHp}</strong></div><div class="hp-track"><div class="hp-fill" style="width:${Math.max(0,ownVitals.hp/ownVitals.maxHp*100)}%"></div></div><div class="stat-grid"><div class="stat-card"><small>Defesa</small><strong>${ownVitals.defense}</strong></div><div class="stat-card"><small>XP</small><strong>${ownChar.xp||0}</strong></div><div class="stat-card"><small>Ouro</small><strong>${ownVitals.coins} PO</strong></div></div><p class="panel-subtitle">${esc(ownChar.class)} · ${esc(ownChar.race)} · ${esc(ownChar.realm)}</p><button class="btn btn-secondary btn-small" style="width:100%" data-action="open-inventory">Ver equipamento e mochila</button></div>`:''}${renderRevealedNpcs(gs)}${renderJourneyLog(gs)}<div class="panel" style="margin-top:15px"><div class="row between"><h3>Participantes</h3><span class="tag green">${state.members.length} na crônica</span></div><div class="member-list">${state.members.map(m=>{const v=m.character?currentPartyVitals(m.user_id,m.character):null;return `<div class="member-row"><div class="roster-portrait">${memberPortrait(m)}</div><div><strong>${esc(m.display_name||'Aventureiro')}</strong><small>${m.role==='master'?'Mestre':esc(m.character?.class||'Aventureiro')}${v?` · ${v.hp}/${v.maxHp} HP · DEF ${v.defense}`:''} · ${memberIsOnline(m)?'Online':'Offline'}</small></div></div>`}).join('')}</div></div><div class="panel" style="margin-top:15px"><h3>Rolagem de dados</h3><div class="dice-panel"><div class="dice-mini">20</div><div><strong>Dado de vinte faces</strong><small>Testes, ataques e salvaguardas</small></div></div>${isMaster()?`<button class="btn btn-primary" style="width:100%;margin-top:12px" data-action="request-dice">Solicitar rolagem</button><button class="btn btn-secondary" style="width:100%;margin-top:8px" data-action="roll-dice">Rolagem do mestre</button>${prompt?`<div class="notice" style="margin-top:10px">Solicitação ativa: ${esc(prompt.reason)} · ${prompt.fulfilled_user_ids?.length||0}/${prompt.target_user_ids?.length||0} respostas <button class="btn btn-quiet btn-small" style="margin-top:8px" data-action="cancel-roll-prompt">Cancelar</button></div>`:''}`:`<button class="btn btn-primary" style="width:100%;margin-top:12px" data-action="roll-dice" ${!masterIsOnline()||!playerCanRoll?'disabled':''}>${playerCanRoll?'Responder ao D20':'Aguardando solicitação'}</button>${prompt&&!playerCanRoll?`<p class="panel-subtitle">O mestre solicitou: ${esc(prompt.reason)}</p>`:''}`}<p class="panel-subtitle" style="margin:10px 0 0">Os resultados ficam registrados no diário e são exibidos aos participantes.</p></div><div class="panel" style="margin-top:15px"><h3>Capítulo atual</h3><p class="panel-subtitle">${esc(gs.chapter||'Prólogo')}</p><span class="tag gold">${esc(gs.location||'Aethra')}</span></div></aside></div>`;
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
    return `<section class="battle-card ${enc.defeated||Number(enc.hp)<=0?'battle-victory':''}"><div class="battle-art illustrated-battle-art">${portraitImage(enc.portrait||monsterPortrait(enc.templateId),enc.name,'battle-monster-portrait')}<div class="battle-art-shade"></div><span class="battle-art-title">${esc(enc.kind||'CRIATURA HOSTIL')}</span></div><div class="battle-content"><span class="tag red">${esc(enc.threat||'CRIATURA HOSTIL')}</span><h3>${esc(enc.name)}</h3>${enc.templateId==='drakthar'?`<div class="boss-phase-panel boss-phase-${Number(enc.bossPhase)||1}"><strong>${esc(enc.bossPhaseName||'Fase I — O Devorador desperta')}</strong><small>${esc(enc.bossPhaseDescription||'O dragão ancestral observa a companhia.')}</small><span>${(enc.breathPhases||[]).length}/3 sopros ancestrais utilizados</span></div>`:''}<div class="row between"><span class="muted" style="font-size:9px">${esc(enc.kind||'Criatura desconhecida')} · Nível ${esc(enc.level||1)}</span><span class="muted" style="font-size:9px">Defesa ${esc(enc.defense||12)}</span></div><div class="hp-row"><strong>Pontos de vida</strong><strong>${enc.hp} / ${enc.maxHp} HP</strong></div><div class="hp-track hp-track-monster ${hp<=25?'hp-critical':hp<=50?'hp-wounded':''}"><div class="hp-fill" style="width:${hp}%"></div></div><p class="panel-subtitle" style="margin-top:10px"><strong>${esc(enc.specialName||'Instinto da criatura')}:</strong> ${esc(enc.specialDescription||'Age de acordo com seus instintos.')}</p><p class="panel-subtitle">Recompensa pela vitória: <strong>${Number(enc.xpReward)||0} XP</strong> para cada aventureiro que participou.</p>${playerActions}${isMaster()&&enc.defeated?'<div class="notice"><strong>Encontro concluído.</strong> Experiência distribuída.</div>':''}${isMaster()?`<div class="battle-controls"><input class="input" id="master-damage" type="number" min="0" max="1000" value="10" aria-label="Dano manual"><button class="btn btn-danger btn-small" data-action="master-apply-damage">Aplicar dano manual</button><button class="btn btn-quiet btn-small" data-action="end-encounter">Encerrar</button></div>`:''}</div></section>`;
  }
  function renderInventoryModal(){
    const ch=state.member?.character?normalizeCharacter(state.member.character):null;if(!ch){toast('Crie um personagem para consultar o inventário.','error');return}
    const vitals=currentPartyVitals(currentUserId(),ch),eq=vitals.equipment||ch.equipment||{};
    const slots=[['weapon','Arma','⚔'],['armor','Armadura','⛨'],['shield','Escudo','🛡']];
    const equipped=slots.map(([slot,label,icon])=>{const item=eq[slot];return `<div class="member-row equipment-row"><div class="equipment-symbol">${icon}</div><div><strong>${esc(item?.name||'Vazio')}</strong><small>${label}${item?` · ${esc(item.rarity||'Comum')}`:''}</small></div><span class="spacer"></span><span class="tag">${item?(slot==='weapon'?`1d${item.damageDie||6} · +${item.damageBonus||0} dano · +${item.accuracy||0} acerto`:`+${item.defense||0} DEF`):'—'}</span>${item&&isMaster()&&isMasterController()?`<button class="btn btn-secondary btn-small" data-action="unequip-item" data-slot="${slot}">Retirar</button>`:''}</div>`}).join('');
    const bag=vitals.inventory.map(item=>`<div class="member-row"><div class="avatar">${item.kind==='consumable'?'🧪':item.kind==='equipment'?'⚔':'🎒'}</div><div><strong>${esc(item.name)}</strong><small>${esc(item.description||'')}${item.rarity&&item.rarity!=='Comum'?' · '+esc(item.rarity):''}${item.requiredLevel?' · Nível '+item.requiredLevel+'+':''}${item.requiredClasses?' · '+esc(item.requiredClasses.join('/')):''}</small></div><span class="spacer"></span><span class="tag">x${item.qty||0}</span>${item.kind==='equipment'&&Number(item.qty)>0&&isMaster()&&isMasterController()?`<button class="btn btn-primary btn-small" data-action="equip-item" data-item-id="${esc(item.id)}">Equipar</button>`:''}</div>`).join('');
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal wide" role="dialog" aria-modal="true"><div class="modal-head inventory-heading"><div class="inventory-hero-portrait">${portraitImage(ch.portrait||classPortrait(ch),ch.name)}</div><div><div class="page-kicker">Pertences do aventureiro</div><h2>Equipamentos e mochila</h2><p>${esc(ch.name)} · ${esc(ch.class)} · Nível ${ch.level}</p></div><button class="modal-close" data-action="close-modal">×</button></div><div class="stat-grid"><div class="stat-card"><small>HP atual</small><strong>${vitals.hp}/${vitals.maxHp}</strong></div><div class="stat-card"><small>Defesa efetiva</small><strong>${vitals.defense}</strong></div><div class="stat-card"><small>Bônus de ataque</small><strong>+${vitals.equipmentBonuses?.attack||0}</strong></div><div class="stat-card"><small>Ouro</small><strong>${vitals.coins} PO</strong></div></div><h3>Equipado</h3><div class="member-list">${equipped}</div>${vitals.equipmentBonuses?.setName?`<div class="notice"><strong>Conjunto ${esc(vitals.equipmentBonuses.setName)} completo:</strong> +1 Defesa e +1 no ataque.</div>`:(vitals.equipmentBonuses?.setPieces?`<p class="panel-subtitle">Conjunto Vanguarda: ${vitals.equipmentBonuses.setPieces}/3 peças equipadas. Com 3 peças: +1 Defesa e +1 no ataque.</p>`:'')}<div class="divider"></div><h3>Mochila</h3><div class="member-list">${bag||'<p class="panel-subtitle">A mochila está vazia.</p>'}</div><div class="notice">Equipar ou retirar itens altera a Defesa e o dano-base da arma na campanha. Nesta versão, somente o mestre ativo confirma trocas para todos os participantes.</div></section></div>`;
  }
  function formatEvent(ev){const p=ev.payload||{};let title='Acontecimento registrado',desc='';switch(ev.event_type){case'dice_result':title=`D20 · ${p.player_name||'Aventureiro'}`;desc=`Resultado: ${p.result}${p.reason?' · '+p.reason:''}`;break;case'dice_prompt':title='O mestre solicitou um teste';desc=p.reason||'Um aventureiro pode lançar o D20.';break;case'damage_applied':title=`${p.player_name||'Aventureiro'} causou dano`;desc=`${p.amount} de dano em ${p.monster||'a criatura'} · ${p.hp} HP restantes`;break;case'damage_request':title=`${p.player_name||'Aventureiro'} declarou um ataque`;desc=`Dano solicitado: ${p.amount}`;break;case'narration':title='Narração do mestre';desc=p.text||'';break;case'chat_message':title=`${p.display_name||'Aventureiro'} · mensagem`;desc=p.text||'';break;case'encounter_started':title='Encontro iniciado';desc=p.monster||'Uma criatura apareceu.';break;case'npc_revealed':{const npc=STORY_NPCS.find(n=>n.id===p.npc_id);title='Personagem apresentado';desc=npc?`${npc.name} · ${npc.role}`:'Um personagem do mundo foi apresentado.';break;}case'combat_action_result':title=`Ação de ${p.player_name||'Aventureiro'}`;desc=p.description||`Rolagem ${p.natural||'—'} · Dano ${p.damage||0}`;break;case'encounter_defeated':title='Vitória da companhia';desc=p.description||`${p.monster||'A criatura'} foi derrotada. XP distribuído.`;break;case'monster_attack_result':title=`Ação de ${p.monster||'Monstro'}`;desc=p.description||'A criatura realizou sua ação.';break;case'turn_advanced':title='Turno avançado';desc=p.description||'A ordem de iniciativa avançou.';break;case'map_move_request':title='Pedido de movimento';desc=`${p.player_name||'Aventureiro'} solicitou a casa ${Number(p.x)+1}, linha ${Number(p.y)+1}.`;break;case'session_note':title=p.kind==='quest'?'Progresso de missão':p.kind==='map'?'Exploração do mapa':p.kind==='trade'?'Comércio':p.kind==='choice'?'Decisão narrativa':p.kind==='equipment'?'Equipamento':'Diário da campanha';desc=p.text||'Uma anotação foi registrada.';break;default:desc=JSON.stringify(p)}return `<div class="event-item"><strong>${esc(title)}</strong><p>${esc(desc)}</p><time>${new Date(ev.created_at||Date.now()).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</time></div>`}

  function formatChatMessage(ev){const p=ev.payload||{};const mine=ev.actor_id===currentUserId();return `<div class="chat-message ${mine?'mine':''}"><div class="chat-message-meta"><strong>${esc(p.display_name||'Aventureiro')}</strong><time>${new Date(ev.created_at||Date.now()).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</time></div><p>${esc(p.text||'')}</p></div>`}

  function renderMasterGuideModal(){
    const c=state.campaign,gs=c?.game_state||defaultGameState();
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal wide" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="page-kicker">Apenas o mestre</div><h2>Central do Mestre</h2><p>Ferramentas rápidas para conduzir a sessão e consultar a crônica.</p></div><button class="modal-close" data-action="close-modal">×</button></div><div class="stat-grid"><div class="stat-card"><small>Participantes</small><strong>${state.members.length}</strong></div><div class="stat-card"><small>Estado</small><strong style="font-size:15px">${c.status==='active'?'Ao vivo':'Pausada'}</strong></div><div class="stat-card"><small>Eventos registrados</small><strong>${state.events.length}</strong></div></div><div class="divider"></div><h3>Preparação da aventura</h3><div class="member-list"><div class="member-row"><div class="avatar">✦</div><div><strong>${esc(gs.chapter||'Prólogo')}</strong><small>Capítulo atual</small></div><span class="spacer"></span><span class="tag gold">Crônica</span></div><div class="member-row"><div class="avatar">⌖</div><div><strong>${esc(gs.location||'Local desconhecido')}</strong><small>Localização atual</small></div></div></div><div class="divider"></div><h3>Ações rápidas</h3><div class="hero-actions"><button class="btn btn-secondary" data-action="request-dice">Solicitar D20</button><button class="btn btn-secondary" data-action="start-encounter">Iniciar encontro</button><button class="btn btn-secondary" data-action="open-narration">Publicar narração</button><button class="btn btn-secondary" data-action="open-shop">Abrir comércio</button><button class="btn btn-quiet" data-action="open-book" data-book="master">Livro do Mestre</button></div><div class="divider"></div><div class="notice"><strong>Lembrete:</strong> segredos, estatísticas ocultas e revelações devem permanecer na biblioteca do mestre. O que for narrado na sala será compartilhado com todos.</div></section></div>`;
  }
  function renderSettingsModal(){const cfg=loadConfig()||{};modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><div><h2 id="modal-title">Conexão e armazenamento</h2><p>Configure seu projeto Supabase para ativar campanhas compartilhadas entre computadores.</p></div><button class="modal-close" data-action="close-modal" aria-label="Fechar">×</button></div><div class="notice"><strong>Importante:</strong> use a URL do projeto e a Publishable key (sb_publishable_...). Nunca coloque a Secret/service_role key neste site.</div><form id="settings-form" style="margin-top:18px"><div class="field"><label for="sb-url">SUPABASE PROJECT URL</label><input class="input" id="sb-url" type="url" placeholder="https://seu-projeto.supabase.co" value="${esc(cfg.url||'')}" required><span class="hint">Encontre no Connect dialog ou em Project Settings → API Keys.</span></div><div class="field"><label for="sb-key">PUBLISHABLE KEY (CHAVE PÚBLICA)</label><textarea class="textarea" id="sb-key" rows="3" placeholder="Cole aqui a chave pública do projeto" required>${esc(cfg.key||'')}</textarea><span class="hint">A Publishable key pode ser usada no navegador quando as políticas RLS estiverem configuradas corretamente. Não use uma Secret key.</span></div><div class="notice">Antes de conectar: execute <strong>supabase-schema.sql</strong>, habilite Anonymous Sign-Ins e Email provider e ative Manual Linking em Authentication → Configuration. Veja o guia Supabase do zero.</div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="disconnect-backend">Usar modo local</button><button type="submit" class="btn btn-primary">Conectar Supabase</button></div></form></section></div>`}
  async function startEncounter(template){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode iniciar encontros.');
    const participants=state.members.filter(m=>m.role==='player'&&m.character);
    if(!participants.length)throw new Error('É necessário que pelo menos um jogador tenha criado um personagem antes de iniciar o combate.');
    const gs=state.campaign.game_state||defaultGameState();const partyState={...(gs.partyState||{})};
    participants.forEach(m=>{const ch=normalizeCharacter(m.character);const old=partyState[m.user_id]||{};partyState[m.user_id]={hp:Math.max(0,Math.min(Number(old.maxHp)||ch.maxHp,Number.isFinite(Number(old.hp))?Number(old.hp):ch.hp)),maxHp:Number(old.maxHp)||ch.maxHp,defense:ch.defense,inventory:Array.isArray(old.inventory)?old.inventory:ch.inventory,equipment:old.equipment||ch.equipment,baseDefense:old.baseDefense||ch.defense,coins:Number(old.coins)||0,abilityUsed:false}});
    let enc={...template,templateId:template.id,id:crypto.randomUUID?crypto.randomUUID():`enc-${Date.now()}`,round:1,turnIndex:0,specialUsed:false,breathPhases:[],defeated:false,xpAwarded:false,participantIds:participants.map(m=>m.user_id)};
    if(template.id==='drakthar'){enc.baseDefense=template.defense;enc.baseAttackBonus=template.attackBonus;enc=applyBossPhase(enc)}
    enc.turnOrder=buildTurnOrder(enc,state.members);enc.movementUsed={};
    const exploration=explorationData(gs),mapRecord=activeMapRecord(gs);mapRecord.tokens={...mapRecord.tokens,monster:{x:7,y:3}};setActiveMapRecord(exploration,mapRecord);
    await updateGameState({encounter:enc,partyState,exploration});await createEvent('encounter_started',{monster:enc.name,round:1,turn_order:enc.turnOrder});toast(`Encontro iniciado: ${enc.name}. A ordem de iniciativa foi definida.`);
  }
  function renderEncounterModal(){
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal wide" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="page-kicker">Bestiário de Aethra</div><h2>Escolher criatura</h2><p>Selecione um inimigo. Retrato, HP, defesa e habilidades serão apresentados na mesa.</p></div><button class="modal-close" data-action="close-modal">×</button></div><form id="encounter-form"><div class="encounter-art-grid">${MONSTERS.map((m,i)=>`<label class="encounter-art-card ${i===0?'selected':''}"><input type="radio" name="monster" value="${m.id}" ${i===0?'checked':''}><span class="encounter-art-thumb">${m.portrait?portraitImage(m.portrait,m.name):mapMonsterSprite(m.id,m.name)}</span><span class="encounter-art-copy"><strong>${esc(m.name)}</strong><small>${esc(m.kind)} · Nível ${m.level}</small><small>${m.hp} HP · Defesa ${m.defense} · ${m.xpReward} XP</small><em>${esc(m.specialName)}</em></span></label>`).join('')}</div><input type="hidden" id="monster-template" value="${MONSTERS[0].id}"><div class="notice">Apenas personagens com ficha entram na iniciativa. O monstro receberá seu próprio turno e poderá agir automaticamente.</div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button type="submit" class="btn btn-primary">Iniciar encontro</button></div></form></section></div>`;
    modalRoot.querySelectorAll('input[name="monster"]').forEach(r=>r.addEventListener('change',()=>{$('#monster-template').value=r.value;modalRoot.querySelectorAll('.encounter-art-card').forEach(card=>card.classList.toggle('selected',card.contains(r)&&r.checked))}));
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
    if(step===2)body=`<h3>Escolha sua classe</h3><p class="panel-subtitle">Cada classe possui um retrato próprio, função no grupo e habilidade característica.</p><div class="class-art-grid">${CLASSES.map(c=>`<button type="button" class="class-art-card ${d.class===c[0]?'selected':''}" data-choice="class" data-value="${c[0]}"><span class="class-art-image">${portraitImage(classPortrait(c[0]),c[0])}<span class="class-art-symbol">${c[2]}</span></span><span class="class-art-copy"><strong>${c[0]}</strong><small>${c[1]}</small><em>${esc(classRule({class:c[0]}).abilityName)}</em></span></button>`).join('')}</div>`;
    if(step===3)body=`<h3>Distribua seus atributos</h3><p class="panel-subtitle">Você tem 24 pontos para distribuir. Cada atributo começa em 1 e pode chegar a 8 nesta criação inicial.</p><div class="notice" style="margin:12px 0">Pontos disponíveis: <strong id="points-left">${24-Object.values(d.attributes).reduce((a,b)=>a+b,0)}</strong> · Ajuste os controles para combinar com seu estilo.</div>${ATTRS.map(a=>`<div class="attribute-row"><div><strong>${a[1]}</strong><small>${a[2]}</small></div><input type="range" min="1" max="8" value="${d.attributes[a[0]]}" data-attribute="${a[0]}"><b id="attr-${a[0]}">${d.attributes[a[0]]}</b></div>`).join('')}`;
    if(step===4){const cl=CLASSES.find(x=>x[0]===d.class);const realm=REALMS.find(x=>x.name===d.realm);body=`<div class="character-art-preview"><div class="character-art-portrait">${portraitImage(classPortrait(d.class),d.name||d.class)}<span class="character-level-badge">NÍVEL 1</span></div><div class="character-art-summary"><span class="tag gold">Prévia da ficha</span><h2 class="page-title" style="margin:12px 0 6px">${esc(d.name||'Aventureiro sem nome')}</h2><p class="panel-subtitle">${esc(d.race)} · ${esc(d.class)} · ${esc(d.realm)}</p><p class="panel-subtitle">${esc(cl?.[1]||'')} ${realm?'Origem: '+esc(realm.subtitle)+'.':''}</p><div class="divider"></div><div class="stat-grid"><div class="stat-card"><small>HP Máximo</small><strong>${normalizeCharacter(d).maxHp}</strong></div><div class="stat-card"><small>Defesa</small><strong>${normalizeCharacter(d).defense}</strong></div><div class="stat-card"><small>Nível</small><strong>1</strong></div></div><div class="divider"></div><div class="stat-grid">${ATTRS.map(a=>`<div class="stat-card"><small>${a[1]}</small><strong>${d.attributes[a[0]]}</strong></div>`).join('')}</div><div class="divider"></div><p class="panel-subtitle"><strong>Habilidade:</strong> ${esc(classRule(d).abilityName)} — ${esc(classRule(d).abilityDescription)}</p><p class="panel-subtitle"><strong>Arma:</strong> ${esc(normalizeCharacter(d).equipment.weapon.name)} · <strong>Armadura:</strong> ${esc(normalizeCharacter(d).equipment.armor.name)}</p><p class="panel-subtitle"><strong>Personalidade:</strong> ${esc(d.personality||'Ainda não definida.')}</p></div></div><div class="notice" style="margin-top:14px">Sua ficha começa no nível 1. O sistema calcula HP, defesa, equipamento inicial e habilidade de classe. Durante o combate, HP e itens consumidos serão salvos na campanha.</div>`}
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal wide" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="page-kicker">Criação guiada de personagem</div><h2>${steps[step]} · Etapa ${step+1} de 5</h2><p>Leia as orientações e escolha com calma. Você poderá ajustar a ficha antes da aventura.</p></div><button class="modal-close" data-action="close-modal">×</button></div><div class="wizard-progress">${steps.map((_,i)=>`<span class="${i<=step?'done':''}"></span>`).join('')}</div><div id="char-step-body">${body}</div><div class="modal-actions"><button class="btn btn-quiet" data-action="char-prev" ${step===0?'disabled':''}>← Voltar</button><button class="btn btn-primary" data-action="char-next">${step===4?'Salvar personagem':'Continuar →'}</button></div></section></div>`;
  }
  function newCharacterDraft(){return{name:'',age:'',personality:'',realm:'Eldoria',race:'Humano',class:'Guerreiro',level:1,attributes:{forca:5,destreza:4,constituicao:5,inteligencia:3,sabedoria:4,carisma:3}}}
  function renderBookModal(){
    const b=BOOKS.find(x=>x.id===state.currentBook);if(!b){state.modal=null;return}
    const chapters=BOOK_CONTENT[b.id]||[];
    const body=chapters.map((chapter,i)=>`<article class="book-chapter"><div class="page-kicker">Capítulo ${String(i+1).padStart(2,'0')}</div><h3>${esc(chapter[0])}</h3><p>${esc(chapter[1])}</p><ul>${chapter[2].map(item=>`<li>${esc(item)}</li>`).join('')}</ul></article>`).join('');
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal wide book-reader" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="page-kicker">Biblioteca de Aethra · ${b.access} · Edição v2.0 · equipamento funcional</div><h2>${b.title}</h2><p>${b.desc}</p></div><button class="modal-close" data-action="close-modal">×</button></div><div class="notice">Este livro já contém material de consulta nesta edição. Ele continuará recebendo capítulos, exemplos, tabelas e ilustrações nas próximas versões.</div><div class="book-reader-content">${body}</div></section></div>`;
  }

  function renderAccountModal(){
    const anonymous=isAnonymousUser(),pending=pendingLinkEmail(),confirmed=pendingLinkConfirmed();
    let title='Conta de Aethra',description='Acesse suas campanhas em qualquer dispositivo.',body='';
    if(!state.backendReady){title='Conectar conta';description='Configure o Supabase primeiro para ativar contas e sincronização.';body=`<div class="notice">A conta é armazenada pelo Supabase. Abra Configurações, informe a URL e a Publishable key do projeto e conecte o banco antes de criar um login.</div><div class="modal-actions"><button class="btn btn-primary" data-action="open-settings">Abrir configurações</button></div>`;}
    else if(confirmed||state.accountMode==='set-password'){
      title='Definir senha';description='Seu e-mail foi confirmado. Crie uma senha para acessar esta mesma ficha em outros dispositivos.';
      body=`<form id="account-set-password-form"><div class="notice">A identidade desta sessão visitante foi vinculada ao e-mail <strong>${esc(state.user?.email||pending)}</strong>. Personagem, campanhas e histórico mantêm o mesmo identificador.</div><div class="field"><label for="account-password">NOVA SENHA</label><input class="input" id="account-password" type="password" minlength="8" autocomplete="new-password" required placeholder="Pelo menos 8 caracteres"></div><div class="field"><label for="account-password-confirm">CONFIRMAR SENHA</label><input class="input" id="account-password-confirm" type="password" minlength="8" autocomplete="new-password" required></div><div class="modal-actions"><button class="btn btn-primary" type="submit">Salvar senha</button></div></form>`;
    }else if(state.accountMode==='await-email'){
      title='Confirme seu e-mail';description='A etapa de confirmação mantém sua ficha ligada ao mesmo acesso.';
      body=`<div class="notice">Enviamos uma mensagem para <strong>${esc(pending||state.user?.new_email||'o endereço informado')}</strong>. Abra o link de confirmação usando o mesmo navegador onde iniciou a criação da conta. Depois de confirmar, volte ao Reino de Aethra; a tela para definir a senha aparecerá automaticamente.</div><div class="notice">Não saia da conta visitante e não limpe os dados do navegador enquanto aguarda a confirmação.</div><div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Entendi</button></div>`;
    }else if(state.accountMode==='recovery-password'){
      title='Criar nova senha';description='Defina uma nova senha para sua conta.';
      body=`<form id="account-recovery-password-form"><div class="field"><label for="account-password">NOVA SENHA</label><input class="input" id="account-password" type="password" minlength="8" autocomplete="new-password" required></div><div class="field"><label for="account-password-confirm">CONFIRMAR SENHA</label><input class="input" id="account-password-confirm" type="password" minlength="8" autocomplete="new-password" required></div><div class="modal-actions"><button class="btn btn-primary" type="submit">Atualizar senha</button></div></form>`;
    }else if(state.accountMode==='login'){
      title='Entrar na conta';description='Use o mesmo e-mail e senha em computador, celular ou tablet.';
      body=`<form id="account-login-form"><div class="field"><label for="account-email">E-MAIL</label><input class="input" id="account-email" type="email" autocomplete="username" required></div><div class="field"><label for="account-login-password">SENHA</label><input class="input" id="account-login-password" type="password" autocomplete="current-password" required></div><div class="row between"><button type="button" class="text-button" data-action="account-mode" data-mode="reset">Esqueci minha senha</button><button type="button" class="text-button" data-action="account-mode" data-mode="home">Voltar</button></div><div class="notice">Entre com a conta que foi criada ao salvar o progresso no dispositivo original. O personagem e as campanhas acompanham o mesmo e-mail.</div><div class="modal-actions"><button class="btn btn-primary" type="submit">Entrar</button></div></form>`;
    }else if(state.accountMode==='reset'){
      title='Recuperar senha';description='Enviaremos instruções ao endereço informado.';
      body=`<form id="account-reset-form"><div class="field"><label for="account-email">E-MAIL DA CONTA</label><input class="input" id="account-email" type="email" autocomplete="email" required></div><div class="notice">O link de recuperação retornará para esta página do Reino de Aethra. Verifique também a caixa de spam.</div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="account-mode" data-mode="login">Voltar</button><button class="btn btn-primary" type="submit">Enviar recuperação</button></div></form>`;
    }else if(state.accountMode==='reset-sent'){
      title='Verifique seu e-mail';description='O pedido de recuperação foi enviado.';
      body=`<div class="notice">Se existir uma conta com esse endereço, o Supabase enviará uma mensagem. Abra o link no mesmo navegador onde deseja trocar a senha.</div><div class="modal-actions"><button class="btn btn-secondary" data-action="account-mode" data-mode="login">Voltar ao login</button></div>`;
    }else if(anonymous){
      title='Salvar seu progresso';description='Transforme o acesso visitante em uma conta que funciona em todos os seus dispositivos.';
      body=`<div class="notice"><strong>Importante:</strong> você está usando um acesso visitante deste navegador. Vincule agora um e-mail antes de trocar de computador ou limpar os dados do navegador. O vínculo mantém o mesmo identificador e, portanto, não separa suas campanhas.</div>${pending?`<div class="notice">Aguardando confirmação de <strong>${esc(pending)}</strong>. Abra a mensagem enviada pelo Supabase usando este mesmo navegador. Depois volte aqui para definir sua senha.</div>`:''}<form id="account-link-form"><div class="field"><label for="account-email">SEU E-MAIL</label><input class="input" id="account-email" type="email" autocomplete="email" required placeholder="voce@exemplo.com"></div><div class="modal-actions"><button class="btn btn-primary" type="submit">Enviar confirmação</button></div></form><div class="divider"></div><button class="btn btn-secondary" data-action="account-mode" data-mode="login">Já tenho uma conta</button>`;
    }else{
      title='Conta sincronizada';description='Seu acesso está vinculado e pode ser usado em outros dispositivos.';
      body=`<div class="account-profile"><span class="account-profile-mark">✦</span><div><strong>${esc(state.user?.email||'Conta de Aethra')}</strong><small>Conta permanente · progresso sincronizado</small></div></div><form id="account-change-password-form"><div class="field"><label for="account-password">ALTERAR SENHA</label><input class="input" id="account-password" type="password" minlength="8" autocomplete="new-password" required placeholder="Nova senha (8 caracteres ou mais)"></div><div class="field"><label for="account-password-confirm">CONFIRMAR SENHA</label><input class="input" id="account-password-confirm" type="password" minlength="8" autocomplete="new-password" required></div><div class="modal-actions"><button class="btn btn-primary" type="submit">Atualizar senha</button></div></form><div class="divider"></div><button class="btn btn-quiet" data-action="account-sign-out">Sair desta conta neste dispositivo</button>`;
    }
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="page-kicker">Reino de Aethra · Identidade</div><h2>${title}</h2><p>${description}</p></div><button class="modal-close" data-action="close-modal" aria-label="Fechar">×</button></div>${body}</section></div>`;
  }
  function openModal(which){state.modal=which;if(which==='character'){state.charStep=0;state.charDraft=state.member?.character?JSON.parse(JSON.stringify(state.member.character)):newCharacterDraft()}render()}
  function closeModal(){state.modal=null;state.currentBook=null;modalRoot.innerHTML=''}
  function animateMapCombat(payload={},monsterAction=false){
    const board=document.querySelector('.map-board');if(!board)return;
    const tokens=[...board.querySelectorAll('.map-token')];
    const findToken=name=>tokens.find(token=>(token.getAttribute('title')||'').trim()===(name||'').trim());
    const attacker=monsterAction?findToken(payload.monster):findToken(payload.player_name);
    const target=monsterAction?findToken(payload.target):tokens.find(token=>token.classList.contains('monster-token'));
    const actionClass=Number(payload.healing)>0?'token-heal':payload.hit===false?'token-miss':monsterAction?'token-monster-attack':payload.action==='ability'?'token-cast':'token-attack';
    const pulse=(token,cls)=>{if(!token)return;token.classList.remove('token-attack','token-cast','token-heal','token-miss','token-monster-attack','token-hit');void token.offsetWidth;token.classList.add(cls);window.setTimeout(()=>token.classList.remove(cls),1050)};
    pulse(attacker,actionClass);
    if(monsterAction&&attacker?.querySelector('.monster-drakthar')&&(/sopro|cinzas|chama/i.test(payload.description||'')||Array.isArray(payload.affected)&&payload.affected.length>1)){attacker.classList.add('token-boss-breath');window.setTimeout(()=>attacker.classList.remove('token-boss-breath'),1250)}
    if(monsterAction&&Array.isArray(payload.affected)){payload.affected.forEach(item=>pulse(findToken(item.name),'token-hit'))}
    else if(target&&Number(payload.damage)>0)pulse(target,'token-hit');
  }
  function showCombatFX(payload={}){
    const healed=Number(payload.healing)>0;const monster=!!payload.monsterAction;const magic=payload.action==='ability'&&!healed;const kind=healed?'heal':monster?'monster':magic?'magic':'physical';
    const title=healed?'Energia restauradora':monster?'Ataque da criatura':magic?'Poder arcano':'Golpe de combate';
    const detail=payload.description||((Number(payload.damage)||0)>0?`${payload.damage} de dano`:'Ação resolvida');
    animateMapCombat(payload,monster);
    const node=document.createElement('div');node.className=`combat-fx combat-fx-${kind}`;node.innerHTML=`<span class="combat-fx-symbol">${healed?'✚':monster?'☠':magic?'✧':'⚔'}</span><span><strong>${esc(title)}</strong><small>${esc(detail)}</small></span>`;document.body.append(node);playCombatFXSound(kind);setTimeout(()=>node.remove(),2100);
  }
  function playCombatFXSound(kind){try{const ctx=new(window.AudioContext||window.webkitAudioContext)();const now=ctx.currentTime;const tones=kind==='magic'?[540,720,900]:kind==='heal'?[440,554,660]:kind==='monster'?[130,98,73]:[210,145,110];tones.forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type=kind==='magic'?'sine':'triangle';o.frequency.setValueAtTime(f,now+i*.05);g.gain.setValueAtTime(.0001,now+i*.05);g.gain.exponentialRampToValueAtTime(.026,now+i*.05+.018);g.gain.exponentialRampToValueAtTime(.0001,now+i*.05+.14);o.connect(g);g.connect(ctx.destination);o.start(now+i*.05);o.stop(now+i*.05+.15)});setTimeout(()=>ctx.close(),650)}catch(e){}}
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
      else if(action==='open-account'){state.accountMode='home';openModal('account')}
      else if(action==='account-mode'){state.accountMode=btn.dataset.mode||'home';render()}
      else if(action==='account-sign-out'){await signOutAccount()}
      else if(action==='create-campaign')openModal('create')
      else if(action==='join-campaign')openModal('join')
      else if(action==='close-modal')closeModal()
      else if(action==='disconnect-backend')disconnectSupabase()
      else if(action==='open-book'){state.currentBook=btn.dataset.book;state.modal='book';render()}
      else if(action==='open-cloud-campaign'){await openCloudCampaign(btn.dataset.id)}
      else if(action==='open-local-campaign'){const c=localCampaignById(btn.dataset.id);if(c){state.campaign=c;state.member=c.members.find(m=>m.user_id==='local-user')||c.members[0];state.members=c.members;state.events=c.events||[];state.pendingDamage=state.events.filter(e=>e.event_type==='damage_request');state.pendingMapMoves=pendingMapMovesFrom(state.events);state.pendingMapInteractions=pendingMapInteractionsFrom(state.events);localStorage.setItem(KEYS.active,c.id);state.view=c.status==='active'?'session':'lobby';render()}}
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
      else if(action==='approve-damage'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre pode validar ataques.');const req=state.pendingDamage.find(x=>x.id===btn.dataset.id);if(req){const enc=state.campaign.game_state?.encounter;const amount=Math.max(0,Math.min(1000,Number(req.payload?.amount)||0));if(!enc||req.payload?.encounter_id!==enc.id){await createEvent('damage_rejected',{request_id:req.id,player_name:req.payload?.player_name||'Aventureiro',reason:'O encontro correspondente já foi encerrado.'})}else if(amount){const hp=Math.max(0,enc.hp-amount);const phased=applyBossPhase({...enc,hp,defeated:hp===0,turnOrder:hp===0?[]:enc.turnOrder,turnIndex:hp===0?0:enc.turnIndex});await updateGameState({encounter:phased});await createEvent('damage_applied',{amount,hp,monster:enc.name,player_name:req.payload?.player_name||'Aventureiro',request_id:req.id});if(hp===0){await awardEncounterRewards(phased);toast('Criatura derrotada. XP distribuído à companhia.')}}state.pendingDamage=state.pendingDamage.filter(x=>x.id!==req.id);render()}}
      else if(action==='reject-damage'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre pode validar ataques.');const req=state.pendingDamage.find(x=>x.id===btn.dataset.id);if(req){await createEvent('damage_rejected',{request_id:req.id,player_name:req.payload?.player_name||'Aventureiro'});state.pendingDamage=state.pendingDamage.filter(x=>x.id!==req.id);render()}}
      else if(action==='master-apply-damage'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode alterar o HP.');const amount=Math.max(0,Math.min(1000,Number($('#master-damage')?.value)||0));const enc=state.campaign.game_state.encounter;if(enc&&amount&&!enc.defeated){const hp=Math.max(0,enc.hp-amount);const next=applyBossPhase({...enc,hp,defeated:hp===0,turnOrder:hp===0?[]:enc.turnOrder,turnIndex:hp===0?0:enc.turnIndex});await updateGameState({encounter:next});await createEvent('damage_applied',{amount,hp,monster:enc.name,player_name:state.member.display_name||'Mestre'});if(hp===0){await awardEncounterRewards(next);toast('Criatura derrotada. XP distribuído à companhia.')}}}
      else if(action==='open-damage'){
        modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal" role="dialog"><div class="modal-head"><div><h2>Registrar ataque</h2><p>Informe o dano causado. O mestre confirma e aplica o valor à criatura.</p></div><button class="modal-close" data-action="close-modal">×</button></div><form id="damage-form"><div class="field"><label for="damage-amount">DANO DECLARADO</label><input class="input" type="number" id="damage-amount" min="1" max="1000" value="12" required></div><div class="field"><label for="damage-note">AÇÃO (OPCIONAL)</label><input class="input" id="damage-note" placeholder="Ex.: Golpe poderoso com espada"></div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button class="btn btn-primary" type="submit">Enviar ao mestre</button></div></form></section></div>`;
      }
      else if(action==='end-encounter'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode encerrar o encontro.');const gs=state.campaign.game_state||defaultGameState(),ex=explorationData(gs),rec=activeMapRecord(gs);delete rec.tokens.monster;await updateGameState({encounter:null,exploration:setActiveMapRecord(ex,rec)});toast('Encontro encerrado.')}
      else if(action==='map-change'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre pode trocar o mapa.');const id=btn.dataset.mapId;if(!MAP_TEMPLATES.some(m=>m.id===id))throw new Error('Mapa não encontrado.');const gs=state.campaign.game_state||defaultGameState(),ex=explorationData(gs);ex.mapId=id;state.selectedMapToken=state.members.find(m=>m.role==='player'&&m.character)?.user_id||null;state.selectedMapTool='move';await updateGameState({exploration:ex});await createEvent('session_note',{kind:'map',text:`O mapa mudou para ${mapTemplate(id).name}.`})}
      else if(action==='map-tool'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre pode selecionar ferramentas do mapa.');state.selectedMapTool=btn.dataset.tool||'move';render()}
      else if(action==='toggle-map-fog'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre pode controlar a névoa de guerra.');const gs=state.campaign.game_state||defaultGameState(),ex=explorationData(gs),rec=activeMapRecord(gs);rec.fogEnabled=!rec.fogEnabled;if(rec.fogEnabled){mapTokens(rec,gs).filter(t=>t.kind==='player').forEach(t=>addRevealedAround(rec,t.position.x,t.position.y,1))}await updateGameState({exploration:setActiveMapRecord(ex,rec)});toast(rec.fogEnabled?'Névoa de guerra ativada.':'Mapa totalmente revelado.')}
      else if(action==='map-cell'){await handleMapCellClick(btn)}
      else if(action==='approve-map-move'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre pode aprovar movimentos.');const ev=state.pendingMapMoves.find(x=>x.id===btn.dataset.id);if(!ev)throw new Error('Solicitação não encontrada.');try{await moveMapToken(ev.actor_id,Number(ev.payload.x),Number(ev.payload.y),ev.id,ev.payload.map_id)}catch(err){await createEvent('session_note',{kind:'map',request_id:ev.id,accepted:false,text:`Movimento recusado: ${err.message}`});state.pendingMapMoves=state.pendingMapMoves.filter(x=>x.id!==ev.id);throw err}state.pendingMapMoves=state.pendingMapMoves.filter(x=>x.id!==ev.id);render()}
      else if(action==='reject-map-move'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre pode recusar movimentos.');const ev=state.pendingMapMoves.find(x=>x.id===btn.dataset.id);if(ev){await createEvent('session_note',{kind:'map',request_id:ev.id,accepted:false,text:`O mestre recusou o movimento de ${ev.payload?.player_name||'um aventureiro'}.`});state.pendingMapMoves=state.pendingMapMoves.filter(x=>x.id!==ev.id);render()}}
      else if(action==='approve-map-interaction'){const ev=state.pendingMapInteractions.find(x=>x.id===btn.dataset.id);if(!ev)throw new Error('Interação não encontrada.');await resolveMapInteraction(ev,true)}
      else if(action==='reject-map-interaction'){const ev=state.pendingMapInteractions.find(x=>x.id===btn.dataset.id);if(ev)await resolveMapInteraction(ev,false)}
      else if(action==='grant-quest-reward'){await grantQuestReward(btn.dataset.questId)}
      else if(action==='open-adventure-manager'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode gerenciar a jornada.');renderAdventureManagerModal()}
      else if(action==='open-npc'){renderNPCModal(btn.dataset.npcId)}
      else if(action==='open-shop'){renderShopModal()}
      else if(action==='shop-buy'){await transactShop(btn.dataset.itemId,'buy')}
      else if(action==='shop-sell'){await transactShop(btn.dataset.itemId,'sell')}
      else if(action==='equip-item'){await changeEquipment(btn.dataset.itemId)}
      else if(action==='unequip-item'){await changeEquipment(null,btn.dataset.slot,true)}
      else if(action==='dialogue-choice'){
        if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode registrar decisões narrativas.');
        const npc=STORY_NPCS.find(n=>n.id===btn.dataset.npcId),choice=(DIALOGUE_CHOICES[btn.dataset.npcId]||[]).find(c=>c.id===btn.dataset.choiceId);if(!npc||!choice)throw new Error('Escolha de diálogo inválida.');
        const gs=state.campaign.game_state||defaultGameState(),dialogueChoices=cloneData(gs.dialogueChoices||{}),storyFlags={...(gs.storyFlags||{})};if((dialogueChoices[npc.id]||[]).length)throw new Error('A companhia já registrou uma decisão para este diálogo.');dialogueChoices[npc.id]=[choice.id];storyFlags[choice.flag]=true;const message=`${npc.name}: ${choice.log}`;const journalEntries=[...(gs.journalEntries||[]),{id:crypto.randomUUID?crypto.randomUUID():`journal-${Date.now()}`,text:message,kind:'choice',createdAt:new Date().toISOString()}].slice(-50);await updateGameState({dialogueChoices,storyFlags,journalEntries});await createEvent('session_note',{kind:'choice',text:message});renderNPCModal(npc.id);toast('Decisão registrada e salva na crônica.');
      }
      else if(action==='accept-quest'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode apresentar missões.');const gs=state.campaign.game_state||defaultGameState();const data=narrativeState(gs);const q=data.quests.find(x=>x.id===btn.dataset.questId);if(!q||q.status!=='available')throw new Error('Esta missão não está disponível.');q.status='active';let text=`A companhia aceitou a missão: ${q.title}.`;if(q.id==='side-01'&&data.revealedNpcIds.includes('tovin')){const result=markObjective(data.quests,'side-01','meet-tovin');data.quests=result.quests;if(result.changed)text+=' O grupo já havia conhecido Tovin; esse objetivo foi reconhecido automaticamente.'}data.journalEntries=[...data.journalEntries,{id:crypto.randomUUID?crypto.randomUUID():`journal-${Date.now()}`,text,kind:'quest',createdAt:new Date().toISOString()}].slice(-50);await updateGameState({quests:data.quests,journalEntries:data.journalEntries});await createEvent('session_note',{kind:'quest',text});renderAdventureManagerModal();toast('Missão apresentada à companhia.')}
      else if(action==='complete-quest-objective'){await completeQuestObjective(btn.dataset.questId,btn.dataset.objectiveId);renderAdventureManagerModal()}
      else if(action==='reveal-npc'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode revelar NPCs.');const id=btn.dataset.npcId;const npc=STORY_NPCS.find(x=>x.id===id);if(!npc)throw new Error('Personagem não encontrado.');const gs=state.campaign.game_state||defaultGameState();const data=narrativeState(gs);if(!data.revealedNpcIds.includes(id)){data.revealedNpcIds=[...data.revealedNpcIds,id];let quests=data.quests;let text=`A companhia encontrou ${npc.name}, ${npc.role.toLowerCase()}.`;if(id==='ilyra'){const result=markObjective(quests,'main-01','meet-ilyra');quests=result.quests;if(result.changed)text+=' Objetivo concluído: conhecer Ilyra Avelorn.'}if(id==='tovin'){const result=markObjective(quests,'side-01','meet-tovin');quests=result.quests;if(result.changed)text+=' Objetivo concluído: falar com Tovin.'}if(id==='maera'){const result=markObjective(quests,'main-03','reach-thalassor');quests=result.quests;if(result.changed)text+=' Objetivo concluído: encontrar a capitã Maera.'}if(id==='vaelis'){const result=markObjective(quests,'main-04','consult-vaelis');quests=result.quests;if(result.changed)text+=' Objetivo concluído: consultar Vaelis.'}if(id==='asha'){const result=markObjective(quests,'main-05','meet-asha');quests=result.quests;if(result.changed)text+=' Objetivo concluído: encontrar o Oráculo Asha.'}if(id==='brann'){const result=markObjective(quests,'main-06','meet-brann');quests=result.quests;if(result.changed)text+=' Objetivo concluído: encontrar Mestre Ferreiro Brann.'}data.journalEntries=[...data.journalEntries,{id:crypto.randomUUID?crypto.randomUUID():`journal-${Date.now()}`,text,kind:'npc',createdAt:new Date().toISOString()}].slice(-50);await updateGameState({revealedNpcIds:data.revealedNpcIds,quests,journalEntries:data.journalEntries});await createEvent('session_note',{kind:'npc',text});}renderAdventureManagerModal();toast(`${npc.name} agora está visível aos jogadores.`)}
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
  document.addEventListener('change',e=>{
    if(e.target.id==='map-token-select'){state.selectedMapToken=e.target.value||null;render()}
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
      else if(form.id==='account-link-form'){await linkGuestAccount($('#account-email').value)}
      else if(form.id==='account-login-form'){await signInExistingAccount($('#account-email').value,$('#account-login-password').value)}
      else if(form.id==='account-reset-form'){await sendPasswordReset($('#account-email').value)}
      else if(form.id==='account-set-password-form'){await finishAccountPassword($('#account-password').value,$('#account-password-confirm').value)}
      else if(form.id==='account-recovery-password-form'||form.id==='account-change-password-form'){await updateSignedInPassword($('#account-password').value,$('#account-password-confirm').value)}
      else if(form.id==='create-form'){const name=$('#campaign-name').value.trim(),desc=$('#campaign-desc').value.trim();if(!name)throw new Error('Informe o nome da campanha.');await createCampaign(name,desc)}
      else if(form.id==='join-form'){const code=$('#join-code').value.trim().toUpperCase(),name=$('#join-name').value.trim();state.prefillJoinCode=null;await joinCampaign(code,name)}
      else if(form.id==='damage-form'){const amount=Number($('#damage-amount').value),note=$('#damage-note').value.trim(),encounter=state.campaign.game_state?.encounter;if(!encounter?.id)throw new Error('Não existe um encontro ativo.');if(!amount||amount<1)throw new Error('Informe um valor de dano válido.');await createEvent('damage_request',{amount,note,encounter_id:encounter.id,player_name:state.member?.display_name||'Aventureiro'});closeModal();toast('Ataque enviado. O mestre validará o dano.')}
      else if(form.id==='roll-prompt-form'){const target=$('#roll-target').value,reason=$('#roll-reason').value.trim()||'Teste de D20';await requestRoll(target,reason);closeModal()}
      else if(form.id==='encounter-form'){const template=MONSTERS.find(m=>m.id===$('#monster-template').value);if(!template)throw new Error('Escolha uma criatura válida.');await startEncounter(template);closeModal()}
      else if(form.id==='chat-form'){const input=$('#chat-input');const text=input?.value.trim();if(text){await createEvent('chat_message',{text:text.slice(0,500),display_name:state.member?.display_name||'Aventureiro'});input.value='';render()}}
      else if(form.id==='scene-form'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode mudar a cena.');const chapter=$('#scene-chapter').value.trim(),locationName=$('#scene-location').value.trim(),text=$('#scene-narration').value.trim();if(!chapter||!locationName||!text)throw new Error('Preencha capítulo, local e narração.');const gs=state.campaign.game_state||defaultGameState();const data=narrativeState(gs);const note=`A companhia chegou a ${locationName}.`;data.journalEntries=[...data.journalEntries,{id:crypto.randomUUID?crypto.randomUUID():`journal-${Date.now()}`,text:note,kind:'scene',createdAt:new Date().toISOString()}].slice(-50);await updateGameState({chapter,location:locationName,narration:text,journalEntries:data.journalEntries});await createEvent('session_note',{kind:'scene',text:note});renderAdventureManagerModal();toast('Nova cena publicada para todos.')}
      else if(form.id==='journal-form'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode registrar no diário.');const text=$('#journal-text').value.trim();if(!text)throw new Error('Escreva uma anotação antes de salvar.');await appendJournalEntry(text,'story');await createEvent('session_note',{kind:'journal',text});renderAdventureManagerModal();toast('Anotação adicionada ao diário.')}
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
