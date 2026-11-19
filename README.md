# Reino de Aethra — RPG de Mesa Virtual

**Versão do jogo: 3.0.4 — correção dos fundos e miniaturas exclusivas do bestiário**  
**Idioma:** português (Brasil)  
**Formato:** aplicação web estática para navegador · pacote de atualização v3.0.4  
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
4. **[GUIA-DE-LANCAMENTO-V3.0.md](GUIA-DE-LANCAMENTO-V3.0.md)** — entender o fluxo oficial de mestre, jogadores, visitantes e contas.
5. **[CHECKLIST-DE-LANCAMENTO-V3.0.md](CHECKLIST-DE-LANCAMENTO-V3.0.md)** — verificar os dois aparelhos, formulários e regras de combate antes da estreia.
6. **[CHECKLIST-DA-PRIMEIRA-PARTIDA.md](CHECKLIST-DA-PRIMEIRA-PARTIDA.md)** — conferir a instalação e realizar a primeira sessão de teste.
7. **[TESTE-MULTIPLAYER.md](TESTE-MULTIPLAYER.md)** — testar com dois ou mais navegadores.
8. **[REGRAS-DE-COMBATE.md](REGRAS-DE-COMBATE.md)** — consultar as regras de combate e progressão.
9. **[GUIA-CHEFES-E-FASES.md](GUIA-CHEFES-E-FASES.md)** — entender as fases de Drakthar e os ataques de área.
10. **[GUIA-MINIATURAS-ARTICULADAS.md](GUIA-MINIATURAS-ARTICULADAS.md)** — referência histórica das miniaturas vetoriais das versões iniciais; as peças atuais são estátuas estáticas.
11. **[GUIA-EQUIPAMENTOS-E-CRIATURAS-V1.2.md](GUIA-EQUIPAMENTOS-E-CRIATURAS-V1.2.md)** — entender a representação visual de armas, armaduras, escudos e monstros no tabuleiro.
12. **[GUIA-COMBATE-REATIVO-V1.3.md](GUIA-COMBATE-REATIVO-V1.3.md)** — entender as animações de ataque, magia, cura, impacto e erro.
13. **[GUIA-EQUIPAMENTOS-E-COMBATE-V1.4.md](GUIA-EQUIPAMENTOS-E-COMBATE-V1.4.md)** — raridade visual dos itens, barras de vida, chefes e animações de derrota.
14. **[GUIA-DA-PRIMEIRA-AVENTURA.md](GUIA-DA-PRIMEIRA-AVENTURA.md)** — conduzir o Capítulo I, apresentar NPCs, cenas e objetivos de missão.
15. **[GUIA-CAMPANHA-BESTIARIO-LIVROS-V1.7.md](GUIA-CAMPANHA-BESTIARIO-LIVROS-V1.7.md)** — consultar mapas regionais, novos monstros, entrega de recompensas e livros ampliados.
16. **[GUIA-INTERACOES-E-COMERCIO-V1.8.md](GUIA-INTERACOES-E-COMERCIO-V1.8.md)** — conduzir diálogos com escolhas persistentes e registrar compras/vendas.
17. **[GUIA-MAPA-E-EXPLORACAO.md](GUIA-MAPA-E-EXPLORACAO.md)** — usar os mapas táticos, posicionar peças, névoa, baús e armadilhas.
18. **[GUIA-PERSONAGENS-NPCS-CRIATURAS.md](GUIA-PERSONAGENS-NPCS-CRIATURAS.md)** — conhecer os retratos, substituir imagens e entender o bestiário ilustrado.
19. **[GUIA-PROGRESSAO-NIVEL-50-E-RARIDADES-V2.2.md](GUIA-PROGRESSAO-NIVEL-50-E-RARIDADES-V2.2.md)** — progressão até o nível 50, raridades, conjuntos e atualização do Supabase.
20. **[GUIA-ESPOLIOS-RELIQUIAS-EQUIPAMENTOS-V2.4.md](GUIA-ESPOLIOS-RELIQUIAS-EQUIPAMENTOS-V2.4.md)** — tabelas de espólio, relíquias, chefes e conjuntos.
21. **[GUIA-ATLAS-VISUAL-E-LIVRO-DO-MESTRE-V2.5.md](GUIA-ATLAS-VISUAL-E-LIVRO-DO-MESTRE-V2.5.md)** — imagens dos cinco reinos, atualização do site e orientações sobre o PDF privado.
22. **[GUIA-CENARIOS-ILUSTRADOS-V2.6.md](GUIA-CENARIOS-ILUSTRADOS-V2.6.md)** — referência das cenas regionais ilustradas.
23. **[GUIA-EXPLORACAO-INTERATIVA-V2.7.md](GUIA-EXPLORACAO-INTERATIVA-V2.7.md)** — pontos de interesse, NPCs, eventos e viagens.
24. **[GUIA-CENAS-EXPLORAVEIS-E-LIVROS-V2.8.md](GUIA-CENAS-EXPLORAVEIS-E-LIVROS-V2.8.md)** — movimento narrativo, objetos persistentes, rotinas de NPCs e atualizações da biblioteca.
25. **[GUIA-IDENTIDADE-VISUAL-E-CORRECOES-V2.9.md](GUIA-IDENTIDADE-VISUAL-E-CORRECOES-V2.9.md)** — cenas regionais ilustradas, atualização dos sete livros e correção da criação de campanhas.
26. **[supabase-migration-v2.9.sql](supabase-migration-v2.9.sql)** — corrige a geração do código de convite sem depender de `gen_random_bytes`.
27. **[MANUAL-PRIMEIROS-PASSOS-MESTRE-E-JOGADORES-V2.10.md](MANUAL-PRIMEIROS-PASSOS-MESTRE-E-JOGADORES-V2.10.md)** — manual completo para quem nunca jogou RPG de mesa.
28. **[GUIA-MAPA-TATICO-2D-E-ENCONTROS-V2.10.md](GUIA-MAPA-TATICO-2D-E-ENCONTROS-V2.10.md)** — mapas, obstáculos, miniaturas e grupos de monstros.
29. **[GUIA-CENA-INTERATIVA-E-MISSOES-V2.10.md](GUIA-CENA-INTERATIVA-E-MISSOES-V2.10.md)** — passo a passo de cenas e objetivos.
30. **[ADENDO-LIVRO-DO-MESTRE-V2.10.pdf](ADENDO-LIVRO-DO-MESTRE-V2.10.pdf)** — complemento da edição anterior do Livro do Mestre.
31. **[GUIA-MAPA-TATICO-2D-E-ENCONTROS-V2.10.1.md](GUIA-MAPA-TATICO-2D-E-ENCONTROS-V2.10.1.md)** — registro da edição anterior do tabuleiro.
32. **[GUIA-MAPA-FUNDO-ILUSTRADO-V2.10.2.md](GUIA-MAPA-FUNDO-ILUSTRADO-V2.10.2.md)** — fundo ilustrado, grade transparente e movimentação das miniaturas.
33. **[GUIA-MINIATURAS-DE-MESA-V2.12.md](GUIA-MINIATURAS-DE-MESA-V2.12.md)** — estátuas, equipamento visual e bases de chefes multicelulares.
34. **[ADENDO-MINIATURAS-E-BASES-MULTICELULARES-V2.12.pdf](ADENDO-MINIATURAS-E-BASES-MULTICELULARES-V2.12.pdf)** — complemento ilustrado com equipamentos e regras de bases ampliadas.
35. **[ATLAS-MINIATURAS-V2.12.png](ATLAS-MINIATURAS-V2.12.png)** — prancha de referência das classes e principais modelos de monstros e chefes.
36. **[NOTAS-DE-LANCAMENTO-V3.0.md](NOTAS-DE-LANCAMENTO-V3.0.md)** — mudanças da edição oficial 3.0.
37. **[GUIA-DE-ATUALIZACAO-V3.0.1.md](GUIA-DE-ATUALIZACAO-V3.0.1.md)** — como instalar a atualização de lançamento.
38. **[NOTAS-DE-LANCAMENTO-V3.0.1.md](NOTAS-DE-LANCAMENTO-V3.0.1.md)** — correções de login/logout, tabuleiros e documentação.
39. **[CHECKLIST-DE-PUBLICACAO-V3.0.1.md](CHECKLIST-DE-PUBLICACAO-V3.0.1.md)** — teste sugerido após publicar os arquivos.
40. **[MANUAL-CENA-INTERATIVA-E-PONTOS-DE-INTERESSE-V3.0.1.pdf](MANUAL-CENA-INTERATIVA-E-PONTOS-DE-INTERESSE-V3.0.1.pdf)** — manual detalhado de cenas e descobertas.
41. **[MANUAL-MAPA-TATICO-V3.0.1.pdf](MANUAL-MAPA-TATICO-V3.0.1.pdf)** — manual de tabuleiros, portas, movimento e combate espacial.
42. **[ROTEIRO-DO-MESTRE-INICIANTE-PRIMEIRA-AVENTURA-V3.0.1.pdf](ROTEIRO-DO-MESTRE-INICIANTE-PRIMEIRA-AVENTURA-V3.0.1.pdf)** — roteiro detalhado para preparar e conduzir as primeiras sessões.
43. **[supabase-migration-v3.0.1.sql](supabase-migration-v3.0.1.sql)** — ampliação da lista de mapas permitidos nos pedidos remotos.
44. **[SOLUCAO-DE-PROBLEMAS.md](SOLUCAO-DE-PROBLEMAS.md)** — procurar soluções para erros comuns.


**Não é necessário instalar um programa de banco de dados no computador.** O Supabase é acessado pelo navegador. O GitHub também é acessado pelo navegador.

## 2. Versão oficial 3.0 — pronta para iniciar as partidas

A v3.0 foi a edição oficial inicial. A v3.0.1 corrigiu os diálogos e modernizou os tabuleiros. A v3.0.2 integrou os onze mapas preparados pelo mestre e a movimentação diagonal. A v3.0.3 passou a ler exclusivamente a biblioteca nova e introduziu a gestão de campanhas. A v3.0.4 corrige a exibição dos fundos ilustrados e faz o seletor de encontros, o combate e o tabuleiro usarem miniaturas individuais por criatura.

A v3.0.1 é a atualização de manutenção e experiência de mesa: corrige o fechamento dos diálogos de login e logout, redesenha os mapas como plantas superiores de salas e corredores, com entradas e saídas acessíveis, portas persistentes e Pontos de Interesse em coordenadas; a interface ocupa a largura disponível do navegador. As estátuas das miniaturas permanecem fixas.

Para instalações já conectadas ao Supabase, execute uma vez `supabase-migration-v3.0.1.sql` para liberar os pedidos remotos nos onze tabuleiros. Em instalações novas, use o `supabase-schema.sql` atualizado. Preserve seu `config.js`; não apague nem recrie tabelas ou campanhas.

## 2. O que está incluído na versão 2.10.2 (base visual preservada)

### v2.10.2 — cenário ilustrado e miniaturas móveis
- O tabuleiro recebe uma imagem contínua de cenário; não usa mais uma imagem de terreno por quadrado.
- Grade transparente 10 × 8 para coordenadas e seleção de destino.
- Miniaturas podem ser arrastadas pelo mestre; cada jogador pode arrastar a própria peça.
- Clique em uma casa continua disponível para mover/solicitar movimento.
- Colisões, portas fechadas, ocupação, névoa e limite de movimento permanecem ativos.
- Fundos ilustrados adaptados para os mapas dos cinco reinos e das cavernas.
- Miniaturas derrotadas deixam de bloquear o movimento.
- O pacote não requer migração de banco de dados.

## 2.2. Versão 2.11 — miniaturas de mesa

- Oito classes jogáveis recebem imagens próprias de miniaturas em resina cinza, com base e fundo transparente.
- Aventureiros usam aro azul; monstros comuns, aro vermelho; elites, aro violeta; chefes, aro dourado e escala visual maior.
- O Goblin das Cinzas recebe uma peça escultórica própria. As outras criaturas usam silhuetas vetoriais sombreadas e base de mesa; chefes conhecidos têm formas específicas.
- A lista lateral mostra a miniatura, o HP, a coordenada e a marca de chefe/elite. Arma, armadura e escudo equipados são indicados por pequenos marcadores na base; ainda não alteram a escultura da peça.
- As imagens das classes foram renderizadas a partir dos STL fornecidos como referência. O navegador usa PNG, não carrega STL e não requer suporte 3D.
- Bases de monstros grandes e chefes podem ocupar de 2×1 a 3×3 casas; posicionamento e caminho respeitam toda a área da base. Equipamentos aparecem como detalhes visuais estáticos sobre as miniaturas.
- Não há alterações no Supabase; nenhuma migração SQL é necessária. Preserve `config.js`.

## 2.1. Conteúdo herdado da versão 2.10

### v2.10 — manual de iniciação e preparação de encontros

- Novo livro de iniciação, com explicações para mestres e jogadores sem experiência prévia.
- Preparação de encontros com seleção de até seis monstros e dados individuais de HP, posição e iniciativa.
- Novos mapas de cavernas: Umbrafunda, Gruta das Brasas e Abismo de Cristal.
- Instruções de uso da Cena Interativa e das missões diretamente na interface.
- Manual em PDF e Markdown, guia de encontro e adendo do Livro do Mestre.
- A v2.10 preparou o suporte a encontros com várias criaturas, mas conservou a apresentação anterior do tabuleiro; o redesenho visual foi aplicado na correção v2.10.2.
- A v2.10 não exige migração SQL; preserve seu `config.js`.
- A função SQL `create_campaign` deixa de depender de `gen_random_bytes`, evitando falha quando `pgcrypto` está instalado em um schema fora do `search_path`.
- Para bancos já instalados, execute `supabase-migration-v2.9.sql` no SQL Editor do Supabase.
- Para projetos novos, use o `supabase-schema.sql` atualizado.
- `config.js`, tabelas, campanhas e dados existentes são preservados. Nenhuma tabela é apagada ou recriada.

### Novidades da v2.8 — cenas exploráveis e biblioteca ampliada

- Cena de exploração com grade 5×4 e marcador da companhia; o mestre controlador move o grupo por passos narrativos.
- Objetos interativos contextuais por mapa: portas, baús e mecanismos em Eldoria, Drakmor, Nivéria, Thalassor, Solária e ruínas.
- Estado de portas, baús e mecanismos persistido em `worldExploration.objectStates`; baús abertos não podem ser abertos novamente pelo mesmo estado da campanha.
- Posição da companhia salva por região em `worldExploration.positions`.
- NPCs revelados apresentam localização sugerida em uma rotina cíclica conforme o turno narrativo. A rotina é uma sugestão de cena, não simulação autônoma em tempo real.
- Interações validadas pelo mestre controlador, registradas no diário e publicadas como evento de sessão.
- Sete livros da biblioteca receberam um capítulo novo: Mestre, Bestiário, Chefes, Atlas, Grimório, Arsenal e Manual do Aventureiro.
- Livro do Mestre atualizado em PDF separado, com regras de exploração, objetos, NPCs, cenas e preparação de encontros.
- Nenhuma migração SQL necessária; dados adicionados ao JSON da campanha.
- A tela de acesso, criação de conta e início da campanha não foi reformulada nesta versão, conforme planejamento da próxima etapa.

### Novidades da v2.7 — exploração interativa — exploração interativa

- Painel de exploração contextual com pontos de interesse: tavernas, oficinas, mercados, santuários, bibliotecas, portos, templos, forjas e ruínas.
- Cada ponto abre uma descrição e uma pista narrativa. O mestre controlador pode registrar a descoberta; o registro é salvo no estado da campanha e no diário.
- NPCs já revelados aparecem em uma lista de personagens do mundo e podem ser abertos para diálogo, mantendo as escolhas persistentes existentes.
- O mestre pode gerar acontecimentos de viagem e exploração, como caravana em apuros, rumores, mercador itinerante, trilha bloqueada e pedido de socorro. O evento ativo fica visível para todos e salvo na campanha.
- O mestre pode conduzir a companhia entre os mapas regionais disponíveis; a viagem atualiza localização, narração, mapa ativo e diário.
- Os ambientes de chefe continuam integrados ao fluxo de encontro existente: o mestre pode iniciar o combate quando a narrativa levar a um confronto.
- Os dados novos usam `worldExploration` dentro do estado JSON da campanha; nenhuma migração SQL é necessária.

### Novidades da v2.6 — cenários ilustrados durante a campanha

- A narração da sessão apresenta uma paisagem contextual de acordo com a localização atual e o mapa ativo.
- O mapa tático mostra uma faixa ilustrada para a região ou ambiente selecionado.
- Seis cenários em WebP estão incluídos em `assets/scenes/`: vila de Eldoria, forja de Drakmor, arquivos de Nivéria, porto de Thalassor, templo de Solária e ruínas antigas.
- As imagens são locais, carregadas sob demanda e não exigem serviço externo.
- Nenhuma migração SQL é necessária; as imagens não alteram o estado salvo das campanhas.

### Novidades da v2.5 — atlas visual e Livro do Mestre

- Os cinco reinos agora possuem ilustrações próprias em WebP, exibidas na página inicial e na etapa de escolha da origem do personagem.
- Os cartões mostram paisagem, elemento, descrição e afinidade de cada reino; o layout se adapta a computadores, tablets e celulares.
- As imagens ficam em `assets/realms/` e são servidas localmente junto com o site, sem depender de serviços externos de imagem.
- O Livro do Mestre recebeu uma edição independente em PDF A4, com capa, sumário, 12 capítulos e dois apêndices.
- O PDF contém revelações de campanha e deve permanecer privado. Não coloque o arquivo PDF em um repositório público do GitHub Pages. Ele é entregue separadamente do pacote do site.
- Nenhuma migração SQL é necessária.

### Recursos mantidos da v2.4 — espólios, relíquias e equipamentos exclusivos

- **Drops por criatura:** monstros deixam materiais relacionados à sua região e natureza, como couro de lobo, cinza viva, coral abissal, cristais niverianos e escamas ancestrais.
- **Recompensas por dificuldade:** cada participante recebe ouro ao vencer; chefes e criaturas de nível elevado têm chances ampliadas de espólios raros.
- **Equipamentos exclusivos:** Malgor, Devorador das Marés, Titã Primordial, Rainha de Cristal, Arconte Solar, Colosso da Umbra e outros chefes possuem tabelas próprias de recompensas.
- **Relíquias e itens Míticos:** o Broto da Raiz Eterna e o Coração de Vharzun entram no sistema de espólios, além de peças Míticas vinculadas a chefes lendários.
- **Conjuntos completos:** Cinzas Forjadas, Guardião das Marés e Titã Primordial possuem três peças e bônus mecânico de conjunto, além de um efeito especial descrito no inventário.
- **Entrega automática:** XP, ouro e itens são entregues aos participantes registrados no encontro; o espólio é marcado no estado da campanha para evitar repetição após reconexão normal.
- **Forja integrada:** Fragmentos de Forja e Essências Arcanas também podem ser obtidos em combate e guardados para aprimoramentos.
- **Biblioteca ampliada:** os livros do Mestre, Bestiário, Chefes, Arsenal e Manual do Aventureiro receberam orientações sobre recompensas.
- **Banco de dados:** nenhuma migração SQL nova é necessária; os novos dados ficam no estado JSON da campanha.

### Novidades da v2.3 — forja, aprimoramentos e encantamentos

- **Forja funcional:** o mestre ativo pode aprimorar armas, armaduras e escudos equipados até +3. Cada nível concede +5 ao atributo principal da peça.
- **Encantamentos:** Precisão (+5 ataque) e Chama (+5 dano) para armas; Guardião (+5 Defesa) para armaduras e escudos. Cada peça aceita um encantamento.
- **Materiais:** Fragmento de Forja (180 PO) e Essência Arcana (320 PO) disponíveis no mercado.
- **Custos:** aprimoramentos +1/+2/+3 custam 1/2/3 Fragmentos e 700/1.400/2.100 PO; encantamento custa 2 Essências e 1.200 PO.
- **Persistência:** nível de aprimoramento e encantamento ficam gravados no estado de equipamento da campanha, sem alteração de schema SQL.
- **Segurança de operação:** somente o mestre controlador pode executar; recursos são validados antes de serem consumidos. Equipamentos não são destruídos por falha.

### Novidades da v2.2 — progressão até o nível 50 e raridades poderosas

- Limite de personagem ampliado do nível 20 para o nível 50.
- XP para o próximo nível: nível atual × 100; cada nível concede +10 HP e +1 ponto no atributo principal, até o limite 30.
- Escala de raridade aplicada mecanicamente: Comum +1, Incomum +3, Raro +10, Épico +25, Lendário +100 e Mítico +150. Armas recebem bônus de ataque e dano; armaduras e escudos recebem Defesa.
- Conjuntos completos concedem bônus adicionais de ataque e Defesa conforme a raridade.
- Novas armas e armaduras Épicas e Lendárias, incluindo o conjunto Celestial de Elyndra.
- Nove monstros/chefes de progressão tardia, do nível 12 ao nível 50; Vharzun é o chefe final nível 50 com três fases.
- Encontros ajustam HP, Defesa, ataque e XP ao nível médio do grupo; chefes recebem resistência adicional.
- **Atualização obrigatória do Supabase:** execute `supabase-migration-v2.2.sql` uma vez no SQL Editor se o banco já existia. Instalações novas devem usar o `supabase-schema.sql` atualizado.

### Conteúdo mantido da v2.1 — raridades e conjuntos de equipamento

- Itens Raros com bônus reais de precisão, dano e Defesa.
- Requisitos mínimos de nível e restrições por classe, validados ao equipar.
- Conjunto Vanguarda com três peças: ao equipar arma, armadura e escudo, concede +1 Defesa e +1 no ataque.
- Novas opções no mercado: Lâmina e Peitoral da Vanguarda, Broquel da Vanguarda, Arco da Lua Prateada e Foco da Aurora.
- Inventário apresenta bônus de ataque, raridade e progresso do conjunto.
- O cálculo de combate considera os bônus de equipamento sem exigir migração SQL.

### Histórico v2.0 — equipamento funcional

- Três missões secundárias inéditas: **As Lanternas de Brumafolha**, **O Guardião sem Memória** e **A Maré de Pedra**.
- Três criaturas novas com fichas de combate, habilidades especiais e silhuetas vetoriais: Mariposa do Véu, Vigia das Ruínas e Colosso de Sal.
- Derrotas dessas criaturas atualizam automaticamente os objetivos correspondentes quando a missão está aceita e o mestre controlador valida a vitória.
- Três cenas narrativas preparadas para Eldoria, Nivéria e Thalassor.
- Sexto capítulo adicionado a cada um dos sete livros, com orientações mais avançadas para mestre, jogadores, exploração, magia, criaturas e equipamentos.
- Campanhas antigas recebem as novas missões por identificador, sem apagar o progresso existente.
- Nenhuma migração SQL nova; o conteúdo adicional usa o JSONB `game_state` já existente.

**Limites conhecidos na v2.5:** durabilidade e reparos ainda não foram implementados. Os efeitos especiais textuais das relíquias e conjuntos são conduzidos pelo mestre, enquanto os bônus numéricos são automáticos. O mercado não vende equipamentos exclusivos de chefes. As verificações desta entrega são estáticas; não foi realizado teste multiplayer real contra o Supabase.

Consulte `GUIA-EQUIPAMENTOS-RARIDADES-CONJUNTOS-V2.1.md` para entender raridades, requisitos, bônus e conjuntos. Para os fundamentos do comércio, consulte também `GUIA-EQUIPAMENTOS-FUNCIONAIS-V2.0.md`.

- Mercado com quatro equipamentos funcionais: Espada de Aço (1d8), Machado de Guerra (1d10), Cota Reforçada (+3 Defesa) e Broquel de Ferro (+1 Defesa).
- Equipar e retirar peças pela Central do Mestre; peças substituídas retornam à mochila.
- Defesa efetiva considera Destreza, armadura e escudo; arma equipada fornece o dado-base de dano.
- Equipamento salvo em `partyState` por jogador e refletido nas miniaturas do mapa.
- Sétimo capítulo em cada um dos sete livros.
- Nenhuma migração SQL; campanhas antigas usam seu equipamento já existente como padrão.

### Novidades da v1.8 — diálogos persistentes e comércio

- Ilyra, Tovin e Irmão Cael possuem escolhas de conversa que o mestre controlador pode registrar.
- A campanha guarda `dialogueChoices`, `storyFlags` e entradas no diário para preservar as decisões. Uma escolha é registrada por NPC nesta edição.
- A Central do Mestre inclui comércio: compra de consumíveis/utilidades e venda unitária de itens comuns elegíveis para um personagem escolhido.
- Compras e vendas atualizam ouro e mochila em `partyState` e são registradas no diário/eventos.
- Nenhuma migração SQL.

**Limites da v1.8:** as escolhas ainda não alteram missões ou finais automaticamente; o comércio não equipa ou vende equipamentos/itens de missão. Veja o guia v1.8 para o procedimento completo.

### Conteúdo mantido da v1.7 — mapas, recompensas e livros

- Quatro mapas táticos regionais: Recife das Vozes (Thalassor), Galeria Prismática (Nivéria), Altar do Sol Partido (Solária) e Cidadela de Braseiro (Drakmor).
- Quatro cenas preparadas para apresentar esses locais.
- Três criaturas novas com fichas e silhuetas vetoriais próprias: Caranguejo-Catedral, Sentinela Prismática e Acólito do Sol Partido.
- Objetivos de missões podem avançar quando o mestre controlador confirma a derrota das novas criaturas.
- Missões selecionadas agora possuem entrega de recompensas: o mestre adiciona moedas e itens aos inventários dos personagens participantes; o registro evita repetir a entrega.
- Cada um dos sete livros recebe um quinto capítulo de consulta.
- Nenhuma migração SQL; os novos dados usam o JSON de campanha já existente.

**Limites das recompensas:** apenas `main-01` a `main-07`, `side-01`, `side-04`, `side-05` e `side-06` possuem pacotes automáticos. A missão final `main-08` e as demais secundárias continuam com entrega manual. XP por conclusão de missão também continua manual; o botão distribui apenas moedas e itens.

**Como funciona a progressão:** a missão precisa estar aceita/ativa e o mestre controlador precisa validar a derrota. Objetivos de investigação, exploração, diálogo e escolhas continuam sob controle do mestre.

**Sobre os livros:** cada volume possui cinco capítulos de consulta, mas ainda não é uma obra completa diagramada. PDFs editoriais, ilustrações próprias por capítulo e tabelas completas ainda precisam ser desenvolvidos. O Livro do Mestre continua no frontend e não deve armazenar segredos privados.

### Recursos preservados da v1.6 — campanha e progressão

- Oito missões principais e sete secundárias, com arcos até Drakmor e a Prisão Celestial.
- A derrota de criaturas específicas pode concluir objetivos correspondentes automaticamente quando a missão estiver ativa.
- O NPC Brann atualiza o objetivo de apresentação da missão de Drakmor.
- Cenas narrativas para a Cidadela de Braseiro, Forja dos Juramentos, acampamento de Malgor e Prisão Celestial.

### Novidades da v1.4 — equipamento e combate aprimorados

- Armas, armaduras e escudos podem receber raridade (`comum`, `incomum`, `raro`, `epico` ou `lendario`) e cor visual correspondente na miniatura. A raridade pode ser informada no próprio objeto do item como `rarity` ou `raridade`.
- A cor do equipamento no mapa acompanha a raridade; itens também podem definir uma cor personalizada no campo `color`.
- Monstros exibem uma pequena barra de HP diretamente sobre a peça do mapa; a barra acompanha o HP compartilhado da campanha.
- Drakthar recebe efeitos de aura diferentes nas fases avançadas e uma reação de sopro flamejante quando a ação do chefe é identificada como ataque de área/chamas.
- A peça do monstro permanece no mapa após a derrota para exibir a animação de queda; o painel de combate também sinaliza a vitória.
- Barras de vida do encontro mudam de aparência quando a criatura está ferida ou em estado crítico.
- As animações respeitam `prefers-reduced-motion`.
- Nenhuma migração SQL nova: os dados de raridade são metadados opcionais nos objetos de equipamento existentes.

### Recursos preservados da v1.3 — combate reativo

- Miniaturas do mapa reagem ao resultado de ações: ataque, habilidade/magia, cura, erro e dano recebido.
- O alvo atingido recebe uma reação visual; ataques de área do chefe podem destacar todos os aventureiros afetados.
- As reações são acionadas a partir dos eventos compartilhados de combate, para que cada participante conectado veja o mesmo tipo de resposta visual ao receber o evento.
- As animações são temporárias e não alteram HP, dano, iniciativa ou regras do combate.
- Respeita `prefers-reduced-motion`.

### Recursos preservados da v1.2 — equipamento e criaturas

- Equipamento inicial (arma, armadura e escudo, quando equipado) é representado visualmente nas miniaturas do tabuleiro.
- Goblin das Cinzas, Lobo Cinzento, Espectro da Ruptura, Campeão Orc e Drakthar recebem silhuetas vetoriais próprias no mapa.
- Criaturas possuem ciclos de postura diferentes, com destaque especial para o espectro e o dragão.
- A interface respeita `prefers-reduced-motion`.

### Recursos preservados da v1.1 — miniaturas articuladas

- Os aventureiros no mapa tático agora usam miniaturas vetoriais de corpo inteiro, com cabeça, tronco, braços, pernas, capa e arma em partes separadas.
- Ciclos de movimento e postura de combate variam entre exploração e encontro ativo.
- As oito classes possuem paletas visuais próprias.
- As animações respeitam `prefers-reduced-motion` e não exigem imagens externas ou migração SQL.
- Os retratos WebP continuam sendo usados nas fichas, biblioteca, NPCs e painéis de personagem.

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

**Limites importantes:** a conta só sincroniza campanhas criadas/participadas no Supabase. Campanhas criadas anteriormente no modo local (`localStorage`) não são enviadas automaticamente à nuvem. A sessão visitante é temporária e fica vinculada à aba atual; ao encerrar a aba, o acesso visitante deixa de ser recuperável. Ao escolher **Salvar progresso**, o jogador vincula esse acesso a um e-mail, confirma o endereço e define uma senha. Em outro dispositivo, pode entrar diretamente na conta permanente, mesmo que antes tenha testado o jogo como visitante naquele aparelho. O acesso visitante temporário desse aparelho é substituído e não bloqueia o login da conta.

### Personagens, NPCs e criaturas ilustrados (v0.9)

- Retratos WebP próprios para as oito classes jogáveis: Guerreiro, Arcano, Patrulheiro, Paladino, Assassino, Clérigo, Druida e Invocador.
- Retratos para os três NPCs da primeira aventura: Ilyra Avelorn, Tovin Ferromar e Irmão Cael.
- Retratos para cinco criaturas do bestiário inicial, incluindo Drakthar, o Devorador.
- Os retratos aparecem na criação de personagens, prévia da ficha, participantes do lobby, painel do personagem, miniaturas do mapa e cartões de combate.
- Seleção de encontros com cartões ilustrados, atributos e habilidades.
- Inventário com identificação visual do personagem e slots de equipamento mais destacados.
- Efeitos visuais e sonoros para ataques físicos, habilidades, curas e ações de monstros.
- Imagens locais na pasta `assets/portraits`; o jogo não depende de hospedagem externa para carregar retratos.

### Exploração visual (base v0.7, aprimorada na v0.9)

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

Depois de publicar o site, abra também [GUIA-LOGIN-E-PROGRESSO.md](GUIA-LOGIN-E-PROGRESSO.md) para configurar login, confirmação de e-mail e URLs de retorno. **Visitantes são temporários; contas salvas podem entrar em qualquer aparelho.** Se um aparelho já foi usado como visitante, escolha “Já tenho uma conta” e entre com as credenciais existentes.

### Passo B — GitHub Pages

Abra [GUIA-GITHUB-PAGES-DO-ZERO.md](GUIA-GITHUB-PAGES-DO-ZERO.md). O guia explica como criar um repositório, enviar os arquivos para a raiz e ativar Pages.

### Passo C — Primeira partida

Abra [CHECKLIST-DA-PRIMEIRA-PARTIDA.md](CHECKLIST-DA-PRIMEIRA-PARTIDA.md). Teste primeiro como mestre e depois com um segundo navegador como jogador.

## 6. Qual arquivo SQL devo executar?

Escolha **somente o caminho que corresponde à situação do seu banco**:

| Situação | O que executar |
|---|---|
| Projeto Supabase novo, sem tabelas de Aethra | Execute somente `supabase-schema.sql` que acompanha a v1.0. |
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

1. Baixe o ZIP da versão nova (v2.4).
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
| `supabase-schema.sql` | Instalação completa do banco, atualizado para a progressão v2.2. |
| `supabase-migration-v2.2.sql` | Atualiza a RPC de XP de bancos existentes para nível 50 e +10 HP por nível. |
| `supabase-migration-v0.3.sql` | Atualiza banco v0.2 para v0.3. |
| `supabase-migration-v0.4.sql` | Atualiza banco v0.3 para v0.4. |
| `supabase-migration-v0.5.sql` | Ajusta o estado inicial de campanhas novas em banco v0.4, sem alterar campanhas existentes. |
| `supabase-migration-v0.6.sql` | Adiciona a função segura de solicitação de movimento para mapas táticos. |
| `supabase-migration-v0.7.sql` | Adiciona a função segura de solicitação de abertura de portas e inspeção de altares. |
| `assets/portraits/preview-sheet.jpg` | Folha de contato com os retratos do projeto. |
| `assets/portraits/` | Retratos WebP das classes, NPCs e criaturas utilizados na v0.9, v1.0, v1.1 e v1.2. |
| `GUIA-PERSONAGENS-NPCS-CRIATURAS.md` | Guia dos retratos, miniaturas, criaturas e substituição de imagens. |
| `GUIA-MAPA-E-EXPLORACAO.md` | Manual dos mapas, movimentos, névoa, objetos e interações. |
| `GUIA-LOGIN-E-PROGRESSO.md` | Vincular e-mail, criar senha, entrar em outro aparelho e recuperar a conta. |
| `GUIA-DA-PRIMEIRA-AVENTURA.md` | Roteiro para conduzir a primeira aventura, usar o painel narrativo e consultar as limitações atuais. |
| `CHANGELOG.md` | Histórico das versões. |
| `REGRAS-DE-COMBATE.md` | Regras de combate e criaturas, incluindo as fases de chefe da v1.0. |
| `GUIA-CHEFES-E-FASES.md` | Guia de funcionamento e teste das fases de Drakthar. |
| `GUIA-MINIATURAS-ARTICULADAS.md` | Referência histórica das miniaturas vetoriais antigas; não descreve o modelo estático atual. |
| `GUIA-EQUIPAMENTOS-E-CRIATURAS-V1.2.md` | Explica a representação visual dos equipamentos e monstros no tabuleiro. |
| `GUIA-SUPABASE-DO-ZERO.md` | Tutorial do Supabase para iniciantes. |
| `GUIA-GITHUB-PAGES-DO-ZERO.md` | Tutorial de publicação no GitHub Pages. |
| `CHECKLIST-DA-PRIMEIRA-PARTIDA.md` | Lista de conferência para a primeira sessão. |
| `TESTE-MULTIPLAYER.md` | Roteiro de testes em vários navegadores. |
| `SOLUCAO-DE-PROBLEMAS.md` | Diagnóstico de problemas comuns. |

## 11. Testes técnicos realizados nesta entrega

Foram executadas verificações locais de sintaxe JavaScript (`node --check app.js`), integridade estrutural do CSS, referências dos retratos locais e integridade do pacote ZIP. Também foram conferidos os pontos de entrada da mecânica de fases de Drakthar. Não foi feito teste visual completo em navegador nem teste multiplayer com Supabase real nesta entrega.

Antes de usar uma campanha importante, siga o roteiro de teste e confirme os resultados com pelo menos dois navegadores.

## 12. Documentação oficial útil

- [Supabase — criar conta e começar](https://supabase.com/docs)
- [Supabase — SQL Editor](https://supabase.com/docs/guides/database/overview)
- [Supabase — API keys](https://supabase.com/docs/guides/getting-started/api-keys)
- [Supabase — usuários anônimos](https://supabase.com/docs/guides/auth/auth-anonymous)
- [Supabase — pausa de projetos gratuitos](https://supabase.com/docs/guides/platform/free-project-pausing)
- [GitHub — configurar a origem do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 13. Novidades herdadas da versão 0.9 — movimento e combate visual

A v0.9 aprimora a linguagem visual dos mapas táticos sem alterar o formato do banco de dados. As peças de aventureiros recebem animação de repouso e respiração sutil; peças selecionadas recebem uma aura; criaturas recebem animação de postura; e, durante encontros ativos, o tabuleiro utiliza uma apresentação de combate. Os efeitos de ataque físico, magia, cura e ação de monstro foram refinados com animações próprias.

As animações são efeitos 2D feitos com CSS sobre retratos WebP. Não são spritesheets quadro a quadro, esqueletos 2D, modelos 3D ou captura de movimento.

## 14. Versão 1.1 — miniaturas articuladas

A versão 1.1 evolui a apresentação do mapa tático com miniaturas vetoriais articuladas. Cada aventureiro é desenhado com partes corporais separadas e ciclos CSS de movimento, postura e arma. A mecânica de Drakthar em três fases, introduzida na v1.0, permanece preservada.

### Chefe em três fases
- **Fase I — O Devorador desperta:** estado inicial, Defesa 18 e bônus de ataque +8.
- **Fase II — As escamas se incendeiam:** ativada quando o HP chega a 66% ou menos; Defesa 19 e bônus de ataque +9.
- **Fase III — Fúria do Dragão Ancião:** ativada quando o HP chega a 33% ou menos; Defesa 20 e bônus de ataque +10.
- O Sopro das Cinzas pode ser usado uma vez em cada fase, quando o resultado natural do D20 do monstro for 17 ou mais: 2d8+4, 3d8+6 e 4d8+8, respectivamente, atingindo todos os aventureiros vivos.
- O painel de batalha mostra a fase atual, sua descrição e quantos sopros foram utilizados. A transição ocorre após ataques de jogadores e dano manual ou validado pelo mestre.

### Banco de dados e atualização
- **Nenhuma migração SQL é necessária na v1.1.** As miniaturas são renderizadas no navegador e não criam tabelas nem campos no Supabase.
- Banco novo: execute `supabase-schema.sql` e siga o guia do Supabase.
- Banco existente: preserve o projeto Supabase, a Project URL e a Publishable key; atualize os arquivos do site e envie a pasta `assets/portraits/` completa.
- Não substitua seu `config.js` por um arquivo de exemplo vazio. Faça uma cópia de segurança antes de publicar.

### Limites conhecidos desta edição
- As peças dos jogadores no mapa usam miniaturas vetoriais articuladas com ciclos CSS. Ainda não são spritesheets quadro a quadro, rigs 2D profissionais, modelos 3D ou captura de movimento. Retratos WebP permanecem nas fichas e demais painéis.
- O conteúdo completo dos sete livros, os capítulos seguintes da campanha e novos mapas ilustrados continuam no planejamento editorial.
- Multiplayer, login, e-mails de recuperação e sincronização precisam ser validados no projeto Supabase real do grupo. As verificações locais não substituem esse teste integrado.

Para instruções específicas do novo chefe, consulte [GUIA-CHEFES-E-FASES.md](GUIA-CHEFES-E-FASES.md).

---

## 15. Versão 1.2 — equipamentos visíveis e criaturas vetoriais

A v1.2 adiciona camadas visuais para arma, armadura e escudo às miniaturas dos personagens, usando o equipamento registrado na ficha. Cinco monstros recebem silhuetas vetoriais próprias no tabuleiro: Goblin das Cinzas, Lobo Cinzento, Espectro da Ruptura, Campeão Orc e Drakthar. As criaturas possuem ciclos CSS de postura diferentes.

- A arte é uma representação estilizada por classe e tipo de equipamento; não reproduz individualmente cada item cosmético ou raridade.
- Os retratos WebP continuam nas fichas e no bestiário.
- Não foram alteradas tabelas, políticas ou funções do Supabase. Nenhuma migração SQL é necessária.
- Foram verificadas sintaxe JavaScript, estrutura CSS, presença das cinco criaturas vetoriais, camadas de equipamento e integridade do ZIP. Não foi realizado teste visual completo em navegador nem teste multiplayer com Supabase real.

**Reino de Aethra v2.5 — atlas ilustrado e Livro do Mestre em PDF.**


## 16. Versão 1.4 — equipamento e combate aprimorados

A v1.4 acrescenta leitura visual de raridade aos itens equipados, barras de HP nas peças de monstros, estados visuais para chefes em fases avançadas e animação de derrota. A raridade é um metadado opcional do item e não altera atributos, dano, defesa ou regras. Consulte `GUIA-EQUIPAMENTOS-E-COMBATE-V1.4.md` para aplicar esses metadados e compreender os limites da atualização.


## 17. Versão 1.5 — campanha expandida e livros

A v1.5 acrescenta cinco missões principais, quatro secundárias e seis monstros ao bestiário, cobrindo novos arcos em Thalassor, Nivéria e Solária além da expansão do mistério em Eldoria. Os sete livros da Biblioteca recebem capítulos iniciais de consulta. Em campanhas antigas, novas missões são anexadas sem substituir o progresso anterior. O mestre ainda precisa apresentar missões, marcar objetivos e entregar recompensas manualmente; a progressão automática por eventos de combate e inventário completo ficam para versões futuras. Nenhuma migração SQL é necessária.

A biblioteca agora possui conteúdo inicial escrito, mas os volumes completos, ilustrações editoriais e PDFs diagramados continuam pendentes. Consulte `GUIA-CAMPANHA-BESTIARIO-LIVROS-V1.5.md`.


## 18. Versão 1.6 — progressão narrativa e novos arcos

A v1.6 amplia a crônica para oito missões principais e sete secundárias, introduz Drakmor como novo arco jogável e acrescenta seis criaturas ao bestiário. A derrota de inimigos associados a objetivos pode atualizar automaticamente o diário da campanha, desde que a missão esteja ativa e o mestre ativo valide o encontro. O novo NPC Brann também atualiza o objetivo de apresentação da missão de Drakmor. Os sete livros recebem um quarto capítulo de consulta cada.

A automação é intencionalmente limitada a eventos claros e identificáveis; objetivos de exploração, investigação, itens, escolhas e conclusão dos capítulos continuam manuais. Não há migração SQL nesta versão. Consulte `GUIA-CAMPANHA-BESTIARIO-LIVROS-V1.6.md`.


## 19. Versão 1.7 — mapas regionais e recompensas

A v1.7 acrescenta quatro mapas táticos regionais: Recife das Vozes (Thalassor), Galeria Prismática (Nivéria), Altar do Sol Partido (Solária) e Cidadela de Braseiro (Drakmor). Cada mapa tem terreno, bloqueios e posições iniciais para a companhia. Também foram adicionadas cenas narrativas correspondentes.

O bestiário recebe Caranguejo-Catedral, Sentinela Prismática e Acólito do Sol Partido, com fichas e habilidades. A derrota das criaturas mapeadas pode avançar objetivos de missões secundárias e principais.

Quando uma missão com pacote automático estiver concluída, o mestre pode entregar a recompensa à companhia pelo botão exibido na missão. O jogo acrescenta moedas e itens ao inventário compartilhado de cada personagem participante e registra a entrega no diário. A marca `rewardClaimed` impede uma segunda entrega pela mesma missão. Nem todas as missões possuem pacote automático; nesses casos, o mestre continua responsável pela entrega manual. XP de conclusão de missão ainda deve ser distribuído manualmente.

Cada um dos sete livros passa a ter cinco capítulos de consulta. Não há migração SQL: o estado adicional fica no JSON da campanha já existente.


## 20. Versão 1.8 — diálogos, decisões e comércio

A v1.8 acrescenta escolhas de conversa para Ilyra, Tovin e Irmão Cael. O mestre ativo registra a escolha; o texto, a bandeira narrativa e a entrada no diário são salvos no estado da campanha. As decisões permanecem visíveis ao reabrir o diálogo e sincronizam pelo mesmo mecanismo de estado já usado pela campanha.

A Central do Mestre ganhou acesso ao comércio. O mestre seleciona o aventureiro e registra compras de poções, rações, tochas e kit de explorador, ou vende uma unidade de item comum elegível. O saldo e a mochila são atualizados em `partyState`, e cada transação entra no diário e no fluxo de eventos. Itens de missão e equipamentos são protegidos contra venda nesta edição.

**Limites da v1.8:** as escolhas ainda não alteram automaticamente missões, mapas ou finais; elas gravam bandeiras narrativas para uso em futuras expansões. O comércio é conduzido pelo mestre ativo e não inclui equipar armas/armaduras, reparar itens, impostos ou negociação automática. Não há nova migração SQL.


## 21. Versão 1.9 — aventuras e biblioteca ampliadas

A v1.9 acrescenta três missões secundárias e três criaturas com fichas e silhuetas próprias. Quando o mestre controlador valida a derrota de uma criatura nova, o objetivo correspondente avança apenas se a missão estiver aceita. As cenas novas podem ser escolhidas na Central do Mestre.

Cada um dos sete livros recebe um sexto capítulo de consulta. O conteúdo continua integrado ao leitor interno do jogo; não são PDFs ou arquivos editoriais separados. As recompensas das novas missões permanecem sob entrega manual do mestre. Nenhuma migração SQL é necessária.


## 22. Versão 2.0 — equipamento funcional e progressão mecânica

A v2.4 acrescenta tabelas de espólio por monstro, recompensas em ouro, relíquias e equipamentos exclusivos de chefes. A v2.3 acrescenta a forja de equipamentos, materiais e encantamentos. A v2.0 transforma equipamentos comprados em itens utilizáveis. A v2.1 acrescenta requisitos e conjuntos; a v2.2 amplia a raridade de Comum a Mítico, leva a progressão ao nível 50 e introduz novos chefes. O mercado oferece Espada de Aço (1d8), Machado de Guerra (1d10), Cota Reforçada (+3 Defesa) e Broquel de Ferro (+1 Defesa). O mestre ativo seleciona o aventureiro no comércio, compra o item e pode equipar ou retirar peças diretamente na seção de equipamento. O inventário mostra os espaços ocupados, o dano-base da arma e a Defesa efetiva.

O equipamento ativo fica salvo em `game_state.partyState` por jogador, junto com inventário e moedas, e portanto acompanha a sincronização da campanha já existente. O cálculo de Defesa considera Destreza, armadura e escudo. A arma fornece o dado-base de dano para o fluxo de combate existente; não há ainda um sistema completo de proficiências, durabilidade, encantamentos ou comparação automática de DPS.

Os sete livros recebem um sétimo capítulo sobre campanha ramificada, encontros ajustados ao equipamento, comércio regional, magia defensiva e regras de equipamento. Nenhuma migração SQL é necessária.


## 3. Versão 2.11 — peças de mesa para personagens, monstros e chefes

A v2.11 substitui as figuras vetoriais simplificadas dos aventureiros por miniaturas renderizadas em PNG com fundo transparente, base escultural e leitura clara em visão superior inclinada. As oito classes jogáveis recebem uma peça visual distinta: Guerreiro, Arcano, Patrulheiro, Paladino, Assassino, Clérigo, Druida e Invocador.

- As imagens das classes foram renderizadas a partir de modelos STL fornecidos pelo usuário e adaptadas para imagens PNG leves; os arquivos STL originais não são incluídos no pacote.
- Goblin das Cinzas recebe uma miniatura escultórica própria. As demais criaturas continuam com silhuetas vetoriais originais, agora com sombreamento e base de mesa; chefes recebem escala maior e base com aro dourado.
- Aros: azul para aventureiros, vermelho para criaturas hostis, violeta para criaturas de elite e dourado para chefes.
- Lista lateral de peças mostra miniaturas, posição, HP e marcação especial de chefes.
- Não foi alterado o modelo de dados do Supabase; nenhuma migração SQL é necessária. Preserve `config.js` ao atualizar o site.

Consulte `GUIA-MINIATURAS-DE-MESA-V2.12.md` para a relação das peças, cores, regras visuais, bases ampliadas e limitações conhecidas.


## Versão 2.12 — estátuas de mesa e bases ampliadas

A v2.12 preserva as miniaturas estáticas das oito classes e melhora a leitura de monstros e chefes como estátuas de RPG de mesa. Armas, armaduras e escudos equipados aparecem como detalhes visuais sobre a estátua e usam a cor da raridade. As criaturas continuam com aparências próprias associadas ao identificador do Bestiário.

Chefes e criaturas grandes reservam a área inteira de suas bases: exemplos incluem bases 2×2, 3×2 e 3×3. O início do encontro procura espaço livre para cada base; movimento e caminho também verificam todas as casas ocupadas. Se a base não couber no mapa, o sistema informa o tamanho exigido. As estátuas são estáticas, sem animações ou posturas alternativas. Nenhuma migração SQL é necessária.

Consulte `GUIA-MINIATURAS-DE-MESA-V2.12.md` e `ADENDO-MINIATURAS-E-BASES-MULTICELULARES-V2.12.pdf`.

44. **[NOTAS-DE-LANCAMENTO-V3.0.2.md](NOTAS-DE-LANCAMENTO-V3.0.2.md)** — mapas importados e movimentação diagonal.
45. **[GUIA-DE-ATUALIZACAO-V3.0.2.md](GUIA-DE-ATUALIZACAO-V3.0.2.md)** — instalação da v3.0.2.
46. **[CHECKLIST-PUBLICACAO-V3.0.2.md](CHECKLIST-PUBLICACAO-V3.0.2.md)** — verificações após publicar.


## Gestão de campanhas e mapas v3.0.3

A configuração oficial dos mapas é carregada de `assets/maps/maps-data.js` e das imagens em `assets/maps-v3/`. Os arquivos de mapa antigos foram removidos do pacote para impedir mistura de configurações. Para instalações existentes, execute `supabase-migration-v3.0.3.sql` uma única vez no SQL Editor do Supabase. O criador/mestre pode excluir a campanha; o mestre pode remover participantes jogadores; cada jogador pode sair voluntariamente. A ficha do jogador fica arquivada e é restaurada se ele retornar à campanha pelo código.

**Documentos v3.0.3:** `NOTAS-DE-LANCAMENTO-V3.0.3.md`, `GUIA-DE-ATUALIZACAO-V3.0.3.md`, `CHECKLIST-PUBLICACAO-V3.0.3.md` e `supabase-migration-v3.0.3.sql`.


## Correções v3.0.4 — fundos e miniaturas do bestiário

- O fundo dos 11 mapas é carregado como imagem real por baixo da grade; a regra CSS que escondia a imagem deixou de se aplicar a mapas ilustrados.
- A biblioteca `assets/maps/maps-data.js` continua sendo a fonte única dos mapas, com os arquivos de imagem em `assets/maps-v3/`.
- As URLs dos fundos e miniaturas recebem cache-buster `v3.0.4`, evitando que o navegador continue mostrando arquivos anteriores.
- O seletor “Iniciar Encontro” e o cartão do combate deixam de reutilizar retratos de personagens. Cada um dos 32 monstros/chefes tem um arquivo de miniatura próprio.
- As 10 miniaturas raster já existentes foram preservadas; 22 criaturas têm miniaturas vetoriais monocromáticas independentes, com pedestal e silhuetas específicas. Vharzun possui imagem própria de dragão ancião.
- Não há nova migração SQL nesta atualização. Preserve `config.js` e publique por inteiro `assets/maps-v3/` e `assets/minis/`.

**Documentos v3.0.4:** `NOTAS-DE-LANCAMENTO-V3.0.4.md`, `GUIA-DE-ATUALIZACAO-V3.0.4.md` e `CHECKLIST-PUBLICACAO-V3.0.4.md`.
