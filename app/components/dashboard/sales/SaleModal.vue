<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-[80] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="New sale"
        @keydown.esc="close"
      >
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="close" />
        <motion.div
          class="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-brand-grey/20 bg-brand-black shadow-2xl shadow-black"
          :initial="{ opacity: 0, scale: 0.95, y: 16 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :transition="{ duration: 0.2 }"
        >
          <div class="flex items-center justify-between border-b border-brand-grey/15 px-5 py-4">
            <h2 class="font-display text-base font-semibold text-white">New Sale</h2>
            <button class="rounded-lg p-1.5 text-brand-grey transition-colors hover:text-white" aria-label="Close" @click="close"><X class="h-4 w-4" /></button>
          </div>

          <div class="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-4">
            <div>
              <label for="sale-motorcycle" class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Motorcycle</label>
              <select id="sale-motorcycle" v-model="form.motorcycle_id" class="h-11 w-full rounded-lg border border-brand-grey/15 bg-white/[0.04] px-3 text-sm text-white focus:outline-none focus:border-brand-red/60">
                <option value="" disabled>Select motorcycle…</option>
                <option v-for="m in availableMotorcycles" :key="m.id" :value="m.id">{{ m.name }} — KSh {{ Number(m.sale_price || m.price).toLocaleString() }} ({{ stockFor(m) }} in stock)</option>
              </select>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label for="sale-customer" class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Customer</label>
                <select id="sale-customer" v-model="form.customer_id" class="h-11 w-full rounded-lg border border-brand-grey/15 bg-white/[0.04] px-3 text-sm text-white focus:outline-none focus:border-brand-red/60">
                  <option value="">Walk-in (no account)</option>
                  <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.name || c.email }}</option>
                </select>
              </div>
              <div>
                <label for="sale-qty" class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Quantity</label>
                <input id="sale-qty" v-model="form.quantity" type="number" min="1" class="h-11 w-full rounded-lg border border-brand-grey/15 bg-white/[0.04] px-3 text-sm text-white focus:outline-none focus:border-brand-red/60" />
                <p v-if="qtyError" class="mt-1 text-xs text-rose-400">{{ qtyError }}</p>
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label for="sale-price" class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Unit Price (KSh)</label>
                <input id="sale-price" v-model="form.unit_price" type="number" min="0" class="h-11 w-full rounded-lg border border-brand-grey/15 bg-white/[0.04] px-3 text-sm text-white focus:outline-none focus:border-brand-red/60" />
              </div>
              <div>
                <label for="sale-discount" class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Discount / Unit (KSh)</label>
                <input id="sale-discount" v-model="form.unit_discount" type="number" min="0" class="h-11 w-full rounded-lg border border-brand-grey/15 bg-white/[0.04] px-3 text-sm text-white focus:outline-none focus:border-brand-red/60" />
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label for="sale-charges" class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Add. Charges (KSh)</label>
                <input id="sale-charges" v-model="form.additional_charges" type="number" min="0" class="h-11 w-full rounded-lg border border-brand-grey/15 bg-white/[0.04] px-3 text-sm text-white focus:outline-none focus:border-brand-red/60" />
              </div>
              <div>
                <label for="sale-paytype" class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Payment Type</label>
                <select id="sale-paytype" v-model="form.payment_type" class="h-11 w-full rounded-lg border border-brand-grey/15 bg-white/[0.04] px-3 text-sm text-white focus:outline-none focus:border-brand-red/60">
                  <option value="full">Full Payment</option>
                  <option value="installment">Installment</option>
                  <option value="financing">Financing</option>
                </select>
              </div>
            </div>

            <div>
              <label for="sale-notes" class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Notes</label>
              <textarea id="sale-notes" v-model="form.notes" rows="2" class="w-full rounded-lg border border-brand-grey/15 bg-white/[0.04] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-red/60" />
            </div>

            <div class="rounded-xl border border-brand-grey/15 bg-white/[0.03] p-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-brand-grey">Subtotal ({{ qtyOf(form.quantity) }} × {{ money(summary.unit_price) }})</span>
                <span class="font-semibold text-white">{{ money(summary.subtotal) }}</span>
              </div>
              <div v-if="summary.discount" class="mt-1.5 flex items-center justify-between text-sm">
                <span class="text-brand-grey">Discount</span>
                <span class="font-semibold text-emerald-400">−{{ money(summary.discount) }}</span>
              </div>
              <div v-if="summary.charges" class="mt-1.5 flex items-center justify-between text-sm">
                <span class="text-brand-grey">Additional charges</span>
                <span class="font-semibold text-white">+{{ money(summary.charges) }}</span>
              </div>
              <div class="mt-2.5 border-t border-brand-grey/15 pt-2.5 flex items-center justify-between">
                <span class="text-sm font-display tracking-wider text-brand-grey uppercase">Total Payable</span>
                <span class="font-display text-lg font-bold text-brand-red">KSh {{ money(summary.total) }}</span>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 border-t border-brand-grey/15 px-5 py-4">
            <Button variant="ghost" @click="close">Cancel</Button>
            <Button :disabled="working || !valid" @click="save"><Save class="h-4 w-4" />{{ working ? 'Saving…' : 'Create Sale' }}</Button>
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
import { useAdminDataStore } from '~/stores/adminData'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: []; saved: [] }>()

const pb = usePB()
const toast = useToast()
const store = useAdminDataStore()

const form = reactive({
  motorcycle_id: '',
  customer_id: '',
  quantity: 1,
  unit_price: 0,
  unit_discount: 0,
  additional_charges: 0,
  payment_type: 'full',
  notes: '',
})
const working = ref(false)

const customers = computed(() => store.users.filter((u: any) => u.role === 'customer'))
const availableMotorcycles = computed(() => store.motorcycles.filter((m: any) => Number(m.stock_quantity ?? 0) > 0))

function stockFor(m: any) { return Math.max(0, Math.floor(Number(m.stock_quantity ?? 0))) }
function qtyOf(v: any) { const n = Math.floor(Number(v)); return Number.isFinite(n) && n > 0 ? n : 0 }

const selectedMotorcycle = computed(() => store.motorcycles.find((m: any) => m.id === form.motorcycle_id))
const qtyError = computed(() => {
  if (!selectedMotorcycle.value) return ''
  const q = qtyOf(form.quantity)
  if (q <= 0) return 'Quantity must be at least 1.'
  if (q > stockFor(selectedMotorcycle.value)) return `Only ${stockFor(selectedMotorcycle.value)} in stock.`
  return ''
})

const summary = computed(() => {
  const unit = Number(form.unit_price || 0) || 0
  const discount = Math.min(Number(form.unit_discount || 0), unit)
  const q = qtyOf(form.quantity)
  const charges = Number(form.additional_charges || 0) || 0
  return {
    unit_price: unit,
    subtotal: unit * q,
    discount: discount * q,
    charges,
    total: Math.max(0, unit * q - discount * q + charges),
  }
})

const valid = computed(() => !!form.motorcycle_id && qtyOf(form.quantity) > 0 && !qtyError.value && summary.value.total > 0)

watch(() => props.open, (v) => {
  if (!v) return
  form.motorcycle_id = availableMotorcycles.value[0]?.id || ''
  form.customer_id = ''
  form.quantity = 1
  form.unit_price = 0
  form.unit_discount = 0
  form.additional_charges = 0
  form.payment_type = 'full'
  form.notes = ''
  working.value = false
  if (selectedMotorcycle.value) form.unit_price = Number(selectedMotorcycle.value.sale_price || selectedMotorcycle.value.price || 0)
})

watch(() => form.motorcycle_id, (id) => {
  const m = store.motorcycles.find((x: any) => x.id === id)
  if (m) form.unit_price = Number(m.sale_price || m.price || 0)
})

async function save() {
  if (!valid.value || working.value) return
  working.value = true
  try {
    await pb.collection('sales').create({
      motorcycle: form.motorcycle_id,
      customer: form.customer_id || null,
      quantity: qtyOf(form.quantity),
      original_price: Number(form.unit_price || 0),
      unit_price: Number(form.unit_price || 0),
      unit_discount: Number(form.unit_discount || 0),
      additional_charges: Number(form.additional_charges || 0),
      total_payable: summary.value.total,
      sale_value: summary.value.total,
      payment_type: form.payment_type,
      status: 'pending',
      notes: form.notes.trim() || null,
    })
    toast.add({ type: 'success', title: 'Sale created', message: `Sale for ${selectedMotorcycle.value?.name || 'motorcycle'} saved. Confirm it to deduct stock.` })
    emit('saved')
    emit('close')
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Could not create sale', message: e?.message || 'Please try again.' })
  } finally {
    working.value = false
  }
}

function money(v: any) { return Number(v || 0).toLocaleString(undefined, { maximumFractionDigits: 0 }) }
function close() { emit('close') }
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
