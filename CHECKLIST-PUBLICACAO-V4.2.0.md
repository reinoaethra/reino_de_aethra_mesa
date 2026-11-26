# Checklist de publicação — Reino de Aethra v4.2.0

## Backup e migração
- [ ] Backup do repositório completo.
- [ ] Exportar backup JSON das campanhas importantes pela Central do Mestre.
- [ ] Backup do banco Supabase.
- [ ] Executar `supabase-migration-v4.2.0.sql` no SQL Editor.
- [ ] Confirmar execução sem erro antes de publicar o site.

## Publicação web
- [ ] Substituir `index.html`, `app.js` e `styles.css`.
- [ ] Preservar `config.js`.
- [ ] Preservar todas as pastas e arquivos `assets/`.
- [ ] Publicar no GitHub Pages.
- [ ] Atualização forçada do navegador (`Ctrl + F5`) e reabrir no celular.

## Segurança — mestre e jogador
- [ ] Abrir a mesma campanha usando conta mestre e conta jogador.
- [ ] Confirmar que o mestre continua vendo notas, preparação, missões reservadas e ferramentas.
- [ ] Confirmar que o jogador vê somente o estado publicado, missões apresentadas e eventos públicos.
- [ ] Confirmar prontidão e desmarcar prontidão.
- [ ] Confirmar que eventos reservados não aparecem na leitura de eventos do jogador.

## Cena Interativa
- [ ] Mestre oculta um objeto; jogador deixa de vê-lo na lista e no pequeno mapa.
- [ ] Jogador tenta solicitar interação num objeto oculto; backend deve recusar.
- [ ] Mestre apresenta o objeto e o jogador solicita interação.
- [ ] Mestre resolve e o estado resultante sincroniza aos participantes.
- [ ] Mestre apresenta um ponto de interesse e confirma que surge para o jogador.
- [ ] Registrar descoberta e confirmar que a pista privada não foi copiada para o Diário/evento público.

## Mapa Tático
- [ ] Mestre ativa **Preparar posições · livre**.
- [ ] Reposicionar qualquer miniatura em casa bloqueada e ocupada.
- [ ] Conferir que a base inteira não ultrapassa a borda física do tabuleiro.
- [ ] Confirmar que o modo livre não consome movimento nem aciona marcadores.
- [ ] Selecionar **Mover miniatura** e confirmar que as regras normais voltaram.
- [ ] Testar apresentação/ocultação do mapa.

## Música
- [ ] Mestre envia um arquivo de áudio com menos de 25 MB.
- [ ] Mestre adiciona um link HTTPS direto de áudio.
- [ ] Mestre testa selecionar faixa, anterior, play/pause e próxima.
- [ ] Jogadores ativam áudio em cada dispositivo.
- [ ] Jogadores testam volume local e mute; conferir que não mudam o volume dos demais.
- [ ] Remover um arquivo enviado e conferir que o objeto foi removido do Storage.

## Integridade
- [ ] `node --check app.js` aprovado.
- [ ] Todas as suítes em `tests/` aprovadas.
- [ ] Conferir ZIP com `unzip -t`.
- [ ] Teste real Supabase/GitHub Pages concluído antes de campanha longa.
