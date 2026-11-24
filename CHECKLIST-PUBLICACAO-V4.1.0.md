# Checklist de publicação — Reino de Aethra v4.1.0

## Antes de publicar
- [ ] Guardar backup externo da campanha e do repositório.
- [ ] Confirmar que `config.js` não será substituído.
- [ ] Confirmar que as pastas `assets/` serão preservadas.
- [ ] Extrair o ZIP incremental na raiz do projeto.
- [ ] Publicar `index.html`, `app.js` e `styles.css` atualizados.

## Teste da sala de preparação
- [ ] Abrir uma campanha com mestre e pelo menos dois jogadores.
- [ ] Confirmar que cada jogador vê a própria opção de prontidão.
- [ ] Confirmar que o mestre vê jogadores online/offline e a contagem de prontos.
- [ ] Configurar um convite HTTPS válido e testar o botão de abrir chamada.
- [ ] Iniciar com todos prontos.
- [ ] Repetir com alguém não pronto e confirmar que o mestre recebe o aviso antes de iniciar.

## Teste de D20
- [ ] Solicitar teste individual com CD.
- [ ] Solicitar teste com vantagem e com desvantagem.
- [ ] Solicitar teste coletivo para todos os jogadores.
- [ ] Solicitar teste resistido entre jogadores.
- [ ] Solicitar teste resistido contra um monstro vivo.
- [ ] Fazer um teste reservado e confirmar que o resultado não aparece para os jogadores.

## Teste do mapa e do diário
- [ ] Mestre marca Atenção, Perigo e Rota.
- [ ] Jogador solicita uma marca em casa revelada.
- [ ] Mestre confirma a marca e os participantes a visualizam.
- [ ] Trocar de mapa e confirmar que as marcas do primeiro mapa não aparecem no segundo.
- [ ] Abrir a Linha do tempo, pesquisar, filtrar e exportar `.txt`.
- [ ] Confirmar que uma ação rápida de voz aceita/dispensada aparece com jogador, ação e resultado.

## Teste do bestiário e ajuda
- [ ] Pesquisar uma criatura por nome e por tipo.
- [ ] Abrir detalhes e conferir HP, Defesa, ataque e XP.
- [ ] Montar e iniciar um encontro.
- [ ] Salvar, carregar e excluir uma composição.
- [ ] Abrir o Assistente do Jogador em uma conta de jogador.

## Teste de recuperação
- [ ] Criar um ponto manual.
- [ ] Pausar a sessão e confirmar o novo ponto.
- [ ] Restaurar um ponto de teste após exportar um backup externo.
- [ ] Confirmar que contas e participantes não são alterados pela restauração.

## Finalização
- [ ] Confirmar que os mapas e miniaturas continuam carregando.
- [ ] Confirmar que o Modo Chamada v4.0.1 continua funcionando.
- [ ] Confirmar que as campanhas antigas abrem normalmente.
- [ ] Conferir a versão 4.1.0 no rodapé.

> A validação automatizada local não substitui os testes no GitHub Pages e no Supabase real. Registre os resultados deste checklist antes de iniciar a campanha oficial.
