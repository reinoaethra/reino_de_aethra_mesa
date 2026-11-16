# Regras de combate — Reino de Aethra v0.4

Este documento explica as regras de combate implementadas nesta versão. Os valores são o primeiro equilíbrio de teste de Aethra e poderão mudar após partidas reais.

## 1. Atributos

Cada personagem possui seis atributos:

| Atributo | Uso principal |
|---|---|
| Força | Ataques físicos de Guerreiro e Paladino. |
| Destreza | Ataques de Patrulheiro e Assassino, Defesa e iniciativa. |
| Constituição | Define parte dos pontos de vida máximos. |
| Inteligência | Ataques de Arcano e Invocador. |
| Sabedoria | Ataques de Clérigo e Druida. |
| Carisma | Presença e interação social; ainda não tem um modificador de combate nesta versão. |

Na criação inicial, o jogador distribui 24 pontos. Cada atributo começa em 1 e pode ir até 8 durante a criação.

### Modificador do atributo

A regra usada pelo código é:

`modificador = piso((valor do atributo - 4) / 2)`

Exemplos:

| Valor | Modificador |
|---:|---:|
| 1 | -2 |
| 2 | -1 |
| 3 | -1 |
| 4 | 0 |
| 5 | 0 |
| 6 | +1 |
| 7 | +1 |
| 8 | +2 |
| 9 | +2 |
| 10 | +3 |

## 2. Pontos de vida e Defesa

### HP máximo inicial

`HP máximo = 20 + (Constituição × 2)`

O HP atual não pode ficar abaixo de zero nem acima do máximo.

### Defesa

`Defesa = 10 + modificador de Destreza + Defesa da armadura + Defesa do escudo`

Os valores de armadura e escudo são somados automaticamente ao criar a ficha.

### Iniciativa

No começo de cada encontro, cada personagem que possui ficha rola:

`D20 + modificador de Destreza`

O monstro rola:

`D20 + bônus de iniciativa do monstro`

A ordem é organizada do maior resultado para o menor. Empates são organizados pelo nome nesta versão.

## 3. Teste de ataque de um aventureiro

`Ataque total = D20 + 2 (treinamento inicial) + modificador do atributo principal + precisão da arma + bônus da habilidade, se houver`

O personagem acerta quando o resultado total é igual ou maior que a Defesa do monstro.

Regras especiais:

- Natural 1: o ataque erra automaticamente.
- Natural 20: o ataque acerta automaticamente e causa um dado adicional do dano da arma.
- Um resultado natural é o número que saiu no D20, antes de somar os bônus.

## 4. Dano

O dano de um ataque normal é:

`Dano = dado de dano da arma + modificador do atributo principal`

O dano mínimo aplicado em um ataque que acertou é 1.

Se o personagem usar sua habilidade especial de dano, o dado indicado pela classe é acrescentado. Em um acerto crítico, um dado adicional da arma também é acrescentado.

## 5. Habilidades de classe

Cada habilidade especial pode ser usada uma vez por encontro.

| Classe | Habilidade | Efeito atual |
|---|---|---|
| Guerreiro | Golpe Poderoso | +1d8 de dano. |
| Arcano | Explosão Arcana | +1 no ataque e +1d8 de dano. |
| Patrulheiro | Flecha Certeira | +2 no ataque e +1d6 de dano. |
| Paladino | Golpe Radiante | +1d8 de dano. |
| Assassino | Ataque das Sombras | +2 no ataque e +1d8 de dano. |
| Clérigo | Luz Restauradora | Cura 1d8 + modificador de Sabedoria, com mínimo de 1 ponto. |
| Druida | Raízes Ancestrais | +1 no ataque e +1d8 de dano. |
| Invocador | Espírito Guardião | +1d8 de dano. |

A habilidade especial do Clérigo é de cura e não exige um teste de ataque contra o monstro.

## 6. Poção de Cura

O inventário inicial contém duas Poções de Cura.

`Cura = 1d8 + 2 HP`

A poção só pode ser usada no turno do personagem. A quantidade consumida é salva na campanha.

## 7. Turnos

1. O sistema calcula a iniciativa.
2. O personagem com maior iniciativa começa.
3. No turno do jogador, ele escolhe ataque básico, habilidade especial ou poção.
4. O navegador do mestre recebe a ação, calcula o resultado e publica o estado atualizado.
5. O turno avança automaticamente.
6. Quando chega a vez do monstro, o mestre clica em **Resolver ação do monstro**.
7. O monstro ataca e o turno avança.
8. O ciclo continua até o monstro ser derrotado ou o mestre encerrar o encontro.

O mestre pode usar **Avançar / pular turno** para resolver uma situação especial manualmente.

## 8. Criaturas iniciais

| Criatura | HP | Defesa | Ataque | Dano | XP por aventureiro |
|---|---:|---:|---:|---:|---:|
| Goblin das Cinzas | 42 | 12 | +3 | 1d6 + 1 | 25 |
| Lobo Cinzento | 58 | 13 | +4 | 1d8 + 1 | 40 |
| Drakthar, o Devorador | 720 | 18 | +8 | 1d10 + 4 | 250 |

### Habilidades dos monstros

- **Goblin das Cinzas — Golpe oportunista:** recebe +1 no ataque quando é o primeiro da ordem de iniciativa.
- **Lobo Cinzento — Mordida dilacerante:** quando o D20 natural do ataque é 18 ou mais e o ataque acerta, acrescenta 1d6 de dano.
- **Drakthar — Sopro das Cinzas:** uma vez por encontro, quando o D20 natural do monstro é 17 ou mais, causa 2d8 + 4 de dano a todos os aventureiros que ainda possuem HP.

O monstro escolhe aleatoriamente um aventureiro vivo nos ataques normais. A decisão é processada pelo navegador do mestre.

## 9. Experiência e subida de nível

Ao derrotar uma criatura, cada personagem que participou daquele encontro recebe a recompensa indicada na tabela de criaturas.

O limite atual é nível 20. A progressão utiliza marcos acumulados:

- Para chegar ao nível 2: 100 XP.
- Para chegar ao nível 3: 200 XP acumulados.
- Para chegar ao nível 4: 300 XP acumulados.
- E assim por diante, até o limite de nível 20.

A cada nível:

- +5 HP máximo;
- +1 no atributo principal da classe, até o máximo de 12;
- o HP atual recebe os 5 pontos adicionais do nível, sem ultrapassar o novo máximo.

Atributos principais:

- Guerreiro e Paladino: Força.
- Patrulheiro e Assassino: Destreza.
- Arcano e Invocador: Inteligência.
- Clérigo e Druida: Sabedoria.

O banco registra quais jogadores já receberam XP por aquele encontro. Isso evita distribuir a mesma recompensa novamente se o mestre reconectar ou atualizar a tela.

## 10. O que é manual nesta versão

- O mestre escolhe qual criatura inicia o encontro.
- O mestre resolve o turno do monstro clicando no botão.
- O mestre pode aplicar dano manual para corrigir uma situação narrativa.
- O mestre pode avançar ou pular um turno.
- O mestre pode encerrar o encontro.

## 11. O que ainda será desenvolvido

As regras atuais ainda não incluem um sistema completo de resistência a condições, armaduras equipáveis dinamicamente, economia, peso, munição, alcance, movimento por mapa, magia com custos e listas completas de habilidades. O inventário já mostra os equipamentos iniciais e permite usar a poção de cura durante o combate, mas a troca de equipamentos pela interface ainda não está pronta.
