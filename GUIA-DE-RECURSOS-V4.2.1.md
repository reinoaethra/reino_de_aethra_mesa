# Guia de recursos — Reino de Aethra v4.2.1

A v4.2.1 é uma correção de estabilidade para campanhas com estados grandes.

- O estado integral privado aceita até 8 MiB por gravação.
- A mensagem de erro apresenta o tamanho medido e o teto atual.
- Snapshots mantêm até três pontos, mas não carregam snapshots aninhados nem a cópia de undoHistory.
- O histórico de desfazer ativo continua no estado corrente e permanece limitado a oito alterações.
- Todas as funcionalidades da v4.2.0 permanecem: segurança público/privado, Cena Interativa com publicação controlada, posicionamento livre do mestre e música compartilhada.

Se o limite de 8 MiB ainda for ultrapassado, faça backup antes de revisar snapshots antigos. Não edite manualmente `campaigns.game_state` nem `campaign_master_private_state`.
