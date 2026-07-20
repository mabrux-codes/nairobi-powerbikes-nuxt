<template>
  <div class="min-h-screen bg-brand-black pt-24">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div v-if="loading" class="animate-pulse"><div class="aspect-square w-full max-w-lg rounded-sm bg-brand-grey/10" /><div class="mt-6 h-8 w-96 rounded bg-brand-grey/10" /><div class="mt-3 h-4 w-64 rounded bg-brand-grey/10" /><div class="mt-4 h-24 rounded bg-brand-grey/10" /></div>
      <template v-else-if="item">
        <motion.div :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5 }" class="grid gap-8 lg:grid-cols-2">
          <div class="overflow-hidden rounded-sm bg-brand-black">
            <img v-if="item.image" :src="pb.files.getURL(item, item.image)" :alt="item.name" class="w-full object-cover" />
          </div>
          <div>
            <p class="font-display text-sm tracking-display text-brand-red uppercase">{{ item.category }}</p>
            <h1 class="font-display text-display-xl leading-[var(--leading-display)] text-white">{{ item.name }}</h1>
            <p class="mt-4 text-3xl font-bold text-brand-red">KES {{ Number(item.price).toLocaleString() }}</p>
            <p v-if="item.original_price" class="mt-1 text-sm text-brand-grey/60 line-through">KES {{ Number(item.original_price).toLocaleString() }}</p>
            <p v-if="item.description" class="mt-6 leading-relaxed text-brand-grey">{{ item.description }}</p>
            <div v-if="item.features?.length" class="mt-6"><h3 class="font-display text-lg text-white">Features</h3><ul class="mt-2 space-y-1.5"><li v-for="(f, i) in item.features" :key="i" class="flex items-start gap-2 text-sm text-brand-grey"><Check class="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />{{ f }}</li></ul></div>
            <div class="mt-8 flex flex-wrap gap-3">
              <button class="btn-primary"><ShoppingCart class="h-5 w-5" />Add to Cart</button>
              <button class="btn-secondary"><Heart class="h-5 w-5" />Add to Wishlist</button>
            </div>
          </div>
        </motion.div>
      </template>
      <div v-else class="rounded-sm border border-dashed border-brand-grey/20 p-16 text-center">
        <p class="font-display text-2xl tracking-display text-brand-grey">Accessory Not Found</p>
        <NuxtLink to="/accessories" class="btn-primary mt-6 inline-flex">Browse All Accessories</NuxtLink>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { motion } from 'motion-v'
import { ShoppingCart, Heart, Check } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'

interface Accessory { id: string; name: string; category: string; description?: string; price: number; original_price?: number; images?: string[]; features?: string[] }

useHead({ title: 'Accessory Details - Nairobi Powerbikes' })

const pb = usePB()
const route = useRoute()
const loading = ref(true); const item = ref<Accessory | null>(null)

onMounted(async () => {
  try {
    item.value = await pb.collection('accessories').getOne<Accessory>(route.params.id as string)
    useHead({ title: `${item.value.name} - Nairobi Powerbikes` })
  } catch { item.value = null }
  finally { loading.value = false }
})
</script>
