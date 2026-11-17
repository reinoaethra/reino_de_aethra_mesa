# Guia de Chefes e Fases — Reino de Aethra v1.0

Este guia explica a nova mecânica de chefe em fases. Ela está implementada inicialmente em **Drakthar, o Devorador**.

## Como funciona

O chefe começa na Fase I. Quando os aventureiros reduzem seu HP a 66% ou menos, o sistema muda para a Fase II. Ao chegar a 33% ou menos, muda para a Fase III. A transição é automática e aparece para todos os participantes conectados à campanha.

| Fase | Condição | Defesa | Bônus de ataque | Sopro |
|---|---|---:|---:|---:|
| I — O Devorador desperta | HP acima de 66% | 18 | +8 | 2d8 + 4 |
| II — As escamas se incendeiam | HP de 34% a 66% | 19 | +9 | 3d8 + 6 |
| III — Fúria do Dragão Ancião | HP igual ou inferior a 33% | 20 | +10 | 4d8 + 8 |

## Sopro das Cinzas

- O monstro precisa estar no próprio turno.
- O D20 natural precisa ser 17 ou maior.
- O dano é rolado uma vez e aplicado a todos os aventureiros vivos.
- O sopro pode ser usado uma vez em cada fase. A lista de fases utilizadas é salva no estado do encontro.
- Se Drakthar avançar para outra fase, ele ganha acesso ao uso daquela nova fase, sem recuperar os usos anteriores.

## O que o mestre verá

O cartão de batalha mostra o nome da fase, uma descrição narrativa e a quantidade de sopros já utilizados. A Defesa do chefe também é atualizada no cartão e nos cálculos de ataque. O mestre pode acelerar ou testar as transições usando o campo de dano manual.

## Instalação e compatibilidade

Não existe SQL novo para esta funcionalidade. As propriedades `bossPhase`, `bossPhaseName`, `bossPhaseDescription`, `baseDefense`, `baseAttackBonus` e `breathPhases` ficam dentro do objeto do encontro em `campaigns.game_state`. Encontros antigos continuam compatíveis: quando necessário, os valores-base são recuperados dos atributos do monstro.

## Teste recomendado

1. Inicie um encontro com Drakthar.
2. Confirme que aparece a Fase I.
3. Aplique dano até restarem 66% do HP ou menos e confirme a Fase II.
4. Aplique dano até restarem 33% do HP ou menos e confirme a Fase III.
5. Em cada fase, avance até o turno do monstro e verifique o Sopro das Cinzas com D20 natural 17 ou mais.
6. Atualize a página e confirme que a fase e os sopros usados continuam registrados.

A rolagem é aleatória; para testar o sopro, talvez seja necessário repetir o turno algumas vezes. Este roteiro é uma verificação manual, não uma afirmação de teste multiplayer já realizado.
