<template>
  <div>
    <motion.div :initial="{ opacity: 0, y: 26 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5, ease: 'easeOut' }">
      <div class="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 backdrop-blur-xl sm:p-8">
        <div class="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-red/10 blur-3xl" aria-hidden="true" />

        <div class="mb-7">
          <h1 class="font-heading text-3xl text-white sm:text-4xl">Welcome <span class="text-brand-red">Back</span></h1>
          <p class="mt-2 text-sm text-brand-grey">Sign in to your PowerBikes account</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5" novalidate>
          <div>
            <label for="login-email" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Email</label>
            <div class="relative">
              <Mail class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-grey/60" aria-hidden="true" />
              <Field name="email" v-slot="{ componentField, errorMessage }">
                <input
                  v-bind="componentField"
                  id="login-email"
                  type="email"
                  autocomplete="email"
                  placeholder="you@example.com"
                  class="input-field h-12 w-full rounded-xl border-white/10 bg-white/[0.03] pl-11! focus:border-brand-red focus:ring-2 focus:ring-brand-red/25"
                  :class="{ 'border-brand-red/70': errorMessage }"
                  :aria-invalid="!!errorMessage"
                  :aria-describedby="errorMessage ? 'login-email-error' : undefined"
                />
                <p v-if="errorMessage" id="login-email-error" class="mt-1.5 text-xs text-brand-red" role="alert">{{ errorMessage }}</p>
              </Field>
            </div>
          </div>

          <div>
            <label for="login-password" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Password</label>
            <div class="relative">
              <Lock class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-grey/60" aria-hidden="true" />
              <Field name="password" v-slot="{ componentField, errorMessage }">
                <div class="relative">
                  <input
                    v-bind="componentField"
                    id="login-password"
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="current-password"
                    placeholder="••••••••"
                    class="input-field h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-11! pr-12! focus:border-brand-red focus:ring-2 focus:ring-brand-red/25"
                    :class="{ 'border-brand-red/70': errorMessage }"
                    :aria-invalid="!!errorMessage"
                    :aria-describedby="errorMessage ? 'login-password-error' : undefined"
                  />
                  <button
                    type="button"
                    class="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-brand-grey/70 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                    :aria-pressed="showPassword"
                    @click="showPassword = !showPassword"
                  >
                    <EyeOff v-if="showPassword" class="h-5 w-5" aria-hidden="true" />
                    <Eye v-else class="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                <p v-if="errorMessage" id="login-password-error" class="mt-1.5 text-xs text-brand-red" role="alert">{{ errorMessage }}</p>
              </Field>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <label class="flex cursor-pointer items-center gap-2.5 select-none">
              <input v-model="rememberMe" type="checkbox" class="h-4 w-4 accent-brand-red" aria-label="Remember me for 30 days" />
              <span class="text-sm text-brand-grey">Remember me for 30 days</span>
            </label>
            <button type="button" class="text-sm font-semibold text-brand-red transition-colors hover:text-red-400" @click="showForgot = !showForgot">
              Forgot password?
            </button>
          </div>

          <Transition name="fade-slide">
            <div v-if="showForgot" class="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p class="text-xs text-brand-grey">Enter your email and we'll send you a password reset link.</p>
              <div class="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <input v-model="resetEmail" type="email" placeholder="you@example.com" class="input-field h-10 flex-1 rounded-lg text-sm" aria-label="Email for password reset" />
                <Button :loading="resetting" size="sm" variant="secondary" class="sm:shrink-0" @click="sendReset">Send</Button>
              </div>
              <p v-if="resetMsg" class="mt-2 text-xs" :class="resetOk ? 'text-green-400' : 'text-brand-red'" role="alert">{{ resetMsg }}</p>
            </div>
          </Transition>

          <Button type="submit" :loading="isSubmitting" loading-text="Signing In..." variant="primary" class="h-12 w-full">
            <LogIn class="h-5 w-5" />Sign In
          </Button>
        </form>

        <div v-if="errorMsg" class="mt-4 rounded-xl border border-brand-red/30 bg-brand-red/10 p-3.5 text-center" role="alert">
          <p class="text-sm font-medium text-brand-red">{{ errorMsg }}</p>
        </div>

        <div class="mt-7 flex items-center gap-4">
          <span class="h-px flex-1 bg-white/[0.08]" />
          <span class="text-xs font-semibold tracking-wide text-brand-grey uppercase">New to PowerBikes?</span>
          <span class="h-px flex-1 bg-white/[0.08]" />
        </div>

        <NuxtLink to="/register" class="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/15 font-semibold text-white transition-all duration-200 hover:border-brand-red/60 hover:bg-brand-red/10 hover:text-brand-red">
          <UserPlus class="h-5 w-5" />Create an Account
        </NuxtLink>

        <p class="mt-6 text-center text-xs text-brand-grey/70">
          Protected by <span class="text-brand-grey">Nairobi Powerbikes</span> security — your data stays yours.
        </p>
      </div>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { LogIn, Mail, Lock, UserPlus, Eye, EyeOff } from 'lucide-vue-next'
import { useForm, Field } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

definePageMeta({ layout: 'auth' })
useHead({
  title: 'Sign In - Nairobi Powerbikes',
  meta: [{ name: 'description', content: 'Sign in to your Nairobi Powerbikes account to book services, schedule test rides and track your wishlist.' }],
})

const { login } = useAuth()
const validationSchema = toTypedSchema(z.object({ email: z.string().email('Valid email required'), password: z.string().min(6, 'Password must be at least 6 characters') }))
const { handleSubmit, isSubmitting, setFieldError } = useForm({ validationSchema, initialValues: { email: '', password: '' } })
const errorMsg = ref('')
const showPassword = ref(false)
const rememberMe = ref(true)
const showForgot = ref(false)
const resetEmail = ref('')
const resetting = ref(false)
const resetMsg = ref('')
const resetOk = ref(false)
const pb = usePB()

const handleLogin = handleSubmit(async (values) => {
  errorMsg.value = ''
  try {
    await login(values.email, values.password, rememberMe.value)
    useAudio().playLogin()
    await navigateTo('/dashboard')
  } catch (err: any) {
    useAudio().playError()
    const msg = err?.data?.message || err?.message || 'Invalid email or password.'
    setFieldError('email', msg)
    errorMsg.value = msg
  }
})

async function sendReset() {
  if (!resetEmail.value || !resetEmail.value.includes('@')) { resetMsg.value = 'Enter a valid email address'; resetOk.value = false; useAudio().playError(); return }
  resetting.value = true
  resetMsg.value = ''
  try {
    await pb.collection('users').requestPasswordReset(resetEmail.value)
    resetOk.value = true
    resetMsg.value = 'Reset link sent — check your inbox.'
    useAudio().playSuccess()
  } catch (err: any) {
    resetOk.value = false
    resetMsg.value = err?.data?.message || err?.message || 'Could not send reset link.'
    useAudio().playError()
  } finally { resetting.value = false }
}
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.25s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(-6px); }
</style>