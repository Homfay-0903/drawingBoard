import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useSocketContext } from './socket-context'
import type { RoomData, PlayerData } from '../types/game'

interface GameContextType {
  currentRoom: RoomData | null
  currentPlayer: PlayerData | null
  rooms: RoomData[]
  isDrawer: boolean
  setRooms: (rooms: RoomData[]) => void
  createRoom: (name: string, maxPlayers: number) => void
  joinRoom: (roomId: string, nickname: string) => void
  leaveRoom: () => void
  toggleReady: () => void
}

const GameContext = createContext<GameContextType | null>(null)

export const GameProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { socket, isConnected } = useSocketContext()
  
  const [rooms, setRooms] = useState<RoomData[]>([])
  const [currentRoom, setCurrentRoom] = useState<RoomData | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<PlayerData | null>(null)

  const isDrawer = currentRoom?.currentDrawerId === currentPlayer?.id

  useEffect(() => {
    if (!socket || !isConnected) return

    socket.on('room:list', (roomList: RoomData[]) => {
      console.log('[Game] 收到房间列表:', roomList.length)
      setRooms(roomList)
    })

    socket.on('room:created', ({ room }: { room: RoomData }) => {
      console.log('[Game] 房间创建成功:', room.id)
      setCurrentRoom(room)
      const player = room.players.find(p => p.socketId === socket.id)
      setCurrentPlayer(player || null)
    })

    socket.on('room:joined', ({ room, player }: { room: RoomData; player: PlayerData }) => {
      console.log('[Game] 加入房间成功:', room.id)
      setCurrentRoom(room)
      setCurrentPlayer(player)
    })

    socket.on('room:updated', ({ room }: { room: RoomData }) => {
      console.log('[Game] 房间更新:', room.id)
      setCurrentRoom(room)
      if (currentPlayer) {
        const updatedPlayer = room.players.find(p => p.id === currentPlayer.id)
        setCurrentPlayer(updatedPlayer || null)
      }
    })

    socket.on('room:error', ({ message }: { message: string }) => {
      console.error('[Game] 错误:', message)
      alert(message)
    })

    return () => {
      socket.off('room:list')
      socket.off('room:created')
      socket.off('room:joined')
      socket.off('room:updated')
      socket.off('room:error')
    }
  }, [socket, isConnected, currentPlayer])

  const createRoom = useCallback((name: string, maxPlayers: number) => {
    if (!socket) return
    socket.emit('room:create', { name, maxPlayers })
  }, [socket])

  const joinRoom = useCallback((roomId: string, nickname: string) => {
    if (!socket) return
    socket.emit('room:join', { roomId, nickname })
  }, [socket])

  const leaveRoom = useCallback(() => {
    if (!socket || !currentRoom) return
    socket.emit('room:leave', { roomId: currentRoom.id })
    setCurrentRoom(null)
    setCurrentPlayer(null)
  }, [socket, currentRoom])

  const toggleReady = useCallback(() => {
    if (!socket || !currentRoom) return
    socket.emit('room:ready', { roomId: currentRoom.id })
  }, [socket, currentRoom])

  return (
    <GameContext.Provider value={{
      currentRoom,
      currentPlayer,
      rooms,
      isDrawer,
      setRooms,
      createRoom,
      joinRoom,
      leaveRoom,
      toggleReady,
    }}>
      {children}
    </GameContext.Provider>
  )
}

export const useGameContext = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider')
  }
  return context
}
