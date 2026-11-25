# Guia de atualização — Reino de Aethra v4.1.7

Esta atualização é incremental sobre a v4.1.6.

## Instalação

1. Faça backup do repositório atual.
2. Extraia o ZIP na raiz do projeto GitHub Pages.
3. Substitua `index.html`, `app.js` e `styles.css`.
4. Preserve `config.js`, toda a pasta `assets/` e os arquivos SQL existentes.
5. Publique as alterações.
6. No computador, atualize com `Ctrl + F5`; em dispositivos móveis, feche a aba antiga e abra novamente.

## Banco de dados

Não execute SQL. A v4.1.7 não altera tabelas, colunas, RPCs, políticas RLS nem o estado das campanhas.

## O que conferir

- Abra o Bestiário.
- Role a lista de miniaturas à esquerda com a roda do mouse.
- Selecione um monstro e role a ficha à direita com a roda do mouse.
- Repita usando touchpad.
- Confirme que a rolagem interna não desloca o modal externo enquanto o ponteiro está sobre a lista ou a ficha.
- Em celular/tablet, confirme o gesto de deslizar.

## Reversão

Se houver problema, restaure `index.html`, `app.js` e `styles.css` da v4.1.6. Nenhuma reversão de banco de dados é necessária.
