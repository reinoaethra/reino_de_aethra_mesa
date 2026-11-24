# Guia de recursos — Reino de Aethra v4.1.0

Este guia explica como usar as novidades sem alterar a maneira como a companhia já conduz as aventuras.

## 1. Preparar uma sessão

1. Abra a campanha no **Salão dos Aventureiros**.
2. Na **Sala de preparação**, confira quem está online, quem possui ficha e quem marcou **Estou pronto**.
3. Cada jogador pode marcar ou desmarcar sua própria prontidão.
4. Se houver uma chamada externa configurada, use **Abrir Discord/WhatsApp/Google Meet** para entrar na mesma sala de voz.
5. O mestre escolhe **Iniciar sessão**. Se houver jogadores ainda não marcados como prontos, o sistema apresenta um aviso; o mestre pode aguardar ou confirmar o início mesmo assim.

Ao iniciar, a campanha cria um ponto de restauração. Ao pausar a sessão pelo botão de encerramento, outro ponto é criado antes de voltar ao salão.

## 2. Testes inteligentes de D20

O mestre abre **Teste inteligente D20** na Central do Mestre ou usa o atalho do Modo Chamada.

- **Quem rola:** escolha um jogador ou todos os jogadores.
- **Formato:** individual, coletivo ou resistido.
- **Atributo:** escolha Força, Destreza, Constituição, Inteligência, Sabedoria, Carisma ou uma perícia relacionada.
- **CD:** informe a dificuldade quando houver uma meta definida.
- **Bônus/penalidade:** use apenas para modificadores adicionais à ficha.
- **Vantagem/desvantagem:** o sistema rola dois D20 e usa o maior ou o menor resultado.
- **Resultado:** escolha se o resultado será público ou reservado ao mestre.

### Teste individual

O jogador recebe a solicitação e toca em **Responder ao D20**. O jogo soma o D20, o modificador da ficha e o bônus extra; se houver CD, indica sucesso ou falha.

### Teste coletivo

Todos os jogadores selecionados recebem a mesma solicitação. Com CD, a linha do tempo apresenta quantos superaram a dificuldade e se a maioria teve sucesso. Sem CD, apresenta a média dos resultados.

### Teste resistido

Os jogadores rolam e o sistema compara os totais. Se o mestre selecionar um monstro vivo no campo **Oponente**, o sistema também rola o D20 da criatura com seu bônus de ataque. Em caso de empate, o mestre define a consequência.

### Teste reservado

O valor e os dados individuais ficam no armazenamento local do navegador do mestre. Outros aparelhos não recebem esses números. Mantenha o navegador e os dados locais do mestre se precisar consultar o resultado depois.

## 3. Marcas no Mapa Tático

O mestre seleciona uma ferramenta:
- **Atenção:** chama o olhar para uma casa.
- **Perigo:** sinaliza uma região arriscada.
- **Rota:** sugere um caminho.

Depois, toca na casa desejada. Jogadores podem usar **Marcar atenção** em uma casa revelada para solicitar que o mestre destaque aquela posição. A marca só aparece para todos depois de confirmada pelo mestre.

As marcações são específicas do mapa selecionado. O sistema mostra marcações recentes por até seis horas; o estado mantém no máximo 24 marcas. Use **Limpar marcas** para retirar todas as marcações da campanha.

## 4. Linha do tempo

Abra **Linha do tempo** na Central do Mestre ou no painel do Diário. Você pode:
- pesquisar por palavra;
- filtrar cenas, descobertas, missões, decisões, combate, resumo, recompensa, ações de voz, testes e marcas do mapa;
- exportar os registros em arquivo `.txt`;
- como mestre, salvar um resumo dos últimos acontecimentos no estado da campanha.

A linha do tempo foi feita para fatos públicos da aventura. Não coloque segredos em registros compartilhados. As anotações secretas permanecem locais no navegador do mestre.

## 5. Bestiário e encontros preparados

Abra **Bestiário interativo** pela Biblioteca ou pela Central do Mestre.

1. Pesquise o nome, tipo ou habilidade de uma criatura.
2. Selecione o cartão para consultar arte, descrição e atributos.
3. Como mestre, adicione tipos à **Composição do encontro**.
4. A composição aceita até seis tipos distintos de criatura.
5. Use **Iniciar encontro** para começar ou **Salvar composição** para reutilizar a seleção.

As composições salvas são vinculadas à campanha: todos os mestres autorizados a controlar a sessão veem os mesmos modelos. É possível guardar até 30 composições. O modelo atual salva os tipos selecionados, não a quantidade de cópias de cada tipo.

## 6. Assistente do jogador

Na lateral da sessão, abaixo da ficha resumida, abra **Ajuda rápida — como jogar com minha ficha?**. O painel relembra:
- como agir durante a exploração;
- como acompanhar a iniciativa;
- como responder a um D20;
- onde acessar ficha, inventário e habilidades.

Ele não substitui o mestre nem decide o que o personagem fará.

## 7. Pontos de restauração

Somente o mestre ativo administra os pontos.

1. Abra **Pontos de restauração** na Central do Mestre.
2. Use **Criar ponto agora** antes de uma decisão arriscada ou mudança importante.
3. Consulte a data e o motivo dos três pontos mais recentes.
4. Use **Restaurar** no ponto desejado e confirme a substituição do estado atual.

O sistema cria pontos ao iniciar/pausar a sessão e também antes de determinadas alterações importantes se já passou o intervalo de segurança.

**O que é restaurado:** o estado de jogo armazenado na campanha — por exemplo, capítulo, exploração, encontro, missões, dados da sessão e informações de campanha.

**O que não é restaurado:** contas, membros, papéis/permissões e histórico externo de eventos. Faça um backup externo completo antes de restaurar um ponto.

## 8. Dados e sincronização

As novas estruturas são guardadas no `game_state` existente da campanha. Por isso, campanhas anteriores continuam válidas e não é necessário executar SQL. O `config.js` e as pastas `assets/` devem permanecer como estão.
