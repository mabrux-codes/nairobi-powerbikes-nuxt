<template><div class="mx-auto max-w-7xl"><div class="mb-6"><h1 class="font-heading text-4xl text-white">Notifications</h1></div>
<div v-if="loading" class="space-y-3"> <div v-for="i in 5" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-4"><div class="h-5 w-64 rounded bg-brand-grey/10" /></div> </div>
<div v-else-if="items.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center"><Bell class="mx-auto h-12 w-12 text-brand-grey/40" /><p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Notifications</p></div>
<div v-else class="space-y-3"><div v-for="n in items" :key="n.id" class="flex items-start gap-3 rounded-sm border border-brand-grey/20 bg-brand-black/60 p-4 transition-colors" :class="n.read ? 'opacity-60' : 'border-brand-red/30'"><div class="flex-1"><p class="text-sm text-white">{{ n.title }}</p><p v-if="n.message" class="text-xs text-brand-grey/70">{{ n.message }}</p><p class="mt-1 text-xs text-brand-grey/50">{{ formatDate(n.created) }}</p></div><Button v-if="!n.read" variant="ghost" size="sm" @click="markRead(n)">Mark Read</Button></div></div>
</div></template>
<script setup lang="ts">
import { Bell } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'
definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['customer'] })
useHead({ title: 'Notifications - Nairobi Powerbikes' })
const pb = usePB(); const auth = useAuthStore(); const loading = ref(true)
const items = ref<any[]>([])
function formatDate(d: string) { return d ? new Date(d).toLocaleDateString() : '' }
function markRead(n: any) { pb.collection('notifications').update(n.id, { read: true }).then(() => n.read = true) }
onMounted(async () => { try { const res = await pb.collection('notifications').getList(1, 50, { filter: `user = "${auth.user?.id}"`, sort: '-created' }); items.value = res.items as any[] } catch(e){} finally { loading.value = false } })
</script>
