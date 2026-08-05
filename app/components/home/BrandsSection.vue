<template>
  <section class="relative overflow-hidden py-20">
    <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="World-Class Manufacturers"
        title="Featured"
        accent="Brands"
        description="Trusted names in performance motorcycling, backed by official dealer partnerships."
      />
    </div>

    <div v-if="loading" class="mx-auto grid max-w-[90rem] grid-cols-2 gap-4 px-4 sm:grid-cols-3 sm:px-6 lg:flex lg:justify-center lg:gap-6">
      <div v-for="i in 5" :key="i" class="h-28 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.03] lg:h-32 lg:w-52" />
    </div>

    <div v-else class="relative">
      <div class="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-brand-black to-transparent" aria-hidden="true" />
      <div class="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-brand-black to-transparent" aria-hidden="true" />

      <div class="brand-marquee" @mouseenter="paused = true" @mouseleave="paused = false">
        <div class="brand-track" :style="{ animationPlayState: paused ? 'paused' : 'running' }">
          <template v-for="i in 2" :key="i">
            <NuxtLink
              v-for="brand in brands"
              :key="brand.id + '-' + i"
              :to="`/brands/${brand.slug || brand.id}`"
              class="group mx-3 flex h-28 w-44 shrink-0 flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 transition-all duration-300 hover:border-brand-red/40 hover:bg-white/[0.05] sm:h-32 sm:w-56"
            >
              <img
                v-if="brand.logo"
                :src="pb.files.getURL(brand, brand.logo)"
                :alt="brand.name"
                loading="lazy"
                decoding="async"
                class="mb-2 max-h-11 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <span v-else class="mb-2 font-display text-2xl tracking-display text-brand-grey/60 transition-colors duration-300 group-hover:text-brand-red sm:text-3xl">{{ brand.name.slice(0, 2).toUpperCase() }}</span>
              <span class="text-center font-display text-xs tracking-display text-brand-light transition-colors duration-300 group-hover:text-white sm:text-sm">{{ brand.name }}</span>
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePB } from '~/composables/usePocketBase'

interface Brand { id: string; name: string; slug?: string; logo?: string }

const pb = usePB()
const loading = ref(true)
const brands = ref<Brand[]>([])
const paused = ref(false)

async function loadBrands() {
  loading.value = true
  try {
    const records = await pb.collection('brands').getFullList<Brand>({ sort: 'name' })
    brands.value = records
  } catch { /* keep fallback below */ }

  if (!brands.value.length) {
    brands.value = [
      { id: 'tekken', name: 'Tekken' },
      { id: 'taro-gp', name: 'Taro GP' },
      { id: 'voge', name: 'Voge' },
      { id: 'loncin', name: 'Loncin' },
      { id: 'qj-motor', name: 'QJ Motor' },
    ]
  }

  loading.value = false
}

onMounted(async () => {
  await loadBrands()
  pb.collection('brands').subscribe('*', () => loadBrands())
})

onUnmounted(() => {
  pb.collection('brands').unsubscribe('*')
})
</script>

<style scoped>
.brand-marquee {
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
  mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
}
.brand-track {
  display: flex;
  width: max-content;
  animation: brand-scroll 36s linear infinite;
}
@keyframes brand-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>