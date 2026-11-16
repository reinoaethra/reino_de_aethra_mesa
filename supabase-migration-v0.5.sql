-- REINO DE AETHRA — migração Supabase v0.5
-- Execute somente em um banco que já recebeu o esquema da v0.4.
-- Esta migração altera apenas o valor padrão usado por CAMPANHAS NOVAS.
-- Campanhas existentes, personagens, eventos e progresso não são modificados.

begin;

alter table public.campaigns
  alter column game_state set default
  '{"chapter":"Capítulo I — Ecos na Estrada","location":"Estrada Esquecida de Eldoria","narration":"A chuva fina desenha linhas na poeira da estrada. Pegadas profundas seguem em direção à antiga torre de vigia. Entre as árvores, um sino toca uma única vez — embora a vila esteja distante.","encounter":null,"started":false,"turn":1,"notes":[],"activeRollPrompt":null,"partyState":{},"quests":[],"revealedNpcIds":[],"journalEntries":[]}'::jsonb;

commit;

-- As missões padrão são apresentadas pela aplicação para campanhas antigas.
-- Quando o mestre fizer a primeira alteração narrativa, o estado será salvo no game_state.
