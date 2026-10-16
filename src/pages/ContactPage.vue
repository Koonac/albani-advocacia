<script setup>
import { reactive, ref, computed } from 'vue'
import { useSite } from '../composables/useSite.js'
import { useSeo } from '../composables/useSeo.js'
import { CONTACT, waLink, mapsEmbed } from '../config/site.js'
import AppIcon from '../components/AppIcon.vue'

const { c, wa } = useSite()
useSeo(() => ({ key: 'contact', title: c.value.meta.contact.title, description: c.value.meta.contact.description }))

const cardMeta = computed(() => ({
  waPT: { icon: 'whatsapp', href: wa(), external: true },
  waBR: { icon: 'whatsapp', href: waLink(c.value.whatsappDefault, CONTACT.whatsappBR), external: true },
  email: { icon: 'mail', href: `mailto:${CONTACT.email}` },
  instagram: { icon: 'instagram', href: CONTACT.instagram, external: true },
}))

const subjects = computed(() => c.value.areas.categories.map((cat) => cat.title).concat(['Golden Visa']))
const form = reactive({ name: '', country: '', subject: '', message: '', consent: false })
const error = ref('')

function submit() {
  const f = c.value.contact.form
  if (!form.name.trim() || !form.subject || !form.message.trim() || !form.consent) {
    error.value = f.required
    return
  }
  error.value = ''
  const text = [
    f.waIntro,
    `${f.waName}: ${form.name.trim()}`,
    form.country.trim() ? `${f.waCountry}: ${form.country.trim()}` : null,
    `${f.waSubject}: ${form.subject}`,
    `${f.waMessage}: ${form.message.trim()}`,
  ]
    .filter(Boolean)
    .join('\n')
  window.open(waLink(text), '_blank', 'noopener')
}
</script>

<template>
  <section class="pt-32 lg:pt-44">
    <div class="container-site">
      <h1 class="max-w-[16ch] text-[2.6rem] leading-[1.06] text-ivory sm:text-[3.8rem] lg:text-[4.4rem]">{{ c.contact.headline }}</h1>
      <p class="mt-6 max-w-xl text-lg text-mist lg:text-xl">{{ c.contact.intro }}</p>
    </div>
  </section>

  <!-- Cartões de canal -->
  <section class="pt-14" :aria-label="c.ui.channels">
    <div class="container-site">
      <ul class="grid gap-px border border-slate-line bg-slate-line sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="card in c.contact.cards" :key="card.key" class="flex flex-col bg-slate p-7">
          <AppIcon :name="cardMeta[card.key].icon" :size="24" class="text-brass" />
          <h2 class="mt-5 font-display text-[1.35rem] text-ivory">{{ card.title }}</h2>
          <p class="mt-1 break-words text-mist">{{ card.value }}</p>
          <a
            :href="cardMeta[card.key].href"
            :target="cardMeta[card.key].external ? '_blank' : undefined"
            :rel="cardMeta[card.key].external ? 'noopener' : undefined"
            class="btn-ghost mt-6 !min-h-11 self-start !py-2 text-sm"
            >{{ card.button }}</a
          >
        </li>
      </ul>
    </div>
  </section>

  <!-- Formulário + escritório -->
  <section class="section !pt-16">
    <div class="container-site grid gap-14 lg:grid-cols-12 lg:gap-16">
      <form class="lg:col-span-6" novalidate @submit.prevent="submit">
        <div class="grid gap-6 sm:grid-cols-2">
          <label class="field">
            <span>{{ c.contact.form.name }} *</span>
            <input v-model="form.name" type="text" name="name" autocomplete="name" required />
          </label>
          <label class="field">
            <span>{{ c.contact.form.country }}</span>
            <input v-model="form.country" type="text" name="country" autocomplete="country-name" />
          </label>
          <label class="field sm:col-span-2">
            <span>{{ c.contact.form.subject }} *</span>
            <select v-model="form.subject" name="subject" required>
              <option value="" disabled>{{ c.contact.form.subjectPlaceholder }}</option>
              <option v-for="s in subjects" :key="s" :value="s">{{ s }}</option>
            </select>
          </label>
          <label class="field sm:col-span-2">
            <span>{{ c.contact.form.message }} *</span>
            <textarea v-model="form.message" name="message" rows="5" required></textarea>
          </label>
        </div>
        <label class="mt-6 flex cursor-pointer items-start gap-3 text-[0.95rem] text-ivory/85">
          <input v-model="form.consent" type="checkbox" class="consent mt-1" required />
          <span>{{ c.contact.form.consent }}</span>
        </label>
        <p v-if="error" class="mt-5 border-l-2 border-brass-light pl-3 text-sm text-brass-light" role="alert">{{ error }}</p>
        <button type="submit" class="btn-brass mt-8 w-full sm:w-auto"><AppIcon name="whatsapp" :size="20" />{{ c.contact.form.submit }}</button>
      </form>

      <div class="lg:col-span-6">
        <h2 class="font-display text-[1.6rem] text-ivory">{{ c.contact.officeTitle }}</h2>
        <address class="mt-3 flex gap-3 not-italic text-mist"><AppIcon name="pin" :size="20" class="mt-0.5 shrink-0 text-brass" />{{ c.contact.office }}</address>
        <div class="map-frame relative mt-6 aspect-[4/3] overflow-hidden border border-slate-line">
          <iframe
            :src="mapsEmbed"
            :title="c.ui.mapTitle"
            class="absolute inset-0 h-full w-full"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div class="mt-6 flex flex-col gap-3 sm:flex-row">
          <a :href="CONTACT.googleMaps" target="_blank" rel="noopener" class="btn-ghost">
            <AppIcon name="google" :size="18" />{{ c.contact.googleProfile }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-mist);
}
.field input,
.field select,
.field textarea {
  width: 100%;
  background: #15181d;
  border: 1px solid var(--color-slate-line);
  border-radius: 2px;
  padding: 0.85rem 1rem;
  font-size: 1rem;
  color: var(--color-ivory);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.field select { appearance: none; background-image: linear-gradient(45deg, transparent 50%, #c9a55a 50%), linear-gradient(135deg, #c9a55a 50%, transparent 50%); background-position: calc(100% - 20px) 55%, calc(100% - 15px) 55%; background-size: 5px 5px; background-repeat: no-repeat; }
.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--color-brass);
  box-shadow: 0 0 0 3px rgba(201, 165, 90, 0.18);
}
.consent {
  width: 1.1rem;
  height: 1.1rem;
  accent-color: #c9a55a;
  flex-shrink: 0;
}
.map-frame {
  background: #fff;
}
</style>
