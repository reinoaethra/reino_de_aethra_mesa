# Guia da Central do Mestre — Reino de Aethra v4.0.0

## 1. Para que serve

A Central do Mestre reúne os controles usados para preparar e conduzir a sessão. Ela não substitui a interpretação do mestre nem decide a história sozinha: apresenta atalhos para consultar o estado da companhia e executar operações frequentes.

O painel resume:

- quantos participantes estão online;
- quantas missões estão ativas;
- se existe encontro em andamento e quantas criaturas permanecem;
- capítulo atual;
- próxima sessão preparada, quando houver.

## 2. Preparar a próxima sessão

Use **Preparar próxima sessão** para registrar o que o mestre pretende apresentar depois: cenas, locais, NPCs, desafios, pistas, encontros e recompensas. O campo fica no estado compartilhado da campanha, mas a interface o apresenta apenas na Central do Mestre.

**Atenção:** por estar no JSON compartilhado da campanha, esse texto não é um cofre criptográfico. Um membro com acesso direto aos dados da campanha poderia consultar o estado JSONB. Não registre senhas, informações pessoais ou segredos que exijam sigilo técnico. Para informações realmente privadas, use **Anotações secretas**, que ficam apenas no armazenamento local deste navegador.

## 3. Resumo da sessão

Use **Registrar resumo da sessão** ao terminar ou em uma pausa importante. O texto vai para o Diário da Crônica e fica visível a todos os participantes. Salvar um resumo não encerra a sessão: use o comando próprio para pausar/encerrar a sessão quando quiser retornar ao salão.

## 4. Decisões narrativas

1. Abra **Criar decisão narrativa**.
2. Escreva uma pergunta clara e ofereça duas ou três opções.
3. Para cada opção, informe o que os jogadores sabem e uma consequência prevista.
4. Publique a decisão.
5. Cada jogador registra um voto. Cada usuário só pode votar uma vez naquela decisão.
6. A Central mostra a contagem. O mestre confirma uma opção; em caso de empate, pode escolher a opção que conduzirá a história.
7. A opção confirmada e sua consequência entram no histórico/Diário e recebem um `storyFlag`.

A aplicação não conclui automaticamente qualquer missão relacionada à decisão. O mestre deve revisar os objetivos e atualizar a jornada quando a consequência realmente ocorrer.

## 5. Condições de combate

Abra **Condições de combate** durante um encontro ativo e escolha um aventureiro ou monstro. Selecione a condição, a duração em turnos do próprio alvo e, se necessário, uma observação.

- **Atordoado:** perde a próxima ação; a condição é consumida quando chega o turno do alvo.
- **Envenenado:** -2 no ataque enquanto durar.
- **Queimando:** sofre 1d4 de dano ao terminar o próprio turno.
- **Congelado:** -2 na Defesa.
- **Enfraquecido:** causa 2 pontos a menos de dano.
- **Marcado:** recebe +2 de dano dos próximos ataques enquanto durar.
- **Enraizado:** não pode se deslocar.

A condição é persistida com o estado da campanha. O mestre ainda deve narrar a aparência e a consequência ficcional do estado.

## 6. Ataque em área

Abra **Ataque em área**, selecione o centro por coordenada, o raio em casas, o dano fixo e o escopo. O raio usa distância de grade em que diagonal conta como uma casa. Bases grandes são atingidas se qualquer casa de sua área cair dentro do raio.

- **Somente inimigos:** aplica dano às criaturas posicionadas no raio.
- **Todos:** aplica dano às criaturas e aos aventureiros posicionados no raio.

A aplicação considera somente combatentes com peças no tabuleiro. Se nenhum token estiver na área, nada é aplicado. O mestre define o dano e deve conferir se o efeito é apropriado à habilidade narrada.

## 7. Memória dos NPCs

Selecione um NPC e ajuste confiança entre -100 e +100. Adicione lembranças, promessas ou acontecimentos. Os registros ajudam o mestre a manter coerência entre sessões; nesta edição não modificam automaticamente preços, diálogos, testes ou disponibilidade de missões.

As memórias ficam no estado compartilhado da campanha, não em armazenamento secreto. Evite inserir dados sensíveis.

## 8. Distribuir tesouro

Escolha o personagem destinatário, informe ouro e/ou item, quantidade e descrição. O inventário e o saldo são atualizados na campanha e o evento é registrado no Diário. A distribuição manual é individual; os pacotes automáticos de recompensas de missão e encontro já existentes continuam separados.

## 9. Anotações secretas

As anotações secretas são armazenadas no `localStorage` deste navegador, associadas à campanha e ao usuário. Não são enviadas ao Supabase nem incluídas no backup compartilhado. Se trocar de aparelho, exporte ou copie essas anotações separadamente antes de perder acesso ao navegador.

## 10. Marcos e conquistas

A seção **Marcos de Aethra** acompanha vitórias, criaturas derrotadas, chefes, decisões, recompensas e espécies. Conquistas e títulos são registros da campanha, não substituem o nome ou os dados permanentes da ficha vinculada à conta.

## 11. Backup e restauração

- Exporte o backup ao fim de uma sessão relevante e antes de atualizações importantes.
- Armazene o JSON em local seguro, fora da pasta pública do GitHub Pages.
- Para restaurar, abra a campanha correspondente, selecione o arquivo e confirme.
- O código da campanha é conferido antes da restauração.
- O backup restaura o estado compartilhado. Não altera autenticação, contas, papéis de membros, fichas permanentes vinculadas à conta ou anotações secretas locais.

## 12. Efeitos sonoros

Abra **Configurações** e use o controle de efeitos sonoros. O padrão é desligado. A opção é local a cada navegador, não é sincronizada com a campanha e pode ser desativada a qualquer momento. Os sons são gerados pelo navegador, sem arquivos de áudio externos.
