# Guia de atualização — Reino de Aethra v4.1.9

Esta atualização é incremental sobre a v4.1.8.

## Etapa 1 — backup

1. Faça backup externo do repositório e exporte um backup completo das campanhas importantes.
2. Não exclua nem recrie campanhas, participantes ou personagens.

## Etapa 2 — atualizar o Supabase (obrigatório para prontidão online)

1. Abra o projeto correto no Supabase.
2. Entre em **SQL Editor**.
3. Abra o arquivo `supabase-migration-v4.1.9.sql`, incluído neste pacote, ou copie seu conteúdo para uma nova consulta.
4. Execute a migration uma vez.
5. Confira se a execução terminou sem erro.

A migration altera somente `public.submit_campaign_event(uuid, text, jsonb)`. Não execute novamente o `supabase-schema.sql` completo nem a `supabase-migration-v3.0.3.sql` para esta atualização. Não há nova tabela, coluna ou política RLS.

## Etapa 3 — publicar o site

1. Extraia o ZIP na raiz do repositório GitHub Pages.
2. Substitua `index.html`, `app.js` e `styles.css`.
3. Preserve `config.js`, toda a pasta `assets/` e os arquivos SQL existentes.
4. Faça commit e publique no GitHub Pages.
5. No computador, atualize com `Ctrl + F5`; em celular/tablet, feche a aba antiga e abra novamente.

## Etapa 4 — testes com duas contas

- Como jogador com ficha, clique em **Estou pronto**. O mestre deve ver a contagem aumentar.
- Desmarque e marque novamente; o estado deve acompanhar a ação.
- Tente votar em uma decisão narrativa ativa; o mestre deve receber o voto. Um segundo voto do mesmo jogador na mesma decisão deve ser recusado.
- Com o mapa oculto, o jogador não deve conseguir solicitar uma marcação. Depois de o mestre apresentar o mapa, a solicitação de atenção deve chegar ao mestre.
- Confirme que jogador não consegue publicar narração, resultado de D20 ou anotação de mestre por `submit_campaign_event`.
- Confirme que o mestre ainda pode iniciar sessão, inclusive após o aviso de jogadores que não marcaram prontidão.

## Limites conhecidos

O esquema atual permite aos membros ler o JSONB `game_state` completo por RLS. Missões ainda não apresentadas e configurações ocultas do mapa são escondidas pela interface, não por uma separação confidencial no banco. Para sigilo técnico real, será necessária outra evolução com armazenamento privado e políticas RLS próprias.

## Reversão

Se necessário, restaure os arquivos web anteriores pelo Git. A migration não altera tabelas nem dados de campanha; porém, restaurar o código antigo sem reverter a função do Supabase deixa a função com suporte adicional aos três eventos, o que é compatível com os eventos antigos.
