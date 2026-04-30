export interface DrawingElement {
  id: string
  type: 'rectangle' | 'line' | 'text'
  x: number
  y: number
  width: number
  height: number
  stroke: string
  strokeWidth: number
  roughness?: number
  lineShape?: 'arrow' | 'hand'
  points?: { x: number; y: number }[]
  content?: string
}

export interface PlayerData {
  id: string
  nickname: string
  avatar: string
  score: number
  isReady: boolean
  isDrawing: boolean
  hasGuessed: boolean
  socketId: string
  isHost: boolean
}

export type RoomStatus = 'waiting' | 'playing' | 'finished'

export interface RoomData {
  id: string
  name: string
  hostId: string
  players: PlayerData[]
  maxPlayers: number
  status: RoomStatus
  currentRound: number
  maxRounds: number
  currentDrawerId: string | null
  currentWord: string | null
  wordHints: string[]
  drawTime: number
}

export type GameStatus = 'waiting' | 'selecting' | 'drawing' | 'roundEnd' | 'gameEnd'

export interface ChatMessageData {
  id: string
  playerId: string
  playerName: string
  content: string
  type: 'chat' | 'system' | 'correct'
  timestamp: number
}
