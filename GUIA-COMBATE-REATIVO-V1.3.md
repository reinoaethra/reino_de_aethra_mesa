# Guia de combate reativo — versão 1.3

## O que muda

Durante um encontro, as miniaturas do mapa recebem respostas visuais temporárias quando um evento de combate é recebido:

- **Ataque físico:** o atacante executa um movimento curto de investida.
- **Habilidade/magia:** o atacante recebe um movimento de conjuração.
- **Cura:** o personagem recebe uma pulsação visual de recuperação.
- **Erro:** o atacante recua brevemente, indicando que o golpe não conectou.
- **Impacto:** o alvo atingido reage ao dano.
- **Ataque de monstro:** a criatura executa uma investida e o aventureiro atingido reage.
- **Ataque de área:** cada aventureiro listado entre os alvos afetados recebe a reação de impacto.

## Regras e sincronização

As animações são apenas apresentação. O cálculo de acerto, dano, cura, HP, iniciativa e fases de chefe continua no fluxo de combate existente, sob autoridade do mestre ativo. O evento compartilhado aciona as reações em cada cliente que o recebe. Se um cliente estiver desconectado durante o evento, não há garantia de reproduzir a animação retroativamente ao reconectar.

## Acessibilidade

A folha de estilos desativa as animações quando o dispositivo ou navegador solicita `prefers-reduced-motion`.

## Limitações

Esta versão usa animações CSS curtas aplicadas às miniaturas vetoriais existentes. Não são animações quadro a quadro, captura de movimento ou modelos 3D. A posição das peças no tabuleiro não é alterada pelos efeitos.

## Atualização

Substitua os arquivos do projeto pelos arquivos desta versão e preserve `config.js`. Não há migração SQL para a v1.3.
