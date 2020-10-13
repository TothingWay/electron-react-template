/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState, useEffect, useCallback } from 'react'
import io from 'socket.io-client'

const [socket, setSocket] = useState<any>(null)

const connectWebSocket = () => {
  setSocket(io(process.env.REACT_APP_API!))
  console.log(`正在建立链接...`)
}

const disconnectSocket = () => {
  console.log('断开连接')
  if (socket) socket.disconnect()
}

export const sendData = useCallback(
  (event: string, data: any) => {
    if (socket) socket.emit(event, data)
  },
  [socket],
)

export const getData = useCallback(
  (event: string, callback: (data: any) => void) => {
    socket.on(event, (data: any) => {
      callback(data)
    })
  },
  [socket],
)

useEffect(() => {
  connectWebSocket()
  return () => {
    disconnectSocket()
  }
}, [socket])
