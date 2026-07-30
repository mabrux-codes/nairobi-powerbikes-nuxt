<template>
  <div>
    <div class="mx-auto max-w-7xl">
      <div class="mb-6">
        <h1 class="font-heading text-4xl text-white">My <span class="text-brand-red">Favorites</span></h1>
        <p class="mt-1 text-sm text-brand-grey">Saved motorcycles</p>
      </div>

      <div v-if="loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 6" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-5"><div class="mb-3 aspect-[4/3] rounded-sm bg-brand-grey/10" /><div class="h-5 w-3/4 rounded bg-brand-grey/10" /></div>
      </div>

      <div v-else-if="motorcycles.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">
        <Heart class="mx-auto h-12 w-12 text-brand-grey/40" />
        <p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Favorites Yet</p>
        <p class="mt-2 text-sm text-brand-grey/60">Browse motorcycles and save your favorites here</p>
        <NuxtLink to="/" class="mt-4 inline-block"><Button>Browse Motorcycles</Button></NuxtLink>
      </div>

      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="m in motorcycles" :key="m.id" class="group rounded-sm border border-brand-grey/20 bg-brand-black/60 overflow-hidden transition-all duration-200 hover:border-brand-red/30">
          <div class="aspect-[4/3] overflow-hidden bg-brand-black">
            <img v-if="m.images?.length" :src="pb.files.getURL(m, m.images[0])" :alt="m.name" class="h-full w-full object-cover transition-all duration-500 group-hover:scale-105" />
          </div>
          <div class="p-4">
            <p class="text-xs font-display tracking-display text-brand-grey/60 uppercase">{{ m.brand_name }}</p>
            <h3 class="font-bold text-2xl tracking-[var(--tracking-display)] text-white">{{ m.name }}</h3>
            <p class="text-xs text-brand-grey">{{ m.year || '' }} · {{ m.engine_cc || '' }}cc · {{ m.type || '' }}</p>
            <div class="mt-2 flex items-baseline gap-2">
              <p class="text-xl font-bold text-brand-red">KES {{ ((m.sale_price || m.price) || 0).toLocaleString() }}</p>
              <p v-if="m.sale_price" class="text-xs font-bold text-brand-grey/60 line-through">KES {{ Number(m.price).toLocaleString() }}</p>
            </div>
            <div class="mt-3">
              <NuxtLink :to="bikePath(m)"><Button variant="ghost" size="sm" class="w-full">View Details</Button></NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Heart } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['customer'] })
useHead({ title: 'My Favorites - Nairobi Powerbikes' })

const pb = usePB(); const auth = useAuthStore()
const loading = ref(true)
const motorcycles = ref<any[]>([])

function bikePath(m: any) {
  return `/motorcycles/${m.slug || encodeURIComponent(m.name)}`
}

async function loadFavorites() {
  try {
    const favs = await pb.collection('favorites').getList(1, 100, { filter: `user = "${auth.user?.id}"`, expand: 'motorcycle' }).catch(() => ({ items: [] }))
    const bikeIds = [...new Set((favs.items as any[]).map((f: any) => f.motorcycle))]
    if (bikeIds.length > 0) {
      const filter = bikeIds.map((id: string) => `id = "${id}"`).join(' || ')
      const bikes = await pb.collection('motorcycles').getList(1, 50, { filter, expand: 'brand' }).catch(() => ({ items: [] }))
      motorcycles.value = (bikes.items as any[]).map(m => ({ ...m, brand_name: m.expand?.brand?.name || '' }))
    } else {
      motorcycles.value = []
    }
  } catch (e) { console.error(e) }
}

onMounted(async () => {
  await loadFavorites()
  loading.value = false
  const userId = auth.user?.id
  if (userId) {
    pb.collection('favorites').subscribe('*', () => loadFavorites())
  }
})

onUnmounted(() => {
  pb.collection('favorites').unsubscribe('*')
})
</script>
