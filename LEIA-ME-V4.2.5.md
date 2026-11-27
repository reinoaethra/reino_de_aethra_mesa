# Reino de Aethra — v4.2.5

Atualização incremental para habilitar exclusão permanente da própria conta Supabase.

## Conteúdo
- `index.html`, `app.js`, `styles.css`: interface atualizada.
- `supabase-migration-v4.2.5.sql`: função segura de listagem dos arquivos Storage do usuário autenticado.
- `supabase/functions/delete-account/index.ts`: Edge Function que revalida senha, protege campanhas e exclui conta no servidor.
- Guias, notas, checklist e testes.

## Instalação obrigatória
1. Execute a migration SQL v4.2.5 em Supabase Dashboard → SQL Editor.
2. Copie `supabase/functions/delete-account/index.ts` para a pasta `supabase/functions/delete-account/` na raiz do repositório.
- Publicação da Edge Function pode ser feita diretamente pelo Supabase Dashboard → Edge Functions → Via Editor; não exige Node.js ou terminal.
- Publicação da Edge Function pode ser feita diretamente pelo Supabase Dashboard → Edge Functions → Via Editor; não exige Node.js ou terminal.
- Publicação da Edge Function pode ser feita diretamente pelo Supabase Dashboard → Edge Functions → Via Editor; não exige Node.js ou terminal.
6. Publique `index.html`, `app.js` e `styles.css`, preservando `config.js` e `assets/`.

**Não é necessário cadastrar a chave Secret manualmente:** o Supabase injeta as chaves necessárias no ambiente seguro da Edge Function. Nunca exponha a chave administrativa no frontend. Siga o `GUIA-DE-ATUALIZACAO-V4.2.5.md` para o passo a passo completo sem Node.js.
