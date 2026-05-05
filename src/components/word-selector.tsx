import React from 'react'

interface WordSelectorProps {
  words: string[]
  onSelect: (word: string) => void
  timeLeft: number
}

const WordSelector: React.FC<WordSelectorProps> = ({ words, onSelect, timeLeft }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '20px',
        padding: '32px',
        textAlign: 'center',
        maxWidth: '500px',
        width: '90%',
      }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>🎨 选择要画的词语</h2>
        <p style={{ margin: '0 0 24px 0', color: '#666' }}>
          剩余时间: <span style={{ color: timeLeft <= 3 ? '#f44336' : '#2196F3', fontWeight: 'bold' }}>{timeLeft}秒</span>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {words.map((word, index) => (
            <button
              key={index}
              onClick={() => onSelect(word)}
              style={{
                padding: '16px 24px',
                fontSize: '20px',
                backgroundColor: '#E3F2FD',
                border: '2px solid #2196F3',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontWeight: 'bold',
                color: '#1565C0',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2196F3'
                e.currentTarget.style.color = '#fff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#E3F2FD'
                e.currentTarget.style.color = '#1565C0'
              }}
            >
              {word}
            </button>
          ))}
        </div>

        <p style={{ margin: '24px 0 0 0', fontSize: '14px', color: '#999' }}>
          超时将自动选择第一个词语
        </p>
      </div>
    </div>
  )
}

export default WordSelector
