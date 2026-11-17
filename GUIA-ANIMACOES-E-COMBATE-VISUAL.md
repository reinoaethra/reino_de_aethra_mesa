# Guia de animações e combate visual — v0.9

## O que mudou

A versão 0.9 aprimora a apresentação dos personagens no mapa e os efeitos apresentados durante ações de combate. Os retratos locais continuam sendo os arquivos da pasta `assets/portraits/`.

### Animações das peças
- Aventureiros: movimento sutil de repouso e respiração do retrato.
- Peça selecionada: aura para facilitar sua identificação.
- Monstros: animação de postura/respiração mais intensa.
- Encontro ativo: o mapa recebe iluminação temática de combate.

### Efeitos de combate
Os eventos existentes exibem efeitos diferentes para ataque físico, habilidade, cura e ataque de criatura. O áudio é sintetizado pelo navegador, sujeito às permissões de reprodução automática do dispositivo. Em alguns celulares, o primeiro som só será reproduzido depois de uma interação do usuário.

## Como atualizar
1. Faça uma cópia de segurança da pasta publicada atualmente.
2. Extraia o ZIP v0.9.
3. Substitua os arquivos HTML, CSS e JavaScript pelos novos.
4. Envie a pasta `assets/portraits/` completa.
5. Preserve o `config.js` que contém as credenciais públicas do seu projeto Supabase.
6. Publique as alterações no GitHub Pages e recarregue o site.
7. Teste em computador e celular, com movimento reduzido desligado e ligado nas configurações de acessibilidade do sistema.

## Acessibilidade e desempenho
O CSS respeita `prefers-reduced-motion`. Dispositivos com menor desempenho podem reduzir animações nas configurações de acessibilidade do sistema.

## Limites desta versão
As animações são transformações CSS aplicadas aos retratos estáticos. Não representam animação corporal completa, sprite sheet, rig 2D ou personagem 3D. Não há alteração no banco de dados nem migração SQL na v0.9.
