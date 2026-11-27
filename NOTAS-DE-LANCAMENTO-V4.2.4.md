# Notas de lançamento — Reino de Aethra v4.2.4

## Objetivo

Melhorar a apresentação das rolagens de dados e a organização da Central de Música, sem alterar as regras de combate, os valores das fichas ou os dados já gravados nas campanhas.

## Rolagens de dados

- O teste público de D20 agora apresenta um dado facetado com acabamento de metal escuro e detalhes dourados, inspirado na referência visual fornecida.
- A animação percorre a área da tela, gira em perspectiva e revela o resultado.
- O Rolador Universal exibe individualmente os dados escolhidos (D4, D6, D8, D10, D12 ou D20), mantendo a fórmula, as faces sorteadas e o total.
- Rolagens universais públicas apresentam a animação para os participantes conectados e continuam aparecendo na Linha do Tempo.
- Rolagens universais reservadas ao mestre permanecem locais ao dispositivo do mestre.
- A animação foi simplificada para usar principalmente `transform` e `opacity`, com menor desfoque, duração reduzida e suporte a `prefers-reduced-motion`.

## Central de Música

- O volume geral e os botões para adicionar arquivo, link direto de áudio e YouTube agora ficam agrupados na mesma faixa responsiva.
- A playlist passou a ocupar uma janela de altura estável, com rolagem interna independente e espaço para pelo menos três faixas.
- Foi adicionada a opção de incluir um vídeo do YouTube por URL. O player usa a API oficial de incorporação do YouTube e mantém a faixa integrada à playlist compartilhada.
- O controle de reprodução, faixa anterior/próxima, sincronização temporal e volume por dispositivo continuam integrados.
- A opção de link direto continua destinada a URLs HTTPS que apontem ao próprio arquivo de áudio.

## Compatibilidade e limites

- Não requer alteração nem nova execução de SQL no Supabase.
- Preserva a migration `supabase-migration-v4.2.1.sql` já utilizada pelas versões anteriores.
- O YouTube é reproduzido por vídeo incorporado, não por extração de áudio. O proprietário do vídeo precisa permitir incorporação; vídeos privados, removidos, restritos por região ou bloqueados para incorporação podem não tocar.
- Cada navegador pode exigir um clique em **Ativar música neste dispositivo** devido às políticas de reprodução automática.
- A playlist continua compartilhada no estado da campanha; a preferência de volume individual continua local a cada dispositivo.
- `config.js`, assets existentes e dados das campanhas devem ser preservados durante a publicação.

## Testes

- Sintaxe JavaScript (`node --check app.js`).
- Regressão completa das suítes existentes v4.1.x–v4.2.3.
- Testes v4.2.4 para animações, visibilidade pública/privada, redução de movimento, layout de música, parsing de URLs e integração da API do YouTube.
