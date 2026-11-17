# Guia da v2.5 — Atlas visual e Livro do Mestre

## 1. O que mudou no site

A página inicial agora apresenta os cinco reinos em cartões ilustrados, em vez de blocos compostos apenas por cores. Cada cartão mostra imagem, nome, elemento, subtítulo e uma descrição curta.

Na criação de personagem, a etapa **Origem** também exibe imagens e informações para ajudar o jogador a escolher seu reino. O estado selecionado recebe uma borda destacada.

As ilustrações ficam em `assets/realms/`:

- `eldoria.webp` — florestas ancestrais e santuários naturais.
- `drakmor.webp` — fortalezas vulcânicas e rios de lava.
- `niveria.webp` — cidade de cristal, montanhas e aurora.
- `thalassor.webp` — cidade costeira, ilhas e mar aberto.
- `solaria.webp` — cidade dourada e templos sob a luz do sol.

As imagens são carregadas do próprio projeto. Não é preciso criar tabelas, buckets ou alterar o Supabase.

## 2. Como atualizar seu site

1. Faça uma cópia de segurança do repositório atual.
2. Baixe e extraia o ZIP da v2.5.
3. Substitua os arquivos do jogo pelos arquivos da nova versão.
4. Preserve seu `config.js` atual; ele contém a configuração do seu projeto Supabase.
5. Confirme que a pasta `assets/realms/` foi enviada junto com o restante do site.
6. Publique as alterações no GitHub Pages e atualize a página com recarga completa do navegador.

Não há migração SQL para a v2.5.

## 3. Livro do Mestre em PDF

O arquivo `LIVRO-DO-MESTRE-REINO-DE-AETHRA-V2.5.pdf` é fornecido separadamente do ZIP do site. É um livro A4 com capa, sumário, 12 capítulos e dois apêndices. Inclui cenário, cinco reinos, preparação de sessões, narrativa, testes, combate, criaturas, espólios, chefes, missões, forja, NPCs e segredos da campanha.

### Importante: mantenha o PDF privado

O PDF contém revelações e informações destinadas ao mestre. **Não coloque o PDF em um repositório público do GitHub Pages**, nem dentro da pasta publicada do site. Guarde-o no computador do mestre ou em um espaço privado. A biblioteca interna do site não constitui uma barreira de segurança real para conteúdo secreto.

## 4. Compatibilidade e testes

- Campanhas existentes: preservadas.
- Supabase: nenhuma alteração de schema.
- `config.js`: deve ser mantido.
- Imagens: arquivos WebP locais.
- Verificações: sintaxe JavaScript, estrutura HTML, contagem de blocos CSS, existência das imagens e integridade do ZIP.
- Limitação: não foi realizado teste visual completo em navegador nem teste multiplayer real contra um projeto Supabase.
