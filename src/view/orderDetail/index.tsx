import React, { memo } from 'react'
import { getQueryObject } from '../../utils'

function OrderDetail() {
  return (
    <div>开发中，当前微信号：{getQueryObject(window.location.search).wxid}</div>
  )
}

export default memo(OrderDetail)
