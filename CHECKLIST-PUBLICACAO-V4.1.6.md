# Checklist de publicação — Reino de Aethra v4.1.6

## Instalação
- [ ] Fazer backup do repositório.
- [ ] Substituir `index.html`, `app.js` e `styles.css`.
- [ ] Preservar `config.js` e toda a pasta `assets/`.
- [ ] Publicar no GitHub Pages e atualizar o cache do navegador.
- [ ] Não executar SQL.

## Bestiário
- [ ] Abrir o Bestiário como mestre.
- [ ] Confirmar os cartões quadrados e miniaturas.
- [ ] Conferir o espaçamento entre linhas e colunas em desktop.
- [ ] Conferir o espaçamento em tablet e celular.
- [ ] Selecionar monstros no início, meio e fim da lista.
- [ ] Confirmar a ficha à direita e sua imagem ampliada.
- [ ] Rolar a seleção sem mover a ficha.
- [ ] Rolar a ficha sem mover a seleção.
- [ ] Testar pesquisa, filtros, composição e início de encontro.

## Regressão
- [ ] Executar `node --check app.js`.
- [ ] Executar `node tests/v410-release-tests.cjs`.
- [ ] Executar `node tests/v411-release-tests.cjs`.
- [ ] Executar `node tests/v414-bestiary-selection-tests.cjs`.
- [ ] Executar `node tests/v416-bestiary-spacing-tests.cjs`.
