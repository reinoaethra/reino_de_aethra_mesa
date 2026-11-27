# Reino de Aethra — Guia de atualização v4.2.8

Esta é uma atualização grande, incremental sobre a v4.2.7. Ela acrescenta regras de queda e ressurreição, árvores de habilidades específicas por classe e comércio/forja compartilhados com aprovação do mestre.

**Esta versão exige executar uma nova migração SQL no Supabase antes de publicar o site.** Não exige Node.js, terminal, Docker nem uma nova Edge Function.

## 1. Antes de começar: faça um backup

1. Entre no Reino de Aethra como mestre.
2. Abra cada campanha importante e, na Central do Mestre, use **Exportar backup**.
3. Guarde os arquivos JSON fora da pasta do repositório.
4. Preserve também o repositório atual no GitHub, para poder recuperar os arquivos anteriores.

Não exclua campanhas, personagens, participantes ou o projeto Supabase.

## 2. Atualizar o Supabase pelo navegador

### 2.1 Abrir o SQL Editor

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Entre no projeto utilizado pelo Reino de Aethra.
3. No menu lateral, selecione **SQL Editor**.
4. Clique em **New query**.

### 2.2 Executar a migração

1. No ZIP da v4.2.8, localize `supabase-migration-v4.2.8.sql`.
2. Abra o arquivo com o Bloco de Notas ou outro editor de texto.
3. Pressione `Ctrl + A` para selecionar todo o conteúdo e `Ctrl + C` para copiar.
4. Volte à aba do SQL Editor do Supabase e clique dentro da área de consulta.
5. Pressione `Ctrl + V` para colar o SQL completo.
6. Clique em **Run**.
7. Confira se o Supabase terminou sem apresentar erro em vermelho.

Execute este arquivo **uma única vez**. Ele substitui a validação da função `submit_campaign_event` e cria `submit_marketplace_request`, que registra pedidos de compra, venda e forja sem alterar os recursos antes da aprovação do mestre.

### 2.3 Pré-requisitos das migrações anteriores

A migração v4.2.8 pressupõe que o projeto já recebeu as estruturas de campanha online da v4.2.0 e a correção de eventos/estado da v4.2.1 corrigida. A v4.2.5 é necessária para manter a opção de exclusão de conta.

Como a instalação do projeto já está na série 4.2.7, **não execute novamente** as migrações antigas que já foram aplicadas. Se não tiver certeza de que a v4.2.1 corrigida foi executada, não tente reaplicar vários SQLs por tentativa: confira o histórico de execução do SQL Editor antes de prosseguir.

A v4.2.8 não modifica a Edge Function `delete-account`. Mantenha-a publicada se estiver utilizando a exclusão de conta.

## 3. Publicar os arquivos do site pelo GitHub (sem Node.js)

1. Abra o repositório do Reino de Aethra no GitHub pelo navegador.
2. Na raiz do projeto, abra `index.html`, clique no lápis **Edit this file**, substitua o conteúdo pelo `index.html` do pacote v4.2.8 e confirme a alteração com **Commit changes**.
3. Repita o procedimento para `app.js` e `styles.css`.
4. Abra a pasta `assets/js/`. Substitua `aethra-dice-3d.js` pelo arquivo do pacote, mantendo o mesmo caminho.
5. Se o pacote trouxer a pasta `tests/`, você pode enviá-la para manter os testes junto do repositório; ela não é necessária para o site funcionar.
6. Envie também a documentação e o arquivo SQL, se desejar manter o histórico da versão no GitHub.
7. Aguarde o GitHub Pages publicar as alterações.
8. Abra o site e faça uma recarga forçada com `Ctrl + F5`. No celular, feche a aba antiga e abra o site novamente.

Se preferir, use **Add file → Upload files** para enviar vários arquivos em uma única operação, preservando a estrutura de pastas.

## 4. Arquivos que devem ser preservados

**Não substitua nem apague:**

- `config.js` — contém a URL e a chave pública do seu projeto Supabase.
- `assets/maps/` e os demais arquivos e imagens de mapa.
- outras imagens, retratos, miniaturas, ícones e bibliotecas próprias da campanha.
- `supabase/functions/delete-account/index.ts` e a Edge Function já publicada, caso utilize a exclusão de conta.
- os arquivos de configuração do repositório que não estejam explicitamente listados como atualização.

O ZIP é incremental e não contém o `config.js` do seu projeto.

## 5. Conferência inicial

Faça os testes em uma campanha de teste ou com personagens de teste. Não teste morte, compra ou forja em um personagem principal sem backup.

### Queda e ressurreição

1. Inicie um encontro de teste e reduza o HP de um personagem a zero.
2. Confirme que ele aparece como **Caído** e que o mestre tem a opção **Rolar resistência à morte** no turno correspondente.
3. Teste um resultado de resistência na faixa de sucesso/falha conforme a regra do jogo. Confirme o contador no rastreador de iniciativa.
4. Verifique que três sucessos deixam o personagem **Estável** e três falhas deixam **Morto**.
5. Faça um Clérigo de nível 28 ou superior aprender o Ritual de Ressurreição, tenha uma Essência de Retorno no inventário e solicite ressuscitar um personagem morto.
6. Confirme que a Essência só é consumida quando o Ritual é validado e que o retorno aparece no Diário/Linha do Tempo.
7. Teste também **Ressuscitar aventureiro** na Central do Mestre, escolhendo o método com Essência ou a justificativa narrativa.

### Árvore de habilidades

1. Abra **Habilidades** na ficha de cada classe.
2. Confirme que cada classe exibe cinco técnicas próprias.
3. Verifique os requisitos de nível: 4, 10, 16, 22 e 28.
4. Aprenda uma técnica e aprimore-a até o grau 3, usando pontos disponíveis em uma ficha de teste.
5. Confirme que o uso durante o combate é limitado a uma vez por encontro e que os efeitos são aplicados ao alvo correto.

### Comércio

1. Abra a campanha em dois navegadores/dispositivos: um como mestre e outro como jogador.
2. Na Central do Mestre, clique em **Abrir comércio**.
3. Confirme que o jogador recebe o aviso de serviço aberto e consegue entrar no comércio.
4. Faça o jogador solicitar uma compra e, depois, uma venda de um item comum na mochila.
5. No painel do mestre, confirme que o pedido aparece na fila. Aprove apenas o pedido mais antigo e verifique ouro e inventário.
6. Repita com um item raro/épico: ele só deve aparecer quando o nível e a classe do personagem cumprirem todos os requisitos.
7. Confirme que um jogador não consegue enviar outro pedido enquanto o primeiro aguarda resolução.

### Forja

1. Na Central do Mestre, clique em **Abrir forja** (é uma janela independente do comércio).
2. Com um jogador, solicite aprimoramento ou encantamento de uma peça equipada.
3. No painel do mestre, aprove ou recuse os pedidos, sempre pelo mais antigo da fila.
4. Confirme que custos e materiais só são debitados após aprovação e que a ficha recebe os bônus.

## 6. Limitações e observações

- A compra e a venda são feitas uma unidade por solicitação nesta edição.
- O valor de venda é metade do preço cadastrado, arredondado para baixo, com mínimo de 1 PO.
- Equipamentos equipados, itens vinculados, de missão ou relíquias não podem ser vendidos pela mochila.
- O mestre aprova um pedido por vez, respeitando a ordem de chegada de cada fila.
- A árvore da classe tem cinco técnicas, cada uma com até três graus. Os pontos já gastos na antiga árvore compartilhada não são creditados novamente; os bônus antigos são preservados.
- A migração SQL é entregue e revisada estaticamente, mas precisa ser executada e confirmada no projeto Supabase real. Os testes locais não substituem esse teste de integração.
