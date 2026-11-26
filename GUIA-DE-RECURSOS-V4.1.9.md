# Reino de Aethra — Guia de recursos v4.1.9

## 1. Confirmação de prontidão

O jogador com ficha usa **Estou pronto** na sala de preparação. A aplicação envia `v41_ready_request`; a função Supabase valida o papel, a existência da ficha e se a campanha ainda não começou. O mestre recebe o evento e atualiza `v41.session.readyBy`. O jogador pode desmarcar antes do início.

## 2. Votação narrativa

Quando o mestre publica uma decisão, cada jogador pode enviar um voto para uma das opções da decisão ativa. O backend verifica se a decisão e a opção ainda existem e recusa um segundo voto do mesmo jogador. A votação não confirma a consequência: o mestre continua responsável por confirmar o resultado.

## 3. Marcação do Mapa Tático

O jogador pode solicitar uma marcação de atenção no mapa atual quando o mestre o apresentou. A solicitação não cria diretamente a marcação: o evento chega ao mestre, que publica o marcador compartilhado. O mestre pode apresentar ou ocultar cada mapa.

## 4. Missões e cenas por papel

- O mestre vê oportunidades disponíveis, ferramentas de preparação, objetivos completos e controles de gerenciamento.
- O jogador vê missões apresentadas/aceitas e o histórico de missões concluídas, sem a lista visual de oportunidades ainda não apresentadas.
- O editor de cenas e a publicação de narrações permanecem sob controle do mestre. A narração publicada é conteúdo da companhia.

## 5. Limite importante de privacidade

A interface não é uma barreira de segurança para dados que continuam no `game_state`. No esquema Supabase atual, membros da campanha podem ler a linha inteira de `campaigns` e todos os eventos da campanha. Segredos narrativos que precisem ser realmente privados devem ficar fora do `game_state` compartilhado, em estrutura separada com RLS exclusiva do mestre. As anotações secretas locais continuam no navegador do mestre.
