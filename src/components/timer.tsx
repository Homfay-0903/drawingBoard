import React from 'react'

interface TimerProps {
  timeLeft: number
  maxTime: number
  phase: 'selecting' | 'drawing' | 'roundEnd'
}

const Timer: React.FC<TimerProps> = ({ timeLeft, maxTime, phase }) => {
  const percentage = (timeLeft / maxTime) * 100
  
  const getColor = () => {
    if (phase === 'selecting') return '#FF9800'
    if (phase === 'roundEnd') return '#9E9E9E'
    if (percentage > 50) return '#4CAF50'
    if (percentage > 25) return '#FF9800'
    return '#f44336'
  }

  const getPhaseText = () => {
    switch (phase) {
      case 'selecting': return '选词中...'
      case 'drawing': return '绘画中'
      case 'roundEnd': return '回合结束'
    }
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 16px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      <span style={{ fontSize: '14px', color: '#666' }}>{getPhaseText()}</span>
      
      <div style={{
        width: '120px',
        height: '8px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: getColor(),
          transition: 'width 1s linear',
        }} />
      </div>
      
      <span style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: getColor(),
        minWidth: '40px',
        textAlign: 'center',
      }}>
        {timeLeft}
      </span>
    </div>
  )
}

export default Timer
