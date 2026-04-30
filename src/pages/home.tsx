import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div style={{ 
      padding: '40px 20px', 
      textAlign: 'center',
      minHeight: 'calc(100vh - 60px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '600px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{ fontSize: '48px', margin: '0 0 16px 0' }}>🎨 你画我猜</h1>
        <p style={{ fontSize: '18px', color: '#666', margin: '0 0 32px 0' }}>
          一个有趣的多人在线绘画猜词游戏
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/lobby')}
            style={{
              padding: '16px 32px',
              fontSize: '18px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            🎮 进入游戏
          </button>
          <button
            onClick={() => navigate('/drawing-board')}
            style={{
              padding: '16px 32px',
              fontSize: '18px',
              backgroundColor: '#FCC58D',
              color: '#333',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            ✏️ 练习绘画
          </button>
        </div>

        <div style={{ marginTop: '40px', textAlign: 'left' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>游戏玩法</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#666', lineHeight: '2' }}>
            <li>创建或加入一个游戏房间</li>
            <li>轮流担任画手，根据词语绘画</li>
            <li>其他玩家在聊天框中猜测答案</li>
            <li>猜对得分，回合结束后公布答案</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Home
