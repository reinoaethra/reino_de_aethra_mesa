# Reino de Aethra — Notas de lançamento v4.1.0

## Objetivo

A versão 4.1.0 aprimora a experiência de jogar em grupo, com menos digitação, melhor preparação da sessão, consultas rápidas e ferramentas de acompanhamento. Ela preserva o Modo Chamada da v4.0.1 e os sistemas de campanha, combate e progressão da v4.0.0.

## Novidades

### 1. Sala de preparação da sessão
- Lista os participantes, presença online/offline, ficha e confirmação de prontidão.
- Cada jogador pode marcar ou desmarcar que está pronto.
- O mestre vê o resumo de prontidão e pode iniciar mesmo com confirmações pendentes, após aviso.
- Quando existe um convite de Discord, WhatsApp ou Google Meet configurado, a sala oferece um atalho para abrir a chamada.
- Iniciar e pausar a sessão criam um ponto de restauração.

### 2. Testes inteligentes de D20
- Solicitação individual ou para todos os jogadores.
- Aplicação do modificador do atributo da ficha e bônus/penalidade adicional.
- Vantagem e desvantagem com dois D20.
- Dificuldade (CD) e resultado de sucesso/falha.
- Testes coletivos, com resumo de maioria ou média.
- Testes resistidos entre jogadores e, opcionalmente, contra um monstro vivo do encontro.
- Resultados públicos podem ser consultados pela companhia; testes reservados ficam somente no navegador do mestre que os solicitou.

### 3. Ferramentas de exploração do Mapa Tático
- Marcações do mestre: atenção, perigo e rota sugerida.
- Jogadores podem solicitar uma marca de atenção em casas já reveladas.
- O mestre confirma a marcação compartilhada.
- As marcações ficam vinculadas ao mapa correspondente, são exibidas por até seis horas e o estado mantém no máximo 24 registros recentes.
- A névoa de guerra existente continua funcionando.

### 4. Linha do tempo da campanha
- Reúne entradas do diário e eventos públicos, como cenas, descobertas, decisões, combate, testes e ações rápidas de voz.
- Pesquisa por texto e filtros por categoria.
- Exportação da linha do tempo em arquivo de texto.
- O mestre pode gerar e salvar um resumo da sessão a partir dos acontecimentos recentes.
- Anotações secretas locais e rolagens reservadas não são incluídas na linha do tempo compartilhada.

### 5. Bestiário interativo e preparador de encontros
- Pesquisa por nome, tipo e habilidade.
- Filtros por categoria.
- Consulta de arte, HP, Defesa, ataque, XP e descrição.
- O mestre pode montar uma composição com até seis tipos de criatura, iniciar o encontro e salvar composições para uso futuro.
- Até 30 composições ficam armazenadas no estado da campanha.
- Jogadores podem consultar as criaturas, mas não recebem controles de criação ou início de encontro.

### 6. Assistente para jogadores iniciantes
- Painel expansível na ficha lateral.
- Explica exploração, turnos, D20 e acesso rápido à ficha, inventário e habilidades.
- Indica quando o turno do personagem está ativo.

### 7. Pontos de restauração
- Até três pontos recentes por campanha.
- Criação manual pelo mestre.
- Criação ao iniciar e pausar uma sessão.
- Salvamento automático antes de alterações importantes do estado de campanha, quando já passou o intervalo de segurança.
- Restauração exige confirmação explícita.

## Compatibilidade e dados

- Não requer migração SQL.
- Não modifica `config.js`.
- Não substitui mapas, miniaturas, artes ou demais arquivos de `assets/`.
- Os novos dados de preparação, marcações, checkpoints e composições utilizam o campo `game_state` já existente e a RPC já utilizada pela aplicação para atualizar esse estado.
- Campanhas antigas recebem os valores padrão da v4.1.0 quando abertas; não precisam ser recriadas.

## Limitações conhecidas e cuidados

- O Modo Chamada continua usando Discord, WhatsApp ou Google Meet externamente. Aethra não captura microfone, não grava e não transcreve conversas.
- Rolagens reservadas são armazenadas no `localStorage` do navegador do mestre. Elas não são sincronizadas para outro dispositivo e podem ser perdidas se os dados do navegador forem apagados.
- Um ponto de restauração recupera o estado de jogo da campanha. Ele não restaura contas, participantes, permissões nem o histórico externo de eventos. Exporte um backup completo antes de restaurar.
- A sala de preparação avisa se alguém não confirmou prontidão, mas o mestre pode iniciar mesmo assim.
- A composição salva do bestiário guarda os tipos de criatura selecionados; não configura quantidades repetidas de cada tipo.
- A validação deste pacote é local/estática. A publicação no GitHub Pages e o comportamento multiplayer devem ser conferidos no ambiente Supabase do proprietário.
