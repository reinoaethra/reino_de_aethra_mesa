# Guia v1.2 — Equipamentos e criaturas no mapa

## O que mudou

A versão 1.2 aprimora a leitura das peças no mapa tático. Os aventureiros continuam usando miniaturas SVG articuladas; agora a miniatura também recebe camadas visuais para o equipamento que estiver registrado na ficha do personagem.

### Equipamentos representados

- **Armadura:** camada de proteção no tronco, com tonalidade associada à classe.
- **Arma:** silhueta de espada, arco, cajado, adagas ou arma de combate, conforme a classe.
- **Escudo:** aparece quando o personagem possui um escudo equipado.

A representação é estilizada. Ela não reproduz fielmente cada modelo, raridade, encantamento ou aparência individual de todos os itens do inventário. O cálculo de defesa e dano continua usando os dados de equipamento existentes na ficha; a arte não altera regras.

## Criaturas vetoriais

O tabuleiro usa desenhos SVG próprios para Goblin das Cinzas, Lobo Cinzento, Espectro da Ruptura, Campeão Orc e Drakthar. As animações são diferentes para cada família: postura de fera, flutuação espectral, respiração pesada e ameaça dracônica.

Os retratos originais continuam disponíveis nas fichas, no bestiário e em outras áreas que utilizam imagens de retrato.

## Atualização

1. Faça uma cópia de segurança do projeto atual.
2. Substitua os arquivos do site pelos arquivos desta versão.
3. Preserve `config.js` e suas credenciais públicas do Supabase.
4. Publique novamente pelo GitHub Pages e atualize a página com `Ctrl + F5`.

**Banco de dados:** esta versão não altera tabelas, políticas ou funções do Supabase. Não execute migração SQL para atualizar da v1.1 para a v1.2.

## Limitações conhecidas

- As miniaturas são SVG/CSS, não modelos 3D nem spritesheets quadro a quadro.
- Armas e proteções são representações genéricas por classe/equipamento equipado, não um render individual de cada item cosmético.
- Os monstros têm silhuetas vetoriais dedicadas, mas ainda não possuem ciclos completos de locomoção, ataque, dano e morte.
- É necessário testar visualmente no navegador e em telas pequenas; validação de código não substitui teste real de mesa multiplayer.
