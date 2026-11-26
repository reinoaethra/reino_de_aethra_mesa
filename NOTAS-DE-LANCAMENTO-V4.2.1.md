# Reino de Aethra — Notas de lançamento v4.2.1

## Objetivo

Correção incremental sobre a v4.2.0. Resolve a rejeição de salvamentos de campanhas cujo estado ultrapassava o limite anterior de 1.500.000 bytes e reduz a duplicação de dados em pontos de restauração.

## Correções

- O limite do estado integral salvo pelo mestre passa para 8.388.608 bytes (8 MiB).
- A mensagem do Supabase passa a informar o tamanho medido e o limite vigente, permitindo diagnóstico sem apagar dados.
- A criação de novos pontos de restauração remove listas de snapshots aninhadas e históricos de desfazer copiados dentro do snapshot.
- Ao salvar, snapshots já existentes são compactados para remover metadados recursivos antigos que não são necessários para restaurar o estado do jogo.
- A lista principal continua mantendo até três pontos de restauração; o histórico de desfazer ativo da campanha permanece disponível.

## Compatibilidade

- Não altera tabelas, dados de personagens, missões, eventos, mapas, música ou a separação de estado público/privado.
- A migration substitui somente `public.update_campaign_state(uuid, jsonb, text)`.
- Não requer recriar campanhas nem executar novamente o esquema completo.

## Limites

- O teto de 8 MiB é uma proteção contra payloads excessivos, não um limite de armazenamento do PostgreSQL.
- Se a campanha ainda ultrapassar 8 MiB, a mensagem apresentará o tamanho real. Não apague o estado manualmente; faça backup e revise os snapshots antigos com o mestre.
- A migration precisa ser aplicada no Supabase real antes de publicar o site v4.2.1.
