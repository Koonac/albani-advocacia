// Interface "Abas" para grupos do Directus 11, escrita direto em ESM (sem etapa de build), como a
// slug-do-titulo: o import de 'vue' resolve para a instância do app e o v-form/v-icon são os
// componentes globais do próprio painel.
//
// Cada grupo filho deste grupo vira uma aba (o nome da aba é o nome do grupo filho). Só a aba
// ativa é montada, do mesmo jeito que o acordeão nativo monta cada seção: um v-form com o grupo
// filho e os campos dentro dele, repassando as edições com "apply".
// - ponto na aba: há alterações não salvas em campos dela
// - ícone de erro na aba: algum campo dela não passou na validação; ao salvar com erro, a aba
//   com o problema abre sozinha (senão o erro ficaria escondido na aba fechada)
import { computed, h, ref, resolveComponent, watch } from 'vue'

// Campos dentro de um grupo, incluindo os de grupos aninhados (mesma regra do app)
function fieldsInGroup(group, all, passed = []) {
  const found = all.filter((f) => f.meta?.group === group)
  for (const f of [...found]) {
    if (f.meta?.special?.includes('group') && !passed.includes(f.field)) {
      passed.push(f.field)
      found.push(...fieldsInGroup(f.field, all, passed))
    }
  }
  return found
}

const STYLE_ID = 'abas-de-grupo-style'
const CSS = `
.abas-de-grupo__bar {
  display: flex;
  gap: 4px;
  border-block-end: var(--theme--border-width, 2px) solid var(--theme--form--field--input--border-color, var(--theme--border-color));
  margin-block-end: var(--theme--form--row-gap, 36px);
}
.abas-de-grupo__tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px 12px;
  margin-block-end: calc(-1 * var(--theme--border-width, 2px));
  border-block-end: var(--theme--border-width, 2px) solid transparent;
  color: var(--theme--foreground-subdued);
  font-family: var(--theme--fonts--display--font-family, inherit);
  font-size: 16px;
  font-weight: 600;
  background: none;
  cursor: pointer;
  transition: color var(--fast, 125ms) var(--transition, ease), border-color var(--fast, 125ms) var(--transition, ease);
}
.abas-de-grupo__tab:hover { color: var(--theme--foreground); }
.abas-de-grupo__tab.active {
  color: var(--theme--primary);
  border-block-end-color: var(--theme--primary);
}
.abas-de-grupo__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--theme--foreground-subdued);
}
.abas-de-grupo__tab .abas-de-grupo__error { --v-icon-color: var(--theme--danger); }
`

function ensureStyle() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return
  const el = document.createElement('style')
  el.id = STYLE_ID
  el.textContent = CSS
  document.head.appendChild(el)
}

const TabsInterface = {
  name: 'InterfaceAbasDeGrupo',
  props: {
    field: { type: Object, required: true },
    fields: { type: Array, default: () => [] },
    values: { type: Object, default: () => ({}) },
    initialValues: { type: Object, default: () => ({}) },
    primaryKey: { type: [String, Number], default: null },
    disabled: { type: Boolean, default: false },
    nonEditable: { type: Boolean, default: undefined },
    batchMode: { type: Boolean, default: false },
    batchActiveFields: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    validationErrors: { type: Array, default: () => [] },
    badge: { type: String, default: null },
    rawEditorEnabled: { type: Boolean, default: undefined },
    direction: { type: String, default: undefined },
    comparison: { type: Object, default: undefined },
    collabContext: { type: Object, default: undefined },
    version: { type: Object, default: undefined },
  },
  emits: ['apply'],
  setup(props, { emit }) {
    ensureStyle()

    // Abas = grupos filhos visíveis deste grupo, na ordem do painel
    const tabs = computed(() =>
      props.fields
        .filter((f) => f.meta?.group === props.field.meta?.field && !f.meta?.hidden)
        .sort((a, b) => (a.meta?.sort ?? 0) - (b.meta?.sort ?? 0))
        .map((f) => ({ field: f, inside: fieldsInGroup(f.field, props.fields) })),
    )

    const active = ref(null)
    const current = computed(() => tabs.value.find((t) => t.field.field === active.value) ?? tabs.value[0])

    const edited = (tab) => tab.inside.some((f) => f.field in (props.values ?? {}))
    const hasError = (tab) => props.validationErrors.some((e) => e.field === tab.field.field || tab.inside.some((f) => f.field === e.field))

    // Erro de validação numa aba fechada: abre a primeira aba com erro
    watch(
      () => props.validationErrors,
      (errors) => {
        if (!errors?.length || (current.value && hasError(current.value))) return
        const withError = tabs.value.find(hasError)
        if (withError) active.value = withError.field.field
      },
    )

    return () => {
      const tab = current.value
      if (!tab) return null

      const bar = h(
        'div',
        { class: 'abas-de-grupo__bar', role: 'tablist' },
        tabs.value.map((t) =>
          h(
            'button',
            {
              type: 'button',
              role: 'tab',
              class: ['abas-de-grupo__tab', { active: t === tab }],
              'aria-selected': String(t === tab),
              onClick: () => (active.value = t.field.field),
            },
            [
              h('span', t.field.name),
              edited(t) ? h('span', { class: 'abas-de-grupo__dot', title: 'Alterado' }) : null,
              hasError(t) ? h(resolveComponent('v-icon'), { name: 'error', small: true, class: 'abas-de-grupo__error' }) : null,
            ],
          ),
        ),
      )

      // Mesmas props que o group-raw/acordeão nativos passam ao v-form; as ausentes ficam de fora
      const formProps = {
        initialValues: props.initialValues,
        fields: [{ ...tab.field, hideLabel: true }, ...tab.inside],
        modelValue: props.values,
        primaryKey: props.primaryKey,
        group: props.field.meta?.field,
        validationErrors: props.validationErrors,
        loading: props.loading,
        batchMode: props.batchMode,
        disabled: props.disabled,
        nonEditable: props.nonEditable,
        comparison: props.comparison,
        collabContext: props.collabContext,
        badge: props.badge,
        rawEditorEnabled: props.rawEditorEnabled,
        direction: props.direction,
        version: props.version,
        showNoVisibleFields: false,
        showValidationErrors: false,
        'onUpdate:modelValue': (value) => emit('apply', value),
      }
      for (const key of Object.keys(formProps)) if (formProps[key] === undefined) delete formProps[key]

      return h('div', { class: 'abas-de-grupo' }, [
        bar,
        h('div', { role: 'tabpanel' }, [h(resolveComponent('v-form'), { key: tab.field.field, ...formProps })]),
      ])
    }
  },
}

export default {
  id: 'abas-de-grupo',
  name: 'Abas',
  icon: 'tab',
  description: 'Mostra cada grupo filho como uma aba',
  component: TabsInterface,
  hideLabel: true,
  hideLoader: true,
  autoKey: true,
  types: ['alias'],
  localTypes: ['group'],
  group: 'group',
  options: [],
}
