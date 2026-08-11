<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-[80] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Record payment"
        @keydown.esc="close"
      >
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="close" />
        <motion.div
          class="relative w-full max-w-lg overflow-hidden rounded-2xl border border-brand-grey/20 bg-brand-black shadow-2xl shadow-black"
          :initial="{ opacity: 0, scale: 0.95, y: 16 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :transition="{ duration: 0.2 }"
        >
          <div class="flex items-center justify-between border-b border-brand-grey/15 px-5 py-4">
            <h2 class="font-display text-base font-semibold text-white">Record Payment</h2>
            <button class="rounded-lg p-1.5 text-brand-grey transition-colors hover:text-white" aria-label="Close" @click="close"><X class="h-4 w-4" /></button>
          </div>

          <div class="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-4">
            <div v-if="saleSummary" class="rounded-xl border border-brand-grey/15 bg-white/[0.03] p-3">
              <div class="flex items-center justify-between text-sm">
                <span class="font-semibold text-white">{{ saleSummary.name }}</span>
                <StatusChip :status="saleSummary.status" size="sm" />
              </div>
              <div class="mt-1.5 grid grid-cols-3 gap-2 text-xs">
                <div><p class="text-brand-grey uppercase font-display tracking-wider">Total</p><p class="font-semibold text-white">{{ money(saleSummary.total) }}</p></div>
                <div><p class="text-brand-grey uppercase font-display tracking-wider">Paid</p><p class="font-semibold text-emerald-400">{{ money(saleSummary.paid) }}</p></div>
                <div><p class="text-brand-grey uppercase font-display tracking-wider">Outstanding</p><p class="font-semibold text-amber-400">{{ money(saleSummary.outstanding) }}</p></div>
              </div>
            </div>

            <div>
              <label for="pay-sale" class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Sale</label>
              <select id="pay-sale" v-model="form.sale_id" class="h-11 w-full rounded-lg border border-brand-grey/15 bg-white/[0.04] px-3 text-sm text-white focus:outline-none focus:border-brand-red/60">
                <option value="" disabled>Select sale…</option>
                <option v-for="s in payableSales" :key="s.id" :value="s.id">{{ saleName(s) }} — {{ money(Number(s.outstanding || 0)) }} outstanding</option>
              </select>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label for="pay-amount" class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Amount (KSh)</label>
                <input id="pay-amount" v-model="form.amount" type="number" min="1" class="h-11 w-full rounded-lg border border-brand-grey/15 bg-white/[0.04] px-3 text-sm text-white focus:outline-none focus:border-brand-red/60" />
                <p v-if="amountError" class="mt-1 text-xs text-rose-400">{{ amountError }}</p>
              </div>
              <div>
                <label for="pay-method" class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Method</label>
                <select id="pay-method" v-model="form.payment_method" class="h-11 w-full rounded-lg border border-brand-grey/15 bg-white/[0.04] px-3 text-sm text-white focus:outline-none focus:border-brand-red/60">
                  <option v-for="m in methods" :key="m" :value="m">{{ m }}</option>
                </select>
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label for="pay-ref" class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Reference (M-Pesa code, receipt…)</label>
                <input id="pay-ref" v-model="form.reference" type="text" class="h-11 w-full rounded-lg border border-brand-grey/15 bg-white/[0.04] px-3 text-sm text-white focus:outline-none focus:border-brand-red/60" />
              </div>
              <div>
                <label for="pay-type" class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Type</label>
                <select id="pay-type" v-model="form.type" class="h-11 w-full rounded-lg border border-brand-grey/15 bg-white/[0.04] px-3 text-sm text-white focus:outline-none focus:border-brand-red/60">
                  <option v-for="t in payTypes" :key="t" :value="t">{{ humanize(t) }}</option>
                </select>
              </div>
            </div>

            <div>
              <label for="pay-notes" class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Notes</label>
              <textarea id="pay-notes" v-model="form.notes" rows="2" class="w-full rounded-lg border border-brand-grey/15 bg-white/[0.04] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-red/60" />
            </div>
          </div>

          <div class="flex justify-end gap-3 border-t border-brand-grey/15 px-5 py-4">
            <Button variant="ghost" @click="close">Cancel</Button>
            <Button :disabled="working || !valid" @click="save"><Save class="h-4 w-4" />{{ working ? 'Saving…' : 'Record Payment' }}</Button>
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
import StatusChip from '~/components/dashboard/StatusChip.vue'

const props = defineProps<{ open: boolean; sale?: any | null }>()
const emit = defineEmits<{ close: []; saved: [] }>()

const pb = usePB()
const toast = useToast()
const store = useAdminDataStore()

const methods = ['M-Pesa', 'Bank Transfer', 'Bank Deposit', 'Cash', 'Card', 'Cheque', 'Other']
const payTypes = ['deposit', 'installment', 'balance', 'full']

const form = reactive({
  sale_id: '',
  amount: 0,
  payment_method: 'M-Pesa',
  reference: '',
  type: 'installment',
  notes: '',
})
const working = ref(false)

const payableSales = computed(() => store.sales.filter((s: any) => s.status !== 'cancelled' && s.status !== 'draft'))
const selectedSale = computed(() => store.sales.find((s: any) => s.id === form.sale_id))

const saleSummary = computed(() => {
  const s = selectedSale.value
  if (!s) return null
  return {
    name: s.expand?.motorcycle?.name || 'Motorcycle',
    status: s.status,
    total: Number(s.total_payable || 0),
    paid: Number(s.amount_paid || 0),
    outstanding: Number(s.outstanding || 0),
  }
})

const amountError = computed(() => {
  const amt = Number(form.amount || 0)
  if (amt <= 0) return 'Amount must be greater than 0.'
  const out = Number(selectedSale.value?.outstanding || 0)
  if (selectedSale.value && amt > out) return `Amount exceeds outstanding balance (${money(out)}).`
  return ''
})

const valid = computed(() => !!form.sale_id && Number(form.amount || 0) > 0 && !amountError.value)

watch(() => props.open, (v) => {
  if (!v) return
  form.sale_id = props.sale?.id || payableSales.value[0]?.id || ''
  form.amount = props.sale ? Number(props.sale.outstanding || 0) : 0
  form.payment_method = 'M-Pesa'
  form.reference = ''
  form.type = props.sale ? 'installment' : 'full'
  form.notes = ''
  working.value = false
})

watch(() => form.sale_id, () => {
  form.amount = Number(selectedSale.value?.outstanding || 0)
})

function saleName(s: any) { return s?.expand?.motorcycle?.name || 'Motorcycle' }

async function save() {
  if (!valid.value || working.value) return
  working.value = true
  try {
    const me = pb.authStore.model?.id || null
    await pb.collection('payments').create({
      sale: form.sale_id,
      customer: selectedSale.value?.customer || null,
      amount: Number(form.amount),
      payment_method: form.payment_method,
      reference: form.reference.trim() || null,
      type: form.type,
      notes: form.notes.trim() || null,
      recorded_by: me,
    })
    toast.add({ type: 'success', title: 'Payment recorded', message: `${money(Number(form.amount))} on ${saleName(selectedSale.value)}.` })
    emit('saved')
    emit('close')
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Could not record payment', message: e?.message || 'Please try again.' })
  } finally {
    working.value = false
  }
}

function money(v: any) { return Number(v || 0).toLocaleString(undefined, { maximumFractionDigits: 0 }) }
function humanize(s: string) { return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }
function close() { emit('close') }
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
