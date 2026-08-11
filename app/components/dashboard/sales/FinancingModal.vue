<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-[80] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Create financing plan"
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
            <h2 class="font-display text-base font-semibold text-white">Financing Plan</h2>
            <button class="rounded-lg p-1.5 text-brand-grey transition-colors hover:text-white" aria-label="Close" @click="close"><X class="h-4 w-4" /></button>
          </div>

          <div class="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-4">
            <div>
              <label for="fin-sale" class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Sale</label>
              <select id="fin-sale" v-model="form.sale_id" class="h-11 w-full rounded-lg border border-brand-grey/15 bg-white/[0.04] px-3 text-sm text-white focus:outline-none focus:border-brand-red/60">
                <option value="" disabled>Select sale…</option>
                <option v-for="s in financeableSales" :key="s.id" :value="s.id">{{ saleName(s) }} — {{ money(Number(s.total_payable || 0)) }} total</option>
              </select>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label for="fin-provider" class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Provider</label>
                <input id="fin-provider" v-model="form.provider" type="text" placeholder="e.g. BimaTrack, Equity…" class="h-11 w-full rounded-lg border border-brand-grey/15 bg-white/[0.04] px-3 text-sm text-white focus:outline-none focus:border-brand-red/60" />
              </div>
              <div>
                <label for="fin-ref" class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Finance Reference</label>
                <input id="fin-ref" v-model="form.finance_reference" type="text" class="h-11 w-full rounded-lg border border-brand-grey/15 bg-white/[0.04] px-3 text-sm text-white focus:outline-none focus:border-brand-red/60" />
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label for="fin-deposit" class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Deposit (KSh)</label>
                <input id="fin-deposit" v-model="form.deposit" type="number" min="0" class="h-11 w-full rounded-lg border border-brand-grey/15 bg-white/[0.04] px-3 text-sm text-white focus:outline-none focus:border-brand-red/60" />
              </div>
              <div>
                <label for="fin-freq" class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Frequency</label>
                <select id="fin-freq" v-model="form.frequency" class="h-11 w-full rounded-lg border border-brand-grey/15 bg-white/[0.04] px-3 text-sm text-white focus:outline-none focus:border-brand-red/60">
                  <option v-for="f in frequencies" :key="f" :value="f">{{ humanize(f) }}</option>
                </select>
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label for="fin-interest" class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Interest Charges (KSh)</label>
                <input id="fin-interest" v-model="form.interest_charges" type="number" min="0" class="h-11 w-full rounded-lg border border-brand-grey/15 bg-white/[0.04] px-3 text-sm text-white focus:outline-none focus:border-brand-red/60" />
              </div>
              <div>
                <label for="fin-installments" class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Installments</label>
                <input id="fin-installments" v-model="form.installments" type="number" min="1" class="h-11 w-full rounded-lg border border-brand-grey/15 bg-white/[0.04] px-3 text-sm text-white focus:outline-none focus:border-brand-red/60" />
              </div>
            </div>

            <div class="rounded-xl border border-brand-grey/15 bg-white/[0.03] p-4 space-y-1.5 text-sm">
              <div class="flex justify-between"><span class="text-brand-grey">Deposit</span><span class="font-semibold text-white">{{ money(summary.deposit) }}</span></div>
              <div class="flex justify-between"><span class="text-brand-grey">Financed</span><span class="font-semibold text-white">{{ money(summary.financed) }}</span></div>
              <div class="flex justify-between"><span class="text-brand-grey">Interest</span><span class="font-semibold text-amber-400">+{{ money(summary.interest) }}</span></div>
              <div class="flex justify-between border-t border-brand-grey/15 pt-1.5"><span class="font-display tracking-wider text-brand-grey uppercase">Total Payable</span><span class="font-display font-bold text-brand-red">KSh {{ money(summary.total) }}</span></div>
              <div v-if="summary.installments > 0" class="flex justify-between"><span class="text-brand-grey">Per installment</span><span class="font-semibold text-emerald-400">{{ money(summary.installmentAmount) }}</span></div>
            </div>
          </div>

          <div class="flex justify-end gap-3 border-t border-brand-grey/15 px-5 py-4">
            <Button variant="ghost" @click="close">Cancel</Button>
            <Button :disabled="working || !valid" @click="save"><Save class="h-4 w-4" />{{ working ? 'Saving…' : 'Create Financing' }}</Button>
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

const props = defineProps<{ open: boolean; sale?: any | null }>()
const emit = defineEmits<{ close: []; saved: [] }>()

const pb = usePB()
const toast = useToast()
const store = useAdminDataStore()

const frequencies = ['monthly', 'weekly', 'biweekly', 'quarterly']

const form = reactive({
  sale_id: '',
  provider: '',
  finance_reference: '',
  deposit: 0,
  interest_charges: 0,
  frequency: 'monthly',
  installments: 12,
})
const working = ref(false)

const financeableSales = computed(() => store.sales.filter((s: any) => s.status !== 'cancelled' && s.status !== 'draft'))
const selectedSale = computed(() => store.sales.find((s: any) => s.id === form.sale_id))

const summary = computed(() => {
  const total = Number(selectedSale.value?.total_payable || 0)
  const deposit = Math.min(Number(form.deposit || 0), total)
  const financed = Math.max(0, total - deposit)
  const interest = Number(form.interest_charges || 0) || 0
  const grand = financed + interest
  const n = Math.max(1, Math.floor(Number(form.installments || 0)))
  return {
    deposit,
    financed,
    interest,
    total: grand,
    installments: n,
    installmentAmount: n > 0 ? grand / n : 0,
  }
})

const valid = computed(() => !!form.sale_id && summary.value.total > 0)

watch(() => props.open, (v) => {
  if (!v) return
  form.sale_id = props.sale?.id || financeableSales.value[0]?.id || ''
  form.provider = ''
  form.finance_reference = ''
  form.deposit = props.sale ? 0 : 0
  form.interest_charges = 0
  form.frequency = 'monthly'
  form.installments = 12
  working.value = false
})

watch(() => form.sale_id, () => {
  const total = Number(selectedSale.value?.total_payable || 0)
  form.deposit = Math.round(total * 0.2)
})

function saleName(s: any) { return s?.expand?.motorcycle?.name || 'Motorcycle' }

async function save() {
  if (!valid.value || working.value) return
  working.value = true
  try {
    await pb.collection('financing').create({
      sale: form.sale_id,
      customer: selectedSale.value?.customer || null,
      provider: form.provider.trim() || null,
      finance_reference: form.finance_reference.trim() || null,
      deposit: summary.value.deposit,
      amount_financed: summary.value.financed,
      interest_charges: summary.value.interest,
      total_payable: summary.value.total,
      installment_amount: summary.value.installmentAmount,
      frequency: form.frequency,
      installments: summary.value.installments,
      start_date: new Date().toISOString(),
      status: 'active',
    })
    toast.add({ type: 'success', title: 'Financing created', message: `${money(summary.value.total)} financed for ${saleName(selectedSale.value)}.` })
    emit('saved')
    emit('close')
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Could not create financing', message: e?.message || 'Please try again.' })
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
