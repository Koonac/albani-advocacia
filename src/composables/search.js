// Busca em texto sem diferenciar acentos nem maiúsculas ("imigracao" encontra "Imigração").

const fold = (s) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

/** Termos da busca: palavras normalizadas, sem repetição; letras soltas ("a", "e") são ignoradas */
export const searchTerms = (query) => [...new Set(fold(query).split(/\s+/).filter((t) => t.length > 1))]

/** true se todos os termos aparecem em algum dos textos */
export function matchesAll(terms, ...texts) {
  const hay = fold(texts.join(' '))
  return terms.every((t) => hay.includes(t))
}

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * HTML do texto (escapado) com os termos dentro de <mark>. A busca roda na versão sem acentos,
 * e cada posição dela é mapeada de volta para o caractere original.
 */
export function highlight(text, terms) {
  if (!terms.length) return escapeHtml(text)
  const chars = [...text]
  let folded = ''
  const origin = [] // origin[i] = índice em chars do caractere que gerou folded[i]
  chars.forEach((ch, i) => {
    const f = fold(ch)
    folded += f
    for (let k = 0; k < f.length; k++) origin.push(i)
  })

  const marked = new Array(chars.length).fill(false)
  for (const t of terms) {
    for (let at = folded.indexOf(t); at !== -1; at = folded.indexOf(t, at + t.length)) {
      for (let k = at; k < at + t.length; k++) marked[origin[k]] = true
    }
  }

  let html = ''
  let open = false
  chars.forEach((ch, i) => {
    if (marked[i] && !open) (html += '<mark>'), (open = true)
    if (!marked[i] && open) (html += '</mark>'), (open = false)
    html += escapeHtml(ch)
  })
  return open ? html + '</mark>' : html
}
