# Checklist — Reino de Aethra v4.2.5

## Antes da publicação
- [ ] Backup do repositório e exportação das campanhas importantes.
- [ ] Executar `supabase-migration-v4.2.5.sql` no SQL Editor do Supabase Dashboard.
- [ ] - [ ] Abrir `supabase/functions/delete-account/index.ts` no Bloco de Notas e copiar todo o código para o editor da Edge Function no Dashboard.
- [ ] Publicar `delete-account` em Supabase Dashboard → Edge Functions → Via Editor (sem Node.js).
- [ ] Publicar `delete-account` em Supabase Dashboard → Edge Functions → Via Editor (sem Node.js).
- [ ] Publicar `delete-account` em Supabase Dashboard → Edge Functions → Via Editor (sem Node.js).
- [ ] Confirmar `delete-account` ativa em Supabase Dashboard → Edge Functions.
- [ ] **Não cadastrar manualmente** `SUPABASE_SERVICE_ROLE_KEY`: o Supabase injeta as chaves padrão no runtime; não expor chaves administrativas em arquivos públicos.
- [ ] Publicar `index.html`, `app.js` e `styles.css`, preservando `config.js` e `assets/`.

## Teste de comportamento
- [ ] Conta permanente apresenta **Sair** e **Excluir conta**.
- [ ] Conta visitante não recebe a opção de exclusão permanente.
- [ ] Senha errada, e-mail errado e frase incompleta são recusados.
- [ ] Usuário com campanha própria recebe bloqueio indicando que deve excluir/resolver a titularidade antes.
- [ ] Usuário sem campanhas próprias e com senha correta é removido do Auth.
- [ ] Uploads Storage próprios são removidos por Storage API.
- [ ] A sessão atual é limpa e novo visitante é iniciado (quando anonymous sign-in estiver habilitado).
- [ ] Campanhas de terceiros permanecem acessíveis aos demais participantes.
- [ ] Console não apresenta erros de função/migração.
