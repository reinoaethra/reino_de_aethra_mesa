# Guia de atualização — Reino de Aethra v4.1.2

## Antes de começar

A v4.1.2 é incremental sobre a v4.1.1. Faça uma cópia dos arquivos publicados e, por segurança, exporte backup das campanhas importantes. A atualização altera apenas a interface do Bestiário e as referências de versão/cache; não substitui dados de campanha.

## Arquivos que devem ser substituídos

Na raiz do projeto GitHub Pages, substitua somente:

- `index.html`
- `app.js`
- `styles.css`

O ZIP inclui documentação e testes locais, que podem ficar fora da publicação.

## Arquivos que devem ser preservados

- `config.js` — contém a URL e a chave pública de conexão do Supabase.
- Toda a pasta `assets/` — mapas, miniaturas, retratos, artes de monstros e demais imagens.
- Arquivos SQL, configuração, livros, fichas, campanhas e demais dados já existentes.

## Supabase

**Não há migração SQL nesta versão.** Nenhuma tabela, coluna, RPC, política RLS ou estrutura de `game_state` é adicionada ou alterada pela v4.1.2.

## Publicação

1. Extraia o ZIP incremental.
2. Copie `index.html`, `app.js` e `styles.css` para a raiz do repositório, substituindo os anteriores.
3. Preserve todos os demais arquivos e pastas.
4. Faça commit e publique no GitHub Pages.
5. No computador, atualize com `Ctrl + F5`. No celular, feche a aba antiga e abra o site novamente.

## O que mudou no Bestiário

O modal agora usa até 96% da largura útil da janela (limitado a 1440 px) e até 96% da altura da tela. O painel de pesquisa e a grade de criaturas formam um único bloco; a ficha selecionada aparece abaixo desse bloco, ocupando a largura disponível. A grade tem rolagem interna para não alongar excessivamente o pop-up. Em telas estreitas, a ficha e os controles se reorganizam em uma coluna.

## Conferência rápida

- Abra **Biblioteca** ou a **Central do Mestre** e entre em **Bestiário e preparador de encontros**.
- Confirme que a janela ocupa mais espaço e que a barra de pesquisa e os cartões aparecem agrupados.
- Selecione algumas criaturas diferentes; confira se a arte, HP, Defesa, bônus de ataque, XP e habilidade aparecem imediatamente abaixo da grade.
- Como mestre, adicione/remova criaturas da composição, limpe a seleção, salve uma composição e inicie um encontro de teste.
- Repita a conferência em uma janela estreita ou celular: os cartões devem se reorganizar e a ficha deve permanecer abaixo deles.
- Confirme que diário, rolagens, sessão, mapas e combate continuam disponíveis.

## Testes locais

Com Node.js instalado, execute na pasta do pacote:

```bash
node --check app.js
node tests/v410-release-tests.cjs
node tests/v411-release-tests.cjs
node tests/v412-bestiary-layout-tests.cjs
```

Os testes locais confirmam a sintaxe, a regressão das funcionalidades anteriores e os seletores/estrutura de layout. Eles não substituem a validação visual no GitHub Pages nem o teste multiplayer no Supabase real.
