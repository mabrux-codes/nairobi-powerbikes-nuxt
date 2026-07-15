<template><div class="mx-auto max-w-7xl"><div class="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h1 class="font-heading text-4xl text-white">Categories</h1><p class="mt-1 text-sm text-brand-grey">Manage motorcycle categories</p></div><Button size="sm" @click="openCreate">Add Category</Button></div>
<div v-if="loading" class="space-y-3"> <div v-for="i in 3" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-4"><div class="h-5 w-48 rounded bg-brand-grey/10" /></div> </div>
<div v-else-if="items.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center"><Tag class="mx-auto h-12 w-12 text-brand-grey/40" /><p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Categories</p></div>
<div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><div v-for="c in items" :key="c.id" class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-4"><h3 class="font-display text-lg tracking-display text-white">{{ c.name }}</h3><p v-if="c.description" class="text-xs text-brand-grey">{{ c.description }}</p><div class="mt-3 flex gap-2"><Button variant="ghost" size="sm" @click="openEdit(c)">Edit</Button><Button variant="outline" size="sm" @click="confirmDelete(c)">Delete</Button></div></div></div>
<Teleport to="body"><div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto" @click.self="closeModal"><div class="w-full max-w-md rounded-sm border border-brand-grey/30 bg-brand-black p-6"><h2 class="font-display text-xl tracking-display text-white">{{ editingId ? 'Edit Category' : 'Add Category' }}</h2><div class="mt-4 space-y-4"><Input v-model="form.name" label="Name" /><Input v-model="form.description" label="Description" /></div><div class="mt-6 flex justify-end gap-3"><Button variant="ghost" @click="closeModal">Cancel</Button><Button :disabled="saving" @click="saveItem">{{ saving ? 'Saving...' : 'Save' }}</Button></div></div></div></Teleport>
</div></template>
<script setup lang="ts">
import { Tag } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Categories - Nairobi Powerbikes' })
const pb = usePB(); const loading = ref(true); const saving = ref(false)
const items = ref<any[]>([]); const showModal = ref(false); const editingId = ref<string | null>(null)
const form = ref({ name: '', description: '' })
function openCreate() { editingId.value = null; form.value = { name: '', description: '' }; showModal.value = true }
function openEdit(c: any) { editingId.value = c.id; form.value = { name: c.name, description: c.description || '' }; showModal.value = true }
function closeModal() { showModal.value = false }
async function saveItem() { saving.value = true; try { if (editingId.value) await pb.collection('categories').update(editingId.value, form.value); else await pb.collection('categories').create(form.value); closeModal(); await loadData() } catch (e) { console.error(e) } finally { saving.value = false } }
async function confirmDelete(c: any) { if (await confirm(`Delete "${c.name}"?`)) pb.collection('categories').delete(c.id).then(() => loadData()) }
async function loadData() { try { const res = await pb.collection('categories').getList(1, 50, { sort: 'name' }); items.value = res.items as any[] } catch (e) { console.error(e) } finally { loading.value = false } }
onMounted(() => loadData())
</script>
