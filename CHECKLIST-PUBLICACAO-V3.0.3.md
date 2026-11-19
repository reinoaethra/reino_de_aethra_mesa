# Checklist de publicação — v3.0.3

## Arquivos
- [ ] Preservar o `config.js` atual.
- [ ] Substituir os demais arquivos pelos da v3.0.3.
- [ ] Publicar `assets/maps/maps-data.js`.
- [ ] Publicar as 11 imagens de `assets/maps-v3/`.
- [ ] Publicar todos os arquivos de `assets/minis/`, incluindo a subpasta `monsters/`.
- [ ] Confirmar que GitHub Pages publicou a nova versão e que o navegador não está mostrando cache antigo.

## Supabase
- [ ] Executar `supabase-migration-v3.0.3.sql` uma única vez em instalações existentes.
- [ ] Não executar a migração separada se `supabase-schema.sql` atualizado já foi usado para uma instalação nova.

## Permissões
- [ ] Mestre criador vê e executa **Excluir campanha**.
- [ ] Jogador não vê/ não consegue executar **Excluir campanha**.
- [ ] Mestre consegue remover somente participantes jogadores.
- [ ] Jogador consegue sair da própria campanha.
- [ ] Mestre não consegue sair usando a ação de jogador.
- [ ] Jogador removido volta à lista de campanhas e não mantém acesso à sala.

## Mapas e miniaturas
- [ ] Os 11 mapas carregam a imagem correta.
- [ ] Não aparecem fundos de versões antigas.
- [ ] As casas bloqueadas são escurecidas sem ícones de muro/árvore/água/piso.
- [ ] Portas, entradas, saídas e Pontos de Interesse continuam interativos.
- [ ] O bestiário mostra miniaturas próprias para as criaturas e chefes.
- [ ] Testar movimentação diagonal, inclusive junto a paredes e portas fechadas.
