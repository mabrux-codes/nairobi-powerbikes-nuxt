<template>
  <div class="mx-auto max-w-7xl">
    <div class="flex flex-col items-center justify-center py-24 text-center">
      <div class="flex h-14 w-14 items-center justify-center rounded-full border border-brand-grey/20 bg-brand-black/60 animate-pulse">
        <Wrench class="h-6 w-6 text-brand-red" />
      </div>
      <p class="mt-5 font-display text-lg tracking-display text-white">Taking you to My Service Bookings...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Wrench } from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['customer'] })
useHead({ title: 'My Service Bookings - Nairobi Powerbikes' })

onMounted(() => {
  navigateTo('/dashboard/my-bookings', { replace: true })
})
</script>
