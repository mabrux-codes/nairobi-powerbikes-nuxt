<template>
  <div class="min-h-screen bg-brand-black pb-24">
    <PageHeader
      eyebrow="Flexible Lending"
      title="Motorcycle"
      accent="Financing"
      description="Low deposits from 10%, competitive rates from 9.9% APR and approval typically within 48 hours — get on the road sooner."
      :crumbs="[{ label: 'Finance' }]"
    >
      <template #actions>
        <Button variant="primary" size="lg" trailing-arrow @click="scrollToCalc"><Calculator class="h-5 w-5" />Calculate & Apply</Button>
        <Button to="/contact" variant="secondary" size="lg"><Phone class="h-5 w-5" />Talk to Finance</Button>
      </template>
    </PageHeader>

    <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
      <!-- Finance options -->
      <div class="mt-14 grid gap-6 lg:grid-cols-3">
        <motion.div
          v-for="(opt, i) in options"
          :key="opt.name"
          class="group relative overflow-hidden rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1.5"
          :class="opt.featured ? 'border-brand-red/50 bg-gradient-to-b from-brand-red/10 to-transparent shadow-xl shadow-brand-red/10' : 'border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent hover:border-brand-red/30'"
          :initial="{ opacity: 0, y: 34 }" :while-in-view="{ opacity: 1, y: 0 }" :viewport="{ once: true, margin: '-40px' }" :transition="{ delay: i * 0.08, duration: 0.5 }"
        >
          <span v-if="opt.featured" class="absolute right-5 top-5 rounded-full bg-brand-red px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase">Most Popular</span>
          <component :is="opt.icon" class="mb-5 h-9 w-9 text-brand-red" />
          <h3 class="font-display text-xl tracking-display text-white">{{ opt.name }}</h3>
          <p class="mt-1 font-heading text-3xl text-white">{{ opt.rate }}<span class="font-display text-base text-brand-grey"> {{ opt.rateUnit }}</span></p>
          <ul class="mt-4 space-y-2.5 text-sm text-brand-grey">
            <li v-for="f in opt.features" :key="f" class="flex gap-2.5"><Check class="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />{{ f }}</li>
          </ul>
        </motion.div>
      </div>

      <!-- Calculator + Apply -->
      <div ref="calcSection" class="mt-16 grid gap-10 lg:grid-cols-5">
        <div class="lg:col-span-3">
          <div class="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 sm:p-8">
            <h2 class="font-heading text-3xl text-white">Loan <span class="text-brand-red">Calculator</span></h2>
            <p class="mt-2 text-sm text-brand-grey">Estimate your monthly repayment in seconds.</p>

            <div class="mt-7 grid gap-5 sm:grid-cols-2">
              <div>
                <label for="calc-price" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Vehicle Price (KES)</label>
                <input id="calc-price" v-model.number="calcPrice" type="number" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" min="0" />
              </div>
              <div>
                <label for="calc-down" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Down Payment (KES)</label>
                <input id="calc-down" v-model.number="calcDown" type="number" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" min="0" />
              </div>
              <div>
                <label for="calc-rate" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Interest Rate (%)</label>
                <input id="calc-rate" v-model.number="calcRate" type="number" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" min="0" step="0.1" />
              </div>
              <div>
                <label for="calc-term" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Term (Months)</label>
                <select id="calc-term" v-model.number="calcTerm" class="input-field h-12 appearance-none rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25">
                  <option :value="12">12 Months</option>
                  <option :value="24">24 Months</option>
                  <option :value="36">36 Months</option>
                  <option :value="48">48 Months</option>
                  <option :value="60">60 Months</option>
                </select>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.06]">
              <div class="bg-brand-black/90 px-4 py-4">
                <p class="text-[10px] font-bold tracking-[0.16em] text-brand-grey uppercase">Monthly Payment</p>
                <p class="mt-1 font-heading text-lg text-white sm:text-xl">KES {{ monthlyPayment.toLocaleString() }}</p>
              </div>
              <div class="bg-brand-black/90 px-4 py-4">
                <p class="text-[10px] font-bold tracking-[0.16em] text-brand-grey uppercase">Total Interest</p>
                <p class="mt-1 font-heading text-lg text-white sm:text-xl">KES {{ totalInterest.toLocaleString() }}</p>
              </div>
              <div class="bg-brand-black/90 px-4 py-4">
                <p class="text-[10px] font-bold tracking-[0.16em] text-brand-grey uppercase">Total Amount</p>
                <p class="mt-1 font-heading text-lg text-brand-red sm:text-xl">KES {{ totalAmount.toLocaleString() }}</p>
              </div>
            </div>
          </div>

          <div class="mt-8 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 sm:p-8">
            <h2 class="font-heading text-3xl text-white">Apply for <span class="text-brand-red">Financing</span></h2>
            <p class="mt-2 text-sm text-brand-grey">Our finance team will contact you within 48 hours with a tailored quotation.</p>

            <form @submit.prevent="submitFinance" class="mt-7 space-y-5">
              <div class="grid gap-5 sm:grid-cols-2">
                <div>
                  <label for="fin-name" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Full Name</label>
                  <Field name="fin_name" v-slot="{ componentField, errorMessage }">
                    <input v-bind="componentField" id="fin-name" type="text" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" :class="{ 'border-brand-red/70': errorMessage }" />
                    <p v-if="errorMessage" class="mt-1.5 text-xs text-brand-red">{{ errorMessage }}</p>
                  </Field>
                </div>
                <div>
                  <label for="fin-phone" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Phone</label>
                  <Field name="fin_phone" v-slot="{ componentField, errorMessage }">
                    <input v-bind="componentField" id="fin-phone" type="tel" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" :class="{ 'border-brand-red/70': errorMessage }" />
                    <p v-if="errorMessage" class="mt-1.5 text-xs text-brand-red">{{ errorMessage }}</p>
                  </Field>
                </div>
                <div class="sm:col-span-2">
                  <label for="fin-email" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Email</label>
                  <Field name="fin_email" v-slot="{ componentField, errorMessage }">
                    <input v-bind="componentField" id="fin-email" type="email" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" :class="{ 'border-brand-red/70': errorMessage }" />
                    <p v-if="errorMessage" class="mt-1.5 text-xs text-brand-red">{{ errorMessage }}</p>
                  </Field>
                </div>
                <div class="sm:col-span-2">
                  <label for="fin-bike" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Preferred Motorcycle</label>
                  <Field name="fin_bike" v-slot="{ componentField, errorMessage }">
                    <input v-bind="componentField" id="fin-bike" type="text" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" :class="{ 'border-brand-red/70': errorMessage }" />
                  </Field>
                </div>
                <div>
                  <label for="fin-employment" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Employment Status</label>
                  <Field name="fin_employment" v-slot="{ componentField, errorMessage }">
                    <select v-bind="componentField" id="fin-employment" class="input-field h-12 appearance-none rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25">
                      <option value="" disabled>Select</option><option>Employed</option><option>Self-Employed</option><option>Business Owner</option>
                    </select>
                    <p v-if="errorMessage" class="mt-1.5 text-xs text-brand-red">{{ errorMessage }}</p>
                  </Field>
                </div>
                <div>
                  <label for="fin-income" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Monthly Income (KES)</label>
                  <Field name="fin_income" v-slot="{ componentField, errorMessage }">
                    <input v-bind="componentField" id="fin-income" type="number" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" />
                  </Field>
                </div>
              </div>
              <Button type="submit" :loading="isSubmittingFin" variant="primary" class="h-12 w-full"><BadgeDollarSign class="h-5 w-5" />Submit Application</Button>
            </form>

            <div v-if="finSuccess" class="mt-6 flex items-center gap-4 rounded-xl border border-green-500/30 bg-green-500/10 p-5">
              <CheckCircle class="h-8 w-8 shrink-0 text-green-400" />
              <div>
                <p class="font-display text-xl tracking-display text-green-400">Application Submitted</p>
                <p class="mt-1 text-sm text-green-300">Our finance team will contact you within 48 hours.</p>
              </div>
            </div>
            <div v-if="finError" class="mt-6 rounded-xl border border-brand-red/30 bg-brand-red/10 p-4 text-center"><p class="text-sm text-brand-red">{{ finError }}</p></div>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-6">
          <div class="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-6">
            <h3 class="font-display text-lg tracking-display text-white">Why Finance With Us?</h3>
            <ul class="mt-4 space-y-3 text-sm text-brand-grey">
              <li v-for="b in benefits" :key="b" class="flex gap-3"><Check class="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />{{ b }}</li>
            </ul>
          </div>

          <div class="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-6">
            <h3 class="font-display text-lg tracking-display text-white">Requirements</h3>
            <ul class="mt-4 space-y-3 text-sm text-brand-grey">
              <li v-for="r in requirements" :key="r" class="flex gap-3"><FileCheck class="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />{{ r }}</li>
            </ul>
          </div>

          <div class="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-6">
            <h3 class="font-display text-lg tracking-display text-white">How It Works</h3>
            <ol class="mt-5 space-y-4">
              <li v-for="(s, i) in process" :key="s" class="flex gap-4">
                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-red font-display text-sm font-bold text-white">{{ i + 1 }}</span>
                <span class="text-sm leading-relaxed text-brand-grey">{{ s }}</span>
              </li>
            </ol>
          </div>

          <div class="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-6">
            <h3 class="font-display text-lg tracking-display text-white">Need Help?</h3>
            <p class="mt-2 text-sm text-brand-grey">Our finance specialists are ready to guide you through the process.</p>
            <p class="mt-3 flex items-center gap-2 text-sm"><Phone class="h-4 w-4 text-brand-red" /><a href="tel:+254712345678" class="transition-colors hover:text-brand-red">+254 712 345 678</a></p>
            <p class="mt-1 flex items-center gap-2 text-sm"><Mail class="h-4 w-4 text-brand-red" /><a href="mailto:finance@nairopowerbikes.com" class="transition-colors hover:text-brand-red">finance@nairopowerbikes.com</a></p>
          </div>
        </div>
      </div>

      <!-- FAQ -->
      <div class="mx-auto mt-20 max-w-4xl">
        <SectionHeading eyebrow="Good To Know" title="Finance" accent="FAQ" description="Answers to the questions we hear most often." />
        <div class="space-y-3">
          <div v-for="(faq, i) in faqs" :key="i" class="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent">
            <button
              class="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-display font-bold tracking-display text-white transition-colors hover:text-brand-red"
              :aria-expanded="openFaq === i"
              @click="openFaq = openFaq === i ? -1 : i"
            >
              {{ faq.q }}
              <ChevronDown class="h-5 w-5 shrink-0 transition-transform duration-300 text-brand-red" :class="{ 'rotate-180': openFaq === i }" />
            </button>
            <Transition name="fade">
              <p v-if="openFaq === i" class="border-t border-white/[0.06] px-6 py-5 text-sm leading-relaxed text-brand-grey">{{ faq.a }}</p>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Partners -->
      <div class="mt-20 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-10 text-center">
        <p class="font-display text-xs font-bold tracking-[0.3em] text-brand-red uppercase">Backed By</p>
        <h2 class="mt-2 font-heading text-3xl text-white">A Network of <span class="text-brand-red">Lending Partners</span></h2>
        <p class="mx-auto mt-3 max-w-xl text-sm text-brand-grey">We work with leading banks, SACCOS and mobile-money lenders to secure the best rates for you — no matter your financial profile.</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
          <div v-for="p in partners" :key="p.label" class="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-brand-black/60 px-5 py-3.5">
            <component :is="p.icon" class="h-5 w-5 text-brand-red" />
            <span class="font-display text-sm tracking-display text-white">{{ p.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { BadgeDollarSign, CheckCircle, Check, Phone, Mail, Calculator, FileCheck, ChevronDown, Landmark, PiggyBank, Smartphone, Percent, Zap } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useForm, Field } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

useHead({
  title: 'Financing - Nairobi Powerbikes',
  meta: [{ name: 'description', content: 'Explore flexible motorcycle financing options at Nairobi Powerbikes — from 9.9% APR. Use our loan calculator and apply online.' }],
})

const pb = usePB()
const calcPrice = ref(500000); const calcDown = ref(50000); const calcRate = ref(12.5); const calcTerm = ref(36)
const calcSection = ref<HTMLElement | null>(null)
const openFaq = ref(0)

function scrollToCalc() {
  calcSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const options = [
  { name: 'Standard Hire Purchase', rate: '9.9%', rateUnit: 'APR', featured: false, icon: Landmark, features: ['Deposit from 10%', 'Terms up to 60 months', 'No hidden fees', 'Instant eligibility check'] },
  { name: 'Ride Now', rate: '0%', rateUnit: 'deposit', featured: true, icon: Zap, features: ['Zero deposit options', 'First 3 months deferred', 'Free insurance cover', 'Early settlement allowed'] },
  { name: 'Graduate / First Bike', rate: '12.9%', rateUnit: 'APR', featured: false, icon: GraduationCapIcon, features: ['Tailored for first-time riders', 'Flexible document requirements', 'Training course discounted', 'Dedicated account manager'] },
]

const benefits = [
  'Competitive interest rates from 9.9% APR',
  'Flexible repayment terms up to 60 months',
  'Quick approval within 48 hours',
  'Low down payment options from 10%',
  'No hidden fees or early repayment penalties',
]

const requirements = [
  'National ID or passport',
  'Proof of income (payslip or bank statement, 3 months)',
  'Certificate of good conduct',
  'KRA PIN',
]

const process = [
  'Choose your motorcycle and calculate your estimate.',
  'Submit your application — online or in-store.',
  'Our team verifies your documents and runs a credit check.',
  'Get approval within 48 hours and sign your agreement.',
  'Ride away — with insurance and registration handled for you.',
]

const faqs = [
  { q: 'How quickly can I get approved?', a: 'Most applications are approved within 48 hours. In-store applications can sometimes be approved the same day once all documents are submitted and verified.' },
  { q: 'What is the minimum down payment?', a: 'You can start with as little as 10% of the purchase price. Zero-deposit options are available on select models through our Ride Now programme.' },
  { q: 'Can I settle the loan early?', a: 'Yes — there are no early repayment penalties. Settle your balance at any time and we will release the log book immediately upon final payment.' },
  { q: 'What happens if I miss a payment?', a: 'We understand things come up. Contact our finance team as soon as possible to arrange a revised plan — we will always try to find a flexible solution before any further steps.' },
]

const partners = [
  { label: 'Partner Banks', icon: Landmark },
  { label: 'SACCOS', icon: PiggyBank },
  { label: 'Mobile Lenders', icon: Smartphone },
  { label: 'Asset Finance', icon: Percent },
]

const finValidationSchema = toTypedSchema(z.object({
  fin_name: z.string().min(2, 'Name required'),
  fin_phone: z.string().min(10, 'Valid phone required'),
  fin_email: z.string().email('Valid email required'),
  fin_bike: z.string().optional(),
  fin_employment: z.string().min(1, 'Select employment status'),
  fin_income: z.string().optional(),
}))
const { handleSubmit: handleFinSubmit, isSubmitting: isSubmittingFin, resetForm: resetFinForm } = useForm({ validationSchema: finValidationSchema, initialValues: { fin_name: '', fin_phone: '', fin_email: '', fin_bike: '', fin_employment: '', fin_income: '' } })
const finSuccess = ref(false); const finError = ref('')

const loanAmount = computed(() => Math.max(0, calcPrice.value - calcDown.value))
const monthlyRate = computed(() => calcRate.value / 100 / 12)
const monthlyPayment = computed(() => {
  if (loanAmount.value <= 0 || calcTerm.value <= 0) return 0
  const r = monthlyRate.value; const n = calcTerm.value
  if (r === 0) return Math.round(loanAmount.value / n)
  return Math.round(loanAmount.value * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1))
})
const totalAmount = computed(() => monthlyPayment.value * calcTerm.value)
const totalInterest = computed(() => totalAmount.value - loanAmount.value)

const submitFinance = handleFinSubmit(async (values) => {
  finSuccess.value = false; finError.value = ''
  try {
    await pb.collection('contacts').create({
      name: values.fin_name,
      email: values.fin_email,
      phone: values.fin_phone,
      subject: 'Finance: ' + (values.fin_bike || ''),
      message: 'Loan Amount: KES ' + loanAmount.value + '\nEmployment: ' + values.fin_employment + '\nMonthly Income: ' + (values.fin_income || 'N/A') + '\nInterest Rate: ' + calcRate.value + '%\nTerm: ' + calcTerm.value + ' months',
      category: 'finance',
      status: 'new',
    })
    finSuccess.value = true; resetFinForm()
  } catch (err: any) { finError.value = err?.data?.message || err?.message || 'Submission failed.' }
})
</script>

<script lang="ts">
import { GraduationCap as GraduationCapIcon } from 'lucide-vue-next'
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-6px); }
</style>