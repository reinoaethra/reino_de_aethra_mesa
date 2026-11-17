# Solução de problemas — Reino de Aethra v2.9

Este guia reúne erros comuns e o que fazer. Antes de mudar qualquer configuração, leia a mensagem com calma.

## 1. O topo da página mostra “Modo local”

Isso significa que a aplicação não conseguiu conectar ao Supabase ou que ainda não recebeu as credenciais.

Confira nesta ordem:

1. Abra o `config.js` no Bloco de Notas.
2. Confira se `supabaseUrl` contém a Project URL correta.
3. Confira se `supabasePublicKey` contém a Publishable key.
4. Confirme que os valores estão entre aspas.
5. Confirme que você publicou o arquivo atualizado no GitHub.
6. Abra o site e pressione `Ctrl + F5`.
7. Abra as configurações do próprio jogo e tente colar a URL e a chave novamente.
8. Confirme se o projeto Supabase não está pausado.

Não use uma Secret key. O jogo deve usar a Publishable key.

## 2. “Anonymous sign-ins are disabled” ou erro semelhante

O acesso anônimo ainda não está ativado.

1. Abra o Supabase Dashboard.
2. Entre no projeto de Aethra.
3. Abra Authentication.
4. Procure Sign In / Providers ou Providers.
5. Ative Anonymous Sign-Ins.
6. Salve, se houver botão de salvamento.
7. Volte ao jogo e atualize a página.

Veja também `GUIA-SUPABASE-DO-ZERO.md`, Parte 4.

## 3. O jogo diz que a tabela `campaigns` não existe

O banco ainda não recebeu o esquema correto.

- Em projeto novo: execute `supabase-schema.sql`.
- Em banco v0.6: execute `supabase-migration-v0.7.sql`.
- Em banco v0.5: execute `supabase-migration-v0.6.sql` e depois `supabase-migration-v0.7.sql`.
- Em banco v0.4: execute `supabase-migration-v0.5.sql`, `supabase-migration-v0.6.sql` e `supabase-migration-v0.7.sql`, nessa ordem.
- Em banco v0.3 ou v0.2: siga toda a sequência de migrações até v0.7 indicada no README.

Não execute migrações aleatórias. Consulte a seção “Qual arquivo SQL devo executar?” do README.

## 4. “Function award_encounter_xp does not exist”

O site v0.7 está conectado a um banco que ainda não recebeu uma ou mais migrações históricas. Compare o estado do banco com a tabela do README e aplique as migrações da menor para a maior, sem pular versões.

1. Confira a versão atual do banco.
2. Se estava na v0.3, execute `supabase-migration-v0.4.sql`.
3. Atualize a página depois que o SQL terminar sem erro.


## Erro ao criar campanha: `function gen_random_bytes(integer) does not exist`

Esse erro ocorre na função SQL `create_campaign`, que em versões anteriores tentava gerar o código de convite usando `gen_random_bytes`. Em alguns projetos Supabase, a extensão `pgcrypto` está instalada no schema `extensions`, enquanto a função de criação limita o `search_path` a `public`; nesse cenário, o PostgreSQL não encontra a função.

**Correção recomendada para quem já tem o banco configurado:**

1. Abra o projeto no Supabase Dashboard.
2. Entre em **SQL Editor** e crie uma nova consulta.
3. Abra o arquivo `supabase-migration-v2.9.sql` do pacote atualizado.
4. Copie todo o conteúdo, cole no SQL Editor e clique em **Run**.
5. Aguarde a mensagem de sucesso e volte ao Reino de Aethra.
6. Atualize o site com `Ctrl + F5` e tente criar a campanha novamente.

A correção usa `gen_random_uuid()`, função nativa do PostgreSQL moderno, para formar o código de convite. Ela não apaga campanhas, membros, personagens ou histórico. Não é necessário instalar ou mover extensões manualmente.

Se o erro continuar, envie a mensagem completa do SQL Editor, sem compartilhar chaves ou senhas.

## 5. SQL Editor mostra erro em vermelho

1. Não apague tabelas.
2. Não execute `DROP` nem tente corrigir copiando comandos aleatórios da internet.
3. Copie a mensagem inteira do erro.
4. Anote qual arquivo estava executando e se era instalação nova ou migração.
5. Peça ajuda com essa mensagem, retirando qualquer senha ou chave secreta.

Um arquivo de instalação e um arquivo de migração têm finalidades diferentes. Executar o arquivo errado pode causar erros de objetos inexistentes ou de versão.

## 6. Jogador não aparece no lobby

Confira:

- o jogador está usando o link ou código correto;
- o navegador do jogador mostra Supabase conectado;
- o jogador concluiu a entrada com um nome válido;
- o mestre e o jogador estão conectados à mesma URL Supabase;
- ambos estão usando a versão mais recente do site;
- a campanha ainda não foi arquivada.

A presença online pode levar um momento para aparecer. Use o botão Sincronizar se necessário.

## 7. Chat, D20 ou HP não atualiza em todos os navegadores

1. Confira se todos usam a mesma configuração Supabase.
2. No Supabase, abra Database → Publications.
3. Localize `supabase_realtime`.
4. Confirme se as tabelas `campaigns`, `campaign_members` e `campaign_events` estão incluídas.
5. Confira se o projeto não está pausado.
6. Atualize a página com `Ctrl + F5`.
7. Use **Sincronizar** na sala.

O esquema da v0.4 (mantido nas versões posteriores) tenta adicionar as tabelas à publicação durante a instalação. A conferência manual é útil se o script tiver sido interrompido ou se a configuração foi alterada depois.

## 8. O jogo mostra “Ainda não é seu turno”

Isso normalmente significa que o turno atual pertence a outro personagem ou ao monstro.

1. Confira a ordem de iniciativa.
2. Leia o quadro “Turno atual”.
3. Aguarde sua vez.
4. Se o mestre pulou um turno, clique em Sincronizar.
5. Se o encontro já terminou, as ações de combate ficam bloqueadas.

## 9. O mestre está offline

A campanha continua salva, mas ações que dependem da autoridade do mestre ficam aguardando seu retorno. O mestre deve reabrir o site, entrar na mesma campanha e retomar a sessão.

O navegador do mestre precisa ficar aberto durante a partida. Não é necessário deixá-lo ligado entre uma sessão e outra.

## 10. Supabase diz que o projeto está pausado

No plano Free, o Supabase pode pausar um projeto com baixa atividade durante um período de sete dias.

1. Abra [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Escolha a organização.
3. Abra o projeto pausado.
4. Clique em **Resume project** (Retomar projeto), se aparecer.
5. Espere voltar ao estado ativo.
6. Retorne ao jogo e atualize a página.

A documentação atual está em [Project Pausing](https://supabase.com/docs/guides/platform/free-project-pausing).

## 11. Um jogador perdeu o personagem depois de trocar de navegador

As versões 0.4 e 0.5 usam identidade anônima. Se o jogador limpar os dados de navegação, sair da conta ou trocar de dispositivo, o Supabase não consegue recuperar automaticamente a identidade anônima antiga.

Por enquanto, mantenha o mesmo perfil de navegador e não limpe os dados do site. A vinculação de contas será adicionada futuramente.

## 12. GitHub Pages mostra 404

Confira:

1. O arquivo `index.html` está na raiz do repositório?
2. O nome está em letras minúsculas exatamente `index.html`?
3. Em Settings → Pages, a origem está como Deploy from a branch?
4. A branch selecionada é a branch que contém os arquivos (normalmente `main`)?
5. A pasta selecionada é `/ (root)`?
6. Você clicou em Save?
7. O link acessado é o endereço mostrado na tela Pages?

Se acabou de publicar, volte à tela Pages e confira o estado da implantação.

## 13. Página aparece sem estilos ou botões

Normalmente algum arquivo não foi enviado para a raiz.

Confira se `styles.css` e `app.js` aparecem no mesmo nível que `index.html`. Depois publique novamente e faça `Ctrl + F5`.

## 14. A tela carrega, mas as fontes parecem diferentes

A aplicação usa fontes externas do Google Fonts. Se a rede bloquear esse serviço, o navegador utilizará fontes alternativas. Isso não deve impedir a lógica do jogo.

## 15. Como pedir ajuda com segurança

Ao pedir suporte, informe:

- se estava instalando ou atualizando;
- qual arquivo SQL executou;
- em qual etapa ocorreu o erro;
- a mensagem de erro completa;
- navegador usado e se era mestre ou jogador.

**Nunca envie:** senha do banco, Secret key, `service_role`, token de acesso ou qualquer credencial administrativa.


## Missões ou personagens da história não aparecem (recurso introduzido na v0.5)

1. Confirme que os arquivos `app.js`, `styles.css` e `index.html` foram atualizados juntos para a mesma versão.
2. Faça uma atualização forçada do navegador com `Ctrl + F5`.
3. Abra uma campanha e entre na sala ativa; o quadro de missões aparece abaixo da narração.
4. Os NPCs só aparecem aos jogadores depois que o mestre os revela no painel **Jornada e missões**.
5. Se o botão de gerenciamento não aparece, confirme que entrou com a conta que criou a campanha e que essa conta está como mestre.
6. A migração v0.5 é necessária para bancos que já estavam na v0.4; ela só altera o estado inicial de campanhas novas. Para habilitar os pedidos de movimento do mapa, execute também a migração v0.6; para portas e altares, execute a migração v0.7. Se surgir um erro de banco, envie a mensagem completa, sem chaves nem senhas.

## O mestre não consegue salvar uma cena ou objetivo

- Confirme que está na aba do mestre que foi eleita como controladora ativa.
- Se tiver duas abas abertas com a mesma conta de mestre, feche uma e tente novamente.
- Confirme que a sessão Supabase está conectada e que o usuário é membro com papel `master`.
- Não altere manualmente a coluna `game_state` pelo painel do banco enquanto a partida estiver ativa.


## Mapas da versão 0.6

**O jogador não consegue solicitar movimento:** confirme que o Supabase está conectado, a campanha está com sessão ativa e que `supabase-migration-v0.6.sql` foi executado. A conta do jogador precisa ser membro com papel `player`.

**A porta/altar não aceita interação:** confirme que o banco recebeu o schema v0.7 ou a migração `supabase-migration-v0.7.sql`.

**O mapa não troca:** somente o mestre ativo pode trocar o mapa. Peça ao mestre para selecionar a nova localidade.

**Uma peça não se move:** confira se a casa está livre, se não há árvore/água/casa/muro/coluna no caminho e se a peça está no turno correto. Durante o combate, o limite é de quatro casas por turno, com movimento ortogonal.

**O baú ou a armadilha não aparece para jogadores:** os marcadores ficam ocultos até serem acionados. A névoa de guerra também pode esconder casas; o mestre pode usar `Revelar área`.


---

## Problemas de login e troca de dispositivo (v0.7)

### O botão “Salvar progresso” diz que Manual Linking está desativado

No Supabase, abra Authentication → Configuration / General Configuration, ative **Allow manual linking**, salve e tente novamente. O vínculo precisa ser permitido para preservar o identificador do acesso visitante.

### O e-mail de confirmação não retorna ao jogo

Confira Authentication → URL Configuration. O Site URL e a Redirect URL precisam conter o endereço exato do GitHub Pages, incluindo o nome do repositório. Consulte `GUIA-LOGIN-E-PROGRESSO.md`.

### Confirmei o e-mail, mas a tela de senha não apareceu

Volte à aba original do jogo, no mesmo navegador/perfil em que clicou em **Salvar progresso**. Atualize a página uma vez se necessário. Não saia do acesso visitante enquanto o vínculo não terminar.

### A campanha não aparece no celular

Confirme que no celular você entrou com o mesmo e-mail e senha usados no computador. Se a campanha foi criada no modo local, ela não está no Supabase e não aparece em outro dispositivo. Campanhas do modo local não são automaticamente convertidas para a nuvem.

### Entrei em uma conta errada ou criei um visitante no segundo aparelho

Não crie mais personagens nem campanhas nesse aparelho. Saia da conta errada e entre com a conta correta. Se o visitante desse aparelho já estiver associado a uma campanha, a versão atual impede a troca automática para evitar misturar duas identidades; será necessário preservar esse progresso separadamente.

### Perdi acesso ao navegador original antes de vincular e-mail

Um usuário visitante não tem credenciais para recuperar sua identidade em outro aparelho. Se os dados locais do navegador foram apagados ou o aparelho foi perdido antes de vincular um e-mail, o acesso visitante pode não ser recuperável. Entre em contato com o mestre para verificar se há outros registros/backup da campanha.
