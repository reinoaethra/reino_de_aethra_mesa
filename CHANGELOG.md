## v0.6 — Mapas táticos e exploração compartilhada

- Quatro mapas 2D em grade: Estrada de Eldoria, Vila de Brumafolha, Torre dos Vigias e Santuário das Raízes.
- Grade 10 × 8 com tipos de terreno e obstáculos que bloqueiam movimento.
- Peças para aventureiros e criatura ativa, com posições iniciais específicas para cada mapa e casas livres conectadas para a companhia.
- Mestre pode selecionar qualquer peça e reposicioná-la; jogador solicita movimento da própria peça.
- Pedidos de movimento aguardam aprovação/recusa do mestre e deixam de aparecer como pendentes após a decisão, inclusive depois de recarregar a campanha.
- Validação de caminho por busca de menor rota, ocupação de casa e limites de movimento.
- Movimento ortogonal de até 4 casas no turno de combate; sem diagonais.
- Névoa de guerra com revelação manual do mestre e descoberta de área ao redor das peças.
- Baús escondidos que concedem 15 moedas de ouro e armadilhas escondidas que causam 5 HP de dano ao serem acionadas.
- Ouro visível no painel do personagem e inventário.
- Mapas, peças, marcadores e névoa salvos em `campaigns.game_state`.
- Função RPC `request_map_move` para validar identidade do jogador, estado da sessão, mapa e limites de coordenadas antes de registrar o pedido.
- Guia de uso dos mapas e documentação de instalação atualizada.

# Histórico de versões — Reino de Aethra

## v0.5 — Primeira aventura, missões, NPCs e diário

- Primeiro capítulo estruturado: Ecos na Estrada de Eldoria.
- Quadro de missões principal e secundária, com objetivos e estados.
- Painel do mestre para aceitar missões e marcar objetivos concluídos.
- Objetivo de derrotar Goblins das Cinzas concluído automaticamente após a vitória do encontro.
- Apresentação de NPCs: Ilyra Avelorn, Tovin Ferromar e Irmão Cael.
- Fichas públicas de NPCs acessíveis aos jogadores após revelação.
- Cinco cenas preparadas que preenchem capítulo, local e narração.
- Diário persistente de descobertas e alterações narrativas.
- Informações de jornada guardadas no JSONB `campaigns.game_state`; não são criadas tabelas ou funções novas.
- Migração SQL v0.5 ajusta o estado inicial de campanhas novas em bancos que já estavam na v0.4, sem alterar campanhas existentes.
- Documentação da primeira aventura e roteiro de testes narrativos.

## v0.4 — Combate por turnos, itens e progressão inicial

- Atributos aplicados aos cálculos de ataque, HP e Defesa.
- Equipamentos iniciais por classe: arma, armadura e, em algumas classes, escudo.
- Habilidade especial própria para cada uma das oito classes iniciais.
- Habilidades especiais utilizáveis uma vez por encontro.
- Ordem de iniciativa para aventureiros e monstro.
- Ações de turno: ataque básico, habilidade especial e Poção de Cura.
- Turno do monstro com ataques e habilidades simples específicas para Goblin das Cinzas, Lobo Cinzento e Drakthar.
- HP do grupo e do monstro persistidos no estado da campanha.
- Recompensa de XP para personagens que participaram do encontro.
- Progressão até o nível 20: +5 HP máximo e +1 no atributo principal por nível.
- Registro de XP por encontro para impedir recompensas duplicadas.
- Correção na progressão: derrotar uma criatura sem subir de nível não restaura indevidamente todo o HP; cada nível recupera apenas os 5 HP adicionais concedidos.
- Limite defensivo para manter o nível máximo em 20 no processamento de XP.
- Serialização no banco para impedir duas respostas quase simultâneas ao mesmo teste ou turno.
- Painel de combate e ordem de iniciativa sincronizados.
- Migração SQL da v0.3 para v0.4.
- Documentação reescrita para iniciantes, com instalação do Supabase do zero, publicação no GitHub Pages, checklist, regras, testes e solução de problemas.

## v0.3 — Primeira camada de experiência multiplayer

- Chat ao vivo compartilhado pela sala.
- Solicitações de D20 direcionadas a um jogador ou a todos.
- Validação no banco do identificador da solicitação e do jogador autorizado.
- Proteção contra respostas duplicadas ao mesmo D20.
- Recuperação de respostas pendentes após reconexão.
- Re-sincronização da campanha ao recuperar conectividade.
- Presença por aba e eleição da aba mestre ativa.
- Migração SQL para atualizar uma instalação v0.2 sem apagar as campanhas.

## v0.2 — Base multiplayer

- Campanhas compartilhadas no Supabase.
- Lobby com presença e criação de personagens.
- Estado da campanha salvo e retomável.
- D20, encontro e aprovação de dano.

## v0.1 — Fundação visual

- Identidade visual inicial.
- Navegação, campanhas locais, personagens e estrutura da biblioteca.
