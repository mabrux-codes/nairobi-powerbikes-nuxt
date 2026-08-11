<template>
  <div class="mx-auto flex min-h-[70vh] max-w-lg items-center px-4 py-16">
    <motion.div
      :initial="{ opacity: 0, y: 26 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5, ease: 'easeOut' }"
      class="w-full"
    >
      <div class="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 backdrop-blur-xl sm:p-8">
        <div class="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-red/10 blur-3xl" aria-hidden="true" />

        <div v-if="state === 'loading'" class="py-10 text-center">
          <Loader2 class="mx-auto h-8 w-8 animate-spin text-brand-red" aria-hidden="true" />
          <p class="mt-4 text-sm text-brand-grey">Processing your request…</p>
        </div>

        <div v-else-if="state === 'done'" class="py-6 text-center">
          <CheckCircle2 class="mx-auto h-12 w-12 text-emerald-400" aria-hidden="true" />
          <h1 class="font-heading mt-5 text-3xl text-white">You're <span class="text-brand-red">Unsubscribed</span></h1>
          <p class="mt-2 text-sm text-brand-grey">{{ message }}</p>
          <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button v-if="prefsUrl" size="sm" variant="ghost" :to="prefsUrl">Manage Preferences</Button>
            <Button size="sm" :to="'/'">Back to Home</Button>
          </div>
        </div>

        <div v-else-if="state === 'error'" class="py-6 text-center">
          <XCircle class="mx-auto h-12 w-12 text-brand-red" aria-hidden="true" />
          <h1 class="font-heading mt-5 text-3xl text-white">Link <span class="text-brand-red">Invalid</span></h1>
          <p class="mt-2 text-sm text-brand-grey">{{ message }}</p>
          <Button class="mt-8" size="sm" :to="'/'">Back to Home</Button>
        </div>
      </div>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
import { Loader2, CheckCircle2, XCircle } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'

definePageMeta({ title: 'Unsubscribe - Nairobi Powerbikes' })
useHead({ title: 'Unsubscribe - Nairobi Powerbikes' })

const pb = usePB()
const route = useRoute()

const state = ref<'loading' | 'done' | 'error'>('loading')
const message = ref('You will no longer receive marketing emails from Nairobi Powerbikes.')
const prefsUrl = ref('')

const token = String(route.query.token || '')
const email = String(route.query.email || '')

onMounted(async () => {
  try {
    const res: any = await pb.send(`/api/email/unsubscribe${token ? `?token=${encodeURIComponent(token)}` : email ? `?email=${encodeURIComponent(email)}` : ''}`, { method: 'GET' })
    state.value = 'done'
    message.value = res?.message || message.value
    if (token) prefsUrl.value = `/email-preferences?token=${encodeURIComponent(token)}`
  } catch (e: any) {
    state.value = 'error'
    message.value = e?.message || 'This unsubscribe link is invalid or has expired.'
  }
})
</script>