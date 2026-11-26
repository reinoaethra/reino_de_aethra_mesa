# Guia de recursos — Reino de Aethra v4.1.8

## Confirmação de preparo

O jogador com ficha confirma presença na Sala de Preparação usando **Estou pronto**. A aplicação envia a solicitação por meio do evento já usado para votos narrativos (`v4_branch_choice_request`), com o subtipo `session_ready`. O mestre ativo recebe essa solicitação e grava o estado em `v41.session.readyBy`. O subtipo é separado do fluxo normal de votação e não registra voto.

## O que cada papel vê

### Mestre

O mestre ativo mantém acesso a toda a preparação: oportunidades de missões não apresentadas, editor de cena, capítulos, narração, NPCs ainda não revelados, encontros, controles do mapa, recompensas, decisões e ferramentas de campanha.

### Jogador

O jogador vê a narração publicada, ações disponíveis na cena, sua ficha/inventário/habilidades, NPCs já apresentados, missões aceitas pela companhia e missões concluídas. Missões com estado **Disponível** não aparecem no painel do jogador.

## Cena Interativa

A Cena Interativa é a área pública de exploração da cena publicada. Jogadores podem examinar locais e objetos apresentados, conversar com NPCs revelados e declarar ações. O mestre prepara o capítulo, local e texto pelo gerenciador de Jornada e Missões, que continua restrito ao mestre ativo. A tela de preparação não deve ser confundida com a narração já publicada.

## Mapa Tático

A visibilidade é independente por mapa:

- **Oculto:** os jogadores veem apenas um aviso de que o mestre está preparando o tabuleiro.
- **Apresentado:** os jogadores recebem a visualização do cenário, as posições públicas e a névoa de guerra configurada.
- **Ocultar novamente:** o mestre pode retirar a visualização a qualquer momento.

Mapas novos começam ocultos. Registros antigos sem a propriedade de visibilidade continuam visíveis para preservar campanhas existentes.

O recurso é de apresentação na interface. O JSON de campanha continua compartilhado com os membros autorizados; não o utilize como mecanismo de armazenamento de segredos.
