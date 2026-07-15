<template>
  <div class="min-h-screen bg-brand-black pt-24">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div :initial="{ opacity: 0, y: 40 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6 }">
        <h1 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl">Motorcycle <span class="text-brand-red">Financing</span></h1>
        <div class="mt-2 h-1 w-24 bg-brand-red" />
        <p class="mt-4 text-brand-grey">Flexible financing options to get you on the road. Use our loan calculator or apply directly.</p>
      </motion.div>

      <div class="mt-10 grid gap-12 lg:grid-cols-5">
        <motion.div class="lg:col-span-3" :initial="{ opacity: 0, x: -30 }" :animate="{ opacity: 1, x: 0 }" :transition="{ delay: 0.2, duration: 0.5 }">
          <div class="rounded-sm border border-brand-grey/20 bg-brand-black p-6 sm:p-8">
            <h2 class="font-display text-display-sm leading-[var(--leading-display)] text-white">Loan Calculator</h2>
            <div class="mt-6 space-y-5">
              <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Vehicle Price (KES)</label><input v-model.number="calcPrice" type="number" class="input-field" min="0" /></div>
              <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Down Payment (KES)</label><input v-model.number="calcDown" type="number" class="input-field" min="0" /></div>
              <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Interest Rate (%)</label><input v-model.number="calcRate" type="number" class="input-field" min="0" step="0.1" /></div>
              <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Term (Months)</label><select v-model.number="calcTerm" class="input-field appearance-none"><option :value="12">12 Months</option><option :value="24">24 Months</option><option :value="36">36 Months</option><option :value="48">48 Months</option><option :value="60">60 Months</option></select></div>
            </div>
            <div class="mt-6 grid grid-cols-2 gap-4 rounded-sm border border-brand-grey/10 bg-brand-black/60 p-5">
              <div><p class="text-xs font-display tracking-display text-brand-grey uppercase">Monthly Payment</p><p class="font-display text-2xl text-white">KES {{ monthlyPayment.toLocaleString() }}</p></div>
              <div><p class="text-xs font-display tracking-display text-brand-grey uppercase">Total Interest</p><p class="font-display text-2xl text-white">KES {{ totalInterest.toLocaleString() }}</p></div>
              <div class="col-span-2"><p class="text-xs font-display tracking-display text-brand-grey uppercase">Total Amount</p><p class="font-display text-2xl text-white">KES {{ totalAmount.toLocaleString() }}</p></div>
            </div>
          </div>

          <div class="mt-8 rounded-sm border border-brand-grey/20 bg-brand-black p-6 sm:p-8">
            <h2 class="font-display text-display-sm leading-[var(--leading-display)] text-white">Apply for Financing</h2>
            <form @submit.prevent="submitFinance" class="mt-6 space-y-5">
              <div class="grid gap-5 sm:grid-cols-2">
                <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Full Name</label><Field name="fin_name" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="text" class="input-field" :class="{ 'border-brand-red': errorMessage }" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
                <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Phone</label><Field name="fin_phone" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="tel" class="input-field" :class="{ 'border-brand-red': errorMessage }" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
              </div>
              <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Email</label><Field name="fin_email" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="email" class="input-field" :class="{ 'border-brand-red': errorMessage }" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
              <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Preferred Motorcycle</label><Field name="fin_bike" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="text" class="input-field" :class="{ 'border-brand-red': errorMessage }" /></Field></div>
              <div class="grid gap-5 sm:grid-cols-2">
                <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Employment Status</label><Field name="fin_employment" v-slot="{ componentField, errorMessage }"><select v-bind="componentField" class="input-field appearance-none"><option value="" disabled>Select</option><option>Employed</option><option>Self-Employed</option><option>Business Owner</option></select></Field></div>
                <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Monthly Income (KES)</label><Field name="fin_income" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="number" class="input-field" /></Field></div>
              </div>
              <button type="submit" :disabled="isSubmittingFin" class="btn-primary w-full justify-center disabled:opacity-50"><LoaderCircle v-if="isSubmittingFin" class="h-5 w-5 animate-spin" /><BadgeDollarSign v-else class="h-5 w-5" />{{ isSubmittingFin ? 'Submitting...' : 'Submit Application' }}</button>
            </form>
            <div v-if="finSuccess" class="mt-6 rounded-sm border border-green-500/30 bg-green-500/10 p-5 text-center">
              <CheckCircle class="mx-auto mb-3 h-8 w-8 text-green-400" /><p class="font-display text-xl tracking-display text-green-400">Application Submitted</p><p class="mt-1 text-sm text-green-300">Our finance team will contact you within 48 hours.</p>
            </div>
            <div v-if="finError" class="mt-6 rounded-sm border border-brand-red/30 bg-brand-red/10 p-4 text-center"><p class="text-sm text-brand-red">{{ finError }}</p></div>
          </div>
        </motion.div>

        <motion.div class="lg:col-span-2 space-y-6" :initial="{ opacity: 0, x: 30 }" :animate="{ opacity: 1, x: 0 }" :transition="{ delay: 0.3, duration: 0.5 }">
          <div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6">
            <h3 class="font-display text-lg text-white">Why Finance With Us?</h3>
            <ul class="mt-4 space-y-3 text-sm text-brand-grey">
              <li class="flex gap-3"><Check class="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />Competitive interest rates from 9.9% APR</li>
              <li class="flex gap-3"><Check class="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />Flexible repayment terms up to 60 months</li>
              <li class="flex gap-3"><Check class="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />Quick approval within 48 hours</li>
              <li class="flex gap-3"><Check class="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />Low down payment options from 10%</li>
              <li class="flex gap-3"><Check class="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />No hidden fees or early repayment penalties</li>
            </ul>
          </div>
          <div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6">
            <h3 class="font-display text-lg text-white">Need Help?</h3>
            <p class="mt-2 text-sm text-brand-grey">Our finance specialists are ready to assist you with the application process.</p>
            <p class="mt-3 flex items-center gap-2 text-sm"><Phone class="h-4 w-4 text-brand-red" /><a href="tel:+254712345678" class="hover:text-brand-red">+254 712 345 678</a></p>
            <p class="mt-1 flex items-center gap-2 text-sm"><Mail class="h-4 w-4 text-brand-red" /><a href="mailto:finance@nairobipowerbikes.com" class="hover:text-brand-red">finance@nairobipowerbikes.com</a></p>
          </div>
        </motion.div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { motion } from 'motion-v'
import { BadgeDollarSign, LoaderCircle, CheckCircle, Check, Phone, Mail } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useForm, Field } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

useHead({ title: 'Financing - Nairobi Powerbikes', meta: [{ name: 'description', content: 'Explore flexible motorcycle financing options. Use our loan calculator and apply online.' }] })

const pb = usePB()
const calcPrice = ref(500000); const calcDown = ref(50000); const calcRate = ref(12.5); const calcTerm = ref(36)

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
