# Reino de Aethra — Notas de lançamento v4.2.2

## Objetivo

Ajuste de apresentação do controle de volume da trilha sonora compartilhada, com foco na visualização do mestre em computador.

## Melhorias

- Substitui a aparência nativa inconsistente do input de volume por um trilho dourado e um cursor circular.
- Compatibilidade visual para motores Chromium (Chrome, Opera e Edge) e Firefox.
- Largura do controle mestre limitada no desktop, evitando que a barra ocupe espaço excessivo na linha de botões.
- Em telas pequenas, o controle continua responsivo e pode ocupar a largura disponível.
- Inclui estados de foco para acessibilidade por teclado.

## Compatibilidade e dados

- Não altera a lógica da playlist, volume geral, volume local, reprodução ou sincronização.
- Não altera o esquema ou os dados do Supabase.
- Não exige migration SQL.
- Mantém a compatibilidade com as campanhas e configurações da v4.2.1.
