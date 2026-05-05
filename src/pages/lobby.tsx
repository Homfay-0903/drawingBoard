import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocketContext } from '../context/socket-context'
import { useAuthContext } from '../context/auth-context'
import type { RoomData } from '../types/game'

const LobbyPage: React.FC = () => {
  const navigate = useNavigate()
  const { socket, isConnected } = useSocketContext()
  const { user, logout } = useAuthContext()
  const [rooms, setRooms] = useState<RoomData[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [roomName, setRoomName] = useState('')
  const [maxPlayers, setMaxPlayers] = useState(6)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!socket) return

    socket.on('room:list', (data: RoomData[]) => {
      setRooms(data)
    })

    socket.on('room:created', (data: { room: RoomData }) => {
      navigate(`/room/${data.room.id}`, { state: { room: data.room } })
    })

    socket.on('room:joined', (data: { room: RoomData }) => {
      navigate(`/room/${data.room.id}`, { state: { room: data.room } })
    })

    socket.on('room:error', (data: { message: string }) => {
      setError(data.message)
      setTimeout(() => setError(''), 3000)
    })

    return () => {
      socket.off('room:list')
      socket.off('room:created')
      socket.off('room:joined')
      socket.off('room:error')
    }
  }, [socket, navigate])

  const handleCreateRoom = useCallback(() => {
    if (!socket || !roomName.trim()) return
    socket.emit('room:create', { name: roomName.trim(), maxPlayers })
    setShowCreate(false)
    setRoomName('')
  }, [socket, roomName, maxPlayers])

  const handleJoinRoom = useCallback((roomId: string) => {
    if (!socket) return
    socket.emit('room:join', { roomId })
  }, [socket])

  const handleLogout = useCallback(() => {
    logout()
    navigate('/login')
  }, [logout, navigate])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      padding: '24px',
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        {/* 顶部栏 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          padding: '16px 24px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>{user?.avatar}</span>
            <div>
              <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '18px' }}>{user?.nickname}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                {isConnected ? '🟢 已连接' : '🔴 未连接'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowCreate(true)}
              style={{
                padding: '10px 24px',
                backgroundColor: '#e94560',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              + 创建房间
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '10px 16px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              退出登录
            </button>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div style={{
            padding: '12px 20px',
            backgroundColor: 'rgba(233,69,96,0.9)',
            color: '#fff',
            borderRadius: '10px',
            marginBottom: '16px',
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
            {error}
          </div>
        )}

        {/* 创建房间弹窗 */}
        {showCreate && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
          }}
            onClick={() => setShowCreate(false)}
          >
            <div style={{
              backgroundColor: '#1a1a2e',
              padding: '32px',
              borderRadius: '20px',
              width: '400px',
              maxWidth: '90%',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
              onClick={e => e.stopPropagation()}
            >
              <h2 style={{ color: '#fff', marginTop: 0, marginBottom: '24px' }}>创建房间</h2>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                  房间名称
                </label>
                <input
                  value={roomName}
                  onChange={e => setRoomName(e.target.value)}
                  placeholder="请输入房间名称"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                  最大人数: {maxPlayers}
                </label>
                <input
                  type="range"
                  min={2}
                  max={8}
                  value={maxPlayers}
                  onChange={e => setMaxPlayers(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowCreate(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  取消
                </button>
                <button
                  onClick={handleCreateRoom}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#e94560',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }}
                >
                  创建
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 房间列表 */}
        <h2 style={{ color: '#fff', marginBottom: '16px' }}>🏠 房间列表</h2>
        {rooms.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '16px',
            border: '1px dashed rgba(255,255,255,0.2)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎮</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}>
              暂无房间，点击上方按钮创建一个吧！
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}>
            {rooms.map(room => (
              <div
                key={room.id}
                style={{
                  padding: '20px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: room.status === 'waiting' && !room.canStartGame ? 'pointer' : 'default',
                  transition: 'transform 0.2s, background-color 0.2s',
                }}
                onClick={() => {
                  if (room.status === 'waiting') handleJoinRoom(room.id)
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}>
                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '18px' }}>
                    {room.name}
                  </span>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: room.status === 'waiting' ? 'rgba(76,175,80,0.3)' : 'rgba(233,69,96,0.3)',
                    color: room.status === 'waiting' ? '#81C784' : '#EF5350',
                  }}>
                    {room.status === 'waiting' ? '等待中' : '游戏中'}
                  </span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '8px' }}>
                  👥 {room.players.length}/{room.maxPlayers}
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {room.players.map(p => (
                    <span key={p.id} style={{ fontSize: '20px' }}>{p.avatar}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LobbyPage
