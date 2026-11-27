# Recursos — Reino de Aethra v4.2.5

## Excluir conta

A opção fica na janela **Conta**, ao lado de **Sair desta conta neste dispositivo**. Sair apenas encerra a sessão deste aparelho; excluir conta solicita a remoção permanente da identidade Supabase.

### Proteções
- exige conta permanente, e-mail correto, senha atual e frase literal `EXCLUIR MINHA CONTA`;
- valida a sessão do usuário e a senha novamente no servidor;
- não aceita ID de usuário enviado pelo navegador;
- bloqueia o processo enquanto houver campanhas criadas pelo usuário;
- remove arquivos Storage próprios pela API oficial;
- usa `auth.admin.deleteUser()` somente na Edge Function, com as chaves administrativas fornecidas automaticamente pelo runtime seguro do Supabase;
- limpa a sessão local antiga e inicia um novo acesso visitante quando permitido.

### O que acontece com campanhas
Campanhas criadas pelo usuário devem ser excluídas antes da exclusão da conta. O site não apaga essas campanhas automaticamente, porque isso poderia remover a crônica e os personagens de outros participantes sem consentimento. Campanhas de outros mestres permanecem, mas a conta excluída perde a participação.

### Requisitos de implantação
A migração `supabase-migration-v4.2.5.sql` e a Edge Function `delete-account` precisam estar ativas. Sem a função, a interface apresenta uma mensagem de configuração e não tenta simular a exclusão. Não exponha `SUPABASE_SERVICE_ROLE_KEY` ou a chave Secret no frontend. Não é preciso cadastrar manualmente essas variáveis: o Supabase injeta `SUPABASE_SECRET_KEYS` e/ou `SUPABASE_SERVICE_ROLE_KEY` no ambiente da Edge Function. O prefixo `SUPABASE_` é reservado pelo Supabase, portanto não crie um segredo personalizado com esse prefixo.


**Observação de dados compartilhados:** os eventos narrativos já publicados podem permanecer no histórico das campanhas de terceiros. A remoção das relações de participação segue as chaves estrangeiras existentes no banco; se alguma delas bloquear a exclusão, a conta permanece ativa e a função retorna erro.
