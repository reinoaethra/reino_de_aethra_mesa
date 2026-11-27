# Notas de lançamento — Reino de Aethra v4.2.3

## Objetivo

Adicionar o Rolador Universal de Dados à Central do Mestre, sem alterar o fluxo de combate ou os testes inteligentes de D20 que já funcionam automaticamente.

## Novidades

- Rolador universal com D4, D6, D8, D10, D12 e D20.
- Quantidade configurável de 1 a 20 dados por rolagem.
- Bônus e penalidades numéricos somados ao resultado.
- Identificação da finalidade da rolagem.
- Visibilidade pública ou reservada ao mestre.
- Rolagens públicas registradas na Linha do Tempo da campanha.
- Rolagens reservadas armazenadas localmente no navegador do mestre, sem publicação no Supabase ou exposição aos jogadores.
- Histórico local das últimas rolagens reservadas neste dispositivo.
- Opção para aplicar manualmente o total como dano ou cura a um aventureiro ou a uma criatura ativa.
- Aplicações manuais atualizam o HP e são registradas na Linha do Tempo. A derrota de uma criatura ativa mantém o fluxo existente de recompensas.
- Acesso pelo painel Central do Mestre e pelas ações rápidas da sessão.
- Orientações acrescentadas ao Livro do Mestre disponível na biblioteca do site.

## Compatibilidade

- Preserva as campanhas, fichas, missões, mapas, músicas, bestiário e dados existentes.
- Utiliza o evento `session_note` já autorizado para o mestre; nenhum novo tipo de evento é criado.
- Não altera tabelas, funções, políticas, buckets ou dados do Supabase.
- Não exige migration SQL.

## Observações sobre privacidade

- Uma rolagem pública aparece para os participantes e no histórico compartilhado da campanha.
- Uma rolagem reservada fica apenas no armazenamento local deste navegador e desta conta. Não é sincronizada com outro computador ou celular, não entra no backup da campanha e não aparece na Linha do Tempo compartilhada.
- Se um resultado reservado for aplicado como dano ou cura, a alteração de HP será compartilhada e registrada como uma aplicação manual; a fórmula original da rolagem privada não é publicada.

## Limites

- O Rolador Universal é uma ferramenta manual para situações não automatizadas, como dano narrativo, cura livre, armadilhas e resultados aleatórios.
- Ele não substitui ataques, habilidades, iniciativa ou testes D20 automáticos.
- A aplicação manual altera somente HP. Efeitos adicionais, condições, deslocamento ou consequências narrativas continuam sob decisão do mestre.
- A ferramenta não interpreta a regra da cena: o mestre escolhe a fórmula e decide como usar o resultado.
