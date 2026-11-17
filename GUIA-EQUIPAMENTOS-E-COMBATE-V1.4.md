# Guia v1.4 — Equipamentos e combate aprimorados

Este guia explica as melhorias visuais da versão 1.4 do Reino de Aethra. Elas não mudam o cálculo de dano, defesa, HP, iniciativa ou raridade como regra de jogo: a raridade é, nesta versão, um metadado visual do item.

## 1. O que mudou

- Arma, armadura e escudo podem mostrar a cor correspondente à raridade na miniatura do aventureiro.
- A janela de equipamento mostra a raridade informada no item. Itens antigos sem esse campo aparecem como **Comum**.
- Monstros exibem uma pequena barra de vida no mapa tático.
- A barra de vida do painel de combate ganha aparência de ferido ou crítico conforme o HP restante.
- Drakthar recebe auras visuais nas fases II e III. Quando a ação do chefe é identificada como sopro/chamas ou atinge vários alvos, a miniatura executa um efeito flamejante.
- Após a derrota, a peça do monstro permanece no mapa com aparência de caída. O painel também indica o desfecho.

## 2. Cores de raridade aceitas

| Valor em `rarity` ou `raridade` | Cor aproximada |
|---|---|
| `comum` | Cinza/prata |
| `incomum` | Verde |
| `raro` | Azul |
| `epico` ou `épico` | Violeta |
| `lendario` ou `lendário` | Dourado |

O item pode ainda informar `color` com uma cor CSS válida para personalizar a aparência. Use apenas valores confiáveis definidos pelo mestre/desenvolvedor.

### Exemplo de metadados

O objeto do item pode conter os campos opcionais abaixo. Eles são exemplos de estrutura, não um item que já é inserido automaticamente no inventário:

```js
{
  id: 'espada-lua-prateada',
  name: 'Espada da Lua Prateada',
  kind: 'weapon',
  damageDie: 8,
  rarity: 'epico',
  color: '#bd8cff'
}
```

Para armaduras e escudos, use os mesmos campos opcionais `rarity` e `color` no respectivo objeto.

## 3. Como aplicar raridade a um item existente

1. Abra o projeto no editor de código (por exemplo, o VS Code).
2. Localize a definição do item ou o trecho que cria/atualiza o equipamento do personagem.
3. Dentro do objeto correspondente, adicione `rarity: 'raro'` (ou uma das opções da tabela).
4. Opcionalmente, adicione `color: '#68a9ff'` para definir uma cor personalizada.
5. Salve o arquivo e publique a atualização no GitHub Pages.
6. Recarregue o jogo e confira a miniatura e a janela **Equipamentos e mochila**.

Não é necessário alterar `supabase-schema.sql` ou executar uma migração para esses campos opcionais. Se a sua campanha já possui itens gravados, a raridade só aparecerá quando o próprio objeto de equipamento receber o metadado. A v1.4 não distribui raridades automaticamente nem cria novos itens.

## 4. Barras de HP e derrota

A barra curta sobre a miniatura do monstro representa o HP compartilhado do encontro. A barra maior no painel continua mostrando `HP atual / HP máximo`. Quando o encontro é encerrado por derrota, a peça do monstro permanece visível para comunicar o resultado; ao iniciar outro encontro, a nova criatura ocupa a posição de monstro normalmente.

## 5. Drakthar e os efeitos de chefe

As fases II e III recebem auras de intensidade crescente. A animação de sopro é acionada quando o evento recebido descreve chamas/sopro ou quando há vários alvos afetados. A regra e o dano continuam sendo calculados pela lógica de combate já existente; o efeito visual não causa dano por conta própria.

## 6. Acessibilidade e desempenho

As animações novas respeitam `prefers-reduced-motion`. Em dispositivos modestos, o jogador pode reduzir/desativar animações pelo recurso de redução de movimento do próprio sistema operacional ou navegador.

## 7. Atualização e compatibilidade

- A v1.4 é uma atualização dos arquivos estáticos do jogo.
- Não há migração SQL nova.
- Preserve seu `config.js` se já estiver configurado com a URL e a chave pública do Supabase. Nunca publique uma chave `service_role` ou `secret` no navegador.
- Campanhas e dados existentes não precisam ser apagados ou recriados.

## 8. Limitações conhecidas

- As miniaturas continuam sendo desenhos vetoriais com animação CSS, não modelos 3D nem spritesheets quadro a quadro.
- O formato da arma ainda depende principalmente da classe; esta atualização diferencia a aparência pelo acabamento/cor da raridade, não cria um modelo exclusivo para cada nome de item.
- A raridade é apenas visual nesta versão: não concede bônus nem muda o equilíbrio.
- O efeito flamejante depende da descrição/estrutura do evento de ação do chefe; não substitui a lógica de combate.
- Esta entrega foi verificada por análise estática do código e integridade do ZIP. A interface precisa ser testada no navegador e o multiplayer/Supabase precisa ser validado com contas e dispositivos reais.
