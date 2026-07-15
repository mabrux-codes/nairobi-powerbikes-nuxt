<template>
  <div>
    <label v-if="label" :for="inputId" class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">
      {{ label }}
    </label>
    <input
      :id="inputId"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="input-field"
    />
  </div>
</template>

<script setup lang="ts">
const inputId = `input-${Math.random().toString(36).slice(2, 8)}`

withDefaults(defineProps<{
  label?: string
  type?: string
  placeholder?: string
  modelValue?: string
}>(), {
  type: 'text',
  modelValue: '',
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
