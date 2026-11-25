# Reino de Aethra — Notas de lançamento v4.1.2

## Objetivo

A v4.1.2 é uma atualização incremental de interface, concentrada na consulta do Bestiário. O objetivo é eliminar o espaço vazio observado no pop-up, ampliar a área de leitura e deixar a ficha selecionada diretamente abaixo do catálogo de criaturas.

## Novidades

### 1. Janela ampliada do Bestiário

- O pop-up utiliza largura de até 96vw, limitado a 1440 px.
- A altura máxima passa a 96dvh, com rolagem vertical do próprio modal quando necessário.
- A ampliação afeta somente o Bestiário; os demais modais preservam o tamanho anterior.

### 2. Organização corrigida do conteúdo

- Barra de pesquisa, filtro e grade de criaturas agora são agrupados em um único painel.
- A grade ocupa toda a largura disponível e mantém uma área de rolagem própria.
- A ficha da criatura selecionada é posicionada abaixo da grade e ocupa a largura do pop-up.
- A ilustração e os dados da ficha são organizados em duas áreas dentro do painel; em telas estreitas, passam para uma coluna.
- No celular, os cartões da grade são apresentados em duas colunas.

### 3. Recursos preservados

- Seleção e pesquisa de criaturas.
- Filtro por tipo.
- Composição de encontro com até seis tipos de criatura.
- Salvar, reutilizar e excluir composições.
- Iniciar encontro individual ou encontro com a composição.
- Controle de mestre ativo e permissões existentes.

## Compatibilidade

- Atualização incremental sobre a v4.1.1.
- Não requer migração SQL.
- Não altera `config.js`, tabelas, RPCs, políticas RLS ou o formato dos dados da campanha.
- Preserva assets, mapas, miniaturas, retratos, livros, fichas, campanhas e sistemas de jogo.
- Atualiza as referências de versão/cache para 4.1.2.

## Limites da validação

As suítes locais de regressão da v4.1.0 e v4.1.1 e os novos testes estáticos de layout foram aprovados. A aparência final deve ser conferida no navegador após publicação; a integração real com GitHub Pages e Supabase depende do ambiente do proprietário.
