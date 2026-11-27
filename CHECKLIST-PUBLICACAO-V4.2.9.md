# Checklist de publicação — Reino de Aethra v4.2.9

- [ ] Fazer backup do repositório atual.
- [ ] Extrair o ZIP da v4.2.9.
- [ ] Substituir `index.html`, `app.js` e `styles.css`.
- [ ] Atualizar `assets/js/aethra-dice-3d.js`.
- [ ] Preservar `config.js`, mapas, imagens e demais arquivos `assets/`.
- [ ] Não executar SQL por causa desta revisão.
- [ ] Não remover a Edge Function `delete-account` nem os recursos SQL das versões anteriores.
- [ ] Publicar no GitHub Pages e fazer `Ctrl + F5` no computador.
- [ ] Testar configurações, conta, criação/entrada de campanha e ficha.
- [ ] Testar Biblioteca, Bestiário, NPC, ponto de interesse e inventário.
- [ ] Testar as ferramentas do mestre e os formulários auxiliares.
- [ ] Testar música, link de áudio e YouTube.
- [ ] Testar Comércio e Forja em duas contas conectadas.
- [ ] Verificar se foco, campos digitados e rolagem permanecem após atualização.
- [ ] Testar abertura e fechamento pelo botão e pelo fundo escurecido.
- [ ] Repetir os testes em um celular.

## Resultado da validação local

- `node --check app.js`: aprovado.
- 24 arquivos de teste `.cjs`: aprovados.
- A auditoria estática confirmou que as atribuições ao `modalRoot.innerHTML` passam pelo reconciliador global.
