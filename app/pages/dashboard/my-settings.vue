<template>
  <div class="mx-auto max-w-3xl">
    <div class="mb-8">
      <h1 class="font-heading text-4xl text-white">Account <span class="text-brand-red">Settings</span></h1>
      <div class="mt-2 h-1 w-24 bg-brand-red" />
      <p class="mt-3 text-sm text-brand-grey">Personalise your account and notification preferences.</p>
    </div>

    <div class="space-y-6">
      <motion.div
        :initial="{ opacity: 0, y: 16 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.4 }"
        class="rounded-xl border border-brand-grey/15 bg-brand-black/80 p-6 sm:p-8"
      >
        <div class="mb-6 flex items-center gap-2.5">
          <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-red/15">
            <User class="h-4.5 w-4.5 text-brand-red" />
          </span>
          <div>
            <h2 class="font-display text-lg tracking-display text-white">Account Details</h2>
            <p class="text-xs text-brand-grey">Your basic details across the portal</p>
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Name</label>
            <input v-model="form.name" class="input-field rounded-xl" />
          </div>
          <div>
            <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Phone</label>
            <input v-model="form.phone" class="input-field rounded-xl" placeholder="+254..." />
          </div>
        </div>
      </motion.div>

      <motion.div
        :initial="{ opacity: 0, y: 16 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.08, duration: 0.4 }"
        class="rounded-xl border border-brand-grey/15 bg-brand-black/80 p-6 sm:p-8"
      >
        <div class="mb-6 flex items-center gap-2.5">
          <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-red/15">
            <Bell class="h-4.5 w-4.5 text-brand-red" />
          </span>
          <div>
            <h2 class="font-display text-lg tracking-display text-white">Notifications</h2>
            <p class="text-xs text-brand-grey">Choose how we keep you in the loop</p>
          </div>
        </div>
        <div class="space-y-4">
          <label class="flex cursor-pointer items-center justify-between rounded-xl border border-brand-grey/15 bg-white/[0.02] px-4 py-3.5 transition-colors hover:border-brand-red/30">
            <div>
              <p class="text-sm font-medium text-white">Email notifications</p>
              <p class="text-xs text-brand-grey">Booking updates and offers in your inbox</p>
            </div>
            <input v-model="form.email_notifications" type="checkbox" class="h-5 w-5 accent-brand-red" />
          </label>
        </div>
      </motion.div>

      <div class="flex justify-end">
        <Button :disabled="saving" @click="save">{{ saving ? 'Saving...' : 'Save Settings' }}</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { User, Bell } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['customer'] })
useHead({ title: 'Settings - Nairobi Powerbikes' })

const pb = usePB()
const auth = useAuthStore()
const toast = useToast()
const saving = ref(false)
const form = ref({ name: '', phone: '', email_notifications: true })

onMounted(() => {
  const u = auth.user
  if (u) {
    form.value = { name: u.name || '', phone: (u as any).phone || '', email_notifications: (u as any).email_notifications ?? true }
  }
})

async function save() {
  saving.value = true
  try {
    const payload: Record<string, any> = { name: form.value.name }
    if (form.value.phone) payload.phone = form.value.phone
    await pb.collection('users').update(auth.user!.id, payload)
    auth.user!.name = form.value.name
    toast.add({ type: 'success', title: 'Settings saved' })
  } catch (e: any) {
    console.error('Settings save failed:', e?.data?.message || e?.message || e)
    toast.add({ type: 'error', title: 'Failed to save settings', message: e?.data?.message || e?.message || 'Something went wrong' })
  } finally { saving.value = false }
}
</script>
