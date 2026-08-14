<template>
  <Button
    :variant="variant"
    :size="size"
    :disabled="disabled"
    :aria-label="ariaLabel"
    class="share-button"
    @click="openShare"
  >
    <slot>
      <Share2 class="h-4 w-4" :aria-hidden="true" />
      <span v-if="!iconOnly">{{ label }}</span>
    </slot>
  </Button>
</template>

<script setup lang="ts">
import { Share2 } from 'lucide-vue-next'
import { useShare } from '~/composables/useShare'
import type { ShareData, ShareType } from '~/utils/share'

// Reusable global share trigger. With no explicit props it auto-detects the
// current page (title, description, og:image, URL and content type) so it can
// be dropped onto any page. Pages with rich content should pass the real
// values so the preview and share text are accurate.
const props = withDefaults(defineProps<{
  title?: string
  description?: string
  url?: string
  image?: string
  type?: ShareType
  text?: string
  label?: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'text'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  iconOnly?: boolean
}>(), {
  title: '',
  description: '',
  url: '',
  image: '',
  type: undefined,
  text: '',
  label: 'Share',
  variant: 'ghost',
  size: 'md',
  disabled: false,
  iconOnly: false,
})

const { open } = useShare()

const ariaLabel = computed(() => {
  if (props.iconOnly) return 'Share this page'
  return `Share ${props.label ? props.label.toLowerCase() : 'this page'}`
})

function openShare() {
  const input: Partial<ShareData> = {}
  if (props.title) input.title = props.title
  if (props.description) input.description = props.description
  if (props.url) input.url = props.url
  if (props.image) input.image = props.image
  if (props.type) input.type = props.type
  if (props.text) input.text = props.text
  open(input)
}
</script>