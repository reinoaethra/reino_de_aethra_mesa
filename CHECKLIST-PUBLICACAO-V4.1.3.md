# Checklist de publicação — Reino de Aethra v4.1.3

## Instalação

- [ ] Fazer backup do repositório e das campanhas.
- [ ] Substituir `index.html`, `app.js` e `styles.css`.
- [ ] Preservar `config.js`.
- [ ] Preservar toda a pasta `assets/`.
- [ ] Não executar SQL.
- [ ] Publicar no GitHub Pages e atualizar o cache do navegador.

## Bestiário em computador

- [ ] Abrir o Bestiário e verificar que a seleção está em lista vertical à esquerda.
- [ ] Conferir nome, tipo, nível, HP e Defesa de cada opção.
- [ ] Selecionar uma criatura e conferir sua miniatura inteira no painel direito.
- [ ] Confirmar que a imagem de detalhes é a miniatura, não o fundo da arte panorâmica.
- [ ] Pesquisar por nome, tipo e habilidade.
- [ ] Filtrar por tipo e confirmar a contagem de resultados.
- [ ] Adicionar/remover criaturas da composição.
- [ ] Salvar e reutilizar uma composição.
- [ ] Iniciar encontros individual e composto em campanha de teste.

## Bestiário em tablet/celular

- [ ] Confirmar que a lista passa acima da ficha quando a tela é estreita.
- [ ] Confirmar que miniatura, texto e botões não ficam cortados.
- [ ] Confirmar que a rolagem da lista e a rolagem do modal continuam acessíveis.

## Regressão

- [ ] Confirmar que campanhas antigas abrem normalmente.
- [ ] Confirmar que mapas, miniaturas e artes de combate continuam carregando.
- [ ] Confirmar que Modo Chamada, missões, fichas e combate continuam funcionando.
- [ ] Executar `node tests/v410-release-tests.cjs`.
- [ ] Executar `node tests/v411-release-tests.cjs`.
- [ ] Executar `node tests/v413-bestiary-layout-tests.cjs`.

> Os testes locais não substituem a conferência no GitHub Pages e no projeto Supabase reais.
