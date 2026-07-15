import { h, render } from 'vue'
import ConfirmModal from '~/components/ui/ConfirmModal.vue'

export function useConfirm() {
  return {
    confirm: (message: string, title?: string, confirmText?: string): Promise<boolean> => {
      return new Promise((resolve) => {
        const container = document.createElement('div')
        document.body.appendChild(container)

        function cleanup(result: boolean) {
          render(null, container)
          document.body.removeChild(container)
          resolve(result)
        }

        const vnode = h(ConfirmModal, {
          open: true,
          message,
          title,
          confirmText,
          onConfirm: () => cleanup(true),
          onCancel: () => cleanup(false),
        })

        render(vnode, container)
      })
    },
  }
}
