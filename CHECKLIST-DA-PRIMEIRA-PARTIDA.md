# Checklist da primeira partida — Reino de Aethra v0.6

Use esta lista antes de convidar o grupo para uma campanha importante.

## 1. Configuração inicial

- [ ] Criei minha conta Supabase.
- [ ] Criei o projeto Supabase.
- [ ] Guardei a senha do banco num lugar seguro.
- [ ] Executei `supabase-schema.sql` (instalação nova) ou a sequência correta de migrações.
- [ ] Se meu banco já era v0.4, executei `supabase-migration-v0.5.sql` e depois `supabase-migration-v0.6.sql`, com backup.
- [ ] Se meu banco já era v0.5, executei `supabase-migration-v0.6.sql` depois de fazer backup.
- [ ] Ativei Anonymous Sign-Ins.
- [ ] Copiei a Project URL.
- [ ] Copiei a Publishable key (`sb_publishable_...`).
- [ ] Preenchi `config.js` com os dois valores.
- [ ] Conferi que não existe Secret key nem `service_role` no arquivo.
- [ ] Publiquei os arquivos na raiz do repositório GitHub.
- [ ] Ativei GitHub Pages usando a branch principal e a pasta `/ (root)`.
- [ ] O site abriu pelo link HTTPS do GitHub Pages.
- [ ] O indicador do site mostra que o Supabase está conectado.

## 2. Teste como mestre

- [ ] Abri o site no navegador principal.
- [ ] Criei uma campanha com nome e descrição.
- [ ] Copiei o código e o link de convite.
- [ ] A campanha aparece em Minhas campanhas.
- [ ] Entrei no lobby.
- [ ] Criei um personagem de teste, se necessário para experimentar o fluxo.
- [ ] Iniciei a sessão.
- [ ] Solicitei um teste de D20.
- [ ] Iniciei um encontro.

## 3. Teste como jogador

- [ ] Abri o mesmo site em outro navegador ou em outro dispositivo.
- [ ] Usei o código ou link de convite.
- [ ] Entrei com um nome de jogador.
- [ ] Criei um personagem.
- [ ] O mestre viu o personagem no lobby.
- [ ] O mestre iniciou a sessão e a tela do jogador mudou para a sala.
- [ ] Respondi a uma solicitação de D20.
- [ ] O resultado apareceu para mestre e jogador.
- [ ] Enviei uma mensagem no chat.

## 4. Teste de combate

- [ ] O mestre iniciou um encontro com Goblin das Cinzas.
- [ ] O sistema mostrou a ordem de iniciativa.
- [ ] O personagem que está no turno viu os botões de ação.
- [ ] O personagem executou um ataque básico.
- [ ] O D20 foi mostrado e o HP do monstro foi atualizado.
- [ ] O turno avançou.
- [ ] Quando chegou o turno do monstro, o mestre resolveu a ação.
- [ ] HP do aventureiro foi atualizado.
- [ ] Uma habilidade de classe foi usada e ficou marcada como usada no encontro.
- [ ] Uma poção foi usada e a quantidade foi reduzida.
- [ ] O monstro foi derrotado e XP foi distribuído.
- [ ] Conferi nível, XP, HP máximo e atributo principal após uma subida de nível.
- [ ] Confirmei que vencer sem subir de nível não restaura o HP inteiro; a subida de nível acrescenta somente os 5 HP previstos.

## 5. Teste de encerramento e retomada

- [ ] O mestre clicou em **Salvar e encerrar sessão**.
- [ ] Os jogadores voltaram ao lobby.
- [ ] Fechei os navegadores.
- [ ] Reabri os navegadores no mesmo perfil.
- [ ] A campanha aparece em Minhas campanhas ou entrei com o mesmo código.
- [ ] O mestre retomou a sessão.
- [ ] O estado do jogo, personagens, HP, inventário, XP e histórico permaneceram.

## 6. Resultado

- Navegador e dispositivo do mestre:
- Navegadores/dispositivos dos jogadores:
- Quantidade de jogadores:
- Testes aprovados:
- Testes que falharam:
- Mensagem exata do erro (sem senhas e sem chaves):

**Não use uma campanha importante até concluir os testes básicos com pelo menos dois navegadores.**


## 6. Teste da aventura inicial (introduzida na v0.5) e mapas (v0.6)

- [ ] A missão principal Ecos na Estrada de Eldoria aparece para todos.
- [ ] O mestre abre o painel Jornada e missões.
- [ ] O mestre apresenta a missão secundária A Carga Perdida de Tovin.
- [ ] O mestre publica uma das cenas preparadas e confirma que os jogadores recebem a narração.
- [ ] O mestre revela um NPC e o jogador consegue abrir sua apresentação.
- [ ] Um objetivo é marcado como concluído e o progresso é atualizado em todos os navegadores.
- [ ] A vitória contra Goblins das Cinzas conclui automaticamente o objetivo correspondente.
- [ ] O mestre escreve uma anotação e confere se ela aparece no diário compartilhado.
- [ ] A campanha é encerrada e retomada; missões, NPCs revelados, localização e diário continuam salvos.

Lembre-se: recompensas textuais das missões ainda são entregues manualmente pelo mestre nesta versão.


## Verificação de mapas (v0.6)

- [ ] O mestre consegue trocar entre os quatro mapas.
- [ ] O mestre consegue selecionar e mover uma peça.
- [ ] O jogador consegue solicitar o movimento da própria peça.
- [ ] O mestre consegue aprovar e recusar pedidos.
- [ ] A névoa esconde e revela casas corretamente.
- [ ] Baús e armadilhas são acionados ao entrar na casa.
- [ ] Ouro e HP permanecem após salvar e retomar a campanha.
