# Guia de atualização — Reino de Aethra v4.2.7

Atualização incremental sobre a v4.2.6. Esta versão corrige a física e a leitura visual dos dados 3D, além do envio do formulário de exclusão de conta.

## 1. Arquivos do site

Substitua na raiz do projeto:
- `index.html`
- `app.js`
- `styles.css`

Adicione ou substitua:
- `assets/js/aethra-dice-3d.js`

Se utiliza a página independente de demonstração, substitua também:
- `preview-dados-3d.html`

**Preserve:** `config.js`, toda a pasta `assets/` (mapas, imagens e demais mídias), arquivos de configuração e o restante do projeto.

## 2. Publicar pelo GitHub, sem instalar programas

1. Baixe e extraia o ZIP da v4.2.7.
2. Abra o repositório do Reino de Aethra no GitHub.
3. Envie os arquivos mantendo os caminhos acima. Pode usar **Add file → Upload files**.
4. Faça commit das alterações.
5. Aguarde a publicação do GitHub Pages.
6. No computador, abra o site e pressione `Ctrl + F5`. No celular, feche a aba antiga e abra novamente.

## 3. Supabase e exclusão de conta

**A v4.2.7 não exige SQL novo.** Não execute novamente a migração v4.2.5 nem as migrações antigas por causa desta atualização.

A opção Excluir conta continua dependendo dos recursos da v4.2.5:
- Edge Function `delete-account` já publicada no Supabase;
- migração `supabase-migration-v4.2.5.sql` já executada, que criou `aethra_list_my_storage_objects()`.

A falha da v4.2.6 estava no site: o formulário `account-delete-form` não tinha um ramo no listener global de `submit`. O botão parecia aceitar o clique, mas a função segura não era chamada. Agora o formulário chama `deletePermanentAccount()`.

A janela só é fechada e a sessão local limpa depois de a função responder com `success: true`. Em caso de senha incorreta, Edge Function ausente, campanha própria ou erro do banco, a janela permanece aberta e a mensagem de erro é mostrada. A exclusão é permanente; teste com uma conta descartável, nunca com sua conta principal.

## 4. Testar os dados 3D

Depois de publicar, abra `preview-dados-3d.html` no mesmo domínio do GitHub Pages. Essa página realiza rolagens locais de demonstração e não grava resultados na campanha.

Teste:
1. D20 individual.
2. 2d6 e vários dados no Rolador Universal.
3. D4, D6, D8, D10, D12 e D20.
4. O tampo visto de cima, os dados quicando/rolando e a face final legível.
5. O teste em uma tela de computador e em um celular.

A câmera agora é ortográfica superior. O colisor do Rapier termina exatamente na altura do tampo visível. O cálculo de apoio utiliza os vértices do dado na orientação final, e a simulação aguarda desaceleração real antes da acomodação. CCD ajuda a reduzir atravessamentos durante movimentos rápidos.

## 5. Requisitos e limitações

- Navegador com WebGL 2.
- Acesso à internet para carregar Three.js e Rapier pelo CDN `esm.sh` na primeira rolagem.
- Não requer Node.js, Supabase CLI, Docker nem nova migração SQL.
- Se o CDN ou WebGL estiver indisponível, a aplicação ainda deve apresentar o resultado numérico em uma tela de fallback, sem alterar a rolagem oficial.

Os testes automatizados verificam sintaxe, integração, regressões e presença das correções. A física 3D deve ser conferida no navegador real e no dispositivo em que a campanha será jogada.
