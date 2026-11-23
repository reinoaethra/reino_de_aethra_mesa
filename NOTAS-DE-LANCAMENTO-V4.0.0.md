# Reino de Aethra — Notas de lançamento v4.0.0

A versão 4.0.0 transforma os recursos existentes em uma mesa de campanha mais completa, com uma Central do Mestre, combate mais tático, escolhas narrativas coletivas, progressão de personagens, continuidade de NPCs, recompensas, conquistas e backup/restauração.

## Compatibilidade e instalação

- Base esperada: Reino de Aethra v3.0.6.
- Não há migração SQL nesta edição. Os novos registros são armazenados no campo `game_state` JSONB já utilizado pela campanha, ou na ficha do personagem através do RPC já existente.
- O pacote incremental fornece somente `index.html`, `app.js`, `styles.css` e documentação/testes. Não inclui `config.js`, mapas, miniaturas, livros ou outros assets existentes.
- Campanhas v3.x sem dados v4 são inicializadas com valores padrão quando abertas; a atualização não exige apagar ou recriar campanhas.

## Novidades

### Central do Mestre

Resumo de participantes online, missões ativas, encontro atual e capítulo, com atalhos para resumo da sessão, preparação da próxima sessão, decisões narrativas, condições, ataques em área, tesouros, memórias de NPCs, anotações secretas e backups.

### Combate avançado

- Condições: Atordoado, Envenenado, Queimando, Congelado, Enfraquecido, Marcado e Enraizado.
- Duração acompanhada por turno do próprio alvo; Queimando causa 1d4 ao término do turno.
- Verificação de alcance e linha de visão quando as peças relevantes estão posicionadas no mapa.
- Cobertura simplificada de +1 ou +2 na Defesa conforme obstáculos próximos ao alvo.
- Ataques em área por centro e raio, com escopo para atingir apenas inimigos ou todos os combatentes encontrados na área.
- Fases e habilidades especiais de chefes, mantendo os perfis e as mecânicas já existentes de Drakthar e Vharzun.
- Personagens Atordoados continuam vivos: perder uma ação não é o mesmo que ser derrotado.

### Narrativa e decisões coletivas

- O mestre publica uma pergunta com duas ou três opções, pistas públicas e consequências previstas.
- Cada jogador pode votar uma vez.
- O primeiro voto não encerra a decisão. O mestre vê a contagem e confirma a opção; pode escolher outra em caso de empate ou por decisão narrativa.
- Só depois da confirmação a escolha entra no histórico e recebe uma marca narrativa (`storyFlag`). A atualização da missão e a execução das consequências continuam sob controle do mestre.

### NPCs e continuidade

O mestre pode registrar confiança de -100 a +100 e lembranças/promessas para cada NPC. Esses dados ajudam a manter continuidade, mas não modificam automaticamente diálogos, preços ou testes.

### Progressão de personagens

A árvore possui três trilhas: Lâmina e precisão, Postura do guardião e Disciplina arcana. O personagem recebe 1 ponto a cada três níveis completos após o nível 1, com limite de nove pontos e três níveis por trilha. As escolhas são permanentes nesta edição e são salvas no registro de personagem existente.

### Recompensas e legado

- O mestre pode distribuir ouro e itens diretamente ao inventário de um jogador.
- Recompensas automáticas já existentes para missões e encontros continuam funcionando.
- A companhia acompanha vitórias, criaturas derrotadas, chefes, decisões, recompensas e espécies vencidas, além de conquistas e títulos vinculados à campanha.
- O painel exibe as cinco espécies com maior número de derrotas registradas.

### Backup e restauração

O mestre pode exportar um arquivo JSON da campanha e restaurá-lo na mesma campanha, validada pelo código. A restauração recupera o estado compartilhado, mas não substitui contas, autenticação, papéis dos membros, fichas permanentes vinculadas à conta ou anotações locais secretas. Exporte um backup antes de restaurar.

### Efeitos sonoros opcionais

Sons sintetizados pelo próprio navegador para dados, combate, turnos, vitória, derrota e eventos narrativos. Desligados por padrão; a preferência fica no armazenamento local do navegador e não é sincronizada entre dispositivos.

## Limites intencionais desta edição

- Relações com NPCs são registros de continuidade, não um sistema automático de reputação com preços ou diálogos dinâmicos.
- A consequência narrativa, o avanço de objetivos e as recompensas que não tenham uma regra automática continuam exigindo confirmação do mestre.
- Linha de visão e cobertura são verificações simplificadas sobre a grade; não são uma simulação geométrica avançada de altura, ângulo ou iluminação.
- Quando uma peça não está posicionada no tabuleiro, as verificações táticas de distância/linha de visão não podem ser calculadas; coloque as peças para usar essas restrições.
- Os efeitos sonoros dependem do suporte de áudio do navegador e de uma interação prévia do usuário, conforme as permissões do navegador.

## Validação

O pacote foi submetido a verificações locais de sintaxe JavaScript, testes direcionados v4.0.0 de progressão, condições, decisões narrativas, estatísticas de criaturas, áudio opcional e compatibilidade, além dos testes de regressão v3.0 e dos mapas oficiais. Não representa uma validação de login, Realtime ou multiplayer no projeto Supabase publicado; esses testes devem ser realizados no ambiente do proprietário após a implantação.
