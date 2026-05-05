import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/auth-context'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login, register } = useAuthContext()
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        await login(username, password)
      } else {
        if (!nickname.trim()) {
          setError('请输入昵称')
          setLoading(false)
          return
        }
        await register(username, password, nickname.trim())
      }
      navigate('/lobby')
    } catch (err: any) {
      setError(err.message || '操作失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '20px',
        padding: '40px',
        width: '420px',
        maxWidth: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', margin: '0 0 8px 0' }}>🎨 你画我猜</h1>
          <p style={{ color: '#666', margin: 0 }}>
            {isLogin ? '登录你的账号' : '创建新账号'}
          </p>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#FFEBEE',
            color: '#C62828',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="请输入用户名"
              required
              minLength={3}
              maxLength={20}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontSize: '16px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#667eea'}
              onBlur={e => e.currentTarget.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontSize: '16px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#667eea'}
              onBlur={e => e.currentTarget.style.borderColor = '#e0e0e0'}
            />
          </div>

          {!isLogin && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>
                昵称
              </label>
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="游戏中显示的名称"
                required
                maxLength={12}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#667eea'}
                onBlur={e => e.currentTarget.style.borderColor = '#e0e0e0'}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: loading ? '#ccc' : '#667eea',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '8px',
              transition: 'background-color 0.2s',
            }}
          >
            {loading ? '处理中...' : (isLogin ? '登 录' : '注 册')}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid #eee',
        }}>
          <span style={{ color: '#666' }}>
            {isLogin ? '还没有账号？' : '已有账号？'}
          </span>
          <button
            onClick={() => { setIsLogin(!isLogin); setError('') }}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '16px',
              marginLeft: '4px',
            }}
          >
            {isLogin ? '去注册' : '去登录'}
          </button>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#E3F2FD',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#1565C0',
        }}>
          💡 提示：使用不同浏览器登录不同账号，即可模拟多用户测试
        </div>
      </div>
    </div>
  )
}

export default LoginPage
