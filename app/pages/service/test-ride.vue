<template>
  <div class="min-h-screen bg-brand-black pb-24">
    <PageHeader
      eyebrow="Experience It First Hand"
      title="Book a"
      accent="Test Ride"
      description="Feel the machine before you commit. Pick a model, pick a slot — we'll have it warmed up and waiting."
      :crumbs="[{ label: 'Services', to: '/service/booking' }, { label: 'Book a Test Ride' }]"
    />

    <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
      <div class="mt-10 grid gap-8 lg:grid-cols-[280px_1fr_340px]">
        <!-- Step rail -->
        <aside class="hidden lg:block">
          <div class="sticky top-28 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
            <p class="mb-4 font-display text-xs font-bold tracking-[0.2em] text-brand-grey uppercase">Booking Progress</p>
            <ol class="space-y-1">
              <li v-for="(s, i) in steps" :key="s.id">
                <button
                  class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200"
                  :class="step > i ? 'cursor-pointer hover:bg-white/[0.04]' : step === i ? 'bg-brand-red/10' : ''"
                  :disabled="step < i"
                  :aria-current="step === i ? 'step' : undefined"
                  @click="goTo(i)"
                >
                  <span
                    class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold"
                    :class="step > i ? 'border-brand-red bg-brand-red text-white' : step === i ? 'border-brand-red text-brand-red' : 'border-white/15 text-brand-grey'"
                  >
                    <Check v-if="step > i" class="h-3.5 w-3.5" />
                    <template v-else>{{ i + 1 }}</template>
                  </span>
                  <span>
                    <span class="block text-sm font-semibold" :class="step >= i ? 'text-white' : 'text-brand-grey'">{{ s.label }}</span>
                    <span class="block text-[11px] text-brand-grey">{{ s.hint }}</span>
                  </span>
                </button>
              </li>
            </ol>
          </div>
        </aside>

        <!-- Wizard card -->
        <div class="min-w-0">
          <div class="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 sm:p-9">
            <div class="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-red/8 blur-3xl" aria-hidden="true" />

            <div class="mb-7 lg:hidden">
              <div class="mb-2 flex items-center justify-between">
                <p class="font-display text-xs font-bold tracking-[0.2em] text-brand-grey uppercase">Step {{ step + 1 }} of {{ steps.length }}</p>
                <p class="text-xs font-semibold text-brand-red">{{ steps[step].label }}</p>
              </div>
              <div class="flex h-1.5 gap-1.5 overflow-hidden rounded-full">
                <div v-for="(s, i) in steps" :key="s.id" class="flex-1 rounded-full transition-all duration-300" :class="i <= step ? 'bg-brand-red' : 'bg-white/10'" />
              </div>
            </div>

            <Transition name="wizard" mode="out-in">
              <!-- Step 1: Choose motorcycle -->
              <div v-if="step === 0" key="s1">
                <h2 class="font-heading text-3xl text-white">Choose Your <span class="text-brand-red">Motorcycle</span></h2>
                <p class="mt-2 text-sm text-brand-grey">Select the machine you'd like to ride.</p>

                <div v-if="motorcyclesLoading" class="mt-7 grid gap-4 sm:grid-cols-2">
                  <div v-for="i in 4" :key="i" class="h-64 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.03]" />
                </div>
                <div v-else class="mt-7 grid gap-4 sm:grid-cols-2">
                  <button
                    v-for="b in motorcycles"
                    :key="b.id"
                    class="group relative overflow-hidden rounded-2xl border text-left transition-all duration-300"
                    :class="form.motorcycle === b.name
                      ? 'border-brand-red/70 shadow-xl shadow-brand-red/15'
                      : 'border-white/[0.08] hover:border-brand-red/40'"
                    :aria-pressed="form.motorcycle === b.name"
                    @click="form.motorcycle = b.name"
                  >
                    <div class="relative aspect-[16/10] overflow-hidden bg-black">
                      <img
                        v-if="b.images?.length"
                        :src="pb.files.getURL(b, b.images[0], { thumb: '600x0' })"
                        :alt="b.name"
                        loading="lazy"
                        decoding="async"
                        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                      <span
                        v-if="form.motorcycle === b.name"
                        class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand-red"
                        aria-hidden="true"
                      >
                        <Check class="h-4 w-4 text-white" />
                      </span>
                      <div class="absolute bottom-3 left-4 right-4">
                        <p class="font-display text-lg font-bold tracking-display text-white">{{ b.name }}</p>
                        <p class="text-xs text-brand-grey">{{ b.year }} · {{ b.engine_cc }}cc</p>
                      </div>
                    </div>
                    <div class="flex items-center justify-between px-4 py-3">
                      <p class="font-heading text-lg text-brand-red">{{ formatPrice(b.sale_price || b.price) }}</p>
                      <p v-if="b.type" class="text-[11px] font-semibold tracking-[0.16em] text-brand-grey uppercase">{{ b.type }}</p>
                    </div>
                  </button>
                </div>
                <p v-if="errors.motorcycle" class="mt-3 text-xs text-brand-red">{{ errors.motorcycle }}</p>
                <p v-if="!motorcyclesLoading && !motorcycles.length" class="mt-6 rounded-xl border border-dashed border-white/15 p-8 text-center text-sm text-brand-grey">No motorcycles available for test rides right now — check back soon.</p>

                <div class="mt-8 flex items-center justify-between">
                  <span class="text-xs text-brand-grey">Don't have a license yet? <NuxtLink to="/contact" class="text-brand-red hover:underline">Talk to us</NuxtLink> about rider training.</span>
                  <Button size="md" variant="primary" trailing-arrow @click="nextStep">Continue</Button>
                </div>
              </div>

              <!-- Step 2: Personal details -->
              <div v-else-if="step === 1" key="s2">
                <h2 class="font-heading text-3xl text-white">Personal <span class="text-brand-red">Details</span></h2>
                <p class="mt-2 text-sm text-brand-grey">
                  <template v-if="isLoggedIn">Signed in as <span class="font-semibold text-white">{{ authUser?.name || authUser?.email }}</span> — we'll use your account details.</template>
                  <template v-else>Tell us who's coming to ride.</template>
                </p>

                <div v-if="!isLoggedIn" class="mt-7 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label for="tr-name" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Full Name</label>
                    <input id="tr-name" v-model="form.name" type="text" placeholder="John Doe" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" :class="{ 'border-brand-red/70': errors.name }" />
                    <p v-if="errors.name" class="mt-1.5 text-xs text-brand-red">{{ errors.name }}</p>
                  </div>
                  <div>
                    <label for="tr-phone" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Phone</label>
                    <input id="tr-phone" v-model="form.phone" type="tel" placeholder="+254 7XX XXX XXX" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" :class="{ 'border-brand-red/70': errors.phone }" />
                    <p v-if="errors.phone" class="mt-1.5 text-xs text-brand-red">{{ errors.phone }}</p>
                  </div>
                  <div class="sm:col-span-2">
                    <label for="tr-email" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Email</label>
                    <input id="tr-email" v-model="form.email" type="email" placeholder="you@example.com" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" :class="{ 'border-brand-red/70': errors.email }" />
                    <p v-if="errors.email" class="mt-1.5 text-xs text-brand-red">{{ errors.email }}</p>
                  </div>
                </div>

                <div class="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <p class="mb-2 font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">ID Document <span class="text-brand-red">*</span></p>
                    <div
                      class="relative flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-white/15 p-5 transition-colors hover:border-brand-red/60"
                      :class="{ 'border-brand-red/60': idDocument, 'border-brand-red/70': idDocumentError }"
                      @drop.prevent="onDropId" @dragover.prevent @dragenter.prevent @click="idInput?.click()"
                    >
                      <input ref="idInput" type="file" accept="image/jpeg,image/png,application/pdf" class="hidden" @change="onIdChange" />
                      <div v-if="!idDocument" class="flex flex-col items-center gap-2 text-brand-grey">
                        <Upload class="h-6 w-6" />
                        <span class="text-xs">Drop or click to upload (JPG, PNG, PDF · max 5MB)</span>
                      </div>
                      <div v-else class="flex w-full items-center gap-3">
                        <FileText class="h-5 w-5 shrink-0 text-brand-red" />
                        <span class="truncate text-sm text-white">{{ idDocument.name }}</span>
                        <button type="button" class="ml-auto shrink-0 text-brand-grey hover:text-brand-red" aria-label="Remove ID document" @click.stop="removeId"><X class="h-4 w-4" /></button>
                      </div>
                    </div>
                    <p v-if="idDocumentError" class="mt-1.5 text-xs text-brand-red">{{ idDocumentError }}</p>
                  </div>
                  <div>
                    <p class="mb-2 font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Driver's License <span class="text-brand-red">*</span></p>
                    <div
                      class="relative flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-white/15 p-5 transition-colors hover:border-brand-red/60"
                      :class="{ 'border-brand-red/60': driversLicense, 'border-brand-red/70': driversLicenseError }"
                      @drop.prevent="onDropLicense" @dragover.prevent @dragenter.prevent @click="licenseInput?.click()"
                    >
                      <input ref="licenseInput" type="file" accept="image/jpeg,image/png,application/pdf" class="hidden" @change="onLicenseChange" />
                      <div v-if="!driversLicense" class="flex flex-col items-center gap-2 text-brand-grey">
                        <Upload class="h-6 w-6" />
                        <span class="text-xs">Drop or click to upload (JPG, PNG, PDF · max 5MB)</span>
                      </div>
                      <div v-else class="flex w-full items-center gap-3">
                        <FileText class="h-5 w-5 shrink-0 text-brand-red" />
                        <span class="truncate text-sm text-white">{{ driversLicense.name }}</span>
                        <button type="button" class="ml-auto shrink-0 text-brand-grey hover:text-brand-red" aria-label="Remove driver's license" @click.stop="removeLicense"><X class="h-4 w-4" /></button>
                      </div>
                    </div>
                    <p v-if="driversLicenseError" class="mt-1.5 text-xs text-brand-red">{{ driversLicenseError }}</p>
                  </div>
                </div>

                <div class="mt-8 flex items-center justify-between">
                  <Button variant="ghost" @click="step = 0"><ArrowLeft class="h-4 w-4" />Back</Button>
                  <Button size="md" variant="primary" trailing-arrow @click="nextStep">Continue</Button>
                </div>
              </div>

              <!-- Step 3: Experience level -->
              <div v-else-if="step === 2" key="s3">
                <h2 class="font-heading text-3xl text-white">Your Riding <span class="text-brand-red">Experience</span></h2>
                <p class="mt-2 text-sm text-brand-grey">This helps us match you with the right guide and route.</p>

                <div class="mt-7 grid gap-4 sm:grid-cols-2">
                  <button
                    v-for="lvl in levels"
                    :key="lvl.value"
                    class="group flex items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-200"
                    :class="form.level === lvl.value ? 'border-brand-red/60 bg-brand-red/10 shadow-lg shadow-brand-red/10' : 'border-white/[0.08] bg-white/[0.02] hover:border-brand-red/40'"
                    :aria-pressed="form.level === lvl.value"
                    @click="form.level = lvl.value"
                  >
                    <span class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border" :class="form.level === lvl.value ? 'border-brand-red bg-brand-red text-white' : 'border-white/10 text-brand-grey'">
                      <component :is="lvl.icon" class="h-5 w-5" />
                    </span>
                    <span>
                      <span class="block font-display font-bold tracking-display text-white">{{ lvl.label }}</span>
                      <span class="mt-1 block text-xs leading-relaxed text-brand-grey">{{ lvl.desc }}</span>
                    </span>
                  </button>
                </div>
                <p v-if="errors.level" class="mt-3 text-xs text-brand-red">{{ errors.level }}</p>

                <div class="mt-6">
                  <label for="tr-notes" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Anything else we should know?</label>
                  <textarea id="tr-notes" v-model="form.notes" rows="3" placeholder="e.g. I've ridden the 250N before, keen to feel the 400RR…" class="input-field min-h-[100px] rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25"></textarea>
                </div>

                <div class="mt-8 flex items-center justify-between">
                  <Button variant="ghost" @click="step = 1"><ArrowLeft class="h-4 w-4" />Back</Button>
                  <Button size="md" variant="primary" trailing-arrow @click="nextStep">Continue</Button>
                </div>
              </div>

              <!-- Step 4: Preferred branch -->
              <div v-else-if="step === 3" key="s4">
                <h2 class="font-heading text-3xl text-white">Preferred <span class="text-brand-red">Branch</span></h2>
                <p class="mt-2 text-sm text-brand-grey">Where would you like to ride?</p>

                <div v-if="branchesLoading" class="mt-7 space-y-4">
                  <div v-for="i in 2" :key="i" class="h-32 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.03]" />
                </div>
                <div v-else class="mt-7 grid gap-4 sm:grid-cols-2">
                  <button
                    v-for="b in branches"
                    :key="b.id"
                    class="group rounded-2xl border p-6 text-left transition-all duration-200"
                    :class="form.branch === b.name ? 'border-brand-red/60 bg-brand-red/10 shadow-lg shadow-brand-red/10' : 'border-white/[0.08] bg-white/[0.02] hover:border-brand-red/40'"
                    :aria-pressed="form.branch === b.name"
                    @click="form.branch = b.name"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div class="flex items-center gap-3">
                        <span class="flex h-10 w-10 items-center justify-center rounded-xl border" :class="form.branch === b.name ? 'border-brand-red bg-brand-red text-white' : 'border-white/10 text-brand-grey'">
                          <MapPin class="h-5 w-5" />
                        </span>
                        <span class="font-display text-lg font-bold tracking-display text-white">{{ b.name }}</span>
                      </div>
                      <span v-if="form.branch === b.name" class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-red" aria-hidden="true">
                        <Check class="h-3.5 w-3.5 text-white" />
                      </span>
                    </div>
                    <p class="mt-3 text-xs leading-relaxed text-brand-grey">{{ b.address }}</p>
                    <p v-if="b.phone" class="mt-2 flex items-center gap-2 text-xs text-brand-grey"><Phone class="h-3.5 w-3.5 text-brand-red" />{{ b.phone }}</p>
                    <p v-if="b.hours" class="mt-1 flex items-start gap-2 text-xs text-brand-grey"><Clock class="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-red" /><span class="whitespace-pre-line">{{ b.hours }}</span></p>
                  </button>
                </div>

                <div class="mt-8 flex items-center justify-between">
                  <Button variant="ghost" @click="step = 2"><ArrowLeft class="h-4 w-4" />Back</Button>
                  <Button size="md" variant="primary" trailing-arrow @click="nextStep">Continue</Button>
                </div>
              </div>

              <!-- Step 5: Preferred date -->
              <div v-else-if="step === 4" key="s5">
                <h2 class="font-heading text-3xl text-white">Pick Your <span class="text-brand-red">Slot</span></h2>
                <p class="mt-2 text-sm text-brand-grey">Rides are available from 8:00 AM to 6:00 PM, Monday to Saturday.</p>

                <div class="mt-7 grid gap-6 sm:grid-cols-2">
                  <div>
                    <label for="tr-date" class="mb-2 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Preferred Date</label>
                    <input id="tr-date" v-model="form.date" type="date" :min="minDate" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" :class="{ 'border-brand-red/70': errors.date }" @change="loadBookedTimes" />
                    <p v-if="errors.date" class="mt-1.5 text-xs text-brand-red">{{ errors.date }}</p>
                  </div>
                  <div>
                    <p class="mb-2 font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Preferred Time</p>
                    <div class="grid grid-cols-4 gap-2">
                      <button
                        v-for="slot in timeSlots"
                        :key="slot"
                        class="rounded-xl border py-2.5 text-xs font-semibold transition-all duration-200 sm:text-sm"
                        :class="bookedTimes.has(slot)
                          ? 'cursor-not-allowed border-white/[0.06] text-brand-grey/40 line-through'
                          : form.time === slot
                            ? 'border-brand-red bg-brand-red text-white shadow-lg shadow-brand-red/25'
                            : 'border-white/10 text-white hover:border-brand-red/50 hover:text-brand-red'"
                        :disabled="bookedTimes.has(slot)"
                        :aria-label="bookedTimes.has(slot) ? `${slot} already booked` : `Choose ${slot}`"
                        @click="form.time = slot"
                      >
                        {{ slot }}
                      </button>
                    </div>
                    <p v-if="form.date && timeSlots.length && timeSlots.every(s => bookedTimes.has(s))" class="mt-2 text-xs text-amber-400">Fully booked for this date — try another day.</p>
                    <p v-if="errors.time" class="mt-1.5 text-xs text-brand-red">{{ errors.time }}</p>
                  </div>
                </div>

                <div class="mt-8">
                  <p class="mb-3 font-display text-xs font-bold tracking-[0.2em] text-brand-grey uppercase">Review Your Booking</p>
                  <dl class="divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                    <div v-for="row in reviewRows" :key="row.label" class="flex items-start justify-between gap-6 px-5 py-3.5">
                      <dt class="text-sm text-brand-grey">{{ row.label }}</dt>
                      <dd class="text-right text-sm font-semibold text-white">{{ row.value }}</dd>
                    </div>
                  </dl>
                </div>

                <p v-if="submitError" class="mt-4 rounded-xl border border-brand-red/30 bg-brand-red/10 p-3.5 text-center text-sm text-brand-red">{{ submitError }}</p>

                <div class="mt-8 flex items-center justify-between">
                  <Button variant="ghost" @click="step = 3"><ArrowLeft class="h-4 w-4" />Back</Button>
                  <Button size="md" variant="primary" :loading="submitting" @click="submitRide">
                    <CalendarCheck class="h-5 w-5" />Confirm Test Ride
                  </Button>
                </div>
              </div>

              <!-- Step 6: Confirmation -->
              <div v-else key="s6">
                <div class="py-6 text-center">
                  <motion.div
                    class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-green-500/40 bg-green-500/15"
                    :initial="{ scale: 0.6, opacity: 0 }" :animate="{ scale: 1, opacity: 1 }" :transition="{ type: 'spring', stiffness: 220, damping: 16 }"
                  >
                    <CheckCircle2 class="h-10 w-10 text-green-400" />
                  </motion.div>
                  <h2 class="font-heading text-4xl text-white">Test Ride <span class="text-brand-red">Confirmed</span></h2>
                  <p class="mx-auto mt-3 max-w-md text-sm leading-relaxed text-brand-grey">
                    Your test ride request has been received. Our team will call to confirm your slot and verify your documents.
                  </p>

                  <dl class="mx-auto mt-8 max-w-md divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] bg-white/[0.02] text-left">
                    <div v-for="row in reviewRows" :key="row.label" class="flex items-center justify-between gap-6 px-5 py-3.5">
                      <dt class="text-sm text-brand-grey">{{ row.label }}</dt>
                      <dd class="text-sm font-semibold text-white">{{ row.value }}</dd>
                    </div>
                  </dl>

                  <div class="mt-9 flex flex-wrap justify-center gap-4">
                    <Button to="/motorcycles" variant="primary"><Bike class="h-5 w-5" />Browse More Bikes</Button>
                    <Button to="/" variant="ghost">Back to Home</Button>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Live summary -->
        <aside class="hidden lg:block">
          <div class="sticky top-28 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-6">
            <p class="mb-4 font-display text-xs font-bold tracking-[0.2em] text-brand-grey uppercase">Ride Summary</p>
            <dl class="space-y-3.5 text-sm">
              <div class="flex items-center justify-between gap-4">
                <dt class="text-brand-grey">Motorcycle</dt>
                <dd class="font-semibold text-white">{{ form.motorcycle || '—' }}</dd>
              </div>
              <div class="flex items-center justify-between gap-4">
                <dt class="text-brand-grey">Experience</dt>
                <dd class="font-semibold text-white">{{ levelLabel }}</dd>
              </div>
              <div class="flex items-center justify-between gap-4">
                <dt class="text-brand-grey">Branch</dt>
                <dd class="text-right font-semibold text-white">{{ form.branch }}</dd>
              </div>
              <div class="flex items-center justify-between gap-4">
                <dt class="text-brand-grey">Date</dt>
                <dd class="font-semibold text-white">{{ form.date ? formatDate(form.date) : '—' }}</dd>
              </div>
              <div class="flex items-center justify-between gap-4">
                <dt class="text-brand-grey">Time</dt>
                <dd class="font-semibold text-white">{{ form.time ? formatTime(form.time) : '—' }}</dd>
              </div>
            </dl>

            <div class="mt-6 border-t border-white/[0.06] pt-5">
              <p class="mb-2 flex items-center gap-2 text-xs text-brand-grey/80"><ShieldCheck class="h-4 w-4 text-emerald-400" />Free of charge</p>
              <p class="text-xs leading-relaxed text-brand-grey/60">
                Please arrive 15 minutes early with your original ID and driving license. A valid license is required to ride.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import {
  ArrowLeft, CalendarCheck, Check, CheckCircle2, ShieldCheck, Bike, MapPin, Phone, Clock,
  Upload, FileText, X, Sprout, Map, Gauge, Trophy,
} from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { formatDate, formatTime } from '~/composables/useFormat'
import { useAuthStore } from '~/stores/auth'

interface Motorcycle { id: string; name: string; year?: number; engine_cc?: number; type?: string; price: number; sale_price?: number; images?: string[] }

useHead({
  title: 'Test Ride Booking - Nairobi Powerbikes',
  meta: [{ name: 'description', content: 'Book a test ride at Nairobi Powerbikes. Experience your next motorcycle firsthand.' }],
})

const pb = usePB()
const auth = useAuthStore()
const route = useRoute()

const steps = [
  { id: 'bike', label: 'Choose Motorcycle', hint: 'Pick your ride' },
  { id: 'details', label: 'Personal Details', hint: 'Contact & documents' },
  { id: 'experience', label: 'Experience Level', hint: 'Your riding history' },
  { id: 'branch', label: 'Preferred Branch', hint: 'Where to ride' },
  { id: 'date', label: 'Preferred Date', hint: 'Pick a slot' },
  { id: 'done', label: 'Confirmation', hint: 'You are booked in' },
]

const step = ref(0)
const submitting = ref(false)
const submitError = ref('')
const motorcycles = ref<Motorcycle[]>([])
const motorcyclesLoading = ref(true)
const branches = ref<any[]>([])
const branchesLoading = ref(true)
const bookedTimes = ref<Set<string>>(new Set())
const allTimeSlots = Array.from({ length: 36 }, (_, i) => {
  const h = String(8 + Math.floor(i / 4)).padStart(2, '0')
  const m = String((i % 4) * 15).padStart(2, '0')
  return `${h}:${m}`
})

const form = reactive({
  motorcycle: '', name: '', phone: '', email: '',
  level: '', notes: '', branch: '', date: '', time: '',
})
const errors = reactive<Record<string, string>>({})

const levels = [
  { value: 'beginner', label: 'Beginner', desc: 'First or second year of riding — we\'ll take it easy', icon: Sprout },
  { value: 'intermediate', label: 'Intermediate', desc: 'Rode regularly for 2–5 years', icon: Map },
  { value: 'experienced', label: 'Experienced', desc: '5+ years across multiple bike types', icon: Gauge },
  { value: 'professional', label: 'Professional', desc: 'Instructor, racer or daily professional rider', icon: Trophy },
]

const isLoggedIn = computed(() => auth.isAuthenticated)
const authUser = computed(() => auth.user as any)

const minDate = computed(() => new Date().toISOString().split('T')[0])

const timeSlots = computed(() => {
  const now = new Date()
  return allTimeSlots.filter(slot => {
    const [h, m] = slot.split(':').map(Number)
    const totalMin = h * 60 + m
    const nowMin = now.getHours() * 60 + now.getMinutes()
    if (form.date === now.toISOString().split('T')[0] && totalMin <= nowMin) return false
    return true
  })
})

const levelLabel = computed(() => levels.find(l => l.value === form.level)?.label || '—')

const reviewRows = computed(() => [
  { label: 'Motorcycle', value: form.motorcycle || '—' },
  { label: 'Experience', value: levelLabel.value },
  { label: 'Branch', value: form.branch },
  { label: 'Date', value: form.date ? formatDate(form.date) : '—' },
  { label: 'Time', value: form.time ? formatTime(form.time) : '—' },
  ...(!isLoggedIn.value ? [{ label: 'Name', value: form.name || '—' }, { label: 'Contact', value: `${form.phone || '—'}${form.email ? ` · ${form.email}` : ''}` }] : []),
])

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

function setFile(ref_: Ref<File | null>, errorRef: Ref<string>, file: File | null) {
  const err = validateFile(file)
  ref_.value = file && !err ? file : null
  errorRef.value = err
}

function onDropId(e: DragEvent) { setFile(idDocument, idDocumentError, e.dataTransfer?.files[0] || null) }
function onDropLicense(e: DragEvent) { setFile(driversLicense, driversLicenseError, e.dataTransfer?.files[0] || null) }
function onIdChange(e: Event) { setFile(idDocument, idDocumentError, (e.target as HTMLInputElement).files?.[0] || null) }
function onLicenseChange(e: Event) { setFile(driversLicense, driversLicenseError, (e.target as HTMLInputElement).files?.[0] || null) }
function removeId() { idDocument.value = null; idDocumentError.value = ''; if (idInput.value) idInput.value.value = '' }
function removeLicense() { driversLicense.value = null; driversLicenseError.value = ''; if (licenseInput.value) licenseInput.value.value = '' }

function formatPrice(v: number) { return `KSh ${Number(v).toLocaleString('en-KE')}` }

function validateStep(i: number): boolean {
  Object.keys(errors).forEach(k => delete errors[k])
  if (i === 0 && !form.motorcycle) errors.motorcycle = 'Please choose a motorcycle'
  if (i === 1) {
    if (!isLoggedIn.value) {
      if (form.name.trim().length < 2) errors.name = 'Name required'
      if (form.phone.trim().length < 8) errors.phone = 'Valid phone required'
      if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Valid email required'
    }
    const idErr = validateFile(idDocument.value)
    const licenseErr = validateFile(driversLicense.value)
    idDocumentError.value = idErr
    driversLicenseError.value = licenseErr
    if (idErr || licenseErr) errors.files = 'Both documents are required'
  }
  if (i === 2 && !form.level) errors.level = 'Please select your experience level'
  if (i === 3 && !form.branch) errors.branch = 'Please choose a branch'
  if (i === 4) {
    if (!form.date) errors.date = 'Choose a preferred date'
    if (!form.time) errors.time = 'Choose a preferred time'
  }
  return Object.keys(errors).length === 0
}

function nextStep() {
  if (validateStep(step.value)) step.value++
}
function goTo(i: number) {
  if (i < step.value) { step.value = i; return }
  let ok = true
  for (let s = step.value; s < i; s++) {
    if (!validateStep(s)) { ok = false; break }
  }
  if (ok) step.value = i
}

async function loadBookedTimes() {
  bookedTimes.value = new Set()
  form.time = ''
  if (!form.date) return
  try {
    const res = await pb.collection('service_bookings').getList(1, 50, {
      filter: `preferred_date = "${form.date}" && type = "test_ride"`,
      fields: 'preferred_time',
    })
    bookedTimes.value = new Set(res.items.map((b: any) => b.preferred_time))
  } catch { bookedTimes.value = new Set() }
}

async function loadMotorcycles() {
  try {
    motorcycles.value = await pb.collection('motorcycles').getFullList<Motorcycle>({ sort: 'name', filter: 'status!="sold"' })
    const bikeId = route.query.motorcycle as string | undefined
    if (bikeId) {
      const match = motorcycles.value.find(m => m.id === bikeId)
      if (match) form.motorcycle = match.name
    }
  } catch { motorcycles.value = [] }
  finally { motorcyclesLoading.value = false }
}

async function loadBranches() {
  try {
    branches.value = await pb.collection('branches').getFullList({ sort: 'name' })
  } catch { branches.value = [] }
  if (!branches.value.length) {
    branches.value = [{ id: 'mombasa-road', name: 'Mombasa Road Branch', address: 'DTB Centre Annex 2, Mombasa Road, Opposite Airtel Kenya, Nairobi', phone: '+254 712 345 678', hours: 'Mon-Sat: 8:00 AM - 6:00 PM\nSun: 10:00 AM - 4:00 PM' }]
  }
  form.branch = branches.value[0].name
  branchesLoading.value = false
}

async function submitRide() {
  submitting.value = true
  submitError.value = ''
  const idErr = validateFile(idDocument.value)
  const licenseErr = validateFile(driversLicense.value)
  idDocumentError.value = idErr
  driversLicenseError.value = licenseErr
  if (idErr || licenseErr) { submitting.value = false; return }
  try {
    const res = await pb.collection('service_bookings').getList(1, 1, {
      filter: `preferred_date = "${form.date}" && preferred_time = "${form.time}" && type = "test_ride"`,
    })
    if (res.totalItems > 0) {
      submitError.value = 'This time slot has just been taken. Please pick another.'
      step.value = 4
      form.time = ''
      return
    }
    const userId = pb.authStore.model?.id || null
    const fd = new FormData()
    fd.append('type', 'test_ride')
    fd.append('name', form.name || (authUser.value?.name as string) || '')
    fd.append('phone', form.phone || (authUser.value?.phone as string) || '')
    fd.append('email', form.email || (authUser.value?.email as string) || '')
    fd.append('motorcycle', form.motorcycle)
    fd.append('branch', form.branch)
    fd.append('preferred_date', form.date)
    fd.append('preferred_time', form.time)
    fd.append('notes', `${form.level ? `Riding experience: ${levelLabel.value}. ` : ''}${form.notes || ''}`.trim())
    fd.append('status', 'pending')
    if (userId) fd.append('user', userId)
    fd.append('id_document', idDocument.value!)
    fd.append('drivers_license', driversLicense.value!)
    await pb.collection('service_bookings').create(fd)
    form.motorcycle = ''; form.name = ''; form.phone = ''; form.email = ''
    form.level = ''; form.notes = ''; form.date = ''; form.time = ''
    bookedTimes.value = new Set()
    idDocument.value = null
    driversLicense.value = null
    idDocumentError.value = ''
    driversLicenseError.value = ''
    step.value = 5
  } catch (err: any) {
    submitError.value = err?.data?.message || err?.message || 'Booking failed. Please try again.'
  } finally { submitting.value = false }
}

onMounted(async () => {
  await Promise.all([loadMotorcycles(), loadBranches()])
  pb.collection('motorcycles').subscribe('*', () => loadMotorcycles())
})

onUnmounted(() => { pb.collection('motorcycles').unsubscribe('*') })
</script>

<style scoped>
.wizard-enter-active, .wizard-leave-active { transition: all 0.28s ease; }
.wizard-enter-from { opacity: 0; transform: translateX(26px); }
.wizard-leave-to { opacity: 0; transform: translateX(-18px); }
</style>