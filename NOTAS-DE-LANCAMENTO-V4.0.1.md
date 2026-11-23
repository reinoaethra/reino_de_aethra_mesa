# Reino de Aethra v4.0.1 — Notas de lançamento

## Modo Chamada

A v4.0.1 adiciona suporte a sessões conduzidas por voz em Discord, WhatsApp ou Google Meet, mantendo a mesa visual do Reino de Aethra sincronizada.

### Novidades

- Painel **Modo Chamada** na sessão da campanha.
- Configuração opcional do link externo da chamada, compartilhado com os participantes.
- Validação HTTPS e lista de domínios permitidos por plataforma.
- Atalhos de intenção para jogadores: Investigar, Observar, Conversar, Interagir, Ajudar, Proteger, Acompanhar e Recuar.
- Fila de intenções para o mestre registrar ou dispensar solicitações.
- Solicitação rápida de D20 com testes comuns e seleção de jogador ou grupo.
- Registros rápidos para pista encontrada, avanço de objetivo, conclusão de cena e descanso.
- Chat escrito recolhido, mas disponível, enquanto o Modo Chamada estiver ativo.
- Orientações do Modo Chamada adicionadas aos livros do Mestre e do Aventureiro.

### Compatibilidade e limites

- Não há integração de áudio ou vídeo dentro da página. A chamada continua no aplicativo externo.
- O jogo não solicita microfone, não grava nem transcreve conversas.
- Os atalhos não executam automaticamente movimento, dano, conclusão de missão, recompensas ou cura; o mestre confirma e aplica as consequências usando as ferramentas existentes.
- Os novos dados são armazenados no objeto `v4` do `game_state` e os pedidos usam o RPC de eventos de campanha já existente.
- Não há migração SQL nesta versão.
- Não foram modificados `config.js`, imagens, mapas ou miniaturas.
