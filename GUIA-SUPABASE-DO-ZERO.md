# Guia do Supabase do zero — Reino de Aethra v0.4

Este tutorial foi escrito para quem **nunca usou Supabase, nunca criou um banco de dados e não sabe programar**. Leia uma etapa de cada vez. Você não precisa instalar o Supabase no computador: tudo será feito pelo navegador.

## O que é o Supabase e por que Aethra usa esse serviço?

Pense no Supabase como um armário online onde ficam guardados os dados da campanha:

- nomes e personagens dos jogadores;
- campanhas e códigos de convite;
- pontos de vida e inventários;
- capítulo, local e estado da sessão;
- chat e histórico de acontecimentos;
- experiência e níveis dos aventureiros.

O Supabase também envia avisos aos navegadores quando alguém entra ou quando o estado da partida muda. Assim, os jogadores podem estar em casas diferentes.

**Você não precisa deixar o seu computador ligado durante a semana.** O banco fica na nuvem. O computador do mestre só precisa estar ligado durante a sessão, quando você estiver conduzindo a aventura.

---

## PARTE 1 — Criar sua conta Supabase

### 1.1 Abrir o site correto

1. Abra o navegador de internet (Chrome, Edge, Firefox ou Opera).
2. Entre neste endereço: [https://supabase.com/dashboard](https://supabase.com/dashboard).
3. Se você ainda não tem conta, escolha a opção de criar uma conta ou acesse diretamente [https://supabase.com/dashboard/sign-up](https://supabase.com/dashboard/sign-up).
4. Siga o método de cadastro oferecido na tela, por exemplo GitHub ou e-mail, conforme as opções disponíveis.
5. Se o Supabase enviar uma mensagem de confirmação por e-mail, abra seu e-mail e confirme o cadastro.
6. Volte para o Dashboard do Supabase e entre na sua conta.

**Dica:** use um e-mail que você pretende manter. A conta Supabase será a responsável pelo projeto e pelo acesso administrativo ao banco.

### 1.2 Criar uma organização, se o Supabase solicitar

O Supabase organiza projetos dentro de uma organização.

1. Se aparecer a opção **New organization**, **Create organization** ou semelhante, clique nela.
2. Dê um nome simples, por exemplo `Reino de Aethra`.
3. Selecione o plano **Free** para começar sem mensalidade, caso esteja disponível para sua conta.
4. Confirme a criação.

Se a sua conta já tiver uma organização, você pode usar a existente. Não precisa criar outra apenas para seguir este guia.

---

## PARTE 2 — Criar o projeto de banco de dados

### 2.1 Começar um novo projeto

1. Dentro do Dashboard, escolha sua organização.
2. Clique em **New project** ou **Create project**.
3. Se o Supabase perguntar em qual organização criar o projeto, selecione `Reino de Aethra` (ou a organização que você escolheu).
4. Preencha os campos que aparecerem.

Sugestão de preenchimento:

| Campo | O que colocar |
|---|---|
| Name / Project name | `reino-de-aethra` |
| Database Password | Crie uma senha forte e exclusiva. |
| Region | Escolha a região mais próxima da maioria dos jogadores. Se houver uma região no Brasil ou na América do Sul, ela pode ser uma boa opção. |
| Pricing Plan | Free, para começar sem mensalidade. |

### 2.2 Criar e guardar a senha do banco

O Supabase solicitará uma senha do banco de dados.

1. Crie uma senha longa e difícil de adivinhar.
2. Guarde-a num gerenciador de senhas ou num local privado e seguro.
3. Não envie essa senha aos jogadores.
4. Não cole essa senha em `config.js`.
5. Não publique essa senha no GitHub.

**Atenção:** o jogo do navegador não precisa dessa senha. Ela é uma credencial administrativa/de conexão direta do banco. O jogo utiliza a Project URL e uma Publishable key.

### 2.3 Criar o projeto

1. Revise os campos.
2. Clique em **Create new project** ou botão equivalente.
3. Aguarde o Dashboard indicar que o projeto está pronto.
4. Mantenha essa página aberta.

O Supabase pode levar algum tempo para preparar o banco. Não é necessário atualizar a página repetidamente.

---

## PARTE 3 — Preparar as tabelas do Reino de Aethra

Esta é a etapa em que você instala a estrutura de dados do jogo. Parece técnica, mas você só precisará copiar o conteúdo de um arquivo e colá-lo no editor do Supabase.

### 3.1 Encontrar o arquivo certo no ZIP

1. Baixe o pacote ZIP do Reino de Aethra v0.4.
2. No computador, encontre o arquivo ZIP baixado.
3. Clique nele com o botão direito e escolha **Extrair tudo** (Windows) ou use o aplicativo de extração disponível.
4. Abra a pasta resultante.
5. Encontre o arquivo chamado `supabase-schema.sql`.

Não abra `supabase-migration-v0.4.sql` para uma instalação nova. Esse outro arquivo serve para atualizar um banco que já estava na versão 0.3.

### 3.2 Abrir o SQL Editor no Supabase

1. Volte para o Dashboard do seu projeto Supabase.
2. Na barra lateral, procure **SQL Editor**. Em algumas versões do painel, ele aparece com um ícone de terminal ou dentro da área de Database.
3. Clique em **SQL Editor**.
4. Clique em **New query** ou botão equivalente para abrir uma consulta em branco.

O SQL Editor é uma caixa grande onde instruções para configurar o banco podem ser coladas e executadas.

### 3.3 Copiar o conteúdo do arquivo SQL

1. No computador, abra o arquivo `supabase-schema.sql` com o Bloco de Notas (Windows) ou outro editor de texto simples.
2. Não use Word para copiar o código, pois editores de texto rico podem alterar caracteres e formatação.
3. Pressione `Ctrl + A` para selecionar todo o conteúdo do arquivo.
4. Pressione `Ctrl + C` para copiar.
5. Volte para a aba do Supabase, dentro do SQL Editor.
6. Clique na área grande de texto da consulta.
7. Pressione `Ctrl + V` para colar todo o conteúdo.

### 3.4 Executar a instalação

1. Confira se o texto foi colado no editor.
2. Clique no botão **Run** (Executar), normalmente localizado na parte inferior ou superior do editor.
3. Aguarde a execução terminar.
4. Procure uma mensagem de sucesso, como **Success. No rows returned** ou outra confirmação sem erro.

A expressão **No rows returned** não significa que falhou. Este arquivo cria tabelas, funções, permissões e políticas de segurança; ele não foi feito para listar registros.

Se aparecer uma mensagem vermelha de erro:

- não apague tabelas;
- não execute um segundo arquivo SQL aleatoriamente;
- copie o texto completo do erro;
- anote em qual arquivo estava trabalhando;
- consulte `SOLUCAO-DE-PROBLEMAS.md` ou peça ajuda enviando a mensagem do erro (sem mandar senhas ou chaves secretas).

### 3.5 O que esse arquivo criou?

O `supabase-schema.sql` instala, entre outros elementos:

- `campaigns`: campanhas, códigos, estado e datas;
- `campaign_members`: mestre, jogadores e fichas;
- `campaign_events`: chat, rolagens e eventos da aventura;
- `campaign_xp_awards`: registro interno para impedir que a mesma vitória dê XP duas vezes;
- funções SQL para criar campanhas, entrar com código, salvar a própria ficha, atualizar o estado da campanha e distribuir XP;
- políticas de segurança chamadas RLS;
- publicação Realtime usada para atualizar as salas.

Você não precisa criar essas tabelas manualmente. O arquivo já faz isso.

---

## PARTE 4 — Ativar entrada anônima de jogadores

Na versão 0.4, o jogo permite que um participante entre sem cadastrar e-mail e senha. O Supabase cria uma identidade anônima para aquele navegador.

### 4.1 Abrir as configurações de autenticação

1. No Dashboard do seu projeto, procure **Authentication** na barra lateral.
2. Abra a área chamada **Sign In / Providers**, **Providers** ou equivalente. A disposição dos menus pode mudar com atualizações do Supabase.
3. Procure a opção **Anonymous Sign-Ins**, **Anonymous** ou **Allow anonymous sign-ins**.
4. Ative essa opção.
5. Salve a alteração, caso exista um botão **Save**.

Se não encontrar a opção, use a busca da documentação oficial: [Supabase — Anonymous Sign-Ins](https://supabase.com/docs/guides/auth/auth-anonymous).

### 4.2 Entender o limite das contas anônimas

Esta versão cria uma identidade automaticamente no navegador e mantém a sessão naquele perfil. Por isso:

- cada jogador deve voltar usando o mesmo dispositivo e perfil do navegador;
- não limpe os dados do site ou os cookies do navegador enquanto não houver recuperação de conta;
- abrir outro navegador ou janela anônima pode criar uma identidade diferente;
- se o jogador trocar de computador ou apagar os dados do navegador, a identidade anônima anterior não pode ser recuperada por esta versão.

A documentação do Supabase confirma essa limitação para usuários anônimos. Futuramente adicionaremos vinculação de conta para permitir recuperação em outros dispositivos.

---

## PARTE 5 — Copiar a Project URL e a Publishable key

Esses são os dois valores que o jogo precisa para se conectar ao seu banco.

### 5.1 Abrir os dados de conexão

1. No painel do projeto, procure o botão **Connect** (Conectar), normalmente na parte superior.
2. Abra a seção de conexão de API ou a área que mostra os dados do projeto.
3. Copie o valor chamado **Project URL**.
4. Mantenha essa informação temporariamente num bloco de notas privado.

A URL normalmente tem o formato:

```text
https://abcdefghijk.supabase.co
```

Ela é o endereço do seu projeto. O valor real será diferente do exemplo.

### 5.2 Encontrar a Publishable key

1. No painel do projeto, abra **Project Settings** (Configurações do projeto).
2. Entre em **API Keys**.
3. Procure a seção **Publishable key**.
4. Copie a chave que começa com `sb_publishable_`.
5. Guarde-a temporariamente junto da Project URL.

A interface do Supabase pode mostrar a chave dentro do botão **Connect** ou em **Project Settings → API Keys**. Use a chave chamada Publishable.

**Não copie:**

- `Secret key` (começa com `sb_secret_`);
- `service_role`;
- qualquer chave indicada como secreta/administrativa.

Essas chaves administrativas ignoram as regras RLS e não podem estar num site que os jogadores baixam e inspecionam. A documentação oficial explica essa diferença em [API keys](https://supabase.com/docs/guides/getting-started/api-keys).

---

## PARTE 6 — Colocar os dados no `config.js`

### 6.1 Abrir o arquivo

1. Volte à pasta do Reino de Aethra que você extraiu do ZIP.
2. Encontre o arquivo `config.js`.
3. Clique com o botão direito nele.
4. Escolha **Abrir com → Bloco de Notas**.

Você verá algo semelhante a isto:

```js
window.AETHRA_CONFIG = {
  supabaseUrl: '',
  supabasePublicKey: ''
};
```

### 6.2 Preencher os dois valores

Troque apenas o conteúdo entre as aspas. Exemplo fictício:

```js
window.AETHRA_CONFIG = {
  supabaseUrl: 'https://abcdefghijk.supabase.co',
  supabasePublicKey: 'sb_publishable_EXEMPLO_DE_CHAVE_PUBLICA'
};
```

O exemplo acima não é uma chave real. Use os valores que você copiou do seu projeto.

Confira com calma:

- A URL começa com `https://`.
- A URL está entre aspas simples.
- A Publishable key está entre aspas simples.
- Há uma vírgula depois da linha `supabaseUrl`.
- A última linha da chave não precisa de vírgula.
- O arquivo termina com `};`.
- O nome do arquivo continua exatamente `config.js`, e não `config.js.txt`.

No Bloco de Notas, escolha **Arquivo → Salvar**.

### 6.3 Não envie uma chave secreta

A Publishable key pode aparecer no navegador e num repositório público desde que as políticas RLS estejam corretas. Não existe segredo nessa chave. A proteção real dos dados é feita pelas permissões do banco.

Uma Secret key ou `service_role` não pode ser publicada. Se você inserir uma chave secreta por engano, remova-a do arquivo e gere/rotacione a chave no painel do Supabase antes de continuar.

---

## PARTE 7 — Conferir se o Supabase está pronto

Antes de publicar, confira estas cinco coisas:

- [ ] O projeto aparece no Dashboard sem aviso de pausa.
- [ ] Você executou o arquivo `supabase-schema.sql` e recebeu mensagem de sucesso.
- [ ] Anonymous Sign-Ins está habilitado.
- [ ] Você copiou uma Project URL correta.
- [ ] Você usou uma Publishable key, e não uma Secret key.
- [ ] Salvou `config.js` com os dois valores.

O script SQL já tenta incluir `campaigns`, `campaign_members` e `campaign_events` na publicação `supabase_realtime`. Se os eventos não chegarem aos outros navegadores, confira em Database → Publications se essas três tabelas estão na publicação `supabase_realtime`.

---

## PARTE 8 — Se já existe um banco de uma versão anterior

Não use o caminho de instalação nova sem conferir a versão. Esta parte só se aplica se você já tem uma campanha ou tabelas de uma versão anterior. Se está criando Aethra pela primeira vez, pode seguir para a Parte 9.

### 8.1 Fazer uma cópia dos dados antes da migração

A migração v0.4 foi escrita para acrescentar recursos sem apagar campanhas, personagens ou eventos. Mesmo assim, é prudente guardar uma cópia dos dados antes de atualizar.

No plano gratuito, não conte com backups automáticos baixáveis pelo painel. Para uma cópia simples dos dados das campanhas, exporte as tabelas principais em CSV:

1. Abra o Dashboard do Supabase e selecione o projeto de Aethra.
2. Na barra lateral, abra **Table Editor** (Editor de tabelas). Em algumas versões, essa área pode ficar dentro de **Database**.
3. Selecione o esquema `public`.
4. Abra a tabela `campaigns`.
5. Procure o menu de três pontos (`...`) ou a opção **Export** / **Download CSV**.
6. Baixe o arquivo CSV e salve numa pasta do seu computador chamada `Backup Aethra`.
7. Repita para `campaign_members` e `campaign_events`.
8. Se a tabela `campaign_xp_awards` já existir, exporte-a também.
9. Não edite os CSV. Guarde-os em local privado.

**O que esta cópia protege:** os dados em formato de tabela. Ela não é um backup completo do banco: não guarda funções, políticas de segurança, triggers ou configurações. Não tente restaurar os CSV manualmente sem orientação, porque relações entre campanhas, membros e eventos precisam ser preservadas. O arquivo SQL de migração continua responsável pela atualização da estrutura.

### Banco da versão 0.3

1. Faça a cópia CSV descrita acima.
2. Abra `supabase-migration-v0.4.sql` no Bloco de Notas.
3. Copie todo o conteúdo (`Ctrl + A`, depois `Ctrl + C`).
4. Abra o SQL Editor no mesmo projeto Supabase.
5. Crie uma consulta nova.
6. Cole o conteúdo e clique em **Run**.
7. Confira a mensagem de sucesso.
8. Atualize os arquivos do site para v0.4.

A migração cria o registro interno de recompensas de XP, atualiza a validação dos eventos de combate e não apaga campanhas, personagens ou histórico.

### Banco da versão 0.2

1. Faça a cópia CSV descrita na seção 8.1.
2. Execute primeiro `supabase-migration-v0.3.sql`.
3. Confirme que terminou sem erros.
4. Execute depois `supabase-migration-v0.4.sql`.
5. Atualize os arquivos do site para v0.4.

### Banco da versão 0.1 ou alterado manualmente

Não existe uma migração automática garantida nesta entrega para qualquer modificação personalizada. Faça a cópia CSV se conseguir, use um projeto de teste, identifique as tabelas e funções atuais e peça ajuda antes de executar uma migração. Nunca use comandos `DROP TABLE` para tentar resolver um erro sem saber exatamente quais dados serão apagados.

---

## PARTE 9 — Testar sem publicar ainda (opcional)

Se tiver Python instalado no Windows, pode testar a interface no próprio computador:

1. Abra a pasta do jogo no Explorador de Arquivos.
2. Clique na barra de endereço da pasta, digite `cmd` e pressione Enter.
3. No terminal que abrir, digite:

```bash
python -m http.server 8000
```

4. Deixe essa janela aberta enquanto testa.
5. Abra o navegador e visite [http://localhost:8000](http://localhost:8000).

O endereço `localhost` só funciona no seu computador. Seus amigos não conseguirão acessar esse endereço pela internet. Para uma partida entre casas diferentes, publique a pasta no GitHub Pages seguindo `GUIA-GITHUB-PAGES-DO-ZERO.md`.

---

## PARTE 10 — Plano gratuito e pausa por inatividade

O Supabase Free pode pausar automaticamente um projeto quando há pouca atividade de banco de dados durante um período de sete dias. A documentação atual diz que algumas requisições reais ao banco por dia normalmente são suficientes para evitar a pausa, mas isso não é uma garantia.

Como vocês planejam jogar aos finais de semana, existe a possibilidade de o projeto ficar pausado entre as sessões. Para conferir:

1. Entre no [Supabase Dashboard](https://supabase.com/dashboard).
2. Selecione sua organização.
3. Abra o projeto Reino de Aethra.
4. Se o painel indicar que ele está pausado, procure o botão **Resume project**.
5. Confirme a retomada e espere o serviço voltar.
6. Abra o jogo novamente e teste a conexão.

O Supabase informa que é possível restaurar projetos pausados dentro do prazo indicado na documentação. O plano pago impede a pausa automática por inatividade, mas custa dinheiro. Não é obrigatório contratar um plano pago para começar; apenas tenha ciência de que o plano gratuito pode exigir uma retomada manual.

Consulte sempre a informação atual: [Supabase — Project Pausing](https://supabase.com/docs/guides/platform/free-project-pausing).

---

## PARTE 11 — Proteção dos dados e segredos

1. Não coloque senha do banco, Secret key nem `service_role` em `config.js`.
2. Não publique informações pessoais dos jogadores que não sejam necessárias.
3. Compartilhe o código da campanha apenas com os convidados. Quem tiver o código poderá tentar entrar na sala.
4. Não coloque segredos da trama no chat ou em dados compartilhados. A área de segredos privados ainda será implementada.
5. Antes de atualizar o SQL, faça backup.
6. Não compartilhe capturas de tela que exibam chaves, tokens, senhas ou dados sensíveis.

---

## PARTE 12 — Se algo não funcionar

Abra `SOLUCAO-DE-PROBLEMAS.md`. Ela explica, em linguagem simples, o que fazer quando:

- o jogo mostra **Modo local**;
- a autenticação anônima falha;
- o SQL informa que uma tabela ou função não existe;
- um jogador entra, mas não aparece no lobby;
- o chat ou o HP não atualiza;
- o jogo diz que não é o turno do jogador;
- o projeto Supabase está pausado;
- o GitHub Pages mostra erro 404.

Quando pedir ajuda, envie o nome do arquivo e a mensagem de erro completa. **Nunca envie a senha do banco ou uma Secret key.**
