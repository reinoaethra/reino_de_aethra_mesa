# Guia de equipamentos, raridades e conjuntos — v2.1

Este guia explica as novidades do Reino de Aethra v2.1. A atualização parte da v2.0 e não exige alteração no banco Supabase.

## 1. O que mudou

Os equipamentos agora podem conceder bônus mecânicos além do dado de dano e da Defesa. O mercado oferece cinco novas peças Raras:

| Item | Classe permitida | Nível mínimo | Efeito |
|---|---|---:|---|
| Lâmina da Vanguarda | Guerreiro, Paladino | 5 | Dano 1d10, +1 precisão e +1 dano |
| Peitoral da Vanguarda | Guerreiro, Paladino | 5 | +4 Defesa |
| Broquel da Vanguarda | Guerreiro, Paladino | 5 | +2 Defesa |
| Arco da Lua Prateada | Patrulheiro, Assassino | 4 | Dano 1d8, +2 precisão e +1 dano |
| Foco da Aurora | Arcano, Clérigo, Druida, Invocador | 4 | Dano 1d8, +1 precisão e +1 dano |

Precisão é somada ao teste de ataque. Bônus de dano é somado ao dano da arma. Defesa de armadura e escudo é somada à Defesa derivada da Destreza.

## 2. Conjunto Vanguarda

O conjunto é formado por:
- Lâmina da Vanguarda (arma)
- Peitoral da Vanguarda (armadura)
- Broquel da Vanguarda (escudo)

Quando as três peças estão equipadas simultaneamente, o personagem recebe **+1 Defesa e +1 no ataque**. Com uma ou duas peças, o bônus de conjunto não é aplicado. A mochila mostra quantas peças do conjunto estão equipadas.

## 3. Como comprar e equipar

1. O mestre ativo abre o comércio da companhia.
2. Seleciona o aventureiro que receberá o item.
3. Confere preço, raridade, classe permitida e nível mínimo na descrição da mercadoria.
4. Registra a compra.
5. Na seção de equipamento, seleciona **Equipar**.
6. Se a classe ou o nível não atender ao requisito, o jogo bloqueia a troca e informa o motivo.

Ao substituir uma peça, o equipamento anterior retorna à mochila. O estado é salvo em `game_state.partyState`, como na v2.0.

## 4. Como conferir os bônus

No inventário, confira:
- **Defesa efetiva:** Destreza + armadura + escudo + bônus de conjunto.
- **Bônus de ataque:** soma da precisão das peças equipadas e do bônus de conjunto.
- **Arma:** dado-base, bônus de dano e precisão aparecem na descrição.
- **Conjunto:** quantidade de peças Vanguarda equipadas e bônus ativo.

O cálculo de combate usa os bônus do equipamento no ataque e no dano. Habilidades de classe continuam seguindo suas próprias regras.

## 5. Compatibilidade e limites

- Não é necessária migração SQL.
- Campanhas existentes mantêm seus equipamentos; itens antigos sem raridade são tratados como Comuns.
- Somente o mestre controlador pode confirmar compras e alterações de equipamento.
- Durabilidade, reparos, encantamentos e raridades Épica/Lendária com efeitos próprios ainda não fazem parte desta versão.
- O conteúdo do Livro do Mestre fica no código entregue ao navegador; não use a biblioteca pública para guardar segredos que precisem de confidencialidade.

## 6. Publicação

Substitua os arquivos da versão anterior pelos arquivos da v2.1 no GitHub Pages. Preserve o `config.js` já configurado com os dados do seu projeto Supabase. Não substitua seu arquivo de configuração por um modelo vazio.
