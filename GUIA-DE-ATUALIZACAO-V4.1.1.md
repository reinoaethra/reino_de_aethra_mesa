# Guia de atualização — Reino de Aethra v4.1.1

## Antes de começar

A v4.1.1 é incremental sobre a v4.1.0. Faça uma cópia da versão publicada antes de substituir arquivos. Não exclua mapas, imagens, miniaturas, personagens ou campanhas.

## Arquivos que devem ser substituídos

Na raiz do projeto GitHub Pages, substitua somente:

- `index.html`
- `app.js`
- `styles.css`

O ZIP também inclui documentação e testes locais; eles podem ser guardados fora da publicação se preferir.

## Arquivos que devem ser preservados

- `config.js` — contém a URL e a chave pública de conexão do seu Supabase.
- Toda a pasta `assets/` — mapas, miniaturas, retratos, artes de monstros e demais imagens.
- Arquivos SQL e configuração já existentes no repositório.

## Supabase

**Não há migração SQL nesta versão.** As novas informações de revisão e histórico reversível ficam no campo `game_state` que já é utilizado pela campanha. Notificações são montadas a partir de eventos da campanha existentes; a marcação de leitura fica apenas no navegador.

## Publicação

1. Extraia o ZIP incremental.
2. Copie `index.html`, `app.js` e `styles.css` para a raiz do projeto, substituindo os anteriores.
3. Preserve todos os demais arquivos e pastas.
4. Faça commit e publique no GitHub Pages.
5. No computador, atualize com `Ctrl + F5`. No celular, feche a aba antiga e abra o site novamente.

## Conferência rápida

- Entre em uma campanha como mestre e confirme que o painel de conexão aparece.
- Abra a mesma campanha em um segundo dispositivo e confira a presença.
- Desconecte e restaure a internet; aguarde a reconexão automática ou use o botão manual.
- Faça uma alteração simples no estado do jogo e confira se o mestre vê a opção de desfazer.
- Faça um jogador entrar na campanha e confira a notificação.
- Durante um encontro, avance a iniciativa e confira o resumo do turno.
- Encerre uma sessão de teste, revise o resumo e confirme que o estado foi pausado sem perder fichas ou progresso.

## Limites conhecidos

Os testes entregues são testes locais de código e regras. Eles não substituem a validação no GitHub Pages com a URL, as políticas RLS e o projeto Supabase reais. A marcação de notificações lidas é por dispositivo. O desfazer cobre apenas a última alteração de estado elegível do mestre atual; não apaga eventos imutáveis nem modifica contas ou participantes.
