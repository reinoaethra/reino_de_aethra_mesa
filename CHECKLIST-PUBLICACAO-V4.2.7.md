# Checklist de publicação — v4.2.7

- [ ] Fazer backup do repositório.
- [ ] Preservar `config.js` e todas as pastas existentes em `assets/`.
- [ ] Substituir `index.html`, `app.js` e `styles.css`.
- [ ] Adicionar/substituir `assets/js/aethra-dice-3d.js`.
- [ ] Atualizar `preview-dados-3d.html` se utilizar a página de demonstração.
- [ ] Fazer commit e aguardar o GitHub Pages.
- [ ] Recarregar o site com `Ctrl + F5`.
- [ ] Testar D20 e Rolador Universal em visão superior.
- [ ] Conferir se o dado não atravessa o tampo e se o número final fica legível.
- [ ] Testar no computador e celular.
- [ ] Testar exclusão com conta descartável, sem campanhas próprias.
- [ ] Confirmar que a janela só fecha após resposta `success: true`.
- [ ] Em caso de erro, confirmar que a mensagem é exibida e a conta continua conectada.
- [ ] Manter publicada a Edge Function `delete-account` e manter aplicada a migração v4.2.5.
- [ ] Não executar SQL novo por causa da v4.2.7.
