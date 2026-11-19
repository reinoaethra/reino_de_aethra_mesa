# Reino de Aethra v3.0.4 — Correção de fundos e miniaturas

## Correção das imagens táticas
- O problema estava numa regra CSS de tabuleiro que aplicava `background-image:none!important` também às plantas que deveriam exibir arte.
- A regra agora é restrita aos tabuleiros sem imagem. O mapa ilustrado é renderizado tanto pela imagem de fundo quanto por um elemento `<img>` real atrás da grade, para não depender dessa propriedade CSS.
- As 11 imagens oficiais continuam apontadas pela biblioteca única `assets/maps/maps-data.js`. As URLs recebem cache-buster `v3.0.4`, incluindo o GitHub Pages publicado em subpasta.
- Se uma imagem não carregar, o tabuleiro exibe um aviso visível em vez de ocultar silenciosamente a falha.

## Miniaturas do bestiário
- O seletor “Iniciar Encontro” não utiliza mais `m.portrait` como imagem de criatura.
- O cartão do combate e as miniaturas do tabuleiro usam a mesma função de miniatura por ID da criatura.
- As 10 miniaturas raster existentes foram preservadas. As outras 22 criaturas recebem arquivos SVG próprios e distintos, com silhuetas, pedestal e tratamento monocromático escultural; o Vharzun possui uma figura de dragão com asas, quatro patas, cauda e chifres, em vez do retrato genérico reutilizado.
- Os endereços das miniaturas recebem cache-buster `v3.0.4` para evitar que o navegador continue mostrando arquivos antigos.

## Compatibilidade
- Mantidos os 11 mapas oficiais, imagens, grade 10 × 8, portas, entradas, saídas e Pontos de Interesse.
- Mantidas as regras de movimento, diagonais, bases multicelulares, combate, campanhas e sincronização.
- Não há alteração no schema ou nas tabelas do Supabase; não requer nova migração SQL.
- Preserve `config.js` ao publicar.
