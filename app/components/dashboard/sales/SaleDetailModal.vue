<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open && sale"
        class="fixed inset-0 z-[80] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        :aria-label="`Sale ${sale.id}`"
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
            <div class="flex items-center gap-3">
              <h2 class="font-display text-base font-semibold text-white">Sale Details</h2>
              <StatusChip :status="sale.status" size="sm" />
            </div>
            <button class="rounded-lg p-1.5 text-brand-grey transition-colors hover:text-white" aria-label="Close" @click="close"><X class="h-4 w-4" /></button>
          </div>

          <div class="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-4">
            <div class="flex flex-wrap items-center gap-4">
              <img v-if="thumbUrl" :src="thumbUrl" :alt="saleName" class="h-16 w-24 rounded-lg object-cover" />
              <div class="min-w-0 flex-1">
                <p class="truncate text-lg font-semibold text-white">{{ saleName }}</p>
                <p class="text-sm text-brand-grey">{{ customerName }} · {{ qty }} unit{{ qty > 1 ? 's' : '' }} · {{ humanize(sale.payment_type || 'full') }}</p>
                <p v-if="sale.payment_reference" class="text-xs text-brand-grey/70">Ref {{ sale.payment_reference }}</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-[10px] font-display tracking-wider text-brand-grey uppercase">Total</p>
                <p class="font-display text-xl font-bold text-brand-red">KSh {{ money(sale.total_payable) }}</p>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div class="rounded-xl border border-brand-grey/15 bg-white/[0.03] p-3 text-center">
                <p class="text-[10px] font-display tracking-wider text-brand-grey uppercase">Unit Price</p>
                <p class="mt-0.5 font-semibold text-white">{{ money(sale.unit_price) }}</p>
              </div>
              <div class="rounded-xl border border-brand-grey/15 bg-white/[0.03] p-3 text-center">
                <p class="text-[10px] font-display tracking-wider text-brand-grey uppercase">Discount</p>
                <p class="mt-0.5 font-semibold text-emerald-400">{{ money(sale.unit_discount) }}</p>
              </div>
              <div class="rounded-xl border border-brand-grey/15 bg-white/[0.03] p-3 text-center">
                <p class="text-[10px] font-display tracking-wider text-brand-grey uppercase">Add. Charges</p>
                <p class="mt-0.5 font-semibold text-white">{{ money(sale.additional_charges) }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                <p class="text-[10px] font-display tracking-wider text-emerald-400/80 uppercase">Paid</p>
                <p class="mt-0.5 font-display text-lg font-bold text-emerald-400">KSh {{ money(sale.amount_paid) }}</p>
              </div>
              <div class="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                <p class="text-[10px] font-display tracking-wider text-amber-400/80 uppercase">Outstanding</p>
                <p class="mt-0.5 font-display text-lg font-bold text-amber-400">KSh {{ money(sale.outstanding) }}</p>
              </div>
            </div>

            <div v-if="sale.notes || sale.cancel_reason" class="rounded-xl border border-brand-grey/15 bg-white/[0.03] p-3 text-sm text-brand-grey">
              <p v-if="sale.notes"><span class="font-semibold text-white">Notes:</span> {{ sale.notes }}</p>
              <p v-if="sale.cancel_reason" class="mt-1"><span class="font-semibold text-rose-400">Cancel reason:</span> {{ sale.cancel_reason }}</p>
            </div>

            <div>
              <h3 class="mb-2 font-display text-xs font-semibold tracking-wider text-brand-grey uppercase">Payment History</h3>
              <div v-if="salePayments.length === 0" class="rounded-xl border border-dashed border-brand-grey/20 p-4 text-center text-sm text-brand-grey/60">
                No payments recorded yet.
              </div>
              <div v-else class="space-y-2">
                <div v-for="p in salePayments" :key="p.id" class="flex items-center justify-between rounded-xl border border-brand-grey/15 bg-white/[0.03] px-4 py-2.5">
                  <div>
                    <p class="text-sm font-semibold text-white">{{ money(p.amount) }} <span class="ml-1 text-xs font-normal text-brand-grey capitalize">· {{ p.type || 'payment' }}</span></p>
                    <p class="text-xs text-brand-grey/70">{{ shortDate(p.created) }} · {{ p.payment_method }}{{ p.reference ? ` · ${p.reference}` : '' }}</p>
                  </div>
                  <CheckCircle2 v-if="sale.outstanding === 0" class="h-5 w-5 text-emerald-400" />
                </div>
              </div>
            </div>

            <div v-if="saleFinancing.length" class="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
              <h3 class="mb-2 font-display text-xs font-semibold tracking-wider text-indigo-300 uppercase">Financing</h3>
              <div v-for="fin in saleFinancing" :key="fin.id" class="space-y-1.5 text-sm">
                <div class="flex justify-between"><span class="text-brand-grey">Provider</span><span class="font-semibold text-white">{{ fin.provider || '—' }}</span></div>
                <div class="flex justify-between"><span class="text-brand-grey">Total payable</span><span class="font-semibold text-white">{{ money(fin.total_payable) }}</span></div>
                <div class="flex justify-between"><span class="text-brand-grey">Plan</span><span class="text-white">{{ fin.installments }} × {{ money(fin.installment_amount) }} ({{ humanize(fin.frequency || 'monthly') }})</span></div>
                <div class="flex justify-between items-center"><span class="text-brand-grey">Status</span><StatusChip :status="fin.status || 'active'" size="sm" /></div>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-end gap-3 border-t border-brand-grey/15 px-5 py-4">
            <template v-if="sale.status !== 'cancelled'">
              <Button v-if="canConfirm" variant="secondary" :disabled="working" @click="confirm"><Check class="h-4 w-4" />Confirm</Button>
              <Button variant="ghost" :disabled="working" @click="emit('payment', sale)"><Wallet class="h-4 w-4" />Payment</Button>
              <Button variant="ghost" :disabled="working" @click="emit('financing', sale)"><Landmark class="h-4 w-4" />Financing</Button>
            </template>
            <Button variant="ghost" @click="close">Close</Button>
          </div>
        </motion.div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { X, Check, Wallet, Landmark, CheckCircle2 } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useAdminDataStore } from '~/stores/adminData'
import StatusChip from '~/components/dashboard/StatusChip.vue'

const props = defineProps<{ open: boolean; sale?: any | null }>()
const emit = defineEmits<{ close: []; saved: []; payment: [any]; financing: [any] }>()

const pb = usePB()
const toast = useToast()
const store = useAdminDataStore()

const working = ref(false)

const saleName = computed(() => props.sale?.expand?.motorcycle?.name || (props.sale?.motorcycle && typeof props.sale.motorcycle === 'object' ? props.sale.motorcycle.name : 'Motorcycle'))
const customerName = computed(() => {
  const c = props.sale?.expand?.customer
  return c ? (c.name || c.email) : 'Walk-in'
})
const qty = computed(() => Number(props.sale?.quantity || 1))
const canConfirm = computed(() => props.sale && (props.sale.status === 'draft' || props.sale.status === 'pending'))
const salePayments = computed(() => props.sale ? store.payments.filter((p: any) => p.sale === props.sale.id) : [])
const saleFinancing = computed(() => props.sale ? store.financing.filter((f: any) => f.sale === props.sale.id) : [])

const thumbUrl = computed(() => {
  const m = props.sale?.expand?.motorcycle
  if (!m || !m.images?.length) return ''
  try {
    return pb.files.getURL(m, m.images[0], { thumb: '240x0' })
  } catch {
    return ''
  }
})

async function confirm() {
  if (!props.sale || working.value) return
  working.value = true
  try {
    await pb.collection('sales').update(props.sale.id, { status: 'confirmed' })
    toast.add({ type: 'success', title: 'Sale confirmed', message: `Stock deducted for ${saleName.value}.` })
    emit('saved')
    emit('close')
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Could not confirm sale', message: e?.message || 'Please try again.' })
  } finally {
    working.value = false
  }
}

function money(v: any) { return Number(v || 0).toLocaleString(undefined, { maximumFractionDigits: 0 }) }
function humanize(s: string) { return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }
function shortDate(v: string) {
  if (!v) return '—'
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? String(v).slice(0, 10) : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
function close() { emit('close') }
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
