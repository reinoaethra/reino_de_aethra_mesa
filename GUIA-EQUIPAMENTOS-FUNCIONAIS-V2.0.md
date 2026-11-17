# Guia de Equipamentos Funcionais — Reino de Aethra v2.0

## O que mudou
A v2.0 adiciona armas, armaduras e escudos que podem ser comprados, equipados e retirados. A alteração é salva no estado da campanha por jogador e sincroniza pelo mecanismo existente.

## Como comprar e equipar
1. Entre na campanha com a conta do mestre.
2. Abra a Central do Mestre e escolha **Abrir comércio**.
3. Selecione o aventureiro correto no campo Aventureiro.
4. Compre uma mercadoria na lista.
5. Na seção **Equipamento do aventureiro**, use **Equipar** no item desejado.
6. Para trocar uma peça, equipe outra do mesmo espaço; a anterior retorna à mochila. Use **Retirar** para remover sem substituir.

## Equipamentos incluídos
| Item | Espaço | Efeito | Preço |
|---|---|---:|---:|
| Espada de Aço | Arma | Dano-base 1d8 | 85 PO |
| Machado de Guerra | Arma | Dano-base 1d10 | 110 PO |
| Cota Reforçada | Armadura | +3 Defesa | 125 PO |
| Broquel de Ferro | Escudo | +1 Defesa | 65 PO |

## Regras e persistência
- Defesa efetiva = 10 + modificador de Destreza + Defesa da armadura + Defesa do escudo.
- A arma registra o dado-base de dano usado como referência no combate.
- Cada personagem possui até um item por espaço: arma, armadura e escudo.
- Ao substituir uma peça, a anterior retorna à mochila; o item equipado é removido da quantidade disponível.
- Equipamentos ficam em `game_state.partyState[user_id].equipment`; inventário, moedas e demais dados permanecem no mesmo registro.
- Somente o mestre controlador pode conduzir compras e trocas nesta versão, reduzindo conflitos de gravação entre participantes.

## Atualização
Substitua os arquivos da publicação pelos desta versão, preservando `config.js`. Não execute SQL: a atualização utiliza o campo JSON `game_state` existente. Campanhas anteriores continuam compatíveis; equipamentos ausentes usam os itens que já estavam na ficha.

## Limites conhecidos
Não há durabilidade, reparos, encantamentos, requisitos por classe, bônus de atributos por raridade ou comparação automática de dano médio. O dano de ataques e efeitos especiais ainda segue o fluxo de combate já existente e a resolução do mestre.
