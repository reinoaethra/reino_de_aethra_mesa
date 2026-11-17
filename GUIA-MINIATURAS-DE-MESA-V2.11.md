# Guia de Miniaturas de Mesa — v2.11

## Objetivo visual

As peças do Mapa Tático devem lembrar miniaturas de RPG de mesa apoiadas em bases individuais, posicionadas sobre o cenário ilustrado contínuo. O tabuleiro continua sendo 2D: as miniaturas são imagens transparentes em perspectiva inclinada, e a grade permanece como camada de posicionamento.

## Identificação das peças

- **Aventureiros:** base com aro azul. Cada uma das oito classes jogáveis possui uma miniatura própria.
- **Criaturas comuns:** aro vermelho e silhueta própria de acordo com o tipo de criatura.
- **Criaturas de elite:** aro violeta e tamanho ligeiramente maior.
- **Chefes:** aro dourado, tamanho visual maior e marca de coroa na lista de peças.

## Miniaturas das classes

| Classe | Arquivo da miniatura | Referência visual utilizada |
|---|---|---|
| Guerreiro | `assets/minis/warrior.png` | Guerreiro anão com arma pesada |
| Arcano | `assets/minis/arcane.png` | Mago elfo com cajado |
| Patrulheiro | `assets/minis/ranger.png` | Aventureiro com besta |
| Paladino | `assets/minis/paladin.png` | Guerreiro com espada e armadura |
| Assassino | `assets/minis/assassin.png` | Combatente ágil com lâminas |
| Clérigo | `assets/minis/cleric.png` | Portador de lanterna e vestes |
| Druida | `assets/minis/druid.png` | Conjurador com cajado e manto |
| Invocador | `assets/minis/summoner.png` | Espadachim tiefling como referência de silhueta fantástica |

As imagens das classes foram renderizadas localmente a partir de STL enviados pelo usuário e convertidas em PNG transparente. Os STL originais não são carregados pelo navegador nem distribuídos dentro do ZIP. Os arquivos `npc-elder.png` e `warrior-axe.png` ficam disponíveis como referências visuais adicionais para futuras peças de NPCs e variações de classe.

## Monstros e chefes

- `assets/minis/monster-goblin.png` contém a miniatura escultórica do Goblin das Cinzas.
- As demais criaturas utilizam silhuetas SVG próprias já definidas no `app.js`, agora com preenchimento sombreado e aro de miniatura.
- Chefes conhecidos (Drakthar, Vharzun, Malgor, Quimera Carmesim, Titã Primordial, Rainha de Cristal, Devorador das Marés, Arconte do Sol Partido e Colosso da Umbra) têm silhuetas específicas e são identificados por aro dourado.
- Criaturas de ameaça lendária/épica que não são chefes recebem aro violeta.

## Movimento e comportamento

As miniaturas continuam obedecendo ao sistema do mapa:

1. Cada peça ocupa uma casa do tabuleiro.
2. O mestre pode selecionar e mover qualquer peça.
3. O jogador pode mover a própria peça conforme as permissões da campanha.
4. Casas bloqueadas, portas fechadas, névoa, ocupação e limite de movimento continuam sendo validados pelo sistema existente.
5. Uma miniatura derrotada permanece visualmente desativada na lista e não é exibida no tabuleiro.

## Limitação desta edição

O tamanho visual dos chefes é ampliado para comunicar sua importância, mas a ocupação lógica permanece de uma casa. A ocupação de múltiplas casas, rotação de miniaturas, estados de postura, animações e modelos 3D interativos ficam para uma etapa posterior. O sistema não carrega os STL originais no navegador: usa imagens PNG preparadas previamente para manter o site leve.

## Instalação

Substitua os arquivos do site pelos arquivos da v2.11 e preserve `config.js`. Não é necessária migração SQL.
