// Feature flags do conteúdo.
//
// nacionalidadeBisnetos: item "Bisnetos e gerações seguintes (quando demonstrado vínculo efetivo)"
// na lista de Nacionalidade portuguesa (Áreas de atuação). Fica OCULTO até a alteração à Lei da
// Nacionalidade entrar em vigor. Para ligar: troque para `true` aqui, OU faça o build com a
// variável de ambiente VITE_FEATURE_BISNETOS=true (ex.: `VITE_FEATURE_BISNETOS=true npm run build`).
export const FEATURES = {
  nacionalidadeBisnetos: import.meta.env.VITE_FEATURE_BISNETOS === 'true' || false,
}

export const isEnabled = (flag) => !flag || FEATURES[flag] === true
