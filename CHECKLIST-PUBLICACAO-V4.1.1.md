# Checklist de publicação — Reino de Aethra v4.1.1

## Instalação

- [ ] Fazer cópia dos arquivos atuais.
- [ ] Substituir `index.html`, `app.js` e `styles.css`.
- [ ] Preservar `config.js`.
- [ ] Preservar toda a pasta `assets/`.
- [ ] Publicar no GitHub Pages e atualizar cache no navegador.
- [ ] Não executar SQL: a v4.1.1 não contém migração.

## Conexão

- [ ] Abrir a mesma campanha no computador e no celular.
- [ ] Confirmar os participantes online após o Realtime conectar.
- [ ] Desligar e religar a conexão em um dispositivo de teste.
- [ ] Confirmar que o status passa para offline/reconectando e depois retorna.
- [ ] Testar o botão Reconectar / sincronizar.

## Histórico e notificações

- [ ] Como mestre, realizar uma alteração segura de teste e confirmar que o botão Desfazer aparece.
- [ ] Desfazer a alteração e conferir o estado e a entrada no diário.
- [ ] Confirmar que outro usuário não vê o botão de desfazer.
- [ ] Fazer um jogador entrar na campanha e conferir a notificação.
- [ ] Marcar notificações como lidas e verificar o contador local.

## Combate e encerramento

- [ ] Iniciar encontro com mais de um monstro.
- [ ] Avançar a iniciativa e verificar o Resumo do Turno.
- [ ] Aplicar Atordoado e Enraizado em um personagem de teste e conferir os indicadores.
- [ ] Encerrar uma sessão de teste; revisar o resumo automático.
- [ ] Confirmar que o estado fica pausado e que o grupo retorna ao salão.
- [ ] Conferir que fichas, inventários, missões, mapas e progresso continuam salvos.
- [ ] Iniciar uma nova sessão e confirmar que todos precisam marcar prontidão novamente.

## Recomendação

Execute os testes com uma campanha de teste ou com backup externo recente antes de usar em uma sessão longa. Testes locais de código não confirmam, por si só, a conexão com o projeto Supabase publicado.
