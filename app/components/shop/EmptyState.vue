<template>
  <motion.div
    class="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-8 py-20 text-center"
    :initial="{ opacity: 0, scale: 0.97 }"
    :animate="{ opacity: 1, scale: 1 }"
    :transition="{ duration: 0.4 }"
  >
    <div class="relative">
      <div class="flex h-24 w-24 items-center justify-center rounded-full border border-brand-red/20 bg-brand-red/10">
        <component :is="icon" class="h-11 w-11 text-brand-red" :stroke-width="1.5" />
      </div>
      <motion.div
        class="absolute -inset-2 rounded-full border border-brand-red/10"
        :animate="{ scale: [1, 1.12, 1], opacity: [0.5, 0.15, 0.5] }"
        :transition="{ duration: 3, repeat: Infinity, ease: 'easeInOut' }"
      />
    </div>
    <h3 class="mt-7 font-heading text-3xl text-white">{{ title }}</h3>
    <p class="mt-3 max-w-md text-sm leading-relaxed text-brand-grey">{{ message }}</p>
    <div class="mt-8">
      <slot name="action">
        <Button v-if="onClear" variant="secondary" @click="onClear">
          <RotateCcw class="h-4 w-4" />Clear Filters
        </Button>
      </slot>
    </div>
  </motion.div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { RotateCcw, SearchX, PackageX, Shirt } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  kind: 'bike' | 'accessory' | 'apparel'
  onClear?: () => void
}>(), {})

const title = computed(() => {
  if (props.kind === 'bike') return 'No Motorcycles Found'
  if (props.kind === 'accessory') return 'No Accessories Found'
  return 'No Apparel Available'
})

const message = computed(() => {
  if (props.kind === 'bike') return 'We couldn\'t find any motorcycles matching your criteria. Try adjusting your filters or explore our full collection.'
  if (props.kind === 'accessory') return 'No accessories match your current filters. Clear them to browse everything we have in stock.'
  return 'No apparel matches your current filters. Clear them to browse our full riding collection.'
})

const icon = computed(() => {
  if (props.kind === 'bike') return SearchX
  if (props.kind === 'accessory') return PackageX
  return Shirt
})
</script>
