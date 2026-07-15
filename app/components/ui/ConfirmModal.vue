<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" @click.self="cancel">
    <div class="w-full max-w-sm rounded-sm border border-brand-grey/30 bg-brand-black p-6 shadow-xl">
      <h2 class="font-display text-lg tracking-display text-white">{{ title }}</h2>
      <p class="mt-2 text-sm text-brand-grey">{{ message }}</p>
      <div class="mt-6 flex justify-end gap-3">
        <button class="inline-flex items-center justify-center gap-2 font-display tracking-display uppercase transition-all duration-200 rounded-sm px-3 py-1.5 text-xs btn-ghost" @click="cancel">Cancel</button>
        <button class="inline-flex items-center justify-center gap-2 font-display tracking-display uppercase transition-all duration-200 rounded-sm px-5 py-2.5 text-sm btn-primary" @click="confirmAction">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  message?: string
  confirmText?: string
}>(), {
  title: 'Confirm',
  message: 'Are you sure?',
  confirmText: 'Delete',
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

function confirmAction() { emit('confirm') }
function cancel() { emit('cancel') }
</script>
