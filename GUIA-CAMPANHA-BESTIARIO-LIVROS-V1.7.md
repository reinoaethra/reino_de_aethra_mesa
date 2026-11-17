# Guia da campanha, mapas, recompensas e livros — v1.7

Este guia complementa o README e explica as novidades da versão 1.7 do Reino de Aethra.

## 1. Mapas regionais

O mestre pode trocar o mapa no painel tático. Foram adicionados quatro tabuleiros de 10 × 8 casas:

- **Recife das Vozes — Thalassor:** piscinas profundas, passagens de pedra e terreno costeiro.
- **Galeria Prismática — Nivéria:** corredores de cristal, colunas e rochas que bloqueiam o deslocamento.
- **Altar do Sol Partido — Solária:** pátio de pedra, colunas e caminho central até o altar.
- **Cidadela de Braseiro — Drakmor:** muralhas, passagens de basalto e estruturas da fortaleza.

Os mapas usam o mesmo sistema de movimento, bloqueios, peças, marcadores e névoa de guerra já existente. Ao trocar de mapa, a exploração e as peças ficam registradas por mapa; o mestre deve posicionar/revelar elementos conforme a cena.

## 2. Novas criaturas

| Criatura | Nível | HP | Defesa | XP | Habilidade |
|---|---:|---:|---:|---:|---|
| Caranguejo-Catedral | 6 | 138 | 17 | 112 | Pinça de Recife |
| Sentinela Prismática | 8 | 188 | 19 | 180 | Refração Arcana |
| Acólito do Sol Partido | 8 | 154 | 17 | 168 | Lança do Meio-Dia |

A Sentinela Prismática e o Acólito do Sol Partido são encontros avançados. Ajuste HP e quantidade de inimigos ao nível e ao número de personagens. As descrições das habilidades são orientações para o mestre; não substituem testes ou efeitos que ainda não estejam implementados na ficha.

## 3. Entrega de recompensas

Quando uma missão termina, o mestre verá o botão **Entregar recompensa à companhia** se ela possuir pacote automático. Ao confirmar:

1. O sistema identifica todos os participantes com personagem na campanha.
2. Adiciona as moedas ao saldo de cada personagem.
3. Adiciona os itens ao inventário; itens com o mesmo ID acumulam quantidade.
4. Marca a missão com `rewardClaimed` e registra a entrega no diário.

A marca de entrega evita duplicação pela mesma missão. Se a campanha já tiver recebido uma recompensa fora do jogo, não use o botão novamente.

**Pacotes automáticos nesta versão:** missões principais `main-01` a `main-07` (não inclui a conclusão final `main-08`), e missões secundárias `side-01`, `side-04`, `side-05` e `side-06`. Outras missões continuam com entrega manual.

**Importante:** o XP listado na descrição narrativa da missão não é distribuído por este botão. A experiência por combate continua no sistema de combate; XP adicional por conclusão de missão deve ser concedido manualmente pelo mestre.

No multiplayer, a ação de entrega só pode ser feita pelo mestre controlador ativo, e os dados são salvos no estado compartilhado da campanha. Ainda assim, teste a função com uma campanha de demonstração antes de usar em uma sessão importante.

## 4. Biblioteca

Os sete livros agora possuem cinco capítulos de consulta. O quinto capítulo trata de continuidade de campanha, ecologia de monstros, arenas de chefes, viagens, limites mágicos, registro de tesouros e inventário.

Os livros continuam em desenvolvimento: ainda faltam volumes completos, tabelas extensas, ilustrações editoriais e PDFs diagramados. O Livro do Mestre permanece no frontend e não deve conter segredos que precisem de confidencialidade técnica.

## 5. Atualizar uma instalação existente

1. Baixe o ZIP v1.7 e extraia os arquivos.
2. Preserve uma cópia de segurança da campanha e do arquivo `config.js`.
3. Substitua os arquivos publicados no repositório GitHub pelos arquivos da pasta `reino-de-aethra`.
4. Não substitua seu `config.js` com uma configuração vazia: mantenha a URL e a Publishable key do seu projeto.
5. Publique pelo GitHub Pages e atualize o navegador.

Nenhuma migração SQL é necessária. O JSON da campanha recebe propriedades opcionais; campanhas anteriores continuam usando o mesmo esquema.

## 6. Limitações conhecidas

- Mapas são tabuleiros táticos funcionais, não mapas artísticos ilustrados.
- Nem todos os objetivos narrativos são automáticos.
- Apenas as missões indicadas possuem entrega automática de itens e moedas.
- XP de conclusão de missão ainda é manual.
- Não foi realizado teste visual em navegador nem multiplayer contra um projeto Supabase real nesta entrega.
