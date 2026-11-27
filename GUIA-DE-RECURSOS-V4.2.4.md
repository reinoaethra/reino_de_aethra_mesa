# Guia de recursos — Reino de Aethra v4.2.4

## Dados facetados

O tema inicial segue a referência visual enviada: metal escuro, faces facetadas, arestas douradas e numeração em tom de pergaminho. Os desenhos são vetoriais (SVG) e não dependem de imagens externas.

- **D20:** utilizado nos testes solicitados e resultados públicos de combate; atravessa a tela, gira e revela a face sorteada.
- **Rolador Universal:** mostra uma representação individual de cada dado escolhido, até o limite já implementado de 20 dados por rolagem.
- **Público:** a animação aparece para participantes que recebem o evento compartilhado.
- **Reservado ao mestre:** a animação e o histórico permanecem somente no dispositivo do mestre.

O tema visual é independente da fórmula matemática; isso prepara a estrutura para futuras aparências alternativas sem alterar os resultados.

## Central de Música

- Volume geral do mestre e botões de inclusão agrupados.
- **Arquivo:** envia arquivo de áudio pela área de armazenamento já configurada (limite de 25 MB por arquivo).
- **Link:** aceita link HTTPS direto para arquivo de áudio.
- **YouTube:** aceita endereços `youtube.com/watch`, `youtu.be`, `/shorts`, `/live` e `/embed` com ID válido de vídeo.
- Playlist com rolagem interna e altura estável para não expandir a central conforme as faixas são adicionadas.
- Controles de transporte compartilhados; volume individual de cada jogador permanece local.

### YouTube: observações

A integração utiliza o player incorporado oficial do YouTube, controlado pela API IFrame. Não baixa nem extrai o áudio do vídeo. Vídeos que não aceitam incorporação, que estão privados/removidos ou sujeitos a restrições podem não tocar. Cada participante pode precisar ativar o áudio no próprio navegador uma vez.

## Compatibilidade

Esta edição mantém os recursos anteriores da v4.2.3, inclusive volume dourado compacto, Rolador Universal, mapa tático, bestiário, condições, missões, linha do tempo, estado privado do mestre e separação de permissões.
