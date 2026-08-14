<template>
  <div class="rounded-xl border border-brand-grey/15 bg-white/[0.02]">
    <div class="flex flex-wrap items-center gap-0.5 border-b border-brand-grey/15 px-1.5 py-1.5">
      <ToolButton :label="undoLabel" :disabled="!canUndo" @click="editor?.chain().focus().undo().run()"><Undo2 class="h-4 w-4" /></ToolButton>
      <ToolButton :label="redoLabel" :disabled="!canRedo" @click="editor?.chain().focus().redo().run()"><Redo2 class="h-4 w-4" /></ToolButton>
      <Divider />
      <ToolButton label="Paragraph" :active="isActive('paragraph')" @click="setBlock('paragraph')"><span class="font-bold">¶</span></ToolButton>
      <ToolButton label="Heading 2" :active="isActive('heading', { level: 2 })" @click="setHeading(2)">H2</ToolButton>
      <ToolButton label="Heading 3" :active="isActive('heading', { level: 3 })" @click="setHeading(3)">H3</ToolButton>
      <Divider />
      <ToolButton label="Bold" :active="isActive('bold')" @click="toggle('bold')"><Bold class="h-4 w-4" /></ToolButton>
      <ToolButton label="Italic" :active="isActive('italic')" @click="toggle('italic')"><Italic class="h-4 w-4" /></ToolButton>
      <ToolButton label="Underline" :active="isActive('underline')" @click="toggle('underline')"><Underline class="h-4 w-4" /></ToolButton>
      <ToolButton label="Strikethrough" :active="isActive('strike')" @click="toggle('strike')"><Strikethrough class="h-4 w-4" /></ToolButton>
      <ToolButton label="Inline code" :active="isActive('code')" @click="toggle('code')"><Code class="h-4 w-4" /></ToolButton>
      <Divider />
      <ToolButton label="Bullet list" :active="isActive('bulletList')" @click="setList('bulletList')"><List class="h-4 w-4" /></ToolButton>
      <ToolButton label="Numbered list" :active="isActive('orderedList')" @click="setList('orderedList')"><ListOrdered class="h-4 w-4" /></ToolButton>
      <ToolButton label="Blockquote" :active="isActive('blockquote')" @click="setBlock('blockquote')"><Quote class="h-4 w-4" /></ToolButton>
      <ToolButton label="Code block" :active="isActive('codeBlock')" @click="setBlock('codeBlock')"><SquareCode class="h-4 w-4" /></ToolButton>
      <Divider />
      <ToolButton label="Align left" :active="isActive({ textAlign: 'left' })" @click="setAlign('left')"><AlignLeft class="h-4 w-4" /></ToolButton>
      <ToolButton label="Align center" :active="isActive({ textAlign: 'center' })" @click="setAlign('center')"><AlignCenter class="h-4 w-4" /></ToolButton>
      <ToolButton label="Align right" :active="isActive({ textAlign: 'right' })" @click="setAlign('right')"><AlignRight class="h-4 w-4" /></ToolButton>
      <Divider />
      <ToolButton label="Link" :active="isActive('link')" @click="openLinkDialog"><Link2 class="h-4 w-4" /></ToolButton>
      <ToolButton label="Image" @click="openImageDialog"><ImageIcon class="h-4 w-4" /></ToolButton>
      <ToolButton label="Table" @click="insertTable"><Table2 class="h-4 w-4" /></ToolButton>
      <ToolButton label="Horizontal rule" @click="editor?.chain().focus().setHorizontalRule().run()"><Minus class="h-4 w-4" /></ToolButton>
      <Divider />
      <ToolButton label="Text color" @click="openColorDialog"><Palette class="h-4 w-4" /></ToolButton>
      <ToolButton label="Highlight" :active="isActive('highlight')" @click="toggleHighlight"><Highlighter class="h-4 w-4" /></ToolButton>
      <ToolButton label="Superscript" :active="isActive('superscript')" @click="toggle('superscript')"><Superscript class="h-4 w-4" /></ToolButton>
      <ToolButton label="Subscript" :active="isActive('subscript')" @click="toggle('subscript')"><Subscript class="h-4 w-4" /></ToolButton>
      <Divider />
      <ToolButton label="Clear formatting" @click="editor?.chain().focus().clearNodes().unsetAllMarks().run()"><RemoveFormatting class="h-4 w-4" /></ToolButton>
    </div>

    <div class="flex gap-2 p-2">
      <EditorContent
        class="rich-editor min-h-[320px] flex-1 rounded-lg bg-brand-black/60 px-4 py-3"
        :editor="editor"
      />
      <div v-if="openLink || openImage || openColor" class="w-56 shrink-0 space-y-2 rounded-lg border border-brand-grey/15 bg-brand-black p-3">
        <template v-if="openLink">
          <p class="text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Link URL</p>
          <input v-model="linkUrl" type="url" class="input-field h-9 rounded-lg text-sm" placeholder="https://…" @keydown.enter.prevent="applyLink" />
          <label class="flex items-center gap-2 text-xs text-brand-grey">
            <input v-model="linkNewTab" type="checkbox" class="h-3.5 w-3.5 accent-brand-red" /> Open in new tab
          </label>
          <div class="flex gap-2 pt-1">
            <Button size="sm" class="flex-1" :disabled="!linkUrl.trim()" @click="applyLink">Apply</Button>
            <Button v-if="isActive('link')" size="sm" variant="ghost" @click="unlink">Remove</Button>
          </div>
        </template>

        <template v-else-if="openImage">
          <p class="text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Image</p>
          <label class="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-brand-grey/25 py-3 text-center text-xs text-brand-grey transition-colors hover:border-brand-red/50 hover:text-brand-red">
            <Upload class="h-4 w-4" />
            <span>Upload to media library</span>
            <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" class="sr-only" @change="uploadImage" />
          </label>
          <p class="py-1 text-center text-[10px] text-brand-grey/50">or paste a URL</p>
          <input v-model="imageUrl" type="url" class="input-field h-9 rounded-lg text-sm" placeholder="https://…" @keydown.enter.prevent="applyImageUrl" />
          <input v-model="imageAlt" class="input-field h-9 rounded-lg text-sm" placeholder="Alt text" @keydown.enter.prevent="applyImageUrl" />
          <p v-if="uploading" class="text-xs text-brand-grey">Uploading…</p>
          <p v-if="imageError" class="text-xs text-rose-400">{{ imageError }}</p>
          <Button size="sm" class="mt-1 w-full" :disabled="!imageUrl.trim() || uploading" @click="applyImageUrl">Insert</Button>
        </template>

        <template v-else>
          <p class="text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Text color</p>
          <div class="grid grid-cols-6 gap-1.5">
            <button v-for="c in swatches" :key="c" type="button" class="h-6 w-6 rounded-md border border-white/10 transition-transform hover:scale-110" :style="{ backgroundColor: c }" :aria-label="`Color ${c}`" @click="applyColor(c)" />
          </div>
          <button type="button" class="mt-2 w-full rounded-lg border border-brand-grey/20 py-1.5 text-xs text-brand-grey hover:border-brand-red/50 hover:text-brand-red" @click="unsetColor">Reset color</button>
        </template>
      </div>
    </div>

    <div class="flex items-center justify-between border-t border-brand-grey/15 px-3 py-1.5 text-[11px] text-brand-grey/60">
      <span v-if="wordCount" class="flex items-center gap-1.5"><AlignLeft class="h-3 w-3" />{{ wordCount }} words · {{ charCount }} characters</span>
      <span v-else>Start typing to see the word count</span>
      <button type="button" class="text-brand-grey/70 transition-colors hover:text-brand-red" @click="resetToEmpty">Clear content</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { defineComponent, h } from 'vue'
import {
  Undo2, Redo2, Bold, Italic, Underline, Strikethrough, Code, List, ListOrdered,
  Quote, SquareCode, AlignLeft, AlignCenter, AlignRight, Link2, Image as ImageIcon,
  Table2, Minus, Palette, Highlighter, Superscript, Subscript, RemoveFormatting,
  Upload,
} from 'lucide-vue-next'
import { buildExtensions, isValidRichDoc, markdownToRichDoc, htmlToRichDoc, richDocToText } from '~/utils/richText'
import { usePB } from '~/composables/usePocketBase'

const props = withDefaults(defineProps<{
  modelValue: unknown
  placeholder?: string
  legacyContent?: string
  legacyFormat?: 'markdown' | 'html'
}>(), {
  placeholder: 'Write your content here…',
  legacyContent: '',
  legacyFormat: 'markdown',
})

const emit = defineEmits<{ 'update:modelValue': [unknown] }>()

const pb = usePB()
const openLink = ref(false)
const openImage = ref(false)
const openColor = ref(false)
const linkUrl = ref('')
const linkNewTab = ref(true)
const imageUrl = ref('')
const imageAlt = ref('')
const imageError = ref('')
const uploading = ref(false)
const swatches = ['#ffffff', '#ef2a2a', '#f59e0b', '#22c55e', '#38bdf8', '#a78bfa']

function isActive(nameOrAttrs: string | object, attrs?: object) {
  return editor.value?.isActive(nameOrAttrs as any, attrs) ?? false
}
function toggle(name: string) {
  editor.value?.chain().focus()[`toggle${name[0].toUpperCase()}${name.slice(1)}` as any]().run()
}
function setBlock(type: string) {
  const chain = editor.value?.chain().focus()
  if (type === 'paragraph') chain?.setParagraph().run()
  else if (type === 'codeBlock') chain?.toggleCodeBlock().run()
  else chain?.toggleBlockquote().run()
}
function toggleHighlight() { editor.value?.chain().focus().toggleHighlight().run() }
function setHeading(level: number) { editor.value?.chain().focus().toggleHeading({ level: level as any }).run() }
function setList(type: string) { type === 'bulletList' ? editor.value?.chain().focus().toggleBulletList().run() : editor.value?.chain().focus().toggleOrderedList().run() }
function setAlign(a: string) { editor.value?.chain().focus().setTextAlign(a).run() }
function insertTable() { editor.value?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() }

const canUndo = ref(false)
const canRedo = ref(false)

const ToolButton = defineComponent({
  props: { label: { type: String, default: '' }, active: { type: Boolean, default: false }, disabled: { type: Boolean, default: false } },
  emits: ['click'],
  setup(props, { slots, emit }) {
    return () => h('button', {
      type: 'button',
      title: props.label,
      'aria-label': props.label,
      disabled: props.disabled,
      class: [
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-brand-grey transition-colors',
        props.active ? 'bg-brand-red/20 text-brand-red' : 'hover:bg-white/10 hover:text-white',
        props.disabled ? 'cursor-not-allowed opacity-30' : '',
      ],
      onClick: () => emit('click'),
    }, slots.default?.())
  },
})

const Divider = defineComponent({
  setup() {
    return () => h('span', { class: 'mx-0.5 h-5 w-px self-center bg-brand-grey/20' })
  },
})

const editor = useEditor({
  extensions: buildExtensions() as any,
  content: initialContent(),
  immediatelyRender: false,
  editorProps: {
    attributes: { 'aria-label': props.placeholder },
  },
  onUpdate: ({ editor }) => {
    canUndo.value = editor.can().undo()
    canRedo.value = editor.can().redo()
    emit('update:modelValue', editor.getJSON())
  },
  onSelectionUpdate: () => {
    linkUrl.value = (editor.value?.getAttributes('link')?.href as string) || ''
  },
})

const wordCount = computed(() => {
  const text = editor.value?.getText() || ''
  return text.trim() ? text.trim().split(/\s+/).length : 0
})
const charCount = computed(() => editor.value?.getText().length || 0)

function initialContent() {
  if (isValidRichDoc(props.modelValue)) return props.modelValue
  if (props.legacyContent) {
    const doc = props.legacyFormat === 'html'
      ? htmlToRichDoc(props.legacyContent)
      : markdownToRichDoc(props.legacyContent)
    if (doc) {
      emit('update:modelValue', doc)
      return doc
    }
  }
  return ''
}

watch(() => props.modelValue, (v) => {
  if (!editor.value) return
  if (isValidRichDoc(v)) {
    const current = JSON.stringify(editor.value.getJSON())
    const next = JSON.stringify(v)
    if (current !== next) editor.value.commands.setContent(v as any)
  }
})

function openLinkDialog() {
  openLink.value = !openLink.value
  openImage.value = false
  openColor.value = false
  linkUrl.value = (editor.value?.getAttributes('link')?.href as string) || ''
}
function openImageDialog() {
  openImage.value = !openImage.value
  openLink.value = false
  openColor.value = false
  imageUrl.value = ''
  imageAlt.value = ''
  imageError.value = ''
}
function openColorDialog() {
  openColor.value = !openColor.value
  openLink.value = false
  openImage.value = false
}

function applyLink() {
  const url = linkUrl.value.trim()
  if (!url) return
  editor.value?.chain().focus()
    .extendMarkRange('link')
    .setLink({ href: /^(https?:\/\/|mailto:|tel:)/i.test(url) ? url : `https://${url}` })
    .run()
  openLink.value = false
}

function unlink() {
  editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
  openLink.value = false
}

function applyColor(c: string) {
  editor.value?.chain().focus().setColor(c).run()
  openColor.value = false
}
function unsetColor() {
  editor.value?.chain().focus().unsetColor().run()
  openColor.value = false
}

async function uploadImage(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    imageError.value = 'Image must be under 5MB.'
    return
  }
  uploading.value = true
  imageError.value = ''
  try {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('filename', file.name)
    const rec: any = await pb.collection('media').create(fd)
    const url = pb.files.getURL(rec, 'file')
    imageUrl.value = url
    if (!imageAlt.value) imageAlt.value = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ')
  } catch (err: any) {
    imageError.value = err?.message || err?.data?.message || 'Upload failed.'
  } finally {
    uploading.value = false
  }
}

function applyImageUrl() {
  const src = imageUrl.value.trim()
  if (!src) return
  editor.value?.chain().focus().setImage({ src, alt: imageAlt.value.trim() }).run()
  imageUrl.value = ''
  imageAlt.value = ''
  openImage.value = false
}

function resetToEmpty() {
  editor.value?.chain().focus().clearContent().run()
  emit('update:modelValue', { type: 'doc', content: [{ type: 'paragraph' }] })
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})

defineExpose({ getText: () => richDocToText(props.modelValue) })
</script>

<style scoped>
.rich-editor :deep(.ProseMirror) {
  outline: none;
  min-height: 320px;
}
.rich-editor :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: var(--brand-grey, #9ca3af);
  pointer-events: none;
  height: 0;
}
.rich-editor :deep(.ProseMirror h2) { font-size: 1.35rem; font-weight: 700; margin: 1.25rem 0 0.5rem; color: #fff; }
.rich-editor :deep(.ProseMirror h3) { font-size: 1.1rem; font-weight: 600; margin: 1rem 0 0.4rem; color: #fff; }
.rich-editor :deep(.ProseMirror h4) { font-size: 0.95rem; font-weight: 600; margin: 0.75rem 0 0.3rem; color: #e5e7eb; }
.rich-editor :deep(.ProseMirror ul) { list-style: disc; padding-left: 1.4rem; margin: 0.5rem 0; }
.rich-editor :deep(.ProseMirror ol) { list-style: decimal; padding-left: 1.4rem; margin: 0.5rem 0; }
.rich-editor :deep(.ProseMirror li) { margin: 0.2rem 0; }
.rich-editor :deep(.ProseMirror blockquote) { border-left: 3px solid var(--brand-red, #ef2a2a); padding: 0.35rem 0.9rem; margin: 0.5rem 0; color: #e5e7eb; }
.rich-editor :deep(.ProseMirror a) { color: var(--brand-red, #ef2a2a); text-decoration: underline; }
.rich-editor :deep(.ProseMirror code) { font-family: ui-monospace, Menlo, monospace; font-size: 0.85em; background: rgba(255,255,255,0.08); padding: 0.1rem 0.3rem; border-radius: 0.3rem; }
.rich-editor :deep(.ProseMirror pre) { background: #000; border: 1px solid rgba(255,255,255,0.08); border-radius: 0.5rem; padding: 0.75rem; overflow-x: auto; margin: 0.5rem 0; }
.rich-editor :deep(.ProseMirror pre code) { background: none; padding: 0; }
.rich-editor :deep(.ProseMirror hr) { border: 0; border-top: 1px solid rgba(255,255,255,0.12); margin: 1.25rem 0; }
.rich-editor :deep(.ProseMirror img) { max-width: 100%; border-radius: 0.5rem; margin: 0.75rem 0; }
.rich-editor :deep(.ProseMirror table) { border-collapse: collapse; width: 100%; margin: 0.75rem 0; }
.rich-editor :deep(.ProseMirror th), .rich-editor :deep(.ProseMirror td) { border: 1px solid rgba(255,255,255,0.15); padding: 0.4rem 0.6rem; text-align: left; }
.rich-editor :deep(.ProseMirror th) { background: rgba(255,255,255,0.05); font-weight: 600; }
.rich-editor :deep(.ProseMirror .selectedCell) { background: rgba(239,42,42,0.15); }
</style>
