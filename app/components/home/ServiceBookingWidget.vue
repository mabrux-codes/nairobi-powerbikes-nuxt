<template>
  <div class="rounded-sm border border-brand-grey/20 bg-brand-black p-6 sm:p-8">
    <form @submit.prevent="submit" class="space-y-5">
      <div class="grid gap-5 sm:grid-cols-2">
        <div><label class="mb-1.5 block text-xs font-display tracking-[var(--tracking-display)] text-brand-grey uppercase">Full Name</label>
          <Field name="name" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="text" placeholder="John Doe" class="input-field h-11" :class="{ 'border-brand-red': errorMessage }" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
        <div><label class="mb-1.5 block text-xs font-display tracking-[var(--tracking-display)] text-brand-grey uppercase">Phone</label>
          <Field name="phone" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="tel" placeholder="+254 7XX XXX XXX" class="input-field h-11" :class="{ 'border-brand-red': errorMessage }" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
      </div>
      <div><label class="mb-1.5 block text-xs font-display tracking-[var(--tracking-display)] text-brand-grey uppercase">Email</label>
        <Field name="email" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="email" placeholder="john@example.com" class="input-field h-11" :class="{ 'border-brand-red': errorMessage }" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
      <div><label class="mb-1.5 block text-xs font-display tracking-[var(--tracking-display)] text-brand-grey uppercase">Bike Model</label>
          <Field name="bikeModel" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="text" placeholder="e.g. Kawasaki Ninja 650" class="input-field h-11" :class="{ 'border-brand-red': errorMessage }" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
      <div><label class="mb-1.5 block text-xs font-display tracking-[var(--tracking-display)] text-brand-grey uppercase">Service Type</label>
          <Field name="serviceType" v-slot="{ componentField, errorMessage }"><select v-bind="componentField" class="input-field h-11 appearance-none" :class="{ 'border-brand-red': errorMessage }"><option value="" disabled>Select service</option><option v-for="s in serviceTypes" :key="s.value" :value="s.value">{{ s.label }}</option></select><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
      <div class="grid gap-5 sm:grid-cols-2">
        <div><label class="mb-1.5 block text-xs font-display tracking-[var(--tracking-display)] text-brand-grey uppercase">Preferred Date</label>
          <Field name="date" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="date" class="input-field h-11" :class="{ 'border-brand-red': errorMessage }" :min="minDate" @change="onDateChange" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
        <div><label class="mb-1.5 block text-xs font-display tracking-[var(--tracking-display)] text-brand-grey uppercase">Preferred Time</label>
          <Field name="time" v-slot="{ componentField, errorMessage }"><select v-bind="componentField" class="input-field h-11 appearance-none" :class="{ 'border-brand-red': errorMessage }"><option value="" disabled>Select time</option><option v-for="slot in availableTimeSlots" :key="slot" :value="slot" :disabled="bookedTimes.has(slot)">{{ slot }}</option></select><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p><p v-if="selectedDate && availableTimeSlots.length > 0 && availableTimeSlots.every(s => bookedTimes.has(s))" class="mt-1 text-xs text-amber-400">Fully booked for this date</p></Field></div>
      </div>
      <div><label class="mb-1.5 block text-xs font-display tracking-[var(--tracking-display)] text-brand-grey uppercase">Branch</label>
        <Field name="branch" v-slot="{ componentField }"><select v-bind="componentField" class="input-field h-11 appearance-none"><option value="mombasa-road">Mombasa Road Branch</option></select></Field></div>
      <Button type="submit" :loading="isSubmitting" :disabled="selectedDate && availableTimeSlots.length > 0 && availableTimeSlots.every(s => bookedTimes.has(s))" variant="primary" class="mt-2 w-full"><CalendarCheck class="h-5 w-5" />Book Appointment</Button>
    </form>

    <div v-if="submitError" class="mt-6 rounded-sm border border-brand-red/30 bg-brand-red/10 p-4 text-center">
      <p class="text-sm text-brand-red">{{ submitError }}</p>
    </div>
  </div>

  <Teleport to="body">
    <div v-if="showSuccess" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" @click.self="closeSuccess">
      <motion.div :initial="{ opacity: 0, scale: 0.9 }" :animate="{ opacity: 1, scale: 1 }" class="relative w-full max-w-md rounded-sm border border-green-500/30 bg-brand-black p-8 text-center shadow-2xl">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <CalendarCheck class="h-8 w-8 text-green-400" />
        </div>
        <h2 class="font-heading text-2xl text-white">Booking Submitted!</h2>
        <p class="mt-3 text-sm leading-relaxed text-brand-grey">
          Your service booking has been received. We will send a confirmation with your appointment details to
          <span class="font-medium text-white">{{ submittedEmail }}</span>.
        </p>
        <Button @click="closeSuccess" variant="primary" class="mt-6 w-full">Got it</Button>
      </motion.div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { CalendarCheck, LoaderCircle } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useForm, Field } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const pb = usePB()
const showSuccess = ref(false)
const submitError = ref('')
const submittedEmail = ref('')
const bookedTimes = ref<Set<string>>(new Set())
const selectedDate = ref('')

function closeSuccess() {
  showSuccess.value = false
  submittedEmail.value = ''
}
const allTimeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

const minDate = computed(() => new Date().toISOString().split('T')[0])

const availableTimeSlots = computed(() => {
  const now = new Date()
  return allTimeSlots.filter(slot => {
    const [h] = slot.split(':').map(Number)
    if (selectedDate.value === now.toISOString().split('T')[0] && h <= now.getHours()) return false
    return true
  })
})

const serviceTypes = [{ value: 'routine', label: 'Routine Service' }, { value: 'major', label: 'Major Service' }, { value: 'repair', label: 'Repair' }, { value: 'inspection', label: 'Pre-Purchase Inspection' }, { value: 'customization', label: 'Customization' }]

const validationSchema = toTypedSchema(z.object({ name: z.string().min(2, 'Name required'), phone: z.string().min(8, 'Valid phone required'), email: z.string().email('Valid email required'), bikeModel: z.string().min(2, 'Bike model required'), serviceType: z.string().min(1, 'Select service type'), date: z.string().min(1, 'Select date'), time: z.string().min(1, 'Select time'), branch: z.string().min(1) }))
const { handleSubmit, isSubmitting, resetForm, setFieldError } = useForm({ validationSchema, initialValues: { name: '', phone: '', email: '', bikeModel: '', serviceType: '', date: '', time: '', branch: 'mombasa-road' } })

async function onDateChange(e: Event) {
  const date = (e.target as HTMLInputElement).value
  selectedDate.value = date
  if (!date) { bookedTimes.value = new Set(); return }
  try {
    const res = await pb.collection('service_bookings').getList(1, 50, {
      filter: `preferred_date = "${date}"`,
      fields: 'preferred_time',
    })
    bookedTimes.value = new Set(res.items.map((b: any) => b.preferred_time))
  } catch {
    bookedTimes.value = new Set()
  }
}

const submit = handleSubmit(async (values) => {
  showSuccess.value = false; submitError.value = ''
  try {
    const res = await pb.collection('service_bookings').getList(1, 1, {
      filter: `preferred_date = "${values.date}" && preferred_time = "${values.time}" && type = "service"`,
    })
    if (res.totalItems > 0) {
      setFieldError('time', 'This time slot is already booked')
      submitError.value = 'This time slot has already been taken. Please choose another.'
      return
    }
    await pb.collection('service_bookings').create({
      type: 'service',
      name: values.name, phone: values.phone, email: values.email,
      motorcycle: values.bikeModel, service_type: values.serviceType,
      branch: 'Mombasa Road Branch',
      preferred_date: values.date, preferred_time: values.time,
      status: 'pending',
    })
    submittedEmail.value = values.email
    showSuccess.value = true; selectedDate.value = ''; bookedTimes.value = new Set(); resetForm()
  } catch (err: any) { submitError.value = err?.data?.message || err?.message || 'Booking failed. Please try again.' }
})
</script>
