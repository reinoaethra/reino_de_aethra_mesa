# Reino de Aethra — v3.0.1

## Atualização de experiência de lançamento

- Login e logout fecham o pop-up assim que a autenticação é confirmada; o fechamento também é aplicado nos eventos `SIGNED_IN` e `SIGNED_OUT` para evitar que o diálogo permaneça sobre a tela redesenhada.
- O painel usa a largura disponível do navegador; a área de campanha e o tabuleiro tático foram ampliados, com adaptação para celular e tablet.
- Os onze mapas táticos são apresentados como plantas superiores 10 × 8, com piso de sala, corredores, muros, colunas, árvores, rochas, água, portas, entradas e saídas.
- Cada mapa possui entradas, saídas, portas padrão quando aplicável e Pontos de Interesse com descrição, ação possível, teste sugerido, sucesso, falha e orientação reservada ao mestre.
- Corrigidos três marcadores de interesse que estavam sobre terreno bloqueado. Os testes agora verificam dimensões, acessibilidade e coordenadas dos mapas.
- Mantidas as regras de movimento, colisão, névoa, bases multicelulares, miniaturas estáticas e pedidos remotos do jogador ao mestre.
- Incluídos três PDFs independentes: Cena Interativa e Pontos de Interesse (12 páginas), Mapa Tático (10 páginas) e Roteiro do Mestre Iniciante (15 páginas).

## Instalação

1. Faça uma cópia de segurança dos arquivos atuais.
2. Substitua os arquivos do site pelos arquivos desta versão.
3. Preserve o seu `config.js` existente.
4. Se o projeto já usa Supabase, execute uma única vez `supabase-migration-v3.0.1.sql` no SQL Editor. Essa migração apenas atualiza duas funções RPC para aceitar os onze IDs de mapa; não apaga dados.
5. Em projeto Supabase novo, use o `supabase-schema.sql` incluído no pacote.
6. Publique e confira o checklist `CHECKLIST-DE-PUBLICACAO-V3.0.1.md`.

## Validação

A validação local inclui sintaxe JavaScript, testes automatizados de armazenamento, iniciativa, fechamento de diálogos e consistência dos mapas. O pacote não foi conectado ao projeto Supabase do usuário nesta execução; confirme login/logout e movimento entre aparelhos após a publicação.
