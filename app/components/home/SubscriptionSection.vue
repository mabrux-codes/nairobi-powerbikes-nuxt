<template>
  <section class="relative overflow-hidden border-t border-brand-grey/10">
    <div class="asphalt-grid absolute inset-0 bg-brand-black" />
    <div class="section-diagonal-reverse relative z-10">
      <div class="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div :initial="{ opacity: 0, y: 30 }" :while-in-view="{ opacity: 1, y: 0 }" :viewport="{ once: true }" :transition="{ duration: 0.6 }">
          <h2 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl">Stay in the <span class="text-brand-red">Loop</span></h2>
          <p class="mx-auto mt-4 max-w-md text-brand-grey">Get first dibs on new arrivals, exclusive deals, and Nairobi moto culture news.</p>
        </motion.div>
        <motion.div class="mx-auto mt-8 max-w-xl" :initial="{ opacity: 0, y: 20 }" :while-in-view="{ opacity: 1, y: 0 }" :viewport="{ once: true }" :transition="{ delay: 0.2, duration: 0.5 }">
          <form v-if="!subscribed" @submit.prevent="handleSubmit" class="flex flex-col gap-3 sm:flex-row">
            <div class="relative flex-1">
              <input v-model="email" type="email" required placeholder="Enter your email" class="input-field h-12 pr-10" :class="{ 'border-brand-red': error }" />
              <Mail v-if="!email.length" class="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-grey/40" />
            </div>
            <button type="submit" :disabled="submitting" class="btn-primary h-12 shrink-0 disabled:opacity-50">
              <LoaderCircle v-if="submitting" class="h-5 w-5 animate-spin" /><Send v-else class="h-5 w-5" />{{ submitting ? 'Subscribing...' : 'Subscribe' }}</button>
          </form>
          <div v-if="subscribed" class="rounded-sm border border-green-500/30 bg-green-500/10 p-6">
            <motion.div :initial="{ opacity: 0, scale: 0.9 }" :animate="{ opacity: 1, scale: 1 }" :transition="{ type: 'spring', stiffness: 200 }">
              <p class="font-display text-2xl tracking-display text-green-400">You're In!</p>
              <p class="mt-1 text-sm text-green-300">Thanks for subscribing. We'll keep you posted on the latest from Nairobi Powerbikes.</p>
            </motion.div>
          </div>
          <p v-if="error" class="mt-3 text-sm text-brand-red">{{ error }}</p>
        </motion.div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { Mail, Send, LoaderCircle } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'

const pb = usePB()
const email = ref('')
const submitting = ref(false)
const subscribed = ref(false)
const error = ref('')

async function handleSubmit() {
  if (!email.value.trim()) return
  submitting.value = true; error.value = ''; subscribed.value = false
  try {
    await pb.collection('subscribers').create({ email: email.value, subscribedAt: new Date().toISOString(), source: 'homepage' })
    subscribed.value = true; email.value = ''
  } catch (err: any) { error.value = err?.data?.message || 'Something went wrong. Try again later.' }
  finally { submitting.value = false }
}
</script>
