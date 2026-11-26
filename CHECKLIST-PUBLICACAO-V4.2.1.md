# Checklist de publicação — Reino de Aethra v4.2.1

- [ ] Exportar backup das campanhas importantes.
- [ ] Fazer backup do repositório e banco Supabase.
- [ ] Executar `supabase-migration-v4.2.1.sql`.
- [ ] Confirmar conclusão sem erros no Supabase.
- [ ] Substituir `index.html`, `app.js` e `styles.css`.
- [ ] Preservar `config.js` e `assets/`.
- [ ] Publicar GitHub Pages e limpar cache do navegador.
- [ ] Mestre: carregar campanha e confirmar que snapshots continuam aparecendo.
- [ ] Mestre: salvar uma alteração e conferir que não aparece mais o limite antigo de 1.500.000 bytes.
- [ ] Jogador: entrar e confirmar que a projeção pública continua sem os dados privados.
- [ ] Testar restauração de checkpoint em campanha de teste.

Se o novo erro informar mais de 8.388.608 bytes, não apagar dados; fazer backup e revisar tamanho dos snapshots.
