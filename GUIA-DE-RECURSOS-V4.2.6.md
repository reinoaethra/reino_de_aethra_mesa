# Guia de recursos — Reino de Aethra v4.2.6

## Dados tridimensionais

A rolagem de D20 e o Rolador Universal usam agora uma cena tridimensional WebGL.

### Dados disponíveis

| Dado | Geometria apresentada |
|---|---|
| D4 | Tetraedro (4 faces triangulares) |
| D6 | Cubo (6 faces quadradas) |
| D8 | Octaedro (8 faces triangulares) |
| D10 | Trapezoedro pentagonal (10 faces) |
| D12 | Dodecaedro (12 faces pentagonais) |
| D20 | Icosaedro (20 faces triangulares) |

Cada modelo é construído pelo código, não é um sprite ou uma imagem achatada. O visual usa corpo metálico escuro, arestas douradas, placas numeradas nas faces, iluminação de estúdio e um tabuleiro escuro.

### Etapas visuais de cada rolagem

1. O sistema calcula o resultado normalmente, usando as regras já existentes.
2. O resultado e a semente da animação são preparados.
3. O visualizador cria os dados 3D apropriados e os lança na cena.
4. A física aplica gravidade, impulso, rotação e colisões com o tabuleiro e outros dados.
5. Depois da sequência fixa de simulação, cada dado se acomoda na posição final e orienta para cima a face correspondente ao resultado oficial.
6. O quadro inferior apresenta o resultado: natural no D20; fórmula, valores individuais e soma no Rolador Universal.

A etapa de alinhamento final existe para garantir que o número exibido na face seja exatamente o valor calculado pelo jogo. A física é uma apresentação visual, não um segundo sorteio.

### Rolagens públicas

- O D20 público continua sendo publicado pelo evento `dice_result`.
- A rolagem universal pública continua sendo publicada no evento `session_note` com `kind: "dice-roll"`.
- O ID do evento ou a semente incluída na rolagem alimenta a animação. Assim, os clientes utilizam os mesmos dados, valores e parâmetros de início.
- A animação é aberta no dispositivo do jogador que rolou e nos dispositivos dos demais participantes que recebem o evento público.

### Rolagens privadas

- Rolagens reservadas ao mestre permanecem locais ao dispositivo do mestre.
- A função de visualização 3D não converte uma rolagem privada em evento público.
- O histórico privado continua armazenado conforme o mecanismo do Rolador Universal existente.

### Animação e desempenho

- Rapier executa colisões de corpos rígidos com passo fixo de 1/60 s.
- A animação 3D usa até 20 dados em uma rolagem universal.
- A densidade do renderizador é limitada a 1,35 para reduzir a carga gráfica em telas de alta resolução.
- Não há pós-processamento pesado nem sombras dinâmicas de alta resolução.
- A opção de movimento reduzido do sistema operacional reduz a duração e o movimento da animação.
- O botão **Continuar** fecha a cena após o resultado; se não for acionado, há fechamento automático.

### Requisitos

É necessário WebGL 2. O Three.js `0.187.0` é carregado por ESM CDN, e o Rapier 3D determinístico `0.21.0` é carregado quando uma rolagem inicia. A primeira rolagem pode demorar um pouco mais enquanto os módulos externos são carregados.

Se WebGL 2 ou o CDN não estiver disponível, a aplicação mostra um resumo legível com o resultado oficial em vez de desenhar um falso dado 2D. A rolagem continua válida.

## Compatibilidade preservada

A v4.2.6 mantém:
- Rolador Universal D4/D6/D8/D10/D12/D20, bônus, penalidades e registros.
- Visibilidade pública e reservada ao mestre.
- Aplicação manual do resultado como dano ou cura.
- Central de Música com arquivo, link de áudio, YouTube, volume dourado e playlist rolável.
- Exclusão de conta da v4.2.5 e proteção de titularidade das campanhas.
- Separação de informações privadas do mestre e projeção pública aos jogadores.

Não há mudança de banco de dados nesta versão.

## Página independente de pré-visualização

O arquivo `preview-dados-3d.html` é uma página de teste opcional. Depois da publicação, abra esse endereço no mesmo domínio do GitHub Pages para experimentar D4/D6/D8/D10/D12/D20, quantidades e bônus sem iniciar campanha. Os valores usam a API de aleatoriedade segura do navegador e não geram eventos no Supabase nem aparecem na Linha do Tempo.
