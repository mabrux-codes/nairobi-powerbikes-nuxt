<template>
  <div class="mx-auto max-w-7xl">
    <div class="mb-8">
      <h1 class="font-heading text-3xl text-white sm:text-4xl">My <span class="text-brand-red">Test Rides</span></h1>
      <div class="mt-2 h-1 w-24 bg-brand-red" />
      <p class="mt-3 text-sm text-brand-grey">Manage and track all your motorcycle test ride requests in one place.</p>
    </div>

    <div class="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
      <div class="relative flex-1">
        <Search class="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-brand-grey/50" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by reference, bike, customer..."
          class="input-field h-11 w-full pl-11"
        />
      </div>
      <div class="flex flex-wrap gap-3">
        <select v-model="statusFilter" class="input-field h-11 w-full min-w-0 sm:w-auto sm:min-w-44">
          <option value="">All Statuses</option>
          <option v-for="(meta, key) in STATUS" :key="key" :value="key">{{ meta.label }}</option>
        </select>
        <select v-model="sortOrder" class="input-field h-11 w-full min-w-0 sm:w-auto sm:min-w-36">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>
    </div>

    <div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <motion.div
        v-for="(card, i) in SUMMARY_CARDS"
        :key="card.key"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.1 + i * 0.08, duration: 0.4 }"
        class="group rounded-xl border border-brand-grey/15 bg-brand-black/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/40 hover:shadow-lg hover:shadow-brand-red/5"
      >
        <div class="flex items-center justify-between">
          <span class="flex h-10 w-10 items-center justify-center rounded-lg" :class="card.iconBg">
            <component :is="card.icon" class="h-5 w-5" :class="card.iconColor" />
          </span>
          <span class="font-heading text-3xl text-white transition-transform duration-300 group-hover:scale-110">{{ card.count }}</span>
        </div>
        <p class="mt-4 font-display text-sm tracking-display text-white uppercase">{{ card.label }}</p>
        <p class="mt-1 text-xs text-brand-grey">{{ card.desc }}</p>
      </motion.div>
    </div>

    <div v-if="loading" class="space-y-5">
      <div v-for="i in 3" :key="i" class="animate-pulse rounded-xl border border-brand-grey/15 p-6">
        <div class="flex items-start justify-between gap-4">
          <div class="space-y-3">
            <div class="h-5 w-44 rounded bg-brand-grey/10" />
            <div class="h-4 w-64 rounded bg-brand-grey/10" />
          </div>
          <div class="h-6 w-24 rounded bg-brand-grey/10" />
        </div>
        <div class="mt-5 flex gap-4">
          <div class="h-20 w-32 rounded-lg bg-brand-grey/10" />
          <div class="flex-1 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div v-for="j in 3" :key="j" class="h-12 rounded bg-brand-grey/10" />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="filtered.length === 0" class="rounded-xl border border-dashed border-brand-grey/20 bg-brand-black/40 p-14 text-center">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-red/10">
        <Bike class="h-8 w-8 text-brand-red" />
      </div>
      <p class="mt-5 font-heading text-2xl text-white">No test ride requests found.</p>
      <p class="mt-2 text-sm text-brand-grey">Experience your next motorcycle firsthand. Schedule a test ride today.</p>
      <Button to="/service/test-ride" class="mt-6"><CalendarClock class="h-5 w-5" />Book a Test Ride</Button>
    </div>

    <div v-else class="space-y-5">
      <motion.div
        v-for="(b, idx) in filtered"
        :key="b.id"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: Math.min(idx * 0.05, 0.4), duration: 0.4 }"
        class="group rounded-xl border border-brand-grey/15 bg-brand-black/80 transition-all duration-300 hover:border-brand-red/40 hover:shadow-lg hover:shadow-brand-red/5"
        :class="expanded[b.id] ? 'border-brand-red/40' : ''"
      >
        <div class="cursor-pointer p-5 sm:p-6" @click="toggleExpand(b.id)">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-3">
                <span class="font-display text-lg tracking-display text-white">{{ rideRef(b) }}</span>
                <span
                  class="inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-0.5 text-xs font-display tracking-display uppercase"
                  :class="statusMeta(b.status).classes"
                >
                  <span class="h-1.5 w-1.5 rounded-full" :class="statusMeta(b.status).dot" />
                  {{ statusMeta(b.status).label }}
                </span>
                <span class="inline-flex items-center gap-1 rounded-sm border border-brand-grey/20 px-2 py-0.5 text-[10px] font-display tracking-display text-brand-grey uppercase">Test Ride</span>
              </div>
              <p class="mt-1 text-sm text-brand-grey">
                {{ motorcycleTitle(b) }}
                <template v-if="b.name">&middot; {{ b.name }}</template>
              </p>
            </div>
            <div class="flex items-center gap-3">
              <span class="hidden items-center gap-1.5 text-xs text-brand-grey/60 sm:flex">
                <Clock class="h-3.5 w-3.5" />
                {{ formatDateTime(b.created) }}
              </span>
              <button
                class="flex h-11 w-11 items-center justify-center rounded-full border border-brand-grey/20 text-brand-grey transition-all duration-300 group-hover:border-brand-red/50 group-hover:text-brand-red"
                :class="expanded[b.id] ? 'rotate-180 border-brand-red/50 text-brand-red' : ''"
                aria-label="Toggle details"
              >
                <ChevronDown class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div class="mt-5 flex flex-col gap-4 sm:flex-row">
            <div v-if="bikeImage(b)" class="h-24 w-full shrink-0 overflow-hidden rounded-lg border border-brand-grey/15 sm:w-36">
              <img :src="bikeImage(b)" :alt="b.motorcycle" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div v-else class="hidden h-24 w-36 shrink-0 items-center justify-center rounded-lg border border-brand-grey/15 bg-white/[0.02] sm:flex">
              <Bike class="h-8 w-8 text-brand-grey/40" />
            </div>
            <div class="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div v-if="motorcycleTitle(b)" class="flex items-start gap-2.5 rounded-lg border border-brand-grey/10 bg-white/[0.02] p-3">
                <Bike class="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                <div class="min-w-0"><p class="text-[10px] font-display tracking-display text-brand-grey uppercase">Motorcycle</p><p class="truncate text-sm text-white">{{ motorcycleTitle(b) }}</p></div>
              </div>
              <div v-if="b.branch" class="flex items-start gap-2.5 rounded-lg border border-brand-grey/10 bg-white/[0.02] p-3">
                <MapPin class="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                <div class="min-w-0"><p class="text-[10px] font-display tracking-display text-brand-grey uppercase">Branch</p><p class="truncate text-sm text-white">{{ b.branch }}</p></div>
              </div>
              <div v-if="b.preferred_date" class="flex items-start gap-2.5 rounded-lg border border-brand-grey/10 bg-white/[0.02] p-3">
                <CalendarClock class="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                <div class="min-w-0"><p class="text-[10px] font-display tracking-display text-brand-grey uppercase">Preferred Ride Date</p><p class="text-sm text-white">{{ formatDate(b.preferred_date) }}<span v-if="b.preferred_time" class="ml-1 text-brand-grey">at {{ formatTime(b.preferred_time) }}</span></p></div>
              </div>
              <div v-if="b.created" class="flex items-start gap-2.5 rounded-lg border border-brand-grey/10 bg-white/[0.02] p-3 sm:hidden lg:flex">
                <FileText class="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                <div class="min-w-0"><p class="text-[10px] font-display tracking-display text-brand-grey uppercase">Submitted</p><p class="text-sm text-white">{{ formatDateTime(b.created) }}</p></div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid transition-all duration-500 ease-in-out" :class="expanded[b.id] ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
          <div class="overflow-hidden">
            <div class="border-t border-brand-grey/10 px-5 pt-5 pb-6 sm:px-6">
              <div class="space-y-5">
                <section v-if="motorRows(b).length" class="rounded-lg border border-brand-grey/10 bg-white/[0.02] p-4 sm:p-5">
                  <div class="mb-4 flex items-center gap-2">
                    <Bike class="h-4 w-4 text-brand-red" />
                    <h3 class="font-display text-sm tracking-display text-white uppercase">Motorcycle Details</h3>
                  </div>
                  <div class="flex flex-col gap-4 sm:flex-row">
                    <div v-if="bikeImage(b)" class="w-full shrink-0 overflow-hidden rounded-lg border border-brand-grey/15 sm:w-48">
                      <img :src="bikeImage(b)" :alt="b.motorcycle" class="h-32 w-full object-cover" />
                    </div>
                    <div class="grid flex-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div v-for="row in motorRows(b)" :key="row.label">
                        <p class="text-[10px] font-display tracking-display text-brand-grey uppercase">{{ row.label }}</p>
                        <p class="mt-0.5 text-sm text-white">{{ row.value }}</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section v-if="customerRows(b).length" class="rounded-lg border border-brand-grey/10 bg-white/[0.02] p-4 sm:p-5">
                  <div class="mb-4 flex items-center gap-2">
                    <Users class="h-4 w-4 text-brand-red" />
                    <h3 class="font-display text-sm tracking-display text-white uppercase">Customer Information</h3>
                  </div>
                  <div class="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div v-for="row in customerRows(b)" :key="row.label">
                      <p class="text-[10px] font-display tracking-display text-brand-grey uppercase">{{ row.label }}</p>
                      <p class="mt-0.5 text-sm text-white">{{ row.value }}</p>
                    </div>
                  </div>
                </section>

                <section v-if="rideRows(b).length" class="rounded-lg border border-brand-grey/10 bg-white/[0.02] p-4 sm:p-5">
                  <div class="mb-4 flex items-center gap-2">
                    <CalendarClock class="h-4 w-4 text-brand-red" />
                    <h3 class="font-display text-sm tracking-display text-white uppercase">Test Ride Details</h3>
                  </div>
                  <div class="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div v-for="row in rideRows(b)" :key="row.label" :class="row.full ? 'sm:col-span-2 lg:col-span-3' : ''">
                      <p class="text-[10px] font-display tracking-display text-brand-grey uppercase">{{ row.label }}</p>
                      <p class="mt-0.5 text-sm whitespace-pre-line text-white">{{ row.value }}</p>
                    </div>
                  </div>
                </section>

                <section v-if="extraRows(b).length" class="rounded-lg border border-brand-grey/10 bg-white/[0.02] p-4 sm:p-5">
                  <div class="mb-4 flex items-center gap-2">
                    <Info class="h-4 w-4 text-brand-red" />
                    <h3 class="font-display text-sm tracking-display text-white uppercase">Additional Information</h3>
                  </div>
                  <div class="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                    <div v-for="row in extraRows(b)" :key="row.label" class="sm:col-span-2">
                      <p class="text-[10px] font-display tracking-display text-brand-grey uppercase">{{ row.label }}</p>
                      <p class="mt-0.5 text-sm whitespace-pre-line text-white">{{ row.value }}</p>
                    </div>
                  </div>
                </section>

                <section class="rounded-lg border border-brand-grey/10 bg-white/[0.02] p-4 sm:p-5">
                  <div class="mb-5 flex items-center gap-2">
                    <History class="h-4 w-4 text-brand-red" />
                    <h3 class="font-display text-sm tracking-display text-white uppercase">Booking Timeline</h3>
                  </div>
                  <div class="relative">
                    <div
                      v-if="statusMeta(b.status).blocked"
                      class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-brand-black/70 backdrop-blur-[2px]"
                    >
                      <span class="rounded-sm border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400">{{ statusMeta(b.status).blocked }}</span>
                    </div>
                    <ol class="space-y-0">
                      <li v-for="(s, i) in STAGES" :key="s.key" class="relative flex gap-4 pb-7 last:pb-0">
                        <div class="flex flex-col items-center">
                          <div
                            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all duration-300"
                            :class="stageDotClass(b, i)"
                          >
                            <Check v-if="stageState(b, i) === 'done'" class="h-4 w-4" />
                            <span v-else-if="stageState(b, i) === 'current'" class="h-2 w-2 rounded-full bg-brand-red" />
                            <span v-else>{{ i + 1 }}</span>
                          </div>
                          <div
                            v-if="i < STAGES.length - 1"
                            class="mt-1 w-0.5 flex-1 rounded-full transition-colors duration-500"
                            :class="stageState(b, i) === 'done' ? 'bg-emerald-500/60' : 'bg-brand-grey/15'"
                          />
                        </div>
                        <div class="min-w-0 pb-1">
                          <p class="text-sm font-medium" :class="stageState(b, i) === 'pending' ? 'text-brand-grey/50' : 'text-white'">{{ s.label }}</p>
                          <p v-if="stageTime(b, i)" class="mt-0.5 text-xs text-brand-grey/60">{{ stageTime(b, i) }}</p>
                          <p v-if="i === currentStageIndex(b) && b.assigned_to" class="mt-0.5 text-xs text-brand-grey/60">Staff: <span class="text-brand-grey/80">{{ b.assigned_to }}</span></p>
                          <p v-if="i === currentStageIndex(b) && b.notes" class="mt-1.5 rounded-md border border-brand-red/20 bg-brand-red/5 px-3 py-2 text-xs text-brand-grey/80">
                            <span class="font-semibold text-brand-red">Note:</span> {{ b.notes }}
                          </p>
                        </div>
                      </li>
                    </ol>
                  </div>
                </section>

                <section v-if="apptRows(b).length" class="rounded-lg border border-brand-grey/10 bg-white/[0.02] p-4 sm:p-5">
                  <div class="mb-4 flex items-center gap-2">
                    <MapPin class="h-4 w-4 text-brand-red" />
                    <h3 class="font-display text-sm tracking-display text-white uppercase">Appointment Information</h3>
                  </div>
                  <div class="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div v-for="row in apptRows(b)" :key="row.label">
                      <p class="text-[10px] font-display tracking-display text-brand-grey uppercase">{{ row.label }}</p>
                      <p class="mt-0.5 text-sm text-white">{{ row.value }}</p>
                    </div>
                  </div>
                </section>

                <section v-if="checklistItems(b).length" class="rounded-lg border border-brand-grey/10 bg-white/[0.02] p-4 sm:p-5">
                  <div class="mb-4 flex items-center gap-2">
                    <ClipboardCheck class="h-4 w-4 text-brand-red" />
                    <h3 class="font-display text-sm tracking-display text-white uppercase">Requirements Checklist</h3>
                  </div>
                  <div class="grid gap-2 sm:grid-cols-2">
                    <div
                      v-for="item in checklistItems(b)"
                      :key="item.label"
                      class="flex items-center justify-between gap-3 rounded-lg border px-4 py-3"
                      :class="item.done ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-brand-grey/15 bg-white/[0.02]'"
                    >
                      <span class="text-sm text-white">{{ item.label }}</span>
                      <CircleCheck v-if="item.done" class="h-5 w-5 shrink-0 text-emerald-400" />
                      <Minus v-else class="h-5 w-5 shrink-0 text-brand-grey/50" />
                    </div>
                  </div>
                </section>

                <section v-if="docFiles(b).length" class="rounded-lg border border-brand-grey/10 bg-white/[0.02] p-4 sm:p-5">
                  <div class="mb-4 flex items-center gap-2">
                    <FileText class="h-4 w-4 text-brand-red" />
                    <h3 class="font-display text-sm tracking-display text-white uppercase">Documents</h3>
                  </div>
                  <div class="grid gap-3 sm:grid-cols-2">
                    <div v-for="doc in docFiles(b)" :key="doc.name">
                      <p class="mb-1.5 text-[10px] font-display tracking-display text-brand-grey uppercase">{{ doc.name }}</p>
                      <button
                        v-if="isImage(doc.file)"
                        class="group/doc relative block w-full overflow-hidden rounded-lg border border-brand-grey/15"
                        @click="openPreview(b, doc.file)"
                      >
                        <img :src="fileUrl(b, doc.file)" :alt="doc.name" class="h-32 w-full object-cover transition-transform duration-300 group-hover/doc:scale-105" />
                        <span class="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity duration-300 group-hover/doc:opacity-100">
                          <Eye class="h-5 w-5 text-white" />
                          <span class="text-xs font-medium text-white">Preview</span>
                        </span>
                      </button>
                      <a
                        v-else
                        :href="fileUrl(b, doc.file)"
                        target="_blank"
                        rel="noopener"
                        download
                        class="flex items-center justify-between gap-3 rounded-lg border border-brand-grey/15 bg-brand-black/60 px-4 py-3 transition-colors hover:border-brand-red/40"
                      >
                        <span class="flex items-center gap-2 text-sm text-white"><FileText class="h-4 w-4 text-brand-red" />View Document</span>
                        <Download class="h-4 w-4 text-brand-grey/50" />
                      </a>
                    </div>
                  </div>
                </section>

                <section v-if="feedbackRows(b).length" class="rounded-lg border border-brand-grey/10 bg-white/[0.02] p-4 sm:p-5">
                  <div class="mb-4 flex items-center gap-2">
                    <Star class="h-4 w-4 text-brand-red" />
                    <h3 class="font-display text-sm tracking-display text-white uppercase">Ride Feedback</h3>
                  </div>
                  <div class="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                    <div v-for="row in feedbackRows(b)" :key="row.label" :class="row.full ? 'sm:col-span-2' : ''">
                      <p class="text-[10px] font-display tracking-display text-brand-grey uppercase">{{ row.label }}</p>
                      <p class="mt-0.5 text-sm whitespace-pre-line text-white">{{ row.value }}</p>
                    </div>
                  </div>
                </section>

                <section class="rounded-lg border border-brand-grey/10 bg-white/[0.02] p-4 sm:p-5">
                  <div class="mb-4 flex items-center gap-2">
                    <Activity class="h-4 w-4 text-brand-red" />
                    <h3 class="font-display text-sm tracking-display text-white uppercase">Admin Updates</h3>
                  </div>
                  <ol v-if="activityEvents(b).length" class="relative space-y-5">
                    <li v-for="(ev, i) in activityEvents(b)" :key="i" class="relative flex gap-4">
                      <div class="flex flex-col items-center">
                        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-grey/15 bg-white/[0.03]" :class="ev.color">
                          <component :is="activityIcon(ev.type)" class="h-4 w-4" />
                        </div>
                        <div v-if="i < activityEvents(b).length - 1" class="mt-1 w-0.5 flex-1 bg-brand-grey/15" />
                      </div>
                      <div class="min-w-0 pb-1">
                        <p class="text-sm font-medium text-white">{{ ev.title }}</p>
                        <p class="mt-0.5 text-xs text-brand-grey/60">
                          {{ formatDateTime(ev.date) }}<span v-if="ev.staff" class="ml-2">by {{ ev.staff }}</span>
                        </p>
                        <p v-if="ev.note" class="mt-1.5 text-xs text-brand-grey/80">{{ ev.note }}</p>
                      </div>
                    </li>
                  </ol>
                  <p v-else class="text-sm text-brand-grey/70">No updates recorded yet.</p>
                </section>

                <section class="rounded-lg border border-brand-grey/10 bg-white/[0.02] p-4 sm:p-5">
                  <div class="mb-4 flex items-center gap-2">
                    <Zap class="h-4 w-4 text-brand-red" />
                    <h3 class="font-display text-sm tracking-display text-white uppercase">Quick Actions</h3>
                  </div>
                  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <Button v-if="canReschedule(b)" variant="secondary" @click="reschedule(b)"><CalendarPlus class="h-4 w-4" />Reschedule Test Ride</Button>
                    <Button v-if="canCancel(b)" variant="danger" :disabled="cancelling[b.id]" @click="cancelRide(b)"><X class="h-4 w-4" />{{ cancelling[b.id] ? 'Cancelling...' : 'Cancel Request' }}</Button>
                    <Button variant="ghost" @click="downloadConfirmation(b)"><Download class="h-4 w-4" />Download Confirmation</Button>
                    <Button variant="ghost" to="/contact"><Phone class="h-4 w-4" />Contact Sales Team</Button>
                    <Button to="/service/test-ride"><Plus class="h-4 w-4" />Book Another Test Ride</Button>
                    <NuxtLink v-if="matchedBike(b)?.slug" :to="`/motorcycles/${matchedBike(b).slug}`">
                      <Button variant="ghost" class="w-full"><Eye class="h-4 w-4" />View Motorcycle Details</Button>
                    </NuxtLink>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>

    <Teleport to="body">
      <div v-if="preview" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" @click.self="preview = null">
        <div class="relative max-h-full w-full max-w-4xl overflow-auto">
          <img :src="fileUrl(preview.ride, preview.file)" class="mx-auto max-h-[80vh] w-auto max-w-full rounded-lg border border-brand-grey/30 object-contain" />
          <div class="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Button size="sm" class="h-11 sm:h-9" variant="ghost" @click="preview = null">Close</Button>
            <a :href="fileUrl(preview.ride, preview.file)" target="_blank" rel="noopener" download>
              <Button size="sm" class="h-11 sm:h-9"><Download class="h-4 w-4" />Download</Button>
            </a>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {
  Search, Bike, CalendarClock, CalendarPlus, Clock, History, Info, Activity, Star,
  MapPin, Phone, Plus, Zap, Users, Download, Eye, FileText, CircleCheck, Minus,
  ChevronDown, Check, X, Wrench, ClipboardCheck, UserCheck, Flag, MessageSquare,
} from 'lucide-vue-next'
import { motion } from 'motion-v'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'
import { formatDate, formatTime, formatDateTime } from '~/composables/useFormat'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['customer'] })
useHead({ title: 'My Test Rides - Nairobi Powerbikes' })

type Ride = Record<string, any>

const pb = usePB()
const auth = useAuthStore()
const toast = useToast()
const loading = ref(true)
const allTestRides = ref<Ride[]>([])
const searchQuery = ref('')
const statusFilter = ref('')
const sortOrder = ref('newest')
const expanded = ref<Record<string, boolean>>({})
const cancelling = ref<Record<string, boolean>>({})
const preview = ref<{ ride: Ride; file: string } | null>(null)
const bikesMap = ref<Record<string, Ride>>({})

const STATUS: Record<string, { label: string; classes: string; dot: string; blocked?: string }> = {
  pending: { label: 'Pending', classes: 'bg-amber-500/15 text-amber-400 border-amber-500/30', dot: 'bg-amber-400' },
  confirmed: { label: 'Confirmed', classes: 'bg-sky-500/15 text-sky-400 border-sky-500/30', dot: 'bg-sky-400' },
  awaiting_verification: { label: 'Awaiting Verification', classes: 'bg-blue-500/15 text-blue-400 border-blue-500/30', dot: 'bg-blue-400' },
  ready: { label: 'Ready', classes: 'bg-teal-500/15 text-teal-400 border-teal-500/30', dot: 'bg-teal-400' },
  checked_in: { label: 'Checked In', classes: 'bg-violet-500/15 text-violet-400 border-violet-500/30', dot: 'bg-violet-400' },
  in_progress: { label: 'In Progress', classes: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', dot: 'bg-cyan-400' },
  completed: { label: 'Completed', classes: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', dot: 'bg-emerald-400' },
  cancelled: { label: 'Cancelled', classes: 'bg-red-500/15 text-red-400 border-red-500/30', dot: 'bg-red-400', blocked: 'This test ride was cancelled' },
  rejected: { label: 'Rejected', classes: 'bg-rose-500/15 text-rose-400 border-rose-500/30', dot: 'bg-rose-400', blocked: 'This test ride request was rejected' },
  no_show: { label: 'No Show', classes: 'bg-stone-500/15 text-stone-400 border-stone-500/30', dot: 'bg-stone-400', blocked: 'This test ride was marked as no show' },
  rescheduled: { label: 'Rescheduled', classes: 'bg-purple-500/15 text-purple-400 border-purple-500/30', dot: 'bg-purple-400' },
}

const STAGES = [
  { key: 'pending', label: 'Request Submitted' },
  { key: 'awaiting_verification', label: 'Request Reviewed' },
  { key: 'confirmed', label: 'Ride Confirmed' },
  { key: 'reminder', label: 'Reminder Sent' },
  { key: 'checked_in', label: 'Customer Checked In' },
  { key: 'in_progress', label: 'Test Ride Started' },
  { key: 'completed', label: 'Test Ride Completed' },
  { key: 'follow_up', label: 'Follow-up Completed' },
]

const STAGE_INDEX: Record<string, number> = {
  pending: 0, awaiting_verification: 1, confirmed: 2, rescheduled: 2, ready: 3,
  checked_in: 4, in_progress: 5, completed: 6, cancelled: -1, rejected: -1, no_show: -1,
}

function has(v: any) {
  if (v === null || v === undefined) return false
  if (typeof v === 'string') return v.trim() !== ''
  if (Array.isArray(v)) return v.length > 0
  return true
}

function pick(b: Ride, keys: string[]) {
  for (const k of keys) {
    if (has(b[k])) return b[k]
  }
  return ''
}

function statusMeta(s: string) {
  return STATUS[s] || { label: s || 'Unknown', classes: 'bg-brand-grey/15 text-brand-grey border-brand-grey/30', dot: 'bg-brand-grey' }
}

function rideRef(b: Ride) {
  return `TR-${(b.id || '').slice(-6).toUpperCase()}`
}

function toggleExpand(id: string) {
  expanded.value[id] = !expanded.value[id]
}

function matchedBike(b: Ride) {
  return bikesMap.value[String(b.motorcycle || '').trim().toLowerCase()] || null
}

function bikeImage(b: Ride) {
  const bk = matchedBike(b)
  const imgs = bk?.images
  if (!bk || !imgs || !imgs.length) return ''
  return pb.files.getURL(bk, imgs[0])
}

function motorcycleTitle(b: Ride) {
  const bk = matchedBike(b)
  if (bk) {
    const brand = bk.expand?.brand?.name
    return brand ? `${brand} ${bk.name}` : bk.name
  }
  return b.motorcycle || 'Test Ride'
}

function buildRows(b: Ride, defs: [string, string[]][]) {
  const rows: { label: string; value: string; full?: boolean }[] = []
  for (const [label, keys] of defs) {
    const raw = pick(b, keys)
    if (!has(raw)) continue
    let value = String(raw)
    const k = keys[0]
    if (/date$/.test(k)) value = formatDate(value)
    else if (/time$/.test(k)) value = formatTime(value)
    rows.push({ label, value })
  }
  return rows
}

function motorRows(b: Ride) {
  const bk = matchedBike(b)
  if (!bk) return []
  const rows: { label: string; value: string }[] = []
  const brand = bk.expand?.brand?.name
  if (has(brand)) rows.push({ label: 'Manufacturer', value: String(brand) })
  if (has(bk.name)) rows.push({ label: 'Model', value: String(bk.name) })
  if (has(bk.year)) rows.push({ label: 'Year', value: String(bk.year) })
  const engine = has(bk.engine_cc) ? bk.engine_cc : bk.engine
  if (has(engine)) rows.push({ label: 'Engine Capacity', value: String(engine) })
  const category = bk.expand?.category?.name
  if (has(category)) rows.push({ label: 'Category', value: String(category) })
  return rows
}

function customerRows(b: Ride) {
  const defs: [string, string[]][] = [
    ['Full Name', ['name']],
    ['Email', ['email']],
    ['Phone Number', ['phone']],
    ['Preferred Contact Method', ['preferred_contact', 'contact_method']],
  ]
  return buildRows(b, defs)
}

function rideRows(b: Ride) {
  const defs: [string, string[]][] = [
    ['Preferred Branch', ['branch']],
    ['Preferred Date', ['preferred_date']],
    ['Preferred Time', ['preferred_time']],
    ['Alternative Date', ['alternative_date', 'alt_date']],
    ['Alternative Time', ['alternative_time', 'alt_time']],
    ['Riding Experience', ['ride_experience', 'riding_experience', 'experience']],
    ['Motorcycle Licence Category', ['licence_category', 'license_category', 'licence_type']],
    ['Years of Riding Experience', ['years_riding', 'riding_years', 'years_experience']],
    ['Previous Motorcycle Owned', ['previous_motorcycle', 'previous_bike']],
    ['Purpose of Test Ride', ['purpose', 'purpose_of_ride']],
  ]
  return buildRows(b, defs)
}

function extraRows(b: Ride) {
  const defs: [string, string[]][] = [
    ['Questions', ['questions']],
    ['Special Requests', ['special_requests', 'requests']],
    ['Additional Comments', ['additional_comments', 'comments']],
    ['Additional Notes', ['notes']],
  ]
  return buildRows(b, defs).map(r => ({ ...r, full: true }))
}

function apptRows(b: Ride) {
  const defs: [string, string[]][] = [
    ['Assigned Branch', ['branch']],
    ['Assigned Sales Representative', ['assigned_to']],
    ['Scheduled Date', ['preferred_date']],
    ['Scheduled Time', ['preferred_time']],
    ['Meeting Point', ['meeting_point', 'meet_point']],
    ['Estimated Ride Duration', ['duration', 'estimated_duration']],
  ]
  return buildRows(b, defs)
}

function currentStageIndex(b: Ride) {
  return STAGE_INDEX[b.status] ?? -1
}

function stageState(b: Ride, i: number) {
  const idx = currentStageIndex(b)
  if (statusMeta(b.status).blocked) return 'pending'
  if (i < idx) return 'done'
  if (i === idx) return 'current'
  return 'pending'
}

function stageDotClass(b: Ride, i: number) {
  const state = stageState(b, i)
  if (state === 'done') return 'border-emerald-500/60 bg-emerald-500/15 text-emerald-400'
  if (state === 'current') return 'border-brand-red bg-brand-red/15 text-brand-red ring-4 ring-brand-red/10'
  return 'border-brand-grey/25 bg-brand-black text-brand-grey/50'
}

function stageTime(b: Ride, i: number) {
  const idx = currentStageIndex(b)
  if (i === 0 && b.created) return formatDateTime(b.created)
  if (i === idx && b.updated && b.updated !== b.created) return formatDateTime(b.updated)
  return ''
}

function checklistItems(b: Ride) {
  const items: { label: string; done: boolean }[] = [
    { label: 'Identity Verified', done: has(b.id_document) },
    { label: 'Driving Licence Verified', done: has(b.drivers_license) },
  ]
  const extra: [string, string][] = [
    ['waiver_signed', 'Waiver Signed'],
    ['safety_briefing', 'Safety Briefing Completed'],
    ['helmet_provided', 'Helmet Provided'],
    ['protective_gear', 'Protective Gear Issued'],
  ]
  for (const [key, label] of extra) {
    const v = b[key]
    if (v === undefined || v === null) continue
    const done = v === true || ['yes', 'done', 'completed'].includes(String(v).toLowerCase())
    items.push({ label, done })
  }
  return items
}

function docFiles(b: Ride) {
  const docs: { file: string; name: string }[] = []
  if (has(b.id_document)) docs.push({ file: b.id_document, name: 'ID Document' })
  if (has(b.drivers_license)) docs.push({ file: b.drivers_license, name: "Driver's License" })
  const extra = ['waiver', 'insurance_document', 'identification_document']
  for (const key of extra) {
    if (has(b[key])) docs.push({ file: b[key], name: String(key).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) })
  }
  return docs
}

function isImage(filename: string) {
  return /\.(jpe?g|png|webp|gif|avif)$/i.test(String(filename))
}

function fileUrl(b: Ride, file: string) {
  return pb.files.getURL(b, file)
}

function feedbackRows(b: Ride) {
  const defs: [string, string[]][] = [
    ['Customer Rating', ['rating', 'customer_rating']],
    ['Customer Review', ['review', 'customer_review']],
    ['Sales Representative Notes', ['sales_notes', 'sales_representative_notes']],
    ['Customer Interested In Purchase', ['interested', 'customer_interested']],
    ['Recommended Follow-up', ['recommended_follow_up', 'follow_up']],
  ]
  return buildRows(b, defs).map(r => {
    if (r.label === 'Customer Interested In Purchase') {
      return { ...r, value: r.value.toLowerCase() === 'yes' ? 'Yes' : r.value.toLowerCase() === 'no' ? 'No' : r.value }
    }
    if (r.label === 'Customer Rating') return { ...r, value: `${r.value} / 5` }
    return r
  })
}

function activityIcon(type: string) {
  const icons: Record<string, object> = {
    received: CalendarPlus, confirmed: CircleCheck, arrived: UserCheck,
    started: Flag, completed: Flag, cancelled: X, rejected: X, reminder: MessageSquare,
  }
  return icons[type] || Wrench
}

function statusChanged(b: Ride) {
  return !!b.updated && !!b.created && new Date(b.updated).getTime() - new Date(b.created).getTime() > 1000
}

function activityEvents(b: Ride) {
  const events: { type: string; title: string; date: string; staff?: string; note?: string; color: string }[] = []
  const staff = b.assigned_to || undefined
  const changed = statusChanged(b)
  if (b.created) {
    events.push({ type: 'received', title: 'Request received', date: b.created, color: 'text-brand-grey' })
  }
  if (changed && currentStageIndex(b) >= 2 && b.status !== 'cancelled' && b.status !== 'rejected') {
    events.push({ type: 'confirmed', title: 'Booking confirmed', date: b.updated, staff, color: 'text-sky-400' })
  }
  if (b.status === 'reminder_sent' || b.status === 'reminder') {
    events.push({ type: 'reminder', title: 'Reminder sent', date: b.updated || b.created, staff, color: 'text-amber-400' })
  }
  if (changed && currentStageIndex(b) >= 4) {
    events.push({ type: 'arrived', title: 'Customer arrived', date: b.updated, staff, color: 'text-violet-400' })
  }
  if (changed && currentStageIndex(b) >= 5 && b.status !== 'completed') {
    events.push({ type: 'started', title: 'Test ride started', date: b.updated, staff, color: 'text-cyan-400' })
  }
  if (b.status === 'completed') {
    events.push({ type: 'completed', title: 'Ride completed', date: b.updated || b.created, staff, color: 'text-emerald-400' })
  }
  if (b.status === 'cancelled') {
    events.push({ type: 'cancelled', title: 'Request cancelled', date: b.updated || b.created, staff, color: 'text-red-400' })
  }
  if (b.status === 'rejected') {
    events.push({ type: 'rejected', title: 'Request rejected', date: b.updated || b.created, staff, color: 'text-rose-400' })
  }
  if (b.notes && events.length) {
    events[events.length - 1].note = b.notes
  }
  return events
}

function canReschedule(b: Ride) {
  return ['pending', 'awaiting_verification', 'confirmed'].includes(b.status)
}

function canCancel(b: Ride) {
  return ['pending', 'awaiting_verification', 'confirmed', 'rescheduled'].includes(b.status)
}

function reschedule(b: Ride) {
  toast.add({ type: 'info', title: 'Reschedule test ride', message: `Book a new time slot for ${rideRef(b)} and we will handle the rest.` })
  navigateTo(`/service/test-ride${b.motorcycle ? `?motorcycle=${encodeURIComponent(b.motorcycle)}` : ''}`)
}

async function cancelRide(b: Ride) {
  cancelling.value[b.id] = true
  try {
    await pb.collection('test_rides').update(b.id, { status: 'cancelled' })
    toast.add({ type: 'success', title: 'Test ride cancelled', message: `${rideRef(b)} has been cancelled.` })
  } catch (err: any) {
    toast.add({ type: 'error', title: 'Failed to cancel', message: err?.message || 'Something went wrong' })
  } finally {
    cancelling.value[b.id] = false
  }
}

function openPreview(b: Ride, file: string) {
  preview.value = { ride: b, file }
}

function downloadConfirmation(b: Ride) {
  printDocument(`Test Ride Confirmation - ${rideRef(b)}`, b, [
    ...motorRows(b),
    ...customerRows(b),
    ...rideRows(b),
    ...extraRows(b),
    ...apptRows(b),
  ])
}

function escapeHtml(v: string) {
  return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function printDocument(title: string, b: Ride, rows: { label: string; value: string }[]) {
  const lines = [
    ...rows.map(r => `<tr><td style="padding:8px 10px;border:1px solid #ddd;color:#555;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">${escapeHtml(r.label)}</td><td style="padding:8px 10px;border:1px solid #ddd;font-weight:600;">${escapeHtml(r.value)}</td></tr>`),
  ].join('')
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>
    body{font-family:Arial,Helvetica,sans-serif;color:#111;max-width:720px;margin:0 auto;padding:40px 24px;}
    .hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #dc2626;padding-bottom:16px;}
    .brand{font-size:22px;font-weight:800;letter-spacing:1px;color:#111;}
    .brand span{color:#dc2626;}
    .doc{font-size:12px;color:#555;text-align:right;text-transform:uppercase;letter-spacing:1px;}
    .ref{font-size:13px;color:#555;margin:6px 0 0;}
    .meta{display:flex;gap:24px;font-size:12px;color:#555;margin:8px 0 20px;}
    table{width:100%;border-collapse:collapse;margin-top:8px;}
    th{text-align:left;padding:8px 10px;border:1px solid #ddd;background:#fafafa;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#111;}
    .foot{margin-top:28px;font-size:11px;color:#888;border-top:1px solid #ddd;padding-top:12px;text-align:center;}
  </style></head><body>
    <div class="hdr">
      <div>
        <div class="brand">NAIROBI <span>POWERBIKES</span></div>
        <div class="ref">Ref: ${escapeHtml(rideRef(b))}</div>
      </div>
      <div class="doc">${escapeHtml(title)}</div>
    </div>
    <div class="meta">
      <span>Customer: ${escapeHtml(b.name || auth.user?.name || '')}</span>
      <span>Email: ${escapeHtml(b.email || auth.user?.email || '')}</span>
      <span>Phone: ${escapeHtml(b.phone || '')}</span>
      <span>Branch: ${escapeHtml(b.branch || '')}</span>
      <span>Submitted: ${escapeHtml(b.created ? formatDateTime(b.created) : '')}</span>
    </div>
    <table><thead><tr><th style="width:45%;">Item</th><th>Details</th></tr></thead><tbody>${lines}</tbody></table>
    <div class="foot">Nairobi Powerbikes &middot; DTB Centre Annex 2, Mombasa Road, Nairobi &middot; +254 712 345 678</div>
  </body></html>`
  const w = window.open('', '_blank', 'width=820,height=960')
  if (!w) return
  w.document.write(html)
  w.document.close()
  w.focus()
  setTimeout(() => w.print(), 300)
}

const summary = computed(() => {
  const rides = allTestRides.value
  return {
    upcoming: rides.filter(b => ['confirmed', 'ready', 'checked_in', 'in_progress', 'rescheduled'].includes(b.status)).length,
    pending: rides.filter(b => ['pending', 'awaiting_verification'].includes(b.status)).length,
    completed: rides.filter(b => b.status === 'completed').length,
    cancelled: rides.filter(b => ['cancelled', 'rejected', 'no_show'].includes(b.status)).length,
  }
})

const SUMMARY_CARDS = computed(() => [
  { key: 'upcoming', label: 'Upcoming Test Rides', desc: 'Scheduled rides and rides in progress', icon: CalendarClock, iconBg: 'bg-sky-500/15', iconColor: 'text-sky-400', count: summary.value.upcoming },
  { key: 'pending', label: 'Pending Requests', desc: 'Awaiting confirmation from our team', icon: Clock, iconBg: 'bg-amber-500/15', iconColor: 'text-amber-400', count: summary.value.pending },
  { key: 'completed', label: 'Completed Test Rides', desc: 'Rides you have completed', icon: CircleCheck, iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400', count: summary.value.completed },
  { key: 'cancelled', label: 'Cancelled Requests', desc: 'Rides that were cancelled or rejected', icon: X, iconBg: 'bg-red-500/15', iconColor: 'text-red-400', count: summary.value.cancelled },
])

const filtered = computed(() => {
  let list = [...allTestRides.value]
  if (statusFilter.value) list = list.filter(b => b.status === statusFilter.value)
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(b => {
      const refText = rideRef(b)
      const bike = matchedBike(b)
      const manufacturer = bike?.expand?.brand?.name || ''
      const hay = [refText, b.name, b.email, b.phone, b.motorcycle, manufacturer, statusMeta(b.status).label, b.branch]
        .filter(Boolean).join(' ').toLowerCase()
      return hay.includes(q)
    })
  }
  list.sort((a, b) => {
    const ta = new Date(a.created).getTime()
    const tb = new Date(b.created).getTime()
    return sortOrder.value === 'oldest' ? ta - tb : tb - ta
  })
  return list
})

function handleRealtime(e: any) {
  const record = e.record as Ride
  const userId = auth.user?.id
  if (record.user !== userId) return
  if (e.action === 'delete') {
    allTestRides.value = allTestRides.value.filter(b => b.id !== record.id)
  } else {
    const idx = allTestRides.value.findIndex(b => b.id === record.id)
    if (idx >= 0) {
      allTestRides.value[idx] = { ...allTestRides.value[idx], ...record }
      allTestRides.value = [...allTestRides.value]
    } else {
      allTestRides.value = [record, ...allTestRides.value]
    }
  }
}

async function loadBikes() {
  try {
    const list = await pb.collection('motorcycles').getFullList<Ride>({ expand: 'brand,category' })
    const map: Record<string, Ride> = {}
    for (const bk of list) {
      map[String(bk.name || '').trim().toLowerCase()] = bk
    }
    bikesMap.value = map
  } catch { /* bikes lookup is best-effort */ }
}

onMounted(async () => {
  loadBikes()
  try {
    const uid = auth.user?.id
    const res = await pb.collection('test_rides').getList(1, 100, {
      filter: `user = "${uid}"`,
      sort: '-created',
    }).catch(() => ({ items: [] }))
    allTestRides.value = res.items as Ride[]
    if (uid) {
      pb.collection('test_rides').subscribe('*', handleRealtime, { filter: `user = "${uid}"` })
    }
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})

onUnmounted(() => {
  pb.collection('test_rides').unsubscribe('*')
})
</script>
