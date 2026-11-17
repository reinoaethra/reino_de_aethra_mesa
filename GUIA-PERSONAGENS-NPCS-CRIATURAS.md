# Guia de personagens, NPCs e criaturas — Reino de Aethra v0.8

Este guia explica onde ficam as imagens da versão 0.8, em quais telas aparecem e como substituir um retrato sem precisar entender programação.

## 1. Onde ficam as imagens?

Depois de extrair o ZIP, abra a pasta `assets` e, dentro dela, `portraits`. O caminho completo é:

```text
reino-de-aethra/
└── assets/
    └── portraits/
        ├── warrior.webp
        ├── arcane.webp
        ├── ranger.webp
        ├── paladin.webp
        ├── assassin.webp
        ├── cleric.webp
        ├── druid.webp
        ├── summoner.webp
        ├── npc-ilyra.webp
        ├── npc-tovin.webp
        ├── npc-cael.webp
        ├── goblin-ash.webp
        ├── dire-wolf.webp
        ├── drakthar.webp
        ├── wraith.webp
        └── orc-warlord.webp
```

O arquivo `preview-sheet.jpg` mostra todos os retratos numa única imagem. Ele serve como referência visual; o jogo carrega os arquivos WebP individuais.

## 2. Retratos das oito classes

| Classe | Arquivo | Onde aparece |
|---|---|---|
| Guerreiro | `warrior.webp` | Criação, ficha, inventário, participantes e mapa |
| Arcano | `arcane.webp` | Criação, ficha, inventário, participantes e mapa |
| Patrulheiro | `ranger.webp` | Criação, ficha, inventário, participantes e mapa |
| Paladino | `paladin.webp` | Criação, ficha, inventário, participantes e mapa |
| Assassino | `assassin.webp` | Criação, ficha, inventário, participantes e mapa |
| Clérigo | `cleric.webp` | Criação, ficha, inventário, participantes e mapa |
| Druida | `druid.webp` | Criação, ficha, inventário, participantes e mapa |
| Invocador | `summoner.webp` | Criação, ficha, inventário, participantes e mapa |

O jogo associa a imagem à classe do personagem. Se um personagem antigo ainda não tiver um campo de retrato salvo, a aplicação escolhe automaticamente a imagem padrão da classe.

## 3. Retratos dos NPCs

- `npc-ilyra.webp`: Ilyra Avelorn, batedora de Eldoria.
- `npc-tovin.webp`: Tovin Ferromar, ferreiro da vila.
- `npc-cael.webp`: Irmão Cael, guardião do santuário.

O mestre abre **Central do Mestre → Jornada e missões** e escolhe **Revelar** no NPC. Depois da revelação, todos os jogadores podem abrir a ficha pública e ver o retrato.

## 4. Retratos das criaturas

| Criatura | Arquivo | Habilidade especial |
|---|---|---|
| Goblin das Cinzas | `goblin-ash.webp` | Golpe oportunista |
| Lobo Cinzento | `dire-wolf.webp` | Mordida dilacerante |
| Espectro da Ruptura | `wraith.webp` | Toque debilitante: em acerto natural 18+, reduz a Defesa do alvo em 1 até o fim da rodada seguinte |
| Campeão Orc | `orc-warlord.webp` | Golpe demolidor: em acerto natural 19+, causa dano adicional de 1d8 |
| Drakthar, o Devorador | `drakthar.webp` | Sopro das Cinzas |

Ao iniciar um encontro, o mestre escolhe a criatura em **Bestiário de Aethra**. O retrato aparece no seletor, no cartão do encontro e como miniatura no mapa.

## 5. Como substituir uma imagem (sem alterar o código)

Se quiser trocar a ilustração de uma classe, NPC ou criatura:

1. Escolha uma imagem própria ou uma imagem que você tenha direito de utilizar.
2. Prepare-a preferencialmente em formato quadrado, com o rosto/personagem centralizado.
3. Salve a nova imagem no formato WebP. Se não souber converter, pode usar PNG ou JPG, mas precisará mudar também a extensão no código; para uma substituição simples, mantenha `.webp`.
4. Faça uma cópia de segurança do arquivo antigo.
5. Dê à nova imagem **exatamente o mesmo nome** do arquivo que será substituído, por exemplo `warrior.webp`.
6. Coloque o arquivo na pasta `assets/portraits/`, substituindo o antigo.
7. Publique a pasta completa no GitHub Pages.
8. Abra o site com atualização forçada (Ctrl + F5) para evitar ver a imagem antiga guardada no cache.

Se mantiver o mesmo nome, não precisa editar `app.js`.

### Recomendações para uma imagem ficar boa

- Formato quadrado (por exemplo 512 × 512 pixels).
- Personagem ocupando a maior parte do quadro, sem cortar o rosto.
- Fundo não muito claro; a interface usa painéis escuros.
- Evite textos, nomes ou marcas dentro da imagem.
- Use arquivo WebP com tamanho moderado para carregar bem no celular.

## 6. Como adicionar uma criatura nova (requer edição do código)

Adicionar uma criatura além das cinco existentes exige mais do que colocar uma imagem. É preciso acrescentar a criatura à lista `MONSTERS` em `app.js`, definir nível, Defesa, HP, bônus de ataque, dado de dano, iniciativa, XP e habilidade. Se a nova criatura tiver uma habilidade especial, a lógica dela também precisa ser programada e testada em `resolveMonsterTurn()`.

Para uma primeira personalização, recomendamos apenas substituir um dos arquivos de retrato existentes. Isso não exige programação.

## 7. Isso exige atualização do Supabase?

Não. Os arquivos de imagem são publicados junto do site no GitHub Pages. Os identificadores de retrato ficam nos campos JSON já existentes de personagem e encontro. A versão 0.8 não adiciona tabelas, colunas ou funções RPC, portanto não há migração SQL para esta atualização.

## 8. Conferência rápida

- [ ] A pasta `assets/portraits/` está no mesmo nível de `index.html`.
- [ ] Todos os 16 arquivos WebP foram enviados ao GitHub.
- [ ] Os nomes dos arquivos não foram alterados.
- [ ] A criação de personagem mostra retratos das oito classes.
- [ ] O mapa mostra retratos das miniaturas.
- [ ] O seletor de encontro mostra o retrato correto de cada criatura.
- [ ] NPCs revelados mostram o retrato correto.
