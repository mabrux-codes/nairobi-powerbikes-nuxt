<template>
  <div class="min-h-screen bg-brand-black pt-[calc(var(--nav-h)+24px)]">
    <div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div :initial="{ opacity: 0, y: 40 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6 }">
        <h1 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl">Terms & <span class="text-brand-red">Conditions</span></h1>
        <div class="mt-2 h-1 w-24 bg-brand-red" />
        <p class="mt-4 text-sm text-brand-grey/60">Last updated: January 1, 2025</p>
      </motion.div>

      <motion.div class="mt-10 space-y-8 text-brand-grey" :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.2, duration: 0.5 }">
        <section><h2 class="font-display font-bold text-white text-xl">1. Acceptance of Terms</h2><p class="mt-3 leading-relaxed">By accessing or using the Nairobi Powerbikes website and services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.</p></section>
        <section><h2 class="font-display font-bold text-white text-xl">2. Products and Pricing</h2><p class="mt-3 leading-relaxed">All product prices listed on our website are in Kenyan Shillings (KES) and are subject to change without notice. We reserve the right to modify or discontinue products at any time. While we strive for accuracy, we do not warrant that product descriptions, images, or pricing are error-free.</p></section>
        <section><h2 class="font-display font-bold text-white text-xl">3. Orders and Payments</h2><p class="mt-3 leading-relaxed">Order placement constitutes an offer to purchase. We reserve the right to accept or decline any order. Payment must be made in full before delivery or pickup. Accepted payment methods include M-Pesa, bank transfer, and card payments.</p></section>
        <section><h2 class="font-display font-bold text-white text-xl">4. Service Bookings</h2><p class="mt-3 leading-relaxed">Service appointments are subject to availability. Cancellations must be made at least 24 hours in advance. Failure to show for a scheduled appointment may result in a cancellation fee. We reserve the right to refuse service for any reason.</p></section>
        <section><h2 class="font-display font-bold text-white text-xl">5. Test Rides</h2><p class="mt-3 leading-relaxed">Test rides are subject to availability and require a valid driver's license. A refundable deposit may be required. Test ride participants must be at least 18 years of age and must comply with all safety requirements. We reserve the right to refuse test rides at our discretion.</p></section>
        <section><h2 class="font-display font-bold text-white text-xl">6. Financing</h2><p class="mt-3 leading-relaxed">Financing applications are subject to credit approval. Terms and conditions of financing are provided by our financial partners. Nairobi Powerbikes does not guarantee loan approval. Interest rates and repayment terms are determined by the financing institution.</p></section>
        <section><h2 class="font-display font-bold text-white text-xl">7. Warranties</h2><p class="mt-3 leading-relaxed">New motorcycles come with manufacturer warranty as specified by the respective brand. Used motorcycles are sold "as-is" unless otherwise stated. Extended warranty options may be available for purchase. Warranty claims are subject to inspection and approval.</p></section>
        <section><h2 class="font-display font-bold text-white text-xl">8. Returns and Refunds</h2><p class="mt-3 leading-relaxed">All motorcycle sales are final. Accessories and apparel may be returned within 7 days of purchase if unused and in original packaging. Refunds will be processed within 14 business days. Custom orders and special imports are non-refundable.</p></section>
        <section><h2 class="font-display font-bold text-white text-xl">9. Intellectual Property</h2><p class="mt-3 leading-relaxed">All content on this website, including text, graphics, logos, images, and software, is the property of Nairobi Powerbikes or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our written consent.</p></section>
        <section><h2 class="font-display font-bold text-white text-xl">10. Limitation of Liability</h2><p class="mt-3 leading-relaxed">Nairobi Powerbikes shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of our services or products. This limitation applies to the fullest extent permitted by law.</p></section>
        <section><h2 class="font-display font-bold text-white text-xl">11. Governing Law</h2><p class="mt-3 leading-relaxed">These terms shall be governed by and construed in accordance with the laws of the Republic of Kenya. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Kenya.</p></section>
        <section><h2 class="font-display font-bold text-white text-xl">12. Contact</h2><p class="mt-3 leading-relaxed">For questions regarding these Terms and Conditions, please contact us at legal@nairobipowerbikes.com or call +254 712 345 678.</p></section>
      </motion.div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { motion } from 'motion-v'
useHead({ title: 'Terms and Conditions - Nairobi Powerbikes', meta: [{ name: 'description', content: 'Nairobi Powerbikes terms and conditions governing the use of our website, services, and purchases.' }] })
</script>
