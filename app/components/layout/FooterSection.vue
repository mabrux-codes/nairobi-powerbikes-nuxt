<template>
  <footer class="carbon-fiber border-t border-brand-grey/20">
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 class="mb-6 font-heading text-xl text-white">Quick Links</h3>
          <ul class="space-y-3">
            <li v-for="link in quickLinks" :key="link.label">
              <NuxtLink
                :to="link.to"
                class="text-sm text-brand-grey hover:text-brand-red transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="mb-6 font-heading text-xl text-white">Our Branches</h3>
          <div v-if="loading" class="space-y-3">
            <div v-for="i in 2" :key="i" class="animate-pulse">
              <div class="mb-1 h-4 w-32 rounded bg-brand-grey/20" />
              <div class="mb-1 h-3 w-48 rounded bg-brand-grey/10" />
              <div class="h-3 w-36 rounded bg-brand-grey/10" />
            </div>
          </div>
          <div v-else-if="branches.length" class="space-y-5">
            <div v-for="branch in branches" :key="branch.id">
              <p class="text-sm font-semibold text-brand-light">{{ branch.name }}</p>
              <p class="mt-1 text-xs text-brand-grey">{{ branch.address }}</p>
              <p v-if="branch.phone" class="mt-1 text-xs text-brand-grey">{{ branch.phone }}</p>
            </div>
          </div>
          <p v-else class="text-sm text-brand-grey">No branches listed yet.</p>
        </div>

        <div>
          <h3 class="mb-6 font-heading text-xl text-white">Newsletter</h3>
          <p class="mb-4 text-sm text-brand-grey">
            Subscribe for exclusive deals, new arrivals, and moto culture news.
          </p>
          <form @submit.prevent="submitNewsletter" class="space-y-3">
            <input
              v-model="newsletterEmail"
              type="email"
              required
              placeholder="Your email address"
              class="w-full border border-brand-grey bg-brand-black px-4 py-3 text-sm text-white placeholder:text-brand-grey focus:border-brand-red focus:outline-none transition-colors"
            />
            <Button
              type="submit"
              :loading="subscribing"
              variant="primary"
              class="w-full"
            >
              Subscribe
            </Button>
          </form>
          <p v-if="subscribeMsg" class="mt-3 text-xs" :class="subscribeError ? 'text-red-400' : 'text-green-400'">
            {{ subscribeMsg }}
          </p>
        </div>

        <div>
          <h3 class="mb-6 font-heading text-xl text-white">Follow Us</h3>
          <p class="mb-6 text-sm text-brand-grey">
            Ride with us on social media
          </p>
          <div class="flex gap-4">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex h-11 w-11 items-center justify-center border border-brand-grey/30 text-brand-grey hover:border-brand-red hover:text-brand-red transition-all duration-200"
              :aria-label="social.name"
              v-html="social.icon"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-brand-grey/10">
      <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
        <p class="text-xs text-brand-grey">
          &copy; {{ new Date().getFullYear() }} Nairobi Powerbikes. All rights reserved.
        </p>
        <div class="flex gap-6">
          <NuxtLink to="/privacy" class="text-xs text-brand-grey hover:text-brand-red transition-colors">
            Privacy Policy
          </NuxtLink>
          <NuxtLink to="/terms" class="text-xs text-brand-grey hover:text-brand-red transition-colors">
            Terms of Service
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { usePB } from '~/composables/usePocketBase'

interface Branch {
  id: string
  name: string
  address: string
  phone?: string
}

interface SocialLink {
  name: string
  url: string
  icon: string
}

const pb = usePB()

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Motorcycles', to: '/motorcycles' },
  { label: 'New Arrivals', to: '/new-arrivals' },
  { label: 'Accessories', to: '/accessories' },
  { label: 'Apparel', to: '/apparel' },
  { label: 'Service', to: '/service/booking' },
  { label: 'Finance', to: '/finance' },
  { label: 'About', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
]

const socialLinks: SocialLink[] = [
  {
    name: 'Facebook',
    url: 'https://facebook.com/nairobipowerbikes',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/nairobipowerbikes',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com/@nairobipowerbikes',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>',
  },
  {
    name: 'Twitter / X',
    url: 'https://x.com/nairobipowerbikes',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M17.232 4.768l-3.464 3.464"/></svg>',
  },
]

const branches = ref<Branch[]>([])
const loading = ref(true)
const newsletterEmail = ref('')
const subscribing = ref(false)
const subscribeMsg = ref('')
const subscribeError = ref(false)

async function fetchBranches() {
  try {
    const records = await pb.collection('branches').getFullList<Branch>({
      sort: 'name',
    })
    branches.value = records
  } catch {
    branches.value = []
  } finally {
    loading.value = false
  }
}

async function submitNewsletter() {
  if (!newsletterEmail.value.trim()) return

  subscribing.value = true
  subscribeMsg.value = ''

  try {
    await pb.collection('subscribers').create({
      email: newsletterEmail.value,
      subscribedAt: new Date().toISOString(),
    })
    subscribeMsg.value = 'Thanks for subscribing!'
    subscribeError.value = false
    newsletterEmail.value = ''
  } catch (err: any) {
    subscribeMsg.value = err?.data?.message || 'Something went wrong. Try again.'
    subscribeError.value = true
  } finally {
    subscribing.value = false
  }
}

onMounted(() => {
  fetchBranches()
})
</script>
