# Reino de Aethra — v3.0.3

## Objetivo

Corrigir a ausência da imagem de fundo observada no mapa tático publicado, garantir que o jogo leia exclusivamente o conjunto de mapas preparado pelo mestre, disponibilizar miniaturas individuais para todo o catálogo de criaturas e acrescentar gestão de campanhas.

## Mapas oficiais

- Os 11 mapas e suas configurações foram importados novamente do ZIP multimapas enviado pelo mestre.
- `assets/maps/maps-data.js` é agora a única biblioteca carregada pelo jogo.
- As 11 imagens estão em `assets/maps-v3/`, em WebP otimizado.
- A tabela antiga de mapas e o catálogo estático antigo de portas/Pontos de Interesse foram removidos do `app.js` como fallback.
- O URL da imagem de cada mapa é resolvido a partir do endereço do site (`document.baseURI`), para funcionar corretamente em projetos GitHub Pages publicados dentro de subpastas.
- As casas caminháveis mostram a própria arte do fundo. As casas bloqueadas recebem apenas uma camada escura, sem desenhos artificiais de terreno.
- A configuração mantém a grade 10×8, as coordenadas, portas, entradas, saídas e Pontos de Interesse definidos pelo mestre.

## Miniaturas de criaturas

- Foram incluídos arquivos individuais para as 32 formas do bestiário/bosses usados pelo sistema.
- Nove criaturas receberam estátuas em resina cinza com base redonda.
- Outras 22 criaturas e chefes receberam miniaturas SVG próprias, cada uma com silhueta específica, pedestal redondo e acabamento monocromático.
- O goblin mantém sua miniatura PNG original. No total, as 32 formas do catálogo têm um asset individual.
- Os modelos dos aventureiros e as bases multicelulares dos chefes foram preservados.

## Campanhas e participantes

- Somente o usuário criador da campanha, que também tem papel de mestre, pode excluí-la.
- A função de entrada na campanha foi atualizada para restaurar a última ficha arquivada quando um jogador retorna pelo código.
- A exclusão remove os dados vinculados por `ON DELETE CASCADE` (participantes, eventos e registros de XP).
- O mestre pode remover participantes com papel de jogador; a conta do mestre não pode ser removida por essa ação.
- Jogadores podem sair voluntariamente da campanha. A ficha é preservada no histórico e restaurada automaticamente se o mesmo usuário entrar novamente pelo código da campanha.
- Quando removido ou quando a campanha é excluída, o cliente do participante é encaminhado de volta à lista de campanhas.
- As operações sensíveis são realizadas por funções `SECURITY DEFINER` que validam o usuário autenticado no servidor, não apenas por botões escondidos na interface.

## Instalação

Para um projeto Supabase já existente, execute uma única vez `supabase-migration-v3.0.3.sql` no SQL Editor. Para uma instalação nova, use o `supabase-schema.sql` que acompanha este pacote.

Preserve o `config.js` que já está publicado. Substitua os demais arquivos pelo conteúdo desta versão, mantendo integralmente `assets/maps/`, `assets/maps-v3/` e `assets/minis/`.

## Validação

A versão foi validada com testes locais de sintaxe, integridade das 11 configurações e imagens, presença de miniatura para todas as formas do bestiário, movimentação diagonal já existente e contratos das funções de gestão de campanha. Ainda é necessário executar a migração no Supabase do projeto publicado e realizar o teste multiusuário real após a publicação.
