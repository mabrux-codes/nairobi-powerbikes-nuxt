<template>
  <div>
    <component :is="activeComponent" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const auth = useAuthStore()

const componentMap: Record<string, any> = {
  admin: defineAsyncComponent(() => import('~/components/dashboard/AdminOverview.vue')),
  customer: defineAsyncComponent(() => import('~/components/dashboard/CustomerOverview.vue')),
}

const activeComponent = computed(() => componentMap[auth.userRole || 'customer'])

const titles: Record<string, string> = {
  admin: 'Admin Dashboard - Nairobi Powerbikes',
  customer: 'My Dashboard - Nairobi Powerbikes',
}

useHead({ title: titles[auth.userRole || 'customer'] || 'Dashboard - Nairobi Powerbikes' })
</script>
