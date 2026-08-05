<template>
  <div class="min-h-screen bg-brand-black pt-[calc(var(--nav-h)+24px)]">
    <div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div :initial="{ opacity: 0, y: 40 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6 }">
        <h1 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl">Privacy <span class="text-brand-red">Policy</span></h1>
        <div class="mt-2 h-1 w-24 bg-brand-red" />
        <p class="mt-4 text-sm text-brand-grey/60">Last updated: January 1, 2025</p>
      </motion.div>

      <motion.div class="mt-10 space-y-8 text-brand-grey" :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.2, duration: 0.5 }">
        <section><h2 class="font-display font-bold text-white text-xl">1. Introduction</h2><p class="mt-3 leading-relaxed">Nairobi Powerbikes ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p></section>
        <section><h2 class="font-display font-bold text-white text-xl">2. Information We Collect</h2><p class="mt-3 leading-relaxed">We may collect personal information that you voluntarily provide to us when you:</p><ul class="mt-3 list-disc space-y-1.5 pl-6"><li>Fill out a contact form</li><li>Book a service or test ride</li><li>Apply for financing</li><li>Register for an account</li><li>Subscribe to our newsletter</li><li>Make a purchase</li></ul><p class="mt-3 leading-relaxed">This information may include your name, email address, phone number, postal address, payment information, and any other details you provide.</p></section>
        <section><h2 class="font-display font-bold text-white text-xl">3. How We Use Your Information</h2><p class="mt-3 leading-relaxed">We use the collected information for the following purposes:</p><ul class="mt-3 list-disc space-y-1.5 pl-6"><li>To process and manage your bookings, orders, and service requests</li><li>To communicate with you about your inquiries and appointments</li><li>To send marketing communications (with your consent)</li><li>To improve our website and services</li><li>To comply with legal obligations</li></ul></section>
        <section><h2 class="font-display font-bold text-white text-xl">4. Data Protection</h2><p class="mt-3 leading-relaxed">We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, access controls, and secure data storage.</p></section>
        <section><h2 class="font-display font-bold text-white text-xl">5. Data Retention</h2><p class="mt-3 leading-relaxed">We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy, or as required by law. When we no longer need your information, we will securely delete or anonymize it.</p></section>
        <section><h2 class="font-display font-bold text-white text-xl">6. Your Rights</h2><p class="mt-3 leading-relaxed">Under applicable data protection laws, you have the right to:</p><ul class="mt-3 list-disc space-y-1.5 pl-6"><li>Access your personal data</li><li>Correct inaccurate data</li><li>Delete your data</li><li>Object to processing of your data</li><li>Data portability</li><li>Withdraw consent at any time</li></ul></section>
        <section><h2 class="font-display font-bold text-white text-xl">7. Third-Party Services</h2><p class="mt-3 leading-relaxed">We may use third-party service providers to facilitate our services. These providers have access to your personal information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p></section>
        <section><h2 class="font-display font-bold text-white text-xl">8. Cookies</h2><p class="mt-3 leading-relaxed">Our website uses cookies to enhance your browsing experience. You can control cookie preferences through your browser settings. Please note that disabling cookies may affect certain features of our website.</p></section>
        <section><h2 class="font-display font-bold text-white text-xl">9. Changes to This Policy</h2><p class="mt-3 leading-relaxed">We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p></section>
        <section><h2 class="font-display font-bold text-white text-xl">10. Contact Us</h2><p class="mt-3 leading-relaxed">If you have any questions about this Privacy Policy or our data practices, please contact us:</p><ul class="mt-3 list-disc space-y-1.5 pl-6"><li>Email: privacy@nairobipowerbikes.com</li><li>Phone: +254 712 345 678</li><li>Address: Moi Avenue, Nairobi CBD</li></ul></section>
      </motion.div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { motion } from 'motion-v'
useHead({ title: 'Privacy Policy - Nairobi Powerbikes', meta: [{ name: 'description', content: 'Nairobi Powerbikes privacy policy explains how we collect, use, and protect your personal information.' }] })
</script>
