# Notas de lançamento — Reino de Aethra v4.2.6

## Objetivo

Substituir a representação achatada dos dados por modelos poliédricos realmente tridimensionais, com rolagem no palco central, movimento físico, colisões e leitura clara da face final. Preservar o resultado oficial e a privacidade das rolagens.

## Novidades

### 1. D20 3D
- D20 passa a ser um icosaedro 3D com faces individuais e numeração.
- O dado entra na cena, gira, quica e se estabiliza no palco.
- O resultado natural aparece após a parada.
- A apresentação pública é acionada pelo evento já existente; o valor mecânico não foi alterado.

### 2. Rolador Universal 3D
- Modelos reais para D4, D6, D8, D10, D12 e D20.
- D10 utiliza trapezoedro de dez faces.
- D6, D8, D10, D12 e D20 organizam valores de faces opostas em pares complementares quando aplicável.
- Rolagens com múltiplos dados apresentam cada dado separadamente e mostram valores individuais, fórmula e total.

### 3. Física e desempenho
- Three.js `0.187.0` para geometria e renderização WebGL 2.
- Rapier 3D determinístico `0.21.0` para corpos rígidos e colisões.
- Semente vinculada ao ID do evento público; simulação com passos fixos.
- Alinhamento final à face do resultado já calculado.
- Densidade de pixels limitada a 1,35; sem pós-processamento pesado.
- Movimento reduzido respeita `prefers-reduced-motion`.
- Fallback textual mantém o resultado quando WebGL 2 ou o CDN não está disponível.

### 4. Compatibilidade
- Rolagens D20 e universal públicas continuam no fluxo de eventos existente.
- Rolagens reservadas ao mestre continuam locais/privadas.
- A Central de Música e as melhorias de volume da v4.2.4 são preservadas.
- Exclusão de conta da v4.2.5 é preservada.

## Instalação

Substituir `index.html`, `app.js` e `styles.css`; adicionar `assets/js/aethra-dice-3d.js` e `preview-dados-3d.html`. Preservar `config.js` e as demais pastas `assets/`.

## Supabase

Nenhuma migração SQL nova. Não há tabelas, colunas, políticas ou RPCs novas. A v4.2.6 reutiliza os eventos de dados já existentes.

## Limites conhecidos

- O renderizador Three.js requer WebGL 2; WebGL 1 não é suportado pelo `WebGLRenderer` na versão fixada.
- A primeira rolagem precisa buscar os módulos pelo CDN `esm.sh`; redes que bloqueiam esse domínio podem impedir a animação, mas o resultado oficial é apresentado pelo fallback.
- Os testes automatizados verificam integração, versão, geometria declarada, passos fixos, visibilidade e cache. A renderização WebGL e a física real devem ser verificadas no navegador publicado, pois o ambiente de construção não possui acesso externo ao CDN.
