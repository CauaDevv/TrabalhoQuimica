# ThermaSim — Laboratório de Termodinâmica

Aplicação educacional em React e TypeScript que apresenta uma bancada virtual de laboratório para explorar mudanças de fase com temperatura, pressão e partículas animadas. Um caderno interativo relaciona as observações às ideias de termodinâmica.

## Executar

```sh
npm install
npm run dev
```

Para validar o projeto:

```sh
npm run typecheck
npm run lint
npm run build
```

## Modelo do simulador

- Água, etanol e acetona têm pontos de fusão e ebulição normais próprios.
- O ponto de ebulição varia com a pressão usando uma aproximação de Clausius–Clapeyron; o ponto de fusão é tratado como constante.
- A tampa altera a representação do recipiente, enquanto a pressão externa é controlada separadamente.
- A animação ilustra a tendência de maior agitação térmica, as diferenças entre arranjos de sólido, líquido e gás e a formação de bolhas perto da ebulição; partículas e camadas da amostra transitam suavemente entre os estados e as substâncias. Durante o aquecimento, a chapa mostra a resistência incandescente e um halo de calor suave, sem simular uma chama.
- O mapa de fases compara visualmente os três estados em câmaras microscópicas, com arranjos de partículas e limites de temperatura atualizados para a substância selecionada.
- O caderno de laboratório explica partículas, calor e temperatura, pressão e mudanças de fase, com leituras sincronizadas aos controles.
- O registro mostra mudanças de fase e ações recentes do experimento.

Os valores e as animações representam um modelo educacional simplificado: não resolvem a dinâmica molecular, o equilíbrio líquido-vapor completo, a transferência de calor, a massa ou a coexistência de fases. Não substituem dados experimentais. A interface e as animações das partículas foram inspiradas em simuladores didáticos como [PhET — Estados da matéria](https://phet.colorado.edu/en/simulations/states-of-matter) e em padrões de apresentação de componentes do [21st.dev](https://21st.dev/).
