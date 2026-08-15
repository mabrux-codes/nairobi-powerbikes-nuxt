<template>
  <div class="mx-auto max-w-xl">
    <div class="mb-8">
      <h1 class="font-heading text-3xl text-white sm:text-4xl">Set Your <span class="text-brand-red">Password</span></h1>
      <div class="mt-2 h-1 w-24 bg-brand-red" />
      <p class="mt-3 text-sm text-brand-grey">Welcome to the team! As part of the onboarding you must set a new password before you can use the dashboard.</p>
    </div>

    <motion.div
      :initial="{ opacity: 0, y: 16 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4 }"
      class="rounded-xl border border-brand-grey/15 bg-brand-black/80 p-6 sm:p-8"
    >
      <form @submit.prevent="submit" class="space-y-5" novalidate>
        <div>
          <label for="cp-current" class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Current Password</label>
          <input
            id="cp-current"
            v-model="current"
            type="password"
            autocomplete="current-password"
            placeholder="Your temporary password"
            class="input-field rounded-xl"
            :class="{ 'border-brand-red/70': error }"
          />
        </div>
        <div>
          <label for="cp-new" class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">New Password</label>
          <input
            id="cp-new"
            v-model="password"
            :type="show ? 'text' : 'password'"
            autocomplete="new-password"
            placeholder="••••••••"
            minlength="6"
            class="input-field rounded-xl"
            :class="{ 'border-brand-red/70': error }"
            :aria-invalid="!!error"
          />
          <p v-if="error" class="mt-1.5 text-xs text-brand-red" role="alert">{{ error }}</p>
        </div>
        <div>
          <label for="cp-confirm" class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Confirm New Password</label>
          <div class="relative">
            <input
              id="cp-confirm"
              v-model="confirm"
              :type="show ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="••••••••"
              minlength="6"
              class="input-field rounded-xl pr-12"
              :class="{ 'border-brand-red/70': error }"
            />
            <button
              type="button"
              class="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-brand-grey/70 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
              :aria-label="show ? 'Hide password' : 'Show password'"
              :aria-pressed="show"
              @click="show = !show"
            >
              <EyeOff v-if="show" class="h-5 w-5" aria-hidden="true" />
              <Eye v-else class="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <ul class="space-y-1 text-xs text-brand-grey">
          <li :class="checks.length ? 'text-green-400' : ''">At least 6 characters</li>
          <li>Different from your temporary password</li>
        </ul>
        <Button type="submit" :loading="saving" loading-text="Setting Password..." variant="primary" class="h-12 w-full">
          <Lock class="h-5 w-5" />Set Password &amp; Continue
        </Button>
      </form>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { Eye, EyeOff, Lock } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Set Your Password - Nairobi Powerbikes' })

const pb = usePB()
const auth = useAuthStore()
const toast = useToast()
const password = ref('')
const confirm = ref('')
const current = ref('')
const show = ref(false)
const saving = ref(false)
const error = ref('')
const checks = computed(() => (password.value.length >= 6 ? ['ok'] : []))

async function submit() {
  error.value = ''
  if (password.value.length < 6) { error.value = 'Password must be at least 6 characters.'; useAudio().playError(); return }
  if (password.value !== confirm.value) { error.value = 'Passwords do not match.'; useAudio().playError(); return }
  if (!auth.user) { await navigateTo('/login'); return }
  saving.value = true
  try {
    await pb.collection('users').update(auth.user.id, {
      password: password.value,
      passwordConfirm: confirm.value,
      oldPassword: current.value,
    })
    useAudio().playSuccess()
    toast.add({ type: 'success', title: 'Password set', message: 'Welcome aboard!' })
    // Re-fetch the fresh record so must_change_password clears and nav unlocks.
    await pb.collection('users').authRefresh()
    await navigateTo('/dashboard')
  } catch (e: any) {
    useAudio().playError()
    const msg = e?.data?.message || e?.message || 'Could not update password.'
    error.value = msg
    toast.add({ type: 'error', title: 'Failed to set password', message: msg })
  } finally { saving.value = false }
}
</script>