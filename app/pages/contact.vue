<template>
  <div class="min-h-screen bg-brand-black pb-24">
    <PageHeader
      eyebrow="We're Here To Help"
      title="Get in"
      accent="Touch"
      description="Questions about bikes, financing or service? Reach our team through any channel below — we reply within one business day."
    >
      <template #actions>
        <Button to="/service/booking" variant="primary" size="lg"><Wrench class="h-5 w-5" />Book a Service</Button>
        <Button to="/service/test-ride" variant="secondary" size="lg"><Bike class="h-5 w-5" />Book a Test Ride</Button>
      </template>
    </PageHeader>

    <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
      <!-- Contact cards -->
      <div class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          v-for="(card, i) in contactCards"
          :key="card.title"
          class="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/40"
          :initial="{ opacity: 0, y: 30 }" :while-in-view="{ opacity: 1, y: 0 }" :viewport="{ once: true, margin: '-40px' }" :transition="{ delay: i * 0.08, duration: 0.5 }"
        >
          <component :is="card.icon" class="mb-4 h-8 w-8 text-brand-red" />
          <h3 class="font-display text-lg font-bold tracking-display text-white">{{ card.title }}</h3>
          <p class="mt-1 text-sm text-brand-grey">{{ card.desc }}</p>
          <div class="mt-4 space-y-1.5 text-sm">
            <p v-if="card.phone" class="flex items-center gap-2"><Phone class="h-3.5 w-3.5 text-brand-grey/60" /><a :href="`tel:${card.phone}`" class="transition-colors hover:text-brand-red">{{ card.phone }}</a></p>
            <p v-if="card.email" class="flex items-center gap-2"><Mail class="h-3.5 w-3.5 text-brand-grey/60" /><a :href="`mailto:${card.email}`" class="truncate transition-colors hover:text-brand-red">{{ card.email }}</a></p>
          </div>
        </motion.div>
      </div>

      <div class="mt-16 grid gap-10 lg:grid-cols-5">
        <!-- Form -->
        <motion.div class="lg:col-span-3" :initial="{ opacity: 0, y: 30 }" :while-in-view="{ opacity: 1, y: 0 }" :viewport="{ once: true, margin: '-40px' }" :transition="{ delay: 0.1, duration: 0.5 }">
          <div class="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 sm:p-8">
            <h2 class="font-heading text-3xl text-white">Send Us a <span class="text-brand-red">Message</span></h2>
            <p class="mt-2 text-sm text-brand-grey">Fill in the form and our team will get back to you.</p>
            <form @submit.prevent="submit" class="mt-7 space-y-5">
              <div class="grid gap-5 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block font-display text-xs font-bold tracking-display text-brand-grey uppercase">Name</label>
                  <Field name="name" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="text" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" :class="{ 'border-brand-red/70': errorMessage }" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field>
                </div>
                <div>
                  <label class="mb-1.5 block font-display text-xs font-bold tracking-display text-brand-grey uppercase">Phone</label>
                  <Field name="phone" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="tel" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" :class="{ 'border-brand-red/70': errorMessage }" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field>
                </div>
              </div>
              <div>
                <label class="mb-1.5 block font-display text-xs font-bold tracking-display text-brand-grey uppercase">Email</label>
                <Field name="email" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="email" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" :class="{ 'border-brand-red/70': errorMessage }" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field>
              </div>
              <div class="grid gap-5 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block font-display text-xs font-bold tracking-display text-brand-grey uppercase">Subject</label>
                  <Field name="subject" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="text" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" :class="{ 'border-brand-red/70': errorMessage }" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field>
                </div>
                <div>
                  <label class="mb-1.5 block font-display text-xs font-bold tracking-display text-brand-grey uppercase">Category</label>
                  <Field name="category" v-slot="{ componentField, errorMessage }"><select v-bind="componentField" class="input-field h-12 appearance-none rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" :class="{ 'border-brand-red/70': errorMessage }"><option value="" disabled>Select category</option><option v-for="c in categories" :key="c.value" :value="c.value">{{ c.label }}</option></select><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field>
                </div>
              </div>
              <div>
                <label class="mb-1.5 block font-display text-xs font-bold tracking-display text-brand-grey uppercase">Message</label>
                <Field name="message" v-slot="{ componentField, errorMessage }"><textarea v-bind="componentField" rows="5" class="input-field min-h-[140px] rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" :class="{ 'border-brand-red/70': errorMessage }"></textarea><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field>
              </div>
              <Button type="submit" :loading="isSubmitting" variant="primary" class="h-12 w-full"><Send class="h-5 w-5" />Send Message</Button>
            </form>
            <div v-if="showSuccess" class="mt-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-6 text-center">
              <CheckCircle class="mx-auto mb-3 h-9 w-9 text-green-400" />
              <p class="font-display text-xl tracking-display text-green-400">Message Sent!</p>
              <p class="mt-1 text-sm text-green-300">We'll get back to you as soon as possible.</p>
              <Button variant="ghost" class="mt-4" @click="resetForm">Send Another Message</Button>
            </div>
            <div v-if="submitError" class="mt-6 rounded-xl border border-brand-red/30 bg-brand-red/10 p-4 text-center"><p class="text-sm text-brand-red">{{ submitError }}</p></div>
          </div>
        </motion.div>

        <!-- Branches + map -->
        <motion.div class="lg:col-span-2 space-y-6" :initial="{ opacity: 0, y: 30 }" :while-in-view="{ opacity: 1, y: 0 }" :viewport="{ once: true, margin: '-40px' }" :transition="{ delay: 0.2, duration: 0.5 }">
          <h2 class="font-heading text-3xl text-white">Visit Our <span class="text-brand-red">Branches</span></h2>
          <div v-if="branchesLoading" class="animate-pulse space-y-5">
            <div v-for="i in 3" :key="i" class="h-40 rounded-2xl bg-white/[0.04]" />
          </div>
          <template v-else>
            <div v-for="branch in branches" :key="branch.id" class="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent transition-all duration-300 hover:border-brand-red/40">
              <div v-if="branchImage(branch)" class="relative aspect-[16/9] overflow-hidden">
                <img :src="branchImage(branch)" :alt="branch.name" class="h-full w-full object-cover" loading="lazy" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div class="p-5">
                <div class="mb-3 flex items-center gap-2"><MapPin class="h-4 w-4 shrink-0 text-brand-red" /><h3 class="font-display text-lg font-bold tracking-display text-white">{{ branch.name }}</h3></div>
                <div class="space-y-2 text-sm text-brand-grey">
                  <p class="flex items-start gap-2"><MapPin class="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-grey/50" />{{ branch.address }}</p>
                  <p v-if="branch.phone" class="flex items-center gap-2"><Phone class="h-3.5 w-3.5 shrink-0 text-brand-grey/50" /><a :href="`tel:${branch.phone}`" class="transition-colors hover:text-brand-red">{{ branch.phone }}</a></p>
                  <p v-if="branch.hours" class="flex items-start gap-2"><Clock class="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-grey/50" /><span class="whitespace-pre-line">{{ branch.hours }}</span></p>
                </div>
              </div>
            </div>
          </template>
          <ClientOnly><LeafletMap :branches="mapBranches" height="300px" class="overflow-hidden rounded-2xl border border-white/[0.08]" /><template #fallback><div class="h-[300px] animate-pulse rounded-2xl bg-white/[0.04]" /></template></ClientOnly>
        </motion.div>
      </div>

      <!-- FAQ -->
      <div class="mx-auto mt-20 max-w-4xl">
        <SectionHeading eyebrow="Good To Know" title="Contact" accent="FAQ" description="Quick answers before you reach out." />
        <div class="space-y-3">
          <div v-for="(faq, i) in faqs" :key="i" class="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent">
            <button class="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-display font-bold tracking-display text-white transition-colors hover:text-brand-red" :aria-expanded="openFaq === i" @click="openFaq = openFaq === i ? -1 : i">
              {{ faq.q }}
              <ChevronDown class="h-5 w-5 shrink-0 text-brand-red transition-transform duration-300" :class="{ 'rotate-180': openFaq === i }" />
            </button>
            <Transition name="fade">
              <p v-if="openFaq === i" class="border-t border-white/[0.06] px-6 py-5 text-sm leading-relaxed text-brand-grey">{{ faq.a }}</p>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { Send, CheckCircle, MapPin, Phone, Clock, Mail, Wrench, Bike, Headset, Wallet, ShieldCheck, ChevronDown } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useForm, Field } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

interface Branch { id: string; name: string; address: string; phone?: string; email?: string; hours?: string; lat?: number; lng?: number }

useHead({ title: 'Contact Us - Nairobi Powerbikes', meta: [{ name: 'description', content: 'Get in touch with Nairobi Powerbikes. Visit our branch on Mombasa Road or Kiambu Road.' }] })
const pb = usePB()
const validationSchema = toTypedSchema(z.object({ name: z.string().min(2, 'Name required'), email: z.string().email('Valid email required'), phone: z.string().optional(), subject: z.string().min(2, 'Subject required'), category: z.string().min(1, 'Select category'), message: z.string().min(10, 'Message too short') }))
const { handleSubmit, isSubmitting, resetForm } = useForm({ validationSchema, initialValues: { name: '', email: '', phone: '', subject: '', category: '', message: '' } })
const showSuccess = ref(false); const submitError = ref(''); const branchesLoading = ref(true); const openFaq = ref(0)
const branches = ref<Branch[]>([])

const contactCards = [
  { title: 'Sales & Enquiries', desc: 'Help choosing your next motorcycle.', phone: '+254 712 345 678', email: 'sales@nairopowerbikes.com', icon: Headset },
  { title: 'Service & Parts', desc: 'Bookings, maintenance and genuine parts.', phone: '+254 723 456 789', email: 'service@nairopowerbikes.com', icon: Wrench },
  { title: 'Financing', desc: 'Loan options and application support.', phone: '+254 712 345 678', email: 'finance@nairopowerbikes.com', icon: Wallet },
  { title: 'Warranty & Claims', desc: 'For warranty and after-sales matters.', phone: '+254 723 456 789', email: 'warranty@nairopowerbikes.com', icon: ShieldCheck },
]

const categories = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'sales', label: 'Sales' },
  { value: 'service', label: 'Service' },
  { value: 'parts', label: 'Parts' },
  { value: 'finance', label: 'Financing' },
  { value: 'other', label: 'Other' },
]

const faqs = [
  { q: 'How fast will you reply?', a: 'We respond within one business day — usually much faster during business hours (Mon–Sat, 8 AM – 6 PM).' },
  { q: 'Can I visit without a booking?', a: 'Walk-ins are welcome at both branches. Booking ahead for test rides and service guarantees priority.' },
  { q: 'Do you deliver bikes outside Nairobi?', a: 'Yes. Nationwide delivery is available for most models — our sales team will give you a delivery quote.' },
]

const mapBranches = computed(() => {
  if (branches.value.length) return branches.value.filter(b => b.lat && b.lng).map(b => ({ name: b.name, address: b.address, phone: b.phone, hours: b.hours, lat: b.lat!, lng: b.lng! }))
  return [
    { name: 'Mombasa Road Branch', address: 'DTB Centre Annex 2, Mombasa Road, Opposite Airtel Kenya, Nairobi', phone: '+254 712 345 678', hours: 'Mon-Sat: 8:00 AM - 6:00 PM\nSun: 10:00 AM - 4:00 PM', lat: -1.326078, lng: 36.8458795 },
    { name: 'Kiambu Road Branch', address: 'TotalEnergies Kiambu Road Service Station, Kiambu Road', phone: '+254 723 456 789', hours: 'Mon-Sat: 8:30 AM - 6:30 PM\nSun: 10:00 AM - 4:00 PM', lat: -1.1891417, lng: 36.8371582 },
  ]
})

function branchImage(b: any): string {
  const files = Array.isArray(b.images) ? b.images : []
  if (!files.length) return ''
  const file = files[Number(b.main_image ?? 0) % files.length]
  try { return pb.files.getURL(b, file) } catch { return '' }
}

const submit = handleSubmit(async (values) => {
  showSuccess.value = false; submitError.value = ''
  try {
    await pb.collection('contacts').create({ name: values.name, email: values.email, phone: values.phone || '', subject: values.subject, category: values.category, message: values.message, status: 'new' })
    showSuccess.value = true; resetForm()
  } catch (err: any) { submitError.value = err?.data?.message || err?.message || 'Failed to send message.' }
})

onMounted(async () => {
  try {
    branches.value = await pb.collection('branches').getFullList<Branch>({ sort: 'name' }, { requestKey: 'contact_branches' })
  } catch { branches.value = [] }
  finally { branchesLoading.value = false }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-6px); }
</style>