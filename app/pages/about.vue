<template>
  <div class="min-h-screen bg-brand-black pb-24">
    <PageHeader
      eyebrow="Our Story"
      title="About Nairobi"
      accent="Powerbikes"
      description="From a modest accessories dealer in 2017 to East Africa's premier motorcycle destination — powered by a community that lives for the ride."
    >
      <template #actions>
        <Button to="/motorcycles" variant="primary" size="lg" trailing-arrow>Explore Bikes</Button>
        <Button to="/contact" variant="secondary" size="lg"><Phone class="h-5 w-5" />Talk to Us</Button>
      </template>
    </PageHeader>

    <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
      <!-- Our story -->
      <div class="mt-16 grid gap-12 lg:grid-cols-2 lg:items-center">
        <motion.div :initial="{ opacity: 0, x: -30 }" :animate="{ opacity: 1, x: 0 }" :transition="{ delay: 0.1, duration: 0.6 }">
          <span class="font-display text-xs font-bold tracking-[0.3em] text-brand-red uppercase">Who We Are</span>
          <h2 class="mt-2 font-heading text-4xl text-white sm:text-5xl">Our Story</h2>
          <div class="mt-4 h-1 w-24 bg-brand-red" />
          <p class="mt-6 leading-relaxed text-brand-grey">Founded in 2017, Nairobi Powerbikes LTD has evolved from a modest Motorcycle Accessories Dealer into one of Kenya's foremost Motorcycle Dealerships. Through strategic global partnerships, we proudly offer the most affordable and highest quality motorcycles in East Africa.</p>
          <p class="mt-4 leading-relaxed text-brand-grey">But we're more than just a dealership. Nairobi Powerbikes LTD is a vibrant community that brings together riders, explorers, and gearheads alike. Whether you're a seasoned rider or just starting out, we're passionate about fueling your love for motorcycles and providing a hub for connection, learning, and sharing experiences.</p>
          <div class="mt-8 grid grid-cols-3 gap-6">
            <div v-for="s in storyStats" :key="s.label">
              <p class="font-heading text-3xl text-brand-red">{{ s.value }}</p>
              <p class="mt-1 text-xs font-display tracking-display text-brand-grey uppercase">{{ s.label }}</p>
            </div>
          </div>
        </motion.div>
        <div class="relative">
          <motion.div class="carbon-fiber absolute inset-0 rounded-2xl opacity-60" :initial="{ opacity: 0 }" :animate="{ opacity: 0.6 }" :transition="{ delay: 0.3, duration: 0.8 }" />
          <motion.div class="relative z-10 grid grid-cols-2 gap-5 p-1" :initial="{ opacity: 0, scale: 0.96 }" :animate="{ opacity: 1, scale: 1 }" :transition="{ delay: 0.2, duration: 0.5 }">
            <div class="relative overflow-hidden rounded-2xl border border-white/[0.08]">
              <img src="/images/bikes/tekken-2.jpeg" alt="Nairobi Powerbikes showroom" class="aspect-[3/4] h-full w-full object-cover" loading="lazy" />
            </div>
            <div class="mt-12 space-y-5">
              <div class="relative overflow-hidden rounded-2xl border border-brand-red/40">
                <img src="/images/bikes/tekken-3.jpg" alt="Featured motorcycle" class="aspect-[3/4] h-full w-full object-cover" loading="lazy" />
                <div class="absolute inset-0 bg-gradient-to-t from-brand-black/70 to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <!-- Mission / Vision -->
      <div class="mt-20 grid gap-6 lg:grid-cols-4">
        <motion.div
          v-for="(v, i) in visionValues"
          :key="v.title"
          class="group rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1"
          :class="i === 0 ? 'border-brand-red/40 bg-gradient-to-b from-brand-red/10 to-transparent' : 'border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent hover:border-brand-red/30'"
          :initial="{ opacity: 0, y: 30 }" :while-in-view="{ opacity: 1, y: 0 }" :viewport="{ once: true, margin: '-40px' }" :transition="{ delay: i * 0.08, duration: 0.5 }"
        >
          <component :is="v.icon" class="mb-4 h-8 w-8 text-brand-red" />
          <h3 class="font-display text-lg font-bold tracking-[--tracking-display] text-white">{{ v.title }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-brand-grey">{{ v.desc }}</p>
        </motion.div>
      </div>

      <!-- Journey -->
      <div class="mt-24">
        <SectionHeading eyebrow="Milestones" title="Our" accent="Journey" description="Six years of growth, partnerships and unforgettable rides." />
        <div class="mt-12">
          <JourneyTimeline :milestones="milestones" :loading="milestoneLoading" />
        </div>
      </div>

      <!-- Numbers -->
      <div class="mt-24 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-10 sm:p-14">
        <SectionHeading eyebrow="By The Numbers" title="Riding in" accent="Numbers" description="The milestones that prove our commitment to Kenyan riders." />
        <div class="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatedCounter v-for="stat in stats" :key="stat.label" :target="stat.value" :suffix="stat.suffix" :label="stat.label" :duration="2" />
        </div>
      </div>

      <!-- Team -->
      <div class="mt-24">
        <SectionHeading eyebrow="The People" title="Meet Our" accent="Team" description="The riders, mechanics and gearheads keeping Nairobi on two wheels." />
        <div v-if="teamLoading" class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="i in 4" :key="i" class="animate-pulse rounded-2xl border border-white/[0.06] p-6">
            <div class="mx-auto mb-4 h-24 w-24 rounded-full bg-white/[0.06]" />
            <div class="mx-auto h-5 w-3/4 rounded bg-white/[0.06]" />
            <div class="mx-auto mt-2 h-4 w-1/2 rounded bg-white/[0.06]" />
          </div>
        </div>
        <div v-else-if="team.length" class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            v-for="(member, i) in team"
            :key="member.id"
            class="group rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/40"
            :initial="{ opacity: 0, y: 30 }" :while-in-view="{ opacity: 1, y: 0 }" :viewport="{ once: true, margin: '-40px' }" :transition="{ delay: i * 0.08, duration: 0.4 }"
          >
            <div class="relative mx-auto mb-4 h-24 w-24">
              <div class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-grey/20 to-brand-black ring-2 ring-brand-red/20 transition-transform duration-300 group-hover:scale-105">
                <UserRound class="h-9 w-9 text-brand-grey/50" />
              </div>
              <span class="absolute -bottom-1 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-brand-red"><Sword class="h-4 w-4 text-white" /></span>
            </div>
            <h3 class="font-display text-lg font-bold tracking-[--tracking-display] text-white">{{ member.name }}</h3>
            <p class="text-xs font-display font-bold tracking-display text-brand-red uppercase">{{ member.role }}</p>
            <p v-if="member.bio" class="mt-2 text-sm leading-relaxed text-brand-grey">{{ member.bio }}</p>
          </motion.div>
        </div>
        <div v-else class="mt-10 rounded-2xl border border-dashed border-white/[0.12] p-14 text-center">
          <Users class="mx-auto mb-3 h-8 w-8 text-brand-grey/50" />
          <p class="font-display text-2xl tracking-display text-brand-grey">Team Coming Soon</p>
          <p class="mt-2 text-sm text-brand-grey/60">We're building our dream team</p>
        </div>
      </div>

      <!-- CTA -->
      <div class="relative mt-24 overflow-hidden rounded-2xl border border-brand-red/30">
        <div class="carbon-fiber absolute inset-0" />
        <div class="relative z-10 flex flex-col items-center gap-6 px-8 py-16 text-center sm:py-20">
          <h2 class="font-heading text-3xl text-white sm:text-4xl">Ready to Start <span class="text-brand-red">Your Ride?</span></h2>
          <p class="max-w-xl text-brand-grey">Visit our showroom, book a test ride, or talk to our team about the perfect motorcycle for you.</p>
          <div class="flex flex-wrap justify-center gap-4">
            <Button to="/service/test-ride" variant="primary" size="lg"><Bike class="h-5 w-5" />Book a Test Ride</Button>
            <Button to="/contact" variant="secondary" size="lg"><MapPin class="h-5 w-5" />Find a Branch</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { Eye, Target, Heart, Handshake, Phone, Bike, MapPin, UserRound, Sword, Users } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'

interface TeamMember { id: string; name: string; role: string; bio?: string }
interface Milestone { id?: string; year: string; title: string; description?: string; desc?: string; display_order?: number }

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

const storyStats = [{ value: '2017', label: 'Founded' }, { value: '2', label: 'Branches' }, { value: '8+', label: 'Years Riding' }]

const defaultMilestones: Milestone[] = [
  { year: '2017', title: 'Humble Beginnings', description: 'Nairobi Powerbikes LTD starts as a modest Motorcycle Accessories Dealer in Nairobi.' },
  { year: '2019', title: 'Brand Partnerships', description: 'Secured official dealership agreements with leading global motorcycle brands.' },
  { year: '2020', title: 'Showroom Expansion', description: 'Expanded to a full-fledged dealership with an expansive showroom in Nairobi.' },
  { year: '2021', title: 'Service Network', description: 'Launched our second branch in Westlands with a full-service workshop.' },
  { year: '2023', title: 'Mombasa Road Hub', description: 'Opened our third branch, adding dedicated test ride tracks and gear shop.' },
  { year: '2025', title: 'Digital Transformation', description: 'Launched our online platform for seamless browsing, booking, and financing.' },
]

const stats = ref([{ value: 5000, suffix: '+', label: 'Bikes Sold' }, { value: 12, suffix: '', label: 'Brands' }, { value: 15000, suffix: '+', label: 'Services Done' }, { value: 98, suffix: '%', label: 'Satisfaction' }])

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