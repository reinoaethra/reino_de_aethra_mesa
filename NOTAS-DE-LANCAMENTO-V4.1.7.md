# Reino de Aethra — Notas de lançamento v4.1.7

## Objetivo

Corrigir a interação da rolagem vertical na ficha do Bestiário. Na v4.1.6, a barra interna podia ser arrastada, mas a roda do mouse/touchpad nem sempre era aplicada ao painel de detalhes; o evento acabava disputando a rolagem do modal externo.

## Alterações

- Rolagem da ficha à direita por roda do mouse e touchpad.
- Rolagem da seleção à esquerda também permanece independente.
- Normalização de eventos `wheel` emitidos em unidades de linha ou página.
- Prevenção da propagação da rolagem para o modal externo enquanto o ponteiro está sobre um painel interno rolável.
- Mantido o comportamento de toque em dispositivos móveis.
- Chaves de cache atualizadas para v4.1.7.

## Compatibilidade

- Preserva a seleção quadrada e o espaçamento da v4.1.6.
- Preserva miniaturas, dados de monstros, composições e encontros.
- Não altera `config.js`, assets, banco de dados, campanhas ou fichas.
- Não requer migração SQL.

## Limites de validação

Os testes locais verificam o tratamento do evento `wheel`, as regras CSS de rolagem e as regressões de versões anteriores. Recomenda-se conferir o comportamento no navegador publicado, com mouse, touchpad e tela sensível ao toque.
