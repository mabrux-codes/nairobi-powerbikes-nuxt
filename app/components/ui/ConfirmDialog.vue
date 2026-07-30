<template>
  <AppModal
    :open="open"
    :title="title"
    :message="message"
    :icon="iconComponent"
    :icon-type="confirmType"
    :close-on-backdrop="false"
    :show-close="false"
    :aria-label="title"
    @close="$emit('cancel')"
  >
    <div class="mt-2 flex justify-end gap-3">
      <Button variant="ghost" size="md" @click="$emit('cancel')">Cancel</Button>
      <Button
        :variant="confirmType === 'danger' ? 'danger' : 'primary'"
        size="md"
        :loading="loading"
        @click="$emit('confirm')"
      >
        {{ confirmText }}
      </Button>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { AlertTriangle, Trash2, Info, AlertCircle } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  open: boolean
  title?: string
  message?: string
  confirmText?: string
  confirmType?: 'danger' | 'warning' | 'info'
  loading?: boolean
}>(), {
  title: 'Confirm',
  message: 'Are you sure you want to proceed?',
  confirmText: 'Confirm',
  confirmType: 'danger',
  loading: false,
})

defineEmits<{ confirm: []; cancel: [] }>()

const iconComponent = computed(() => {
  switch (props.confirmType) {
    case 'danger': return Trash2
    case 'warning': return AlertTriangle
    default: return AlertCircle
  }
})
</script>
