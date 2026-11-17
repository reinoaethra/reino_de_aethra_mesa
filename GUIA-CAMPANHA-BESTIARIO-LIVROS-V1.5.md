# Guia da expansão de campanha, bestiário e biblioteca — v1.5

## 1. O que esta versão acrescenta

A v1.5 amplia o material de campanha e inicia a produção editorial dos sete livros. Três NPCs novos — Capitã Maera Voss, Arquivista Vaelis e Oráculo Asha — passam a aparecer no painel do mestre e podem ser revelados aos jogadores. O foco é oferecer mais conteúdo jogável para o mestre e preparar a história para uma jornada mais longa pelos Cinco Reinos.

## 2. Arcos principais

| Arco | Missão | Região | Ameaças em destaque |
|---|---|---|---|
| I | Ecos na Estrada de Eldoria | Eldoria | Goblins das Cinzas, lobos e pistas na torre |
| II | As Raízes Sob a Pedra | Santuário das Raízes | Aranha de Umbrafunda e ritualistas |
| III | O Véu sobre as Marés | Thalassor | Cultista do Véu Cinzento e Sereia Abissal |
| IV | O Coração de Cristal | Nivéria | Draco de Cristal Niveriano |
| V | A Coroa do Eclipse | Solária | Cavaleiro Oco de Solária |

As missões principais II a V começam como disponíveis. O mestre apresenta cada uma no momento adequado. A ordem sugerida é narrativa, mas o mestre pode adaptar o ritmo e intercalar missões secundárias.

## 3. Missões secundárias

- **A Carga Perdida de Tovin:** recuperar ferramentas e materiais para o ferreiro.
- **Luzes entre as Copas:** seguir sinais na floresta e proteger viajantes.
- **O Sino que Não Devia Tocar:** investigar um campanário e um espírito inquieto.
- **Sal para os Afogados:** ajudar pescadores de Thalassor a investigar um naufrágio.

As recompensas descritas nas missões são propostas narrativas. O mestre registra moedas, poções e relíquias na ficha/inventário manualmente, pois a entrega automática de itens ainda não está implementada.

## 4. Novos monstros

| Criatura | Nível | HP | Defesa | XP | Papel sugerido |
|---|---:|---:|---:|---:|---|
| Aranha de Umbrafunda | 3 | 66 | 14 | 48 | Controle e emboscada em cavernas |
| Cultista do Véu Cinzento | 4 | 78 | 14 | Suporte ritualístico e marcação de alvo |
| Golem de Basalto | 5 | 132 | 17 | Guardião resistente de ruínas |
| Sereia Abissal | 6 | 116 | 16 | Controle e ameaça nas águas |
| Cavaleiro Oco de Solária | 7 | 148 | 17 | Duelista de elite ligado ao eclipse |
| Draco de Cristal Niveriano | 7 | 160 | 17 | Predador elemental e guardião da relíquia |

As fichas aparecem no seletor de encontros. Os monstros novos usam silhuetas vetoriais próprias no seletor e no mapa, sem depender de novos arquivos de imagem. Ajuste HP, dano e quantidade de inimigos ao tamanho e nível do grupo.

## 5. Os sete livros — primeira edição digital

Abra **Biblioteca** no menu superior e selecione um volume. Cada livro possui três capítulos iniciais de consulta:

1. **Livro do Mestre:** condução da crônica, estrutura dos arcos e ritmo de encontros.
2. **Bestiário de Aethra:** leitura de fichas, criaturas catalogadas e comportamento em cena.
3. **Os Grandes Chefes:** desenho de chefes, Drakthar e generais de Vharzun.
4. **Atlas dos Cinco Reinos:** origem do mundo e visão geral dos cinco territórios.
5. **Grimório das Artes Arcanas:** princípios, escolas e conjuração.
6. **Arsenal e Relíquias:** raridade, armas, armaduras, poções e relíquias.
7. **Manual do Aventureiro:** criação de herói, testes, combate e interpretação.

Esta é uma primeira edição funcional, não os livros finais. Ainda faltam capítulos extensos, tabelas completas, ilustrações editoriais, mapas próprios e PDFs diagramados. O conteúdo será ampliado em versões futuras.

**Privacidade:** o Livro do Mestre está marcado como reservado na interface, mas o conteúdo JavaScript é entregue ao navegador. Portanto, não inclua segredos de campanha, identidades secretas ou revelações que precisem de confidencialidade real. A proteção de segredos por função exigirá armazenamento e autorização no backend.

## 6. Como conduzir a progressão

1. Abra a central de jornada como mestre.
2. Apresente a missão disponível quando a narrativa chegar ao momento adequado.
3. Marque cada objetivo conforme o grupo o concluir.
4. Registre descobertas e decisões no diário.
5. Entregue manualmente as recompensas descritas.
6. Inicie o próximo arco quando desejar; a missão seguinte permanecerá disponível para ser aceita.

**Limitação atual:** derrotar um monstro não conclui automaticamente um objetivo de missão. A atualização automática por eventos, a ativação condicional de capítulos, os diálogos completos e a distribuição automática de itens ficam planejados para versões posteriores.

## 7. Atualização e compatibilidade

- Substitua os arquivos do projeto pelos arquivos da v1.5, preservando seu `config.js` configurado.
- Não execute migração SQL: esta versão não altera tabelas, políticas ou funções do Supabase.
- Campanhas existentes recebem as novas missões que ainda não possuíam. Objetivos e missões já salvos são preservados.
- Faça backup dos arquivos e da campanha antes de publicar a atualização.

## 8. Verificações e limites

A entrega foi verificada por sintaxe JavaScript, conferência estrutural de CSS, presença das missões e criaturas no código e integridade do arquivo ZIP. Não foi realizado teste visual em navegador nem teste multiplayer com Supabase real. O comportamento em campanha online deve ser validado em uma sessão de teste antes de uma partida oficial.
