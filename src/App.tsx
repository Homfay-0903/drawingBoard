import './App.css'
import { useLocation, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/home'
import About from './pages/about'
import Lobby from './pages/lobby'
import GameRoom from './pages/game-room'
import Navbar from './components/navbar'
import DrawingBoard from './components/drawing-board-wrapper'

const DrawingBoardWrapper = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <DrawingBoard />
    </div>
  )
}

function App() {
  const location = useLocation()
  
  const hideNavbarPaths = ['/drawing-board', '/room']
  const showNavbar = !hideNavbarPaths.includes(location.pathname)

  return (
    <div style={{ width: '100vw', minHeight: '100vh', overflow: 'hidden' }}>
      {showNavbar && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/room" element={<GameRoom />} />
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
