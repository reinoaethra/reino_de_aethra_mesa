# Checklist de publicação — Reino de Aethra v4.0.0

## Arquivos

- [ ] Conferir que `index.html`, `app.js` e `styles.css` são da v4.0.0.
- [ ] Manter o `config.js` original.
- [ ] Manter todas as pastas e imagens de `assets/`.
- [ ] Confirmar que a publicação do GitHub Pages terminou.
- [ ] Fazer atualização sem cache no computador e reabrir no celular.

## Conta e campanha

- [ ] Entrar com uma conta existente em dois dispositivos.
- [ ] Abrir a mesma campanha sem criar sessão visitante por engano.
- [ ] Confirmar que mestre e jogadores veem a mesma campanha.
- [ ] Confirmar que só o mestre ativo consegue alterar estado compartilhado.

## Central do Mestre

- [ ] Conferir participantes online, missões, encontro e capítulo.
- [ ] Salvar preparação da próxima sessão.
- [ ] Salvar resumo e confirmar que aparece no Diário compartilhado.
- [ ] Criar uma decisão, votar com mais de um jogador e confirmar que um usuário não vota duas vezes.
- [ ] Confirmar manualmente a opção e conferir a consequência no Diário.
- [ ] Adicionar lembrança/confiança de NPC.
- [ ] Distribuir uma pequena quantidade de ouro/item a um jogador e verificar o inventário.
- [ ] Exportar backup antes de testar restauração.

## Combate

- [ ] Iniciar um encontro com pelo menos dois monstros.
- [ ] Confirmar que o cartão de HP acompanha o monstro no turno ativo.
- [ ] Aplicar Atordoado e confirmar que o alvo perde uma ação sem ser considerado derrotado.
- [ ] Testar Queimando, Envenenado, Congelado e Enraizado.
- [ ] Colocar peças no mapa e testar alcance, linha de visão e cobertura.
- [ ] Testar ataque em área com escopo de inimigos e de todos.
- [ ] Confirmar que derrota simultânea da companhia não concede recompensa de vitória.
- [ ] Levar um chefe à fase II/III e conferir as mudanças.
- [ ] Conferir XP, espólios e objetivos de missão ao vencer.

## Progressão e legado

- [ ] Conferir disponibilidade de pontos na árvore de habilidades em personagem elegível.
- [ ] Comprar uma habilidade e conferir que a escolha permanece após recarregar.
- [ ] Derrotar duas criaturas da mesma espécie e conferir o contador por espécie.
- [ ] Conferir conquista/título novo quando uma condição de conquista for alcançada.

## Áudio e backup

- [ ] Confirmar que os efeitos sonoros começam desligados.
- [ ] Ativar os sons em Configurações e testar dado/combate.
- [ ] Desativar novamente; a preferência deve permanecer local ao navegador.
- [ ] Restaurar um backup de teste na campanha correspondente e verificar narrativa, missões, mapa e inventário.

## Observações

Os testes locais do pacote não substituem estes testes no Supabase real e nos dispositivos dos participantes. Faça primeiro os testes de backup em uma campanha de teste, nunca sobre a única cópia da campanha principal.
