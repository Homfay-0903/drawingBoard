import React from 'react'
import type { RoomData } from '../types/game'

interface RoomCardProps {
  room: RoomData
  onJoin: (roomId: string) => void
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onJoin }) => {
  const playerCount = room.players.length
  const isFull = playerCount >= room.maxPlayers
  const isWaiting = room.status === 'waiting'
  const canJoin = isWaiting && !isFull

  const statusText = {
    waiting: '等待中',
    playing: '游戏中',
    finished: '已结束',
  }

  const statusColor = {
    waiting: '#4CAF50',
    playing: '#FF9800',
    finished: '#9E9E9E',
  }

  return (
    <div
      style={{
        border: '2px solid #ddd',
        borderRadius: '12px',
        padding: '16px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: canJoin ? 'pointer' : 'not-allowed',
        opacity: canJoin ? 1 : 0.7,
      }}
      onClick={() => canJoin && onJoin(room.id)}
      onMouseEnter={(e) => {
        if (canJoin) {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{room.name}</h3>
        <span
          style={{
            padding: '4px 12px',
            borderRadius: '12px',
            backgroundColor: statusColor[room.status],
            color: '#fff',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          {statusText[room.status]}
        </span>
      </div>
      
      <div style={{ display: 'flex', gap: '16px', color: '#666', fontSize: '14px' }}>
        <span>👥 {playerCount}/{room.maxPlayers}</span>
        <span>🎮 {room.maxRounds} 回合</span>
        <span>⏱ {room.drawTime}秒</span>
      </div>

      <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {room.players.slice(0, 4).map((player) => (
          <span
            key={player.id}
            style={{
              fontSize: '12px',
              backgroundColor: player.isHost ? '#FFE0B2' : '#E8F5E9',
              padding: '2px 8px',
              borderRadius: '8px',
            }}
          >
            {player.avatar} {player.nickname}
            {player.isHost && ' 👑'}
          </span>
        ))}
        {room.players.length > 4 && (
          <span style={{ fontSize: '12px', color: '#999' }}>
            +{room.players.length - 4} 更多
          </span>
        )}
      </div>
    </div>
  )
}

export default RoomCard
