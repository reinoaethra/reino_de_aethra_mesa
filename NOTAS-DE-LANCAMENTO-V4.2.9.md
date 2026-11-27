# Notas de lançamento — Reino de Aethra v4.2.9

## Correção global: estabilidade das janelas modais

A revisão amplia a correção inicialmente aplicada ao Comércio e à Forja para todas as janelas modais personalizadas do `#modal-root`.

- Toda atribuição a `modalRoot.innerHTML` passa por um reconciliador comum.
- Se a janela aberta continuar sendo a mesma, o backdrop e o elemento `.modal` permanecem montados; as animações `fadeIn` e `rise` não reiniciam a cada atualização.
- Se o conteúdo renderizado for idêntico, não há substituição de DOM.
- Se os dados mudarem, somente o conteúdo interno do diálogo é atualizado.
- Valores digitados ainda não enviados, campos com foco, seleção de texto e rolagem são restaurados quando o campo correspondente continua disponível.
- Campos de arquivo selecionados são preservados quando o mesmo controle continua presente.
- Comércio e Forja usam o reconciliador global, sem implementação especial separada.

## Janelas cobertas

Configurações e conta; criar/entrar em campanha; criação/edição de personagem; Biblioteca; Bestiário; NPCs e pontos de interesse; inventário; Central do Mestre; jornada e diário; solicitação de D20 e Rolador Universal; árvore de habilidades; condições e ataque em área; pontos de restauração; notificações; encerramento de sessão; formulários de narração/dano; música e YouTube; comércio e forja.

As animações temporárias dos dados, os toasts e as caixas `confirm` nativas do navegador continuam como componentes separados do `#modal-root`.

## Compatibilidade

- Mantém os recursos da v4.2.8 e as correções de comércio/forja da v4.2.9.
- Preserva campanhas, personagens, inventários, pedidos e arquivos existentes.
- Atualiza a referência de cache de `app.js` e `styles.css`, mantendo a identificação da versão em 4.2.9.
- Não requer migração SQL nem alterações em Edge Functions.

## Verificação

- Sintaxe JavaScript validada.
- 24 suítes de teste `.cjs` passaram, incluindo teste dedicado ao mecanismo global de modais.
- A revisão de código confirma que todas as atribuições `modalRoot.innerHTML` são interceptadas pelo reconciliador comum.
- A verificação visual final deve ser feita no navegador utilizado na campanha.
