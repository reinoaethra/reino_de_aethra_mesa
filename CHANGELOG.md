## v2.8 — cenas exploráveis e livros ampliados

- Cena de exploração com grade 5×4, marcador da companhia e controles direcionais de deslocamento narrativo para o mestre controlador.
- Portas, baús e mecanismos específicos por mapa; estados salvos na campanha e interações registradas no diário.
- Baús não podem ser reabertos depois de marcados como abertos.
- NPCs revelados exibem localização sugerida em rotinas cíclicas conforme o turno narrativo.
- Os sete livros da biblioteca receberam capítulo de v2.8 sobre exploração, habitats, arenas, rotas, magia aplicada e objetos de cenário.
- Novo Livro do Mestre em PDF, edição 2.8, entregue separadamente do pacote público.
- Dados persistidos em `worldExploration`; nenhuma migração SQL necessária.
- A página inicial de acesso, criação de conta e início da campanha foi intencionalmente mantida para uma atualização posterior.
- Validações estáticas: `node --check`, HTML parser, CSS e integridade do ZIP. Não houve teste visual em navegador nem multiplayer real com Supabase.

## v2.7 — exploração interativa e acontecimentos

- Adicionado painel de exploração com pontos de interesse contextuais por mapa: taverna, oficina, mercado, santuário, biblioteca, porto, templo, forja e ruínas.
- Pontos de interesse exibem descrição e pista narrativa; o mestre controlador pode registrar descobertas de forma persistente no estado da campanha e no diário.
- NPCs já revelados aparecem no painel de exploração e abrem seus diálogos existentes, preservando as escolhas persistentes.
- Mestre pode gerar e encerrar eventos de viagem/exploração; o acontecimento ativo é sincronizado e registrado no diário.
- Mestre pode viajar entre mapas regionais disponíveis; localização, narração, mapa ativo e diário são atualizados juntos.
- Estado adicional salvo em `worldExploration` no JSON da campanha; nenhuma migração SQL necessária.
- `config.js` preservado. Verificações estáticas de JavaScript, HTML, CSS, assets e integridade do ZIP; sem teste visual em navegador ou multiplayer real com Supabase.

## v2.6 — cenários ilustrados durante a campanha

- Adicionadas seis artes de ambiente locais em WebP: vila ancestral de Eldoria, forjas de Drakmor, arquivos de cristal de Nivéria, porto de Thalassor, templo de Solária e ruínas antigas.
- A narração da sessão agora apresenta uma paisagem contextual baseada na localização e no mapa ativo, sem alterar o texto nem o estado da campanha.
- O painel do mapa tático ganhou uma faixa ilustrada que acompanha o mapa regional selecionado.
- As artes são carregadas localmente, com `loading=lazy` e otimização WebP; não dependem de links externos nem de serviços de imagem.
- Mantidos mapas em grade, névoa de guerra, peças, marcadores, combate e sincronização; nenhuma migração SQL é necessária.
- `config.js` preservado. Verificações estáticas de JavaScript, HTML, CSS, imagens e integridade do ZIP; sem teste visual em navegador ou multiplayer real com Supabase.

## v2.5 — atlas visual e Livro do Mestre em PDF

- Criadas cinco ilustrações originais dos reinos, em WebP otimizado, para Eldoria, Drakmor, Nivéria, Thalassor e Solária.
- A página inicial substitui os cartões de cores simples por cartões ilustrados com elemento, subtítulo e descrição.
- A criação de personagem agora apresenta cartões visuais com imagem, descrição e afinidade do reino de origem.
- Layout responsivo para desktop, tablet e celular; as imagens são carregadas localmente e não dependem de links externos.
- Produzido o Livro do Mestre em PDF A4, com capa, sumário, 12 capítulos, dois apêndices, tabelas de referência e ilustrações dos cinco reinos. O PDF é entregue separadamente para que o mestre possa mantê-lo privado.
- Nenhuma migração SQL é necessária; `config.js` e os dados das campanhas são preservados.
- Verificações estáticas de JavaScript, HTML, CSS, imagens e integridade do pacote. Não foi realizado teste visual em navegador nem sessão multiplayer real com Supabase.

## v2.4 — espólios, relíquias e equipamentos exclusivos

- Sistema de drops específico para monstros e chefes, com materiais regionais e itens raros.
- Recompensas de ouro por encontro e chances de espólio ajustadas pela dificuldade e nível.
- Equipamentos exclusivos de Malgor, Devorador das Marés, Titã Primordial, Rainha de Cristal, Arconte Solar, Colosso da Umbra, Drakthar e Vharzun.
- Relíquias especiais e peças Míticas obtidas apenas em encontros específicos.
- Três conjuntos novos com peças completas e bônus mecânicos: Cinzas Forjadas, Guardião das Marés e Titã Primordial.
- Espólio e ouro são entregues aos participantes do encontro; materiais, relíquias e equipamentos não podem ser vendidos.
- Inventário permite equipar relíquias; os requisitos de classe e nível continuam sendo verificados.
- Livros do Mestre, Bestiário, Chefes, Arsenal e Manual do Aventureiro receberam capítulo sobre espólios.
- Nenhuma migração SQL nova; os dados usam `partyState` e o estado JSON da campanha.
- Verificações estáticas de sintaxe, estrutura HTML/CSS e integridade do ZIP; sem teste visual em navegador ou multiplayer real no Supabase.

## v2.3 — forja, aprimoramentos e encantamentos

- Adicionados Fragmento de Forja e Essência Arcana ao mercado.
- Implementado aprimoramento de equipamentos até +3, com bônus de +5 por nível no atributo principal.
- Implementados encantamentos: Precisão (+5 ataque), Chama (+5 dano) e Guardião (+5 Defesa).
- Custos e materiais são validados antes de serem debitados; equipamentos não são destruídos.
- Operações ficam registradas no diário da campanha e persistem no estado compartilhado.
- Livros do Mestre, Arsenal e Manual do Aventureiro receberam capítulo sobre a forja.
- Nenhuma migração SQL é necessária.

## v2.2 — progressão até o nível 50 e raridades lendárias

- Limite de nível ampliado para 50; cada nível concede +10 HP e um ponto no atributo principal (limite 30). XP do próximo nível = nível atual × 100.
- Escala de raridade mecânica: Comum +1, Incomum +3, Raro +10, Épico +25, Lendário +100 e Mítico +150. Armas recebem ataque e dano; armaduras/escudos recebem Defesa.
- Bônus de conjunto completo cresce conforme a raridade; novos equipamentos Épicos e Lendários foram adicionados ao mercado.
- Nove criaturas de progressão tardia entre os níveis 12 e 50; Vharzun é o chefe final de nível 50, com três fases e sopro crescente.
- HP, Defesa, ataque e XP de encontros recebem ajuste conforme o nível médio dos aventureiros; chefes recebem multiplicador adicional de resistência.
- Migração `supabase-migration-v2.2.sql` atualiza a RPC de XP para nível 50, bônus de HP e recompensas de até 50.000 XP, preservando o registro de encontros já premiados.
- Sete livros receberam um novo capítulo sobre progressão e desafios de alto nível.
- Testes estáticos de sintaxe, HTML/CSS e integridade do ZIP; sem teste visual em navegador ou multiplayer real no Supabase.

# Histórico de versões — Reino de Aethra

## v1.9 — novas aventuras, criaturas e biblioteca ampliada

- Três missões secundárias novas em Eldoria, Nivéria e Thalassor.
- Três criaturas novas: Mariposa do Véu, Vigia das Ruínas e Colosso de Sal.
- Fichas de combate, habilidades especiais e silhuetas vetoriais próprias para as criaturas novas.
- Objetivos de missão atualizados automaticamente após validação da derrota pelo mestre controlador.
- Três cenas preparadas adicionadas à Central do Mestre.
- Sexto capítulo de consulta adicionado aos sete livros.
- Campanhas anteriores recebem as missões por ID, sem perder progresso.
- Nenhuma migração SQL nova; sem teste visual em navegador ou multiplayer real com Supabase nesta entrega.


## v1.7 — Mapas regionais, recompensas e biblioteca

- Quatro mapas táticos novos: Recife das Vozes (Thalassor), Galeria Prismática (Nivéria), Altar do Sol Partido (Solária) e Cidadela de Braseiro (Drakmor).
- Novas cenas preparadas para os quatro locais regionais.
- Três criaturas adicionadas ao bestiário: Caranguejo-Catedral, Sentinela Prismática e Acólito do Sol Partido.
- Derrotas das novas criaturas podem atualizar objetivos associados a missões existentes.
- Entrega de recompensas de missão pelo mestre: moedas e itens são adicionados ao inventário de cada personagem participante; entrega fica registrada e protegida contra repetição.
- Pacotes automáticos disponíveis apenas para missões selecionadas; XP de conclusão, recompensas não mapeadas e missões finais permanecem sob controle manual do mestre.
- Quinto capítulo de consulta adicionado a cada um dos sete livros.
- Nenhuma migração SQL; campanhas existentes mantêm o mesmo esquema e recebem apenas dados opcionais no JSON da campanha.

## v1.6 — Progressão narrativa, novos arcos e livros ampliados

- Campanha ampliada para oito missões principais e sete secundárias.
- Novo arco de Drakmor com Cidadela de Braseiro, Forja dos Juramentos, Brann e Malgor.
- Seis novas criaturas com atributos, habilidades, XP e miniaturas vetoriais próprias.
- Progresso automático de objetivos de combate mapeados, após validação do mestre ativo e somente em missões aceitas.
- Revelação de Brann atualiza o objetivo correspondente.
- Quarto capítulo de consulta adicionado a cada um dos sete livros.
- Quatro novas cenas preparadas para o painel narrativo.
- Nenhuma migração SQL necessária; campanhas antigas preservam o progresso existente e recebem missões novas por ID.


## v1.5 — Campanha expandida, bestiário e biblioteca

- Cinco missões principais organizadas em arcos regionais até Solária e quatro missões secundárias.
- Seis novas criaturas com fichas de combate, habilidades e silhuetas vetoriais dedicadas: Aranha de Umbrafunda, Cultista do Véu Cinzento, Golem de Basalto, Sereia Abissal, Cavaleiro Oco de Solária e Draco de Cristal Niveriano.
- Seletor de encontros usa as novas silhuetas quando não existe retrato WebP específico.
- Os sete livros recebem capítulos iniciais de consulta com orientações, regras, mundo, magia, equipamento, criaturas e condução de campanha.
- Campanhas antigas recebem novas missões sem apagar o progresso anterior.
- Nenhuma migração SQL nova. O mestre ainda aceita missões, marca objetivos e entrega recompensas manualmente; não há progressão automática por derrota de monstros.
- Guia `GUIA-CAMPANHA-BESTIARIO-LIVROS-V1.5.md`.

## v1.4 — Equipamento por raridade e combate aprimorado

- Cores de raridade para arma, armadura e escudo equipados; aceita `rarity` ou `raridade` e cor opcional `color`.
- Barra compacta de HP nas peças de monstros do mapa.
- Drakthar recebe auras visuais por fase e efeito flamejante para ataques de sopro identificados.
- A miniatura do monstro permanece no mapa após derrota, com animação de queda e estado visual derrotado.
- Painel de encontro apresenta barra de HP crítica/ferida e sinalização de vitória.
- Interface de equipamento informa a raridade registrada no item.
- Guia `GUIA-EQUIPAMENTOS-E-COMBATE-V1.4.md`.
- Nenhuma alteração no esquema do Supabase; nenhuma migração SQL necessária.


## v1.2 — Equipamentos visíveis e criaturas vetoriais

- Exibição visual de arma, armadura e escudo equipados nas miniaturas de aventureiros.
- Cinco criaturas com silhuetas vetoriais dedicadas no mapa tático: Goblin das Cinzas, Lobo Cinzento, Espectro da Ruptura, Campeão Orc e Drakthar.
- Animações distintas de postura para feras, espectros, orcs e dragões.
- Ajustes de camadas, sombras e leitura das peças no tabuleiro.
- Novo guia `GUIA-EQUIPAMENTOS-E-CRIATURAS-V1.2.md`.
- Nenhuma alteração no esquema do Supabase; nenhuma migração SQL necessária.

## v1.1 — Miniaturas articuladas

- Miniaturas vetoriais articuladas para as oito classes.
- Ciclos de postura e movimento em exploração e combate.
- Guia de miniaturas articuladas.

## v1.1 — Miniaturas articuladas e combate refinado
- Substituídas as miniaturas estáticas dos aventureiros no mapa por personagens vetoriais de corpo inteiro.
- Cabeça, tronco, braços, pernas, capa, arma e sombra são elementos separados com animações articuladas.
- Oito paletas de classe: Guerreiro, Arcano, Patrulheiro, Paladino, Assassino, Clérigo, Druida e Invocador.
- Postura de combate muda quando há um encontro ativo.
- `prefers-reduced-motion` desativa os ciclos animados para quem prefere movimento reduzido.
- Retratos WebP originais permanecem nas fichas, NPCs, biblioteca e cartões de monstros.
- Nenhuma alteração no Supabase e nenhuma migração SQL.
- Testes estáticos de sintaxe, estrutura CSS, referências de assets e integridade do ZIP.
- Não foi realizado teste integrado em navegador com múltiplos usuários/Supabase real.

## v1.0 — Primeira edição estável
- Consolidada a experiência de campanha, personagens, mapas, login e combate das versões anteriores.
- Drakthar, o Devorador, agora possui três fases de combate acionadas por limiares de HP (66% e 33%).
- Defesa e bônus de ataque do chefe aumentam a cada fase.
- Sopro das Cinzas pode ser usado uma vez por fase e atinge todos os aventureiros vivos, com dano crescente.
- Painel de batalha exibe a fase, a descrição e os sopros já utilizados.
- Mudança de fase atualizada para dano de jogadores, dano manual e dano validado pelo mestre.
- Nenhuma migração SQL; os dados adicionais são armazenados no JSONB já existente.
- Documentação de atualização, limites e teste da versão 1.0.

## v0.9 — Movimento e combate visual
- Animações CSS de repouso e respiração para retratos de aventureiros.
- Aura animada para peça selecionada.
- Postura animada de criaturas e apresentação de tabuleiro durante encontros.
- Efeitos de impacto, magia, cura e ação de monstros refinados.
- Respeito à preferência `prefers-reduced-motion`.
- Nenhuma alteração no banco de dados; nenhuma migração SQL necessária.

## v0.8 — Retratos, bestiário visual e efeitos de combate

- Criados 16 retratos WebP locais: oito classes, três NPCs e cinco criaturas.
- Retratos apresentados na seleção de classe e no resumo da ficha.
- Miniaturas do mapa agora usam retratos das classes e criaturas, mantendo iniciais e símbolos.
- Lista de participantes e painel de personagem exibem retratos.
- NPCs revelados e suas fichas públicas exibem ilustrações próprias.
- Bestiário e seletor de encontros exibem cartões ilustrados.
- Incluídos Espectro da Ruptura e Campeão Orc como novas criaturas; implementadas suas habilidades especiais.
- Cartão de batalha apresenta arte da criatura em destaque.
- Adicionados efeitos visuais e sonoros para ataques, habilidades, cura e ações de monstros.
- Inventário recebeu cabeçalho ilustrado do personagem e slots de equipamento destacados.
- Documentação atualizada para explicar os retratos e a ausência de migração SQL na v0.8.
- Preservadas autenticação, contas vinculadas, campanhas, mapas, migrações e regras da v0.7.

### Verificações

- Sintaxe JavaScript verificada com `node --check`.
- Arquivos de imagem WebP verificados quanto a formato e dimensões.
- Referências a retratos conferidas no código.
- O SQL da v0.8 não foi alterado: nenhum novo campo ou função de banco foi introduzido.
- Teste de navegador e multiplayer real não foi concluído neste ambiente; exige publicação e projeto Supabase configurado.

## v0.7 — Conta e continuidade entre dispositivos

- Adicionado painel de conta no cabeçalho.
- Acesso visitante convertido em conta permanente por vínculo de e-mail e senha, preservando a identidade do jogador.
- Login por e-mail e senha em outro dispositivo.
- Fluxo de confirmação de e-mail, criação de senha, alteração de senha e recuperação por e-mail.
- Limpeza de contexto ao trocar de identidade para evitar misturar campanhas de usuários diferentes.
- Miniaturas de personagens estilizadas por classe no mapa.
- Animação de ociosidade das miniaturas e destaque visual de monstros.
- Portas e altares interativos no mapa, com solicitação do jogador e validação do mestre.
- Novas instruções completas para Supabase Auth, manual linking, Site URL e Redirect URLs.
- Novo guia de login e progresso entre dispositivos e testes específicos de computador/celular.
- Migração v0.7 do banco mantém o modelo de dados anterior e adiciona apenas a RPC de interação com portas/altares quando o banco está na v0.6.

### Observação de teste

A sintaxe e os arquivos foram verificados localmente. O fluxo de e-mail requer um projeto Supabase configurado, Manual Linking habilitado e URLs de retorno válidas; não foi possível validar a entrega real de e-mails nesta cópia local.

## v0.6 — Mapas táticos e exploração compartilhada

- Quatro mapas 2D em grade: Estrada de Eldoria, Vila de Brumafolha, Torre dos Vigias e Santuário das Raízes.
- Grade 10 × 8 com tipos de terreno e obstáculos que bloqueiam movimento.
- Peças para aventureiros e criatura ativa, com posições iniciais específicas para cada mapa e casas livres conectadas para a companhia.
- Mestre pode selecionar qualquer peça e reposicioná-la; jogador solicita movimento da própria peça.
- Pedidos de movimento aguardam aprovação/recusa do mestre e deixam de aparecer como pendentes após a decisão, inclusive depois de recarregar a campanha.
- Validação de caminho por busca de menor rota, ocupação de casa e limites de movimento.
- Movimento ortogonal de até 4 casas no turno de combate; sem diagonais.
- Névoa de guerra com revelação manual do mestre e descoberta de área ao redor das peças.
- Baús escondidos que concedem 15 moedas de ouro e armadilhas escondidas que causam 5 HP de dano ao serem acionadas.
- Ouro visível no painel do personagem e inventário.
- Mapas, peças, marcadores e névoa salvos em `campaigns.game_state`.
- Função RPC `request_map_move` para validar identidade do jogador, estado da sessão, mapa e limites de coordenadas antes de registrar o pedido.
- Guia de uso dos mapas e documentação de instalação atualizada.


## v0.5 — Primeira aventura, missões, NPCs e diário

- Primeiro capítulo estruturado: Ecos na Estrada de Eldoria.
- Quadro de missões principal e secundária, com objetivos e estados.
- Painel do mestre para aceitar missões e marcar objetivos concluídos.
- Objetivo de derrotar Goblins das Cinzas concluído automaticamente após a vitória do encontro.
- Apresentação de NPCs: Ilyra Avelorn, Tovin Ferromar e Irmão Cael.
- Fichas públicas de NPCs acessíveis aos jogadores após revelação.
- Cinco cenas preparadas que preenchem capítulo, local e narração.
- Diário persistente de descobertas e alterações narrativas.
- Informações de jornada guardadas no JSONB `campaigns.game_state`; não são criadas tabelas ou funções novas.
- Migração SQL v0.5 ajusta o estado inicial de campanhas novas em bancos que já estavam na v0.4, sem alterar campanhas existentes.
- Documentação da primeira aventura e roteiro de testes narrativos.

## v0.4 — Combate por turnos, itens e progressão inicial

- Atributos aplicados aos cálculos de ataque, HP e Defesa.
- Equipamentos iniciais por classe: arma, armadura e, em algumas classes, escudo.
- Habilidade especial própria para cada uma das oito classes iniciais.
- Habilidades especiais utilizáveis uma vez por encontro.
- Ordem de iniciativa para aventureiros e monstro.
- Ações de turno: ataque básico, habilidade especial e Poção de Cura.
- Turno do monstro com ataques e habilidades simples específicas para Goblin das Cinzas, Lobo Cinzento e Drakthar.
- HP do grupo e do monstro persistidos no estado da campanha.
- Recompensa de XP para personagens que participaram do encontro.
- Progressão até o nível 20: +5 HP máximo e +1 no atributo principal por nível.
- Registro de XP por encontro para impedir recompensas duplicadas.
- Correção na progressão: derrotar uma criatura sem subir de nível não restaura indevidamente todo o HP; cada nível recupera apenas os 5 HP adicionais concedidos.
- Limite defensivo para manter o nível máximo em 20 no processamento de XP.
- Serialização no banco para impedir duas respostas quase simultâneas ao mesmo teste ou turno.
- Painel de combate e ordem de iniciativa sincronizados.
- Migração SQL da v0.3 para v0.4.
- Documentação reescrita para iniciantes, com instalação do Supabase do zero, publicação no GitHub Pages, checklist, regras, testes e solução de problemas.

## v0.3 — Primeira camada de experiência multiplayer

- Chat ao vivo compartilhado pela sala.
- Solicitações de D20 direcionadas a um jogador ou a todos.
- Validação no banco do identificador da solicitação e do jogador autorizado.
- Proteção contra respostas duplicadas ao mesmo D20.
- Recuperação de respostas pendentes após reconexão.
- Re-sincronização da campanha ao recuperar conectividade.
- Presença por aba e eleição da aba mestre ativa.
- Migração SQL para atualizar uma instalação v0.2 sem apagar as campanhas.

## v0.2 — Base multiplayer

- Campanhas compartilhadas no Supabase.
- Lobby com presença e criação de personagens.
- Estado da campanha salvo e retomável.
- D20, encontro e aprovação de dano.

## v0.1 — Fundação visual

- Identidade visual inicial.
- Navegação, campanhas locais, personagens e estrutura da biblioteca.


## v0.7 — Conta e continuidade entre dispositivos

- Adicionado painel de conta no cabeçalho.
- Acesso visitante convertido em conta permanente por vínculo de e-mail e senha, preservando a identidade do jogador.
- Login por e-mail e senha em outro dispositivo.
- Fluxo de confirmação de e-mail, criação de senha, alteração de senha e recuperação por e-mail.
- Limpeza de contexto ao trocar de identidade para evitar misturar campanhas de usuários diferentes.
- Miniaturas de personagens estilizadas por classe no mapa.
- Animação de ociosidade das miniaturas e destaque visual de monstros.
- Portas e altares interativos no mapa, com solicitação do jogador e validação do mestre.
- Novas instruções completas para Supabase Auth, manual linking, Site URL e Redirect URLs.
- Novo guia de login e progresso entre dispositivos e testes específicos de computador/celular.
- Migração v0.7 do banco mantém o modelo de dados anterior e adiciona apenas a RPC de interação com portas/altares quando o banco está na v0.6.

### Observação de teste

A sintaxe e os arquivos foram verificados localmente. O fluxo de e-mail requer um projeto Supabase configurado, Manual Linking habilitado e URLs de retorno válidas; não foi possível validar a entrega real de e-mails nesta cópia local.


## v1.3 — Combate reativo

- Miniaturas de aventureiros e monstros recebem animações temporárias de ataque, magia, cura, erro e impacto.
- O alvo recebe reação visual quando sofre dano; ataques de área destacam os alvos afetados.
- Eventos de combate incluem identificadores adicionais do ator/alvo para facilitar a sincronização visual.
- Efeitos visuais não alteram regras, HP ou resultados calculados pelo mestre ativo.
- Respeito a `prefers-reduced-motion`.
- Nenhuma migração SQL.


## 22. v2.0 — equipamento funcional
- Mercado ampliado com armas, armaduras e escudos compráveis.
- Equipar e retirar itens com persistência em `partyState`.
- Defesa efetiva calculada a partir de Destreza, armadura e escudo.
- Armas registram dado-base de dano.
- Biblioteca recebe o sétimo capítulo em cada volume.
- Sem migração SQL; compatível com campanhas existentes.


## 23. v2.1 — raridades, requisitos e conjuntos
- Cinco novos equipamentos Raros no mercado, com bônus explícitos de precisão, dano ou Defesa.
- Requisitos de nível e classe validados pelo mestre ativo ao equipar.
- Conjunto Vanguarda: três peças equipadas concedem +1 Defesa e +1 no ataque.
- Bônus de equipamento integrados ao cálculo de ataques e Defesa.
- Inventário apresenta bônus de ataque e progresso do conjunto.
- Oito capítulos de consulta em cada um dos sete livros.
- Sem migração SQL; estado persistido em `partyState`, preservando campanhas anteriores.
