import React, { useState } from 'react'

interface JoinRoomModalProps {
  visible: boolean
  roomId: string
  roomName: string
  onClose: () => void
  onJoin: (roomId: string, nickname: string) => void
}

const JoinRoomModal: React.FC<JoinRoomModalProps> = ({ visible, roomId, roomName, onClose, onJoin }) => {
  const [nickname, setNickname] = useState('')

  if (!visible) return null

  const handleSubmit = () => {
    if (!nickname.trim()) {
      alert('请输入昵称')
      return
    }
    onJoin(roomId, nickname.trim())
    setNickname('')
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          padding: '24px',
          width: '400px',
          maxWidth: '90%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: '0 0 8px 0', textAlign: 'center' }}>加入房间</h2>
        <p style={{ margin: '0 0 20px 0', textAlign: 'center', color: '#666' }}>
          {roomName}
        </p>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            你的昵称
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="请输入昵称"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box',
            }}
            maxLength={12}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#fff',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#2196F3',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            加入
          </button>
        </div>
      </div>
    </div>
  )
}

export default JoinRoomModal
