# Guia de atualização — Reino de Aethra v4.2.1 (correção da migration)

Esta edição corrige a reexecução da migration após o erro de política RLS já existente.

## Antes de começar

1. Faça backup do projeto, do banco e das campanhas importantes.
2. Não exclua nem recrie campanhas ou personagens.

## Etapa 1 — Supabase

1. Abra o Supabase SQL Editor.
2. Use o arquivo `supabase-migration-v4.2.1.sql` deste pacote corrigido.
3. Execute o conteúdo completo.
4. Confira se terminou sem erros.

A versão anterior da migration removia a política legada `Campaign members can read events`, mas não removia a política nova `Campaign members can read public events and masters can read all` antes de criá-la. Se uma tentativa anterior já havia criado a política nova e falhado depois, a reexecução parava com `policy already exists`. A migration corrigida remove ambos os nomes antes de recriar a política e pode ser executada novamente.

## Etapa 2 — Site

Se ainda não publicou a v4.2.1, substitua `index.html`, `app.js` e `styles.css`. Se já publicou esses arquivos, não é necessário substituí-los novamente por causa deste ajuste exclusivamente SQL. Preserve `config.js` e toda a pasta `assets/`.

## O que esta correção altera

- Corrige a idempotência da política de leitura de `campaign_events`.
- Mantém a filtragem de eventos privados para jogadores e o acesso completo do mestre.
- Mantém os limites de estado, os snapshots compactados e as demais funções da v4.2.1.
- Não apaga campanhas, personagens, missões, mapas, música ou progresso.

## Reversão

Se houver problema, interrompa novos testes e restaure o backup do banco antes de tentar uma migration diferente. Não remova políticas ou tabelas manualmente sem verificar o estado atual.
