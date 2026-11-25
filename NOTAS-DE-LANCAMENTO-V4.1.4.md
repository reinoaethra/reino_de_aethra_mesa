# Reino de Aethra — Notas de lançamento v4.1.4

## Objetivo

A v4.1.4 corrige a seleção de criaturas do Bestiário após o ajuste introduzido na v4.1.3. A lista deixa de usar linhas comprimidas com texto e passa a exibir cartões quadrados com somente a miniatura da criatura.

## Melhorias do Bestiário

- Seleção de criaturas em cartões quadrados, com miniaturas centralizadas e sem cortes.
- Coluna de seleção à esquerda no desktop; em telas estreitas, o catálogo fica acima da ficha.
- O nome completo permanece disponível por acessibilidade (`aria-label`) e dica ao passar o cursor; o nome e os detalhes completos são apresentados na ficha selecionada.
- Remoção do botão de adicionar de cada miniatura para preservar o formato quadrado. A ação de adicionar/remover da composição permanece no painel de detalhes.
- Rolagem vertical independente para a grade de miniaturas e para a ficha detalhada, quando o conteúdo exceder a área disponível.
- A grade usa linhas que não encolhem, evitando que as criaturas voltem a aparecer como barras finas.
- Ajustes de tamanho para desktop, tablet e celular.

## Compatibilidade

- Mantém os 32 monstros e seus dados existentes.
- Mantém pesquisa, filtro por tipo, seleção, composição com até seis tipos, encontros individuais, encontros compostos e composições salvas.
- Mantém a miniatura cadastrada em `assets/` tanto nos cartões quanto na ficha detalhada.
- Mantém os sistemas de campanha, contas, fichas, combate, missões, mapas, Modo Chamada e sincronização.
- Não altera o modelo de dados nem requer migração SQL.

## Limites

- Os nomes não aparecem escritos dentro dos pequenos cartões; são apresentados na ficha depois da seleção e permanecem acessíveis via leitor de tela e dica do cursor.
- A aparência final das miniaturas depende de os arquivos correspondentes em `assets/` estarem presentes no repositório publicado.
- Os testes locais não substituem a conferência visual no GitHub Pages em desktop e celular.
