<template>
  <div class="mx-auto max-w-7xl space-y-6">
    <motion.div :initial="{ opacity: 0, y: 16 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.4 }" class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <span class="inline-flex items-center gap-2 rounded-full border border-brand-red/30 bg-brand-red/10 px-3 py-1 text-[10px] font-display tracking-[0.25em] text-brand-red uppercase">
          <span class="h-1.5 w-1.5 rounded-full bg-brand-red animate-pulse" />
          Sales
        </span>
        <h1 class="mt-3 font-heading text-3xl sm:text-4xl text-white">Sales &amp; <span class="text-brand-red">Inventory</span></h1>
        <p class="mt-1 text-sm text-brand-grey">Sales, payments, financing and stock movement — all in one place</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <span class="text-xs text-brand-grey/70">Updated {{ store.lastUpdated }}</span>
        <RealtimeStatus />
        <Button size="sm" @click="saleModalOpen = true">
          <Plus class="h-4 w-4" />New Sale
        </Button>
      </div>
    </motion.div>

    <div class="grid gap-4 grid-cols-2 lg:grid-cols-5">
      <div v-for="card in kpis" :key="card.label" class="rounded-xl border border-brand-grey/15 bg-brand-black/80 p-4 flex items-center gap-3">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" :class="card.iconBg">
          <component :is="card.icon" class="h-5 w-5" :class="card.iconColor" />
        </span>
        <div class="min-w-0">
          <p class="font-heading text-xl xl:text-2xl text-white truncate">{{ card.value }}</p>
          <p class="truncate text-[11px] font-display tracking-wider text-brand-grey uppercase">{{ card.label }}</p>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-1 rounded-xl border border-brand-grey/15 bg-brand-black/80 p-1.5 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="h-9 shrink-0 rounded-lg px-4 text-sm font-semibold transition-colors"
        :class="activeTab === tab.key ? 'bg-brand-red text-white' : 'text-brand-grey hover:text-white'"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
        <span v-if="tab.key === 'sales'" class="ml-1.5 rounded-full px-1.5 py-0.5 text-[10px]" :class="activeTab === 'sales' ? 'bg-white/20' : 'bg-white/10'">{{ activeSales.length }}</span>
      </button>
    </div>

    <!-- ======================= SALES TAB ======================= -->
    <div v-if="activeTab === 'sales'">
      <div class="rounded-xl border border-brand-grey/15 bg-brand-black/80 p-4 flex flex-wrap items-center gap-3">
        <div class="relative flex-1 min-w-[200px]">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-grey/50" />
          <input v-model="searchQuery" type="text" placeholder="Search customer, motorcycle, reference…" class="w-full h-9 pl-9 pr-3 text-sm text-white bg-white/[0.04] border border-brand-grey/15 rounded-lg placeholder:text-brand-grey/50 focus:outline-none focus:border-brand-red/60 focus:ring-2 focus:ring-brand-red/20 transition-all" />
        </div>
        <select v-model="statusFilter" class="h-9 text-sm bg-brand-black/60 border border-brand-grey/15 rounded-lg text-white px-3 focus:outline-none focus:border-brand-red/60">
          <option value="">All Status</option>
          <option v-for="st in saleStatuses" :key="st" :value="st">{{ humanize(st) }}</option>
        </select>
        <select v-model="payTypeFilter" class="h-9 text-sm bg-brand-black/60 border border-brand-grey/15 rounded-lg text-white px-3 focus:outline-none focus:border-brand-red/60">
          <option value="">All Payment Types</option>
          <option value="full">Full Payment</option>
          <option value="installment">Installment</option>
          <option value="financing">Financing</option>
        </select>
        <button v-if="searchQuery || statusFilter || payTypeFilter" class="h-9 px-3 text-xs font-semibold text-brand-grey hover:text-white hover:bg-white/5 rounded-lg transition-colors" @click="resetFilters">
          Clear <X class="h-3.5 w-3.5 inline -ml-0.5" />
        </button>
      </div>

      <div v-if="!store.ready" class="space-y-2 mt-4">
        <div v-for="i in 5" :key="i" class="h-16 animate-pulse rounded-xl border border-brand-grey/15 bg-brand-black/60" />
      </div>
      <div v-else-if="filteredSales.length === 0" class="mt-4 rounded-2xl border border-dashed border-brand-grey/20 bg-brand-black/40 p-14 text-center">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-red/10">
          <Banknote class="h-8 w-8 text-brand-red/60" />
        </div>
        <p class="font-display text-xl tracking-display text-brand-grey">No sales found</p>
        <p class="mt-2 text-sm text-brand-grey/60">Record your first sale and it appears here instantly.</p>
      </div>
      <div v-else class="mt-4 overflow-x-auto rounded-xl border border-brand-grey/15 bg-brand-black/80">
        <table class="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr class="border-b border-brand-grey/15 text-[11px] font-display tracking-wider text-brand-grey uppercase">
              <th class="px-4 py-3">Motorcycle</th>
              <th class="px-4 py-3">Customer</th>
              <th class="px-4 py-3 text-right">Qty</th>
              <th class="px-4 py-3 text-right">Total</th>
              <th class="px-4 py-3 text-right">Paid</th>
              <th class="px-4 py-3 text-right">Outstanding</th>
              <th class="px-4 py-3">Method</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Date</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in filteredSales" :key="sale.id" class="border-b border-brand-grey/10 transition-colors hover:bg-white/[0.03]">
              <td class="px-4 py-3">
                <p class="font-semibold text-white max-w-[200px] truncate">{{ saleName(sale) }}</p>
                <p v-if="sale.payment_reference" class="text-xs text-brand-grey/60">Ref {{ sale.payment_reference }}</p>
              </td>
              <td class="px-4 py-3 max-w-[180px] truncate text-brand-grey">{{ saleCustomer(sale) }}</td>
              <td class="px-4 py-3 text-right text-white">{{ sale.quantity }}</td>
              <td class="px-4 py-3 text-right font-semibold text-white">{{ money(sale.total_payable) }}</td>
              <td class="px-4 py-3 text-right text-emerald-400">{{ money(sale.amount_paid) }}</td>
              <td class="px-4 py-3 text-right" :class="Number(sale.outstanding || 0) > 0 ? 'text-amber-400' : 'text-brand-grey/50'">{{ money(sale.outstanding) }}</td>
              <td class="px-4 py-3 text-brand-grey">{{ sale.payment_method || '—' }}</td>
              <td class="px-4 py-3"><StatusChip :status="sale.status" size="sm" /></td>
              <td class="px-4 py-3 text-xs text-brand-grey">{{ shortDate(sale.sale_date || sale.created) }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-end gap-1.5">
                  <button class="h-8 w-8 rounded-lg border border-brand-grey/20 text-brand-grey transition-colors hover:border-brand-red/60 hover:text-white" :aria-label="`View sale ${sale.id}`" title="View" @click="openDetail(sale)"><Eye class="h-4 w-4 mx-auto" /></button>
                  <button v-if="canConfirm(sale)" class="h-8 w-8 rounded-lg border border-emerald-500/30 text-emerald-400 transition-colors hover:bg-emerald-500/10" :aria-label="`Confirm sale ${sale.id}`" title="Confirm" @click="confirmSale(sale)"><Check class="h-4 w-4 mx-auto" /></button>
                  <button v-if="!isCancelled(sale)" class="h-8 w-8 rounded-lg border border-rose-500/30 text-rose-400 transition-colors hover:bg-rose-500/10" :aria-label="`Cancel sale ${sale.id}`" title="Cancel" @click="openCancel(sale)"><X class="h-4 w-4 mx-auto" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ======================= PAYMENTS TAB ======================= -->
    <div v-if="activeTab === 'payments'">
      <div class="rounded-xl border border-brand-grey/15 bg-brand-black/80 p-4 flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm text-brand-grey"><span class="font-semibold text-white">{{ store.payments.length }}</span> payments recorded</p>
        <Button size="sm" @click="paymentSale = null; paymentOpen = true">
          <Plus class="h-4 w-4" />Record Payment
        </Button>
      </div>
      <div class="mt-4 overflow-x-auto rounded-xl border border-brand-grey/15 bg-brand-black/80">
        <table class="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr class="border-b border-brand-grey/15 text-[11px] font-display tracking-wider text-brand-grey uppercase">
              <th class="px-4 py-3">Date</th>
              <th class="px-4 py-3">Sale</th>
              <th class="px-4 py-3">Customer</th>
              <th class="px-4 py-3">Method</th>
              <th class="px-4 py-3">Reference</th>
              <th class="px-4 py-3">Type</th>
              <th class="px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pay in store.payments" :key="pay.id" class="border-b border-brand-grey/10 transition-colors hover:bg-white/[0.03]">
              <td class="px-4 py-3 text-xs text-brand-grey">{{ shortDate(pay.payment_date || pay.created) }}</td>
              <td class="px-4 py-3">
                <button v-if="pay.sale" class="text-white hover:text-brand-red transition-colors font-medium" @click="openSaleFromPayment(pay)">{{ pay.expand?.sale ? saleName(pay.expand.sale) : 'Sale' }}</button>
                <span v-else class="text-brand-grey/60">—</span>
              </td>
              <td class="px-4 py-3 text-brand-grey">{{ pay.expand?.customer?.name || pay.expand?.customer?.email || '—' }}</td>
              <td class="px-4 py-3 text-brand-grey">{{ pay.payment_method }}</td>
              <td class="px-4 py-3 text-xs text-brand-grey/70">{{ pay.reference || '—' }}</td>
              <td class="px-4 py-3"><StatusChip :status="pay.type || 'payment'" size="sm" /></td>
              <td class="px-4 py-3 text-right font-semibold text-emerald-400">{{ money(pay.amount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ======================= FINANCING TAB ======================= -->
    <div v-if="activeTab === 'financing'">
      <div class="rounded-xl border border-brand-grey/15 bg-brand-black/80 p-4 flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm text-brand-grey"><span class="font-semibold text-white">{{ store.financing.length }}</span> financing plans</p>
        <Button size="sm" @click="financingSale = null; financingOpen = true">
          <Plus class="h-4 w-4" />New Financing
        </Button>
      </div>
      <div class="mt-4 overflow-x-auto rounded-xl border border-brand-grey/15 bg-brand-black/80">
        <table class="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr class="border-b border-brand-grey/15 text-[11px] font-display tracking-wider text-brand-grey uppercase">
              <th class="px-4 py-3">Sale</th>
              <th class="px-4 py-3">Customer</th>
              <th class="px-4 py-3">Provider</th>
              <th class="px-4 py-3 text-right">Deposit</th>
              <th class="px-4 py-3 text-right">Financed</th>
              <th class="px-4 py-3 text-right">Interest</th>
              <th class="px-4 py-3 text-right">Total</th>
              <th class="px-4 py-3">Plan</th>
              <th class="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="fin in store.financing" :key="fin.id" class="border-b border-brand-grey/10 transition-colors hover:bg-white/[0.03]">
              <td class="px-4 py-3">
                <button v-if="fin.sale" class="text-white hover:text-brand-red transition-colors font-medium" @click="openSaleFromFinancing(fin)">{{ fin.expand?.sale ? saleName(fin.expand.sale) : 'Sale' }}</button>
                <span v-else class="text-brand-grey/60">—</span>
              </td>
              <td class="px-4 py-3 text-brand-grey">{{ fin.expand?.customer?.name || fin.expand?.customer?.email || '—' }}</td>
              <td class="px-4 py-3 text-brand-grey">{{ fin.provider || '—' }}</td>
              <td class="px-4 py-3 text-right text-white">{{ money(fin.deposit) }}</td>
              <td class="px-4 py-3 text-right text-white">{{ money(fin.amount_financed) }}</td>
              <td class="px-4 py-3 text-right text-amber-400">{{ money(fin.interest_charges) }}</td>
              <td class="px-4 py-3 text-right font-semibold text-white">{{ money(fin.total_payable) }}</td>
              <td class="px-4 py-3 text-xs text-brand-grey">{{ fin.frequency }} · {{ fin.installments }} × {{ money(fin.installment_amount) }}</td>
              <td class="px-4 py-3"><StatusChip :status="fin.status || 'active'" size="sm" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ======================= AUDIT TAB ======================= -->
    <div v-if="activeTab === 'audit'">
      <div class="rounded-xl border border-brand-grey/15 bg-brand-black/80 p-4 flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm text-brand-grey"><span class="font-semibold text-white">{{ store.inventoryTransactions.length }}</span> stock movements</p>
      </div>
      <div class="mt-4 overflow-x-auto rounded-xl border border-brand-grey/15 bg-brand-black/80">
        <table class="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr class="border-b border-brand-grey/15 text-[11px] font-display tracking-wider text-brand-grey uppercase">
              <th class="px-4 py-3">Date</th>
              <th class="px-4 py-3">Type</th>
              <th class="px-4 py-3">Motorcycle</th>
              <th class="px-4 py-3 text-right">Before</th>
              <th class="px-4 py-3 text-right">Change</th>
              <th class="px-4 py-3 text-right">After</th>
              <th class="px-4 py-3">Reason</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in store.inventoryTransactions" :key="tx.id" class="border-b border-brand-grey/10 transition-colors hover:bg-white/[0.03]">
              <td class="px-4 py-3 text-xs text-brand-grey">{{ shortDate(tx.created) }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize" :class="txTypeStyle(tx.type).cls">
                  <span class="h-1.5 w-1.5 rounded-full" :class="txTypeStyle(tx.type).dot" />{{ tx.type }}
                </span>
              </td>
              <td class="px-4 py-3 font-medium text-white max-w-[220px] truncate">{{ tx.expand?.motorcycle?.name || '—' }}</td>
              <td class="px-4 py-3 text-right text-brand-grey">{{ tx.quantity_before }}</td>
              <td class="px-4 py-3 text-right font-semibold" :class="Number(tx.quantity_change) < 0 ? 'text-rose-400' : 'text-emerald-400'">{{ Number(tx.quantity_change) > 0 ? '+' : '' }}{{ tx.quantity_change }}</td>
              <td class="px-4 py-3 text-right text-white">{{ tx.quantity_after }}</td>
              <td class="px-4 py-3 text-xs text-brand-grey/70 max-w-[280px] truncate">{{ tx.reason || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <SaleModal :open="saleModalOpen" @close="saleModalOpen = false" @saved="onSaved" />
    <SaleDetailModal
      :open="detailOpen"
      :sale="selectedSale"
      @close="detailOpen = false"
      @saved="onSaved"
      @payment="openPaymentFor"
      @financing="openFinancingFor"
    />
    <PaymentModal :open="paymentOpen" :sale="paymentSale" @close="paymentOpen = false" @saved="onSaved" />
    <FinancingModal :open="financingOpen" :sale="financingSale" @close="financingOpen = false" @saved="onSaved" />
    <ConfirmDialog :open="cancelOpen" :title="cancelTitle" :message="cancelMessage" confirm-text="Cancel Sale" :loading="cancelling" confirm-type="danger" @confirm="doCancelSale" @cancel="cancelOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { Plus, Search, X, Eye, Check, Banknote, Wallet, TrendingUp, Truck, ChartNoAxesCombined } from 'lucide-vue-next'
import { useAdminDataStore } from '~/stores/adminData'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import SaleModal from '~/components/dashboard/sales/SaleModal.vue'
import SaleDetailModal from '~/components/dashboard/sales/SaleDetailModal.vue'
import PaymentModal from '~/components/dashboard/sales/PaymentModal.vue'
import FinancingModal from '~/components/dashboard/sales/FinancingModal.vue'

const store = useAdminDataStore()
const pb = usePB()
const toast = useToast()

const activeTab = ref('sales')
const searchQuery = ref('')
const statusFilter = ref('')
const payTypeFilter = ref('')

const saleModalOpen = ref(false)
const detailOpen = ref(false)
const selectedSale = ref<any>(null)
const paymentOpen = ref(false)
const paymentSale = ref<any>(null)
const financingOpen = ref(false)
const financingSale = ref<any>(null)
const cancelOpen = ref(false)
const cancelling = ref(false)
const cancelTarget = ref<any>(null)

const tabs = [
  { key: 'sales', label: 'Sales' },
  { key: 'payments', label: 'Payments' },
  { key: 'financing', label: 'Financing' },
  { key: 'audit', label: 'Audit Log' },
]

const saleStatuses = ['draft', 'pending', 'reserved', 'confirmed', 'financed', 'partially_paid', 'fully_paid', 'completed', 'cancelled']

const kpis = computed(() => {
  const active = store.sales.filter(s => s.status !== 'cancelled' && s.status !== 'draft')
  const revenue = active.reduce((sum, s) => sum + Number(s.total_payable || 0), 0)
  const collected = active.reduce((sum, s) => sum + Number(s.amount_paid || 0), 0)
  const outstanding = active.reduce((sum, s) => sum + Number(s.outstanding || 0), 0)
  const units = store.motorcycles.reduce((sum, m) => sum + Number(m.units_sold || 0), 0)
  return [
    { label: 'Active Sales', value: active.length.toLocaleString(), icon: ChartNoAxesCombined, iconBg: 'bg-sky-500/10', iconColor: 'text-sky-400' },
    { label: 'Revenue (KSh)', value: money(revenue, true), icon: TrendingUp, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400' },
    { label: 'Collected (KSh)', value: money(collected, true), icon: Wallet, iconBg: 'bg-amber-500/10', iconColor: 'text-amber-400' },
    { label: 'Outstanding (KSh)', value: money(outstanding, true), icon: Banknote, iconBg: 'bg-rose-500/10', iconColor: 'text-rose-400' },
    { label: 'Units Sold', value: units.toLocaleString(), icon: Truck, iconBg: 'bg-violet-500/10', iconColor: 'text-violet-400' },
  ]
})

const activeSales = computed(() => store.sales.filter(s => s.status !== 'cancelled'))

const filteredSales = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return activeSales.value.filter(s => {
    if (statusFilter.value && s.status !== statusFilter.value) return false
    if (payTypeFilter.value && s.payment_type !== payTypeFilter.value) return false
    if (!q) return true
    const hay = [saleName(s), saleCustomer(s), s.payment_reference || '', s.id].join(' ').toLowerCase()
    return hay.includes(q)
  })
})

function saleName(sale: any) {
  return sale?.expand?.motorcycle?.name || (typeof sale?.motorcycle === 'object' && sale?.motorcycle?.name) || 'Motorcycle'
}
function saleCustomer(sale: any) {
  const c = sale?.expand?.customer
  if (!c) return sale?.customer ? 'Customer' : 'Walk-in'
  return c.name || c.email || 'Customer'
}
function canConfirm(sale: any) { return sale.status === 'draft' || sale.status === 'pending' }
function isCancelled(sale: any) { return sale.status === 'cancelled' }

function openDetail(sale: any) { selectedSale.value = sale; detailOpen.value = true }
function openSaleFromPayment(pay: any) {
  const sale = store.sales.find(s => s.id === pay.sale)
  if (sale) openDetail(sale)
}
function openSaleFromFinancing(fin: any) {
  const sale = store.sales.find(s => s.id === fin.sale)
  if (sale) openDetail(sale)
}
function openPaymentFor(sale: any) { paymentSale.value = sale; paymentOpen.value = true }
function openFinancingFor(sale: any) { financingSale.value = sale; financingOpen.value = true }

function openCancel(sale: any) {
  cancelTarget.value = sale
  cancelOpen.value = true
}
const cancelTitle = computed(() => cancelTarget.value ? `Cancel sale of ${saleName(cancelTarget.value)}?` : 'Cancel sale?')
const cancelMessage = 'Stock will be restored automatically if it was deducted. Payments already recorded stay on file.'

async function doCancelSale() {
  if (!cancelTarget.value) return
  cancelling.value = true
  try {
    const sale = cancelTarget.value
    await pb.collection('sales').update(sale.id, { status: 'cancelled', cancel_reason: '' })
    toast.add({ type: 'success', title: 'Sale cancelled', message: `${saleName(sale)} — stock restored if deducted.` })
    cancelOpen.value = false
    cancelTarget.value = null
    await store.refreshData()
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Could not cancel sale', message: e?.message || 'Please try again.' })
  } finally {
    cancelling.value = false
  }
}

async function confirmSale(sale: any) {
  try {
    await pb.collection('sales').update(sale.id, { status: 'confirmed' })
    toast.add({ type: 'success', title: 'Sale confirmed', message: `Stock deducted for ${saleName(sale)}.` })
    await store.refreshData()
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Could not confirm sale', message: e?.message || 'Please try again.' })
  }
}

function onSaved() {
  store.refreshData()
}

function resetFilters() {
  searchQuery.value = ''
  statusFilter.value = ''
  payTypeFilter.value = ''
}

function humanize(s: string) { return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }
function money(v: any, compact = false) {
  const n = Number(v || 0)
  if (compact && Math.abs(n) >= 1000000) return (n / 1000000).toLocaleString(undefined, { maximumFractionDigits: 1 }) + 'M'
  if (compact && Math.abs(n) >= 1000) return (n / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 }) + 'K'
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 })
}
function shortDate(v: string) {
  if (!v) return '—'
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return String(v).slice(0, 10)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

const TX_STYLES: Record<string, { cls: string; dot: string }> = {
  received: { cls: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', dot: 'bg-emerald-400' },
  adjustment: { cls: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', dot: 'bg-amber-400' },
  sold: { cls: 'bg-sky-500/10 text-sky-400 border border-sky-500/20', dot: 'bg-sky-400' },
  damaged: { cls: 'bg-rose-500/10 text-rose-400 border border-rose-500/20', dot: 'bg-rose-400' },
  demo: { cls: 'bg-violet-500/10 text-violet-400 border border-violet-500/20', dot: 'bg-violet-400' },
  transfer: { cls: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20', dot: 'bg-indigo-400' },
  correction: { cls: 'bg-brand-grey/10 text-brand-grey border border-brand-grey/20', dot: 'bg-brand-grey' },
  other: { cls: 'bg-brand-grey/10 text-brand-grey border border-brand-grey/20', dot: 'bg-brand-grey' },
}
function txTypeStyle(t: string) { return TX_STYLES[t] || TX_STYLES.other }

onMounted(() => { store.ensureActive() })
onBeforeUnmount(() => { store.release() })

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
</script>
