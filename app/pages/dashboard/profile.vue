<template>
  <div>
    <div class="mx-auto max-w-3xl">
      <div class="mb-6">
        <h1 class="font-heading text-4xl text-white">My <span class="text-brand-red">Profile</span></h1>
        <p class="mt-1 text-sm text-brand-grey">Manage your account settings</p>
      </div>

      <div v-if="loading" class="space-y-6">
        <div v-for="i in 3" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-6"><div class="h-5 w-48 rounded bg-brand-grey/10" /><div class="mt-3 h-10 rounded bg-brand-grey/10" /></div>
      </div>

      <div v-else class="space-y-6">
        <div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6">
          <h2 class="font-display text-lg tracking-display text-white mb-4">Profile Information</h2>
          <div v-if="profileMessage" class="mb-4 rounded-sm bg-emerald-500/20 p-3 text-sm text-emerald-400">{{ profileMessage }}</div>
          <div class="space-y-4">
            <Input v-model="profileForm.name" label="Full Name" placeholder="Your name" />
            <Input v-model="profileForm.email" label="Email" type="email" placeholder="email@example.com" />
            <Input v-model="profileForm.phone" label="Phone" placeholder="+254..." />
          </div>
          <div class="mt-6 flex justify-end">
            <Button :disabled="savingProfile" @click="saveProfile">{{ savingProfile ? 'Saving...' : 'Save Changes' }}</Button>
          </div>
        </div>

        <div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6">
          <h2 class="font-display text-lg tracking-display text-white mb-4">Change Password</h2>
          <div v-if="passwordMessage" class="mb-4 rounded-sm p-3 text-sm" :class="passwordError ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'">{{ passwordMessage }}</div>
          <div class="space-y-4">
            <Input v-model="passwordForm.current" label="Current Password" type="password" placeholder="Enter current password" />
            <Input v-model="passwordForm.newPassword" label="New Password" type="password" placeholder="Enter new password" />
            <Input v-model="passwordForm.confirm" label="Confirm New Password" type="password" placeholder="Confirm new password" />
          </div>
          <div class="mt-6 flex justify-end">
            <Button :disabled="savingPassword" @click="changePassword">{{ savingPassword ? 'Saving...' : 'Update Password' }}</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['customer'] })
useHead({ title: 'My Profile - Nairobi Powerbikes' })

const pb = usePB()
const auth = useAuthStore()
const loading = ref(true)
const savingProfile = ref(false)
const savingPassword = ref(false)
const profileMessage = ref('')
const passwordMessage = ref('')
const passwordError = ref(false)

const profileForm = ref({ name: '', email: '', phone: '' })
const passwordForm = ref({ current: '', newPassword: '', confirm: '' })

async function saveProfile() {
  savingProfile.value = true
  profileMessage.value = ''
  try {
    const payload: any = { name: profileForm.value.name, email: profileForm.value.email }
    if (profileForm.value.phone) payload.phone = profileForm.value.phone
    await pb.collection('users').update(auth.user!.id, payload)
    auth.user!.name = profileForm.value.name
    auth.user!.email = profileForm.value.email
    profileMessage.value = 'Profile updated successfully'
    setTimeout(() => { profileMessage.value = '' }, 3000)
  } catch (e: any) {
    profileMessage.value = e.message || 'Failed to update profile'
  }
  finally { savingProfile.value = false }
}

async function changePassword() {
  savingPassword.value = true
  passwordMessage.value = ''
  passwordError.value = false
  if (passwordForm.value.newPassword !== passwordForm.value.confirm) {
    passwordMessage.value = 'Passwords do not match'
    passwordError.value = true
    savingPassword.value = false
    return
  }
  if (passwordForm.value.newPassword.length < 6) {
    passwordMessage.value = 'Password must be at least 6 characters'
    passwordError.value = true
    savingPassword.value = false
    return
  }
  try {
    await pb.collection('users').update(auth.user!.id, {
      oldPassword: passwordForm.value.current,
      password: passwordForm.value.newPassword,
      passwordConfirm: passwordForm.value.confirm,
    })
    passwordMessage.value = 'Password updated successfully'
    passwordForm.value = { current: '', newPassword: '', confirm: '' }
    setTimeout(() => { passwordMessage.value = '' }, 3000)
  } catch (e: any) {
    passwordMessage.value = e.message || 'Failed to update password'
    passwordError.value = true
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
