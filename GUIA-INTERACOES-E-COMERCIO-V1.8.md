# Guia de diálogos, decisões e comércio — Reino de Aethra v1.8

Este guia explica as novidades da versão 1.8. A atualização aproveita o estado JSON da campanha que já existe; **não exige executar um novo SQL**.

## 1. Diálogos interativos

Três NPCs receberam opções de conversa:

- **Ilyra Avelorn:** pode revelar a trilha até a Torre dos Vigias ou compartilhar pistas sobre o desaparecimento dos animais.
- **Tovin Ferromar:** pode prometer um desconto futuro ou explicar marcas antigas ligadas às forjas de Drakmor.
- **Irmão Cael:** pode ensinar os versos da oração das cinco luzes ou abençoar a companhia.

### Como registrar uma escolha

1. Inicie a sessão e revele o NPC no painel **Jornada e missões**, caso ainda não esteja visível.
2. Abra o cartão do NPC na área de personagens encontrados.
3. O mestre controlador verá as opções de conversa disponíveis.
4. Clique na opção que representa a decisão da companhia.
5. A decisão será salva no estado da campanha e aparecerá novamente como registrada quando o diálogo for aberto.

As escolhas são persistentes: o estado guarda `dialogueChoices`, as bandeiras narrativas em `storyFlags` e uma entrada legível no diário. A companhia registra apenas uma das alternativas por NPC; depois da escolha, as outras opções ficam bloqueadas nesse diálogo.

**Importante:** nesta versão, as bandeiras são ganchos narrativos para o mestre. Elas ainda não alteram automaticamente missões, mapas, recompensas, diálogos de outros NPCs ou finais. O mestre continua decidindo como interpretar as consequências.

## 2. Comércio da companhia

O comércio é controlado pelo mestre ativo para evitar que vários navegadores sobrescrevam simultaneamente o ouro e o inventário de um personagem.

### Abrir a loja

1. Entre na sessão como mestre.
2. Abra a **Central do Mestre**.
3. Clique em **Abrir comércio**.
4. Escolha o aventureiro que está negociando.
5. Confira o ouro disponível e as mercadorias.

### Mercadorias disponíveis

| Item | Preço | Uso descrito |
|---|---:|---|
| Poção de Cura | 18 PO | Recupera 1d8 + 2 HP quando usada pelas regras de combate existentes. |
| Tônico de Vigor | 28 PO | Consumível narrativo; efeito específico deve ser combinado com o mestre. |
| Rações de Viagem | 6 PO | Alimento para uma jornada. |
| Tocha | 4 PO | Ilumina áreas escuras por uma cena, sob decisão do mestre. |
| Kit de Explorador | 22 PO | Cordão, pederneira e ferramentas simples. |

A compra desconta o preço do ouro do personagem e adiciona uma unidade ao inventário. Itens iguais são agrupados pela identificação do item.

### Vender

A seção **Vender itens comuns** permite vender uma unidade por vez. O valor de venda é metade do preço registrado no item; se ele não possuir preço, o sistema usa 10 PO como referência (5 PO na venda).

Itens de missão (`quest`) e equipamentos (`equipment`) não aparecem como elegíveis para venda. Poções, utilidades e outros itens comuns podem ser vendidos.

Cada compra ou venda atualiza `partyState` e registra uma anotação no diário e no fluxo de eventos da sessão.

## 3. Quem pode fazer o quê?

- O mestre controlador ativo registra escolhas de diálogo e conduz transações.
- Jogadores podem consultar os diálogos e ver as escolhas que já foram registradas.
- O mestre escolhe o aventureiro atendido pela loja; o saldo e a mochila desse personagem são atualizados na campanha compartilhada.
- Se o mestre controlador sair ou perder a conexão, as ações protegidas aguardam o próximo mestre controlador.

## 4. Atualização do jogo

1. Baixe e extraia `reino-de-aethra-v1.8.zip`.
2. Publique os arquivos no mesmo repositório GitHub Pages usado pela versão anterior.
3. Preserve seu `config.js`, pois ele contém a URL e a chave pública do seu projeto Supabase.
4. Não execute um SQL novo para esta versão.
5. Abra o site, entre na mesma conta e retome a campanha existente.

O novo código lê os campos narrativos como opcionais; campanhas criadas antes da v1.8 continuam funcionando e passam a receber os campos quando uma escolha for registrada.

## 5. Limites conhecidos

- As escolhas ainda não executam ramificações automáticas de missões ou finais.
- O comércio não equipa/des equipa armas ou armaduras, não repara itens e não possui sistema de barganha.
- O mestre é responsável por validar a interpretação narrativa de cada compra, venda e escolha.
- O pacote foi submetido a verificações estáticas e sintáticas locais. Não foi realizado teste visual em navegador nem uma sessão multiplayer real contra o Supabase nesta entrega.
