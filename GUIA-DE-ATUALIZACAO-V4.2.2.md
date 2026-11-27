# Guia de atualização — Reino de Aethra v4.2.2

Esta é uma atualização visual pontual da central de música. Ela corrige a apresentação do controle de volume do mestre em navegadores de computador.

## Arquivos

Substitua `index.html`, `styles.css` e `app.js` pelos arquivos deste pacote. O `app.js` está incluído para manter o conjunto de publicação completo; não houve alteração na lógica JavaScript nesta versão.

Preserve seu `config.js`, a pasta `assets/` e os demais arquivos próprios da hospedagem.

## O que mudou

- A barra de volume usa trilho dourado e cursor circular, em vez do controle nativo branco/quadrado que aparecia em alguns navegadores de desktop.
- O estilo cobre Chrome, Opera, Edge e Firefox, com estados de foco visíveis para navegação por teclado.
- O controle do mestre fica compacto no computador (largura limitada a aproximadamente 185 px) e continua ocupando a largura disponível em telas pequenas.
- O controle de volume individual do jogador mantém seu comportamento e também passa a usar o mesmo acabamento dourado consistente.
- O número do volume e a sincronização da música não foram alterados.

## Supabase

**Não execute SQL nesta atualização.** A v4.2.2 não altera tabelas, políticas, funções, armazenamento nem dados do Supabase. A migration da v4.2.1 permanece inalterada e não precisa ser reaplicada.

## Publicação

1. Faça backup dos arquivos atuais do site.
2. Substitua os arquivos indicados acima.
3. Publique normalmente no provedor de hospedagem.
4. Atualize a página com recarga forçada (Ctrl+F5) para carregar o novo CSS.
5. Abra a campanha como mestre e confirme o trilho dourado, o cursor circular e a largura reduzida no computador.
6. Entre também como jogador em um celular para confirmar que o controle continua utilizável.

## Reversão

Restaure `index.html`, `styles.css` e `app.js` do backup anterior. Não é necessário reverter nada no Supabase.
