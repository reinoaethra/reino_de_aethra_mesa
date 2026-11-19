# Guia de atualização — Reino de Aethra v3.0.3

## 1. Antes de atualizar

1. Faça uma cópia dos arquivos que estão atualmente no repositório GitHub Pages.
2. Baixe e extraia `reino-de-aethra-v3.0.3.zip`.
3. Guarde o `config.js` que já está publicado. Ele contém a URL e a chave pública do seu projeto Supabase.

## 2. Atualizar o site

1. Substitua os arquivos do site pelos arquivos extraídos desta versão.
2. Recoloque o `config.js` original no diretório raiz.
3. Confirme que as pastas `assets/maps/`, `assets/maps-v3/` e `assets/minis/` foram enviadas completas.
4. Faça commit e aguarde a publicação do GitHub Pages.
5. Abra o site e atualize com `Ctrl + F5` no computador. No celular, feche a aba antiga e abra o endereço novamente.

A nova biblioteca dos mapas está em `assets/maps/maps-data.js` e suas imagens em `assets/maps-v3/`. Não copie arquivos antigos de mapas sobre essas pastas: a versão 3.0.3 lê somente a biblioteca nova.

## 3. Migração Supabase (obrigatória para campanhas na nuvem)

1. Entre no painel do projeto Supabase.
2. Abra **SQL Editor**.
3. Selecione **New query**.
4. Abra `supabase-migration-v3.0.3.sql`, copie todo o conteúdo e cole na consulta.
5. Execute uma vez e confira se o resultado termina sem erro.

A migração cria/atualiza três funções de gestão e atualiza a função de entrada:
- `delete_campaign`: só o criador/mestre pode excluir a campanha.
- `remove_campaign_member`: o mestre pode remover um participante com papel de jogador.
- `leave_campaign`: um jogador pode remover a própria participação; o mestre criador não pode usar essa função.
- `join_campaign` (atualizada): se o jogador já tiver participado, a última ficha arquivada em uma saída/remoção anterior é restaurada ao entrar novamente com o código.

Ela não apaga campanhas existentes nem altera fichas/progresso. Ao remover ou sair, a ficha fica arquivada em um evento e é restaurada caso o mesmo usuário entre novamente pelo código da campanha. A exclusão de uma campanha só ocorre quando o mestre confirma explicitamente a ação no site.

Para uma instalação nova, o `supabase-schema.sql` já contém as três funções de gestão e a atualização de `join_campaign`; nesse caso, não é necessário aplicar a migração separada.

## 4. Testes após publicar

- [ ] Abrir a Estrada de Eldoria e confirmar que a imagem configurada aparece atrás da grade.
- [ ] Alternar entre os onze mapas e verificar se cada fundo corresponde ao cenário selecionado.
- [ ] Verificar se casas bloqueadas ficam apenas escurecidas e não exibem símbolos de terreno.
- [ ] Iniciar um encontro que use criaturas diferentes e verificar suas miniaturas individuais.
- [ ] Entrar como mestre, abrir uma campanha e confirmar que existe a opção **Excluir campanha**.
- [ ] Entrar na mesma campanha como jogador e confirmar que a opção **Sair da campanha** aparece, mas não a de excluir.
- [ ] Como mestre, remover um jogador e confirmar que o jogador perde acesso à sala.
- [ ] Como jogador, sair voluntariamente e confirmar que a campanha continua disponível para os demais.
- [ ] Confirmar que um participante comum não consegue executar exclusão ou remoção de outros participantes.
