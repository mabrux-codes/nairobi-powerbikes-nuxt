<template><div class="mx-auto max-w-7xl"><div class="mb-6"><h1 class="font-heading text-4xl text-white">Messages</h1></div>
<div v-if="loading" class="space-y-3"> <div v-for="i in 5" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-4"><div class="h-5 w-64 rounded bg-brand-grey/10" /></div> </div>
<div v-else-if="items.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center"><Mail class="mx-auto h-12 w-12 text-brand-grey/40" /><p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Messages</p></div>
<div v-else class="space-y-3"><div v-for="m in items" :key="m.id" class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-4"><div class="flex items-start justify-between"><div><p class="text-sm text-white">{{ m.subject || 'No Subject' }}</p><p class="text-xs text-brand-grey">From: {{ m.expand?.from_user?.name || m.expand?.from_user?.email }}</p></div><Badge v-if="!m.read" size="sm" variant="warning">New</Badge></div><p class="mt-2 text-sm text-brand-grey/70">{{ m.message }}</p><p class="mt-1 text-xs text-brand-grey/50">{{ formatDate(m.created) }}</p></div></div>
</div></template>
<script setup lang="ts">
import { Mail } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'
import { formatDate } from '~/composables/useFormat'
definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['customer'] })
useHead({ title: 'Messages - Nairobi Powerbikes' })
const pb = usePB(); const auth = useAuthStore(); const loading = ref(true)
const items = ref<any[]>([])

onMounted(async () => { try { const res = await pb.collection('messages').getList(1, 50, { filter: `to_user = "${auth.user?.id}"`, sort: '-created', expand: 'from_user' }); items.value = res.items as any[] } catch(e){} finally { loading.value = false } })
</script>
