import React, { useState, useRef, useEffect } from 'react'
import type { ChatMessageData } from '../types/game'

interface ChatPanelProps {
  messages: ChatMessageData[]
  onSendMessage: (message: string) => void
  canSend: boolean
  placeholder?: string
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, canSend, placeholder = '输入消息...' }) => {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (input.trim() && canSend) {
      onSendMessage(input.trim())
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getMessageStyle = (type: 'chat' | 'system' | 'correct') => {
    switch (type) {
      case 'system':
        return { backgroundColor: '#FFF3E0', color: '#E65100' }
      case 'correct':
        return { backgroundColor: '#E8F5E9', color: '#2E7D32', fontWeight: 'bold' }
      default:
        return { backgroundColor: '#f5f5f5', color: '#333' }
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#fff',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #eee',
        fontWeight: 'bold',
        backgroundColor: '#fafafa',
      }}>
        💬 聊天 / 猜词
      </div>

      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
            暂无消息
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                ...getMessageStyle(msg.type),
              }}
            >
              {msg.type === 'chat' && (
                <span style={{ fontWeight: 'bold', marginRight: '8px' }}>
                  {msg.playerName}:
                </span>
              )}
              <span>{msg.content}</span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '12px', borderTop: '1px solid #eee' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={!canSend}
            style={{
              flex: 1,
              padding: '10px 12px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: canSend ? '#fff' : '#f5f5f5',
            }}
          />
          <button
            onClick={handleSend}
            disabled={!canSend || !input.trim()}
            style={{
              padding: '10px 16px',
              backgroundColor: canSend && input.trim() ? '#2196F3' : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: canSend && input.trim() ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
            }}
          >
            发送
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatPanel
