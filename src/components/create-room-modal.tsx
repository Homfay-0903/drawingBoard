import React, { useState } from 'react'

interface CreateRoomModalProps {
  visible: boolean
  onClose: () => void
  onCreate: (name: string, maxPlayers: number) => void
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ visible, onClose, onCreate }) => {
  const [name, setName] = useState('')
  const [maxPlayers, setMaxPlayers] = useState(6)

  if (!visible) return null

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('请输入房间名称')
      return
    }
    onCreate(name.trim(), maxPlayers)
    setName('')
    setMaxPlayers(6)
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
        <h2 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>创建房间</h2>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            房间名称
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="请输入房间名称"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box',
            }}
            maxLength={20}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            最大人数: {maxPlayers}人
          </label>
          <input
            type="range"
            min={2}
            max={8}
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#999' }}>
            <span>2人</span>
            <span>8人</span>
          </div>
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
              backgroundColor: '#4CAF50',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            创建
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateRoomModal
