# Guia de lançamento — Reino de Aethra v3.0

Esta é a edição oficial para iniciar as partidas de Reino de Aethra. O sistema mantém o mestre como responsável pela condução da sessão e os jogadores como participantes da companhia.

## Antes da primeira sessão

1. Publique todos os arquivos desta versão juntos no GitHub Pages.
2. Preserve o seu `config.js` atual, pois ele contém a URL e a chave pública do seu projeto Supabase.
3. Confirme que o Supabase tem o schema da campanha e os provedores de e-mail e acesso anônimo habilitados.
4. Abra o site, conecte-se e faça um teste de criação de campanha e ficha.
5. Use o checklist `CHECKLIST-DE-LANCAMENTO-V3.0.md` com um navegador de mestre e outro de jogador.

## Visitante ou conta permanente

**Visitante:** é uma identidade temporária, criada para experimentar o jogo sem cadastro. A sessão fica limitada à aba atual. Se fechar a aba, a sessão visitante não é restaurada na próxima visita.

**Salvar progresso:** transforma a identidade visitante em uma conta permanente. O fluxo exige e-mail confirmado e criação de senha, conforme as regras do Supabase. Mantenha a aba original aberta até concluir a confirmação e definir a senha.

**Já tenho uma conta:** permite entrar com e-mail e senha mesmo que este aparelho tenha sido usado anteriormente como visitante. O jogo descarta o contexto e os dados locais temporários do visitante naquele aparelho e carrega as campanhas associadas à conta permanente. Não é necessário salvar o visitante antigo.

Para continuar no celular uma campanha criada no computador, abra a conta no celular, escolha **Já tenho uma conta**, entre e abra a campanha na lista.

A mesma conta pode estar autenticada em mais de um aparelho. Para evitar que duas telas de mestre enviem comandos conflitantes, apenas uma instância ativa do mestre controla as ações da campanha de cada vez. Ao trocar o mestre do computador para o celular, encerre a aba da campanha no computador; o celular assume o controle quando a presença antiga sair da sala.

> Observação técnica: a sessão visitante não é restaurada quando a aba é encerrada. Dados locais antigos de visitante, gravados por versões anteriores em armazenamento permanente do navegador, são descartados na atualização para impedir que um visitante novo herde uma campanha. Registros que já foram enviados ao Supabase podem continuar no banco sem uma sessão visitante recuperável; a v3.0 não executa limpeza administrativa dessas linhas.

## Fluxo do mestre

Crie a campanha e compartilhe o código de convite com os jogadores. Quando todos tiverem entrado e criado suas fichas, confira os participantes, o mapa e os recursos iniciais. O mestre controla as cenas, inimigos, recompensas, turnos dos monstros e validações manuais.

## Fluxo dos jogadores

Entre com o código fornecido pelo mestre, escolha o nome de exibição e crie a ficha. Durante a sessão, acompanhe a ordem de iniciativa, aguarde seu turno, escolha o alvo e use ataque, habilidade ou poção. O HP, equipamento, itens, moedas e progresso ficam ligados à campanha sincronizada.

## Regras práticas de combate

- A ordem usa iniciativa; turnos de personagens sem HP e criaturas derrotadas são ignorados.
- O jogador só pode agir quando a iniciativa indicar seu turno.
- Habilidades especiais seguem as regras da classe e não podem ser reutilizadas no mesmo encontro quando marcadas como consumidas.
- Poções de cura não são gastas quando o personagem já está com HP máximo.
- Um ataque crítico (D20 natural 20) recebe o dano adicional previsto; uma falha natural 1 não acerta.
- Ações enviadas fora do turno, para um encontro encerrado ou para um alvo derrotado são recusadas com uma explicação.
- Se todo o grupo cair, o painel mostra derrota; se todos os inimigos caírem, mostra vitória.

## Limites que devem ser conhecidos

A v3.0 não substitui a configuração do Supabase nem publica o site automaticamente. Não é uma auditoria de segurança do projeto Supabase. O multiplayer depende de Realtime, tabelas, funções e políticas RLS já instaladas. Faça o checklist de lançamento e a partida de teste antes de convidar o grupo para a sessão oficial.
