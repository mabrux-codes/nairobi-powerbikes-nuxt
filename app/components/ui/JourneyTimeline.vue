<template>
  <div class="relative">
    <!-- Skeleton -->
    <div v-if="loading" class="space-y-6">
      <div v-for="i in 4" :key="i" class="h-28 animate-pulse rounded-2xl bg-white/[0.04]" />
    </div>

    <!-- Timeline -->
    <div v-else class="relative mx-auto max-w-5xl">
      <!-- Connecting line -->
      <div
        class="absolute bottom-4 top-2 w-[3px] rounded-full bg-gradient-to-b from-brand-red/60 via-brand-red/15 to-transparent left-[22px] md:left-1/2 md:-translate-x-1/2"
        aria-hidden="true"
      />

      <div class="space-y-10 md:space-y-14">
        <div
          v-for="(ms, i) in milestones"
          :key="ms.year + ms.title"
          class="relative"
        >
          <!-- Node marker on the line -->
          <span
            class="absolute top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300"
            :class="[
              'left-0 md:left-1/2 md:-translate-x-1/2',
              'border-brand-red/50 bg-brand-black shadow-lg shadow-brand-red/20',
            ]"
            :aria-hidden="true"
          >
            <component :is="iconFor(ms, i)" class="h-5 w-5 text-brand-red" />
          </span>

          <!-- Card: alternating sides on desktop, right-aligned on mobile -->
          <motion.div
            :class="[
              'ml-16 md:ml-0 md:w-[calc(50%-3.5rem)]',
              i % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto',
            ]"
            :initial="{ opacity: 0, y: 32, x: i % 2 === 0 ? -24 : 24 }"
            :while-in-view="{ opacity: 1, y: 0, x: 0 }"
            :viewport="{ once: true, margin: '-60px' }"
            :transition="{ duration: 0.55, ease: 'easeOut', delay: (i % 3) * 0.06 }"
          >
            <div
              class="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-red/50 hover:shadow-[0_20px_45px_-20px_rgba(214,0,28,0.4)] sm:p-7"
            >
              <div
                class="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-brand-red/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
              />

              <div class="relative">
                <!-- Year badge -->
                <span
                  class="inline-flex items-center gap-2 rounded-full border border-brand-red/40 bg-brand-red/10 px-3.5 py-1 font-display text-xs font-bold tracking-[0.18em] text-brand-red uppercase"
                >
                  <CalendarDays class="h-3.5 w-3.5" />
                  {{ ms.year }}
                </span>

                <h3 class="mt-3.5 font-display text-xl font-bold tracking-display text-white transition-colors duration-300 group-hover:text-brand-red">
                  {{ ms.title }}
                </h3>

                <p class="mt-2 text-sm leading-relaxed text-brand-grey">
                  {{ ms.description || ms.desc }}
                </p>

                <!-- Progress accent -->
                <div class="mt-5 h-0.5 w-12 rounded-full bg-gradient-to-r from-brand-red to-transparent transition-all duration-500 group-hover:w-full" aria-hidden="true" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { Flag, Handshake, Building2, Wrench, MapPin, Rocket, Trophy, CalendarDays } from 'lucide-vue-next'

interface Milestone { id?: string; year: string; title: string; description?: string; desc?: string; display_order?: number }

withDefaults(defineProps<{
  milestones: Milestone[]
  loading?: boolean
}>(), { loading: false })

const iconPools = [
  [Flag, Building2, Handshake, Wrench, MapPin, Rocket],
  [Trophy, Rocket, Building2, Handshake, Wrench, MapPin],
]

function iconFor(ms: Milestone, i: number): any {
  const title = (ms.title || '').toLowerCase()
  const kw: Array<[RegExp, any]> = [
    [/begin|start|humble|found/i, Flag],
    [/partnership|partner|dealership|official/i, Handshake],
    [/showroom|expansion|grow|expanded/i, Building2],
    [/service|workshop|maintenance|network/i, Wrench],
    [/branch|hub|open/i, MapPin],
    [/digital|platform|online|launch|transformation/i, Rocket],
  ]
  for (const [re, icon] of kw) if (re.test(title)) return icon
  return iconPools[i % 2][i % iconPools[0].length]
}
</script>