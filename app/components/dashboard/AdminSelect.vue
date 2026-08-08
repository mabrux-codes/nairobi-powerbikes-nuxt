<template>
  <div class="relative">
    <label v-if="label" :for="uid" class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">{{ label }}</label>
    <select
      :id="uid"
      :value="modelValue"
      :disabled="disabled"
      class="h-10 w-full appearance-none rounded-xl border border-brand-grey/25 bg-brand-black/70 pl-3.5 pr-9 text-sm text-white placeholder:text-brand-grey/50 transition-all duration-200 focus:border-brand-red/60 focus:outline-none focus:ring-2 focus:ring-brand-red/20 disabled:opacity-50"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="placeholder" value="" class="bg-brand-black">{{ placeholder }}</option>
      <slot />
    </select>
    <svg class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-grey/60" :class="label ? 'mt-4' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</template>

<script setup lang="ts">
const uid = `select-${Math.random().toString(36).slice(2, 8)}`

withDefaults(defineProps<{
  label?: string
  modelValue?: string
  placeholder?: string
  disabled?: boolean
}>(), {
  label: '',
  modelValue: '',
  placeholder: '',
  disabled: false,
})

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
