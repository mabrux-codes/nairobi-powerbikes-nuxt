<template>
  <div>
    <motion.div :initial="{ opacity: 0, y: 26 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5, ease: 'easeOut' }">
      <div class="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-8 backdrop-blur-xl">
        <div class="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-red/10 blur-3xl" aria-hidden="true" />

        <div class="mb-7">
          <h1 class="font-heading text-4xl text-white">Create <span class="text-brand-red">Account</span></h1>
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
              <User class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-grey/60" />
              <Field name="name" v-slot="{ componentField, errorMessage }">
                <input v-bind="componentField" id="reg-name" type="text" autocomplete="name" placeholder="John Doe" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] pl-11 focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" :class="{ 'border-brand-red/70': errorMessage }" />
                <p v-if="errorMessage" class="mt-1.5 text-xs text-brand-red">{{ errorMessage }}</p>
              </Field>
            </div>
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label for="reg-email" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Email</label>
              <div class="relative">
                <Mail class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-grey/60" />
                <Field name="email" v-slot="{ componentField, errorMessage }">
                  <input v-bind="componentField" id="reg-email" type="email" autocomplete="email" placeholder="you@example.com" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] pl-11 focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" :class="{ 'border-brand-red/70': errorMessage }" />
                  <p v-if="errorMessage" class="mt-1.5 text-xs text-brand-red">{{ errorMessage }}</p>
                </Field>
              </div>
            </div>
            <div>
              <label for="reg-phone" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Phone</label>
              <div class="relative">
                <Phone class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-grey/60" />
                <Field name="phone" v-slot="{ componentField, errorMessage }">
                  <input v-bind="componentField" id="reg-phone" type="tel" autocomplete="tel" placeholder="+254 7XX XXX XXX" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] pl-11 focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" :class="{ 'border-brand-red/70': errorMessage }" />
                  <p v-if="errorMessage" class="mt-1.5 text-xs text-brand-red">{{ errorMessage }}</p>
                </Field>
              </div>
            </div>
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label for="reg-password" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Password</label>
              <div class="relative">
                <Lock class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-grey/60" />
                <Field name="password" v-slot="{ componentField, errorMessage }">
                  <input v-bind="componentField" id="reg-password" type="password" autocomplete="new-password" placeholder="Min. 6 characters" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] pl-11 focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" :class="{ 'border-brand-red/70': errorMessage }" />
                  <p v-if="errorMessage" class="mt-1.5 text-xs text-brand-red">{{ errorMessage }}</p>
                </Field>
              </div>
            </div>
            <div>
              <label for="reg-confirm" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Confirm Password</label>
              <div class="relative">
                <Lock class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-grey/60" />
                <Field name="passwordConfirm" v-slot="{ componentField, errorMessage }">
                  <input v-bind="componentField" id="reg-confirm" type="password" autocomplete="new-password" placeholder="••••••••" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] pl-11 focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" :class="{ 'border-brand-red/70': errorMessage }" />
                  <p v-if="errorMessage" class="mt-1.5 text-xs text-brand-red">{{ errorMessage }}</p>
                </Field>
              </div>
            </div>
          </div>

          <label class="flex cursor-pointer items-start gap-2.5 select-none">
            <input v-model="termsAccepted" type="checkbox" class="mt-0.5 h-4 w-4 accent-brand-red" aria-label="Accept terms" />
            <span class="text-sm text-brand-grey">
              I agree to the <NuxtLink to="/terms" class="font-semibold text-brand-red hover:underline">Terms of Service</NuxtLink> and
              <NuxtLink to="/privacy" class="font-semibold text-brand-red hover:underline">Privacy Policy</NuxtLink>
            </span>
          </label>
          <p v-if="termsError" class="-mt-3 text-xs text-brand-red">{{ termsError }}</p>

          <Button type="submit" :loading="isSubmitting" variant="primary" class="h-12 w-full">
            <UserPlus class="h-5 w-5" />Create Account
          </Button>
        </form>

        <div v-if="errorMsg" class="mt-4 rounded-xl border border-brand-red/30 bg-brand-red/10 p-3.5 text-center">
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
import { UserPlus, User, Mail, Phone, Lock, LogIn } from 'lucide-vue-next'
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
const { handleSubmit, isSubmitting, setFieldError } = useForm({ validationSchema, initialValues: { name: '', email: '', phone: '', password: '', passwordConfirm: '' } })
const errorMsg = ref('')
const termsAccepted = ref(false)
const termsError = ref('')

const handleRegister = handleSubmit(async (values) => {
  errorMsg.value = ''
  termsError.value = ''
  if (!termsAccepted.value) {
    termsError.value = 'Please accept the terms and conditions to continue.'
    return
  }
  try {
    await register(values.email, values.password, { name: values.name, phone: values.phone })
    await navigateTo('/login')
  } catch (err: any) {
    const msg = err?.data?.message || err?.message || 'Registration failed.'
    setFieldError('email', msg)
    errorMsg.value = msg
  }
})
</script>