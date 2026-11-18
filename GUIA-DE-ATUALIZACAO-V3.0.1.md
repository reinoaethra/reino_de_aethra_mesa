# Guia de atualização — v3.0.1

## Antes de publicar

- Baixe e extraia `reino-de-aethra-v3.0.1.zip`.
- Faça uma cópia dos arquivos atualmente publicados, principalmente `config.js`.
- Não remova a configuração do Supabase nem crie um projeto novo para esta atualização.

## Publicar os arquivos

1. Abra o repositório usado pelo GitHub Pages.
2. Substitua os arquivos da aplicação pelos arquivos da pasta `reino-de-aethra` desta edição.
3. Copie de volta o `config.js` que já estava funcionando no seu site. Se o ZIP não incluir configuração privada (o comportamento recomendado), mantenha o arquivo atual.
4. Faça o commit e aguarde o GitHub Pages publicar a nova versão.
5. No computador e no celular, atualize a página sem cache se ainda aparecer a interface anterior.

## Atualizar Supabase

**Instalação que já tinha o Supabase configurado:** abra o SQL Editor do projeto e execute uma única vez o arquivo `supabase-migration-v3.0.1.sql`. Ele substitui as funções de solicitação de movimento e de interação do mapa, ampliando a lista de mapas reconhecidos para os onze cenários e permitindo pedidos remotos para abrir portas e examinar altares. Não apaga campanhas, personagens, inventários, eventos ou progresso.

**Projeto novo:** use o arquivo `supabase-schema.sql` completo desta versão em vez de executar a migração separada.

## Conferir o resultado

- Entre com a conta permanente no computador e no celular.
- Faça login e confirme que o pop-up fecha e que a lista de campanhas aparece.
- Abra a janela de conta, saia e confirme que ela fecha e o navegador volta ao modo visitante.
- Abra uma campanha de teste e visite os onze mapas. Confira salas, corredores, entradas, saídas e Pontos de Interesse.
- Em uma campanha com dois aparelhos, peça um movimento como jogador e confirme/recuse como mestre.
- Leia os três PDFs para conhecer os novos fluxos e conduzir a primeira sessão.

## Preservação de dados

Não execute comandos `DROP TABLE`, não recrie o projeto Supabase e não substitua `config.js` por um arquivo vazio. A atualização preserva os dados existentes.
