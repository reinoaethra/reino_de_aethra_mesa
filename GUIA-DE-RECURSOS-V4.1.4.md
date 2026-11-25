# Reino de Aethra — Guia de recursos v4.1.4

## Bestiário: seleção e consulta

O Bestiário mantém o catálogo completo e o preparador de encontros, mas agora separa visualmente a seleção da consulta detalhada.

### Desktop

- A coluna esquerda contém uma grade de miniaturas quadradas.
- Cada cartão contém apenas a miniatura da criatura, sem texto ou botão adicional.
- Passe o cursor sobre uma miniatura para consultar o nome em uma dica. Leitores de tela recebem o nome pelo rótulo acessível do botão.
- Ao selecionar uma criatura, sua ficha aparece à direita com nome, classificação, descrição, HP, Defesa, bônus de Ataque, XP e habilidade especial.
- A miniatura da ficha utiliza o mesmo arquivo da miniatura selecionável, ampliado com `object-fit: contain` para não cortar a peça.

### Rolagem independente

- A grade de miniaturas tem sua própria barra de rolagem vertical.
- A ficha detalhada possui outra barra de rolagem quando o conteúdo ultrapassa a altura disponível.
- Assim, é possível navegar pelo catálogo sem perder a posição da ficha e consultar uma ficha longa sem mover a seleção.

### Celular e telas estreitas

A seleção fica acima da ficha, com os mesmos cartões quadrados. A grade mantém rolagem própria; a ficha também pode rolar internamente quando necessário.

### Composição de encontros

A ação de adicionar ou remover uma criatura da composição fica no painel de detalhes. A grade permanece exclusivamente visual para preservar o quadrado da miniatura. O limite de seis tipos distintos por composição continua em vigor.

## Recursos preservados

A pesquisa por nome, tipo ou habilidade, o filtro por tipo, a consulta às 32 criaturas, as composições salvas, o início de encontros individuais e compostos, as permissões do mestre ativo e os sistemas de campanha permanecem como estavam na v4.1.3.
