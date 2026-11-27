# Reino de Aethra — Notas de lançamento v4.2.8

## Objetivo

Expansão grande das regras de personagem e da administração da companhia: queda e ressurreição, árvores de habilidade exclusivas, cura de aliados pelo Clérigo e mercados compartilhados com aprovação do mestre.

## Novidades

### Queda e morte
- HP zero agora coloca o aventureiro no estado Caído.
- Testes de resistência à morte no turno, controlados pelo mestre.
- Três sucessos estabilizam; três falhas matam; 20 natural recupera com 1 HP; 1 natural conta como duas falhas.
- Dano adicional em personagem Caído/Estável acrescenta falha.
- Criaturas comuns deixam de escolher personagens inconscientes como alvo.
- Status de morte, sucessos e falhas são sincronizados e registrados.

### Ressurreição e cura
- Nova ferramenta do mestre para ressuscitar um personagem morto, usando Essência de Retorno ou justificativa narrativa.
- Ritual de Ressurreição na árvore do Clérigo (nível 28, três graus, uma Essência de Retorno); o Clérigo precisa estar consciente e com HP acima de zero.
- Luz Restauradora pode curar o próprio Clérigo ou outro aventureiro.
- Novas técnicas do Clérigo incluem Mãos Benevolentes, Bênção Protetora, Purificação e Círculo Restaurador.

### Árvores de classe
- Oito árvores exclusivas, uma para cada classe.
- Cinco técnicas únicas por classe, cada técnica com até três graus.
- Desbloqueios nos níveis 4, 10, 16, 22 e 28.
- Um ponto a cada três níveis completos a partir do nível 4, até 15 pontos.
- Bônus antigos da árvore compartilhada preservados; pontos já gastos não são creditados novamente.

### Comércio
- Abrir/fechar comércio para todos os jogadores.
- Solicitações de compra e venda da mochila feitas pelos jogadores.
- Janela aberta automaticamente para jogadores conectados e notificação para o mestre quando chega um pedido.
- Fila de pedidos por ordem de chegada; mestre aprova ou recusa um por vez.
- Ouro e inventário só mudam depois da aprovação e revalidação.
- Catálogo filtrado por nível e classe: equipamentos restritos ficam ocultos até cumprir os requisitos.

### Forja
- Botão e janela separados do comércio.
- Solicitações de aprimoramento e encantamento de peças equipadas.
- Fila própria, com aprovação individual do mestre.
- Custos de materiais e ouro debitados apenas após aprovação.

## Supabase

- Nova migração `supabase-migration-v4.2.8.sql`.
- Atualiza a RPC de eventos para permitir a solicitação do Ritual do Clérigo.
- Cria a RPC `submit_marketplace_request`, que valida participante, personagem, serviço aberto e existência de pedido pendente antes de inserir a solicitação.
- O RPC não altera ouro, mochila ou equipamento; a alteração só ocorre após aprovação no painel do mestre.
- Não cria tabelas nem modifica a Edge Function de exclusão de conta.

## Compatibilidade

- Mantém campanhas, personagens, mapas, inventários e contas existentes.
- Bônus da árvore antiga são preservados; pontos antigos não são contados novamente.
- Mantém a exclusão de conta da v4.2.5, os dados 3D da v4.2.7, a central de música e os demais recursos.
- Requer uma execução da migração SQL v4.2.8 no projeto Supabase.

## Testes locais

22 testes automatizados passaram: sintaxe JS, regressões de versões anteriores, queda/ressurreição, oito árvores de classe, comércio/forja, filtros de catálogo, fila e RPC.

A migração SQL foi conferida estaticamente, mas ainda precisa ser executada e validada no projeto Supabase real.
