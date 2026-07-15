<template>
  <div class="min-h-screen bg-brand-black pt-24">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div :initial="{ opacity: 0, y: 40 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6 }">
        <h1 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl">Compare <span class="text-brand-red">Motorcycles</span></h1>
        <div class="mt-2 h-1 w-24 bg-brand-red" />
        <p class="mt-4 text-brand-grey">Select up to 3 motorcycles to compare side by side.</p>
      </motion.div>

      <div class="mt-8 flex flex-wrap gap-3">
        <div v-for="slot in 3" :key="slot" class="relative min-w-[200px] flex-1">
          <select v-model="selected[slot - 1]" class="input-field w-full appearance-none">
            <option value="">Select motorcycle {{ slot }}</option>
            <option v-for="b in allMotorcycles" :key="b.id" :value="b.id" :disabled="selected.includes(b.id) && selected[slot - 1] !== b.id">{{ b.brand_name }} {{ b.name }} ({{ b.year }})</option>
          </select>
          <button v-if="selected[slot - 1]" class="absolute right-2 top-1/2 -translate-y-1/2 text-brand-grey/50 hover:text-brand-red" @click="selected[slot - 1] = ''"><X class="h-4 w-4" /></button>
        </div>
      </div>

      <div v-if="compareList.length >= 2" class="mt-10 overflow-x-auto">
        <table class="w-full min-w-[600px] border-collapse">
          <thead>
            <tr class="border-b border-brand-grey/20">
              <th class="py-3 pr-6 text-left text-xs font-display tracking-display text-brand-grey uppercase w-40">Specification</th>
              <th v-for="bike in compareList" :key="bike.id" class="p-3 text-center">
                <div class="aspect-[4/3] mb-3 overflow-hidden rounded-sm bg-brand-black">
                  <img v-if="bike.images?.length" :src="pb.files.getURL(bike, bike.images[0])" :alt="bike.name" class="h-full w-full object-cover" />
                </div>
                <NuxtLink :to="`/motorcycles/${bike.id}`" class="font-display text-lg text-white hover:text-brand-red">{{ bike.name }}</NuxtLink>
                <p class="text-xs text-brand-grey">{{ bike.brand_name }}</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in specRows" :key="row.key" class="border-b border-brand-grey/10" :class="{ 'bg-brand-grey/5': row.highlight }">
              <td class="py-3 pr-6 text-sm font-display tracking-display text-brand-grey">{{ row.label }}</td>
              <td v-for="bike in compareList" :key="bike.id" class="p-3 text-center text-sm text-white">{{ getSpecValue(bike, row.key) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else-if="compareList.length === 1" class="mt-10 rounded-sm border border-dashed border-brand-grey/20 p-16 text-center">
        <p class="font-display text-xl tracking-display text-brand-grey">Select at least 2 motorcycles to compare</p>
      </div>
      <div v-else class="mt-10 rounded-sm border border-dashed border-brand-grey/20 p-16 text-center">
        <p class="font-display text-xl tracking-display text-brand-grey">No Motorcycles Selected</p>
        <p class="mt-2 text-sm text-brand-grey/60">Use the dropdowns above to pick motorcycles for comparison</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { motion } from 'motion-v'
import { X } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'

interface Motorcycle { id: string; name: string; brand: string; brand_name?: string; year: number; engine_cc: number; type: string; price: number; sale_price?: number; images?: string[]; displacement?: number; horsepower?: number; torque?: number; transmission?: string; fuel_capacity?: number; weight?: number; top_speed?: number; braking?: string; suspension?: string; warranty?: string; colors?: string; in_stock?: boolean }

useHead({ title: 'Compare Motorcycles - Nairobi Powerbikes' })

const pb = usePB()
const allMotorcycles = ref<Motorcycle[]>([])
const selected = ref(['', '', ''])

const compareList = computed(() => allMotorcycles.value.filter(b => selected.value.includes(b.id)))

const specRows = [
  { key: 'brand_name', label: 'Brand', highlight: false },
  { key: 'year', label: 'Year', highlight: false },
  { key: 'type', label: 'Type', highlight: true },
  { key: 'engine_cc', label: 'Engine (cc)', highlight: false },
  { key: 'horsepower', label: 'Horsepower (hp)', highlight: true },
  { key: 'torque', label: 'Torque (Nm)', highlight: false },
  { key: 'transmission', label: 'Transmission', highlight: true },
  { key: 'fuel_capacity', label: 'Fuel Capacity (L)', highlight: false },
  { key: 'weight', label: 'Weight (kg)', highlight: true },
  { key: 'top_speed', label: 'Top Speed (km/h)', highlight: false },
  { key: 'braking', label: 'Braking System', highlight: true },
  { key: 'suspension', label: 'Suspension', highlight: false },
  { key: 'price', label: 'Price', highlight: true },
  { key: 'sale_price', label: 'Sale Price', highlight: false },
  { key: 'colors', label: 'Available Colors', highlight: false },
  { key: 'warranty', label: 'Warranty', highlight: true },
  { key: 'in_stock', label: 'In Stock', highlight: false },
]

function getSpecValue(bike: Motorcycle, key: string): string {
  if (key === 'price' || key === 'sale_price') { const v = (bike as any)[key]; return v ? `KES ${Number(v).toLocaleString()}` : '—' }
  if (key === 'in_stock') return bike.in_stock ? 'Yes' : 'No'
  const v = (bike as any)[key]
  return v != null && v !== '' ? String(v) : '—'
}

async function loadMotorcycles() {
  try {
    const bikes = await pb.collection('motorcycles').getFullList<Motorcycle>({ filter: 'status!="sold"', sort: '-created', expand: 'brand' })
    allMotorcycles.value = bikes.map(b => ({ ...b, brand_name: (b as any).expand?.brand?.name || '' }))
  } catch { allMotorcycles.value = [] }
}

onMounted(async () => {
  await loadMotorcycles()
  pb.collection('motorcycles').subscribe('*', () => loadMotorcycles())
})

onUnmounted(() => { pb.collection('motorcycles').unsubscribe('*') })
</script>
