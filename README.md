# Reino de Aethra — RPG de Mesa Virtual

**Versão do jogo: 0.8**  
**Idioma:** português (Brasil)  
**Formato:** aplicação web estática para navegador  
**Hospedagem da interface:** GitHub Pages  
**Banco de dados e multiplayer:** Supabase

> Reino de Aethra é um RPG de mesa virtual de fantasia medieval. O mestre conduz a aventura, os jogadores criam heróis e a plataforma registra a campanha, os dados, os combates e a evolução dos personagens.

Este projeto foi preparado para quem não quer contratar um servidor VPS nem deixar o próprio computador ligado durante a semana. O Supabase mantém os dados da campanha na nuvem; o navegador do mestre funciona como autoridade lógica da mesa enquanto a sessão está acontecendo.

---

## 1. Leia isto antes de começar

Se você nunca criou um banco de dados, nunca publicou um site ou nunca usou o Supabase, **não tente adivinhar os passos**. Siga os guias na ordem abaixo:

1. **[GUIA-SUPABASE-DO-ZERO.md](GUIA-SUPABASE-DO-ZERO.md)** — criar a conta, criar o projeto, preparar o banco, habilitar acesso visitante e configurar a chave pública.
2. **[GUIA-GITHUB-PAGES-DO-ZERO.md](GUIA-GITHUB-PAGES-DO-ZERO.md)** — criar um repositório e publicar o jogo gratuitamente.
3. **[GUIA-LOGIN-E-PROGRESSO.md](GUIA-LOGIN-E-PROGRESSO.md)** — configurar confirmação de e-mail e transformar o acesso visitante em conta para continuar em outro dispositivo.
4. **[CHECKLIST-DA-PRIMEIRA-PARTIDA.md](CHECKLIST-DA-PRIMEIRA-PARTIDA.md)** — conferir a instalação e realizar a primeira sessão de teste.
5. **[TESTE-MULTIPLAYER.md](TESTE-MULTIPLAYER.md)** — testar com dois ou mais navegadores.
6. **[REGRAS-DE-COMBATE.md](REGRAS-DE-COMBATE.md)** — consultar as regras de combate e progressão.
7. **[GUIA-DA-PRIMEIRA-AVENTURA.md](GUIA-DA-PRIMEIRA-AVENTURA.md)** — conduzir o Capítulo I, apresentar NPCs, cenas e objetivos de missão.
8. **[GUIA-MAPA-E-EXPLORACAO.md](GUIA-MAPA-E-EXPLORACAO.md)** — usar os mapas táticos, posicionar peças, névoa, baús e armadilhas.
9. **[GUIA-PERSONAGENS-NPCS-CRIATURAS.md](GUIA-PERSONAGENS-NPCS-CRIATURAS.md)** — conhecer os retratos, substituir imagens e entender o bestiário ilustrado.
10. **[SOLUCAO-DE-PROBLEMAS.md](SOLUCAO-DE-PROBLEMAS.md)** — procurar soluções para erros comuns.

**Não é necessário instalar um programa de banco de dados no computador.** O Supabase é acessado pelo navegador. O GitHub também é acessado pelo navegador.

## 2. O que está incluído na versão 0.8

### Campanhas e jogadores

- Criar uma campanha e assumir o papel de mestre.
- Gerar código e link de convite.
- Entrar na campanha usando o código.
- Lobby com lista de participantes e indicação de presença.
- Criação guiada de personagem com nome, origem, raça, classe e atributos.
- Fichas guardadas no Supabase quando o backend estiver configurado.
- Iniciar, salvar, encerrar e retomar uma sessão.

### Sala virtual

- Narração compartilhada do mestre.
- Chat da companhia.
- Histórico de eventos.
- Solicitação de testes D20 para um jogador ou para todos.
- Animação visual e som de rolagem.
- Presença dos participantes e botão de sincronização.

### Personagens e combate

- Oito classes iniciais: Guerreiro, Arcano, Patrulheiro, Paladino, Assassino, Clérigo, Druida e Invocador.
- Seis atributos: Força, Destreza, Constituição, Inteligência, Sabedoria e Carisma.
- Cálculo de HP máximo e Defesa.
- Arma, armadura e escudo iniciais de acordo com a classe.
- Habilidade especial própria de cada classe, utilizável uma vez por encontro.
- Inventário inicial com poções de cura e rações.
- Combate por turnos com iniciativa.
- Ataque básico, habilidades, poção e turno do monstro.
- HP do monstro e HP dos aventureiros salvos no estado da campanha.
- Cinco criaturas ilustradas: Goblin das Cinzas, Lobo Cinzento, Espectro da Ruptura, Campeão Orc e Drakthar, o Devorador.
- Recompensa de XP ao derrotar uma criatura.
- A cada nível conquistado: +5 HP máximo e +1 no atributo principal da classe (até 12).
- Proteção contra ações de combate fora do turno, respostas duplicadas e recompensa de XP repetida.


### Jornada narrativa e primeira aventura

- Primeiro capítulo jogável: **Ecos na Estrada de Eldoria**.
- Quadro compartilhado de missões principais e secundárias.
- Objetivos individuais com progresso e conclusão controlados pelo mestre.
- Conclusão automática do objetivo de derrotar os Goblins das Cinzas quando esse encontro é vencido.
- Apresentação de NPCs para todos os jogadores pelo mestre.
- Fichas públicas de Ilyra Avelorn, Tovin Ferromar e Irmão Cael após serem revelados.
- Cinco cenas preparadas: estrada, vila, oficina, torre e santuário.
- Publicação de capítulo, local e narração para toda a companhia.
- Diário da campanha com descobertas, mudanças de cena e progresso de missões.
- Dados narrativos guardados no campo `game_state` JSONB já existente.


### Exploração tática e mapas (v0.7)

- Quatro mapas 2D em grade: Estrada de Eldoria, Vila de Brumafolha, Torre dos Vigias e Santuário das Raízes.
- Grade de 10 × 8 casas, com terreno livre, trilhas, água, árvores, casas, rochas, colunas e muros.
- Peças compartilhadas para personagens e criatura do encontro.
- Mestre escolhe a peça e move diretamente; jogadores podem solicitar o deslocamento da própria peça.
- Aprovação ou recusa de pedidos de movimento pelo mestre.
- Verificação de caminho, obstáculos, ocupação de casas e distância.
- Movimento ortogonal de até 4 casas por turno em combate; fora do combate, cada deslocamento também é limitado a 4 casas.
- Névoa de guerra, área revelada pelo mestre e descoberta de casas ao redor dos aventureiros.
- Marcadores de baú e armadilha, com descoberta automática ao entrar na casa.
- Baú concede 15 moedas de ouro; armadilha causa 5 HP de dano.
- Saldo de ouro visível no painel do personagem e no inventário.
- Posições, mapas e marcadores salvos em `campaigns.game_state`.
- Nova função RPC `request_map_move`, que permite ao jogador solicitar somente o movimento da própria peça.

### Conta, login e progresso entre dispositivos (v0.7)

- O jogo cria um acesso visitante automaticamente quando o Supabase está conectado.
- O botão **Salvar progresso** permite vincular um e-mail à identidade visitante atual e definir uma senha depois da confirmação do endereço.
- O vínculo preserva o mesmo `auth.uid()` do visitante; por isso, os vínculos de campanhas, fichas e eventos associados a esse identificador continuam ligados à mesma pessoa.
- Login por e-mail e senha em computador, celular ou tablet.
- Recuperação de senha por e-mail.
- Alteração de senha após entrar.
- Ao entrar em outro dispositivo, a lista de campanhas ligadas à conta é carregada do Supabase.
- A autenticação é administrada pelo Supabase Auth; não há senha armazenada manualmente nas tabelas do jogo.

**Limites importantes:** a conta só sincroniza campanhas criadas/participadas no Supabase. Campanhas criadas anteriormente no modo local (`localStorage`) não são enviadas automaticamente à nuvem. Uma sessão visitante não pode ser recuperada em outro dispositivo até que o jogador conclua o vínculo do e-mail e defina uma senha. No novo dispositivo, entre na conta antes de criar um personagem ou entrar em uma campanha como visitante.

### Personagens, NPCs e criaturas ilustrados (v0.8)

- Retratos WebP próprios para as oito classes jogáveis: Guerreiro, Arcano, Patrulheiro, Paladino, Assassino, Clérigo, Druida e Invocador.
- Retratos para os três NPCs da primeira aventura: Ilyra Avelorn, Tovin Ferromar e Irmão Cael.
- Retratos para cinco criaturas do bestiário inicial, incluindo Drakthar, o Devorador.
- Os retratos aparecem na criação de personagens, prévia da ficha, participantes do lobby, painel do personagem, miniaturas do mapa e cartões de combate.
- Seleção de encontros com cartões ilustrados, atributos e habilidades.
- Inventário com identificação visual do personagem e slots de equipamento mais destacados.
- Efeitos visuais e sonoros para ataques físicos, habilidades, curas e ações de monstros.
- Imagens locais na pasta `assets/portraits`; o jogo não depende de hospedagem externa para carregar retratos.

### Exploração visual (base v0.7, aprimorada na v0.8)

- Miniaturas visuais por classe para os aventureiros, agora com retratos ilustrados, iniciais e símbolos.
- Animação suave de ociosidade das miniaturas e destaque da criatura no mapa.
- Portas que o mestre pode posicionar e abrir/fechar.
- Jogadores próximos podem solicitar abertura de portas; o mestre aprova ou recusa.
- Altares que podem ser examinados mediante pedido e aprovação do mestre.
- Descobertas aprovadas são registradas no diário da campanha.
- Portas fechadas bloqueiam caminhos e casas.
- Ações de interação com mapa são validadas por uma função RPC do Supabase.

### Biblioteca

A interface apresenta a estrutura inicial dos sete livros: Livro do Mestre, Bestiário, Grandes Chefes, Atlas dos Cinco Reinos, Grimório, Arsenal e Manual do Aventureiro. **Os capítulos completos, ilustrações editoriais e PDFs ainda serão produzidos em uma etapa posterior.** Não interprete os títulos dos livros como se todo o conteúdo já estivesse escrito.

## 3. O que ainda não está pronto

A versão 0.7 é uma base jogável em evolução, não o produto final. Ainda não estão completos:

- A campanha completa ainda está em produção. A versão 0.7 mantém o primeiro capítulo estruturado, com missões iniciais, NPCs e cenas preparadas; os capítulos seguintes e suas escolhas serão desenvolvidos em versões futuras.
- Livros completos e PDFs diagramados.
- Bestiário extenso, chefes com várias fases e inteligência avançada dos monstros.
- Mapas de batalha com ilustrações de cenário próprias em alta resolução, peças animadas em 3D, áreas de efeito, linhas de visão e ferramentas avançadas de batalha. Os retratos 2D das classes e criaturas já estão incluídos, mas ainda não são modelos 3D nem animações completas de corpo inteiro.
- Condições de estado completas (veneno, sangramento, congelamento etc.).
- Troca de equipamentos por uma interface de inventário completa.
- Login social (Google/Discord), passkeys e autenticação multifator ainda não estão implementados.
- Chat privado, voz e música compartilhada.
- WebRTC/P2P direto entre jogadores.
- Testes de carga e segurança para uma publicação pública de grande escala.

O livro do mestre na interface contém somente uma estrutura inicial. **Não coloque segredos verdadeiros da campanha em campos compartilhados** (`game_state`, ficha pública ou chat). Uma área privada de segredos, com armazenamento e regras de acesso próprias, será desenvolvida antes de adicionarmos o conteúdo secreto real.

## 4. Como a arquitetura funciona

| Componente | Para que serve |
|---|---|
| GitHub Pages | Entrega a página, os estilos e os arquivos JavaScript. |
| Supabase Auth | Cria identidades visitantes e contas permanentes por e-mail/senha; permite login em mais de um dispositivo. |
| Supabase Database | Guarda campanhas, participantes, personagens, estado e histórico. |
| Supabase Realtime | Notifica os navegadores sobre mudanças e eventos da sala. |
| Navegador do mestre | É a autoridade lógica da mesa durante a sessão; calcula resultados e atualiza o estado oficial. |
| Navegador do jogador | Envia ações permitidas e recebe as atualizações da campanha. |

**Importante: não há um servidor VPS mantido por você.** O Supabase é um serviço hospedado na nuvem e precisa estar disponível para que a campanha online funcione. O computador do mestre só precisa ficar ligado e conectado durante a partida. Entre sessões, o mestre pode desligá-lo: os dados confirmados permanecem no banco.

A versão 0.7 usa a comunicação Realtime do Supabase. **Ela ainda não usa conexão direta WebRTC/P2P.** Portanto, não é correto dizer que o computador do mestre está recebendo conexões de internet diretamente dos jogadores. O mestre é a autoridade da lógica de jogo; o Supabase transporta as atualizações e armazena os dados.

## 5. Instalação pela primeira vez

Se você está começando do zero, siga exatamente esta ordem:

### Passo A — Supabase

Abra [GUIA-SUPABASE-DO-ZERO.md](GUIA-SUPABASE-DO-ZERO.md). O guia explica como:

- Criar uma conta Supabase.
- Criar uma organização e um projeto.
- Guardar a senha do banco de dados.
- Executar `supabase-schema.sql` pelo SQL Editor.
- Ativar Anonymous Sign-Ins.
- Copiar a Project URL e a Publishable key.
- Preencher `config.js` sem expor uma chave secreta.

Depois de publicar o site, abra também [GUIA-LOGIN-E-PROGRESSO.md](GUIA-LOGIN-E-PROGRESSO.md) para configurar login, confirmação de e-mail e URLs de retorno. **Faça o vínculo do e-mail no dispositivo original antes de tentar continuar em outro aparelho.**

### Passo B — GitHub Pages

Abra [GUIA-GITHUB-PAGES-DO-ZERO.md](GUIA-GITHUB-PAGES-DO-ZERO.md). O guia explica como criar um repositório, enviar os arquivos para a raiz e ativar Pages.

### Passo C — Primeira partida

Abra [CHECKLIST-DA-PRIMEIRA-PARTIDA.md](CHECKLIST-DA-PRIMEIRA-PARTIDA.md). Teste primeiro como mestre e depois com um segundo navegador como jogador.

## 6. Qual arquivo SQL devo executar?

Escolha **somente o caminho que corresponde à situação do seu banco**:

| Situação | O que executar |
|---|---|
| Projeto Supabase novo, sem tabelas de Aethra | Execute somente `supabase-schema.sql` que acompanha a v0.8. |
| Banco já na v0.6 | Faça backup e execute `supabase-migration-v0.7.sql` uma vez. |
| Banco já na v0.5 | Execute `supabase-migration-v0.6.sql` e depois `supabase-migration-v0.7.sql`. |
| Banco já na v0.4 | Execute, nesta ordem, `supabase-migration-v0.5.sql`, `supabase-migration-v0.6.sql` e `supabase-migration-v0.7.sql`. |
| Banco já na v0.3 | Execute, nesta ordem, `supabase-migration-v0.4.sql`, `supabase-migration-v0.5.sql`, `supabase-migration-v0.6.sql` e `supabase-migration-v0.7.sql`. |
| Banco já na v0.2 | Execute, nesta ordem, `supabase-migration-v0.3.sql`, `supabase-migration-v0.4.sql`, `supabase-migration-v0.5.sql`, `supabase-migration-v0.6.sql` e `supabase-migration-v0.7.sql`. |
| Banco v0.1 ou estrutura alterada manualmente | Não execute migrações às cegas. Faça uma cópia de segurança e peça ajuda para identificar a estrutura antes de atualizar. |

Não execute uma migração v0.4 em um banco vazio: ela pressupõe que as tabelas e funções da versão 0.3 já existam. A v0.5 atualiza o estado inicial de campanhas novas, a v0.6 adiciona a função `request_map_move` e a v0.7 adiciona a função `request_map_interaction` para portas e altares. A autenticação por e-mail/senha é administrada pelo Supabase Auth e não exige uma tabela ou migração de senha própria. Os mapas, as posições, a névoa e os marcadores ficam no campo JSONB `campaigns.game_state`; não são necessárias tabelas adicionais. Não apague as tabelas para tentar corrigir um erro. Veja [SOLUCAO-DE-PROBLEMAS.md](SOLUCAO-DE-PROBLEMAS.md) ou peça ajuda com a mensagem exata do erro.

## 7. Configuração do `config.js`

Este arquivo informa ao navegador qual projeto Supabase usar. Abra `config.js` no Bloco de Notas e preencha os dois campos:

```js
window.AETHRA_CONFIG = {
  supabaseUrl: 'https://SEU-PROJETO.supabase.co',
  supabasePublicKey: 'sb_publishable_SUA_CHAVE_PUBLICA'
};
```

Troque os exemplos pelos valores copiados do seu próprio projeto. Mantenha as aspas e as vírgulas. Não apague `window.AETHRA_CONFIG` nem as chaves `{ }`.

A chave que pode estar no navegador e no repositório é a **Publishable key**, normalmente iniciada por `sb_publishable_`. Nunca coloque uma **Secret key** (`sb_secret_...`) nem uma chave administrativa `service_role` neste arquivo, no GitHub ou em uma mensagem. A Publishable key é pública por definição e só é segura quando as tabelas estão protegidas pelas políticas RLS que acompanham o esquema. Consulte a documentação oficial: [API keys do Supabase](https://supabase.com/docs/guides/getting-started/api-keys).

Também é possível preencher a URL e a chave no botão de configurações dentro do jogo. Essa alternativa grava os valores somente no armazenamento do navegador em que foram informados. Para que todos os jogadores usem a mesma configuração sem precisar digitá-la individualmente, configure `config.js` antes da publicação.

## 8. Atualizar uma versão já publicada

1. Baixe o ZIP da versão nova (v0.8).
2. Extraia o conteúdo para uma pasta.
3. Confira se a versão nova inclui um arquivo de migração SQL.
4. Faça backup do banco antes de executar a migração indicada.
5. Atualize os arquivos no repositório GitHub, substituindo os antigos.
6. Preserve seu `config.js` já preenchido ou copie os mesmos dois valores para o `config.js` novo.
7. Espere o GitHub Pages publicar a atualização e abra o site com atualização forçada (`Ctrl + F5`).
8. Faça um teste com mestre e jogador antes de marcar uma sessão oficial.

Não substitua o `config.js` preenchido por um arquivo vazio que tenha vindo no ZIP. Guarde uma cópia privada desse arquivo como backup, embora nele deva existir somente a Publishable key pública.

## 9. Limitações importantes de conta e disponibilidade

Na primeira visita, o jogo pode criar uma identidade visitante pelo Supabase Auth. Esse acesso funciona no mesmo navegador, mas não pode ser recuperado em outro aparelho se os dados locais forem apagados. Para continuar em computador, celular ou tablet, o jogador deve abrir **Conta → Salvar progresso**, informar um e-mail, confirmar o link no mesmo navegador e depois definir uma senha. Nos outros dispositivos, deve abrir **Conta → Já tenho uma conta** e entrar com esse e-mail e senha. O vínculo preserva o identificador original do visitante, portanto as fichas e campanhas na nuvem continuam associadas à pessoa. Leia [Anonymous Sign-Ins](https://supabase.com/docs/guides/auth/auth-anonymous) e o `GUIA-LOGIN-E-PROGRESSO.md`.

O plano Free do Supabase pode pausar projetos com pouca atividade durante sete dias. A documentação atual informa que algumas requisições ao banco por dia normalmente ajudam a manter o projeto ativo, mas não oferecem garantia. Se o projeto pausar, o proprietário deverá abrir o Dashboard e selecionar **Resume project**. O projeto restaurado mantém dados e configurações dentro do período indicado pelo Supabase. Leia [Project Pausing](https://supabase.com/docs/guides/platform/free-project-pausing). Como o grupo pretende jogar nos finais de semana, considere esse comportamento ao planejar a disponibilidade.

## 10. Estrutura dos arquivos

| Arquivo | Função |
|---|---|
| `index.html` | Página principal; ponto de entrada do jogo. |
| `styles.css` | Cores, tipografia, layout, responsividade e animações. |
| `app.js` | Interface, personagens, campanha, dados, combate e sincronização. |
| `config.js` | Project URL e Publishable key do Supabase. |
| `supabase-schema.sql` | Instalação completa do banco v0.7; a v0.8 mantém o mesmo esquema. |
| `supabase-migration-v0.3.sql` | Atualiza banco v0.2 para v0.3. |
| `supabase-migration-v0.4.sql` | Atualiza banco v0.3 para v0.4. |
| `supabase-migration-v0.5.sql` | Ajusta o estado inicial de campanhas novas em banco v0.4, sem alterar campanhas existentes. |
| `supabase-migration-v0.6.sql` | Adiciona a função segura de solicitação de movimento para mapas táticos. |
| `supabase-migration-v0.7.sql` | Adiciona a função segura de solicitação de abertura de portas e inspeção de altares. |
| `assets/portraits/preview-sheet.jpg` | Folha de contato com os retratos do projeto. |
| `assets/portraits/` | Retratos WebP das classes, NPCs e criaturas utilizados na v0.8. |
| `GUIA-PERSONAGENS-NPCS-CRIATURAS.md` | Guia dos retratos, miniaturas, criaturas e substituição de imagens. |
| `GUIA-MAPA-E-EXPLORACAO.md` | Manual dos mapas, movimentos, névoa, objetos e interações. |
| `GUIA-LOGIN-E-PROGRESSO.md` | Vincular e-mail, criar senha, entrar em outro aparelho e recuperar a conta. |
| `GUIA-DA-PRIMEIRA-AVENTURA.md` | Roteiro para conduzir a primeira aventura, usar o painel narrativo e consultar as limitações atuais. |
| `CHANGELOG.md` | Histórico das versões. |
| `REGRAS-DE-COMBATE.md` | Regras de combate e criaturas, incluindo atualizações da v0.8. |
| `GUIA-SUPABASE-DO-ZERO.md` | Tutorial do Supabase para iniciantes. |
| `GUIA-GITHUB-PAGES-DO-ZERO.md` | Tutorial de publicação no GitHub Pages. |
| `CHECKLIST-DA-PRIMEIRA-PARTIDA.md` | Lista de conferência para a primeira sessão. |
| `TESTE-MULTIPLAYER.md` | Roteiro de testes em vários navegadores. |
| `SOLUCAO-DE-PROBLEMAS.md` | Diagnóstico de problemas comuns. |

## 11. Testes técnicos realizados nesta entrega

Foram executadas verificações de sintaxe JavaScript (`node --check`), existência e formato dos 16 retratos WebP, referências dos arquivos de imagem, equilíbrio básico das chaves CSS/HTML e integridade do pacote ZIP. Não foi feito teste visual completo em navegador nem teste multiplayer com Supabase real nesta entrega. O SQL não foi alterado na v0.8 e, por isso, não foi necessário executá-lo ou criar uma migração nova.

Antes de usar uma campanha importante, siga o roteiro de teste e confirme os resultados com pelo menos dois navegadores.

## Atualização para a versão 0.8 — banco de dados

A versão 0.8 **não exige uma nova migração SQL**. Os retratos são arquivos WebP locais e os identificadores de imagem ficam dentro dos campos JSON da ficha/personagem e do encontro. Os efeitos visuais usam os eventos de campanha já existentes.

- Projeto novo: execute somente `supabase-schema.sql`.
- Banco já na v0.7: não execute SQL adicional; atualize os arquivos do site e inclua a pasta inteira `assets/portraits/`.
- Banco mais antigo: complete primeiro as migrações históricas até a v0.7, conforme a tabela de instalação.

Preserve a Project URL e a Publishable key que já estão no seu `config.js`.

## 12. Documentação oficial útil

- [Supabase — criar conta e começar](https://supabase.com/docs)
- [Supabase — SQL Editor](https://supabase.com/docs/guides/database/overview)
- [Supabase — API keys](https://supabase.com/docs/guides/getting-started/api-keys)
- [Supabase — usuários anônimos](https://supabase.com/docs/guides/auth/auth-anonymous)
- [Supabase — pausa de projetos gratuitos](https://supabase.com/docs/guides/platform/free-project-pausing)
- [GitHub — configurar a origem do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

---

**Reino de Aethra v0.8 — Os aventureiros agora aparecem com retratos próprios e efeitos de combate, mantendo contas e progresso entre dispositivos.**
