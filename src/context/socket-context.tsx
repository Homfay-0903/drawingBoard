import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import type { ServerToClientEvents, ClientToServerEvents } from '../types/socket'
import { useAuthContext } from './auth-context'

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>

interface SocketContextType {
  socket: TypedSocket | null
  isConnected: boolean
  connect: () => void
  disconnect: () => void
}

const SocketContext = createContext<SocketContextType | null>(null)

const SOCKET_URL = 'http://localhost:3001'

export const SocketProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = useState<TypedSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { token } = useAuthContext()

  const connect = useCallback(() => {
    if (socket || !token) return

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
      auth: { token }
    }) as TypedSocket

    newSocket.on('connect', () => {
      console.log('[Socket] 已连接:', newSocket.id)
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('[Socket] 已断开')
      setIsConnected(false)
    })

    newSocket.on('connect_error', (error) => {
      console.error('[Socket] 连接错误:', error.message)
      setIsConnected(false)
    })

    setSocket(newSocket)
  }, [socket, token])

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect()
      setSocket(null)
      setIsConnected(false)
    }
  }, [socket])

  useEffect(() => {
    if (token && !socket) {
      connect()
    }
    if (!token && socket) {
      disconnect()
    }
  }, [token, socket, connect, disconnect])

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [socket])

  return (
    <SocketContext.Provider value={{ socket, isConnected, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketContext = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider')
  }
  return context
}
