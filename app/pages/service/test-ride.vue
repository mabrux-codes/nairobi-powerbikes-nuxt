<template>
  <div class="min-h-screen bg-brand-black pt-24">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div :initial="{ opacity: 0, y: 40 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6 }">
        <h1 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl">Book a <span class="text-brand-red">Test Ride</span></h1>
        <div class="mt-2 h-1 w-24 bg-brand-red" />
        <p class="mt-4 text-brand-grey">Experience your next motorcycle firsthand. Schedule a test ride at our Mombasa Road branch.</p>
      </motion.div>

      <motion.div class="mt-10 max-w-2xl" :initial="{ opacity: 0, x: -30 }" :animate="{ opacity: 1, x: 0 }" :transition="{ delay: 0.2, duration: 0.5 }">
        <div class="rounded-sm border border-brand-grey/20 bg-brand-black p-6 sm:p-8">
          <form @submit.prevent="submit" class="space-y-5">
            <div class="grid gap-5 sm:grid-cols-2">
              <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Full Name</label>
                <Field name="name" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="text" placeholder="John Doe" class="input-field h-11" :class="{ 'border-brand-red': errorMessage }" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
              <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Phone</label>
                <Field name="phone" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="tel" placeholder="+254 7XX XXX XXX" class="input-field h-11" :class="{ 'border-brand-red': errorMessage }" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
            </div>
            <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Email</label>
              <Field name="email" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="email" placeholder="john@example.com" class="input-field h-11" :class="{ 'border-brand-red': errorMessage }" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
            <div class="grid gap-5 sm:grid-cols-2">
              <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Motorcycle</label>
                <Field name="motorcycle" v-slot="{ componentField, errorMessage }"><select v-bind="componentField" class="input-field h-11 appearance-none" :class="{ 'border-brand-red': errorMessage }"><option value="" disabled>Select motorcycle</option><option v-for="b in motorcycles" :key="b.id" :value="`${b.name} (${b.year || ''})`">{{ b.name }}</option></select><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
              <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Year</label>
                <Field name="year" v-slot="{ componentField }"><input v-bind="componentField" type="number" placeholder="2024" class="input-field h-11" /></Field></div>
            </div>
            <div class="grid gap-5 sm:grid-cols-2">
              <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Preferred Date</label>
                <Field name="date" v-slot="{ componentField, errorMessage }"><input v-bind="componentField" type="date" class="input-field h-11" :class="{ 'border-brand-red': errorMessage }" :min="minDate" @change="onDateChange" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
              <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Preferred Time</label>
                <Field name="time" v-slot="{ componentField, errorMessage }"><select v-bind="componentField" class="input-field h-11 appearance-none" :class="{ 'border-brand-red': errorMessage }"><option value="" disabled>Select time</option><option v-for="slot in availableTimeSlots" :key="slot" :value="slot" :disabled="bookedTimes.has(slot)">{{ slot }}</option></select><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p><p v-if="selectedDate && availableTimeSlots.length > 0 && availableTimeSlots.every(s => bookedTimes.has(s))" class="mt-1 text-xs text-amber-400">Fully booked for this date</p></Field></div>
            </div>
            <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Branch</label>
              <Field name="branch" v-slot="{ componentField }"><select v-bind="componentField" class="input-field h-11 appearance-none"><option value="mombasa-road">Mombasa Road Branch</option></select></Field></div>
            <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Additional Notes</label>
              <Field name="notes" v-slot="{ componentField }"><textarea v-bind="componentField" rows="3" class="input-field min-h-[100px]" placeholder="Any preferences..."></textarea></Field></div>
            <button type="submit" :disabled="isSubmitting || availableTimeSlots.every(s => bookedTimes.has(s))" class="btn-primary mt-2 w-full justify-center h-12 disabled:opacity-50">
              <LoaderCircle v-if="isSubmitting" class="h-5 w-5 animate-spin" /><CalendarCheck v-else class="h-5 w-5" />{{ isSubmitting ? 'Booking...' : 'Book Test Ride' }}</button>
          </form>

          <div v-if="submitError" class="mt-6 rounded-sm border border-brand-red/30 bg-brand-red/10 p-4 text-center">
            <p class="text-sm text-brand-red">{{ submitError }}</p>
          </div>
        </div>
      </motion.div>
    </div>

    <Teleport to="body">
      <div v-if="showSuccess" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" @click.self="closeSuccess">
        <motion.div :initial="{ opacity: 0, scale: 0.9 }" :animate="{ opacity: 1, scale: 1 }" class="relative w-full max-w-md rounded-sm border border-green-500/30 bg-brand-black p-8 text-center shadow-2xl">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
            <CalendarCheck class="h-8 w-8 text-green-400" />
          </div>
          <h2 class="font-heading text-2xl text-white">Booking Submitted!</h2>
          <p class="mt-3 text-sm leading-relaxed text-brand-grey">
            Your test ride request has been received. We will send a confirmation with your appointment details to
            <span class="font-medium text-white">{{ submittedEmail }}</span>.
          </p>
          <button @click="closeSuccess" class="btn-primary mt-6 w-full justify-center">Got it</button>
        </motion.div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { CalendarCheck, LoaderCircle } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useForm, Field } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

interface Motorcycle { id: string; name: string; year?: number }

useHead({ title: 'Test Ride Booking - Nairobi Powerbikes', meta: [{ name: 'description', content: 'Book a test ride at Nairobi Powerbikes. Experience your next motorcycle firsthand.' }] })

const pb = usePB()
const showSuccess = ref(false)
const submitError = ref('')
const submittedEmail = ref('')
const motorcycles = ref<Motorcycle[]>([])
const bookedTimes = ref<Set<string>>(new Set())
const selectedDate = ref('')
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

const validationSchema = toTypedSchema(z.object({
  name: z.string().min(2, 'Name required'),
  phone: z.string().min(8, 'Valid phone required'),
  email: z.string().email('Valid email required'),
  motorcycle: z.string().min(1, 'Select motorcycle'),
  year: z.string().optional(),
  date: z.string().min(1, 'Select date'),
  time: z.string().min(1, 'Select time'),
  branch: z.string().min(1),
  notes: z.string().optional(),
}))

const { handleSubmit, isSubmitting, resetForm, setFieldError } = useForm({
  validationSchema,
  initialValues: { name: '', phone: '', email: '', motorcycle: '', year: '', date: '', time: '', branch: 'mombasa-road', notes: '' },
})

async function onDateChange(e: Event) {
  const date = (e.target as HTMLInputElement).value
  selectedDate.value = date
  if (!date) { bookedTimes.value = new Set(); return }
  try {
    const res = await pb.collection('service_bookings').getList(1, 50, {
      filter: `preferred_date = "${date}" && type = "test_ride"`,
      fields: 'preferred_time',
    })
    bookedTimes.value = new Set(res.items.map((b: any) => b.preferred_time))
  } catch {
    bookedTimes.value = new Set()
  }
}

function closeSuccess() {
  showSuccess.value = false
  submittedEmail.value = ''
}

const submit = handleSubmit(async (values) => {
  showSuccess.value = false
  submitError.value = ''
  try {
    const res = await pb.collection('service_bookings').getList(1, 1, {
      filter: `preferred_date = "${values.date}" && preferred_time = "${values.time}" && type = "test_ride"`,
    })
    if (res.totalItems > 0) {
      setFieldError('time', 'This time slot is already booked')
      submitError.value = 'This time slot has already been taken. Please choose another.'
      return
    }
    const bikeModel = values.motorcycle + (values.year ? ' (' + values.year + ')' : '')
    await pb.collection('service_bookings').create({
      type: 'test_ride',
      name: values.name,
      phone: values.phone,
      email: values.email,
      motorcycle: bikeModel,
      branch: 'Mombasa Road Branch',
      preferred_date: values.date,
      preferred_time: values.time,
      notes: values.notes || '',
      status: 'pending',
    })
    submittedEmail.value = values.email
    showSuccess.value = true
    selectedDate.value = ''
    bookedTimes.value = new Set()
    resetForm()
  } catch (err: any) {
    submitError.value = err?.data?.message || err?.message || 'Booking failed. Please try again.'
  }
})

async function loadMotorcycles() {
  try {
    motorcycles.value = await pb.collection('motorcycles').getFullList<Motorcycle>({ filter: 'status="available"', sort: 'name' })
  } catch { motorcycles.value = [] }
}

onMounted(async () => {
  await loadMotorcycles()
  pb.collection('motorcycles').subscribe('*', () => loadMotorcycles())
})

onUnmounted(() => { pb.collection('motorcycles').unsubscribe('*') })
</script>
