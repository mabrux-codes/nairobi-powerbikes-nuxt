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
            <template v-if="!isLoggedIn">
              <div class="grid gap-5 sm:grid-cols-2">
                <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Full Name</label>
                  <Field name="name" v-slot="{ field, errorMessage }"><input v-bind="field" type="text" placeholder="John Doe" class="input-field h-11" :class="{ 'border-brand-red': errorMessage }" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
                <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Phone</label>
                  <Field name="phone" v-slot="{ field, errorMessage }"><input v-bind="field" type="tel" placeholder="+254 7XX XXX XXX" class="input-field h-11" :class="{ 'border-brand-red': errorMessage }" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
              </div>
              <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Email</label>
                <Field name="email" v-slot="{ field, errorMessage }"><input v-bind="field" type="email" placeholder="john@example.com" class="input-field h-11" :class="{ 'border-brand-red': errorMessage }" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
            </template>

            <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Motorcycle</label>
              <Field name="motorcycle" v-slot="{ field, errorMessage }"><select v-bind="field" class="input-field h-11 appearance-none" :class="{ 'border-brand-red': errorMessage }"><option value="" disabled>Select motorcycle</option><option v-for="b in motorcycles" :key="b.id" :value="b.name">{{ b.name }} ({{ b.year || 'N/A' }})</option></select><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>

            <div class="grid gap-5 sm:grid-cols-2">
              <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Preferred Date</label>
                <Field name="date" v-slot="{ field, errorMessage }"><input v-bind="field" type="date" class="input-field h-11" :class="{ 'border-brand-red': errorMessage }" :min="minDate" @change="onDateChange" /><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p></Field></div>
              <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Preferred Time</label>
                <Field name="time" v-slot="{ field, errorMessage }"><select v-bind="field" class="input-field h-11 appearance-none" :class="{ 'border-brand-red': errorMessage }"><option value="" disabled>Select time</option><option v-for="slot in availableTimeSlots" :key="slot" :value="slot" :disabled="bookedTimes.has(slot)">{{ slot }}</option></select><p v-if="errorMessage" class="mt-1 text-xs text-brand-red">{{ errorMessage }}</p><p v-if="selectedDate && availableTimeSlots.length > 0 && availableTimeSlots.every(s => bookedTimes.has(s))" class="mt-1 text-xs text-amber-400">Fully booked for this date</p></Field></div>
            </div>

            <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Branch</label>
              <Field name="branch" v-slot="{ field }"><select v-bind="field" class="input-field h-11 appearance-none"><option value="mombasa-road">Mombasa Road Branch</option></select></Field></div>

            <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Additional Notes</label>
              <Field name="notes" v-slot="{ field }"><textarea v-bind="field" rows="3" class="input-field min-h-[100px]" placeholder="Any preferences..."></textarea></Field></div>

            <div class="grid gap-5 sm:grid-cols-2">
              <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">ID Document <span class="text-brand-red">*</span></label>
                <div @drop.prevent="onDropId" @dragover.prevent @dragenter.prevent class="relative flex cursor-pointer items-center justify-center rounded-sm border-2 border-dashed border-brand-grey/40 p-4 transition-colors hover:border-brand-red/60" @click="idInput?.click()">
                  <input ref="idInput" type="file" accept="image/jpeg,image/png,application/pdf" class="hidden" @change="onIdChange" />
                  <div v-if="!idDocument" class="flex flex-col items-center gap-2 text-brand-grey">
                    <Upload class="h-6 w-6" />
                    <span class="text-xs">Drop or click to upload</span>
                  </div>
                  <div v-else class="flex w-full items-center gap-3">
                    <FileText class="h-5 w-5 shrink-0 text-brand-red" />
                    <span class="truncate text-sm text-white">{{ idDocument.name }}</span>
                    <button type="button" class="ml-auto shrink-0 text-brand-grey hover:text-brand-red" @click.stop="removeId"><X class="h-4 w-4" /></button>
                  </div>
                </div>
                <p v-if="idDocumentError" class="mt-1 text-xs text-brand-red">{{ idDocumentError }}</p>
              </div>
              <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Driver's License <span class="text-brand-red">*</span></label>
                <div @drop.prevent="onDropLicense" @dragover.prevent @dragenter.prevent class="relative flex cursor-pointer items-center justify-center rounded-sm border-2 border-dashed border-brand-grey/40 p-4 transition-colors hover:border-brand-red/60" @click="licenseInput?.click()">
                  <input ref="licenseInput" type="file" accept="image/jpeg,image/png,application/pdf" class="hidden" @change="onLicenseChange" />
                  <div v-if="!driversLicense" class="flex flex-col items-center gap-2 text-brand-grey">
                    <Upload class="h-6 w-6" />
                    <span class="text-xs">Drop or click to upload</span>
                  </div>
                  <div v-else class="flex w-full items-center gap-3">
                    <FileText class="h-5 w-5 shrink-0 text-brand-red" />
                    <span class="truncate text-sm text-white">{{ driversLicense.name }}</span>
                    <button type="button" class="ml-auto shrink-0 text-brand-grey hover:text-brand-red" @click.stop="removeLicense"><X class="h-4 w-4" /></button>
                  </div>
                </div>
                <p v-if="driversLicenseError" class="mt-1 text-xs text-brand-red">{{ driversLicenseError }}</p>
              </div>
            </div>

            <Button type="submit" :loading="isSubmitting" :disabled="availableTimeSlots.every(s => bookedTimes.has(s))" variant="primary" class="mt-2 w-full"><CalendarCheck class="h-5 w-5" />Book Test Ride</Button>
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
          <Button @click="closeSuccess" variant="primary" class="mt-6 w-full">Got it</Button>
      </motion.div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { CalendarCheck, LoaderCircle, Upload, FileText, X } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useForm, Field } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

interface Motorcycle { id: string; name: string; year?: number }

useHead({ title: 'Test Ride Booking - Nairobi Powerbikes', meta: [{ name: 'description', content: 'Book a test ride at Nairobi Powerbikes. Experience your next motorcycle firsthand.' }] })

const pb = usePB()
const route = useRoute()
const showSuccess = ref(false)
const submitError = ref('')
const submittedEmail = ref('')
const motorcycles = ref<Motorcycle[]>([])
const bookedTimes = ref<Set<string>>(new Set())
const selectedDate = ref('')
const allTimeSlots = Array.from({ length: 36 }, (_, i) => {
  const h = String(8 + Math.floor(i / 4)).padStart(2, '0')
  const m = String((i % 4) * 15).padStart(2, '0')
  return `${h}:${m}`
})

const idInput = ref<HTMLInputElement | null>(null)
const licenseInput = ref<HTMLInputElement | null>(null)
const idDocument = ref<File | null>(null)
const driversLicense = ref<File | null>(null)
const idDocumentError = ref('')
const driversLicenseError = ref('')

const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf']
const maxFileSize = 5 * 1024 * 1024

function validateFile(file: File | null): string {
  if (!file) return 'This field is required'
  if (!allowedMimes.includes(file.type)) return 'Only JPG, PNG or PDF allowed'
  if (file.size > maxFileSize) return 'File must be under 5MB'
  return ''
}

function setFile(ref: Ref<File | null>, errorRef: Ref<string>, file: File | null) {
  const err = validateFile(file)
  ref.value = file && !err ? file : null
  errorRef.value = err
}

function onDropId(e: DragEvent) { setFile(idDocument, idDocumentError, e.dataTransfer?.files[0] || null) }
function onDropLicense(e: DragEvent) { setFile(driversLicense, driversLicenseError, e.dataTransfer?.files[0] || null) }
function onIdChange(e: Event) { setFile(idDocument, idDocumentError, (e.target as HTMLInputElement).files?.[0] || null) }
function onLicenseChange(e: Event) { setFile(driversLicense, driversLicenseError, (e.target as HTMLInputElement).files?.[0] || null) }
function removeId() { idDocument.value = null; idDocumentError.value = ''; if (idInput.value) idInput.value.value = '' }
function removeLicense() { driversLicense.value = null; driversLicenseError.value = ''; if (licenseInput.value) licenseInput.value.value = '' }

const minDate = computed(() => new Date().toISOString().split('T')[0])

const availableTimeSlots = computed(() => {
  const now = new Date()
  return allTimeSlots.filter(slot => {
    const [h, m] = slot.split(':').map(Number)
    const totalMin = h * 60 + m
    const nowMin = now.getHours() * 60 + now.getMinutes()
    if (selectedDate.value === now.toISOString().split('T')[0] && totalMin <= nowMin) return false
    return true
  })
})

const model = pb.authStore.model as Record<string, any> | null
const isLoggedIn = !!model

const validationSchema = toTypedSchema(z.object({
  name: isLoggedIn ? z.string().optional() : z.string().min(2, 'Name required'),
  phone: isLoggedIn ? z.string().optional() : z.string().min(8, 'Valid phone required'),
  email: isLoggedIn ? z.string().optional() : z.string().email('Valid email required'),
  motorcycle: z.string().min(1, 'Select motorcycle'),
  date: z.string().min(1, 'Select date'),
  time: z.string().min(1, 'Select time'),
  branch: z.string().min(1),
  notes: z.string().optional(),
}))

const { handleSubmit, isSubmitting, resetForm, setFieldValue, setFieldError } = useForm({
  validationSchema,
  initialValues: {
    name: model?.name || '',
    phone: model?.phone || '',
    email: model?.email || '',
    motorcycle: '',
    date: '',
    time: '',
    branch: 'mombasa-road',
    notes: '',
  },
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
  const idErr = validateFile(idDocument.value)
  const licenseErr = validateFile(driversLicense.value)
  idDocumentError.value = idErr
  driversLicenseError.value = licenseErr
  if (idErr || licenseErr) return
  try {
    const res = await pb.collection('service_bookings').getList(1, 1, {
      filter: `preferred_date = "${values.date}" && preferred_time = "${values.time}" && type = "test_ride"`,
    })
    if (res.totalItems > 0) {
      setFieldError('time', 'This time slot is already booked')
      submitError.value = 'This time slot has already been taken. Please choose another.'
      return
    }
    const userId = pb.authStore.model?.id || null
    const fd = new FormData()
    fd.append('type', 'test_ride')
    fd.append('name', values.name || model?.name || '')
    fd.append('phone', values.phone || model?.phone || '')
    fd.append('email', values.email || model?.email || '')
    fd.append('motorcycle', values.motorcycle)
    fd.append('branch', 'Mombasa Road Branch')
    fd.append('preferred_date', values.date)
    fd.append('preferred_time', values.time)
    fd.append('notes', values.notes || '')
    fd.append('status', 'pending')
    if (userId) fd.append('user', userId)
    fd.append('id_document', idDocument.value!)
    fd.append('drivers_license', driversLicense.value!)
    await pb.collection('service_bookings').create(fd)
    submittedEmail.value = values.email
    showSuccess.value = true
    selectedDate.value = ''
    bookedTimes.value = new Set()
    resetForm()
    idDocument.value = null
    driversLicense.value = null
    idDocumentError.value = ''
    driversLicenseError.value = ''
  } catch (err: any) {
    submitError.value = err?.data?.message || err?.message || 'Booking failed. Please try again.'
  }
})

async function loadMotorcycles() {
  try {
    motorcycles.value = await pb.collection('motorcycles').getFullList<Motorcycle>({ sort: 'name' })
  } catch { motorcycles.value = [] }
}

onMounted(async () => {
  await loadMotorcycles()
  const bikeId = route.query.motorcycle as string | undefined
  if (bikeId) {
    const match = motorcycles.value.find(m => m.id === bikeId)
    if (match) {
      setFieldValue('motorcycle', match.name)
    }
  }
  pb.collection('motorcycles').subscribe('*', () => loadMotorcycles())
})

onUnmounted(() => { pb.collection('motorcycles').unsubscribe('*') })
</script>
