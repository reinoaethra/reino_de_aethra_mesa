# Guia v2.4 — espólios, relíquias e equipamentos exclusivos

## 1. Como as recompensas funcionam

Quando o HP de um monstro chega a zero, o mestre controlador confirma a derrota. O sistema distribui a XP prevista para o encontro, calcula o ouro e consulta a tabela de espólio correspondente à criatura.

- Cada personagem registrado como participante no início do encontro recebe ouro.
- Os itens sorteados são adicionados à mochila dos participantes daquele encontro.
- Materiais repetidos são agrupados pela quantidade na mochila.
- O resultado do espólio é registrado no diário e no estado do encontro.
- O encontro recebe a marca `lootAwarded`, para evitar uma segunda distribuição em uma reconexão normal.

A recompensa de ouro usa o nível do monstro como referência: 4 PO por nível para criaturas comuns e 8 PO por nível para chefes e ameaças lendárias. O valor mínimo é 5 PO por participante.

## 2. Materiais regionais

| Origem | Exemplos de espólio |
|---|---|
| Eldoria | Couro de Lobo Cinzento, Presa de Lobo |
| Drakmor | Cinza Viva, Fragmento de Forja, Escama Ancestral |
| Nivéria | Cristal Niveriano, Essência Arcana |
| Thalassor | Coral Abissal |
| Limiar do Vazio | Núcleo do Vazio |

Os Fragmentos de Forja e as Essências Arcanas podem ser usados no sistema de aprimoramento e encantamento da v2.3. Materiais e relíquias não podem ser vendidos no comércio.

## 3. Equipamentos exclusivos de chefes

| Chefe | Recompensas especiais possíveis |
|---|---|
| Malgor, General das Cinzas | Lâmina do Coração de Brasa, Coroa do General das Cinzas, Broquel da Guarda de Cinzas |
| Devorador das Marés | Couraça do Guardião das Marés, Tridente do Abismo Sereno, Escudo do Recife Eterno |
| Titã Primordial | Manoplas do Titã Primordial, Martelo do Núcleo Primordial, Couraça Tectônica |
| Rainha de Cristal | Foco da Rainha Prismática e Cristais Niverianos |
| Arconte do Sol Partido | Diadema do Arconte Solar e Essências Arcanas |
| Colosso da Umbra | Manto do Eclipse Absoluto e Núcleos do Vazio |
| Drakthar | Escamas Ancestrais e Fragmentos de Forja |
| Vharzun | Coração de Vharzun e Núcleos do Vazio |

Os itens exclusivos não são mercadorias do mercado. As chances de equipamento são deliberadamente menores que as chances de materiais. Algumas recompensas de chefe são garantidas como materiais, enquanto a peça de equipamento continua rara.

## 4. Relíquias e peças Míticas

- **Broto da Raiz Eterna:** relíquia Épica de Eldoria. O mestre pode permitir uma recuperação de 2d8 HP uma vez por encontro.
- **Coração de Vharzun:** relíquia Mítica do chefe final, exige nível 50 e oferece Defesa elevada. Seu efeito de redução de dano é conduzido pelo mestre.
- **Manto do Eclipse Absoluto:** equipamento Mítico exclusivo do Colosso da Umbra, exige nível 45.

As descrições indicam os efeitos especiais narrativos. O mestre controla a ativação desses efeitos durante a sessão; os bônus de raridade e de equipamento são calculados automaticamente quando a peça é equipada.

## 5. Conjuntos completos

Cada conjunto exige três espaços equipados (arma, armadura e escudo). Ao completar as três peças, o sistema adiciona o bônus numérico de conjunto conforme a raridade e apresenta seu efeito especial no inventário.

- **Cinzas Forjadas:** Lâmina do Coração de Brasa, Coroa do General das Cinzas e Broquel da Guarda de Cinzas.
- **Guardião das Marés:** Couraça do Guardião das Marés, Tridente do Abismo Sereno e Escudo do Recife Eterno.
- **Titã Primordial:** Manoplas do Titã Primordial, Martelo do Núcleo Primordial e Couraça Tectônica.

Os efeitos especiais descritivos são sugestões de regra para o mestre aplicar; o bônus numérico de conjunto é automático.

## 6. Como equipar um item recebido

1. Abra o comércio da companhia como mestre controlador.
2. Selecione o aventureiro que recebeu o item.
3. Localize o item na seção de equipamento do aventureiro ou abra o inventário da ficha.
4. Use **Equipar**. O sistema verifica o nível e a classe exigidos.
5. Confira a Defesa e os bônus de ataque no inventário.

Relíquias que ocupam o espaço de escudo também podem ser equipadas. Ao retirar uma peça, ela volta à mochila.

## 7. Compatibilidade e instalação

- Não é necessária migração SQL adicional para a v2.4.
- As recompensas são salvas em `game_state.partyState` e no objeto do encontro.
- A v2.3 e anteriores continuam usando o mesmo formato geral de campanha; novos campos são opcionais.
- Preserve seu `config.js` ao substituir os arquivos publicados, pois ele contém a configuração do projeto Supabase.

## 8. Limitações conhecidas

A proteção contra repetição usa o estado do encontro e o controle do mestre ativo; ela evita a repetição no fluxo normal de reconexão, mas não equivale a uma transação atômica no banco de dados em caso de duas abas de mestre concorrentes. Os efeitos especiais textuais de relíquias e conjuntos são conduzidos pelo mestre; os bônus numéricos de equipamento e conjunto são automáticos. Não foi realizado teste visual em navegador nem teste multiplayer real contra um projeto Supabase nesta entrega.
