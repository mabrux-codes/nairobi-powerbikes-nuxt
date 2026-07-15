<template>
  <section class="carbon-fiber py-20 overflow-hidden">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div class="mb-12 text-center" :initial="{ opacity: 0, y: 40 }" :while-in-view="{ opacity: 1, y: 0 }" :viewport="{ once: true }" :transition="{ duration: 0.6 }">
        <h2 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl">Our <span class="text-brand-red">Brands</span></h2>
        <div class="mx-auto mt-2 h-1 w-24 bg-brand-red" />
        <p class="mt-4 text-brand-grey">Trusted names in performance motorcycling</p>
      </motion.div>
    </div>

    <div v-if="loading" class="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:grid-cols-3 sm:px-6 lg:flex lg:flex-nowrap lg:justify-center lg:gap-6">
      <div v-for="i in 5" :key="i" class="h-28 animate-pulse rounded-sm border border-brand-grey/20 bg-brand-grey/5 lg:h-32 lg:w-48" />
    </div>

    <div v-else class="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:grid-cols-3 sm:gap-6 sm:px-6 lg:flex lg:flex-nowrap lg:justify-center lg:gap-10">
      <NuxtLink v-for="brand in displayBrands" :key="brand.id" :to="`/brands/${brand.slug || brand.id}`"
        class="group flex h-28 flex-col items-center justify-center rounded-sm border border-brand-grey/20 bg-brand-black/50 p-4 transition-all duration-300 hover:border-brand-red hover:bg-brand-black hover:shadow-lg hover:shadow-brand-red/5 sm:p-5 lg:h-32 lg:w-48">
        <img v-if="brand.logo" :src="pb.files.getURL(brand, brand.logo)" :alt="brand.name" class="mb-2 h-11 max-w-full object-contain transition-all duration-300 group-hover:scale-110 sm:h-14" />
        <span v-else class="mb-2 font-display text-2xl tracking-display text-brand-grey/60 transition-colors duration-300 group-hover:text-brand-red sm:text-3xl">{{ brand.name.slice(0, 2).toUpperCase() }}</span>
        <span class="text-center font-display text-xs tracking-display text-brand-light transition-colors duration-300 group-hover:text-white sm:text-sm">{{ brand.name }}</span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { usePB } from '~/composables/usePocketBase'

interface Brand { id: string; name: string; slug?: string; origin?: string; logo?: string }

const pb = usePB()
const loading = ref(true)
const brands = ref<Brand[]>([])

const excludedBrands = ['BMW', 'Ducati', 'Honda', 'Suzuki', 'Yamaha']

const displayBrands = computed(() => brands.value.filter(b => !excludedBrands.includes(b.name)))

async function loadBrands() {
  loading.value = true
  try {
    const records = await pb.collection('brands').getFullList<Brand>({ sort: 'name' })
    brands.value = records
  }
  catch {}
  finally { loading.value = false }
}

onMounted(async () => {
  await loadBrands()
  pb.collection('brands').subscribe('*', () => loadBrands())
})

onUnmounted(() => {
  pb.collection('brands').unsubscribe('*')
})
</script>


