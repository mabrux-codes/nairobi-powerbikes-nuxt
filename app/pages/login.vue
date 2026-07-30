<template>
  <div>
    <motion.div :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5 }" class="w-full">
      <div class="rounded-sm border border-brand-grey/20 bg-brand-black p-8">
        <div class="mb-6 text-center">
          <h1 class="font-heading text-4xl text-white sm:text-5xl">Welcome <span class="text-brand-red">Back</span></h1>
          <p class="mt-2 text-sm text-brand-grey">Sign in to your account</p>
        </div>
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Email</label><Field name="email" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="email" class="input-field" :class="{ 'border-brand-red': errorMessage }" placeholder="you@example.com" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
          <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Password</label><Field name="password" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="password" class="input-field" :class="{ 'border-brand-red': errorMessage }" placeholder="••••••••" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
          <Button type="submit" :loading="isSubmitting" variant="primary" class="w-full"><LogIn class="h-5 w-5" />Sign In</Button>
        </form>
        <div v-if="errorMsg" class="mt-4 rounded-sm border border-brand-red/30 bg-brand-red/10 p-3 text-center"><p class="text-sm text-brand-red">{{ errorMsg }}</p></div>
        <p class="mt-6 text-center text-sm text-brand-grey">Don't have an account? <NuxtLink to="/register" class="font-display text-brand-red hover:underline">Register</NuxtLink></p>
      </div>
    </motion.div>
  </div>
</template>
<script setup lang="ts">
import { motion } from 'motion-v'
import { LogIn, LoaderCircle } from 'lucide-vue-next'
import { useForm, Field } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

definePageMeta({ layout: 'auth' })
useHead({ title: 'Sign In - Nairobi Powerbikes' })

const { login } = useAuth()
const validationSchema = toTypedSchema(z.object({ email: z.string().email('Valid email required'), password: z.string().min(6, 'Password must be at least 6 characters') }))
const { handleSubmit, isSubmitting, setFieldError } = useForm({ validationSchema, initialValues: { email: '', password: '' } })
const errorMsg = ref('')

const handleLogin = handleSubmit(async (values) => {
  errorMsg.value = ''
  try {
    await login(values.email, values.password)
    await navigateTo('/dashboard')
  } catch (err: any) {
    const msg = err?.data?.message || err?.message || 'Invalid email or password.'
    setFieldError('email', msg)
    errorMsg.value = msg
  }
})
</script>
