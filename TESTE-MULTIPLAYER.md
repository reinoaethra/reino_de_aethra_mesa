# Roteiro de teste multiplayer — Reino de Aethra v0.7

Este roteiro complementa o README e o guia do Supabase. Ele verifica o fluxo entre dois ou mais navegadores. Não é necessário instalar um servidor local.

## Pré-requisitos

- Site publicado por HTTPS no GitHub Pages.
- Projeto Supabase ativo e conectado pelo `config.js`.
- Banco para v0.7: execute `supabase-schema.sql` em uma instalação nova. Se já estiver na v0.6, faça backup e execute `supabase-migration-v0.7.sql`. Se estiver na v0.4 ou anterior, siga a sequência completa de migrações descrita no README e no guia do Supabase.
- Anonymous Sign-Ins habilitado.
- Um navegador/perfil para o mestre e pelo menos um perfil diferente para jogador.
- Para o teste real, não utilize a mesma sessão autenticada em dois perfis que compartilham o mesmo armazenamento.

## Teste 1 — Criar e entrar na sala

1. Abra o site no navegador A.
2. Crie uma campanha como mestre.
3. Copie o código ou link de convite.
4. Abra o link no navegador B ou em outro dispositivo.
5. Entre com um nome de jogador.
6. Crie uma ficha.
7. Volte ao navegador A.

**Esperado:** o mestre vê o jogador e o personagem no lobby. A presença mostra o jogador online enquanto ele estiver conectado à sala.

## Teste 2 — Iniciar, pausar e retomar

1. No navegador A, clique em **Iniciar sessão**.
2. Confirme que o navegador B muda para a sala.
3. No navegador A, clique em **Salvar e encerrar sessão**.
4. Confirme que B volta ao lobby.
5. Feche A e B.
6. Reabra os navegadores usando os mesmos perfis.
7. Entre na campanha e retome a sessão.

**Esperado:** capítulo, localização, narração, ficha, histórico e estado da campanha permanecem salvos. Os dados de login anônimo dependem do armazenamento local do mesmo navegador.

## Teste 3 — Chat

1. Envie uma mensagem em A.
2. Responda em B.
3. Atualize a página de um dos navegadores.

**Esperado:** as mensagens aparecem para os participantes e permanecem no histórico.

## Teste 4 — Solicitação de D20 direcionada

1. No navegador A, solicite um D20 e escolha o jogador B.
2. Confirme que B recebe o aviso e pode responder.
3. Abra a mesma campanha com um jogador C.
4. Confirme que C não pode responder ao pedido direcionado a B.
5. B responde uma vez.
6. Tente responder novamente.

**Esperado:** o navegador do mestre calcula e publica o D20. O banco recusa uma segunda resposta e recusa a resposta de um jogador não selecionado.

## Teste 5 — D20 para todos

1. Com A, B e C na mesma campanha, solicite o teste para todos.
2. B responde.
3. C responde.
4. Confira a sequência no diário da sessão.

**Esperado:** cada jogador selecionado pode responder uma vez; a solicitação termina depois que todos respondem.

## Teste 6 — Iniciativa

1. Garanta que pelo menos um jogador tenha uma ficha.
2. No navegador A, inicie um encontro com uma das criaturas disponíveis.
3. Observe a ordem de iniciativa em A e B.

**Esperado:** todos veem a mesma ordem e a mesma pessoa/monstro no turno atual.

## Teste 7 — Ação de jogador

1. Aguarde o turno do jogador B.
2. Em B, clique em **Ataque básico**.
3. Observe o dado e o resultado em A e B.
4. Confira o novo HP do monstro.
5. Tente clicar novamente fora de seu turno.

**Esperado:** a ação é processada pelo mestre ativo; o banco exige o turno correto e impede uma segunda ação no mesmo turno.


## Teste 7A — Cliques duplicados no mesmo turno

1. Quando chegar o turno do jogador B, clique duas vezes rapidamente em **Ataque básico** (ou peça a outro teste de ação duplicada no mesmo turno).
2. Confira o diário da sessão e o HP do monstro.
3. Observe se o banco rejeita a segunda solicitação.

**Esperado:** apenas uma ação é processada para o mesmo jogador no mesmo turno. O banco serializa as solicitações simultâneas para reduzir a possibilidade de duplicação.

## Teste 8 — Habilidade e poção

1. Aguarde novamente o turno do jogador B.
2. Use a habilidade especial da classe.
3. Confirme que ela aparece como utilizada.
4. Em outro turno de B, use uma Poção de Cura quando o HP não estiver cheio.
5. Abra o inventário e confira a quantidade reduzida.

**Esperado:** habilidade usada uma vez por encontro; poção consumida; HP e inventário sincronizados.

## Teste 9 — Turno do monstro

1. Aguarde o turno da criatura.
2. No navegador A, clique em **Resolver ação do monstro**.
3. Confira o D20, o dano e o HP do alvo.

**Esperado:** todos os participantes veem o resultado e o HP atualizado.

## Teste 10 — Derrotar criatura e XP

1. Reduza o HP da criatura até zero.
2. Confira se o encontro mostra vitória.
3. Consulte a ficha de cada participante elegível.
4. Repita uma sincronização ou recarregue a tela.

**Esperado:** o XP é distribuído uma única vez por personagem participante. Ao atingir o limiar, o nível aumenta, o HP máximo recebe +5 e o atributo principal da classe recebe +1.

## Teste 11 — Reconexão

1. Deixe A e B na mesma sessão.
2. Desconecte a internet de B por alguns segundos.
3. Reconecte B.
4. Aguarde a conexão Realtime voltar.
5. Se necessário, clique em **Sincronizar**.

**Esperado:** B volta a refletir o estado salvo no Supabase. Ações que dependem do mestre não podem ser resolvidas se o mestre estiver offline.

## Teste 12 — Duas abas do mestre

1. Abra a mesma campanha como mestre em duas abas do mesmo perfil.
2. Solicite um teste ou espere uma ação de jogador.
3. Observe se só uma aba processa a solicitação.

**Esperado:** a aba mestre ativa é escolhida pela presença. O mecanismo evita processamento duplicado entre abas do mesmo perfil, mas não é failover entre dois computadores diferentes.

## Observações e limites do teste

- Não feche o navegador do mestre durante uma ação não confirmada. O banco guarda os últimos estados confirmados; uma ação em processamento pode precisar ser reavaliada.
- O mestre precisa estar online para calcular ataques, turnos dos monstros e atualizações oficiais.
- O Supabase Realtime é o canal de sincronização desta versão. WebRTC/P2P direto ainda não está implementado.
- A presença informa quem está conectado à sala, não garante que a pessoa esteja olhando para a tela.

## Relatório do teste

- Data:
- Navegador mestre:
- Jogador B:
- Jogador C:
- Etapas aprovadas:
- Etapas com problema:
- Mensagem do console ou do Supabase (retire chaves e tokens):


## 7. Teste da jornada narrativa (introduzida na v0.5)

- [ ] Na sala, o quadro **Missões da companhia** aparece para mestre e jogadores.
- [ ] O mestre abre **Jornada e missões**.
- [ ] O mestre publica uma cena preparada (por exemplo, Vila de Brumafolha).
- [ ] Mestre e jogadores veem o mesmo capítulo, local e texto de narração.
- [ ] O mestre revela Ilyra Avelorn.
- [ ] Todos veem Ilyra em **Personagens encontrados** e conseguem abrir sua ficha pública.
- [ ] O objetivo de conhecer Ilyra aparece como concluído.
- [ ] O mestre marca manualmente o objetivo de investigar os rastros.
- [ ] O mestre inicia um encontro com Goblin das Cinzas e a companhia o derrota.
- [ ] O objetivo de derrotar os goblins é marcado automaticamente.
- [ ] O mestre registra uma descoberta no diário e todos veem a anotação.
- [ ] O mestre encerra a sessão e, depois, reabre a campanha: missões, NPCs revelados, cena e diário permanecem.

**Importante:** recompensas textuais das missões são orientações narrativas nesta versão. Elas não creditam automaticamente ouro, itens ou XP. O mestre deve entregar essas recompensas manualmente até a implementação da economia e do gerenciador de recompensas.


## Testes adicionais da versão 0.6 — mapas

1. Com o mestre e pelo menos um jogador conectados, abra o mapa da Estrada de Eldoria.
2. No mestre, selecione a peça de um aventureiro, deixe `Mover peça` selecionado e mova-a para uma casa livre. Confirme que o jogador vê a mesma posição.
3. No navegador do jogador, clique em uma casa livre e visível. Confirme que aparece uma solicitação no painel do mestre.
4. Aprove o pedido e confirme a posição sincronizada; depois repita e recuse outro pedido.
5. Ative a névoa e revele uma área. Confirme que o jogador não vê as casas ainda ocultas.
6. Coloque um baú e mova um personagem até ele. Confirme o acréscimo de 15 PO.
7. Coloque uma armadilha e mova um personagem até ela. Confirme a redução de 5 HP.
8. Inicie um encontro e teste que o movimento de uma peça fora do turno é recusado. No turno dela, confirme o limite de quatro casas e o bloqueio por obstáculos.
9. Salve e encerre a sessão, abra novamente a campanha e confira se o mapa, posições, marcadores descobertos, ouro e HP foram preservados.

Esses testes exigem a função SQL `request_map_move` da v0.6. Em um banco que já estava na v0.5, execute `supabase-migration-v0.6.sql` antes de testar o pedido de movimento feito pelo jogador.


### Testes adicionais de objetos e miniaturas (v0.7)

- [ ] O mestre usa a ferramenta **Porta** para colocar uma porta em uma casa livre.
- [ ] O mestre consegue abrir e fechar a porta clicando nela.
- [ ] Uma porta fechada bloqueia o caminho das peças.
- [ ] Um jogador próximo solicita abrir a porta e o pedido aparece para o mestre.
- [ ] O mestre aprova a solicitação e todos veem a porta aberta.
- [ ] O mestre coloca um altar em uma casa livre.
- [ ] Um jogador próximo solicita examinar o altar e o mestre aprova.
- [ ] O altar é revelado e uma descoberta aparece no diário.
- [ ] O mestre remove um objeto com a ferramenta **Remover objeto**.
- [ ] As peças dos personagens exibem símbolo e iniciais, e a criatura tem destaque visual.
- [ ] Salvo e retomado o jogo, portas, altares, estado de descoberta e posições continuam iguais.

Essas interações compartilhadas exigem a função `request_map_interaction` da v0.7. Um banco que já estava na v0.6 precisa receber `supabase-migration-v0.7.sql`.
