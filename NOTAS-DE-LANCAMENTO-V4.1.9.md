# Reino de Aethra — Notas de lançamento v4.1.9

## Objetivo

Correção de compatibilidade entre a aplicação v4.1.8 e a função `public.submit_campaign_event` do esquema Supabase v3.0.3 fornecido pelo projeto.

## Correções

- **Prontidão:** a aplicação envia `v41_ready_request`, evento próprio para o botão “Estou pronto”. A função Supabase valida que o autor é jogador com ficha e que a sessão ainda não começou.
- **Votação narrativa:** `v4_branch_choice_request` é permitido apenas como voto em uma opção da decisão ativa. O backend verifica identificador, opção válida e voto duplicado; a decisão final continua sob controle do mestre.
- **Marcações do mapa:** `v41_map_ping_request` é permitido apenas para pedir uma marcação de atenção no mapa ativo e apresentado. O backend valida mapa, coordenadas, personagem e visibilidade do cenário.
- **Compatibilidade temporária:** a migration aceita o envelope antigo de prontidão da v4.1.8 durante a atualização, sem confundi-lo com um voto narrativo.
- **Permissões preservadas:** rolagem, dano declarado e ações de combate mantêm suas validações existentes. Eventos de mestre, como `narration`, `session_note` e `dice_result`, continuam proibidos para jogadores.

## Banco de dados

O pacote inclui `supabase-migration-v4.1.9.sql`. Ele substitui somente a função `public.submit_campaign_event(uuid, text, jsonb)` e reaplica sua permissão de execução para `authenticated`.

- Não cria tabelas, colunas, índices ou políticas RLS.
- Não exige recriar campanhas ou migrar o conteúdo de `game_state`.
- Não execute novamente o `supabase-schema.sql` completo para esta atualização.
- Execute a migration v4.1.9 no SQL Editor antes de publicar a aplicação.

## Visibilidade e privacidade — limite do esquema atual

A interface mantém as oportunidades de missão não apresentadas somente no painel do mestre e oferece a apresentação/ocultação do mapa por cenário. Isso é controle de apresentação na interface. No esquema v3.0.3 fornecido, a política `Members can read their campaigns` permite que qualquer membro leia a linha de `campaigns`, incluindo todo o JSONB `game_state`; a política de eventos também permite leitura de todos os eventos da campanha. Portanto, missões não apresentadas, preparação e dados de mapas não são segredos protegidos contra inspeção técnica por um jogador. Para sigilo real, será necessária uma etapa futura que mova dados privados para armazenamento separado, com RLS exclusiva do mestre.

## Testes

Foram executadas verificações automatizadas de regressão da sessão, D20, notificações, Bestiário, rolagem independente, visibilidade por papel e validação dos três novos eventos. A execução real da migration no Supabase e o teste de duas contas continuam necessários no projeto publicado.
