<template>
  <div class="mx-auto max-w-3xl">
    <div class="mb-8">
      <h1 class="font-heading text-3xl text-white sm:text-4xl">Account <span class="text-brand-red">Settings</span></h1>
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
          <label class="flex cursor-pointer items-center justify-between rounded-xl border border-brand-grey/15 bg-white/[0.02] px-4 py-3.5 transition-colors hover:border-brand-red/30">
            <div class="flex items-center gap-3">
              <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-red/10">
                <Volume2 class="h-4 w-4 text-brand-red" />
              </span>
              <div>
                <p class="text-sm font-medium text-white">Notification sounds</p>
                <p class="text-xs text-brand-grey">Play a sound for new notifications, chat replies and confirmations</p>
              </div>
            </div>
            <input v-model="form.soundEnabled" type="checkbox" class="h-5 w-5 accent-brand-red" />
          </label>
        </div>
      </motion.div>

      <motion.div
        :initial="{ opacity: 0, y: 16 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.12, duration: 0.4 }"
        class="rounded-xl border border-brand-grey/15 bg-brand-black/80 p-6 sm:p-8"
      >
        <div class="mb-6 flex items-center gap-2.5">
          <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-red/15">
            <Mail class="h-4.5 w-4.5 text-brand-red" />
          </span>
          <div>
            <h2 class="font-display text-lg tracking-display text-white">Email Preferences</h2>
            <p class="text-xs text-brand-grey">Choose what marketing emails you'd like to receive</p>
          </div>
        </div>
        <div class="space-y-4">
          <p class="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-[11px] leading-relaxed text-brand-grey">
            Essential emails (verification, password resets, booking confirmations and payment receipts) are always sent for your security and are not affected by these preferences.
          </p>
          <label class="flex cursor-pointer items-center justify-between rounded-xl border border-brand-grey/15 bg-white/[0.02] px-4 py-3.5 transition-colors hover:border-brand-red/30">
            <div>
              <p class="text-sm font-medium text-white">Marketing emails</p>
              <p class="text-xs text-brand-grey">Promotions, offers and news from Nairobi Powerbikes</p>
            </div>
            <input v-model="emailPrefs.marketing" type="checkbox" class="h-5 w-5 accent-brand-red" />
          </label>
          <label class="flex cursor-pointer items-center justify-between rounded-xl border border-brand-grey/15 bg-white/[0.02] px-4 py-3.5 transition-colors hover:border-brand-red/30">
            <div>
              <p class="text-sm font-medium text-white">New motorcycle alerts</p>
              <p class="text-xs text-brand-grey">Be first to know about new arrivals</p>
            </div>
            <input v-model="emailPrefs.newMotorcycles" type="checkbox" class="h-5 w-5 accent-brand-red" />
          </label>
          <label class="flex cursor-pointer items-center justify-between rounded-xl border border-brand-grey/15 bg-white/[0.02] px-4 py-3.5 transition-colors hover:border-brand-red/30">
            <div>
              <p class="text-sm font-medium text-white">Blog &amp; news</p>
              <p class="text-xs text-brand-grey">New articles and riding guides</p>
            </div>
            <input v-model="emailPrefs.blog" type="checkbox" class="h-5 w-5 accent-brand-red" />
          </label>
          <label class="flex cursor-pointer items-center justify-between rounded-xl border border-brand-grey/15 bg-white/[0.02] px-4 py-3.5 transition-colors hover:border-brand-red/30">
            <div>
              <p class="text-sm font-medium text-white">Wishlist &amp; restock alerts</p>
              <p class="text-xs text-brand-grey">When a bike you're watching is back in stock</p>
            </div>
            <input v-model="emailPrefs.restockAlerts" type="checkbox" class="h-5 w-5 accent-brand-red" />
          </label>
          <label class="flex cursor-pointer items-center justify-between rounded-xl border border-brand-grey/15 bg-white/[0.02] px-4 py-3.5 transition-colors hover:border-brand-red/30">
            <div>
              <p class="text-sm font-medium text-white">Offers</p>
              <p class="text-xs text-brand-grey">Sales, trade-in deals and special pricing</p>
            </div>
            <input v-model="emailPrefs.offers" type="checkbox" class="h-5 w-5 accent-brand-red" />
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
import { User, Bell, Volume2, Mail } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['customer'] })
useHead({ title: 'Settings - Nairobi Powerbikes' })

const pb = usePB()
const auth = useAuthStore()
const toast = useToast()
const saving = ref(false)
const form = ref({ name: '', phone: '', email_notifications: true, soundEnabled: true })
const emailPrefs = ref({ marketing: true, promotions: true, newMotorcycles: true, blog: true, offers: true, wishlistAlerts: true, restockAlerts: true })
const prefId = ref<string | null>(null)

async function loadPrefs() {
  if (!auth.user) return
  try {
    const res = await pb.collection('email_preferences').getFullList({ filter: `user = "${auth.user.id}"` })
    if (res.length > 0) {
      const p = res[0]
      prefId.value = p.id
      emailPrefs.value = {
        marketing: p.marketing ?? true,
        promotions: p.promotions ?? true,
        newMotorcycles: p.newMotorcycles ?? true,
        blog: p.blog ?? true,
        offers: p.offers ?? true,
        wishlistAlerts: p.wishlistAlerts ?? true,
        restockAlerts: p.restockAlerts ?? true,
      }
    }
  } catch { /* prefs may not exist yet */ }
}

onMounted(() => {
  const u = auth.user
  if (u) {
    form.value = {
      name: u.name || '',
      phone: (u as any).phone || '',
      email_notifications: (u as any).email_notifications ?? true,
      soundEnabled: (u as any).soundEnabled ?? true,
    }
  }
  loadPrefs()
})

async function save() {
  saving.value = true
  try {
    const payload: Record<string, any> = { name: form.value.name }
    if (form.value.phone) payload.phone = form.value.phone
    payload.email_notifications = form.value.email_notifications
    payload.soundEnabled = form.value.soundEnabled
    await pb.collection('users').update(auth.user!.id, payload)
    auth.user!.name = form.value.name
    auth.user!.email_notifications = form.value.email_notifications
    auth.user!.soundEnabled = form.value.soundEnabled

    // Persist email marketing preferences
    const prefPayload = { ...emailPrefs.value }
    if (prefId.value) {
      await pb.collection('email_preferences').update(prefId.value, prefPayload)
    } else {
      const created = await pb.collection('email_preferences').create({ user: auth.user!.id, ...prefPayload })
      prefId.value = created.id
    }

    toast.add({ type: 'success', title: 'Settings saved' })
  } catch (e: any) {
    console.error('Settings save failed:', e?.data?.message || e?.message || e)
    toast.add({ type: 'error', title: 'Failed to save settings', message: e?.data?.message || e?.message || 'Something went wrong' })
  } finally { saving.value = false }
}
</script>
