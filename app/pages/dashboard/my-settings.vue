<template><div class="mx-auto max-w-7xl"><div class="mb-6"><h1 class="font-heading text-4xl text-white">Account <span class="text-brand-red">Settings</span></h1></div>
<div class="max-w-lg rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6"><div class="space-y-4"><div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Name</label><input v-model="form.name" class="input-field w-full" /></div><div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Phone</label><input v-model="form.phone" class="input-field w-full" /></div><div class="flex items-center gap-3"><input id="emnotif" v-model="form.email_notifications" type="checkbox" class="h-4 w-4 accent-brand-red" /><label for="emnotif" class="text-sm text-brand-grey">Email notifications</label></div></div><div class="mt-6 flex justify-end"><Button :disabled="saving" @click="save">{{ saving ? 'Saving...' : 'Save Settings' }}</Button></div></div>
</div></template>
<script setup lang="ts">
import { usePB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'
definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['customer'] })
useHead({ title: 'Settings - Nairobi Powerbikes' })
const pb = usePB(); const auth = useAuthStore(); const saving = ref(false)
const form = ref({ name: '', phone: '', email_notifications: true })
onMounted(() => { const u = auth.user; if (u) { form.value = { name: u.name || '', phone: (u as any).phone || '', email_notifications: (u as any).email_notifications ?? true } } })
async function save() { saving.value = true; try { await pb.collection('users').update(auth.user!.id, form.value) } catch(e) { console.error(e) } finally { saving.value = false } }
</script>
