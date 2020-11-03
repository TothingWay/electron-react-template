/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { storeTypes } from '../store/data'
import * as actionTypes from '../store/modules/socket/actionCreators'
import io from 'socket.io-client'

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
    if (socket) socket.disconnect()
    dispatch(actionTypes.changeSocket(null))
  }, [dispatch, socket])

  const send = useCallback(
    (event: string, data?: any) => {
      if (socket) {
        socket.emit(event, data || null)
      }
    },
    [socket],
  )

  const listen = useCallback(
    (event: string, callback?: (data: any) => void) => {
      if (socket) {
        socket.on(event, (data: any) => {
          callback && callback(data)
        })
      }
    },
    [socket],
  )

  return {
    socket,
    connectSocket,
    disconnectSocket,
    send,
    listen,
  }
}

export default useSocket
