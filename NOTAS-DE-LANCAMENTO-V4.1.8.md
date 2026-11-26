# Reino de Aethra — Notas de lançamento v4.1.8

## Objetivo

A v4.1.8 corrige a confirmação de prontidão dos jogadores e melhora a separação entre ferramentas do mestre e informações apresentadas à companhia. Também acrescenta controle de apresentação do Mapa Tático, por cenário.

## Novidades e correções

### 1. Confirmação de prontidão

- O botão **Estou pronto** deixa de publicar o evento isolado `v41_ready_request`, que foi recusado pela função `submit_campaign_event` do projeto Supabase usado no teste.
- A solicitação passa a reutilizar o tipo `v4_branch_choice_request`, já usado pela aplicação para votos narrativos de jogadores, com `request_type: "session_ready"`.
- O mestre ativo identifica esse subtipo e atualiza `v41.session.readyBy` do jogador que enviou o evento.
- O subtipo de prontidão não é encaminhado ao processador de votação narrativa.
- O processador legado de `v41_ready_request` permanece para compatibilidade com eventos antigos.

### 2. Missões por papel

- O mestre continua vendo todas as missões, inclusive oportunidades ainda não apresentadas, na Central/gerenciador da jornada.
- Os jogadores veem somente as missões apresentadas e aceitas pela companhia, além do histórico de missões concluídas.
- O título da área para jogadores passa a ser **Minhas missões**.

### 3. Mapa Tático — apresentar ou ocultar

- Cada registro de mapa possui o campo `playersVisible`.
- Mapas recém-criados começam ocultos para jogadores.
- O mestre ativo pode usar **Apresentar mapa aos jogadores** e **Ocultar mapa dos jogadores**.
- A configuração é persistida separadamente em cada mapa.
- Jogadores veem uma mensagem de preparação quando o mapa ainda não foi apresentado.
- Para compatibilidade, mapas antigos sem o campo `playersVisible` continuam visíveis; assim, campanhas em andamento não perdem o acesso ao mapa atual após a atualização.

### 4. Cena Interativa e narração

- A narração publicada continua sendo conteúdo apresentado a todos os participantes.
- O editor **Jornada e missões**, onde o mestre prepara a cena, apresenta NPCs e administra objetivos, continua restrito ao mestre ativo.
- A interface explica a diferença entre narração pública e preparação interna.

## Supabase e compatibilidade

- Esta atualização não adiciona tabelas, colunas ou RPCs.
- A confirmação de prontidão reutiliza o tipo de evento `v4_branch_choice_request` já usado no fluxo de votação narrativa do aplicativo. Não foi incluído um SQL de substituição da função `submit_campaign_event`, pois o código atual dessa função e suas políticas não foram fornecidos para inspeção.
- A atualização deve ser validada no projeto Supabase real. Se a função `submit_campaign_event` do ambiente publicado também bloquear `v4_branch_choice_request` para jogadores, será necessário revisar a definição SQL real antes de alterar sua allow-list.
- A visibilidade do mapa é um controle de exibição da interface. Como o estado do mapa permanece no `game_state` compartilhado, isso não constitui sigilo criptográfico nem impede um membro autorizado de consultar diretamente os dados JSON da campanha.
- Missões não apresentadas deixam de aparecer na interface normal do jogador, mas continuam no estado compartilhado da campanha. Não coloque segredos que exijam sigilo técnico no `game_state`.
- `config.js`, pastas `assets/`, mapas, miniaturas e arquivos SQL existentes devem ser preservados.
