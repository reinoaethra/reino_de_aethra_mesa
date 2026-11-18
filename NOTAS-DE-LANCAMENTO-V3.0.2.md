# Reino de Aethra — v3.0.2

## Mapas do projeto importados

A atualização incorpora os 11 tabuleiros enviados no arquivo `reino-de-aethra-mapas-2026-11-18.zip`. Cada cenário utiliza a imagem do próprio projeto como fundo e a planta 10×8 para controlar o que é caminhável. Entradas, saídas, portas e Pontos de Interesse vieram do projeto de mapas, sem reconstrução manual de coordenadas.

## Visual dos espaços

O jogo não desenha mais ícones artificiais de terreno sobre o cenário. A imagem já mostra pisos, água, árvores, muros, construções e demais elementos. As casas bloqueadas são escurecidas para indicar que não podem ser atravessadas, sem símbolos de muro, água ou rocha.

## Movimento diagonal

- O jogador e o mestre podem deslocar miniaturas na horizontal, vertical ou diagonal.
- Cada diagonal custa uma casa de movimento.
- O limite continua sendo quatro casas por turno (ou o movimento restante na rodada).
- Para passar na diagonal, as duas casas laterais do canto devem estar livres. Isso evita atravessar o canto de duas paredes/obstáculos ou uma parede e uma porta fechada.
- Bases maiores também verificam todas as casas ocupadas e os espaços laterais da diagonal.
- O mestre continua validando os pedidos dos jogadores.

## Instalação

1. Extraia o ZIP da v3.0.2.
2. Substitua os arquivos do site pelos arquivos do pacote, mantendo a pasta `assets/maps/` completa.
3. Preserve o `config.js` que já está configurado no seu site.
4. Não execute migração SQL nesta atualização. As funções RPC da v3.0.1 já aceitam os onze mapas; a diagonal é validada pelo código do jogo.
5. Publique e teste um mapa com um jogador no computador e outro em dispositivo diferente.

Esta atualização não altera contas, campanhas, fichas, equipamentos, inventários ou progresso salvo.
