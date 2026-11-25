# Checklist de publicação — Reino de Aethra v4.1.2

## Instalação

- [ ] Fazer backup do repositório e exportar backup das campanhas importantes.
- [ ] Substituir `index.html`, `app.js` e `styles.css`.
- [ ] Preservar `config.js`.
- [ ] Preservar integralmente todas as pastas `assets/`.
- [ ] Publicar no GitHub Pages e atualizar o cache com `Ctrl + F5`.
- [ ] Não executar SQL.

## Bestiário em desktop

- [ ] Abrir o Bestiário pela Biblioteca.
- [ ] Confirmar que o pop-up está ampliado.
- [ ] Confirmar que busca, filtro e grade aparecem agrupados, sem uma área grande vazia à esquerda.
- [ ] Selecionar Goblin das Cinzas, Lobo Cinzento, Espectro da Ruptura e Drakthar.
- [ ] Confirmar que ilustração, HP, Defesa, ataque, XP e habilidade aparecem abaixo do catálogo.
- [ ] Rolar o catálogo e confirmar que todos os 32 tipos continuam acessíveis.

## Composição e combate

- [ ] Adicionar criaturas à composição.
- [ ] Confirmar o limite de seis tipos distintos.
- [ ] Limpar a composição.
- [ ] Salvar uma composição de teste, reutilizá-la e excluí-la.
- [ ] Iniciar um encontro individual e outro com composição em campanha de teste.
- [ ] Confirmar que somente o mestre ativo consegue executar comandos de mestre.

## Telas menores

- [ ] Testar em janela de largura intermediária.
- [ ] Testar em largura de celular.
- [ ] Confirmar que a grade se reorganiza em duas colunas e a ficha fica abaixo dos cartões.
- [ ] Confirmar que botões e textos não transbordam horizontalmente.

## Regressão

- [ ] Executar `node --check app.js`.
- [ ] Executar `node tests/v410-release-tests.cjs`.
- [ ] Executar `node tests/v411-release-tests.cjs`.
- [ ] Executar `node tests/v412-bestiary-layout-tests.cjs`.
- [ ] Conferir sala de preparação, D20, mapas, diário, checkpoints, notificações, desfazer, resumo do turno e encerramento de sessão.

> Os testes automatizados locais não substituem a inspeção visual no site publicado nem a validação multiplayer no Supabase real.
