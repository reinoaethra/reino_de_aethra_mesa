# Guia de atualização — Reino de Aethra v3.0.2

## O que esta versão adiciona

- Os 11 mapas táticos configurados pelo mestre, com suas imagens incorporadas ao tabuleiro.
- Casas bloqueadas escurecidas, sem desenhos artificiais de terreno.
- Movimento horizontal, vertical e diagonal com regra para impedir corte de cantos.

## Instalação

1. Baixe e extraia `reino-de-aethra-v3.0.2.zip`.
2. Envie o conteúdo da pasta `reino-de-aethra/` para o repositório usado pelo GitHub Pages, substituindo os arquivos antigos.
3. Mantenha a pasta `assets/maps/` inteira; ela contém o mapa de dados e as 11 imagens de fundo WebP.
4. Preserve o arquivo `config.js` do seu site. Não substitua a configuração atual do Supabase.
5. Não é necessária migração SQL para a v3.0.2.
6. Atualize o navegador com recarga forçada (Ctrl+F5 no computador). No celular, recarregue a página ou feche e abra a aba.

## Teste recomendado

- Abra uma campanha e alterne pelos onze mapas.
- Confirme que cada mapa mostra sua própria imagem de fundo, sem símbolos artificiais de piso/parede/árvore/água.
- Verifique que uma casa bloqueada está escura e não aceita miniaturas.
- Mova uma peça uma casa na diagonal: deve contar como uma casa.
- Tente mover diagonalmente junto a duas casas laterais bloqueadas: o caminho deve ser recusado ou contornar o obstáculo.
- Teste uma porta fechada e depois aberta.
- Peça a um jogador remoto para mover na diagonal; confirme a solicitação pelo mestre.

A validação local dos arquivos e dos algoritmos foi concluída. O teste do multiplayer real deve ser feito no seu projeto Supabase publicado.
