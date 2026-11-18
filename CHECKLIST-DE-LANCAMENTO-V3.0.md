# Checklist da primeira partida — v3.0

## Publicação

Antes de publicar, leia `GUIA-DE-LANCAMENTO-V3.0.md`.
- [ ] Enviar os arquivos v3.0 para o repositório/site.
- [ ] Manter o `config.js` já configurado.
- [ ] Confirmar que o Supabase está acessível e que as tabelas/RPCs da versão anterior continuam ativas.
- [ ] Abrir o site em uma janela anônima ou aba nova e confirmar que o estado visitante aparece.

## Visitante e conta em dois aparelhos
- [ ] No computador, entrar como visitante e criar uma campanha de teste.
- [ ] Abrir a mesma página no celular como visitante e confirmar que ele não herda a campanha do computador.
- [ ] No celular, abrir **Conta → Já tenho uma conta** e inserir as credenciais permanentes criadas no computador.
- [ ] Confirmar que o login funciona sem mensagem pedindo para salvar o visitante.
- [ ] Confirmar que as campanhas vinculadas à conta aparecem no celular.
- [ ] Em um visitante novo, clicar **Salvar progresso**, solicitar confirmação, confirmar o e-mail e definir a senha.
- [ ] Fechar a aba visitante sem salvar e abrir uma nova aba: confirmar que o acesso temporário anterior não é restaurado.

## Criação
- [ ] Criar uma campanha: a janela deve fechar quando a criação for concluída e o salão da campanha deve aparecer.
- [ ] Entrar como jogador e criar a ficha: o assistente deve fechar quando a ficha for salva e o salão deve atualizar.
- [ ] Repetir as duas ações no celular.

## Combate
- [ ] Criar fichas para pelo menos dois jogadores.
- [ ] Iniciar um encontro com mais de uma criatura e confirmar a ordem de iniciativa.
- [ ] Verificar ataques básicos, habilidade especial, poção, dano manual do mestre e turnos de monstros.
- [ ] Confirmar que uma criatura derrotada não recebe novos turnos e que um personagem com 0 HP não pode agir.
- [ ] Testar uma tentativa de cura com HP completo: a ação deve ser recusada sem consumir recurso.
- [ ] Testar um pedido atrasado/fora de turno: o jogador deve receber uma explicação.
- [ ] Testar derrota do grupo e vitória do grupo.
- [ ] Confirmar efeitos visuais no mapa e que as miniaturas permanecem estáticas como estátuas.

## Encerramento
- [ ] Pausar a sessão como mestre.
- [ ] Confirmar que campanha, ficha, inventário, missão, combate e diário continuam após entrar novamente na conta permanente.
