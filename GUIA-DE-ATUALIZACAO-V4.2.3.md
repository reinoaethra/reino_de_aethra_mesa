# Guia de atualização — Reino de Aethra v4.2.3

Esta atualização adiciona o Rolador Universal de Dados à Central do Mestre. É incremental e preserva as campanhas já existentes.

## Arquivos para publicação

Substitua os seguintes arquivos no projeto hospedado:

- `index.html`
- `app.js`
- `styles.css`

Preserve o `config.js`, toda a pasta `assets/`, as imagens, mapas, áudios e os demais arquivos próprios do projeto. Faça um backup antes de substituir os arquivos publicados.

## Onde encontrar a ferramenta

O Rolador Universal aparece em dois lugares:

1. **Central do Mestre → Rolador Universal**.
2. Nas **ações rápidas** da sala da campanha, ao lado de Solicitar teste D20.

Apenas o mestre ativo pode abrir e executar a ferramenta.

## Como usar

1. Selecione D4, D6, D8, D10, D12 ou D20.
2. Informe a quantidade de dados, de 1 a 20.
3. Informe um bônus ou uma penalidade. Por exemplo, `+3` soma três pontos; `-2` subtrai dois.
4. Escolha se a rolagem será pública ou reservada ao mestre.
5. Descreva a finalidade e clique em **Rolar dados**.
6. Confira o valor de cada dado, a fórmula e o total.

Exemplo: `2d6 + 3`. Se os dados apresentarem 4 e 2, o total será `4 + 2 + 3 = 9`.

## Publicar ou reservar

- **Pública:** o resultado e a fórmula são registrados como evento na Linha do Tempo compartilhada.
- **Privada:** o resultado fica no armazenamento local do navegador do mestre. Não é enviado ao Supabase, não aparece aos jogadores e não migra automaticamente para outro dispositivo. O modal mantém uma lista das últimas rolagens reservadas neste navegador.

## Aplicar dano ou cura

Depois de uma rolagem, a seção **Aplicar resultado manualmente** permite selecionar um aventureiro ou uma criatura ativa e escolher dano ou cura. O HP só muda depois de clicar em **Aplicar pontos ao alvo**.

- Ao aplicar dano a um monstro, o HP e o estado de derrota são atualizados. Se o encontro for concluído, o processamento existente de recompensas é acionado.
- Ao aplicar cura ou dano a um aventureiro, o HP da ficha compartilhada é atualizado.
- A aplicação é registrada na Linha do Tempo. O sistema não inventa condições ou efeitos adicionais; o mestre continua responsável por eles.

Se não houver combate ativo, ainda será possível selecionar aventureiros para aplicar HP. Para aplicar dano a um monstro, é necessário haver um encontro ativo.

## Supabase

**Não execute SQL para a v4.2.3.** Esta versão reutiliza o evento `session_note` já permitido ao mestre e não modifica o banco de dados. Mantenha a migration anterior que já foi aplicada na campanha; não reaplique migrations antigas como parte desta publicação.

## Publicação e conferência

1. Exporte um backup da campanha e guarde uma cópia dos arquivos atuais.
2. Substitua `index.html`, `app.js` e `styles.css`.
3. Preserve `config.js` e `assets/`.
4. Publique no mesmo provedor utilizado pelo projeto.
5. Abra o site e faça uma recarga forçada com `Ctrl + F5`.
6. Entre com a conta de mestre e verifique a presença do Rolador Universal na Central do Mestre e nas ações rápidas.
7. Faça uma rolagem pública, confirme o registro na Linha do Tempo e teste uma rolagem privada, verificando que ela não aparece para jogadores.
8. Em uma campanha de teste, aplique um resultado como dano ou cura e confirme o HP do alvo.

## Reversão

Restaure `index.html`, `app.js` e `styles.css` do backup da versão anterior. Não há alterações de banco de dados para reverter.
