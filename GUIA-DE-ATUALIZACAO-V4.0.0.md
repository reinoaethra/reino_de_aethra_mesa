# Guia de atualização — Reino de Aethra v4.0.0

## Antes de começar

1. Confirme que o site está na v3.0.6.
2. Exporte um backup de cada campanha importante pela Central do Mestre (se a campanha já estiver na v4, use a mesma ferramenta nas próximas versões).
3. Baixe e extraia o pacote incremental v4.0.0.

## Arquivos incluídos no ZIP

- `index.html`
- `app.js`
- `styles.css`
- Documentação v4.0.0
- `tests/v400-release-tests.cjs` (teste local opcional; não precisa ser publicado no site)

O ZIP não inclui `config.js`, mapas, miniaturas, imagens de monstros, livros, assets de cenário ou outros arquivos estáticos.

## Instalação no GitHub Pages

1. Na raiz do repositório, substitua `index.html`, `app.js` e `styles.css` pelos arquivos do ZIP.
2. Preserve o `config.js` existente, sem editar ou substituir.
3. Preserve integralmente `assets/`, incluindo `assets/maps/`, `assets/maps-v3/`, `assets/minis/`, `assets/monster-art/` e os cenários.
4. Não exclua os arquivos SQL antigos. Não é necessário executar uma nova migração SQL para a v4.0.0.
5. Faça commit e aguarde a publicação do GitHub Pages.
6. No computador, atualize com `Ctrl + F5`; em celulares, feche a aba antiga e abra o site novamente.

## Compatibilidade de campanha

Os recursos novos são acrescentados ao JSON de estado já existente da campanha. Quando o campo `v4` não existe, o aplicativo cria os padrões ao abrir/salvar o estado. A árvore usa o RPC de salvamento de ficha já existente. A edição não requer alteração manual de tabelas, colunas, políticas RLS ou funções Supabase.

## Voltar atrás

Se ocorrer um problema, restaure os três arquivos web anteriores (v3.0.6) do seu histórico do GitHub. Não reverta `config.js`, mapas, miniaturas ou imagens. Antes de restaurar o estado de uma campanha, exporte um backup atual e confirme que está na campanha correta.
