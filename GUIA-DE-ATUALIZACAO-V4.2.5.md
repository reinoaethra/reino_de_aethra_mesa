# Guia de atualização — Reino de Aethra v4.2.5 (sem Node.js)

Este é o caminho recomendado para quem não pode instalar programas no computador. **A migração SQL e a publicação da Edge Function podem ser feitas inteiramente pelo navegador, no painel do Supabase.** Não é necessário Node.js, Supabase CLI, Docker nem terminal.

> **A chave Secret não deve ser copiada ou cadastrada manualmente.** A função usa as variáveis administrativas que o próprio ambiente seguro das Edge Functions do Supabase disponibiliza. Nunca coloque uma chave administrativa em `config.js`, `app.js`, no GitHub ou em qualquer arquivo público.

## O que será feito e onde

| Etapa | Onde | O que fazer |
|---|---|---|
| Backup | Seu computador / site | Salvar cópias do site e das campanhas importantes |
| Migração SQL | Supabase Dashboard → SQL Editor | Executar o arquivo SQL da v4.2.5 uma única vez |
| Publicação da função | Supabase Dashboard → Edge Functions → Via Editor | Criar ou atualizar `delete-account`, colando o código `index.ts` |
| Publicação do site | GitHub Pages | Atualizar `index.html`, `app.js` e `styles.css` |

## 1. Faça backup

1. Exporte os backups JSON das campanhas importantes pela Central do Mestre.
2. Guarde uma cópia dos arquivos atuais do site, incluindo `config.js` e a pasta `assets/`.
3. Não exclua campanhas nem contas manualmente pelo SQL Editor.

## 2. Execute a migração SQL pelo navegador

Esta etapa é feita no painel do Supabase, não no computador.

1. Abra https://supabase.com/dashboard e entre na sua conta.
2. Na lista de projetos, clique no projeto usado pelo Reino de Aethra.
3. No menu lateral do projeto, abra **SQL Editor**.
4. Clique em **New query** (ou **Nova consulta**).
5. No pacote da v4.2.5, localize `supabase-migration-v4.2.5.sql`.
6. Abra o arquivo em um editor de texto (por exemplo, Bloco de Notas), selecione todo o conteúdo e copie.
7. Volte ao SQL Editor do Supabase e cole o conteúdo na consulta.
8. Clique em **Run** (ou **Executar**).
9. Confirme que a execução terminou sem erro.

A migração cria a função `aethra_list_my_storage_objects`, que só lista os arquivos de Storage pertencentes ao usuário autenticado. A remoção física dos arquivos é feita pela Edge Function usando a Storage API. Se essa migração já foi executada com sucesso, não precisa executá-la novamente.

## 3. Abra o código da Edge Function no seu computador

Não é necessário instalar nenhum programa.

1. Baixe o pacote atualizado e extraia o ZIP pelo Windows (clique com o botão direito → **Extrair tudo**).
2. Dentro da pasta extraída, procure este arquivo:

   `supabase/functions/delete-account/index.ts`

3. Clique nele com o botão direito e escolha **Abrir com → Bloco de Notas**. Se aparecer uma pergunta sobre a codificação, mantenha UTF-8.
4. No Bloco de Notas, pressione **Ctrl + A** para selecionar todo o código e **Ctrl + C** para copiá-lo.
5. Deixe o Bloco de Notas aberto ou o código copiado; você vai colá-lo no painel do Supabase na etapa seguinte.

**Importante:** copie o conteúdo inteiro de `index.ts`, desde a primeira linha `import ...` até a última linha. Não copie o nome do arquivo nem as marcas de bloco de código.

## 4. Publique a Edge Function diretamente no painel do Supabase

1. Volte para https://supabase.com/dashboard e abra o projeto do Reino de Aethra.
2. No menu lateral do projeto, clique em **Edge Functions**.
3. Na página de Edge Functions:
   - Se `delete-account` **ainda não existir**, clique em **Deploy a new function** e depois em **Via Editor**.
   - Se `delete-account` **já existir**, clique nela na lista e abra a aba **Code**. Use o editor para substituir o código atual.
4. Se estiver criando uma função nova, escolha o início em branco (ou **Hello World**, se for a única opção de editor) e dê exatamente este nome à função:

   `delete-account`

5. O editor mostrará o arquivo `index.ts`. Clique dentro da área do código.
6. Pressione **Ctrl + A** para selecionar o código de exemplo inteiro.
7. Pressione **Ctrl + V** para colar o código que você copiou do arquivo `index.ts` do pacote v4.2.5.
8. Confira se o começo do arquivo contém `import { createClient } from "npm:@supabase/supabase-js@2";` e se o final contém o fechamento da função `Deno.serve`.
9. Clique em **Deploy function** (ou **Deploy updates**, se estiver atualizando uma função que já existia).
10. Aguarde a confirmação de que a publicação foi concluída.
11. Volte à lista de Edge Functions e confirme que `delete-account` aparece como ativa.

A documentação oficial do Supabase confirma que a criação, edição, publicação e teste de Edge Functions podem ser feitos pelo Dashboard, sem ambiente local. O editor do Dashboard não oferece controle de versão ou rollback; por isso, mantenha o arquivo original `index.ts` guardado junto com o backup do pacote.

## 5. Não cadastre a chave Secret

Para esta função:

- Não procure um campo para colar a chave Secret.
- Não crie um segredo chamado `SUPABASE_SERVICE_ROLE_KEY`.
- Não coloque a chave Secret em `config.js` ou no GitHub.
- Não precisa executar comandos `supabase secrets set`.

A função lê as variáveis que o runtime seguro do Supabase fornece automaticamente. Se a publicação ocorrer, mas a função responder que não encontrou uma chave administrativa, não tente expor a chave no site: pare e confira as configurações/variáveis padrão da Edge Function no painel do projeto.

## 6. Publique os arquivos do site

No repositório do GitHub Pages, substitua somente:

- `index.html`
- `app.js`
- `styles.css`

Preserve sem alteração:

- `config.js` — contém a URL e a chave pública do projeto;
- toda a pasta `assets/`;
- os demais arquivos de configuração e dados que já existem no repositório.

Faça o commit/publicação pelo procedimento que você já utiliza. Depois atualize o site com `Ctrl + F5` no computador.

## 7. Como o jogador exclui a própria conta

1. O jogador entra com sua conta permanente.
2. Abre o menu de conta e escolhe **Excluir conta**.
3. Informa o e-mail, a senha atual e digita exatamente `EXCLUIR MINHA CONTA`.
4. Confirma a operação.
5. A Edge Function valida a sessão e a senha no servidor, verifica campanhas próprias, remove arquivos pessoais do Storage e só então solicita a exclusão da identidade Auth.

A exclusão é bloqueada se a conta ainda for dona de campanhas. A v4.2.5 não transfere a titularidade automaticamente. Para excluir essa conta, o mestre precisa primeiro resolver a titularidade das campanhas próprias. Excluir uma campanha apaga seu progresso e o acesso dos participantes daquela campanha; não faça isso se pretende preservar a crônica.

## 8. Testes pós-publicação

- [ ] A migração SQL foi executada sem erro (ou já estava aplicada).
- [ ] `delete-account` aparece ativa em Supabase → Edge Functions.
- [ ] O botão aparece apenas para contas permanentes vinculadas a e-mail.
- [ ] E-mail, senha ou frase incorretos são recusados.
- [ ] Conta dona de campanha recebe bloqueio informando as campanhas; nenhum dado é excluído.
- [ ] Uma conta de teste sem campanhas próprias consegue concluir a exclusão.
- [ ] Após exclusão, a sessão antiga deixa de funcionar e o navegador inicia o modo visitante.
- [ ] Nenhuma chave administrativa foi colocada no frontend ou no repositório público.

**Não teste a exclusão com sua conta principal.** Use uma conta de teste sem campanhas e sem dados que precise preservar.

## Se você não encontrar Edge Functions ou o botão Deploy

A conta usada para abrir o projeto precisa ter permissão para administrar/publicar Edge Functions. Se a opção não aparecer ou estiver desabilitada, peça ao proprietário/administrador do projeto Supabase para publicar a função pelo mesmo editor do Dashboard. Você não precisa de permissão de administrador no Windows; a permissão relevante é a do projeto Supabase.

## Referências oficiais

- Editor de Edge Functions no Dashboard: https://supabase.com/docs/guides/functions/quickstart-dashboard
- Publicar funções: https://supabase.com/docs/guides/functions/deploy
- Variáveis de ambiente e segredos: https://supabase.com/docs/guides/functions/secrets
