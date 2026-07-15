<template>
  <div>
    <div class="mx-auto max-w-7xl">
      <div class="mb-6">
        <h1 class="font-heading text-4xl text-white">My <span class="text-brand-red">Favorites</span></h1>
        <p class="mt-1 text-sm text-brand-grey">Saved motorcycles</p>
      </div>

      <div v-if="loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 6" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-5"><div class="mb-3 aspect-video rounded-sm bg-brand-grey/10" /><div class="h-5 w-3/4 rounded bg-brand-grey/10" /></div>
      </div>

      <div v-else-if="motorcycles.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">
        <Heart class="mx-auto h-12 w-12 text-brand-grey/40" />
        <p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Favorites Yet</p>
        <p class="mt-2 text-sm text-brand-grey/60">Browse motorcycles and save your favorites here</p>
        <NuxtLink to="/" class="mt-4 inline-block"><Button>Browse Motorcycles</Button></NuxtLink>
      </div>

      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="m in motorcycles" :key="m.id" class="group rounded-sm border border-brand-grey/20 bg-brand-black/60 p-4 transition-all duration-200 hover:border-brand-red/30">
          <div class="mb-3 flex aspect-video items-center justify-center rounded-sm bg-brand-grey/10">
            <Bike class="h-10 w-10 text-brand-grey/30" />
          </div>
          <h3 class="font-display text-lg tracking-display text-white truncate">{{ m.name }}</h3>
          <p class="text-sm text-brand-grey">{{ m.brand_name || '' }} &middot; {{ m.year || '' }}</p>
          <div class="mt-3 flex items-center justify-between">
            <span class="font-display text-lg tracking-display text-brand-red">KSh {{ formatPrice(m.price) }}</span>
            <Badge :variant="m.status === 'available' ? 'success' : m.status === 'sold' ? 'danger' : 'warning'">{{ m.status || 'unknown' }}</Badge>
          </div>
          <div class="mt-3 flex gap-2">
            <Button variant="ghost" size="sm" class="flex-1" @click="removeFavorite(m)">Remove</Button>
            <Button variant="outline" size="sm" class="flex-1">View Details</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bike, Heart } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['customer'] })
useHead({ title: 'My Favorites - Nairobi Powerbikes' })

const pb = usePB(); const auth = useAuthStore()
const loading = ref(true)
const motorcycles = ref<any[]>([])

function formatPrice(p: number) { return p ? p.toLocaleString() : '0' }

async function removeFavorite(m: any) {
  try {
    const favs = await pb.collection('favorites').getList(1, 1, { filter: `motorcycle = "${m.id}" && user = "${auth.user?.id}"` })
    if (favs.items.length > 0) {
      await pb.collection('favorites').delete(favs.items[0].id)
      motorcycles.value = motorcycles.value.filter(b => b.id !== m.id)
    }
  } catch (e) { console.error(e) }
}

onMounted(async () => {
  try {
    const favs = await pb.collection('favorites').getList(1, 100, { filter: `user = "${auth.user?.id}"`, expand: 'motorcycle' }).catch(() => ({ items: [] }))
    const bikeIds = [...new Set((favs.items as any[]).map((f: any) => f.motorcycle))]
    if (bikeIds.length > 0) {
      const filter = bikeIds.map((id: string) => `id = "${id}"`).join(' || ')
      const bikes = await pb.collection('motorcycles').getList(1, 50, { filter, expand: 'brand' }).catch(() => ({ items: [] }))
      motorcycles.value = (bikes.items as any[]).map(m => ({ ...m, brand_name: m.expand?.brand?.name || '' }))
    }
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})
</script>
