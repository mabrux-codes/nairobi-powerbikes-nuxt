<template>
  <div>
    <motion.div :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5 }" class="w-full">
      <div class="rounded-sm border border-brand-grey/20 bg-brand-black p-8">
        <div class="mb-6 text-center">
          <h1 class="font-heading text-4xl text-white sm:text-5xl">Create Account</h1>
          <p class="mt-2 text-sm text-brand-grey">Join the Nairobi Powerbikes community</p>
        </div>
        <form @submit.prevent="handleRegister" class="space-y-5">
          <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Full Name</label><Field name="name" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="text" class="input-field" :class="{ 'border-brand-red': errorMessage }" placeholder="John Doe" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
          <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Email</label><Field name="email" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="email" class="input-field" :class="{ 'border-brand-red': errorMessage }" placeholder="you@example.com" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
          <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Phone</label><Field name="phone" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="tel" class="input-field" :class="{ 'border-brand-red': errorMessage }" placeholder="+254 7XX XXX XXX" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
          <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Password</label><Field name="password" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="password" class="input-field" :class="{ 'border-brand-red': errorMessage }" placeholder="••••••••" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
          <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Confirm Password</label><Field name="passwordConfirm" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="password" class="input-field" :class="{ 'border-brand-red': errorMessage }" placeholder="••••••••" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
          <Button type="submit" :loading="isSubmitting" variant="primary" class="w-full"><UserPlus class="h-5 w-5" />Create Account</Button>
        </form>
        <div v-if="errorMsg" class="mt-4 rounded-sm border border-brand-red/30 bg-brand-red/10 p-3 text-center"><p class="text-sm text-brand-red">{{ errorMsg }}</p></div>
        <p class="mt-6 text-center text-sm text-brand-grey">Already have an account? <NuxtLink to="/login" class="font-display text-brand-red hover:underline">Sign In</NuxtLink></p>
      </div>
    </motion.div>
  </div>
</template>
<script setup lang="ts">
import { motion } from 'motion-v'
import { UserPlus, LoaderCircle } from 'lucide-vue-next'
import { useForm, Field } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

definePageMeta({ layout: 'auth' })
useHead({ title: 'Register - Nairobi Powerbikes' })

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

const handleRegister = handleSubmit(async (values) => {
  errorMsg.value = ''
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
