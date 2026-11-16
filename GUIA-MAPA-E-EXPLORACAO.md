# Guia de mapas e exploração — Reino de Aethra v0.7

Este guia, atualizado para a versão 0.6, ensina passo a passo como usar os mapas da campanha. Os mapas são tabuleiros táticos vistos por todos os participantes. O mestre continua sendo responsável por aprovar movimentos e controlar os elementos da cena.

## 1. Onde encontrar o mapa

1. Abra a campanha e entre na sessão.
2. Role a página até a seção **Mapa tático**.
3. O mapa atual aparece em uma grade de 10 colunas por 8 linhas.
4. Cada casa tem uma coluna numerada de 1 a 10 e uma linha de 1 a 8.
5. Os ícones de escudo representam aventureiros; o ícone vermelho representa o monstro do encontro.

## 2. Trocar de mapa (somente o mestre)

O mestre verá botões com quatro localidades:

- **Estrada de Eldoria:** trilhas, árvores e um riacho.
- **Vila de Brumafolha:** casas, praça e ruas.
- **Torre dos Vigias:** paredes de pedra e colunas.
- **Santuário das Raízes:** raízes e uma área de água.

Clique no nome do mapa para trocar o tabuleiro. Cada local guarda seus próprios marcadores, peças e áreas reveladas. A troca é sincronizada com todos.

## 3. Mover uma peça como mestre

1. Em **Peça selecionada**, escolha o personagem ou monstro que deseja posicionar.
2. Deixe a ferramenta **Mover peça** selecionada.
3. Clique na casa de destino.
4. O sistema verifica se a casa é livre, se existe caminho e se o movimento respeita o limite.
5. Todos os jogadores verão a nova posição.

Durante o combate, a peça só pode se deslocar no turno dela e pode percorrer até **4 casas por turno**. O caminho não pode atravessar árvores, água, casas, rochas, colunas ou muros. Outras peças também bloqueiam a casa de destino. Fora do combate, cada deslocamento solicitado pode percorrer até 4 casas.

## 4. Solicitação de movimento do jogador

1. O jogador clica em uma casa livre e visível.
2. A plataforma envia um pedido para a sala.
3. O mestre verá a solicitação abaixo do mapa.
4. O mestre escolhe **Aprovar** ou **Recusar**.
5. Se aprovar, o sistema verifica novamente o caminho, o turno e a distância antes de mover a peça.

O jogador só solicita o movimento da própria peça. Durante um combate, o pedido só pode ser enviado no turno do personagem. A aprovação final é feita pelo mestre.

## 5. Névoa de guerra

O mestre pode ativar **Ativar névoa**. Quando a névoa está ligada:

- O mestre continua vendo todo o mapa.
- Os jogadores veem as casas já reveladas e a área próxima aos aventureiros.
- Ao mover uma peça, o sistema revela uma área de 3 × 3 casas ao redor do destino.
- A ferramenta **Revelar área** permite ao mestre revelar manualmente uma região.

Desativar a névoa torna todas as casas visíveis novamente.

## 6. Baús e armadilhas

1. O mestre seleciona **Colocar baú** ou **Colocar armadilha**.
2. Clica em uma casa livre.
3. O marcador fica visível ao mestre, mas permanece escondido dos jogadores até ser descoberto.
4. Quando um aventureiro entra na casa, o marcador é acionado automaticamente.

Nesta versão, um baú concede **15 moedas de ouro** ao aventureiro e uma armadilha causa **5 pontos de dano**. O ouro e o HP são guardados no estado compartilhado da campanha. O saldo aparece no painel do personagem e no inventário.

## 7. Salvamento

Os mapas, posições, névoa, marcadores e moedas são salvos no campo JSONB `campaigns.game_state`. A versão 0.6 acrescenta uma função RPC para que o jogador solicite o movimento da própria peça.

- Instalação nova: execute `supabase-schema.sql` completo.
- Banco já na v0.5: faça backup e execute `supabase-migration-v0.6.sql` e depois `supabase-migration-v0.7.sql`.
- Banco em versão anterior: atualize na ordem indicada no README, sem executar o esquema completo por cima das tabelas existentes.

## 8. Limitações desta versão

- Os mapas são grades táticas 2D; ainda não são mapas ilustrados em alta resolução ou ambientes 3D.
- O mestre aprova movimentos dos jogadores; não há arrastar-e-soltar direto pelos jogadores.
- O cálculo de caminho usa deslocamento ortogonal (cima, baixo, esquerda, direita), sem diagonais.
- Os marcadores são elementos narrativos básicos; armadilhas complexas, baús com tabelas de tesouro e chaves ainda serão adicionados.
- A névoa é uma camada visual e não deve ser usada para guardar segredos críticos. O estado da campanha é enviado aos participantes; dados realmente secretos exigem armazenamento privado e políticas próprias.
- O movimento funciona com Supabase configurado em campanhas online. Em modo local, o mestre pode mover as peças, mas não há outros navegadores sincronizados.


### Contas e continuidade entre dispositivos

A partir da v0.7, cada jogador pode vincular seu acesso visitante a e-mail e senha. O login permite carregar a mesma campanha em computador, celular ou tablet. Consulte `GUIA-LOGIN-E-PROGRESSO.md`. A sincronização do mapa requer uma campanha hospedada no Supabase; o modo local não compartilha as posições entre dispositivos.


### Portas e altares (v0.7)

- O mestre escolhe a ferramenta **Porta** e clica em uma casa livre para colocar uma porta fechada. Clicar novamente na porta permite abri-la ou fechá-la.
- Uma porta fechada bloqueia o caminho. Uma porta aberta permite passagem.
- O jogador que estiver em uma casa vizinha pode clicar na porta fechada para solicitar que ela seja aberta. O pedido aparece no painel do mestre, que aprova ou recusa.
- O mestre pode colocar um **Altar**. Quando o jogador está próximo, pode clicar nele para solicitar inspeção. O mestre valida a interação e, quando aprovada, o altar é revelado e uma nota é adicionada ao diário.
- Os pedidos compartilhados precisam de Supabase e da função `request_map_interaction`. Banco novo recebe a função pelo `supabase-schema.sql` v0.7; banco v0.6 precisa de `supabase-migration-v0.7.sql`.

### Miniaturas de personagens (v0.7)

As peças de aventureiro usam um símbolo e uma cor de borda por classe, além das iniciais do personagem. A miniatura se destaca quando selecionada. A criatura ativa possui um marcador maior e animação de respiração. Esses recursos são visuais; a posição real continua guardada no estado de exploração da campanha.
