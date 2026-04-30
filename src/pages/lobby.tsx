import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocketContext } from '../context/socket-context'
import { useGameContext } from '../context/game-context'
import RoomCard from '../components/room-card'
import CreateRoomModal from '../components/create-room-modal'
import JoinRoomModal from '../components/join-room-modal'

const Lobby: React.FC = () => {
  const navigate = useNavigate()
  const { isConnected, connect } = useSocketContext()
  const { rooms, createRoom, joinRoom } = useGameContext()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<{ id: string; name: string } | null>(null)

  useEffect(() => {
    if (!isConnected) {
      connect()
    }
  }, [isConnected, connect])

  useEffect(() => {
    if (showJoinModal && selectedRoom) {
      // 加入成功后跳转到房间页面
    }
  }, [showJoinModal, selectedRoom])

  const handleCreateRoom = (name: string, maxPlayers: number) => {
    createRoom(name, maxPlayers)
    navigate('/room')
  }

  const handleJoinRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId)
    if (room) {
      setSelectedRoom({ id: roomId, name: room.name })
      setShowJoinModal(true)
    }
  }

  const handleConfirmJoin = (roomId: string, nickname: string) => {
    joinRoom(roomId, nickname)
    navigate('/room')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', color: '#333' }}>🎮 游戏大厅</h1>
            <p style={{ margin: '8px 0 0 0', color: '#666' }}>
              {isConnected ? '🟢 已连接服务器' : '🔴 未连接服务器'}
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            ➕ 创建房间
          </button>
        </div>

        {rooms.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#666' }}>暂无房间</h3>
            <p style={{ margin: 0, color: '#999' }}>点击上方按钮创建一个新房间吧！</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}>
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onJoin={handleJoinRoom}
              />
            ))}
          </div>
        )}
      </div>

      <CreateRoomModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateRoom}
      />

      <JoinRoomModal
        visible={showJoinModal}
        roomId={selectedRoom?.id || ''}
        roomName={selectedRoom?.name || ''}
        onClose={() => {
          setShowJoinModal(false)
          setSelectedRoom(null)
        }}
        onJoin={handleConfirmJoin}
      />
    </div>
  )
}

export default Lobby
