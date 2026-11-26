# Guia de atualização — Reino de Aethra v4.1.8

Esta é uma atualização incremental sobre a v4.1.7.

## Instalação

1. Faça backup do repositório e exporte um backup das campanhas importantes.
2. Extraia o ZIP na raiz do projeto GitHub Pages.
3. Substitua somente `index.html`, `app.js` e `styles.css`.
4. Preserve `config.js`, toda a pasta `assets/` e os arquivos SQL existentes.
5. Publique as alterações.
6. No computador, atualize com `Ctrl + F5`; em celulares/tablets, feche a aba antiga e abra novamente.

## Supabase

A v4.1.8 não exige migração SQL nem substituição de RPC. O botão de prontidão passa a reutilizar o evento `v4_branch_choice_request` que já faz parte do fluxo de votação narrativa de jogadores, enviando `request_type: "session_ready"` para que o mestre o diferencie de um voto.

**Importante:** o SQL da função `submit_campaign_event` do ambiente publicado não foi anexado para esta atualização. Portanto, a compatibilidade dessa allow-list precisa ser confirmada no Supabase real. Caso o ambiente também bloqueie `v4_branch_choice_request` para jogadores, não substitua a função às cegas: exporte/forneça a definição SQL atual para preparar uma migração específica.

## Como testar a prontidão

1. Abra a mesma campanha em duas contas/dispositivos: mestre e jogador.
2. Entre como jogador, crie ou selecione uma ficha e clique em **Estou pronto**.
3. Confirme que não aparece a mensagem de tipo de evento proibido.
4. Confirme que a sala de preparação do mestre atualiza a contagem e identifica o jogador como **Pronto**.
5. Clique novamente para desmarcar e confirme que a contagem volta a diminuir.
6. Repita com dois jogadores e depois inicie a sessão.
7. Teste também o início com alguém não pronto; o mestre continua podendo confirmar o início após o aviso.

## Como testar missões e cenas

- Como mestre, abra **Jornada e missões**: todas as missões e oportunidades devem permanecer visíveis para preparação.
- Como jogador, a área deve se chamar **Minhas missões** e mostrar somente missões já apresentadas/aceitas e missões concluídas.
- O jogador não deve ver nomes/resumos de missões com estado **Disponível**.
- A narração publicada da cena continua visível para todos.
- O editor de cena, o gerenciador de missões, o controle de revelação de NPCs e os recursos de preparação continuam exclusivos do mestre ativo.

## Como testar a apresentação do Mapa Tático

1. Como mestre, selecione um cenário novo. Ele começa oculto para os jogadores.
2. Prepare o tabuleiro, posicione peças, ajuste portas/obstáculos e névoa de guerra.
3. Confirme que o jogador vê apenas o aviso **Mapa tático ainda não apresentado**.
4. Clique em **Apresentar mapa aos jogadores** e confirme que o mapa aparece no dispositivo do jogador.
5. Clique em **Ocultar mapa dos jogadores** e confirme que o jogador volta a ver o aviso.
6. Troque para outro mapa e confira que sua visibilidade é independente.
7. Abra um mapa antigo de uma campanha já existente sem o campo `playersVisible`; ele deve continuar visível por compatibilidade.

## Limites de privacidade

O controle de mapa e o filtro de missões organizam a apresentação da interface. Eles não removem esses dados do JSON compartilhado `game_state`. Não armazene no estado compartilhado segredos que exijam proteção técnica.

## Reversão

Se houver problema, restaure `index.html`, `app.js` e `styles.css` da v4.1.7. Não há migração de banco a reverter.
