<template>
  <section class="bg-brand-black py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div class="mb-12" :initial="{ opacity: 0, y: 40 }" :while-in-view="{ opacity: 1, y: 0 }" :viewport="{ once: true }" :transition="{ duration: 0.6 }">
        <h2 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl">Find <span class="text-brand-red">Us</span></h2>
        <div class="mt-2 h-1 w-24 bg-brand-red" />
        <p class="mt-4 text-brand-grey">Visit any of our branches across Nairobi</p>
      </motion.div>

      <div v-if="loading" class="space-y-6">
        <div class="h-[400px] animate-pulse rounded-sm bg-brand-grey/10" />
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><div v-for="i in 3" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-6"><div class="mb-4 h-6 w-2/3 rounded bg-brand-grey/10" /><div class="mb-2 h-4 w-full rounded bg-brand-grey/10" /><div class="mb-2 h-4 w-3/4 rounded bg-brand-grey/10" /><div class="h-4 w-1/2 rounded bg-brand-grey/10" /></div></div>
      </div>

      <template v-else>
        <ClientOnly><LeafletMap :branches="mapBranches" height="400px" /><template #fallback><div class="h-[400px] animate-pulse rounded-sm bg-brand-grey/10" /></template></ClientOnly>

        <div v-if="branches.length" class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <motion.div v-for="(branch, index) in branches" :key="branch.id" class="group rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6 transition-all duration-300 hover:border-brand-red/40 hover:bg-brand-black"
            :initial="{ opacity: 0, y: 40 }" :while-in-view="{ opacity: 1, y: 0 }" :viewport="{ once: true }" :transition="{ delay: index * 0.1, duration: 0.5 }">
            <div class="mb-4 flex items-start justify-between"><h3 class="font-display text-xl tracking-[var(--tracking-display)] text-white group-hover:text-brand-red transition-colors">{{ branch.name }}</h3><MapPin class="h-5 w-5 shrink-0 text-brand-red" /></div>
            <div class="space-y-3 text-sm text-brand-grey">
              <p class="flex items-start gap-2"><MapPin class="mt-0.5 h-4 w-4 shrink-0 text-brand-grey/50" /><span>{{ branch.address }}</span></p>
              <p v-if="branch.phone" class="flex items-center gap-2"><Phone class="h-4 w-4 shrink-0 text-brand-grey/50" /><a :href="`tel:${branch.phone}`" class="hover:text-brand-red transition-colors">{{ branch.phone }}</a></p>
              <div v-if="branch.hours" class="flex items-start gap-2"><Clock class="mt-0.5 h-4 w-4 shrink-0 text-brand-grey/50" /><span class="whitespace-pre-line">{{ branch.hours }}</span></div>
            </div>
          </motion.div>
        </div>

        <div v-else class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="fallback in fallbackBranches" :key="fallback.name" class="group rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6 transition-all duration-300 hover:border-brand-red/40 hover:bg-brand-black">
            <div class="mb-4 flex items-start justify-between"><h3 class="font-display text-xl tracking-[var(--tracking-display)] text-white group-hover:text-brand-red transition-colors">{{ fallback.name }}</h3><MapPin class="h-5 w-5 shrink-0 text-brand-red" /></div>
            <div class="space-y-3 text-sm text-brand-grey">
              <p class="flex items-start gap-2"><MapPin class="mt-0.5 h-4 w-4 shrink-0 text-brand-grey/50" /><span>{{ fallback.address }}</span></p>
              <p class="flex items-center gap-2"><Phone class="h-4 w-4 shrink-0 text-brand-grey/50" /><span>{{ fallback.phone }}</span></p>
              <p v-if="fallback.hours" class="flex items-start gap-2"><Clock class="mt-0.5 h-4 w-4 shrink-0 text-brand-grey/50" /><span class="whitespace-pre-line">{{ fallback.hours }}</span></p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { MapPin, Phone, Clock } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'

interface Branch { id: string; name: string; address: string; phone?: string; hours?: string; lat?: number; lng?: number }
interface FallbackBranch { name: string; address: string; phone: string; hours: string; lat: number; lng: number }

const pb = usePB()
const loading = ref(true)
const branches = ref<Branch[]>([])

const fallbackBranches: FallbackBranch[] = [
  { name: 'Mombasa Road Branch', address: 'DTB Centre Annex 2, Mombasa Road, Opposite Airtel Kenya, Nairobi', phone: '+254 712 345 678', hours: 'Mon-Sat: 8:00 AM - 6:00 PM\nSun: 10:00 AM - 4:00 PM', lat: -1.326078, lng: 36.8458795 },
  { name: 'Kiambu Road Branch', address: 'TotalEnergies Kiambu Road Service Station, Kiambu Road', phone: '+254 723 456 789', hours: 'Mon-Sat: 8:30 AM - 6:30 PM\nSun: 10:00 AM - 4:00 PM', lat: -1.1891417, lng: 36.8371582 },
]

const mapBranches = computed(() => {
  if (branches.value.length) return branches.value.filter(b => b.lat && b.lng).map(b => ({ name: b.name, address: b.address, phone: b.phone, hours: b.hours, lat: b.lat!, lng: b.lng! }))
  return fallbackBranches
})

onMounted(async () => {
  try { branches.value = await pb.collection('branches').getFullList<Branch>({ sort: 'name' }) }
  catch { branches.value = [] }
  finally { loading.value = false }
})
</script>
