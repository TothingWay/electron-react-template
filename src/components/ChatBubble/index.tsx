import React from 'react'
import { Avatar } from 'antd'
import './index.scss'
import { CustomEmojis } from '../Editor/customEmojis'

interface ChatBubbleProps {
  src: string
  position: 'left' | 'right'
  content: string
}

function ChatBubble(props: ChatBubbleProps) {
  const { src, position, content } = props

  let message = content || '[未知图片]'
  message = message.replace(/\[.+?\]/g, ($1) => {
    for (let i = 0; i < CustomEmojis.length; i++) {
      if (CustomEmojis[i].keywords === $1) {
        return `<img style="position: relative; top: -2px;" width="20" src="${CustomEmojis[i].imageUrl}" />`
      }
    }
    return $1
  })

  return (
    <div
      className={`chat-bubble ${
        position === 'right' ? 'chat-bubble-right' : 'chat-bubble-left'
      }`}
    >
      <div className="avatar">
        <Avatar size="large" shape="square" src={src} />
      </div>

      <div
        className="bubble"
        dangerouslySetInnerHTML={{ __html: message }}
      ></div>
    </div>
  )
}

export default ChatBubble
