// Interface "Slug do título" para o Directus 11, escrita direto em ESM (sem etapa de build):
// o app do Directus resolve o import de 'vue' para a mesma instância que ele usa, e os
// componentes v-input/v-icon são os globais do próprio app.
//
// - Item novo: o slug acompanha o campo de origem (título) enquanto se digita.
// - Se a pessoa editar o slug à mão, ele para de acompanhar; apagando o slug, volta a acompanhar.
// - Item já salvo com slug: nunca muda sozinho (trocar o slug quebraria o link publicado).
//
// A decisão é tomada a cada mudança do título, e não na montagem: o Directus monta o formulário
// com primaryKey "+" e valores vazios enquanto carrega o item, e só depois preenche os dados
// reaproveitando o mesmo componente.
import { h, inject, ref, resolveComponent, watch } from 'vue'

// minúsculas, sem acentos e pontuação, espaços viram "-"
export function slugify(text) {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/[\s-]+/g, '-')
}

const SlugInterface = {
  name: 'InterfaceSlugDoTitulo',
  props: {
    value: { type: String, default: null },
    primaryKey: { type: [String, Number], default: null },
    disabled: { type: Boolean, default: false },
    source: { type: String, default: null },
    placeholder: { type: String, default: null },
  },
  emits: ['input'],
  setup(props, { emit }) {
    // Valores de todos os campos do formulário (fornecido pelo v-form do app)
    const values = inject('values', ref({}))
    // Editado à mão: não acompanha mais o título
    const touched = ref(false)
    // O valor atual foi gerado por esta interface (pode continuar acompanhando)
    const autoOwned = ref(false)

    // Outro item aberto no mesmo componente: recomeça do zero
    watch(
      () => props.primaryKey,
      () => {
        touched.value = false
        autoOwned.value = false
      },
    )

    function shouldFollow() {
      if (touched.value || props.disabled) return false
      return props.primaryKey === '+' || !props.value || autoOwned.value
    }

    function fromTitle() {
      return slugify(props.source ? values.value?.[props.source] : '') || null
    }

    watch(
      () => (props.source ? values.value?.[props.source] : undefined),
      () => {
        if (!shouldFollow()) return
        const slug = fromTitle()
        if (slug === (props.value || null)) return
        autoOwned.value = true
        emit('input', slug)
      },
    )

    function onInput(v) {
      if (v) {
        touched.value = true
        autoOwned.value = false
        emit('input', v)
        return
      }
      // Esvaziou: volta a acompanhar o título
      touched.value = false
      autoOwned.value = true
      emit('input', fromTitle())
    }

    return () =>
      h(
        resolveComponent('v-input'),
        {
          modelValue: props.value,
          disabled: props.disabled,
          placeholder: props.placeholder,
          // o próprio v-input normaliza o que é digitado à mão (minúsculas, traços)
          slug: true,
          'onUpdate:modelValue': onInput,
        },
        { prepend: () => h(resolveComponent('v-icon'), { name: 'link' }) },
      )
  },
}

export default {
  id: 'slug-do-titulo',
  name: 'Slug do título',
  icon: 'link',
  description: 'Gera o slug a partir de outro campo enquanto se digita, e continua editável',
  component: SlugInterface,
  types: ['string'],
  group: 'standard',
  options: [
    {
      field: 'source',
      name: 'Campo de origem',
      type: 'string',
      meta: { interface: 'input', width: 'half', note: 'Nome do campo do título, ex.: title_pt' },
    },
    {
      field: 'placeholder',
      name: 'Placeholder',
      type: 'string',
      meta: { interface: 'input', width: 'half' },
    },
  ],
}
