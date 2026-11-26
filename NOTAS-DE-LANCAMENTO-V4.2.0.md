# Reino de Aethra — Notas de lançamento v4.2.0

## Objetivo

A v4.2.0 fortalece a privacidade do estado da campanha, melhora a preparação do Mapa Tático, completa o fluxo de solicitações de interação da Cena Interativa e adiciona música compartilhada com controles separados para mestre e jogadores.

## Novidades

### 1. Estado privado do mestre e projeção pública
- Nova tabela `campaign_master_private_state` armazena o estado integral da campanha.
- RPC `get_campaign_game_state` devolve estado integral ao mestre e estado filtrado ao jogador.
- RPC `update_campaign_state` guarda o JSON integral na tabela privada e publica somente a projeção sanitizada em `campaigns.game_state`.
- Missões não apresentadas, notas privadas, preparações, relações de NPCs, snapshots e histórico de desfazer são removidos da projeção do jogador.
- RLS de `campaign_events` impede a leitura de registros marcados como master/private/secret e de tipos internos designados.
- RPCs de movimentação e interação do Mapa Tático também verificam no servidor se o mapa foi apresentado aos jogadores.
- A migração faz backfill dos estados existentes sem recriar campanhas ou personagens.
- A RPC `award_encounter_xp` também foi adaptada: XP, níveis e valores do grupo são gravados no estado privado e a projeção pública é atualizada sem perder a privacidade.

### 2. Preparação livre do Mapa Tático
- Novo modo **Preparar posições · livre** para o mestre.
- Miniaturas podem ser reposicionadas sem regras de turno, movimento, caminho, obstáculos ou ocupação.
- A base inteira ainda precisa caber dentro do tabuleiro.
- A preparação não revela névoa nem aciona armadilhas, tesouros ou mecanismos.
- O modo **Mover miniatura** mantém as regras normais de deslocamento.

### 3. Música compartilhada
- Playlist compartilhada por campanha.
- Upload de arquivos pelo mestre para o Supabase Storage (até 25 MB por arquivo).
- Inclusão de links HTTPS diretos para arquivos de áudio.
- Controles do mestre: faixa anterior, play/pause, próxima faixa, seleção, adição/remoção de faixa e volume geral.
- Controles do jogador: ativar áudio no dispositivo, volume local e mute.
- Sincronização periódica de faixa/estado/posição entre dispositivos.
- Remoção de uma faixa enviada também remove o arquivo correspondente do Storage.

### 4. Cena Interativa
- Mestre pode ocultar/apresentar cada objeto do cenário.
- Objetos ocultos deixam de aparecer na lista e no pequeno mapa 5×4 do jogador.
- Jogadores enviam `world_interaction_request`; mestre aprova ou recusa.
- A função SQL valida campanha ativa, personagem, mapa atual, identificador do objeto e visibilidade do objeto.
- Descobertas passam a registrar publicamente o nome do local sem copiar a pista do mestre para o Diário/evento público.

## Banco de dados e Storage

A atualização inclui `supabase-migration-v4.2.0.sql`. Ela cria a tabela privada e o bucket `aethra-campaign-audio`, substitui as RPCs de leitura/escrita de estado, atualiza `submit_campaign_event` e ajusta a política de leitura de eventos. A migration deve ser executada antes de publicar a aplicação.

O bucket de áudio é público para permitir reprodução em todos os dispositivos. O upload/remoção continua restrito ao mestre da campanha; qualquer pessoa com o URL direto do arquivo pode ouvi-lo.

## Compatibilidade e limites

- Preserva contas, campanhas, participantes, fichas, mapas, inventários, missões e progresso.
- Não execute novamente o schema completo v3.0.3 nem a migration v4.1.9.
- A v4.1.9 não é compatível com o novo modelo de leitura do estado depois da migração; publique v4.2.0 imediatamente após executar o SQL.
- Catálogos e textos estáticos ainda incorporados em JS/assets públicos podem ser inspecionados por usuários técnicos. A v4.2.0 protege o estado de campanha e as notas de preparação gravadas nele; não transformou todos os arquivos estáticos do site em conteúdo privado.
- Navegadores exigem um clique local para iniciar áudio. A sincronização entre aparelhos pode apresentar pequena diferença por latência e buffer.

## Validação

Foram executados `node --check app.js` e 11 suítes automatizadas para regressões v4.1.0/v4.1.1, Bestiário, prontidão, RLS/projeção privada, preparação livre de miniaturas, música, Storage, visibilidade de objetos e fluxo da Cena Interativa. A migração ainda precisa ser executada no projeto Supabase real e validada com contas de mestre/jogador em dois dispositivos.
