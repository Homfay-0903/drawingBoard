import './App.css';
import { useLocation, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import Navbar from './components/navbar';
import DrawingBoard from './components/drawing-board-wrapper';


const DrawingBoardWrapper = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <DrawingBoard />
    </div>
  )
}

function App() {
  const location = useLocation()
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* 全局导航栏（绘图页使用页面内底部导航，因此在该路由隐藏） */}
      {location.pathname !== '/drawing-board' && <Navbar />}
      {/* 路由匹配规则*/}
      <Routes>
        <Route path="/" element={<Home />} /> {/* 首页 */}
        <Route path="/drawing-board" element={<DrawingBoardWrapper />} /> {/* 绘图板页 */}
        <Route path="/about" element={<About />} /> {/* 关于页 */}
        {/* 404页面 */}
        <Route path="*" element={<div style={{ textAlign: 'center', padding: '20px' }}>
          <h1>404 - 页面未找到</h1>
          <Link to="/">返回首页</Link>
        </div>} />
      </Routes>
    </div>
  )
}

export default App
