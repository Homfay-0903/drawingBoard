import type { RoomData, PlayerData, DrawingElement } from './game'

export interface ServerToClientEvents {
  'room:list': (data: RoomData[]) => void
  'room:created': (data: { room: RoomData }) => void
  'room:joined': (data: { room: RoomData; player: PlayerData }) => void
  'room:updated': (data: { room: RoomData }) => void
  'room:error': (data: { message: string }) => void
  'game:started': (data: { gameState: any }) => void
  'game:selectWord': (data: { words: string[] }) => void
  'game:wordHint': (data: { hints: string[]; length: number }) => void
  'game:tick': (data: { timeLeft: number }) => void
  'game:correctGuess': (data: { playerId: string; playerName: string; score: number }) => void
  'game:roundEnd': (data: { word: string; scores: Record<string, number> }) => void
  'game:gameEnd': (data: { finalScores: Record<string, number> }) => void
  'canvas:sync': (data: { element: DrawingElement }) => void
  'canvas:cleared': () => void
  'chat:message': (data: { playerId: string; playerName: string; message: string; type: 'chat' | 'system' | 'correct' }) => void
}

export interface ClientToServerEvents {
  'room:create': (data: { name: string; maxPlayers: number }) => void
  'room:join': (data: { roomId: string }) => void
  'room:leave': (data: { roomId: string }) => void
  'room:ready': (data: { roomId: string }) => void
  'game:start': (data: { roomId: string }) => void
  'game:selectWord': (data: { roomId: string; word: string }) => void
  'canvas:draw': (data: { roomId: string; element: DrawingElement }) => void
  'canvas:clear': (data: { roomId: string }) => void
  'chat:message': (data: { roomId: string; message: string }) => void
}
