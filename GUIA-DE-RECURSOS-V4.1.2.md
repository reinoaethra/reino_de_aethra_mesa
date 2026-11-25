# Reino de Aethra — Guia de recursos v4.1.2

A v4.1.1 é uma atualização de qualidade de sessão. Ela não substitui o Modo Chamada nem os recursos da v4.1.0; acrescenta ferramentas de acompanhamento, recuperação e encerramento da partida.

## 1. Conexão e presença

No topo da sessão aparece um painel com o estado da conexão, participantes online e horário da última sincronização.

- **Sincronização ao vivo:** o canal Realtime da campanha está inscrito.
- **Reconectando:** a aplicação está tentando restabelecer o canal.
- **Conexão instável:** houve erro, timeout ou fechamento do canal.
- **Sem conexão com a internet:** o navegador informou que está offline.
- **Modo local:** a campanha atual não está conectada ao Supabase.

Quando a conexão falha, a aplicação limpa a presença antiga e tenta reconectar com intervalos progressivos, limitados a 30 segundos. Quando o navegador volta a ficar online, uma nova tentativa é iniciada. O botão **Reconectar / sincronizar** permite solicitar uma tentativa manual e atualizar os dados da campanha.

O indicador de participante online depende da presença Realtime confirmada. Se a internet cair, os participantes podem aparecer temporariamente offline até a sala sincronizar novamente. O horário de última sincronização é informativo; ele não garante, por si só, que toda operação pendente tenha sido confirmada.

## 2. Histórico e desfazer a última alteração

Na área do mestre aparece **Última alteração reversível** quando existe uma alteração recente feita pelo mestre ativo e ainda compatível com a revisão atual da campanha.

A aplicação guarda até oito registros internos de alterações do estado da campanha. A interface oferece o desfazer da alteração mais recente, desde que:

1. tenha sido feita pelo mesmo usuário mestre;
2. a revisão atual ainda corresponda àquela alteração;
3. esta instância continue sendo o controlador ativo do mestre.

Ao clicar em **Desfazer ação**, uma confirmação explica quais campos serão revertidos. Depois da reversão, o acontecimento é acrescentado ao diário como “Ação desfeita”. A revisão é incrementada para impedir que uma ação antiga seja desfeita por engano.

**Limites:** o desfazer cobre alterações feitas pelo mecanismo de estado da campanha (`game_state`), como combate, HP, iniciativa, exploração, missões, narração e progressão. Não apaga registros imutáveis da tabela de eventos, mensagens, contas, participantes ou dados externos ao estado da campanha. Também não é uma ferramenta para reverter ações de outro usuário ou outra campanha. Se uma nova alteração de estado acontecer depois, a reversão anterior deixa de estar disponível como “última ação”.

## 3. Resumo do turno

Durante um encontro, acima da ordem de iniciativa aparece o **Resumo do Turno**. Ele mostra:

- personagem ou criatura que está na vez;
- rodada atual;
- HP do participante ativo quando disponível;
- movimento restante, considerando o deslocamento já utilizado naquele turno;
- condições ativas;
- situação da ação e da habilidade especial.

A condição **Enraizado** reduz o movimento disponível a zero. **Atordoado** informa que a ação foi perdida. Quando a habilidade especial do aventureiro já foi utilizada no encontro, o painel informa esse estado.

O resumo é um auxílio visual. As validações reais de movimento, habilidades, alcance e ações continuam sendo feitas pelos controles e regras do combate; o painel não concede ações adicionais.

## 4. Notificações da campanha

O botão **Notificações** reúne até 40 eventos recentes que ajudam a acompanhar o que aconteceu: entrada e saída de jogadores, narrações, solicitações e resultados de D20, dano, ações de combate, mudanças de turno, encontros e registros importantes do diário.

O contador considera eventos de outros participantes ainda não marcados como lidos. A leitura é local ao navegador e à conta/campanha selecionada; não é compartilhada entre dispositivos. O histórico principal continua no Diário da Campanha.

As notificações são baseadas nos eventos registrados pela aplicação. Elas não representam uma transcrição da chamada de voz.

## 5. Encerramento da sessão

O botão **Encerrar sessão** do mestre abre um formulário com um resumo inicial preparado a partir do capítulo, local, diário e eventos registrados desde o início da sessão.

O mestre pode editar o texto. Ao confirmar:

1. um ponto de restauração é criado antes do encerramento;
2. o resumo é salvo no estado da campanha e no Diário da Crônica;
3. o estado da sessão é marcado como pausado;
4. a flag de sessão ativa é desligada;
5. confirmações de prontidão dos jogadores são limpas;
6. o mestre retorna ao salão da campanha.

As fichas, missões, mapas, inventários, recompensas e progresso continuam guardados. Para continuar em outra ocasião, o mestre inicia uma nova sessão a partir da sala de preparação. O conteúdo da campanha não é reiniciado.

## 6. Recomendações de uso

- Aguarde o estado **Sincronização ao vivo** antes de realizar operações importantes com todos conectados.
- Se alguém perder a conexão, evite repetir várias vezes a mesma ação; aguarde a reconexão ou use o botão manual.
- Use o desfazer apenas imediatamente após conferir a alteração incorreta.
- Consulte o Diário para rever o histórico completo; notificações são apenas atalhos recentes.
- No encerramento, revise o resumo automático para remover detalhes que não deseja compartilhar com todos.
- Mantenha backups externos periódicos, especialmente antes de restaurar pontos de campanha.


## 7. Ajuste de visualização do Bestiário — v4.1.2

O Bestiário abre em uma janela ampliada para aproveitar melhor a área útil da tela. A organização foi simplificada para evitar que o conteúdo seja distribuído em colunas independentes e deixe um espaço vazio.

- O painel de composição do encontro permanece no topo, para o mestre preparar a seleção.
- A pesquisa e os filtros ficam juntos do catálogo de criaturas.
- As miniaturas e os cartões das criaturas aparecem em uma grade larga, com rolagem própria quando necessário.
- Ao selecionar uma criatura, a ilustração de batalha, os dados e a habilidade aparecem em uma ficha ampla logo abaixo do catálogo, e não em uma coluna deslocada à esquerda.
- Em telas menores, a ficha passa para uma coluna única; os cartões se reorganizam em duas colunas no celular.
- A seleção, a composição de até seis tipos, os encontros salvos e os comandos de iniciar encontro continuam funcionando como antes.

O tamanho expandido é aplicado somente ao modal do Bestiário. Os demais pop-ups mantêm as dimensões anteriores.
