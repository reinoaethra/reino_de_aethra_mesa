/* Reino de Aethra v4.2.4 — Rolador Universal de Dados da Central do Mestre.
 * Compatível com campanhas existentes; usa eventos session_note já permitidos e armazenamento local para resultados privados.
 * Não exige alteração de schema ou nova migration do Supabase.
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
    {id:'adventurer',icon:'⚒',title:'Manual do Aventureiro',subtitle:'Regras para jogadores',desc:'Criação de personagens, atributos, raças, classes, testes, combate, exploração e interpretação.',access:'Todos'},
    {id:'firststeps',icon:'✧',title:'Primeiros Passos em Aethra',subtitle:'Manual de Mestre e Jogadores',desc:'Aprenda do zero como jogar, narrar, conduzir cenas, cumprir missões e participar de combates.',access:'Todos'}
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

  // Complemento dos livros em jogo para a edição 4.2.0.
  BOOK_CONTENT.master.push(
    ['Central do Mestre e preparação de sessão','A Central do Mestre reúne o estado da companhia e atalhos para preparar a próxima sessão, publicar decisões, administrar condições, resolver ataques em área, registrar tesouros, acompanhar relações com NPCs e criar backups. O resumo da sessão é uma anotação no Diário; para pausar a sessão, use o comando próprio Salvar e encerrar sessão.',['Antes de começar: confira participantes, capítulo, missão e encontro.','Durante a sessão: use narração e decisões para conduzir a história; abra combate quando a posição ou o risco tático importar.','Ao terminar: registre o resumo, prepare a próxima sessão e exporte um backup.']],
    ['Condições, alcance e terreno','Condições são aplicadas pelo mestre a um aventureiro ou monstro e duram turnos do próprio alvo. Ataques de aventureiros verificam alcance e linha de visão quando há peças posicionadas no mapa; obstáculos podem conceder cobertura ao alvo.',['Atordoado: perde a próxima ação.','Envenenado: -2 no ataque; Queimando: 1d4 de dano ao fim do turno; Congelado: -2 Defesa.','Enfraquecido: -2 dano; Marcado: recebe +2 dano; Enraizado: não pode se mover.','O alcance padrão é 1 casa para ataques corpo a corpo e 6 para classes de ataque à distância, salvo alcance definido pela arma.']],
    ['Decisões, relações e continuidade','As decisões narrativas permitem publicar uma pergunta com duas ou três opções. Cada jogador pode votar uma vez; o mestre acompanha a contagem e confirma a opção vencedora (ou desempata). Só então a consequência é registrada para a companhia, e o mestre atualiza missões e flags. Memórias de NPC registram confiança e promessas, mas não alteram automaticamente diálogos ou preços.',['Registre consequências no Diário e nas missões.','Use memórias para manter continuidade de promessas e alianças.','A preparação da próxima sessão não é apresentada como narração aos jogadores.']],
    ['Legado, histórico e efeitos sonoros','O painel Marcos de Aethra guarda encontros vencidos, criaturas e chefes derrotados, decisões narrativas, recompensas e as espécies que a companhia enfrentou. As cinco espécies mais derrotadas aparecem em uma lista resumida. Os efeitos sonoros são opcionais, sintetizados pelo navegador e desligados por padrão; a escolha fica no armazenamento local do dispositivo.',['Consulte o histórico de espécies para recordar quais ameaças o grupo já enfrentou.','Ative ou desative os sons em Configurações; a opção não é sincronizada entre dispositivos.','Exporte backups em intervalos regulares e antes de restaurar uma campanha.']]
  );
  BOOK_CONTENT.bosses.push(['Fases de chefes e ataques especiais','Chefes com ficha de chefe avançam por até três fases conforme perdem HP. Cada mudança atualiza a descrição e aumenta Defesa e bônus de ataque conforme o perfil de cada chefe. Algumas habilidades especiais de Drakthar e Vharzun podem atingir a companhia inteira; outros chefes recebem um ataque adicional de fase em acertos elevados.',['Fase I: apresentação e leitura da ameaça.','Fase II: mudança de comportamento e pressão.','Fase III: resistência final e ataques mais perigosos.','O mestre deve narrar os sinais da habilidade especial e pode usar o ataque em área para efeitos de sopro, explosão ou onda.']]);
  BOOK_CONTENT.adventurer.push(['Árvore de habilidades e efeitos','A partir do nível 4, o personagem recebe pontos de especialização a cada três níveis, até nove pontos no nível 28. Escolha entre Lâmina e precisão, Postura do guardião e Disciplina arcana; cada trilha pode receber até três pontos. As escolhas são permanentes nesta edição.',['Lâmina e precisão: melhora ataque, dano e chance de crítico.','Postura do guardião: melhora Defesa e HP máximo, além de cura recebida.','Disciplina arcana: melhora ataques de habilidade e curas realizadas.','Condições temporárias são exibidas na ficha; atordoamento e enraizamento podem limitar suas ações.']]);
  BOOK_CONTENT.master.push(['Modo Chamada e sessões com áudio externo','O Modo Chamada permite conduzir Aethra enquanto a companhia conversa pelo Discord, WhatsApp ou Google Meet. O mestre pode compartilhar um link HTTPS da sala, ativar atalhos de ações e solicitar testes comuns sem digitar descrições longas. Os jogadores falam normalmente na chamada e tocam em Investigar, Observar, Conversar, Interagir, Ajudar, Proteger, Acompanhar ou Recuar para sinalizar sua intenção. O mestre registra ou dispensa cada solicitação. Aethra não captura o microfone, não transcreve a conversa e não substitui a chamada externa.',['Configure o link da chamada e ative o Modo Chamada antes da sessão.','Use Solicitar D20 rápido para testes comuns; o resultado continua sendo calculado e registrado pelo jogo.','Use os atalhos de pista, objetivo, cena e descanso para registrar acontecimentos sem redigir uma anotação longa.','Se a conexão de voz cair, a campanha continua funcionando e o chat escrito pode ser aberto como alternativa.']]);
  BOOK_CONTENT.adventurer.push(['Participar de uma sessão por chamada','Quando o mestre ativar o Modo Chamada, entre no Discord, WhatsApp ou Google Meet pelo convite compartilhado. Mantenha o Reino de Aethra aberto em outra aba ou janela. Diga em voz alta o que seu personagem pretende fazer e toque em um atalho de intenção para avisar o mestre sem escrever uma explicação. Durante o combate, continue usando os botões de ataque, habilidade e poção no seu turno.',['Fale sua intenção normalmente: por exemplo, “quero investigar a carroça”.','Toque em Investigar para enviar essa intenção ao mestre; ele decidirá o teste e as consequências.','Quando o mestre pedir um D20, toque em Responder ao D20 para enviar seu resultado.','A chamada não é transmitida pelo jogo. Você pode manter o chat escrito recolhido ou abri-lo se precisar.']]);
  BOOK_CONTENT.firststeps=[
    ['O que a Central do Mestre faz','A Central do Mestre é o painel de controle do narrador. Ela não joga no lugar do mestre: oferece atalhos para preparar sessões, criar decisões, aplicar condições e registrar tesouros. Os jogadores continuam escolhendo o que seus personagens fazem.',['Use Preparar próxima sessão para anotar cenas e encontros pendentes.','Use Criar decisão narrativa quando houver dois ou três caminhos possíveis.','Use Registrar resumo da sessão para guardar o que aconteceu no Diário.']],
    ['Quando usar o Mapa Tático','O Mapa Tático serve para explorar áreas em que as posições importam e para resolver combates. Não é necessário abrir o mapa para cada conversa: a Cena e Narração conduz a história, enquanto o tabuleiro representa caminhos, portas, obstáculos e posições.',['Abra o mapa para atravessar salas, corredores, armadilhas e áreas perigosas.','Em combate, acompanhe iniciativa, HP, alcance e linha de visão.','Casas bloqueadas e obstáculos continuam respeitados; ataques de área usam coordenadas do mapa.']],
    ['Turnos, condições e especialização','No seu turno, escolha uma ação válida e aguarde a resolução. Condições aparecem junto ao personagem ou monstro e podem mudar o que ele consegue fazer. Ao subir de nível, confira se há pontos de habilidade disponíveis.',['Atordoado faz perder a próxima ação; Enraizado impede movimento.','Ataques à distância têm alcance padrão maior do que ataques corpo a corpo.','A árvore de habilidades é aberta pelo cartão da sua ficha e as escolhas são permanentes.']]
  ];

  BOOK_CONTENT.firststeps.push(['Jogar em chamada com o grupo','O mestre pode ativar o Modo Chamada e compartilhar um convite de Discord, WhatsApp ou Google Meet. A conversa acontece nesse serviço externo. Mantenha também o Reino de Aethra aberto: os jogadores usam botões rápidos para sinalizar intenções, responder testes D20 e acompanhar mapa, fichas e iniciativa. O jogo não usa o microfone nem transcreve a conversa.',['Fale o que deseja fazer e toque no atalho correspondente.','O mestre recebe a intenção e confirma como ela será resolvida.','Use os controles normais do combate quando chegar seu turno.','O chat escrito continua disponível como recurso opcional.']]);

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
    {id:'colosso-sal',name:'Colosso de Sal',kind:'Elemental costeiro',level:8,defense:18,hp:194,maxHp:194,attackBonus:8,damageDie:10,damageBonus:3,initiativeBonus:0,threat:'AMEAÇA MUITO ALTA',xpReward:185,emoji:'🧂',specialName:'Onda cristalina',specialDescription:'Golpe pesado que pode empurrar o alvo uma casa, se houver espaço livre.'},
    {id:'quimera-carmesim',portrait:'orc-warlord.webp',name:'Quimera Carmesim',kind:'Monstruosidade dracônica',level:12,defense:22,hp:420,maxHp:420,attackBonus:13,damageDie:12,damageBonus:6,initiativeBonus:4,threat:'CHEFE REGIONAL',xpReward:900,emoji:'🦁',specialName:'Tríplice investida',specialDescription:'Alterna mordida, chamas e ferrão; a cada terceiro turno atinge dois alvos.'},
    {id:'arauto-vazio',portrait:'wraith.webp',name:'Arauto do Vazio',kind:'Aberração extraplanar',level:16,defense:25,hp:680,maxHp:680,attackBonus:17,damageDie:12,damageBonus:9,initiativeBonus:5,threat:'AMEAÇA LENDÁRIA',xpReward:1500,emoji:'🌑',specialName:'Distorção do éter',specialDescription:'Dobra o espaço e enfraquece a proteção dos heróis por uma rodada.'},
    {id:'titã-primordial',portrait:'orc-warlord.webp',name:'Titã Primordial',kind:'Colosso ancestral',level:20,defense:29,hp:1100,maxHp:1100,attackBonus:21,damageDie:20,damageBonus:12,initiativeBonus:1,threat:'CHEFE DE REINO',xpReward:2400,emoji:'🗿',specialName:'Ruptura tectônica',specialDescription:'Golpe em área que exige reposicionamento ou teste para resistir.'},
    {id:'serpe-tempestade',portrait:'drakthar.webp',name:'Serpe da Tempestade',kind:'Dragão elemental',level:25,defense:34,hp:1650,maxHp:1650,attackBonus:26,damageDie:20,damageBonus:16,initiativeBonus:6,threat:'AMEAÇA ÉPICA',xpReward:3600,emoji:'🐉',specialName:'Ciclone elétrico',specialDescription:'Atinge a linha de frente e salta para um segundo alvo.'},
    {id:'rainha-cristal',portrait:'wraith.webp',name:'Rainha de Cristal',kind:'Soberana elemental',level:30,defense:40,hp:2300,maxHp:2300,attackBonus:31,damageDie:20,damageBonus:20,initiativeBonus:5,threat:'CHEFE ÉPICO',xpReward:5200,emoji:'💎',specialName:'Prisão prismática',specialDescription:'Aprisiona um aventureiro em cristal até que a equipe destrua a barreira.'},
    {id:'devorador-mare',portrait:'dire-wolf.webp',name:'Devorador das Marés',kind:'Leviatã abissal',level:35,defense:46,hp:3200,maxHp:3200,attackBonus:37,damageDie:20,damageBonus:25,initiativeBonus:3,threat:'CHEFE ÉPICO',xpReward:7200,emoji:'🌊',specialName:'Abismo voraz',specialDescription:'Inunda a arena e causa dano crescente enquanto os heróis não interrompem o ritual.'},
    {id:'arconte-solar',portrait:'paladin.webp',name:'Arconte do Sol Partido',kind:'Entidade radiante',level:40,defense:53,hp:4400,maxHp:4400,attackBonus:44,damageDie:20,damageBonus:30,initiativeBonus:7,threat:'CHEFE LENDÁRIO',xpReward:9800,emoji:'☀️',specialName:'Julgamento do meio-dia',specialDescription:'Marca todos os heróis; a marca explode após uma rodada se não for dissipada.'},
    {id:'colosso-umbra',portrait:'orc-warlord.webp',name:'Colosso da Umbra',kind:'Titã do vazio',level:45,defense:61,hp:5900,maxHp:5900,attackBonus:52,damageDie:20,damageBonus:38,initiativeBonus:2,threat:'CHEFE LENDÁRIO',xpReward:13000,emoji:'🌘',specialName:'Eclipse absoluto',specialDescription:'Apaga a luz da arena e invoca ecos hostis que devem ser derrotados.'},
    {id:'vharzun',portrait:'drakthar.webp',name:'Vharzun, o Dragão Ancião',kind:'Dragão primordial',level:50,defense:72,hp:9000,maxHp:9000,attackBonus:65,damageDie:20,damageBonus:50,initiativeBonus:8,threat:'CHEFE FINAL · NÍVEL 50',xpReward:20000,emoji:'🐲',specialName:'Ruptura Celestial',specialDescription:'Chefe final em três fases; cada fase altera a arena e libera um sopro devastador.'}
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

  BOOK_CONTENT.firststeps=[
    ['O que é RPG de mesa?','RPG é uma aventura contada em conjunto. O mestre descreve o mundo e interpreta as pessoas e criaturas. Cada jogador controla um aventureiro e decide o que ele tenta fazer. Não existe roteiro obrigatório para os jogadores: a história nasce das escolhas do grupo.',['Mestre: apresenta situações, interpreta NPCs e aplica as regras.','Jogadores: descrevem as ações e decisões de seus personagens.','Dados: ajudam a resolver ações arriscadas e incertas.']],
    ['Antes da primeira sessão','Reúna os participantes, confirme que todos possuem uma ficha e explique o tom da aventura. Cada jogador deve saber o nome, a classe, os pontos de vida e a habilidade principal do personagem. Combine respeito, tempo de jogo e temas que o grupo prefere evitar.',['O mestre lê a premissa e prepara a primeira cena.','Cada jogador apresenta seu personagem em uma ou duas frases.','O grupo decide por que seus aventureiros viajam juntos.']],
    ['O que o jogador faz durante a partida','Escute a descrição, imagine o que seu personagem percebe e diga o que ele tenta fazer. Fale em primeira pessoa ou descreva de fora: ambos funcionam. Você não precisa interpretar com voz ou atuar; basta comunicar intenção.',['Exemplo: “Quero examinar as pegadas perto da árvore”.','Exemplo: “Pergunto à guarda se alguém passou por aqui”.','Exemplo: “Fico atrás do guerreiro enquanto preparo meu arco”.']],
    ['O papel do mestre','O mestre não joga contra os participantes. Sua função é apresentar desafios interessantes, manter o ritmo e decidir consequências de forma coerente. Não esconda informações que os personagens perceberiam e não exija rolagem para ações simples sem risco.',['Descreva o que os personagens veem, ouvem e sentem.','Pergunte “O que vocês fazem?” e espere as decisões.','Se houver risco e incerteza, peça um teste e explique o que está em jogo.']],
    ['Como funciona um teste de D20','Quando uma ação arriscada não tem resultado garantido, o mestre solicita um D20 e informa o atributo ou a justificativa. O resultado é comparado à dificuldade definida pelo mestre. Sucesso significa alcançar o objetivo; falha deve criar uma consequência ou custo, não necessariamente interromper a história.',['O mestre explica o teste: por exemplo, Percepção para notar rastros.','O jogador rola o D20 pelo pedido na interface.','O mestre interpreta o resultado e registra a descoberta ou consequência.']],
    ['Como conduzir uma missão','Uma missão apresenta uma situação, um objetivo e etapas. Leia o resumo, aceite a missão no painel Jornada e Missões e acompanhe os objetivos listados. O mestre apresenta cada etapa em cena; os jogadores dizem como pretendem resolvê-la. Quando a ação for realizada, o mestre marca o objetivo correspondente.',['1. Receber a missão de um NPC ou acontecimento.','2. Ler o objetivo atual e perguntar o que pode ser investigado.','3. Viajar, conversar, explorar, negociar ou combater.','4. O mestre confirma o objetivo e atualiza o painel.','5. Ao concluir todos os objetivos, revisar e entregar a recompensa.']],
    ['Cena Interativa: o que é e como usar','A Cena Interativa é a parte narrativa e exploratória. Ela não é um minijogo nem exige combate. O mestre publica capítulo, local e narração; os jogadores descrevem ações. A exploração do mundo apresenta lugares, NPCs, pistas e objetos que podem ser descobertos. O mapa tático é usado quando a posição exata das peças importa.',['Mestre: escolha uma cena preparada ou escreva uma narração.','Jogadores: digam quem abordam, o que examinam e para onde vão.','Mestre: revele NPCs, abra interações e solicite testes quando houver risco.','Registre descobertas e decisões no diário da campanha.']],
    ['Como usar o mapa tático 2D','O tabuleiro possui 10 colunas e 8 linhas. As casas são identificadas por coluna e linha. Uma casa escura com símbolo de terreno representa obstáculo: não é possível atravessá-la nem terminar nela. Casas livres permitem movimento, desde que exista caminho desimpedido.',['Jogadores: peça ao mestre para mover sua miniatura; em campanha conectada, o movimento pode aguardar aprovação.','Mestre: selecione uma miniatura e use Mover peça; escolha uma casa livre.','Árvores, rochas, água profunda, muros e portas fechadas bloqueiam passagem.','A névoa esconde casas ainda não exploradas para os jogadores.']],
    ['Como iniciar e jogar um combate','O mestre abre Iniciar encontro e marca uma ou mais criaturas. Cada inimigo aparece como uma peça individual com HP próprio e participa da ordem de iniciativa. Os turnos alternam entre aventureiros e criaturas. O mestre resolve o turno de cada monstro pela ação disponível na mesa.',['Mestre: escolha criaturas adequadas ao grupo e ao local.','Jogadores: no próprio turno, escolham ataque, habilidade ou item.','O sistema compara o ataque à Defesa do inimigo e aplica dano.','Cada monstro derrotado deixa de agir; o encontro termina quando todos forem derrotados.']],
    ['Movimento, terreno e posicionamento','Durante o combate, o deslocamento máximo padrão é de quatro casas por turno. O caminho precisa estar livre: não se pode atravessar outra peça, parede, rocha, árvore, água bloqueada ou porta fechada. O mestre pode usar o terreno para criar escolhas táticas.',['Fique atrás de aliados resistentes quando precisar de proteção.','Use corredores e passagens estreitas para limitar aproximações.','O mestre pode colocar baús, armadilhas, portas e altares em casas livres.']],
    ['Interpretar NPCs e monstros','NPCs são pessoas do mundo, com objetivos e informações próprias. Monstros também têm comportamento: alguns caçam, outros guardam lugares, fogem, negociam ou protegem um ritual. Nem todo encontro precisa terminar em luta.',['Mestre: defina o que a criatura quer antes de interpretar sua reação.','Jogadores: conversem, observem sinais e considerem alternativas ao combate.','O mestre revela um NPC quando a companhia o encontra.']],
    ['Encerrar uma sessão e continuar depois','Ao final, o mestre resume o que mudou, registra descobertas e decisões e salva a sessão. Anote objetivos pendentes, NPCs importantes, recompensas entregues e pistas para a próxima vez. Na sessão seguinte, comece com um resumo curto.',['Uma decisão importante do grupo.','Uma consequência no mundo.','Uma pergunta ou ameaça para a próxima sessão.']]
  ];
  const BOOK_V210_CHAPTERS={
    master:['Condução de uma sessão para iniciantes','Use o ciclo descrever, perguntar, ouvir, resolver e registrar. A Cena Interativa é a conversa narrativa; o mapa tático entra quando posições e obstáculos importam. Não force o grupo a seguir uma única solução.',['Leia a narração em voz alta ou adapte-a.','Pergunte a cada jogador o que seu personagem faz.','Marque objetivos depois de confirmar a ação na ficção.']],
    adventurer:['Como agir em cenas e no tabuleiro','O jogador declara a intenção e deixa o mestre esclarecer riscos. No mapa, personagens comuns ocupam uma casa e bases de criaturas grandes reservam todas as casas de sua área. Casas bloqueadas não podem ser atravessadas. Em combate, aguarde seu turno e escolha o alvo disponível.',['Descreva ações, não apenas resultados desejados.','Use coordenadas para indicar posições.','Consulte o manual Primeiros Passos quando tiver dúvida.']],
    bestiary:['Encontros com grupos de criaturas','A preparação do encontro permite selecionar até seis criaturas. Cada uma recebe peça, HP e iniciativa próprios. O mestre deve escolher a composição conforme o nível do grupo e o ambiente.',['Misture funções e comportamentos em vez de repetir sempre a mesma criatura.','Posicione cada inimigo em uma casa livre.','O encontro termina quando todas as criaturas forem derrotadas ou o mestre o encerrar.']],
    bosses:['Arena, posicionamento e peças individuais','Chefes e monstros são representados por estátuas individuais sobre bases. As bases de chefes ocupam de 2×2 a 3×3 casas; todas as casas da base ficam reservadas para a criatura. Use rochas, colunas, portas e corredores para dar identidade à arena.',['Anuncie ataques especiais e dê oportunidade de reação.','Não coloque criaturas sobre obstáculos ou personagens.','Descreva visualmente o que muda entre as fases do chefe.']],
    atlas:['Cavernas e habitats subterrâneos','Três mapas de cavernas foram adicionados: Umbrafunda, Gruta das Brasas e Abismo de Cristal. Use-os quando a história levar a companhia a tocas, túneis vulcânicos ou galerias glaciais.',['Umbrafunda: rochas, raízes e teias.','Gruta das Brasas: lava e rocha vulcânica.','Abismo de Cristal: cristais e corredores congelados.']]
  };
  Object.entries(BOOK_V210_CHAPTERS).forEach(([id,ch])=>{if(BOOK_CONTENT[id])BOOK_CONTENT[id].push([ch[0],ch[1],ch[2]])});
  const BOOK_FIELD_GUIDES={master:['Consequências e continuidade','Ao fim de cada sessão, anote três elementos: uma decisão dos heróis, uma mudança no mundo e uma ameaça que continua ativa. Na sessão seguinte, mostre pelo menos uma consequência concreta.',['Decisão: quem foi protegido, convencido ou contrariado?','Mundo: que local, facção ou recurso mudou?','Ameaça: o que o inimigo fez enquanto os heróis descansavam?']],bestiary:['Ecologia e sinais de criaturas','Antes de apresentar um monstro, descreva sinais que permitam aos jogadores deduzir seu comportamento. Pegadas, marcas, odores, restos de alimento e mudanças no ambiente podem antecipar o encontro.',['Predadores deixam rastros e restos de caça.','Construtos costumam proteger uma área ou mecanismo.','Criaturas inteligentes podem negociar, recuar ou preparar emboscadas.']],bosses:['Arenas e objetivos alternativos','Uma batalha memorável pode ter um objetivo além de reduzir HP: proteger um NPC, interromper um ritual, alcançar um mecanismo ou sobreviver até uma passagem abrir.',['Apresente o objetivo antes da luta começar.','Dê ao cenário pelo menos duas interações úteis.','Permita vitória por estratégia quando a ficção sustentar essa solução.']],atlas:['Rotas, viagens e regiões','Divida uma viagem longa em trechos com uma escolha ou complicação por etapa. Nem todo deslocamento precisa de combate; clima, recursos e encontros sociais também contam a história.',['Defina o destino e o risco antes da partida.','Use pontos de referência para orientar os jogadores.','Registre locais descobertos no diário da companhia.']],grimoire:['Limites e contrajogo mágico','Toda magia de grande impacto deve permitir que a mesa compreenda seus limites e formas de resposta. Resistências, componentes, alcance e consequências tornam os poderes interessantes sem retirar escolhas.',['Declare alcance e alvo.','Informe duração e custo.','Descreva como interromper ou resistir ao efeito.']],arsenal:['Entrega e registro de tesouros','Quando uma recompensa for entregue, confirme quem a recebeu e registre quantidade, descrição e eventual condição de uso. Itens únicos devem possuir identificadores estáveis para evitar duplicação em atualizações.',['Consumíveis acumulam quantidade pelo mesmo identificador.','Relíquias únicas devem ser entregues uma vez por personagem.','Acorde bônus mecânicos antes de aplicá-los à ficha.']],adventurer:['Recompensas e inventário','Confira o inventário depois de cada missão. Poções e materiais podem ser acumulados; relíquias de história devem ser preservadas e descritas na ficha. O mestre deve esclarecer se um tesouro é individual ou compartilhado.',['Confira quantidade e descrição do item.','Avise o grupo quando uma relíquia for importante para a história.','Não presuma bônus que não estejam escritos na ficha.']]};
  Object.entries(BOOK_FIELD_GUIDES).forEach(([id,chapter])=>{if(BOOK_CONTENT[id]&&BOOK_CONTENT[id].length<5)BOOK_CONTENT[id].push([chapter[0],chapter[1],chapter[2]]);});
  const BOOK_ADVANCED_CHAPTERS={master:['Ferramentas para improvisar','Quando os jogadores seguirem um caminho inesperado, preserve a intenção da cena e adapte a forma. Reaproveite pistas, altere a posição de NPCs e transforme obstáculos em escolhas, em vez de bloquear a sessão.',['Se a pista principal for ignorada, apresente outra evidência em uma cena posterior.','Se um NPC não for encontrado, permita que uma mensagem ou testemunha leve até ele.','Se o grupo evitar um combate, registre como a ameaça reage.']],bestiary:['Montagem de encontros por função','Escolha criaturas por função na cena: pressão, controle, resistência ou suporte. Um encontro variado costuma ser mais interessante que vários inimigos idênticos, mas a quantidade deve respeitar o nível e o tamanho do grupo.',['Pressão: inimigos rápidos que ameaçam personagens isolados.','Controle: criaturas que alteram terreno ou limitam deslocamento.','Resistência: guardiões com defesa ou HP elevados.']],bosses:['Telegráfos e janelas de resposta','Ataques de chefe devem ser anunciados com sinais claros. Uma criatura pode preparar um sopro, erguer uma arma ou concentrar energia antes de executar a ação. Isso cria uma janela para defesa, interrupção ou reposicionamento.',['Descreva o sinal antes de aplicar o efeito.','Defina uma resposta possível para cada ataque especial.','Varie o objetivo entre fases para evitar repetição.']],atlas:['Pontos de interesse e exploração','Ao criar uma localidade, pense em três elementos: um marco visual, uma atividade cotidiana e uma tensão local. Esses detalhes tornam a região útil mesmo quando não há combate ou missão ativa.',['Marco: torre, ponte, mercado, ruína ou formação natural.','Vida local: ofício, celebração, rota comercial ou costume.','Tensão: escassez, disputa, perigo ou segredo.']],grimoire:['Conjuração em cenas narrativas','Nem toda magia precisa causar dano. Feitiços podem revelar vestígios, proteger uma travessia, traduzir inscrições ou criar uma distração. O mestre deve distinguir efeito narrativo de bônus mecânico e registrar qualquer regra nova acordada.',['Declare o que a magia pode revelar e o que permanece oculto.','Evite que uma única magia encerre todos os desafios de uma cena.','Mantenha custos e limites consistentes entre sessões.']],arsenal:['Manutenção, carga e itens especiais','Itens consumíveis devem ter quantidade visível e descrição curta. Equipamentos podem receber história, origem e aparência próprias, mas seus bônus mecânicos precisam estar registrados na ficha antes de afetar ataques ou Defesa.',['Registre cargas e usos restantes de itens especiais.','Não venda relíquias de missão sem decisão explícita da mesa.','Separe aparência, raridade e efeito mecânico.']],adventurer:['Planejamento de sessão e recursos','Antes de uma expedição, confira HP, poções, moedas e objetivos ativos. Durante a jornada, comunique ao grupo quando um recurso for gasto ou quando uma decisão puder alterar o rumo da história.',['Combine uma ordem de marcha quando houver perigo.','Defina quem carrega itens importantes.','Reserve recursos para o caminho de volta.']]};
  Object.entries(BOOK_ADVANCED_CHAPTERS).forEach(([id,chapter])=>{if(BOOK_CONTENT[id]&&BOOK_CONTENT[id].length<6)BOOK_CONTENT[id].push([chapter[0],chapter[1],chapter.slice(2)]);});
  const BOOK_CAMPAIGN_CHAPTERS={master:['Campanhas ramificadas','Uma campanha ramificada não exige escrever finais inteiros para cada escolha. Registre fatos persistentes — alianças, recursos, promessas e ameaças — e deixe que eles alterem cenas futuras.',['Use storyFlags para lembrar decisões importantes.','Reapresente consequências em NPCs, preços, rotas e missões.','Evite apagar decisões antigas ao atualizar o estado da campanha.']],bestiary:['Criaturas e equipamento','Encontros devem considerar o equipamento disponível ao grupo. Uma criatura resistente pode exigir armas de maior impacto, enquanto inimigos ágeis desafiam personagens com pouca Defesa.',['Observe o dano-base das armas equipadas.','Considere a Defesa efetiva de armaduras e escudos.','Não aumente a dificuldade apenas para neutralizar uma compra recente.']],bosses:['Chefes contra grupos equipados','Ao criar um chefe, considere o dano potencial da companhia e sua Defesa efetiva. Ofereça ameaças variadas, mas mantenha sinais claros e oportunidades de resposta.',['Teste o encontro com o equipamento atual dos personagens.','Varie pressão, controle e resistência.','Não torne um item recém-adquirido inútil sem uma razão narrativa.']],atlas:['Oficinas e rotas comerciais','Cada reino pode ter oficinas especializadas. Drakmor trabalha metais e armas; Nivéria preserva ligas e cristais; Thalassor negocia materiais marítimos; Solária trabalha ligas leves; Eldoria oferece couro e madeira viva.',['Use preços como referência, não como punição.','Associe mercadorias a recursos e cultura locais.','Registre a origem de equipamentos raros.']],grimoire:['Magia e proteção','Magias defensivas e equipamentos podem coexistir se seus efeitos forem distintos. Defina se uma proteção substitui, soma ou apenas reduz uma consequência específica.',['Evite somar bônus idênticos sem limite combinado.','Declare duração e condição de término.','Registre efeitos temporários separadamente do equipamento.']],arsenal:['Equipamento funcional na v2.0','Armas equipadas definem o dado-base de dano apresentado pela ficha de combate. Armaduras e escudos contribuem para a Defesa efetiva. O mestre confirma trocas no comércio e o estado fica salvo em partyState.',['Arma: slot weapon e propriedade damageDie.','Armadura: slot armor e propriedade defense.','Escudo: slot shield e propriedade defense.']],adventurer:['Equipar, comparar e cuidar','Antes de uma aventura, confira a arma, a armadura, o escudo e a mochila. A troca é conduzida pelo mestre ativo nesta versão para evitar conflitos de sincronização entre jogadores.',['Compare o dado de dano da arma.','Some os bônus de Defesa de armadura e escudo.','Confira moedas e quantidade antes de comprar.']]};
  Object.entries(BOOK_CAMPAIGN_CHAPTERS).forEach(([id,ch])=>{if(BOOK_CONTENT[id]&&BOOK_CONTENT[id].length<7)BOOK_CONTENT[id].push([ch[0],ch[1],ch[2]]);});
  const BOOK_EQUIPMENT_CHAPTERS={master:['Economia e progressão de equipamento','Itens raros devem surgir como recompensa de desafios relevantes ou mercadorias de alto custo. Requisitos de classe e nível ajudam a preservar identidade e progressão sem impedir que a companhia negocie alternativas.',['Apresente o requisito antes da compra.','Use a escala de raridade v2.2 para conceder bônus mecânicos e confira os requisitos antes de equipar.','Revise o poder do grupo antes de introduzir novas peças.']],bestiary:['Ameaças contra armaduras e armas','Monstros podem desafiar diferentes perfis de equipamento sem anular bônus. Use ataques variados, condições de terreno e objetivos táticos em vez de simplesmente ignorar a Defesa dos heróis.',['Ataques precisos pressionam alvos com Defesa baixa.','Efeitos de área criam decisões de posicionamento.','Resistência elevada deve vir acompanhada de uma fraqueza ou objetivo alternativo.']],bosses:['Tesouros de chefes','Uma recompensa de chefe deve ter vínculo com a criatura ou com o local. Itens de conjunto podem ser distribuídos em etapas, criando objetivos de campanha sem exigir que todas as peças apareçam de uma vez.',['Entregue uma peça como marco de progresso.','Mostre pistas sobre as peças restantes.','Não exija uma combinação específica para vencer o chefe.']],atlas:['Guildas e conjuntos regionais','As guildas de Aethra preservam técnicas próprias. A Vanguarda é um conjunto marcial associado a combatentes de linha de frente; outras regiões podem desenvolver conjuntos ligados a seus materiais e tradições.',['Drakmor: ligas resistentes e armas de impacto.','Nivéria: cristais de foco e precisão.','Eldoria: couro vivo e materiais flexíveis.']],grimoire:['Focos raros e afinidade','Focos arcanos podem melhorar precisão ou dano de uma arma sem alterar automaticamente o custo das magias. Diferencie o ataque com arma do efeito especial de classe e mantenha os bônus visíveis na ficha.',['Precisão é bônus no teste de ataque.','Bônus de dano soma ao dano da arma.','Efeitos de magia continuam seguindo as regras da habilidade.']],arsenal:['Raridades, requisitos e conjuntos','A raridade agora concede bônus mecânicos escalonados: Comum +1, Incomum +3, Raro +10, Épico +25, Lendário +100 e Mítico +150. O conjunto Vanguarda concede +5 Defesa e +5 no ataque quando suas três peças Raras estão equipadas.',['Verifique requiredLevel e requiredClasses antes de equipar.','SetId identifica peças pertencentes ao mesmo conjunto.','Bônus de conjunto só é aplicado quando as três peças estão equipadas.']],adventurer:['Escolha de equipamento','Compare o dado de dano, precisão, bônus de dano e Defesa. Antes de comprar, confira nível e classe exigidos. Uma peça rara pode ser poderosa, mas não será necessariamente melhor para toda construção de personagem.',['Armas alteram dano e/ou precisão.','Armaduras e escudos aumentam Defesa.','Conjuntos completos podem oferecer bônus adicionais.']]};
  Object.entries(BOOK_EQUIPMENT_CHAPTERS).forEach(([id,ch])=>{if(BOOK_CONTENT[id]&&BOOK_CONTENT[id].length<8)BOOK_CONTENT[id].push([ch[0],ch[1],ch[2]]);});
  const BOOK_LEVEL_50_CHAPTERS={master:['Condução de campanhas até o nível 50','A progressão longa exige marcos claros. Use os níveis 1–10 para apresentar o mundo, 11–25 para consolidar especializações, 26–40 para ameaças regionais e 41–50 para o arco final. Ajuste a quantidade de encontros à frequência real das sessões.',['Nível 1–10: perigos locais e equipamento comum/raro.','Nível 11–25: chefes regionais e itens épicos.','Nível 26–40: ameaças de reino e conjuntos avançados.','Nível 41–50: relíquias lendárias e o confronto com Vharzun.']],bestiary:['Escala de ameaça até o nível 50','As criaturas de alto nível possuem HP, Defesa, ataque e recompensas adequados à faixa indicada. O início de encontro também considera o nível médio do grupo para evitar que monstros antigos permaneçam frágeis quando a companhia retorna a uma região.',['Compare nível da criatura e nível médio do grupo.','Chefes recebem multiplicador de resistência.','Use habilidades especiais e objetivos de arena, não apenas HP elevado.']],bosses:['Vharzun e as três fases finais','Vharzun é o chefe de nível 50 e representa o clímax da campanha. Suas fases aumentam Defesa e ataque, e o sopro ancestral escala conforme a etapa. Avise os jogadores antes de ataques em área e ofereça oportunidades de interromper ou evitar o efeito.',['Fase I: Ruptura desperta.','Fase II: As cinco chamas.','Fase III: O fim dos reinos.']],atlas:['Aethra além dos cinco reinos','As regiões tardias revelam territórios corrompidos pela Ruptura Celestial: o Ermo Carmesim, o Limiar do Vazio, as Cúpulas Prismáticas e a Prisão Celestial. Use essas localidades como etapas de uma campanha de níveis 11 a 50.',['Ermo Carmesim: trilhas de quimeras e forjas antigas.','Limiar do Vazio: fendas e arautos extraplanares.','Prisão Celestial: rota final até Vharzun.']],grimoire:['Poderes e proteção em escala lendária','Em níveis altos, os valores de ataque e Defesa podem alcançar dezenas ou centenas. Preserve a leitura do combate: declare claramente o bônus efetivo, mantenha as rolagens visíveis e diferencie dano físico, mágico e efeitos de área.',['Ataque soma precisão e bônus de raridade.','Dano soma o bônus da arma ao resultado do dado.','Defesa soma Destreza, armadura, escudo e conjunto.']],arsenal:['Raridades de Comum a Mítico','A raridade passa a conceder bônus mecânicos por peça: Comum +1, Incomum +3, Raro +10, Épico +25, Lendário +100 e Mítico +150. Armas recebem ataque e dano; armaduras e escudos recebem Defesa. Conjuntos completos somam um bônus adicional conforme a raridade.',['Comum: +1.','Incomum: +3.','Raro: +10.','Épico: +25.','Lendário: +100.','Mítico: +150.']],adventurer:['Planejando a jornada até o nível 50','A progressão até o nível 50 é uma jornada longa. A cada nível, o personagem recebe +10 HP e melhora um atributo principal até o limite de 30. O XP necessário para o próximo nível é igual ao nível atual × 100.',['Nível 10: 1.000 XP para o próximo nível.','Nível 25: 2.500 XP para o próximo nível.','Nível 49: 4.900 XP para o nível 50.','No nível 50, XP adicional não concede níveis acima do limite.']]};
  Object.entries(BOOK_LEVEL_50_CHAPTERS).forEach(([id,ch])=>{if(BOOK_CONTENT[id]&&BOOK_CONTENT[id].length<9)BOOK_CONTENT[id].push([ch[0],ch[1],ch[2]]);});
  const BOOK_FORGE_CHAPTERS={master:['A Forja de Tovin e Brann','A forja permite aprimorar peças equipadas e aplicar um encantamento. O mestre ativo seleciona o aventureiro no mercado, verifica materiais e confirma cada operação. Os custos são consumidos somente após todas as validações.',['Aprimoramento máximo: +3, com +5 no atributo principal por nível.','Encantamento único por peça: Precisão, Chama ou Guardião.','Falhas não destroem equipamentos; operações inválidas não consomem recursos.']],arsenal:['Aprimoramentos e encantamentos','Fragmentos de Forja elevam armas, armaduras e escudos até +3. Essências Arcanas permitem um encantamento por peça. Precisão concede +5 ataque, Chama concede +5 dano e Guardião concede +5 Defesa.',['+1: 1 Fragmento e 700 PO.','+2: 2 Fragmentos e 1.400 PO.','+3: 3 Fragmentos e 2.100 PO.','Encantar: 2 Essências e 1.200 PO.']],adventurer:['Evoluir o equipamento','O aventureiro pode comprar materiais no mercado e pedir ao ferreiro que trabalhe em uma peça já equipada. O mestre ativo confirma a operação e o resultado aparece no inventário e nos cálculos de combate.',['Aprimoramento soma +5 por nível ao atributo principal.','Cada peça aceita apenas um encantamento.','Armas aceitam Precisão ou Chama; armaduras e escudos aceitam Guardião.']]};
  Object.entries(BOOK_FORGE_CHAPTERS).forEach(([id,ch])=>{if(BOOK_CONTENT[id]&&BOOK_CONTENT[id].length<11)BOOK_CONTENT[id].push([ch[0],ch[1],ch[2]]);});
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
  // Biblioteca oficial: mapas, grade, imagem, portas, entradas, saídas e Pontos de Interesse
  // vêm exclusivamente do pacote multimapas exportado pelo mestre. Não há fallback silencioso
  // para mapas antigos, evitando que o site misture imagens/configurações de versões anteriores.
  const AETHRA_IMPORTED_MAPS = Array.isArray(window.AETHRA_MAP_LIBRARY) ? window.AETHRA_MAP_LIBRARY : [];
  if (!AETHRA_IMPORTED_MAPS.length) {
    console.error('A biblioteca oficial de mapas não foi carregada. Confira assets/maps/maps-data.js.');
  }
  const AETHRA_IMPORTED_MAPS_BY_ID = Object.fromEntries(AETHRA_IMPORTED_MAPS.map(item => [item.id, item]));
  const MAP_TEMPLATES = AETHRA_IMPORTED_MAPS.map(item => ({
    id:item.id,name:item.name,subtitle:item.subtitle,theme:item.theme,layout:item.layout,
    image:item.image,features:item.features,width:item.width||10,height:item.height||8
  }));
  function mapBoardFeatures(mapId){return AETHRA_IMPORTED_MAPS_BY_ID[mapId]?.features||{doors:[],points:[]}}
  function defaultBoardMarkers(mapId){const data=mapBoardFeatures(mapId),template=mapTemplate(mapId),doors=[...(data.doors||[])];const occupied=new Set(doors.map(d=>`${d.x},${d.y}`));for(let y=0;y<template.layout.length;y++)for(let x=0;x<template.layout[y].length;x++)if(template.layout[y][x]==='d'&&!occupied.has(`${x},${y}`))doors.push({id:`layout-door-${mapId}-${x}-${y}`,x,y,name:`Porta ${String.fromCharCode(65+x)}${y+1}`,description:'Porta representada na passagem da planta. O mestre pode abrir ou fechar pela ferramenta de porta.'});return [...doors.map(d=>({id:d.id,type:'door',x:d.x,y:d.y,open:d.open===true,discovered:true,boardDefault:true,name:d.name,description:d.description})),...(data.altars||[]).map(a=>({id:a.id,type:'altar',x:a.x,y:a.y,discovered:false,boardDefault:true,name:a.name,description:a.description}))]}
  function createBoardRecord(mapId){return {playersVisible:false,fogEnabled:false,revealedCells:[],tokens:{},markers:defaultBoardMarkers(mapId),boardDefaultsApplied:true}}

  const DIALOGUE_CHOICES = {
    ilyra:[{id:'follow-tracks',label:'Pedir que Ilyra mostre os rastros',reply:'Ilyra marca no mapa uma trilha segura até a torre.',flag:'ilyra_trail_known',log:'Ilyra revelou uma trilha segura até a Torre dos Vigias.'},{id:'ask-wildlife',label:'Perguntar sobre os animais desaparecidos',reply:'Ela explica que as criaturas fogem de um cheiro de cinzas vindo do norte.',flag:'wildlife_clue_known',log:'A companhia descobriu que os animais fogem de um odor de cinzas vindo do norte.'}],
    tovin:[{id:'request-discount',label:'Negociar um desconto para a companhia',reply:'Tovin concorda em oferecer preços melhores depois que recuperar suas ferramentas.',flag:'tovin_discount_promised',log:'Tovin prometeu um desconto quando suas ferramentas forem recuperadas.'},{id:'ask-forge',label:'Perguntar sobre as forjas de Drakmor',reply:'O ferreiro conta que antigas marcas de fogo aparecem em armas ligadas a Drakmor.',flag:'drakmor_forge_clue',log:'Tovin compartilhou uma pista sobre as antigas marcas de fogo de Drakmor.'}],
    cael:[{id:'learn-prayer',label:'Aprender a oração das cinco luzes',reply:'Cael ensina os primeiros versos da oração de Elyndra.',flag:'five_lights_prayer',log:'Cael ensinou à companhia os primeiros versos da oração das cinco luzes.'},{id:'ask-protection',label:'Pedir uma bênção para a jornada',reply:'Cael abençoa a companhia e pede que protejam os inocentes.',flag:'cael_blessing',log:'A companhia recebeu a bênção de Cael antes de seguir viagem.'}]
  };
  const SHOP_ITEMS = [
    {id:'pocao-cura',name:'Poção de Cura',kind:'consumable',price:18,qty:1,healDie:8,healBonus:2,description:'Recupera 1d8 + 2 pontos de vida.'},
    {id:'pocao-vigor',name:'Tônico de Vigor',kind:'consumable',price:28,qty:1,description:'Tônico para momentos de esforço; efeito narrativo definido pelo mestre.'},
    {id:'fragmento-forja',name:'Fragmento de Forja',kind:'material',price:180,qty:1,description:'Material de Drakmor usado para aprimorar equipamentos.'},
    {id:'essencia-arcana',name:'Essência Arcana',kind:'material',price:320,qty:1,description:'Essência condensada usada para encantar uma peça de equipamento.'},
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
    {id:'foco-aurora',name:'Foco da Aurora',kind:'equipment',slot:'weapon',price:230,qty:1,damageDie:8,accuracy:1,damageBonus:1,rarity:'Raro',requiredLevel:4,requiredClasses:['Arcano','Clérigo','Druida','Invocador'],description:'Foco raro; 1d8 + 1 dano e +1 no ataque.'},
    {id:'espada-aurora-eterna',name:'Espada da Aurora Eterna',kind:'equipment',slot:'weapon',setId:'aurora-eterna',price:18000,qty:1,damageDie:20,rarity:'Épico',requiredLevel:25,requiredClasses:['Guerreiro','Paladino','Assassino'],description:'Arma épica; +25 ataque e +25 dano, além do dado-base 1d20.'},
    {id:'armadura-aurora-eterna',name:'Couraça da Aurora Eterna',kind:'equipment',slot:'armor',setId:'aurora-eterna',price:16500,qty:1,defense:25,rarity:'Épico',requiredLevel:25,requiredClasses:['Guerreiro','Paladino'],description:'Armadura épica; +25 Defesa adicional pela raridade.'},
    {id:'escudo-aurora-eterna',name:'Égide da Aurora Eterna',kind:'equipment',slot:'shield',price:14000,qty:1,defense:20,rarity:'Épico',setId:'aurora-eterna',requiredLevel:25,requiredClasses:['Guerreiro','Paladino'],description:'Escudo épico; parte do conjunto Aurora Eterna.'},
    {id:'lamina-celestial',name:'Lâmina Celestial de Elyndra',kind:'equipment',slot:'weapon',price:120000,qty:1,damageDie:20,rarity:'Lendário',setId:'celestial',requiredLevel:45,requiredClasses:['Guerreiro','Paladino','Assassino'],description:'Arma lendária; +100 ataque e +100 dano.'},
    {id:'armadura-celestial',name:'Armadura Celestial de Elyndra',kind:'equipment',slot:'armor',price:110000,qty:1,defense:100,rarity:'Lendário',setId:'celestial',requiredLevel:45,requiredClasses:['Guerreiro','Paladino'],description:'Armadura lendária; +100 Defesa adicional pela raridade.'},
    {id:'escudo-celestial',name:'Escudo Celestial de Elyndra',kind:'equipment',slot:'shield',price:95000,qty:1,defense:100,rarity:'Lendário',setId:'celestial',requiredLevel:45,requiredClasses:['Guerreiro','Paladino'],description:'Escudo lendário; parte do conjunto Celestial.'}
  ];
  const LOOT_ITEMS = {
    'couro-lobo':{id:'couro-lobo',name:'Couro de Lobo Cinzento',kind:'material',qty:1,price:35,description:'Material de Eldoria usado em peças leves.'},
    'presa-lobo':{id:'presa-lobo',name:'Presa de Lobo',kind:'material',qty:1,price:22,description:'Componente resistente para armas e amuletos.'},
    'cinza-viva':{id:'cinza-viva',name:'Cinza Viva',kind:'material',qty:1,price:45,description:'Resíduo ígneo de criaturas corrompidas.'},
    'fragmento-forja':{id:'fragmento-forja',name:'Fragmento de Forja',kind:'material',qty:1,price:180,description:'Material de Drakmor usado para aprimorar equipamentos.'},
    'essencia-arcana':{id:'essencia-arcana',name:'Essência Arcana',kind:'material',qty:1,price:320,description:'Essência condensada usada para encantar uma peça de equipamento.'},
    'cristal-niveriano':{id:'cristal-niveriano',name:'Cristal Niveriano',kind:'material',qty:1,price:110,description:'Cristal frio usado em focos e proteções.'},
    'coral-abissal':{id:'coral-abissal',name:'Coral Abissal',kind:'material',qty:1,price:95,description:'Componente raro encontrado nas profundezas de Thalassor.'},
    'escama-ancestral':{id:'escama-ancestral',name:'Escama Ancestral',kind:'material',qty:1,price:260,description:'Escama dracônica que conserva calor primordial.'},
    'nucleo-vazio':{id:'nucleo-vazio',name:'Núcleo do Vazio',kind:'material',qty:1,price:480,description:'Fragmento instável de uma criatura extraplanar.'},
    'reliquia-raiz':{id:'reliquia-raiz',name:'Broto da Raiz Eterna',kind:'relic',rarity:'Épico',slot:'shield',defense:8,requiredLevel:12,qty:1,price:0,description:'Relíquia de Eldoria. Uma vez por encontro, o mestre pode permitir recuperar 2d8 HP.'},
    'lamina-braseiro':{id:'lamina-braseiro',name:'Lâmina do Coração de Brasa',kind:'equipment',slot:'weapon',damageDie:12,accuracy:3,damageBonus:4,rarity:'Épico',requiredLevel:15,requiredClasses:['Guerreiro','Paladino','Assassino'],setId:'cinzas-forjadas',qty:1,price:0,description:'Arma exclusiva de Malgor, forjada nas chamas de Drakmor.'},
    'couraca-mare':{id:'couraca-mare',name:'Couraça do Guardião das Marés',kind:'equipment',slot:'armor',defense:12,rarity:'Épico',requiredLevel:18,requiredClasses:['Guerreiro','Paladino'],setId:'mare-ancestral',qty:1,price:0,description:'Armadura exclusiva do Devorador das Marés.'},
    'foco-prisma':{id:'foco-prisma',name:'Foco da Rainha Prismática',kind:'equipment',slot:'weapon',damageDie:12,accuracy:5,damageBonus:5,rarity:'Lendário',requiredLevel:30,requiredClasses:['Arcano','Clérigo','Druida','Invocador'],qty:1,price:0,description:'Foco exclusivo da Rainha de Cristal.'},
    'manoplas-tita':{id:'manoplas-tita',name:'Manoplas do Titã Primordial',kind:'equipment',slot:'shield',defense:18,rarity:'Lendário',requiredLevel:20,requiredClasses:['Guerreiro','Paladino'],setId:'titã-primordial',qty:1,price:0,description:'Manoplas lendárias que carregam a força tectônica do Titã.'},
    'diadema-solar':{id:'diadema-solar',name:'Diadema do Arconte Solar',kind:'equipment',slot:'armor',defense:28,rarity:'Lendário',requiredLevel:40,requiredClasses:['Paladino','Clérigo','Arcano'],qty:1,price:0,description:'Armadura-relicário exclusiva do Arconte do Sol Partido.'},
    'manto-umbra':{id:'manto-umbra',name:'Manto do Eclipse Absoluto',kind:'equipment',slot:'armor',defense:35,rarity:'Mítico',requiredLevel:45,requiredClasses:['Guerreiro','Paladino','Arcano','Clérigo','Druida','Invocador','Patrulheiro','Assassino'],qty:1,price:0,description:'Peça Mítica exclusiva do Colosso da Umbra.'},
    'coracao-vharzun':{id:'coracao-vharzun',name:'Coração de Vharzun',kind:'relic',rarity:'Mítico',slot:'shield',defense:25,requiredLevel:50,qty:1,price:0,description:'Relíquia final. Uma vez por encontro, reduz em 20 o dano recebido pelo portador.'},
    'coroa-cinzas':{id:'coroa-cinzas',name:'Coroa do General das Cinzas',kind:'equipment',slot:'armor',defense:10,rarity:'Épico',requiredLevel:10,requiredClasses:['Guerreiro','Paladino','Arcano','Clérigo'],setId:'cinzas-forjadas',qty:1,price:0,description:'Peça exclusiva de Malgor, marcada pela guerra de Drakmor.'},
    'broquel-cinzas':{id:'broquel-cinzas',name:'Broquel da Guarda de Cinzas',kind:'equipment',slot:'shield',defense:8,rarity:'Épico',requiredLevel:10,requiredClasses:['Guerreiro','Paladino'],setId:'cinzas-forjadas',qty:1,price:0,description:'Escudo do conjunto Cinzas Forjadas.'},
    'martelo-tita':{id:'martelo-tita',name:'Martelo do Núcleo Primordial',kind:'equipment',slot:'weapon',damageDie:20,accuracy:4,damageBonus:8,rarity:'Lendário',requiredLevel:20,requiredClasses:['Guerreiro','Paladino'],setId:'titã-primordial',qty:1,price:0,description:'Arma do conjunto do Titã Primordial.'},
    'couraca-tita':{id:'couraca-tita',name:'Couraça Tectônica',kind:'equipment',slot:'armor',defense:20,rarity:'Lendário',requiredLevel:20,requiredClasses:['Guerreiro','Paladino'],setId:'titã-primordial',qty:1,price:0,description:'Armadura do conjunto do Titã Primordial.'},
    'tridente-mare':{id:'tridente-mare',name:'Tridente do Abismo Sereno',kind:'equipment',slot:'weapon',damageDie:12,accuracy:4,damageBonus:5,rarity:'Épico',requiredLevel:18,requiredClasses:['Guerreiro','Paladino','Patrulheiro'],setId:'mare-ancestral',qty:1,price:0,description:'Arma do conjunto Guardião das Marés.'},
    'escudo-mare':{id:'escudo-mare',name:'Escudo do Recife Eterno',kind:'equipment',slot:'shield',defense:14,rarity:'Épico',requiredLevel:18,requiredClasses:['Guerreiro','Paladino'],setId:'mare-ancestral',qty:1,price:0,description:'Escudo do conjunto Guardião das Marés.'}
  };
  const LOOT_TABLES = {
    'goblin-cinzas':[{id:'cinza-viva',chance:65,qty:1}], 'lobo-cinzento':[{id:'couro-lobo',chance:70,qty:1},{id:'presa-lobo',chance:35,qty:1}],
    'espectro-ruptura':[{id:'essencia-arcana',chance:35,qty:1}], 'campeao-orc':[{id:'fragmento-forja',chance:55,qty:1}],
    'aranha-umbrafunda':[{id:'presa-lobo',chance:45,qty:1}], 'cultista-cinzento':[{id:'essencia-arcana',chance:35,qty:1}],
    'golem-basalto':[{id:'fragmento-forja',chance:80,qty:1}], 'sereia-abissal':[{id:'coral-abissal',chance:75,qty:1}],
    'cavaleiro-solar':[{id:'essencia-arcana',chance:55,qty:1}], 'draco-niveriano':[{id:'cristal-niveriano',chance:75,qty:1},{id:'escama-ancestral',chance:25,qty:1}],
    'sabueso-brasas':[{id:'cinza-viva',chance:70,qty:1}], 'guardiao-raiz':[{id:'reliquia-raiz',chance:12,qty:1}],
    'saqueador-afogado':[{id:'coral-abissal',chance:55,qty:1}], 'revenante-geada':[{id:'cristal-niveriano',chance:65,qty:1}],
    'escorpiao-solar':[{id:'essencia-arcana',chance:40,qty:1}], 'drakthar':[{id:'escama-ancestral',chance:100,qty:2},{id:'fragmento-forja',chance:100,qty:2}],
    'arconte-solar':[{id:'diadema-solar',chance:16,qty:1},{id:'essencia-arcana',chance:100,qty:3}],
    'colosso-umbra':[{id:'manto-umbra',chance:14,qty:1},{id:'nucleo-vazio',chance:100,qty:3}],
    'general-cinzas':[{id:'lamina-braseiro',chance:18,qty:1},{id:'coroa-cinzas',chance:22,qty:1},{id:'broquel-cinzas',chance:18,qty:1},{id:'fragmento-forja',chance:100,qty:2}],
    'caranguejo-coral':[{id:'coral-abissal',chance:65,qty:1}], 'sentinela-cristal':[{id:'cristal-niveriano',chance:100,qty:1},{id:'essencia-arcana',chance:35,qty:1}],
    'acólito-solar':[{id:'essencia-arcana',chance:60,qty:1}], 'vigia-ruinas':[{id:'fragmento-forja',chance:50,qty:1}],
    'mariposa-veu':[{id:'essencia-arcana',chance:35,qty:1}], 'colosso-sal':[{id:'coral-abissal',chance:70,qty:1}],
    'quimera-carmesim':[{id:'escama-ancestral',chance:100,qty:2},{id:'lamina-braseiro',chance:14,qty:1}],
    'arauto-vazio':[{id:'nucleo-vazio',chance:100,qty:2}], 'titã-primordial':[{id:'manoplas-tita',chance:20,qty:1},{id:'martelo-tita',chance:18,qty:1},{id:'couraca-tita',chance:18,qty:1},{id:'fragmento-forja',chance:100,qty:3}],
    'rainha-cristal':[{id:'foco-prisma',chance:20,qty:1},{id:'cristal-niveriano',chance:100,qty:3}],
    'devorador-mare':[{id:'couraca-mare',chance:20,qty:1},{id:'tridente-mare',chance:18,qty:1},{id:'escudo-mare',chance:18,qty:1},{id:'coral-abissal',chance:100,qty:3}],
    'serpe-tempestade':[{id:'escama-ancestral',chance:100,qty:3}], 'vharzun':[{id:'coracao-vharzun',chance:100,qty:1},{id:'nucleo-vazio',chance:100,qty:3}]
  };
  const MAP_WIDTH = 10, MAP_HEIGHT = 8;
  // Bases maiores ocupam várias casas reais; as dimensões são medidas em largura x altura.
  const BOSS_FOOTPRINTS={
    'drakthar':{w:2,h:2},'vharzun':{w:3,h:2},'general-cinzas':{w:2,h:2},
    'quimera-carmesim':{w:2,h:2},'titã-primordial':{w:3,h:3},'rainha-cristal':{w:2,h:2},
    'devorador-mare':{w:3,h:2},'arconte-solar':{w:2,h:2},'colosso-umbra':{w:3,h:3}
  };
  const LARGE_CREATURE_FOOTPRINTS={'golem-basalto':{w:2,h:2},'draco-niveriano':{w:2,h:1},'serpe-tempestade':{w:2,h:2},'colosso-sal':{w:2,h:2},'arauto-vazio':{w:2,h:2}};
  function creatureFootprint(templateId,boss=false){
    const id=String(templateId||'').toLowerCase();
    return {...(BOSS_FOOTPRINTS[id]||LARGE_CREATURE_FOOTPRINTS[id]||{w:1,h:1})};
  }
  function footprintCells(x,y,footprint={w:1,h:1}){
    const cells=[];for(let yy=0;yy<(footprint.h||1);yy++)for(let xx=0;xx<(footprint.w||1);xx++)cells.push({x:x+xx,y:y+yy});return cells;
  }
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
    const exploration=explorationData(gs),source=exploration.maps[exploration.mapId]||{};
    const markers=Array.isArray(source.markers)?cloneData(source.markers):[];
    const defaults=defaultBoardMarkers(exploration.mapId);
    const missingDefaults=defaults.some(marker=>!markers.some(existing=>existing.id===marker.id||(existing.type===marker.type&&existing.x===marker.x&&existing.y===marker.y)));
    defaults.forEach(marker=>{if(!markers.some(existing=>existing.id===marker.id||(existing.type===marker.type&&existing.x===marker.x&&existing.y===marker.y)))markers.push(cloneData(marker))});
    return {playersVisible:typeof source.playersVisible==='boolean'?source.playersVisible:true,fogEnabled:!!source.fogEnabled,revealedCells:Array.isArray(source.revealedCells)?[...source.revealedCells]:[],tokens:source.tokens&&typeof source.tokens==='object'?cloneData(source.tokens):{},markers,boardDefaultsApplied:source.boardDefaultsApplied===true&&!missingDefaults};
  }
  function setActiveMapRecord(exploration,record){exploration.maps[exploration.mapId]=record;return exploration;}
  function mapTemplate(id){const found=MAP_TEMPLATES.find(m=>m.id===id);if(found)return found;throw new Error(`O mapa "${id||'sem identificador'}" não existe na biblioteca oficial. Atualize assets/maps/maps-data.js e assets/maps-v3/.`)}
  function mapTile(id,x,y){const layout=mapTemplate(id).layout;return layout[y]?.[x]||'b'}
  function mapTileInfo(tile){return ({'.':{name:'Terreno aberto',glyph:'',blocked:false,cls:'grass'},f:{name:'Piso de sala',glyph:'',blocked:false,cls:'floor'},p:{name:'Corredor ou trilha',glyph:'',blocked:false,cls:'path'},d:{name:'Porta',glyph:'🚪',blocked:false,cls:'door'},e:{name:'Entrada',glyph:'⬇',blocked:false,cls:'entrance'},x:{name:'Saída',glyph:'⬆',blocked:false,cls:'exit'},t:{name:'Árvore',glyph:'🌳',blocked:true,cls:'tree'},w:{name:'Água profunda',glyph:'💧',blocked:true,cls:'water'},r:{name:'Rocha',glyph:'🪨',blocked:true,cls:'rock'},h:{name:'Edificação',glyph:'🏠',blocked:true,cls:'house'},c:{name:'Coluna',glyph:'🏛️',blocked:true,cls:'column'},b:{name:'Muro',glyph:'🧱',blocked:true,cls:'wall'}})[tile]||{name:'Terreno',glyph:'',blocked:false,cls:'grass'};}
  function mapCellKey(x,y){return `${x},${y}`}
  function addRevealedAround(record,x,y,radius=1){const cells=new Set(record.revealedCells||[]);for(let yy=Math.max(0,y-radius);yy<=Math.min(MAP_HEIGHT-1,y+radius);yy++)for(let xx=Math.max(0,x-radius);xx<=Math.min(MAP_WIDTH-1,x+radius);xx++)cells.add(mapCellKey(xx,yy));record.revealedCells=[...cells];}
  const MAP_PARTY_SPAWNS={
    'eldoria-road':[{x:4,y:5},{x:5,y:5},{x:4,y:6},{x:5,y:6}],
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
    const chosen=[],monsterStart=mapId==='eldoria-road'?{x:6,y:2}:{x:7,y:3};
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
  function mapTokenPosition(tokenId,record,mapId){if(record.tokens[tokenId])return record.tokens[tokenId];if(tokenId==='monster')return mapId==='eldoria-road'?{x:6,y:2}:{x:7,y:3};return defaultTokenPosition(tokenId,mapId)}
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
    const allowed=['comum','incomum','raro','epico','lendario','mitico'];
    const rarity=allowed.includes(normalized)?normalized:'comum';
    const colors={comum:'#c8cbd0',incomum:'#70c98b',raro:'#68a9ff',epico:'#bd8cff',lendario:'#f4c45e',mitico:'#ff79d1'};
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
      'serpe-tempestade':'<path d="M5 34 Q8 15 24 18 Q37 20 41 8 Q46 22 35 29 Q26 36 13 31 Q6 29 5 34Z"/><path d="M19 19 L12 7 L25 14 M31 22 L42 11 L39 28" fill="none" stroke-width="3"/><path d="M14 31 Q5 43 17 47 Q28 50 35 40" fill="none" stroke-width="5"/><path d="M23 25 L27 25 M32 24 L35 24" stroke="#fff0bd" stroke-width="2.5"/>',
      'vigia-ruinas':'<path d="M12 13 L20 5 L29 5 L38 14 L36 39 L29 47 L15 43 L9 30Z"/><path d="M17 22 L22 22 M29 22 L33 22" stroke="#e7d9b8" stroke-width="3"/><path d="M18 34 L31 34" stroke="#514a43" stroke-width="3"/>' ,
      'mariposa-veu':'<path d="M23 24 Q7 3 5 18 Q4 34 22 30 Q12 47 23 42 Q34 47 26 30 Q44 34 43 18 Q40 3 25 24Z"/><path d="M24 17 L24 38" stroke="#e6d8ff" stroke-width="3"/><circle cx="15" cy="20" r="2" fill="#fff"/><circle cx="34" cy="20" r="2" fill="#fff"/>' ,
      'colosso-sal':'<path d="M12 15 L20 5 L32 8 L39 20 L36 40 L25 47 L12 39 L7 25Z"/><path d="M16 22 L21 22 M29 22 L34 22" stroke="#f4ffff" stroke-width="3"/><path d="M16 34 L32 34" stroke="#779da6" stroke-width="3"/>' ,
      'general-cinzas':'<path d="M13 14 L24 5 L35 14 L38 37 L30 46 L17 44 L10 34Z"/><path d="M12 18 L5 7 L18 13 M36 18 L43 7 L31 13"/><path d="M17 24 L22 24 M29 24 L34 24" stroke="#ffdf9b" stroke-width="3"/><path d="M18 34 L30 34" stroke="#44251b" stroke-width="3"/>' ,
      'quimera-carmesim':'<path d="M7 29 Q10 14 23 18 L30 12 L37 21 L44 18 L40 31 L35 43 L22 46 L13 39Z"/><path d="M28 17 L25 4 L33 13 M37 21 L45 8 L43 26 M14 24 L5 13 L17 19" fill="none" stroke-width="3"/><path d="M19 28 L23 28 M31 28 L35 28" stroke="#fff0b0" stroke-width="3"/>',
      'arauto-vazio':'<path d="M12 12 Q24 -1 37 12 L34 35 L45 49 L29 42 L23 50 L18 42 L3 49 L15 34Z"/><path d="M17 22 L21 22 M29 22 L33 22" stroke="#c9a5ff" stroke-width="3"/><path d="M24 2 L24 45" stroke="#7f61b8" stroke-width="2"/>',
      'titã-primordial':'<path d="M8 18 L18 5 L31 7 L42 20 L39 40 L28 49 L12 42 L5 29Z"/><path d="M17 21 L22 21 M30 21 L35 21" stroke="#ffe0a0" stroke-width="4"/><path d="M11 14 L2 5 M37 15 L46 4 M13 36 L4 44 M35 36 L45 45" fill="none" stroke-width="4"/>',
      'rainha-cristal':'<path d="M12 14 L17 5 L24 12 L31 4 L36 14 L39 36 L25 49 L10 36Z"/><path d="M17 22 L22 22 M29 22 L34 22" stroke="#eaffff" stroke-width="3"/><path d="M24 2 L24 47 M11 31 L38 31" stroke="#c4f4ff" stroke-width="2"/>',
      'devorador-mare':'<path d="M6 31 Q8 15 23 19 L30 12 L37 20 L45 13 L40 31 L31 44 L17 45Z"/><path d="M15 22 L6 8 L22 17 M32 20 L43 5 L40 26" fill="none" stroke-width="3"/><path d="M19 30 L23 30 M31 30 L35 30" stroke="#e4ffff" stroke-width="3"/>',
      'arconte-solar':'<path d="M14 15 L24 5 L34 15 L37 37 L24 48 L11 37Z"/><path d="M24 3 L24 47 M8 17 L15 22 M40 17 L33 22 M8 29 L15 32 M40 29 L33 32" fill="none" stroke-width="3"/><path d="M18 24 L22 24 M29 24 L33 24" stroke="#fff4bd" stroke-width="3"/>',
      'colosso-umbra':'<path d="M10 14 L21 4 L34 10 L41 25 L36 43 L24 49 L11 42 L6 27Z"/><path d="M17 22 L22 22 M29 22 L34 22" stroke="#d8b8ff" stroke-width="4"/><path d="M7 16 L2 7 M39 16 L46 6 M10 39 L2 47 M38 39 L46 47" fill="none" stroke-width="4"/>',
      'vharzun':'<path d="M7 31 L3 13 L18 21 L24 6 L31 20 L46 11 L40 33 L33 46 L23 49 L12 43Z"/><path d="M15 24 L8 4 L25 18 M33 22 L45 3 L40 29" fill="none" stroke-width="3"/><path d="M17 30 L22 30 M30 30 L35 30" stroke="#fff0a4" stroke-width="3"/><path d="M21 39 Q27 44 33 38" fill="none" stroke="#ff9e43" stroke-width="2.5"/>',
    };
    const palette=id.includes('lobo')?['#9aa8b7','#465465']:id.includes('espectro')?['#9be6e6','#385d78']:id.includes('orc')?['#9aab65','#4b6339']:id.includes('aranha')?['#806a9b','#392c50']:id.includes('cultista')?['#766b91','#302941']:id.includes('golem')?['#9b8c79','#51463d']:id.includes('sereia')?['#64b8b1','#245a63']:id.includes('cavaleiro')?['#d5b66f','#6b4c28']:id.includes('draco')?['#8fd6e8','#376a83']:id.includes('sabueso')?['#d9783d','#633323']:id.includes('guardiao')?['#829c58','#3d5734']:id.includes('saqueador')?['#6caaa4','#31545a']:id.includes('revenante')?['#b4e6f2','#456a86']:id.includes('escorpiao')?['#e2bd59','#775026']:id.includes('general')?['#c46a3e','#592a25']:id.includes('caranguejo')?['#d87965','#733f49']:id.includes('sentinela')?['#9de4f0','#3e758c']:id.includes('acólito')?['#e6c46b','#85602e']:id.includes('vigia')?['#a69b89','#514a43']:id.includes('mariposa')?['#b89cda','#59466f']:id.includes('colosso')?['#c7e0df','#557c83']:id.includes('drakthar')||id.includes('vharzun')||id.includes('quimera')?['#d66c43','#612a2c']:id.includes('arauto')||id.includes('umbra')?['#a88bd1','#43315f']:id.includes('rainha')?['#b7eaf5','#417c95']:id.includes('titã')?['#a9a298','#514d47']:id.includes('arconte')?['#e4c46f','#80602c']:id.includes('devorador')?['#7bb8bd','#315a66']:['#bd8660','#583c37'];
    const safeId=id.replace(/[^a-z0-9_-]/g,'');
    return `<svg class="monster-sprite monster-${safeId||'unknown'}" viewBox="0 0 48 52" role="img" aria-label="${esc(name)}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="monster-metal-${safeId}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${palette[0]}"/><stop offset=".48" stop-color="${palette[1]}"/><stop offset="1" stop-color="${palette[0]}"/></linearGradient><radialGradient id="monster-glint-${safeId}"><stop offset="0" stop-color="#fff" stop-opacity=".65"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><ellipse cx="24" cy="48" rx="15" ry="3" fill="#000" opacity=".4"/><g class="monster-creature" fill="url(#monster-metal-${safeId})" stroke="${palette[1]}" stroke-width="1.8" stroke-linejoin="round">${forms[id]||forms['goblin-cinzas']}</g><path d="M13 17 Q23 7 34 17" fill="none" stroke="#fff" stroke-opacity=".23" stroke-width="1.2"/></svg>`;
  }
  function equipmentPropSvg(slot,item){
    const visual=equipmentVisual(item),color=visual.color,name=String(item?.name||'').toLowerCase();
    const stroke=`stroke="${color}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"`;
    if(slot==='weapon'){
      let body='M15 49 L18 45 L13 40 L17 36 L22 41 L27 36 L31 40 L26 45 L29 49Z M18 36 L7 11 L12 6 L24 32 L21 38Z';
      if(/arco|besta/.test(name))body='M18 48 Q3 28 18 7 Q33 28 18 48 M18 8 L18 48 M8 26 L28 26';
      else if(/cajado|cetro|vara|bast/.test(name))body='M18 50 L22 12 M22 12 L17 7 L22 2 L27 7 L22 12';
      else if(/machado|axe/.test(name))body='M18 49 L23 18 M22 18 Q6 17 7 5 Q25 3 30 15 Q29 22 22 22Z';
      else if(/martelo|maça|maca/.test(name))body='M18 49 L22 18 M10 7 L31 7 L31 17 L10 17Z';
      else if(/adaga|dagger/.test(name))body='M18 49 L21 17 L16 6 L25 3 L24 17 L23 49Z';
      return `<svg class="miniature-gear-prop gear-prop-weapon" viewBox="0 0 36 56" aria-label="Arma equipada" role="img"><path d="${body}" fill="#b7b5ad" ${stroke}/><path d="M13 43 L25 43" stroke="#4d5053" stroke-width="3"/></svg>`;
    }
    if(slot==='armor')return `<svg class="miniature-gear-prop gear-prop-armor" viewBox="0 0 42 38" aria-label="Armadura equipada" role="img"><path d="M13 5 L21 2 L29 5 L37 12 L32 34 L10 34 L5 12Z" fill="#aaa8a0" ${stroke}/><path d="M21 4 L21 31 M9 14 L33 14 M14 23 L28 23" fill="none" stroke="#55575a" stroke-width="1.7"/><path d="M21 9 L25 15 L21 21 L17 15Z" fill="${color}" opacity=".9"/></svg>`;
    return `<svg class="miniature-gear-prop gear-prop-shield" viewBox="0 0 38 44" aria-label="Escudo equipado" role="img"><path d="M19 2 L34 8 L32 27 Q28 37 19 42 Q10 37 6 27 L4 8Z" fill="#9d9c98" ${stroke}/><path d="M19 7 L19 35 M9 13 L29 13" fill="none" stroke="#56595d" stroke-width="2"/><path d="M19 13 L25 20 L19 29 L13 20Z" fill="${color}" opacity=".9"/></svg>`;
  }
  function mapHeroMiniature(className='Guerreiro',equipment={}){
    const key=({'warrior':'warrior','arcane':'arcane','ranger':'ranger','paladin':'paladin','assassin':'assassin','cleric':'cleric','druid':'druid','summoner':'summoner'})[className]||'warrior';
    const label=String(className||'Aventureiro');
    const props=['weapon','armor','shield'].filter(slot=>equipment?.[slot]).map(slot=>equipmentPropSvg(slot,equipment[slot])).join('');
    const detail=props?`<span class="miniature-gear-props">${props}</span>`:'';
    return `<span class="miniature-art-wrap hero-miniature-wrap"><img class="hero-miniature-image" src="assets/minis/${key}.png" alt="Estátua de ${esc(label)}" loading="lazy" draggable="false" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="miniature-art-fallback" hidden>${mapHeroSprite(className,equipment)}</span>${detail}</span>`;
  }
  function monsterMiniaturePath(templateId){
    const id=String(templateId||'goblin-cinzas').toLowerCase();
    const slug=id.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9-]/g,'')||'goblin-cinzas';
    if(id==='goblin-cinzas')return 'assets/minis/monster-goblin.png';
    // A partir da v3.0.5, cada criatura do bestiário possui um PNG próprio.
    return `assets/minis/monsters/monster-${slug}.png`;
  }
  function mapMonsterMiniature(token){
    const id=String(token?.templateId||'goblin-cinzas').toLowerCase(),src=monsterMiniaturePath(id)+'?v=4.2.1';
    return `<span class="miniature-art-wrap monster-miniature-wrap"><img class="monster-miniature-image ${token?.boss?'monster-statue-boss':''}" src="${src}" alt="Miniatura de ${esc(token?.name||'Criatura')}" loading="lazy" draggable="false" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="miniature-art-fallback" hidden>${mapMonsterSprite(id,token?.name)}</span></span>`;
  }
  // Arte colorida exclusiva do painel amplo do combate. As miniaturas cinza permanecem nos demais painéis.
  function mapMonsterBattleArt(token){
    const id=String(token?.templateId||'goblin-cinzas').toLowerCase();
    const slug=id.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9-]/g,'')||'goblin-cinzas';
    const src=`assets/monster-art/${slug}.webp?v=4.2.1`;
    return `<img class="battle-color-art" src="${src}" alt="Ilustração colorida de ${esc(token?.name||'Criatura')}" loading="eager" draggable="false" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="battle-color-fallback" hidden>${mapMonsterMiniature(token)}</span>`;
  }
  function mapPieceArt(token){return token.kind==='monster'?mapMonsterMiniature(token):mapHeroMiniature(token.className,token.equipment)}
  function positionFitsFootprint(mapId,x,y,footprint={w:1,h:1},occupied=[],record=null){
    const used=occupied instanceof Set?occupied:new Set(occupied.map(p=>`${p.x},${p.y}`));
    for(const cell of footprintCells(x,y,footprint)){
      if(cell.x<0||cell.y<0||cell.x>=MAP_WIDTH||cell.y>=MAP_HEIGHT)return false;
      if(mapCellBlocked(mapId,cell.x,cell.y,record)||used.has(`${cell.x},${cell.y}`))return false;
    }
    return true;
  }
  function expandedOccupied(tokens,exceptId){
    const cells=[];for(const token of tokens){if(token.id===exceptId||token.defeated)continue;cells.push(...footprintCells(token.position.x,token.position.y,token.footprint||{w:1,h:1}));}return cells;
  }
  function defaultMonsterSpawn(mapId,occupied=[],index=0,footprint={w:1,h:1},record=null){
    const used=new Set(occupied.map(p=>`${p.x},${p.y}`)),candidates=[];
    const party=occupied.filter(p=>p.kind==='party');
    for(let y=0;y<MAP_HEIGHT;y++)for(let x=0;x<MAP_WIDTH;x++){
      if(!positionFitsFootprint(mapId,x,y,footprint,used,record))continue;
      const nearest=party.length?Math.min(...party.map(p=>Math.abs(p.x-x)+Math.abs(p.y-y))):0;
      candidates.push({x,y,score:nearest*5+(y<=3?4:0)+(x<=4?1:0)});
    }
    candidates.sort((a,b)=>b.score-a.score||a.y-b.y||a.x-b.x);
    const chosen=candidates[index]||candidates[0]||{x:0,y:0};return {x:chosen.x,y:chosen.y};
  }
  function mapTokens(record,gs=state.campaign?.game_state||defaultGameState()){
    const mapId=explorationData(gs).mapId,defaults=defaultPartyPositions(mapId);
    const list=state.members.filter(m=>m.role==='player'&&m.character).map(m=>({id:m.user_id,name:m.character.name||m.display_name||'Aventureiro',kind:'player',className:characterMiniatureClass(m.character),equipment:gs.partyState?.[m.user_id]?.equipment||m.character.equipment||{},portrait:m.character.portrait||classPortrait(m.character),sigil:characterSigil(m.character),initials:tokenInitials(m.character.name||m.display_name),footprint:{w:1,h:1},position:record.tokens[m.user_id]||defaults.get(m.user_id)||{x:1,y:6}}));
    if(gs.encounter){
      const enemies=Array.isArray(gs.encounter.enemies)&&gs.encounter.enemies.length?gs.encounter.enemies:[{...gs.encounter,id:'monster'}];
      const occupied=expandedOccupied(list).map(p=>({...p,kind:'party'}));
      enemies.forEach((e,i)=>{
        const id=e.id||`enemy-${i}`,templateId=e.templateId||gs.encounter.templateId;
        const threat=String(e.threat||''),boss=/CHEFE/i.test(threat)||Object.prototype.hasOwnProperty.call(BOSS_FOOTPRINTS,templateId);
        const footprint=e.footprint||creatureFootprint(templateId,boss);
        const position=record.tokens[id]||defaultMonsterSpawn(mapId,occupied,i,footprint,record);
        occupied.push(...footprintCells(position.x,position.y,footprint));
        const elite=!boss&&(/MUITO ALTA|LENDÁRIA|ÉPICA/i.test(threat)||Number(e.level)>=15);
        list.push({id,name:e.name||'Criatura',kind:'monster',className:'monster',templateId,portrait:e.portrait||monsterPortrait(templateId),sigil:e.emoji||'🐉',initials:'',hp:Math.max(0,Number(e.hp)||0),maxHp:Math.max(1,Number(e.maxHp)||1),defeated:!!e.defeated||Number(e.hp)<=0,bossPhase:Number(e.bossPhase)||1,boss,elite,threat,footprint,position});
      });
    }
    return list;
  }
  function tokenOccupiesCell(token,x,y){const fp=token.footprint||{w:1,h:1};return !token.defeated&&x>=token.position.x&&y>=token.position.y&&x<token.position.x+fp.w&&y<token.position.y+fp.h;}
  function mapCellBlocked(mapId,x,y,record=null){
    const marker=record?.markers?.find(item=>item.type==='door'&&item.x===x&&item.y===y);
    if(marker)return !marker.open; // uma porta explícita pode ocupar um vão na parede/edificação
    if(mapTileInfo(mapTile(mapId,x,y)).blocked)return true;
    return mapTile(mapId,x,y)==='d';
  }
  function mapCellVisible(x,y,record,gs,tokens=mapTokens(record,gs)){if(isMaster()||!record.fogEnabled)return true;const key=mapCellKey(x,y);if(record.revealedCells.includes(key))return true;return tokens.filter(t=>t.kind==='player').some(t=>Math.max(Math.abs(t.position.x-x),Math.abs(t.position.y-y))<=1)}
  function mapPathDistance(mapId,start,end,occupied=[],record=null,footprint={w:1,h:1}){
    const key=(x,y)=>`${x},${y}`,blocked=new Set(occupied.map(p=>key(p.x,p.y)));
    if(!positionFitsFootprint(mapId,end.x,end.y,footprint,blocked,record))return Infinity;
    const directions=[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]];
    const queue=[[start.x,start.y,0]],seen=new Set([key(start.x,start.y)]);
    while(queue.length){
      const [x,y,d]=queue.shift();
      if(x===end.x&&y===end.y)return d;
      for(const [dx,dy] of directions){
        const nx=x+dx,ny=y+dy;
        if(!positionFitsFootprint(mapId,nx,ny,footprint,blocked,record))continue;
        // Não permite cortar o canto de uma parede, obstáculo, porta fechada ou outra peça.
        // Para uma diagonal, as duas posições ortogonais intermediárias precisam estar livres.
        if(dx!==0&&dy!==0){
          if(!positionFitsFootprint(mapId,x+dx,y,footprint,blocked,record))continue;
          if(!positionFitsFootprint(mapId,x,y+dy,footprint,blocked,record))continue;
        }
        const k=key(nx,ny);if(!seen.has(k)){seen.add(k);queue.push([nx,ny,d+1]);}
      }
    }
    return Infinity;
  }
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
  const RARITY_POWER={Comum:1,Incomum:3,Raro:10,Épico:25,Lendário:100,Mítico:150};
  const SET_POWER={Comum:1,Incomum:2,Raro:5,Épico:12,Lendário:30,Mítico:45};
  function rarityPower(item){return RARITY_POWER[item?.rarity||item?.raridade||'Comum']||1;}
  function equipmentBonuses(equipment={}){
    const slots=['weapon','armor','shield'];const pieces=slots.map(slot=>equipment?.[slot]).filter(Boolean);
    const bySet={};pieces.forEach(item=>{if(item.setId)(bySet[item.setId]||(bySet[item.setId]=[])).push(item)});
    const currentSet=Object.entries(bySet).sort((a,b)=>b[1].length-a[1].length)[0]||null;const activeSet=currentSet&&currentSet[1].length===3?currentSet:null;const setPieces=currentSet?.[1]||[];
    const setLabel={vanguarda:'Vanguarda','aurora-eterna':'Aurora Eterna',celestial:'Celestial','cinzas-forjadas':'Cinzas Forjadas','mare-ancestral':'Guardião das Marés','titã-primordial':'Titã Primordial','raiz-eterna':'Raiz Eterna'};
    const setEffectMap={'cinzas-forjadas':'Ao iniciar o turno com menos de 30% de HP, o portador recebe +10 Defesa até o próximo turno.','mare-ancestral':'Uma vez por encontro, o portador pode reduzir em 15 o dano de um ataque recebido.','titã-primordial':'O primeiro ataque acertado em cada rodada causa +10 dano.','raiz-eterna':'Uma vez por encontro, o mestre pode permitir recuperar 2d8 HP.','aurora-eterna':'O conjunto concede proteção e precisão superiores.','celestial':'O conjunto concede poder celestial em combate.','vanguarda':'O conjunto reforça ataque e Defesa.'};
    const setBonus=activeSet?Math.min(...setPieces.map(item=>SET_POWER[item.rarity||'Comum']||1)):0;
    const weaponAttack=pieces.filter(x=>x.slot==='weapon'||x.damageDie).reduce((n,item)=>n+rarityPower(item)+(Number(item.accuracy)||0)+(Number(item.enhancementLevel)||0)*5+(item.enchantment==='Precisão'?5:0),0);
    const weaponDamage=pieces.filter(x=>x.slot==='weapon'||x.damageDie).reduce((n,item)=>n+rarityPower(item)+(Number(item.damageBonus)||0)+(Number(item.enhancementLevel)||0)*5+(item.enchantment==='Chama'?5:0),0);
    const armorDefense=pieces.filter(x=>x.slot!=='weapon'&&!x.damageDie).reduce((n,item)=>n+(Number(item.defense)||0)+rarityPower(item)+(Number(item.enhancementLevel)||0)*5+(item.enchantment==='Guardião'?5:0),0);
    return {defense:armorDefense+setBonus,attack:weaponAttack+setBonus,damage:weaponDamage,setName:activeSet?(setLabel[activeSet[0]]||activeSet[0]):null,setEffect:activeSet?(setEffectMap[activeSet[0]]||'Bônus especial do conjunto completo.'):null,setProgressName:currentSet?(setLabel[currentSet[0]]||currentSet[0]):null,setPieces:setPieces.length,setBonus};
  }
  function equipmentRequirementError(item,character){
    if(Number(character.level||1)<Number(item.requiredLevel||1))return `Este item exige nível ${item.requiredLevel}.`;
    if(Array.isArray(item.requiredClasses)&&item.requiredClasses.length&&!item.requiredClasses.includes(character.class))return `Este item é restrito às classes: ${item.requiredClasses.join(', ')}.`;
    return '';
  }
  function normalizeCharacter(character){
    const c=JSON.parse(JSON.stringify(character||newCharacterDraft()));
    c.level=Math.min(50,Math.max(1,Number(c.level)||1));c.xp=Math.max(0,Number(c.xp)||0);
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
    c.skillTree=c.skillTree&&typeof c.skillTree==='object'?c.skillTree:{assault:0,guardian:0,arcane:0};
    c.portrait=c.portrait||classPortrait(c);
    return c;
  }
  const SKILL_TREE_BRANCHES={
    assault:{name:'Lâmina e precisão',description:'Aprimora ataques e dano.',icon:'⚔',nodes:[{id:'attack',name:'Golpe treinado',description:'+1 no bônus de ataque por nível.'},{id:'damage',name:'Impacto certeiro',description:'+1 de dano por nível.'},{id:'critical',name:'Instinto crítico',description:'Aumenta a consistência de acertos críticos.'}]},
    guardian:{name:'Postura do guardião',description:'Melhora a resistência e a sobrevivência.',icon:'🛡',nodes:[{id:'defense',name:'Guarda firme',description:'+1 Defesa por nível.'},{id:'vitality',name:'Vigor',description:'+3 HP máximo por nível.'},{id:'recovery',name:'Tenacidade',description:'+1 em cura recebida por nível.'}]},
    arcane:{name:'Disciplina arcana',description:'Fortalece habilidades e suporte.',icon:'✧',nodes:[{id:'ability',name:'Concentração',description:'+1 no bônus de ataque de habilidades por nível.'},{id:'healing',name:'Restauração',description:'+2 em curas realizadas por nível.'},{id:'focus',name:'Foco',description:'+1 no dano de habilidades por nível.'}]}
  };
  function skillTreeRanks(character){const tree=character?.skillTree||{};return {assault:Math.max(0,Math.min(3,Number(tree.assault)||0)),guardian:Math.max(0,Math.min(3,Number(tree.guardian)||0)),arcane:Math.max(0,Math.min(3,Number(tree.arcane)||0))}}
  function skillPointsAvailable(character){const ranks=skillTreeRanks(character),spent=Object.values(ranks).reduce((a,b)=>a+b,0),earned=Math.min(9,Math.floor(Math.max(0,(Number(character?.level)||1)-1)/3));return Math.max(0,earned-spent)}
  function skillBonuses(character){const r=skillTreeRanks(character);return {attack:r.assault,damage:r.assault,critical:r.assault,defense:r.guardian,maxHp:r.guardian*3,healingReceived:r.guardian,healing:r.arcane*2,abilityAttack:r.arcane,abilityDamage:r.arcane}}
  function v4GameData(gs=state.campaign?.game_state||defaultGameState()){
    const data=gs.v4&&typeof gs.v4==='object'?gs.v4:{};
    const stats=data.statistics&&typeof data.statistics==='object'?data.statistics:{};
    return {
      ...data,
      version:4,
      storyBranches:{active:data.storyBranches?.active||null,history:Array.isArray(data.storyBranches?.history)?data.storyBranches.history:[]},
      npcRelations:data.npcRelations&&typeof data.npcRelations==='object'?data.npcRelations:{},
      nextSessionPrep:data.nextSessionPrep||'',
      lastSessionSummary:data.lastSessionSummary||'',
      lootLog:Array.isArray(data.lootLog)?data.lootLog:[],
      encounterPresets:Array.isArray(data.encounterPresets)?data.encounterPresets.slice(-30):[],
      achievements:Array.isArray(data.achievements)?data.achievements:[],
      statistics:{encountersWon:0,monstersDefeated:0,bossesDefeated:0,storyDecisions:0,lootDrops:0,uniqueMonsterIds:[],monsterDefeats:{},...stats,uniqueMonsterIds:Array.isArray(stats.uniqueMonsterIds)?stats.uniqueMonsterIds:[],monsterDefeats:stats.monsterDefeats&&typeof stats.monsterDefeats==='object'?stats.monsterDefeats:{}},
      processedEncounterIds:Array.isArray(data.processedEncounterIds)?data.processedEncounterIds:[],
      voiceSession:{enabled:false,platform:'discord',url:'',...(data.voiceSession&&typeof data.voiceSession==='object'?data.voiceSession:{})}
    };
  }
  function v41GameData(gs=state.campaign?.game_state||defaultGameState()){
    const raw=gs?.v41&&typeof gs.v41==='object'?gs.v41:{};
    const session=raw.session&&typeof raw.session==='object'?raw.session:{};
    return {
      ...raw,version:1,
      session:{status:['preparing','live','paused'].includes(session.status)?session.status:'preparing',readyBy:session.readyBy&&typeof session.readyBy==='object'?session.readyBy:{},startedAt:session.startedAt||null,pausedAt:session.pausedAt||null},
      snapshots:Array.isArray(raw.snapshots)?raw.snapshots.slice(-3):[],
      mapPings:Array.isArray(raw.mapPings)?raw.mapPings.slice(-24):[]
    };
  }
  function v411GameData(gs=state.campaign?.game_state||defaultGameState()){
    const raw=gs?.v411&&typeof gs.v411==='object'?gs.v411:{};
    return {version:1,revision:Math.max(0,Number(raw.revision)||0),undoHistory:Array.isArray(raw.undoHistory)?raw.undoHistory.slice(-8):[]};
  }
  function v411UndoLabel(keys=[]){
    const labels={encounter:'Combate, HP ou iniciativa',partyState:'Recursos e fichas dos aventureiros',exploration:'Mapa, posições ou objetos',worldExploration:'Exploração do mundo',quests:'Progresso das missões',journalEntries:'Diário da campanha',narration:'Narração publicada',chapter:'Capítulo da aventura',location:'Local da companhia',storyFlags:'Decisão ou progresso narrativo',revealedNpcIds:'NPCs revelados',dialogueChoices:'Decisão de diálogo',v4:'Recompensa, NPC ou progressão',v41:'Preparação, marcações ou pontos de restauração',activeRollPrompt:'Solicitação de dados'};
    const unique=[...new Set(keys)];return unique.map(k=>labels[k]||'Alteração da campanha').filter(Boolean).slice(0,2).join(' · ')||'Alteração da campanha';
  }
  function v411LastUndo(gs=state.campaign?.game_state||defaultGameState()){
    const data=v411GameData(gs),item=data.undoHistory.at(-1);if(!item)return null;
    return item.actorId===currentUserId()&&Number(item.revision)===data.revision?item:null;
  }
  async function undoV411LastAction(){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode desfazer uma ação.');
    const gs=cloneData(state.campaign?.game_state||defaultGameState()),data=v411GameData(gs),item=data.undoHistory.at(-1);
    if(!item||item.actorId!==currentUserId()||Number(item.revision)!==data.revision)throw new Error('A última alteração não pode ser desfeita neste dispositivo. Sincronize a campanha e confira o histórico.');
    if(!window.confirm(`Desfazer “${item.summary}”, registrado em ${new Date(item.at).toLocaleString('pt-BR')}? O estado atual desses campos será revertido.`))return;
    Object.entries(item.before||{}).forEach(([key,saved])=>{if(saved?.present)gs[key]=cloneData(saved.value);else delete gs[key]});
    gs.v411={...data,revision:data.revision+1,undoHistory:data.undoHistory.slice(0,-1)};
    state.isUndoing=true;
    try{await updateGameState(gs,item.statusBefore||state.campaign.status,true)}finally{state.isUndoing=false}
    await createEvent('session_note',{kind:'undo',text:`O mestre desfez a última ação: ${item.summary}.`});
    toast('Última ação do mestre desfeita.');
  }
  function v411ConnectionState(){
    if(!navigator.onLine)return {label:'Sem conexão com a internet',tone:'offline'};
    if(!state.backendReady)return {label:'Modo local',tone:'offline'};
    if(state.realtimeStatus==='SUBSCRIBED')return {label:'Sincronização ao vivo',tone:'online'};
    if(state.realtimeStatus==='connecting'||state.realtimeStatus==='RECONNECTING')return {label:'Reconectando à campanha',tone:'pending'};
    if(state.realtimeStatus==='CHANNEL_ERROR'||state.realtimeStatus==='TIMED_OUT'||state.realtimeStatus==='CLOSED')return {label:'Conexão instável · nova tentativa agendada',tone:'offline'};
    return {label:'Supabase conectado · sala não confirmada',tone:'pending'};
  }
  function v411NotificationRows(){
    const allowed=new Set(['session_note','narration','dice_result','dice_prompt','damage_applied','combat_action_result','monster_attack_result','turn_advanced','encounter_started','encounter_defeated','party_defeated','voice_action_resolved','member_joined','member_left','member_removed']);
    return state.events.filter(ev=>allowed.has(ev.event_type)).map(ev=>{const p=ev.payload||{},labels={session_note:p.kind==='quest'?'Missão atualizada':p.kind==='discovery'?'Descoberta registrada':p.kind==='summary'?'Resumo de sessão':p.kind==='dice-roll'?'Rolagem universal':p.kind==='dice-application'?'Efeito de rolagem aplicado':p.kind==='undo'?'Ação desfeita':'Diário da campanha',narration:'Nova narração',dice_result:'Resultado de D20',dice_prompt:'Teste solicitado',damage_applied:'Dano aplicado',combat_action_result:'Ação de combate',monster_attack_result:'Ação de criatura',turn_advanced:'Mudança de turno',encounter_started:'Encontro iniciado',encounter_defeated:'Encontro concluído',party_defeated:'Companhia derrotada',voice_action_resolved:'Ação por voz resolvida',member_joined:'Jogador entrou',member_left:'Jogador saiu',member_removed:'Jogador removido'};const text=p.text||p.description||p.reason||p.player_name||p.monster||p.kind||'Um acontecimento foi registrado.';return {id:ev.id,title:labels[ev.event_type]||'Acontecimento',text,at:ev.created_at||new Date().toISOString(),actor:ev.actor_id,own:ev.actor_id===currentUserId()}}).sort((a,b)=>Date.parse(b.at)-Date.parse(a.at)).slice(0,40);
  }
  function v411NotificationReadKey(){return `aethra.v411.notifications-read.${state.campaign?.id||'none'}.${currentUserId()}`}
  function v411NotificationReadAt(){try{return Number(localStorage.getItem(v411NotificationReadKey())||0)}catch{return 0}}
  function v411MarkNotificationsRead(){try{localStorage.setItem(v411NotificationReadKey(),String(Date.now()))}catch(error){console.warn('Não foi possível salvar a leitura local das notificações.',error)}}
  function v411NotificationUnread(){const readAt=v411NotificationReadAt();return v411NotificationRows().filter(n=>!n.own&&Date.parse(n.at)>readAt).length}
  function renderV411ConnectionPanel(){
    const status=v411ConnectionState(),online=state.members.filter(memberIsOnline).length,total=state.members.length,last=state.lastSyncAt?new Date(state.lastSyncAt).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}):'Ainda não sincronizado',unread=v411NotificationUnread();
    return `<section class="panel v411-connection-panel"><div class="v411-connection-main"><span class="v411-connection-dot ${status.tone}"></span><div><strong>${esc(status.label)}</strong><small>${online}/${total} participante(s) online · Última sincronização: ${esc(last)}</small></div></div><div class="v411-connection-actions"><button class="btn btn-secondary btn-small" data-action="v411-open-notifications">Notificações ${unread?`<span class="v411-unread-count">${unread}</span>`:''}</button>${state.backendReady?`<button class="btn btn-quiet btn-small" data-action="v411-reconnect">Reconectar / sincronizar</button>`:''}</div></section>`;
  }
  function renderV411UndoPanel(gs){
    if(!isMaster()||!isMasterController())return '';
    const item=v411LastUndo(gs);if(!item)return '';
    return `<div class="v411-undo-panel"><div><small>ÚLTIMA ALTERAÇÃO REVERSÍVEL</small><strong>${esc(item.summary)}</strong><span>${new Date(item.at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})} · somente a última ação do mestre</span></div><button class="btn btn-secondary btn-small" data-action="v411-undo-last">Desfazer ação</button></div>`;
  }
  function renderV411NotificationsModal(){
    const rows=v411NotificationRows(),html=`<div class="v411-notification-toolbar"><span class="tag gold">${v411NotificationUnread()} não lida(s) neste dispositivo</span><button class="btn btn-secondary btn-small" data-action="v411-mark-notifications-read">Marcar como lidas</button></div><div class="v411-notification-list">${rows.map(n=>`<article class="v411-notification-item ${n.own?'own':''}"><time>${new Date(n.at).toLocaleString('pt-BR')}</time><strong>${esc(n.title)}</strong><p>${esc(n.text)}</p></article>`).join('')||'<div class="empty-state"><strong>Nenhuma notificação</strong><p>Eventos importantes da campanha aparecerão aqui.</p></div>'}</div><div class="notice">O histórico de notificações é montado a partir dos eventos da campanha. O estado de leitura é local a este dispositivo e não altera o diário compartilhado.</div>`;
    v4ModalShell('Notificações da campanha','Acompanhe entradas, decisões, rolagens, combates e alterações importantes.',html);
  }
  function renderV411TurnSummary(enc){
    if(!enc||enc.defeated||enc.partyDefeated)return '';
    const turn=activeCombatTurn(enc);if(!turn)return '';
    const key=`${enc.round||1}:${turn.kind==='player'?turn.user_id:turn.id}`,used=Math.max(0,Number(enc.movementUsed?.[key])||0);
    let hpText='',actionText='Ação da criatura disponível',conditionText='',target=null;
    if(turn.kind==='player'){
      const member=state.members.find(m=>m.user_id===turn.user_id),character=member?.character?normalizeCharacter(member.character):null,vitals=character?currentPartyVitals(turn.user_id,character):null,ps=(state.campaign?.game_state?.partyState||{})[turn.user_id]||{};target=vitals;
      if(vitals)hpText=`${vitals.hp}/${vitals.maxHp} HP`;
      actionText=hasCondition(vitals,'stunned')?'Ação perdida · Atordoado':ps.abilityUsed?'Habilidade especial já utilizada neste encontro':'Ação principal disponível';
      conditionText=(vitals?.conditions||[]).map(c=>COMBAT_CONDITIONS[c.id]?.name||c.id).join(' · ');
    }else{
      target=(enc.enemies||[]).find(e=>e.id===turn.id)||enc;hpText=`${Math.max(0,Number(target.hp)||0)}/${Math.max(1,Number(target.maxHp)||1)} HP`;actionText=hasCondition(target,'stunned')?'Ação perdida · Atordoado':target.bossPhaseName||target.specialName||'Ação da criatura disponível';conditionText=(target.conditions||[]).map(c=>COMBAT_CONDITIONS[c.id]?.name||c.id).join(' · ');
    }
    const movementLimit=conditionModifiers(target||{}).movement,remaining=Math.min(Math.max(0,4-used),Number.isFinite(movementLimit)?Math.max(0,movementLimit):4);
    return `<div class="v411-turn-summary"><div class="v411-turn-head"><span class="tag gold">RESUMO DO TURNO</span><strong>${esc(turn.name)}</strong><small>Rodada ${enc.round||1} · ${turn.kind==='monster'?'Criatura':'Aventureiro'}${hpText?' · '+esc(hpText):''}</small></div><div class="v411-turn-metrics"><div><small>Movimento restante</small><strong>${remaining}/4 casas</strong><span class="v411-mini-track"><i style="width:${Math.min(100,remaining/4*100)}%"></i></span></div><div><small>Ação</small><strong>${esc(actionText)}</strong></div><div><small>Condições</small><strong>${esc(conditionText||'Nenhuma')}</strong></div></div></div>`;
  }
  function v411SessionCloseSummary(gs){
    const v41=v41GameData(gs),start=Date.parse(v41.session.startedAt||'')||0,rows=v41JournalRows().filter(r=>!start||Date.parse(r.at)>=start),count=type=>state.events.filter(ev=>!start||Date.parse(ev.created_at||'')>=start).filter(ev=>type.includes(ev.event_type)).length;
    const quests=Array.isArray(gs.quests)?gs.quests:[],completed=quests.filter(q=>q.completed||q.status==='completed').length;
    const lines=[`Campanha: ${state.campaign?.name||'Reino de Aethra'}`,`Capítulo: ${gs.chapter||'—'}`,`Local: ${gs.location||'—'}`,`Acontecimentos registrados: ${rows.length}`,`Encontros iniciados: ${count(['encounter_started'])}`,`Ações de combate: ${count(['combat_action_result','monster_attack_result'])}`,`Rolagens: ${count(['dice_result'])}`,`Objetivos de missão concluídos: ${completed}/${quests.length}`,'','Principais acontecimentos:',...rows.slice(-12).map(r=>`• ${r.text}`)];return lines.join('\n');
  }
  function renderV411CloseSessionModal(){
    if(!isMaster()||!isMasterController())return;
    const gs=state.campaign?.game_state||defaultGameState(),summary=v411SessionCloseSummary(gs);
    const html=`<form id="v411-close-session-form"><div class="notice"><strong>Encerramento da sessão.</strong> O resumo será publicado no Diário da Crônica para todos os participantes. Revise o texto antes de concluir; as campanhas, fichas e missões permanecem salvas.</div><div class="field"><label for="v411-close-summary">RESUMO DA SESSÃO</label><textarea class="textarea" id="v411-close-summary" rows="12" maxlength="8000" required>${esc(summary)}</textarea></div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Continuar jogando</button><button type="submit" class="btn btn-primary">Salvar resumo e encerrar sessão</button></div></form>`;
    v4ModalShell('Encerrar sessão','Registre o que aconteceu e deixe a próxima sessão preparada.',html);
  }
  async function finishV411Session(summary){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode encerrar a sessão.');
    const text=String(summary||'').trim();if(!text)throw new Error('Revise e salve um resumo antes de encerrar.');
    const gs=state.campaign.game_state||defaultGameState(),v4=v4GameData(gs),v41=createV41Checkpoint(gs,'Antes de encerrar a sessão');
    v41.session={...v41.session,status:'paused',pausedAt:new Date().toISOString(),readyBy:{}};v4.lastSessionSummary=text;
    const journalEntries=[...(gs.journalEntries||[]),{id:`session-close-${Date.now()}`,text:`Resumo da sessão: ${text}`,kind:'summary',createdAt:new Date().toISOString()}].slice(-80);
    await updateGameState({started:false,activeRollPrompt:null,v41,v4,journalEntries},'paused');
    await createEvent('session_note',{kind:'summary',text:`Sessão encerrada. ${text.slice(0,520)}`});
    state.view='lobby';closeModal();render();toast('Sessão encerrada. Resumo salvo no diário e ponto de restauração criado.');
  }
  function compactCheckpointCopies(gameState){
    const current=cloneData(gameState||{});
    const v41=v41GameData(current);
    v41.snapshots=(v41.snapshots||[]).slice(-3).map(entry=>{
      const item=cloneData(entry||{});
      if(item.gameState&&typeof item.gameState==='object'){
        const nested=item.gameState;
        if(nested.v41&&typeof nested.v41==='object')nested.v41={...nested.v41,snapshots:[]};
        if(nested.v411&&typeof nested.v411==='object')nested.v411={...nested.v411,undoHistory:[]};
        item.gameState=nested;
      }
      return item;
    });
    current.v41=v41;
    const undo=v411GameData(current);
    undo.undoHistory=(undo.undoHistory||[]).slice(-8).map(entry=>{
      const item=cloneData(entry||{}),before=item.before||{};
      if(before.v41?.present&&before.v41.value&&typeof before.v41.value==='object')before.v41.value={...before.v41.value,snapshots:[]};
      item.before=before;return item;
    });
    current.v411=undo;
    return current;
  }
  function createV41Checkpoint(gs,reason='Ponto de restauração'){
    const current=compactCheckpointCopies(gs||defaultGameState());
    current.v41={...v41GameData(current),snapshots:[]};
    const snapshot={id:`v41-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,reason:String(reason).slice(0,100),createdAt:new Date().toISOString(),gameState:current};
    const data=v41GameData(gs);return {...data,snapshots:[...data.snapshots,snapshot].slice(-3)};
  }
  function v41CheckpointAge(data){const last=(data.snapshots||[]).at(-1);return last?Date.now()-Date.parse(last.createdAt||0):Infinity}
  function v41AttributeModifier(userId,attribute){
    const member=state.members.find(m=>m.user_id===userId&&m.character);if(!member)return 0;
    const c=normalizeCharacter(member.character);const map={Força:'forca',Forca:'forca',Destreza:'destreza',Constituição:'constituicao',Constituicao:'constituicao',Inteligência:'inteligencia',Inteligencia:'inteligencia',Sabedoria:'sabedoria',Carisma:'carisma',Percepção:'sabedoria',Percepcao:'sabedoria',Investigação:'inteligencia',Investigacao:'inteligencia',Furtividade:'destreza',Persuasão:'carisma',Persuasao:'carisma',Salvaguarda:'constituicao'};
    const key=map[attribute]||attribute;return c.attributes?.[key]!=null?attrMod(c.attributes[key]):0;
  }
  function v41RollForPrompt(prompt,userId){
    const a=secureD20(),b=prompt.mode==='normal'?null:secureD20();
    const natural=b==null?a:(prompt.mode==='advantage'?Math.max(a,b):Math.min(a,b));
    const modifier=v41AttributeModifier(userId,prompt.attribute)+Number(prompt.bonus||0);
    const total=natural+modifier,dc=prompt.dc==null?null:Number(prompt.dc);
    return {rolls:b==null?[a]:[a,b],natural,modifier,total,dc,success:dc==null?null:total>=dc,mode:prompt.mode||'normal'};
  }
  function v41PrivateRollKey(){return `aethra.v41.private-rolls.${state.campaign?.id||'none'}.${currentUserId()}`}
  function readV41PrivateRolls(){try{return JSON.parse(localStorage.getItem(v41PrivateRollKey())||'[]').slice(-50)}catch{return []}}
  function saveV41PrivateRoll(result){const rows=readV41PrivateRolls();rows.push({...result,storedAt:new Date().toISOString()});try{localStorage.setItem(v41PrivateRollKey(),JSON.stringify(rows.slice(-50)))}catch(e){console.warn('Não foi possível salvar o teste reservado neste navegador.',e)}}
  async function toggleV41Ready(ready){
    if(isMaster())throw new Error('O mestre administra o início da sessão; a confirmação de preparo é dos jogadores.');
    const status=v41GameData().session.readyBy[currentUserId()];const next=ready===undefined?!status:!!ready;
    if(next&&!state.member?.character)throw new Error('Crie ou selecione sua ficha antes de confirmar presença.');
    await createEvent('v41_ready_request',{ready:next});
    toast(next?'Você marcou que está pronto.':'Sua confirmação foi removida.');
  }
  async function processV41ReadyRequest(ev){
    if(!isMaster()||!isMasterController()||state.campaign?.status==='active')return;
    const member=state.members.find(m=>m.user_id===ev.actor_id&&m.role==='player');if(!member)return;
    const data=v41GameData(),readyBy={...data.session.readyBy,[ev.actor_id]:!!ev.payload?.ready};
    await updateGameState({v41:{...data,session:{...data.session,readyBy}}});
    toast(`${member.character?.name||member.display_name||'Aventureiro'} ${ev.payload?.ready?'está pronto':'não está marcado como pronto'}.`);
  }
  async function createV41MapPing(x,y,fromPlayer=false,kind='attention',playerName=''){
    const gs=state.campaign?.game_state||defaultGameState(),ex=explorationData(gs),rec=activeMapRecord(gs);
    if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>=MAP_WIDTH||y>=MAP_HEIGHT)throw new Error('Coordenada inválida.');
    const markerKind=['attention','danger','route'].includes(kind)?kind:'attention';
    const payload={map_id:ex.mapId,x,y,type:fromPlayer?'attention':markerKind,player_name:playerName||state.member?.character?.name||state.member?.display_name||'Aventureiro'};
    if(fromPlayer){if(!mapCellVisible(x,y,rec,gs))throw new Error('Só é possível marcar uma casa já revelada.');await createEvent('v41_map_ping_request',payload);toast('Pedido de marcação enviado ao mestre.');return;}
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode publicar marcações compartilhadas.');
    const data=v41GameData(gs),pings=data.mapPings.filter(p=>p.mapId===ex.mapId&&Date.now()-Date.parse(p.createdAt||0)<6*60*60*1000);
    const labels={attention:'Ponto de atenção',danger:'Perigo',route:'Rota sugerida'};
    pings.push({id:`ping-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,mapId:ex.mapId,x,y,type:markerKind,label:labels[markerKind],createdAt:new Date().toISOString()});
    await updateGameState({v41:{...data,mapPings:pings.slice(-24)}});await createEvent('session_note',{kind:'map-ping',text:`${labels[markerKind]} marcado em ${String.fromCharCode(65+x)}${y+1} por ${payload.player_name}.`});
  }
  async function processV41MapPingRequest(ev){
    if(!isMaster()||!isMasterController())return;const m=state.members.find(x=>x.user_id===ev.actor_id&&x.role==='player');if(!m)return;
    await createV41MapPing(Number(ev.payload?.x),Number(ev.payload?.y),false,'attention',m.character?.name||m.display_name||ev.payload?.player_name||'Jogador');toast(`${m.character?.name||m.display_name||'Jogador'} marcou uma área do mapa.`);
  }
  async function clearV41MapPings(){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode limpar as marcações.');const data=v41GameData();await updateGameState({v41:{...data,mapPings:[]}});toast('Marcações removidas do mapa.');}
  async function restoreV41Checkpoint(id){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode restaurar um ponto.');
    const gs=state.campaign?.game_state||defaultGameState(),data=v41GameData(gs),item=data.snapshots.find(x=>x.id===id);if(!item?.gameState)throw new Error('Ponto de restauração não encontrado.');
    if(!window.confirm(`Restaurar “${item.reason}” de ${new Date(item.createdAt).toLocaleString('pt-BR')}? O estado atual da campanha será substituído.`))return;
    const restored=cloneData(item.gameState);restored.v41={...v41GameData(restored),snapshots:data.snapshots,restoredAt:new Date().toISOString(),restoredFrom:id};
    await updateGameState(restored,state.campaign.status,true);await createEvent('session_note',{kind:'backup',text:`Ponto de restauração recuperado: ${item.reason}.`});closeModal();toast('Ponto de restauração recuperado.');
  }
  function v41JournalRows(){
    const gs=state.campaign?.game_state||defaultGameState(),rows=[];
    (gs.journalEntries||[]).forEach((item,i)=>rows.push({id:item.id||`journal-${i}`,kind:item.kind||'story',text:item.text||'',at:item.createdAt||item.at||new Date().toISOString(),source:'Diário'}));
    state.events.forEach((ev,i)=>{const p=ev.payload||{};if(!['session_note','encounter_started','encounter_defeated','party_defeated','combat_action_result','monster_attack_result','turn_advanced','narration','dice_result','voice_action_resolved','member_joined','member_left','member_removed'].includes(ev.event_type))return;const text=p.text||p.description||p.reason||p.monster||({encounter_started:'Encontro iniciado',encounter_defeated:'Encontro vencido',party_defeated:'Companhia derrotada',turn_advanced:'Turno avançado',narration:'Narração publicada',dice_result:`${p.player_name||'Aventureiro'} rolou ${p.result}`,voice_action_resolved:`${p.player_name||'Aventureiro'} · ${p.action_label||'Ação'} ${p.accepted?'registrada pelo mestre':'dispensada pelo mestre'}`,member_joined:`${p.display_name||'Um jogador'} entrou na campanha`,member_left:`${p.display_name||'Um jogador'} saiu da campanha`,member_removed:`${p.display_name||'Um jogador'} foi removido da campanha`}[ev.event_type]||ev.event_type);rows.push({id:ev.id||`event-${i}`,kind:p.kind||(ev.event_type==='voice_action_resolved'?'voice':ev.event_type),text,at:ev.created_at||new Date().toISOString(),source:'Evento'});});
    const seen=new Set(),deduped=rows.filter(row=>{const key=`${row.kind}|${String(row.text).trim().toLowerCase()}|${Math.floor(Date.parse(row.at)/5000)}`;if(seen.has(key))return false;seen.add(key);return true;});return deduped.sort((a,b)=>Date.parse(a.at)-Date.parse(b.at)).slice(-300);
  }
  function v41JournalSummary(){const rows=v41JournalRows().slice(-20);return rows.map(r=>`• ${new Date(r.at).toLocaleString('pt-BR')} — ${r.text}`).join('\n')||'Nenhum acontecimento registrado nesta campanha.'}
  function renderV41SessionRoom(gs){
    const data=v41GameData(gs),players=state.members.filter(m=>m.role==='player'),ready=players.filter(m=>m.character&&data.session.readyBy[m.user_id]).length,all=players.length>0&&ready===players.length&&players.every(m=>!!m.character),voice=v4GameData(gs).voiceSession||{};
    const callLink=voiceCallUrl(voice.platform,voice.url);
    const call=voice.enabled?`<span class="tag green">Chamada ${esc(voicePlatformName(voice.platform))} ativada</span>`:'<span class="tag">Chamada externa opcional</span>';
    const callAction=callLink?`<button class="btn btn-secondary btn-small" data-action="voice-open-call">Abrir ${esc(voicePlatformName(voice.platform))} ↗</button>`:'';
    return `<section class="panel v41-session-room"><div class="row between"><div><div class="small-caps">Preparação da sessão · v4.2.4</div><h3>Sala de preparação</h3><p class="panel-subtitle">Confira fichas e presença; cada jogador confirma que está pronto antes de começar.</p></div><span class="tag ${all?'green':'gold'}">${ready}/${players.length} prontos</span></div><div class="v41-ready-list">${players.map(m=>{const has=!!m.character,isReady=!!data.session.readyBy[m.user_id]&&has;return `<div class="v41-ready-row"><span class="v41-ready-dot ${isReady?'ready':''}"></span><span><strong>${esc(m.character?.name||m.display_name||'Aventureiro')}</strong><small>${has?`${esc(m.character.class)} · nível ${m.character.level||1}`:'Ficha pendente'} · ${memberIsOnline(m)?'Online':'Offline'}</small></span><span class="tag ${isReady?'green':'gold'}">${isReady?'Pronto':has?'Aguardando':'Sem ficha'}</span></div>`}).join('')||'<p class="panel-subtitle">Compartilhe o convite para reunir a companhia.</p>'}</div><div class="v41-room-footer"><div class="v41-room-state"><span class="panel-subtitle">Estado: ${data.session.status==='live'?'Sessão em andamento':data.session.status==='paused'?'Pausada':'Preparação'}</span>${call}</div><div class="row">${callAction}${isMaster()?`<span class="panel-subtitle">${all?'Todos os jogadores com ficha estão prontos.':'Você pode iniciar mesmo com confirmações pendentes.'}</span>`:`<button class="btn ${data.session.readyBy[currentUserId()]?'btn-secondary':'btn-primary'} btn-small" data-action="v41-toggle-ready" ${state.member?.character?'':'disabled'}>${state.member?.character?(data.session.readyBy[currentUserId()]?'Desmarcar pronto':'Estou pronto'):'Crie sua ficha para confirmar'}</button>`}</div></div></section>`;
  }
  function renderV41MasterStatus(gs){
    const data=v41GameData(gs),players=state.members.filter(m=>m.role==='player'),ready=players.filter(m=>data.session.readyBy[m.user_id]).length;
    return `<div class="v41-master-status"><div><small>Preparação</small><strong>${ready}/${players.length} prontos</strong></div><div><small>Marcas no mapa</small><strong>${data.mapPings.length}</strong></div><div><small>Pontos de restauração</small><strong>${data.snapshots.length}/3</strong></div><div><small>Linha do tempo</small><strong>${v41JournalRows().length} registros</strong></div></div>`;
  }
  function renderV41PlayerHelp(character,gs){
    if(!character)return '';const c=normalizeCharacter(character),turn=activeCombatTurn(gs?.encounter),inTurn=turn?.kind==='player'&&turn.user_id===currentUserId();
    const attrs=Object.entries(c.attributes||{}).map(([k,v])=>`${k}: ${attrMod(v)>=0?'+':''}${attrMod(v)}`).join(' · ');
    return `<details class="v41-player-help"><summary>Ajuda rápida · como jogar com minha ficha?</summary><div class="v41-help-body"><p><strong>Exploração:</strong> converse pela chamada, escolha uma intenção e use os atalhos rápidos. Peça ao mestre para marcar ou revelar áreas no mapa.</p><p><strong>Combate:</strong> acompanhe a ordem de iniciativa. ${inTurn?'Seu turno está ativo.':'Espere seu nome aparecer como turno atual.'} Use ataque básico, habilidade ou poção no cartão de combate.</p><p><strong>Testes:</strong> quando o mestre solicitar um D20, toque em “Responder ao D20”. O sistema aplica o atributo e a regra selecionada.</p><small>Modificadores da ficha: ${esc(attrs)}</small><div class="row" style="margin-top:10px"><button class="btn btn-secondary btn-small" data-action="open-character-sheet">Minha ficha</button><button class="btn btn-secondary btn-small" data-action="open-inventory">Inventário</button><button class="btn btn-secondary btn-small" data-action="v4-open-skill">Habilidades</button></div></div></details>`;
  }
  function renderV41BestiaryModal(){
    const selected=MONSTERS.find(m=>m.id===state.bestiarySelectedId)||null,chosenIds=Array.isArray(state.bestiaryEncounterIds)?state.bestiaryEncounterIds:[],v4=v4GameData(),presets=v4.encounterPresets||[];
    const filtered=MONSTERS.filter(m=>(state.bestiaryKind==='all'||String(m.kind||'').toLowerCase().includes(state.bestiaryKind))&&(`${m.name} ${m.kind} ${m.threat} ${m.specialName} ${m.specialDescription}`).toLowerCase().includes((state.bestiarySearch||'').toLowerCase()));
    const kinds=[...new Set(MONSTERS.map(m=>String(m.kind||'Criatura').split(' ')[0].toLowerCase()))].sort();
    const list=`<div class="v41-bestiary-list-panel v413-bestiary-list-panel v414-bestiary-list-panel v415-bestiary-list-panel v417-bestiary-list-panel"><div class="v41-bestiary-toolbar v413-bestiary-toolbar"><input class="input" id="v41-bestiary-search" value="${esc(state.bestiarySearch||'')}" placeholder="Pesquisar nome, tipo ou habilidade..." aria-label="Pesquisar monstros"><select class="select" id="v41-bestiary-kind" aria-label="Filtrar por tipo"><option value="all">Todos os tipos</option>${kinds.map(k=>`<option value="${esc(k)}" ${state.bestiaryKind===k?'selected':''}>${esc(k[0].toUpperCase()+k.slice(1))}</option>`).join('')}</select><span class="tag">${filtered.length}/${MONSTERS.length}</span></div><div class="v41-bestiary-grid v413-bestiary-grid v414-bestiary-grid v415-bestiary-grid v416-bestiary-grid v417-bestiary-grid" aria-label="Lista vertical de monstros">${filtered.map(m=>{const added=chosenIds.includes(m.id);return `<article class="v413-monster-option-wrap v414-monster-option-wrap v415-monster-option-wrap"><button type="button" class="v41-bestiary-card v413-monster-option v414-monster-option ${m.id===state.bestiarySelectedId?'selected':''}" data-action="v41-bestiary-select" data-monster-id="${esc(m.id)}" data-search="${esc([m.name,m.kind,m.threat,m.specialName,m.specialDescription].join(' ').toLowerCase())}" title="${esc(m.name)}" aria-label="Selecionar ${esc(m.name)}" aria-pressed="${m.id===state.bestiarySelectedId?'true':'false'}"><span class="v413-monster-option-thumb v414-monster-option-thumb">${mapMonsterMiniature({templateId:m.id,name:m.name,boss:/CHEFE/i.test(m.threat||'')})}</span></button></article>`}).join('')||'<div class="empty-state">Nenhuma criatura corresponde à pesquisa.</div>'}</div></div>`;
    const detail=selected?`<aside class="v41-bestiary-detail v413-bestiary-detail v414-bestiary-detail v415-bestiary-detail v417-bestiary-detail"><div class="v41-bestiary-detail-main v413-bestiary-detail-main v414-bestiary-detail-main"><div class="v41-bestiary-art v413-bestiary-art v414-bestiary-art" aria-label="Miniatura de ${esc(selected.name)}">${mapMonsterMiniature({templateId:selected.id,name:selected.name,boss:/CHEFE/i.test(selected.threat||'')})}<span class="v413-art-caption">Miniatura do bestiário</span></div><div class="v41-bestiary-detail-copy v413-bestiary-detail-copy"><span class="tag gold">${esc(selected.threat||selected.kind)}</span><h3>${esc(selected.name)}</h3><p>${esc(selected.specialDescription||'Criatura registrada no bestiário.')}</p><div class="v41-bestiary-stats"><span><small>HP</small><strong>${selected.hp}</strong></span><span><small>Defesa</small><strong>${selected.defense}</strong></span><span><small>Ataque</small><strong>+${selected.attackBonus||0}</strong></span><span><small>XP</small><strong>${selected.xpReward||0}</strong></span></div><div class="v413-special-ability"><small>HABILIDADE ESPECIAL</small><strong>${esc(selected.specialName||'Habilidade')}</strong></div><div class="v41-bestiary-detail-actions v413-bestiary-detail-actions">${isMaster()?`<button class="btn btn-secondary btn-small" data-action="v41-bestiary-toggle-encounter" data-monster-id="${esc(selected.id)}">${chosenIds.includes(selected.id)?'Remover da composição':'Adicionar à composição'}</button>`:''}<button class="btn btn-primary btn-small" data-action="v41-bestiary-start" data-monster-id="${esc(selected.id)}" ${isMaster()&&isMasterController()?'':'disabled'}>Iniciar encontro individual</button></div></div></div></aside>`:'<aside class="v41-bestiary-detail v413-bestiary-detail v414-bestiary-detail"><div class="empty-state"><strong>Selecione uma criatura</strong><p>Escolha um monstro na lista à esquerda para consultar sua miniatura, atributos e habilidade.</p></div></aside>';
    const builder=isMaster()?`<div class="v41-encounter-builder"><div class="row between"><div><strong>Composição do encontro</strong><small>${chosenIds.length} criatura(s) selecionada(s)</small></div><div class="row"><button class="btn btn-quiet btn-small" data-action="v41-bestiary-clear">Limpar</button><button class="btn btn-secondary btn-small" data-action="v41-bestiary-save-preset" ${chosenIds.length&&isMasterController()?'':'disabled'}>Salvar composição</button><button class="btn btn-primary btn-small" data-action="v41-bestiary-start-selected" ${chosenIds.length&&isMaster()&&isMasterController()?'':'disabled'}>Iniciar encontro (${chosenIds.length})</button></div></div><div class="v41-encounter-chips">${chosenIds.map(id=>{const m=MONSTERS.find(x=>x.id===id);return m?`<span class="tag gold">${esc(m.name)}</span>`:''}).join('')||'<span class="panel-subtitle">Adicione criaturas à composição para preparar um encontro com vários tipos.</span>'}</div></div>`:'';
    const saved=isMaster()&&isMasterController()&&presets.length?`<div class="v41-saved-presets"><h4>Encontros salvos</h4>${presets.slice().reverse().map(p=>`<div class="v41-preset-row"><span><strong>${esc(p.name)}</strong><small>${(p.monsterIds||[]).map(id=>MONSTERS.find(m=>m.id===id)?.name).filter(Boolean).join(' · ')}</small></span><span class="row"><button class="btn btn-secondary btn-small" data-action="v41-preset-start" data-preset-id="${esc(p.id)}">Usar</button><button class="btn btn-quiet btn-small" data-action="v41-preset-delete" data-preset-id="${esc(p.id)}">×</button></span></div>`).join('')}</div>`:'';
    v4ModalShell('Bestiário e preparador de encontros','Selecione uma criatura na lista vertical. A miniatura e as informações completas aparecem ao lado.',`${builder}<div class="v41-bestiary-layout v413-bestiary-layout v414-bestiary-layout">${list}${detail}</div>${saved}`);
  }
  function renderV41JournalModal(){
    const rows=v41JournalRows().filter(r=>(state.journalFilter==='all'||r.kind===state.journalFilter)&&(`${r.text} ${r.kind} ${r.source}`).toLowerCase().includes((state.journalSearch||'').toLowerCase())).reverse();
    const filters=[['all','Tudo'],['scene','Cenas'],['discovery','Descobertas'],['quest','Missões'],['choice','Decisões'],['combat_action_result','Combate'],['dice-roll','Rolagens universais'],['dice-application','Efeitos de dados'],['summary','Resumos'],['reward','Recompensas'],['voice','Ações por voz'],['test-summary','Testes coletivos'],['map-ping','Marcas no mapa']];
    const html=`<div class="v41-journal-toolbar"><input class="input" id="v41-journal-search" value="${esc(state.journalSearch||'')}" placeholder="Pesquisar acontecimentos..."><select class="select" id="v41-journal-filter">${filters.map(([v,l])=>`<option value="${v}" ${state.journalFilter===v?'selected':''}>${l}</option>`).join('')}</select><button class="btn btn-secondary btn-small" data-action="v41-journal-export">Exportar texto</button>${isMaster()&&isMasterController()?'<button class="btn btn-primary btn-small" data-action="v41-journal-save-summary">Salvar resumo da sessão</button>':''}</div><div class="v41-timeline">${rows.map(r=>`<article class="v41-timeline-item"><time>${new Date(r.at).toLocaleString('pt-BR')}</time><span class="tag">${esc(r.kind)}</span><p>${esc(r.text)}</p></article>`).join('')||'<div class="empty-state"><strong>Nenhum registro encontrado</strong><p>As cenas, decisões, descobertas, combates e recompensas aparecerão nesta linha do tempo.</p></div>'}</div><div class="notice">A linha do tempo reúne registros narrativos e eventos da campanha. Anotações secretas do mestre não são incluídas.</div>`;
    v4ModalShell('Linha do tempo da campanha','Consulte e filtre os acontecimentos registrados desde o início da aventura.',html);
  }
  function renderV41RollModal(){
    if(!isMaster()||!isMasterController())return;const players=state.members.filter(m=>m.role==='player'&&m.character),enc=state.campaign?.game_state?.encounter,enemies=Array.isArray(enc?.enemies)&&enc.enemies.length?enc.enemies:enc?[enc]:[],living=enemies.filter(e=>!e.defeated&&Number(e.hp)>0);
    const attr=['','Força','Destreza','Constituição','Inteligência','Sabedoria','Carisma','Percepção','Investigação','Furtividade','Persuasão','Salvaguarda'];
    const html=`<form id="v41-roll-form"><div class="form-grid"><div class="field"><label for="v41-roll-target">QUEM ROLA?</label><select class="select" id="v41-roll-target"><option value="all">Todos os jogadores · coletivo/resistido</option>${players.map(m=>`<option value="${esc(m.user_id)}">${esc(m.character.name)}</option>`).join('')}</select></div><div class="field"><label for="v41-roll-type">FORMATO</label><select class="select" id="v41-roll-type"><option value="individual">Teste individual</option><option value="collective">Teste coletivo</option><option value="opposed">Teste resistido</option></select></div><div class="field"><label for="v41-roll-attribute">ATRIBUTO</label><select class="select" id="v41-roll-attribute">${attr.map(a=>`<option value="${esc(a)}">${a||'Sem modificador'}</option>`).join('')}</select></div><div class="field"><label for="v41-roll-opponent">OPONENTE (OPCIONAL)</label><select class="select" id="v41-roll-opponent"><option value="">Sem monstro · comparar jogadores</option>${living.map(m=>`<option value="${esc(m.id)}">${esc(m.name)} · +${Number(m.attackBonus??m.attack??0)||0}</option>`).join('')}</select></div><div class="field"><label for="v41-roll-dc">DIFICULDADE (CD)</label><input class="input" type="number" id="v41-roll-dc" min="1" max="40" placeholder="Opcional"></div><div class="field"><label for="v41-roll-bonus">BÔNUS OU PENALIDADE EXTRA</label><input class="input" type="number" id="v41-roll-bonus" min="-20" max="20" value="0"></div><div class="field"><label for="v41-roll-mode">VANTAGEM / DESVANTAGEM</label><select class="select" id="v41-roll-mode"><option value="normal">Normal</option><option value="advantage">Vantagem · maior de 2 D20</option><option value="disadvantage">Desvantagem · menor de 2 D20</option></select></div><div class="field"><label for="v41-roll-visibility">RESULTADO</label><select class="select" id="v41-roll-visibility"><option value="public">Visível a todos</option><option value="master">Reservado ao mestre</option></select></div></div><div class="field"><label for="v41-roll-reason">O QUE ESTÁ SENDO TESTADO?</label><input class="input" id="v41-roll-reason" maxlength="140" required placeholder="Ex.: perceber a armadilha antes de atravessar"></div><div class="notice">O modificador vem do atributo da ficha, somado ao bônus extra. Em testes resistidos, o mestre pode comparar os jogadores entre si ou contra o bônus de ataque de um monstro do encontro. Testes reservados guardam os resultados apenas neste dispositivo do mestre.</div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button type="submit" class="btn btn-primary" ${players.length?'':'disabled'}>Solicitar D20</button></div></form>`;
    v4ModalShell('Testes inteligentes de D20','Atributos, dificuldade, vantagem, desvantagem, testes coletivos e disputas contra monstros.',html);
  }
  // Dados facetados da v4.2.4: SVG leve, sem imagens externas e animado apenas por transform/opacity.
  function v424DieMarkup(sides,value,extraClass=''){
    const n=Number(value)||1, common=`<defs><linearGradient id="v424-metal-${sides}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0d69a"/><stop offset=".34" stop-color="#a77d43"/><stop offset=".72" stop-color="#33271d"/><stop offset="1" stop-color="#d3b06b"/></linearGradient><linearGradient id="v424-face-${sides}" x1="0" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="#79603a"/><stop offset=".52" stop-color="#30251c"/><stop offset="1" stop-color="#17171a"/></linearGradient><radialGradient id="v424-glow-${sides}" cx="30%" cy="20%"><stop offset="0" stop-color="#fff0be" stop-opacity=".72"/><stop offset="1" stop-color="#d8b36d" stop-opacity="0"/></radialGradient></defs>`;
    let shape='';
    if(sides===4){shape=`<polygon class="v424-die-face" points="80,10 148,139 12,139"/><path class="v424-die-line" d="M80 10 L80 139 M12 139 L105 91 L148 139 M80 10 L105 91 L12 139"/><polygon points="80,10 105,91 80,139 12,139" fill="url(#v424-glow-${sides})" opacity=".24"/>`;}
    else if(sides===6){shape=`<polygon class="v424-die-face" points="80,8 145,45 145,116 80,152 15,116 15,45"/><path class="v424-die-line" d="M80 8 L80 82 L15 45 M80 82 L145 45 M80 82 L80 152 M80 82 L145 116 M80 82 L15 116"/><polygon points="80,8 145,45 80,82 15,45" fill="url(#v424-glow-${sides})" opacity=".26"/><polygon points="80,82 145,45 145,116 80,152" fill="#070a0d" opacity=".2"/>`;}
    else if(sides===8){shape=`<polygon class="v424-die-face" points="80,7 146,80 80,153 14,80"/><path class="v424-die-line" d="M80 7 L80 153 M14 80 L146 80 M80 7 L43 80 L80 153 M80 7 L117 80 L80 153"/><polygon points="80,7 146,80 80,80" fill="url(#v424-glow-${sides})" opacity=".28"/><polygon points="14,80 80,80 80,153" fill="#090b10" opacity=".25"/>`;}
    else if(sides===10){shape=`<polygon class="v424-die-face" points="80,7 145,55 121,143 39,143 15,55"/><path class="v424-die-line" d="M80 7 L80 83 L15 55 M80 83 L145 55 M80 83 L121 143 M80 83 L39 143 M15 55 L80 7 L145 55"/><polygon points="80,7 145,55 80,83" fill="url(#v424-glow-${sides})" opacity=".28"/>`;}
    else if(sides===12){shape=`<polygon class="v424-die-face" points="80,6 132,26 154,80 132,134 80,154 28,134 6,80 28,26"/><path class="v424-die-line" d="M80 6 L80 80 L28 26 M80 80 L132 26 M80 80 L154 80 M80 80 L132 134 M80 80 L80 154 M80 80 L28 134 M80 80 L6 80"/><polygon points="80,6 132,26 80,80 28,26" fill="url(#v424-glow-${sides})" opacity=".25"/>`;}
    else if(sides===20){shape=`<polygon class="v424-die-face" points="80,4 126,15 155,53 151,100 119,143 80,157 41,143 9,100 5,53 34,15"/><path class="v424-die-line" d="M80 4 L80 82 L126 15 M80 82 L155 53 M80 82 L151 100 M80 82 L119 143 M80 82 L80 157 M80 82 L41 143 M80 82 L9 100 M80 82 L5 53 M80 82 L34 15 M80 82 L126 15"/><path class="v424-die-line v424-die-fine" d="M34 15 L5 53 L9 100 L41 143 M126 15 L155 53 L151 100 L119 143"/><polygon points="80,4 126,15 80,82 34,15" fill="url(#v424-glow-${sides})" opacity=".3"/>`;}
    return `<span class="v424-die-art ${extraClass} v424-die-d${sides}" role="img" aria-label="D${sides}, resultado ${n}"><svg viewBox="0 0 160 160" aria-hidden="true">${common}${shape}${sides===20?'<g class="v424-die-side-numbers"><text x="80" y="28" text-anchor="middle">12</text><text x="132" y="61" text-anchor="middle">8</text><text x="119" y="132" text-anchor="middle">14</text><text x="41" y="132" text-anchor="middle">3</text><text x="28" y="61" text-anchor="middle">17</text></g>':''}<text class="v424-die-number" x="80" y="91" text-anchor="middle">${n}</text><text class="v424-die-mark" x="80" y="116" text-anchor="middle">${sides===20?'AETHRA':`D${sides}`}</text></svg></span>`;
  }
  function showDice(result,player){
    const value=Math.max(1,Math.min(20,Number(result)||1)),overlay=document.createElement('div');
    overlay.className='dice-overlay v424-dice-overlay';
    overlay.innerHTML=`<div class="dice-stage v424-roll-stage"><div class="v424-roll-kicker">TESTE DE D20</div><div class="v424-roll-track"><div class="v424-die-flight">${v424DieMarkup(20,value)}</div></div><h2>${value===20?'Sucesso crítico!':value===1?'Falha crítica!':`Resultado do D20: ${value}`}</h2><p>${esc(player)} realizou uma rolagem</p><button class="btn btn-secondary btn-small" data-action="dismiss-dice">Continuar</button></div>`;
    document.body.append(overlay);playDiceSound();const timer=setTimeout(()=>{if(overlay.isConnected)overlay.remove()},3900);overlay.querySelector('[data-action="dismiss-dice"]').addEventListener('click',()=>{clearTimeout(timer);overlay.remove()});
  }
  function showUniversalDice(result){
    if(!result||!Array.isArray(result.rolls))return;
    const overlay=document.createElement('div');overlay.className='dice-overlay v424-dice-overlay v424-universal-overlay';
    const visible=result.rolls.map((value,index)=>`<div class="v424-universal-die" style="--die-delay:${Math.min(index,8)*.055}s;--die-start:${index%2===0?'-':'+'}${22+(index%4)*8}vw">${v424DieMarkup(result.sides,value)}</div>`).join('');
    const bonus=result.bonus>0?` + ${result.bonus}`:result.bonus<0?` − ${Math.abs(result.bonus)}`:'';
    overlay.innerHTML=`<div class="v424-universal-stage"><div class="v424-roll-kicker">ROLAGEM UNIVERSAL · D${Number(result.sides)||6}</div><h2>${esc(result.reason||'Rolagem de dados')}</h2><div class="v424-universal-dice-grid">${visible}</div><div class="v424-universal-total"><span>${esc(result.formula||'')}</span><strong>${Number(result.total)||0}</strong><small>${result.rolls.join(' + ')}${bonus} = ${Number(result.total)||0}</small></div><p>${result.visibility==='master'?'Rolagem reservada ao mestre':'Resultado publicado para a companhia'}</p><button class="btn btn-secondary btn-small" data-action="dismiss-dice">Continuar</button></div>`;
    document.body.append(overlay);playDiceSound();const timer=setTimeout(()=>{if(overlay.isConnected)overlay.remove()},5200);overlay.querySelector('[data-action="dismiss-dice"]').addEventListener('click',()=>{clearTimeout(timer);overlay.remove()});
  }
  const V423_DICE_SIDES=[4,6,8,10,12,20];
  function v423PrivateDiceKey(){return `aethra.v423.private-dice.${state.campaign?.id||'none'}.${currentUserId()}`}
  function readV423PrivateDice(){try{const rows=JSON.parse(localStorage.getItem(v423PrivateDiceKey())||'[]');return Array.isArray(rows)?rows.slice(-50):[]}catch{return []}}
  function saveV423PrivateDice(result){const rows=readV423PrivateDice();rows.push({...result,storedAt:new Date().toISOString()});try{localStorage.setItem(v423PrivateDiceKey(),JSON.stringify(rows.slice(-50)));return true}catch(error){console.warn('Não foi possível salvar a rolagem privada neste navegador.',error);return false}}
  function v423BuildFormula(count,sides,bonus){return `${count}d${sides}${bonus>0?` + ${bonus}`:bonus<0?` − ${Math.abs(bonus)}`:''}`}
  async function rollV423UniversalDice({count,sides,bonus,visibility,reason}){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode usar o Rolador Universal.');
    count=Math.max(1,Math.min(20,Math.floor(Number(count)||1)));sides=Number(sides);bonus=Math.max(-1000,Math.min(1000,Math.trunc(Number(bonus)||0)));
    if(!V423_DICE_SIDES.includes(sides))throw new Error('Escolha um tipo de dado válido.');
    const rolls=Array.from({length:count},()=>secureDie(sides)),diceTotal=rolls.reduce((sum,value)=>sum+value,0),total=diceTotal+bonus;
    const result={id:`v423-roll-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,count,sides,bonus,rolls,diceTotal,total,formula:v423BuildFormula(count,sides,bonus),reason:String(reason||'Rolagem livre').trim().slice(0,140)||'Rolagem livre',visibility:visibility==='master'?'master':'public',player_name:state.member?.display_name||'Mestre',createdAt:new Date().toISOString(),applied:null};
    state.v423LastRoll=result;
    if(result.visibility==='master'){
      const saved=saveV423PrivateDice(result);
      showUniversalDice(result);
      toast(saved?'Rolagem reservada salva somente neste dispositivo.':'Rolagem privada calculada, mas o navegador não conseguiu guardar o histórico.');
    }else{
      const sign=bonus>0?` + ${bonus}`:bonus<0?` − ${Math.abs(bonus)}`:'';
      const text=`Rolagem universal · ${result.reason}: ${result.formula} → ${rolls.join(' + ')}${sign} = ${total}.`;
      await createEvent('session_note',{kind:'dice-roll',text,formula:result.formula,count,sides,rolls,diceTotal,bonus,total,reason:result.reason,visibility:'public',player_name:result.player_name});
      toast('Rolagem publicada na Linha do Tempo da campanha.');
    }
    renderV423DiceModal();
    return result;
  }
  function v423DiceTargets(){
    const players=state.members.filter(member=>member.role==='player'&&member.character).map(member=>({value:`player:${member.user_id}`,label:`${member.character.name} · aventureiro`}));
    const enc=state.campaign?.game_state?.encounter,enemies=Array.isArray(enc?.enemies)&&enc.enemies.length?enc.enemies:enc?[enc]:[];
    const monsters=enemies.filter(enemy=>!enemy.defeated&&Number(enemy.hp)>0).map(enemy=>({value:`monster:${enemy.id}`,label:`${enemy.name} · criatura`}));
    return [...players,...monsters];
  }
  function renderV423DiceModal(){
    if(!isMaster()||!isMasterController())return;
    const result=state.v423LastRoll,privateRows=readV423PrivateDice().slice().reverse().slice(0,8),targets=v423DiceTargets();
    const resultHtml=result?`<section class="v423-dice-result"><div class="v423-dice-result-head"><div><span class="tag ${result.visibility==='master'?'gold':'green'}">${result.visibility==='master'?'RESERVADO AO MESTRE':'PÚBLICO NA CAMPANHA'}</span><h3>Resultado da rolagem</h3><p>${esc(result.reason)}</p></div><div class="v423-dice-total">${result.total}</div></div><div class="v423-dice-rolls">${result.rolls.map((value,index)=>v424DieMarkup(result.sides,value,'v424-die-mini')).join('')}</div><div class="v423-dice-equation"><strong>${esc(result.formula)}</strong><span>${result.rolls.join(' + ')}${result.bonus>0?` + ${result.bonus}`:result.bonus<0?` − ${Math.abs(result.bonus)}`:''} = <b>${result.total}</b></span></div>${result.applied?`<div class="notice">Resultado aplicado: ${esc(result.applied)}.</div>`:`<div class="v423-dice-apply"><h4>Aplicar resultado manualmente</h4><p>O valor não altera nenhuma ficha até você confirmar esta etapa.</p><div class="form-grid"><div class="field"><label for="v423-apply-target">ALVO</label><select class="select" id="v423-apply-target">${targets.map(target=>`<option value="${esc(target.value)}">${esc(target.label)}</option>`).join('')}</select></div><div class="field"><label for="v423-apply-effect">EFEITO NO HP</label><select class="select" id="v423-apply-effect"><option value="damage">Aplicar como dano</option><option value="healing">Aplicar como cura</option></select></div></div><button class="btn btn-primary" data-action="v423-apply-roll" ${targets.length&&result.total>0?'':'disabled'}>Aplicar ${Math.max(0,result.total)} pontos ao alvo</button>${targets.length?'':'<p class="panel-subtitle">Não há aventureiros ou criaturas ativas disponíveis como alvo. Para aplicar dano a monstros, inicie um encontro primeiro.</p>'}</div>`}</section>`:'<div class="empty-state"><strong>Nenhuma rolagem nesta abertura</strong><p>Configure os dados abaixo e faça sua primeira rolagem.</p></div>';
    const historyHtml=privateRows.length?`<div class="v423-private-history"><h4>Últimas rolagens reservadas neste dispositivo</h4>${privateRows.map(row=>`<div class="v423-private-history-row"><span><strong>${esc(row.reason||'Rolagem privada')}</strong><small>${new Date(row.storedAt||row.createdAt||Date.now()).toLocaleString('pt-BR')} · ${esc(row.formula||'')}</small></span><b>${Number(row.total)||0}</b></div>`).join('')}</div>`:'';
    const html=`<form id="v423-dice-form"><div class="v423-dice-intro"><span class="v423-dice-glyph">⚄</span><div><strong>Dados para qualquer situação</strong><p>Use esta ferramenta para dano narrativo, cura, armadilhas, recompensas aleatórias e efeitos não automatizados.</p></div></div><div class="form-grid"><div class="field"><label for="v423-dice-sides">TIPO DE DADO</label><select class="select" id="v423-dice-sides">${V423_DICE_SIDES.map(sides=>`<option value="${sides}" ${sides===6?'selected':''}>D${sides}</option>`).join('')}</select></div><div class="field"><label for="v423-dice-count">QUANTIDADE (1–20)</label><input class="input" type="number" id="v423-dice-count" min="1" max="20" step="1" value="2" required></div><div class="field"><label for="v423-dice-bonus">BÔNUS / PENALIDADE</label><input class="input" type="number" id="v423-dice-bonus" min="-1000" max="1000" step="1" value="0"></div><div class="field"><label for="v423-dice-visibility">VISIBILIDADE</label><select class="select" id="v423-dice-visibility"><option value="public">Pública · todos veem</option><option value="master">Privada · somente mestre</option></select></div></div><div class="field"><label for="v423-dice-reason">FINALIDADE DA ROLAGEM</label><input class="input" id="v423-dice-reason" maxlength="140" placeholder="Ex.: Dano da armadilha de espinhos" value="Rolagem livre"></div><div class="notice">Dica: 2d6 significa dois dados de seis faces. O bônus é somado e a penalidade é subtraída do total. Rolagens públicas entram no histórico compartilhado. As privadas ficam apenas neste navegador e não são sincronizadas com outros dispositivos.</div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Fechar</button><button type="submit" class="btn btn-primary">Rolar dados</button></div></form>${resultHtml}${historyHtml}`;
    v4ModalShell('Rolador Universal de Dados','D4, D6, D8, D10, D12 e D20 · resultados públicos ou reservados.',html);
  }
  async function applyV423DiceResult(){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode aplicar um resultado.');
    const result=state.v423LastRoll;if(!result||result.applied)throw new Error('Não há um resultado disponível para aplicação.');
    const targetRef=$('#v423-apply-target')?.value||'',effect=$('#v423-apply-effect')?.value||'damage',amount=Math.max(0,Math.floor(Number(result.total)||0));
    if(!amount)throw new Error('O resultado precisa ser maior que zero para alterar HP.');
    if(!['damage','healing'].includes(effect))throw new Error('Escolha dano ou cura para aplicar o resultado.');
    const [kind,id]=targetRef.split(':'),gs=state.campaign?.game_state||defaultGameState(),partyState=cloneData(gs.partyState||{});let enc=gs.encounter?cloneData(gs.encounter):null,targetName='',before=0,after=0,defeatedNow=false,partyDefeatedNow=false;
    if(kind==='player'){
      const member=state.members.find(item=>item.user_id===id&&item.role==='player'&&item.character);if(!member)throw new Error('Aventureiro selecionado não foi encontrado.');
      const vitals=currentPartyVitals(id,member.character),old=partyState[id]||{};before=vitals.hp;after=effect==='healing'?Math.min(vitals.maxHp,before+amount):Math.max(0,before-amount);partyState[id]={...old,hp:after};targetName=member.character.name;
      const living=state.members.filter(item=>item.role==='player'&&item.character).some(item=>Number(partyState[item.user_id]?.hp??currentPartyVitals(item.user_id,item.character).hp)>0);
      if(enc&&!enc.defeated&&!living){partyDefeatedNow=!enc.partyDefeated;enc.partyDefeated=true;enc.turnOrder=[];enc.turnIndex=0}
    }else if(kind==='monster'){
      if(!enc||enc.defeated||enc.partyDefeated)throw new Error('Não existe um encontro ativo para aplicar o resultado à criatura.');
      if(Array.isArray(enc.enemies)&&enc.enemies.length){const enemy=enc.enemies.find(item=>item.id===id);if(!enemy||enemy.defeated||Number(enemy.hp)<=0)throw new Error('A criatura selecionada não está ativa.');before=Math.max(0,Number(enemy.hp)||0);after=effect==='healing'?Math.min(Number(enemy.maxHp)||before,before+amount):Math.max(0,before-amount);enemy.hp=after;enemy.defeated=after<=0;enc.enemies=enc.enemies.map(item=>item.id===id?(isBossTemplate(item)?applyBossPhase(item):item):item);targetName=enemy.name;enc.hp=enc.enemies.reduce((sum,item)=>sum+Math.max(0,Number(item.hp)||0),0);enc.defeated=enc.enemies.every(item=>item.defeated||Number(item.hp)<=0);defeatedNow=enc.defeated;
      }else{
        if(id!==enc.id)throw new Error('A criatura selecionada não corresponde ao encontro ativo.');if(enc.defeated||Number(enc.hp)<=0)throw new Error('A criatura não está ativa.');before=Math.max(0,Number(enc.hp)||0);after=effect==='healing'?Math.min(Number(enc.maxHp)||before,before+amount):Math.max(0,before-amount);enc.hp=after;enc.defeated=after<=0;enc= isBossTemplate(enc)?applyBossPhase(enc):enc;targetName=enc.name;defeatedNow=enc.defeated;
      }
      if(defeatedNow){enc.turnOrder=[];enc.turnIndex=0}
    }else throw new Error('Escolha um aventureiro ou uma criatura ativa.');
    const patch=kind==='player'?(enc?{partyState,encounter:enc}:{partyState}):{encounter:enc};
    await updateGameState(patch);
    const effectLabel=effect==='healing'?'recuperou':'recebeu';const actionLabel=effect==='healing'?'cura':'dano';const appliedText=`${targetName} ${effectLabel} ${Math.abs(after-before)} HP (${before} → ${after}) após uma aplicação manual do mestre.`;
    result.applied=`${targetName}: ${actionLabel} de ${Math.abs(after-before)} HP (${before} → ${after})`;
    await createEvent('session_note',{kind:'dice-application',text:appliedText});
    if(partyDefeatedNow)await createEvent('party_defeated',{description:'Uma aplicação manual do Rolador Universal deixou todos os aventureiros sem pontos de vida.'});
    if(defeatedNow)await awardEncounterRewards(enc);
    renderV423DiceModal();toast(`Resultado aplicado a ${targetName}.`);
  }

  function renderV41CheckpointModal(){
    if(!isMaster()||!isMasterController())return;const v=v41GameData(),privateRows=readV41PrivateRolls();
    const html=`<div class="row between"><div><h3>Pontos de restauração</h3><p class="panel-subtitle">Os três estados mais recentes são preservados. Também é possível criar um ponto manual antes de uma decisão importante.</p></div><button class="btn btn-primary btn-small" data-action="v41-create-checkpoint">Criar ponto agora</button></div><div class="v41-checkpoint-list">${v.snapshots.slice().reverse().map(x=>`<div class="v41-checkpoint-row"><div><strong>${esc(x.reason)}</strong><small>${new Date(x.createdAt).toLocaleString('pt-BR')}</small></div><button class="btn btn-secondary btn-small" data-action="v41-restore-checkpoint" data-checkpoint-id="${esc(x.id)}">Restaurar</button></div>`).join('')||'<div class="empty-state">Nenhum ponto salvo. Alterações importantes criarão pontos automaticamente.</div>'}</div>${privateRows.length?`<div class="divider"></div><h3>Rolagens reservadas neste dispositivo</h3>${privateRows.slice().reverse().slice(0,10).map(x=>`<div class="v41-private-roll"><strong>${esc(x.player_name)} · ${esc(x.reason)}</strong><p>${(x.rolls||[x.natural]).join(' / ')} + ${x.modifier} = ${x.total}${x.dc?` · CD ${x.dc} · ${x.success?'Sucesso':'Falha'}`:''}</p><small>${new Date(x.storedAt).toLocaleString('pt-BR')}</small></div>`).join('')}`:''}<div class="notice">Os pontos preservam o estado da campanha, não contas nem participantes. Exporte um backup externo antes de restaurar. Rolagens reservadas ficam apenas neste navegador.</div>`;
    v4ModalShell('Segurança e recuperação','Crie e restaure pontos de sessão com segurança.',html);
  }
  function unlockV4Achievement(v4,id,title,description){
    v4.achievements=Array.isArray(v4.achievements)?v4.achievements:[];
    if(v4.achievements.some(item=>item.id===id))return false;
    v4.achievements.push({id,title,description,unlockedAt:new Date().toISOString()});
    v4.achievements=v4.achievements.slice(-40);return true;
  }
  async function recordV4EncounterMilestones(encounter){
    if(!isMaster()||!isMasterController()||!encounter?.id)return;
    const gs=state.campaign?.game_state||defaultGameState(),v4=v4GameData(gs);if(v4.processedEncounterIds.includes(encounter.id))return;
    const defeated=Array.isArray(encounter.enemies)&&encounter.enemies.length?encounter.enemies:[encounter];
    const valid=defeated.filter(enemy=>enemy&&((enemy.defeated||Number(enemy.hp)<=0)));
    const bosses=valid.filter(isBossTemplate);
    v4.processedEncounterIds=[...v4.processedEncounterIds,encounter.id].slice(-200);
    const monsterDefeats={...(v4.statistics.monsterDefeats||{})};
    valid.forEach(enemy=>{
      const id=String(enemy.templateId||enemy.id||'criatura-desconhecida');
      const previous=monsterDefeats[id]||{};
      monsterDefeats[id]={name:String(previous.name||enemy.name||id),count:(Number(previous.count)||0)+1,lastDefeatedAt:new Date().toISOString()};
    });
    v4.statistics={...v4.statistics,encountersWon:(Number(v4.statistics.encountersWon)||0)+1,monstersDefeated:(Number(v4.statistics.monstersDefeated)||0)+Math.max(1,valid.length),bossesDefeated:(Number(v4.statistics.bossesDefeated)||0)+bosses.length,uniqueMonsterIds:[...new Set([...(v4.statistics.uniqueMonsterIds||[]),...valid.map(e=>e.templateId||e.id)])].slice(-100),monsterDefeats};
    unlockV4Achievement(v4,'first-victory','Primeira Vitória','A companhia venceu seu primeiro encontro.');
    if(bosses.length)unlockV4Achievement(v4,'boss-hunter','Caçadores de Chefes','A companhia derrotou seu primeiro chefe.');
    if(v4.statistics.monstersDefeated>=10)unlockV4Achievement(v4,'monster-hunter','Caçadores de Ameaças','A companhia derrotou dez criaturas.');
    if(v4.statistics.encountersWon>=10)unlockV4Achievement(v4,'veterans','Veteranos de Aethra','A companhia venceu dez encontros.');
    const partyState=cloneData(gs.partyState||{});applyV4Titles(partyState,encounter.participantIds||state.members.filter(m=>m.role==='player'&&m.character).map(m=>m.user_id),v4.achievements);
    await updateGameState({v4,partyState});
  }
  function recordV4StoryDecision(v4){
    v4.statistics={...v4.statistics,storyDecisions:(Number(v4.statistics?.storyDecisions)||0)+1};
    unlockV4Achievement(v4,'chronicler','Cronistas de Aethra','A companhia tomou sua primeira decisão narrativa registrada.');
  }
  function applyV4Titles(partyState,userIds,achievements){
    const titleMap={
      'first-victory':'Desbravador',
      'boss-hunter':'Caçador de Chefes',
      'monster-hunter':'Caçador de Criaturas',
      'veterans':'Veterano de Aethra',
      'chronicler':'Voz da Companhia',
      'treasure-keeper':'Guardião de Tesouros'
    };
    const earned=new Set((achievements||[]).map(item=>item.id));
    userIds.forEach(userId=>{const row=partyState[userId]||{};const titles=[...(row.titles||[])];Object.entries(titleMap).forEach(([id,title])=>{if(earned.has(id)&&!titles.includes(title))titles.push(title)});partyState[userId]={...row,titles:titles.slice(-8),title:titles.at(-1)||row.title||''}});
  }
  function combatConditions(target){return Array.isArray(target?.conditions)?target.conditions:[]}
  const COMBAT_CONDITIONS={
    stunned:{name:'Atordoado',icon:'✴',description:'Perde a próxima ação; a condição é consumida ao chegar seu turno.',skipTurn:true},
    poisoned:{name:'Envenenado',icon:'☠',description:'Recebe -2 no ataque enquanto durar.',attack:-2},
    burning:{name:'Queimando',icon:'🔥',description:'Sofre 1d4 de dano ao terminar seu turno.',turnDamage: 'd4'},
    frozen:{name:'Congelado',icon:'❄',description:'Recebe -2 na Defesa enquanto durar.',defense:-2},
    weakened:{name:'Enfraquecido',icon:'↓',description:'Causa 2 pontos a menos de dano.',damage:-2},
    marked:{name:'Marcado',icon:'◎',description:'Recebe +2 de dano dos próximos ataques.',incomingDamage:2},
    rooted:{name:'Enraizado',icon:'🌿',description:'Não pode se deslocar até a condição terminar.',movement:0}
  };
  function hasCondition(target,id){return combatConditions(target).some(c=>c.id===id&&Number(c.remainingTurns)>0)}
  function conditionModifiers(target){return combatConditions(target).reduce((sum,c)=>{const effect=COMBAT_CONDITIONS[c.id]||{};return {attack:sum.attack+(effect.attack||0),defense:sum.defense+(effect.defense||0),damage:sum.damage+(effect.damage||0),incomingDamage:sum.incomingDamage+(effect.incomingDamage||0),movement:Math.min(sum.movement,effect.movement===undefined?99:effect.movement)}},{attack:0,defense:0,damage:0,incomingDamage:0,movement:99})}
  function addCombatCondition(target,id,duration=2,note=''){
    if(!COMBAT_CONDITIONS[id])throw new Error('Condição de combate desconhecida.');
    const list=combatConditions(target).filter(c=>c.id!==id);list.push({id,remainingTurns:Math.max(1,Math.min(10,Number(duration)||1)),note:String(note||'').slice(0,160),appliedAt:new Date().toISOString()});target.conditions=list;return target;
  }
  function consumeConditionsAtTurnEnd(encounter,partyState,turn){
    if(!turn)return;
    let target=null;
    if(turn.kind==='monster')target=(encounter.enemies||[]).find(e=>e.id===turn.id);
    else if(turn.kind==='player'){partyState[turn.user_id]=partyState[turn.user_id]||{};target=partyState[turn.user_id]}
    if(!target)return;
    const conditions=combatConditions(target),remaining=[];let dot=0;
    conditions.forEach(c=>{if(c.id==='burning'&&Number(c.remainingTurns)>0)dot+=rollDamageDie(4);const duration=Math.max(0,(Number(c.remainingTurns)||1)-1);if(duration>0)remaining.push({...c,remainingTurns:duration})});
    target.conditions=remaining;
    if(dot>0){if(turn.kind==='monster'){target.hp=Math.max(0,Number(target.hp)-dot);target.defeated=target.hp<=0;encounter.hp=Array.isArray(encounter.enemies)?encounter.enemies.reduce((n,e)=>n+Math.max(0,Number(e.hp)||0),0):Math.max(0,Number(encounter.hp)-dot)}else target.hp=Math.max(0,Number(target.hp)-dot)}
  }
  function isCombatantStunned(turn,encounter,partyState={}){const target=turn?.kind==='monster'?(encounter?.enemies||[]).find(e=>e.id===turn.id):turn?.kind==='player'?partyState[turn.user_id]:null;return hasCondition(target,'stunned')}
  function gridDistance(a,b){return Math.max(Math.abs(Number(a?.x||0)-Number(b?.x||0)),Math.abs(Number(a?.y||0)-Number(b?.y||0)))}
  function gridRayCells(start,end){let x0=start.x,y0=start.y,x1=end.x,y1=end.y;const dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1;let err=dx+dy;const cells=[];while(!(x0===x1&&y0===y1)){const e2=2*err;if(e2>=dy){err+=dy;x0+=sx}if(e2<=dx){err+=dx;y0+=sy}if(x0===x1&&y0===y1)break;cells.push({x:x0,y:y0})}return cells}
  function hasGridLineOfSight(mapId,start,end,record){return gridRayCells(start,end).every(cell=>!mapCellBlocked(mapId,cell.x,cell.y,record))}
  function tacticalCoverBonus(mapId,targetCell,actorCell,record){const dx=Math.sign(targetCell.x-actorCell.x),dy=Math.sign(targetCell.y-actorCell.y);const neighbours=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];let count=0;for(const [ox,oy] of neighbours){if(ox===-dx&&oy===-dy)continue;if(mapCellBlocked(mapId,targetCell.x+ox,targetCell.y+oy,record))count++}return count>=3?2:count>=1?1:0}
  function combatantMapToken(kind,id,gs=state.campaign?.game_state||defaultGameState()){
    const rec=activeMapRecord(gs),tokens=mapTokens(rec,gs);return tokens.find(t=>kind==='player'?t.kind==='player'&&t.id===id:t.kind==='monster'&&t.id===id)||null;
  }
  function attackRangeFor(character,weapon){if(Number(weapon?.range)>0)return Number(weapon.range);return ['Patrulheiro','Arcano','Invocador'].includes(character?.class)?6:1}
  function validateTacticalAttack(actorId,character,targetEnemy,gs){
    const weapon=currentPartyVitals(actorId,character).equipment?.weapon||character.equipment?.weapon||STARTER_KITS[character.class]?.weapon||{};const range=attackRangeFor(character,weapon);const actor=combatantMapToken('player',actorId,gs),target=combatantMapToken('monster',targetEnemy.id,gs);
    if(!actor||!target)return {ok:true,range};
    const footprint=target.footprint||{w:1,h:1},cells=footprintCells(target.position.x,target.position.y,footprint);const nearest=cells.sort((a,b)=>gridDistance(actor.position,a)-gridDistance(actor.position,b))[0];const distance=gridDistance(actor.position,nearest);
    if(distance>range)return {ok:false,reason:`Alvo fora de alcance: ${distance} casas; seu alcance atual é ${range}.`,distance,range};
    const record=activeMapRecord(gs),mapId=gs.exploration?.mapId||'eldoria-road';if(!cells.some(cell=>hasGridLineOfSight(mapId,actor.position,cell,record)))return {ok:false,reason:'Não há linha de visão livre até esse alvo. Uma parede ou obstáculo bloqueia o ataque.',distance,range};
    const cover=tacticalCoverBonus(mapId,nearest,actor.position,record);return {ok:true,distance,range,cover};
  }
  function monsterAttackRange(enemy){
    if(Number(enemy?.range)>0)return Math.max(1,Math.min(12,Number(enemy.range)));
    const key=`${enemy?.templateId||''} ${enemy?.name||''} ${enemy?.kind||''}`.toLowerCase();
    return /(drag[aã]o|draco|drakthar|vharzun|sereia|cultista|arqueiro|ac[oó]lito|mago|feiticeir|espectro|serpente|mariposa|arauto|rainha.*cristal|devorador)/i.test(key)?6:1;
  }
  function validateMonsterTacticalAttack(enemy,targetUserId,gs){
    const rec=activeMapRecord(gs),tokens=mapTokens(rec,gs),actor=tokens.find(t=>t.kind==='monster'&&t.id===enemy.id),target=tokens.find(t=>t.kind==='player'&&t.id===targetUserId),range=monsterAttackRange(enemy);
    if(!actor||!target)return {ok:true,range,cover:0};
    const aCells=footprintCells(actor.position.x,actor.position.y,actor.footprint||enemy.footprint||{w:1,h:1}),tCells=footprintCells(target.position.x,target.position.y,target.footprint||{w:1,h:1});
    let nearest=null,best=Infinity;for(const a of aCells)for(const t of tCells){const d=gridDistance(a,t);if(d<best){best=d;nearest={from:a,to:t}}}
    if(best>range)return {ok:false,range,distance:best,reason:`Fora do alcance (${best}/${range} casas).`};
    const mapId=explorationData(gs).mapId||'eldoria-road';if(!hasGridLineOfSight(mapId,nearest.from,nearest.to,rec))return {ok:false,range,distance:best,reason:'Linha de visão bloqueada.'};
    return {ok:true,range,distance:best,cover:tacticalCoverBonus(mapId,nearest.to,nearest.from,rec)};
  }
  function conditionBadgeList(target){return combatConditions(target).map(c=>{const def=COMBAT_CONDITIONS[c.id]||{};return `<span class="v4-condition-chip" title="${esc(def.description||'')}">${def.icon||'•'} ${esc(def.name||c.id)} · ${Number(c.remainingTurns)||1}</span>`}).join('')}
  function currentPartyVitals(userId,character){
    const c=normalizeCharacter(character);const ps=state.campaign?.game_state?.partyState?.[userId]||{};
    const equipment=ps.equipment||c.equipment||{};const gear=equipmentBonuses(equipment);const skill=skillBonuses(c);
    const baseMaxHp=Math.max(1,Number(ps.baseMaxHp)||Number(ps.maxHp)||c.maxHp);const maxHp=baseMaxHp+skill.maxHp;
    const conditions=Array.isArray(ps.conditions)?ps.conditions:[];const conditionEffect=conditionModifiers({conditions});
    const calculatedDefense=10+attrMod(c.attributes.destreza)+gear.defense+skill.defense;const activeEncounter=state.campaign?.game_state?.encounter;const round=Number(activeEncounter?.round)||1;const baseDefense=calculatedDefense;const penalty=activeEncounter&&!activeEncounter.defeated&&Number(ps.defensePenaltyUntilRound)>=round?Number(ps.defensePenalty)||0:0;
    return {hp:Math.max(0,Math.min(maxHp,Number.isFinite(Number(ps.hp))?Number(ps.hp):c.hp)),maxHp,baseMaxHp,defense:Math.max(0,baseDefense-penalty+conditionEffect.defense),baseDefense,defensePenalty:Number(ps.defensePenalty)||0,defensePenaltyUntilRound:Number(ps.defensePenaltyUntilRound)||0,inventory:Array.isArray(ps.inventory)?ps.inventory:c.inventory,titles:Array.isArray(ps.titles)?ps.titles:[],title:ps.title||'',equipment,equipmentBonuses:gear,abilityUsed:!!ps.abilityUsed,coins:Math.max(0,Number(ps.coins)||0),conditions,skill};
  }
  function isBossTemplate(encounter){return !!encounter&&(/CHEFE|LENDÁRIA|EXTREMA/.test(encounter.threat||'')||['drakthar','vharzun','general-cinzas','quimera-carmesim','rainha-cristal','tita-primordial','colosso-umbra','devorador-mare','arauto-vazio','colosso-sal'].includes(encounter.templateId))}
  function applyBossPhase(encounter){
    if(!encounter||!isBossTemplate(encounter))return {...encounter};
    const ratio=Math.max(0,Number(encounter.hp)||0)/Math.max(1,Number(encounter.maxHp)||720);
    const phase=ratio<=.33?3:ratio<=.66?2:1;
    const profiles={
      drakthar:{names:['Fase I — O Devorador desperta','Fase II — As escamas se incendeiam','Fase III — Fúria do Dragão Ancião'],descriptions:['Drakthar observa os aventureiros e testa suas defesas.','Ferido, o dragão libera brasas ancestrais. Defesa e ataques aumentam.','À beira da derrota, Drakthar abandona qualquer cautela e prepara sopros devastadores.'],def:1,atk:1},
      vharzun:{names:['Fase I — A Ruptura desperta','Fase II — As cinco chamas','Fase III — O fim dos reinos'],descriptions:['Vharzun desperta a Ruptura Celestial e testa os campeões dos cinco reinos.','As cinco chamas elementais se manifestam; o dragão amplia sua força e distorce a arena.','O Dragão Ancião rompe os últimos selos e prepara o sopro capaz de apagar os reinos.'],def:5,atk:8},
      'general-cinzas':{names:['Fase I — Comando das Cinzas','Fase II — Última formação','Fase III — General sem rendição'],descriptions:['Malgor coordena a linha de frente e mede as defesas dos aventureiros.','Ferido, Malgor rompe a formação e avança com brutalidade.','Malgor concentra toda a força no golpe final.'],def:2,atk:2},
      'quimera-carmesim':{names:['Fase I — Três instintos','Fase II — Fúria híbrida','Fase III — Predador desesperado'],descriptions:['As três cabeças observam alvos diferentes.','A criatura combina ataques e pressiona vários espaços da arena.','A quimera abandona a cautela e investe contra o grupo.'],def:1,atk:2},
      'rainha-cristal':{names:['Fase I — Coração prismático','Fase II — Estilhaços vivos','Fase III — Coroa partida'],descriptions:['A Rainha protege o núcleo cristalino.','Cristais se desprendem e tornam o terreno perigoso.','A coroa se parte e a energia niveriana explode.'],def:3,atk:2},
      'tita-primordial':{names:['Fase I — Passos ancestrais','Fase II — Núcleo desperto','Fase III — Ruína colossal'],descriptions:['O Titã avança lentamente, alterando a arena a cada passo.','O núcleo primordial desperta e fortalece os golpes.','A criatura descarrega sua força em ataques devastadores.'],def:2,atk:3},
      'colosso-umbra':{names:['Fase I — Silêncio da Umbra','Fase II — Fenda interior','Fase III — Vazio exposto'],descriptions:['O Colosso absorve luz e observa o grupo.','Fendas surgem na armadura e liberam energia sombria.','O vazio interior tenta consumir tudo ao redor.'],def:2,atk:3},
      'devorador-mare':{names:['Fase I — Maré crescente','Fase II — Abismo revolto','Fase III — Ressaca final'],descriptions:['O leviatã arrasta água e destroços pela arena.','Correntes profundas ampliam seu alcance e pressão.','A criatura convoca a última onda do abismo.'],def:1,atk:3},
      'arauto-vazio':{names:['Fase I — Olhar distante','Fase II — Ruptura mental','Fase III — Muitos olhos'],descriptions:['O Arauto mede a vontade dos aventureiros.','O vazio distorce percepção e concentração.','Todos os olhos se abrem e o campo parece dobrar.'],def:2,atk:3},
      'colosso-sal':{names:['Fase I — Muralha de sal','Fase II — Maré mineral','Fase III — Núcleo exposto'],descriptions:['O Colosso ergue placas de sal como muralhas.','A maré endurece e seus golpes se tornam pesados.','O núcleo se parte e libera uma onda de cristais.'],def:2,atk:2}
    };
    const profile=profiles[encounter.templateId]||{names:['Fase I — Ameaça desperta','Fase II — Poder intensificado','Fase III — Última resistência'],descriptions:['A criatura avalia a companhia.','Ferida, a criatura libera uma parte maior de seu poder.','À beira da derrota, a criatura luta sem reservas.'],def:1,atk:1};
    return {...encounter,bossPhase:phase,bossPhaseName:profile.names[phase-1],bossPhaseDescription:profile.descriptions[phase-1],defense:(Number(encounter.baseDefense)||Number(encounter.defense)||18)+(phase-1)*profile.def,attackBonus:(Number(encounter.baseAttackBonus)||Number(encounter.attackBonus)||8)+(phase-1)*profile.atk};
  }
  function activeCombatTurn(encounter){return encounter?.turnOrder?.[Number(encounter.turnIndex)||0]||null}
  function activeBattleEnemy(encounter){
    const enemies=Array.isArray(encounter?.enemies)&&encounter.enemies.length?encounter.enemies:[encounter].filter(Boolean);
    if(!enemies.length)return null;
    const living=enemy=>!enemy.defeated&&Number(enemy.hp)>0;
    const turn=activeCombatTurn(encounter);
    if(turn?.kind==='monster'){
      const acting=enemies.find(enemy=>enemy.id===turn.id&&living(enemy));
      if(acting)return acting;
    }
    const remembered=enemies.find(enemy=>enemy.id===encounter?.displayEnemyId&&living(enemy));
    if(remembered)return remembered;
    return enemies.find(living)||enemies.find(enemy=>enemy.id===encounter?.displayEnemyId)||enemies[0];
  }
  function combatantAvailable(turn,encounter,partyState={}){
    if(!turn)return false;
    if(turn.kind==='monster'){const enemy=(encounter?.enemies||[]).find(e=>e.id===turn.id);return !!enemy&&!enemy.defeated&&Number(enemy.hp)>0&&!hasCondition(enemy,'stunned')}
    if(turn.kind==='player'){
      const vitals=partyState[turn.user_id];
      if(vitals&&vitals.hp!==undefined&&vitals.hp!==null)return Number(vitals.hp)>0&&!hasCondition(vitals,'stunned');
      const member=state.members.find(m=>m.user_id===turn.user_id);
      return !!member?.character&&normalizeCharacter(member.character).hp>0&&!hasCondition(partyState[turn.user_id]||{},'stunned');
    }
    return true;
  }
  function isPlayersCombatTurn(){
    const encounter=state.campaign?.game_state?.encounter,turn=activeCombatTurn(encounter);
    if(!turn||turn.kind!=='player'||turn.user_id!==currentUserId())return false;
    const character=state.member?.character;
    return !character||(currentPartyVitals(currentUserId(),character).hp>0&&!hasCondition(currentPartyVitals(currentUserId(),character),'stunned'));
  }
  function advanceCombatTurn(encounter,partyState=state.campaign?.game_state?.partyState||{}){
    encounter=cloneData(encounter);const order=encounter.turnOrder||[];let index=Number(encounter.turnIndex)||0,round=Number(encounter.round)||1;
    const ended=order[index];if(ended)consumeConditionsAtTurnEnd(encounter,partyState,ended);
    const livingPlayers=state.members.some(m=>m.role==='player'&&m.character&&Number(partyState[m.user_id]?.hp??normalizeCharacter(m.character).hp)>0);
    const livingEnemies=(encounter.enemies||[]).some(e=>!e.defeated&&Number(e.hp)>0);
    if(!livingPlayers&&livingEnemies)return {...encounter,turnOrder:[],turnIndex:0,round,partyDefeated:true,defeated:false};
    if(!livingEnemies)return {...encounter,turnOrder:[],turnIndex:0,round,partyDefeated:!livingPlayers,defeated:true,hp:0};
    if(!order.length)return {...encounter,turnIndex:0,round:round+1,partyDefeated:!livingPlayers&&livingEnemies,defeated:!livingEnemies||!!encounter.defeated};
    index=Math.min(Math.max(-1,index),order.length-1);
    for(let tries=0;tries<order.length;tries++){
      index++;if(index>=order.length){index=0;round++}
      const turn=order[index];
      if(combatantAvailable(turn,encounter,partyState))return {...encounter,turnIndex:index,round,partyDefeated:false};
      if(isCombatantStunned(turn,encounter,partyState))consumeConditionsAtTurnEnd(encounter,partyState,turn);
    }
    const rebuilt=buildTurnOrder(encounter,state.members,partyState);
    if(rebuilt.length)return {...encounter,turnOrder:rebuilt,turnIndex:0,round:round+1,partyDefeated:false};
    return {...encounter,turnOrder:[],turnIndex:0,round,partyDefeated:!livingPlayers&&livingEnemies,defeated:!livingEnemies||!!encounter.defeated};
  }
  function buildTurnOrder(encounter,members,partyState={}){
    const order=[];
    members.filter(m=>m.role==='player'&&m.character&&Number(partyState[m.user_id]?.hp??normalizeCharacter(m.character).hp)>0).forEach(m=>{const c=normalizeCharacter(m.character);order.push({kind:'player',user_id:m.user_id,name:c.name||m.display_name,initiative:secureDie(20)+attrMod(c.attributes.destreza)})});
    const enemies=Array.isArray(encounter.enemies)&&encounter.enemies.length?encounter.enemies:[{id:'monster',name:encounter.name,initiativeBonus:encounter.initiativeBonus}];enemies.filter(e=>!e.defeated&&Number(e.hp)>0).forEach(e=>order.push({kind:'monster',id:e.id,name:e.name,initiative:secureDie(20)+(Number(e.initiativeBonus)||0)}));
    return order.sort((a,b)=>b.initiative-a.initiative||String(a.name||'').localeCompare(String(b.name||'')));
  }
  function primaryAttributeForClass(className){return ({Guerreiro:'forca',Paladino:'forca',Patrulheiro:'destreza',Assassino:'destreza',Arcano:'inteligencia',Invocador:'inteligencia',Clérigo:'sabedoria',Druida:'sabedoria'})[className]||'forca'}
  function localGrantXp(character,amount){
    const c=normalizeCharacter(character);const oldLevel=c.level;let xp=c.xp+amount,level=c.level,levelsGained=0;
    while(level<50&&xp>=level*100){level++;levelsGained++}
    const primary=primaryAttributeForClass(c.class);c.attributes[primary]=Math.min(30,(Number(c.attributes[primary])||1)+levelsGained);
    c.level=level;c.xp=xp;c.maxHp+=levelsGained*10;c.hp=Math.min(c.maxHp,c.hp+levelsGained*10);c.defense=10+attrMod(c.attributes.destreza)+equipmentBonuses(c.equipment).defense;
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
    // Criaturas de alto nível são encontros de progressão tardia; objetivos ficam sob controle do mestre.
  };
  async function progressEncounterQuestObjectives(encounter){
    if(!isMaster()||!isMasterController())return;
    const enemyIds=Array.isArray(encounter?.enemies)?encounter.enemies.map(e=>e.templateId):[encounter?.templateId];const targets=[...new Map(enemyIds.flatMap(id=>ENCOUNTER_QUEST_OBJECTIVES[id]||[]).map(pair=>[pair.join(':'),pair])).values()];
    for(const [questId,objectiveId] of targets){
      try{await completeQuestObjective(questId,objectiveId,'encounter');}
      catch(error){console.warn('Não foi possível atualizar o objetivo da missão:',questId,objectiveId,error);}
    }
  }
  function rollEncounterLoot(encounter){
    const enemies=Array.isArray(encounter?.enemies)&&encounter.enemies.length?encounter.enemies:[encounter||{}];const drops=[];
    enemies.forEach(enemy=>{const table=LOOT_TABLES[enemy?.templateId]||[{id:'fragmento-forja',chance:Math.max(12,Math.min(55,Number(enemy?.level||1)*3)),qty:1}];const boss=/CHEFE|LENDÁRIA|ÉPICA|REINO/.test(enemy?.threat||'');const bonus=Number(enemy?.level||1)>=30?10:Number(enemy?.level||1)>=15?6:0;table.forEach(entry=>{const chance=Math.min(100,entry.chance+(boss?bonus:0));if(secureDie(100)<=chance){const item=LOOT_ITEMS[entry.id];if(item){const existing=drops.find(x=>x.id===item.id);if(existing)existing.qty+=entry.qty||1;else drops.push({...cloneData(item),qty:entry.qty||1})}}})});
    return drops;
  }
  async function awardEncounterLoot(encounter,ids){
    if(encounter.lootAwarded)return encounter;
    const drops=rollEncounterLoot(encounter),partyState={...(state.campaign.game_state?.partyState||{})};
    const recipients=ids.filter(id=>state.members.some(m=>m.user_id===id&&m.character));
    const summaries=[];
    recipients.forEach(id=>{
      const member=state.members.find(m=>m.user_id===id),old=partyState[id]||{},inventory=cloneData(Array.isArray(old.inventory)?old.inventory:normalizeCharacter(member.character).inventory);
      const personalDrops=drops.map(item=>({...cloneData(item)}));
      // O mesmo resultado de espólio é entregue a cada personagem registrado como participante do encontro.
      personalDrops.forEach(item=>{const found=inventory.find(x=>x.id===item.id);if(found)found.qty=(Number(found.qty)||0)+(Number(item.qty)||1);else inventory.push(item)});
      const gold=Math.max(5,Math.round((Number(encounter.level)||1)*4*(/CHEFE|LENDÁRIA|ÉPICA|REINO/.test(encounter.threat||'')?2:1)));
      partyState[id]={...old,inventory,coins:Math.max(0,Number(old.coins)||0)+gold};
      summaries.push({name:member.character.name||member.display_name,items:personalDrops.map(x=>`${x.name} x${x.qty}`),gold});
    });
    const nextEncounter={...encounter,lootAwarded:true,lootDrops:drops.map(x=>({id:x.id,name:x.name,qty:x.qty,rarity:x.rarity||'Material'}))};
    const currentGs=state.campaign?.game_state||defaultGameState(),v4=v4GameData(currentGs);v4.statistics={...v4.statistics,lootDrops:(Number(v4.statistics.lootDrops)||0)+1};unlockV4Achievement(v4,'treasure-keeper','Guardião de Tesouros','A companhia recebeu sua primeira recompensa registrada.');if(v4.statistics.lootDrops>=3)unlockV4Achievement(v4,'reliquary-keeper','Guardião da Relíquia','A companhia recebeu três recompensas registradas.');applyV4Titles(partyState,recipients,v4.achievements);v4.lootLog=[...(v4.lootLog||[]),{id:`encounter-loot-${encounter.id}`,encounterId:encounter.id,monster:encounter.name,items:drops.map(x=>({id:x.id,name:x.name,qty:x.qty})),at:new Date().toISOString()}].slice(-100);
    await updateGameState({partyState,encounter:nextEncounter,v4});
    const lines=summaries.map(x=>`${x.name}: ${x.gold} PO${x.items.length?' · '+x.items.join(', '):' · nenhum item adicional'}`);
    const summary=`Espólio de ${encounter.name}: ${lines.join(' | ')}`;
    await createEvent('session_note',{kind:'loot',encounter_id:encounter.id,text:summary,drops:nextEncounter.lootDrops});
    const gs=state.campaign.game_state||defaultGameState(),entries=[...(gs.journalEntries||[]),{id:crypto.randomUUID?crypto.randomUUID():`journal-${Date.now()}`,text:summary,kind:'loot',createdAt:new Date().toISOString()}].slice(-50);
    await updateGameState({journalEntries:entries});
    return nextEncounter;
  }
  async function awardEncounterRewards(encounter){
    if(!encounter||encounter.partyDefeated||(encounter.xpAwarded&&encounter.lootAwarded))return;
    if(!isMaster()||!isMasterController())return;
    await recordV4EncounterMilestones(encounter);
    const ids=Array.isArray(encounter.participantIds)?encounter.participantIds:state.members.filter(m=>m.role==='player'&&m.character).map(m=>m.user_id);
    const reward=Math.max(0,Number(encounter.xpReward)||0);
    if(encounter.xpAwarded){await awardEncounterLoot(encounter,ids);await progressEncounterQuestObjectives(encounter);return}
    if(state.backendReady&&reward&&ids.length){
      const {data,error}=await state.backend.rpc('award_encounter_xp',{p_campaign_id:state.campaign.id,p_encounter_id:encounter.id,p_xp:reward,p_user_ids:ids});
      if(error)throw error;
      const awards=Array.isArray(data?.awards)?data.awards:[];
      if(awards.length)await createEvent('encounter_defeated',{monster:encounter.name,xp:reward,rewards:awards,description:`${encounter.name} foi derrotado. Cada aventureiro participante recebeu ${reward} XP.`});
      await refreshCloudCampaign({silent:true});
      let current=state.campaign?.game_state?.encounter?.id===encounter.id?state.campaign.game_state.encounter:encounter;
      current={...current,xpAwarded:true};await updateGameState({encounter:current});
      await awardEncounterLoot(current,ids);
      awards.forEach(r=>{if(Number(r.levels_gained)>0)toast(`${r.name} subiu para o nível ${r.level}!`)});
      await progressEncounterQuestObjectives(encounter);return data;
    }
    const partyState={...(state.campaign.game_state?.partyState||{})},rewards=[];
    if(reward&&ids.length)ids.forEach(id=>{const member=state.members.find(m=>m.user_id===id);if(!member?.character)return;const result=localGrantXp(member.character,reward);member.character=result.character;const old=partyState[id]||{};const currentHp=Number.isFinite(Number(old.hp))?Number(old.hp):result.character.hp;partyState[id]={...old,hp:Math.min(result.character.maxHp,currentHp+result.levelsGained*10),maxHp:result.character.maxHp,defense:result.character.defense};rewards.push({name:result.character.name,xp:reward,levelsGained:result.levelsGained,level:result.newLevel})});
    const marked={...encounter,xpAwarded:true};await updateGameState({encounter:marked,partyState});await awardEncounterLoot(marked,ids);
    await persistLocalCampaign();if(reward)await createEvent('encounter_defeated',{monster:encounter.name,xp:reward,rewards,description:`${encounter.name} foi derrotado. Cada aventureiro participante recebeu ${reward} XP.`});
    rewards.forEach(r=>{if(r.levelsGained)toast(`${r.name} subiu para o nível ${r.level}!`)});await progressEncounterQuestObjectives(encounter);return rewards;
  }

  const BOOK_LOOT_CHAPTERS={master:['Espólios e recompensas de dificuldade','Ao derrotar uma criatura, a companhia recebe XP, moedas e rolagens de espólio definidas pela origem do monstro. Chefes podem conceder equipamento exclusivo; os itens são registrados na mochila de cada participante do encontro.',['Monstros comuns priorizam materiais regionais.','Chefes possuem tabelas próprias e chances maiores de recompensas raras.','A distribuição acontece uma única vez por encontro, sob controle do mestre ativo.']],bestiary:['O que cada criatura deixa para trás','Os materiais refletem a criatura: lobos deixam couro e presas, espectros podem liberar essência arcana, criaturas marítimas deixam coral e guardiões de cristal podem liberar cristais niverianos.',['Use as tabelas de espólio como referência.','A chance aumenta em encontros de dificuldade elevada.','O mestre pode conceder uma recompensa narrativa adicional.']],bosses:['Equipamentos exclusivos de chefes','Algumas peças só aparecem em chefes regionais ou de reino. Lâmina do Coração de Brasa, Couraça do Guardião das Marés, Foco da Rainha Prismática e Manoplas do Titã Primordial são exemplos de tesouros vinculados a vitórias específicas.',['As chances de equipamento são baixas de propósito.','Requisitos de nível e classe são verificados ao equipar.','O Coração de Vharzun é a relíquia final da campanha.']],arsenal:['Relíquias e equipamentos Míticos','Relíquias são itens especiais obtidos como espólio e não podem ser vendidos no mercado. Algumas possuem efeitos narrativos ativados pelo mestre. A raridade Mítica mantém a escala de poder da versão 2.2.',['Relíquias podem ocupar o espaço de escudo ou armadura.','Efeitos especiais devem ser usados uma vez por encontro quando assim descritos.','Itens exclusivos não aparecem como mercadoria comum.']],adventurer:['Recebendo e usando espólios','Após uma vitória, abra a mochila para consultar os materiais, equipamentos e relíquias recebidos. O mestre pode equipar peças respeitando classe e nível. Materiais podem ser guardados para a forja da companhia.',['Ouro é creditado automaticamente.','Materiais e itens aparecem na mochila.','Equipamentos precisam ser equipados pelo mestre antes de alterar atributos.']]};
  Object.entries(BOOK_LOOT_CHAPTERS).forEach(([id,ch])=>{if(BOOK_CONTENT[id]&&BOOK_CONTENT[id].length<11)BOOK_CONTENT[id].push([ch[0],ch[1],ch[2]]);});
  const BOOK_EXPLORATION_CHAPTERS={
    master:['Exploração em cenas e pontos de interação','Na v2.8, cada região possui uma pequena cena de exploração com posição do grupo, objetos interativos e rotina de NPCs. O mestre continua responsável por validar deslocamentos e resolver interações que alterem o estado compartilhado da campanha. Use os pontos interativos como convites à investigação, não como obstáculos obrigatórios.',['Movimente a companhia pelo painel de exploração; cada passo representa deslocamento narrativo, não uma medida tática de combate.','Portas podem ser abertas ou fechadas, baús podem ser examinados uma única vez e mecanismos podem ser ativados para revelar pistas.','A rotina dos NPCs é uma sugestão de localização por etapa da campanha; o mestre pode adaptar a cena à narrativa.','Registre no diário descobertas relevantes e atualize missões manualmente quando a condição narrativa for atendida.']],
    bestiary:['Habitat, sinais e comportamento regional','Criaturas devem parecer parte do lugar onde vivem. Antes de apresentar um monstro, descreva vestígios coerentes com seu habitat: marcas de garras, cristais partidos, água turva, cinzas recentes ou vegetação doente.',['Eldoria: rastros, ninhos, raízes e sons na copa das árvores.','Drakmor: calor anormal, fuligem, rocha vitrificada e metal retorcido.','Nivéria: pegadas preservadas no gelo, cristais rachados e ecos.','Thalassor: marcas de maré, coral quebrado e embarcações abandonadas.','Solária: sombras deslocadas, mosaicos danificados e luzes que não acompanham o sol.']],
    bosses:['Arenas e apresentação de chefes','A entrada em uma arena deve ser uma cena. Apresente a escala do lugar, o sinal de perigo e os elementos que podem ser usados durante a luta. O mapa tático continua sendo a referência de posicionamento e combate; a cena ilustrada dá contexto e atmosfera.',['Mostre pelo menos um elemento interativo antes do primeiro turno.','Anuncie mudanças de fase e perigos de área antes de aplicá-los.','Permita que a companhia examine mecanismos ou interrompa fontes de poder quando fizer sentido.']],
    atlas:['Rotas, marcos e cenas exploráveis','As regiões possuem pontos de interesse, pequenas cenas e elementos que podem ser examinados. O painel de exploração oferece um espaço narrativo compartilhado para deslocar o grupo, acompanhar objetos e descobrir pistas.',['A posição da companhia é salva no estado da campanha por região.','Portas, baús e mecanismos guardam seu estado após a sessão.','As viagens continuam sendo conduzidas pelo mestre para preservar a continuidade e o ritmo da crônica.']],
    adventurer:['Exploração e interação','Durante a exploração, descreva para o mestre o que seu personagem deseja fazer e por quê. O mestre pode mover a companhia, abrir um ponto de interesse ou registrar uma descoberta. O movimento de exploração é narrativo e não substitui o movimento por casas do mapa tático durante o combate.',['Observe os detalhes antes de interagir com objetos.','Pergunte sobre portas, mecanismos e baús visíveis.','NPCs podem mudar de local conforme a cena avança.','Descobertas importantes ficam registradas no diário da campanha.']],
    arsenal:['Objetos, mecanismos e recompensas de cenário','Nem todo tesouro precisa ser equipamento. Chaves, mapas, inscrições, ferramentas e componentes podem abrir novas rotas ou preparar a forja. O mestre deve registrar apenas recompensas efetivamente conquistadas e evitar duplicar materiais já concedidos por espólios.',['Baús são marcados como abertos para evitar repetição.','Mecanismos registram sua ativação e podem representar alavancas, selos ou focos arcanos.','Portas permanecem no estado em que foram deixadas durante a campanha.']],
    grimoire:['Magia aplicada à exploração','Magias podem iluminar corredores, revelar inscrições, estabilizar mecanismos ou detectar vestígios. O efeito deve respeitar a habilidade da classe e o contexto da cena; a exploração não cria usos ilimitados para poderes de combate.',['Descreva como a magia altera a luz, o som ou o ambiente.','Peça testes apenas quando houver risco ou incerteza significativa.','Uma pista essencial não deve depender de uma única rolagem.']]
  };
  Object.entries(BOOK_EXPLORATION_CHAPTERS).forEach(([id,ch])=>{if(BOOK_CONTENT[id])BOOK_CONTENT[id].push([ch[0],ch[1],ch[2]]);});
  const BOOK_V29_CHAPTERS={
    master:['Direção de cena e identidade regional','Na v2.9, cada cena de exploração apresenta uma ilustração ampla do território atual. Use a imagem como referência de atmosfera, arquitetura, clima e escala; em seguida, descreva o que os personagens percebem e o que pode mudar com suas ações. A imagem ambienta a cena, mas não substitui a decisão do mestre nem revela automaticamente segredos.',['Eldoria deve transmitir vida, raízes antigas e caminhos tomados pela vegetação.','Drakmor combina basalto, fuligem, calor e luz de forjas; Nivéria destaca cristal, gelo e silêncio.','Thalassor deve sugerir marés, sal, madeira naval e profundidade; Solária usa pedra clara, ouro e sombras definidas.','Antes de trocar de região, atualize a localização e a narração para que a arte, o mapa e o texto contem a mesma história.']],
    bestiary:['Criaturas como parte da paisagem','A presença de uma criatura deve alterar a leitura do ambiente antes de começar o combate. Use a paisagem regional para preparar rastros, sons e sinais coerentes, sem entregar de imediato a identidade ou a ficha do inimigo.',['Em florestas, mostre vegetação quebrada, ninhos vazios e trilhas recentes.','Em regiões vulcânicas, use fuligem, pedra vitrificada e calor anormal.','Em áreas geladas, descreva cristais partidos, pegadas preservadas e ecos.','Em portos e recifes, use água turva, redes rasgadas e coral danificado.']],
    bosses:['A apresentação visual de uma arena','A arte regional ajuda a estabelecer a escala de uma arena, mas o mestre deve apresentar também os pontos de risco e as oportunidades táticas. A imagem de ambiente não representa casas de movimento nem altera o mapa de combate.',['Mostre o cenário antes de revelar a ficha do chefe.','Destaque coberturas, mecanismos e perigos que possam ser usados pelos jogadores.','Mantenha a grade tática como referência de posição, alcance e bloqueios.','Associe mudanças de fase a sinais visuais e narrativos que os jogadores possam perceber.']],
    atlas:['Leitura visual dos Cinco Reinos','As imagens regionais são referências de identidade: elas ajudam a reconhecer o território e a manter coerência entre viagem, cena e descrição. Ao apresentar um novo local, combine um marco arquitetônico, um elemento natural e um detalhe cotidiano.',['Eldoria: madeira, pedra coberta de musgo, copas densas e luz filtrada.','Drakmor: fortalezas de basalto, fornalhas, pontes e fumaça mineral.','Nivéria: salões de cristal, gelo translúcido e luz azulada.','Thalassor: cais, embarcações, recifes e construções resistentes à maré.','Solária: templos, colunas claras, mosaicos e luz dourada.']],
    grimoire:['Magia e atmosfera regional','A descrição de uma magia pode dialogar com a paisagem sem alterar suas regras. Uma conjuração em Nivéria pode refletir luz entre cristais; em Drakmor, o calor pode fazer o ar tremular. O efeito mecânico continua sendo aquele definido pela habilidade.',['Use o ambiente para enriquecer a descrição, não para conceder bônus implícitos.','Diferencie efeitos puramente visuais de alterações reais no cenário.','Se uma magia modificar um objeto persistente, registre a consequência com o mestre.']],
    arsenal:['Materiais e identidade dos reinos','A origem de um equipamento deve aparecer em seus materiais, acabamento e história. A aparência regional não concede bônus por si só; os valores mecânicos permanecem os registrados na ficha e nas regras de raridade, aprimoramento e encantamento.',['Drakmor trabalha metais escuros, ligas resistentes e inscrições de forja.','Nivéria preserva cristais, ligas frias e acabamentos translúcidos.','Thalassor utiliza materiais resistentes à água, coral e metais marítimos.','Eldoria favorece couro, madeira viva e fibras naturais; Solária usa ligas claras e ornamentos solares.']],
    adventurer:['Como ler uma cena ilustrada','Ao entrar em uma região, observe a paisagem e pergunte ao mestre sobre detalhes que possam ser investigados. A ilustração mostra a atmosfera geral do local; objetos, pistas, perigos e personagens são apresentados pela narração e pelos pontos de interação da campanha.',['A imagem não revela automaticamente itens escondidos ou inimigos.','Descreva a intenção da ação antes de interagir com um objeto.','O movimento da cena é narrativo; durante combate, use o mapa tático.','Peça ao mestre para registrar descobertas importantes no diário da companhia.']]
  };
  Object.entries(BOOK_V29_CHAPTERS).forEach(([id,ch])=>{if(BOOK_CONTENT[id])BOOK_CONTENT[id].push([ch[0],ch[1],ch[2]]);});
  BOOK_CONTENT.master.push(['Rolador Universal de Dados','A Central do Mestre inclui um rolador livre para fórmulas de dados que não são resolvidas automaticamente pelo combate ou pelos testes inteligentes de D20. Escolha o tipo de dado, a quantidade, um bônus ou penalidade e uma finalidade. Resultados públicos entram na Linha do Tempo; resultados reservados ficam apenas no armazenamento local deste navegador. Depois da rolagem, o mestre pode aplicar o total como dano ou cura a um aventureiro ou a uma criatura ativa. Essa aplicação é manual e não substitui ataques e habilidades automáticos.',['Abra Rolador Universal na Central do Mestre.','Escolha D4, D6, D8, D10, D12 ou D20, de 1 a 20 dados, e informe o modificador.','Escolha se o resultado será público ou reservado ao mestre e descreva a finalidade.','Após rolar, selecione um aventureiro ou monstro ativo e escolha dano ou cura para aplicar o total ao HP.','Rolagens privadas ficam somente neste dispositivo; exporte ou anote o resultado se precisar consultá-lo em outro aparelho.']]);
  const state = {
    view:'home', modal:null, backend:null, user:null, backendReady:false, realtimeStatus:'disconnected',
    campaign:null, member:null, members:[], events:[], pendingDamage:[], pendingMapMoves:[], pendingMapInteractions:[], pendingWorldInteractions:[], musicAudio:null, musicActivated:false, musicSyncTimer:null, musicSyncBusy:false, musicYoutube:null, musicYoutubeApiPromise:null, musicYoutubeHost:null, musicYoutubePositionBound:false, channel:null, channelPresence:[], authSubscription:null, processed:new Set(),
    charStep:0, charDraft:null, monsterDraft:85, toastTimer:null, diceOverlayTimer:null, cloudCampaigns:[], prefillJoinCode:null,
    selectedMapToken:null, selectedMapTool:'move',
    instanceId:null, lastSyncAt:null, rollQueue:Promise.resolve(), combatQueue:Promise.resolve(), branchQueue:Promise.resolve(), v4NpcSelected:null, isRefreshing:false, reconnectTimer:null, reconnectAttempts:0, lastConnectionChange:null, isUndoing:false,
    localCampaigns:readLocalCampaigns(), currentBook:null, accountMode:'home', bestiarySearch:'', bestiaryKind:'all', bestiarySelectedId:null, bestiaryEncounterIds:[], journalSearch:'', journalFilter:'all', v423LastRoll:null, v423RollBusy:false
  };
  function readLocalCampaigns(){
    try{
      // Campanhas locais antigas em localStorage eram de visitantes e não devem sobreviver a uma sessão nova.
      const raw=sessionStorage.getItem(KEYS.local);
      localStorage.removeItem(KEYS.local);
      return JSON.parse(raw||'[]');
    }catch{localStorage.removeItem(KEYS.local);return []}
  }
  function writeLocalCampaigns(){sessionStorage.setItem(KEYS.local,JSON.stringify(state.localCampaigns));localStorage.removeItem(KEYS.local)}
  function storedAuthUser(serialized){
    try{const value=JSON.parse(serialized);return value?.user||value?.currentSession?.user||value?.session?.user||null}catch{return null}
  }
  function createAuthStorage(){
    // Visitantes ficam apenas nesta aba; contas permanentes permanecem no aparelho e podem autenticar em outro dispositivo.
    return {
      async getItem(key){
        const temporary=sessionStorage.getItem(key);
        if(temporary!==null)return temporary;
        const persistent=localStorage.getItem(key);
        if(persistent!==null&&storedAuthUser(persistent)?.is_anonymous){sessionStorage.setItem(key,persistent);localStorage.removeItem(key)}
        return persistent;
      },
      async setItem(key,value){
        const temporary=!!storedAuthUser(value)?.is_anonymous;
        const destination=temporary?sessionStorage:localStorage;
        const other=temporary?localStorage:sessionStorage;
        other.removeItem(key);destination.setItem(key,value);
      },
      async removeItem(key){localStorage.removeItem(key);sessionStorage.removeItem(key)}
    };
  }
  function getActiveCampaignId(){return (isAnonymousUser()||!state.backendReady?sessionStorage:localStorage).getItem(KEYS.active)}
  function setActiveCampaignId(id){
    const temporary=isAnonymousUser()||!state.backendReady,destination=temporary?sessionStorage:localStorage,other=temporary?localStorage:sessionStorage;
    other.removeItem(KEYS.active);destination.setItem(KEYS.active,id);
  }
  function clearActiveCampaignId(){localStorage.removeItem(KEYS.active);sessionStorage.removeItem(KEYS.active)}
  function esc(value=''){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function toast(message,type='ok'){const node=document.createElement('div');node.className='toast '+(type==='error'?'error':'');node.textContent=message;toastRoot.append(node);setTimeout(()=>node.remove(),3800)}
  function setConnection(label,online=false){const el=$('#connection-status');if(!el)return;el.innerHTML=`<i></i> ${esc(label)}`;el.classList.toggle('offline',!online)}
  function refreshConnectionLabel(){
    if(!navigator.onLine){setConnection('Sem internet',false);return}
    if(!state.backendReady){setConnection('Modo local',false);return}
    if(state.realtimeStatus==='SUBSCRIBED'){setConnection('Sala sincronizada',true);return}
    if(state.realtimeStatus==='connecting'||state.realtimeStatus==='RECONNECTING'){setConnection('Reconectando sala',false);return}
    if(state.realtimeStatus==='CHANNEL_ERROR'||state.realtimeStatus==='TIMED_OUT'||state.realtimeStatus==='CLOSED'){setConnection('Conexão instável',false);return}
    setConnection('Supabase conectado',true);
  }
  function scheduleCampaignReconnect(reason=''){
    if(!state.backendReady||!state.campaign||state.reconnectTimer||!navigator.onLine)return;
    state.reconnectAttempts=Math.min(8,(state.reconnectAttempts||0)+1);
    const delay=Math.min(30000,1000*Math.pow(2,Math.min(5,state.reconnectAttempts-1)));
    state.realtimeStatus='RECONNECTING';state.channelPresence=[];state.lastConnectionChange=new Date().toISOString();refreshConnectionLabel();
    if(reason)console.warn('Realtime desconectado; nova tentativa agendada:',reason);
    state.reconnectTimer=setTimeout(async()=>{
      state.reconnectTimer=null;if(!state.backendReady||!state.campaign||!navigator.onLine)return;
      try{const old=state.channel;state.channel=null;if(old)await state.backend.removeChannel(old);subscribeCampaign()}catch(error){console.warn('Falha ao reconectar campanha:',error);scheduleCampaignReconnect(error?.message||'erro de reconexão')}
    },delay);
  }
  async function retryCampaignConnection(){
    if(!state.backendReady||!state.campaign){await refreshCloudCampaign({silent:true});return}
    if(state.reconnectTimer){clearTimeout(state.reconnectTimer);state.reconnectTimer=null}
    state.reconnectAttempts=0;state.realtimeStatus='connecting';refreshConnectionLabel();
    const old=state.channel;state.channel=null;state.channelPresence=[];
    if(old){try{await state.backend.removeChannel(old)}catch(error){console.warn('Não foi possível remover o canal anterior:',error)}}
    subscribeCampaign();await refreshCloudCampaign({silent:true});toast('Nova tentativa de conexão iniciada.');
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
  function discardTemporaryProgress(){
    // Remove tanto o cache temporário atual quanto qualquer sobra de versões antigas.
    sessionStorage.removeItem(KEYS.local);
    localStorage.removeItem(KEYS.local);
    state.localCampaigns=[];
  }
  function clearCampaignContext(){
    if(state.reconnectTimer){clearTimeout(state.reconnectTimer);state.reconnectTimer=null}state.reconnectAttempts=0;
    if(state.channel&&state.backend)state.backend.removeChannel(state.channel);
    state.channel=null;state.channelPresence=[];state.campaign=null;state.member=null;state.members=[];state.events=[];
    state.pendingDamage=[];state.pendingMapMoves=[];state.pendingMapInteractions=[];state.processed=new Set();state.cloudCampaigns=[];
    clearActiveCampaignId();state.view='campaigns';
  }
  function handleAuthStateChange(event,session){
    const oldId=state.user?.id;const nextUser=session?.user||null;
    state.user=nextUser;
    if(oldId&&nextUser&&oldId!==nextUser.id){clearCampaignContext();Promise.resolve().then(()=>loadCloudCampaigns());}
    if(event==='PASSWORD_RECOVERY'){state.accountMode='recovery-password';state.modal='account';setTimeout(render,0);}
    if(pendingLinkConfirmed()&&state.accountMode!=='set-password'){state.accountMode='set-password';state.modal='account';setTimeout(render,0);}
    else if(event==='SIGNED_IN'&&isPermanentUser(nextUser)&&state.accountMode==='login'){
      // Fecha o diálogo no próprio evento de autenticação, sem aguardar o redesenho da campanha.
      state.accountMode='home';closeModal();setTimeout(render,0);
    }
    if(event==='SIGNED_OUT'&&state.modal==='account'){
      // A saída é confirmada pelo Supabase; o diálogo não deve permanecer sobre a tela de visitante.
      state.accountMode='home';closeModal();setTimeout(render,0);
    }
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
    const wasVisitor=isAnonymousUser();
    const {data,error}=await state.backend.auth.signInWithPassword({email:email.trim().toLowerCase(),password});if(error)throw error;
    if(wasVisitor)discardTemporaryProgress();
    // Evita que um link de confirmação antigo reabra o pop-up depois do login normal.
    localStorage.removeItem(KEYS.pendingLinkEmail);
    state.accountMode='home';state.user=data.user;clearCampaignContext();closeModal();state.view='campaigns';render();
    try{await loadCloudCampaigns();}
    finally{
      // Fecha também se o carregamento das campanhas demorar ou falhar após a autenticação.
      state.accountMode='home';state.modal=null;state.currentBook=null;modalRoot.replaceChildren();render();
    }
    toast('Login realizado. Suas campanhas vinculadas à conta foram carregadas.');
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
    const {error:signOutError}=await state.backend.auth.signOut();if(signOutError)throw signOutError;
    localStorage.removeItem(KEYS.pendingLinkEmail);
    discardTemporaryProgress();
    // A janela fecha assim que a conta sai; criar uma nova sessão visitante é uma etapa separada.
    state.accountMode='home';closeModal();clearCampaignContext();render();
    const {data,error}=await state.backend.auth.signInAnonymously();if(error)throw error;
    clearCampaignContext();state.user=data.user;state.accountMode='home';state.modal=null;state.currentBook=null;modalRoot.replaceChildren();render();toast('Você saiu da conta neste dispositivo. Um novo acesso visitante foi iniciado.');
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
  function defaultGameState(){return {chapter:'Capítulo I — Ecos na Estrada',location:'Estrada Esquecida de Eldoria',narration:'A chuva fina desenha linhas na poeira da estrada. Pegadas profundas seguem em direção à antiga torre de vigia. Entre as árvores, um sino toca uma única vez — embora a vila esteja distante.',encounter:null,started:false,turn:1,notes:[],activeRollPrompt:null,partyState:{},quests:cloneData(STORY_QUESTS),revealedNpcIds:[],journalEntries:[],storyFlags:{},dialogueChoices:{},exploration:{mapId:'eldoria-road',maps:{'eldoria-road':createBoardRecord('eldoria-road')}},worldExploration:{discovered:{},presentedPlaces:[],history:[],positions:{},objectStates:{}},music:{playlist:[],currentTrackId:null,isPlaying:false,position:0,updatedAt:null,globalVolume:0.65,revision:0},v4:{version:4,storyBranches:{active:null,history:[]},npcRelations:{},nextSessionPrep:'',lastSessionSummary:'',lootLog:[]},v41:{version:1,session:{status:'preparing',readyBy:{},startedAt:null,pausedAt:null},snapshots:[],mapPings:[]}}}
  function activeRollPrompt(){return state.campaign?.game_state?.activeRollPrompt||null}
  function canCurrentPlayerRoll(){const prompt=activeRollPrompt();return !!prompt&&Array.isArray(prompt.target_user_ids)&&prompt.target_user_ids.includes(currentUserId())&&!(prompt.fulfilled_user_ids||[]).includes(currentUserId())}

  async function init(){
    state.instanceId=crypto.randomUUID?crypto.randomUUID():('tab-'+Date.now()+'-'+Math.random().toString(36).slice(2));
    sessionStorage.setItem('aethra.instance.id',state.instanceId)
    render();
    const cfg=loadConfig();
    if(cfg?.url&&cfg?.key){try{await connectSupabase(cfg.url,cfg.key,true)}catch(e){console.warn(e);setConnection('Modo local',false)}}
    const active=getActiveCampaignId();
    if(active&&!state.campaign){
      const found=state.localCampaigns.find(c=>c.id===active);
      if(found){state.campaign=found;state.member=found.members.find(m=>m.user_id==='local-user')||found.members[0]||null;state.members=found.members;state.events=found.events||[]}
      else if(state.backendReady){try{await openCloudCampaign(active)}catch(e){console.warn('Não foi possível restaurar a última campanha',e);clearActiveCampaignId()}}
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
    const client=window.supabase.createClient(url.trim(),key.trim(),{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storage:createAuthStorage()}});
    let {data:{session}}=await client.auth.getSession();
    if(!session){const result=await client.auth.signInAnonymously();if(result.error)throw result.error;session=result.data.session}
    const schemaCheck=await client.from('campaigns').select('id').limit(1);
    if(schemaCheck.error){const detail=schemaCheck.error.message||'tabela campaigns indisponível';throw new Error(`A autenticação funcionou, mas o banco de Aethra ainda não está pronto (${detail}). Execute o arquivo supabase-schema.sql no SQL Editor do Supabase e tente novamente.`)}
    state.backend=client;state.user=session.user;state.backendReady=true;state.realtimeStatus='disconnected';
    // Um identificador antigo em localStorage pode pertencer a outro visitante; nunca o adote como a sessão atual.
    if(isAnonymousUser())localStorage.removeItem(KEYS.active);
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
    if(state.modal==='v4-conditions')renderV4ConditionModal();
    if(state.modal==='v4-area')renderV4AreaAttackModal();
    if(state.modal==='v4-branch')renderV4BranchModal();
    if(state.modal==='v4-prep')renderV4PrepModal();
    if(state.modal==='v4-summary')renderV4SummaryModal();
    if(state.modal==='v4-private')renderV4PrivateNotesModal();
    if(state.modal==='v4-npc')renderV4NpcMemoryModal();
    if(state.modal==='v4-loot')renderV4LootModal();
    if(state.modal==='v4-skill')renderV4SkillTreeModal();
    if(state.modal==='v4-backup')renderV4BackupModal();
    if(state.modal==='voice-link')renderVoiceLinkModal();
    if(state.modal==='voice-roll')renderVoiceRollModal();
    if(state.modal==='v41-roll')renderV41RollModal();
    if(state.modal==='v423-dice')renderV423DiceModal();
    if(state.modal==='v41-checkpoints')renderV41CheckpointModal();
    if(state.modal==='v41-bestiary')renderV41BestiaryModal();
    if(state.modal==='v41-journal')renderV41JournalModal();
    if(state.modal==='v411-notifications')renderV411NotificationsModal();
    if(state.modal==='v411-close-session')renderV411CloseSessionModal();
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
        <div class="realm-strip realm-strip-illustrated">
          ${REALMS.map(r=>`<article class="realm-card realm-card-illustrated realm-${r.id}"><img src="assets/realms/${r.id}.webp" alt="Paisagem de ${r.name}" loading="lazy"><div class="realm-card-copy"><span class="realm-element">${r.emoji} ${r.element}</span><strong>${r.name}</strong><span>${r.subtitle}</span><p>${r.desc}</p></div></article>`).join('')}
        </div>
      </section>
      <section class="section two-col">
        <div class="panel"><div class="page-kicker">A primeira profecia</div><h2 class="page-title">A Guerra da Ruptura Celestial</h2><p class="panel-subtitle" style="margin-top:13px">Antes dos reinos, Elyndra, guardiã da criação, e Vharzun, o Dragão Ancião, coexistiam em equilíbrio. A ambição de Vharzun rompeu essa harmonia. Após uma guerra devastadora, a deusa foi capturada — mas, antes de cair, invocou heróis ligados aos poderes dos cinco reinos.</p><p class="panel-subtitle">Agora, esses heróis devem encontrar as relíquias, enfrentar as forças do dragão e decidir o futuro de Aethra.</p><button class="btn btn-secondary btn-small" data-action="open-book" data-book="atlas">Conhecer Aethra →</button></div>
        <div class="panel"><div class="page-kicker">Continue de onde parou</div><h3>Suas campanhas</h3><p class="panel-subtitle">Campanhas salvas ficam disponíveis para você retomar em outra sessão.</p><button class="btn btn-primary" data-action="my-campaigns">Ver minhas campanhas</button><div class="divider"></div><div class="row between"><span class="muted" style="font-size:10px">Armazenamento</span><span class="tag ${state.backendReady?'green':'gold'}">${state.backendReady?'Nuvem conectada':'Modo local'}</span></div></div>
      </section>`;
  }
  function renderLibrary(){
    app.innerHTML=`<div class="page-header"><div><div class="page-kicker">Conhecimento preservado</div><h1 class="page-title">Biblioteca de Aethra</h1><p>Livros de consulta para mestres e aventureiros. A biblioteca acompanha a expansão das crônicas de Aethra.</p></div><button class="btn btn-secondary" data-action="go-home">← Voltar ao início</button></div>
      <div class="notice"><strong>Edição oficial v4.2.4:</strong> a biblioteca reúne os capítulos mais recentes sobre exploração regional e condução de cenas. O Livro do Mestre também possui uma edição diagramada em PDF para consulta durante as sessões. O PDF é um material separado e deve ser guardado pelo mestre; não o publique no repositório público do site. A biblioteca do navegador não oferece proteção real contra acesso ao conteúdo.</div>
      <div class="panel v41-library-tools"><div><div class="small-caps">Consulta rápida</div><h3>Bestiário interativo</h3><p class="panel-subtitle">Pesquise criaturas, veja atributos e prepare encontros sem navegar por capítulos.</p></div><button class="btn btn-primary" data-action="open-bestiary">Abrir bestiário</button></div><div class="library-grid" style="margin-top:18px">${BOOKS.filter(b=>b.id!=='master'||isMaster()).map(b=>`<article class="book-card"><div class="book-cover"><span>${b.icon}</span></div><div class="book-body"><span class="tag ${b.access==='Mestre'?'gold':'green'}">${b.access==='Mestre'?'Reservado ao mestre':'Consulta geral'}</span><h3>${b.title}</h3><p>${b.desc}</p><div class="book-card-actions"><button class="btn btn-secondary btn-small" data-action="open-book" data-book="${b.id}">Abrir livro →</button></div></div></article>`).join('')}</div>`;
  }
  async function loadCloudCampaigns(){
    if(!state.backendReady)return;
    try{
      const {data:members,error}=await state.backend.from('campaign_members').select('campaign_id').eq('user_id',state.user.id);
      if(error)throw error;
      const ids=[...new Set((members||[]).map(m=>m.campaign_id))];
      if(!ids.length){state.cloudCampaigns=[];if(state.view==='campaigns')renderCampaigns();return}
      const {data,error:ce}=await state.backend.from('campaigns').select('id,code,name,description,owner_id,status,created_at,updated_at').in('id',ids).order('updated_at',{ascending:false});
      if(ce)throw ce;state.cloudCampaigns=data||[];if(state.view==='campaigns')renderCampaigns();
    }catch(err){console.warn(err);toast('Não foi possível carregar as campanhas da nuvem.','error')}
  }
  function renderCampaigns(){
    const cards=state.backendReady?'':state.localCampaigns.map(c=>{const localMaster=c.owner_id==='local-user'&&c.members?.some(m=>m.user_id==='local-user'&&m.role==='master');return `<article class="panel"><div class="row between"><span class="tag ${c.status==='active'?'green':'gold'}">${c.status==='active'?'Sessão ativa':'Pausada'}</span><span class="muted" style="font-size:9px">${c.members?.length||1} participante(s)</span></div><h3 style="margin-top:14px">${esc(c.name)}</h3><p class="panel-subtitle">${esc(c.description||'Uma nova crônica de Aethra.')}</p><div class="row between"><span class="campaign-code">${esc(c.code)}</span><button class="btn btn-primary btn-small" data-action="open-local-campaign" data-id="${c.id}">Abrir →</button>${localMaster?`<button class="btn btn-danger btn-small" data-action="delete-campaign" data-id="${c.id}">Excluir</button>`:''}</div></article>`}).join('');
    const cloudCards=state.cloudCampaigns.map(c=>{const owner=c.owner_id===state.user?.id;return `<article class="panel"><div class="row between"><span class="tag ${c.status==='active'?'green':'gold'}">${c.status==='active'?'Sessão ativa':'Pausada'}</span><span class="muted" style="font-size:9px">${esc(c.code)}</span></div><h3 style="margin-top:14px">${esc(c.name)}</h3><p class="panel-subtitle">${esc(c.description||'Uma nova crônica de Aethra.')}</p><div class="row" style="flex-wrap:wrap"><button class="btn btn-primary btn-small" data-action="open-cloud-campaign" data-id="${c.id}">Abrir campanha →</button>${owner?`<button class="btn btn-danger btn-small" data-action="delete-campaign" data-id="${c.id}">Excluir campanha</button>`:`<button class="btn btn-quiet btn-small" data-action="leave-campaign-card" data-id="${c.id}">Sair da campanha</button>`}</div></article>`}).join('');
    app.innerHTML=`<div class="page-header"><div><div class="page-kicker">Suas jornadas</div><h1 class="page-title">Minhas campanhas</h1><p>Abra uma campanha existente ou prepare uma nova aventura.</p></div><button class="btn btn-primary" data-action="create-campaign">＋ Criar campanha</button></div>
    ${state.backendReady?(cloudCards?`<div class="feature-grid">${cloudCards}</div>`:`<div class="empty-state"><div class="symbol">✦</div><strong>Nenhuma campanha na nuvem</strong><p>Crie uma campanha como mestre ou entre com o código de convite de um amigo.</p><div class="hero-actions" style="justify-content:center"><button class="btn btn-primary" data-action="create-campaign">Criar campanha</button><button class="btn btn-secondary" data-action="join-campaign">Entrar com código</button></div></div>`):cards?`<div class="feature-grid">${cards}</div>`:`<div class="empty-state"><div class="symbol">✦</div><strong>Nenhuma campanha por enquanto</strong><p>Crie uma campanha como mestre ou entre com o código de convite de um amigo.</p><div class="hero-actions" style="justify-content:center"><button class="btn btn-primary" data-action="create-campaign">Criar campanha</button><button class="btn btn-secondary" data-action="join-campaign">Entrar com código</button></div></div>`}`;
  }

  async function createCampaign(name,description){
    if(state.backendReady){
      const {data,error}=await state.backend.rpc('create_campaign',{p_name:name,p_description:description});if(error)throw error;
      // O modal é removido antes das leituras/atualizações assíncronas que redesenham o salão.
      closeModal();
      const c=normalizeCampaign(data);await openCloudCampaign(c.id);return;
    }
    const code='AETHRA-'+Math.random().toString(36).slice(2,6).toUpperCase();
    const c={id:'local-'+Date.now(),code,name,description,status:'paused',owner_id:'local-user',game_state:defaultGameState(),members:[{id:'local-master',campaign_id:null,user_id:'local-user',display_name:'Mestre da Crônica',role:'master',character:null,status:'online'}],events:[],created_at:new Date().toISOString()};
    c.members[0].campaign_id=c.id;state.localCampaigns.unshift(c);writeLocalCampaigns();state.campaign=c;state.member=c.members[0];state.members=c.members;state.events=[];setActiveCampaignId(c.id);state.view='lobby';closeModal();render();toast('Campanha criada. Compartilhe o código com seus jogadores.');
  }
  function normalizeCampaign(c){return c?.campaign||c}
  async function joinCampaign(code,displayName){
    if(state.backendReady){const {data,error}=await state.backend.rpc('join_campaign',{p_code:code,p_display_name:displayName});if(error)throw error;const c=normalizeCampaign(data);await openCloudCampaign(c.id);await createEvent('member_joined',{user_id:state.user?.id,display_name:state.member?.display_name||displayName,role:state.member?.role||'player',text:`${state.member?.display_name||displayName} entrou na campanha.`});return}
    const c=state.localCampaigns.find(x=>x.code.toUpperCase()===code.toUpperCase());if(!c)throw new Error('Código não encontrado no modo local. Para convidar pessoas de outros computadores, conecte o Supabase.');
    let m=c.members.find(x=>x.user_id==='local-user');if(!m){m={id:'local-player-'+Date.now(),campaign_id:c.id,user_id:'local-user',display_name:displayName,role:'player',character:null,status:'online'};c.members.push(m)}else m.display_name=displayName;
    state.campaign=c;state.member=m;state.members=c.members;state.events=c.events||[];state.pendingDamage=state.events.filter(e=>e.event_type==='damage_request');state.pendingMapMoves=pendingMapMovesFrom(state.events);state.pendingMapInteractions=pendingMapInteractionsFrom(state.events);state.pendingWorldInteractions=state.events.filter(ev=>ev.event_type==='world_interaction_request');setActiveCampaignId(c.id);writeLocalCampaigns();state.view='lobby';closeModal();await createEvent('member_joined',{user_id:'local-user',display_name:m.display_name,role:m.role,text:`${m.display_name} entrou na campanha.`});render();toast('Você entrou na campanha.');
  }

  function canDeleteCurrentCampaign(){return !!state.campaign&&isMaster()&&(!state.backendReady?state.campaign.owner_id==='local-user':state.campaign.owner_id===state.user?.id)}
  function clearOpenCampaignState(){
    if(state.reconnectTimer){clearTimeout(state.reconnectTimer);state.reconnectTimer=null}state.reconnectAttempts=0;
    if(state.channel&&state.backend)state.backend.removeChannel(state.channel);
    state.channel=null;state.channelPresence=[];state.campaign=null;state.member=null;state.members=[];state.events=[];
    state.pendingDamage=[];state.pendingMapMoves=[];state.pendingMapInteractions=[];state.pendingWorldInteractions=[];state.processed=new Set();stopCampaignMusic();clearActiveCampaignId();
  }
  async function exitOpenCampaign(message){
    clearOpenCampaignState();state.view='campaigns';closeModal();render();if(message)toast(message,'error');
    if(state.backendReady)await loadCloudCampaigns();
  }
  async function deleteCampaignById(id){
    const campaignId=id||state.campaign?.id;if(!campaignId)throw new Error('Selecione uma campanha.');
    const active=state.campaign?.id===campaignId;
    let target=active?state.campaign:(state.backendReady?state.cloudCampaigns.find(c=>c.id===campaignId):localCampaignById(campaignId));
    if(!target)throw new Error('Campanha não encontrada.');
    const owner=state.backendReady?target.owner_id===state.user?.id:(target.owner_id==='local-user'&&target.members?.some(m=>m.user_id==='local-user'&&m.role==='master'));
    if(!owner||(active&&!canDeleteCurrentCampaign()))throw new Error('Somente o mestre que criou esta campanha pode excluí-la.');
    const ok=window.confirm(`Excluir definitivamente a campanha \"${target.name}\"? Todos os registros, eventos e participantes desta campanha serão removidos. Esta ação não pode ser desfeita.`);
    if(!ok)return;
    if(state.backendReady){const {error}=await state.backend.rpc('delete_campaign',{p_campaign_id:campaignId});if(error)throw error;}
    else{state.localCampaigns=state.localCampaigns.filter(c=>c.id!==campaignId);writeLocalCampaigns();}
    if(active)clearOpenCampaignState();state.view='campaigns';closeModal();render();
    if(state.backendReady)await loadCloudCampaigns();
    toast('Campanha excluída pelo mestre.');
  }
  async function removeCampaignParticipant(userId){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode remover participantes.');
    if(!userId||userId===state.user?.id)throw new Error('O mestre não pode remover a própria conta.');
    const member=state.members.find(m=>m.user_id===userId);if(!member||member.role!=='player')throw new Error('Apenas jogadores podem ser removidos.');
    const ok=window.confirm(`Remover ${member.display_name||'este participante'} da campanha? O jogador perderá o acesso à sala; a ficha ficará arquivada e será restaurada se voltar a entrar com o código da campanha.`);if(!ok)return;
    if(state.backendReady){const {error}=await state.backend.rpc('remove_campaign_member',{p_campaign_id:state.campaign.id,p_user_id:userId});if(error)throw error;await refreshCloudCampaign({silent:true});}
    else{state.campaign.members=state.campaign.members.filter(m=>m.user_id!==userId);state.members=state.campaign.members;writeLocalCampaigns();render();}
    toast('Participante removido da campanha.');
  }
  async function leaveCurrentCampaign(){
    if(!state.campaign||!state.member)throw new Error('Você não está em uma campanha.');
    if(isMaster())throw new Error('O mestre não pode sair da própria campanha. Use Excluir campanha se desejar encerrá-la.');
    const ok=window.confirm(`Sair da campanha \"${state.campaign.name}\"? Seu personagem e o progresso geral continuarão salvos para o mestre e os demais participantes.`);if(!ok)return;
    if(state.backendReady){const {error}=await state.backend.rpc('leave_campaign',{p_campaign_id:state.campaign.id});if(error)throw error;}
    else{state.campaign.members=state.campaign.members.filter(m=>m.user_id!=='local-user');writeLocalCampaigns();}
    clearOpenCampaignState();state.view='campaigns';render();if(state.backendReady)await loadCloudCampaigns();toast('Você saiu da campanha.');
  }

  function pendingDamageFrom(events){const resolved=new Set(events.filter(e=>['damage_applied','damage_rejected'].includes(e.event_type)).map(e=>e.payload?.request_id).filter(Boolean));return events.filter(e=>e.event_type==='damage_request'&&!resolved.has(e.id))}
  async function openCloudCampaign(id){
    const [{data:c,error:ce},{data:members,error:me},{data:events,error:ee},{data:gameState,error:ge}]=await Promise.all([
      state.backend.from('campaigns').select('id,code,name,description,owner_id,status,created_at,updated_at').eq('id',id).single(),
      state.backend.from('campaign_members').select('*').eq('campaign_id',id),
      state.backend.from('campaign_events').select('*').eq('campaign_id',id).order('created_at',{ascending:false}).limit(500),
      state.backend.rpc('get_campaign_game_state',{p_campaign_id:id})
    ]);
    if(ce)throw ce;if(me)throw me;if(ee)throw ee;if(ge)throw ge;
    state.campaign={...c,game_state:gameState||{}};state.members=members||[];state.member=state.members.find(m=>m.user_id===state.user.id)||null;state.events=(events||[]).reverse();state.pendingDamage=pendingDamageFrom(state.events);state.pendingMapMoves=pendingMapMovesFrom(state.events);state.pendingMapInteractions=pendingMapInteractionsFrom(state.events);state.pendingWorldInteractions=state.events.filter(ev=>ev.event_type==='world_interaction_request');state.processed=new Set(state.events.map(ev=>ev.id));state.lastSyncAt=new Date().toISOString();
    if(!state.member)throw new Error('Sua conta não está registrada como participante desta campanha. Entre novamente usando o código de convite.');
    setActiveCampaignId(id);state.view=c.status==='active'?'session':'lobby';closeModal();subscribeCampaign();render();startCampaignMusicSync();
  }
  async function refreshCloudCampaign(options={}){
    if(!state.backendReady||!state.campaign||state.isRefreshing)return;
    state.isRefreshing=true;
    const id=state.campaign.id;
    try{
      const [campaignRes,membersRes,eventsRes,stateRes]=await Promise.all([
        state.backend.from('campaigns').select('id,code,name,description,owner_id,status,created_at,updated_at').eq('id',id).single(),
        state.backend.from('campaign_members').select('*').eq('campaign_id',id),
        state.backend.from('campaign_events').select('*').eq('campaign_id',id).order('created_at',{ascending:false}).limit(500),
        state.backend.rpc('get_campaign_game_state',{p_campaign_id:id})
      ]);
      if(membersRes.error)throw membersRes.error;if(eventsRes.error)throw eventsRes.error;if(stateRes.error)throw stateRes.error;
      const freshMembers=membersRes.data||[];
      const stillMember=freshMembers.some(m=>m.user_id===state.user?.id);
      if(!stillMember){await exitOpenCampaign('Você não faz mais parte desta campanha.');return;}
      if(campaignRes.error){if(campaignRes.error.code==='PGRST116'||campaignRes.error.status===406||/0 rows|no rows/i.test(campaignRes.error.message||'')){await exitOpenCampaign('Esta campanha foi excluída pelo mestre.');return;}throw campaignRes.error;}
      if(campaignRes.data)state.campaign={...campaignRes.data,game_state:stateRes.data||{}};
      state.members=freshMembers;
      if(eventsRes.data){state.events=eventsRes.data.reverse();state.pendingDamage=pendingDamageFrom(state.events);state.pendingMapMoves=pendingMapMovesFrom(state.events);state.pendingMapInteractions=pendingMapInteractionsFrom(state.events);state.pendingWorldInteractions=state.events.filter(ev=>ev.event_type==='world_interaction_request');state.processed=new Set(state.events.map(ev=>ev.id))}
      state.member=state.members.find(m=>m.user_id===state.user.id);
      state.lastSyncAt=new Date().toISOString();
      render();syncCampaignMusic(false);
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
      .on('presence',{event:'sync'},()=>{state.channelPresence=Object.values(state.channel.presenceState()).flat();state.lastSyncAt=new Date().toISOString();if(isMasterController()){reconcilePendingRollRequests();reconcilePendingCombatActions()}render()})
      .on('presence',{event:'join'},({newPresences})=>{state.channelPresence=Object.values(state.channel.presenceState()).flat();(newPresences||[]).forEach(p=>{if(isMasterController()&&p.user_id!==state.user.id)toast(`${p.display_name||'Um aventureiro'} entrou na campanha.`)});render()})
      .on('presence',{event:'leave'},()=>{state.channelPresence=Object.values(state.channel.presenceState()).flat();if(isMasterController()){reconcilePendingRollRequests();reconcilePendingCombatActions()}render()})
      .on('postgres_changes',{event:'UPDATE',schema:'public',table:'campaigns',filter:`id=eq.${id}`},payload=>{
        const wasActive=state.campaign?.status==='active';
        if(isMaster()){
          state.campaign={...state.campaign,...payload.new,status:payload.new.status};
          refreshCloudCampaign({silent:true});
        }else{
          state.campaign={...state.campaign,...payload.new,game_state:payload.new.game_state||state.campaign.game_state};
          if(payload.new.status==='active'&&payload.new.game_state?.started&&state.view==='lobby'){state.view='session';toast('O mestre iniciou a sessão. A aventura vai começar!')}
          else if(payload.new.status==='paused'&&state.view==='session'){state.view='lobby';toast('O mestre salvou e encerrou a sessão. Sua crônica está guardada.')}
          render();syncCampaignMusic(false);
        }
      })
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'campaign_events',filter:`campaign_id=eq.${id}`},payload=>handleIncomingEvent(payload.new))
      .on('postgres_changes',{event:'*',schema:'public',table:'campaign_members',filter:`campaign_id=eq.${id}`},()=>refreshCloudCampaign({silent:true}))
      .subscribe(async status=>{
        state.realtimeStatus=status;state.lastConnectionChange=new Date().toISOString();refreshConnectionLabel();
        if(status==='SUBSCRIBED'){
          state.reconnectAttempts=0;if(state.reconnectTimer){clearTimeout(state.reconnectTimer);state.reconnectTimer=null}
          try{
            await state.channel.track({user_id:state.user.id,client_id:state.instanceId,display_name:state.member?.display_name||'Aventureiro',role:state.member?.role||'player',joined_at:new Date().toISOString()});
            state.channelPresence=Object.values(state.channel.presenceState()).flat();
            await refreshCloudCampaign({silent:true});render();
          }catch(err){console.warn('Falha ao anunciar presença:',err);toast('A sala conectou, mas não foi possível atualizar sua presença.','error');scheduleCampaignReconnect(err?.message||'falha ao anunciar presença')}
        }else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'||status==='CLOSED'){
          state.channelPresence=[];scheduleCampaignReconnect(status);render();
        }
      });
  }
  async function processV4BranchChoiceRequest(ev){
    if(!isMasterController())return;
    const gs=state.campaign?.game_state||defaultGameState(),v4=v4GameData(gs),branches=v4.storyBranches||{active:null,history:[]},branch=branches.active;
    if(!branch||branch.id!==ev.payload?.branch_id||branch.selectedOptionId)return;
    const actor=state.members.find(m=>m.user_id===ev.actor_id);if(!actor||actor.role!=='player')return;
    const option=(branch.options||[]).find(o=>o.id===ev.payload?.option_id);if(!option)return;
    branch.votes=branch.votes&&typeof branch.votes==='object'?branch.votes:{};
    if(branch.votes[ev.actor_id])return;
    branch.votes[ev.actor_id]=option.id;
    v4.storyBranches=branches;
    await updateGameState({v4});
    await createEvent('session_note',{kind:'choice-vote',text:`${actor.display_name||'Aventureiro'} registrou um voto em “${option.label}”.`,request_id:ev.id});
    toast(`Voto de ${actor.display_name||'Aventureiro'} registrado.`);
  }
  async function recordV4BranchChoice(optionId){
    const gs=state.campaign?.game_state||defaultGameState(),v4=v4GameData(gs),branch=v4.storyBranches?.active;
    if(!branch||branch.selectedOptionId)throw new Error('Esta decisão já foi resolvida ou não está mais disponível.');
    const option=(branch.options||[]).find(o=>o.id===optionId);if(!option)throw new Error('Opção narrativa inválida.');
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode confirmar a decisão.');
    const votes=branch.votes||{},voteCount=Object.values(votes).filter(id=>id===option.id).length;
    branch.selectedOptionId=option.id;branch.selectedLabel=option.label;branch.selectedBy=state.member?.display_name||'Mestre';branch.selectedAt=new Date().toISOString();branch.selectedVoteCount=voteCount;
    branch.voteSummary=(branch.options||[]).map(o=>({optionId:o.id,count:Object.values(votes).filter(id=>id===o.id).length}));
    recordV4StoryDecision(v4);
    v4.storyBranches.history=[...(v4.storyBranches.history||[]),cloneData(branch)].slice(-40);
    const storyFlags={...(gs.storyFlags||{}),[option.flag||`branch-${branch.id}-${option.id}`]:true};const note=`A companhia escolheu: ${option.label}. ${option.consequence||'O mestre conduzirá as consequências desta decisão.'} (${voteCount} voto(s) registrado(s); decisão confirmada pelo mestre.)`;
    const journalEntries=[...(gs.journalEntries||[]),{id:`branch-${Date.now()}`,text:note,kind:'choice',createdAt:new Date().toISOString()}].slice(-50);
    const partyState=cloneData(gs.partyState||{});applyV4Titles(partyState,Object.keys(branch.votes||{}),v4.achievements);
    await updateGameState({v4,storyFlags,journalEntries,partyState});await createEvent('session_note',{kind:'choice',text:note});toast('Decisão confirmada e registrada na crônica.');
  }
  async function handleIncomingEvent(ev){
    if(!ev||state.processed.has(ev.id))return;state.processed.add(ev.id);state.events.push(ev);if(state.events.length>150)state.events.shift();state.lastSyncAt=new Date().toISOString();
    playEventSound(ev.event_type,ev.payload||{});
    if(ev.event_type==='member_joined'&&ev.actor_id!==currentUserId())toast(`${ev.payload?.display_name||'Um aventureiro'} entrou na campanha.`);
    if(ev.event_type==='voice_action_request'&&isMasterController())toast(`${ev.payload?.player_name||'Um aventureiro'} sinalizou: ${ev.payload?.action_label||'ação rápida'}.`);
    if(ev.event_type==='v41_ready_request'&&isMasterController())state.branchQueue=state.branchQueue.then(()=>processV41ReadyRequest(ev)).catch(err=>toast(err.message||'Não foi possível registrar a prontidão.','error'));
    if(ev.event_type==='v4_branch_choice_request'&&ev.payload?.request_type==='session_ready'&&isMasterController())state.branchQueue=state.branchQueue.then(()=>processV41ReadyRequest(ev)).catch(err=>toast(err.message||'Não foi possível registrar a prontidão.','error')); // Compatibilidade com eventos de prontidão já enviados por clientes v4.1.8
    if(ev.event_type==='v41_map_ping_request'&&isMasterController())state.branchQueue=state.branchQueue.then(()=>processV41MapPingRequest(ev)).catch(err=>toast(err.message||'Não foi possível marcar o mapa.','error'));
    if(ev.event_type==='voice_action_resolved'&&ev.actor_id!==currentUserId())toast(ev.payload?.accepted?`O mestre registrou a ação de ${ev.payload?.player_name||'um aventureiro'}: ${ev.payload?.action_label||'ação'}.`:`O mestre dispensou a solicitação de ${ev.payload?.player_name||'um aventureiro'}.`);
    if(ev.event_type==='campaign_deleted'&&ev.actor_id!==currentUserId()){await exitOpenCampaign('O mestre encerrou e excluiu esta campanha.');return;}
    if(ev.event_type==='member_removed'&&ev.payload?.user_id===currentUserId()){await exitOpenCampaign('O mestre removeu você da campanha.');return;}
    if(ev.event_type==='member_left'&&ev.payload?.user_id===currentUserId())return;
    if(ev.event_type==='member_left'||ev.event_type==='member_removed'){
      await refreshCloudCampaign({silent:true});
      return;
    }
    if(isMasterController()&&ev.event_type==='roll_request'){
      state.rollQueue=state.rollQueue.then(()=>processRollRequest(ev)).catch(err=>{console.error(err);toast(err.message||'Não foi possível processar a rolagem.','error')});
    }
    if(isMasterController()&&ev.event_type==='damage_request'){
      state.pendingDamage.push(ev);toast(`${ev.payload?.player_name||'Um jogador'} declarou um ataque. Valide o dano no painel do monstro.`);
    }
    if(isMasterController()&&ev.event_type==='combat_action_request'){
      state.combatQueue=state.combatQueue.then(()=>processCombatAction(ev)).catch(err=>{console.error(err);toast(err.message||'Não foi possível resolver a ação de combate.','error')});
    }
    if(isMasterController()&&ev.event_type==='v4_branch_choice_request'&&ev.payload?.request_type!=='session_ready'){
      state.branchQueue=state.branchQueue.then(()=>processV4BranchChoiceRequest(ev)).catch(err=>{console.error(err);toast(err.message||'Não foi possível registrar a decisão narrativa.','error')});
    }
    if(ev.event_type==='damage_applied'||ev.event_type==='damage_rejected')state.pendingDamage=state.pendingDamage.filter(item=>item.id!==ev.payload?.request_id);
    if(ev.event_type==='damage_applied')showCombatFX({damage:ev.payload?.amount,description:`${ev.payload?.amount||0} de dano em ${ev.payload?.monster||'a criatura'}`});
    if(ev.event_type==='map_move_request'){if(!state.pendingMapMoves.some(item=>item.id===ev.id))state.pendingMapMoves.push(ev);if(isMasterController())toast(`${ev.payload?.player_name||'Um aventureiro'} solicitou movimento no mapa.`)}
    if(ev.event_type==='session_note'&&ev.payload?.kind==='map'&&ev.payload?.request_id)state.pendingMapMoves=state.pendingMapMoves.filter(item=>item.id!==ev.payload.request_id);
    if(ev.event_type==='map_interaction_request'){if(!state.pendingMapInteractions.some(item=>item.id===ev.id))state.pendingMapInteractions.push(ev);if(isMasterController())toast(`${ev.payload?.player_name||'Um aventureiro'} deseja interagir com um objeto do mapa.`)}
    if(ev.event_type==='session_note'&&ev.payload?.kind==='map-interaction'&&ev.payload?.request_id)state.pendingMapInteractions=state.pendingMapInteractions.filter(item=>item.id!==ev.payload.request_id);
    if(ev.event_type==='map_interaction_result'&&ev.payload?.accepted===false)toast(ev.payload.text||'Interação recusada.','error');
    if(ev.event_type==='world_interaction_request'){if(!state.pendingWorldInteractions.some(item=>item.id===ev.id))state.pendingWorldInteractions.push(ev);if(isMasterController())toast(`${ev.payload?.player_name||'Um aventureiro'} deseja interagir com um objeto da cena.`)}
    if(ev.event_type==='session_note'&&ev.payload?.kind==='world-interaction'&&ev.payload?.request_id){state.pendingWorldInteractions=state.pendingWorldInteractions.filter(item=>item.id!==ev.payload.request_id);if(ev.actor_id!==currentUserId())toast(ev.payload.text||'A interação foi resolvida pelo mestre.')}
    if(ev.event_type==='dice_prompt'&&ev.payload?.target_user_ids?.includes(currentUserId()))toast(`O mestre solicitou um D20: ${ev.payload.reason||'Realize seu teste.'}`);
    if(ev.event_type==='dice_result')showDice(ev.payload?.result,ev.payload?.player_name||'Aventureiro');
    if(ev.event_type==='session_note'&&ev.payload?.kind==='dice-roll')showUniversalDice(ev.payload);
    if(ev.event_type==='combat_action_result'){if(Number.isInteger(ev.payload?.natural))showDice(ev.payload.natural,ev.payload?.player_name||'Aventureiro');showCombatFX(ev.payload);}
    if(ev.event_type==='combat_action_rejected'&&ev.payload?.actor_id===currentUserId())toast(ev.payload.reason||'Sua ação não foi aceita.','error');
    if(ev.event_type==='party_defeated')toast('A companhia foi derrotada. O mestre pode encerrar ou narrar as consequências.','error');
    if(ev.event_type==='monster_attack_result'){if(Number.isInteger(ev.payload?.natural))showDice(ev.payload.natural,ev.payload?.monster||'Monstro');showCombatFX({...ev.payload,monsterAction:true});}
    render();
  }
  function v41CollectRollResults(prompt){
    const publicRows=state.events.filter(item=>item.event_type==='dice_result'&&item.payload?.prompt_id===prompt.id).map(item=>item.payload||{});
    const privateRows=prompt.visibility==='master'?readV41PrivateRolls().filter(item=>item.prompt_id===prompt.id):[];
    const byUser=new Map();[...publicRows,...privateRows].forEach(row=>{if(row.player_user_id)byUser.set(row.player_user_id,row)});
    return [...byUser.values()];
  }
  async function finalizeV41RollPrompt(prompt){
    if(!['collective','opposed'].includes(prompt.testType))return;
    const results=v41CollectRollResults(prompt);if(!results.length)return;
    const names=results.map(r=>`${r.player_name||'Aventureiro'}: ${r.total}`).join(' · ');
    let text='';
    if(prompt.testType==='opposed'){
      const best=Math.max(...results.map(r=>Number(r.total)||0)),winners=results.filter(r=>Number(r.total)===best);
      const enc=state.campaign?.game_state?.encounter,enemies=Array.isArray(enc?.enemies)&&enc.enemies.length?enc.enemies:enc?[enc]:[],opponent=enemies.find(e=>e.id===prompt.opponentMonsterId&&!e.defeated&&Number(e.hp)>0);
      if(opponent){const monsterNatural=secureD20(),monsterModifier=Number(opponent.attackBonus??opponent.attack??0)||0,monsterTotal=monsterNatural+monsterModifier,playerWon=best>monsterTotal,tied=best===monsterTotal;text=`Teste resistido — ${prompt.reason}. ${names}. ${opponent.name} rolou ${monsterNatural} ${monsterModifier>=0?'+':''}${monsterModifier} = ${monsterTotal}. ${tied?'Empate; o mestre decide o desfecho.':playerWon?`${winners.map(r=>r.player_name||'Aventureiro').join(', ')} superou(aram) a criatura.`:`${opponent.name} venceu a disputa.`}`;}
      else{text=`Teste resistido — ${prompt.reason}. ${names}. ${winners.length===1?`Vencedor: ${winners[0].player_name||'Aventureiro'} (${best}).`:`Empate entre ${winners.map(r=>r.player_name||'Aventureiro').join(', ')} (${best}).`}`;}
    }else{
      const successes=results.filter(r=>r.success===true).length,dc=prompt.dc;
      text=dc==null?`Teste coletivo — ${prompt.reason}. ${names}. Média: ${(results.reduce((sum,r)=>sum+(Number(r.total)||0),0)/results.length).toFixed(1)}.`:`Teste coletivo — ${prompt.reason}. ${successes}/${results.length} sucesso(s) contra CD ${dc}. ${names}. ${successes>results.length/2?'A maioria superou a dificuldade.':successes===results.length/2?'Resultado dividido; o mestre decide a consequência.':'A maioria não superou a dificuldade.'}`;
    }
    if(prompt.visibility==='master'){toast(text);return}
    await createEvent('session_note',{kind:'test-summary',text,prompt_id:prompt.id});
  }
  async function processRollRequest(ev){
    const prompt=activeRollPrompt();
    if(!isMasterController()||!prompt?.id||ev.payload?.prompt_id!==prompt.id)return;
    const actorId=ev.actor_id,targets=prompt.target_user_ids||[],fulfilled=prompt.fulfilled_user_ids||[];
    if(!targets.includes(actorId)||fulfilled.includes(actorId))return;
    const alreadyResolved=state.events.find(item=>item.event_type==='dice_result'&&item.payload?.prompt_id===prompt.id&&item.payload?.player_user_id===actorId)||readV41PrivateRolls().find(item=>item.prompt_id===prompt.id&&item.player_user_id===actorId);
    if(!alreadyResolved){
      const outcome=v41RollForPrompt(prompt,actorId),member=state.members.find(m=>m.user_id===actorId),result={...outcome,result:outcome.natural,player_name:member?.character?.name||ev.payload?.player_name||'Aventureiro',reason:prompt.reason||'Teste solicitado',prompt_id:prompt.id,player_user_id:actorId,attribute:prompt.attribute||'',testType:prompt.testType||'individual'};
      if(prompt.visibility==='master')saveV41PrivateRoll(result);else await createEvent('dice_result',result);
      if(prompt.visibility==='master')toast(`Teste reservado resolvido para ${result.player_name}.`);
    }
    const nextFulfilled=[...fulfilled,actorId],completed=nextFulfilled.length>=targets.length;
    if(completed)await finalizeV41RollPrompt(prompt);
    await updateGameState({activeRollPrompt:completed?null:{...prompt,fulfilled_user_ids:nextFulfilled}});
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
  async function rejectCombatAction(ev,reason){
    await createEvent('combat_action_rejected',{request_id:ev.id,actor_id:ev.actor_id,reason:String(reason||'Ação não permitida.')});
  }
  async function processCombatAction(ev){
    if(!isMasterController())return;
    const gs=state.campaign?.game_state||defaultGameState();const enc=gs.encounter;
    if(state.events.some(item=>['combat_action_result','combat_action_rejected'].includes(item.event_type)&&item.payload?.request_id===ev.id))return;
    if(!enc?.id||ev.payload?.encounter_id!==enc.id){await rejectCombatAction(ev,'Esse encontro já foi encerrado ou substituído.');return;}
    if(enc.defeated||enc.partyDefeated){await rejectCombatAction(ev,'O encontro já terminou.');return;}
    const turn=activeCombatTurn(enc);
    if(!turn||turn.kind!=='player'||turn.user_id!==ev.actor_id||Number(ev.payload?.round)!==Number(enc.round)||Number(ev.payload?.turn_index)!==Number(enc.turnIndex)){await rejectCombatAction(ev,'O turno mudou antes de sua ação chegar. Aguarde sua próxima vez.');return;}
    const member=state.members.find(m=>m.user_id===ev.actor_id);if(!member?.character){await rejectCombatAction(ev,'A ficha deste aventureiro não foi encontrada.');return;}
    const character=normalizeCharacter(member.character);const partyState={...(gs.partyState||{})};const vitals=currentPartyVitals(ev.actor_id,character);
    if(vitals.hp<=0){await rejectCombatAction(ev,'Um aventureiro sem pontos de vida não pode agir.');return;}
    const rule=classRule(character);const skill=skillBonuses(character);const enemies=Array.isArray(enc.enemies)&&enc.enemies.length?enc.enemies:[enc];
    const livingEnemies=enemies.filter(e=>!e.defeated&&Number(e.hp)>0);
    const targetEnemy=ev.payload?.target_id?livingEnemies.find(e=>e.id===ev.payload.target_id):livingEnemies[0];
    if(!targetEnemy){await rejectCombatAction(ev,ev.payload?.target_id?'O alvo escolhido não está mais ativo. Escolha outra criatura.':'Não há criatura ativa para receber essa ação.');return;}
    const targetTurn=activeCombatTurn(enc);
    let natural=null,total=null,hit=null,damage=0,healing=0,description='',abilityUsed=vitals.abilityUsed;
    const action=ev.payload?.action||'attack';
    if(action==='item'){
      if(ev.payload?.item_id!=='pocao-cura')throw new Error('Item não disponível nesta versão.');
      const potion=vitals.inventory.find(item=>item.id==='pocao-cura'&&Number(item.qty)>0);if(!potion)throw new Error('Você não possui Poção de Cura.');
      if(vitals.hp>=vitals.maxHp){await rejectCombatAction(ev,'Seus pontos de vida já estão completos; guarde a poção.');return;}
      const die=rollDamageDie(8);healing=die+2+skill.healingReceived+skill.healing;const inventory=vitals.inventory.map(item=>item.id==='pocao-cura'?{...item,qty:Math.max(0,Number(item.qty)-1)}:item);
      partyState[ev.actor_id]={...vitals,hp:Math.min(vitals.maxHp,vitals.hp+healing),inventory};description=`${character.name} usou Poção de Cura e recuperou ${Math.min(healing,vitals.maxHp-vitals.hp)} HP.`;
    } else {
      if(!['attack','ability'].includes(action)){await rejectCombatAction(ev,'Ação desconhecida.');return;}
      if(hasCondition(vitals,'stunned')){await rejectCombatAction(ev,'Seu personagem está Atordoado e perdeu esta ação.');return;}
      const tacticalCheck=validateTacticalAttack(ev.actor_id,character,targetEnemy,gs);if(!tacticalCheck.ok){await rejectCombatAction(ev,tacticalCheck.reason);return;}
      if(action==='ability'&&abilityUsed)throw new Error('Sua habilidade especial já foi utilizada neste encontro.');
      if(action==='ability'&&rule.healing&&vitals.hp>=vitals.maxHp){await rejectCombatAction(ev,'Seus pontos de vida já estão completos; sua habilidade de cura não é necessária.');return;}
      if(action==='ability'&&ev.payload?.ability_id!==rule.abilityId)throw new Error('Habilidade não corresponde à classe deste personagem.');
      if(action==='ability'&&rule.healing){const die=rollDamageDie(rule.abilityDie);healing=die+attrMod(character.attributes[rule.attackAttribute])+skill.healingReceived+skill.healing;partyState[ev.actor_id]={...vitals,hp:Math.min(vitals.maxHp,vitals.hp+Math.max(1,healing)),abilityUsed:true};description=`${character.name} usou ${rule.abilityName} e recuperou ${Math.min(Math.max(1,healing),vitals.maxHp-vitals.hp)} HP.`;}
      else {
        const weapon=vitals.equipment?.weapon||character.equipment?.weapon||STARTER_KITS[character.class]?.weapon||STARTER_KITS.Guerreiro.weapon;
        natural=secureDie(20);const modifier=attrMod(character.attributes[rule.attackAttribute]);const gear=equipmentBonuses(vitals.equipment||character.equipment||{});total=natural+2+modifier+gear.attack+skill.attack+(action==='ability'?rule.abilityAttackBonus+skill.abilityAttack:0)+conditionModifiers(vitals).attack;
        const targetDefense=Number(targetEnemy.defense||12)+conditionModifiers(targetEnemy).defense+(tacticalCheck.cover||0);
        const critical=natural===20||(natural!==1&&skill.critical>0&&natural>=20-skill.critical);hit=critical||(natural!==1&&total>=targetDefense);
        if(hit){const weaponDie=Number(weapon.damageDie)||6;damage=rollDamageDie(weaponDie)+modifier+gear.damage+skill.damage+conditionModifiers(vitals).damage+(action==='ability'?rollDamageDie(rule.abilityDie||8)+skill.abilityDamage:0)+conditionModifiers(targetEnemy).incomingDamage;if(critical)damage+=rollDamageDie(weaponDie);damage=Math.max(1,damage);targetEnemy.hp=Math.max(0,Number(targetEnemy.hp)-damage);targetEnemy.defeated=targetEnemy.hp<=0;if(Array.isArray(enc.enemies)){enc.enemies=enc.enemies.map(e=>e.id===targetEnemy.id?targetEnemy:e);enc.hp=enc.enemies.reduce((n,e)=>n+Math.max(0,Number(e.hp)||0),0)}}else if(!Array.isArray(enc.enemies)){enc.hp=Math.max(0,Number(enc.hp)||0)}
        if(action==='ability')abilityUsed=true;
        partyState[ev.actor_id]={...vitals,abilityUsed};
        description=hit?`${character.name} acertou ${targetEnemy.name} e causou ${damage} de dano.`:`${character.name} tentou atacar ${targetEnemy.name}, mas não conseguiu acertar.`;
      }
    }
    const previousBossPhase=Number(targetEnemy.bossPhase)||1;if(isBossTemplate(targetEnemy)){Object.assign(targetEnemy,applyBossPhase(targetEnemy));if(Array.isArray(enc.enemies)){enc.enemies=enc.enemies.map(e=>e.id===targetEnemy.id?targetEnemy:e);if(enc.enemies[0]?.id===targetEnemy.id){enc.bossPhase=targetEnemy.bossPhase;enc.bossPhaseName=targetEnemy.bossPhaseName;enc.bossPhaseDescription=targetEnemy.bossPhaseDescription;enc.defense=targetEnemy.defense;enc.attackBonus=targetEnemy.attackBonus}}}
    const bossPhaseChanged=isBossTemplate(targetEnemy)&&Number(targetEnemy.bossPhase)!==previousBossPhase;if(bossPhaseChanged)description+=` ${targetEnemy.name} entra em ${targetEnemy.bossPhaseName}.`;
    enc.displayEnemyId=targetEnemy.id;const allDefeated=Array.isArray(enc.enemies)?enc.enemies.every(e=>e.defeated||Number(e.hp)<=0):Number(enc.hp)<=0;const defeated=allDefeated;const next=defeated?{...enc,defeated:true,partyDefeated:false,turnOrder:[],turnIndex:0}:advanceCombatTurn(enc,partyState);const nextTurn=activeCombatTurn(next);if(nextTurn?.kind==='monster')next.displayEnemyId=nextTurn.id;
    await updateGameState({encounter:next,partyState});
    await createEvent('combat_action_result',{request_id:ev.id,player_name:character.name,actor_id:ev.actor_id,action,natural,total,hit,damage,healing,description,monster_hp:targetEnemy.hp,enemy_id:targetEnemy.id,round:next.round,next_turn:activeCombatTurn(next)?.name||'—',boss_phase:next.bossPhase||null,boss_phase_changed:bossPhaseChanged});
    if(bossPhaseChanged)toast(enc.bossPhaseName,'error');
    if(defeated&&!next.partyDefeated){await awardEncounterRewards(next);toast(`Todas as criaturas foram derrotadas! Experiência distribuída à companhia.`)}else if(next.partyDefeated){await createEvent('party_defeated',{description:'A companhia foi derrotada durante a resolução do último ataque.'});toast('A companhia foi derrotada.','error')}
    if(natural!==null){showDice(natural,character.name);if(natural===20&&hit)toast('Acerto crítico! Dano adicional aplicado.')}
    toast(description);
  }
  async function resolveMonsterTurn(){
    if(!isMasterController())throw new Error('Somente o mestre ativo pode resolver o turno do monstro.');
    const gs=state.campaign.game_state||defaultGameState();const enc=gs.encounter;const turn=activeCombatTurn(enc);const activeEnemy=(enc?.enemies||[]).find(e=>e.id===turn?.id)||enc;if(enc?.enemies?.length)enc.displayEnemyId=activeEnemy.id;
    if(!enc||enc.defeated||turn?.kind!=='monster')throw new Error('Não é o turno do monstro.');if(hasCondition(activeEnemy,'stunned')){const skippedPartyState=cloneData(gs.partyState||{});const next=advanceCombatTurn(enc,skippedPartyState);await updateGameState({encounter:next,partyState:skippedPartyState});await createEvent('turn_advanced',{description:`${activeEnemy.name} perdeu o turno por estar Atordoado.`});toast(`${activeEnemy.name} está Atordoado e perdeu a ação.`);return;}
    const partyState={...(gs.partyState||{})};
    const aliveTargets=state.members.filter(m=>m.role==='player'&&m.character).map(m=>({member:m,character:normalizeCharacter(m.character),vitals:currentPartyVitals(m.user_id,m.character)})).filter(x=>x.vitals.hp>0);
    if(!aliveTargets.length){
      const defeated={...enc,turnOrder:[],turnIndex:0,partyDefeated:true};
      await updateGameState({encounter:defeated,partyState});
      await createEvent('party_defeated',{description:'Todos os aventureiros ficaram sem pontos de vida.'});
      toast('A companhia foi derrotada. O mestre pode encerrar o encontro.','error');
      return;
    }
    const targets=aliveTargets.map(target=>({...target,tactical:validateMonsterTacticalAttack(activeEnemy,target.member.user_id,gs)})).filter(target=>target.tactical.ok);
    if(!targets.length){
      const next=advanceCombatTurn(enc,partyState);const nextTurn=activeCombatTurn(next);if(nextTurn?.kind==='monster')next.displayEnemyId=nextTurn.id;await updateGameState({encounter:next,partyState});
      await createEvent('monster_attack_result',{monster:activeEnemy.name,hit:false,damage:0,description:`${activeEnemy.name} não encontrou um aventureiro dentro do alcance (${monsterAttackRange(activeEnemy)} casas) e com linha de visão livre; perdeu a ação.`});
      toast(`${activeEnemy.name} não alcançou nenhum alvo e perdeu a ação.`);return;
    }
    const target=targets[secureDie(targets.length)-1];const natural=secureDie(20);let monsterBonus=Number(activeEnemy.attackBonus||0)+conditionModifiers(activeEnemy).attack;if(activeEnemy.templateId==='goblin-cinzas'&&enc.turnOrder?.[0]?.kind==='monster')monsterBonus+=1;const total=natural+monsterBonus;const targetConditions=conditionModifiers(target.vitals);const targetDefense=target.vitals.defense+(target.tactical.cover||0);const hit=natural===20||(natural!==1&&total>=targetDefense);
    let damage=hit?Math.max(0,rollDamageDie(Number(activeEnemy.damageDie)||6)+Number(activeEnemy.damageBonus||0)+conditionModifiers(activeEnemy).damage+targetConditions.incomingDamage):0;
    if(activeEnemy.templateId==='lobo-cinzento'&&hit&&natural>=18)damage+=rollDamageDie(6);
    if(activeEnemy.templateId==='campeao-orc'&&hit&&natural>=19)damage+=rollDamageDie(8);
    if(['drakthar','vharzun'].includes(activeEnemy.templateId)&&natural>=17){const phase=Number(activeEnemy.bossPhase)||1;const used=Array.isArray(activeEnemy.breathPhases)?activeEnemy.breathPhases:[];if(!used.includes(phase)){const dice=phase+(activeEnemy.templateId==='vharzun'?3:1),bonus=phase*(activeEnemy.templateId==='vharzun'?12:2)+2;damage=rollDamageDie(activeEnemy.templateId==='vharzun'?12:8,dice)+bonus;const affected=[];targets.forEach(x=>{const amount=Math.min(x.vitals.hp,damage);partyState[x.member.user_id]={...x.vitals,hp:Math.max(0,x.vitals.hp-damage)};affected.push({name:x.character.name,damage:amount,hp:Math.max(0,x.vitals.hp-damage)})});activeEnemy.breathPhases=[...used,phase];activeEnemy.specialUsed=true;if(Array.isArray(enc.enemies))enc.enemies=enc.enemies.map(e=>e.id===activeEnemy.id?activeEnemy:e);const next=advanceCombatTurn(enc,partyState);const nextTurn=activeCombatTurn(next);next.displayEnemyId=nextTurn?.kind==='monster'?nextTurn.id:activeEnemy.id;await updateGameState({encounter:next,partyState});await createEvent('monster_attack_result',{monster:activeEnemy.name,special:activeEnemy.specialName,natural,affected,boss_phase:phase,description:`${activeEnemy.name} libera ${activeEnemy.specialName} na fase ${phase}!`});showDice(natural,activeEnemy.name);return}}
    let bossSpecialText='';
    if(isBossTemplate(activeEnemy)&&!['drakthar','vharzun'].includes(activeEnemy.templateId)&&hit&&natural>=18){const phase=Number(activeEnemy.bossPhase)||1,used=Array.isArray(activeEnemy.bossSpecialPhases)?activeEnemy.bossSpecialPhases:[];if(!used.includes(phase)){const extra=rollDamageDie(8)+phase*3;damage+=extra;activeEnemy.bossSpecialPhases=[...used,phase];if(Array.isArray(enc.enemies))enc.enemies=enc.enemies.map(e=>e.id===activeEnemy.id?activeEnemy:e);bossSpecialText=` A habilidade de fase ${activeEnemy.bossPhaseName||''} causa mais ${extra} de dano.`;}}
    const targetState={...target.vitals,hp:Math.max(0,target.vitals.hp-damage)};let specialText='';
    if(activeEnemy.templateId==='espectro-ruptura'&&hit&&natural>=18){targetState.defensePenalty=1;targetState.defensePenaltyUntilRound=(Number(enc.round)||1)+1;specialText=' O toque debilitante reduz a Defesa do alvo em 1 até o fim da próxima rodada.';}
    partyState[target.member.user_id]=targetState;
    const next=advanceCombatTurn(enc,partyState);const nextTurn=activeCombatTurn(next);next.displayEnemyId=nextTurn?.kind==='monster'?nextTurn.id:activeEnemy.id;await updateGameState({encounter:next,partyState});
    const abilityText=activeEnemy.templateId==='campeao-orc'&&hit&&natural>=19?' Golpe demolidor: dano adicional aplicado.':'';
    await createEvent('monster_attack_result',{monster:activeEnemy.name,target:target.character.name,target_user_id:target.member.user_id,natural,total,target_defense:targetDefense,cover:target.tactical.cover||0,range:target.tactical.range,distance:target.tactical.distance,hit,damage,hp:Math.max(0,target.vitals.hp-damage),description:hit?`${activeEnemy.name} atinge ${target.character.name} e causa ${damage} de dano.${abilityText}${specialText}${bossSpecialText}`:`${activeEnemy.name} ataca ${target.character.name}, mas erra.`});
    showDice(natural,activeEnemy.name);toast(hit?`O monstro causou ${damage} de dano a ${target.character.name}.`:'O monstro errou o ataque.');
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
        playEventSound(type,payload||{});
        if(type==='dice_result')showDice(payload?.result,payload?.player_name||'Aventureiro');
        if(type==='session_note'&&payload?.kind==='dice-roll')showUniversalDice(payload);
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
    playEventSound(ev.event_type,ev.payload||{});
    if(ev.event_type==='session_note'&&ev.payload?.kind==='dice-roll')showUniversalDice(ev.payload);
    if(ev.event_type==='roll_request'){const result=secureD20();const resultEvent={id:'local-event-'+Date.now()+'-result',campaign_id:state.campaign.id,actor_id:'local-master',event_type:'dice_result',payload:{result,player_name:ev.payload.player_name,reason:ev.payload.reason},created_at:new Date().toISOString()};state.events.push(resultEvent);showDice(result,ev.payload.player_name);}
    if(ev.event_type==='damage_request'&&isMaster()){
      const enc=state.campaign.game_state?.encounter;const amount=Math.max(0,Math.min(100000,Number(ev.payload.amount)||0));if(enc&&amount){enc.hp=Math.max(0,enc.hp-amount);await persistLocalCampaign();state.events.push({id:'local-dmg-'+Date.now(),event_type:'damage_applied',payload:{amount,hp:enc.hp,monster:enc.name,player_name:ev.payload.player_name},created_at:new Date().toISOString()})}
    }
    if(ev.event_type==='dice_prompt')toast('O mestre solicitou uma rolagem de D20.');
    if(ev.event_type==='damage_applied')showCombatFX({damage:ev.payload?.amount,description:`${ev.payload?.amount||0} de dano em ${ev.payload?.monster||'a criatura'}`});
    if(ev.event_type==='combat_action_result')showCombatFX(ev.payload||{});
    if(ev.event_type==='monster_attack_result')showCombatFX({...ev.payload,monsterAction:true});
  }
  async function requestRoll(targetUserId,reason,options={}){
    if(!isMaster()||!isMasterController())throw new Error('Apenas a instância ativa do mestre pode solicitar dados.');
    const players=state.members.filter(m=>m.role==='player'&&m.character);
    const targets=targetUserId==='all'?players.map(m=>m.user_id):[targetUserId];
    if(!targets.length)throw new Error('Ainda não há jogadores com ficha cadastrada para receber o teste.');
    const dc=options.dc===''||options.dc==null?null:Math.max(1,Math.min(40,Number(options.dc)||1));
    const prompt={id:(crypto.randomUUID?crypto.randomUUID():`roll-${Date.now()}-${Math.random()}`),reason:String(reason||'Teste de D20').slice(0,140),target_user_ids:targets,fulfilled_user_ids:[],created_at:new Date().toISOString(),attribute:String(options.attribute||''),bonus:Math.max(-20,Math.min(20,Number(options.bonus)||0)),dc,mode:['advantage','disadvantage'].includes(options.mode)?options.mode:'normal',visibility:options.visibility==='master'?'master':'public',testType:['collective','opposed'].includes(options.testType)?options.testType:'individual',opponentMonsterId:options.opponentMonsterId||null};
    await updateGameState({activeRollPrompt:prompt});await createEvent('dice_prompt',prompt);
    toast(targets.length===1?'Solicitação enviada ao jogador.':`Solicitação enviada a ${targets.length} jogadores.`);
  }
  function secureD20(){const a=new Uint32Array(1);let x;do{crypto.getRandomValues(a);x=a[0]}while(x>=4294967280);return (x%20)+1}
  async function updateGameState(patch,status,replace=false){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo desta campanha pode alterar seu estado.');
    const current=compactCheckpointCopies(state.campaign.game_state||defaultGameState());let next=compactCheckpointCopies(replace?cloneData(patch):{...current,...patch});
    const checkpointKeys=['encounter','quests','partyState','exploration','worldExploration','chapter','location'];
    if(!replace&&!state.isUndoing&&!Object.prototype.hasOwnProperty.call(patch,'v41')&&Object.keys(patch).some(key=>checkpointKeys.includes(key))){
      const data=v41GameData(current);if(v41CheckpointAge(data)>10*60*1000)next.v41=createV41Checkpoint(current,patch.encounter?'Antes de alterar o encontro':patch.quests?'Antes de alterar missões':patch.exploration?'Antes de alterar a exploração':'Salvamento automático');
    }
    if(replace&&state.isUndoing){next.v411=patch.v411||current.v411||{version:1,revision:v411GameData(current).revision+1,undoHistory:[]};}
    else if(replace){next.v411={...v411GameData(next),revision:v411GameData(current).revision+1,undoHistory:[]};}
    else if(state.isUndoing){next.v411=patch.v411||current.v411||{version:1,revision:v411GameData(current).revision+1,undoHistory:[]};}
    else{
      const prior=v411GameData(current),keys=Object.keys(patch||{}).filter(key=>key!=='v411'),before={};
      keys.forEach(key=>{before[key]={present:Object.prototype.hasOwnProperty.call(current,key),value:Object.prototype.hasOwnProperty.call(current,key)?cloneData(current[key]):null}});
      const revision=prior.revision+1,record={id:`undo-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,actorId:currentUserId(),at:new Date().toISOString(),revision,statusBefore:state.campaign.status,summary:v411UndoLabel(keys),before};
      next.v411={...prior,revision,undoHistory:keys.length?[...prior.undoHistory,record].slice(-8):prior.undoHistory};
    }
    if(state.backendReady){const {error}=await state.backend.rpc('update_campaign_state',{p_campaign_id:state.campaign.id,p_game_state:next,p_status:status||state.campaign.status});if(error)throw error;state.campaign={...state.campaign,game_state:next,status:status||state.campaign.status}}
    else{state.campaign.game_state=next;if(status)state.campaign.status=status;await persistLocalCampaign()}
    state.lastSyncAt=new Date().toISOString();render();
  }
  async function persistLocalCampaign(){const i=state.localCampaigns.findIndex(c=>c.id===state.campaign.id);if(i>=0){state.localCampaigns[i]=state.campaign;state.localCampaigns[i].members=state.members;state.localCampaigns[i].events=state.events;writeLocalCampaigns()}}
  async function saveCharacter(character){
    character=normalizeCharacter(character);
    if(state.backendReady){
      const {error}=await state.backend.rpc('save_my_character',{p_campaign_id:state.campaign.id,p_character:character,p_display_name:character.name});if(error)throw error;
      // O fechamento precisa ocorrer antes do refresh: ele redesenha o salão via Realtime.
      closeModal();state.view='lobby';
      await refreshCloudCampaign();
    }else{state.member.character=character;state.member.display_name=character.name;state.member.status='online';state.members=state.campaign.members;await persistLocalCampaign()}
    state.view='lobby';closeModal();render();toast('Personagem salvo na crônica.');
  }

  function memberIsOnline(member){
    if(!state.backendReady)return member.user_id==='local-user';
    return state.realtimeStatus==='SUBSCRIBED'&&state.channelPresence.some(p=>p.user_id===member.user_id);
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
  const VOICE_PLAYER_ACTIONS=[
    {id:'investigate',label:'Investigar',icon:'⌕',hint:'Examinar uma pista ou objeto'},
    {id:'observe',label:'Observar',icon:'◉',hint:'Examinar o ambiente com atenção'},
    {id:'talk',label:'Conversar',icon:'✦',hint:'Falar com um NPC ou personagem'},
    {id:'interact',label:'Interagir',icon:'⚒',hint:'Usar um objeto ou mecanismo'},
    {id:'help',label:'Ajudar',icon:'✚',hint:'Apoiar outro aventureiro'},
    {id:'protect',label:'Proteger',icon:'⬡',hint:'Defender alguém ou uma posição'},
    {id:'follow',label:'Acompanhar',icon:'➜',hint:'Seguir a companhia ou uma pista'},
    {id:'retreat',label:'Recuar',icon:'↶',hint:'Afastar-se ou procurar abrigo'},
    {id:'prepare',label:'Preparar ação',icon:'⌁',hint:'Preparar uma ação para um gatilho ou oportunidade'},
    {id:'use-magic',label:'Usar magia',icon:'✧',hint:'Sinalizar a intenção de usar uma habilidade mágica'},
    {id:'search',label:'Procurar',icon:'⌕',hint:'Procurar um item, passagem ou vestígio'},
    {id:'defend',label:'Defender',icon:'⛨',hint:'Adotar postura defensiva'}
  ];
  const VOICE_QUICK_NOTES={
    clue:{label:'Pista encontrada',text:'A companhia encontrou uma pista importante durante a cena.'},
    objective:{label:'Objetivo avançou',text:'O mestre confirmou o avanço de um objetivo da missão.'},
    scene:{label:'Cena concluída',text:'A cena atual foi concluída; o mestre conduzirá a transição.'},
    rest:{label:'Descanso realizado',text:'O mestre confirmou um momento de descanso para a companhia.'}
  };
  const VOICE_ROLL_TYPES=['Percepção','Investigação','Força','Destreza','Constituição','Inteligência','Sabedoria','Carisma','Furtividade','Persuasão','Salvaguarda'];
  function voiceCallUrl(platform,value){
    try{
      const url=new URL(String(value||'').trim());if(url.protocol!=='https:'||url.username||url.password)return '';
      const host=url.hostname.toLowerCase();
      const allowed={discord:['discord.com','discord.gg','discordapp.com'],whatsapp:['whatsapp.com','wa.me','api.whatsapp.com'],meet:['meet.google.com']};
      const roots=allowed[platform]||[];
      return roots.some(root=>host===root||host.endsWith('.'+root))?url.href:'';
    }catch{return ''}
  }
  function pendingVoiceActionRequests(events=state.events){
    const rows=Array.isArray(events)?events:[];
    const resolved=new Set(rows.filter(e=>e?.event_type==='voice_action_resolved').map(e=>e.payload?.request_id).filter(Boolean));
    const cutoff=Date.now()-(12*60*60*1000);
    return rows.filter(e=>{if(e?.event_type!=='voice_action_request'||!e.id||resolved.has(e.id))return false;const created=Date.parse(e.created_at||'');return !Number.isFinite(created)||created>=cutoff}).slice(-16).reverse();
  }
  function voicePlatformName(platform){return ({discord:'Discord',whatsapp:'WhatsApp',meet:'Google Meet'})[platform]||'chamada externa'}
  async function copyTextToClipboard(text){
    const value=String(text||'');if(!value)throw new Error('Não há conteúdo para copiar.');
    if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(value);return true;}
    const box=document.createElement('textarea');box.value=value;box.setAttribute('readonly','');box.style.position='fixed';box.style.opacity='0';document.body.append(box);box.select();const ok=document.execCommand('copy');box.remove();if(!ok)throw new Error('O navegador não permitiu copiar automaticamente.');return true;
  }
  function renderVoiceSessionPanel(gs){
    const voice=v4GameData(gs).voiceSession||{enabled:false},enabled=!!voice.enabled,link=voiceCallUrl(voice.platform,voice.url),master=isMaster()&&isMasterController();
    if(!enabled&&!isMaster())return '';
    const pending=master?pendingVoiceActionRequests():[];
    const callButton=link?`<button class="btn btn-primary btn-small" data-action="voice-open-call">Abrir ${esc(voicePlatformName(voice.platform))} ↗</button>`:master?`<button class="btn btn-secondary btn-small" data-action="voice-configure">Adicionar link da chamada</button>`:'<span class="voice-link-missing">O mestre ainda não adicionou um convite.</span>';
    const playerActions=!isMaster()&&enabled?`<div class="voice-action-grid">${VOICE_PLAYER_ACTIONS.map(a=>`<button class="voice-action-button" data-action="voice-send-action" data-voice-action="${a.id}" title="${esc(a.hint)}"><span>${a.icon}</span><strong>${esc(a.label)}</strong></button>`).join('')}</div><p class="voice-panel-hint">Diga sua intenção normalmente na chamada e toque em uma opção para avisar o mestre. Não é necessário escrever uma descrição.</p>`:'';
    const masterControls=master?`<div class="voice-master-tools"><div class="voice-tool-group"><strong>Atalhos do mestre</strong><div class="voice-quick-buttons"><button class="btn btn-secondary btn-small" data-action="voice-open-roll">Solicitar D20 rápido</button><button class="btn btn-secondary btn-small" data-action="voice-quick-note" data-note="clue">Pista encontrada</button><button class="btn btn-secondary btn-small" data-action="voice-quick-note" data-note="objective">Objetivo avançou</button><button class="btn btn-secondary btn-small" data-action="voice-quick-note" data-note="scene">Concluir cena</button><button class="btn btn-secondary btn-small" data-action="voice-quick-note" data-note="rest">Descanso</button></div></div><div class="voice-tool-group"><div class="row between"><strong>Intenções dos jogadores</strong><span class="tag gold">${pending.length} pendente(s)</span></div>${pending.length?`<div class="voice-request-list">${pending.map(ev=>{const action=VOICE_PLAYER_ACTIONS.find(a=>a.id===ev.payload?.action_id);return `<div class="voice-request-row"><div><strong>${esc(ev.payload?.player_name||'Aventureiro')} · ${esc(action?.label||'Ação')}</strong><small>${esc(action?.hint||'Intenção enviada pela chamada')}</small></div><div class="voice-request-actions"><button class="btn btn-primary btn-small" data-action="voice-resolve-action" data-request-id="${esc(ev.id)}">Registrar</button><button class="btn btn-quiet btn-small" data-action="voice-dismiss-action" data-request-id="${esc(ev.id)}" aria-label="Dispensar solicitação">×</button></div></div>`}).join('')}</div>`:'<p class="voice-panel-hint">Nenhuma intenção aguardando confirmação. Quando um jogador tocar em uma ação rápida, ela aparecerá aqui.</p>'}</div></div>`:'';
    return `<section class="panel voice-session-panel ${enabled?'is-enabled':''}"><div class="row between voice-session-head"><div><div class="small-caps">Sessão por voz · ${enabled?'Ativo':'Preparação'}</div><h3>Modo Chamada</h3><p class="panel-subtitle">A conversa acontece no ${esc(voicePlatformName(voice.platform))}; Aethra mantém a mesa visual, os dados e os registros sincronizados.</p></div><span class="tag ${enabled?'green':'gold'}">${enabled?'● Modo ativo':'○ Desativado'}</span></div><div class="voice-session-actions">${enabled?callButton:''}<button class="btn btn-quiet btn-small" data-action="voice-copy-invite">Copiar convite da campanha</button>${master?`<button class="btn btn-secondary btn-small" data-action="voice-configure">Configurar chamada</button><button class="btn btn-${enabled?'quiet':'primary'} btn-small" data-action="voice-toggle">${enabled?'Desativar modo':'Ativar modo'}</button>`:''}</div>${enabled?`<div class="voice-connection-note"><strong>Como usar:</strong> mantenham o Discord, WhatsApp ou Google Meet aberto em outra aba ou aplicativo. Os jogadores falam normalmente e usam os atalhos abaixo quando precisarem registrar uma ação. O jogo não captura nem transmite áudio.</div>${playerActions}${masterControls}`:`<p class="voice-panel-hint">Ative o modo quando a companhia estiver reunida em uma chamada. Os campos de texto continuam disponíveis fora desse modo.</p>`}</section>`;
  }
  function renderVoiceLinkModal(){
    if(!isMaster()||!isMasterController())return;
    const voice=v4GameData().voiceSession||{},platform=['discord','whatsapp','meet'].includes(voice.platform)?voice.platform:'discord';
    const html=`<form id="voice-link-form"><div class="field"><label for="voice-platform">PLATAFORMA DA CHAMADA</label><select class="select" id="voice-platform"><option value="discord" ${platform==='discord'?'selected':''}>Discord</option><option value="whatsapp" ${platform==='whatsapp'?'selected':''}>WhatsApp</option><option value="meet" ${platform==='meet'?'selected':''}>Google Meet</option></select></div><div class="field"><label for="voice-url">LINK DE CONVITE (OPCIONAL)</label><input class="input" id="voice-url" type="url" value="${esc(voice.url||'')}" placeholder="Cole o link da sala ou chamada"><span class="hint">Discord: discord.gg · WhatsApp: chat.whatsapp.com / call.whatsapp.com · Meet: meet.google.com. Somente links HTTPS dessas plataformas são aceitos.</span></div><label class="voice-check"><input type="checkbox" id="voice-enabled" ${voice.enabled!==false?'checked':''}><span><strong>Ativar Modo Chamada para a companhia</strong><small>Os botões de ações rápidas ficam visíveis para todos os participantes.</small></span></label><div class="notice">O Reino de Aethra não entra na chamada, não usa microfone e não transmite áudio. A chamada permanece no aplicativo escolhido; esta plataforma cuida do tabuleiro, iniciativa, fichas, dados e registros.</div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button type="submit" class="btn btn-primary">Salvar configuração</button></div></form>`;
    v4ModalShell('Configurar chamada de voz','Conecte o fluxo visual da campanha ao link externo que sua companhia já utiliza.',html);
  }
  function renderVoiceRollModal(){
    if(!isMaster()||!isMasterController())return;
    const players=state.members.filter(m=>m.role==='player'&&m.character);
    const html=`<form id="voice-roll-form"><div class="form-grid"><div class="field"><label for="voice-roll-target">QUEM DEVE ROLAR?</label><select class="select" id="voice-roll-target"><option value="all">Todos os jogadores · coletivo</option>${players.map(m=>`<option value="${esc(m.user_id)}">${esc(m.character?.name||m.display_name||'Aventureiro')}</option>`).join('')}</select></div><div class="field"><label for="voice-roll-type">TESTE SOLICITADO</label><select class="select" id="voice-roll-type">${VOICE_ROLL_TYPES.map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join('')}</select></div><div class="field"><label for="voice-roll-dc">DIFICULDADE (CD) · OPCIONAL</label><input class="input" id="voice-roll-dc" type="number" min="1" max="40" placeholder="Ex.: 12"></div><div class="field"><label for="voice-roll-mode">VANTAGEM / DESVANTAGEM</label><select class="select" id="voice-roll-mode"><option value="normal">Normal</option><option value="advantage">Vantagem</option><option value="disadvantage">Desvantagem</option></select></div></div><div class="notice">O sistema aplica automaticamente o modificador do atributo escolhido. Se todos rolarem, a linha do tempo resume o resultado coletivo. O resultado aparece para a companhia.</div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button class="btn btn-primary" type="submit" ${players.length?'':'disabled'}>Solicitar D20</button></div></form>`;
    v4ModalShell('Teste rápido por voz','Escolha um jogador e um atributo sem precisar digitar a descrição do teste.',html);
  }
  function safeVoiceSessionLink(){const voice=v4GameData().voiceSession||{};return voiceCallUrl(voice.platform,voice.url)}
  async function saveVoiceQuickNote(noteId){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode registrar resultados rápidos.');
    const preset=VOICE_QUICK_NOTES[noteId];if(!preset)throw new Error('Registro rápido desconhecido.');
    await appendJournalEntry(preset.text,'voice');await createEvent('session_note',{kind:'voice',text:preset.text});toast(`${preset.label} registrado no diário.`);
  }
  async function resolveVoiceActionRequest(requestId,accepted=true){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode confirmar ações da chamada.');
    const request=state.events.find(e=>e.id===requestId&&e.event_type==='voice_action_request');if(!request)throw new Error('A solicitação não está mais disponível.');
    const action=VOICE_PLAYER_ACTIONS.find(a=>a.id===request.payload?.action_id);if(!action)throw new Error('Ação rápida inválida.');
    if(accepted){const name=request.payload?.player_name||'Aventureiro';await appendJournalEntry(`${name} declarou pela chamada: ${action.label}. O mestre confirmou e conduziu a ação.`,'voice');}
    await createEvent('voice_action_resolved',{request_id:request.id,accepted:!!accepted,player_name:request.payload?.player_name||'Aventureiro',action_label:action.label});
    toast(accepted?`${action.label} registrado na crônica.`:'Solicitação dispensada.');render();
  }
  function renderMasterCommandCenter(gs){
    const data=v4GameData(gs),enc=gs.encounter,active=enc&&!enc.defeated&&!enc.partyDefeated,activeQuest=(gs.quests||STORY_QUESTS).filter(q=>q.status==='active').length,online=state.members.filter(m=>memberIsOnline(m)).length,enemyCount=enc?.enemies?.filter(e=>!e.defeated&&e.hp>0).length||0;
    const privateKey=`aethra.v4.private.${state.campaign?.id||'none'}.${currentUserId()}`;
    return `<section class="panel v4-command-center"><div class="row between v4-command-head"><div><div class="small-caps">Edição 4.2.3 · Sala de controle</div><h3>Central do Mestre</h3><p class="panel-subtitle">Resumo da sessão e ferramentas principais em um só lugar.</p></div><span class="tag gold">${state.backendReady?(isMasterController()?'Controle ativo':'Mestre em outra aba'):'Local'}</span></div><div class="v4-command-stats"><div><small>Participantes online</small><strong>${online}/${state.members.length}</strong></div><div><small>Missões ativas</small><strong>${activeQuest}</strong></div><div><small>Encontro</small><strong>${active?`${enemyCount} inimigo(s)`:'Exploração'}</strong></div><div><small>Capítulo</small><strong>${esc((gs.chapter||'Capítulo I').replace(/^Capítulo\s*/,'Cap. '))}</strong></div></div><div class="v4-command-actions"><button class="btn btn-secondary btn-small" data-action="v4-open-summary">Registrar resumo da sessão</button><button class="btn btn-secondary btn-small" data-action="v4-open-prep">Preparar próxima sessão</button><button class="btn btn-secondary btn-small" data-action="v4-open-branch">Criar decisão narrativa</button><button class="btn btn-secondary btn-small" data-action="v41-open-roll">Teste inteligente D20</button><button class="btn btn-secondary btn-small" data-action="v423-open-dice">Rolador Universal</button><button class="btn btn-secondary btn-small" data-action="v41-open-checkpoints">Pontos de restauração</button><button class="btn btn-secondary btn-small" data-action="open-bestiary">Consultar bestiário</button><button class="btn btn-secondary btn-small" data-action="open-journal">Linha do tempo</button><button class="btn btn-secondary btn-small" data-action="v4-open-conditions" ${active?'':'disabled'}>Condições de combate</button><button class="btn btn-secondary btn-small" data-action="v4-open-area" ${active?'':'disabled'}>Ataque em área</button><button class="btn btn-secondary btn-small" data-action="v4-open-loot">Distribuir tesouro</button><button class="btn btn-secondary btn-small" data-action="v4-open-npc">Memória dos NPCs</button><button class="btn btn-secondary btn-small" data-action="v4-open-private">Anotações secretas</button><button class="btn btn-quiet btn-small" data-action="v4-export-backup">Exportar backup</button><button class="btn btn-quiet btn-small" data-action="v4-open-backup">Restaurar backup</button></div>${data.nextSessionPrep?`<div class="v4-prep-preview"><strong>Próxima sessão preparada</strong><p>${esc(data.nextSessionPrep)}</p></div>`:'<p class="v4-inline-hint">Você ainda não preparou a próxima sessão. Registre objetivos, cenas e encontros pendentes para retomar rapidamente.</p>'}${renderV41MasterStatus(gs)}</section>`;
  }
  function renderStoryBranchPanel(gs){
    const branch=v4GameData(gs).storyBranches?.active;if(!branch)return '';
    const resolved=!!branch.selectedOptionId,selected=branch.options?.find(o=>o.id===branch.selectedOptionId),votes=branch.votes||{},myVote=votes[currentUserId()],voteTotal=Object.keys(votes).length,isMasterView=isMaster()&&isMasterController();
    const counts=(branch.options||[]).map(option=>({option,count:Object.values(votes).filter(id=>id===option.id).length}));
    if(resolved)return `<section class="panel v4-story-branch"><div class="small-caps">Decisão da companhia</div><h3>${esc(branch.question)}</h3><div class="notice"><strong>Escolha confirmada:</strong> ${esc(selected?.label||'Decisão')}<p>${esc(selected?.consequence||'O mestre conduzirá as consequências desta decisão.')}</p><small>Confirmada pelo mestre · ${Number(branch.selectedVoteCount)||0} voto(s) recebido(s)</small></div></section>`;
    if(isMaster()&&!isMasterController())return `<section class="panel v4-story-branch"><div class="small-caps">Decisão da companhia</div><h3>${esc(branch.question)}</h3><div class="notice">O mestre ativo está em outra aba. Aguarde a confirmação da votação.</div></section>`;
    if(isMasterView)return `<section class="panel v4-story-branch"><div class="small-caps">Votação da companhia · ${voteTotal} voto(s)</div><h3>${esc(branch.question)}</h3><div class="v4-choice-grid">${counts.map(({option,count})=>`<div class="v4-choice-card v4-choice-master"><strong>${esc(option.label)}</strong><small>${esc(option.publicHint||'')}</small><span class="tag gold">${count} voto(s)</span><button class="btn btn-primary btn-small" data-action="v4-resolve-branch" data-option-id="${esc(option.id)}">Confirmar esta opção</button></div>`).join('')}</div><p class="panel-subtitle">Cada jogador pode votar uma vez. Você pode confirmar a opção mais votada ou escolher outra em caso de empate ou decisão narrativa do mestre.</p></section>`;
    if(myVote){const voted=branch.options?.find(o=>o.id===myVote);return `<section class="panel v4-story-branch"><div class="small-caps">Decisão da companhia · ${voteTotal} voto(s)</div><h3>${esc(branch.question)}</h3><div class="notice"><strong>Seu voto foi registrado:</strong> ${esc(voted?.label||'Opção selecionada')}<p>Aguardando o mestre concluir a votação e narrar as consequências.</p></div></section>`}
    return `<section class="panel v4-story-branch"><div class="small-caps">Decisão da companhia · ${voteTotal} voto(s)</div><h3>${esc(branch.question)}</h3><div class="v4-choice-grid">${counts.map(({option,count})=>`<button class="v4-choice-card" data-action="v4-choose-branch" data-option-id="${esc(option.id)}" data-branch-id="${esc(branch.id)}"><strong>${esc(option.label)}</strong><small>${esc(option.publicHint||'Escolha este caminho.')}</small><span class="tag">${count} voto(s)</span></button>`).join('')}</div><p class="panel-subtitle">Escolha uma opção. Cada jogador pode votar uma única vez; o mestre confirmará o resultado da decisão.</p></section>`;
  }
  function v4ModalShell(title,subtitle,content){const modalClass=state.modal==='v41-bestiary'?'modal wide v413-bestiary-modal':'modal wide';modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="${modalClass}" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="page-kicker">Central do Mestre · v4.2.4</div><h2>${esc(title)}</h2><p>${esc(subtitle)}</p></div><button class="modal-close" data-action="close-modal" aria-label="Fechar">×</button></div>${content}</section></div>`}
  function renderV4ConditionModal(){
    if(!isMaster()||!isMasterController())return;
    const enc=state.campaign?.game_state?.encounter,party=state.campaign?.game_state?.partyState||{},enemies=enc?.enemies||[],players=state.members.filter(m=>m.role==='player'&&m.character);
    const opts=[...players.map(m=>({value:`player:${m.user_id}`,label:`${m.character.name} · aventureiro`})),...enemies.filter(e=>!e.defeated&&e.hp>0).map(e=>({value:`monster:${e.id}`,label:`${e.name} · criatura`}))];
    const rows=[...players.map(m=>({name:m.character.name,conditions:party[m.user_id]?.conditions||[]})),...enemies.map(e=>({name:e.name,conditions:e.conditions||[]}))].filter(x=>x.conditions.length);
    const html=`${!enc?'<div class="notice">Não há encontro ativo. As condições são aplicadas durante o combate.</div>':''}<form id="v4-condition-form"><div class="form-grid"><div class="field"><label for="v4-condition-target">ALVO</label><select class="select" id="v4-condition-target" required>${opts.map(o=>`<option value="${esc(o.value)}">${esc(o.label)}</option>`).join('')}</select></div><div class="field"><label for="v4-condition-id">CONDIÇÃO</label><select class="select" id="v4-condition-id">${Object.entries(COMBAT_CONDITIONS).map(([id,c])=>`<option value="${id}">${c.icon} ${esc(c.name.trim())}</option>`).join('')}</select></div><div class="field"><label for="v4-condition-duration">DURAÇÃO EM TURNOS</label><input class="input" id="v4-condition-duration" type="number" min="1" max="10" value="2"></div><div class="field"><label for="v4-condition-note">OBSERVAÇÃO (OPCIONAL)</label><input class="input" id="v4-condition-note" maxlength="160" placeholder="Ex.: até ser curado"></div></div><p class="panel-subtitle">Atordoado consome a próxima ação. Queimando causa 1d4 ao terminar o turno do alvo. Envenenado reduz ataque; Congelado reduz Defesa. Enfraquecido reduz dano, Marcado aumenta o dano recebido e Enraizado impede movimento.</p><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button type="submit" class="btn btn-primary" ${opts.length&&enc?'':'disabled'}>Aplicar condição</button></div></form>${rows.length?`<div class="divider"></div><h3>Condições em vigor</h3><div class="v4-condition-list">${rows.map(r=>`<div class="member-row"><strong>${esc(r.name)}</strong><span>${r.conditions.map(c=>`${COMBAT_CONDITIONS[c.id]?.icon||'•'} ${esc(COMBAT_CONDITIONS[c.id]?.name||c.id)} (${c.remainingTurns})`).join(' · ')}</span></div>`).join('')}</div>`:''}`;
    v4ModalShell('Condições de combate','Aplique efeitos temporários a um aventureiro ou criatura. A duração é contada nos turnos do próprio alvo.',html);
  }
  function renderV4AreaAttackModal(){
    if(!isMaster()||!isMasterController())return;
    const html=`<form id="v4-area-form"><div class="notice">O ataque em área atinge os combatentes cujas bases estejam dentro do raio escolhido. A posição é informada por coordenada do tabuleiro (ex.: E4).</div><div class="form-grid"><div class="field"><label for="v4-area-center">CENTRO DA ÁREA</label><input class="input" id="v4-area-center" maxlength="3" placeholder="E4" pattern="[A-Ja-j][1-8]" required></div><div class="field"><label for="v4-area-radius">RAIO (CASAS)</label><input class="input" id="v4-area-radius" type="number" min="1" max="5" value="1" required></div><div class="field"><label for="v4-area-damage">DANO</label><input class="input" id="v4-area-damage" type="number" min="1" max="500" value="12" required></div><div class="field"><label for="v4-area-scope">ALVOS</label><select class="select" id="v4-area-scope"><option value="monsters">Somente monstros</option><option value="all">Todos os combatentes</option></select></div></div><div class="field"><label for="v4-area-description">DESCRIÇÃO</label><input class="input" id="v4-area-description" maxlength="140" value="Explosão em área" required></div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button type="submit" class="btn btn-danger">Aplicar ataque em área</button></div></form>`;
    v4ModalShell('Ataque em área','Ferramenta do mestre para resolver explosões, sopros, ondas e magias de área.',html);
  }
  function renderV4BranchModal(){if(!isMaster()||!isMasterController())return;const html=`<form id="v4-branch-form"><div class="field"><label for="v4-branch-question">PERGUNTA PARA A COMPANHIA</label><textarea class="textarea" id="v4-branch-question" maxlength="420" required placeholder="A estrada se divide: seguir pela ponte ou entrar na mata?"></textarea></div><div class="v4-branch-editor-grid">${[1,2,3].map(i=>`<article class="v4-branch-editor-card"><h4>Opção ${i}</h4><div class="field"><label for="v4-branch-label-${i}">TÍTULO</label><input class="input" id="v4-branch-label-${i}" maxlength="80" ${i<3?'required':''} placeholder="${i===1?'Atravessar a ponte':i===2?'Entrar na floresta':'Pedir ajuda'}"></div><div class="field"><label for="v4-branch-hint-${i}">O QUE OS JOGADORES SABEM</label><textarea class="textarea" id="v4-branch-hint-${i}" rows="2" maxlength="180" placeholder="Pista pública antes da decisão."></textarea></div><div class="field"><label for="v4-branch-consequence-${i}">CONSEQUÊNCIA PREVISTA</label><textarea class="textarea" id="v4-branch-consequence-${i}" rows="2" maxlength="260" placeholder="O que muda se este caminho for escolhido?"></textarea></div></article>`).join('')}</div><div class="notice">Cada jogador pode votar uma vez. O mestre acompanha a contagem e confirma a opção vencedora; em caso de empate, ele decide qual caminho será seguido. As consequências só são publicadas após a confirmação.</div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button type="submit" class="btn btn-primary">Publicar decisão</button></div></form>`;v4ModalShell('Criar decisão narrativa','Ofereça caminhos claros com pistas e consequências planejadas.',html)}
  function renderV4PrepModal(){if(!isMaster()||!isMasterController())return;const value=v4GameData().nextSessionPrep;const html=`<form id="v4-prep-form"><div class="field"><label for="v4-prep-text">PREPARAÇÃO DA PRÓXIMA SESSÃO</label><textarea class="textarea" id="v4-prep-text" rows="8" maxlength="5000" placeholder="Objetivo da próxima sessão, cenas a apresentar, NPCs que precisam aparecer, desafios, pistas e recompensas...">${esc(value)}</textarea></div><div class="notice">Esta preparação não aparece na interface dos jogadores, mas fica no estado compartilhado da campanha. Não escreva segredos críticos aqui; use Anotações secretas, que ficam somente neste navegador.</div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button type="submit" class="btn btn-primary">Salvar preparação</button></div></form>`;v4ModalShell('Preparar próxima sessão','Anote cenas, objetivos, NPCs e encontros pendentes para retomar rapidamente.',html)}
  function renderV4SummaryModal(){if(!isMaster()||!isMasterController())return;const current=v4GameData().lastSessionSummary||'';const html=`<form id="v4-summary-form"><div class="field"><label for="v4-summary-text">RESUMO DA SESSÃO</label><textarea class="textarea" id="v4-summary-text" rows="9" maxlength="6000" required placeholder="O que aconteceu, quais decisões foram tomadas, pistas descobertas, NPCs encontrados e quais ganchos ficaram para a próxima sessão?">${esc(current)}</textarea></div><div class="notice">O resumo será salvo na campanha e adicionado ao Diário da Crônica. Ele ficará visível a todos os participantes.</div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button type="submit" class="btn btn-primary">Salvar resumo no diário</button></div></form>`;v4ModalShell('Resumo da sessão','Registre o que aconteceu antes de preparar a próxima aventura.',html)}
  function renderV4PrivateNotesModal(){if(!isMaster())return;const key=`aethra.v4.private.${state.campaign?.id||'none'}.${currentUserId()}`,value=localStorage.getItem(key)||'';const html=`<form id="v4-private-form"><div class="notice"><strong>Somente neste dispositivo.</strong> Estas anotações ficam no armazenamento local deste navegador e não são enviadas ao Supabase nem aos jogadores. Faça backup separado se trocar de aparelho.</div><div class="field"><label for="v4-private-text">SEGREDOS DO MESTRE</label><textarea class="textarea" id="v4-private-text" rows="9" maxlength="12000">${esc(value)}</textarea></div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Fechar</button><button type="submit" class="btn btn-primary">Salvar neste dispositivo</button></div></form>`;v4ModalShell('Anotações secretas','Informações que não devem ser compartilhadas com o grupo.',html)}
  function renderV4NpcMemoryModal(){if(!isMaster()||!isMasterController())return;const relation=v4GameData().npcRelations||{},entries=STORY_NPCS.map(n=>({npc:n,rel:relation[n.id]||{trust:0,memories:[]}})),selectedId=entries.some(x=>x.npc.id===state.v4NpcSelected)?state.v4NpcSelected:entries[0]?.npc.id||'',selected=entries.find(x=>x.npc.id===selectedId),memories=selected?.rel.memories||[];state.v4NpcSelected=selectedId;const html=`<form id="v4-npc-form"><div class="field"><label for="v4-npc-id">PERSONAGEM</label><select class="select" id="v4-npc-id">${entries.map(x=>`<option value="${x.npc.id}" ${x.npc.id===selectedId?'selected':''}>${esc(x.npc.name)} · ${x.rel.trust>=40?'Aliado':x.rel.trust<=-30?'Desconfiado':'Neutro'} (${x.rel.trust||0})</option>`).join('')}</select></div><div class="field"><label for="v4-npc-trust">CONFIANÇA (-100 A +100)</label><input class="input" type="number" id="v4-npc-trust" min="-100" max="100" value="${Number(selected?.rel.trust)||0}"></div><div class="field"><label for="v4-npc-memory">LEMBRANÇA OU PROMESSA</label><textarea class="textarea" id="v4-npc-memory" maxlength="500" placeholder="Ex.: Ilyra prometeu revelar a trilha escondida quando a companhia recuperar o mapa."></textarea></div><div class="notice">A confiança e as lembranças são registros de continuidade; não concedem bônus automáticos. Elas ficam no estado compartilhado da campanha, embora a interface só as mostre ao mestre. Não registre senhas, dados pessoais ou segredos de segurança.</div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button type="submit" class="btn btn-primary">Salvar memória do NPC</button></div></form><div class="divider"></div><h3>Memórias registradas</h3>${memories.length?memories.slice(-8).reverse().map(m=>`<div class="journal-entry"><p>${esc(m.text)}</p><time>${new Date(m.at||Date.now()).toLocaleDateString('pt-BR')}</time></div>`).join(''):'<p class="panel-subtitle">Este NPC ainda não possui lembranças registradas.</p>'}`;v4ModalShell('Memória dos NPCs','Registre confiança, promessas e acontecimentos que devem influenciar encontros futuros.',html)}
  function renderV4LootModal(){if(!isMaster()||!isMasterController())return;const players=state.members.filter(m=>m.role==='player'&&m.character);const html=`<form id="v4-loot-form"><div class="field"><label for="v4-loot-player">DESTINATÁRIO</label><select class="select" id="v4-loot-player">${players.map(m=>`<option value="${esc(m.user_id)}">${esc(m.character.name)}</option>`).join('')}</select></div><div class="form-grid"><div class="field"><label for="v4-loot-coins">OURO (PO)</label><input class="input" type="number" id="v4-loot-coins" min="0" max="100000" value="0"></div><div class="field"><label for="v4-loot-qty">QUANTIDADE</label><input class="input" type="number" id="v4-loot-qty" min="0" max="99" value="1"></div></div><div class="field"><label for="v4-loot-item">ITEM OU MATERIAL</label><input class="input" id="v4-loot-item" maxlength="100" placeholder="Ex.: Fragmento de Cristal Ancestral"></div><div class="field"><label for="v4-loot-description">DESCRIÇÃO</label><textarea class="textarea" id="v4-loot-description" maxlength="400" placeholder="Origem e efeito narrativo do item."></textarea></div><div class="notice">A recompensa será adicionada ao inventário do personagem selecionado e registrada no diário.</div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button type="submit" class="btn btn-primary" ${players.length?'':'disabled'}>Entregar recompensa</button></div></form>`;v4ModalShell('Distribuir tesouro','Entregue ouro, materiais, equipamentos ou itens de missão a um aventureiro.',html)}
  function renderV4SkillTreeModal(){const member=state.member,character=member?.character?normalizeCharacter(member.character):null;if(!character)return;const ranks=skillTreeRanks(character),available=skillPointsAvailable(character);const html=`<div class="v4-skill-summary"><span class="tag gold">${available} ponto(s) disponível(is)</span><span class="muted">Nível ${character.level} · ${esc(character.class)}</span></div><div class="v4-skill-grid">${Object.entries(SKILL_TREE_BRANCHES).map(([id,b])=>`<article class="v4-skill-card"><div class="v4-skill-icon">${b.icon}</div><h3>${esc(b.name)}</h3><p>${esc(b.description)}</p><strong>${ranks[id]}/3 níveis</strong><div class="v4-skill-pips">${[1,2,3].map(i=>`<i class="${ranks[id]>=i?'filled':''}"></i>`).join('')}</div><div class="v4-skill-node-list">${b.nodes.map((node,i)=>`<div><strong>${esc(node.name)}</strong><small>${esc(node.description)}</small></div>`).join('')}</div><button class="btn btn-secondary btn-small" data-action="v4-buy-skill" data-branch="${id}" ${available>0&&ranks[id]<3?'':'disabled'}>Aprender nível ${ranks[id]+1}</button></article>`).join('')}</div><div class="notice">Você ganha 1 ponto de habilidade a cada 3 níveis completos após o nível 1. Cada trilha pode chegar ao nível 3. A escolha é permanente nesta campanha.</div>`;v4ModalShell('Árvore de habilidades','Especialize seu aventureiro em ataque, defesa ou disciplina arcana.',html)}
  function renderV4BackupModal(){if(!isMaster()||!isMasterController())return;const html=`<div class="notice"><strong>Restauração da campanha atual.</strong> O arquivo restaura narrativa, missões, mapas, encontros, inventários e dados da campanha. Fichas vinculadas às contas e anotações secretas locais não são sobrescritas; os retratos das fichas exportadas permanecem no JSON como cópia de consulta. Exporte um backup novo antes de restaurar.</div><form id="v4-backup-form"><div class="field"><label for="v4-backup-file">ARQUIVO DE BACKUP (.JSON)</label><input class="input" type="file" id="v4-backup-file" accept="application/json,.json" required></div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button type="submit" class="btn btn-danger">Restaurar campanha</button></div></form>`;v4ModalShell('Restaurar backup','Restaure narrativa, missões, encontros, inventários e exploração.',html)}
  function exportCampaignBackup(){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode exportar o backup.');
    const c=state.campaign,backup={format:'reino-de-aethra-campaign-backup',version:'4.0.0',exportedAt:new Date().toISOString(),campaign:{id:c.id,name:c.name,code:c.code,status:c.status,description:c.description||''},game_state:cloneData(c.game_state||defaultGameState()),participants:state.members.map(m=>({display_name:m.display_name,role:m.role,character:m.character?cloneData(m.character):null})),events:state.events.slice(-250).map(ev=>({event_type:ev.event_type,payload:ev.payload,created_at:ev.created_at}))};
    const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`aethra-backup-${String(c.code||c.id).replace(/[^a-z0-9-]/gi,'-')}-${new Date().toISOString().slice(0,10)}.json`;document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);toast('Backup da campanha exportado. Guarde o arquivo em local seguro.');
  }
  function savePrivateNotes(text){const key=`aethra.v4.private.${state.campaign?.id||'none'}.${currentUserId()}`;localStorage.setItem(key,String(text||'').slice(0,12000));toast('Anotações secretas salvas somente neste dispositivo.');closeModal()}
  async function applyV4Condition(targetRef,conditionId,duration,note){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode aplicar condições.');const gs=state.campaign.game_state||defaultGameState(),enc=cloneData(gs.encounter),partyState=cloneData(gs.partyState||{});if(!enc)throw new Error('Não há encontro ativo.');const [kind,id]=String(targetRef||'').split(':');if(kind==='monster'){const target=enc.enemies?.find(e=>e.id===id);if(!target||target.hp<=0)throw new Error('A criatura selecionada não está ativa.');addCombatCondition(target,conditionId,duration,note);enc.enemies=enc.enemies.map(e=>e.id===id?target:e)}else if(kind==='player'){const target=state.members.find(m=>m.user_id===id&&m.character);if(!target)throw new Error('Aventureiro não encontrado.');partyState[id]=partyState[id]||{};addCombatCondition(partyState[id],conditionId,duration,note)}else throw new Error('Alvo inválido.');enc.hp=enc.enemies?.reduce((n,e)=>n+Math.max(0,Number(e.hp)||0),0)??enc.hp;await updateGameState({encounter:enc,partyState});await createEvent('session_note',{kind:'combat',text:`Condição ${COMBAT_CONDITIONS[conditionId].name.trim()} aplicada por ${duration} turno(s).`});toast('Condição aplicada ao alvo.');
  }
  async function applyV4AreaAttack(center,radius,damage,scope,description){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode resolver ataques em área.');const gs=state.campaign.game_state||defaultGameState(),enc=cloneData(gs.encounter),partyState=cloneData(gs.partyState||{});if(!enc||enc.defeated||enc.partyDefeated)throw new Error('Não existe combate ativo.');const mapId=explorationData(gs).mapId,record=activeMapRecord(gs),tokens=mapTokens(record,gs),affected=[];
    const areaEnemies=Array.isArray(enc.enemies)&&enc.enemies.length?enc.enemies:[enc];areaEnemies.forEach(enemy=>{if(enemy.defeated||enemy.hp<=0)return;const token=tokens.find(t=>t.id===enemy.id);if(!token)return;const fp=token.footprint||{w:1,h:1},inside=footprintCells(token.position.x,token.position.y,fp).some(cell=>gridDistance(center,cell)<=radius);if(inside){const before=enemy.hp;enemy.hp=Math.max(0,enemy.hp-damage);enemy.defeated=enemy.hp<=0;affected.push(`${enemy.name}: ${Math.min(before,damage)} dano`);}});
    if(scope==='all')state.members.filter(m=>m.role==='player'&&m.character).forEach(m=>{const token=tokens.find(t=>t.id===m.user_id);if(!token)return;if(gridDistance(center,token.position)<=radius){const vitals=currentPartyVitals(m.user_id,m.character),before=vitals.hp;partyState[m.user_id]={...partyState[m.user_id],hp:Math.max(0,before-damage)};affected.push(`${m.character.name}: ${Math.min(before,damage)} dano`)}});
    if(Array.isArray(enc.enemies)&&enc.enemies.length){enc.enemies=enc.enemies.map(e=>isBossTemplate(e)?applyBossPhase(e):e);enc.hp=enc.enemies.reduce((n,e)=>n+Math.max(0,Number(e.hp)||0),0);enc.defeated=enc.enemies.every(e=>e.defeated||e.hp<=0)}else{Object.assign(enc,isBossTemplate(enc)?applyBossPhase(enc):enc);enc.defeated=Number(enc.hp)<=0}
    const livingParty=state.members.some(m=>m.role==='player'&&m.character&&Number(partyState[m.user_id]?.hp??currentPartyVitals(m.user_id,m.character).hp)>0);
    enc.partyDefeated=!livingParty;
    if(enc.defeated||enc.partyDefeated){enc.turnOrder=[];enc.turnIndex=0}
    if(!affected.length)throw new Error('Nenhum combatente foi encontrado no raio escolhido.');await updateGameState({encounter:enc,partyState});const text=`${description||'Ataque em área'} em ${String.fromCharCode(65+center.x)}${center.y+1}, raio ${radius}: ${affected.join('; ')}.`;await createEvent('session_note',{kind:'combat',text});if(enc.partyDefeated){await createEvent('party_defeated',{description:'Um ataque em área deixou todos os aventureiros sem pontos de vida.'});toast('A companhia foi derrotada pelo ataque em área.','error')}else if(enc.defeated){await awardEncounterRewards(enc);toast('As criaturas foram derrotadas pelo ataque em área.')}else toast(text);
  }
  async function grantV4Loot(userId,coins,itemName,qty,description){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode distribuir tesouro.');const member=state.members.find(m=>m.user_id===userId&&m.role==='player'&&m.character);if(!member)throw new Error('Destinatário inválido.');coins=Math.max(0,Math.min(100000,Number(coins)||0));qty=Math.max(0,Math.min(99,Number(qty)||0));itemName=String(itemName||'').trim().slice(0,100);if(!coins&&!qty)throw new Error('Informe ouro ou quantidade de um item.');if(qty&&!itemName)throw new Error('Informe o nome do item.');const gs=state.campaign.game_state||defaultGameState(),partyState=cloneData(gs.partyState||{}),old=partyState[userId]||{},inventory=Array.isArray(old.inventory)?old.inventory:normalizeCharacter(member.character).inventory;let itemId='';if(qty){itemId=itemName.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60)||`item-${Date.now()}`;const existing=inventory.find(i=>i.id===itemId);if(existing)existing.qty=(Number(existing.qty)||0)+qty;else inventory.push({id:itemId,name:itemName,kind:'quest',qty,description:String(description||'Recompensa entregue pelo mestre.').slice(0,400),rarity:'Especial',price:0})}partyState[userId]={...old,inventory,coins:Math.max(0,Number(old.coins)||0)+coins};const v4=v4GameData(gs),log=[...(v4.lootLog||[]),{id:`loot-${Date.now()}`,userId,character:member.character.name,coins,itemName,qty,description,at:new Date().toISOString()}].slice(-80);v4.lootLog=log;v4.statistics={...v4.statistics,lootDrops:(Number(v4.statistics.lootDrops)||0)+1};unlockV4Achievement(v4,'treasure-keeper','Guardião de Tesouros','A companhia recebeu sua primeira recompensa registrada.');if(v4.statistics.lootDrops>=3)unlockV4Achievement(v4,'reliquary-keeper','Guardião da Relíquia','A companhia recebeu três recompensas registradas.');applyV4Titles(partyState,[userId],v4.achievements);const journalEntries=[...(gs.journalEntries||[]),{id:`v4loot-${Date.now()}`,text:`Tesouro entregue a ${member.character.name}: ${coins} PO${qty?` e ${itemName} x${qty}`:''}.`,kind:'loot',createdAt:new Date().toISOString()}].slice(-50);await updateGameState({partyState,v4,journalEntries});await createEvent('session_note',{kind:'loot',text:`${member.character.name} recebeu ${coins} PO${qty?` e ${itemName} x${qty}`:''}.`});toast('Tesouro adicionado ao inventário.');
  }
  async function chooseV4Skill(branchId){
    const character=state.member?.character?normalizeCharacter(state.member.character):null;if(!character)throw new Error('Crie uma ficha antes de escolher habilidades.');if(!SKILL_TREE_BRANCHES[branchId])throw new Error('Trilha de habilidade inválida.');const ranks=skillTreeRanks(character);if(skillPointsAvailable(character)<1)throw new Error('Você não possui pontos de habilidade disponíveis.');if(ranks[branchId]>=3)throw new Error('Esta trilha já atingiu o nível máximo.');character.skillTree={...ranks,[branchId]:ranks[branchId]+1};
    if(state.backendReady){const {error}=await state.backend.rpc('save_my_character',{p_campaign_id:state.campaign.id,p_character:character,p_display_name:character.name});if(error)throw error;state.member={...state.member,character};state.members=state.members.map(m=>m.user_id===currentUserId()?{...m,character}:m);await refreshCloudCampaign({silent:true})}else{state.member.character=character;state.members=state.members.map(m=>m.user_id===currentUserId()?{...m,character}:m);await persistLocalCampaign()}
    state.modal='v4-skill';render();toast(`Trilha ${SKILL_TREE_BRANCHES[branchId].name} aprimorada.`);
  }
  async function restoreCampaignBackup(file){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode restaurar backups.');const raw=await file.text();let data;try{data=JSON.parse(raw)}catch{throw new Error('O arquivo não contém um JSON válido.')}if(data?.format!=='reino-de-aethra-campaign-backup'||!data.game_state||typeof data.game_state!=='object')throw new Error('Este não é um backup válido do Reino de Aethra.');if(data.campaign?.code&&state.campaign.code&&data.campaign.code!==state.campaign.code)throw new Error('O backup pertence a outra campanha. Abra a campanha correspondente antes de restaurar.');const snapshot=cloneData(data.game_state);snapshot.v4={...v4GameData(snapshot),restoredAt:new Date().toISOString(),restoredFromVersion:data.version||'anterior'};await updateGameState(snapshot,state.campaign.status);await createEvent('session_note',{kind:'backup',text:`Backup da campanha restaurado (exportado em ${data.exportedAt||'data não informada'}).`});closeModal();toast('Backup restaurado. Confira a narrativa, missões, mapa e inventários.');
  }
  function renderV4Milestones(gs){
    const v4=v4GameData(gs),stats=v4.statistics||{},achievements=v4.achievements||[];
    const defeatedSpecies=Object.entries(stats.monsterDefeats||{}).sort((a,b)=>(Number(b[1]?.count)||0)-(Number(a[1]?.count)||0)).slice(0,5);
    return `<section class="panel v4-milestones"><div class="row between"><div><div class="small-caps">Legado da companhia</div><h3>Marcos de Aethra</h3></div><span class="tag gold">${achievements.length} conquista(s)</span></div><div class="v4-milestone-stats"><div><small>Encontros vencidos</small><strong>${Number(stats.encountersWon)||0}</strong></div><div><small>Criaturas derrotadas</small><strong>${Number(stats.monstersDefeated)||0}</strong></div><div><small>Chefes derrotados</small><strong>${Number(stats.bossesDefeated)||0}</strong></div><div><small>Decisões narrativas</small><strong>${Number(stats.storyDecisions)||0}</strong></div><div><small>Espécies registradas</small><strong>${(stats.uniqueMonsterIds||[]).length}</strong></div><div><small>Recompensas</small><strong>${Number(stats.lootDrops)||0}</strong></div></div>${defeatedSpecies.length?`<div class="v4-defeat-history"><div class="small-caps">Espécies derrotadas</div>${defeatedSpecies.map(([id,item])=>`<div class="v4-defeat-row"><span>${esc(item.name||id)}</span><strong>${Number(item.count)||0}×</strong></div>`).join('')}</div>`:''}${achievements.length?`<div class="v4-achievement-list">${achievements.slice(-6).reverse().map(a=>`<span class="v4-achievement" title="${esc(a.description||'')}" ><i>✦</i><span><strong>${esc(a.title)}</strong><small>${esc(a.description||'')}</small></span></span>`).join('')}</div>`:'<p class="panel-subtitle">As conquistas da companhia aparecerão aqui conforme vocês explorarem, vencerem encontros e tomarem decisões.</p>'}</section>`;
  }
  function renderQuestPanel(gs){
    const data=narrativeState(gs);
    const active=data.quests.filter(q=>q.status==='active');
    const available=data.quests.filter(q=>q.status==='available');
    const completed=data.quests.filter(q=>q.status==='completed');
    const questCard=q=>{
      const p=questProgress(q);
      const firstPending=q.objectives.find(o=>!o.completed);
      const visibleObjectives=isMaster()||q.status==='completed'?q.objectives:q.objectives.filter(o=>o.completed||o.id===firstPending?.id);
      return `<article class="quest-card"><div class="row between"><span class="tag ${q.type==='Principal'?'gold':'green'}">${esc(q.type)}</span><span class="muted quest-progress-label">${p.done}/${p.total} objetivos</span></div><h4>${esc(q.title)}</h4><p>${esc(q.summary)}</p><div class="quest-progress"><span style="width:${p.percent}%"></span></div><div class="quest-objectives">${visibleObjectives.map(o=>`<div class="quest-objective ${o.completed?'done':''}"><span>${o.completed?'✓':'○'}</span><span>${esc(o.text)}</span></div>`).join('')}</div>${!isMaster()&&q.status==='active'&&firstPending?'<small class="hint">As próximas etapas serão reveladas conforme a companhia avançar.</small>':''}${q.status==='completed'?`<div class="quest-reward">Recompensa: ${esc(q.reward)}</div>${isMaster()&&!q.rewardClaimed&&QUEST_REWARD_PACKAGES[q.id]?`<button class="btn btn-secondary btn-small" data-action="grant-quest-reward" data-quest-id="${q.id}">Entregar recompensa à companhia</button>`:''}${q.rewardClaimed?'<span class="tag green">Recompensa entregue</span>':''}`:''}</article>`;
    };
    const availableMaster=isMaster()&&available.length?`<div class="quest-available"><div class="small-caps">Oportunidades ainda não apresentadas · somente mestre</div>${available.map(q=>`<div class="quest-mini"><strong>${esc(q.title)}</strong><small>${esc(q.summary)}</small><button class="btn btn-quiet btn-small" data-action="accept-quest" data-quest-id="${q.id}">Apresentar missão</button></div>`).join('')}</div>`:'';
    const emptyActive=`<div class="empty-state"><strong>Nenhuma missão ativa</strong><p>${isMaster()?'Apresente uma missão quando a história chegar ao momento adequado.':'Aguarde o mestre apresentar uma missão à companhia.'}</p></div>`;
    return `<section class="panel journey-panel"><div class="row between"><div><div class="small-caps">A jornada dos heróis</div><h3 style="margin:5px 0 0">${isMaster()?'Jornada e missões':'Minhas missões'}</h3><p class="panel-subtitle">${isMaster()?'Apresente missões somente quando a companhia descobrir seus ganchos.':'Aqui aparecem apenas as missões apresentadas e aceitas pela companhia, além do histórico de missões concluídas.'}</p></div>${isMaster()?'<button class="btn btn-secondary btn-small" data-action="open-adventure-manager">Gerenciar jornada</button>':''}</div>${active.length?active.map(questCard).join(''):emptyActive}${availableMaster}${completed.length?`<details class="completed-quests"><summary>Missões concluídas (${completed.length})</summary>${completed.map(questCard).join('')}</details>`:''}</section>`;
  }
  function npcPortrait(n){return n.portrait?portraitImage(n.portrait,n.name):`<span class=\"npc-fallback-art\" aria-label=\"${esc(n.name)}\">${esc(n.emoji||'✦')}</span>`}
  function renderRevealedNpcs(gs){
    const data=narrativeState(gs);const visible=STORY_NPCS.filter(n=>data.revealedNpcIds.includes(n.id));
    return `<section class="panel" style="margin-top:15px"><div class="row between"><h3>Personagens encontrados</h3><span class="tag">${visible.length}</span></div>${visible.length?`<div class="npc-list">${visible.map(n=>`<button class="npc-card" data-action="open-npc" data-npc-id="${n.id}"><span class="npc-avatar npc-avatar-art">${npcPortrait(n)}</span><span><strong>${esc(n.name)}</strong><small>${esc(n.role)} · ${esc(n.location)}${isMaster()?` · ${((v4GameData(gs).npcRelations||{})[n.id]?.trust||0)>=40?'Aliado':((v4GameData(gs).npcRelations||{})[n.id]?.trust||0)<=-30?'Desconfiado':'Neutro'}`:''}</small></span><span class="spacer"> </span><span>›</span></button>`).join('')}</div>`:'<p class="panel-subtitle">As pessoas que vocês encontrarem durante a aventura aparecerão aqui.</p>'}</section>`;
  }
  function renderJourneyLog(gs){
    const entries=narrativeState(gs).journalEntries.slice(-4).reverse();
    return `<section class="panel" style="margin-top:15px"><div class="row between"><h3>Crônica registrada</h3><span class="tag">Diário</span><button class="btn btn-secondary btn-small" data-action="open-journal">Linha do tempo completa</button></div>${entries.length?entries.map(item=>`<div class="journal-entry"><time>${new Date(item.createdAt||Date.now()).toLocaleDateString('pt-BR')}</time><p>${esc(item.text)}</p></div>`).join(''):'<p class="panel-subtitle">As descobertas e decisões importantes serão registradas neste diário.</p>'}</section>`;
  }
  function sceneArtworkFor(gs){
    const location=String(gs?.location||'').toLowerCase();
    const mapId=explorationData(gs).mapId;
    if(/drakmor|braseiro|forja|cinza|malgor/.test(location)||mapId==='drakmor-citadel')return {src:'assets/scenes/drakmor-forge.webp',label:'Forjas vulcânicas de Drakmor'};
    if(/niv[eé]ria|prism[aá]tica|arquivo|cristal|geada/.test(location)||mapId==='niveria-crystal')return {src:'assets/scenes/niveria-archive.webp',label:'Arquivos de cristal de Nivéria'};
    if(/thalassor|recife|enseada|mar[eé]|porto/.test(location)||mapId==='thalassor-reef')return {src:'assets/scenes/thalassor-harbor.webp',label:'Porto e recifes de Thalassor'};
    if(/sol[aá]ria|altar|templo solar|sol partido/.test(location)||mapId==='solaria-dais')return {src:'assets/scenes/solaria-temple.webp',label:'Templo dourado de Solária'};
    if(/torre|masmorra|ru[ií]na|pris[aã]o|caverna|umbra/.test(location)||['watchtower','umbrafunda-cavern','drakmor-lava-cave','niveria-deep-cave'].includes(mapId))return {src:'assets/scenes/ancient-ruins.webp',label:'Ruínas antigas de Aethra'};
    return {src:'assets/scenes/eldoria-village.webp',label:'Vila ancestral de Eldoria'};
  }
  function mapArtworkFor(mapId){
    const byMap={'eldoria-road':'eldoria-village','brumafolha':'eldoria-village','watchtower':'ancient-ruins','root-sanctuary':'eldoria-village','thalassor-reef':'thalassor-harbor','niveria-crystal':'niveria-archive','solaria-dais':'solaria-temple','drakmor-citadel':'drakmor-forge','umbrafunda-cavern':'ancient-ruins','drakmor-lava-cave':'drakmor-forge','niveria-deep-cave':'niveria-archive'};
    const id=byMap[mapId]||'eldoria-village';
    return `assets/scenes/${id}.webp`;
  }
  function recordDoorCount(gs,mapId){const ex=explorationData(gs),rec=ex.maps?.[mapId]||{};return (rec.markers||[]).filter(m=>m.type==='door'&&!m.boardDefault).length}
  function openMapPoi(mapId,poiId){
    const point=(mapBoardFeatures(mapId).points||[]).find(p=>p.id===poiId);if(!point)throw new Error('Ponto de interesse não encontrado neste tabuleiro.');
    const coord=`${String.fromCharCode(65+point.x)}${point.y+1}`;
    const masterNote=isMaster()&&point.gm?`<div class="notice"><strong>Orientação reservada ao mestre</strong><p>${esc(point.gm)}</p></div>`:'';
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="page-kicker">Ponto de interesse · ${esc(mapTemplate(mapId).name)}</div><h2>${point.icon} ${esc(point.name)}</h2><p>Coordenada ${coord}</p></div><button class="modal-close" data-action="close-modal">×</button></div><p class="panel-subtitle">${esc(point.description)}</p><div class="notice"><strong>O que pode ser feito</strong><p>${esc(point.interaction||'Observar o local e conversar com o mestre sobre as ações possíveis.')}</p></div>${isMaster()&&point.test?`<div class="notice"><strong>Teste sugerido · reservado ao mestre</strong><p>${esc(point.test)}</p></div>`:''}${isMaster()&&point.success?`<div class="notice"><strong>Em caso de sucesso · reservado ao mestre</strong><p>${esc(point.success)}</p></div>`:''}${isMaster()&&point.failure?`<div class="notice"><strong>Em caso de falha · reservado ao mestre</strong><p>${esc(point.failure)}</p></div>`:''}${masterNote}<div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Fechar</button></div></section></div>`;
  }
  function mapInspector(gs,tokens,selected,template){
    const enc=gs.encounter,turn=enc?activeCombatTurn(enc):null,chosen=tokens.find(t=>t.id===selected);
    const rows=tokens.map(t=>{
      const hp=t.kind==='monster'?t.hp:(()=>{const m=state.members.find(x=>x.user_id===t.id);return m?.character?currentPartyVitals(t.id,m.character).hp:null})();
      const max=t.kind==='monster'?t.maxHp:(()=>{const m=state.members.find(x=>x.user_id===t.id);return m?.character?currentPartyVitals(t.id,m.character).maxHp:null})();
      const art=mapPieceArt(t);
      const pct=max?Math.max(0,Math.min(100,hp/max*100)):0;
      return `<button class="map-piece-row ${t.id===selected?'selected':''} ${t.boss?'boss-piece-row':t.elite?'elite-piece-row':''} ${t.defeated?'defeated':''}" data-action="map-select-token" data-token-id="${esc(t.id)}"><span class="map-piece-thumb ${t.kind==='monster'?'enemy':'adventurer'}">${art}</span><span class="map-piece-copy"><strong>${esc(t.name)}</strong><small>${t.kind==='monster'?(t.defeated?'Derrotado':t.boss?'Chefe':'Criatura hostil'):'Aventureiro'} · ${String.fromCharCode(65+t.position.x)}${t.position.y+1}${t.footprint&&(t.footprint.w>1||t.footprint.h>1)?` · Base ${t.footprint.w}×${t.footprint.h}`:''}</small>${max?`<span class="map-piece-hp"><i style="width:${pct}%"></i></span><small>${hp} / ${max} HP</small>`:''}</span><span class="map-piece-mark">${t.kind==='monster'?(t.boss?'♛':t.elite?'✦':'◆'):'●'}</span></button>`;
    }).join('');
    const encounterPanel=enc?`<div class="map-inspector-combat"><div class="map-inspector-combat-top"><span class="map-status-dot ${enc.defeated?'ended':'active'}"></span><strong>${enc.defeated?'Encontro encerrado':'Combate em andamento'}</strong><span>Rodada ${enc.round||1}</span></div><div class="map-active-turn"><small>TURNO ATUAL</small><strong>${esc(turn?.name||'—')}</strong><span>${turn?.kind==='monster'?'Ação da criatura':'Ação do aventureiro'}</span></div><div class="map-inspector-counts"><span><strong>${(enc.enemies||[]).filter(e=>!e.defeated&&e.hp>0).length}</strong> inimigo(s) ativo(s)</span><span><strong>${tokens.filter(t=>t.kind==='player').length}</strong> herói(s)</span></div></div>`:`<div class="map-inspector-explore"><span class="map-inspector-icon">⌖</span><strong>Área de exploração</strong><p>O grupo está explorando <b>${esc(template.name)}</b>. O mestre pode iniciar um encontro para posicionar criaturas neste tabuleiro.</p></div>`;
    const selectedPanel=chosen?`<div class="map-selected-piece"><div class="map-selected-label">PEÇA SELECIONADA</div><strong>${esc(chosen.name)}</strong><small>${chosen.kind==='monster'?(chosen.boss?'Chefe':'Criatura'):'Aventureiro'} · Casa ${String.fromCharCode(65+chosen.position.x)}${chosen.position.y+1} · Base ${chosen.footprint?.w||1}×${chosen.footprint?.h||1}</small></div>`:'<div class="map-selected-piece muted">Selecione uma peça na lista para movê-la.</div>';
    const board=mapBoardFeatures(template.id),mapRecord=activeMapRecord(gs),poiRows=(board.points||[]).map(point=>`<button class="map-poi-row" data-action="map-poi" data-map-id="${template.id}" data-poi-id="${point.id}"><span>${point.icon}</span><span><strong>${esc(point.name)}</strong><small>Casa ${String.fromCharCode(65+point.x)}${point.y+1}</small></span><b>›</b></button>`).join('');
    const doorItems=(mapRecord.markers||[]).filter(m=>m.type==='door').map(door=>`<div class="map-door-item"><strong>🚪 ${esc(door.name||'Porta adicional')}</strong><small>Casa ${String.fromCharCode(65+door.x)}${door.y+1} · ${door.open?'Aberta':'Fechada'}</small><p>${esc(door.description||'Passagem do cenário. O mestre pode abrir ou fechar pela ferramenta de porta.')}</p></div>`).join('');
    const routes=`<div class="map-route-summary"><span>⬇ <b>Entrada:</b> ${esc(board.entry?.label||'Acesso indicado no mapa')} · Casa ${board.entry?String.fromCharCode(65+board.entry.x)+(board.entry.y+1):'—'}</span><span>⬆ <b>Saída:</b> ${esc(board.exit?.label||'Rota indicada no mapa')} · Casa ${board.exit?String.fromCharCode(65+board.exit.x)+(board.exit.y+1):'—'}</span><span>🚪 <b>Portas:</b> ${(mapRecord.markers||[]).filter(m=>m.type==='door').length}</span>${doorItems||'<small>Este cenário não possui uma porta padrão cadastrada; o mestre pode adicionar portas pela ferramenta.</small>'}</div>`;
    return `<aside class="tactical-inspector">${encounterPanel}<div class="map-inspector-section-head"><span>PEÇAS NO TABULEIRO</span><b>${tokens.length}</b></div><div class="map-piece-list">${rows||'<p class="panel-subtitle">Nenhum personagem está posicionado. Crie a ficha de um aventureiro para colocá-lo no mapa.</p>'}</div>${selectedPanel}<div class="map-inspector-section-head"><span>PONTOS DE INTERESSE</span><b>${(board.points||[]).length}</b></div><div class="map-poi-list">${poiRows||'<p class="panel-subtitle">Este cenário não possui pontos cadastrados.</p>'}</div>${routes}<div class="map-inspector-tip">${isMaster()?'Selecione uma miniatura. Use Preparar posições para distribuir peças livremente (sem turno, caminho ou bloqueios) ou Mover miniatura para respeitar as regras normais.':'Sua miniatura aparece com a base identificada; durante o seu turno, mova até uma casa livre. Toque em um ponto de interesse para ler sua descrição.'}</div></aside>`;
  }
  function renderTacticalMap(gs){
    const exploration=explorationData(gs),record=activeMapRecord(gs),template=mapTemplate(exploration.mapId),tokens=mapTokens(record,gs),mapPings=v41GameData(gs).mapPings.filter(p=>p.mapId===exploration.mapId&&Date.now()-Date.parse(p.createdAt||0)<6*60*60*1000);
    if(!isMaster()&&!record.playersVisible)return `<section class="panel tactical-map-panel map-hidden-to-players"><div class="small-caps">Campo de aventura</div><h3>Mapa tático ainda não apresentado</h3><p class="panel-subtitle">O mestre está preparando o cenário. O mapa será exibido aqui quando a companhia for convidada a entrar no tabuleiro.</p><span class="tag gold">Aguardando apresentação do mestre</span></section>`;
    if(isMaster()&&!tokens.some(t=>t.id===state.selectedMapToken))state.selectedMapToken=tokens.find(t=>t.kind==='player')?.id||tokens[0]?.id||null;
    const selected=state.selectedMapToken||currentUserId(),markers=record.markers||[],cells=[];
    const columnName=x=>String.fromCharCode(65+x),mapImageUrl=template.image?.src?(()=>{const url=new URL(template.image.src,document.baseURI);url.searchParams.set('v','4.2.2');return url.href})() : '',mapImageLayer=mapImageUrl?`<img class="map-board-background" src="${esc(mapImageUrl)}" alt="" aria-hidden="true" draggable="false" decoding="async" onload="this.parentElement.classList.add('map-image-ready')" onerror="this.hidden=true;this.parentElement.classList.add('map-image-missing')">`:'';
    for(let y=0;y<MAP_HEIGHT;y++)for(let x=0;x<MAP_WIDTH;x++){
      const tile=mapTile(template.id,x,y),info=mapTileInfo(tile),visible=mapCellVisible(x,y,record,gs,tokens),cellTokens=tokens.filter(t=>t.position.x===x&&t.position.y===y&&!t.defeated);
      const footprintToken=tokens.find(t=>t.kind==='monster'&&(t.footprint?.w>1||t.footprint?.h>1)&&tokenOccupiesCell(t,x,y)&&!(t.position.x===x&&t.position.y===y));
      const marker=markers.find(m=>m.x===x&&m.y===y&&(isMaster()||((m.type==='door'||m.type==='altar')&&visible)||m.discovered));
      const tokenHtml=cellTokens.map(t=>`<span class="map-token miniature ${t.kind==='monster'?'monster-token monster-phase-'+t.bossPhase+(t.boss?' monster-boss-token':t.elite?' monster-elite-token':'')+((t.footprint?.w>1||t.footprint?.h>1)?' monster-large-token':'')+(t.defeated?' monster-defeated':''):'player-token mini-'+t.className} ${t.id===selected?'token-selected':''}" style="${t.kind==='monster'&&(t.footprint?.w>1||t.footprint?.h>1)?`width:${88*(t.footprint?.w||1)}%;height:${94*(t.footprint?.h||1)}%;left:6%;top:2%;z-index:${t.boss?9:7}`:''}" title="${esc(t.name)} · Base ${t.footprint?.w||1}×${t.footprint?.h||1}" data-token-id="${esc(t.id)}" draggable="${isMaster()||t.kind==='player'&&t.id===currentUserId()?'true':'false'}" aria-label="${esc(t.name)} — miniatura de ${t.kind==='monster'?(t.boss?'chefe':'monstro'):'personagem'}; base ${t.footprint?.w||1} por ${t.footprint?.h||1}; arraste para mover">${mapPieceArt(t)}${t.kind==='monster'?`<span class="map-token-health"><i style="width:${Math.max(0,Math.min(100,t.hp/t.maxHp*100))}%"></i></span>`:''}<span class="miniature-sigil">${esc(t.sigil)}</span>${t.kind==='player'?`<span class="miniature-name">${esc(t.initials)}</span>`:''}</span>`).join('');
      const markerIcon=marker?(marker.type==='treasure'?'🧰':marker.type==='trap'?'⚠':marker.type==='door'?(marker.open?'🚪':'▣'):(marker.discovered?'✧':'◇')):'';
      const markerHtml=marker?`<span class="map-marker marker-${marker.type} ${marker.open?'marker-open':''}" title="${esc(marker.name|| (marker.type==='treasure'?'Baú':marker.type==='trap'?'Armadilha':marker.type==='door'?(marker.open?'Porta aberta':'Porta fechada'):'Altar antigo'))}">${markerIcon}</span>`:'';
      const features=mapBoardFeatures(template.id),poi=features.points?.find(point=>point.x===x&&point.y===y),entry=features.entry?.x===x&&features.entry?.y===y,exit=features.exit?.x===x&&features.exit?.y===y;
      const routeHtml=entry?`<span class="map-route-pin map-entry-pin" title="Entrada: ${esc(features.entry.label)}">⬇</span>`:exit?`<span class="map-route-pin map-exit-pin" title="Saída: ${esc(features.exit.label)}">⬆</span>`:'';
      const poiHtml=poi?`<span class="map-poi-pin" title="${esc(poi.name)}">${poi.icon}<small>${esc(poi.name)}</small></span>`:'';
      const ping=mapPings.find(item=>item.x===x&&item.y===y),pingIcon=ping?.type==='danger'?'⚠':ping?.type==='route'?'➜':'✦',pingHtml=ping?`<span class="v41-map-ping v41-map-ping-${esc(ping.type||'attention')}" title="${esc(ping.label||'Marca da companhia')}">${pingIcon}</span>`:'';
      const fogged=!visible,doorBlocked=marker?.type==='door'&&!marker.open,blocked=mapCellBlocked(template.id,x,y,record);
      const overlay=fogged?'<span class="map-fog-overlay" aria-hidden="true"></span>':`${routeHtml}${poiHtml}${pingHtml}${footprintToken?'<span class="boss-footprint-hint" aria-hidden="true"></span>':''}${markerHtml}${tokenHtml}`;
      cells.push(`<button class="map-cell board-map-cell tile-${info.cls} ${fogged?'fogged':''} ${cellTokens.some(t=>t.id===selected)?'token-selected':''} ${footprintToken?(footprintToken.boss?'boss-footprint-cell':'large-footprint-cell'):''} ${cellTokens.some(t=>t.footprint?.w>1||t.footprint?.h>1)?'large-anchor-cell':''} ${blocked?'blocked':''} ${doorBlocked?'door-closed':''} ${marker?.type==='altar'?'altar-cell':''}" data-action="map-cell" data-x="${x}" data-y="${y}" data-blocked="${blocked?'true':'false'}" ${fogged&&!isMaster()?'disabled':''} aria-label="Casa ${columnName(x)}${y+1}: ${fogged?'não explorada':info.name+(blocked?', bloqueada':'')}" title="${columnName(x)}${y+1} · ${visible?info.name+(blocked?' · passagem bloqueada':''):'Área desconhecida'}"><span class="map-cell-coordinate">${columnName(x)}${y+1}</span>${overlay}</button>`);
    }
    const options=tokens.map(t=>`<option value="${esc(t.id)}" ${selected===t.id?'selected':''}>${esc(t.name)}${t.kind==='monster'?' · Monstro':' · Aventureiro'}</option>`).join('');
    const presets=MAP_TEMPLATES.map(m=>`<button class="map-preset ${m.id===template.id?'active':''}" data-action="map-change" data-map-id="${m.id}" ${isMaster()?'':'disabled'}>${m.name}</button>`).join('');
    const visibilityControl=isMaster()?`<div class="map-visibility-control"><div><strong>Visibilidade para jogadores</strong><small>${record.playersVisible?'O cenário está apresentado à companhia.':'O cenário está oculto enquanto você prepara o tabuleiro.'}</small></div><button class="btn ${record.playersVisible?'btn-secondary':'btn-primary'} btn-small" data-action="toggle-map-player-visibility" ${isMasterController()?'':'disabled'}>${record.playersVisible?'Ocultar mapa dos jogadores':'Apresentar mapa aos jogadores'}</button></div>`:'';
    const tools=isMaster()?`<div class="map-admin-tools map-admin-tools-new"><label class="map-tool-select">Miniatura selecionada<select class="select" id="map-token-select">${options||'<option value="">Sem peças</option>'}</select></label><div class="map-tool-buttons"><button class="btn ${state.selectedMapTool==='move'?'btn-primary':'btn-secondary'} btn-small" data-action="map-tool" data-tool="move">Mover miniatura</button><button class="btn ${state.selectedMapTool==='setup-move'?'btn-primary':'btn-secondary'} btn-small" data-action="map-tool" data-tool="setup-move">Preparar posições · livre</button><button class="btn ${state.selectedMapTool==='reveal'?'btn-primary':'btn-secondary'} btn-small" data-action="map-tool" data-tool="reveal">Revelar área</button><button class="btn ${state.selectedMapTool==='treasure'?'btn-primary':'btn-secondary'} btn-small" data-action="map-tool" data-tool="treasure">Baú</button><button class="btn ${state.selectedMapTool==='trap'?'btn-primary':'btn-secondary'} btn-small" data-action="map-tool" data-tool="trap">Armadilha</button><button class="btn ${state.selectedMapTool==='door'?'btn-primary':'btn-secondary'} btn-small" data-action="map-tool" data-tool="door">Porta</button><button class="btn ${state.selectedMapTool==='altar'?'btn-primary':'btn-secondary'} btn-small" data-action="map-tool" data-tool="altar">Altar</button><button class="btn ${state.selectedMapTool==='ping'?'btn-primary':'btn-secondary'} btn-small" data-action="map-tool" data-tool="ping">Atenção</button><button class="btn ${state.selectedMapTool==='danger'?'btn-primary':'btn-secondary'} btn-small" data-action="map-tool" data-tool="danger">Perigo</button><button class="btn ${state.selectedMapTool==='route'?'btn-primary':'btn-secondary'} btn-small" data-action="map-tool" data-tool="route">Rota</button><button class="btn btn-quiet btn-small" data-action="v41-clear-map-pings">Limpar marcas</button><button class="btn ${state.selectedMapTool==='erase'?'btn-primary':'btn-secondary'} btn-small" data-action="map-tool" data-tool="erase">Apagar objeto</button><button class="btn btn-quiet btn-small" data-action="toggle-map-fog">${record.fogEnabled?'Desativar névoa':'Ativar névoa'}</button>${record.boardDefaultsApplied?'':`<button class="btn btn-primary btn-small" data-action="seed-map-board">Preparar portas do tabuleiro</button>`}</div><p class="map-tool-hint">Tabuleiro visto de cima: salas, corredores, passagens e áreas bloqueadas aparecem casa por casa. Use as ferramentas para posicionar portas, baús, armadilhas e altares. Use Atenção, Perigo ou Rota para destacar casas; jogadores podem enviar marcações de atenção. Arraste a miniatura ou selecione-a e toque no destino. Diagonais contam como uma casa e exigem os dois espaços laterais livres. ${record.boardDefaultsApplied?'As portas iniciais já estão gravadas na campanha.':'Clique em Preparar portas do tabuleiro uma vez para gravar as portas padrão desta região.'}</p></div>`:`<div class="notice map-player-help">Arraste sua miniatura para uma casa livre ou selecione um destino para solicitar movimento. <button class="btn btn-secondary btn-small" data-action="map-tool" data-tool="ping">Marcar atenção</button> O tabuleiro mostra salas, corredores, entradas, saídas e pontos de interesse. ${record.fogEnabled?'As áreas desconhecidas permanecem cobertas pela névoa.':'Todo o cenário está visível.'} ${record.boardDefaultsApplied?'As portas iniciais estão sincronizadas.':'O mestre precisa preparar as portas deste mapa antes que possam ser abertas.'}</div>`;
    const pendingMoves=isMaster()&&state.pendingMapMoves.length?`<div class="map-pending"><div class="small-caps">Solicitações de movimento</div>${state.pendingMapMoves.slice(-5).map(ev=>{const who=state.members.find(m=>m.user_id===ev.actor_id);return `<div class="map-request-row"><span><strong>${esc(who?.character?.name||who?.display_name||'Aventureiro')}</strong><small>Casa ${String.fromCharCode(65+Number(ev.payload?.x||0))}${Number(ev.payload?.y||0)+1}</small></span><span class="map-request-actions"><button class="btn btn-primary btn-small" data-action="approve-map-move" data-id="${ev.id}">Aprovar</button><button class="btn btn-quiet btn-small" data-action="reject-map-move" data-id="${ev.id}">Recusar</button></span></div>`}).join('')}</div>`:'';
    const pendingInteractions=isMaster()&&state.pendingMapInteractions.length?`<div class="map-pending"><div class="small-caps">Interações aguardando aprovação</div>${state.pendingMapInteractions.slice(-5).map(ev=>{const who=state.members.find(m=>m.user_id===ev.actor_id);return `<div class="map-request-row"><span><strong>${esc(who?.character?.name||who?.display_name||'Aventureiro')}</strong><small>${ev.payload?.action==='open_door'?'Deseja abrir uma porta':'Deseja examinar um altar'}</small></span><span class="map-request-actions"><button class="btn btn-primary btn-small" data-action="approve-map-interaction" data-id="${ev.id}">Aprovar</button><button class="btn btn-quiet btn-small" data-action="reject-map-interaction" data-id="${ev.id}">Recusar</button></span></div>`}).join('')}</div>`:'';
    return `<section class="panel tactical-map-panel tactical-map-v2101"><div class="tactical-map-heading"><div><div class="small-caps">CAMPO DE AVENTURA · REINO DE AETHRA</div><h3>Mapa tático</h3><p>${esc(template.subtitle)}</p></div><div class="tactical-map-heading-meta"><span>${MAP_WIDTH} × ${MAP_HEIGHT} CASAS</span><span>${tokens.length} MINIATURA(S)</span><span class="${gs.encounter&&!gs.encounter.defeated?'in-combat':''}">${gs.encounter&&!gs.encounter.defeated?'COMBATE ATIVO':'EXPLORAÇÃO'}</span></div></div>${visibilityControl}<div class="map-presets map-presets-new">${presets}</div>${tools}<div class="tactical-map-workspace"><div class="tactical-board-column"><div class="tactical-board-caption"><div><strong>PLANTA TÁTICA</strong><span>${esc(template.name)} · salas, corredores e acessos A–J / 1–8</span></div><span class="tactical-scale">VISÃO SUPERIOR</span></div><div class="map-board-wrap map-board-wrap-new"><div class="map-board-layout map-board-layout-new"><div class="map-axis map-axis-side">${Array.from({length:MAP_HEIGHT},(_,i)=>`<span>${i+1}</span>`).join('')}</div><div class="map-board board-map-grid map-${template.theme} ${gs.encounter&&!gs.encounter.defeated?'battle-active':''} ${mapImageUrl?'map-board-image':''}" data-map-id="${esc(template.id)}" style="--map-cols:${MAP_WIDTH};--map-aspect:${template.image?.width||MAP_WIDTH}/${template.image?.height||MAP_HEIGHT};${mapImageUrl?`background-image:url(\"${mapImageUrl}\")`:''}" role="grid" aria-label="Planta tática vista de cima de ${esc(template.name)}">${mapImageLayer}${cells.join('')}</div></div><div class="map-axis map-axis-bottom">${Array.from({length:MAP_WIDTH},(_,i)=>`<span>${columnName(i)}</span>`).join('')}</div></div><div class="map-legend map-legend-new"><span><i class="legend-swatch open"></i>Passagem livre</span><span><i class="legend-swatch blocked"></i>Casa bloqueada</span><span><i class="legend-swatch fog"></i>Não explorado</span><span><i class="legend-swatch adventurer"></i>Aventureiro</span><span><i class="legend-swatch enemy"></i>Criatura hostil</span><span>🚪 Porta</span><span>⬇ Entrada / ⬆ Saída</span><span>✦ Ponto de Interesse</span><span>Base grande reserva todas as casas cobertas pela estátua</span></div></div>${mapInspector(gs,tokens,selected,template)}</div>${pendingMoves}${pendingInteractions}<p class="map-footnote map-footnote-new">O tabuleiro mostra a planta superior do cenário. Cada casa tem terreno próprio; entradas, saídas, portas e pontos de interesse indicam caminhos e locais acessíveis. Arraste uma miniatura ou selecione-a e toque no destino. Bases grandes reservam todas as casas de sua dimensão (2×2, 3×2 ou 3×3); o caminho verifica a base inteira. Movimento máximo: 4 casas por turno, respeitando obstáculos, portas fechadas e peças ocupadas. Cada diagonal conta como 1 casa e só é permitida quando os dois espaços laterais do canto estão livres.</p></section>`;
  }
  function mapCellOccupied(record,gs,x,y,exceptId){return mapTokens(record,gs).some(t=>t.id!==exceptId&&tokenOccupiesCell(t,x,y))}
  function mapVisibleReveal(record,x,y){addRevealedAround(record,x,y,1)}
  async function requestMapMove(x,y){
    if(!state.backendReady)throw new Error('Para solicitar movimento de outro jogador, conecte esta campanha ao Supabase. No modo local, apenas o mestre controla o mapa.');
    const gs=state.campaign.game_state||defaultGameState(),ex=explorationData(gs),rec=activeMapRecord(gs);
    if(hasCondition(gs.partyState?.[currentUserId()]||{},'rooted'))throw new Error('Seu personagem está Enraizado e não pode se deslocar até a condição terminar.');
    if(!mapCellVisible(x,y,rec,gs))throw new Error('Esta casa ainda não foi explorada.');
    if(mapCellBlocked(ex.mapId,x,y,rec))throw new Error('Há um obstáculo ou uma porta fechada nesta casa.');
    const start=mapTokenPosition(currentUserId(),rec,ex.mapId);
    if(start.x===x&&start.y===y)throw new Error('Seu personagem já está nesta casa.');
    if(mapCellOccupied(rec,gs,x,y,currentUserId()))throw new Error('Outra peça já ocupa esta casa.');
    const token=mapTokens(rec,gs).find(item=>item.id===currentUserId()),footprint=token?.footprint||{w:1,h:1};
    const distance=mapPathDistance(ex.mapId,start,{x,y},expandedOccupied(mapTokens(rec,gs),currentUserId()),rec,footprint);
    if(!Number.isFinite(distance))throw new Error('Não existe um caminho livre até essa casa. Diagonais não atravessam cantos bloqueados.');
    if(gs.encounter){
      const turn=activeCombatTurn(gs.encounter);if(turn?.kind!=='player'||turn.user_id!==currentUserId())throw new Error('Durante o combate, você só pode solicitar movimento no seu turno.');
      const usedKey=`${gs.encounter.round||1}:${currentUserId()}`,used=Number(gs.encounter.movementUsed?.[usedKey]||0),remaining=Math.max(0,4-used);
      if(distance>remaining)throw new Error(`Movimento excede o limite. Restam ${remaining} casa(s) neste turno.`);
    }else if(distance>4)throw new Error('O deslocamento máximo por solicitação é de 4 casas.');
    const {data,error}=await state.backend.rpc('request_map_move',{p_campaign_id:state.campaign.id,p_map_id:ex.mapId,p_x:x,p_y:y});if(error)throw error;
    if(data?.id&&!state.processed.has(data.id)){state.processed.add(data.id);state.events.push(data);if(!state.pendingMapMoves.some(item=>item.id===data.id))state.pendingMapMoves.push(data);render()}
    toast('Pedido de movimento enviado ao mestre.');
  }
  async function moveMapToken(tokenId,x,y,requestId=null,requestMapId=null,freePlacement=false){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode validar movimentos.');
    if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>=MAP_WIDTH||y>=MAP_HEIGHT)throw new Error('Casa do mapa inválida.');
    const gs=state.campaign.game_state||defaultGameState(),ex=explorationData(gs),rec=activeMapRecord(gs),tile=mapTile(ex.mapId,x,y),info=mapTileInfo(tile);
    if(requestMapId&&requestMapId!==ex.mapId)throw new Error('O mapa mudou antes da aprovação. Solicite novamente no mapa atual.');
    const movingToken=mapTokens(rec,gs).find(t=>t.id===tokenId),footprint=movingToken?.footprint||{w:1,h:1};
    if(freePlacement){
      if(!movingToken)throw new Error('Miniatura não encontrada no tabuleiro.');
      if(x+Math.max(1,Number(footprint.w)||1)>MAP_WIDTH||y+Math.max(1,Number(footprint.h)||1)>MAP_HEIGHT)throw new Error('A base da miniatura precisa permanecer dentro dos limites do tabuleiro.');
      const nextRecord={...rec,tokens:{...(rec.tokens||{}),[tokenId]:{x,y}}};
      await updateGameState({exploration:setActiveMapRecord(ex,nextRecord)});
      const name=movingToken.name||'Miniatura';
      await createEvent('session_note',{kind:'map-setup-placement',text:`O mestre posicionou ${name} na casa ${String.fromCharCode(65+x)}${y+1} durante a preparação do mapa.`});
      toast(`${name} posicionada livremente.`);return;
    }
    const movingEnemy=(gs.encounter?.enemies||[]).find(e=>e.id===tokenId);if(movingEnemy&&hasCondition(movingEnemy,'rooted'))throw new Error(`${movingEnemy.name} está Enraizado e não pode se deslocar.`);
    if(movingToken?.kind==='player'&&hasCondition(gs.partyState?.[tokenId]||{},'rooted'))throw new Error('Este aventureiro está Enraizado e não pode se deslocar.');
    if(!positionFitsFootprint(ex.mapId,x,y,footprint,expandedOccupied(mapTokens(rec,gs),tokenId),rec))throw new Error(`A base ${footprint.w}×${footprint.h} não cabe nessa posição: verifique obstáculos, bordas e outras peças.`);
    const start=mapTokenPosition(tokenId,rec,ex.mapId),occupied=expandedOccupied(mapTokens(rec,gs),tokenId),distance=mapPathDistance(ex.mapId,start,{x,y},occupied,rec,footprint);
    if(!Number.isFinite(distance))throw new Error('Não existe um caminho livre até essa casa.');
    if(distance===0)throw new Error('A peça já está nesta casa.');
    let encounter=gs.encounter?cloneData(gs.encounter):null;
    if(encounter&&!encounter.defeated){
      const turn=activeCombatTurn(encounter);
      if((tokenId==='monster'||tokenId.startsWith('enemy-'))?(turn?.kind!=='monster'||turn.id!==tokenId):(turn?.kind!=='player'||turn.user_id!==tokenId))throw new Error('Durante o combate, só a peça cujo turno está ativo pode se deslocar.');
      const usedKey=`${encounter.round||1}:${tokenId}`,used=Number(encounter.movementUsed?.[usedKey]||0),remaining=Math.max(0,4-used);
      if(distance>remaining)throw new Error(`Movimento excede o limite. Restam ${remaining} casa(s) neste turno.`);
      encounter.movementUsed={...(encounter.movementUsed||{}),[usedKey]:used+distance};
    } else if(distance>4)throw new Error('O deslocamento máximo por solicitação é de 4 casas.');
    const tokens={...rec.tokens,[tokenId]:{x,y}},nextRecord={...rec,tokens};mapVisibleReveal(nextRecord,x,y);
    const partyState={...(gs.partyState||{})};let markerText='';
    if(movingToken?.kind!=='monster'){
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
    const member=state.members.find(m=>m.user_id===tokenId),enemy=(gs.encounter?.enemies||[]).find(e=>e.id===tokenId),name=enemy?.name||(tokenId==='monster'?(gs.encounter?.name||'Criatura'):(member?.character?.name||member?.display_name||'Aventureiro'));
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
    if(!rec.boardDefaultsApplied)throw new Error('O mestre precisa preparar as portas deste tabuleiro primeiro.');
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
    if(['ping','danger','route'].includes(tool)){if(isMaster())return createV41MapPing(x,y,false,tool==='danger'?'danger':tool==='route'?'route':'attention');return createV41MapPing(x,y,true,'attention')}
    if(!isMaster()){
      const targetMarker=rec.markers.find(m=>m.x===x&&m.y===y&&((m.type==='door'&&!m.open)||(m.type==='altar'&&!m.discovered)));
      if(targetMarker?.type==='door'){if(!rec.boardDefaultsApplied)throw new Error('O mestre precisa clicar em “Preparar portas do tabuleiro” antes de solicitar a abertura desta porta.');return requestMapInteraction('open_door',targetMarker)}
      if(targetMarker?.type==='altar')return requestMapInteraction('inspect_altar',targetMarker);
      return requestMapMove(x,y);
    }
    if(tool==='setup-move'){if(!state.selectedMapToken)throw new Error('Selecione uma peça antes de movê-la.');return moveMapToken(state.selectedMapToken,x,y,null,null,true)}
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
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="page-kicker">Encontro em Aethra</div><h2>${esc(npc.name)}</h2><p>${esc(npc.role)} · ${esc(npc.location)}</p></div><button class="modal-close" data-action="close-modal">×</button></div><div class="npc-modal-portrait">${npcPortrait(npc)}</div><p class="npc-description">${esc(npc.description)}</p><blockquote class="npc-quote">“${esc(npc.greeting)}”</blockquote>${isMaster()?`<div class="notice"><strong>Memória da relação:</strong> ${((v4GameData(gs).npcRelations||{})[npcId]?.trust||0)>=40?'Este NPC confia na companhia.':((v4GameData(gs).npcRelations||{})[npcId]?.trust||0)<=-30?'Este NPC desconfia da companhia.':'A relação ainda é neutra.'}<br><button class="btn btn-quiet btn-small" data-action="v4-open-npc" data-npc-id="${npcId}">Editar memória e confiança</button></div>`:''}${choices.length?`<div class="divider"></div><h3>O que deseja conversar?</h3><p class="panel-subtitle">As decisões ficam salvas na crônica e podem revelar pistas para a companhia.</p><div class="member-list">${choiceHtml}</div>`:''}<div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Fechar</button></div></section></div>`;
  }
  function renderShopModal(){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode conduzir o comércio.');
    const players=state.members.filter(m=>m.role==='player'&&m.character);if(!players.length)throw new Error('Nenhum jogador possui personagem para comprar itens.');
    const target=players.find(m=>m.user_id===state.shopTargetId)||players[0],v=currentPartyVitals(target.user_id,target.character);
    state.shopTargetId=target.user_id;
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal wide" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="page-kicker">Mercado de Aethra</div><h2>Comércio da companhia</h2><p>O mestre registra compras e vendas no estado compartilhado da campanha.</p></div><button class="modal-close" data-action="close-modal">×</button></div><div class="field"><label for="shop-customer">AVENTUREIRO</label><select class="select" id="shop-customer">${players.map(m=>`<option value="${esc(m.user_id)}" ${m.user_id===target.user_id?'selected':''}>${esc(m.character.name)} — ${esc(m.display_name||'Jogador')}</option>`).join('')}</select></div><div class="stat-grid"><div class="stat-card"><small>Ouro disponível</small><strong>${v.coins} PO</strong></div><div class="stat-card"><small>Itens na mochila</small><strong>${v.inventory.reduce((n,x)=>n+(Number(x.qty)||0),0)}</strong></div></div><h3>Mercadorias</h3><div class="member-list">${SHOP_ITEMS.map(item=>`<div class="member-row"><div class="avatar">${item.kind==='consumable'?'🧪':item.kind==='equipment'?'⚔':item.kind==='relic'?'✧':item.kind==='material'?'⚒':'🎒'}</div><div><strong>${esc(item.name)}</strong><small>${esc(item.description)}${item.rarity&&item.rarity!=='Comum'?' · '+esc(item.rarity):''}${item.requiredLevel?' · Nível '+item.requiredLevel+'+':''}${item.requiredClasses?' · '+esc(item.requiredClasses.join('/')):''}</small></div><span class="spacer"></span><span class="tag gold">${item.price} PO</span><button class="btn btn-primary btn-small" data-action="shop-buy" data-item-id="${item.id}">Comprar</button></div>`).join('')}</div><div class="divider"></div><h3>Equipamento do aventureiro</h3><div class="member-list">${(v.equipment||{}).weapon?`<div class="member-row"><strong>Arma: ${esc(v.equipment.weapon.name)}</strong><span class="spacer"></span><span class="tag">1d${v.equipment.weapon.damageDie||6} · +${equipmentBonuses(v.equipment).attack} ATQ</span><button class="btn btn-secondary btn-small" data-action="unequip-item" data-slot="weapon">Retirar</button></div>`:''}${(v.equipment||{}).armor?`<div class="member-row"><strong>Armadura: ${esc(v.equipment.armor.name)}</strong><span class="spacer"></span><span class="tag">+${(v.equipment.armor.defense||0)+rarityPower(v.equipment.armor)} DEF</span><button class="btn btn-secondary btn-small" data-action="unequip-item" data-slot="armor">Retirar</button></div>`:''}${(v.equipment||{}).shield?`<div class="member-row"><strong>Escudo: ${esc(v.equipment.shield.name)}</strong><span class="spacer"></span><span class="tag">+${(v.equipment.shield.defense||0)+rarityPower(v.equipment.shield)} DEF</span><button class="btn btn-secondary btn-small" data-action="unequip-item" data-slot="shield">Retirar</button></div>`:''}${v.inventory.filter(i=>['equipment','relic'].includes(i.kind)&&Number(i.qty)>0).map(i=>`<div class="member-row"><div><strong>${esc(i.name)}</strong><small>${i.slot==='weapon'?`Dano 1d${i.damageDie||6} · +${rarityPower(i)+(Number(i.accuracy)||0)} ataque`:`+${(i.defense||0)+rarityPower(i)} Defesa`} · ${esc(i.rarity||'Comum')}</small></div><span class="spacer"></span><span class="tag">x${i.qty}</span><button class="btn btn-primary btn-small" data-action="equip-item" data-item-id="${esc(i.id)}">Equipar</button></div>`).join('')||'<p class="panel-subtitle">Nenhum equipamento adicional na mochila.</p>'}</div><div class="divider"></div><h3>Forja de Tovin e Brann</h3><p class="panel-subtitle">Aprimoramentos custam Fragmentos de Forja e ouro. Cada nível +1 concede +5 ao atributo principal da peça, até +3. Encantamentos concedem +5 em um atributo e cada peça aceita apenas um.</p><div class="member-list">${['weapon','armor','shield'].filter(slot=>(v.equipment||{})[slot]).map(slot=>{const it=v.equipment[slot],lv=Number(it.enhancementLevel)||0;return `<div class="member-row"><div><strong>${esc(it.name)} · +${lv}</strong><small>${it.enchantment?'Encantamento: '+esc(it.enchantment):'Sem encantamento'}</small></div><span class="spacer"></span><button class="btn btn-primary btn-small" data-action="forge-upgrade" data-slot="${slot}" ${lv>=3?'disabled':''}>Aprimorar</button>${it.enchantment?'':(slot==='weapon'?`<button class="btn btn-secondary btn-small" data-action="forge-enchant" data-slot="${slot}" data-enchantment="Precisão">Precisão</button><button class="btn btn-secondary btn-small" data-action="forge-enchant" data-slot="${slot}" data-enchantment="Chama">Chama</button>`:`<button class="btn btn-secondary btn-small" data-action="forge-enchant" data-slot="${slot}" data-enchantment="Guardião">Guardião</button>`)}</div>`}).join('')||'<p class="panel-subtitle">Nenhum equipamento equipado para aprimorar.</p>'}</div><div class="notice">Aprimoramento +1/+2/+3: 1/2/3 Fragmentos e 700/1.400/2.100 PO. Encantamento: 2 Essências Arcanas e 1.200 PO. A falha não destrói itens; os custos só são cobrados quando a operação é válida.</div><div class="divider"></div><h3>Vender itens comuns</h3><div class="member-list">${v.inventory.filter(i=>!['quest','equipment','material','relic'].includes(i.kind)&&Number(i.qty)>0).map(i=>`<div class="member-row"><div><strong>${esc(i.name)}</strong><small>Quantidade: ${Number(i.qty)||0}</small></div><span class="spacer"></span><span class="tag">${Math.max(1,Math.floor((Number(i.price)||10)*.5))} PO/un.</span><button class="btn btn-secondary btn-small" data-action="shop-sell" data-item-id="${esc(i.id)}">Vender 1</button></div>`).join('')||'<p class="panel-subtitle">Nenhum item comum disponível para venda.</p>'}</div><div class="notice">Itens de missão, materiais, relíquias e equipamentos não podem ser vendidos nesta versão. O comércio é registrado pelo mestre para evitar alterações conflitantes entre jogadores.</div></section></div>`;
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
        const found=inventory.find(x=>x.id===itemId);if(!found||Number(found.qty)<=0||['quest','equipment','material','relic'].includes(found.kind))throw new Error('Este item não pode ser vendido.');const value=Math.max(1,Math.floor((Number(found.price)||10)*.5));found.qty-=1;nextCoins+=value;description=`${member.character.name} vendeu 1 ${found.name} por ${value} PO.`;
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
    else{const item=inventory.find(x=>x.id===itemId&&['equipment','relic'].includes(x.kind)&&Number(x.qty)>0);if(!item||!['weapon','armor','shield'].includes(item.slot))throw new Error('Item não equipável.');const requirement=equipmentRequirementError(item,normalizeCharacter(character));if(requirement)throw new Error(requirement);const targetSlot=item.slot;if(equipment[targetSlot]){const prior=equipment[targetSlot],existing=inventory.find(x=>x.id===prior.id);if(existing)existing.qty=(Number(existing.qty)||0)+1;else inventory.push({...prior,qty:1,kind:'equipment',slot:targetSlot});}equipment[targetSlot]={...item};item.qty-=1;note=`${character.name} equipou ${item.name}.`;}
    const baseDefense=10+attrMod(normalizeCharacter(character).attributes.destreza)+equipmentBonuses(equipment).defense;partyState[targetId]={...old,inventory,equipment,baseDefense,defense:baseDefense};const journalEntries=[...(gs.journalEntries||[]),{id:crypto.randomUUID?crypto.randomUUID():`journal-${Date.now()}`,text:note,kind:'equipment',createdAt:new Date().toISOString()}].slice(-50);await updateGameState({partyState,journalEntries});await createEvent('session_note',{kind:'equipment',text:note});renderShopModal();toast('Equipamento atualizado.');
  }

  async function forgeEquipment(slot,mode,enchantment=''){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode usar a forja.');
    if(state.shopBusy)return;state.shopBusy=true;
    try{
      const member=state.members.find(m=>m.user_id===state.shopTargetId&&m.role==='player'&&m.character);if(!member)throw new Error('Escolha um aventureiro.');
      const gs=state.campaign.game_state||defaultGameState(),partyState={...(gs.partyState||{})},old=partyState[member.user_id]||{},inv=cloneData(Array.isArray(old.inventory)?old.inventory:normalizeCharacter(member.character).inventory),eq=cloneData(old.equipment||normalizeCharacter(member.character).equipment||{}),item=eq[slot];
      if(!item)throw new Error('Equipe uma peça antes de levá-la à forja.');let coins=Math.max(0,Number(old.coins)||0),note='';
      const take=(id,n)=>{const m=inv.find(x=>x.id===id);if(!m||Number(m.qty||0)<n)throw new Error(`Material insuficiente: ${id==='fragmento-forja'?'Fragmento de Forja':'Essência Arcana'}.`);m.qty-=n;};
      if(mode==='upgrade'){
        const level=Number(item.enhancementLevel)||0;if(level>=3)throw new Error('Esta peça já alcançou o aprimoramento máximo +3.');
        const next=level+1,cost=next*700,fragments=next;
        if(coins<cost)throw new Error(`São necessárias ${cost} PO para este aprimoramento.`);take('fragmento-forja',fragments);coins-=cost;item.enhancementLevel=next;note=`${member.character.name} aprimorou ${item.name} para +${next}.`;
      }else if(mode==='enchant'){
        if(!['Precisão','Chama','Guardião'].includes(enchantment))throw new Error('Encantamento inválido.');
        if(item.enchantment)throw new Error('Esta peça já possui um encantamento.');if(enchantment==='Precisão'&&slot!=='weapon')throw new Error('Precisão só pode ser aplicada a armas.');if(enchantment==='Chama'&&slot!=='weapon')throw new Error('Chama só pode ser aplicada a armas.');if(enchantment==='Guardião'&&slot==='weapon')throw new Error('Guardião só pode ser aplicado a armaduras e escudos.');
        if(coins<1200)throw new Error('São necessárias 1.200 PO para encantar.');take('essencia-arcana',2);coins-=1200;item.enchantment=enchantment;note=`${member.character.name} aplicou o encantamento ${enchantment} em ${item.name}.`;
      }else throw new Error('Operação de forja inválida.');
      partyState[member.user_id]={...old,inventory:inv,equipment:eq,coins};const journalEntries=[...(gs.journalEntries||[]),{id:crypto.randomUUID?crypto.randomUUID():`journal-${Date.now()}`,text:note,kind:'equipment',createdAt:new Date().toISOString()}].slice(-50);
      await updateGameState({partyState,journalEntries});await createEvent('session_note',{kind:'equipment',text:note});toast('A forja concluiu o trabalho.');
    }finally{state.shopBusy=false;}renderShopModal();
  }

  function renderAdventureManagerModal(){
    const gs=state.campaign.game_state||defaultGameState();const data=narrativeState(gs);const known=new Set(data.revealedNpcIds);
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal wide adventure-manager" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="page-kicker">Ferramentas narrativas</div><h2>Gerenciar a jornada</h2><p>Altere a cena atual, acompanhe objetivos, apresente NPCs e registre decisões. O que for publicado será visível aos jogadores. Você não precisa improvisar tudo: use o roteiro abaixo como uma sequência sugerida.</p></div><button class="modal-close" data-action="close-modal">×</button></div>
      <div class="notice"><strong>Roteiro rápido do mestre:</strong> (1) leia a narração; (2) pergunte o que os jogadores fazem; (3) responda às ações; (4) peça testes somente para riscos incertos; (5) marque objetivos quando forem realmente cumpridos; (6) registre decisões importantes. A Cena Interativa é narrativa/exploração; o Mapa Tático é para posicionamento e combate.</div><h3>1. Cena e narração</h3><form id="scene-form"><div class="field"><label for="scene-template">CENA PREPARADA</label><select class="select" id="scene-template"><option value="">Manter cena atual / personalizada</option>${STORY_SCENES.map(scene=>`<option value="${scene.id}">${esc(scene.title)}</option>`).join('')}</select><span class="hint">Escolher uma cena preenche capítulo, local e uma sugestão de narração. Você pode editar o texto antes de publicar.</span></div><div class="field"><label for="scene-chapter">CAPÍTULO</label><input class="input" id="scene-chapter" maxlength=100 value="${esc(gs.chapter||'')}"></div><div class="field"><label for="scene-location">LOCAL ATUAL</label><input class="input" id="scene-location" maxlength=100 value="${esc(gs.location||'')}"></div><div class="field"><label for="scene-narration">NARRAÇÃO VISÍVEL AO GRUPO</label><textarea class="textarea" id="scene-narration" maxlength=1800 required>${esc(gs.narration||'')}</textarea></div><button class="btn btn-primary btn-small" type="submit">Publicar cena para todos</button></form>
      <div class="divider"></div><h3>2. Missões e objetivos</h3>${data.quests.map(q=>{const progress=questProgress(q);return `<article class="quest-manage-card"><div class="row between"><div><strong>${esc(q.title)}</strong><small>${esc(q.type)} · ${esc(q.status==='active'?'Em andamento':q.status==='completed'?'Concluída':'Disponível')}</small></div><span class="tag">${progress.done}/${progress.total}</span></div><p>${esc(q.summary)}</p>${q.status==='available'?`<button class="btn btn-secondary btn-small" data-action="accept-quest" data-quest-id="${q.id}">Apresentar e aceitar missão</button>`:q.objectives.map(o=>`<button class="objective-control ${o.completed?'done':''}" data-action="complete-quest-objective" data-quest-id="${q.id}" data-objective-id="${o.id}" ${o.completed||q.status==='completed'?'disabled':''}><span>${o.completed?'✓':'○'}</span>${esc(o.text)}${o.completed?' · concluído':' · marcar conclusão'}</button>`).join('')}<small class="quest-reward">Recompensa prevista: ${esc(q.reward)}</small></article>`}).join('')}
      <div class="divider"></div><h3>3. Personagens não jogáveis</h3><p class="panel-subtitle">Revele um NPC quando o grupo o encontrar. Os jogadores verão sua descrição e frase de apresentação.</p><div class="npc-reveal-grid">${STORY_NPCS.map(n=>`<div class="npc-reveal"><span class="npc-avatar npc-avatar-art">${npcPortrait(n)}</span><div><strong>${esc(n.name)}</strong><small>${esc(n.role)}</small></div>${known.has(n.id)?'<span class="tag green">Revelado</span>':`<button class="btn btn-secondary btn-small" data-action="reveal-npc" data-npc-id="${n.id}">Revelar</button>`}</div>`).join('')}</div>
      <div class="divider"></div><h3>4. Diário da campanha</h3><form id="journal-form"><div class="field"><label for="journal-text">REGISTRAR DESCOBERTA OU DECISÃO</label><textarea class="textarea" id="journal-text" maxlength=600 required placeholder="Ex.: O grupo decidiu seguir os rastros até a torre..."></textarea></div><button class="btn btn-secondary btn-small" type="submit">Adicionar ao diário</button></form>
      <div class="notice" style="margin-top:16px"><strong>Privacidade:</strong> as informações desta tela são públicas para os participantes quando salvas no estado da campanha. Não escreva aqui segredos que devam ser conhecidos apenas pelo mestre. Um módulo de notas privadas será desenvolvido separadamente.</div></section></div>`;
    const sceneSelect=$('#scene-template',modalRoot);sceneSelect?.addEventListener('change',()=>{const scene=STORY_SCENES.find(x=>x.id===sceneSelect.value);if(!scene)return;$('#scene-chapter',modalRoot).value=scene.chapter;$('#scene-location',modalRoot).value=scene.location;$('#scene-narration',modalRoot).value=scene.narration;});
  }
  function renderLobby(){
    if(!state.campaign){state.view='home';renderHome();return}
    const c=state.campaign,gs=c.game_state||defaultGameState(),mine=state.member,hasChar=!!mine?.character;
    app.innerHTML=`<div class="page-header"><div><div class="page-kicker">Salão dos aventureiros</div><h1 class="page-title">${esc(c.name)}</h1><p>${esc(c.description||'Uma nova crônica começa aqui.')} · ${c.status==='active'?'Sessão em andamento':'Aguardando o início da sessão'} · Mestre ${masterIsOnline()?'online':'offline'}</p></div><div class="row"><button class="btn btn-quiet" data-action="go-home">Início</button>${isMaster()?`<button class="btn btn-primary" data-action="start-session">${c.status==='active'?'Retomar sessão':'Iniciar sessão'} →</button>${canDeleteCurrentCampaign()?`<button class="btn btn-danger btn-small" data-action="delete-campaign" data-id="${c.id}">Excluir campanha</button>`:''}`:`<button class="btn btn-quiet btn-small" data-action="leave-campaign">Sair da campanha</button>`}</div></div>
      ${renderV41SessionRoom(gs)}<div class="campaign-layout"><div class="panel"><div class="row between"><div><div class="small-caps">Código de convite</div><div class="campaign-code" style="margin-top:8px">${esc(c.code)} <button class="icon-button" style="width:27px;height:27px;font-size:12px" data-action="copy-code" title="Copiar código">▣</button><button class="icon-button" style="width:27px;height:27px;font-size:12px" data-action="copy-invite" title="Copiar link de convite">↗</button></div></div><span class="tag ${c.status==='active'?'green':'gold'}">${c.status==='active'?'● Sessão ativa':'◷ Preparação'}</span></div><div class="divider"></div><div class="row between"><h3>Companheiros de jornada</h3><span class="muted" style="font-size:9px">${state.members.length} participante(s)</span></div><div class="member-list">${state.members.map(m=>`<div class="member-row"><div class="roster-portrait">${memberPortrait(m)}</div><div><strong>${esc(m.display_name||'Aventureiro')}</strong><small>${m.role==='master'?'Mestre da campanha':m.character?`${esc(m.character.class)} · ${esc(m.character.realm)}`:'Personagem ainda não criado'}</small></div><span class="spacer"></span><span class="tag ${memberIsOnline(m)?'green':'gold'}">${memberIsOnline(m)?'● Online':'○ Offline'}</span>${isMaster()&&isMasterController()&&m.role==='player'?`<button class="btn btn-danger btn-small member-remove-btn" data-action="remove-participant" data-user-id="${esc(m.user_id)}">Remover</button>`:''}</div>`).join('')||'<div class="empty-state"><strong>Aguardando aventureiros</strong><p>Compartilhe o código para convidar seus amigos.</p></div>'}</div><div class="divider"></div><div class="row between"><div><h3 style="margin:0 0 5px">Sua ficha</h3><p class="panel-subtitle" style="margin:0">${hasChar?`${esc(mine.character.name)} · ${esc(mine.character.race)} · ${esc(mine.character.class)}`:'Crie seu personagem para entrar na aventura.'}</p></div><button class="btn ${hasChar?'btn-secondary':'btn-primary'} btn-small" data-action="create-character">${hasChar?'Editar ficha':'Criar personagem'}</button></div></div>
      <aside class="panel"><div class="page-kicker">Próximo capítulo</div><h3>${esc(gs.chapter||'A primeira profecia')}</h3><p class="panel-subtitle">${esc(gs.location||'Local ainda não definido')}</p><div class="divider"></div><div class="row between"><span class="muted" style="font-size:10px">Estado da crônica</span><strong style="font-size:10px;color:#e6d5ad">${c.status==='active'?'Em andamento':'Pausada'}</strong></div><div class="divider"></div><p class="panel-subtitle">${isMaster()?'Como mestre, você controla o início da sessão, os encontros e a narrativa.':'Quando o mestre iniciar a sessão, você poderá acompanhar a aventura por aqui.'}</p>${isMaster()?`<button class="btn btn-secondary" style="width:100%" data-action="open-master-guide">Abrir guia do mestre</button>`:`<div class="notice">Aguarde o mestre iniciar a sessão. Sua ficha fica salva mesmo quando todos saírem.</div>`}</aside></div>`;
  }
  const WORLD_PLACES = [
    {id:'inn',name:'Taverna do Carvalho Antigo',kind:'Taverna',icon:'🍺',maps:['brumafolha','eldoria-road'],description:'O cheiro de pão quente e madeira úmida acompanha as conversas. Viajantes deixam rumores sobre trilhas fechadas e luzes entre as copas.',clue:'Um mercador ouviu uivos vindos da velha torre depois do anoitecer.'},
    {id:'forge',name:'Oficina do Ferreiro',kind:'Oficina',icon:'⚒️',maps:['brumafolha','drakmor-citadel'],description:'Ferramentas, bigornas e armas em reparo ocupam o espaço. O calor da forja torna o ambiente acolhedor mesmo nos dias frios.',clue:'Uma marca antiga no metal parece corresponder a símbolos encontrados nas relíquias.'},
    {id:'market',name:'Mercado da Praça',kind:'Comércio',icon:'🧺',maps:['brumafolha','thalassor-reef'],description:'Bancas oferecem rações, cordas, poções e objetos trazidos de terras distantes.',clue:'Um comerciante oferece uma recompensa por notícias de uma carga desaparecida.'},
    {id:'sanctuary',name:'Santuário das Raízes',kind:'Templo',icon:'🌿',maps:['root-sanctuary','eldoria-road'],description:'Raízes antigas envolvem pedras cobertas por inscrições. O ar parece vibrar com uma oração muito antiga.',clue:'As inscrições descrevem cinco luzes que devem permanecer em equilíbrio.'},
    {id:'archive',name:'Biblioteca de Cristal',kind:'Biblioteca',icon:'📚',maps:['niveria-crystal'],description:'Prateleiras de gelo translúcido preservam mapas, diários e memórias cristalizadas.',clue:'Um registro menciona uma passagem que só aparece quando três cristais recebem luz.'},
    {id:'harbor',name:'Cais das Marés',kind:'Porto',icon:'⚓',maps:['thalassor-reef'],description:'Marinheiros descarregam mercadorias enquanto as ondas batem nas estacas do cais.',clue:'Uma embarcação retornou sem tripulação, mas com as velas intactas.'},
    {id:'temple',name:'Templo do Sol Partido',kind:'Templo',icon:'☀️',maps:['solaria-dais'],description:'Colunas douradas projetam sombras longas sobre mosaicos de eclipses e constelações.',clue:'O mosaico central mostra uma coroa dividida em cinco partes.'},
    {id:'oathforge',name:'Forja dos Juramentos',kind:'Local histórico',icon:'🔥',maps:['drakmor-citadel'],description:'Uma fornalha monumental permanece apagada desde a Guerra da Ruptura. Runas cobrem o piso de basalto.',clue:'A forja pode ser despertada com a Marca do Primeiro Fogo.'},
    {id:'ruins',name:'Ruínas da Torre dos Vigias',kind:'Exploração',icon:'🏚️',maps:['watchtower'],description:'Colunas partidas e corredores tomados por raízes escondem sinais de uma batalha antiga.',clue:'Pegadas recentes terminam diante de uma parede sem porta aparente.'},
    {id:'umbrafunda',name:'Ninho de Umbrafunda',kind:'Caverna',icon:'🕷️',maps:['umbrafunda-cavern'],description:'Uma rede de túneis úmidos atravessa a rocha. Teias grossas cobrem antigas passagens.',clue:'Marcas de quitina e restos de presas indicam a presença de aranhas gigantes.'},
    {id:'ember-grotto',name:'Gruta das Brasas',kind:'Caverna vulcânica',icon:'🔥',maps:['drakmor-lava-cave'],description:'Fendas incandescentes iluminam túneis de basalto e poças de magma.',clue:'Pegadas queimadas seguem até uma câmara onde criaturas ígneas se abrigam.'},
    {id:'crystal-abyss',name:'Abismo de Cristal',kind:'Caverna glacial',icon:'❄️',maps:['niveria-deep-cave'],description:'Uma caverna profunda, coberta por cristais que refletem a luz azulada.',clue:'O gelo preserva marcas de uma criatura que se move sob a superfície.'}
  ];
  const WORLD_EVENTS = [
    {title:'Caravana em apuros',text:'Uma carroça tombou na estrada. O condutor pede ajuda para recuperar os suprimentos antes que a noite chegue.',choice:'Ajudar pode render um favor e suprimentos; ignorar deixa a caravana vulnerável.'},
    {title:'Rumores na taverna',text:'Dois viajantes discutem sobre uma criatura que aparece perto das ruínas quando o sino toca.',choice:'Conversar pode revelar uma pista sobre uma missão regional.'},
    {title:'Sinal no céu',text:'Uma luz colorida cruza o horizonte e desaparece na direção de uma região distante.',choice:'A companhia pode investigar o fenômeno ou seguir o objetivo atual.'},
    {title:'Mercador itinerante',text:'Um mercador oferece ferramentas, rações e um objeto antigo de procedência incerta.',choice:'O mestre pode abrir o comércio e decidir quais itens estão disponíveis.'},
    {title:'Trilha bloqueada',text:'Uma queda de pedras bloqueia o caminho. Há marcas recentes entre os escombros.',choice:'Um teste de Força, Destreza ou investigação pode abrir uma rota alternativa.'},
    {title:'Pedido de socorro',text:'Um chamado distante ecoa pelo ambiente. Alguém parece estar preso ou sendo perseguido.',choice:'Ajudar pode iniciar uma missão secundária; o mestre decide a consequência.'}
  ];
  function worldMapKey(gs){return explorationData(gs).mapId||'eldoria-road'}
  function worldPlaceList(gs){const map=worldMapKey(gs),all=WORLD_PLACES.filter(p=>p.maps.includes(map));if(isMaster())return all;const shown=new Set(gs.worldExploration?.presentedPlaces||[]);return all.filter(p=>shown.has(p.id));}
  const WORLD_SCENE_OBJECTS={
    'eldoria-road':[{id:'old-gate',name:'Portão coberto de hera',kind:'door',x:1,y:1,icon:'🚪',detail:'A madeira antiga range sob as raízes. Há marcas recentes na fechadura.'},{id:'road-chest',name:'Baú de viajante',kind:'chest',x:4,y:2,icon:'🧰',detail:'Um pequeno baú está escondido sob a lona rasgada de uma carroça.'},{id:'root-rune',name:'Runa de passagem',kind:'mechanism',x:3,y:3,icon:'ᚱ',detail:'A runa pulsa suavemente quando alguém se aproxima.'}],
    brumafolha:[{id:'inn-door',name:'Porta da taverna',kind:'door',x:1,y:1,icon:'🚪',detail:'Vozes e música escapam pelas frestas.'},{id:'market-crate',name:'Caixa de mercadorias',kind:'chest',x:4,y:2,icon:'📦',detail:'A caixa tem um selo comercial parcialmente apagado.'},{id:'village-bell',name:'Sino da praça',kind:'mechanism',x:3,y:3,icon:'🔔',detail:'O sino parece ligado a um antigo sistema de alerta.'}],
    watchtower:[{id:'tower-door',name:'Entrada da torre',kind:'door',x:1,y:1,icon:'🚪',detail:'A porta está presa por pedras e raízes.'},{id:'watch-cache',name:'Esconderijo do vigia',kind:'chest',x:4,y:2,icon:'🧰',detail:'Um compartimento de pedra guarda algo deixado às pressas.'},{id:'signal-lever',name:'Alavanca do sinal',kind:'mechanism',x:3,y:3,icon:'⚙️',detail:'O mecanismo pode reativar o antigo sinal da torre.'}],
    'root-sanctuary':[{id:'sanctuary-seal',name:'Selo das raízes',kind:'door',x:1,y:1,icon:'🌿',detail:'Raízes entrelaçadas bloqueiam o arco de pedra.'},{id:'root-offering',name:'Arca de oferendas',kind:'chest',x:4,y:2,icon:'🧰',detail:'A arca contém inscrições sobre as cinco forças.'},{id:'living-stone',name:'Pedra viva',kind:'mechanism',x:3,y:3,icon:'✧',detail:'A pedra reage à presença de criaturas vivas.'}],
    'thalassor-reef':[{id:'reef-hatch',name:'Escotilha submersa',kind:'door',x:1,y:1,icon:'🚪',detail:'A escotilha está coberta por coral e sal.'},{id:'sailor-cache',name:'Baú do marinheiro',kind:'chest',x:4,y:2,icon:'🧰',detail:'O baú está preso entre duas rochas.'},{id:'tide-wheel',name:'Roda das marés',kind:'mechanism',x:3,y:3,icon:'⚙️',detail:'A roda controla uma comporta antiga.'}],
    'niveria-crystal':[{id:'archive-door',name:'Porta do arquivo',kind:'door',x:1,y:1,icon:'🚪',detail:'Uma camada de gelo cobre o mecanismo de abertura.'},{id:'frozen-case',name:'Estojo congelado',kind:'chest',x:4,y:2,icon:'🧰',detail:'Há documentos preservados sob o cristal.'},{id:'prism-node',name:'Núcleo prismático',kind:'mechanism',x:3,y:3,icon:'💠',detail:'O núcleo refrata a luz em três direções.'}],
    'solaria-dais':[{id:'sun-gate',name:'Portão solar',kind:'door',x:1,y:1,icon:'🚪',detail:'O portão só responde quando a luz alcança os mosaicos.'},{id:'sun-reliquary',name:'Relicário lateral',kind:'chest',x:4,y:2,icon:'🧰',detail:'O relicário tem o selo de um antigo guardião.'},{id:'eclipse-dial',name:'Disco do eclipse',kind:'mechanism',x:3,y:3,icon:'☀️',detail:'O disco pode alinhar as sombras do templo.'}],
    'drakmor-citadel':[{id:'forge-gate',name:'Portão de basalto',kind:'door',x:1,y:1,icon:'🚪',detail:'O portão está aquecido e marcado por golpes recentes.'},{id:'smith-cache',name:'Cofre do ferreiro',kind:'chest',x:4,y:2,icon:'🧰',detail:'Um cofre de ferramentas permanece sob a bigorna.'},{id:'oath-anvil',name:'Bigorna dos juramentos',kind:'mechanism',x:3,y:3,icon:'⚒️',detail:'As runas da bigorna ainda guardam calor arcano.'}],
    'umbrafunda-cavern':[{id:'web-pit',name:'Poço de teias',kind:'mechanism',x:4,y:3,icon:'🕸️',detail:'Fios grossos descem para uma fenda escura.'},{id:'shed-shell',name:'Carapaça abandonada',kind:'chest',x:2,y:5,icon:'🧰',detail:'Uma carapaça vazia guarda pequenos objetos presos sob ela.'}],
    'drakmor-lava-cave':[{id:'lava-bridge',name:'Ponte de basalto',kind:'mechanism',x:4,y:4,icon:'🌋',detail:'A ponte estreita cruza um veio de lava.'},{id:'ash-cache',name:'Depósito de cinzas',kind:'chest',x:2,y:5,icon:'🧰',detail:'Uma caixa metálica está meio enterrada nas cinzas.'}],
    'niveria-deep-cave':[{id:'crystal-node',name:'Núcleo de cristal',kind:'mechanism',x:4,y:3,icon:'💠',detail:'O cristal pulsa sob a camada de gelo.'},{id:'frozen-cache',name:'Baú congelado',kind:'chest',x:2,y:5,icon:'🧰',detail:'Um baú está preso em uma coluna de gelo.'}]
  };
  const WORLD_NPC_ROUTINES={ilyra:['Santuário das Raízes','Praça de Brumafolha','Trilha da floresta'],tovin:['Mercado da Praça','Taverna do Carvalho Antigo','Estrada de Eldoria'],maera:['Cais das Marés','Enseada do Sal','Convés do navio'],vaelis:['Biblioteca de Cristal','Galeria Prismática','Arquivo inferior'],asha:['Templo do Sol Partido','Pátio das Colunas','Altar do Sol Partido'],brann:['Forja dos Juramentos','Oficina do Ferreiro','Cidadela de Braseiro']};
  function worldSceneObjects(map){return WORLD_SCENE_OBJECTS[map]||WORLD_SCENE_OBJECTS['eldoria-road'];}
  function renderWorldExplorer(gs){
    const map=worldMapKey(gs),places=worldPlaceList(gs),world=gs.worldExploration||{},found=world.discovered||{},presented=new Set(world.presentedPlaces||[]),visibleNpcs=STORY_NPCS.filter(n=>narrativeState(gs).revealedNpcIds.includes(n.id));
    const position=world.positions?.[map]||{x:2,y:2},objects=worldSceneObjects(map),objectStates=world.objectStates||{};
    const objectCards=objects.map(o=>{const status=objectStates[o.id]||{};if(!isMaster()&&status.hiddenFromPlayers)return '';const label=o.kind==='door'?(status.open?'Aberta':'Fechada'):o.kind==='chest'?(status.opened?'Aberto':'Fechado'):(status.active?'Ativado':'Inativo');const objectButton=`<button class="world-object ${status.open||status.opened||status.active?'used':''}" data-action="${isMaster()?'world-interact':'world-object-request'}" data-object-id="${o.id}"><span>${o.icon}</span><strong>${esc(o.name)}</strong><small>${label} · ${esc(o.kind==='door'?'Porta':o.kind==='chest'?'Baú':'Mecanismo')}</small></button>`;return isMaster()?`<div class="world-object-row">${objectButton}<button class="world-object-visibility" data-action="toggle-world-object-visibility" data-object-id="${o.id}" title="${status.hiddenFromPlayers?'Apresentar objeto aos jogadores':'Ocultar objeto dos jogadores'}">${status.hiddenFromPlayers?'Mostrar':'Ocultar'}</button></div>`:objectButton}).join('');
    const sceneCells=Array.from({length:20},(_,i)=>{const x=i%5,y=Math.floor(i/5),isParty=position.x===x&&position.y===y,object=objects.find(o=>o.x===x&&o.y===y&&(isMaster()||!objectStates[o.id]?.hiddenFromPlayers));return `<div class="world-scene-cell ${isParty?'party-here':''} ${object?'has-object':''}">${isParty?'<span class="world-party-token">✦</span>':object?`<span class="world-scene-glyph">${object.icon}</span>`:'<span class="world-scene-ground">·</span>'}<small>${x+1}.${y+1}</small></div>`}).join('');
    const movement=isMaster()&&isMasterController()?`<div class="world-movement-controls"><span class="small-caps">Mover companhia</span><div class="world-move-pad"><button data-action="world-move" data-dx="0" data-dy="-1" aria-label="Norte">↑</button><button data-action="world-move" data-dx="-1" data-dy="0" aria-label="Oeste">←</button><button data-action="world-move" data-dx="0" data-dy="1" aria-label="Sul">↓</button><button data-action="world-move" data-dx="1" data-dy="0" aria-label="Leste">→</button></div><small>O deslocamento é narrativo; use o mapa tático para movimento durante combates.</small></div>`:'<p class="hint">O mestre conduz o deslocamento da companhia nesta cena.</p>';
    const npcCards=visibleNpcs.map(n=>{const routine=WORLD_NPC_ROUTINES[n.id]||[n.location];const place=routine[(Number(gs.turn||1)-1)%routine.length];return `<button class="world-npc" data-action="open-npc" data-npc-id="${n.id}"><span class="world-npc-avatar">${npcPortrait(n)}</span><span><strong>${esc(n.name)}</strong><small>${esc(n.role)} · ${esc(place)}</small></span><b>Conversar ↗</b></button>`}).join('');
    const placeCards=places.map(p=>`<button class="world-place ${found[p.id]?'visited':''}" data-action="open-world-place" data-place-id="${p.id}"><span class="world-place-icon">${p.icon}</span><span><strong>${esc(p.name)}</strong><small>${esc(p.kind)} · ${found[p.id]?'Visitado':isMaster()?(presented.has(p.id)?'Apresentado':'Oculto'):'Conhecido'}</small></span><b>›</b></button>`).join('');
    const pendingWorld= isMaster()&&state.pendingWorldInteractions.length?`<div class="world-pending-requests"><div class="small-caps">Solicitações de interação</div>${state.pendingWorldInteractions.slice(-6).map(ev=>{const m=state.members.find(x=>x.user_id===ev.actor_id),o=objects.find(x=>x.id===ev.payload?.object_id);return `<div class="map-request-row"><span><strong>${esc(m?.character?.name||m?.display_name||ev.payload?.player_name||'Aventureiro')}</strong><small>${esc(o?.name||'Objeto da cena')} · deseja interagir</small></span><span class="map-request-actions"><button class="btn btn-primary btn-small" data-action="approve-world-interaction" data-id="${ev.id}">Resolver</button><button class="btn btn-quiet btn-small" data-action="reject-world-interaction" data-id="${ev.id}">Recusar</button></span></div>`}).join('')}</div>`:'';
    const event=world.activeEvent,sceneMap=mapTemplate(map);
    const travel=isMaster()?`<div class="world-travel"><span class="small-caps">Viajar para outra região</span><div class="world-travel-list">${MAP_TEMPLATES.map(m=>`<button class="btn btn-quiet btn-small" data-action="world-travel" data-map-id="${m.id}" ${m.id===map?'disabled':''}>${esc(m.name)}</button>`).join('')}</div></div>`:'';
    return `<section class="panel world-explorer"><div class="row between"><div><div class="small-caps">Aethra · exploração</div><h3 style="margin:5px 0 0">Cena interativa</h3></div><span class="tag gold">${places.length} pontos</span></div><p class="panel-subtitle">A companhia pode investigar o cenário, interagir com objetos e encontrar personagens em diferentes locais.</p><div class="world-region-art"><img src="${mapArtworkFor(map)}" alt="${esc(sceneMap.name)}" loading="lazy"><div><span class="small-caps">Território atual</span><strong>${esc(sceneMap.name)}</strong><small>${esc(sceneMap.subtitle)}</small></div></div><div class="world-scene-layout"><div class="world-scene-board"><div class="world-scene-grid">${sceneCells}</div><div class="world-scene-legend"><span>✦ Companhia</span><span>Objetos interativos</span></div></div><div class="world-scene-side"><strong>Deslocamento</strong>${movement}<div class="world-object-list">${objectCards}</div></div></div><div class="world-subsection"><div class="row between"><strong>${isMaster()?'Locais da região':'Locais conhecidos'}</strong><span class="tag">${places.length}</span></div><div class="world-place-grid">${placeCards||'<p class="panel-subtitle">Não há pontos de interesse cadastrados neste mapa.</p>'}</div></div>${pendingWorld}${npcCards?`<div class="world-subsection"><div class="row between"><strong>NPCs e rotinas da cena</strong><span class="tag">${visibleNpcs.length}</span></div><div class="world-npc-list">${npcCards}</div></div>`:''}${event?`<div class="world-event-card"><div class="small-caps">Acontecimento em andamento</div><h4>${esc(event.title)}</h4><p>${esc(event.text)}</p><small>${esc(event.choice||'O mestre decide como a companhia reage.')}</small></div>`:''}${isMaster()?`<div class="world-master-tools"><button class="btn btn-secondary btn-small" data-action="world-random-event">✦ Gerar evento de viagem</button><button class="btn btn-quiet btn-small" data-action="world-clear-event" ${event?'':'disabled'}>Encerrar evento</button></div>`:''}${travel}</section>`;
  }
  async function moveWorldParty(dx,dy){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode conduzir o deslocamento da cena.');
    const gs=state.campaign.game_state||defaultGameState(),map=worldMapKey(gs),world=cloneData(gs.worldExploration||{});world.positions=world.positions||{};const current=world.positions[map]||{x:2,y:2};const next={x:Math.max(0,Math.min(4,current.x+dx)),y:Math.max(0,Math.min(3,current.y+dy))};if(next.x===current.x&&next.y===current.y)return;
    world.positions[map]=next;await updateGameState({worldExploration:world});
  }
  async function interactWorldObject(objectId,requestId=null){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode resolver interações do cenário.');
    const map=worldMapKey(),object=worldSceneObjects(map).find(o=>o.id===objectId);if(!object)throw new Error('Objeto não encontrado nesta região.');
    const gs=state.campaign.game_state||defaultGameState(),world=cloneData(gs.worldExploration||{});world.objectStates=world.objectStates||{};const status=world.objectStates[objectId]||{};
    if(object.kind==='door'){status.open=!status.open;}else if(object.kind==='chest'){if(status.opened)throw new Error('Este baú já foi aberto.');status.opened=true;}else{status.active=!status.active;}
    world.objectStates[objectId]=status;const result=object.kind==='door'?(status.open?'abriu':'fechou'):object.kind==='chest'?'abriu':(status.active?'ativou':'desativou');
    const note=`A companhia ${result} ${object.name}. ${object.detail}`;const data=narrativeState(gs);data.journalEntries=[...data.journalEntries,{id:crypto.randomUUID?crypto.randomUUID():`journal-${Date.now()}`,text:note,kind:'exploration',createdAt:new Date().toISOString()}].slice(-50);
    await updateGameState({worldExploration:world,journalEntries:data.journalEntries});await createEvent('session_note',{kind:requestId?'world-interaction':'exploration-object',request_id:requestId||undefined,accepted:true,text:note,object_id:objectId});toast(`Interação registrada: ${object.name}.`);
  }
  function openWorldPlace(placeId){
    const place=WORLD_PLACES.find(p=>p.id===placeId);if(!place)throw new Error('Ponto de interesse não encontrado.');
    const gs=state.campaign.game_state||defaultGameState(),world=gs.worldExploration||{},visited=!!world.discovered?.[place.id],presented=(world.presentedPlaces||[]).includes(place.id);
    if(!isMaster()&&!presented)throw new Error('Este local ainda não foi apresentado à companhia.');
    const clue=isMaster()||visited?`<div class="notice"><strong>${visited?'Descoberta registrada':'Possível descoberta · reservado ao mestre'}</strong><p>${esc(place.clue)}</p></div>`:'';
    const controls=isMaster()&&isMasterController()?`<div class="modal-actions"><button class="btn ${presented?'btn-secondary':'btn-primary'}" data-action="toggle-world-place-presentation" data-place-id="${place.id}">${presented?'Ocultar dos jogadores':'Apresentar aos jogadores'}</button>${!visited?`<button class="btn btn-quiet" data-action="discover-world-place" data-place-id="${place.id}">Registrar visita</button>`:''}</div>`:'';
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="page-kicker">${esc(place.kind)} · ponto de interesse</div><h2>${place.icon} ${esc(place.name)}</h2><p>${esc(gs.location||'Aethra')}</p></div><button class="modal-close" data-action="close-modal">×</button></div><p class="panel-subtitle">${esc(place.description)}</p>${clue}${visited?'<span class="tag green">Visitado pela companhia</span>':''}${controls}</section></div>`;
  }
  async function toggleWorldObjectVisibility(objectId){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode alterar a visibilidade de objetos.');
    const map=worldMapKey(state.campaign.game_state||defaultGameState()),object=worldSceneObjects(map).find(o=>o.id===objectId);if(!object)throw new Error('Objeto não encontrado nesta região.');
    const gs=state.campaign.game_state||defaultGameState(),world=cloneData(gs.worldExploration||{});world.objectStates=world.objectStates||{};const current=world.objectStates[objectId]||{};const hidden=!current.hiddenFromPlayers;
    world.objectStates[objectId]={...current,hiddenFromPlayers:hidden};await updateGameState({worldExploration:world});
    toast(hidden?`${object.name} ocultado dos jogadores.`:`${object.name} apresentado aos jogadores.`);render();
  }
  async function toggleWorldPlacePresentation(placeId){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode apresentar locais.');
    const place=WORLD_PLACES.find(p=>p.id===placeId);if(!place)throw new Error('Local não encontrado.');
    const gs=state.campaign.game_state||defaultGameState(),world=cloneData(gs.worldExploration||{});world.presentedPlaces=Array.isArray(world.presentedPlaces)?world.presentedPlaces:[];
    const show=!world.presentedPlaces.includes(placeId);
    world.presentedPlaces=show?[...world.presentedPlaces,placeId]:world.presentedPlaces.filter(id=>id!==placeId);
    await updateGameState({worldExploration:world});await createEvent('session_note',{kind:'place-visibility',text:`O mestre ${show?'apresentou':'ocultou'} o local ${place.name}.`});
    openWorldPlace(placeId);toast(show?'Local apresentado aos jogadores.':'Local ocultado dos jogadores.');
  }
  async function requestWorldObjectInteraction(objectId){
    if(!state.backendReady)throw new Error('Solicitações compartilhadas exigem uma campanha conectada ao Supabase.');
    const map=worldMapKey(state.campaign.game_state||defaultGameState()),object=worldSceneObjects(map).find(o=>o.id===objectId);if(!object)throw new Error('Objeto não encontrado nesta região.');
    const {data,error}=await state.backend.rpc('submit_campaign_event',{p_campaign_id:state.campaign.id,p_event_type:'world_interaction_request',p_payload:{map_id:map,object_id:objectId,action:'interact'}});if(error)throw error;
    if(data?.id&&!state.processed.has(data.id)){state.processed.add(data.id);state.events.push(data);state.pendingWorldInteractions.push(data);render();}
    toast(`Pedido para interagir com ${object.name} enviado ao mestre.`);
  }
  async function resolveWorldInteraction(ev,accepted){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode resolver interações da cena.');
    const objectId=ev.payload?.object_id;const object=worldSceneObjects(worldMapKey(state.campaign.game_state||defaultGameState())).find(o=>o.id===objectId);
    let text='O mestre recusou a interação.';
    if(accepted&&object){await interactWorldObject(objectId,ev.id);text=`O mestre resolveu a interação com ${object.name}.`;}
    else accepted=false;
    if(!accepted)await createEvent('session_note',{kind:'world-interaction',request_id:ev.id,accepted:false,text});
    state.pendingWorldInteractions=state.pendingWorldInteractions.filter(item=>item.id!==ev.id);render();toast(text,accepted?'ok':'error');
  }
  async function discoverWorldPlace(placeId){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode registrar descobertas.');
    const place=WORLD_PLACES.find(p=>p.id===placeId);if(!place)throw new Error('Ponto de interesse não encontrado.');
    const gs=state.campaign.game_state||defaultGameState(),world=cloneData(gs.worldExploration||{discovered:{},history:[]});world.discovered=world.discovered||{};if(world.discovered[placeId])throw new Error('Esta descoberta já foi registrada.');
    world.discovered[placeId]=true;world.presentedPlaces=Array.isArray(world.presentedPlaces)?world.presentedPlaces:[];if(!world.presentedPlaces.includes(placeId))world.presentedPlaces.push(placeId);world.history=[...(world.history||[]),{id:crypto.randomUUID?crypto.randomUUID():`world-${Date.now()}`,placeId,title:place.name,at:new Date().toISOString()}].slice(-60);
    const note=`A companhia descobriu o local: ${place.name}.`;const masterNote=`Pista reservada de ${place.name}: ${place.clue}`;const data=narrativeState(gs);data.journalEntries=[...data.journalEntries,{id:crypto.randomUUID?crypto.randomUUID():`journal-${Date.now()}`,text:note,kind:'discovery',createdAt:new Date().toISOString(),visibility:'public'}].slice(-50);world.masterDiscoveryNotes={...(world.masterDiscoveryNotes||{}),[placeId]:masterNote};
    await updateGameState({worldExploration:world,journalEntries:data.journalEntries});await createEvent('session_note',{kind:'discovery',visibility:'public',text:note,place_id:placeId});closeModal();toast('Descoberta registrada no diário da campanha.');
  }
  async function generateWorldEvent(){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode gerar acontecimentos.');
    const gs=state.campaign.game_state||defaultGameState(),world=cloneData(gs.worldExploration||{discovered:{},history:[]});const pool=WORLD_EVENTS.filter(e=>e.title!==world.activeEvent?.title);const event=pool[Math.floor(Math.random()*pool.length)]||WORLD_EVENTS[0];
    world.activeEvent={...event,id:crypto.randomUUID?crypto.randomUUID():`world-event-${Date.now()}`,location:gs.location||'Aethra',createdAt:new Date().toISOString()};world.history=[...(world.history||[]),{title:event.title,location:gs.location||'Aethra',at:new Date().toISOString()}].slice(-60);
    const note=`Evento de exploração: ${event.title}. ${event.text}`;const data=narrativeState(gs);data.journalEntries=[...data.journalEntries,{id:crypto.randomUUID?crypto.randomUUID():`journal-${Date.now()}`,text:note,kind:'event',createdAt:new Date().toISOString()}].slice(-50);
    await updateGameState({worldExploration:world,journalEntries:data.journalEntries});await createEvent('session_note',{kind:'world-event',text:note});toast('Novo acontecimento apresentado à companhia.');
  }
  async function clearWorldEvent(){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode encerrar acontecimentos.');const gs=state.campaign.game_state||defaultGameState(),world=cloneData(gs.worldExploration||{});world.activeEvent=null;await updateGameState({worldExploration:world});toast('Acontecimento encerrado.');}
  async function travelWorld(mapId){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode conduzir viagens.');const template=MAP_TEMPLATES.find(m=>m.id===mapId);if(!template)throw new Error('Destino não encontrado.');
    const destinations={'eldoria-road':['Estrada Esquecida de Eldoria','A estrada serpenteia entre árvores antigas. Pegadas recentes seguem para o norte.'],'brumafolha':['Vila de Brumafolha','A praça está movimentada. O som das oficinas e das conversas acompanha a chegada da companhia.'],'watchtower':['Torre dos Vigias','As ruínas se erguem acima da mata. O vento atravessa as colunas partidas.'],'root-sanctuary':['Santuário das Raízes','Raízes antigas envolvem um altar coberto por inscrições.'],'thalassor-reef':['Recife das Vozes','A maré revela pedras antigas e estruturas submersas.'],'niveria-crystal':['Galeria Prismática','Cristais azuis iluminam corredores silenciosos.'],'solaria-dais':['Altar do Sol Partido','A luz dourada atravessa as colunas e toca o mosaico central.'],'drakmor-citadel':['Cidadela de Braseiro','O calor das forjas e o som dos martelos anunciam a fortaleza.'],'umbrafunda-cavern':['Cavernas de Umbrafunda','A umidade escorre pelas paredes e teias antigas cobrem passagens estreitas.'],'drakmor-lava-cave':['Gruta das Brasas','O calor aumenta a cada passo. Rios de lava iluminam as paredes vulcânicas.'],'niveria-deep-cave':['Abismo de Cristal','Cristais azulados crescem no teto e o gelo cobre o chão da caverna.']};
    const [location,narration]=destinations[mapId],gs=state.campaign.game_state||defaultGameState(),ex=explorationData(gs);ex.mapId=mapId;if(!ex.maps[mapId])ex.maps[mapId]=createBoardRecord(mapId);else if(ex.maps[mapId].boardDefaultsApplied!==true){const rec=activeMapRecord({...gs,exploration:ex});rec.boardDefaultsApplied=true;ex.maps[mapId]=rec;}const world=cloneData(gs.worldExploration||{});world.activeEvent=null;const data=narrativeState(gs);const note=`A companhia viajou para ${location}.`;
    data.journalEntries=[...data.journalEntries,{id:crypto.randomUUID?crypto.randomUUID():`journal-${Date.now()}`,text:note,kind:'travel',createdAt:new Date().toISOString()}].slice(-50);
    await updateGameState({location,narration,exploration:ex,worldExploration:world,journalEntries:data.journalEntries});await createEvent('session_note',{kind:'travel',text:note,map_id:mapId});toast(`A companhia chegou a ${location}.`);
  }

  // Música compartilhada da campanha. O volume de cada jogador é local ao dispositivo.
  const MUSIC_PREF_PREFIX='aethra.music.prefs.v420.';
  function musicState(gs=state.campaign?.game_state||defaultGameState()){
    const m=gs.music&&typeof gs.music==='object'?gs.music:{};
    return {playlist:Array.isArray(m.playlist)?m.playlist:[],currentTrackId:m.currentTrackId||null,isPlaying:!!m.isPlaying,position:Math.max(0,Number(m.position)||0),updatedAt:m.updatedAt||null,globalVolume:Math.max(0,Math.min(1,Number.isFinite(Number(m.globalVolume))?Number(m.globalVolume):0.65)),revision:Number(m.revision)||0};
  }
  function musicLocalPrefs(){try{return JSON.parse(localStorage.getItem(MUSIC_PREF_PREFIX+(state.campaign?.id||'none'))||'{}')}catch{return {}}}
  function setMusicLocalPrefs(patch){const next={...musicLocalPrefs(),...patch};localStorage.setItem(MUSIC_PREF_PREFIX+(state.campaign?.id||'none'),JSON.stringify(next));applyMusicVolume();return next}
  function getCampaignAudio(){if(!state.musicAudio){state.musicAudio=new Audio();state.musicAudio.preload='auto';state.musicAudio.addEventListener('ended',()=>{if(isMaster()&&isMasterController())musicNextTrack(false).catch(e=>toast(e.message,'error'))});}return state.musicAudio}
  function currentMusicTrack(m=musicState()){return m.playlist.find(t=>t.id===m.currentTrackId)||m.playlist[0]||null}
  function expectedMusicPosition(m){if(!m.isPlaying||!m.updatedAt)return m.position;const elapsed=Math.max(0,(Date.now()-Date.parse(m.updatedAt))/1000);return Math.max(0,m.position+elapsed)}
  function musicLocalVolume(){const local=musicLocalPrefs();return Number.isFinite(Number(local.volume))?Math.max(0,Math.min(1,Number(local.volume))):1}
  function applyMusicVolume(){
    const m=musicState(),local=musicLocalPrefs(),perDevice=musicLocalVolume(),muted=!!local.muted||!state.musicActivated;
    if(state.musicAudio){state.musicAudio.volume=m.globalVolume*perDevice;state.musicAudio.muted=muted;}
    const ytp=state.musicYoutube?.player;
    if(ytp&&state.musicYoutube?.ready){try{if(muted)ytp.mute();else{ytp.unMute();ytp.setVolume(Math.round(m.globalVolume*perDevice*100));}}catch{}}
  }
  function extractYouTubeVideoId(value){
    try{
      const url=new URL(String(value||'').trim());if(url.protocol!=='https:')return '';
      const host=url.hostname.toLowerCase().replace(/^www\./,'').replace(/^m\./,'');
      let id='';
      if(host==='youtu.be')id=url.pathname.split('/').filter(Boolean)[0]||'';
      else if(['youtube.com','youtube-nocookie.com'].includes(host)){
        if(url.pathname==='/watch')id=url.searchParams.get('v')||'';
        else {const parts=url.pathname.split('/').filter(Boolean);if(['embed','shorts','live'].includes(parts[0]))id=parts[1]||'';}
      }
      return /^[A-Za-z0-9_-]{11}$/.test(id)?id:'';
    }catch{return ''}
  }
  function validYouTubeUrl(value){return !!extractYouTubeVideoId(value)}
  function loadYouTubeIframeAPI(){
    if(window.YT?.Player)return Promise.resolve(window.YT);
    if(state.musicYoutubeApiPromise)return state.musicYoutubeApiPromise;
    state.musicYoutubeApiPromise=new Promise((resolve,reject)=>{
      let settled=false;const finish=(error)=>{if(settled)return;settled=true;clearTimeout(timeout);if(error)reject(error);else resolve(window.YT)};
      const previous=window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady=()=>{try{if(typeof previous==='function')previous()}catch(error){console.warn('Callback anterior do YouTube falhou.',error)}finish(window.YT?.Player?null:new Error('A API do YouTube não inicializou.'))};
      const timeout=setTimeout(()=>finish(new Error('O player do YouTube demorou para carregar.')),16000);
      let script=document.querySelector('script[data-aethra-youtube-api]');
      if(!script){script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.async=true;script.dataset.aethraYoutubeApi='true';script.onerror=()=>finish(new Error('Não foi possível carregar o player do YouTube.'));document.head.append(script)}
    }).catch(error=>{state.musicYoutubeApiPromise=null;throw error});
    return state.musicYoutubeApiPromise;
  }
  function ensureMusicYoutubeHost(){
    let host=state.musicYoutubeHost;
    if(!host?.isConnected){host=document.createElement('div');host.id='aethra-youtube-host';host.className='aethra-youtube-host';host.style.display='none';document.body.append(host);state.musicYoutubeHost=host;}
    if(!host.querySelector('#aethra-youtube-player-frame')&&!host.querySelector('iframe')){const frame=document.createElement('div');frame.id='aethra-youtube-player-frame';host.append(frame);}
    if(!state.musicYoutubePositionBound){
      const reposition=()=>positionMusicYoutubeHost();window.addEventListener('resize',reposition,{passive:true});window.addEventListener('scroll',reposition,{passive:true,capture:true});state.musicYoutubePositionBound=true;
    }
    return host;
  }
  function positionMusicYoutubeHost(){
    const host=ensureMusicYoutubeHost(),slot=document.querySelector('.music-youtube-slot');
    if(!slot){host.style.display='none';return}
    const rect=slot.getBoundingClientRect();if(rect.width<180||rect.height<160){host.style.display='none';return}
    host.style.display='block';host.style.left=`${Math.round(rect.left)}px`;host.style.top=`${Math.round(rect.top)}px`;host.style.width=`${Math.round(rect.width)}px`;host.style.height=`${Math.round(rect.height)}px`;
    if(state.musicYoutube?.ready){try{state.musicYoutube.player.setSize(Math.round(rect.width),Math.round(rect.height))}catch{}}
  }
  async function ensureMusicYoutubePlayer(track){
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
    ensureMusicYoutubeHost();positionMusicYoutubeHost();
    const frame=document.getElementById('aethra-youtube-player-frame');if(!frame)throw new Error('Não foi possível preparar o espaço do player do YouTube.');
    let resolveReady;const readyPromise=new Promise(resolve=>{resolveReady=resolve});
    record={player:null,videoId,trackId:track.id,ready:false,readyPromise,resolveReady,error:null};state.musicYoutube=record;
    const slot=document.querySelector('.music-youtube-slot'),rect=slot?.getBoundingClientRect();const width=Math.max(200,Math.round(rect?.width||360)),height=Math.max(200,Math.round(rect?.height||220));
    record.player=new YT.Player('aethra-youtube-player-frame',{width,height,videoId,playerVars:{autoplay:0,controls:0,disablekb:1,enablejsapi:1,playsinline:1,rel:0,modestbranding:1,iv_load_policy:3,origin:location.origin},events:{onReady:event=>{if(state.musicYoutube!==record)return;record.player=event.target;record.ready=true;record.resolveReady(record.player);positionMusicYoutubeHost();applyMusicVolume();syncCampaignMusic(true).catch(err=>console.warn('Sincronização do vídeo falhou.',err));},onStateChange:event=>{if(event.data===YT.PlayerState.ENDED&&isMaster()&&isMasterController())musicNextTrack(false).catch(err=>toast(err.message,'error'));},onAutoplayBlocked:()=>{state.musicActivated=false;applyMusicVolume();toast('O navegador bloqueou a reprodução automática. Clique em “Ativar música neste dispositivo” e depois em Reproduzir.');},onError:event=>{record.error=event.data;record.resolveReady(null);const message=event.data===101||event.data===150?'Este vídeo não permite reprodução incorporada. Escolha outro vídeo do YouTube.':event.data===100?'Este vídeo foi removido ou está privado.':event.data===153?'O YouTube não recebeu a identificação de origem necessária. Recarregue o site e tente novamente.':'O YouTube não conseguiu reproduzir esta faixa.';toast(message,'error');}}});
    positionMusicYoutubeHost();
    return Promise.race([readyPromise,new Promise(resolve=>setTimeout(()=>resolve(null),12000))]);
  }
  function hideMusicYoutubeHost(){const host=state.musicYoutubeHost;if(host)host.style.display='none';try{if(state.musicYoutube?.ready)state.musicYoutube.player.pauseVideo()}catch{}}
  async function syncCampaignMusic(force=false){
    if(!state.campaign||state.view!=='session')return;
    const m=musicState(),track=currentMusicTrack(m),audio=getCampaignAudio();applyMusicVolume();
    if(track?.source==='youtube'){
      if(state.musicYoutube?.videoId===(track.youtubeId||extractYouTubeVideoId(track.url))&&state.musicYoutube?.error)return;
      audio.pause();if(audio.src){audio.removeAttribute('src');audio.load()}
      try{
        const player=await ensureMusicYoutubePlayer(track);if(!player)return;positionMusicYoutubeHost();applyMusicVolume();
        const target=expectedMusicPosition(m),current=Number(player.getCurrentTime?.())||0,drift=Math.abs(current-target),YT=window.YT;
        if(!m.isPlaying){if(player.getPlayerState?.()===YT.PlayerState.PLAYING||player.getPlayerState?.()===YT.PlayerState.BUFFERING)player.pauseVideo();if(force&&drift>1.5)player.seekTo(target,true);return}
        if(!state.musicActivated){player.mute();return}
        if(force||drift>2.4)player.seekTo(target,true);
        if(player.getPlayerState?.()!==YT.PlayerState.PLAYING)player.playVideo();
      }catch(error){console.warn('Player do YouTube indisponível:',error);if(isMaster())toast(error.message||'Não foi possível iniciar o vídeo do YouTube.','error')}
      return;
    }
    hideMusicYoutubeHost();
    if(!track?.url){audio.pause();if(audio.src){audio.removeAttribute('src');audio.load()}return}
    let absolute;try{absolute=new URL(track.url,document.baseURI).href;if(!['https:','http:'].includes(new URL(absolute).protocol))throw new Error('Protocolo de áudio inválido.')}catch{audio.pause();toast('O endereço da faixa não é um link de áudio válido.','error');return}
    if(audio.src!==absolute){audio.pause();audio.src=absolute;audio.load()}
    const target=expectedMusicPosition(m),drift=Math.abs((Number(audio.currentTime)||0)-target);
    if(!m.isPlaying){if(!audio.paused)audio.pause();if(force||drift>1.5)try{audio.currentTime=target}catch{}return}
    if(!state.musicActivated)return;
    if(force||drift>2.2)try{audio.currentTime=target}catch{}
    if(audio.paused){try{await audio.play()}catch(err){console.warn('O navegador bloqueou a reprodução automática:',err);state.musicActivated=false;applyMusicVolume();if(!isMaster())toast('Toque em “Ativar música neste dispositivo” para ouvir a trilha.')}}
  }
  function startCampaignMusicSync(){if(state.musicSyncTimer)clearInterval(state.musicSyncTimer);state.musicSyncTimer=setInterval(()=>{if(!state.musicSyncBusy){state.musicSyncBusy=true;syncCampaignMusic().catch(()=>{}).finally(()=>state.musicSyncBusy=false)}},3500);syncCampaignMusic(true).catch(()=>{})}
  function stopCampaignMusic(){if(state.musicSyncTimer)clearInterval(state.musicSyncTimer);state.musicSyncTimer=null;if(state.musicAudio){state.musicAudio.pause();state.musicAudio.removeAttribute('src');state.musicAudio.load()}hideMusicYoutubeHost();state.musicActivated=false;}
  async function saveMusicState(next){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode controlar a música.');const music={...musicState(),...next,revision:musicState().revision+1,updatedAt:new Date().toISOString()};await updateGameState({music});await syncCampaignMusic(true);}
  async function musicActivateDevice(){state.musicActivated=true;const m=musicState(),track=currentMusicTrack(m),yt=state.musicYoutube;if(track?.source==='youtube'&&yt?.ready){try{const local=musicLocalPrefs();if(local.muted)yt.player.mute();else{yt.player.unMute();yt.player.setVolume(Math.round(m.globalVolume*musicLocalVolume()*100));}if(m.isPlaying)yt.player.playVideo()}catch{}}applyMusicVolume();await syncCampaignMusic(true);toast('Áudio ativado neste dispositivo.');render()}
  async function musicTogglePlayback(){const m=musicState(),track=currentMusicTrack(m),audio=getCampaignAudio();if(!track)throw new Error('Adicione ou escolha uma faixa antes de reproduzir.');let position=m.position;if(track.source==='youtube'&&state.musicYoutube?.ready){try{position=Number(state.musicYoutube.player.getCurrentTime())||position}catch{}}else position=Number(audio.currentTime)||expectedMusicPosition(m);if(m.isPlaying){if(track.source==='youtube'&&state.musicYoutube?.ready){try{state.musicYoutube.player.pauseVideo()}catch{}}await saveMusicState({isPlaying:false,position});}else{state.musicActivated=true;if(track.source==='youtube'&&state.musicYoutube?.ready){try{const local=musicLocalPrefs();if(local.muted)state.musicYoutube.player.mute();else{state.musicYoutube.player.unMute();state.musicYoutube.player.setVolume(Math.round(m.globalVolume*musicLocalVolume()*100));}state.musicYoutube.player.playVideo()}catch{}}await saveMusicState({isPlaying:true,position});if(track.source!=='youtube'){try{await audio.play()}catch{toast('O navegador bloqueou a reprodução. Clique novamente em Reproduzir.','error')}}}}
  async function musicSelectTrack(trackId,autoplay=true){const m=musicState(),track=m.playlist.find(t=>t.id===trackId);if(!track)throw new Error('Faixa não encontrada.');state.musicActivated=true;if(track.source==='youtube'&&state.musicYoutube?.ready){try{state.musicYoutube.player.loadVideoById({videoId:track.youtubeId||extractYouTubeVideoId(track.url),startSeconds:0});const local=musicLocalPrefs();if(local.muted)state.musicYoutube.player.mute();else{state.musicYoutube.player.unMute();state.musicYoutube.player.setVolume(Math.round(m.globalVolume*musicLocalVolume()*100));}if(autoplay)state.musicYoutube.player.playVideo()}catch{}}await saveMusicState({currentTrackId:trackId,position:0,isPlaying:!!autoplay});}
  async function musicNextTrack(reverse=false,fromEnded=false){const m=musicState();if(!m.playlist.length)return;const index=Math.max(0,m.playlist.findIndex(t=>t.id===m.currentTrackId));const next=(index+(reverse?-1:1)+m.playlist.length)%m.playlist.length;await musicSelectTrack(m.playlist[next].id,true)}
  function validDirectAudioUrl(value){try{const u=new URL(value);if(u.protocol!=='https:')return false;const host=u.hostname.toLowerCase();if(/(^|\.)(youtube\.com|youtu\.be|spotify\.com|soundcloud\.com|music\.apple\.com)$/.test(host))return false;return /\.(mp3|ogg|wav|m4a|aac|webm|flac|opus)(\?|#|$)/i.test(u.pathname+u.search+u.hash)}catch{return false}}
  function renderMusicYouTubeSlot(track){return track?.source==='youtube'?'<div class="music-youtube-slot" aria-label="Player de música do YouTube"></div>':''}
  function renderMusicPanel(gs){
    const m=musicState(gs),track=currentMusicTrack(m),master=isMaster(),canControl=master&&isMasterController(),local=musicLocalPrefs(),volume=Number.isFinite(Number(local.volume))?Math.round(Number(local.volume)*100):100;
    const trackSource=track?.source==='upload'?'Arquivo enviado':track?.source==='youtube'?'YouTube':'Link de áudio';
    const playlistMarkup=m.playlist.length?m.playlist.map((item,i)=>`<div class="music-track-row ${item.id===m.currentTrackId?'active':''}"><button class="music-track-select" data-action="music-pick" data-track-id="${esc(item.id)}" ${canControl?'':'disabled'}><span>${String(i+1).padStart(2,'0')}</span><strong>${esc(item.name)}</strong><small>${item.source==='youtube'?'YouTube':item.source==='upload'?'Arquivo': 'Link de áudio'} · ${item.id===m.currentTrackId?'Em reprodução/selecionada':'Selecionar faixa'}</small></button><button class="icon-button music-track-remove" data-action="music-remove" data-track-id="${esc(item.id)}" title="Remover faixa" ${canControl?'':'disabled'}>×</button></div>`).join(''):'<p class="panel-subtitle">Sua playlist está vazia. Adicione um arquivo, um link direto de áudio ou uma faixa do YouTube.</p>';
    const playlist=`<div class="music-playlist"><div class="music-playlist-head row between"><strong>Playlist da campanha</strong><span class="tag">${m.playlist.length} faixa(s)</span></div><div class="music-playlist-scroll" role="list">${playlistMarkup}</div></div>`;
    if(master){return `<section class="panel campaign-music-panel"><div class="row between"><div><div class="small-caps">Trilha sonora compartilhada</div><h3>Central de Música</h3><p class="panel-subtitle">A reprodução é sincronizada para todos. O volume individual dos jogadores é independente.</p></div><span class="tag ${m.isPlaying?'green':'gold'}">${m.isPlaying?'● Tocando':'Ⅱ Pausada'}</span></div><div class="music-now-playing"><span class="music-note-icon">♫</span><div><small>FAIXA ATUAL</small><strong>${esc(track?.name||'Nenhuma faixa selecionada')}</strong><span>${track?esc(trackSource):'Adicione arquivos, links de áudio ou vídeos do YouTube.'}</span></div></div>${renderMusicYouTubeSlot(track)}<div class="music-master-controls"><button class="btn btn-secondary btn-small" data-action="music-prev" ${m.playlist.length&&canControl?'':'disabled'}>⏮ Anterior</button><button class="btn btn-primary btn-small" data-action="music-toggle" ${track&&canControl?'':'disabled'}>${m.isPlaying?'Ⅱ Pausar':'▶ Reproduzir'}</button><button class="btn btn-secondary btn-small" data-action="music-next" ${m.playlist.length&&canControl?'':'disabled'}>Próxima ⏭</button><button class="btn btn-quiet btn-small" data-action="music-unlock">${state.musicActivated?'Áudio ativado':'Ativar áudio'}</button><div class="music-volume-add-row"><label class="music-volume-control">Volume geral <input type="range" min="0" max="100" value="${Math.round(m.globalVolume*100)}" data-music-global-volume ${canControl?'':'disabled'}></label><div class="music-add-controls"><button class="btn btn-secondary btn-small" data-action="music-upload" ${canControl?'':'disabled'}>＋ Arquivo</button><button class="btn btn-quiet btn-small" data-action="music-add-link" ${canControl?'':'disabled'}>＋ Link</button><button class="btn btn-quiet btn-small" data-action="music-add-youtube" ${canControl?'':'disabled'}>＋ YouTube</button><input id="music-file-input" type="file" accept="audio/*,.mp3,.ogg,.wav,.m4a,.aac,.flac,.opus" multiple hidden></div></div></div>${playlist}${canControl?'':'<div class="notice">Esta aba do mestre está em modo de consulta. Os controles de música ficam disponíveis na instância ativa do mestre.</div>'}<p class="music-footnote">Arquivos até 25 MB. Links de áudio precisam apontar diretamente para um arquivo HTTPS. Para YouTube, use o link de um vídeo que permita reprodução incorporada; alguns vídeos bloqueiam esse recurso.</p></section>`}
    const localMuted=!!local.muted;
    return `<section class="panel campaign-music-panel player-music-panel"><div class="row between"><div><div class="small-caps">Trilha sonora</div><h3>Música da aventura</h3><p class="panel-subtitle">${esc(track?.name||'O mestre ainda não escolheu uma faixa.')}</p></div><span class="tag ${m.isPlaying?'green':'gold'}">${m.isPlaying?'● Tocando':'Pausada'}</span></div>${renderMusicYouTubeSlot(track)}<div class="player-music-controls"><button class="btn btn-secondary btn-small" data-action="music-unlock">${state.musicActivated?'Áudio ativado':'Ativar música neste dispositivo'}</button><label class="music-volume-control">Seu volume <input type="range" min="0" max="100" value="${volume}" data-music-local-volume></label><button class="btn ${localMuted?'btn-primary':'btn-quiet'} btn-small" data-action="music-mute">${localMuted?'Ativar som':'Mutar'}</button></div><p class="music-footnote">Cada jogador controla apenas o próprio volume. Ao entrar em outro aparelho, será necessário ativar o áudio uma vez por causa das regras do navegador.</p></section>`;
  }
  function openMusicLinkModal(){modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="page-kicker">Playlist compartilhada</div><h2>Adicionar link de áudio</h2><p>Use um endereço direto para um arquivo MP3, OGG, WAV ou outro formato de áudio.</p></div><button class="modal-close" data-action="close-modal">×</button></div><form id="music-link-form"><div class="field"><label for="music-link-name">NOME DA FAIXA</label><input id="music-link-name" class="input" maxlength="90" placeholder="Ex.: A Floresta de Eldoria" required></div><div class="field"><label for="music-link-url">LINK DIRETO HTTPS</label><input id="music-link-url" class="input" type="url" placeholder="https://servidor.com/faixa.mp3" required></div><div class="notice">O link precisa entregar o próprio arquivo de áudio. Para vídeos do YouTube, use a opção “Adicionar YouTube”.</div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button type="submit" class="btn btn-primary">Adicionar à playlist</button></div></form></section></div>`}
  function openMusicYouTubeModal(){modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="page-kicker">Playlist compartilhada</div><h2>Adicionar faixa do YouTube</h2><p>Cole o endereço de um vídeo do YouTube para reproduzir pela central compartilhada.</p></div><button class="modal-close" data-action="close-modal">×</button></div><form id="music-youtube-form"><div class="field"><label for="music-youtube-name">NOME DA FAIXA</label><input id="music-youtube-name" class="input" maxlength="90" placeholder="Ex.: Tema de exploração de Eldoria" required></div><div class="field"><label for="music-youtube-url">LINK DO VÍDEO</label><input id="music-youtube-url" class="input" type="url" placeholder="https://www.youtube.com/watch?v=..." required></div><div class="notice">O vídeo precisa permitir reprodução incorporada. Alguns canais desativam essa possibilidade ou limitam o uso por região. A reprodução pode exigir que cada participante clique em “Ativar música neste dispositivo”.</div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button type="submit" class="btn btn-primary">Adicionar ao repertório</button></div></form></section></div>`}
  async function uploadMusicFiles(files){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode adicionar músicas.');if(!state.backendReady)throw new Error('O envio de arquivos requer Supabase Storage.');
    const list=[...files||[]];if(!list.length)return;const m=musicState();
    for(const file of list){const ext=(file.name.split('.').pop()||'mp3').toLowerCase().replace(/[^a-z0-9]/g,'');const audioExt=new Set(['mp3','ogg','wav','m4a','aac','webm','flac','opus']);if(!(file.type||'').startsWith('audio/')&&!audioExt.has(ext))throw new Error(`${file.name} não parece ser um arquivo de áudio compatível.`);if(file.size>25*1024*1024)throw new Error(`${file.name} ultrapassa o limite de 25 MB.`);const safe=(file.name.replace(/\.[^.]+$/,'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').slice(0,60)||'faixa');const path=`${state.campaign.id}/${crypto.randomUUID?crypto.randomUUID():Date.now()}-${safe}.${ext}`;const {error}=await state.backend.storage.from('aethra-campaign-audio').upload(path,file,{contentType:file.type||({mp3:'audio/mpeg',ogg:'audio/ogg',wav:'audio/wav',m4a:'audio/mp4',aac:'audio/aac',webm:'audio/webm',flac:'audio/flac',opus:'audio/opus'}[ext]||'application/octet-stream'),upsert:false});if(error)throw error;const {data}=state.backend.storage.from('aethra-campaign-audio').getPublicUrl(path);m.playlist.push({id:`track-${crypto.randomUUID?crypto.randomUUID():Date.now()}`,name:file.name.replace(/\.[^.]+$/,''),url:data.publicUrl,source:'upload',storagePath:path,addedAt:new Date().toISOString()});}
    if(!m.currentTrackId&&m.playlist.length)m.currentTrackId=m.playlist[0].id;await saveMusicState(m);toast('Faixa(s) adicionada(s) à playlist compartilhada.');
  }
  async function addMusicLink(name,url){if(!validDirectAudioUrl(url))throw new Error('Informe um link HTTPS direto para um arquivo de áudio.');const m=musicState();m.playlist.push({id:`track-${crypto.randomUUID?crypto.randomUUID():Date.now()}`,name:name.trim().slice(0,90),url,source:'link',addedAt:new Date().toISOString()});if(!m.currentTrackId)m.currentTrackId=m.playlist[0].id;await saveMusicState(m);closeModal();toast('Link adicionado à playlist.')}
  async function addMusicYouTubeLink(name,url){const youtubeId=extractYouTubeVideoId(url);if(!youtubeId)throw new Error('Informe um link HTTPS válido de vídeo do YouTube.');const m=musicState();m.playlist.push({id:`track-${crypto.randomUUID?crypto.randomUUID():Date.now()}`,name:name.trim().slice(0,90),url:String(url).trim(),youtubeId,source:'youtube',addedAt:new Date().toISOString()});if(!m.currentTrackId)m.currentTrackId=m.playlist[0].id;await saveMusicState(m);closeModal();toast('Vídeo do YouTube adicionado à playlist compartilhada.')}
  async function removeMusicTrack(trackId){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode remover faixas.');const m=musicState(),track=m.playlist.find(t=>t.id===trackId);if(!track)throw new Error('Faixa não encontrada.');if(track.storagePath&&state.backendReady){const {error}=await state.backend.storage.from('aethra-campaign-audio').remove([track.storagePath]);if(error)throw error;}m.playlist=m.playlist.filter(t=>t.id!==trackId);if(m.currentTrackId===trackId){m.currentTrackId=m.playlist[0]?.id||null;m.position=0;m.isPlaying=false}await saveMusicState(m);toast('Faixa removida da playlist.');}

  function renderSession(){
    if(state.campaign&&!state.musicSyncTimer)startCampaignMusicSync();
    if(!state.campaign){state.view='home';renderHome();return}
    const c=state.campaign,gs=c.game_state||defaultGameState(),enc=gs.encounter,events=state.events.filter(e=>e.event_type!=='chat_message').slice(-24).reverse(),chatEvents=state.events.filter(e=>e.event_type==='chat_message').slice(-14),prompt=activeRollPrompt(),playerCanRoll=canCurrentPlayerRoll(),ownChar=state.member?.character?normalizeCharacter(state.member.character):null,ownVitals=ownChar?currentPartyVitals(currentUserId(),ownChar):null,activeTurn=activeCombatTurn(enc),ownTurn=isPlayersCombatTurn();
    app.innerHTML=`<div class="session-top"><div><div class="page-kicker">Crônica em andamento · ${esc(c.code)}</div><h1 class="page-title">${esc(c.name)}</h1></div><div class="row"><span class="tag ${masterIsOnline()?'green':'gold'}">${masterIsOnline()?'● Mestre online':'○ Aguardando mestre'}</span><span class="tag">${state.lastSyncAt?'Sync '+new Date(state.lastSyncAt).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}):'Sincronização pendente'}</span>${isMaster()?`<button class="btn btn-secondary btn-small" data-action="pause-session">Encerrar sessão</button>${canDeleteCurrentCampaign()?`<button class="btn btn-danger btn-small" data-action="delete-campaign" data-id="${c.id}">Excluir campanha</button>`:''}`:`<button class="btn btn-quiet btn-small" data-action="leave-campaign">Sair da campanha</button>`}<button class="btn btn-quiet btn-small" data-action="sync-campaign">⟳ Sincronizar</button><button class="btn btn-quiet btn-small" data-action="open-lobby">Participantes</button></div></div>
    ${!isMaster()&&!masterIsOnline()?'<div class="notice" style="margin-bottom:16px"><strong>O mestre está offline.</strong> A campanha continua salva, mas as ações ao vivo ficarão disponíveis quando o mestre retornar.</div>':''}
    ${renderV411ConnectionPanel()}
    ${renderMusicPanel(gs)}
    ${isMaster()?renderMasterCommandCenter(gs):''}
    ${renderV411UndoPanel(gs)}
    ${renderVoiceSessionPanel(gs)}
    <div class="session-grid"><div><section class="narrative-box"><div class="scene-artwork"><img src="${sceneArtworkFor(gs).src}" alt="${esc(sceneArtworkFor(gs).label)}" loading="lazy"></div><div class="label">✦ NARRAÇÃO DO MESTRE · ${esc(gs.chapter||'A CRÔNICA')}</div><h3>${esc(gs.location||'Aethra')}</h3><p>${esc(gs.narration||'A aventura aguarda a próxima decisão dos heróis.')}</p><div class="scene-howto"><strong>O que fazer nesta cena?</strong><span>Jogadores: descrevam o que seus personagens querem fazer — conversar, observar, investigar, viajar ou agir. Mestre: responda narrando as consequências e peça um D20 apenas quando houver risco e incerteza. A narração publicada é a parte apresentada ao grupo; roteiro interno, oportunidades não reveladas e preparação permanecem na Central do Mestre. O mapa tático só aparece aos jogadores quando for apresentado.</span></div></section>
      ${renderStoryBranchPanel(gs)}
      ${isMaster()?`<div class="session-actions"><button class="btn btn-secondary btn-small" data-action="request-dice">⬡ Solicitar teste D20</button><button class="btn btn-secondary btn-small" data-action="v423-open-dice">⚄ Rolador Universal</button><button class="btn btn-secondary btn-small" data-action="start-encounter">⚔ Iniciar encontro</button><button class="btn btn-secondary btn-small" data-action="open-narration">✎ Narrar acontecimento</button><button class="btn btn-secondary btn-small" data-action="open-adventure-manager">✦ Jornada e missões</button><button class="btn btn-quiet btn-small" data-action="open-master-guide">♛ Guia do mestre</button></div>`:`<div class="session-actions"><button class="btn btn-primary btn-small" data-action="roll-dice" ${!masterIsOnline()||!playerCanRoll?'disabled':''}>⬡ ${playerCanRoll?'Responder ao D20':'Aguardando solicitação'}</button><button class="btn btn-secondary btn-small" data-action="open-character-sheet">✧ Minha ficha</button><button class="btn btn-secondary btn-small" data-action="open-inventory">🎒 Inventário</button></div>`}
      ${renderQuestPanel(gs)}
      ${renderV4Milestones(gs)}
      ${renderWorldExplorer(gs)}
      ${renderTacticalMap(gs)}
      ${enc?renderCombatTracker(enc):''}
      ${enc?renderBattleCard(enc):`<div class="panel" style="margin-top:16px"><div class="small-caps">Exploração</div><h3 style="margin-top:10px">O caminho está aberto</h3><p class="panel-subtitle">Ainda não há um encontro ativo. ${isMaster()?'Quando os aventureiros encontrarem uma criatura, inicie um encontro pela central da sessão.':'Aguarde o mestre apresentar o próximo desafio.'}</p></div>`}
      <div class="panel" style="margin-top:16px"><div class="row between"><h3>Diário da sessão</h3><span class="tag">Últimos acontecimentos</span><button class="btn btn-secondary btn-small" data-action="open-journal">Linha do tempo completa</button></div><div class="event-feed">${events.length?events.map(formatEvent).join(''):'<div class="empty-state"><strong>A crônica ainda será escrita</strong><p>Rolagens, combates e narrações aparecerão aqui.</p></div>'}</div></div>
      ${v4GameData(gs).voiceSession?.enabled?`<details class="panel chat-panel voice-chat-alternative" style="margin-top:16px"><summary>Chat escrito (opcional durante a chamada)</summary><div class="chat-messages">${chatEvents.length?chatEvents.map(formatChatMessage).join(''):'<div class="empty-state"><strong>Nenhuma mensagem escrita</strong><p>Use a chamada e os atalhos do Modo Chamada para conduzir a sessão.</p></div>'}</div><form id="chat-form" class="chat-compose"><input class="input" id="chat-input" maxlength="500" placeholder="Mensagem escrita opcional..." autocomplete="off" required><button class="btn btn-primary btn-small" type="submit">Enviar</button></form></details>`:`<div class="panel chat-panel" style="margin-top:16px"><div class="row between"><h3>Chat da companhia</h3><span class="tag">Ao vivo</span></div><div class="chat-messages">${chatEvents.length?chatEvents.map(formatChatMessage).join(''):'<div class="empty-state"><strong>O silêncio acompanha a jornada</strong><p>Envie a primeira mensagem para seus companheiros.</p></div>'}</div><form id="chat-form" class="chat-compose"><input class="input" id="chat-input" maxlength="500" placeholder="Escreva uma mensagem para o grupo..." autocomplete="off" required><button class="btn btn-primary btn-small" type="submit">Enviar</button></form></div>`}
    </div><aside>${ownChar?`<div class="panel character-side-card"><div class="character-side-portrait">${portraitImage(ownChar.portrait||classPortrait(ownChar),ownChar.name)}</div><div class="row between"><h3>${esc(ownChar.name)}</h3><span class="tag gold">Nível ${ownChar.level}/50</span></div><div class="hp-row"><strong>HP</strong><strong>${ownVitals.hp} / ${ownVitals.maxHp}</strong></div><div class="hp-track"><div class="hp-fill" style="width:${Math.max(0,ownVitals.hp/ownVitals.maxHp*100)}%"></div></div><div class="stat-grid"><div class="stat-card"><small>Defesa</small><strong>${ownVitals.defense}</strong></div><div class="stat-card"><small>XP</small><strong>${ownChar.xp||0}</strong></div><div class="stat-card"><small>Ouro</small><strong>${ownVitals.coins} PO</strong></div></div><p class="panel-subtitle">${esc(ownChar.class)} · ${esc(ownChar.race)} · ${esc(ownChar.realm)}</p>${ownVitals.title?`<span class="tag gold">Título: ${esc(ownVitals.title)}</span>`:''}<div class="v4-status-row">${conditionBadgeList((gs.partyState||{})[currentUserId()]||{})}</div><div class="row"><button class="btn btn-secondary btn-small" style="flex:1" data-action="open-inventory">Ver equipamento e mochila</button><button class="btn btn-quiet btn-small" style="flex:1" data-action="v4-open-skill">Habilidades (${skillPointsAvailable(ownChar)} pts)</button></div></div>${renderV41PlayerHelp(ownChar,gs)}`:''}${renderRevealedNpcs(gs)}${renderJourneyLog(gs)}<div class="panel" style="margin-top:15px"><div class="row between"><h3>Participantes</h3><span class="tag green">${state.members.length} na crônica</span></div><div class="member-list">${state.members.map(m=>{const v=m.character?currentPartyVitals(m.user_id,m.character):null;return `<div class="member-row"><div class="roster-portrait">${memberPortrait(m)}</div><div><strong>${esc(m.display_name||'Aventureiro')}</strong><small>${m.role==='master'?'Mestre':esc(m.character?.class||'Aventureiro')}${v?` · ${v.hp}/${v.maxHp} HP · DEF ${v.defense}`:''} · ${memberIsOnline(m)?'Online':'Offline'}</small></div>${isMaster()&&isMasterController()&&m.role==='player'?`<button class="btn btn-danger btn-small member-remove-btn" data-action="remove-participant" data-user-id="${esc(m.user_id)}">Remover</button>`:''}</div>`}).join('')}</div></div><div class="panel" style="margin-top:15px"><h3>Rolagem de dados</h3><div class="dice-panel"><div class="dice-mini">20</div><div><strong>Dado de vinte faces</strong><small>Testes, ataques e salvaguardas</small></div></div>${isMaster()?`<button class="btn btn-primary" style="width:100%;margin-top:12px" data-action="request-dice">Solicitar rolagem</button><button class="btn btn-secondary" style="width:100%;margin-top:8px" data-action="roll-dice">Rolagem do mestre</button>${prompt?`<div class="notice" style="margin-top:10px">Solicitação ativa: ${esc(prompt.reason)} · ${prompt.fulfilled_user_ids?.length||0}/${prompt.target_user_ids?.length||0} respostas <button class="btn btn-quiet btn-small" style="margin-top:8px" data-action="cancel-roll-prompt">Cancelar</button></div>`:''}`:`<button class="btn btn-primary" style="width:100%;margin-top:12px" data-action="roll-dice" ${!masterIsOnline()||!playerCanRoll?'disabled':''}>${playerCanRoll?'Responder ao D20':'Aguardando solicitação'}</button>${prompt&&!playerCanRoll?`<p class="panel-subtitle">O mestre solicitou: ${esc(prompt.reason)}</p>`:''}`}<p class="panel-subtitle" style="margin:10px 0 0">Os resultados ficam registrados no diário e são exibidos aos participantes.</p></div><div class="panel" style="margin-top:15px"><h3>Capítulo atual</h3><p class="panel-subtitle">${esc(gs.chapter||'Prólogo')}</p><span class="tag gold">${esc(gs.location||'Aethra')}</span></div></aside></div>`;
    positionMusicYoutubeHost();
  }
  function renderCombatTracker(enc){
    const turn=activeCombatTurn(enc);const order=enc.turnOrder||[];
    const partyState=state.campaign?.game_state?.partyState||{};
    return `<section class="panel turn-tracker">${renderV411TurnSummary(enc)}<div class="row between"><div><div class="small-caps">Ordem de iniciativa</div><h3 style="margin:6px 0 0">Rodada ${enc.round||1}</h3></div><span class="tag gold">${order.length} participante(s)</span></div><div class="turn-order">${order.map((t,i)=>{const unavailable=!combatantAvailable(t,enc,partyState);return `<div class="turn-token ${i===Number(enc.turnIndex||0)?'active':''} ${unavailable?'out-of-action':''}"><strong>${esc(t.name)}</strong><small>${t.kind==='monster'?'Criatura':'Aventureiro'} · Iniciativa ${t.initiative}${unavailable?' · fora de combate':''}</small></div>`}).join('')}</div><div class="notice ${enc.partyDefeated?'notice-danger':''}" style="margin-top:12px"><strong>${enc.partyDefeated?'A companhia foi derrotada.':enc.defeated?'Vitória da companhia.':turn?'Turno atual:':'Combate concluído:'}</strong> ${esc(turn?.name||(enc.partyDefeated?'O mestre pode encerrar o encontro.':enc.defeated?'Todas as criaturas foram derrotadas.':'—'))} ${turn?.kind==='monster'?'(monstro)':turn?.kind==='player'?'(jogador)':''}</div>${isMaster()?`<div class="row" style="margin-top:10px">${turn?.kind==='monster'?'<button class="btn btn-danger btn-small" data-action="resolve-monster-turn">Resolver ação do monstro</button>':''}<button class="btn btn-secondary btn-small" data-action="advance-turn" ${enc.partyDefeated?'disabled':''}>Avançar / pular turno</button></div>`:''}</section>`;
  }
  function renderBattleCard(enc){
    const enemies=Array.isArray(enc.enemies)&&enc.enemies.length?enc.enemies:[enc];
    const displayEnemy=activeBattleEnemy(enc)||enc;
    const turn=activeCombatTurn(enc);
    const cardHp=Math.max(0,Number(displayEnemy.hp)||0);
    const cardMaxHp=Math.max(1,Number(displayEnemy.maxHp)||1);
    const hp=Math.max(0,Math.min(100,cardHp/cardMaxHp*100));
    const own=state.member?.character?normalizeCharacter(state.member.character):null;
    const ownVitals=own?currentPartyVitals(currentUserId(),own):null;
    const canAct=isPlayersCombatTurn()&&masterIsOnline()&&!enc.defeated&&!enc.partyDefeated&&Number(ownVitals?.hp)>0;
    const rule=classRule(own||{});const abilityUsed=ownVitals?.abilityUsed;
    const isBoss=/CHEFE|LENDÁRIA/i.test(displayEnemy.threat||'');
    let playerActions='';
    if(enc.partyDefeated){playerActions='<div class="notice notice-danger"><strong>Derrota.</strong> Todos os aventureiros estão sem pontos de vida. O mestre pode encerrar o encontro e preparar a recuperação da companhia.</div>'}
    else if(enc.defeated||enemies.every(e=>e.defeated||Number(e.hp)<=0)){playerActions='<div class="notice"><strong>Vitória!</strong> Todas as criaturas foram derrotadas. O encontro está concluído.</div>'}
    else if(!isMaster()&&canAct){const living=enemies.filter(e=>!e.defeated&&Number(e.hp)>0);playerActions=`<div class="battle-controls">${living.length>1?`<label class="combat-target-label">Alvo<select class="select" id="combat-target">${living.map(e=>`<option value="${esc(e.id)}" ${e.id===displayEnemy.id?'selected':''}>${esc(e.name)} · ${e.hp} HP</option>`).join('')}</select></label>`:''}<button class="btn btn-primary btn-small" data-action="combat-attack">Ataque básico</button><button class="btn btn-secondary btn-small" data-action="combat-ability" ${abilityUsed?'disabled':''}>${esc(rule.abilityName)}${abilityUsed?' · usada':''}</button><button class="btn btn-quiet btn-small" data-action="combat-potion" ${(ownVitals?.inventory||[]).some(i=>i.id==='pocao-cura'&&i.qty>0)?'':'disabled'}>Usar poção</button></div>`}
    else if(!isMaster())playerActions=`<div class="notice">${turn?.kind==='monster'?`<strong>${esc(turn.name)}</strong> está agindo. Aguarde o próximo turno.`:turn?.user_id===currentUserId()&&hasCondition(ownVitals,'stunned')?'<strong>Seu personagem está Atordoado.</strong> O mestre deve avançar o turno.':turn?.user_id===currentUserId()?'Seu turno está disponível.':'Aguarde sua vez na ordem de iniciativa.'}</div>`;
    const enemyRoster=enemies.length>1?`<div class="battle-enemy-roster"><h4>Criaturas deste encontro · ${enemies.length}</h4><div class="battle-enemy-list">${enemies.map(e=>{const eHp=Math.max(0,Number(e.hp)||0),eMax=Math.max(1,Number(e.maxHp)||1),ePct=Math.max(0,Math.min(100,eHp/eMax*100)),active=e.id===displayEnemy.id,dead=!!e.defeated||eHp<=0;return `<div class="battle-enemy-row ${active?'active':''} ${dead?'defeated':''}"><span class="battle-enemy-thumb">${mapMonsterMiniature({templateId:e.templateId,name:e.name,boss:/CHEFE/i.test(e.threat||'')})}</span><span class="battle-enemy-main"><strong>${esc(e.name)}</strong><small>${esc(e.kind||'Criatura')} · Nível ${esc(e.level||1)} · Defesa ${esc(e.defense||12)}</small><span class="battle-enemy-hp-track"><i style="width:${ePct}%"></i></span></span><span class="battle-enemy-values"><strong>${eHp} / ${eMax} HP</strong><small>${dead?'Derrotado':active&&turn?.kind==='monster'?'Turno atual':active?'Em destaque':'Ativo'}</small></span></div>`}).join('')}</div></div>`:'';
    const phasePanel=isBossTemplate(displayEnemy)?`<div class="boss-phase-panel boss-phase-${Number(displayEnemy.bossPhase)||1}"><strong>${esc(displayEnemy.bossPhaseName||'Fase I — O Devorador desperta')}</strong><small>${esc(displayEnemy.bossPhaseDescription||'O dragão ancestral observa a companhia.')}</small><span>${(displayEnemy.breathPhases||[]).length}/3 sopros ancestrais utilizados</span></div>`:'';
    const activeCaption=turn?.kind==='monster'&&turn.id===displayEnemy.id?'MONSTRO EM SEU TURNO':enemies.length>1?'CRIATURA EM DESTAQUE':'ENCONTRO ATIVO';
    return `<section class="battle-card ${enc.partyDefeated?'battle-defeat':enc.defeated||enemies.every(e=>e.defeated||Number(e.hp)<=0)?'battle-victory':''}"><div class="battle-art illustrated-battle-art"><span class="battle-art-kicker">${activeCaption}</span>${mapMonsterBattleArt({templateId:displayEnemy.templateId,name:displayEnemy.name,boss:isBoss})}<div class="battle-art-shade"></div><span class="battle-art-title">${esc(displayEnemy.kind||'CRIATURA HOSTIL')}</span></div><div class="battle-content"><span class="tag red">${esc(displayEnemy.threat||'CRIATURA HOSTIL')}</span><h3>${esc(displayEnemy.name)}</h3>${phasePanel}<div class="v4-status-row">${conditionBadgeList(displayEnemy)||'<span class="muted">Sem condições ativas</span>'}</div><div class="row between"><span class="muted" style="font-size:9px">${esc(displayEnemy.kind||'Criatura desconhecida')} · Nível ${esc(displayEnemy.level||1)}</span><span class="muted" style="font-size:9px">Defesa ${esc(displayEnemy.defense||12)}</span></div><div class="hp-row"><strong>Pontos de vida${enemies.length>1?' da criatura em destaque':''}</strong><strong>${cardHp} / ${cardMaxHp} HP</strong></div><div class="hp-track hp-track-monster ${hp<=25?'hp-critical':hp<=50?'hp-wounded':''}"><div class="hp-fill" style="width:${hp}%"></div></div><p class="panel-subtitle" style="margin-top:10px"><strong>${esc(displayEnemy.specialName||'Instinto da criatura')}:</strong> ${esc(displayEnemy.specialDescription||'Age de acordo com seus instintos.')}</p><p class="panel-subtitle">Recompensa pela vitória: <strong>${Number(displayEnemy.xpReward)||0} XP</strong> + ouro e espólio individual. ${displayEnemy.lootAwarded?`<br><small>Espólio registrado: ${(displayEnemy.lootDrops||[]).map(x=>esc(x.name)+" x"+x.qty).join(", ")||"nenhum item adicional"}</small>`:""}</p>${enemyRoster}${playerActions}${isMaster()&&enc.defeated?'<div class="notice"><strong>Encontro concluído.</strong> Experiência distribuída.</div>':''}${isMaster()?`<div class="battle-controls">${enemies.length>1?`<label class="combat-target-label">Alvo do dano manual<select class="select" id="master-target">${enemies.filter(e=>!e.defeated&&Number(e.hp)>0).map(e=>`<option value="${esc(e.id)}" ${e.id===displayEnemy.id?'selected':''}>${esc(e.name)} · ${e.hp} HP</option>`).join('')}</select></label>`:''}<input class="input" id="master-damage" type="number" min="0" max="100000" value="10" aria-label="Dano manual"><button class="btn btn-danger btn-small" data-action="master-apply-damage">Aplicar dano manual</button><button class="btn btn-secondary btn-small" data-action="v4-open-conditions">Condições</button><button class="btn btn-secondary btn-small" data-action="v4-open-area">Ataque em área</button><button class="btn btn-quiet btn-small" data-action="end-encounter">Encerrar</button></div>`:''}</div></section>`;
  }
  function renderInventoryModal(){
    const ch=state.member?.character?normalizeCharacter(state.member.character):null;if(!ch){toast('Crie um personagem para consultar o inventário.','error');return}
    const vitals=currentPartyVitals(currentUserId(),ch),eq=vitals.equipment||ch.equipment||{};
    const slots=[['weapon','Arma','⚔'],['armor','Armadura','⛨'],['shield','Escudo','🛡']];
    const equipped=slots.map(([slot,label,icon])=>{const item=eq[slot];return `<div class="member-row equipment-row"><div class="equipment-symbol">${icon}</div><div><strong>${esc(item?.name||'Vazio')}</strong><small>${label}${item?` · ${esc(item.rarity||'Comum')} · Aprimoramento +${Number(item.enhancementLevel)||0}${item.enchantment?' · '+esc(item.enchantment):''}`:''}</small></div><span class="spacer"></span><span class="tag">${item?(slot==='weapon'?`1d${item.damageDie||6} · +${rarityPower(item)+(Number(item.damageBonus)||0)} dano · +${rarityPower(item)+(Number(item.accuracy)||0)} ataque`:`+${(item.defense||0)+rarityPower(item)+(Number(item.enhancementLevel)||0)*5+(item.enchantment==='Guardião'?5:0)} DEF`):'—'}</span>${item&&isMaster()&&isMasterController()?`<button class="btn btn-secondary btn-small" data-action="unequip-item" data-slot="${slot}">Retirar</button>`:''}</div>`}).join('');
    const bag=vitals.inventory.map(item=>`<div class="member-row"><div class="avatar">${item.kind==='consumable'?'🧪':item.kind==='equipment'?'⚔':item.kind==='relic'?'✧':item.kind==='material'?'⚒':'🎒'}</div><div><strong>${esc(item.name)}</strong><small>${esc(item.description||'')}${item.rarity&&item.rarity!=='Comum'?' · '+esc(item.rarity):''}${item.requiredLevel?' · Nível '+item.requiredLevel+'+':''}${item.requiredClasses?' · '+esc(item.requiredClasses.join('/')):''}</small></div><span class="spacer"></span><span class="tag">x${item.qty||0}</span>${['equipment','relic'].includes(item.kind)&&Number(item.qty)>0&&isMaster()&&isMasterController()?`<button class="btn btn-primary btn-small" data-action="equip-item" data-item-id="${esc(item.id)}">Equipar</button>`:''}</div>`).join('');
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal wide" role="dialog" aria-modal="true"><div class="modal-head inventory-heading"><div class="inventory-hero-portrait">${portraitImage(ch.portrait||classPortrait(ch),ch.name)}</div><div><div class="page-kicker">Pertences do aventureiro</div><h2>Equipamentos e mochila</h2><p>${esc(ch.name)} · ${esc(ch.class)} · Nível ${ch.level}/50</p></div><button class="modal-close" data-action="close-modal">×</button></div><div class="stat-grid"><div class="stat-card"><small>HP atual</small><strong>${vitals.hp}/${vitals.maxHp}</strong></div><div class="stat-card"><small>Defesa efetiva</small><strong>${vitals.defense}</strong></div><div class="stat-card"><small>Bônus de ataque</small><strong>+${vitals.equipmentBonuses?.attack||0}</strong></div><div class="stat-card"><small>Ouro</small><strong>${vitals.coins} PO</strong></div></div><div class="notice"><strong>Especializações:</strong> Lâmina ${skillTreeRanks(ch).assault}/3 · Guardião ${skillTreeRanks(ch).guardian}/3 · Arcana ${skillTreeRanks(ch).arcane}/3. Os bônus já estão aplicados aos atributos efetivos.</div><h3>Equipado</h3><div class="member-list">${equipped}</div>${vitals.equipmentBonuses?.setName?`<div class="notice"><strong>Conjunto ${esc(vitals.equipmentBonuses.setName)} completo:</strong> +${vitals.equipmentBonuses?.setBonus||1} Defesa e +${vitals.equipmentBonuses?.setBonus||1} no ataque. ${esc(vitals.equipmentBonuses?.setEffect||'')}</div>`:(vitals.equipmentBonuses?.setPieces?`<p class="panel-subtitle">Conjunto ${esc(vitals.equipmentBonuses.setProgressName||"")}: ${vitals.equipmentBonuses.setPieces}/3 peças equipadas. O bônus será ativado ao completar as três peças.</p>`:'')}<div class="divider"></div><h3>Mochila</h3><div class="member-list">${bag||'<p class="panel-subtitle">A mochila está vazia.</p>'}</div><div class="notice">Equipar ou retirar itens altera a Defesa e o dano-base da arma na campanha. Nesta versão, somente o mestre ativo confirma trocas para todos os participantes.</div></section></div>`;
  }
  function formatEvent(ev){const p=ev.payload||{};let title='Acontecimento registrado',desc='';switch(ev.event_type){case'dice_result':title=`D20 · ${p.player_name||'Aventureiro'}`;desc=`Rolagens: ${(p.rolls||[p.result]).join(' / ')} · Natural ${p.natural??p.result}${p.modifier!=null?` ${Number(p.modifier)>=0?'+':''}${p.modifier} = ${p.total}`:''}${p.dc?` · CD ${p.dc}: ${p.success?'Sucesso':'Falha'}`:''}${p.reason?' · '+p.reason:''}`;break;case'dice_prompt':title='O mestre solicitou um teste';desc=p.reason||'Um aventureiro pode lançar o D20.';break;case'damage_applied':title=`${p.player_name||'Aventureiro'} causou dano`;desc=`${p.amount} de dano em ${p.monster||'a criatura'} · ${p.hp} HP restantes`;break;case'damage_request':title=`${p.player_name||'Aventureiro'} declarou um ataque`;desc=`Dano solicitado: ${p.amount}`;break;case'narration':title='Narração do mestre';desc=p.text||'';break;case'chat_message':title=`${p.display_name||'Aventureiro'} · mensagem`;desc=p.text||'';break;case'encounter_started':title='Encontro iniciado';desc=p.monster||'Uma criatura apareceu.';break;case'npc_revealed':{const npc=STORY_NPCS.find(n=>n.id===p.npc_id);title='Personagem apresentado';desc=npc?`${npc.name} · ${npc.role}`:'Um personagem do mundo foi apresentado.';break;}case'combat_action_result':title=`Ação de ${p.player_name||'Aventureiro'}`;desc=p.description||`Rolagem ${p.natural||'—'} · Dano ${p.damage||0}`;break;case'combat_action_rejected':title='Ação não realizada';desc=p.reason||'A ação foi recusada pela validação do combate.';break;case'party_defeated':title='Derrota da companhia';desc=p.description||'Todos os aventureiros ficaram sem pontos de vida.';break;case'encounter_defeated':title='Vitória da companhia';desc=p.description||`${p.monster||'A criatura'} foi derrotada. XP distribuído.`;break;case'monster_attack_result':title=`Ação de ${p.monster||'Monstro'}`;desc=p.description||'A criatura realizou sua ação.';break;case'member_joined':title='Jogador entrou';desc=`${p.display_name||'Um jogador'} entrou na campanha.`;break;case'member_left':title='Jogador saiu';desc=`${p.display_name||'Um jogador'} saiu da campanha.`;break;case'member_removed':title='Jogador removido';desc=`${p.display_name||'Um jogador'} foi removido da campanha.`;break;case'turn_advanced':title='Turno avançado';desc=p.description||'A ordem de iniciativa avançou.';break;case'map_move_request':title='Pedido de movimento';desc=`${p.player_name||'Aventureiro'} solicitou a casa ${Number(p.x)+1}, linha ${Number(p.y)+1}.`;break;case'session_note':title=p.kind==='quest'?'Progresso de missão':p.kind==='map'?'Exploração do mapa':p.kind==='trade'?'Comércio':p.kind==='choice'?'Decisão narrativa':p.kind==='equipment'?'Equipamento':p.kind==='loot'?'Espólio':p.kind==='combat'?'Efeito de combate':p.kind==='backup'?'Backup':p.kind==='summary'?'Resumo de sessão':'Diário da campanha';desc=p.text||'Uma anotação foi registrada.';break;default:desc=JSON.stringify(p)}return `<div class="event-item"><strong>${esc(title)}</strong><p>${esc(desc)}</p><time>${new Date(ev.created_at||Date.now()).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</time></div>`}

  function formatChatMessage(ev){const p=ev.payload||{};const mine=ev.actor_id===currentUserId();return `<div class="chat-message ${mine?'mine':''}"><div class="chat-message-meta"><strong>${esc(p.display_name||'Aventureiro')}</strong><time>${new Date(ev.created_at||Date.now()).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</time></div><p>${esc(p.text||'')}</p></div>`}

  function renderMasterGuideModal(){
    const c=state.campaign,gs=c?.game_state||defaultGameState();
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal wide" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="page-kicker">Apenas o mestre</div><h2>Guia de Condução do Mestre</h2><p>Orientações rápidas para narrar, apresentar desafios e conduzir a sessão.</p></div><button class="modal-close" data-action="close-modal">×</button></div><div class="stat-grid"><div class="stat-card"><small>Participantes</small><strong>${state.members.length}</strong></div><div class="stat-card"><small>Estado</small><strong style="font-size:15px">${c.status==='active'?'Ao vivo':'Pausada'}</strong></div><div class="stat-card"><small>Eventos registrados</small><strong>${state.events.length}</strong></div></div><div class="divider"></div><h3>Preparação da aventura</h3><div class="member-list"><div class="member-row"><div class="avatar">✦</div><div><strong>${esc(gs.chapter||'Prólogo')}</strong><small>Capítulo atual</small></div><span class="spacer"></span><span class="tag gold">Crônica</span></div><div class="member-row"><div class="avatar">⌖</div><div><strong>${esc(gs.location||'Local desconhecido')}</strong><small>Localização atual</small></div></div></div><div class="divider"></div><h3>Ações rápidas</h3><div class="hero-actions"><button class="btn btn-secondary" data-action="request-dice">Solicitar D20</button><button class="btn btn-secondary" data-action="start-encounter">Iniciar encontro</button><button class="btn btn-secondary" data-action="open-narration">Publicar narração</button><button class="btn btn-secondary" data-action="open-shop">Abrir comércio</button><button class="btn btn-quiet" data-action="open-book" data-book="master">Livro do Mestre</button><button class="btn btn-secondary" data-action="open-book" data-book="firststeps">Manual para iniciantes</button></div><div class="divider"></div><div class="notice"><strong>Lembrete:</strong> segredos, estatísticas ocultas e revelações devem permanecer na biblioteca do mestre. O que for narrado na sala será compartilhado com todos.</div></section></div>`;
  }
  function renderSettingsModal(){const cfg=loadConfig()||{};modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><div><h2 id="modal-title">Conexão e armazenamento</h2><p>Configure seu projeto Supabase para ativar campanhas compartilhadas entre computadores.</p></div><button class="modal-close" data-action="close-modal" aria-label="Fechar">×</button></div><div class="notice"><strong>Importante:</strong> use a URL do projeto e a Publishable key (sb_publishable_...). Nunca coloque a Secret/service_role key neste site.</div><div class="v4-sound-setting"><div><strong>Efeitos sonoros da mesa</strong><small>Toques discretos para dados, combate e eventos. A preferência fica apenas neste navegador.</small></div><button type="button" class="btn ${gameSoundEnabled()?'btn-primary':'btn-quiet'} btn-small" data-action="toggle-v4-sound">${gameSoundEnabled()?'Áudio ativado':'Áudio desativado'}</button></div><form id="settings-form" style="margin-top:18px"><div class="field"><label for="sb-url">SUPABASE PROJECT URL</label><input class="input" id="sb-url" type="url" placeholder="https://seu-projeto.supabase.co" value="${esc(cfg.url||'')}" required><span class="hint">Encontre no Connect dialog ou em Project Settings → API Keys.</span></div><div class="field"><label for="sb-key">PUBLISHABLE KEY (CHAVE PÚBLICA)</label><textarea class="textarea" id="sb-key" rows="3" placeholder="Cole aqui a chave pública do projeto" required>${esc(cfg.key||'')}</textarea><span class="hint">A Publishable key pode ser usada no navegador quando as políticas RLS estiverem configuradas corretamente. Não use uma Secret key.</span></div><div class="notice">Antes de conectar: execute <strong>supabase-schema.sql</strong>, habilite Anonymous Sign-Ins e Email provider e ative Manual Linking em Authentication → Configuration. Veja o guia Supabase do zero.</div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="disconnect-backend">Usar modo local</button><button type="submit" class="btn btn-primary">Conectar Supabase</button></div></form></section></div>`}
  async function startEncounter(templates){
    if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode iniciar encontros.');
    const selected=Array.isArray(templates)?templates:[templates];if(!selected.length||selected.some(x=>!x))throw new Error('Selecione ao menos uma criatura.');if(selected.length>6)throw new Error('Escolha no máximo seis criaturas.');
    const participants=state.members.filter(m=>m.role==='player'&&m.character);if(!participants.length)throw new Error('É necessário que pelo menos um jogador tenha criado um personagem antes de iniciar o combate.');
    const gs=state.campaign.game_state||defaultGameState(),partyState={...(gs.partyState||{})};participants.forEach(m=>{const ch=normalizeCharacter(m.character),old=partyState[m.user_id]||{};partyState[m.user_id]={hp:Math.max(0,Math.min(Number(old.baseMaxHp)||Number(old.maxHp)||ch.maxHp,Number.isFinite(Number(old.hp))?Number(old.hp):ch.hp)),maxHp:Number(old.baseMaxHp)||Number(old.maxHp)||ch.maxHp,baseMaxHp:Number(old.baseMaxHp)||Number(old.maxHp)||ch.maxHp,defense:ch.defense,inventory:Array.isArray(old.inventory)?old.inventory:ch.inventory,equipment:old.equipment||ch.equipment,baseDefense:old.baseDefense||ch.defense,coins:Number(old.coins)||0,abilityUsed:false}});
    const avg=participants.reduce((n,m)=>n+normalizeCharacter(m.character).level,0)/participants.length;
    const enemies=selected.map((t,i)=>{const gap=Math.max(0,avg-Number(t.level||1)),scale=1+Math.min(2.5,gap*.055),boss=/CHEFE/.test(t.threat||''),e={...t,id:`enemy-${Date.now()}-${i}-${Math.random().toString(36).slice(2,6)}`,templateId:t.id,footprint:creatureFootprint(t.id,boss),hp:Math.round(t.hp*(boss?1.35:1.18)*scale),maxHp:Math.round(t.maxHp*(boss?1.35:1.18)*scale),defense:t.defense+Math.floor(gap*.12)+1,attackBonus:t.attackBonus+Math.floor(gap*.16)+1,damageBonus:t.damageBonus+1,defeated:false,bossPhase:1};if(isBossTemplate(e)){e.baseDefense=e.defense;e.baseAttackBonus=e.attackBonus;Object.assign(e,applyBossPhase(e))}return e});
    const readyParticipants=participants.filter(m=>Number(partyState[m.user_id]?.hp)>0);if(!readyParticipants.length)throw new Error('Todos os aventureiros estão sem HP. Recupere a companhia antes de iniciar outro encontro.');
    const first=enemies[0],enc={...first,id:crypto.randomUUID?crypto.randomUUID():`enc-${Date.now()}`,enemies,round:1,turnIndex:0,specialUsed:false,breathPhases:[],defeated:false,partyDefeated:false,xpAwarded:false,lootAwarded:false,participantIds:participants.map(m=>m.user_id),xpReward:enemies.reduce((n,e)=>n+Number(e.xpReward||0),0),hp:enemies.reduce((n,e)=>n+e.hp,0),maxHp:enemies.reduce((n,e)=>n+e.maxHp,0),movementUsed:{}};
    enc.turnOrder=buildTurnOrder(enc,state.members,partyState);const openingTurn=activeCombatTurn(enc);enc.displayEnemyId=openingTurn?.kind==='monster'?openingTurn.id:first.id;const ex=explorationData(gs),rec=activeMapRecord(gs);
    const partyTokens=mapTokens(rec,{...gs,encounter:null}).filter(t=>t.kind==='player');
    const occupiedCells=expandedOccupied(partyTokens),placed=[];
    for(const enemy of enemies){
      const footprint=enemy.footprint||{w:1,h:1},used=new Set(occupiedCells.map(p=>`${p.x},${p.y}`)),candidates=[];
      for(let y=0;y<MAP_HEIGHT;y++)for(let x=0;x<MAP_WIDTH;x++)if(positionFitsFootprint(ex.mapId,x,y,footprint,used,rec)){
        const nearest=partyTokens.length?Math.min(...partyTokens.map(t=>Math.abs(t.position.x-x)+Math.abs(t.position.y-y))):0;
        candidates.push({x,y,score:nearest*5+(y<=3?5:0)+(x<=4?2:0)});
      }
      candidates.sort((a,b)=>b.score-a.score||a.y-b.y||a.x-b.x);
      const pos=candidates[0];if(!pos)throw new Error(`Não há espaço contínuo para posicionar ${enemy.name} (base ${footprint.w}×${footprint.h}). Escolha outro mapa ou reduza o grupo.`);
      rec.tokens[enemy.id]={x:pos.x,y:pos.y};placed.push({id:enemy.id,position:pos,footprint});occupiedCells.push(...footprintCells(pos.x,pos.y,footprint));
    }
    setActiveMapRecord(ex,rec);
    await updateGameState({encounter:enc,partyState,exploration:ex});await createEvent('encounter_started',{monster:enemies.map(e=>e.name).join(', '),enemies:enemies.map(e=>({id:e.id,name:e.name})),round:1,turn_order:enc.turnOrder});toast(`Encontro iniciado: ${enemies.length} criatura(s).`);
  }
  function renderEncounterModal(){
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal wide" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="page-kicker">Bestiário de Aethra</div><h2>Escolher criatura</h2><p>Marque uma ou mais criaturas. Cada uma terá HP, miniatura, posição e turno próprios.</p></div><button class="modal-close" data-action="close-modal">×</button></div><form id="encounter-form"><div class="notice">Marque uma ou mais criaturas para formar o grupo inimigo (máximo de seis). Cada uma terá sua própria peça no tabuleiro.</div><div class="encounter-art-grid">${MONSTERS.map((m,i)=>`<label class="encounter-art-card"><input type="checkbox" name="monster" value="${m.id}"><span class="encounter-art-thumb">${mapMonsterMiniature({templateId:m.id,name:m.name,boss:/CHEFE/i.test(m.threat||'')})}</span><span class="encounter-art-copy"><strong>${esc(m.name)}</strong><small>${esc(m.kind)} · Nível ${m.level}</small><small>${m.hp} HP · Defesa ${m.defense} · ${m.xpReward} XP</small><small>Base ${creatureFootprint(m.id,/CHEFE/i.test(m.threat||'')).w}×${creatureFootprint(m.id,/CHEFE/i.test(m.threat||'')).h} · ${/CHEFE/i.test(m.threat||'')?'chefe':'criatura'}</small><em>${esc(m.specialName)}</em></span></label>`).join('')}</div><div class="notice">Personagens e criaturas com ficha entram na iniciativa. O mestre controla a resolução dos turnos dos monstros.</div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button type="submit" class="btn btn-primary">Iniciar encontro</button></div></form></section></div>`;
    modalRoot.querySelectorAll('input[name="monster"]').forEach(r=>r.addEventListener('change',()=>{const checked=[...modalRoot.querySelectorAll('input[name="monster"]:checked')];if(checked.length>6){r.checked=false;toast('O limite é de seis criaturas.','error')}modalRoot.querySelectorAll('.encounter-art-card').forEach(card=>card.classList.toggle('selected',!!card.querySelector('input')?.checked))}));
  }

  function renderRollPromptModal(){
    const players=state.members.filter(m=>m.role==='player');
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><div><h2>Solicitar teste de D20</h2><p>Escolha quem deverá rolar e explique o teste.</p></div><button class="modal-close" data-action="close-modal">×</button></div><form id="roll-prompt-form"><div class="field"><label for="roll-target">QUEM DEVE ROLAR?</label><select class="select" id="roll-target"><option value="all">Todos os jogadores</option>${players.map(m=>`<option value="${esc(m.user_id)}">${esc(m.display_name||'Aventureiro')}</option>`).join('')}</select></div><div class="field"><label for="roll-reason">QUAL É O TESTE?</label><input class="input" id="roll-reason" maxlength="140" placeholder="Ex.: Teste de percepção para encontrar armadilhas" value="Teste de D20"></div><div class="notice">Cada jogador selecionado poderá responder uma única vez. O navegador do mestre calcula e publica o resultado.</div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button class="btn btn-primary" type="submit" ${players.length?'':'disabled'}>Solicitar rolagem</button></div></form></section></div>`;
  }

  function renderCreateModal(){modalRoot.innerHTML=`<div class="modal-backdrop" data-modal-kind="create" data-action="backdrop-close"><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><div><h2>Criar uma nova campanha</h2><p>Você será o mestre e terá controle sobre esta crônica.</p></div><button class="modal-close" data-action="close-modal">×</button></div><form id="create-form"><div class="field"><label for="campaign-name">NOME DA CAMPANHA</label><input class="input" id="campaign-name" maxlength="70" placeholder="Ex.: O Chamado da Deusa" required></div><div class="field"><label for="campaign-desc">DESCRIÇÃO (OPCIONAL)</label><textarea class="textarea" id="campaign-desc" maxlength="500" placeholder="Conte aos jogadores um pouco sobre a aventura..."></textarea></div><div class="notice">A campanha será salva ${state.backendReady?'no Supabase e poderá ser acessada por outros computadores.':'localmente neste navegador. Configure o Supabase para jogar com amigos pela internet.'}</div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button class="btn btn-primary" type="submit">Criar campanha ✦</button></div></form></section></div>`}
  function renderJoinModal(){modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><div><h2>Entrar em uma campanha</h2><p>Informe o código compartilhado pelo mestre.</p></div><button class="modal-close" data-action="close-modal">×</button></div><form id="join-form"><div class="field"><label for="join-code">CÓDIGO DA CAMPANHA</label><input class="input" id="join-code" placeholder="AETHRA-0000" value="${esc(state.prefillJoinCode||'')}" style="text-transform:uppercase;letter-spacing:2px" required></div><div class="field"><label for="join-name">NOME PARA EXIBIÇÃO</label><input class="input" id="join-name" maxlength="40" placeholder="Como os outros jogadores verão você?" required></div><div class="notice">Ao entrar, você aparecerá no salão dos aventureiros. Sua ficha poderá ser criada ou editada antes do início da sessão.</div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button type="submit" class="btn btn-primary">Entrar na campanha →</button></div></form></section></div>`}
  function renderCharacterModal(){const d=state.charDraft||newCharacterDraft(),step=state.charStep;const steps=['Identidade','Origem','Classe','Atributos','Resumo'];let body='';
    if(step===0)body=`<div class="field"><label for="char-name">NOME DO PERSONAGEM</label><input class="input" id="char-name" maxlength="40" placeholder="Ex.: Aldric, o Guardião" value="${esc(d.name)}"></div><div class="field"><label for="char-age">IDADE (OPCIONAL)</label><input class="input" id="char-age" type="number" min="1" max="999" placeholder="Ex.: 27" value="${esc(d.age||'')}"></div><div class="field"><label for="char-personality">PERSONALIDADE E HISTÓRIA</label><textarea class="textarea" id="char-personality" placeholder="Como seu personagem age? O que o trouxe até esta aventura?">${esc(d.personality||'')}</textarea><span class="hint">Não precisa escrever uma biografia inteira. Algumas ideias já ajudam o mestre a criar momentos personalizados.</span></div>`;
    if(step===1)body=`<h3>Escolha o reino de origem</h3><div class="realm-choice-grid">${REALMS.map(r=>`<button type="button" class="realm-choice-card ${d.realm===r.name?'selected':''}" data-choice="realm" data-value="${r.name}"><img src="assets/realms/${r.id}.webp" alt="Paisagem de ${r.name}" loading="lazy"><span class="realm-choice-copy"><strong>${r.emoji} ${r.name}</strong><small>${r.subtitle}</small><small>${r.desc}</small><em>${r.bonus}</em></span></button>`).join('')}</div><div class="divider"></div><h3>Escolha sua raça</h3><div class="choice-grid">${RACES.map(r=>`<button type="button" class="choice-card ${d.race===r[0]?'selected':''}" data-choice="race" data-value="${r[0]}"><strong>${r[0]}</strong><small>${r[1]}</small></button>`).join('')}</div>`;
    if(step===2)body=`<h3>Escolha sua classe</h3><p class="panel-subtitle">Cada classe possui um retrato próprio, função no grupo e habilidade característica.</p><div class="class-art-grid">${CLASSES.map(c=>`<button type="button" class="class-art-card ${d.class===c[0]?'selected':''}" data-choice="class" data-value="${c[0]}"><span class="class-art-image">${portraitImage(classPortrait(c[0]),c[0])}<span class="class-art-symbol">${c[2]}</span></span><span class="class-art-copy"><strong>${c[0]}</strong><small>${c[1]}</small><em>${esc(classRule({class:c[0]}).abilityName)}</em></span></button>`).join('')}</div>`;
    if(step===3)body=`<h3>Distribua seus atributos</h3><p class="panel-subtitle">Você tem 24 pontos para distribuir. Cada atributo começa em 1 e pode chegar a 8 nesta criação inicial.</p><div class="notice" style="margin:12px 0">Pontos disponíveis: <strong id="points-left">${24-Object.values(d.attributes).reduce((a,b)=>a+b,0)}</strong> · Ajuste os controles para combinar com seu estilo.</div>${ATTRS.map(a=>`<div class="attribute-row"><div><strong>${a[1]}</strong><small>${a[2]}</small></div><input type="range" min="1" max="8" value="${d.attributes[a[0]]}" data-attribute="${a[0]}"><b id="attr-${a[0]}">${d.attributes[a[0]]}</b></div>`).join('')}`;
    if(step===4){const cl=CLASSES.find(x=>x[0]===d.class);const realm=REALMS.find(x=>x.name===d.realm);body=`<div class="character-art-preview"><div class="character-art-portrait">${portraitImage(classPortrait(d.class),d.name||d.class)}<span class="character-level-badge">NÍVEL 1</span></div><div class="character-art-summary"><span class="tag gold">Prévia da ficha</span><h2 class="page-title" style="margin:12px 0 6px">${esc(d.name||'Aventureiro sem nome')}</h2><p class="panel-subtitle">${esc(d.race)} · ${esc(d.class)} · ${esc(d.realm)}</p><p class="panel-subtitle">${esc(cl?.[1]||'')} ${realm?'Origem: '+esc(realm.subtitle)+'.':''}</p><div class="divider"></div><div class="stat-grid"><div class="stat-card"><small>HP Máximo</small><strong>${normalizeCharacter(d).maxHp}</strong></div><div class="stat-card"><small>Defesa</small><strong>${normalizeCharacter(d).defense}</strong></div><div class="stat-card"><small>Nível</small><strong>1</strong></div></div><div class="divider"></div><div class="stat-grid">${ATTRS.map(a=>`<div class="stat-card"><small>${a[1]}</small><strong>${d.attributes[a[0]]}</strong></div>`).join('')}</div><div class="divider"></div><p class="panel-subtitle"><strong>Habilidade:</strong> ${esc(classRule(d).abilityName)} — ${esc(classRule(d).abilityDescription)}</p><p class="panel-subtitle"><strong>Arma:</strong> ${esc(normalizeCharacter(d).equipment.weapon.name)} · <strong>Armadura:</strong> ${esc(normalizeCharacter(d).equipment.armor.name)}</p><p class="panel-subtitle"><strong>Personalidade:</strong> ${esc(d.personality||'Ainda não definida.')}</p></div></div><div class="notice" style="margin-top:14px">Sua ficha começa no nível 1. O sistema calcula HP, defesa, equipamento inicial e habilidade de classe. Durante o combate, HP e itens consumidos serão salvos na campanha.</div>`}
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close" data-modal-kind="character"><section class="modal wide" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="page-kicker">Criação guiada de personagem</div><h2>${steps[step]} · Etapa ${step+1} de 5</h2><p>Leia as orientações e escolha com calma. Você poderá ajustar a ficha antes da aventura.</p></div><button class="modal-close" data-action="close-modal">×</button></div><div class="wizard-progress">${steps.map((_,i)=>`<span class="${i<=step?'done':''}"></span>`).join('')}</div><div id="char-step-body">${body}</div><div class="modal-actions"><button class="btn btn-quiet" data-action="char-prev" ${step===0?'disabled':''}>← Voltar</button><button class="btn btn-primary" data-action="char-next">${step===4?'Salvar personagem':'Continuar →'}</button></div></section></div>`;
  }
  function newCharacterDraft(){return{name:'',age:'',personality:'',realm:'Eldoria',race:'Humano',class:'Guerreiro',level:1,attributes:{forca:5,destreza:4,constituicao:5,inteligencia:3,sabedoria:4,carisma:3}}}
  function renderBookModal(){
    const b=BOOKS.find(x=>x.id===state.currentBook);if(!b){state.modal=null;return}
    const chapters=BOOK_CONTENT[b.id]||[];
    const body=chapters.map((chapter,i)=>`<article class="book-chapter"><div class="page-kicker">Capítulo ${String(i+1).padStart(2,'0')}</div><h3>${esc(chapter[0])}</h3><p>${esc(chapter[1])}</p><ul>${chapter[2].map(item=>`<li>${esc(item)}</li>`).join('')}</ul></article>`).join('');
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal wide book-reader" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="page-kicker">Biblioteca de Aethra · ${b.access} · Edição v4.2.4 · regras, campanha e combate</div><h2>${b.title}</h2><p>${b.desc}</p></div><button class="modal-close" data-action="close-modal">×</button></div><div class="notice">Este livro reúne as orientações atuais do Reino de Aethra. Consulte também o Guia do Modo Chamada v4.1.1 e os manuais anteriores.</div><div class="book-reader-content">${body}</div></section></div>`;
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
      body=`<form id="account-login-form"><div class="field"><label for="account-email">E-MAIL</label><input class="input" id="account-email" type="email" autocomplete="username" required></div><div class="field"><label for="account-login-password">SENHA</label><input class="input" id="account-login-password" type="password" autocomplete="current-password" required></div><div class="row between"><button type="button" class="text-button" data-action="account-mode" data-mode="reset">Esqueci minha senha</button><button type="button" class="text-button" data-action="account-mode" data-mode="home">Voltar</button></div><div class="notice">Entre com a conta criada ao salvar o progresso no outro dispositivo. Mesmo que este aparelho tenha sido usado como visitante, você pode entrar normalmente; o progresso visitante temporário será descartado e as campanhas da conta serão carregadas.</div><div class="modal-actions"><button class="btn btn-primary" type="submit">Entrar</button></div></form>`;
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
    const actionClass=Number(payload.healing)>0?'token-heal':payload.hit===false?'token-miss':Number(payload.natural)===20?'token-critical':monsterAction?'token-monster-attack':payload.action==='ability'?'token-cast':'token-attack';
    const pulse=(token,cls)=>{if(!token)return;token.classList.remove('token-attack','token-cast','token-heal','token-miss','token-monster-attack','token-hit','token-critical');void token.offsetWidth;token.classList.add(cls);window.setTimeout(()=>token.classList.remove(cls),1050)};
    pulse(attacker,actionClass);
    if(monsterAction&&attacker?.querySelector('.monster-drakthar')&&(/sopro|cinzas|chama/i.test(payload.description||'')||Array.isArray(payload.affected)&&payload.affected.length>1)){attacker.classList.add('token-boss-breath');window.setTimeout(()=>attacker.classList.remove('token-boss-breath'),1250)}
    if(monsterAction&&Array.isArray(payload.affected)){payload.affected.forEach(item=>pulse(findToken(item.name),'token-hit'))}
    else if(target&&Number(payload.damage)>0)pulse(target,'token-hit');
  }
  function showCombatFX(payload={}){
    const healed=Number(payload.healing)>0;const critical=Number(payload.natural)===20&&payload.hit!==false;const missed=payload.hit===false;const monster=!!payload.monsterAction;const magic=payload.action==='ability'&&!healed;const kind=healed?'heal':critical?'critical':missed?'miss':monster?'monster':magic?'magic':'physical';
    const title=healed?'Energia restauradora':critical?'Acerto crítico!':missed?'Ataque evitado':monster?'Ataque da criatura':magic?'Poder arcano':'Golpe de combate';
    const detail=payload.description||((Number(payload.damage)||0)>0?`${payload.damage} de dano`:'Ação resolvida');
    animateMapCombat(payload,monster);
    const node=document.createElement('div');node.className=`combat-fx combat-fx-${kind}`;node.innerHTML=`<span class="combat-fx-symbol">${healed?'✚':critical?'✹':missed?'◌':monster?'☠':magic?'✧':'⚔'}</span><span><strong>${esc(title)}</strong><small>${esc(detail)}</small></span>`;document.body.append(node);playCombatFXSound(kind);setTimeout(()=>node.remove(),2100);
  }
  function playCombatFXSound(kind){playGameSound(kind==='physical'?'hit':kind)}
  const V4_SOUND_KEY='aethra.v4.sound.enabled';
  function gameSoundEnabled(){try{return localStorage.getItem(V4_SOUND_KEY)==='1'}catch{return false}}
  function setGameSoundEnabled(enabled){try{if(enabled)localStorage.setItem(V4_SOUND_KEY,'1');else localStorage.removeItem(V4_SOUND_KEY)}catch(error){console.warn('A preferência de áudio não pôde ser salva neste navegador.',error)}}
  function playGameSound(kind='confirm'){
    if(!gameSoundEnabled())return;
    const AudioContextClass=window.AudioContext||window.webkitAudioContext;if(!AudioContextClass)return;
    const presets={
      dice:{type:'triangle',notes:[260,330,392,494],duration:.075,volume:.035},
      hit:{type:'sawtooth',notes:[155,110],duration:.09,volume:.045},
      physical:{type:'triangle',notes:[210,145,110],duration:.07,volume:.03},
      critical:{type:'sawtooth',notes:[330,494,659],duration:.09,volume:.04},
      magic:{type:'sine',notes:[540,720,900],duration:.1,volume:.025},
      heal:{type:'sine',notes:[440,554,660],duration:.11,volume:.025},
      encounter:{type:'triangle',notes:[220,330,440],duration:.11,volume:.03},
      monster:{type:'triangle',notes:[190,145,120],duration:.12,volume:.035},
      victory:{type:'sine',notes:[392,494,587,784],duration:.13,volume:.04},
      defeat:{type:'sawtooth',notes:[220,165,110],duration:.15,volume:.035},
      turn:{type:'sine',notes:[330,440],duration:.1,volume:.025},
      story:{type:'sine',notes:[523,659],duration:.12,volume:.025},
      confirm:{type:'triangle',notes:[440,587],duration:.08,volume:.025},
      miss:{type:'triangle',notes:[240,190],duration:.08,volume:.02}
    };
    const preset=presets[kind]||presets.confirm;
    try{
      const ctx=new AudioContextClass(),start=ctx.currentTime;
      preset.notes.forEach((frequency,index)=>{const at=start+index*preset.duration,osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=preset.type;osc.frequency.setValueAtTime(frequency,at);gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(preset.volume,at+.012);gain.gain.exponentialRampToValueAtTime(.0001,at+preset.duration*.9);osc.connect(gain);gain.connect(ctx.destination);osc.start(at);osc.stop(at+preset.duration)});
      setTimeout(()=>ctx.close().catch(()=>{}),preset.notes.length*preset.duration*1000+180);
    }catch(error){console.warn('Não foi possível reproduzir o efeito sonoro.',error)}
  }
  function playEventSound(eventType){
    const type=({encounter_started:'encounter',encounter_defeated:'victory',party_defeated:'defeat',turn_advanced:'turn',narration:'story'})[eventType];
    if(type)playGameSound(type);
  }
  function playDiceSound(){playGameSound('dice')}

  // Arrastar miniaturas diretamente sobre o cenário ilustrado. O clique em casas continua disponível,
  // inclusive para dispositivos móveis que não oferecem drag-and-drop.
  document.addEventListener('dragstart',e=>{
    const piece=e.target.closest('.map-token[draggable="true"]');if(!piece)return;
    state.draggingMapToken=piece.dataset.tokenId||null;
    if(e.dataTransfer){e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',state.draggingMapToken||'')}
    piece.classList.add('dragging');
  });
  document.addEventListener('dragend',e=>{e.target.closest('.map-token')?.classList.remove('dragging');state.draggingMapToken=null;document.querySelectorAll('.map-cell.drop-target').forEach(cell=>cell.classList.remove('drop-target'))});
  document.addEventListener('dragover',e=>{const cell=e.target.closest('.map-cell');if(!cell||!state.draggingMapToken)return;e.preventDefault();if(e.dataTransfer)e.dataTransfer.dropEffect='move';cell.classList.add('drop-target')});
  document.addEventListener('dragleave',e=>{const cell=e.target.closest('.map-cell');if(cell&&!cell.contains(e.relatedTarget))cell.classList.remove('drop-target')});
  document.addEventListener('drop',async e=>{
    const cell=e.target.closest('.map-cell');if(!cell||!state.draggingMapToken)return;
    e.preventDefault();e.stopPropagation();
    const tokenId=state.draggingMapToken,x=Number(cell.dataset.x),y=Number(cell.dataset.y);state.draggingMapToken=null;
    document.querySelectorAll('.map-cell.drop-target').forEach(item=>item.classList.remove('drop-target'));
    try{
      if(isMaster()){state.selectedMapToken=tokenId;const free=state.selectedMapTool==='setup-move';await moveMapToken(tokenId,x,y,null,null,free)}
      else if(tokenId===currentUserId())await requestMapMove(x,y);
      else throw new Error('Você só pode arrastar a miniatura do seu próprio personagem.');
    }catch(err){toast(err.message,'error')}
    finally{document.querySelectorAll('.map-token.dragging').forEach(item=>item.classList.remove('dragging'))}
  });
  // Ações da interface
  document.addEventListener('change',async e=>{
    try{
      if(e.target.id==='music-file-input'){await uploadMusicFiles(e.target.files);e.target.value='';}
      else if(e.target.matches('[data-music-global-volume]')){const v=Math.max(0,Math.min(1,Number(e.target.value)/100));await saveMusicState({globalVolume:v});}
      else if(e.target.matches('[data-music-local-volume]'))setMusicLocalPrefs({volume:Math.max(0,Math.min(1,Number(e.target.value)/100))});
    }catch(err){toast(err.message||'Não foi possível atualizar a música.','error')}
  });
  document.addEventListener('input',e=>{if(e.target.matches('[data-music-local-volume]')){setMusicLocalPrefs({volume:Math.max(0,Math.min(1,Number(e.target.value)/100))});const label=e.target.closest('label');if(label)label.title=`${e.target.value}%`}});
  document.addEventListener('submit',async e=>{if(e.target.id==='music-link-form'){e.preventDefault();try{await addMusicLink($('#music-link-name').value,$('#music-link-url').value.trim())}catch(err){toast(err.message||'Não foi possível adicionar o link.','error')}}else if(e.target.id==='music-youtube-form'){e.preventDefault();try{await addMusicYouTubeLink($('#music-youtube-name').value,$('#music-youtube-url').value.trim())}catch(err){toast(err.message||'Não foi possível adicionar o vídeo do YouTube.','error')}}});
  document.addEventListener('click',async e=>{
    const btn=e.target.closest('[data-action]');if(!btn)return;const action=btn.dataset.action;
    if(action==='backdrop-close'&&e.target===btn){closeModal();return}
    try{
      if(action==='go-home'){state.view='home';closeModal();render()}
      else if(action==='v411-reconnect'){await retryCampaignConnection()}
      else if(action==='v411-open-notifications'){state.modal='v411-notifications';render()}
      else if(action==='v411-mark-notifications-read'){v411MarkNotificationsRead();renderV411NotificationsModal();render();toast('Notificações marcadas como lidas neste dispositivo.')}
      else if(action==='v411-undo-last'){await undoV411LastAction()}
      else if(action==='open-library'){state.view='library';closeModal();render()}
      else if(action==='my-campaigns'){state.view='campaigns';closeModal();render();loadCloudCampaigns()}
      else if(action==='open-settings')openModal('settings')
      else if(action==='toggle-v4-sound'){const enabled=!gameSoundEnabled();setGameSoundEnabled(enabled);if(enabled)playGameSound('confirm');renderSettingsModal();toast(enabled?'Efeitos sonoros ativados neste navegador.':'Efeitos sonoros desativados.');}
      else if(action==='voice-configure'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode configurar a chamada.');state.modal='voice-link';render()}
      else if(action==='voice-toggle'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode alterar o Modo Chamada.');const gs=state.campaign.game_state||defaultGameState(),v4=v4GameData(gs),voice={...v4.voiceSession,enabled:!v4.voiceSession?.enabled};v4.voiceSession=voice;await updateGameState({v4});toast(voice.enabled?'Modo Chamada ativado para a companhia.':'Modo Chamada desativado.')}
      else if(action==='voice-open-call'){const url=safeVoiceSessionLink();if(!url)throw new Error('O link da chamada não está configurado ou não pertence à plataforma selecionada.');const opened=window.open(url,'_blank','noopener,noreferrer');if(!opened)toast('O navegador bloqueou a nova aba. Copie o convite e abra-o manualmente.','error')}
      else if(action==='voice-copy-invite'){const invite=location.href.split('?')[0]+'?join='+encodeURIComponent(state.campaign.code);await copyTextToClipboard(invite);toast('Convite da campanha copiado. Envie também o link da chamada.')}
      else if(action==='voice-send-action'){const voice=v4GameData().voiceSession;if(!voice.enabled)throw new Error('O Modo Chamada está desativado.');if(isMaster())throw new Error('O mestre não envia intenções de jogador.');const actionInfo=VOICE_PLAYER_ACTIONS.find(a=>a.id===btn.dataset.voiceAction);if(!actionInfo)throw new Error('Ação rápida inválida.');await createEvent('voice_action_request',{action_id:actionInfo.id,action_label:actionInfo.label,player_name:state.member?.character?.name||state.member?.display_name||'Aventureiro'});toast(`Intenção enviada: ${actionInfo.label}.`)}
      else if(action==='voice-resolve-action'){await resolveVoiceActionRequest(btn.dataset.requestId,true)}
      else if(action==='voice-dismiss-action'){await resolveVoiceActionRequest(btn.dataset.requestId,false)}
      else if(action==='voice-open-roll'||action==='v41-open-roll'||action==='request-dice'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode solicitar testes.');state.modal='v41-roll';render()}
      else if(action==='v423-open-dice'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode usar o Rolador Universal.');state.v423LastRoll=null;state.modal='v423-dice';render()}
      else if(action==='v423-apply-roll'){await applyV423DiceResult()}
      else if(action==='v41-toggle-ready'){await toggleV41Ready()}
      else if(action==='v41-open-checkpoints'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode administrar pontos de restauração.');state.modal='v41-checkpoints';render()}
      else if(action==='v41-create-checkpoint'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode criar pontos de restauração.');const gs=state.campaign.game_state||defaultGameState(),v=v41GameData(gs);await updateGameState({v41:{...v,snapshots:[...v.snapshots, ...createV41Checkpoint(gs,'Ponto manual do mestre').snapshots.filter(x=>!v.snapshots.some(old=>old.id===x.id))].slice(-3)}});state.modal='v41-checkpoints';render();toast('Ponto de restauração criado.')}
      else if(action==='v41-restore-checkpoint'){await restoreV41Checkpoint(btn.dataset.checkpointId);state.modal='v41-checkpoints';render()}
      else if(action==='open-bestiary'){state.bestiarySearch='';state.bestiaryKind='all';state.bestiarySelectedId=MONSTERS[0]?.id||null;state.bestiaryEncounterIds=[];state.modal='v41-bestiary';render()}
      else if(action==='v41-bestiary-select'){state.bestiarySelectedId=btn.dataset.monsterId;render()}
      else if(action==='v41-bestiary-toggle-encounter'){const id=btn.dataset.monsterId;if(!state.bestiaryEncounterIds.includes(id)&&state.bestiaryEncounterIds.length>=6)throw new Error('Uma composição pode conter até seis tipos de criatura.');state.bestiaryEncounterIds=state.bestiaryEncounterIds.includes(id)?state.bestiaryEncounterIds.filter(x=>x!==id):[...state.bestiaryEncounterIds,id];renderV41BestiaryModal()}
      else if(action==='v41-bestiary-clear'){state.bestiaryEncounterIds=[];renderV41BestiaryModal()}
      else if(action==='v41-bestiary-save-preset'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre pode salvar encontros.');if(!state.bestiaryEncounterIds.length)throw new Error('Adicione ao menos uma criatura.');const name=window.prompt('Nome para esta composição de encontro:','Encontro preparado');if(!name||!name.trim())return;const gs=state.campaign.game_state||defaultGameState(),v=v4GameData(gs),preset={id:`preset-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,name:name.trim().slice(0,70),monsterIds:[...state.bestiaryEncounterIds],createdAt:new Date().toISOString()};await updateGameState({v4:{...v,encounterPresets:[...v.encounterPresets,preset].slice(-30)}});renderV41BestiaryModal();toast('Composição salva no bestiário da campanha.')}
      else if(action==='v41-bestiary-start-selected'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre pode iniciar encontros.');const templates=MONSTERS.filter(m=>state.bestiaryEncounterIds.includes(m.id));if(!templates.length)throw new Error('Selecione ao menos uma criatura.');closeModal();await startEncounter(templates)}
      else if(action==='v41-bestiary-start'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode preparar encontros.');const m=MONSTERS.find(x=>x.id===btn.dataset.monsterId);if(!m)throw new Error('Criatura não encontrada.');closeModal();await startEncounter([m])}
      else if(action==='v41-preset-start'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre pode iniciar encontros salvos.');const preset=v4GameData().encounterPresets.find(p=>p.id===btn.dataset.presetId);if(!preset)throw new Error('Composição não encontrada.');const templates=MONSTERS.filter(m=>(preset.monsterIds||[]).includes(m.id));if(!templates.length)throw new Error('A composição não contém criaturas válidas.');closeModal();await startEncounter(templates)}
      else if(action==='v41-preset-delete'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre pode remover encontros salvos.');const gs=state.campaign.game_state||defaultGameState(),v=v4GameData(gs);await updateGameState({v4:{...v,encounterPresets:v.encounterPresets.filter(p=>p.id!==btn.dataset.presetId)}});renderV41BestiaryModal();toast('Composição removida.')}
      else if(action==='open-journal'){state.journalSearch='';state.journalFilter='all';state.modal='v41-journal';render()}
      else if(action==='v41-journal-export'){const text=v41JournalRows().map(r=>`${new Date(r.at).toLocaleString('pt-BR')} [${r.kind}] ${r.text}`).join('\n');const blob=new Blob([text],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`aethra-linha-do-tempo-${state.campaign?.code||'campanha'}.txt`;a.click();URL.revokeObjectURL(url)}
      else if(action==='v41-journal-save-summary'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode salvar o resumo.');const summary=v41JournalSummary();const gs=state.campaign.game_state||defaultGameState(),v=v4GameData(gs);await updateGameState({v4:{...v,lastSessionSummary:summary}});await createEvent('session_note',{kind:'summary',text:'Resumo da sessão atualizado a partir da linha do tempo.'});renderV41JournalModal();toast('Resumo da sessão salvo na campanha.')}
      else if(action==='v41-clear-map-pings'){await clearV41MapPings()}
      else if(action==='voice-quick-note'){await saveVoiceQuickNote(btn.dataset.note)}
      else if(action==='open-account'){state.accountMode='home';openModal('account')}
      else if(action==='account-mode'){state.accountMode=btn.dataset.mode||'home';render()}
      else if(action==='account-sign-out'){await signOutAccount();closeModal();render()}
      else if(action==='create-campaign')openModal('create')
      else if(action==='join-campaign')openModal('join')
      else if(action==='close-modal')closeModal()
      else if(action==='disconnect-backend')disconnectSupabase()
      else if(action==='open-book'){state.currentBook=btn.dataset.book;state.modal='book';render()}
      else if(action==='open-cloud-campaign'){await openCloudCampaign(btn.dataset.id)}

      else if(action==='delete-campaign'){await deleteCampaignById(btn.dataset.id||state.campaign?.id)}
      else if(action==='leave-campaign'||action==='leave-campaign-card'){if(action==='leave-campaign-card'&&btn.dataset.id){const c=state.cloudCampaigns.find(x=>x.id===btn.dataset.id);if(!c)throw new Error('Campanha não encontrada.');if(c.owner_id===state.user?.id)throw new Error('O mestre deve excluir a campanha, não sair dela.');const ok=window.confirm(`Deseja sair da campanha \"${c.name}\"? Seu personagem e o progresso da campanha continuarão salvos para os demais participantes.`);if(!ok)return;const {error}=await state.backend.rpc('leave_campaign',{p_campaign_id:c.id});if(error)throw error;toast('Você saiu da campanha.');await loadCloudCampaigns();return;}await leaveCurrentCampaign()}
      else if(action==='remove-participant'){await removeCampaignParticipant(btn.dataset.userId)}
      else if(action==='open-local-campaign'){const c=localCampaignById(btn.dataset.id);if(c){state.campaign=c;state.member=c.members.find(m=>m.user_id==='local-user')||c.members[0];state.members=c.members;state.events=c.events||[];state.pendingDamage=state.events.filter(e=>e.event_type==='damage_request');state.pendingMapMoves=pendingMapMovesFrom(state.events);state.pendingMapInteractions=pendingMapInteractionsFrom(state.events);state.pendingWorldInteractions=state.events.filter(ev=>ev.event_type==='world_interaction_request');setActiveCampaignId(c.id);state.view=c.status==='active'?'session':'lobby';closeModal();render()}}
      else if(action==='copy-code'){await navigator.clipboard?.writeText(state.campaign.code);toast('Código copiado.');}
      else if(action==='copy-invite'){const link=location.href.split('?')[0]+'?join='+encodeURIComponent(state.campaign.code);await navigator.clipboard?.writeText(link);toast('Link de convite copiado.');}
      else if(action==='create-character')openModal('character')
      else if(action==='char-prev'){if(state.charStep>0){state.charStep--;render()}}
      else if(action==='char-save'){await saveCharacter(state.charDraft);closeModal();render()}
      else if(action==='start-session'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre pode iniciar a sessão.');const gs=state.campaign.game_state||defaultGameState(),v=v41GameData(gs),players=state.members.filter(m=>m.role==='player'),ready=players.filter(m=>v.session.readyBy[m.user_id]).length;if(players.length&&ready<players.length&&!window.confirm(`Somente ${ready} de ${players.length} jogadores marcaram que estão prontos. Iniciar mesmo assim?`))return;const checkpoint=createV41Checkpoint(gs,'Antes do início da sessão');checkpoint.session={...checkpoint.session,status:'live',startedAt:new Date().toISOString(),pausedAt:null};await updateGameState({started:true,v41:checkpoint},'active');state.view='session';render();toast('Sessão iniciada. Ponto de restauração criado.')}
      else if(action==='pause-session'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre pode encerrar a sessão.');state.modal='v411-close-session';render()}
      else if(action==='open-lobby'){state.view='lobby';render()}
      else if(action==='request-dice'){if(state.modal==='masterGuide')closeModal();openModal('rollPrompt')}
      else if(action==='cancel-roll-prompt'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode cancelar a solicitação.');await updateGameState({activeRollPrompt:null});toast('Solicitação de rolagem cancelada.')}
      else if(action==='roll-dice'){
        if(isMaster()){const result=secureD20();await createEvent('dice_result',{result,player_name:state.member.display_name||'Mestre',reason:'Rolagem do mestre',natural:result});if(!state.backendReady)showDice(result,state.member.display_name||'Mestre')}
        else {if(!canCurrentPlayerRoll())throw new Error('Não existe uma solicitação de D20 direcionada a você.');const prompt=activeRollPrompt();await createEvent('roll_request',{prompt_id:prompt.id,player_name:state.member?.display_name||'Aventureiro'});toast('Seu resultado foi enviado ao mestre.')}
      }
      else if(action==='music-toggle'){await musicTogglePlayback()}
      else if(action==='music-prev'){await musicNextTrack(true)}
      else if(action==='music-next'){await musicNextTrack(false)}
      else if(action==='music-pick'){await musicSelectTrack(btn.dataset.trackId,true)}
      else if(action==='music-upload'){$('#music-file-input')?.click()}
      else if(action==='music-add-link'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode adicionar faixas.');openMusicLinkModal()}
      else if(action==='music-add-youtube'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode adicionar faixas.');openMusicYouTubeModal()}
      else if(action==='music-remove'){if(!window.confirm('Remover esta faixa da playlist compartilhada?'))return;await removeMusicTrack(btn.dataset.trackId)}
      else if(action==='music-unlock'){await musicActivateDevice()}
      else if(action==='music-mute'){setMusicLocalPrefs({muted:!musicLocalPrefs().muted});render()}
      else if(action==='sync-campaign'){await refreshCloudCampaign();toast('Crônica sincronizada.')}
      else if(action==='send-chat'){const input=$('#chat-input');const text=input?.value.trim();if(text){await createEvent('chat_message',{text:text.slice(0,500),display_name:state.member?.display_name||'Aventureiro'});if(input)input.value='';render()}}
      else if(action==='start-encounter'){
        if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode iniciar encontros.');
        renderEncounterModal();
      }
      else if(action==='advance-turn'){
        if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode avançar turnos.');
        const enc=state.campaign.game_state?.encounter;if(!enc)throw new Error('Não existe combate ativo.');
        const partyState=cloneData(state.campaign.game_state?.partyState||{});const next=advanceCombatTurn(enc,partyState);const nextTurn=activeCombatTurn(next);if(nextTurn?.kind==='monster')next.displayEnemyId=nextTurn.id;await updateGameState({encounter:next,partyState});await createEvent('turn_advanced',{description:`Agora é o turno de ${activeCombatTurn(next)?.name||'—'}.`,round:next.round});
      }
      else if(action==='resolve-monster-turn')await resolveMonsterTurn();
      else if(action==='combat-attack'||action==='combat-ability'||action==='combat-potion'){
        if(!isPlayersCombatTurn()||state.campaign.game_state.encounter?.defeated)throw new Error('Ainda não é seu turno ou o encontro já terminou.');
        if(!masterIsOnline())throw new Error('O mestre precisa estar online para resolver o combate.');
        const ch=normalizeCharacter(state.member.character);const rule=classRule(ch);
        const actionType=action==='combat-attack'?'attack':action==='combat-ability'?'ability':'item';
        const payload={encounter_id:state.campaign.game_state.encounter.id,round:state.campaign.game_state.encounter.round,turn_index:state.campaign.game_state.encounter.turnIndex,action:actionType,target_id:$('#combat-target')?.value||null,ability_id:actionType==='ability'?rule.abilityId:null,item_id:actionType==='item'?'pocao-cura':null};
        await createEvent('combat_action_request',payload);toast('Ação enviada ao mestre para resolução.');
      }
      else if(action==='open-inventory')renderInventoryModal();
      else if(action==='approve-damage'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre pode validar ataques.');const req=state.pendingDamage.find(x=>x.id===btn.dataset.id);if(req){const enc=state.campaign.game_state?.encounter;const amount=Math.max(0,Math.min(100000,Number(req.payload?.amount)||0));if(!enc||req.payload?.encounter_id!==enc.id){await createEvent('damage_rejected',{request_id:req.id,player_name:req.payload?.player_name||'Aventureiro',reason:'O encontro correspondente já foi encerrado.'})}else if(amount){const hp=Math.max(0,enc.hp-amount);const phased=applyBossPhase({...enc,hp,defeated:hp===0,turnOrder:hp===0?[]:enc.turnOrder,turnIndex:hp===0?0:enc.turnIndex});await updateGameState({encounter:phased});await createEvent('damage_applied',{amount,hp,monster:enc.name,player_name:req.payload?.player_name||'Aventureiro',request_id:req.id});if(hp===0){await awardEncounterRewards(phased);toast('Criatura derrotada. XP distribuído à companhia.')}}state.pendingDamage=state.pendingDamage.filter(x=>x.id!==req.id);render()}}
      else if(action==='reject-damage'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre pode validar ataques.');const req=state.pendingDamage.find(x=>x.id===btn.dataset.id);if(req){await createEvent('damage_rejected',{request_id:req.id,player_name:req.payload?.player_name||'Aventureiro'});state.pendingDamage=state.pendingDamage.filter(x=>x.id!==req.id);render()}}
      else if(action==='master-apply-damage'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode alterar o HP.');const amount=Math.max(0,Math.min(100000,Number($('#master-damage')?.value)||0));const enc=cloneData(state.campaign.game_state.encounter);if(enc&&amount&&!enc.defeated){if(Array.isArray(enc.enemies)&&enc.enemies.length){const target=enc.enemies.find(e=>e.id===$('#master-target')?.value)||enc.enemies.find(e=>!e.defeated);if(!target)throw new Error('Não há criatura ativa.');target.hp=Math.max(0,target.hp-amount);target.defeated=target.hp<=0;enc.displayEnemyId=target.id;enc.hp=enc.enemies.reduce((n,e)=>n+Math.max(0,e.hp),0);const all=enc.enemies.every(e=>e.defeated||e.hp<=0);enc.defeated=all;if(all)enc.turnOrder=[];const phased=enc.enemies.map(e=>isBossTemplate(e)?applyBossPhase(e):e);enc.enemies=phased;const lead=phased[0];if(lead){enc.bossPhase=lead.bossPhase;enc.bossPhaseName=lead.bossPhaseName;enc.bossPhaseDescription=lead.bossPhaseDescription;enc.defense=lead.defense;enc.attackBonus=lead.attackBonus;}await updateGameState({encounter:enc});await createEvent('damage_applied',{amount,hp:target.hp,monster:target.name,player_name:state.member.display_name||'Mestre'});if(all){await awardEncounterRewards(enc);toast('Todas as criaturas foram derrotadas. XP distribuído à companhia.')}}else{const hp=Math.max(0,enc.hp-amount),next=applyBossPhase({...enc,hp,defeated:hp===0,turnOrder:hp===0?[]:enc.turnOrder,turnIndex:hp===0?0:enc.turnIndex});await updateGameState({encounter:next});await createEvent('damage_applied',{amount,hp,monster:enc.name,player_name:state.member.display_name||'Mestre'});if(hp===0){await awardEncounterRewards(next);toast('Criatura derrotada. XP distribuído à companhia.')}}}}
      else if(action==='open-damage'){
        modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal" role="dialog"><div class="modal-head"><div><h2>Registrar ataque</h2><p>Informe o dano causado. O mestre confirma e aplica o valor à criatura.</p></div><button class="modal-close" data-action="close-modal">×</button></div><form id="damage-form"><div class="field"><label for="damage-amount">DANO DECLARADO</label><input class="input" type="number" id="damage-amount" min="1" max="10000" value="12" required></div><div class="field"><label for="damage-note">AÇÃO (OPCIONAL)</label><input class="input" id="damage-note" placeholder="Ex.: Golpe poderoso com espada"></div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button class="btn btn-primary" type="submit">Enviar ao mestre</button></div></form></section></div>`;
      }
      else if(action==='end-encounter'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode encerrar o encontro.');const gs=state.campaign.game_state||defaultGameState(),ex=explorationData(gs),rec=activeMapRecord(gs);for(const enemy of (gs.encounter?.enemies||[]))if(enemy.id)delete rec.tokens[enemy.id];delete rec.tokens.monster;await updateGameState({encounter:null,exploration:setActiveMapRecord(ex,rec)});toast('Encontro encerrado.')}
      else if(action==='map-change'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre pode trocar o mapa.');const id=btn.dataset.mapId;if(!MAP_TEMPLATES.some(m=>m.id===id))throw new Error('Mapa não encontrado.');const gs=state.campaign.game_state||defaultGameState(),ex=explorationData(gs);ex.mapId=id;if(!ex.maps[id])ex.maps[id]=createBoardRecord(id);else if(ex.maps[id].boardDefaultsApplied!==true){const rec=activeMapRecord({...gs,exploration:ex});rec.boardDefaultsApplied=true;ex.maps[id]=rec;}state.selectedMapToken=state.members.find(m=>m.role==='player'&&m.character)?.user_id||null;state.selectedMapTool='move';await updateGameState({exploration:ex});await createEvent('session_note',{kind:'map',text:`O mapa mudou para ${mapTemplate(id).name}.`})}
      else if(action==='toggle-map-player-visibility'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode apresentar ou ocultar o mapa.');const gs=state.campaign.game_state||defaultGameState(),ex=explorationData(gs),rec=activeMapRecord(gs);rec.playersVisible=!rec.playersVisible;setActiveMapRecord(ex,rec);await updateGameState({exploration:ex});await createEvent('session_note',{kind:'map-visibility',text:`O mestre ${rec.playersVisible?'apresentou':'ocultou'} o mapa ${mapTemplate(ex.mapId).name} ${rec.playersVisible?'para':'dos'} jogadores.`});toast(rec.playersVisible?'Mapa apresentado aos jogadores.':'Mapa ocultado dos jogadores.');render()}
      else if(action==='seed-map-board'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode preparar o tabuleiro.');const gs=state.campaign.game_state||defaultGameState(),ex=explorationData(gs),rec=activeMapRecord(gs);rec.boardDefaultsApplied=true;setActiveMapRecord(ex,rec);await updateGameState({exploration:ex});await createEvent('session_note',{kind:'map',text:`Portas e acessos iniciais foram preparados em ${mapTemplate(ex.mapId).name}.`});toast('Portas iniciais sincronizadas com a campanha.')}
      else if(action==='map-poi'){openMapPoi(btn.dataset.mapId||worldMapKey(state.campaign.game_state||defaultGameState()),btn.dataset.poiId)}
      else if(action==='map-tool'){const tool=btn.dataset.tool||'move';if(tool==='ping'&&!isMaster()){state.selectedMapTool='ping';toast('Toque em uma casa revelada para marcar atenção.');render()}else{if(!isMaster()||!isMasterController())throw new Error('Somente o mestre pode selecionar ferramentas do mapa.');state.selectedMapTool=tool;toast(tool==='setup-move'?'Modo de preparação: miniaturas podem ser posicionadas livremente.':'Modo de movimento normal.');render()}}
      else if(action==='map-select-token'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre pode selecionar peças do mapa.');state.selectedMapToken=btn.dataset.tokenId||null;if(state.selectedMapTool!=='setup-move')state.selectedMapTool='move';render()}
      else if(action==='toggle-map-fog'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre pode controlar a névoa de guerra.');const gs=state.campaign.game_state||defaultGameState(),ex=explorationData(gs),rec=activeMapRecord(gs);rec.fogEnabled=!rec.fogEnabled;if(rec.fogEnabled){mapTokens(rec,gs).filter(t=>t.kind==='player').forEach(t=>addRevealedAround(rec,t.position.x,t.position.y,1))}await updateGameState({exploration:setActiveMapRecord(ex,rec)});toast(rec.fogEnabled?'Névoa de guerra ativada.':'Mapa totalmente revelado.')}
      else if(action==='map-cell'){await handleMapCellClick(btn)}
      else if(action==='approve-map-move'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre pode aprovar movimentos.');const ev=state.pendingMapMoves.find(x=>x.id===btn.dataset.id);if(!ev)throw new Error('Solicitação não encontrada.');try{await moveMapToken(ev.actor_id,Number(ev.payload.x),Number(ev.payload.y),ev.id,ev.payload.map_id)}catch(err){await createEvent('session_note',{kind:'map',request_id:ev.id,accepted:false,text:`Movimento recusado: ${err.message}`});state.pendingMapMoves=state.pendingMapMoves.filter(x=>x.id!==ev.id);throw err}state.pendingMapMoves=state.pendingMapMoves.filter(x=>x.id!==ev.id);render()}
      else if(action==='reject-map-move'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre pode recusar movimentos.');const ev=state.pendingMapMoves.find(x=>x.id===btn.dataset.id);if(ev){await createEvent('session_note',{kind:'map',request_id:ev.id,accepted:false,text:`O mestre recusou o movimento de ${ev.payload?.player_name||'um aventureiro'}.`});state.pendingMapMoves=state.pendingMapMoves.filter(x=>x.id!==ev.id);render()}}
      else if(action==='approve-map-interaction'){const ev=state.pendingMapInteractions.find(x=>x.id===btn.dataset.id);if(!ev)throw new Error('Interação não encontrada.');await resolveMapInteraction(ev,true)}
      else if(action==='reject-map-interaction'){const ev=state.pendingMapInteractions.find(x=>x.id===btn.dataset.id);if(ev)await resolveMapInteraction(ev,false)}
      else if(action==='grant-quest-reward'){await grantQuestReward(btn.dataset.questId)}
      else if(action==='open-adventure-manager'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode gerenciar a jornada.');renderAdventureManagerModal()}
      else if(action==='open-world-place'){openWorldPlace(btn.dataset.placeId)}
      else if(action==='toggle-world-object-visibility'){await toggleWorldObjectVisibility(btn.dataset.objectId)}
      else if(action==='toggle-world-place-presentation'){await toggleWorldPlacePresentation(btn.dataset.placeId)}
      else if(action==='world-object-request'){await requestWorldObjectInteraction(btn.dataset.objectId)}
      else if(action==='approve-world-interaction'){const ev=state.pendingWorldInteractions.find(x=>x.id===btn.dataset.id);if(ev)await resolveWorldInteraction(ev,true)}
      else if(action==='reject-world-interaction'){const ev=state.pendingWorldInteractions.find(x=>x.id===btn.dataset.id);if(ev)await resolveWorldInteraction(ev,false)}
      else if(action==='discover-world-place'){await discoverWorldPlace(btn.dataset.placeId)}
      else if(action==='world-random-event'){await generateWorldEvent()}
      else if(action==='world-clear-event'){await clearWorldEvent()}
      else if(action==='world-travel'){await travelWorld(btn.dataset.mapId)}
      else if(action==='world-move'){await moveWorldParty(Number(btn.dataset.dx),Number(btn.dataset.dy))}
      else if(action==='world-interact'){await interactWorldObject(btn.dataset.objectId)}
      else if(action==='open-npc'){renderNPCModal(btn.dataset.npcId)}
      else if(action==='open-shop'){renderShopModal()}
      else if(action==='shop-buy'){await transactShop(btn.dataset.itemId,'buy')}
      else if(action==='shop-sell'){await transactShop(btn.dataset.itemId,'sell')}
      else if(action==='equip-item'){await changeEquipment(btn.dataset.itemId)}
      else if(action==='unequip-item'){await changeEquipment(null,btn.dataset.slot,true)}
      else if(action==='forge-upgrade'){await forgeEquipment(btn.dataset.slot,'upgrade')}
      else if(action==='forge-enchant'){await forgeEquipment(btn.dataset.slot,'enchant',btn.dataset.enchantment)}
      else if(action==='dialogue-choice'){
        if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode registrar decisões narrativas.');
        const npc=STORY_NPCS.find(n=>n.id===btn.dataset.npcId),choice=(DIALOGUE_CHOICES[btn.dataset.npcId]||[]).find(c=>c.id===btn.dataset.choiceId);if(!npc||!choice)throw new Error('Escolha de diálogo inválida.');
        const gs=state.campaign.game_state||defaultGameState(),dialogueChoices=cloneData(gs.dialogueChoices||{}),storyFlags={...(gs.storyFlags||{})};if((dialogueChoices[npc.id]||[]).length)throw new Error('A companhia já registrou uma decisão para este diálogo.');dialogueChoices[npc.id]=[choice.id];storyFlags[choice.flag]=true;const message=`${npc.name}: ${choice.log}`;const journalEntries=[...(gs.journalEntries||[]),{id:crypto.randomUUID?crypto.randomUUID():`journal-${Date.now()}`,text:message,kind:'choice',createdAt:new Date().toISOString()}].slice(-50);await updateGameState({dialogueChoices,storyFlags,journalEntries});await createEvent('session_note',{kind:'choice',text:message});renderNPCModal(npc.id);toast('Decisão registrada e salva na crônica.');
      }
      else if(action==='accept-quest'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode apresentar missões.');const gs=state.campaign.game_state||defaultGameState();const data=narrativeState(gs);const q=data.quests.find(x=>x.id===btn.dataset.questId);if(!q||q.status!=='available')throw new Error('Esta missão não está disponível.');q.status='active';let text=`A companhia aceitou a missão: ${q.title}.`;if(q.id==='side-01'&&data.revealedNpcIds.includes('tovin')){const result=markObjective(data.quests,'side-01','meet-tovin');data.quests=result.quests;if(result.changed)text+=' O grupo já havia conhecido Tovin; esse objetivo foi reconhecido automaticamente.'}data.journalEntries=[...data.journalEntries,{id:crypto.randomUUID?crypto.randomUUID():`journal-${Date.now()}`,text,kind:'quest',createdAt:new Date().toISOString()}].slice(-50);await updateGameState({quests:data.quests,journalEntries:data.journalEntries});await createEvent('session_note',{kind:'quest',text});renderAdventureManagerModal();toast('Missão apresentada à companhia.')}
      else if(action==='complete-quest-objective'){await completeQuestObjective(btn.dataset.questId,btn.dataset.objectiveId);renderAdventureManagerModal()}
      else if(action==='reveal-npc'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode revelar NPCs.');const id=btn.dataset.npcId;const npc=STORY_NPCS.find(x=>x.id===id);if(!npc)throw new Error('Personagem não encontrado.');const gs=state.campaign.game_state||defaultGameState();const data=narrativeState(gs);if(!data.revealedNpcIds.includes(id)){data.revealedNpcIds=[...data.revealedNpcIds,id];let quests=data.quests;let text=`A companhia encontrou ${npc.name}, ${npc.role.toLowerCase()}.`;if(id==='ilyra'){const result=markObjective(quests,'main-01','meet-ilyra');quests=result.quests;if(result.changed)text+=' Objetivo concluído: conhecer Ilyra Avelorn.'}if(id==='tovin'){const result=markObjective(quests,'side-01','meet-tovin');quests=result.quests;if(result.changed)text+=' Objetivo concluído: falar com Tovin.'}if(id==='maera'){const result=markObjective(quests,'main-03','reach-thalassor');quests=result.quests;if(result.changed)text+=' Objetivo concluído: encontrar a capitã Maera.'}if(id==='vaelis'){const result=markObjective(quests,'main-04','consult-vaelis');quests=result.quests;if(result.changed)text+=' Objetivo concluído: consultar Vaelis.'}if(id==='asha'){const result=markObjective(quests,'main-05','meet-asha');quests=result.quests;if(result.changed)text+=' Objetivo concluído: encontrar o Oráculo Asha.'}if(id==='brann'){const result=markObjective(quests,'main-06','meet-brann');quests=result.quests;if(result.changed)text+=' Objetivo concluído: encontrar Mestre Ferreiro Brann.'}data.journalEntries=[...data.journalEntries,{id:crypto.randomUUID?crypto.randomUUID():`journal-${Date.now()}`,text,kind:'npc',createdAt:new Date().toISOString()}].slice(-50);await updateGameState({revealedNpcIds:data.revealedNpcIds,quests,journalEntries:data.journalEntries});await createEvent('session_note',{kind:'npc',text});}renderAdventureManagerModal();toast(`${npc.name} agora está visível aos jogadores.`)}
      else if(action==='v4-open-conditions'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode gerenciar condições.');state.modal='v4-conditions';render()}
      else if(action==='v4-open-area'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode resolver ataques em área.');state.modal='v4-area';render()}
      else if(action==='v4-open-branch'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode criar decisões narrativas.');state.modal='v4-branch';render()}
      else if(action==='v4-open-prep'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode preparar a próxima sessão.');state.modal='v4-prep';render()}
      else if(action==='v4-open-summary'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode registrar o resumo.');state.modal='v4-summary';render()}
      else if(action==='v4-open-private'){if(!isMaster())throw new Error('Somente o mestre pode abrir anotações secretas.');state.modal='v4-private';render()}
      else if(action==='v4-open-npc'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode alterar memórias dos NPCs.');state.v4NpcSelected=btn.dataset.npcId||state.v4NpcSelected;state.modal='v4-npc';render()}
      else if(action==='v4-open-loot'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode distribuir tesouros.');state.modal='v4-loot';render()}
      else if(action==='v4-open-skill'){if(!state.member?.character)throw new Error('Crie uma ficha antes de abrir a árvore de habilidades.');state.modal='v4-skill';render()}
      else if(action==='v4-open-backup'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode restaurar backups.');state.modal='v4-backup';render()}
      else if(action==='v4-export-backup'){exportCampaignBackup()}
      else if(action==='v4-buy-skill'){await chooseV4Skill(btn.dataset.branch)}
      else if(action==='v4-choose-branch'){const gs=state.campaign?.game_state||defaultGameState(),branch=v4GameData(gs).storyBranches?.active;if(!branch||branch.id!==btn.dataset.branchId||branch.selectedOptionId)throw new Error('Esta decisão já foi resolvida ou foi substituída.');if(isMaster())throw new Error('O mestre confirma a decisão pelo painel de votação.');if(branch.votes?.[currentUserId()])throw new Error('Você já registrou seu voto nesta decisão.');const option=branch.options?.find(o=>o.id===btn.dataset.optionId);if(!option)throw new Error('Opção narrativa inválida.');await createEvent('v4_branch_choice_request',{branch_id:branch.id,option_id:option.id,player_name:state.member?.display_name||'Aventureiro'});toast('Seu voto foi enviado ao mestre.');}
      else if(action==='v4-resolve-branch'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode confirmar a votação.');await recordV4BranchChoice(btn.dataset.optionId);render()}
      else if(action==='open-master-guide'){if(!isMaster())throw new Error('Apenas o mestre possui acesso a esta central.');state.modal='masterGuide';renderMasterGuideModal()}
      else if(action==='open-character-sheet'){const ch=state.member?.character;if(ch){state.charDraft=JSON.parse(JSON.stringify(ch));state.charStep=4;state.modal='character';render()}else toast('Crie sua ficha primeiro.','error')}
      else if(action==='open-narration'){
        modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop-close"><section class="modal" role="dialog"><div class="modal-head"><div><h2>Narrar acontecimento</h2><p>Compartilhe uma descrição com todos os participantes.</p></div><button class="modal-close" data-action="close-modal">×</button></div><form id="narration-form"><div class="field"><label for="narration-text">NARRAÇÃO</label><textarea class="textarea" id="narration-text" required placeholder="Descreva o que os aventureiros veem, ouvem ou descobrem..."></textarea></div><div class="modal-actions"><button type="button" class="btn btn-quiet" data-action="close-modal">Cancelar</button><button type="submit" class="btn btn-primary">Publicar narração</button></div></form></section></div>`;
      }
    }catch(err){console.error(err);toast(err.message||'Não foi possível concluir a ação.','error')}
  });

  // v4.2.0 — mantém a rolagem da ficha do Bestiário independente da janela externa.
  // Em alguns navegadores/touchpads, o wheel era encaminhado ao modal externo apesar da barra interna.
  document.addEventListener('wheel',e=>{
    const target=e.target?.nodeType===1?e.target:e.target?.parentElement;
    const panel=target?.closest?.('.v417-bestiary-detail, .v417-bestiary-grid');
    if(!panel||!modalRoot.contains(panel)||e.ctrlKey)return;
    const maxScroll=panel.scrollHeight-panel.clientHeight;
    if(maxScroll<=1)return;
    let delta=Number(e.deltaY)||0;
    if(e.deltaMode===1)delta*=16;
    else if(e.deltaMode===2)delta*=Math.max(120,panel.clientHeight*.85);
    if(!delta)return;
    panel.scrollTop=Math.max(0,Math.min(maxScroll,panel.scrollTop+delta));
    e.preventDefault();
    e.stopPropagation();
  },{capture:true,passive:false});

  document.addEventListener('click',e=>{
    const choice=e.target.closest('[data-choice]');if(!choice||!state.charDraft)return;
    state.charDraft[choice.dataset.choice]=choice.dataset.value;renderCharacterModal();
  });
  document.addEventListener('change',e=>{
    if(e.target.id==='map-token-select'){state.selectedMapToken=e.target.value||null;render()}
    if(e.target.id==='v41-bestiary-kind'){state.bestiaryKind=e.target.value;renderV41BestiaryModal()}
    if(e.target.id==='v41-journal-filter'){state.journalFilter=e.target.value;renderV41JournalModal()}
    if(e.target.id==='v4-npc-id'){state.v4NpcSelected=e.target.value;const rel=v4GameData().npcRelations?.[e.target.value]||{};const trust=$('#v4-npc-trust');if(trust)trust.value=String(Number(rel.trust)||0)}
  });
  document.addEventListener('input',e=>{
    if(e.target.id==='v41-bestiary-search'){state.bestiarySearch=e.target.value;const q=state.bestiarySearch.toLowerCase();let visible=0;$$('.v413-monster-option-wrap').forEach(row=>{const card=row.querySelector('.v413-monster-option');const match=(card?.dataset.search||card?.textContent||'').toLowerCase().includes(q);row.hidden=!match;if(match)visible++});const count=$('.v413-bestiary-toolbar .tag');if(count)count.textContent=`${visible}/${MONSTERS.length}`}
    if(e.target.id==='v41-journal-search'){state.journalSearch=e.target.value;const q=state.journalSearch.toLowerCase();$$('.v41-timeline-item').forEach(row=>{row.hidden=!row.textContent.toLowerCase().includes(q)})}
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
    if(form.dataset.busy==='true')return;
    form.dataset.busy='true';
    const submitButton=form.querySelector('button[type="submit"],button:not([type])');
    if(submitButton){submitButton.disabled=true;submitButton.dataset.originalText=submitButton.textContent;submitButton.textContent='Salvando…'}
    try{
      if(form.id==='settings-form'){const url=$('#sb-url').value,key=$('#sb-key').value;await connectSupabase(url,key);closeModal();render()}
      else if(form.id==='account-link-form'){await linkGuestAccount($('#account-email').value)}
      else if(form.id==='account-login-form'){await signInExistingAccount($('#account-email').value,$('#account-login-password').value);closeModal();render()}
      else if(form.id==='account-reset-form'){await sendPasswordReset($('#account-email').value)}
      else if(form.id==='account-set-password-form'){await finishAccountPassword($('#account-password').value,$('#account-password-confirm').value)}
      else if(form.id==='account-recovery-password-form'||form.id==='account-change-password-form'){await updateSignedInPassword($('#account-password').value,$('#account-password-confirm').value)}
      else if(form.id==='create-form'){const name=$('#campaign-name').value.trim(),desc=$('#campaign-desc').value.trim();if(!name)throw new Error('Informe o nome da campanha.');await createCampaign(name,desc);closeModal();render()}
      else if(form.id==='join-form'){const code=$('#join-code').value.trim().toUpperCase(),name=$('#join-name').value.trim();state.prefillJoinCode=null;await joinCampaign(code,name)}
      else if(form.id==='damage-form'){const amount=Number($('#damage-amount').value),note=$('#damage-note').value.trim(),encounter=state.campaign.game_state?.encounter;if(!encounter?.id)throw new Error('Não existe um encontro ativo.');if(!amount||amount<1)throw new Error('Informe um valor de dano válido.');await createEvent('damage_request',{amount,note,encounter_id:encounter.id,player_name:state.member?.display_name||'Aventureiro'});closeModal();toast('Ataque enviado. O mestre validará o dano.')}
      else if(form.id==='v41-roll-form'){const target=$('#v41-roll-target').value,type=$('#v41-roll-type').value,reason=$('#v41-roll-reason').value.trim(),opts={attribute:$('#v41-roll-attribute').value,dc:$('#v41-roll-dc').value,bonus:$('#v41-roll-bonus').value,mode:$('#v41-roll-mode').value,visibility:$('#v41-roll-visibility').value,testType:type,opponentMonsterId:$('#v41-roll-opponent').value};await requestRoll(target,reason,opts);closeModal();render()}
      else if(form.id==='v423-dice-form'){await rollV423UniversalDice({count:$('#v423-dice-count').value,sides:$('#v423-dice-sides').value,bonus:$('#v423-dice-bonus').value,visibility:$('#v423-dice-visibility').value,reason:$('#v423-dice-reason').value})}
      else if(form.id==='v411-close-session-form'){await finishV411Session($('#v411-close-summary').value)}
      else if(form.id==='roll-prompt-form'){const target=$('#roll-target').value,reason=$('#roll-reason').value.trim()||'Teste de D20';await requestRoll(target,reason);closeModal()}
      else if(form.id==='encounter-form'){const templates=[...modalRoot.querySelectorAll('input[name="monster"]:checked')].map(r=>MONSTERS.find(m=>m.id===r.value)).filter(Boolean);if(!templates.length)throw new Error('Marque ao menos uma criatura.');await startEncounter(templates);closeModal()}
      else if(form.id==='chat-form'){const input=$('#chat-input');const text=input?.value.trim();if(text){await createEvent('chat_message',{text:text.slice(0,500),display_name:state.member?.display_name||'Aventureiro'});input.value='';render()}}
      else if(form.id==='scene-form'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode mudar a cena.');const chapter=$('#scene-chapter').value.trim(),locationName=$('#scene-location').value.trim(),text=$('#scene-narration').value.trim();if(!chapter||!locationName||!text)throw new Error('Preencha capítulo, local e narração.');const gs=state.campaign.game_state||defaultGameState();const data=narrativeState(gs);const note=`A companhia chegou a ${locationName}.`;data.journalEntries=[...data.journalEntries,{id:crypto.randomUUID?crypto.randomUUID():`journal-${Date.now()}`,text:note,kind:'scene',createdAt:new Date().toISOString()}].slice(-50);await updateGameState({chapter,location:locationName,narration:text,journalEntries:data.journalEntries});await createEvent('session_note',{kind:'scene',text:note});renderAdventureManagerModal();toast('Nova cena publicada para todos.')}
      else if(form.id==='journal-form'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode registrar no diário.');const text=$('#journal-text').value.trim();if(!text)throw new Error('Escreva uma anotação antes de salvar.');await appendJournalEntry(text,'story');await createEvent('session_note',{kind:'journal',text});renderAdventureManagerModal();toast('Anotação adicionada ao diário.')}
      else if(form.id==='voice-link-form'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode salvar o link da chamada.');const platform=$('#voice-platform').value,urlInput=$('#voice-url').value.trim(),url=urlInput?voiceCallUrl(platform,urlInput):'';if(urlInput&&!url)throw new Error('Link inválido. Use um link HTTPS válido do Discord, WhatsApp ou Google Meet correspondente à plataforma selecionada.');const gs=state.campaign.game_state||defaultGameState(),v4=v4GameData(gs);v4.voiceSession={...v4.voiceSession,enabled:$('#voice-enabled').checked,platform,url,updatedAt:new Date().toISOString()};await updateGameState({v4});closeModal();render();toast('Configuração de chamada sincronizada com a companhia.');}
      else if(form.id==='voice-roll-form'){const target=$('#voice-roll-target').value,attribute=$('#voice-roll-type').value,reason=`Teste de ${attribute}`,testType=target==='all'?'collective':'individual',options={attribute,dc:$('#voice-roll-dc').value,mode:$('#voice-roll-mode').value,visibility:'public',testType};await requestRoll(target,reason,options);closeModal();render()}
      else if(form.id==='v4-condition-form'){await applyV4Condition($('#v4-condition-target').value,$('#v4-condition-id').value,$('#v4-condition-duration').value,$('#v4-condition-note').value);state.modal=null;render()}
      else if(form.id==='v4-area-form'){const coord=$('#v4-area-center').value.trim().toUpperCase(),x=coord.charCodeAt(0)-65,y=Number(coord.slice(1))-1;if(x<0||x>=MAP_WIDTH||y<0||y>=MAP_HEIGHT)throw new Error('Informe uma coordenada válida entre A1 e J8.');await applyV4AreaAttack({x,y},$('#v4-area-radius').value,$('#v4-area-damage').value,$('#v4-area-scope').value,$('#v4-area-description').value);closeModal();render()}
      else if(form.id==='v4-branch-form'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode publicar decisões.');const question=$('#v4-branch-question').value.trim(),stamp=Date.now(),options=[1,2,3].map(i=>({id:`option-${i}-${stamp}`,label:$('#v4-branch-label-'+i).value.trim(),publicHint:$('#v4-branch-hint-'+i).value.trim(),consequence:$('#v4-branch-consequence-'+i).value.trim()})).filter(o=>o.label);if(!question||options.length<2)throw new Error('Informe uma pergunta e pelo menos duas opções.');const gs=state.campaign.game_state||defaultGameState(),v4=v4GameData(gs),history=[...(v4.storyBranches?.history||[])];if(v4.storyBranches?.active&&!v4.storyBranches.active.selectedOptionId)history.push({...cloneData(v4.storyBranches.active),abandonedAt:new Date().toISOString()});v4.storyBranches={active:{id:`branch-${stamp}`,question,options,votes:{},createdAt:new Date().toISOString()},history:history.slice(-40)};await updateGameState({v4});await createEvent('session_note',{kind:'choice',text:`Nova decisão apresentada: ${question}`});closeModal();toast('Decisão narrativa publicada para a companhia.')}
      else if(form.id==='v4-prep-form'){const gs=state.campaign.game_state||defaultGameState(),v4=v4GameData(gs);v4.nextSessionPrep=$('#v4-prep-text').value.trim();await updateGameState({v4});closeModal();toast('Preparação da próxima sessão sincronizada.')}
      else if(form.id==='v4-summary-form'){if(!isMaster()||!isMasterController())throw new Error('Somente o mestre ativo pode registrar o resumo.');const text=$('#v4-summary-text').value.trim();if(!text)throw new Error('Escreva um resumo antes de encerrar.');const gs=state.campaign.game_state||defaultGameState(),v4=v4GameData(gs);v4.lastSessionSummary=text;const journalEntries=[...(gs.journalEntries||[]),{id:`session-summary-${Date.now()}`,text:`Resumo da sessão: ${text}`,kind:'summary',createdAt:new Date().toISOString()}].slice(-50);await updateGameState({v4,journalEntries});await createEvent('session_note',{kind:'summary',text:`Resumo da sessão registrado: ${text.slice(0,420)}`});closeModal();toast('Resumo salvo no Diário da Crônica. A sessão continua aberta até o mestre encerrá-la.')}
      else if(form.id==='v4-private-form'){savePrivateNotes($('#v4-private-text').value)}
      else if(form.id==='v4-npc-form'){const gs=state.campaign.game_state||defaultGameState(),v4=v4GameData(gs),id=$('#v4-npc-id').value,old=v4.npcRelations[id]||{memories:[]},memory=$('#v4-npc-memory').value.trim();v4.npcRelations[id]={...old,trust:Math.max(-100,Math.min(100,Number($('#v4-npc-trust').value)||0)),memories:[...(old.memories||[]),...(memory?[{text:memory,at:new Date().toISOString()}]:[])].slice(-40)};await updateGameState({v4});closeModal();toast('Memória e confiança do NPC atualizadas.')}
      else if(form.id==='v4-loot-form'){await grantV4Loot($('#v4-loot-player').value,$('#v4-loot-coins').value,$('#v4-loot-item').value,$('#v4-loot-qty').value,$('#v4-loot-description').value);closeModal();render()}
      else if(form.id==='v4-backup-form'){const file=$('#v4-backup-file').files?.[0];if(!file)throw new Error('Selecione um arquivo de backup.');if(!window.confirm('Restaurar este backup substituirá o estado atual da campanha. Continuar?'))return;await restoreCampaignBackup(file)}
      else if(form.id==='narration-form'){const text=$('#narration-text').value.trim();if(text){await updateGameState({narration:text});await createEvent('narration',{text});closeModal();toast('Narração compartilhada.') }}
    }catch(err){console.error(err);toast(err.message||'Erro ao enviar formulário.','error')}
    finally{if(form.isConnected){form.dataset.busy='false';if(submitButton){submitButton.disabled=false;if(submitButton.dataset.originalText)submitButton.textContent=submitButton.dataset.originalText}}}
  });

  async function characterNext(){
    const d=state.charDraft;
    if(state.charStep===0){d.name=$('#char-name')?.value.trim()||d.name;d.age=$('#char-age')?.value||'';d.personality=$('#char-personality')?.value.trim()||'';if(!d.name)throw new Error('Escolha um nome para seu personagem.')}
    if(state.charStep===1&&(!d.realm||!d.race))throw new Error('Escolha um reino e uma raça.');
    if(state.charStep===2&&!d.class)throw new Error('Escolha uma classe.');
    if(state.charStep===4){await saveCharacter(d);closeModal();render();return}
    state.charStep++;renderCharacterModal();
  }

  // O assistente também bloqueia cliques repetidos enquanto salva a ficha na nuvem.
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-action="char-next"]');if(!b||b.dataset.busy==='true')return;
    b.dataset.busy='true';b.disabled=true;const original=b.textContent;b.textContent=state.charStep===4?'Salvando…':'Validando…';
    characterNext().catch(err=>toast(err.message,'error')).finally(()=>{if(b.isConnected){b.dataset.busy='false';b.disabled=false;b.textContent=original}});
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.modal){closeModal();render()}});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&state.backendReady&&state.campaign){refreshCloudCampaign({silent:true});if(state.realtimeStatus!=='SUBSCRIBED')scheduleCampaignReconnect('aba voltou ao primeiro plano')}});
  window.addEventListener('online',()=>{refreshConnectionLabel();if(state.backendReady&&state.campaign)retryCampaignConnection().catch(err=>{console.warn(err);scheduleCampaignReconnect(err?.message||'retorno online')})});
  window.addEventListener('offline',()=>{state.channelPresence=[];state.realtimeStatus='CLOSED';refreshConnectionLabel();render()});
  window.addEventListener('beforeunload',()=>{if(state.reconnectTimer)clearTimeout(state.reconnectTimer);if(state.channel&&state.backend)state.backend.removeChannel(state.channel)});

  init().catch(err=>{console.error(err);setConnection('Modo local',false);render();toast('A aplicação iniciou em modo local.','error')});
})();
