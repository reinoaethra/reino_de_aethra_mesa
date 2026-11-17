# Guia da campanha, bestiário e biblioteca — v1.6

## O que mudou

A v1.6 prolonga a campanha de Aethra, amplia o bestiário e dá mais conteúdo aos sete livros. A história passa a ter oito missões principais e sete secundárias. O novo arco leva os heróis a Drakmor, onde a Forja dos Juramentos guarda pistas sobre a origem das relíquias e a ligação de Vharzun com a Guerra da Ruptura Celestial.

## Campanha principal — capítulos I a VIII

1. **Ecos na Estrada de Eldoria** — ataques na estrada, Ilyra e o fragmento da profecia.
2. **As Raízes Sob a Pedra** — galerias subterrâneas, Irmão Cael e o selo ritual.
3. **O Véu sobre as Marés** — Thalassor, Capitã Maera, culto e ruínas submersas.
4. **O Coração de Cristal** — Nivéria, Arquivista Vaelis e o draco de cristal.
5. **A Coroa do Eclipse** — Solária, Oráculo Asha e o altar solar.
6. **A Forja dos Juramentos** — Drakmor, Mestre Ferreiro Brann, Passagem do Basalto e a forja ancestral.
7. **O General das Cinzas** — Malgor reúne suas forças e ameaça converter a forja em arma.
8. **O Caminho até Vharzun** — a companhia reúne as relíquias, alcança a Prisão Celestial e decide o destino de Elyndra.

Os capítulos II a VIII começam como disponíveis. O mestre deve apresentar/aceitar cada missão na central de jornada. Isso permite adaptar o ritmo e não força a campanha a avançar antes que o grupo esteja pronto.

## Missões secundárias

- **A Carga Perdida de Tovin** — recuperar as ferramentas do ferreiro.
- **Luzes entre as Copas** — investigar luzes na floresta e afastar lobos.
- **O Sino que Não Devia Tocar** — descobrir a origem de um espírito no campanário.
- **Sal para os Afogados** — investigar ataques a embarcações em Thalassor.
- **O Cão de Fogo Perdido** — conter um Sabueso das Brasas em Drakmor.
- **O Último Canto do Naufrágio** — recuperar o diário de um navio e enfrentar um Saqueador Afogado.
- **O Silêncio da Biblioteca** — proteger os registros de Nivéria de um Revenante da Geada.

## Novos monstros da v1.6

| Criatura | Nível | HP | Defesa | XP | Habilidade |
|---|---:|---:|---:|---:|---|
| Sabueso das Brasas | 4 | 82 | 14 | 72 | Investida flamejante |
| Guardião das Raízes | 5 | 124 | 16 | 98 | Laços vivos |
| Saqueador Afogado | 6 | 108 | 15 | 105 | Gancho de coral |
| Revenante da Geada | 7 | 142 | 17 | 145 | Lamento congelante |
| Escorpião do Sol Partido | 8 | 176 | 18 | 175 | Ferrão eclipsado |
| Malgor, General das Cinzas | 10 | 360 | 19 | 320 | Comando da Ruína |

As estatísticas são pontos de partida. O mestre pode ajustar HP, dano e quantidade de inimigos conforme o nível, tamanho e recursos do grupo.

## Progressão automática de objetivos

Quando um encontro termina com a derrota da criatura e o mestre ativo confirma o resultado, o sistema consulta o identificador interno do monstro e tenta concluir os objetivos associados. A operação é idempotente no nível do objetivo: se ele já estiver concluído, não cria outro registro de progresso.

Mapeamentos principais:

- Goblin das Cinzas → objetivo de derrotar os goblins em `main-01`.
- Aranha de Umbrafunda → `main-02`.
- Cultista e Sereia Abissal → `main-03`.
- Draco de Cristal Niveriano → `main-04`.
- Cavaleiro Oco de Solária → `main-05`.
- Sabueso das Brasas → `main-06` e `side-05`.
- Malgor → `main-07`.
- Revenante da Geada → `main-08` e `side-07`.
- Lobo Cinzento, Espectro da Ruptura e Saqueador Afogado → objetivos secundários correspondentes.

**Condições importantes:** a missão precisa estar ativa; missões disponíveis não recebem progresso. O mestre ativo continua sendo a autoridade da sessão. A automação não conclui a missão inteira quando existem outros objetivos pendentes. A conclusão da missão e a entrega de recompensas seguem as regras atuais da central de jornada.

A revelação do NPC Brann conclui o objetivo `meet-brann` da missão `main-06`, desde que ela esteja ativa.

## O que ainda é manual

- Investigar rastros, encontrar itens, decifrar mapas, abrir passagens, ativar altares e recuperar relíquias.
- Marcar objetivos de conversa e escolhas narrativas não mapeados para NPCs.
- Apresentar missões e controlar a ordem dos capítulos.
- Entregar moedas, equipamentos e itens das recompensas no inventário.
- Registrar o desfecho final de Vharzun e Elyndra.

O objetivo é automatizar eventos inequívocos sem tentar adivinhar o sentido de uma ação a partir do texto escrito pelo jogador.

## Os sete livros

Todos os volumes passam a ter quatro capítulos iniciais de consulta:

1. **Livro do Mestre** — condução da crônica, estrutura da campanha, ritmo e preparação de sessões.
2. **Bestiário de Aethra** — leitura de fichas, criaturas catalogadas, comportamento e novas criaturas da v1.6.
3. **Os Grandes Chefes** — construção de chefes, Drakthar e Malgor.
4. **Atlas dos Cinco Reinos** — origem de Aethra, reinos já conhecidos e rotas de Drakmor.
5. **Grimório das Artes Arcanas** — princípios, escolas, conjuração, efeitos e resistência.
6. **Arsenal e Relíquias** — raridade, armas, armaduras, consumíveis e relíquias de campanha.
7. **Manual do Aventureiro** — criação de heróis, testes, combate, exploração e cooperação.

Estes volumes ainda são uma edição digital em desenvolvimento, não livros completos. Permanecem pendentes capítulos extensos, tabelas finais, ilustrações editoriais próprias e PDFs diagramados. O Livro do Mestre está no frontend; não coloque segredos privados ou informações que não possam ser vistas por jogadores no código público.

## Atualização da v1.5 para a v1.6

1. Faça uma cópia de segurança do repositório e da base de dados antes de publicar.
2. Baixe e extraia o ZIP da v1.6.
3. Substitua os arquivos do site pelos arquivos novos.
4. Preserve seu `config.js` com a URL e a chave pública do Supabase já configuradas.
5. Preserve a pasta de imagens `assets/portraits/` e demais recursos do pacote.
6. Publique os arquivos atualizados no GitHub Pages e aguarde a atualização do site.
7. Abra a campanha existente e confira a central de jornada. As missões novas são anexadas pelos IDs ausentes; objetivos e missões antigos são mantidos.
8. Teste primeiro em uma campanha de demonstração: aceite uma missão, derrote um monstro associado e confirme o registro no diário.

**Banco de dados:** nenhuma migração SQL é necessária na v1.6. O esquema e as funções do Supabase não foram alterados.

## Verificações e limites desta entrega

Foram verificadas a sintaxe JavaScript, a integridade do ZIP, a estrutura do HTML e a presença das novas missões, criaturas, cenas, NPC e capítulos dos livros. Não foi realizado teste visual completo em navegador nem teste multiplayer conectado ao projeto Supabase real do usuário. O roteiro `TESTE-MULTIPLAYER.md` continua necessário para validar a sincronização no ambiente publicado.
