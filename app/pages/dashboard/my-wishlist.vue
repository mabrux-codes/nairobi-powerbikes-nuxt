<template>
  <div class="mx-auto max-w-7xl">
    <div class="mb-8">
      <h1 class="font-heading text-3xl text-white sm:text-4xl">My <span class="text-brand-red">Wishlist</span></h1>
      <div class="mt-2 h-1 w-24 bg-brand-red" />
      <p class="mt-3 text-sm text-brand-grey">The motorcycles that caught your eye, saved for later.</p>
    </div>

    <div v-if="loading" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 6" :key="i" class="animate-pulse rounded-xl border border-brand-grey/15 p-4">
        <div class="aspect-[16/10] rounded-lg bg-brand-grey/10" />
        <div class="mt-3 h-5 w-3/4 rounded bg-brand-grey/10" />
        <div class="mt-2 h-3.5 w-1/2 rounded bg-brand-grey/10" />
      </div>
    </div>

    <div v-else-if="motorcycles.length === 0" class="rounded-xl border border-dashed border-brand-grey/20 bg-brand-black/40 p-14 text-center">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10">
        <Heart class="h-8 w-8 text-rose-400" />
      </div>
      <p class="mt-5 font-heading text-2xl text-white">No motorcycles saved yet.</p>
      <p class="mt-2 text-sm text-brand-grey">Browse our showroom and tap the heart on any motorcycle to save it here.</p>
      <Button to="/" class="mt-6"><Bike class="h-4 w-4" />Browse Motorcycles</Button>
    </div>

    <div v-else class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <motion.div
        v-for="(m, i) in motorcycles"
        :key="m.id"
        :initial="{ opacity: 0, y: 16 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: Math.min(i * 0.05, 0.35), duration: 0.4 }"
        class="group relative overflow-hidden rounded-xl border border-brand-grey/15 bg-brand-black/80 transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/40 hover:shadow-lg hover:shadow-brand-red/5"
      >
        <NuxtLink :to="bikePath(m)" class="block aspect-[16/10] overflow-hidden bg-brand-black">
          <img
            v-if="m.images?.length"
            :src="pb.files.getURL(m, m.images[0])"
            :alt="m.name"
            class="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
          />
          <div v-else class="flex h-full w-full items-center justify-center bg-white/[0.02]">
            <Bike class="h-10 w-10 text-brand-grey/40" />
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-80" />
        </NuxtLink>

        <button
          class="absolute top-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-brand-grey/25 bg-brand-black/70 backdrop-blur-sm text-rose-400 transition-all duration-200 hover:bg-brand-red hover:text-white hover:border-brand-red hover:scale-110"
          :disabled="removing[m.id]"
          :aria-label="`Remove ${m.name} from wishlist`"
          @click="removeFavorite(m)"
        >
          <Trash2 v-if="removing[m.id]" class="h-4 w-4 animate-pulse" />
          <Heart v-else class="h-4 w-4 fill-current" />
        </button>

        <span class="absolute top-3 left-3 z-10 rounded-md bg-brand-red/90 px-2.5 py-1 text-[10px] font-display tracking-[0.2em] text-white uppercase">
          {{ m.brand_name || 'Nairobi Powerbikes' }}
        </span>

        <div class="p-4">
          <h3 class="font-display text-xl tracking-display text-white truncate">{{ m.name }}</h3>
          <p class="mt-0.5 text-xs text-brand-grey">
            {{ m.year || '' }}<template v-if="m.engine_cc"> &middot; {{ m.engine_cc }}cc</template><template v-if="m.type"> &middot; {{ m.type }}</template>
          </p>
          <div class="mt-2.5 flex items-center justify-between gap-2">
            <div class="flex items-baseline gap-2">
              <p class="text-xl font-bold text-red-500">KES {{ ((m.sale_price || m.price) || 0).toLocaleString() }}</p>
              <p v-if="m.sale_price" class="text-xs font-bold text-brand-grey/60 line-through">KES {{ Number(m.price).toLocaleString() }}</p>
            </div>
            <span
              class="shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase"
              :class="inStock(m) ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-brand-grey/30 bg-brand-grey/10 text-brand-grey'"
            >
              {{ inStock(m) ? 'In Stock' : 'Out of Stock' }}
            </span>
          </div>
          <div class="mt-4">
            <NuxtLink :to="bikePath(m)">
              <Button variant="ghost" size="sm" class="h-11 w-full sm:h-9"><Eye class="h-4 w-4" />View Details</Button>
            </NuxtLink>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { Heart, Bike, Eye, Trash2 } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'
import { useWishlistStore } from '~/stores/wishlist'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard',
  middleware: [
    (to) => {
      const auth = useAuthStore()
      auth.loadFromStorage()
      if (!auth.isAuthenticated) {
        useToast().add({ type: 'info', title: 'Please sign in to use your wishlist.' })
        return navigateTo('/login')
      }
    },
    'auth',
  ],
  roles: ['customer'],
})
useHead({ title: 'My Wishlist - Nairobi Powerbikes' })

const pb = usePB()
const store = useWishlistStore()
const loading = ref(true)
const motorcycles = ref<any[]>([])
const removing = ref<Record<string, boolean>>({})

const bikeIds = computed(() => Object.keys(store.favorites))

function bikePath(m: any) {
  return `/motorcycles/${m.slug || encodeURIComponent(m.name)}`
}

function inStock(m: any) {
  return m.status !== 'coming_soon' && !!m.in_stock
}

async function loadMotorcycles() {
  const ids = bikeIds.value
  if (!ids.length) {
    motorcycles.value = []
    return
  }
  const filter = ids.map(id => `id = "${id}"`).join(' || ')
  const bikes = await pb.collection('motorcycles').getList(1, 100, { filter, expand: 'brand' }).catch(() => ({ items: [] }))
  motorcycles.value = (bikes.items as any[]).map(m => ({ ...m, brand_name: m.expand?.brand?.name || '' }))
}

async function removeFavorite(m: any) {
  removing.value[m.id] = true
  try {
    await store.toggle('bike', m)
  } finally {
    removing.value[m.id] = false
  }
}

watch(bikeIds, loadMotorcycles)

onMounted(async () => {
  await store.load()
  await loadMotorcycles()
  loading.value = false
})
</script>
