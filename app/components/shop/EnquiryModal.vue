<template>
  <Teleport to="body">
    <Transition name="enquiry">
      <div
        v-if="open"
        class="fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-8"
        role="dialog"
        aria-modal="true"
        :aria-label="`Enquire about ${item?.name || 'this product'}`"
        @keydown.esc="close"
      >
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="close" />
        <motion.div
          class="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-brand-black shadow-2xl shadow-black"
          :initial="{ opacity: 0, scale: 0.94, y: 20 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :transition="{ type: 'spring', stiffness: 300, damping: 28 }"
        >
          <div class="border-b border-white/[0.06] bg-gradient-to-r from-brand-red/10 to-transparent px-6 py-5">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-[11px] font-display tracking-[0.22em] text-brand-red uppercase">{{ categoryLabel }} Enquiry</p>
                <h2 class="mt-1 font-heading text-2xl text-white">Request Information</h2>
              </div>
              <button
                ref="closeBtn"
                class="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-brand-red hover:text-brand-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
                aria-label="Close enquiry form"
                @click="close"
              >
                <X class="h-4 w-4" />
              </button>
            </div>
          </div>

          <form class="space-y-4 px-6 py-6" @submit.prevent="submit">
            <div class="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
              <img v-if="thumbUrl" :src="thumbUrl" :alt="item?.name" class="h-14 w-14 rounded-xl object-cover" />
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-white">{{ item?.name }}</p>
                <p class="text-xs text-brand-grey">{{ formatPrice(price) }}</p>
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Full Name *</label>
                <input v-model="form.name" type="text" placeholder="John Doe" class="input-field rounded-xl" required />
              </div>
              <div>
                <label class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Phone *</label>
                <input v-model="form.phone" type="tel" placeholder="+254 7XX XXX XXX" class="input-field rounded-xl" required />
              </div>
            </div>
            <div>
              <label class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Email *</label>
              <input v-model="form.email" type="email" placeholder="you@example.com" class="input-field rounded-xl" required />
            </div>
            <div>
              <label class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Message</label>
              <textarea v-model="form.message" rows="4" class="input-field rounded-xl resize-none" placeholder="Tell us what you'd like to know..." />
            </div>

            <div class="flex items-center justify-between gap-4 pt-1">
              <p class="text-xs text-brand-grey">Our team will respond within 24 hours.</p>
              <div class="flex gap-2">
                <Button type="button" variant="ghost" @click="close">Cancel</Button>
                <Button type="submit" :loading="sending">
                  <Send class="h-4 w-4" />Send Enquiry
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { X, Send } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useAuthStore } from '~/stores/auth'
import type { CatalogKind } from '~/composables/useCatalogFilters'

const props = defineProps<{
  open: boolean
  item: any
  kind: CatalogKind
}>()

const emit = defineEmits<{ close: [] }>()

const pb = usePB()
const toast = useToast()
const auth = useAuthStore()
const sending = ref(false)
const closeBtn = ref<HTMLElement | null>(null)

const form = reactive({
  name: '',
  phone: '',
  email: '',
  message: '',
})

watch(() => props.open, (v) => {
  if (v) {
    form.message = `I'd like to know more about the ${props.item?.name || 'product'}.`
    if (auth.isAuthenticated && auth.user) {
      form.name = auth.user.name || ''
      form.email = auth.user.email || ''
    }
    nextTick(() => closeBtn.value?.focus())
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onBeforeUnmount(() => { document.body.style.overflow = '' })

const categoryLabel = computed(() => {
  if (props.kind === 'bike') return 'Motorcycle'
  if (props.kind === 'accessory') return 'Accessory'
  return 'Apparel'
})

const price = computed(() => (props.item?.sale_price || props.item?.price) ?? 0)
const thumbUrl = computed(() => {
  const img = props.item?.images?.length ? props.item.images[0] : props.item?.image
  return img ? pb.files.getURL(props.item, img, { thumb: '120x0' }) : ''
})

function formatPrice(v: number) { return `KSh ${Number(v).toLocaleString('en-KE')}` }

async function submit() {
  if (!form.name || !form.email || !form.phone) return
  sending.value = true
  try {
    await pb.collection('contacts').create({
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: `${categoryLabel.value} Enquiry: ${props.item?.name || ''}`,
      category: props.kind === 'bike' ? 'sales' : 'parts',
      message: form.message,
      status: 'new',
      read: false,
    })
    toast.add({ type: 'success', title: 'Enquiry sent', message: 'Our team will get back to you within 24 hours.' })
    emit('close')
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Could not send enquiry', message: e?.message || 'Please try again.' })
  } finally {
    sending.value = false
  }
}

function close() { emit('close') }
</script>

<style scoped>
.enquiry-enter-active, .enquiry-leave-active { transition: opacity 0.25s ease; }
.enquiry-enter-from, .enquiry-leave-to { opacity: 0; }
</style>