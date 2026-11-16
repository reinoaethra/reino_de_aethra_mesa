# Reino de Aethra — RPG de Mesa Virtual

**Versão do jogo: 0.4**  
**Idioma:** português (Brasil)  
**Formato:** aplicação web estática para navegador  
**Hospedagem da interface:** GitHub Pages  
**Banco de dados e multiplayer:** Supabase

> Reino de Aethra é um RPG de mesa virtual de fantasia medieval. O mestre conduz a aventura, os jogadores criam heróis e a plataforma registra a campanha, os dados, os combates e a evolução dos personagens.

Este projeto foi preparado para quem não quer contratar um servidor VPS nem deixar o próprio computador ligado durante a semana. O Supabase mantém os dados da campanha na nuvem; o navegador do mestre funciona como autoridade lógica da mesa enquanto a sessão está acontecendo.

---

## 1. Leia isto antes de começar

Se você nunca criou um banco de dados, nunca publicou um site ou nunca usou o Supabase, **não tente adivinhar os passos**. Siga os guias na ordem abaixo:

1. **[GUIA-SUPABASE-DO-ZERO.md](GUIA-SUPABASE-DO-ZERO.md)** — criar a conta, criar o projeto, preparar o banco de dados, habilitar o acesso anônimo e configurar a chave pública.
2. **[GUIA-GITHUB-PAGES-DO-ZERO.md](GUIA-GITHUB-PAGES-DO-ZERO.md)** — criar um repositório e publicar o jogo gratuitamente.
3. **[CHECKLIST-DA-PRIMEIRA-PARTIDA.md](CHECKLIST-DA-PRIMEIRA-PARTIDA.md)** — conferir a instalação e realizar a primeira sessão de teste.
4. **[TESTE-MULTIPLAYER.md](TESTE-MULTIPLAYER.md)** — testar com dois ou mais navegadores.
5. **[REGRAS-DE-COMBATE.md](REGRAS-DE-COMBATE.md)** — consultar as regras que estão implementadas na versão 0.4.
6. **[SOLUCAO-DE-PROBLEMAS.md](SOLUCAO-DE-PROBLEMAS.md)** — procurar soluções para erros comuns.

**Não é necessário instalar um programa de banco de dados no computador.** O Supabase é acessado pelo navegador. O GitHub também é acessado pelo navegador.

## 2. O que está incluído na versão 0.4

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
- Três criaturas de demonstração: Goblin das Cinzas, Lobo Cinzento e Drakthar, o Devorador.
- Recompensa de XP ao derrotar uma criatura.
- A cada nível conquistado: +5 HP máximo e +1 no atributo principal da classe (até 12).
- Proteção contra ações de combate fora do turno, respostas duplicadas e recompensa de XP repetida.

### Biblioteca

A interface apresenta a estrutura inicial dos sete livros: Livro do Mestre, Bestiário, Grandes Chefes, Atlas dos Cinco Reinos, Grimório, Arsenal e Manual do Aventureiro. **Os capítulos completos, ilustrações editoriais e PDFs ainda serão produzidos em uma etapa posterior.** Não interprete os títulos dos livros como se todo o conteúdo já estivesse escrito.

## 3. O que ainda não está pronto

A versão 0.4 é uma base jogável em evolução, não o produto final. Ainda não estão completos:

- Campanha narrativa integral, com capítulos, escolhas e missões completas.
- Livros completos e PDFs diagramados.
- Bestiário extenso, chefes com várias fases e inteligência avançada dos monstros.
- Mapas táticos com miniaturas, casas, obstáculos e áreas de efeito.
- Condições de estado completas (veneno, sangramento, congelamento etc.).
- Troca de equipamentos por uma interface de inventário completa.
- Sistema de login permanente com e-mail ou outro método e recuperação entre dispositivos.
- Chat privado, voz e música compartilhada.
- WebRTC/P2P direto entre jogadores.
- Testes de carga e segurança para uma publicação pública de grande escala.

O livro do mestre na interface contém somente uma estrutura inicial. **Não coloque segredos verdadeiros da campanha em campos compartilhados** (`game_state`, ficha pública ou chat). Uma área privada de segredos, com armazenamento e regras de acesso próprias, será desenvolvida antes de adicionarmos o conteúdo secreto real.

## 4. Como a arquitetura funciona

| Componente | Para que serve |
|---|---|
| GitHub Pages | Entrega a página, os estilos e os arquivos JavaScript. |
| Supabase Auth | Cria e mantém a identidade dos participantes. |
| Supabase Database | Guarda campanhas, participantes, personagens, estado e histórico. |
| Supabase Realtime | Notifica os navegadores sobre mudanças e eventos da sala. |
| Navegador do mestre | É a autoridade lógica da mesa durante a sessão; calcula resultados e atualiza o estado oficial. |
| Navegador do jogador | Envia ações permitidas e recebe as atualizações da campanha. |

**Importante: não há um servidor VPS mantido por você.** O Supabase é um serviço hospedado na nuvem e precisa estar disponível para que a campanha online funcione. O computador do mestre só precisa ficar ligado e conectado durante a partida. Entre sessões, o mestre pode desligá-lo: os dados confirmados permanecem no banco.

A versão 0.4 usa a comunicação Realtime do Supabase. **Ela ainda não usa conexão direta WebRTC/P2P.** Portanto, não é correto dizer que o computador do mestre está recebendo conexões de internet diretamente dos jogadores. O mestre é a autoridade da lógica de jogo; o Supabase transporta as atualizações e armazena os dados.

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

### Passo B — GitHub Pages

Abra [GUIA-GITHUB-PAGES-DO-ZERO.md](GUIA-GITHUB-PAGES-DO-ZERO.md). O guia explica como criar um repositório, enviar os arquivos para a raiz e ativar Pages.

### Passo C — Primeira partida

Abra [CHECKLIST-DA-PRIMEIRA-PARTIDA.md](CHECKLIST-DA-PRIMEIRA-PARTIDA.md). Teste primeiro como mestre e depois com um segundo navegador como jogador.

## 6. Qual arquivo SQL devo executar?

Escolha **somente o caminho que corresponde à situação do seu banco**:

| Situação | O que executar |
|---|---|
| Nunca criou as tabelas de Aethra / projeto Supabase novo | Execute todo o `supabase-schema.sql` uma vez. |
| O banco já está na versão 0.3 | Faça a cópia dos dados descrita na Parte 8 do `GUIA-SUPABASE-DO-ZERO.md` e execute somente `supabase-migration-v0.4.sql`. |
| O banco está na versão 0.2 | Faça a cópia dos dados descrita na Parte 8 do `GUIA-SUPABASE-DO-ZERO.md`; execute primeiro `supabase-migration-v0.3.sql` e depois `supabase-migration-v0.4.sql`. |
| O banco é da versão 0.1 ou de uma estrutura modificada manualmente | Não execute migrações às cegas. Crie um projeto Supabase de teste ou peça ajuda para identificar o esquema atual antes de alterar o banco. |

Não execute uma migração v0.4 em um banco vazio: ela pressupõe que as tabelas e funções da versão 0.3 já existam. Não apague as tabelas para tentar corrigir um erro. Veja [SOLUCAO-DE-PROBLEMAS.md](SOLUCAO-DE-PROBLEMAS.md) ou peça ajuda com a mensagem exata do erro.

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

1. Baixe o ZIP da versão nova.
2. Extraia o conteúdo para uma pasta.
3. Confira se a versão nova inclui um arquivo de migração SQL.
4. Faça backup do banco antes de executar a migração indicada.
5. Atualize os arquivos no repositório GitHub, substituindo os antigos.
6. Preserve seu `config.js` já preenchido ou copie os mesmos dois valores para o `config.js` novo.
7. Espere o GitHub Pages publicar a atualização e abra o site com atualização forçada (`Ctrl + F5`).
8. Faça um teste com mestre e jogador antes de marcar uma sessão oficial.

Não substitua o `config.js` preenchido por um arquivo vazio que tenha vindo no ZIP. Guarde uma cópia privada desse arquivo como backup, embora nele deva existir somente a Publishable key pública.

## 9. Limitações importantes de conta e disponibilidade

A versão atual cria usuários anônimos pelo Supabase Auth. Isso dispensa e-mail e senha, mas a documentação do Supabase informa que uma identidade anônima não pode ser recuperada se a pessoa sair da conta, apagar os dados de navegação ou trocar de dispositivo. Por isso, cada jogador deve voltar usando o mesmo navegador e perfil. A recuperação/vinculação de contas será adicionada mais adiante. Leia [Anonymous Sign-Ins](https://supabase.com/docs/guides/auth/auth-anonymous).

O plano Free do Supabase pode pausar projetos com pouca atividade durante sete dias. A documentação atual informa que algumas requisições ao banco por dia normalmente ajudam a manter o projeto ativo, mas não oferecem garantia. Se o projeto pausar, o proprietário deverá abrir o Dashboard e selecionar **Resume project**. O projeto restaurado mantém dados e configurações dentro do período indicado pelo Supabase. Leia [Project Pausing](https://supabase.com/docs/guides/platform/free-project-pausing). Como o grupo pretende jogar nos finais de semana, considere esse comportamento ao planejar a disponibilidade.

## 10. Estrutura dos arquivos

| Arquivo | Função |
|---|---|
| `index.html` | Página principal; ponto de entrada do jogo. |
| `styles.css` | Cores, tipografia, layout, responsividade e animações. |
| `app.js` | Interface, personagens, campanha, dados, combate e sincronização. |
| `config.js` | Project URL e Publishable key do Supabase. |
| `supabase-schema.sql` | Instalação completa do banco em um projeto novo. |
| `supabase-migration-v0.3.sql` | Atualiza banco v0.2 para v0.3. |
| `supabase-migration-v0.4.sql` | Atualiza banco v0.3 para v0.4. |
| `CHANGELOG.md` | Histórico das versões. |
| `REGRAS-DE-COMBATE.md` | Regras implementadas na versão 0.4. |
| `GUIA-SUPABASE-DO-ZERO.md` | Tutorial do Supabase para iniciantes. |
| `GUIA-GITHUB-PAGES-DO-ZERO.md` | Tutorial de publicação no GitHub Pages. |
| `CHECKLIST-DA-PRIMEIRA-PARTIDA.md` | Lista de conferência para a primeira sessão. |
| `TESTE-MULTIPLAYER.md` | Roteiro de testes em vários navegadores. |
| `SOLUCAO-DE-PROBLEMAS.md` | Diagnóstico de problemas comuns. |

## 11. Testes técnicos realizados nesta entrega

Foram executadas verificações de sintaxe JavaScript, consistência dos nomes dos arquivos, existência dos arquivos referenciados, estrutura HTML/CSS, correspondência dos trechos de funções SQL entre esquema e migração e integridade do pacote ZIP. O SQL foi revisado estaticamente, mas **não foi executado em um projeto Supabase real** nesta entrega. Também não foi possível simular um multiplayer real sem as credenciais de um projeto Supabase ativo e sem navegadores de jogadores conectados.

Antes de usar uma campanha importante, siga o roteiro de teste e confirme os resultados com pelo menos dois navegadores.

## 12. Documentação oficial útil

- [Supabase — criar conta e começar](https://supabase.com/docs)
- [Supabase — SQL Editor](https://supabase.com/docs/guides/database/overview)
- [Supabase — API keys](https://supabase.com/docs/guides/getting-started/api-keys)
- [Supabase — usuários anônimos](https://supabase.com/docs/guides/auth/auth-anonymous)
- [Supabase — pausa de projetos gratuitos](https://supabase.com/docs/guides/platform/free-project-pausing)
- [GitHub — configurar a origem do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

---

**Reino de Aethra v0.4 — A crônica está pronta para os primeiros testes de combate e progressão.**
