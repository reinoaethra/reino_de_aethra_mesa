# Checklist de publicação — Reino de Aethra v4.2.6

## Antes da publicação
- [ ] Fazer backup do repositório e de uma campanha de teste.
- [ ] Conferir que `config.js` será preservado.
- [ ] Conferir que todas as pastas `assets/` existentes serão preservadas.
- [ ] Substituir `index.html`, `app.js` e `styles.css`.
- [ ] Adicionar `assets/js/aethra-dice-3d.js`.
- [ ] Adicionar `preview-dados-3d.html` (página opcional de teste).
- [ ] Publicar no GitHub Pages e fazer recarga forçada.

## D20 público
- [ ] Iniciar sessão com mestre e pelo menos dois jogadores.
- [ ] Solicitar teste D20 público.
- [ ] Confirmar que cada dispositivo mostra o dado icosaédrico 3D rolando.
- [ ] Confirmar que a face final e o número no registro coincidem.
- [ ] Confirmar que a mesma rolagem é exibida aos participantes conectados.

## Rolador Universal
- [ ] Abrir `preview-dados-3d.html` e testar 1d4, 1d6, 1d8, 1d10, 1d12 e 1d20.
- [ ] Testar as mesmas fórmulas pelo Rolador Universal dentro da campanha.
- [ ] Testar 2d6 e uma fórmula com bônus/penalidade.
- [ ] Conferir valores individuais, fórmula e total.
- [ ] Confirmar que a face final de cada dado corresponde ao valor já calculado.
- [ ] Testar uma rolagem reservada e confirmar que só o mestre vê a cena e o resultado.
- [ ] Confirmar que uma rolagem pública é registrada na Linha do Tempo.

## Dispositivos e rede
- [ ] Testar Chrome/Opera ou outro navegador com WebGL 2.
- [ ] Testar desktop e celular, em retrato e paisagem.
- [ ] Confirmar que o CDN `esm.sh` não está bloqueado pela rede.
- [ ] Testar com preferência de movimento reduzido ativada.
- [ ] Verificar no Console do navegador se houver falha no carregamento.

## Regressão
- [ ] Conferir Central de Música, upload e link de áudio.
- [ ] Conferir player de YouTube, controles e volume individual.
- [ ] Conferir controle dourado de volume do mestre.
- [ ] Conferir login, campanhas e exclusão de conta (sem executar exclusão real numa conta principal).
- [ ] Confirmar que mapas, NPCs, bestiário e fichas continuam disponíveis.

## Banco de dados
- [ ] Nenhuma migração SQL nova para a v4.2.6.
- [ ] Não executar novamente SQLs antigos apenas por esta publicação.
