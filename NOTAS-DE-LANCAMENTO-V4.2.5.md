# Notas de lançamento — Reino de Aethra v4.2.5

## Objetivo

Adicionar exclusão permanente da própria conta com reautenticação e execução administrativa no servidor.

## Novidades
- Botão **Excluir conta** junto ao botão de sair na janela de identidade.
- Confirmação reforçada por e-mail, senha atual e frase explícita.
- Edge Function autenticada que valida a sessão e reautentica a senha antes de qualquer exclusão.
- Bloqueio seguro caso a conta ainda seja proprietária de campanhas.
- Remoção de objetos Storage do próprio usuário pela API oficial, em lotes.
- Exclusão Auth pelo endpoint administrativo do Supabase, sem expor chave privilegiada no navegador.
- Limpeza da sessão antiga e tentativa de iniciar um novo acesso visitante neste dispositivo.

## Supabase
- Inclui `supabase-migration-v4.2.5.sql`, que cria `public.aethra_list_my_storage_objects()` com escopo exclusivo ao `auth.uid()`.
- Inclui `supabase/functions/delete-account/index.ts`; implantar com `supabase functions deploy delete-account`.
- Usa as chaves administrativas já fornecidas pelo runtime seguro das Edge Functions; não exige cadastrar `SUPABASE_SERVICE_ROLE_KEY` manualmente.
- Não substitui nem altera as migrations anteriores.

## Limites e cuidados
- O usuário deve excluir/transferir campanhas das quais é proprietário antes de remover a conta.
- A exclusão é irreversível.
- A exclusão Auth invalida tokens de renovação; JWTs de acesso já emitidos podem permanecer válidos até expirarem, conforme o comportamento do Supabase.
- A funcionalidade não deve ser disponibilizada antes de executar a migração SQL e implantar a Edge Function.

- Se uma referência de banco impedir a exclusão após a remoção dos arquivos pessoais do Storage, a função mantém a conta ativa e devolve uma mensagem de erro; o administrador deve conferir a referência antes de repetir.


## Correção documental — configuração de chaves

A Edge Function utiliza as variáveis administrativas já injetadas pelo runtime das Supabase Edge Functions (`SUPABASE_SECRET_KEYS` e/ou `SUPABASE_SERVICE_ROLE_KEY`). Não é necessário cadastrar manualmente essas variáveis. O prefixo `SUPABASE_` é reservado pelo Supabase e não aceita segredos personalizados. O acesso de implantação da CLI usa um Personal Access Token separado, obtido em `supabase login`. Consulte o Guia de Atualização v4.2.5 revisado para o procedimento completo no Windows.
