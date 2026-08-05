<template>
  <div class="mx-auto max-w-7xl">
    <div class="mb-8">
      <h1 class="font-heading text-4xl text-white">My <span class="text-brand-red">Wishlist</span></h1>
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
      <p class="mt-5 font-heading text-2xl text-white">Your wishlist is empty.</p>
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
          class="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-brand-grey/25 bg-brand-black/70 backdrop-blur-sm text-rose-400 transition-all duration-200 hover:bg-brand-red hover:text-white hover:border-brand-red hover:scale-110"
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
          <div class="mt-2.5 flex items-baseline gap-2">
            <p class="text-xl font-bold text-red-500">KES {{ ((m.sale_price || m.price) || 0).toLocaleString() }}</p>
            <p v-if="m.sale_price" class="text-xs font-bold text-brand-grey/60 line-through">KES {{ Number(m.price).toLocaleString() }}</p>
          </div>
          <div class="mt-4">
            <NuxtLink :to="bikePath(m)">
              <Button variant="ghost" size="sm" class="w-full"><Eye class="h-4 w-4" />View Details</Button>
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
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['customer'] })
useHead({ title: 'My Wishlist - Nairobi Powerbikes' })

const pb = usePB()
const auth = useAuthStore()
const toast = useToast()
const loading = ref(true)
const motorcycles = ref<any[]>([])
const favIds = ref<Record<string, string>>({})
const removing = ref<Record<string, boolean>>({})

function bikePath(m: any) {
  return `/motorcycles/${m.slug || encodeURIComponent(m.name)}`
}

async function loadFavorites() {
  try {
    const uid = auth.user?.id
    const favs = await pb.collection('favorites').getList(1, 100, { filter: `user = "${uid}"` }).catch(() => ({ items: [] }))
    const favMap: Record<string, string> = {}
    const bikeIds = (favs.items as any[]).map((f: any) => {
      favMap[f.motorcycle] = f.id
      return f.motorcycle
    })
    favIds.value = favMap
    if (bikeIds.length > 0) {
      const filter = bikeIds.map((id: string) => `id = "${id}"`).join(' || ')
      const bikes = await pb.collection('motorcycles').getList(1, 50, { filter, expand: 'brand' }).catch(() => ({ items: [] }))
      motorcycles.value = (bikes.items as any[]).map(m => ({ ...m, brand_name: m.expand?.brand?.name || '' }))
    } else {
      motorcycles.value = []
    }
  } catch (e) { console.error(e) }
}

async function removeFavorite(m: any) {
  const favId = favIds.value[m.id]
  if (!favId) return
  removing.value[m.id] = true
  try {
    await pb.collection('favorites').delete(favId)
    motorcycles.value = motorcycles.value.filter(x => x.id !== m.id)
    delete favIds.value[m.id]
    toast.add({ type: 'success', title: 'Removed from wishlist', message: `${m.name} was removed from your wishlist.` })
  } catch (err: any) {
    toast.add({ type: 'error', title: 'Failed to remove', message: err?.message || 'Something went wrong' })
  } finally {
    removing.value[m.id] = false
  }
}

function handleRealtime(e: any) {
  const record = e.record as any
  if (record.user !== auth.user?.id) return
  if (e.action === 'delete') {
    const id = Object.keys(favIds.value).find(k => favIds.value[k] === record.id)
    if (id) {
      motorcycles.value = motorcycles.value.filter(m => m.id !== id)
      delete favIds.value[id]
    }
  } else {
    loadFavorites()
  }
}

onMounted(async () => {
  await loadFavorites()
  loading.value = false
  const userId = auth.user?.id
  if (userId) {
    pb.collection('favorites').subscribe('*', handleRealtime)
  }
})

onUnmounted(() => {
  pb.collection('favorites').unsubscribe('*')
})
</script>
