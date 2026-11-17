# Guia das miniaturas articuladas — v1.1

## O que mudou

Na versão 1.1, as peças dos aventureiros no mapa tático deixaram de depender exclusivamente de um retrato recortado. Agora, cada peça de jogador é desenhada como um personagem vetorial de corpo inteiro, com cabeça, tronco, braços, pernas, capa, arma e sombra em elementos separados.

Isso permite animar partes diferentes do corpo em ritmos próprios: braços e pernas alternam posições, o tronco oscila levemente e a arma acompanha a postura. Quando um encontro está ativo, a miniatura assume uma postura de combate.

## Classes contempladas

- Guerreiro — aço e couro em tons azulados.
- Arcano — túnica violeta e azul.
- Patrulheiro — couro e verde-floresta.
- Paladino — armadura dourada e capa clara.
- Assassino — traje escuro.
- Clérigo — vestes claras e douradas.
- Druida — verdes e tons naturais.
- Invocador — violeta e ameixa.

## Onde aparecem

As miniaturas articuladas aparecem nas peças dos aventureiros no mapa tático. Os retratos WebP continuam sendo usados nas fichas, seleção de classe, inventário, lista de participantes, NPCs e cartões de criaturas.

## Movimento reduzido

O sistema respeita a configuração de acessibilidade `prefers-reduced-motion`. Se o sistema operacional ou navegador indicar preferência por movimento reduzido, as animações das miniaturas são desativadas.

## Limitações honestas desta etapa

As miniaturas são ilustrações vetoriais estilizadas animadas por CSS. Não são modelos 3D, captura de movimento, esqueletos 2D de um motor de animação nem spritesheets desenhadas quadro a quadro. O mapa usa uma escala pequena, então os detalhes são simplificados para permanecer legíveis.

## Atualização

Não é necessário alterar o Supabase, executar SQL ou modificar `config.js`. Basta substituir os arquivos do site pela versão 1.1 no GitHub, mantendo a configuração própria do projeto. Consulte o README e o guia do GitHub Pages para o procedimento completo.
