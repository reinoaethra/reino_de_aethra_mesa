# Guia da Forja — Reino de Aethra v2.3

## Quem pode usar
A forja fica dentro da tela **Comércio da companhia**. Somente o mestre que está controlando a sessão pode confirmar operações. Selecione o aventureiro no campo superior; equipe a peça que deseja modificar e use os botões da seção **Forja de Tovin e Brann**.

## Materiais
- **Fragmento de Forja:** custa 180 PO no mercado.
- **Essência Arcana:** custa 320 PO no mercado.

O mestre também pode conceder esses materiais como tesouro narrativo, adicionando-os ao inventário do personagem como itens do tipo `material` com os IDs `fragmento-forja` e `essencia-arcana`.

## Aprimoramento
Cada equipamento pode chegar ao nível +3. Cada nível concede +5 ao atributo principal:

| Aprimoramento | Materiais | Ouro | Bônus adicional |
|---|---:|---:|---:|
| +1 | 1 Fragmento | 700 PO | +5 ataque/dano ou Defesa |
| +2 | 2 Fragmentos | 1.400 PO | +10 acumulado |
| +3 | 3 Fragmentos | 2.100 PO | +15 acumulado |

O custo é referente a cada tentativa de avançar um nível, não ao custo total desde +0. Uma peça +1 precisa pagar o custo de +2 para avançar ao próximo nível.

## Encantamentos
Cada peça aceita um único encantamento:
- **Precisão:** arma, +5 no ataque.
- **Chama:** arma, +5 no dano.
- **Guardião:** armadura ou escudo, +5 na Defesa.

Cada encantamento custa 2 Essências Arcanas e 1.200 PO.

## Segurança e persistência
- Operações são autorizadas apenas ao mestre controlador.
- A aplicação valida equipamento, compatibilidade, materiais e ouro antes de debitar recursos.
- Equipamentos não são destruídos; não há rolagem aleatória de falha nesta versão.
- Aprimoramento e encantamento são salvos junto do equipamento no estado da campanha, tanto no modo local quanto no Supabase.
- Não é necessária migração SQL para a v2.3.

## Atualizar o jogo
Substitua os arquivos do site pelos arquivos da v2.3, preservando seu `config.js` atual. Como não há alteração no banco, não execute migração SQL adicional.
