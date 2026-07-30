<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" @click.self="cancel">
    <div class="w-full max-w-sm rounded-sm border border-brand-grey/30 bg-brand-black p-6 shadow-xl">
      <h2 class="font-display text-lg tracking-display text-white">{{ title }}</h2>
      <p class="mt-2 text-sm text-brand-grey">{{ message }}</p>
      <div class="mt-6 flex justify-end gap-3">
        <Button variant="ghost" size="sm" @click="cancel">Cancel</Button>
        <Button variant="primary" @click="confirmAction">{{ confirmText }}</Button>
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
