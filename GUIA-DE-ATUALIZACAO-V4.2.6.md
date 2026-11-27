# Guia de atualização — Reino de Aethra v4.2.6

## O que muda

A v4.2.6 substitui a animação achatada de dados por uma cena 3D real no navegador. Os dados são construídos como malhas poliédricas com faces e numeração, renderizados por WebGL e lançados com física 3D. A face final é alinhada ao resultado já calculado pelo sistema; a animação nunca sorteia novamente nem altera o resultado mecânico.

A atualização também preserva os recursos das versões anteriores, incluindo a Central de Música da v4.2.4, a exclusão de conta da v4.2.5 e o Rolador Universal da v4.2.3.

## Antes de publicar

1. Faça uma cópia do repositório atual.
2. Não apague campanhas, fichas, mapas, imagens, personagens ou arquivos do Storage.
3. Esta atualização **não requer Node.js, Supabase CLI, Docker nem migração SQL**.
4. A primeira rolagem 3D exige acesso à internet para carregar Three.js e Rapier a partir do CDN `esm.sh`.

## Arquivos a substituir ou adicionar

Na raiz do repositório GitHub Pages:

**Substitua:**
- `index.html`
- `app.js`
- `styles.css`

**Adicione o novo módulo:**
- `assets/js/aethra-dice-3d.js`

**Adicione também a página de teste independente:**
- `preview-dados-3d.html`

Se a pasta `assets/js/` não existir, crie-a. Não substitua nem exclua as demais pastas dentro de `assets/`.

**Preserve:**
- `config.js` — URL e chave pública do projeto Supabase;
- `assets/maps/` e todas as demais pastas e imagens existentes;
- `supabase/functions/delete-account/` e `supabase-migration-v4.2.5.sql`, caso já tenha configurado a exclusão de conta da versão anterior;
- políticas, funções, tabelas e demais arquivos SQL já utilizados pelo projeto.

O ZIP inclui os arquivos completos necessários à atualização e uma cópia do código de versões anteriores para preservar os recursos existentes. Não execute os SQL antigos novamente por causa da v4.2.6.

## Instalação pelo GitHub (sem terminal)

1. Baixe e extraia `reino-de-aethra-atualizacao-v4.2.6.zip`.
2. Abra o repositório do Reino de Aethra no GitHub.
3. Entre em `index.html`, `app.js` e `styles.css`, substitua cada arquivo pelo correspondente do ZIP e salve as alterações.
4. Para o novo módulo, abra/crie `assets/js/` e envie `aethra-dice-3d.js` para essa pasta.
5. Faça commit das alterações e aguarde a publicação do GitHub Pages.
6. Abra o site e faça uma recarga forçada (`Ctrl + F5`). Em celular, feche a aba antiga e abra o site novamente.

Também é possível usar o botão **Add file → Upload files** no GitHub para enviar os quatro arquivos de uma vez, mantendo a estrutura de pastas correta.

## Como conferir

Faça os testes com duas janelas ou dispositivos conectados à mesma campanha:

1. Inicie uma sessão de teste.
2. Solicite um D20 público. O dado poliédrico deve entrar no centro da tela, girar, quicar e parar com a face igual ao resultado registrado.
3. Faça uma rolagem universal pública `2d6`. Devem aparecer dois dados de seis faces, com as faces finais correspondendo aos dois valores do registro.
4. Confira se o mestre e os jogadores conectados veem a mesma rolagem e o mesmo resultado.
5. Faça uma rolagem universal privada. Somente o mestre deve receber a animação e o resultado.
6. Experimente `1d4`, `1d8`, `1d10`, `1d12` e `1d20` no Rolador Universal.
7. Repita no computador e no celular, em orientação retrato e paisagem.
8. Use o botão **Continuar** para fechar a animação sem esperar o fechamento automático.
9. Para experimentar antes de entrar na campanha, abra `preview-dados-3d.html` no domínio publicado do GitHub Pages. Essa página usa rolagens locais de demonstração e não registra resultados na campanha.

## Dependências e requisitos

- Three.js `0.187.0`, carregado de `https://esm.sh/three@0.187.0`.
- Rapier 3D determinístico `0.21.0`, carregado de `https://esm.sh/@dimforge/rapier3d-deterministic-compat@0.21.0?bundle`.
- Navegador com WebGL 2 habilitado. O `WebGLRenderer` da versão atual do Three.js utiliza WebGL 2; WebGL 1 não é suportado nessa versão.
- Conexão à internet para a primeira carga dos módulos externos. Depois que o navegador armazenar os módulos em cache, eles poderão ser reutilizados pelo cache, sujeito às regras do navegador e do CDN.

Os modelos dos seis dados não são vídeos ou imagens planas: as geometrias D4, D6, D8, D10, D12 e D20 são criadas pelo código, com faces, números, material metálico, arestas douradas e colisores convexos.

## Desempenho, privacidade e resultado

- A simulação usa passos fixos de física e semente derivada do evento público para manter uma trajetória repetível entre clientes compatíveis.
- A face final é alinhada ao valor que o servidor/aplicação já calculou. A animação não escolhe nem modifica o resultado.
- Os resultados públicos continuam no fluxo público de eventos da campanha.
- As rolagens reservadas ao mestre continuam privadas; não passam a ser publicadas por causa da animação.
- O renderizador limita a densidade de pixels, evita pós-processamento pesado e usa animação reduzida quando o dispositivo solicita `prefers-reduced-motion`.
- Até 20 dados podem ser exibidos por rolagem universal.
- Se WebGL 2 não estiver disponível ou o CDN não carregar, o sistema apresenta o resultado confirmado em uma mensagem de contingência. O resultado da rolagem continua válido, mas a animação 3D não será exibida nesse dispositivo/rede.

## O que esta versão não altera

- Não altera fórmulas, bônus, CDs, combate, dano ou resultados de dados.
- Não altera playlists, músicas, links do YouTube ou volumes individuais.
- Não altera contas, campanhas ou permissões Supabase.
- Não requer execução de SQL nem publicação de Edge Functions.

## Diagnóstico rápido

**O resultado aparece, mas o dado 3D não:** verifique se o navegador está com WebGL 2 habilitado e se a rede permite acessar `esm.sh`. Confira o Console do navegador (F12 → Console) para mensagens de carregamento.

**O dado não aparece em uma máquina da empresa:** políticas de rede podem bloquear CDNs externos ou WebGL. Solicite liberação de `https://esm.sh` e WebGL 2, ou teste em outro navegador/dispositivo autorizado.

**Jogadores veem o resultado diferente:** registre o horário, o tipo de rolagem e os participantes. O número oficial é o exibido no registro do evento; a animação é apenas visual e nunca substitui o valor do evento.

**Voltar à versão anterior:** restaure `index.html`, `app.js` e `styles.css` da cópia anterior e remova `assets/js/aethra-dice-3d.js` se desejar. Nenhuma migração SQL nova foi executada pela v4.2.6.
