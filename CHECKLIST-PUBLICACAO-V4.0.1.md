# Checklist de publicação — v4.0.1

## Antes de publicar

- [ ] Fazer backup do repositório atual.
- [ ] Substituir somente `index.html`, `app.js` e `styles.css`.
- [ ] Preservar `config.js` e todos os assets.
- [ ] Publicar no GitHub Pages e atualizar o navegador.

## Teste do mestre

- [ ] Abrir uma campanha já existente da v4.0.0.
- [ ] Abrir o painel Modo Chamada.
- [ ] Configurar uma plataforma e um convite de teste.
- [ ] Ativar o modo e confirmar que o painel informa que a chamada é externa.
- [ ] Abrir o link em nova aba e verificar se o navegador não bloqueia a navegação.
- [ ] Solicitar um D20 rápido para um jogador e depois para todos.
- [ ] Registrar e dispensar uma intenção de jogador.
- [ ] Registrar uma pista, avanço de objetivo, conclusão de cena e descanso.

## Teste dos jogadores

- [ ] Entrar na mesma campanha com uma conta de jogador.
- [ ] Confirmar que a configuração e o convite aparecem.
- [ ] Abrir o convite da chamada.
- [ ] Enviar uma intenção por cada atalho e confirmar que o mestre a recebe.
- [ ] Responder a uma solicitação de D20.
- [ ] Confirmar que o chat escrito permanece disponível dentro da seção recolhida.

## Teste de regressão

- [ ] Desativar Modo Chamada e conferir que a sessão normal continua igual.
- [ ] Iniciar um encontro e testar ataque, habilidade, poção e iniciativa.
- [ ] Conferir mapa tático, miniaturas, HP e movimento diagonal.
- [ ] Confirmar que missões, fichas e sincronização continuam preservadas.
- [ ] Conferir no Supabase que eventos de intenção e resolução são recebidos pelos participantes.

## Segurança e privacidade

- [ ] Confirmar que links HTTP ou domínios não permitidos são rejeitados.
- [ ] Confirmar que a configuração do convite fica visível apenas dentro da campanha compartilhada.
- [ ] Confirmar que o Modo Chamada não solicita acesso ao microfone nem grava/transcreve áudio.
