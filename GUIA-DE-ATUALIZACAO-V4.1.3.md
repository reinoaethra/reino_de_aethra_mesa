# Guia de atualização — Reino de Aethra v4.1.3

A v4.1.3 é incremental sobre a v4.1.2 e corrige a disposição e a imagem do Bestiário.

## Arquivos que devem ser substituídos

Na raiz do projeto GitHub Pages, substitua somente:

- `index.html`
- `app.js`
- `styles.css`

O ZIP inclui documentação e testes locais opcionais. A pasta `tests/` pode ser mantida no repositório ou guardada fora da publicação.

## Arquivos que devem ser preservados

- `config.js` — contém a configuração de conexão do Supabase.
- Toda a pasta `assets/` — inclui miniaturas, mapas, retratos e artes coloridas de combate.
- Arquivos SQL, políticas RLS e configurações já existentes.
- Dados de campanhas, contas e participantes.

## Instalação

1. Faça backup do repositório e das campanhas importantes.
2. Extraia o ZIP na raiz do repositório.
3. Substitua `index.html`, `app.js` e `styles.css`.
4. Preserve todos os demais arquivos e pastas.
5. Faça commit e publique no GitHub Pages.
6. No computador, atualize com `Ctrl + F5`; no celular, feche a aba e abra novamente.

## Supabase

**Não execute SQL.** Esta atualização altera apenas a interface do Bestiário e as chaves de cache. Não há alteração no modelo de dados da campanha.

## Conferência rápida

- Abra a Biblioteca ou Central do Mestre e entre no Bestiário.
- Confirme que os 32 monstros aparecem em uma lista vertical à esquerda.
- Confirme que o nome completo, tipo, nível, HP e Defesa aparecem na opção de seleção.
- Selecione vários monstros e confira que a miniatura aparece à direita, sem ser cortada e sem ocupar o quadro apenas com o fundo de uma arte panorâmica.
- Pesquise por nome e filtre por tipo.
- Adicione/remova uma criatura da composição.
- Inicie um encontro individual e um encontro composto de teste.
- Confira a disposição em uma tela estreita; a lista deve ficar acima da ficha quando não houver espaço para duas colunas.

## Reversão

Se houver algum problema visual, restaure `index.html`, `app.js` e `styles.css` da v4.1.2 pelo histórico do GitHub. Não reverta nem remova `config.js`, `assets/` ou dados do Supabase.
