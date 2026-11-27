# Guia de recursos e correções — Reino de Aethra v4.2.7

## Rolagem 3D vista de cima

- A câmera usa projeção ortográfica diretamente sobre o tampo, como uma mesa de dados vista pelo jogador.
- A orientação final alinha a face do resultado com a câmera, para que o número seja lido na tela.
- O tampo visível tem espessura de 0,30 unidade e topo em Y = -0,15; o colisor fixo usa o mesmo centro e meia-altura, portanto sua superfície superior coincide com o tampo renderizado.
- A altura de apoio é calculada a partir do vértice mais baixo de cada modelo depois da rotação. Isso considera a geometria de cada poliedro em vez de usar uma altura fixa para todos.
- Os corpos usam CCD, coeficientes de fricção/restituição revistos e passos físicos fixos de 1/60 s. A animação espera vários passos consecutivos de baixa velocidade ou sono físico antes da acomodação final, com limite máximo de segurança.
- A física apresenta a rolagem; o resultado do D20 ou do Rolador Universal continua sendo calculado pelo sistema antes da animação. Assim, uma animação não altera o valor publicado.

O CCD do Rapier é um recurso contra *tunneling*: ele verifica o movimento de corpos rápidos para que não atravessem outros colisores entre passos da simulação. <https://www.rapier.rs/docs/user_guides/javascript/rigid_bodies/>

## Correção da exclusão de conta

Na v4.2.6, o modal `account-delete-form` era renderizado, porém o listener global de envio não possuía um ramo que chamasse `deletePermanentAccount()`. A v4.2.7 adiciona esse tratamento.

O envio transmite e-mail, senha e frase de confirmação para a Edge Function já publicada. A interface exige `success: true` antes de limpar o contexto local, encerrar a sessão antiga e tentar iniciar uma sessão visitante. Erros permanecem visíveis e não simulam uma exclusão concluída.

A função continua a exigir a Edge Function `delete-account` e a migração SQL da v4.2.5. Não existe SQL novo nesta versão.
