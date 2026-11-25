# Guia de atualização — Reino de Aethra v4.1.4

A v4.1.4 é incremental sobre a v4.1.3 e corrige a apresentação da seleção de criaturas no Bestiário.

## Arquivos que devem ser substituídos

Na raiz do projeto GitHub Pages, substitua somente:

- `index.html`
- `app.js`
- `styles.css`

O ZIP inclui documentação e testes locais. A pasta `tests/` é opcional para a publicação do site, mas pode ser mantida no repositório para futuras verificações.

## Arquivos que devem ser preservados

- `config.js` — contém a configuração de conexão do Supabase.
- Toda a pasta `assets/` — inclui miniaturas, mapas, retratos e artes coloridas de combate.
- Arquivos SQL, políticas RLS e configurações já existentes.
- Dados das campanhas, contas, fichas e participantes.

## Instalação

1. Faça backup do repositório e das campanhas importantes.
2. Extraia o ZIP na raiz do repositório.
3. Substitua `index.html`, `app.js` e `styles.css`.
4. Preserve todos os demais arquivos e pastas.
5. Faça commit e publique no GitHub Pages.
6. No computador, atualize com `Ctrl + F5`; no celular, feche a aba antiga e abra o site novamente.

## Supabase

**Não execute SQL.** Esta atualização altera apenas a interface do Bestiário e as chaves de cache. Não há alteração no modelo de dados da campanha.

## Conferência rápida

- Abra a Biblioteca ou a Central do Mestre e acesse o Bestiário.
- No desktop, confirme que a seleção aparece em uma coluna à esquerda e a ficha à direita.
- Confira que cada criatura aparece em um cartão quadrado, contendo somente a miniatura.
- Selecione uma criatura e confirme que o nome, atributos, habilidade e miniatura ampliada aparecem na ficha.
- Role a lista de miniaturas e confirme que a rolagem não movimenta a ficha.
- Se a ficha for mais longa que a área disponível, confirme que sua rolagem é independente.
- Em celular, confirme que a seleção fica acima da ficha e continua usando miniaturas quadradas.
- Teste pesquisa, filtro, adicionar/remover da composição, encontro individual e encontro composto.

## Reversão

Se houver algum problema visual, restaure `index.html`, `app.js` e `styles.css` da v4.1.3 pelo histórico do GitHub. Não reverta nem remova `config.js`, `assets/` ou dados do Supabase.
