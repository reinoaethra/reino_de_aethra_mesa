# Checklist de publicação — Reino de Aethra v4.1.8

## Instalação
- [ ] Fazer backup do repositório e das campanhas importantes.
- [ ] Substituir `index.html`, `app.js` e `styles.css`.
- [ ] Preservar `config.js` e toda a pasta `assets/`.
- [ ] Não executar SQL nesta versão.
- [ ] Publicar e atualizar o cache do navegador.

## Prontidão multiplayer
- [ ] Abrir a campanha em uma conta de mestre e uma conta de jogador.
- [ ] Como jogador com ficha, clicar em **Estou pronto**.
- [ ] Confirmar que não aparece a recusa de tipo de evento.
- [ ] Confirmar a atualização do status no painel do mestre.
- [ ] Desmarcar prontidão e conferir a sincronização.
- [ ] Repetir com dois jogadores.
- [ ] Iniciar a campanha depois das confirmações.
- [ ] Testar início com um jogador pendente e confirmar o aviso do mestre.

## Missões e Cena Interativa
- [ ] Como mestre, conferir que oportunidades não apresentadas continuam no gerenciador.
- [ ] Como jogador, conferir que missões disponíveis não aparecem.
- [ ] Confirmar que missões aceitas e concluídas continuam visíveis.
- [ ] Confirmar que o jogador não abre o gerenciador da jornada.
- [ ] Confirmar que a narração publicada continua visível ao grupo.
- [ ] Confirmar que o editor da cena continua exclusivo do mestre.

## Mapa Tático
- [ ] Selecionar um mapa novo e confirmar que começa oculto para jogadores.
- [ ] Preparar peças/obstáculos/névoa como mestre.
- [ ] Confirmar que o jogador vê o aviso de mapa ainda não apresentado.
- [ ] Apresentar o mapa e confirmar que aparece no dispositivo do jogador.
- [ ] Ocultar novamente e confirmar que deixa de aparecer.
- [ ] Trocar de mapa e confirmar que a visibilidade é independente.
- [ ] Abrir mapa antigo sem a propriedade `playersVisible` e confirmar que permanece visível.

## Regressão
- [ ] Bestiário: seleção, miniaturas, espaçamento e rolagem.
- [ ] Modo Chamada, D20, combate e movimentação tática.
- [ ] Diário, notificações, checkpoints, desfazer e encerramento de sessão.
- [ ] Confirmar que campanhas anteriores abrem sem recriação.

## Observação

A prontidão precisa ser validada na função `submit_campaign_event` e nas políticas reais do projeto Supabase. A atualização utiliza o tipo de evento `v4_branch_choice_request` já usado pelo fluxo de votação; se uma função personalizada do ambiente negar esse evento a jogadores, a definição SQL atual deve ser revisada antes de qualquer ajuste de banco.
