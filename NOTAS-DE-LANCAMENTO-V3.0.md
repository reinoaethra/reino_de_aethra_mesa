# Reino de Aethra — Notas de lançamento v3.0

A v3.0 é a edição de lançamento para iniciar as partidas. Ela consolida os sistemas desenvolvidos até a v2.12 e corrige fluxos essenciais de acesso, criação e combate.

## O que mudou

### Acesso visitante e conta permanente
- A autenticação agora usa armazenamento separado: sessões anônimas ficam em `sessionStorage` (escopo da aba); contas permanentes ficam em `localStorage`.
- O acesso visitante deixa de restaurar automaticamente a campanha depois que a aba é encerrada; identificadores antigos de campanha em armazenamento persistente são descartados para não serem atribuídos a outro visitante.
- A opção **Salvar progresso** continua vinculando o visitante à identidade permanente, preservando campanhas e fichas daquele acesso. A confirmação por e-mail e a definição de senha permanecem etapas obrigatórias conforme a configuração do Supabase.
- Um visitante pode escolher **Já tenho uma conta** e entrar mesmo que tenha criado ou acessado uma campanha temporária naquele aparelho. O contexto visitante e os dados locais temporários são descartados e as campanhas da conta permanente são carregadas.
- Dados locais antigos de visitante que ainda estavam em `localStorage` são descartados na primeira abertura da v3.0, em vez de serem recuperados por um visitante novo. Se a identidade visitante antiga ainda estiver ativa na aba durante a atualização, campanhas sincronizadas no Supabase continuam vinculadas a ela até o fim dessa sessão. Registros que já chegaram ao Supabase podem permanecer no banco sem uma sessão de visitante recuperável; não foi adicionada rotina administrativa de limpeza.

### Criação e janelas
- Criação de campanha e salvamento de ficha agora fecham explicitamente a janela depois da confirmação de sucesso, inclusive no fluxo sincronizado com Supabase.
- Adicionado fechamento de janelas pela tecla `Esc`.
- Erros de validação e gravação continuam mantendo a janela aberta para que o jogador possa corrigir os dados.

### Combate e turnos
- A ordem de iniciativa não oferece turno a personagens sem HP.
- Ações atrasadas, enviadas para o turno errado ou destinadas a encontros já encerrados recebem uma rejeição clara em vez de ficarem sem resposta.
- O servidor de jogo (instância mestre ativa) valida o alvo, o estado do alvo, o HP do aventureiro e o uso de poções/habilidades de cura.
- Poções e habilidades de cura não são consumidas quando o personagem já está com HP completo.
- A derrota completa do grupo é registrada separadamente da vitória contra os monstros; o mestre recebe uma indicação clara e pode encerrar o encontro.
- Efeitos de acerto crítico e ataque evitado ganharam sinalização visual própria.

### Miniaturas e acabamento visual
- As miniaturas do mapa permanecem como estátuas estáticas, sem animações de respiração, postura ou deslocamento corporal. Movimento de tabuleiro e efeitos breves de impacto/aura permanecem separados da estátua.
- Mantidos os cenários ilustrados, equipamentos visíveis, miniaturas com bases, bases multicelulares, chefes, grade tática e demais artes locais existentes.

## Compatibilidade e instalação
- Substitua os arquivos do site pelos arquivos desta edição.
- **Preserve seu `config.js` atual**: ele contém a URL e a chave pública do projeto Supabase.
- Não há migração SQL obrigatória nesta versão. O estado adicional de combate utiliza o JSON da campanha existente.
- Recomenda-se publicar todos os arquivos juntos, sem misturar `app.js`/`styles.css` de versões diferentes.
- Consulte `GUIA-DE-LANCAMENTO-V3.0.md` para o fluxo de mestre, jogador e conta.

## Observações de validação
- Foram realizadas verificações estáticas de sintaxe JavaScript, integridade dos arquivos, referências locais e estrutura do pacote, além de testes unitários direcionados às regras de turno e armazenamento de sessão.
- Não foi possível validar a autenticação contra o projeto Supabase real nem realizar uma partida multiplayer real com suas credenciais. Por isso, o checklist de primeira partida abaixo deve ser executado após a publicação no seu domínio.
