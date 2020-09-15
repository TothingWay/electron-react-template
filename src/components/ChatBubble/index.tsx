import React from 'react'
import { Avatar } from 'antd'
import './index.scss'

interface ChatBubbleProps {
  src: string
  position: 'left' | 'right'
  content: string
}

function ChatBubble(props: ChatBubbleProps) {
  const { src, position, content } = props
  return (
    <div
      className={`chat-bubble ${
        position === 'right' ? 'chat-bubble-right' : 'chat-bubble-left'
      }`}
    >
      <div className="avatar">
        <Avatar size="large" shape="square" src={src} />
      </div>

      <div className="bubble">{content}</div>
    </div>
  )
}

export default ChatBubble
