import Clipboard from 'clipboard'
import { message } from 'antd'

function clipboardSuccess(msg?: string) {
  message.success(msg || '复制成功', 1.5)
}

function clipboardError(msg?: string) {
  message.error(msg || '复制失败')
}

export default function handleClipboard(
  text: string,
  event: any,
  msg?: string,
) {
  const clipboard = new Clipboard(event.target, {
    text: () => text,
  })
  clipboard.on('success', () => {
    clipboardSuccess(msg)
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError(msg)
    clipboard.destroy()
  })
  ;(clipboard as any).onClick(event)
}
