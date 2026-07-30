<template>
  <div>
    <div class="mx-auto max-w-7xl">
      <div class="mb-6">
        <h1 class="font-heading text-4xl text-white">Newsletter <span class="text-brand-red">Subscribers</span></h1>
        <p class="mt-1 text-sm text-brand-grey">{{ subscribers.length }} total subscribers</p>
      </div>
      <div class="mb-4 flex flex-wrap gap-3">
        <Input v-model="searchQuery" placeholder="Search by email..." class="w-64" />
      </div>
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 5" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-4"><div class="h-5 w-64 rounded bg-brand-grey/10" /></div>
      </div>
      <div v-else-if="filtered.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">
        <Mail class="mx-auto h-12 w-12 text-brand-grey/40" />
        <p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Subscribers</p>
        <p class="mt-2 text-sm text-brand-grey/60">No newsletter subscribers yet</p>
      </div>
      <div v-else class="overflow-x-auto rounded-sm border border-brand-grey/20">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-brand-grey/20 bg-brand-black/80">
            <tr>
              <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Email</th>
              <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Name</th>
              <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Subscribed</th>
              <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Active</th>
              <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-brand-grey/10">
            <tr v-for="s in filtered" :key="s.id" class="transition-colors hover:bg-white/5">
              <td class="px-4 py-3 text-white">{{ s.email }}</td>
              <td class="px-4 py-3 text-brand-grey">{{ s.name || 'N/A' }}</td>
              <td class="px-4 py-3 text-brand-grey">{{ formatDate(s.created) }}</td>
              <td class="px-4 py-3"><Badge :variant="s.active !== false ? 'success' : 'danger'">{{ s.active !== false ? 'Active' : 'Inactive' }}</Badge></td>
              <td class="px-4 py-3 text-right"><Button variant="outline" size="sm" @click="toggleActive(s)">{{ s.active !== false ? 'Deactivate' : 'Activate' }}</Button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Mail } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { formatDate } from '~/composables/useFormat'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Subscribers - Nairobi Powerbikes' })

const pb = usePB()
const loading = ref(true)
const subscribers = ref<any[]>([])
const searchQuery = ref('')



const filtered = computed(() => {
  if (!searchQuery.value) return subscribers.value
  return subscribers.value.filter(s => s.email.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

async function toggleActive(s: any) {
  const active = s.active !== false ? false : true
  await pb.collection('subscribers').update(s.id, { active })
  s.active = active
}

async function loadData() { try { const res = await pb.collection('subscribers').getList(1, 200, { sort: '-created' }); subscribers.value = res.items as any[] } catch (e) { console.error(e) } }

onMounted(async () => { await loadData(); loading.value = false })
</script>
