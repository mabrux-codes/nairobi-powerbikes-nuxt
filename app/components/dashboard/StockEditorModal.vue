<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-[80] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        :aria-label="`Update stock for ${motorcycle?.name || 'motorcycle'}`"
        @keydown.esc="close"
      >
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="close" />
        <motion.div
          class="relative w-full max-w-md overflow-hidden rounded-2xl border border-brand-grey/20 bg-brand-black shadow-2xl shadow-black"
          :initial="{ opacity: 0, scale: 0.95, y: 16 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :transition="{ duration: 0.2 }"
        >
          <div class="flex items-center justify-between border-b border-brand-grey/15 px-5 py-4">
            <h2 class="font-display text-base font-semibold text-white">Update Stock</h2>
            <button class="p-1.5 text-brand-grey hover:text-white rounded-lg transition-colors" aria-label="Close" @click="close"><X class="h-4 w-4" /></button>
          </div>

          <div class="px-5 py-4 space-y-4">
            <div class="flex items-center gap-3 rounded-xl border border-brand-grey/15 bg-white/[0.03] p-3">
              <img v-if="thumbUrl" :src="thumbUrl" :alt="motorcycle?.name" class="h-12 w-16 rounded-lg object-cover" />
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold text-white">{{ motorcycle?.name }}</p>
                <p class="text-xs text-brand-grey">{{ brandName }}</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-[10px] font-display tracking-wider text-brand-grey uppercase">Price</p>
                <p class="text-sm font-bold text-brand-red">KSh {{ formatPrice(price) }}</p>
              </div>
            </div>

            <div>
              <label for="stock-editor-input" class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Stock Quantity</label>
              <div class="flex items-stretch gap-2">
                <button class="h-11 w-11 shrink-0 rounded-lg border border-brand-grey/20 text-xl text-white transition-colors hover:border-brand-red hover:text-brand-red" aria-label="Decrease stock" @click="decrease" :disabled="working">−</button>
                <input
                  id="stock-editor-input"
                  v-model="input"
                  type="number"
                  min="0"
                  step="1"
                  inputmode="numeric"
                  class="input-field h-11 flex-1 rounded-lg text-center font-display text-xl font-bold text-white"
                  :class="{ 'border-rose-500/60': error }"
                  :aria-invalid="!!error"
                  :aria-describedby="error ? 'stock-editor-error' : undefined"
                />
                <button class="h-11 w-11 shrink-0 rounded-lg border border-brand-grey/20 text-xl text-white transition-colors hover:border-brand-red hover:text-brand-red" aria-label="Increase stock" @click="increase" :disabled="working">+</button>
              </div>
              <p v-if="error" id="stock-editor-error" class="mt-1.5 text-xs text-rose-400">{{ error }}</p>
              <p v-else class="mt-1.5 text-[11px] text-brand-grey/70">Whole numbers only. Minimum 0.</p>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                v-for="preset in presets"
                :key="preset"
                class="h-8 rounded-lg border border-brand-grey/20 px-3 text-xs font-semibold text-brand-grey transition-colors hover:border-brand-red/50 hover:text-white"
                @click="setPreset(preset)"
              >{{ preset }}</button>
            </div>

            <div class="flex items-center justify-between rounded-xl border px-4 py-3" :class="status.badge">
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full" :class="status.dot" />
                <span class="text-xs font-bold uppercase tracking-wider">{{ status.short }}</span>
              </div>
              <span class="text-xs">{{ status.message }}</span>
            </div>
          </div>

          <div class="flex justify-end gap-3 border-t border-brand-grey/15 px-5 py-4">
            <Button variant="ghost" @click="close">Cancel</Button>
            <Button :disabled="working || !!error" @click="save"><Save class="h-4 w-4" />{{ working ? 'Saving…' : 'Update Stock' }}</Button>
          </div>
        </motion.div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { X, Save } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { getStockStatus } from '~/utils/stockStatus'

const props = defineProps<{
  open: boolean
  motorcycle: any
}>()

const emit = defineEmits<{ close: []; saved: [] }>()

const pb = usePB()
const toast = useToast()

const input = ref('0')
const error = ref('')
const working = ref(false)
const presets = [0, 2, 5, 10]

const quantity = computed(() => {
  if (input.value === '' || input.value === null || input.value === undefined) return 0
  const n = Number(input.value)
  return Number.isFinite(n) ? n : NaN
})

const status = computed(() => {
  const q = Number.isFinite(quantity.value) ? Math.max(0, Math.floor(quantity.value)) : 0
  return getStockStatus(q)
})

const price = computed(() => Number(props.motorcycle?.sale_price || props.motorcycle?.price || 0))
const thumbUrl = computed(() => {
  const img = props.motorcycle?.images?.length ? props.motorcycle.images[0] : null
  return img ? pb.files.getURL(props.motorcycle, img, { thumb: '160x0' }) : ''
})
const brandName = computed(() => {
  const m = props.motorcycle
  if (!m) return ''
  return m.brand_name || m.expand?.brand?.name || ''
})

watch(() => props.open, (v) => {
  if (v && props.motorcycle) {
    input.value = String(Math.max(0, Math.floor(Number(props.motorcycle.stock_quantity ?? 0))))
    error.value = ''
  }
})

watch(quantity, (q) => {
  if (Number.isFinite(q)) {
    if (q < 0) error.value = 'Stock cannot be negative.'
    else if (!Number.isInteger(q)) error.value = 'Stock must be a whole number.'
    else error.value = ''
  }
})

function decrease() { input.value = String(Math.max(0, (Number.isFinite(quantity.value) ? Math.floor(quantity.value) : 0) - 1)) }
function increase() { input.value = String((Number.isFinite(quantity.value) ? Math.floor(quantity.value) : 0) + 1) }
function setPreset(n: number) { input.value = String(n) }

async function save() {
  if (error.value || !Number.isFinite(quantity.value)) return
  working.value = true
  try {
    await pb.collection('motorcycles').update(props.motorcycle.id, { stock_quantity: Math.floor(quantity.value) })
    toast.add({ type: 'success', title: 'Stock updated', message: `${props.motorcycle.name} is now ${status.value.label.toLowerCase()}.` })
    emit('saved')
    close()
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Could not update stock', message: e?.message || 'Please try again.' })
  } finally {
    working.value = false
  }
}

function formatPrice(v: number) { return v ? v.toLocaleString() : '0' }

function close() { emit('close') }
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>