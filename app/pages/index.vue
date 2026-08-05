<template>
  <div>
    <HeroSection />
    <div id="home-content">
      <HomeFeaturedCategories />
      <FeaturedBikes />
      <HomeNewArrivals />
      <BrandsSection />
      <WhyChooseUs />
      <HomeServiceCTA />
      <HomeFinanceCTA />
      <TestimonialsSection />
      <SubscriptionSection />
      <BranchMap />
    </div>
  </div>
</template>
<script setup lang="ts">
useHead({
  title: 'Nairobi Powerbikes - Premium Motorcycle Dealership',
  meta: [
    { name: 'description', content: "Nairobi's premier motorcycle dealership. Browse our collection of performance motorcycles, accessories, and apparel. Book a test ride or service today." },
    { property: 'og:title', content: 'Nairobi Powerbikes - Premium Motorcycle Dealership' },
    { property: 'og:description', content: "Nairobi's premier destination for premium motorcycles, expert service, and riding culture since 2017." },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
})
</script>