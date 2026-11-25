# Reino de Aethra — Notas de lançamento v4.1.6

## Objetivo

A v4.1.6 é um refinamento visual incremental do Bestiário, sobre a v4.1.5. O objetivo é deixar os cartões quadrados das miniaturas mais separados, evitando que pareçam encostados ou empilhados na coluna de seleção.

## Alterações

- Espaçamento vertical de 24 px e horizontal de 20 px em telas desktop.
- Em telas intermediárias (até 980 px): 21 px vertical e 17 px horizontal.
- Em telas menores (até 760 px): 18 px vertical e 15 px horizontal.
- Em telas estreitas (até 420 px): 16 px vertical e 13 px horizontal.
- Reforçado o espaçamento interno da grade para afastar miniaturas das bordas e da barra de rolagem.
- Mantidos os cartões quadrados com apenas a miniatura, a seleção vertical à esquerda, a ficha à direita e as rolagens independentes.

## Compatibilidade

- Preserva as funcionalidades do Bestiário e as ferramentas das versões anteriores.
- Não altera estrutura de dados, campanhas, contas, participantes ou permissões.
- Não requer migração SQL.
- Não modifica `config.js` nem a pasta `assets/`.
