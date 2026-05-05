import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useSocketContext } from './socket-context'
import { useAuthContext } from './auth-context'
import type { RoomData, PlayerData, ChatMessageData, GameStatus, DrawingElement } from '../types/game'

interface GameContextType {
  currentRoom: RoomData | null
  currentPlayer: PlayerData | null
  rooms: RoomData[]
  isDrawer: boolean
  gameStatus: GameStatus
  timeLeft: number
  wordHints: string[]
  wordLength: number
  messages: ChatMessageData[]
  selectWords: string[]
  roundScores: Record<string, number>
  finalScores: Record<string, number>
  canvasElements: DrawingElement[]
  setRooms: (rooms: RoomData[]) => void
  createRoom: (name: string, maxPlayers: number) => void
  joinRoom: (roomId: string) => void
  leaveRoom: () => void
  toggleReady: () => void
  startGame: () => void
  selectWord: (word: string) => void
  sendMessage: (message: string) => void
  sendCanvasElement: (element: DrawingElement) => void
  clearCanvas: () => void
  resetGame: () => void
}

const GameContext = createContext<GameContextType | null>(null)

export const GameProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { socket, isConnected } = useSocketContext()
  const { user } = useAuthContext()

  const [rooms, setRooms] = useState<RoomData[]>([])
  const [currentRoom, setCurrentRoom] = useState<RoomData | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<PlayerData | null>(null)
  const [gameStatus, setGameStatus] = useState<GameStatus>('waiting')
  const [timeLeft, setTimeLeft] = useState(0)
  const [wordHints, setWordHints] = useState<string[]>([])
  const [wordLength, setWordLength] = useState(0)
  const [messages, setMessages] = useState<ChatMessageData[]>([])
  const [selectWords, setSelectWords] = useState<string[]>([])
  const [roundScores, setRoundScores] = useState<Record<string, number>>({})
  const [finalScores, setFinalScores] = useState<Record<string, number>>({})
  const [canvasElements, setCanvasElements] = useState<DrawingElement[]>([])

  const myPlayerId = user ? `user_${user.id}` : ''

  const isDrawer = currentRoom?.currentDrawerId === myPlayerId

  useEffect(() => {
    if (!socket || !isConnected) return

    socket.on('room:list', (roomList: RoomData[]) => {
      setRooms(roomList)
    })

    socket.on('room:created', ({ room }: { room: RoomData }) => {
      setCurrentRoom(room)
      const player = room.players.find(p => p.id === myPlayerId)
      setCurrentPlayer(player || null)
    })

    socket.on('room:joined', ({ room, player }: { room: RoomData; player: PlayerData }) => {
      setCurrentRoom(room)
      const myPlayer = room.players.find(p => p.id === myPlayerId)
      setCurrentPlayer(myPlayer || player)
    })

    socket.on('room:updated', ({ room }: { room: RoomData }) => {
      setCurrentRoom(room)
      if (myPlayerId) {
        const updatedPlayer = room.players.find(p => p.id === myPlayerId)
        setCurrentPlayer(updatedPlayer || null)
      }
    })

    socket.on('room:error', ({ message }: { message: string }) => {
      alert(message)
    })

    socket.on('game:started', ({ gameState }: { gameState: any }) => {
      setGameStatus(gameState.status)
      setTimeLeft(gameState.timeLeft)
      setWordHints(gameState.wordHints || [])
      setCanvasElements(gameState.canvasData || [])
      setMessages([])
      setSelectWords([])
    })

    socket.on('game:selectWord', ({ words }: { words: string[] }) => {
      setSelectWords(words)
    })

    socket.on('game:wordHint', ({ hints, length }: { hints: string[]; length: number }) => {
      setWordHints(hints)
      setWordLength(length)
    })

    socket.on('game:tick', ({ timeLeft }: { timeLeft: number }) => {
      setTimeLeft(timeLeft)
    })

    socket.on('game:correctGuess', ({ playerName, score }: { playerId: string; playerName: string; score: number }) => {
      addSystemMessage(`${playerName} 猜对了！+${score}分`)
    })

    socket.on('game:roundEnd', ({ word, scores }: { word: string; scores: Record<string, number> }) => {
      setGameStatus('roundEnd')
      setRoundScores(scores)
      addSystemMessage(`正确答案: ${word}`)
    })

    socket.on('game:gameEnd', ({ finalScores }: { finalScores: Record<string, number> }) => {
      setGameStatus('gameEnd')
      setFinalScores(finalScores)
      addSystemMessage('游戏结束！')
    })

    socket.on('canvas:sync', ({ element }: { element: DrawingElement }) => {
      setCanvasElements(prev => [...prev, element])
    })

    socket.on('canvas:cleared', () => {
      setCanvasElements([])
    })

    socket.on('chat:message', (data: { playerId: string; playerName: string; message: string; type: 'chat' | 'system' | 'correct' }) => {
      const msg: ChatMessageData = {
        id: Date.now().toString() + Math.random(),
        playerId: data.playerId,
        playerName: data.playerName,
        content: data.message,
        type: data.type,
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, msg])
    })

    return () => {
      socket.off('room:list')
      socket.off('room:created')
      socket.off('room:joined')
      socket.off('room:updated')
      socket.off('room:error')
      socket.off('game:started')
      socket.off('game:selectWord')
      socket.off('game:wordHint')
      socket.off('game:tick')
      socket.off('game:correctGuess')
      socket.off('game:roundEnd')
      socket.off('game:gameEnd')
      socket.off('canvas:sync')
      socket.off('canvas:cleared')
      socket.off('chat:message')
    }
  }, [socket, isConnected, myPlayerId])

  const addSystemMessage = useCallback((message: string) => {
    const msg: ChatMessageData = {
      id: Date.now().toString(),
      playerId: 'system',
      playerName: '系统',
      content: message,
      type: 'system',
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, msg])
  }, [])

  const createRoom = useCallback((name: string, maxPlayers: number) => {
    if (!socket) return
    socket.emit('room:create', { name, maxPlayers })
  }, [socket])

  const joinRoom = useCallback((roomId: string) => {
    if (!socket) return
    socket.emit('room:join', { roomId })
  }, [socket])

  const leaveRoom = useCallback(() => {
    if (!socket || !currentRoom) return
    socket.emit('room:leave', { roomId: currentRoom.id })
    setCurrentRoom(null)
    setCurrentPlayer(null)
    setGameStatus('waiting')
    setMessages([])
    setCanvasElements([])
    setSelectWords([])
  }, [socket, currentRoom])

  const toggleReady = useCallback(() => {
    if (!socket || !currentRoom) return
    socket.emit('room:ready', { roomId: currentRoom.id })
  }, [socket, currentRoom])

  const startGame = useCallback(() => {
    if (!socket || !currentRoom) return
    socket.emit('game:start', { roomId: currentRoom.id })
  }, [socket, currentRoom])

  const selectWord = useCallback((word: string) => {
    if (!socket || !currentRoom) return
    socket.emit('game:selectWord', { roomId: currentRoom.id, word })
    setSelectWords([])
  }, [socket, currentRoom])

  const sendMessage = useCallback((message: string) => {
    if (!socket || !currentRoom) return
    socket.emit('chat:message', { roomId: currentRoom.id, message })
  }, [socket, currentRoom])

  const sendCanvasElement = useCallback((element: DrawingElement) => {
    if (!socket || !currentRoom) return
    socket.emit('canvas:draw', { roomId: currentRoom.id, element })
  }, [socket, currentRoom])

  const clearCanvas = useCallback(() => {
    if (!socket || !currentRoom) return
    socket.emit('canvas:clear', { roomId: currentRoom.id })
    setCanvasElements([])
  }, [socket, currentRoom])

  const resetGame = useCallback(() => {
    setGameStatus('waiting')
    setMessages([])
    setCanvasElements([])
    setSelectWords([])
    setRoundScores({})
    setFinalScores({})
  }, [])

  return (
    <GameContext.Provider value={{
      currentRoom,
      currentPlayer,
      rooms,
      isDrawer,
      gameStatus,
      timeLeft,
      wordHints,
      wordLength,
      messages,
      selectWords,
      roundScores,
      finalScores,
      canvasElements,
      setRooms,
      createRoom,
      joinRoom,
      leaveRoom,
      toggleReady,
      startGame,
      selectWord,
      sendMessage,
      sendCanvasElement,
      clearCanvas,
      resetGame,
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
