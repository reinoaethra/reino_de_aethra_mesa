# Checklist de publicação — Reino de Aethra v4.1.4

## Instalação

- [ ] Fazer backup do repositório e das campanhas.
- [ ] Substituir `index.html`, `app.js` e `styles.css`.
- [ ] Preservar `config.js`.
- [ ] Preservar integralmente a pasta `assets/`.
- [ ] Publicar no GitHub Pages e atualizar o cache do navegador.
- [ ] Não executar SQL.

## Bestiário em desktop

- [ ] Abrir o Bestiário pela Biblioteca ou Central do Mestre.
- [ ] Confirmar a coluna de seleção à esquerda e a ficha à direita.
- [ ] Confirmar miniaturas em cartões quadrados, sem texto sobre o cartão.
- [ ] Confirmar que os nomes aparecem na ficha ao selecionar.
- [ ] Confirmar que a miniatura ampliada não é cortada e não exibe apenas o fundo de uma arte panorâmica.
- [ ] Rolar a seleção e confirmar que a ficha não se move.
- [ ] Rolar a ficha e confirmar que a seleção não se move.

## Bestiário em celular

- [ ] Confirmar que a grade fica acima da ficha.
- [ ] Confirmar que os cartões permanecem quadrados.
- [ ] Confirmar que a rolagem do catálogo é independente.
- [ ] Confirmar que uma ficha longa pode ser rolada sem mover a seleção.

## Funções do jogo

- [ ] Pesquisar por nome, tipo e habilidade.
- [ ] Filtrar por tipo.
- [ ] Selecionar diferentes criaturas e conferir suas fichas.
- [ ] Adicionar e remover uma criatura da composição pelo painel de detalhes.
- [ ] Salvar e reutilizar uma composição.
- [ ] Iniciar encontro individual e encontro composto.
- [ ] Confirmar que campanhas existentes, miniaturas, mapas, fichas e missões continuam funcionando.

## Testes locais

- [ ] Executar `node --check app.js`.
- [ ] Executar `node tests/v410-release-tests.cjs`.
- [ ] Executar `node tests/v411-release-tests.cjs`.
- [ ] Executar `node tests/v414-bestiary-selection-tests.cjs`.

> Os testes de código não substituem a conferência visual na publicação real do GitHub Pages.
