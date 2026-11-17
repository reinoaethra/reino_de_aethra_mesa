# Guia de login e progresso entre dispositivos — Reino de Aethra v0.8

Este guia ensina, passo a passo, como fazer um jogador começar no computador e continuar no celular ou tablet usando o mesmo e-mail e senha.

> **Ideia principal:** na primeira abertura, Aethra cria um acesso visitante para que a pessoa possa experimentar o jogo sem preencher cadastro. Quando o jogador escolhe **Salvar progresso**, o aplicativo vincula um e-mail à identidade visitante que já está usando. Depois de confirmar o e-mail e criar uma senha, a mesma identidade pode ser acessada em outros dispositivos. Não é criada uma segunda ficha.

## Antes de começar

Você precisa ter:

1. Um projeto Supabase criado e conectado ao jogo.
2. O site publicado pelo GitHub Pages (ou aberto em um endereço de desenvolvimento permitido nas URLs de retorno).
3. A opção de login por e-mail habilitada no Supabase.
4. A opção **Anonymous Sign-Ins** habilitada, pois o acesso visitante é criado automaticamente.
5. **Manual Linking** habilitado no Supabase. Essa opção permite transformar o usuário visitante atual em uma conta permanente sem trocar seu identificador.

Se ainda não criou o Supabase, volte ao `GUIA-SUPABASE-DO-ZERO.md` e siga o tutorial desde o começo.

## Parte A — Configurar o Supabase para login

### 1. Abra seu projeto

1. Acesse <https://supabase.com/dashboard>.
2. Entre na conta que criou o projeto de Aethra.
3. Clique no projeto correto.
4. Aguarde o painel do projeto carregar.

### 2. Habilite o provedor de e-mail

1. No menu lateral, procure **Authentication**.
2. Abra **Sign In / Providers** (em alguns layouts o menu aparece como **Providers**).
3. Selecione **Email**.
4. Verifique se o provedor está habilitado.
5. Permita novos cadastros/sign-ups.
6. Mantenha a confirmação de e-mail habilitada para que o endereço seja verificado antes de definir a senha do acesso visitante.
7. Salve qualquer alteração feita.

Os nomes dos menus podem mudar ligeiramente conforme a interface do Supabase. Procure sempre as opções dentro de Authentication.

### 3. Habilite Anonymous Sign-Ins

1. Ainda em Authentication, abra as configurações de provedores ou configurações gerais.
2. Localize **Allow anonymous sign-ins** ou **Enable anonymous sign-ins**.
3. Ative a opção.
4. Salve.

Essa opção precisa continuar ligada. Ela é usada quando alguém abre Aethra sem já ter uma conta.

### 4. Habilite Manual Linking

1. Em Authentication, abra **Configuration** ou **General Configuration**.
2. Localize **Allow manual linking**.
3. Ative a opção.
4. Salve.

**Por que isso é necessário?** Aethra começa com um usuário visitante. O vínculo manual permite adicionar a identidade de e-mail a esse mesmo usuário. Se a opção ficar desligada, o Supabase pode recusar a criação da conta a partir do acesso visitante.

> A documentação atual do Supabase classifica o vínculo manual como uma configuração que precisa ser habilitada no projeto. Se o item não aparecer no painel, consulte a documentação oficial de Anonymous Sign-Ins e não tente substituir essa configuração criando uma conta separada: isso pode deixar a ficha ligada ao usuário visitante antigo.

### 5. Configure o endereço do site e as URLs de retorno

Esta etapa é muito importante. Ela informa ao Supabase para onde deve voltar depois que a pessoa clicar em um link de confirmação ou recuperação de senha.

1. Publique Aethra no GitHub Pages primeiro, seguindo `GUIA-GITHUB-PAGES-DO-ZERO.md`.
2. Abra o endereço público do jogo no navegador.
3. Copie o endereço inteiro que aparece na barra. Exemplo fictício: `https://meu-usuario.github.io/reino-de-aethra/`.
4. Volte ao painel do Supabase.
5. Em Authentication, abra **URL Configuration**.
6. No campo **Site URL**, cole o endereço exato do jogo, incluindo a barra final se o endereço tiver uma.
7. Em **Redirect URLs**, adicione também o endereço exato do jogo.
8. Salve.

Exemplo fictício:

```text
Site URL:
https://meu-usuario.github.io/reino-de-aethra/

Redirect URL permitida:
https://meu-usuario.github.io/reino-de-aethra/
```

Substitua `meu-usuario` e `reino-de-aethra` pelos valores reais do seu GitHub. Não copie o exemplo literalmente.

Para testes locais, você pode adicionar separadamente o endereço local que seu servidor de desenvolvimento realmente utiliza, por exemplo `http://localhost:8000/`. Não coloque um endereço local como Site URL de produção.

### 6. Verifique o envio de e-mails

O Supabase precisa enviar a mensagem de confirmação e as mensagens de recuperação. Para os primeiros testes, verifique se o provedor de e-mail do projeto está funcionando. O serviço de e-mail padrão pode ter limites de envio; para uma comunidade maior, configure um SMTP próprio no Supabase. Isso não exige um servidor de jogo 24 horas, mas pode exigir um serviço de e-mail.

## Parte B — Como o jogador salva a conta no computador original

**Faça esta parte no dispositivo onde a ficha e a campanha já foram criadas.**

1. Abra o site de Aethra no computador original.
2. Conecte-se ao Supabase, caso ainda não esteja conectado.
3. Abra a campanha e confirme que seu personagem aparece corretamente.
4. No topo da página, clique em **Salvar progresso**.
5. Digite um e-mail que você consiga abrir.
6. Clique em **Enviar confirmação**.
7. Abra a caixa de entrada desse e-mail.
8. Localize a mensagem enviada pelo Supabase. Confira também Spam/Lixo eletrônico.
9. Clique no link de confirmação.
10. **Abra o link no mesmo navegador e perfil em que Aethra está aberto.** Se o link abrir outra janela, use o mesmo navegador/perfil; depois volte à aba de Aethra.
11. A tela de Aethra deverá pedir para criar uma senha.
12. Crie uma senha com pelo menos 8 caracteres e repita-a no campo de confirmação.
13. Clique em **Salvar senha**.

Quando aparecer a mensagem de conta criada, o vínculo estará concluído. A conta permanente conserva o mesmo identificador Supabase do acesso visitante original; esse é o motivo de a ficha e as campanhas continuarem associadas à pessoa.

**Não saia da conta visitante, não limpe os dados do navegador e não troque de dispositivo antes de concluir a confirmação e a criação da senha.**

## Parte C — Continuar no celular ou tablet

Depois de concluir a Parte B:

1. Abra o navegador do celular ou tablet.
2. Entre no endereço público do Reino de Aethra.
3. Aguarde a página carregar e a conexão com Supabase ficar ativa.
4. No topo, toque em **Salvar progresso** ou **Conta**.
5. Se o aparelho mostrar um acesso visitante, toque em **Já tenho uma conta**.
6. Informe o mesmo e-mail usado no computador.
7. Informe a senha criada no computador.
8. Toque em **Entrar**.
9. Abra **Campanhas**.
10. Selecione a campanha em que deseja continuar.

O aplicativo consulta o Supabase e mostra as campanhas às quais essa conta pertence. A ficha e os dados salvos são carregados do banco, não da memória do computador antigo.

### Muito importante ao usar um aparelho novo

Faça login **antes** de criar um personagem ou entrar na campanha usando o acesso visitante recém-criado nesse aparelho. A versão atual evita misturar automaticamente duas identidades que tenham dados diferentes. Se você já criou uma ficha como visitante no novo aparelho, não tente entrar na conta por cima dela; primeiro decida qual progresso deve ser preservado.

## Parte D — Esqueci minha senha

1. Abra **Conta**.
2. Escolha **Já tenho uma conta**.
3. Na tela de login, toque em **Esqueci minha senha**.
4. Digite o e-mail da conta.
5. Envie o pedido.
6. Abra a mensagem recebida e clique no link de recuperação.
7. O link precisa retornar ao endereço autorizado na URL Configuration.
8. Digite a nova senha e confirme.

Se o link abrir um erro de URL não permitida, revise a Parte A, etapa 5.

## Parte E — Como o progresso é preservado

- O Supabase Auth mantém a identidade da conta.
- As tabelas de Aethra relacionam campanhas, membros e personagens ao identificador do usuário (`auth.uid()`).
- O vínculo do acesso visitante usa o mesmo identificador, em vez de criar outro usuário.
- Ao fazer login em outro dispositivo, o navegador recebe a mesma identidade e pode consultar as campanhas autorizadas pelas políticas RLS.
- Os dados confirmados no Supabase ficam disponíveis mesmo quando o computador do mestre está desligado.

**Atenção:** isso não significa que uma partida ao vivo continue rodando sem o mestre. O computador do mestre precisa estar ligado durante a sessão, conforme a arquitetura do projeto. Entre sessões, os dados salvos ficam na nuvem e todos podem desligar seus aparelhos.

## O que não fazer

- Não use a chave `service_role` nem a Secret key em `config.js`. A página é pública; use somente a Publishable key.
- Não compartilhe sua senha com o mestre ou outros jogadores.
- Não limpe os dados do navegador antes de transformar o acesso visitante em conta permanente.
- Não crie outra conta com o mesmo e-mail em outro fluxo se você já tem uma ficha visitante que precisa preservar. Use **Salvar progresso** na sessão original.
- Não suponha que uma campanha criada em **Modo local** (`localStorage`) aparecerá no outro aparelho. Campanhas locais não são enviadas automaticamente para o Supabase.

## Como testar antes de usar com o grupo

1. No computador, crie uma conta vinculando um acesso visitante.
2. Confirme o e-mail e defina a senha.
3. Anote o nome da campanha e confirme que aparece em **Campanhas**.
4. Abra Aethra em uma janela privada ou em outro aparelho.
5. Entre com o mesmo e-mail e senha.
6. Confira se a mesma campanha aparece.
7. Abra a campanha e confira nome, classe, nível, HP e inventário do personagem.
8. Altere algo simples que seja seguro para testar (por exemplo, uma nota da campanha, com o mestre) e confira a sincronização.

Se a campanha não aparecer, não crie outra campanha para “corrigir”. Verifique se fez login com o mesmo endereço e se o primeiro dispositivo concluiu a confirmação e a definição da senha.

## Documentação oficial do Supabase

- Anonymous Sign-Ins e vínculo de identidade: <https://supabase.com/docs/guides/auth/auth-anonymous>
- Configuração de provedores e autenticação: <https://supabase.com/docs/guides/auth/general-configuration>
- Site URL e Redirect URLs: <https://supabase.com/docs/guides/auth/redirect-urls>


## Compatibilidade com a v0.8

O fluxo de visitante, confirmação de e-mail, criação de senha, login e recuperação continua igual na v0.8. Não é necessária migração SQL para essa atualização. Depois de publicar a v0.8, faça o teste com computador e celular descrito no checklist.
