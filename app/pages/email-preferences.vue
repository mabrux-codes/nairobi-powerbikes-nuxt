<template>
  <div class="mx-auto max-w-xl px-4 py-16">
    <motion.div
      :initial="{ opacity: 0, y: 26 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5, ease: 'easeOut' }"
    >
      <div class="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 backdrop-blur-xl sm:p-8">
        <div class="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-red/10 blur-3xl" aria-hidden="true" />

        <div v-if="loading" class="py-10 text-center">
          <Loader2 class="mx-auto h-8 w-8 animate-spin text-brand-red" aria-hidden="true" />
          <p class="mt-4 text-sm text-brand-grey">Loading your preferences…</p>
        </div>

        <div v-else-if="!prefs" class="py-6 text-center">
          <XCircle class="mx-auto h-12 w-12 text-brand-red" aria-hidden="true" />
          <h1 class="font-heading mt-5 text-3xl text-white">Link <span class="text-brand-red">Invalid</span></h1>
          <p class="mt-2 text-sm text-brand-grey">We couldn't find a subscription for this link.</p>
          <Button class="mt-8" size="sm" :to="'/'">Back to Home</Button>
        </div>

        <div v-else>
          <h1 class="font-heading text-3xl text-white">Email <span class="text-brand-red">Preferences</span></h1>
          <p class="mt-2 text-sm text-brand-grey">Choose what you hear from {{ prefs.email }}</p>

          <div class="mt-6 space-y-3">
            <label class="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-brand-grey/15 bg-white/[0.02] p-4">
              <span>
                <span class="block text-sm font-semibold text-white">All marketing emails</span>
                <span class="mt-0.5 block text-xs text-brand-grey">Master switch for every category below</span>
              </span>
              <button
                role="switch"
                :aria-checked="prefs.marketingConsent"
                :aria-label="'Toggle all marketing emails'"
                :disabled="saving"
                class="relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50"
                :class="prefs.marketingConsent ? 'bg-brand-red' : 'bg-brand-grey/30'"
                @click="toggleMarketing(!prefs.marketingConsent)"
              >
                <span class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all" :class="prefs.marketingConsent ? 'left-[22px]' : 'left-0.5'" />
              </button>
            </label>

            <label v-for="c in categories" :key="c.key" class="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-brand-grey/15 bg-white/[0.02] p-4">
              <span>
                <span class="block text-sm font-semibold text-white">{{ c.label }}</span>
                <span class="mt-0.5 block text-xs text-brand-grey">{{ c.desc }}</span>
              </span>
              <button
                role="switch"
                :aria-checked="prefs.prefs[c.key] !== false && prefs.marketingConsent"
                :aria-label="`Toggle ${c.label}`"
                :disabled="saving || !prefs.marketingConsent"
                class="relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50"
                :class="prefs.prefs[c.key] !== false && prefs.marketingConsent ? 'bg-brand-red' : 'bg-brand-grey/30'"
                @click="toggleCategory(c.key, prefs.prefs[c.key] === false)"
              >
                <span class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all" :class="prefs.prefs[c.key] !== false && prefs.marketingConsent ? 'left-[22px]' : 'left-0.5'" />
              </button>
            </label>
          </div>

          <div class="mt-8 flex flex-wrap items-center gap-3">
            <Button :disabled="saving" @click="save">{{ saving ? 'Saving…' : 'Save Preferences' }}</Button>
            <Button v-if="prefs.status !== 'subscribed'" size="sm" variant="ghost" :disabled="saving" @click="resubscribe">{{ saving ? 'Saving…' : 'Resubscribe to everything' }}</Button>
          </div>
        </div>
      </div>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
import { Loader2, XCircle } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'

definePageMeta({ title: 'Email Preferences - Nairobi Powerbikes' })
useHead({ title: 'Email Preferences - Nairobi Powerbikes' })

const pb = usePB()
const toast = useToast()
const route = useRoute()

const loading = ref(true)
const saving = ref(false)
const prefs = ref<{
  email: string
  status: string
  marketingConsent: boolean
  prefs: Record<string, boolean>
} | null>(null)

const categories = [
  { key: 'promotions', label: 'Promotions & Deals', desc: 'Seasonal offers and discounted motorcycles' },
  { key: 'newMotorcycles', label: 'New Motorcycles', desc: 'Fresh arrivals landing on the showroom floor' },
  { key: 'blog', label: 'Blog & Riding Culture', desc: 'Stories, guides and garage news' },
  { key: 'offers', label: 'Special Offers', desc: 'Finance packages and exclusive incentives' },
  { key: 'wishlistAlerts', label: 'Wishlist Alerts', desc: 'Restocks and price changes on bikes you saved' },
  { key: 'restockAlerts', label: 'Restock Alerts', desc: 'News when a bike you requested returns' },
]

const token = String(route.query.token || '')
const email = String(route.query.email || '')

const queryStr = token ? `token=${encodeURIComponent(token)}` : email ? `email=${encodeURIComponent(email)}` : ''

onMounted(async () => {
  try {
    const res: any = await pb.send(`/api/email/preferences${queryStr ? `?${queryStr}` : ''}`, { method: 'GET' })
    prefs.value = { email: res.email, status: res.status, marketingConsent: !!res.marketingConsent, prefs: res.prefs }
  } catch {
    prefs.value = null
  } finally {
    loading.value = false
  }
})

function toggleMarketing(v: boolean) {
  if (!prefs.value) return
  prefs.value.marketingConsent = v
}

function toggleCategory(key: string, v: boolean) {
  if (!prefs.value) return
  prefs.value.prefs[key] = v
}

async function save() {
  if (!prefs.value) return
  saving.value = true
  try {
    await pb.send('/api/email/preferences', {
      body: {
        ...(queryStr ? { token, email } : {}),
        prefs: {
          marketing: prefs.value.marketingConsent,
          promotions: prefs.value.prefs.promotions !== false,
          newMotorcycles: prefs.value.prefs.newMotorcycles !== false,
          blog: prefs.value.prefs.blog !== false,
          offers: prefs.value.prefs.offers !== false,
          wishlistAlerts: prefs.value.prefs.wishlistAlerts !== false,
          restockAlerts: prefs.value.prefs.restockAlerts !== false,
        },
      },
    })
    toast.add({ type: 'success', title: 'Preferences saved' })
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Failed to save', message: e?.message })
  } finally {
    saving.value = false
  }
}

async function resubscribe() {
  saving.value = true
  try {
    await pb.send('/api/email/preferences/resubscribe', { body: { token, email } })
    if (prefs.value) prefs.value.status = 'subscribed'
    toast.add({ type: 'success', title: 'Subscribed again' })
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Failed to resubscribe', message: e?.message })
  } finally {
    saving.value = false
  }
}
</script>