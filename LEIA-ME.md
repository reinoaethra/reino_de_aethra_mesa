# Reino de Aethra — atualização v4.2.6

## Novidade principal

A rolagem de D20 e o Rolador Universal agora usam dados poliédricos tridimensionais, com faces numeradas, material metálico, colisões físicas e orientação final correspondente ao resultado já calculado pelo jogo.

## Conteúdo específico da v4.2.6

- `assets/js/aethra-dice-3d.js`: módulo de modelos, renderização WebGL e física 3D.
- `preview-dados-3d.html`: laboratório independente para testar dados localmente, sem publicar resultados na campanha.
- `GUIA-DE-ATUALIZACAO-V4.2.6.md`: instalação passo a passo, requisitos e diagnóstico.
- `GUIA-DE-RECURSOS-V4.2.6.md`: comportamento do D20 e do Rolador Universal 3D.
- `NOTAS-DE-LANCAMENTO-V4.2.6.md`: resumo da versão.
- `CHECKLIST-PUBLICACAO-V4.2.6.md`: conferência pós-publicação.
- `THIRD-PARTY-NOTICES-V4.2.6.md`: bibliotecas externas e licenças.
- `tests/`: verificações de regressão e integração.

## Instalação resumida

1. Substitua `index.html`, `app.js` e `styles.css`.
2. Adicione `assets/js/aethra-dice-3d.js`.
3. Adicione `preview-dados-3d.html` se desejar usar a página de pré-visualização.
4. Preserve `config.js` e todas as demais pastas existentes em `assets/`.
5. Publique no GitHub Pages e faça recarga forçada com `Ctrl + F5`.

## Requisitos

- Navegador com WebGL 2.
- Acesso à internet para carregar Three.js e Rapier do CDN `esm.sh` na primeira rolagem.
- Não requer Node.js, Supabase CLI, Docker ou migração SQL.

A versão mantém os recursos da v4.2.5, incluindo exclusão de conta. Não execute novamente migrations antigas apenas por causa da v4.2.6. Se ainda não configurou a exclusão de conta da v4.2.5, consulte o guia dessa versão e mantenha a Edge Function existente.

## Página de teste

Depois de publicar, acesse `preview-dados-3d.html` no mesmo domínio do GitHub Pages para testar D4, D6, D8, D10, D12 e D20 sem iniciar uma campanha. Os resultados de demonstração são locais e não são salvos no Supabase.
