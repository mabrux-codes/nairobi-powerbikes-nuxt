<template>
  <div class="min-h-screen bg-brand-black pb-24">
    <PageHeader
      eyebrow="Side By Side"
      title="Compare"
      accent="Motorcycles"
      description="Line up to three machines and let the specs do the talking."
      :crumbs="[{ label: 'Shop', to: '/motorcycles' }, { label: 'Compare' }]"
    />

    <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
      <!-- Selectors -->
      <div class="mt-10 grid gap-4 sm:grid-cols-3">
        <div v-for="slot in 3" :key="slot" class="relative">
          <p class="mb-2 font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Motorcycle {{ slot }}</p>
          <div class="relative">
            <Bike class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-grey/60" />
            <select v-model="selected[slot - 1]" class="input-field h-12 w-full appearance-none rounded-xl border-white/10 bg-white/[0.03] pl-10 focus:border-brand-red focus:ring-2 focus:ring-brand-red/25">
              <option value="">Select motorcycle {{ slot }}</option>
              <option v-for="b in allMotorcycles" :key="b.id" :value="b.id" :disabled="selected.includes(b.id) && selected[slot - 1] !== b.id">{{ b.brand_name }} {{ b.name }} ({{ b.year }})</option>
            </select>
          </div>
          <button v-if="selected[slot - 1]" class="absolute right-9 top-9.5 -translate-y-1/2 text-brand-grey/50 transition-colors hover:text-brand-red" :aria-label="`Clear motorcycle ${slot}`" @click="selected[slot - 1] = ''"><X class="h-4 w-4" /></button>
        </div>
      </div>

      <!-- Comparison -->
      <div v-if="compareList.length >= 2" class="mt-10">
        <div class="overflow-hidden rounded-2xl border border-white/[0.08]">
          <div class="overflow-x-auto">
            <table class="w-full min-w-[720px] border-collapse">
              <thead>
                <tr class="border-b border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent">
                  <th class="w-44 p-5 align-bottom text-left">
                    <span class="font-display text-[11px] font-bold tracking-[0.2em] text-brand-grey uppercase">Specification</span>
                  </th>
                  <th v-for="bike in compareList" :key="bike.id" class="min-w-[200px] p-5 text-center align-top">
                    <div class="group relative mb-4 overflow-hidden rounded-xl border border-white/[0.08] bg-black">
                      <img v-if="bike.images?.length" :src="pb.files.getURL(bike, bike.images[0], { thumb: '600x0' })" :alt="bike.name" class="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div v-else class="flex aspect-[16/10] items-center justify-center bg-black"><Bike class="h-10 w-10 text-zinc-700" /></div>
                      <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <span v-if="bike.sale_price" class="absolute left-2.5 top-2.5 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-bold tracking-wider text-black uppercase">Sale</span>
                    </div>
                    <NuxtLink :to="bikePath(bike)" class="font-display text-lg font-bold tracking-display text-white transition-colors hover:text-brand-red">{{ bike.name }}</NuxtLink>
                    <p class="mt-0.5 text-xs text-brand-grey">{{ bike.brand_name }}</p>
                    <p class="mt-1 font-heading text-xl text-brand-red">{{ formatPrice(bike.sale_price || bike.price) }}</p>
                    <p v-if="bike.sale_price" class="text-xs text-brand-grey/60 line-through">{{ formatPrice(bike.price) }}</p>
                    <div class="mt-4 flex flex-col gap-2">
                      <Button :to="`/service/test-ride?motorcycle=${bike.id}`" size="sm"><CalendarClock class="h-4 w-4" />Test Ride</Button>
                      <Button size="sm" variant="ghost" @click="openEnquiry(bike)"><MessageSquare class="h-4 w-4" />Enquire</Button>
                      <Button :to="bikePath(bike)" size="sm" variant="ghost"><Eye class="h-4 w-4" />View Details</Button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, ri) in specRows" :key="row.key" class="border-b border-white/[0.05] last:border-0" :class="{ 'bg-white/[0.02]': row.highlight }">
                  <td class="sticky left-0 bg-brand-black p-4 pl-5 text-sm font-semibold text-brand-grey" :class="{ 'bg-[#141414]': row.highlight }">{{ row.label }}</td>
                  <td v-for="bike in compareList" :key="bike.id" class="p-4 text-center text-sm text-white">{{ getSpecValue(bike, row.key) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p class="mt-4 text-center text-xs text-brand-grey/60">Specifications are provided by the manufacturer and may vary by market.</p>
      </div>

      <div v-else-if="compareList.length === 1" class="mt-10 rounded-2xl border border-dashed border-white/15 p-16 text-center">
        <p class="font-display text-2xl tracking-display text-brand-grey">Select at least 2 motorcycles to compare</p>
        <p class="mt-2 text-sm text-brand-grey/60">Pick a second machine from the selectors above</p>
      </div>
      <div v-else class="mt-10 rounded-2xl border border-dashed border-white/15 p-16 text-center">
        <GitCompareArrows class="mx-auto mb-4 h-10 w-10 text-brand-grey/50" />
        <p class="font-display text-2xl tracking-display text-brand-grey">No Motorcycles Selected</p>
        <p class="mt-2 text-sm text-brand-grey/60">Use the selectors above to pick up to three machines — or browse the collection below.</p>
        <div class="mt-6 flex flex-wrap justify-center gap-2">
          <button
            v-for="b in firstBikes"
            :key="b.id"
            class="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-brand-light/80 transition-all duration-200 hover:border-brand-red/60 hover:text-brand-red"
            @click="selected[0] = b.id"
          >
            + {{ b.brand_name }} {{ b.name }}
          </button>
        </div>
      </div>
    </div>

    <ShopEnquiryModal :open="enquiryOpen" :item="enquiryItem" kind="bike" @close="enquiryOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { X, Bike, CalendarClock, MessageSquare, Eye, GitCompareArrows, LoaderCircle } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'

interface Motorcycle { id: string; name: string; brand: string; brand_name?: string; year: number; engine_cc: number; type: string; price: number; sale_price?: number; images?: string[]; horsepower?: number; torque?: string; transmission?: string; fuel_capacity?: string; weight?: string; seat_height?: string; top_speed?: string; braking?: string; suspension?: string; warranty?: string; colors?: string; colors_formatted?: string; fuel_system?: string; cooling?: string; in_stock?: boolean }

useHead({
  title: 'Compare Motorcycles - Nairobi Powerbikes',
  meta: [{ name: 'description', content: 'Compare motorcycle specifications, prices and features side by side at Nairobi Powerbikes.' }],
})

const pb = usePB()
const allMotorcycles = ref<Motorcycle[]>([])
const selected = ref(['', '', ''])
const loading = ref(true)
const enquiryOpen = ref(false)
const enquiryItem = ref<any>(null)

const compareList = computed(() => allMotorcycles.value.filter(b => selected.value.includes(b.id)))
const firstBikes = computed(() => allMotorcycles.value.slice(0, 6))

const specRows = [
  { key: 'brand_name', label: 'Brand', highlight: false },
  { key: 'year', label: 'Year', highlight: false },
  { key: 'type', label: 'Type', highlight: true },
  { key: 'engine_cc', label: 'Engine (cc)', highlight: false },
  { key: 'engine', label: 'Engine Layout', highlight: false },
  { key: 'horsepower', label: 'Horsepower (hp)', highlight: true },
  { key: 'torque', label: 'Torque (Nm)', highlight: false },
  { key: 'transmission', label: 'Transmission', highlight: true },
  { key: 'fuel_system', label: 'Fuel System', highlight: false },
  { key: 'cooling', label: 'Cooling', highlight: false },
  { key: 'weight', label: 'Weight (kg)', highlight: true },
  { key: 'seat_height', label: 'Seat Height (mm)', highlight: false },
  { key: 'fuel_capacity', label: 'Fuel Capacity (L)', highlight: false },
  { key: 'top_speed', label: 'Top Speed (km/h)', highlight: true },
  { key: 'braking', label: 'Braking System', highlight: false },
  { key: 'suspension', label: 'Suspension', highlight: true },
  { key: 'warranty', label: 'Warranty', highlight: false },
  { key: 'colors', label: 'Available Colors', highlight: true },
  { key: 'in_stock', label: 'In Stock', highlight: false },
]

function getSpecValue(bike: Motorcycle, key: string): string {
  if (key === 'price' || key === 'sale_price') { const v = (bike as any)[key]; return v ? `KES ${Number(v).toLocaleString()}` : '—' }
  if (key === 'in_stock') return bike.in_stock ? 'Yes' : 'No'
  if (key === 'colors') return bike.colors || '—'
  const v = (bike as any)[key]
  return v != null && v !== '' ? String(v) : '—'
}

function formatPrice(v: number) { return `KSh ${Number(v).toLocaleString('en-KE')}` }
function bikePath(b: any) { return `/motorcycles/${b.slug || encodeURIComponent(b.name)}` }
function openEnquiry(b: any) { enquiryItem.value = b; enquiryOpen.value = true }

async function loadMotorcycles() {
  try {
    const bikes = await pb.collection('motorcycles').getFullList<Motorcycle>({ filter: 'status!="sold"', sort: '-created', expand: 'brand' })
    allMotorcycles.value = bikes.map(b => ({ ...b, brand_name: (b as any).expand?.brand?.name || '' }))
  } catch { allMotorcycles.value = [] }
  finally { loading.value = false }
}

function applyQuery() {
  const route = useRoute()
  const q = route.query.compare as string | undefined
  if (!q) return
  const ids = q.split(',').filter(Boolean).slice(0, 3)
  ids.forEach((id, i) => { if (selected.value[i] === undefined) selected.value[i] = '' })
  selected.value = ['', '', '']
  ids.forEach((id, i) => { selected.value[i] = id })
}

onMounted(async () => {
  applyQuery()
  await loadMotorcycles()
  pb.collection('motorcycles').subscribe('*', () => loadMotorcycles())
})

onUnmounted(() => { pb.collection('motorcycles').unsubscribe('*') })
</script>