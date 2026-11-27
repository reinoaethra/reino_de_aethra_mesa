# Guia de recursos — estabilidade global de janelas v4.2.9

## O que muda

As janelas modais personalizadas do Reino de Aethra passam a compartilhar um único mecanismo de atualização. O objetivo é impedir que eventos Realtime, recarregamentos de estado ou atualizações de fila remontem a janela inteira e reiniciem a animação de abertura.

## Como se comporta

1. Ao abrir um diálogo, o fundo escurecido e a caixa são montados e executam sua animação normal de entrada.
2. Durante a permanência da mesma janela, o sistema identifica sua identidade.
3. Se uma atualização não mudar o conteúdo, o DOM permanece intocado.
4. Se uma atualização mudar o conteúdo, apenas o interior é atualizado; o fundo e a caixa permanecem.
5. O mecanismo tenta preservar os campos ainda não enviados, foco, seleção de texto, arquivos e posição de rolagem.
6. Ao fechar a janela, o contêiner é limpo normalmente. Uma janela diferente recebe uma nova animação de entrada.

## Onde se aplica

Todas as janelas personalizadas montadas no `#modal-root`: conta, configurações, campanha, personagem, biblioteca, Bestiário, NPCs, inventário, Central do Mestre, jornada, dados, habilidades, condições, música, comércio, forja e formulários auxiliares.

Não se aplica aos efeitos temporários dos dados 3D, toasts ou caixas nativas `confirm` do navegador, que possuem ciclo de vida independente.

## O que permanece igual

Não há mudanças nas regras de combate, progressão, compras, vendas, forja, morte/ressurreição ou permissões. A v4.2.9 é uma correção de ciclo de vida visual e preservação de interação das janelas.
