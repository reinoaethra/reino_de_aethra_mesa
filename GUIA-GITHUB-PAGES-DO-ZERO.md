# Guia do GitHub Pages do zero — Reino de Aethra v0.6

Este guia ensina a colocar Reino de Aethra na internet usando o GitHub Pages. Foi escrito para quem nunca publicou um site.

## O que é GitHub Pages?

É um serviço de hospedagem de páginas estáticas do GitHub. Ele entrega ao navegador os arquivos `index.html`, `styles.css`, `app.js` e `config.js`. O banco de dados continua no Supabase.

O GitHub Pages não executa o servidor de partidas, não guarda o estado das sessões e não substitui o Supabase.

---

## PARTE 1 — Criar uma conta GitHub

1. Acesse [https://github.com](https://github.com).
2. Clique em **Sign up** se ainda não tiver conta.
3. Informe seu e-mail, crie uma senha e escolha um nome de usuário.
4. Siga as etapas de verificação solicitadas pelo GitHub.
5. Confirme seu e-mail, caso seja solicitado.
6. Entre na conta.

Guarde sua senha e não a compartilhe com jogadores.

---

## PARTE 2 — Criar o repositório do jogo

Um repositório é uma pasta online onde os arquivos do jogo ficarão guardados.

1. Acesse [https://github.com/new](https://github.com/new).
2. No campo **Repository name**, escreva `reino-de-aethra`.
3. Em **Description**, pode escrever `RPG de mesa virtual Reino de Aethra`.
4. Escolha **Public** para uma publicação gratuita simples do GitHub Pages.
5. Pode marcar **Add a README file** se a opção aparecer.
6. Clique em **Create repository**.

O repositório público significa que qualquer pessoa poderá ver os arquivos do site. Isso é esperado para o GitHub Pages público. Por isso, nunca coloque senha do banco ou Secret key no projeto. A Publishable key do Supabase é projetada para uso no navegador, desde que RLS esteja configurado corretamente.

---

## PARTE 3 — Extrair o ZIP no computador

1. Baixe `reino-de-aethra-v0.6.zip`.
2. Abra a pasta Downloads.
3. Clique com o botão direito no ZIP.
4. Selecione **Extrair tudo**.
5. Abra a pasta extraída.
6. Você deverá encontrar arquivos como `index.html`, `styles.css`, `app.js`, `config.js` e documentos `.md`.

**Atenção importante:** você vai enviar os arquivos que estão dentro da pasta do projeto, e não deixar tudo escondido dentro de uma pasta ZIP.

Antes de enviar, confirme que o `config.js` contém a Project URL e Publishable key do seu Supabase. Não publique o arquivo vazio se já configurou seu projeto.

---

## PARTE 4 — Enviar os arquivos para o GitHub

1. Abra o repositório `reino-de-aethra` no GitHub.
2. Na página principal do repositório, clique em **Add file**.
3. Escolha **Upload files**.
4. Abra a pasta extraída do ZIP no Explorador de Arquivos.
5. Selecione os arquivos e documentos que deseja publicar. Você pode selecionar vários de uma vez.
6. Arraste-os para a área de upload do GitHub ou use o seletor de arquivos.
7. Confira a lista de arquivos antes de confirmar.
8. Na parte inferior, encontre **Commit changes**.
9. Se quiser, deixe a mensagem `Publica Reino de Aethra v0.6`.
10. Clique em **Commit changes**.

### Conferir a posição dos arquivos

Volte para a página principal do repositório. Os arquivos essenciais devem aparecer diretamente na lista principal:

```text
reino-de-aethra/
├── index.html
├── styles.css
├── app.js
├── config.js
├── supabase-schema.sql
├── supabase-migration-v0.3.sql
├── supabase-migration-v0.4.sql  (atualização histórica)
├── supabase-migration-v0.5.sql  (banco que já estava na v0.4)
├── supabase-migration-v0.6.sql  (banco que já estava na v0.5)
├── GUIA-DA-PRIMEIRA-AVENTURA.md
├── README.md
└── ...documentação adicional
```

O item essencial é `index.html` na raiz do repositório. Se ele estiver dentro de outra pasta, o GitHub Pages pode não encontrar a página inicial.

---

## PARTE 5 — Ativar GitHub Pages

1. Dentro do repositório, clique na aba **Settings**.
2. Na barra lateral de Settings, procure **Pages**. Normalmente fica na seção **Code and automation**.
3. Abra **Pages**.
4. Encontre a seção **Build and deployment**.
5. Em **Source**, selecione **Deploy from a branch**.
6. Em **Branch**, selecione `main` (ou o nome da branch principal do seu repositório).
7. No campo de pasta, selecione `/ (root)`.
8. Clique em **Save**.

O GitHub começará a publicar o site. O processo pode levar algum tempo. Volte à tela Pages para conferir quando o link do site for exibido.

A documentação oficial mostra esse mesmo fluxo em [Configuring a publishing source for your GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

---

## PARTE 6 — Abrir o site

O endereço normalmente segue este formato:

```text
https://SEU-USUARIO.github.io/reino-de-aethra/
```

Substitua `SEU-USUARIO` pelo nome de usuário do GitHub.

1. Copie o endereço mostrado na página Settings → Pages.
2. Abra uma nova aba do navegador.
3. Cole o endereço e pressione Enter.
4. Aguarde a página carregar.
5. Confira se aparece o título Reino de Aethra.

Se aparecer 404, veja a seção GitHub Pages em `SOLUCAO-DE-PROBLEMAS.md`.

---

## PARTE 7 — Testar a conexão com Supabase

Com o site aberto:

1. Olhe para o indicador de conexão na parte superior.
2. Se indicar **Supabase conectado** ou **Sala sincronizada**, a conexão básica foi estabelecida.
3. Se indicar **Modo local**, abra o ícone de configurações no canto superior, confira a URL e a Publishable key e tente conectar novamente.
4. Crie uma campanha de teste.
5. Abra o mesmo endereço do site em outro navegador ou perfil.
6. Use o código da campanha para entrar como jogador.

Apenas a interface carregar não prova que o banco está configurado. A criação e a entrada numa campanha são os primeiros testes de banco.

---

## PARTE 8 — Atualizar o jogo no futuro

Quando receber uma nova versão:

1. Baixe o novo ZIP.
2. Extraia o ZIP numa pasta nova.
3. Faça cópia do `config.js` já configurado.
4. Abra o repositório no GitHub.
5. Clique em **Add file → Upload files**.
6. Envie os arquivos novos, incluindo `index.html`, `styles.css`, `app.js` e os documentos atualizados.
7. Quando o GitHub perguntar sobre arquivos com o mesmo nome, substitua os antigos.
8. Recoloque seu `config.js` com os mesmos dados de conexão.
9. Clique em **Commit changes**.
10. Se a nova versão trouxer uma migração SQL, faça a etapa do banco indicada no README antes do teste.
11. Abra o site e pressione `Ctrl + F5` para evitar que o navegador mostre uma versão antiga em cache.

**Não substitua seu `config.js` preenchido por um `config.js` em branco.** Guarde uma cópia local como backup.

---

## PARTE 9 — Quem pode acessar o site?

Se o repositório for público, os arquivos e o site também são públicos. Isso não significa que qualquer visitante possa ler todas as campanhas: as tabelas do Supabase usam RLS para limitar os registros aos participantes autenticados. Mesmo assim, compartilhe o código de convite somente com as pessoas que deseja convidar.

Nunca coloque no repositório:

- senha do banco de dados;
- Supabase Secret key;
- chave `service_role`;
- tokens administrativos;
- dados pessoais desnecessários.

---

## PARTE 10 — Dúvidas comuns

**Preciso instalar WordPress, Node.js ou um servidor?**  
Não. A versão atual é uma página estática e pode ser hospedada no GitHub Pages.

**Preciso deixar o computador ligado para o site continuar no ar?**  
Não. O GitHub Pages hospeda os arquivos. O computador do mestre é necessário durante a sessão para ser a autoridade lógica da partida, mas não entre os finais de semana.

**O GitHub guarda os personagens?**  
Não. As campanhas e os personagens ficam no Supabase.

**Posso compartilhar o link do site com os amigos?**  
Sim. Para entrar numa campanha, eles precisam do código ou link de convite daquela campanha.

**Mudei o arquivo `config.js`, mas não conectou.**  
Confira se publicou o arquivo atualizado, se o conteúdo tem a URL e Publishable key corretas e se o navegador não está usando uma versão antiga em cache. Veja `SOLUCAO-DE-PROBLEMAS.md`.
