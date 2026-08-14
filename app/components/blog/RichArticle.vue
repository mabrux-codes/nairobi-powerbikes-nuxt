<template>
  <div class="rich-content" v-html="html" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { isValidRichDoc, richDocToHTML } from '~/utils/richText'

const props = defineProps<{
  doc?: unknown
  legacyHtml?: string
}>()

const html = computed(() => {
  if (props.doc !== undefined && isValidRichDoc(props.doc)) {
    return richDocToHTML(props.doc)
  }
  return props.legacyHtml || ''
})
</script>

<style scoped>
.rich-content :deep(h2) {
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  font-family: var(--font-display, ui-sans-serif, system-ui);
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
}
.rich-content :deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
}
.rich-content :deep(h4) {
  margin-top: 1.25rem;
  margin-bottom: 0.4rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #e5e7eb;
}
.rich-content :deep(p) {
  margin-top: 1rem;
  color: var(--brand-grey, #9ca3af);
  line-height: 1.8;
}
.rich-content :deep(strong) { color: #fff; }
.rich-content :deep(a) {
  color: var(--brand-red, #ef2a2a);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.rich-content :deep(ul) {
  margin-top: 1rem;
  padding-left: 1.5rem;
  list-style: disc;
  color: var(--brand-grey, #9ca3af);
  line-height: 1.8;
}
.rich-content :deep(ol) {
  margin-top: 1rem;
  padding-left: 1.5rem;
  list-style: decimal;
  color: var(--brand-grey, #9ca3af);
  line-height: 1.8;
}
.rich-content :deep(li) { margin: 0.25rem 0; }
.rich-content :deep(blockquote) {
  margin-top: 1rem;
  border-left: 3px solid var(--brand-red, #ef2a2a);
  padding: 0.5rem 1rem;
  color: #e5e7eb;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0 0.5rem 0.5rem 0;
}
.rich-content :deep(code) {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.85em;
  background: rgba(255, 255, 255, 0.08);
  padding: 0.15rem 0.35rem;
  border-radius: 0.3rem;
  color: #f9a8a8;
}
.rich-content :deep(pre) {
  margin-top: 1rem;
  padding: 1rem;
  overflow-x: auto;
  border-radius: 0.75rem;
  background: #000;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.rich-content :deep(pre code) {
  background: none;
  padding: 0;
  color: #e5e7eb;
}
.rich-content :deep(hr) {
  margin: 2rem 0;
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.rich-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.75rem;
  margin: 1.5rem 0;
}
.rich-content :deep(table) {
  width: 100%;
  margin: 1.25rem 0;
  border-collapse: collapse;
  overflow-x: auto;
  display: block;
}
.rich-content :deep(th),
.rich-content :deep(td) {
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 0.5rem 0.75rem;
  text-align: left;
  color: var(--brand-grey, #9ca3af);
  line-height: 1.7;
}
.rich-content :deep(th) { color: #fff; background: rgba(255, 255, 255, 0.04); font-weight: 600; }
.rich-content :deep(ul ul), .rich-content :deep(ol ol), .rich-content :deep(ul ol), .rich-content :deep(ol ul) { margin-top: 0.25rem; }
</style>
