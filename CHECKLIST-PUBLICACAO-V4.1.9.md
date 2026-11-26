# Checklist de publicação — Reino de Aethra v4.1.9

## Antes de publicar
- [ ] Exportar backup externo do repositório e das campanhas relevantes.
- [ ] Executar `supabase-migration-v4.1.9.sql` no SQL Editor do Supabase.
- [ ] Confirmar execução sem erro da função `submit_campaign_event`.
- [ ] Não executar novamente o schema completo v3.0.3.
- [ ] Substituir `index.html`, `app.js` e `styles.css`.
- [ ] Preservar `config.js` e todas as pastas `assets/`.

## Teste de prontidão
- [ ] Entrar como jogador com ficha.
- [ ] Clicar em “Estou pronto” e confirmar a atualização no painel do mestre.
- [ ] Desmarcar e marcar novamente antes do início.
- [ ] Confirmar que após o início da sessão o jogador não consegue alterar a prontidão.

## Teste de votação narrativa
- [ ] Publicar decisão com pelo menos duas opções.
- [ ] Votar com uma conta de jogador.
- [ ] Confirmar recebimento no mestre.
- [ ] Tentar votar novamente com o mesmo jogador e confirmar a recusa.
- [ ] Confirmar a decisão pelo mestre.

## Teste do mapa
- [ ] Selecionar mapa ainda oculto e confirmar que o jogador não o vê.
- [ ] Apresentar o mapa e confirmar que jogador passa a vê-lo.
- [ ] Solicitar uma marcação de atenção como jogador.
- [ ] Confirmar recebimento e publicação pelo mestre.
- [ ] Ocultar o mapa e confirmar que o jogador volta a ver o aviso de preparação.

## Regressão de permissões
- [ ] Confirmar que jogador continua sem permissão para publicar `narration`.
- [ ] Confirmar que jogador continua sem permissão para publicar `session_note`.
- [ ] Confirmar que jogador continua sem permissão para publicar `dice_result`.
- [ ] Confirmar que rolagem, dano declarado e ação de combate continuam validados.

## Limites
- [ ] Informar ao mestre que `game_state` e eventos seguem legíveis aos membros pelas políticas RLS atuais; ocultação visual não é sigilo técnico.
