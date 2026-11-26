# Reino de Aethra — Guia de atualização v4.2.0

Esta é uma atualização incremental sobre a v4.1.9. Ela inclui uma mudança no modelo de privacidade do Supabase, portanto **a migração SQL deve ser executada antes de publicar o novo site**.

**Correção SQL:** este pacote substitui a primeira edição da migration v4.2.0. A versão corrigida evita a operação `jsonb - text[]` na função de projeção pública e remove as chaves com uma função auxiliar baseada em `jsonb_each`, preservando estados legados que não sejam objetos.

## Antes de começar — faça backup

1. Faça uma cópia completa do repositório atual, incluindo `config.js` e toda a pasta `assets/`.
2. Na Central do Mestre, exporte um backup JSON de cada campanha importante.
3. Faça também um backup do banco de dados Supabase pelo método de backup disponível no seu projeto.
4. Não exclua nem recrie campanhas, personagens ou participantes.

## Etapa 1 — atualizar o Supabase

1. Abra o painel do projeto Supabase.
2. Entre em **SQL Editor**.
3. Abra o arquivo `supabase-migration-v4.2.0.sql` que acompanha este pacote.
4. Copie e execute o conteúdo integral, sem remover partes.
5. Confira se o editor terminou sem erro.

Use o arquivo `supabase-migration-v4.2.0.sql` que está **neste pacote corrigido**. Não reutilize a primeira cópia baixada antes da correção.

A migração corrigida:

- cria `campaign_master_private_state`, com RLS habilitado e sem permissões diretas para `anon` ou `authenticated`;
- copia o `game_state` integral atual de cada campanha para a nova tabela privada;
- substitui o `campaigns.game_state` pela projeção pública filtrada;
- cria as RPCs `get_campaign_game_state` e a nova versão de `update_campaign_state`;
- atualiza `award_encounter_xp` para gravar XP e estado do grupo na tabela privada e republicar somente a projeção filtrada;
- atualiza a função `submit_campaign_event` para manter as validações de prontidão, votação, mapa e interação da Cena Interativa;
- substitui as RPCs de movimento/interação do Mapa Tático para rejeitar solicitações diretas em mapas ainda ocultos;
- altera a política de leitura de `campaign_events` para que jogadores não leiam eventos explicitamente privados;
- cria o bucket `aethra-campaign-audio` e suas políticas de upload/remoção pelo mestre.

**Não execute novamente `supabase-schema.sql`, `supabase-migration-v3.0.3.sql` nem `supabase-migration-v4.1.9.sql`.** A migração v4.2.0 já contém a função de eventos necessária, baseada no esquema e no SQL fornecidos para o projeto.

## Etapa 2 — publicar os arquivos do site

Na raiz do repositório GitHub Pages, substitua somente:

- `index.html`
- `app.js`
- `styles.css`

Preserve sem alterações:

- `config.js` — mantém a URL e a chave pública do Supabase;
- toda a pasta `assets/` — mapas, miniaturas, retratos, ilustrações e demais arquivos existentes;
- os arquivos SQL anteriores, caso queira manter o histórico do projeto.

Faça commit/publicação. No computador, atualize o site com `Ctrl + F5`; em celulares e tablets, feche a aba antiga e abra novamente.

**Importante:** depois de executar a migração, publique a v4.2.0 antes de voltar a jogar. A v4.1.9 lia o JSON diretamente da linha de `campaigns`; a v4.2.0 usa a RPC com resultado diferente para mestre e jogador.

## O que mudou

### Segurança de campanha

- O estado integral passa a ser guardado em `campaign_master_private_state`.
- O mestre recebe o estado integral pela RPC `get_campaign_game_state`.
- Jogadores recebem a projeção filtrada que permanece em `campaigns.game_state`.
- Missões em preparação, anotações do mestre, relações privadas, próximos passos, snapshots e histórico de desfazer são removidos da projeção pública.
- Eventos com `visibility: "master"`, `private: true` ou `secret: true` não são disponibilizados na leitura normal dos jogadores.

### Preparação livre do Mapa Tático

1. Entre na sessão como mestre ativo.
2. Abra o Mapa Tático e selecione **Preparar posições · livre**.
3. Selecione a miniatura no seletor ou arraste a própria peça.
4. Clique/solte na casa de destino.

Neste modo, o mestre pode posicionar qualquer miniatura dentro dos limites físicos do tabuleiro, ignorando turno, movimento restante, caminho, obstáculos e ocupação de outras peças. A base completa da miniatura ainda precisa caber no tabuleiro. O modo de preparação não revela névoa nem aciona armadilhas, tesouros ou mecanismos. Para voltar às regras normais, selecione **Mover miniatura**.

### Música compartilhada

- O mestre pode adicionar arquivos do computador/celular (até 25 MB por arquivo) ou links HTTPS diretos para áudio.
- A playlist, faixa selecionada, play/pause, posição e volume geral são compartilhados pela campanha.
- O mestre tem anterior, reproduzir/pausar, próxima faixa, seleção da playlist, adição e remoção de faixas.
- Cada jogador controla o volume e o mute apenas no próprio dispositivo.
- Cada navegador precisa de um primeiro clique em **Ativar música neste dispositivo**. Navegadores normalmente bloqueiam áudio automático antes de uma interação do usuário.

Links aceitos precisam apontar diretamente para um arquivo de áudio (`.mp3`, `.ogg`, `.wav`, `.m4a`, `.aac`, `.webm`, `.flac` ou `.opus`). Links para páginas de YouTube, Spotify, SoundCloud e serviços semelhantes não são arquivos diretos e não são aceitos.

**Privacidade do áudio:** o bucket é público para que a reprodução funcione em todos os dispositivos. Portanto, quem tiver o URL direto de um arquivo enviado poderá ouvi-lo. Envie apenas faixas que possam ser compartilhadas com a companhia.

### Cena Interativa

- O mestre pode ocultar/apresentar individualmente portas, baús e mecanismos.
- Objetos ocultos não aparecem na lista nem no pequeno mapa de cena dos jogadores.
- O jogador clica em um objeto apresentado para enviar uma solicitação; o mestre recebe o pedido e decide se resolve ou recusa.
- O mestre apresenta pontos de interesse individualmente. Jogadores veem apenas os locais apresentados na interface normal.
- Uma descoberta registra publicamente o nome do local, enquanto a nota de pista do mestre permanece no estado privado.

## Teste recomendado com duas contas

Faça os testes abaixo com uma conta mestre e outra jogador, preferencialmente em navegadores ou dispositivos diferentes:

1. Jogador confirma e desmarca **Estou pronto**; mestre deve ver a atualização.
2. Mestre abre uma campanha existente e confirma que preparação, notas, missões reservadas e snapshots continuam disponíveis.
3. Jogador abre a campanha e confere que só vê missões apresentadas/aceitas e eventos públicos.
4. Mestre oculta uma porta/baú da Cena Interativa; jogador deve deixar de ver o ícone e o cartão. Tente clicar em um item oculto conhecido: o Supabase deve rejeitar a solicitação.
5. Mestre apresenta um objeto; jogador solicita interação; mestre resolve; o estado atualizado deve aparecer para ambos.
6. Mestre entra em **Preparar posições · livre** e move uma miniatura através de uma casa bloqueada ou ocupada. Ela deve ser reposicionada sem consumir movimento; depois volte ao modo normal.
7. Mestre faz upload de um arquivo de áudio e/ou adiciona link direto, seleciona uma faixa e inicia. Em cada dispositivo jogador, clique uma vez em **Ativar música neste dispositivo** e teste volume/mute.

## Limites conhecidos de privacidade

A v4.2.0 protege os dados de estado da campanha e as notas privadas gravadas nesse estado. Entretanto, páginas estáticas precisam baixar `app.js`, `assets/maps/maps-data.js` e outros assets públicos. Catálogos e textos que continuam incorporados nesses arquivos podem ser inspecionados por alguém com conhecimento técnico, mesmo que a interface normal não os apresente. Esta versão não moveu todo o conteúdo estático da campanha para um serviço privado.

O volume de cada jogador é local e não é sincronizado. A reprodução compartilhada é sincronizada por estado e correção periódica de posição; pequenas diferenças de latência entre dispositivos são esperadas. A reprodução de links externos depende de o servidor permitir streaming do arquivo e do navegador suportar o formato.

## Compatibilidade e reversão

- A migração faz backfill do estado completo antes de filtrar `campaigns.game_state`; campanhas e personagens existentes permanecem.
- Não há migração de fichas ou recriação de contas.
- Não volte a usar a aplicação v4.1.9 com o banco já migrado para v4.2.0: a versão antiga não chama `get_campaign_game_state` e não tem a integração com estado privado/música.
- Se surgir um problema, interrompa a sessão e restaure o backup do banco/repositório feito antes da migração. Não restaure apenas os três arquivos do site sem também considerar a mudança de banco.
