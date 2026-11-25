# Guia de atualização — Reino de Aethra v4.1.6

A v4.1.6 é uma atualização incremental sobre a v4.1.5.

## Instalação no GitHub Pages

1. Faça backup dos arquivos atuais do repositório.
2. Extraia `reino-de-aethra-atualizacao-v4.1.6.zip` na raiz do projeto.
3. Substitua `index.html`, `app.js` e `styles.css`.
4. Preserve `config.js` e todas as pastas `assets/`.
5. Publique no GitHub Pages.
6. Atualize o navegador com `Ctrl + F5`; no celular, feche a aba antiga e abra novamente.

## O que muda

O Bestiário mantém as miniaturas em cartões quadrados e recebe mais espaço horizontal e vertical entre eles. A distância é adaptada ao tamanho da tela: 24/20 px no desktop, 21/17 px em telas intermediárias, 18/15 px em tablets e 16/13 px em celulares estreitos (valores vertical/horizontal).

A lista de monstros continua com rolagem independente. A ficha da criatura selecionada permanece à direita e também conserva sua própria rolagem, quando necessária.

## Supabase

Não execute SQL. A atualização não altera o banco de dados nem o formato do estado das campanhas.

## Arquivos que não devem ser substituídos

- `config.js` — contém a conexão do projeto Supabase.
- Todas as pastas `assets/` — miniaturas, mapas, retratos, ilustrações e demais recursos.
