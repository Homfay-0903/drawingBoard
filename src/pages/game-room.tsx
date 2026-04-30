import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocketContext } from '../context/socket-context'
import { useGameContext } from '../context/game-context'

const GameRoom: React.FC = () => {
  const navigate = useNavigate()
  const { isConnected, connect } = useSocketContext()
  const { currentRoom, currentPlayer, toggleReady, leaveRoom } = useGameContext()

  useEffect(() => {
    if (!isConnected) {
      connect()
    }
    if (!currentRoom) {
      navigate('/lobby')
    }
  }, [isConnected, connect, currentRoom, navigate])

  if (!currentRoom || !currentPlayer) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>加载中...</p>
      </div>
    )
  }

  const handleLeaveRoom = () => {
    if (confirm('确定要离开房间吗？')) {
      leaveRoom()
      navigate('/lobby')
    }
  }

  const handleStartGame = () => {
    if (currentRoom.canStartGame) {
      // TODO: 发送开始游戏事件
      console.log('开始游戏')
    }
  }

  const allReady = currentRoom.players.every(p => p.isReady || p.isHost)
  const canStart = currentPlayer.isHost && allReady && currentRoom.players.length >= 2

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '20px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          padding: '16px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <div>
            <h2 style={{ margin: 0 }}>{currentRoom.name}</h2>
            <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
              房间ID: {currentRoom.id.slice(0, 8)}...
            </p>
          </div>
          <button
            onClick={handleLeaveRoom}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            离开房间
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '20px',
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <h3 style={{ margin: '0 0 16px 0' }}>玩家列表 ({currentRoom.players.length}/{currentRoom.maxPlayers})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentRoom.players.map((player) => (
                <div
                  key={player.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: player.id === currentPlayer.id ? '#E3F2FD' : '#f9f9f9',
                    borderRadius: '8px',
                    border: player.id === currentPlayer.id ? '2px solid #2196F3' : '2px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>{player.avatar}</span>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>
                        {player.nickname}
                        {player.isHost && ' 👑'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {player.isReady ? '✅ 已准备' : '⏳ 未准备'}
                      </div>
                    </div>
                  </div>
                  {player.isHost && (
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: '#FFE0B2',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}>
                      房主
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            height: 'fit-content',
          }}>
            <h3 style={{ margin: '0 0 16px 0' }}>游戏设置</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>回合数</span>
                <span style={{ fontWeight: 'bold' }}>{currentRoom.maxRounds}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>绘画时间</span>
                <span style={{ fontWeight: 'bold' }}>{currentRoom.drawTime}秒</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>房间状态</span>
                <span style={{ fontWeight: 'bold', color: currentRoom.status === 'waiting' ? '#4CAF50' : '#FF9800' }}>
                  {currentRoom.status === 'waiting' ? '等待中' : '游戏中'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {!currentPlayer.isHost && (
                <button
                  onClick={toggleReady}
                  style={{
                    padding: '12px',
                    backgroundColor: currentPlayer.isReady ? '#FF9800' : '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  {currentPlayer.isReady ? '取消准备' : '准备'}
                </button>
              )}

              {currentPlayer.isHost && (
                <button
                  onClick={handleStartGame}
                  disabled={!canStart}
                  style={{
                    padding: '12px',
                    backgroundColor: canStart ? '#4CAF50' : '#ccc',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: canStart ? 'pointer' : 'not-allowed',
                  }}
                >
                  {canStart ? '开始游戏' : '等待玩家准备...'}
                </button>
              )}

              {!allReady && currentPlayer.isHost && (
                <p style={{ margin: 0, fontSize: '12px', color: '#999', textAlign: 'center' }}>
                  需要所有玩家准备才能开始游戏
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameRoom
