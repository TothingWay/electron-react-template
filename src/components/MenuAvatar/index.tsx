import React from 'react'
import { Avatar, Badge } from 'antd'

interface MenuAvatarProps {
  count?: number
  src: string
  dot?: boolean
}

function MenuAvatar(props: MenuAvatarProps) {
  const { count, src, dot } = props
  return (
    <Badge count={count} size={dot ? 'default' : 'small'} dot={dot}>
      <Avatar shape="square" size="large" src={src} />
    </Badge>
  )
}

export default MenuAvatar
