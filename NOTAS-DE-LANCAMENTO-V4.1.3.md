# Reino de Aethra — Notas de lançamento v4.1.3

## Objetivo

Corrigir a experiência de consulta ao Bestiário após o rearranjo da v4.1.2. A seleção dos monstros passa a ficar em uma lista vertical à esquerda; ao selecionar uma criatura, sua miniatura, nome, atributos e habilidade aparecem em um painel amplo à direita.

## Alterações

- Lista vertical de criaturas, com miniatura pequena, nome completo, tipo, nível, HP e Defesa.
- Pesquisa e filtro permanecem no topo da coluna de seleção.
- Indicador de seleção mais claro.
- Ação de adicionar/remover da composição junto ao monstro na lista.
- Painel de detalhes à direita com miniatura raster de `assets/minis/monsters/`, ampliada com `object-fit: contain`.
- Remoção da arte panorâmica colorida do quadro de detalhes do Bestiário. As artes coloridas do combate permanecem inalteradas.
- Primeiro monstro selecionado automaticamente ao abrir o Bestiário.
- Ajustes responsivos: em telas menores, a lista passa acima da ficha para evitar colunas estreitas.
- Atualização das chaves de cache para v4.1.3.

## Compatibilidade

- Mantém as 32 criaturas e os respectivos dados mecânicos.
- Mantém composições, encontros salvos e limite de seis tipos por composição.
- Mantém as permissões do mestre e as ações de iniciar encontro individual ou composto.
- Mantém `config.js`, assets, fichas, campanhas, missões e dados já salvos.
- Não requer migração SQL.

## Validação

As suítes de regressão v4.1.0 e v4.1.1 e os novos testes de layout v4.1.3 são executados localmente. A publicação ainda deve ser conferida no GitHub Pages real, em computador e celular.
