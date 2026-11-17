# Guia da v2.6 — cenários ilustrados durante a campanha

## O que mudou

A versão 2.6 adiciona seis cenários ilustrados locais em `assets/scenes/`:

- `eldoria-village.webp` — vila ancestral e caminhos de Eldoria.
- `drakmor-forge.webp` — cidadela e forjas vulcânicas de Drakmor.
- `niveria-archive.webp` — arquivos e biblioteca de cristal de Nivéria.
- `thalassor-harbor.webp` — porto e costa de Thalassor.
- `solaria-temple.webp` — templo dourado de Solária.
- `ancient-ruins.webp` — ruínas, torres e ambientes subterrâneos.

## Onde aparecem

1. **Narração da sessão:** a faixa de ambiente é selecionada automaticamente a partir do nome da localização e do mapa tático ativo. O texto narrativo continua sendo definido pelo mestre.
2. **Mapa tático:** uma faixa ilustrada acompanha o mapa escolhido, antes dos controles e da grade de movimento.

As imagens são parte do próprio site. Não é necessário criar pastas no Supabase nem alterar tabelas, políticas ou funções SQL.

## Como atualizar o site

1. Baixe e extraia `reino-de-aethra-v2.6.zip`.
2. Envie os arquivos para o mesmo repositório GitHub Pages, substituindo os arquivos antigos.
3. **Preserve o `config.js` já configurado** com as credenciais públicas do seu projeto Supabase.
4. Não apague os arquivos da pasta `assets/scenes/`.
5. Aguarde o GitHub Pages publicar e atualize o navegador. Se as imagens antigas permanecerem em cache, faça uma atualização forçada (`Ctrl + F5`).

## Compatibilidade

- Não exige migração SQL.
- Não altera personagens, missões, inventário, espólios, forja ou progresso salvo.
- Mantém os mapas táticos, névoa de guerra, marcadores e peças.
- As imagens são WebP e carregadas com `loading="lazy"` para reduzir trabalho inicial do navegador.

## Limitação conhecida

A escolha do cenário é contextual e automática, baseada na localização e no mapa selecionado. Não é um editor de cenários: o mestre continua escolhendo a localização e a narração pelos controles já existentes. A arte é ilustrativa e não substitui a grade tática, que continua sendo a referência para movimentos e posições.

## Verificações

A entrega foi submetida a verificações estáticas de sintaxe JavaScript, estrutura HTML, balanceamento de chaves CSS, presença das seis imagens e integridade do arquivo ZIP. Não foi realizado teste visual em navegador nem sessão multiplayer real com Supabase.
