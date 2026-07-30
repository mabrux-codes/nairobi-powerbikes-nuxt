<template>
  <motion.div :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :transition="{ duration: 0.5 }">
    <HeroSection />
    <FeaturedBikes />
    <BrandsSection />
    <WhyChooseUs />
    <TestimonialsSection />

    <SubscriptionSection />
    <BranchMap />
  </motion.div>
</template>
<script setup lang="ts">
import { motion } from 'motion-v'
useHead({ title: 'Nairobi Powerbikes - Premium Motorcycle Dealership', meta: [{ name: 'description', content: "Nairobi's premier motorcycle dealership. Browse our collection of performance motorcycles, accessories, and apparel. Book a test ride or service today." }] })
</script>
