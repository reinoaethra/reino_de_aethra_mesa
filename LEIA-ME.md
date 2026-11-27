# Reino de Aethra — atualização v4.2.7

## O que muda

A v4.2.7 corrige a rolagem 3D para uma visão superior de mesa, alinha o colisor à superfície visível e calcula a altura de apoio pelo formato/orientação real de cada poliedro. Também corrige o envio do formulário de exclusão de conta: na versão anterior, o listener não chamava a função segura de exclusão.

## Instalação resumida

1. Substitua `index.html`, `app.js` e `styles.css`.
2. Adicione/substitua `assets/js/aethra-dice-3d.js`.
3. Substitua `preview-dados-3d.html` se quiser usar a página independente de teste.
4. Preserve `config.js` e todas as demais pastas em `assets/`.
5. Publique no GitHub Pages e faça recarga forçada com `Ctrl + F5`.

## Exclusão de conta

Não há SQL novo na v4.2.7. A opção depende da Edge Function `delete-account` e da migração SQL v4.2.5 já configuradas. O guia explica como testar com uma conta descartável.

## Requisitos dos dados 3D

- Navegador com WebGL 2.
- Acesso à internet para carregar Three.js e Rapier pelo CDN `esm.sh`.
- Não requer Node.js, Supabase CLI, Docker ou nova migração SQL.

## Documentação

Consulte `GUIA-DE-ATUALIZACAO-V4.2.7.md`, `GUIA-DE-RECURSOS-V4.2.7.md`, `NOTAS-DE-LANCAMENTO-V4.2.7.md` e `CHECKLIST-PUBLICACAO-V4.2.7.md`.

A página `preview-dados-3d.html` testa localmente D4, D6, D8, D10, D12 e D20 sem registrar eventos na campanha.
