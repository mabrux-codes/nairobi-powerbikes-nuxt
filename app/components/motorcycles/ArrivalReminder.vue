<template>
  <Teleport to="body">
    <Transition name="reminder">
      <div
        v-if="open"
        class="fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-8"
        role="dialog"
        aria-modal="true"
        :aria-label="`Arrival reminder for ${item?.name || 'this motorcycle'}`"
        @keydown.esc="close"
      >
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="close" />
        <motion.div
          class="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-brand-black shadow-2xl shadow-black"
          :initial="{ opacity: 0, scale: 0.94, y: 20 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :transition="{ type: 'spring', stiffness: 300, damping: 28 }"
        >
          <div class="border-b border-white/[0.06] bg-gradient-to-r from-brand-red/10 to-transparent px-6 py-5">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <p class="text-[11px] font-display tracking-[0.22em] text-brand-red uppercase">Arrival Reminder</p>
                <h2 class="mt-1 font-heading text-2xl text-white">Get notified when this bike is back</h2>
              </div>
              <button
                ref="closeBtn"
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-brand-red hover:text-brand-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
                aria-label="Close arrival reminder dialog"
                @click="close"
              >
                <X class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div class="px-6 py-6">
            <div class="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
              <img v-if="thumbUrl" :src="thumbUrl" :alt="item?.name" class="h-14 w-14 rounded-xl object-cover" />
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-white">{{ item?.name }}</p>
                <p class="text-xs text-brand-grey">{{ item?.brand_name || item?.expand?.brand?.name || 'Motorcycle' }}</p>
              </div>
              <StockBadge class="ml-auto shrink-0" :item="item" size="sm" />
            </div>

            <!-- logged in: one-click -->
            <template v-if="auth.isAuthenticated">
              <p class="mt-5 text-sm leading-relaxed text-brand-light/75">
                We'll notify you on this account's notification centre the moment the
                <span class="font-semibold text-white">{{ item?.name }}</span> is back in stock.
                No need to provide any details again.
              </p>
              <div class="mt-5">
                <Button v-if="state === 'idle'" class="w-full" :loading="working" @click="subscribeUser">
                  <BellRing class="h-4 w-4" />Notify Me When Available
                </Button>
                <div v-else-if="state === 'set'" class="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-400" role="status">
                  <BellRing class="h-4 w-4" />Arrival Reminder Set
                </div>
                <p v-if="error" class="mt-3 text-center text-xs text-rose-400">{{ error }}</p>
              </div>
            </template>

            <!-- guest: email -->
            <template v-else>
              <p class="mt-5 text-sm leading-relaxed text-brand-grey">Get notified when this bike is back in stock. Enter your email and we'll let you know the moment it's available again.</p>
              <form class="mt-4 space-y-4" novalidate @submit.prevent="subscribeGuest">
                <div>
                  <label for="reminder-email" class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Email *</label>
                  <input
                    id="reminder-email"
                    v-model="email"
                    type="email"
                    autocomplete="email"
                    placeholder="your@email.com"
                    class="input-field w-full rounded-xl focus:ring-2 focus:ring-brand-red/30"
                    :aria-invalid="!!emailError"
                    :aria-describedby="emailError ? 'reminder-email-error' : undefined"
                    required
                  />
                  <p v-if="emailError" id="reminder-email-error" class="mt-1.5 text-xs text-rose-400">{{ emailError }}</p>
                </div>
                <div class="flex items-center justify-between gap-3">
                  <p class="text-xs text-brand-grey">No spam — we only email when it's back.</p>
                  <Button type="submit" :loading="working"><BellRing class="h-4 w-4" />Apply</Button>
                </div>
              </form>
              <div v-if="state === 'set'" class="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-400" role="status">
                <BellRing class="h-4 w-4" />Arrival Reminder Set
              </div>
              <p v-if="error && state !== 'set'" class="mt-3 text-center text-xs text-rose-400">{{ error }}</p>
            </template>
          </div>
        </motion.div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { X, BellRing } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useAuthStore } from '~/stores/auth'
import StockBadge from '~/components/motorcycles/StockBadge.vue'

const props = defineProps<{ open: boolean; item: any }>()

const emit = defineEmits<{ close: [] }>()

const pb = usePB()
const toast = useToast()
const auth = useAuthStore()

const state = ref<'idle' | 'set'>('idle')
const working = ref(false)
const loading = ref(false)
const error = ref('')
const email = ref('')
const emailError = ref('')
const closeBtn = ref<HTMLElement | null>(null)

watch(() => props.open, (v) => {
  if (v) {
    state.value = 'idle'
    error.value = ''
    emailError.value = ''
    email.value = ''
    nextTick(() => closeBtn.value?.focus())
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onBeforeUnmount(() => { document.body.style.overflow = '' })

const thumbUrl = computed(() => {
  const img = props.item?.images?.length ? props.item.images[0] : props.item?.image
  return img ? pb.files.getURL(props.item, img, { thumb: '120x0' }) : ''
})

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function subscribeUser() {
  if (!props.item) return
  working.value = true
  error.value = ''
  try {
    const res = await pb.send('/api/stock/reminders', {
      method: 'POST',
      body: { motorcycle: props.item.id },
    })
    state.value = 'set'
    if (res?.code === 'already') {
      toast.add({ type: 'info', title: 'Arrival Reminder Set', message: 'You were already subscribed for this motorcycle.' })
    } else {
      toast.add({ type: 'success', title: 'Arrival Reminder Set', message: 'We will notify you when it is back in stock.' })
    }
  } catch (e: any) {
    error.value = e?.message || 'Could not set the reminder. Please try again.'
  } finally {
    working.value = false
  }
}

async function subscribeGuest() {
  emailError.value = ''
  const value = email.value.trim()
  if (!EMAIL_RE.test(value)) {
    emailError.value = 'Please enter a valid email address.'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const res = await pb.send('/api/stock/reminders', {
      method: 'POST',
      body: { motorcycle: props.item.id, email: value },
    })
    state.value = 'set'
    if (res?.code === 'already') {
      toast.add({ type: 'info', title: 'Arrival Reminder Set', message: 'You were already subscribed for this motorcycle.' })
    } else {
      toast.add({ type: 'success', title: 'Arrival Reminder Set', message: 'We will notify you when it is back in stock.' })
    }
  } catch (e: any) {
    error.value = e?.message || 'Could not set the reminder. Please try again.'
  } finally {
    loading.value = false
  }
}

function close() { emit('close') }
</script>

<style scoped>
.reminder-enter-active, .reminder-leave-active { transition: opacity 0.25s ease; }
.reminder-enter-from, .reminder-leave-to { opacity: 0; }
</style>