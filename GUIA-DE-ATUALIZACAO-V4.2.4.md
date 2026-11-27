# Guia de atualização — Reino de Aethra v4.2.4

## O que atualizar

Substitua no repositório/servidor os arquivos abaixo pelos equivalentes deste pacote:

- `index.html`
- `app.js`
- `styles.css`

Mantenha os arquivos de configuração já existentes, em especial `config.js`, e preserve a pasta `assets/` e os demais recursos estáticos do projeto.

## Passos de publicação

1. Faça um backup da versão publicada e dos arquivos de configuração.
2. Extraia o pacote v4.2.4.
3. Copie `index.html`, `app.js` e `styles.css` para o projeto, substituindo os arquivos anteriores.
4. Não substitua `config.js` por um arquivo vazio ou de exemplo.
5. Publique o site pelo mesmo processo já utilizado (por exemplo, GitHub Pages).
6. Abra o site e faça uma recarga forçada: `Ctrl + F5` no computador. No celular, feche e abra novamente a página ou limpe o cache do navegador se os estilos antigos persistirem.
7. Entre em uma campanha de teste e valide os itens abaixo.

## Testes recomendados

### Rolagem D20

1. Entre na campanha com o mestre e pelo menos uma conta de jogador em outro navegador/dispositivo.
2. Pela Central do Mestre, solicite um teste público de D20.
3. Responda pelo jogador.
4. Confirme que o dado animado e o resultado aparecem no mestre e no jogador.
5. Repita com uma rolagem reservada ao mestre e confirme que a animação não é publicada para os jogadores.

### Rolador Universal

1. Abra **Rolador Universal** na Central do Mestre.
2. Escolha cada dado disponível (D4, D6, D8, D10, D12 e D20), quantidade e bônus/penalidade.
3. Faça uma rolagem pública e confira os dados individuais, fórmula, faces e total no grupo.
4. Faça uma rolagem privada e confirme que o resultado fica apenas no dispositivo do mestre.
5. Teste o efeito manual de dano ou cura somente quando desejar alterar HP; a rolagem, sozinha, não aplica efeitos.

### Central de Música

1. Abra a Central de Música no mestre.
2. Confirme que volume, **Arquivo**, **Link** e **YouTube** estão agrupados.
3. Adicione quatro ou mais faixas e role dentro da janela da playlist; a altura do painel deve permanecer estável.
4. Teste uma faixa de áudio enviada e um link direto HTTPS.
5. Adicione um link do YouTube em **＋ YouTube**, informe o nome e o endereço do vídeo.
6. Clique em **Reproduzir** e, em cada dispositivo que não tocar automaticamente, use **Ativar música neste dispositivo**.
7. Teste pausa, próxima/anterior, volume geral e volume local.

## Limites do YouTube

A faixa do YouTube é um vídeo incorporado pela API oficial do YouTube. Isso não converte o vídeo em MP3. A reprodução pode falhar se o autor não permitir incorporação, se o vídeo estiver privado/removido, se houver restrição regional ou se o navegador bloquear autoplay. Nesse caso, use outro vídeo permitido ou adicione um arquivo/link direto de áudio.

## Banco de dados

**Não execute SQL nesta atualização.** A v4.2.4 reutiliza os eventos e o estado de campanha já existentes. Não há migração adicional para aplicar.

## Reversão

Se encontrar problema após a publicação, restaure os arquivos `index.html`, `app.js` e `styles.css` do backup anterior, mantendo `config.js`, `assets/` e os dados do Supabase. Não reverta nem reaplique SQL por causa desta atualização.
