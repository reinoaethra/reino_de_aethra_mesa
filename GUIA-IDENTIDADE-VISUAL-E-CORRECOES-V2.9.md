# Reino de Aethra — identidade visual e correções v2.9

## Objetivo da versão

A v2.9 consolida a apresentação visual das cenas internas da campanha, continua a atualização dos sete livros e corrige um problema que impedia alguns projetos Supabase de criar campanhas.

## 1. Cenas regionais ilustradas

O painel **Cena interativa** agora apresenta uma faixa ilustrada do território atual, com o nome e a descrição do mapa. A imagem acompanha o mapa ativo e usa os arquivos locais de `assets/scenes/`:

- Eldoria: vila ancestral e paisagens de floresta;
- Drakmor: forjas e fortalezas de basalto;
- Nivéria: arquivos e galerias de cristal;
- Thalassor: porto e recifes;
- Solária: templo e arquitetura solar;
- Ruínas: estruturas antigas de Aethra.

A arte reforça atmosfera, arquitetura e paleta regional. Ela não revela segredos, não substitui os pontos interativos e não altera as regras do mapa tático. O movimento narrativo continua separado do deslocamento por casas durante combate.

## 2. Atualização dos sete livros

Cada livro recebeu um capítulo v2.9:

- **Livro do Mestre:** direção de cena e identidade regional;
- **Bestiário:** criaturas como parte da paisagem;
- **Os Grandes Chefes:** apresentação visual de arenas;
- **Atlas dos Cinco Reinos:** leitura visual dos reinos;
- **Grimório:** magia e atmosfera regional;
- **Arsenal e Relíquias:** materiais e identidade dos reinos;
- **Manual do Aventureiro:** como ler uma cena ilustrada.

O Livro do Mestre em PDF acompanha um adendo v2.9 separado, preservando a edição diagramada anterior como referência completa.

## 3. Correção do erro ao criar campanhas

### Mensagem apresentada

`function gen_random_bytes(integer) does not exist`

Na versão anterior, a função `public.create_campaign` criava o código de convite usando `gen_random_bytes(5)`. O schema definia `search_path = public`. Em projetos onde a extensão `pgcrypto` está instalada no schema `extensions`, a função não fica visível nesse caminho de busca e a chamada falha.

### Solução aplicada

A geração do código agora usa:

```sql
'AETHRA-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))
```

`gen_random_uuid()` é fornecida pelo PostgreSQL moderno e não depende da localização de `pgcrypto`. A validação de unicidade do código continua ativa, e a criação do registro da campanha e do membro mestre permanece igual.

### Como atualizar um banco existente

1. Abra o Supabase Dashboard e selecione o projeto do Reino de Aethra.
2. Entre em **SQL Editor**.
3. Abra `supabase-migration-v2.9.sql` dentro do pacote v2.9.
4. Copie todo o conteúdo para uma consulta nova.
5. Clique em **Run** e aguarde a confirmação de sucesso.
6. Publique os arquivos do site v2.9 sem substituir seu `config.js` configurado.
7. Atualize o navegador com `Ctrl + F5` e crie uma campanha de teste.

A migração substitui somente a função `create_campaign`. Não apaga campanhas, membros, personagens, eventos ou histórico. Não exige mover ou reinstalar extensões manualmente.

Para uma instalação nova, use o `supabase-schema.sql` incluído no pacote v2.9, que já contém a implementação corrigida.

## 4. Arquivos preservados e compatibilidade

- `config.js` deve permanecer com a URL e a Publishable key do próprio projeto Supabase.
- As tabelas e os estados JSON das campanhas não mudam.
- As propriedades adicionadas em v2.7 e v2.8 continuam compatíveis.
- Nenhuma migração de dados é necessária; a única atualização SQL é a substituição da RPC de criação.
- A página de acesso, criação de conta e início de campanha continua reservada para uma etapa posterior, conforme o planejamento.

## 5. Verificações realizadas

O pacote foi verificado estaticamente quanto à sintaxe JavaScript, estrutura HTML, referências a arquivos locais, presença dos assets, consistência dos arquivos SQL e integridade do ZIP. Não foi possível executar uma sessão real no projeto Supabase do usuário nem validar a interface em um navegador conectado à conta; a migração deve ser aplicada no projeto real antes de confirmar a correção em produção.
