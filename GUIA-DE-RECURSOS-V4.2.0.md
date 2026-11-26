# Reino de Aethra — Guia de recursos v4.2.0

## 1. Três camadas da campanha

A campanha agora separa:

- **Estado privado do mestre:** preparação, pistas não reveladas, opções futuras, notas e histórico interno. Fica em `campaign_master_private_state` e não pode ser lido diretamente pelas contas dos jogadores.
- **Estado público da campanha:** narração publicada, progresso compartilhado, personagens/combate, missões apresentadas, NPCs revelados, mapa apresentado e playlist. Fica em `campaigns.game_state` como uma projeção filtrada.
- **Eventos:** jogadores enviam apenas solicitações permitidas; o mestre publica narração e resultados. A leitura dos eventos também respeita os campos de privacidade.

A aplicação usa `get_campaign_game_state` para receber o estado adequado ao papel. O mestre não deve usar uma aba antiga v4.1.9 depois da migração.

## 2. Modo de Preparação do Mapa Tático

A ferramenta **Preparar posições · livre** existe para o mestre montar o tabuleiro antes de apresentar ou iniciar um encontro.

Ela ignora turno, distância de movimento, caminho, terreno bloqueado e colisão com outras peças. Continua verificando que a base inteira da miniatura fique dentro das dimensões do tabuleiro. Não revela a névoa, não aciona marcadores e não concede movimento/ação a personagens.

Use **Mover miniatura** para voltar à movimentação normal. A ferramenta livre só funciona na instância ativa do mestre.

## 3. Música compartilhada

### Painel do mestre

- **Anterior / Próxima:** muda a faixa selecionada na playlist.
- **Reproduzir / Pausar:** publica o estado de reprodução para todos.
- **Volume geral:** define o nível-base compartilhado.
- **Adicionar arquivo:** envia um ou mais arquivos de áudio ao bucket `aethra-campaign-audio`.
- **Adicionar link:** aceita um endereço HTTPS direto para arquivo de áudio.
- **Playlist:** clicar no nome seleciona a faixa; o botão ao lado remove a faixa e, para uploads, remove também o arquivo do Storage.
- **Ativar áudio neste dispositivo:** permite ao navegador do mestre iniciar reprodução após atualização/entrada na campanha.

### Painel dos jogadores

Cada jogador possui **Ativar música neste dispositivo**, um controle de volume e **Mutar/Ativar som**. A preferência local fica salva por campanha e dispositivo; não altera o volume dos demais jogadores nem o volume geral do mestre.

A música não é transmitida pelo microfone ou por uma chamada de voz. Cada navegador baixa o mesmo arquivo/link e sincroniza a reprodução com os dados da campanha.

## 4. Cena Interativa

### Para o mestre

- Os pontos de interesse podem ser apresentados/ocultados individualmente.
- Portas, baús e mecanismos podem ser ocultados/apresentados também.
- O mestre continua vendo objetos e locais ocultos e pode inspecionar pistas.
- Solicitações enviadas pelos jogadores ficam na fila **Solicitações de interação**. Use **Resolver** para aplicar a interação ou **Recusar** para registrar que ela não foi autorizada.

### Para jogadores

- A ambientação e a narração publicada são compartilhadas.
- Só aparecem normalmente os pontos de interesse apresentados pelo mestre.
- Objetos ocultos não aparecem na grade/cartões.
- Clicar em objeto apresentado envia uma solicitação; o jogador não altera diretamente portas, baús ou mecanismos.
- Descobertas publicadas aparecem no diário como registro do local conhecido, sem copiar a nota privada do mestre.

### Cena Interativa versus Mapa Tático

A Cena Interativa representa exploração narrativa e locais/objetos. O Mapa Tático é o tabuleiro de casas, miniaturas, alcance, obstáculos, névoa e combate. O pequeno mapa 5×4 da cena é uma representação narrativa simplificada; não é a grade de deslocamento de combate.

## 5. Compatibilidade

Mapas antigos sem configuração de visibilidade continuam apresentados para evitar que uma campanha em andamento perca o cenário atual. Mapas criados na v4.1.8+ seguem a configuração `playersVisible`. Objetos sem `hiddenFromPlayers: true` continuam apresentados, preservando o comportamento anterior.
