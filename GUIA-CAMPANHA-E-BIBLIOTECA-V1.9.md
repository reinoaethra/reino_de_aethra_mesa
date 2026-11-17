# Guia de campanha e biblioteca — Reino de Aethra v1.9

A v1.9 expande a campanha e os sete livros internos. A atualização mantém o estado de campanha JSON já utilizado pelo jogo e **não exige nova migração SQL**.

## 1. Novas missões secundárias

| Missão | Região | Objetivos de combate | Recompensa descrita |
|---|---|---|---|
| As Lanternas de Brumafolha | Eldoria | Derrotar a Mariposa do Véu | 108 XP por herói e materiais narrativos |
| O Guardião sem Memória | Nivéria | Desativar o Vigia das Ruínas | 96 XP por herói e registro histórico |
| A Maré de Pedra | Thalassor | Derrotar o Colosso de Sal | 185 XP por herói e 100 PO para a companhia |

As três missões entram como disponíveis nas campanhas antigas. O mestre deve apresentá-las e aceitá-las pelo painel **Jornada e missões**. Objetivos de combate só avançam quando a missão está aceita e o mestre controlador valida a derrota da criatura correspondente.

## 2. Novas criaturas

- **Mariposa do Véu:** fera espectral ágil, nível 6, 112 HP, Defesa 16, 108 XP. Sua Poeira de Torpor pode impor uma complicação temporária após um acerto elevado.
- **Vigia das Ruínas:** construto guardião, nível 5, 126 HP, Defesa 16, 96 XP. Seu Selo de Contenção pode reduzir o deslocamento do alvo.
- **Colosso de Sal:** elemental costeiro, nível 8, 194 HP, Defesa 18, 185 XP. Sua Onda Cristalina pode empurrar um aventureiro.

Os valores são referências para o mestre; ajuste-os ao nível, tamanho e recursos da companhia. As habilidades especiais são orientações narrativas e devem ser anunciadas de forma clara antes de aplicar efeitos relevantes.

## 3. Cenas preparadas

Na Central do Mestre, selecione uma das novas cenas: **Trilha das Lanternas** (Eldoria), **Ala Esquecida dos Arquivos** (Nivéria) ou **Enseada do Sal** (Thalassor). O texto é uma sugestão editável antes de publicar a cena para todos.

## 4. Biblioteca — sexto capítulo

Cada livro recebeu um capítulo avançado:

- Livro do Mestre: improvisação e caminhos alternativos.
- Bestiário: composição de encontros por função.
- Grandes Chefes: sinais de ataques e janelas de resposta.
- Atlas: pontos de interesse e exploração de localidades.
- Grimório: uso narrativo e limites da conjuração.
- Arsenal: manutenção, cargas e itens especiais.
- Manual do Aventureiro: planejamento e gestão de recursos.

Abra a Biblioteca e selecione qualquer livro. Os capítulos aparecem em sequência no leitor interno. Eles são material de consulta dentro do jogo, não PDFs diagramados.

## 5. Atualizar a publicação

1. Baixe e extraia `reino-de-aethra-v1.9.zip`.
2. Publique os arquivos no mesmo repositório GitHub Pages da versão anterior.
3. Preserve seu `config.js`: ele contém a URL e a chave pública do projeto Supabase.
4. Não execute um SQL novo para esta versão.
5. Entre com a mesma conta e retome a campanha existente.

## 6. Compatibilidade e limites

As novas missões são mescladas pelo identificador, preservando status e objetivos já existentes. Os dados continuam no campo `game_state` já usado pela campanha. As recompensas das três missões novas não são entregues automaticamente; o mestre deve conceder XP, moedas e itens segundo a descrição e as regras da mesa.

Foram realizadas verificações locais de sintaxe, estrutura, referências e integridade do ZIP. Não foi realizado teste visual em navegador nem teste multiplayer real contra um projeto Supabase; esses testes dependem da publicação e das credenciais configuradas pelo usuário.
