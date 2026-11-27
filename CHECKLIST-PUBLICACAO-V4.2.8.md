# Checklist de publicação — v4.2.8

## Antes de publicar
- [ ] Exportar backup JSON de cada campanha importante.
- [ ] Fazer backup do repositório GitHub.
- [ ] Confirmar que a migração v4.2.1 corrigida já foi executada.
- [ ] Confirmar que a v4.2.5 (se necessário para exclusão de conta) está configurada.

## Supabase
- [ ] Abrir o projeto no Dashboard → SQL Editor → New query.
- [ ] Colar o conteúdo integral de `supabase-migration-v4.2.8.sql`.
- [ ] Clicar em Run uma vez.
- [ ] Confirmar que a consulta terminou sem erro.
- [ ] Não executar novamente os SQLs anteriores já aplicados.
- [ ] Confirmar que `submit_marketplace_request` aparece entre as funções RPC.

## GitHub Pages
- [ ] Atualizar `index.html`.
- [ ] Atualizar `app.js`.
- [ ] Atualizar `styles.css`.
- [ ] Atualizar `assets/js/aethra-dice-3d.js`.
- [ ] Preservar `config.js`, `assets/maps/`, demais imagens e configurações.
- [ ] Preservar a Edge Function `delete-account` se já utilizada.
- [ ] Fazer commit e aguardar a publicação.
- [ ] Recarregar com Ctrl + F5.

## Regras de queda e ressurreição
- [ ] Reduzir personagem de teste a 0 HP e confirmar status Caído.
- [ ] Confirmar botão de resistência no turno do personagem.
- [ ] Conferir sucesso, falha, 1 natural e 20 natural.
- [ ] Confirmar três sucessos = Estável e três falhas = Morto.
- [ ] Confirmar que cura recupera Caído/Estável, mas não Morto.
- [ ] Testar Ritual do Clérigo com Essência de Retorno e confirmar que o Clérigo está consciente (HP acima de zero).
- [ ] Confirmar que um Clérigo Caído, Estável ou Morto não consegue conduzir o Ritual.
- [ ] Testar ressurreição manual pelo mestre.

## Árvores de classe
- [ ] Conferir as cinco habilidades de cada uma das oito classes.
- [ ] Conferir requisitos de nível e pontos disponíveis.
- [ ] Aprender e aprimorar uma habilidade até o grau 3.
- [ ] Confirmar efeito, alvo, limite de uso por encontro e preservação dos bônus antigos.

## Comércio
- [ ] Abrir comércio como mestre e conferir a janela do jogador em outro dispositivo.
- [ ] Solicitar uma compra e uma venda.
- [ ] Confirmar a abertura automática da janela nos jogadores conectados e a notificação do mestre ao receber pedidos.
- [ ] Aprovar o primeiro pedido; verificar que o segundo aguarda.
- [ ] Recusar um pedido e conferir que recursos não mudam.
- [ ] Conferir filtro de nível e classe em item raro/épico.

## Forja
- [ ] Abrir a forja pelo botão independente.
- [ ] Solicitar aprimoramento e encantamento.
- [ ] Aprovar e conferir ouro, materiais e bônus da peça.
- [ ] Recusar um pedido e verificar que os recursos não mudam.
- [ ] Conferir que pedidos são resolvidos um por vez.
