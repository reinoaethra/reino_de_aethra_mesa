# Reino de Aethra — Guia de cenas exploráveis e livros v2.8

## O que mudou

A v2.8 amplia o painel de exploração da v2.7. A campanha agora apresenta uma cena com uma grade narrativa 5×4, posição compartilhada da companhia e objetos específicos da região.

### Movimento da companhia

- O mestre controlador usa as setas do painel **Cena interativa** para deslocar o grupo.
- A posição é salva por mapa em `game_state.worldExploration.positions`.
- Esse deslocamento é narrativo e serve para encenar a exploração; não substitui o movimento por casas do mapa tático durante combate.
- O mestre continua conduzindo viagens entre regiões pelo seletor já existente.

### Objetos interativos

Cada mapa possui três elementos contextuais:

- **Porta:** alterna entre aberta e fechada.
- **Baú:** pode ser aberto uma vez; o estado é persistido para evitar repetição.
- **Mecanismo:** alterna entre ativado e desativado.

As interações são autorizadas ao mestre controlador, salvam o estado em `worldExploration.objectStates`, registram uma entrada no diário e publicam um evento de sessão. O mestre narra a consequência e concede qualquer recompensa separadamente, para não duplicar os sistemas de espólio e missão.

### NPCs e rotinas

NPCs revelados continuam acessíveis para diálogo. A lista agora mostra uma localização sugerida que muda ciclicamente conforme o turno narrativo. Trata-se de uma rotina de ambientação determinística, não de movimentação autônoma em tempo real. O mestre pode ignorar ou adaptar a sugestão.

## Atualização dos sete livros

A biblioteca interna recebeu capítulos v2.8:

- **Livro do Mestre:** condução de cenas, deslocamento, objetos persistentes, NPCs e registro de consequências.
- **Bestiário:** habitats, sinais e comportamento regional.
- **Os Grandes Chefes:** apresentação de arenas e elementos interativos.
- **Atlas dos Cinco Reinos:** rotas, marcos e cenas exploráveis.
- **Grimório:** usos narrativos da magia durante exploração.
- **Arsenal e Relíquias:** objetos de cenário, mecanismos e recompensas.
- **Manual do Aventureiro:** como declarar ações e explorar em grupo.

O Livro do Mestre em PDF foi atualizado para a edição 2.8 e é entregue fora do ZIP do site porque contém informações reservadas ao mestre.

## Compatibilidade e instalação

- Nenhuma migração SQL necessária.
- As propriedades `positions` e `objectStates` são adicionadas dentro de `worldExploration` no JSON da campanha.
- Campanhas antigas continuam válidas; propriedades ausentes são inicializadas conforme necessário.
- Preserve o `config.js` que já está configurado no seu projeto.
- A página de acesso, criação de conta e início da campanha não foi alterada nesta versão; será tratada em uma etapa específica posterior.

## Limites conhecidos

- O movimento da cena e a resolução de objetos ficam sob controle do mestre controlador. Os jogadores acompanham o estado compartilhado e solicitam ações pela mesa, mas ainda não possuem deslocamento autônomo por usuário nesta camada narrativa.
- A posição na grade não bloqueia caminhos nem substitui colisões do mapa tático.
- Baús registram o estado de abertura, mas a v2.8 não cria automaticamente itens ou moedas; o mestre decide e entrega recompensas usando os sistemas existentes.
- Rotinas de NPC são sugestões visuais por turno, não IA ou navegação autônoma.
- Não foram realizados testes visuais em navegador nem sessão multiplayer real com Supabase.
