# Reino de Aethra — Notas de lançamento v4.2.7

## Rolagem 3D
- Câmera ortográfica superior, com os dados lançados no centro do tampo.
- Face final orientada para leitura pela câmera.
- Tampo renderizado e colisor Rapier alinhados na mesma altura.
- Altura de repouso calculada com base nos vértices e na orientação individual de cada poliedro.
- CCD ativado nos dados rápidos, fricção e restituição ajustadas e simulação em passos fixos.
- Acomodação final aguarda baixa velocidade/sono físico em sequência, com limite de segurança.
- O resultado oficial continua a ser calculado antes da animação e é sincronizado para os participantes públicos.

## Exclusão de conta
- Corrigido o listener de envio ausente no formulário `account-delete-form` da v4.2.6.
- O formulário agora chama a Edge Function `delete-account` com a identidade revalidada.
- A interface só fecha e limpa a sessão após confirmação `success: true`.
- Erros de validação, senha, Edge Function ou banco permanecem visíveis; a aplicação não mostra mensagem de sucesso sem confirmação do servidor.

## Compatibilidade
- Mantém os dados, os recursos e a integração da v4.2.6.
- Não exige nova migração SQL. A exclusão de conta continua a utilizar a configuração da v4.2.5.
