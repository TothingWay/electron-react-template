/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { storeTypes } from '../store/data'
import * as actionTypes from '../store/modules/socket/actionCreators'
import io from 'socket.io-client'
import { message } from 'antd'

function useSocket() {
  const socket = useSelector((state: storeTypes) => state.socket.socket)

  const dispatch = useDispatch()

  const connectSocket = useCallback(() => {
    dispatch(
      actionTypes.changeSocket(
        io(process.env.REACT_APP_API!, {
          timeout: 5000,
        }),
      ),
    )
  }, [dispatch])

  const disconnectSocket = useCallback(() => {
    message.warning('与服务器连接已断开！')
    if (socket) socket.disconnect()
  }, [socket])

  const sendData = useCallback(
    (event: string, data: any) => {
      if (socket && socket.connected) {
        socket.emit(event, data)
      } else {
      }
    },
    [socket],
  )

  const getData = useCallback(
    (event: string, callback: (data: any) => void) => {
      if (socket) {
        socket.on(event, (data: any) => {
          callback(data)
        })
      }
    },
    [socket],
  )

  useEffect(() => {
    if (socket) {
      socket.on('connect_timeout', () => {
        message.error('连接超时，请检查网络！')
      })
      socket.on('connect_error', () => {
        message.error('连接失败，请检查网络！')
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    socket,
    connectSocket,
    disconnectSocket,
    sendData,
    getData,
  }
}

export default useSocket
