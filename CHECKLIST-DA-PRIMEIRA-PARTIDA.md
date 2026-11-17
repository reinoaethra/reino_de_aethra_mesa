# Checklist da primeira partida — Reino de Aethra v0.8

Use esta lista antes de convidar o grupo para uma campanha importante.

## 1. Configuração inicial

- [ ] Criei minha conta Supabase.
- [ ] Criei o projeto Supabase.
- [ ] Guardei a senha do banco num lugar seguro.
- [ ] Executei `supabase-schema.sql` (instalação nova) ou a sequência correta de migrações.
- [ ] Se meu banco já era v0.4, executei `supabase-migration-v0.5.sql`, `supabase-migration-v0.6.sql` e `supabase-migration-v0.7.sql`, com backup.
- [ ] Se meu banco já era v0.5, executei `supabase-migration-v0.6.sql` e `supabase-migration-v0.7.sql`, depois de fazer backup.
- [ ] Se meu banco já era v0.6, executei `supabase-migration-v0.7.sql` depois de fazer backup.
- [ ] Ativei Anonymous Sign-Ins.
- [ ] Ativei o provedor Email e Manual Linking, conforme o guia de login.
- [ ] Copiei a Project URL.
- [ ] Copiei a Publishable key (`sb_publishable_...`).
- [ ] Preenchi `config.js` com os dois valores.
- [ ] Conferi que não existe Secret key nem `service_role` no arquivo.
- [ ] Publiquei os arquivos na raiz do repositório GitHub.
- [ ] Ativei GitHub Pages usando a branch principal e a pasta `/ (root)`.
- [ ] O site abriu pelo link HTTPS do GitHub Pages.
- [ ] Configurei Site URL e Redirect URLs do Supabase com o endereço exato do GitHub Pages.
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


## 6. Teste da aventura inicial (v0.5), mapas (v0.6/v0.7) e retratos (v0.8)

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


## Verificação de mapas e objetos (v0.6/v0.7)

- [ ] O mestre consegue trocar entre os quatro mapas.
- [ ] O mestre consegue selecionar e mover uma peça.
- [ ] O jogador consegue solicitar o movimento da própria peça.
- [ ] O mestre consegue aprovar e recusar pedidos.
- [ ] A névoa esconde e revela casas corretamente.
- [ ] Baús e armadilhas são acionados ao entrar na casa.
- [ ] Ouro e HP permanecem após salvar e retomar a campanha.
- [ ] Portas podem ser colocadas, abertas e fechadas pelo mestre.
- [ ] Jogadores próximos conseguem solicitar abertura de portas.
- [ ] Altares podem ser examinados com aprovação do mestre.
- [ ] Descobertas de altares aparecem no diário.
- [ ] Miniaturas de personagens e monstros aparecem corretamente.


---

## Teste de login em outro dispositivo (v0.7)

Faça este teste depois de configurar Email, Anonymous Sign-Ins, Manual Linking e URL Configuration no Supabase.

- [ ] No computador principal, abra Aethra conectado ao Supabase.
- [ ] Crie ou abra uma campanha na nuvem e crie um personagem de teste.
- [ ] Clique em **Salvar progresso** e informe um e-mail que você consiga acessar.
- [ ] Abra o e-mail de confirmação no mesmo navegador/perfil e confirme o endereço.
- [ ] Volte ao jogo e defina uma senha com 8 ou mais caracteres.
- [ ] Confirme que a interface mostra **Conta ✓**.
- [ ] Em outro aparelho ou janela privada, abra o mesmo site.
- [ ] Antes de criar personagem ou entrar como visitante em uma campanha, abra **Conta** → **Já tenho uma conta**.
- [ ] Entre com o mesmo e-mail e senha.
- [ ] Abra **Campanhas** e confira se a mesma campanha aparece.
- [ ] Abra a campanha e compare personagem, classe, nível, HP e inventário.
- [ ] Faça uma mudança simples permitida e confira se ela aparece no outro navegador após sincronizar.

**Aprovado:** a mesma campanha e ficha aparecem com o mesmo progresso nos dois dispositivos. Não crie uma segunda campanha se a primeira não aparecer; confira se a conta usada é exatamente a mesma.

**Atenção:** uma conta visitante ainda não vinculada não pode ser recuperada em outro aparelho. Vincule o e-mail no dispositivo original primeiro.


## Teste visual da versão 0.8

- [ ] Os oito cartões de classe exibem retratos diferentes na criação de personagem.
- [ ] A prévia da ficha mostra o retrato da classe escolhida.
- [ ] Participantes com personagem aparecem com retratos no lobby e na sala.
- [ ] As miniaturas do mapa mostram retratos, iniciais e símbolos.
- [ ] O seletor de encontro exibe as ilustrações das cinco criaturas.
- [ ] O cartão de batalha mostra a ilustração e HP da criatura correta.
- [ ] Revelar Ilyra, Tovin ou Cael apresenta o retrato correspondente aos jogadores.
- [ ] Ataques, habilidades e ações de monstros exibem efeitos visuais; o som é reproduzido quando permitido pelo navegador.
- [ ] No celular, os cartões de classe, criaturas e NPCs reorganizam-se sem cortar os botões.
- [ ] A pasta `assets/portraits/` foi enviada ao GitHub junto com `index.html`, `app.js` e `styles.css`.

**Banco de dados:** a v0.8 não exige migração SQL. Se o banco já está na v0.7, apenas publique todos os arquivos da v0.8, incluindo a pasta de retratos.
