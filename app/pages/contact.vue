<template>
  <div class="min-h-screen bg-brand-black pt-24">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div :initial="{ opacity: 0, y: 40 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6 }">
        <h1 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl">Get in Touch</h1>
        <div class="mt-2 h-1 w-24 bg-brand-red" /><p class="mt-4 text-brand-grey">We'd love to hear from you. Reach out with any questions or inquiries.</p>
      </motion.div>

      <div class="mt-10 grid gap-12 lg:grid-cols-5">
        <motion.div class="lg:col-span-3" :initial="{ opacity: 0, x: -30 }" :animate="{ opacity: 1, x: 0 }" :transition="{ delay: 0.2, duration: 0.5 }">
          <div class="rounded-sm border border-brand-grey/20 bg-brand-black p-6 sm:p-8">
            <h2 class="font-display text-display-sm leading-[var(--leading-display)] text-white">Send Us a Message</h2>
            <form @submit.prevent="submit" class="mt-6 space-y-5">
              <div class="grid gap-5 sm:grid-cols-2">
                <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Name</label><Field name="name" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="text" class="input-field" :class="{ 'border-brand-red': errorMessage }" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
                <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Phone</label><Field name="phone" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="tel" class="input-field" :class="{ 'border-brand-red': errorMessage }" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
              </div>
              <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Email</label><Field name="email" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="email" class="input-field" :class="{ 'border-brand-red': errorMessage }" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
              <div class="grid gap-5 sm:grid-cols-2">
                <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Subject</label><Field name="subject" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="text" class="input-field" :class="{ 'border-brand-red': errorMessage }" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
                <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Category</label><Field name="category" v-slot="{ componentField, errorMessage }"><select v-bind="componentField" class="input-field appearance-none" :class="{ 'border-brand-red': errorMessage }"><option value="" disabled>Select category</option><option v-for="c in categories" :key="c" :value="c">{{ c }}</option></select><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
              </div>
              <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Message</label><Field name="message" v-slot="{ componentField, errorMessage }"><textarea v-bind="componentField" rows="5" class="input-field min-h-[140px]" :class="{ 'border-brand-red': errorMessage }"></textarea><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
              <button type="submit" :disabled="isSubmitting" class="btn-primary w-full justify-center disabled:opacity-50"><LoaderCircle v-if="isSubmitting" class="h-5 w-5 animate-spin" /><Send v-else class="h-5 w-5" />{{ isSubmitting ? 'Sending...' : 'Send Message' }}</button>
            </form>
            <div v-if="showSuccess" class="mt-6 rounded-sm border border-green-500/30 bg-green-500/10 p-5 text-center">
              <CheckCircle class="mx-auto mb-3 h-8 w-8 text-green-400" /><p class="font-display text-xl tracking-display text-green-400">Message Sent!</p><p class="mt-1 text-sm text-green-300">We'll get back to you as soon as possible.</p>
              <button class="btn-ghost mt-4" @click="resetForm">Send Another Message</button>
            </div>
            <div v-if="submitError" class="mt-6 rounded-sm border border-brand-red/30 bg-brand-red/10 p-4 text-center"><p class="text-sm text-brand-red">{{ submitError }}</p></div>
          </div>
        </motion.div>

        <motion.div class="lg:col-span-2 space-y-6" :initial="{ opacity: 0, x: 30 }" :animate="{ opacity: 1, x: 0 }" :transition="{ delay: 0.3, duration: 0.5 }">
          <div v-if="branchesLoading" class="animate-pulse space-y-6"><div v-for="i in 3" :key="i" class="h-40 rounded-sm bg-brand-grey/10" /></div>
          <template v-else>
            <div v-for="branch in branches" :key="branch.id" class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-5 transition-all duration-300 hover:border-brand-red/40">
              <div class="mb-3 flex items-center gap-2"><MapPin class="h-4 w-4 text-brand-red" /><h3 class="font-display text-lg text-white">{{ branch.name }}</h3></div>
              <div class="space-y-2 text-sm text-brand-grey">
                <p class="flex items-center gap-2"><MapPin class="h-3.5 w-3.5 shrink-0 text-brand-grey/50" />{{ branch.address }}</p>
                <p v-if="branch.phone" class="flex items-center gap-2"><Phone class="h-3.5 w-3.5 shrink-0 text-brand-grey/50" /><a :href="`tel:${branch.phone}`" class="hover:text-brand-red">{{ branch.phone }}</a></p>
                <p v-if="branch.hours" class="flex items-start gap-2"><Clock class="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-grey/50" /><span class="whitespace-pre-line">{{ branch.hours }}</span></p>
              </div>
            </div>
          </template>
          <ClientOnly><LeafletMap :branches="mapBranches" height="300px" /><template #fallback><div class="h-[300px] animate-pulse rounded-sm bg-brand-grey/10" /></template></ClientOnly>
        </motion.div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { motion } from 'motion-v'
import { Send, LoaderCircle, CheckCircle, MapPin, Phone, Clock } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useForm, Field } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

interface Branch { id: string; name: string; address: string; phone?: string; email?: string; hours?: string; lat?: number; lng?: number }

useHead({ title: 'Contact Us - Nairobi Powerbikes', meta: [{ name: 'description', content: 'Get in touch with Nairobi Powerbikes. Visit our branch on Mombasa Road or Kiambu Road.' }] })
const pb = usePB()
const validationSchema = toTypedSchema(z.object({ name: z.string().min(2, 'Name required'), email: z.string().email('Valid email required'), phone: z.string().optional(), subject: z.string().min(2, 'Subject required'), category: z.string().min(1, 'Select category'), message: z.string().min(10, 'Message too short') }))
const { handleSubmit, isSubmitting, resetForm } = useForm({ validationSchema, initialValues: { name: '', email: '', phone: '', subject: '', category: '', message: '' } })
const showSuccess = ref(false); const submitError = ref(''); const branchesLoading = ref(true); const branches = ref<Branch[]>([])
const categories = ['General Inquiry', 'Sales', 'Service', 'Parts', 'Financing', 'Feedback', 'Other']

const mapBranches = computed(() => {
  if (branches.value.length) return branches.value.filter(b => b.lat && b.lng).map(b => ({ name: b.name, address: b.address, phone: b.phone, hours: b.hours, lat: b.lat!, lng: b.lng! }))
  return [
    { name: 'Mombasa Road Branch', address: 'DTB Centre Annex 2, Mombasa Road, Opposite Airtel Kenya, Nairobi', phone: '+254 712 345 678', hours: 'Mon-Sat: 8:00 AM - 6:00 PM\nSun: 10:00 AM - 4:00 PM', lat: -1.326078, lng: 36.8458795 },
    { name: 'Kiambu Road Branch', address: 'TotalEnergies Kiambu Road Service Station, Kiambu Road', phone: '+254 723 456 789', hours: 'Mon-Sat: 8:30 AM - 6:30 PM\nSun: 10:00 AM - 4:00 PM', lat: -1.1891417, lng: 36.8371582 },
  ]
})

const submit = handleSubmit(async (values) => {
  showSuccess.value = false; submitError.value = ''
  try {
    await pb.collection('contacts').create({ name: values.name, email: values.email, phone: values.phone || '', subject: values.subject, category: values.category, message: values.message, status: 'new' })
    showSuccess.value = true; resetForm()
  } catch (err: any) { submitError.value = err?.data?.message || err?.message || 'Failed to send message.' }
})

onMounted(async () => {
  try { branches.value = await pb.collection('branches').getFullList<Branch>({ sort: 'name' }) }
  catch { branches.value = [] }
  finally { branchesLoading.value = false }
})
</script>
