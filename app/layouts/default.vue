<template>
  <div class="min-h-screen bg-brand-black text-white">
    <Navbar />
    <main>
      <slot />
    </main>
    <FooterSection />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '~/components/layout/Navbar.vue'
import FooterSection from '~/components/layout/FooterSection.vue'
</script>
