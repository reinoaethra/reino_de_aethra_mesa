# Guia de Miniaturas de Mesa — v2.12

## Direção visual

As peças de Aethra são estátuas de fantasia em miniatura, inspiradas em figuras de resina de RPG de mesa. Permanecem estáticas: não há animação de marcha, ataque ou mudança de postura nesta versão. O cenário continua sendo uma ilustração 2D contínua; as estátuas são peças independentes, sobrepostas ao mapa.

## Identificação por base

- **Aventureiros:** base com aro azul.
- **Criaturas comuns:** base com aro vermelho.
- **Criaturas de elite:** base com aro violeta.
- **Chefes:** base com aro dourado e marca de coroa na lista de peças.

O aro é uma camada do jogo e não altera a escultura monocromática da estátua.

## Aventureiros

As oito classes jogáveis mantêm miniaturas individuais em PNG transparente, renderizadas a partir das referências STL fornecidas:

| Classe | Arquivo |
|---|---|
| Guerreiro | `assets/minis/warrior.png` |
| Arcano | `assets/minis/arcane.png` |
| Patrulheiro | `assets/minis/ranger.png` |
| Paladino | `assets/minis/paladin.png` |
| Assassino | `assets/minis/assassin.png` |
| Clérigo | `assets/minis/cleric.png` |
| Druida | `assets/minis/druid.png` |
| Invocador | `assets/minis/summoner.png` |

Os STL originais não são carregados pelo navegador nem incluídos no pacote publicado. As imagens leves são preparadas previamente para que o jogo possa funcionar em computadores e celulares sem renderização 3D em tempo real.

## Equipamentos visíveis nas estátuas

Arma, armadura e escudo equipados são apresentados como detalhes escultóricos sobre a miniatura:

- **Arma:** pequena peça metálica posicionada junto à mão do aventureiro. O desenho acompanha o tipo reconhecido pelo nome do item (espada, arco/besta, cajado, machado, martelo ou adaga).
- **Armadura:** placa peitoral e brasão sobre o torso.
- **Escudo:** peça de escudo junto ao braço.
- A cor de acabamento acompanha a raridade do item: comum, incomum, raro, épico, lendário ou mítico.

Esses detalhes são sobreposições 2D; ainda não modificam a malha STL nem o arquivo PNG original. Os atributos mecânicos continuam sendo calculados pelo equipamento salvo em `partyState`.

## Criaturas e famílias de monstros

O Goblin das Cinzas mantém sua miniatura escultórica em `assets/minis/monster-goblin.png`. As outras famílias recebem silhuetas vetoriais próprias em estilo de estátua monocromática, com sombreamento e o aro correspondente à equipe. Entre as famílias representadas estão feras, aracnídeos, mortos-vivos, construtos, criaturas elementais, cultistas, dragões menores e criaturas marítimas.

As formas estão vinculadas ao identificador do Bestiário em `mapMonsterSprite()`. O uso do identificador evita que criaturas diferentes acabem exibindo sempre o mesmo monstro genérico.

## Bases com ocupação ampliada

A base de uma criatura pode reservar mais de uma casa do tabuleiro. As dimensões são largura × altura, contadas em casas:

| Criatura | Base |
|---|---:|
| Personagens jogáveis e criaturas comuns | 1×1 |
| Golem de Basalto, Draco Niveriano e criaturas grandes indicadas no código | 2×1 ou 2×2 |
| Drakthar, Malgor, Quimera Carmesim, Rainha de Cristal e outros chefes regionais | 2×2 |
| Vharzun e Devorador das Marés | 3×2 |
| Titã Primordial e Colosso da Umbra | 3×3 |

A dimensão específica é definida por identificador em `BOSS_FOOTPRINTS` e `LARGE_CREATURE_FOOTPRINTS` no `app.js`.

### Regras de posicionamento

1. O mestre escolhe as criaturas no Bestiário e inicia o encontro.
2. O sistema procura uma área contínua que comporte toda a base, sem árvores, água, rochas, paredes, portas fechadas ou outras peças.
3. Se não houver espaço para a base inteira, o encontro informa o nome da criatura e o tamanho necessário; o mestre deve escolher outro mapa ou reduzir o grupo.
4. Todas as casas ocupadas pela base ficam reservadas, não apenas a casa de origem.
5. O caminho de movimento é calculado considerando a largura e altura completas da base.
6. Um chefe não pode atravessar ou terminar o movimento sobre aventureiros, monstros, obstáculos ou fora dos limites do tabuleiro.
7. A peça é selecionada e arrastada como uma única estátua. A posição registrada é o canto superior esquerdo da base.

## Limitações desta versão

- As estátuas são imagens estáticas; não há posturas alternativas ou animações.
- O visual de equipamento é uma sobreposição 2D, não uma remodelagem da escultura.
- O tamanho da base e a ocupação de casas são considerados no posicionamento e no caminho. Alcance de ataque, linha de visão e áreas de efeito ainda não usam o contorno completo da base.
- Rotação de peças, miniaturas 3D interativas e exportação para STL próprio não fazem parte desta versão.

## Instalação

Substitua os arquivos do site pelos arquivos da v2.12 e preserve `config.js`. Não é necessária migração SQL: as dimensões das bases são derivadas dos identificadores das criaturas e não alteram o schema do Supabase.
