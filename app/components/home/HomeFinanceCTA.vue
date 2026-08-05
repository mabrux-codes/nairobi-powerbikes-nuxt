<template>
  <section class="relative overflow-hidden py-20">
    <div class="carbon-fiber absolute inset-0" aria-hidden="true" />
    <div class="pointer-events-none absolute -left-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-brand-red/15 blur-3xl" aria-hidden="true" />

    <div class="relative z-10 mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
      <motion.div
        class="overflow-hidden rounded-3xl border border-brand-red/30 bg-gradient-to-br from-[#1a0408] via-brand-black to-brand-black"
        :initial="{ opacity: 0, y: 40 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :viewport="{ once: true, margin: '-60px' }"
        :transition="{ duration: 0.6 }"
      >
        <div class="grid gap-8 p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <div class="flex items-start gap-5">
            <div class="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-brand-red/40 bg-brand-red/10 sm:flex">
              <BadgeDollarSign class="h-8 w-8 text-brand-red" />
            </div>
            <div>
              <p class="font-display text-xs font-bold tracking-[0.3em] text-brand-red uppercase">Flexible Financing</p>
              <h2 class="mt-2 font-heading text-4xl leading-[1.06] text-white sm:text-5xl">Own It From <span class="text-brand-red">9.9% APR</span></h2>
              <p class="mt-3 max-w-xl text-brand-grey sm:text-lg">Low deposits from 10%, repayment terms up to 60 months and fast approval — typically within 48 hours.</p>
            </div>
          </div>

          <div class="flex flex-col gap-4 sm:flex-row lg:flex-col">
            <Button to="/finance" variant="primary" size="lg" trailing-arrow>Calculate & Apply</Button>
            <Button to="/contact" variant="ghost" size="lg"><Phone class="h-5 w-5" />Talk to Finance</Button>
          </div>
        </div>

        <div class="grid grid-cols-3 divide-x divide-white/[0.06] border-t border-white/[0.06]">
          <div v-for="f in facts" :key="f.label" class="px-5 py-6 text-center sm:py-7">
            <p class="font-heading text-2xl text-brand-red sm:text-3xl">{{ f.value }}</p>
            <p class="mt-1 font-display text-[10px] font-semibold tracking-[0.18em] text-brand-grey uppercase sm:text-xs">{{ f.label }}</p>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { BadgeDollarSign, Phone } from 'lucide-vue-next'

const facts = [
  { label: 'Rates from', value: '9.9%' },
  { label: 'Terms up to', value: '60 mo' },
  { label: 'Approval within', value: '48 hrs' },
]
</script>