import { h, ref, render } from 'vue'
import ConfirmDialog from '~/components/ui/ConfirmDialog.vue'

export function useConfirm() {
  return {
    confirm: (options: {
      title?: string
      message?: string
      confirmText?: string
      confirmType?: 'danger' | 'warning' | 'info'
    }): Promise<boolean> => {
      return new Promise((resolve) => {
        const container = document.createElement('div')
        document.body.appendChild(container)
        const open = ref(true)

        function cleanup(result: boolean) {
          open.value = false
          setTimeout(() => {
            render(null, container)
            document.body.removeChild(container)
            resolve(result)
          }, 200)
        }

        const vnode = h(ConfirmDialog, {
          open: open.value,
          title: options.title || 'Confirm',
          message: options.message || 'Are you sure?',
          confirmText: options.confirmText || 'Delete',
          confirmType: options.confirmType || 'danger',
          'onConfirm': () => cleanup(true),
          'onCancel': () => cleanup(false),
        })

        render(vnode, container)
      })
    },
  }
}
