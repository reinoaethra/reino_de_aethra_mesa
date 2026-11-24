# Notas de lançamento — Reino de Aethra v4.1.1

## Objetivo

Atualização incremental voltada a estabilidade, clareza durante a partida e encerramento organizado das sessões, preservando os sistemas introduzidos na v4.0.0 e v4.1.0.

## Novidades

- Painel de conexão da campanha com participantes online, última sincronização e ação manual de reconexão.
- Reconexão Realtime automática com intervalos progressivos, indicador de estado e limpeza de presença desatualizada.
- Registro limitado de alterações reversíveis do mestre e opção de desfazer a última alteração elegível.
- Notificações de eventos recentes, incluindo entrada de jogadores, narração, D20, combate e alterações relevantes.
- Resumo do turno com personagem/monstro ativo, HP, movimento restante, condições e situação de ação/habilidade.
- Encerramento de sessão com resumo editável, registro no diário, ponto de restauração e retorno ao salão da campanha.
- Limpeza das confirmações de prontidão ao encerrar uma sessão, para preparar a próxima reunião.
- Atualização da versão de cache para 4.1.1.

## Compatibilidade

- Mantém o modo chamada, ações rápidas, mapas táticos, miniaturas, bestiário, missões, fichas e progressão.
- Mantém o `config.js` e todos os assets existentes.
- Não requer migração SQL.
- Novos campos são adicionados ao `game_state`; campanhas sem esses dados continuam sendo normalizadas com valores padrão.

## Limites

- O estado de leitura das notificações fica local ao dispositivo.
- O desfazer não remove eventos imutáveis nem reverte contas, participantes ou registros externos ao `game_state`.
- A sincronização depende de internet, Supabase Realtime, permissões e políticas RLS já configuradas.
- A versão precisa de teste no projeto Supabase/GitHub Pages real antes de uma campanha longa.
