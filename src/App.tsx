import './App.css'
import { useLocation, Routes, Route, Navigate, Link } from 'react-router-dom'
import Home from './pages/home'
import About from './pages/about'
import Lobby from './pages/lobby'
import GameRoom from './pages/game-room'
import LoginPage from './pages/login'
import Navbar from './components/navbar'
import DrawingBoard from './components/drawing-board-wrapper'
import { useAuthContext } from './context/auth-context'

const DrawingBoardWrapper = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <DrawingBoard />
    </div>
  )
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthContext()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

function App() {
  const location = useLocation()
  const { isAuthenticated } = useAuthContext()

  const hideNavbarPaths = ['/drawing-board', '/room', '/login']
  const showNavbar = !hideNavbarPaths.some(p => location.pathname.startsWith(p))

  return (
    <div style={{ width: '100vw', minHeight: '100vh', overflow: 'hidden' }}>
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/lobby" replace /> : <LoginPage />} />
        <Route path="/lobby" element={
          <ProtectedRoute><Lobby /></ProtectedRoute>
        } />
        <Route path="/room/:roomId" element={
          <ProtectedRoute><GameRoom /></ProtectedRoute>
        } />
        <Route path="/room" element={
          <ProtectedRoute><GameRoom /></ProtectedRoute>
        } />
        <Route path="/drawing-board" element={<DrawingBoardWrapper />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>404 - 页面未找到</h1>
            <Link to="/">返回首页</Link>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App
