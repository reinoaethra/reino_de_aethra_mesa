# Guia de exploração interativa — Reino de Aethra v2.7

A versão 2.7 acrescenta uma camada de exploração narrativa aos cenários ilustrados da v2.6. Não é necessário executar SQL nem alterar o `config.js`.

## 1. Painel de exploração

Durante uma sessão, abaixo das missões aparece o painel **Lugares e personagens**. Os pontos disponíveis dependem do mapa ativo. O jogador pode abrir um ponto de interesse para ler sua descrição e uma pista narrativa.

Pontos incluídos:

- **Vila de Brumafolha / Estrada de Eldoria:** Taverna do Carvalho Antigo, Oficina do Ferreiro e Mercado da Praça.
- **Santuário das Raízes:** templo antigo com inscrições sobre as cinco luzes.
- **Recife das Vozes:** Cais das Marés e Mercado da Praça.
- **Galeria Prismática:** Biblioteca de Cristal.
- **Altar do Sol Partido:** Templo do Sol Partido.
- **Cidadela de Braseiro:** Forja dos Juramentos e Oficina.
- **Torre dos Vigias:** Ruínas da Torre dos Vigias.

## 2. Registrar descobertas

Qualquer participante pode abrir e ler os pontos. Para alterar o estado persistente da campanha, o **mestre controlador** abre o ponto e escolhe **Registrar descoberta**. A descoberta é gravada em `worldExploration.discovered`, incluída no histórico e registrada no diário. O mesmo ponto não pode ser registrado novamente.

A descoberta é narrativa: ela não entrega automaticamente itens ou completa objetivos de missão. O mestre continua responsável por validar consequências, recompensas e progresso de objetivos.

## 3. NPCs

Quando o mestre revela um NPC pela ferramenta de gerenciamento da jornada, ele passa a aparecer em **Personagens neste mundo**. Todos podem abrir a ficha narrativa. As escolhas de diálogo continuam limitadas ao mestre controlador e usam o sistema persistente já existente.

## 4. Eventos de viagem

O mestre controlador pode selecionar **Gerar evento de viagem**. O sistema escolhe um acontecimento narrativo, como caravana em apuros, rumores na taverna, sinal no céu, mercador itinerante, trilha bloqueada ou pedido de socorro. O evento aparece para todos e fica salvo como evento ativo; o mestre pode encerrá-lo depois da resolução.

Os eventos não iniciam combate, concedem recompensas ou concluem missões automaticamente. O mestre decide como resolver a situação e pode usar as ferramentas existentes para narrar, iniciar encontro, atualizar missão e entregar recompensa.

## 5. Viajar entre regiões

Na parte inferior do painel, o mestre controlador encontra os destinos disponíveis. Ao selecionar um, a campanha atualiza localização, narração, mapa ativo e diário. Os mapas táticos continuam independentes e mantêm seus próprios registros de exploração.

## 6. Persistência e compatibilidade

Os dados novos ficam no campo `worldExploration` do JSON `game_state`. Não há alteração no schema ou nas RPCs do Supabase. Campanhas antigas recebem os valores padrão quando necessário. Preserve o `config.js` existente ao substituir os arquivos do site.

## 7. Limites desta versão

- Os pontos de interesse são hotspots narrativos em painel, não personagens com navegação livre em cenário 3D.
- Os eventos são ganchos para o mestre, não encontros automáticos.
- As arenas de chefes usam os cenários e mapas existentes; o mestre inicia o encontro pela ferramenta de combate.
- Foi feita validação estática de código e pacote. Não foi realizado teste visual real em navegador nem teste multiplayer com Supabase.
