<template>
  <div class="min-h-screen bg-brand-black text-white flex">
    <DashboardSidebar :isOpen="sidebarOpen" @close="sidebarOpen = false" />
    <div class="flex-1 flex flex-col min-h-screen lg:ml-64">
      <DashboardHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="flex-1 p-4 sm:p-6">
        <slot />
      </main>
    </div>

    <Teleport to="body">
      <div v-if="inactivityWarning" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
        <div class="w-full max-w-sm rounded-sm border border-brand-grey/30 bg-brand-black p-8 text-center">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <h2 class="font-display text-xl tracking-display text-white">Inactivity Warning</h2>
          <p class="mt-2 text-sm text-brand-grey">You've been inactive for a while. For your security, you'll be automatically logged out in <span class="text-amber-400 font-bold">{{ countdown }}</span> seconds.</p>
          <div class="mt-6 flex gap-3 justify-center">
            <Button @click="stayLoggedIn">Stay Logged In</Button>
            <Button variant="ghost" @click="logoutNow">Log Out Now</Button>
          </div>
        </div>
      </div>
    </Teleport>
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { cn } from '~/utils/cn'
import DashboardSidebar from '~/components/dashboard/DashboardSidebar.vue'
import DashboardHeader from '~/components/dashboard/DashboardHeader.vue'
import { useInactivityLogout } from '~/composables/useInactivityLogout'

const sidebarOpen = ref(false)
const { showWarning, warningCountdown, setupListeners, stayLoggedIn, forceLogout } = useInactivityLogout()

const inactivityWarning = computed(() => showWarning.value)
const countdown = computed(() => warningCountdown.value)

function logoutNow() { forceLogout() }

onMounted(() => setupListeners())
</script>
