# Reino de Aethra — Guia de atualização v4.2.9

## Objetivo

A revisão global da v4.2.9 corrige o efeito de piscar observado ao abrir o Comércio e a Forja e aplica o mesmo ciclo de vida estável a todas as janelas modais personalizadas do site.

Antes, cada atualização de estado podia substituir o HTML completo do `#modal-root`, desmontando o fundo e o diálogo e reiniciando suas animações. Agora todas as atribuições a `modalRoot.innerHTML` passam por um reconciliador global: se a janela atual é a mesma, o fundo e a caixa de diálogo permanecem montados. Se o conteúdo não mudou, nada é redesenhado; se mudou, atualiza-se somente o interior.

O reconciliador também tenta preservar valores digitados ainda não enviados, seleção de campos, foco, posição de rolagem e arquivos selecionados quando o mesmo campo continua disponível.

## Escopo revisado

O mecanismo global cobre as janelas personalizadas administradas pelo contêiner `#modal-root`, incluindo:

- Configurações, conta, login, recuperação de senha e exclusão de conta;
- Criar campanha, entrar em campanha e criação/edição de personagem;
- Biblioteca, leitura de livros, Bestiário, NPCs e pontos de interesse;
- Central do Mestre, gerenciamento da jornada, diário e inventário;
- Solicitação de D20, Rolador Universal, condições, ataques em área e árvore de habilidades;
- Pontos de restauração, notificações, encerramento de sessão e ferramentas narrativas;
- Adicionar áudio, adicionar YouTube e demais janelas da Central de Música;
- Comércio e Forja, tanto para mestre quanto para jogadores;
- Formulários de narração e declaração de dano.

As animações temporárias dos próprios dados, notificações rápidas (toasts) e caixas nativas do navegador (`confirm`) são componentes separados, não janelas modais do `#modal-root`.

## Instalação pelo GitHub — sem Node.js ou terminal

1. Faça uma cópia do repositório atual antes de publicar.
2. Baixe e extraia `reino-de-aethra-atualizacao-v4.2.9.zip`.
3. No GitHub, abra o repositório do Reino de Aethra.
4. Substitua na raiz os arquivos `index.html`, `app.js` e `styles.css` pelos arquivos do pacote.
5. Dentro de `assets/js/`, substitua `aethra-dice-3d.js` pelo arquivo da atualização.
6. Preserve `config.js`, as imagens, os mapas e toda a estrutura `assets/` existente.
7. Faça commit das alterações e aguarde o GitHub Pages publicar.
8. No Opera/Chrome, abra o site e pressione `Ctrl + F5`. A referência de cache dos arquivos JS/CSS foi renovada mantendo a identificação pública da versão em 4.2.9. No celular, feche a aba antiga e abra o endereço novamente.

O pacote também inclui `preview-dados-3d.html`, testes e documentação. Não é necessário publicar os arquivos de teste nem substituir os arquivos SQL históricos.

## Supabase

**Não há migração SQL nesta revisão.** Não execute novamente `supabase-schema.sql`, `supabase-migration-v4.2.1.sql`, `supabase-migration-v4.2.5.sql` nem `supabase-migration-v4.2.8.sql` por causa desta atualização.

A Edge Function `delete-account` da v4.2.5 continua necessária para a exclusão de contas e deve ser preservada. A migração e a função de comércio/forja da v4.2.8 também permanecem inalteradas.

## Como testar

Faça os testes no computador e, pelo menos, em um celular. Quando possível, mantenha mestre e jogador conectados à mesma campanha.

1. Abra e feche Configurações, Conta, Biblioteca, criação de campanha e entrada em campanha.
2. Abra e percorra as cinco etapas da criação de personagem; digite valores, avance e volte sem perder o conteúdo ainda não salvo.
3. Abra o Bestiário, um NPC, um ponto de interesse e o inventário; confira abertura, rolagem e fechamento.
4. Abra as ferramentas do mestre: Jornada, D20, Rolador Universal, Habilidades, Condições, Ataque em Área, Diário e Pontos de Restauração.
5. Abra os formulários de Música/YouTube e de narração.
6. Abra Comércio e Forja. Com a janela aberta, envie um pedido por outra conta e confirme que a fila atualiza sem reiniciar o fundo ou a animação.
7. Digite em um campo, mantenha o foco e provoque uma atualização da campanha; confirme que o texto digitado permanece quando o campo continua disponível.
8. Role uma janela longa até o meio, provoque uma atualização e verifique se a posição é mantida.
9. Feche cada janela pelo botão, pelo botão Cancelar e pelo fundo escurecido, quando aplicável.
10. Confirme que abrir uma janela diferente continua apresentando a animação de entrada normalmente.

## Verificação automatizada e limites

- `node --check app.js` sem erros.
- 24 arquivos de teste `.cjs` passaram, incluindo a suíte nova de estabilidade global e as suítes históricas.
- Os testes automatizados verificam a instalação do reconciliador, preservação do shell, foco, campos, rolagem e a utilização do mecanismo comum por Comércio/Forja.
- A revisão de código cobre todas as atribuições a `modalRoot.innerHTML`. A percepção visual final deve ser conferida no Opera/Chrome e nos celulares utilizados na campanha, pois o navegador real e a carga de rede podem variar.
