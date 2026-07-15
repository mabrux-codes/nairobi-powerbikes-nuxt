<template><div class="mx-auto max-w-7xl"><div class="mb-6"><h1 class="font-heading text-4xl text-white">My Service Requests</h1><p class="mt-1 text-sm text-brand-grey">Track your service requests</p></div>
<div v-if="loading" class="space-y-3"> <div v-for="i in 3" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-4"><div class="h-5 w-64 rounded bg-brand-grey/10" /></div> </div>
<div v-else-if="items.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center"><Wrench class="mx-auto h-12 w-12 text-brand-grey/40" /><p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Service Requests</p></div>
<div v-else class="space-y-4"><div v-for="s in items" :key="s.id" class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-5"><div class="flex items-start justify-between"><div><h3 class="font-display text-lg tracking-display text-white">{{ s.service_type }}</h3><p class="text-xs text-brand-grey">{{ s.motorcycle }}</p></div><Badge :variant="statusVariant(s.status)">{{ s.status }}</Badge></div><p v-if="s.notes" class="mt-2 text-sm text-brand-grey/70">{{ s.notes }}</p></div></div>
</div></template>
<script setup lang="ts">
import { Wrench } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'
definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['customer'] })
useHead({ title: 'My Services - Nairobi Powerbikes' })
const pb = usePB(); const auth = useAuthStore(); const loading = ref(true)
const items = ref<any[]>([])
function statusVariant(s: string) { const m: Record<string, string> = { pending: 'warning', diagnosed: 'default', in_progress: 'secondary', completed: 'success', cancelled: 'danger' }; return m[s] || 'outline' }
onMounted(async () => { try { const res = await pb.collection('service_bookings').getList(1, 100, { filter: `type="service" && user = "${auth.user?.id}"`, sort: '-created' }); items.value = res.items as any[] } catch(e){} finally { loading.value = false } })
</script>
