# Mapa Tático — Fundo Ilustrado (v2.10.2)

## O que mudou
- O tabuleiro usa uma única ilustração contínua como fundo, em proporção 5:4.
- A grade 10 × 8 é uma camada transparente de interação, não um mosaico de imagens de terreno.
- As miniaturas ficam acima da imagem e podem ser movidas por clique no destino ou arrastando a própria peça.
- O mestre pode arrastar qualquer peça; cada jogador pode arrastar apenas a miniatura do próprio personagem.
- A névoa de guerra continua cobrindo casas não reveladas.
- As regras de colisão, portas fechadas, ocupação e limite de movimento continuam ativas no código.

## Como mover
1. Mestre: selecione uma miniatura na lista e clique na casa de destino, ou arraste a miniatura diretamente.
2. Jogador: arraste sua miniatura para o destino ou clique em uma casa livre para solicitar movimento.
3. Em campanha conectada, solicitações de jogadores continuam aguardando a aprovação do mestre, conforme o fluxo existente.

## Cenários
A Estrada de Eldoria usa uma ilustração tática superior própria, sem grade ou peças embutidas. Os demais mapas usam ilustrações regionais existentes recortadas para a mesma proporção de tabuleiro. Novos cenários superiores exclusivos podem substituir esses fundos gradualmente, sem alterar coordenadas, peças ou regras.

## Instalação
Substitua os arquivos do site pelo conteúdo deste pacote e preserve `config.js`. Não há migração SQL nesta versão.
