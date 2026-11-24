# Guia de atualização — Reino de Aethra v4.1.0

Esta é uma atualização incremental sobre a v4.0.1. O ZIP contém somente os arquivos que precisam ser substituídos ou adicionados.

## Instalação no GitHub Pages

1. Baixe `reino-de-aethra-atualizacao-v4.1.0.zip`.
2. Extraia o conteúdo na raiz do repositório, mantendo a estrutura de pastas.
3. Substitua os arquivos `index.html`, `app.js` e `styles.css` pelos arquivos do ZIP.
4. Mantenha a pasta `tests/` do ZIP no repositório se quiser executar as verificações locais; ela não é necessária para o site funcionar.
5. **Não substitua nem exclua `config.js`.**
6. **Não remova nem substitua nenhuma pasta `assets/`.** Elas contêm os mapas, imagens e miniaturas já configurados.
7. Faça commit e aguarde a publicação do GitHub Pages.
8. Abra o site e atualize com `Ctrl + F5` no computador. No celular, feche a aba antiga e abra novamente.

## Supabase

**Não execute SQL nesta atualização.** A v4.1.0 utiliza o campo `game_state` e a RPC `update_campaign_state` já usados pela versão anterior. Não há nova tabela, coluna ou função obrigatória.

## Compatibilidade

- Não recrie campanhas.
- Não apague personagens ou participantes.
- O estado antigo recebe valores padrão para os campos v4.1.0 quando a campanha é aberta.
- Os mapas, miniaturas, artes de monstros e demais arquivos de `assets/` permanecem inalterados.
- As composições do bestiário, prontidão, marcações do mapa e checkpoints passam a ser gravadas no estado da campanha.

## Como reverter

Se houver algum problema, restaure `index.html`, `app.js` e `styles.css` da v4.0.1 a partir do ZIP anterior. Não é necessário reverter o Supabase, pois esta atualização não executa migração SQL.

Antes de qualquer restauração de checkpoint dentro do jogo, exporte um backup completo da campanha. Checkpoints não recuperam contas, participantes ou o histórico externo de eventos.
