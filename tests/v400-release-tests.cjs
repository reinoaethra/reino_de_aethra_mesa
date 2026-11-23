const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

async function main() {
  const root = path.join(__dirname, '..');
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

  assert(html.includes('v4.0.0'), 'HTML identifies the 4.0.0 edition');
  assert(html.includes('app.js?v=4.0.0') && html.includes('styles.css?v=4.0.0'), 'application and styles use the 4.0.0 cache key');
  assert(!html.includes('config.js?v=4.0.0'), 'existing config.js path remains unchanged');
  for (const feature of [
    'renderMasterCommandCenter', 'renderV4Milestones', 'applyV4Condition', 'applyV4AreaAttack',
    'validateTacticalAttack', 'validateMonsterTacticalAttack', 'recordV4EncounterMilestones',
    'grantV4Loot', 'renderV4NpcMemoryModal', 'renderV4SkillTreeModal',
    'exportCampaignBackup', 'restoreCampaignBackup', 'recordV4BranchChoice'
  ]) assert(app.includes(`function ${feature}`) || app.includes(`async function ${feature}`), `${feature} exists`);

  // Habilidades: pontos por nível, limite de trilhas e bônus sem acumular no HP-base.
  {
    const start = app.indexOf('  const SKILL_TREE_BRANCHES=');
    const end = app.indexOf('  function v4GameData(', start);
    assert(start >= 0 && end > start, 'skill tree helpers found');
    const ctx = {};
    vm.runInNewContext(app.slice(start, end) + '\nthis.skillPointsAvailable=skillPointsAvailable;this.skillBonuses=skillBonuses;this.skillTreeRanks=skillTreeRanks;', ctx);
    assert.equal(ctx.skillPointsAvailable({ level: 1, skillTree: {} }), 0);
    assert.equal(ctx.skillPointsAvailable({ level: 4, skillTree: {} }), 1);
    assert.equal(ctx.skillPointsAvailable({ level: 10, skillTree: { assault: 2 } }), 1);
    assert.deepEqual({ ...ctx.skillBonuses({ skillTree: { assault: 2, guardian: 1, arcane: 3 } }) }, {
      attack: 2, damage: 2, critical: 2, defense: 1, maxHp: 3, healingReceived: 1, healing: 6, abilityAttack: 3, abilityDamage: 3
    });
  }

  // Condições de combate: personagens atordoados perdem ações, mas não contam como derrotados.
  {
    const start = app.indexOf('  function activeCombatTurn(');
    const end = app.indexOf('  function primaryAttributeForClass(', start);
    assert(start >= 0 && end > start, 'initiative helpers found');
    const members = [
      { user_id: 'p1', role: 'player', character: { name: 'A', hp: 20, maxHp: 20 } },
      { user_id: 'p2', role: 'player', character: { name: 'B', hp: 20, maxHp: 20 } }
    ];
    const context = {
      state: { members },
      normalizeCharacter: c => c,
      cloneData: value => JSON.parse(JSON.stringify(value)),
      secureDie: () => 10,
      attrMod: () => 0,
      hasCondition: (target, id) => (target?.conditions || []).some(c => c.id === id && Number(c.remainingTurns) > 0),
      isCombatantStunned: (turn, enc, party) => context.hasCondition(turn.kind === 'player' ? party[turn.user_id] : enc.enemies.find(e => e.id === turn.id), 'stunned'),
      consumeConditionsAtTurnEnd: (enc, party, turn) => {
        const target = turn.kind === 'player' ? party[turn.user_id] : enc.enemies.find(e => e.id === turn.id);
        if (!target) return;
        target.conditions = (target.conditions || []).map(c => ({ ...c, remainingTurns: Number(c.remainingTurns) - 1 })).filter(c => c.remainingTurns > 0);
      }
    };
    vm.runInNewContext(app.slice(start, end) + '\nthis.advanceCombatTurn=advanceCombatTurn;', context);
    const encounter = {
      round: 1, turnIndex: 2,
      turnOrder: [
        { kind: 'player', user_id: 'p1', name: 'A' },
        { kind: 'player', user_id: 'p2', name: 'B' },
        { kind: 'monster', id: 'm1', name: 'Monstro' }
      ],
      enemies: [{ id: 'm1', name: 'Monstro', hp: 30, defeated: false }], defeated: false
    };
    const party = {
      p1: { hp: 20, conditions: [{ id: 'stunned', remainingTurns: 1 }] },
      p2: { hp: 20, conditions: [{ id: 'stunned', remainingTurns: 1 }] }
    };
    const next = context.advanceCombatTurn(encounter, party);
    assert.equal(next.partyDefeated, false, 'stunned heroes are not treated as defeated');
    assert.equal(next.defeated, false, 'living monster remains in the encounter');
    assert.equal(party.p1.conditions.length, 0, 'first stunned effect is consumed at the skipped turn');
    assert.equal(party.p2.conditions.length, 0, 'second stunned effect is consumed at the skipped turn');
  }

  // Decisões narrativas: um voto por jogador; a decisão só fecha quando o mestre confirma.
  {
    const start = app.indexOf('  async function processV4BranchChoiceRequest(');
    const end = app.indexOf('  async function handleIncomingEvent(', start);
    assert(start >= 0 && end > start, 'narrative vote functions found');
    const gs = { v4: { storyBranches: { active: { id: 'branch-1', question: 'Qual caminho?', options: [{ id: 'a', label: 'Ponte', consequence: 'Rota segura' }, { id: 'b', label: 'Mata', consequence: 'Rota perigosa' }], votes: {} }, history: [] }, statistics: {}, achievements: [] }, storyFlags: {}, journalEntries: [] };
    const context = {
      state: { campaign: { game_state: gs }, members: [{ user_id: 'p1', role: 'player', display_name: 'A' }, { user_id: 'p2', role: 'player', display_name: 'B' }], member: { display_name: 'Mestre' } },
      isMasterController: () => true,
      isMaster: () => true,
      cloneData: value => JSON.parse(JSON.stringify(value)),
      v4GameData: game => game.v4,
      defaultGameState: () => ({ v4: {} }),
      updateGameState: async patch => Object.assign(gs, patch),
      createEvent: async (type, payload) => ({ event_type: type, payload }),
      toast: () => {},
      recordV4StoryDecision: v4 => { v4.statistics = { ...(v4.statistics || {}), storyDecisions: (v4.statistics?.storyDecisions || 0) + 1 }; },
      applyV4Titles: () => {}
    };
    vm.runInNewContext(app.slice(start, end) + '\nthis.processV4BranchChoiceRequest=processV4BranchChoiceRequest;this.recordV4BranchChoice=recordV4BranchChoice;', context);
    await context.processV4BranchChoiceRequest({ id: 'ev1', actor_id: 'p1', payload: { branch_id: 'branch-1', option_id: 'a' } });
    await context.processV4BranchChoiceRequest({ id: 'ev2', actor_id: 'p2', payload: { branch_id: 'branch-1', option_id: 'b' } });
    await context.processV4BranchChoiceRequest({ id: 'ev3', actor_id: 'p1', payload: { branch_id: 'branch-1', option_id: 'b' } });
    assert.equal(gs.v4.storyBranches.active.selectedOptionId, undefined, 'votes do not automatically decide the branch');
    assert.equal(Object.keys(gs.v4.storyBranches.active.votes).length, 2, 'each player can vote once');
    assert.equal(gs.v4.storyBranches.active.votes.p1, 'a', 'duplicate vote does not replace the first vote');
    await context.recordV4BranchChoice('a');
    assert.equal(gs.v4.storyBranches.active.selectedOptionId, 'a', 'master confirms the final branch');
    assert.equal(gs.storyFlags['branch-branch-1-a'], true, 'confirmed branch records a story flag');
    assert.equal(gs.v4.statistics.storyDecisions, 1, 'confirmed decision increments campaign statistics');
  }

  // Ataques em área e segredos: derrota simultânea não recompensa a companhia; anotações privadas são locais.
  assert(app.includes('enc.partyDefeated=!livingParty;'), 'area attack marks party defeat even if enemies also reach zero HP');
  const aoe = app.slice(app.indexOf('async function applyV4AreaAttack('), app.indexOf('async function grantV4Loot(', app.indexOf('async function applyV4AreaAttack(')));
  assert(aoe.indexOf('if(enc.partyDefeated)') < aoe.indexOf('else if(enc.defeated)'), 'area attack prioritizes simultaneous party defeat over victory rewards');
  assert(app.includes('localStorage.setItem(key,String(text||\'\').slice(0,12000))'), 'secret notes remain in local browser storage');
  assert(app.includes('save_my_character'), 'skill tree persists through the existing character-save RPC');
  assert(app.includes('award_encounter_xp'), 'existing XP award RPC remains in use');
  assert(app.includes('update_campaign_state'), 'campaign state continues using the existing Supabase JSON state RPC');

  // Histórico: cada criatura abatida incrementa a espécie certa e não duplica o mesmo encontro.
  {
    const start = app.indexOf('  function v4GameData(');
    const end = app.indexOf('  function combatConditions(', start);
    assert(start >= 0 && end > start, 'v4 statistics helpers found');
    const gs = { v4: { statistics: { encountersWon: 2 }, processedEncounterIds: [] } };
    const context = {
      state: { campaign: { game_state: gs }, members: [] },
      defaultGameState: () => ({ v4: {} }), isMaster: () => true, isMasterController: () => true,
      cloneData: value => JSON.parse(JSON.stringify(value)), isBossTemplate: enemy => Boolean(enemy.boss),
      updateGameState: async patch => Object.assign(gs, patch),
      Date, Math, Array, Object, Number, String
    };
    vm.runInNewContext(app.slice(start, end) + '\nthis.v4GameData=v4GameData;this.recordV4EncounterMilestones=recordV4EncounterMilestones;', context);
    const encounter = { id: 'enc-stats-1', enemies: [
      { id: 'e1', templateId: 'goblin-cinzas', name: 'Goblin das Cinzas', hp: 0, defeated: true },
      { id: 'e2', templateId: 'goblin-cinzas', name: 'Goblin das Cinzas', hp: 0, defeated: true },
      { id: 'e3', templateId: 'drakthar', name: 'Drakthar', hp: 0, defeated: true, boss: true }
    ] };
    await context.recordV4EncounterMilestones(encounter);
    await context.recordV4EncounterMilestones(encounter);
    const stats = gs.v4.statistics;
    assert.equal(stats.monsterDefeats['goblin-cinzas'].count, 2, 'same species counts each defeated instance');
    assert.equal(stats.monsterDefeats.drakthar.count, 1, 'boss species is recorded separately');
    assert.equal(stats.encountersWon, 3, 'replayed encounter event does not increment victories twice');
    assert.equal(stats.monstersDefeated, 3, 'each defeated creature is included in the total');
  }

  // Áudio: desligado por padrão e preferência local ao navegador.
  {
    const start = app.indexOf("  const V4_SOUND_KEY='");
    const end = app.indexOf('  function playDiceSound()', start);
    assert(start >= 0 && end > start, 'optional sound helpers found');
    const store = new Map();
    const context = { localStorage: { getItem: key => store.get(key) || null, setItem: (key, value) => store.set(key, value), removeItem: key => store.delete(key) }, window: {}, console };
    vm.runInNewContext(app.slice(start, end) + '\nthis.gameSoundEnabled=gameSoundEnabled;this.setGameSoundEnabled=setGameSoundEnabled;this.playGameSound=playGameSound;', context);
    assert.equal(context.gameSoundEnabled(), false, 'sound is disabled on first visit');
    context.setGameSoundEnabled(true);
    assert.equal(context.gameSoundEnabled(), true, 'sound can be enabled locally');
    context.playGameSound('hit');
    context.setGameSoundEnabled(false);
    assert.equal(context.gameSoundEnabled(), false, 'sound can be disabled locally again');
  }

  // Visual and responsive additions.
  for (const rule of ['.v4-command-center', '.v4-milestones', '.v4-achievement-list', '.v4-skill-grid', '@media(max-width:760px)']) {
    assert(css.includes(rule), `responsive v4 style ${rule} exists`);
  }
  assert(app.includes('monsterAttackRange') && app.includes('validateMonsterTacticalAttack'), 'monster range and line-of-sight validation exists');
  assert(app.includes('tacticalCoverBonus'), 'cover bonus is applied to tactical attacks');
  assert(app.includes('bossSpecialPhases'), 'boss special attack phases are tracked once per phase');
  assert(app.includes('reino-de-aethra-campaign-backup'), 'campaign backup format is versioned');
  assert(app.includes('data-action=\"toggle-v4-sound\"') && app.includes('v4-defeat-history'), 'optional audio setting and species defeat history are rendered');

  console.log('Reino de Aethra v4.0.0: testes direcionados de progressão, condições, votação, recompensas e compatibilidade aprovados.');
}

main().catch(error => { console.error(error); process.exit(1); });
