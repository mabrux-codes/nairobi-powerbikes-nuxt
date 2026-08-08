<template>
  <div>
    <motion.div :initial="{ opacity: 0, y: 26 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5, ease: 'easeOut' }">
      <div class="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 backdrop-blur-xl sm:p-8">
        <div class="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-red/10 blur-3xl" aria-hidden="true" />

        <div class="mb-7">
          <h1 class="font-heading text-3xl text-white sm:text-4xl">Create <span class="text-brand-red">Account</span></h1>
          <p class="mt-2 text-sm text-brand-grey">Join the Nairobi Powerbikes community — it takes under a minute</p>
        </div>

        <div class="mb-6 flex items-center gap-1.5" role="progressbar" aria-label="Registration progress">
          <span class="h-1 flex-1 rounded-full bg-brand-red" />
          <span class="h-1 flex-1 rounded-full bg-brand-red" />
          <span class="h-1 flex-1 rounded-full bg-white/10" />
        </div>

        <form @submit.prevent="handleRegister" class="space-y-5" novalidate>
          <div>
            <label for="reg-name" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Full Name</label>
            <div class="relative">
              <User class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-grey/60" aria-hidden="true" />
              <Field name="name" v-slot="{ componentField, errorMessage }">
                <input
                  v-bind="componentField"
                  id="reg-name"
                  type="text"
                  autocomplete="name"
                  placeholder="John Doe"
                  class="input-field h-12 w-full rounded-xl border-white/10 bg-white/[0.03] pl-11! focus:border-brand-red focus:ring-2 focus:ring-brand-red/25"
                  :class="{ 'border-brand-red/70': errorMessage }"
                  :aria-invalid="!!errorMessage"
                  :aria-describedby="errorMessage ? 'reg-name-error' : undefined"
                />
                <p v-if="errorMessage" id="reg-name-error" class="mt-1.5 text-xs text-brand-red" role="alert">{{ errorMessage }}</p>
              </Field>
            </div>
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label for="reg-email" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Email</label>
              <div class="relative">
                <Mail class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-grey/60" aria-hidden="true" />
                <Field name="email" v-slot="{ componentField, errorMessage }">
                  <input
                    v-bind="componentField"
                    id="reg-email"
                    type="email"
                    autocomplete="email"
                    placeholder="you@example.com"
                    class="input-field h-12 w-full rounded-xl border-white/10 bg-white/[0.03] pl-11! focus:border-brand-red focus:ring-2 focus:ring-brand-red/25"
                    :class="{ 'border-brand-red/70': errorMessage }"
                    :aria-invalid="!!errorMessage"
                    :aria-describedby="errorMessage ? 'reg-email-error' : undefined"
                  />
                  <p v-if="errorMessage" id="reg-email-error" class="mt-1.5 text-xs text-brand-red" role="alert">{{ errorMessage }}</p>
                </Field>
              </div>
            </div>
            <div>
              <label for="reg-phone" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Phone</label>
              <div class="relative">
                <Phone class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-grey/60" aria-hidden="true" />
                <Field name="phone" v-slot="{ componentField, errorMessage }">
                  <input
                    v-bind="componentField"
                    id="reg-phone"
                    type="tel"
                    autocomplete="tel"
                    placeholder="+254 7XX XXX XXX"
                    class="input-field h-12 w-full rounded-xl border-white/10 bg-white/[0.03] pl-11! focus:border-brand-red focus:ring-2 focus:ring-brand-red/25"
                    :class="{ 'border-brand-red/70': errorMessage }"
                    :aria-invalid="!!errorMessage"
                    :aria-describedby="errorMessage ? 'reg-phone-error' : undefined"
                  />
                  <p v-if="errorMessage" id="reg-phone-error" class="mt-1.5 text-xs text-brand-red" role="alert">{{ errorMessage }}</p>
                </Field>
              </div>
            </div>
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label for="reg-password" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Password</label>
              <div class="relative">
                <Lock class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-grey/60" aria-hidden="true" />
                <Field name="password" v-slot="{ componentField, errorMessage }">
                  <div class="relative">
                    <input
                      v-bind="componentField"
                      id="reg-password"
                      :type="showPassword ? 'text' : 'password'"
                      autocomplete="new-password"
                      placeholder="Min. 6 characters"
                      class="input-field h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-11! pr-12! focus:border-brand-red focus:ring-2 focus:ring-brand-red/25"
                      :class="{ 'border-brand-red/70': errorMessage }"
                      :aria-invalid="!!errorMessage"
                      :aria-describedby="errorMessage ? 'reg-password-error' : undefined"
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
                  <p v-if="errorMessage" id="reg-password-error" class="mt-1.5 text-xs text-brand-red" role="alert">{{ errorMessage }}</p>
                </Field>
              </div>

              <div v-if="passwordValue.length > 0" class="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <div class="flex items-center justify-between gap-3">
                  <span class="font-display text-[10px] font-bold tracking-[0.18em] text-brand-grey uppercase">Password strength</span>
                  <span class="text-xs font-semibold" :class="strengthTextClass">{{ strengthLabel }}</span>
                </div>
                <div
                  class="mt-2 flex gap-1"
                  role="meter"
                  aria-label="Password strength"
                  :aria-valuemin="0"
                  :aria-valuemax="10"
                  :aria-valuenow="strengthSegments"
                >
                  <span v-for="i in 10" :key="i" class="h-1.5 flex-1 rounded-full transition-colors duration-300" :class="i <= strengthSegments ? strengthBarClass : 'bg-white/10'" />
                </div>
                <ul class="mt-3 space-y-1.5">
                  <li v-for="r in requirements" :key="r.label" class="flex items-start gap-2 text-xs leading-snug" :class="r.met ? 'text-green-400' : 'text-brand-grey'">
                    <span class="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border" :class="r.met ? 'border-green-400/50 bg-green-400/15' : 'border-white/15 bg-white/[0.04]'">
                      <Check v-if="r.met" class="h-2.5 w-2.5" aria-hidden="true" />
                      <X v-else class="h-2.5 w-2.5" aria-hidden="true" />
                    </span>
                    {{ r.label }}
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <label for="reg-confirm" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Confirm Password</label>
              <div class="relative">
                <Lock class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-grey/60" aria-hidden="true" />
                <Field name="passwordConfirm" v-slot="{ componentField, errorMessage }">
                  <div class="relative">
                    <input
                      v-bind="componentField"
                      id="reg-confirm"
                      :type="showConfirm ? 'text' : 'password'"
                      autocomplete="new-password"
                      placeholder="••••••••"
                      class="input-field h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-11! pr-12! focus:border-brand-red focus:ring-2 focus:ring-brand-red/25"
                      :class="{ 'border-brand-red/70': errorMessage }"
                      :aria-invalid="!!errorMessage"
                      :aria-describedby="errorMessage ? 'reg-confirm-error' : undefined"
                    />
                    <button
                      type="button"
                      class="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-brand-grey/70 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
                      :aria-label="showConfirm ? 'Hide password' : 'Show password'"
                      :aria-pressed="showConfirm"
                      @click="showConfirm = !showConfirm"
                    >
                      <EyeOff v-if="showConfirm" class="h-5 w-5" aria-hidden="true" />
                      <Eye v-else class="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                  <p v-if="errorMessage" id="reg-confirm-error" class="mt-1.5 text-xs text-brand-red" role="alert">{{ errorMessage }}</p>
                </Field>
              </div>
            </div>
          </div>

          <div>
            <label class="flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 transition-colors select-none" :class="termsError ? 'border-brand-red/60 bg-brand-red/[0.06]' : 'border-white/10 bg-white/[0.02]'">
              <input v-model="termsAccepted" type="checkbox" class="mt-0.5 h-4 w-4 shrink-0 accent-brand-red" aria-label="I agree to the Terms of Service and Privacy Policy" :aria-invalid="!!termsError" :aria-describedby="termsError ? 'terms-error' : undefined" @change="termsError = ''" />
              <span class="text-sm text-brand-grey">
                I agree to the <NuxtLink to="/terms" class="font-semibold text-brand-red hover:underline" @click.stop>Terms of Service</NuxtLink> and
                <NuxtLink to="/privacy" class="font-semibold text-brand-red hover:underline" @click.stop>Privacy Policy</NuxtLink>
              </span>
            </label>
            <p v-if="termsError" id="terms-error" class="mt-1.5 text-xs text-brand-red" role="alert">{{ termsError }}</p>
          </div>

          <Button type="submit" :loading="isSubmitting" loading-text="Creating Account..." variant="primary" class="h-12 w-full">
            <UserPlus class="h-5 w-5" />Create Account
          </Button>
        </form>

        <div v-if="errorMsg" class="mt-4 rounded-xl border border-brand-red/30 bg-brand-red/10 p-3.5 text-center" role="alert">
          <p class="text-sm font-medium text-brand-red">{{ errorMsg }}</p>
        </div>

        <div class="mt-7 flex items-center gap-4">
          <span class="h-px flex-1 bg-white/[0.08]" />
          <span class="text-xs font-semibold tracking-wide text-brand-grey uppercase">Already Registered?</span>
          <span class="h-px flex-1 bg-white/[0.08]" />
        </div>

        <NuxtLink to="/login" class="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/15 font-semibold text-white transition-all duration-200 hover:border-brand-red/60 hover:bg-brand-red/10 hover:text-brand-red">
          <LogIn class="h-5 w-5" />Sign In Instead
        </NuxtLink>
      </div>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { UserPlus, User, Mail, Phone, Lock, LogIn, Eye, EyeOff, Check, X } from 'lucide-vue-next'
import { useForm, Field } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

definePageMeta({ layout: 'auth' })
useHead({
  title: 'Register - Nairobi Powerbikes',
  meta: [{ name: 'description', content: 'Create your Nairobi Powerbikes account to book services, schedule test rides, save wishlists and access exclusive offers.' }],
})

const { register } = useAuth()
const validationSchema = toTypedSchema(z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  passwordConfirm: z.string().min(6, 'Confirm your password'),
}).refine(d => d.password === d.passwordConfirm, { message: 'Passwords do not match', path: ['passwordConfirm'] }))
const { handleSubmit, isSubmitting, setFieldError, values } = useForm({ validationSchema, initialValues: { name: '', email: '', phone: '', password: '', passwordConfirm: '' } })
const errorMsg = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)
const termsAccepted = ref(false)
const termsError = ref('')

const passwordValue = computed(() => String(values.password || ''))
const passwordRules = computed(() => {
  const v = passwordValue.value
  return {
    length: v.length >= 6,
    upper: /[A-Z]/.test(v),
    lower: /[a-z]/.test(v),
    number: /\d/.test(v),
    special: /[^A-Za-z0-9]/.test(v),
  }
})
const requirements = computed(() => [
  { label: 'At least 6 characters', met: passwordRules.value.length },
  { label: 'Uppercase letter', met: passwordRules.value.upper },
  { label: 'Lowercase letter', met: passwordRules.value.lower },
  { label: 'Number', met: passwordRules.value.number },
  { label: 'Special character', met: passwordRules.value.special },
])
const strengthCount = computed(() => Object.values(passwordRules.value).filter(Boolean).length)
const strengthLabel = computed(() => {
  if (strengthCount.value === 5) return 'Strong'
  if (strengthCount.value >= 3) return 'Medium'
  return 'Weak'
})
const strengthSegments = computed(() => {
  if (strengthCount.value === 5) return 10
  if (strengthCount.value >= 3) return 6
  return 4
})
const strengthBarClass = computed(() => {
  if (strengthCount.value === 5) return 'bg-brand-red shadow-[0_0_8px_rgba(214,0,28,0.5)]'
  if (strengthCount.value >= 3) return 'bg-amber-400'
  return 'bg-brand-red/50'
})
const strengthTextClass = computed(() => {
  if (strengthCount.value === 5) return 'text-brand-red'
  if (strengthCount.value >= 3) return 'text-amber-400'
  return 'text-brand-grey'
})
const passwordIsStrong = computed(() => strengthCount.value === 5)

const handleRegister = handleSubmit(async (values) => {
  errorMsg.value = ''
  termsError.value = ''
  if (!termsAccepted.value) {
    termsError.value = 'Please accept the Terms of Service and Privacy Policy to continue.'
    useAudio().playError()
    return
  }
  if (!passwordIsStrong.value) {
    setFieldError('password', 'Password must have at least 6 characters including upper & lowercase letters, a number and a special character.')
    useAudio().playError()
    return
  }
  try {
    await register(values.email, values.password, { name: values.name, phone: values.phone })
    useAudio().playSuccess()
    await navigateTo('/login')
  } catch (err: any) {
    useAudio().playError()
    const msg = err?.data?.message || err?.message || 'Registration failed.'
    setFieldError('email', msg)
    errorMsg.value = msg
  }
})
</script>