# Guia de atualização — Reino de Aethra v4.0.1

Esta é uma atualização incremental sobre a v4.0.0.

## Arquivos do pacote

- `index.html`
- `app.js`
- `styles.css`
- Guias, notas e testes da v4.0.1

## Instalação

1. Extraia o ZIP na raiz do repositório GitHub Pages.
2. Substitua `index.html`, `app.js` e `styles.css` pelos arquivos do pacote.
3. Preserve o `config.js` existente.
4. Preserve todas as pastas `assets/`, incluindo mapas, retratos e miniaturas.
5. Publique as alterações e faça uma atualização forçada do navegador (`Ctrl + F5` no computador; no celular, feche a aba antiga e reabra o site).

## Banco de dados

Não execute SQL para esta atualização. O estado do Modo Chamada fica em `game_state.v4.voiceSession`; as intenções usam o RPC de eventos de campanha já utilizado pela v4.0.0. Campanhas existentes são compatíveis.

## Configuração

Depois da publicação, entre como mestre na campanha, abra **Modo Chamada → Configurar chamada**, escolha a plataforma e cole o convite HTTPS, se desejar. Ative o modo e peça aos jogadores para recarregarem a campanha.

## O que não substituir

Não substitua nem remova `config.js` ou pastas de assets. Este pacote não contém mapas, imagens, miniaturas ou migrações SQL porque nada disso precisa ser alterado para o Modo Chamada.
