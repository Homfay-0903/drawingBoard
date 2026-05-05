import React from 'react'
import type { PlayerData } from '../types/game'

interface ScoreBoardProps {
  players: PlayerData[]
  title?: string
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ players, title = '排行榜' }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0: return { backgroundColor: '#FFD700', color: '#000' }
      case 1: return { backgroundColor: '#C0C0C0', color: '#000' }
      case 2: return { backgroundColor: '#CD7F32', color: '#fff' }
      default: return { backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff' }
    }
  }

  return (
    <div style={{
      backgroundColor: '#0f3460',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid rgba(255,255,255,0.1)',
    }}>
      <h3 style={{ margin: '0 0 16px 0', textAlign: 'center', color: '#fff' }}>{title}</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
            }}
          >
            <span style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              fontWeight: 'bold',
              fontSize: '14px',
              ...getRankStyle(index),
            }}>
              {index + 1}
            </span>

            <span style={{ fontSize: '20px' }}>{player.avatar}</span>

            <span style={{ flex: 1, fontWeight: index < 3 ? 'bold' : 'normal', color: '#fff' }}>
              {player.nickname}
            </span>

            <span style={{
              fontWeight: 'bold',
              color: '#81C784',
              fontSize: '16px',
            }}>
              {player.score}分
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScoreBoard
