# Guia da versão 2.2 — progressão, raridades e desafios até o nível 50

Este guia explica as regras novas do Reino de Aethra em linguagem direta.

## 1. Progressão do personagem

- O nível máximo agora é **50**.
- O XP necessário para subir do nível atual é `nível atual × 100`. Exemplo: do nível 10 para o 11 são 1.000 XP; do 49 para o 50 são 4.900 XP.
- Cada nível concede **+10 HP máximo** e recupera até esses 10 HP.
- Cada nível aumenta em 1 o atributo principal da classe, até o limite 30.
- No nível 50, o personagem continua podendo receber XP, mas não passa do nível máximo.
- Os encontros distribuem a recompensa para os jogadores que participaram, com proteção contra duplicação mantida pela tabela `campaign_xp_awards`.

## 2. Escala de raridade

| Raridade | Poder por peça | Bônus de conjunto completo |
|---|---:|---:|
| Comum | +1 | +1 |
| Incomum | +3 | +2 |
| Raro | +10 | +5 |
| Épico | +25 | +12 |
| Lendário | +100 | +30 |
| Mítico | +150 | +45 |

Armas recebem o poder da raridade no ataque e no dano, além do dado-base. Armaduras e escudos recebem o poder na Defesa, além do valor base. Exemplo: uma arma Lendária concede +100 no ataque e +100 no dano; uma armadura Lendária concede +100 Defesa.

## 3. Conjuntos

Um conjunto só ativa quando arma, armadura e escudo possuem o mesmo `setId`. O bônus depende da raridade. Vanguarda é Raro (+5 ataque e +5 Defesa); Aurora Eterna é Épico; Celestial possui três peças Lendárias e concede +30 ataque e +30 Defesa quando completo.

## 4. Requisitos

`requiredLevel` e `requiredClasses` são verificados ao equipar. O mestre ainda pode registrar a compra de um item incompatível, mas a equipagem permanece bloqueada até que o personagem atenda aos requisitos.

## 5. Monstros e chefes

Foram adicionados nove inimigos de progressão tardia: Quimera Carmesim (12), Arauto do Vazio (16), Titã Primordial (20), Serpe da Tempestade (25), Rainha de Cristal (30), Devorador das Marés (35), Arconte do Sol Partido (40), Colosso da Umbra (45) e Vharzun (50).

Ao iniciar um encontro, o sistema considera o nível médio dos personagens participantes. Se o grupo estiver acima do nível original da criatura, HP, Defesa, ataque e XP são ajustados. Chefes recebem resistência adicional. Vharzun é o chefe final de três fases; sua Defesa e seu ataque aumentam a cada fase, e seu sopro ancestral cresce em poder.

As habilidades descritas nas fichas dos outros monstros novos são orientações para o mestre, não automação completa de cada efeito especial.

## 6. Atualizar o Supabase (obrigatório em campanhas existentes)

1. Abra o painel do Supabase e entre em **SQL Editor**.
2. Abra `supabase-migration-v2.2.sql`, copie todo o conteúdo e cole em uma nova consulta.
3. Clique em **Run** uma única vez.
4. Publique os arquivos do jogo v2.2 no GitHub Pages.

A migração atualiza a RPC de XP para nível 50, +10 HP por nível e recompensas de até 50.000 XP, preservando os registros de recompensas já distribuídas.

**Instalação nova:** use o `supabase-schema.sql` atualizado. Não execute também a migração v2.2 em um banco criado com esse schema.

## 7. Equilíbrio

Os valores Lendários e Míticos são intencionalmente muito altos e mudam radicalmente a escala do combate. Distribua essas peças em marcos importantes; se forem entregues cedo, os encontros podem ficar fáceis até que o mestre apresente ameaças equivalentes.

A v2.2 ainda não implementa encantamentos, durabilidade ou reparos.
