<template>
  <motion.div :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :transition="{ duration: 0.5 }">
    <HeroSection />
    <FeaturedBikes />
    <BrandsSection />
    <WhyChooseUs />
    <section class="py-20 bg-brand-black">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid gap-10 md:grid-cols-2 md:items-start">
          <motion.div class="pt-8" :initial="{ opacity: 0, x: -40 }" :while-in-view="{ opacity: 1, x: 0 }" :viewport="{ once: true }" :transition="{ duration: 0.6 }">
            <h2 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl">Book a <span class="text-brand-red">Service</span></h2>
            <div class="mt-2 h-1 w-24 bg-brand-red" /><p class="mt-6 max-w-sm text-brand-grey">Schedule your next service appointment. Our certified technicians will have your machine running razor-sharp.</p>
          </motion.div>
          <motion.div :initial="{ opacity: 0, x: 40 }" :while-in-view="{ opacity: 1, x: 0 }" :viewport="{ once: true }" :transition="{ duration: 0.6 }"><ServiceBookingWidget /></motion.div>
        </div>
      </div>
    </section>

    <SubscriptionSection />
    <BranchMap />
  </motion.div>
</template>
<script setup lang="ts">
import { motion } from 'motion-v'
useHead({ title: 'Nairobi Powerbikes - Premium Motorcycle Dealership', meta: [{ name: 'description', content: "Nairobi's premier motorcycle dealership. Browse our collection of performance motorcycles, accessories, and apparel. Book a test ride or service today." }] })
</script>
