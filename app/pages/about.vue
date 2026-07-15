<template>
  <div class="min-h-screen bg-brand-black pt-24">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.section class="relative mb-16 overflow-hidden rounded-sm" :initial="{ opacity: 0, y: 40 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6 }">
        <div class="carbon-fiber absolute inset-0" />
        <div class="relative z-10 px-8 py-16 sm:px-12 sm:py-20">
          <h1 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl">About Nairobi<br /><span class="text-brand-red">Powerbikes</span></h1>
          <p class="mt-4 max-w-2xl text-lg text-brand-grey">Nairobi's premier destination for premium motorcycles, expert service, and riding culture since 2017.</p>
        </div>
      </motion.section>

      <div class="grid gap-12 lg:grid-cols-2">
        <motion.div :initial="{ opacity: 0, x: -30 }" :animate="{ opacity: 1, x: 0 }" :transition="{ delay: 0.2, duration: 0.6 }">
          <h2 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl">Our Story</h2>
          <div class="mt-2 h-1 w-24 bg-brand-red" />
          <p class="mt-6 leading-relaxed text-brand-grey">Founded in 2017, Nairobi Powerbikes LTD has evolved from a modest Motorcycle Accessories Dealer into one of Kenya's foremost Motorcycle Dealerships. Through strategic global partnerships, we proudly offer the most affordable and highest quality motorcycles in East Africa.</p>
          <p class="mt-4 leading-relaxed text-brand-grey">But we're more than just a dealership. Nairobi Powerbikes LTD is a vibrant community that brings together riders, explorers, and gearheads alike. Whether you're a seasoned rider or just starting out, we're passionate about fueling your love for motorcycles and providing a hub for connection, learning, and sharing experiences.</p>
        </motion.div>
        <motion.div class="grid grid-cols-2 gap-4" :initial="{ opacity: 0, x: 30 }" :animate="{ opacity: 1, x: 0 }" :transition="{ delay: 0.3, duration: 0.6 }">
          <div v-for="(v, i) in visionValues" :key="i" class="rounded-sm border border-brand-grey/10 bg-brand-black/60 p-5">
            <component :is="v.icon" class="mb-3 h-6 w-6 text-brand-red" />
            <h3 class="font-display text-lg tracking-[var(--tracking-display)] text-white">{{ v.title }}</h3>
            <p class="mt-1 text-xs text-brand-grey">{{ v.desc }}</p>
          </div>
        </motion.div>
      </div>

      <motion.section ref="journeySection" class="mt-20" :initial="{ opacity: 0, y: 40 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.4, duration: 0.5 }">
        <h2 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl text-center">Our Journey</h2>
        <div class="mt-2 mx-auto h-1 w-24 bg-brand-red" />
        <div v-if="milestoneLoading" class="mt-8 animate-pulse space-y-8">
          <div v-for="i in 4" :key="i" class="h-20 rounded-sm bg-brand-grey/10" />
        </div>
        <div v-else class="mt-8 relative">
          <div ref="timelineLine" class="absolute left-4 top-0 bottom-0 w-0.5 bg-brand-grey/20 lg:left-1/2 lg:-translate-x-px" />
          <div class="space-y-12">
            <div v-for="(ms, i) in milestones" :key="i" ref="milestoneRefs" class="milestone-item relative pl-12 lg:pl-0 lg:grid lg:grid-cols-2" :class="{ 'animate-on-scroll': true }">
              <div v-if="i % 2 === 0" class="hidden lg:block" />
              <div :class="i % 2 === 0 ? 'lg:col-start-2 lg:pl-12' : 'lg:pr-12 lg:text-right'">
                <motion.div class="milestone-card rounded-sm border border-brand-grey/10 bg-brand-black/60 p-5" :initial="{ opacity: 0, y: 24 }" :while-in-view="{ opacity: 1, y: 0 }" :viewport="{ once: true, margin: '-50px' }" :transition="{ delay: 0.15, duration: 0.5 }">
                  <span class="text-xs font-display tracking-display text-brand-red">{{ ms.year }}</span>
                  <h3 class="mt-1 font-display text-lg tracking-[var(--tracking-display)] text-white">{{ ms.title }}</h3>
                  <p class="mt-1 text-sm text-brand-grey">{{ ms.desc }}</p>
                </motion.div>
              </div>
              <div v-if="i % 2 !== 0" class="hidden lg:block" />
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section class="mt-20" :initial="{ opacity: 0, y: 40 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.5, duration: 0.5 }">
        <h2 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl text-center">By the Numbers</h2>
        <div class="mt-2 mx-auto h-1 w-24 bg-brand-red" />
        <div class="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatedCounter v-for="stat in stats" :key="stat.label" :target="stat.value" :suffix="stat.suffix" :label="stat.label" :duration="2" />
        </div>
      </motion.section>

      <motion.section class="mt-20" :initial="{ opacity: 0, y: 40 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.6, duration: 0.5 }">
        <h2 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl text-center">Meet Our <span class="text-brand-red">Team</span></h2>
        <div class="mt-2 mx-auto h-1 w-24 bg-brand-red" />
        <div v-if="teamLoading" class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="i in 4" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-5"><div class="mx-auto mb-4 aspect-square w-32 rounded-full bg-brand-grey/10" /><div class="mx-auto h-5 w-3/4 rounded bg-brand-grey/10" /><div class="mx-auto mt-2 h-4 w-1/2 rounded bg-brand-grey/10" /></div>
        </div>
        <div v-else-if="team.length" class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div v-for="(member, i) in team" :key="member.id" class="group rounded-sm border border-brand-grey/10 bg-brand-black/60 p-6 text-center transition-all duration-300 hover:border-brand-red/30"
            :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: i * 0.08, duration: 0.4 }">
            <div class="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-grey/20 to-brand-black ring-2 ring-brand-grey/10">
              <span class="font-display text-3xl text-brand-grey/40">{{ getInitials(member.name) }}</span>
            </div>
            <h3 class="font-display text-lg tracking-[var(--tracking-display)] text-white">{{ member.name }}</h3>
            <p class="text-xs font-display tracking-display text-brand-red uppercase">{{ member.role }}</p>
            <p v-if="member.bio" class="mt-2 text-xs text-brand-grey leading-relaxed">{{ member.bio }}</p>
          </motion.div>
        </div>
        <div v-else class="mt-8 rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">
          <p class="font-display text-2xl tracking-display text-brand-grey">Team Coming Soon</p>
          <p class="mt-2 text-sm text-brand-grey/60">We're building our dream team</p>
        </div>
      </motion.section>
    </div>
  </div>
</template>
<script setup lang="ts">
import { motion } from 'motion-v'
import { Eye, Heart, Target, Handshake } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'

interface TeamMember { id: string; name: string; role: string; bio?: string }
interface Milestone { id?: string; year: string; title: string; description: string; display_order?: number }

useHead({ title: 'About Us - Nairobi Powerbikes', meta: [{ name: 'description', content: "Learn about Nairobi Powerbikes' story, mission, team, and journey. Nairobi's premier motorcycle dealership since 2017." }] })

const pb = usePB()
const teamLoading = ref(true); const team = ref<TeamMember[]>([])
const milestoneLoading = ref(true); const milestones = ref<Milestone[]>([])

const visionValues = [
  { title: 'Our Vision', desc: "To become East Africa's premier destination for affordable Power Bikes & Accessories, taking the spirit of riding to exhilarating new heights.", icon: Eye },
  { title: 'Our Mission', desc: 'To inspire and empower motorcycle enthusiasts of all levels — offering sales, comprehensive servicing, spare parts, stylish apparel, and a thriving community hub.', icon: Target },
  { title: 'Our Passion', desc: 'We live and breathe motorcycling. Every decision is driven by our love for two wheels and the open road.', icon: Heart },
  { title: 'Our Promise', desc: 'Integrity, transparency, and excellence in everything we do. No shortcuts, no compromises.', icon: Handshake },
]

const defaultMilestones: Milestone[] = [
  { year: '2017', title: 'Humble Beginnings', description: 'Nairobi Powerbikes LTD starts as a modest Motorcycle Accessories Dealer in Nairobi.' },
  { year: '2019', title: 'Brand Partnerships', description: 'Secured official dealership agreements with leading global motorcycle brands.' },
  { year: '2020', title: 'Showroom Expansion', description: 'Expanded to a full-fledged dealership with an expansive showroom in Nairobi.' },
  { year: '2021', title: 'Service Network', description: 'Launched our second branch in Westlands with a full-service workshop.' },
  { year: '2023', title: 'Mombasa Road Hub', description: 'Opened our third branch, adding dedicated test ride tracks and gear shop.' },
  { year: '2025', title: 'Digital Transformation', description: 'Launched our online platform for seamless browsing, booking, and financing.' },
]

const stats = ref([{ value: 5000, suffix: '+', label: 'Bikes Sold' }, { value: 12, suffix: '', label: 'Brands' }, { value: 15000, suffix: '+', label: 'Services Done' }, { value: 98, suffix: '%', label: 'Satisfaction' }])

function getInitials(name: string): string { return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() }

onMounted(async () => {
  try {
    const [teamRes, statsRes, milestonesRes] = await Promise.all([
      pb.collection('team_members').getFullList<TeamMember>({ sort: 'sort_order,name' }).catch(() => []),
      pb.collection('company_stats').getList(1, 10, { sort: 'sort_order' }).catch(() => ({ items: [] })),
      pb.collection('timeline_milestones').getFullList<Milestone>({ sort: 'display_order' }).catch(() => [] as Milestone[]),
    ])
    team.value = teamRes
    if ((statsRes as any).items?.length) stats.value = (statsRes as any).items.map((s: any) => ({ value: s.value, suffix: s.suffix || '', label: s.label }))
    milestones.value = milestonesRes.length ? milestonesRes : defaultMilestones
  } catch {}
  finally { teamLoading.value = false; milestoneLoading.value = false }
})
</script>
