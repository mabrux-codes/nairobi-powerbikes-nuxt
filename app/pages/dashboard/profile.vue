<template>
  <div class="mx-auto max-w-3xl">
    <div class="mb-8">
      <h1 class="font-heading text-3xl text-white sm:text-4xl">My <span class="text-brand-red">Profile</span></h1>
      <div class="mt-2 h-1 w-24 bg-brand-red" />
      <p class="mt-3 text-sm text-brand-grey">Manage your personal details and account security.</p>
    </div>

    <div v-if="loading" class="space-y-6">
      <div v-for="i in 2" :key="i" class="animate-pulse rounded-xl border border-brand-grey/15 p-6">
        <div class="h-5 w-48 rounded bg-brand-grey/10" />
        <div class="mt-4 space-y-3">
          <div class="h-11 rounded bg-brand-grey/10" />
          <div class="h-11 rounded bg-brand-grey/10" />
        </div>
      </div>
    </div>

    <div v-else class="space-y-6">
      <!-- Identity -->
      <motion.div
        :initial="{ opacity: 0, y: 16 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.4 }"
        class="rounded-xl border border-brand-grey/15 bg-brand-black/80 p-6 sm:p-8"
      >
        <div class="flex items-center gap-4">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-red/40 to-brand-grey/30 text-xl font-bold text-white ring-2 ring-brand-red/30">
            {{ initials }}
          </div>
          <div>
            <h2 class="font-display text-xl tracking-display text-white">{{ auth.user?.name || 'Rider' }}</h2>
            <p class="text-sm text-brand-grey">{{ auth.user?.email }}</p>
          </div>
        </div>
      </motion.div>

      <!-- Profile Information -->
      <motion.div
        :initial="{ opacity: 0, y: 16 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.08, duration: 0.4 }"
        class="rounded-xl border border-brand-grey/15 bg-brand-black/80 p-6 sm:p-8"
      >
        <div class="mb-6 flex items-center gap-2.5">
          <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-red/15">
            <User class="h-4.5 w-4.5 text-brand-red" />
          </span>
          <div>
            <h2 class="font-display text-lg tracking-display text-white">Profile Information</h2>
            <p class="text-xs text-brand-grey">Update your name, email and phone number</p>
          </div>
        </div>
        <div class="space-y-4">
          <Input v-model="profileForm.name" label="Full Name" placeholder="Your name" />
          <Input v-model="profileForm.email" label="Email" type="email" placeholder="email@example.com" />
          <Input v-model="profileForm.phone" label="Phone" placeholder="+254..." />
        </div>
        <div class="mt-6 flex justify-end">
          <Button :disabled="savingProfile" @click="saveProfile">{{ savingProfile ? 'Saving...' : 'Save Changes' }}</Button>
        </div>
      </motion.div>

      <!-- Password -->
      <motion.div
        :initial="{ opacity: 0, y: 16 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.16, duration: 0.4 }"
        class="rounded-xl border border-brand-grey/15 bg-brand-black/80 p-6 sm:p-8"
      >
        <div class="mb-6 flex items-center gap-2.5">
          <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-red/15">
            <Lock class="h-4.5 w-4.5 text-brand-red" />
          </span>
          <div>
            <h2 class="font-display text-lg tracking-display text-white">Change Password</h2>
            <p class="text-xs text-brand-grey">Keep your account secure with a strong password</p>
          </div>
        </div>
        <div class="space-y-4">
          <Input v-model="passwordForm.current" label="Current Password" type="password" placeholder="Enter current password" />
          <Input v-model="passwordForm.newPassword" label="New Password" type="password" placeholder="Enter new password" />
          <Input v-model="passwordForm.confirm" label="Confirm New Password" type="password" placeholder="Confirm new password" />
        </div>
        <div class="mt-6 flex justify-end">
          <Button :disabled="savingPassword" @click="changePassword">{{ savingPassword ? 'Saving...' : 'Update Password' }}</Button>
        </div>
      </motion.div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { User, Lock } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['customer'] })
useHead({ title: 'My Profile - Nairobi Powerbikes' })

const pb = usePB()
const toast = useToast()
const auth = useAuthStore()
const loading = ref(true)
const savingProfile = ref(false)
const savingPassword = ref(false)

const profileForm = ref({ name: '', email: '', phone: '' })
const passwordForm = ref({ current: '', newPassword: '', confirm: '' })

const initials = computed(() => {
  const name = auth.user?.name || auth.user?.email || 'R'
  return name.slice(0, 2).toUpperCase()
})

async function saveProfile() {
  savingProfile.value = true
  try {
    const payload: any = { name: profileForm.value.name, email: profileForm.value.email }
    if (profileForm.value.phone) payload.phone = profileForm.value.phone
    await pb.collection('users').update(auth.user!.id, payload)
    auth.user!.name = profileForm.value.name
    auth.user!.email = profileForm.value.email
    toast.add({ type: 'success', title: 'Profile updated successfully' })
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Failed to update profile', message: e.message || 'Something went wrong' })
  }
  finally { savingProfile.value = false }
}

async function changePassword() {
  savingPassword.value = true
  if (passwordForm.value.newPassword !== passwordForm.value.confirm) {
    toast.add({ type: 'error', title: 'Passwords do not match' })
    savingPassword.value = false
    return
  }
  if (passwordForm.value.newPassword.length < 6) {
    toast.add({ type: 'error', title: 'Password must be at least 6 characters' })
    savingPassword.value = false
    return
  }
  try {
    await pb.collection('users').update(auth.user!.id, {
      oldPassword: passwordForm.value.current,
      password: passwordForm.value.newPassword,
      passwordConfirm: passwordForm.value.confirm,
    })
    toast.add({ type: 'success', title: 'Password updated successfully' })
    passwordForm.value = { current: '', newPassword: '', confirm: '' }
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Failed to update password', message: e.message || 'Something went wrong' })
  }
  finally { savingPassword.value = false }
}

onMounted(async () => {
  const user = auth.user
  if (user) {
    profileForm.value = { name: user.name || '', email: user.email || '', phone: (user as any).phone || '' }
  }
  loading.value = false
})
</script>
