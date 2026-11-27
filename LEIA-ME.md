# Reino de Aethra — atualização v4.2.5

## Novidade principal

- A opção **Excluir conta** aparece ao lado de **Sair desta conta neste dispositivo**.
- A confirmação exige e-mail, senha atual e a frase `EXCLUIR MINHA CONTA`.
- A execução é feita por Edge Function autenticada, com segredo administrativo somente no servidor.
- A exclusão é bloqueada se ainda existirem campanhas criadas pela conta.
- Arquivos Storage do usuário são removidos pela Storage API antes da exclusão Auth.

## Conteúdo do pacote

- `index.html`, `app.js`, `styles.css`: aplicação atualizada.
- `supabase-migration-v4.2.5.sql`: helper seguro para listar apenas objetos Storage do usuário autenticado.
- `supabase/functions/delete-account/index.ts`: função administrativa segura de exclusão.
- Publicação da Edge Function pode ser feita diretamente pelo Supabase Dashboard → Edge Functions → Via Editor; não exige Node.js ou terminal.
- `GUIA-DE-RECURSOS-V4.2.5.md`: comportamento e proteção de dados.
- `NOTAS-DE-LANCAMENTO-V4.2.5.md`: resumo das mudanças.
- `CHECKLIST-PUBLICACAO-V4.2.5.md`: validação pós-publicação.
- `tests/`: testes de regressão e da exclusão de conta.
- `supabase-migration-v4.2.1.sql`: migration histórica preservada para os testes/consulta; não executar novamente.

## Instalação resumida

1. Execute `supabase-migration-v4.2.5.sql` no SQL Editor do Supabase Dashboard.
2. Copie `supabase/functions/delete-account/index.ts` para a raiz do repositório.
- Publicação da Edge Function pode ser feita diretamente pelo Supabase Dashboard → Edge Functions → Via Editor; não exige Node.js ou terminal.
- Publicação da Edge Function pode ser feita diretamente pelo Supabase Dashboard → Edge Functions → Via Editor; não exige Node.js ou terminal.
5. Publique `index.html`, `app.js` e `styles.css`; preserve `config.js` e `assets/`.

**Não é necessário cadastrar `SUPABASE_SERVICE_ROLE_KEY` manualmente:** o runtime das Edge Functions recebe as chaves padrão automaticamente. Não coloque nenhuma chave Secret em arquivos do site ou no GitHub. Veja o guia atualizado para instruções detalhadas de Windows.**
