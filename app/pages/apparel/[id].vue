<template>
  <div class="min-h-screen bg-brand-black pt-24">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div v-if="loading" class="animate-pulse"><div class="aspect-[3/4] w-full max-w-lg rounded-sm bg-brand-grey/10" /><div class="mt-6 h-8 w-96 rounded bg-brand-grey/10" /><div class="mt-3 h-4 w-64 rounded bg-brand-grey/10" /><div class="mt-4 h-24 rounded bg-brand-grey/10" /></div>
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
            <div v-if="item.sizes?.length" class="mt-6"><h3 class="font-display text-lg text-white">Sizes</h3><div class="mt-2 flex flex-wrap gap-2"><button v-for="s in item.sizes" :key="s" class="rounded-sm border border-brand-grey/20 px-4 py-2 text-sm text-brand-grey transition-all hover:border-brand-red hover:text-brand-red" :class="{ 'border-brand-red bg-brand-red/10 text-brand-red': selectedSize === s }" @click="selectedSize = s">{{ s }}</button></div></div>
            <div class="mt-8 flex flex-wrap gap-3">
              <Button variant="primary" :disabled="!selectedSize && !!item.sizes?.length"><ShoppingCart class="h-5 w-5" />Add to Cart</Button>
              <Button variant="secondary"><Heart class="h-5 w-5" />Add to Wishlist</Button>
            </div>
          </div>
        </motion.div>
      </template>
      <div v-else class="rounded-sm border border-dashed border-brand-grey/20 p-16 text-center">
        <p class="font-display text-2xl tracking-display text-brand-grey">Apparel Not Found</p>
        <Button to="/apparel" variant="primary" class="mt-6">Browse All Apparel</Button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { motion } from 'motion-v'
import { ShoppingCart, Heart } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'

interface ApparelItem { id: string; name: string; category: string; description?: string; price: number; original_price?: number; images?: string[]; sizes?: string[] }

useHead({ title: 'Apparel Details - Nairobi Powerbikes' })

const pb = usePB()
const route = useRoute()
const loading = ref(true); const item = ref<ApparelItem | null>(null)
const selectedSize = ref('')

onMounted(async () => {
  try {
    item.value = await pb.collection('apparel').getOne<ApparelItem>(route.params.id as string)
    useHead({ title: `${item.value.name} - Nairobi Powerbikes` })
    if (item.value.sizes?.length) selectedSize.value = item.value.sizes[0]
  } catch { item.value = null }
  finally { loading.value = false }
})
</script>
