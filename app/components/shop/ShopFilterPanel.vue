<template>
  <div class="space-y-5">
    <div>
      <label class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Search</label>
      <div class="relative">
        <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-grey/60" />
        <input
          v-model="searchInput"
          type="text"
          :placeholder="searchPlaceholder"
          class="input-field rounded-xl pl-10 focus:ring-2 focus:ring-brand-red/30"
          :aria-label="`Search ${collectionLabel}`"
        />
      </div>
    </div>

    <div>
      <label class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Sort By</label>
      <div class="relative">
        <ArrowUpDown class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-grey/60" />
        <select v-model="filters.sort" class="input-field rounded-xl appearance-none pl-10">
          <option v-for="o in sortOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
      </div>
    </div>

    <template v-if="kind === 'bike'">
      <div>
        <label class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Brand</label>
        <select v-model="filters.brand" class="input-field rounded-xl appearance-none">
          <option value="">All Brands</option>
          <option v-for="b in options.brands" :key="b.id" :value="b.id">{{ b.name }}</option>
        </select>
      </div>
      <div>
        <label class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Category</label>
        <select v-model="filters.type" class="input-field rounded-xl appearance-none">
          <option value="">All Categories</option>
          <option v-for="t in options.types" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
    </template>

    <template v-else-if="kind === 'accessory'">
      <div>
        <label class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Category</label>
        <select v-model="filters.category" class="input-field rounded-xl appearance-none">
          <option value="">All Categories</option>
          <option v-for="c in options.categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
    </template>

    <template v-else>
      <div>
        <label class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Category</label>
        <select v-model="filters.category" class="input-field rounded-xl appearance-none">
          <option value="">All Categories</option>
          <option v-for="c in options.categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div>
        <label class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Size</label>
        <select v-model="filters.size" class="input-field rounded-xl appearance-none">
          <option value="">All Sizes</option>
          <option v-for="s in options.sizes" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
      <div v-if="options.colors.length">
        <label class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Colour</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="c in options.colors"
            :key="c"
            class="rounded-full border px-3 py-1.5 text-xs font-semibold transition-all"
            :class="filters.color === c
              ? 'border-brand-red bg-brand-red text-white'
              : 'border-white/15 text-brand-light/70 hover:border-brand-red/50 hover:text-brand-red'"
            @click="filters.color = filters.color === c ? '' : c"
          >{{ c }}</button>
        </div>
      </div>
    </template>

    <div>
      <label class="mb-1.5 block text-[11px] font-display tracking-wider text-brand-grey uppercase">Price Range (KSh)</label>
      <div class="flex items-center gap-2">
        <input v-model.number="filters.priceMin" type="number" min="0" placeholder="Min" class="input-field rounded-xl" aria-label="Minimum price" />
        <span class="text-brand-grey/50">–</span>
        <input v-model.number="filters.priceMax" type="number" min="0" placeholder="Max" class="input-field rounded-xl" aria-label="Maximum price" />
      </div>
    </div>

    <div class="space-y-2.5 border-t border-white/[0.06] pt-4">
      <label v-if="kind === 'bike'" class="flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 transition-colors hover:border-brand-red/40">
        <span class="text-sm font-medium text-brand-light/85">In Stock</span>
        <input v-model="filters.inStock" type="checkbox" class="h-4 w-4 accent-brand-red" />
      </label>
      <label v-else class="flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 transition-colors hover:border-brand-red/40">
        <span class="text-sm font-medium text-brand-light/85">In Stock</span>
        <input v-model="filters.inStock" type="checkbox" class="h-4 w-4 accent-brand-red" />
      </label>
      <label v-if="kind === 'bike'" class="flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 transition-colors hover:border-brand-red/40">
        <span class="text-sm font-medium text-brand-light/85">Featured Only</span>
        <input v-model="filters.featured" type="checkbox" class="h-4 w-4 accent-brand-red" />
      </label>
      <label v-if="kind === 'bike'" class="flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 transition-colors hover:border-brand-red/40">
        <span class="text-sm font-medium text-brand-light/85">On Sale</span>
        <input v-model="filters.sale" type="checkbox" class="h-4 w-4 accent-brand-red" />
      </label>
      <label v-if="kind === 'bike'" class="flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 transition-colors hover:border-brand-red/40">
        <span class="text-sm font-medium text-brand-light/85">New Arrivals</span>
        <input v-model="filters.newArrival" type="checkbox" class="h-4 w-4 accent-brand-red" />
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, ArrowUpDown } from 'lucide-vue-next'
import { useDebounceFn } from '@vueuse/core'
import type { CatalogKind } from '~/composables/useCatalogFilters'
import { SORT_OPTIONS } from '~/composables/useCatalogFilters'

const props = defineProps<{
  kind: CatalogKind
  filters: any
  options: {
    brands: any[]
    types: string[]
    categories: string[]
    sizes: string[]
    colors: string[]
  }
}>()

const collectionLabel = computed(() => {
  if (props.kind === 'bike') return 'motorcycles'
  if (props.kind === 'accessory') return 'accessories'
  return 'apparel'
})

const searchPlaceholder = computed(() => {
  if (props.kind === 'bike') return 'Search by make or model…'
  if (props.kind === 'accessory') return 'Search accessories…'
  return 'Search apparel…'
})

const sortOptions = SORT_OPTIONS[props.kind]

const searchInput = ref(props.filters.search)

const debouncedApply = useDebounceFn((val: string) => {
  props.filters.search = val
}, 250)

watch(searchInput, (val) => { debouncedApply(val) })
</script>