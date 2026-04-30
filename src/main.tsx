import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SocketProvider } from './context/socket-context'
import { GameProvider } from './context/game-context'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <GameProvider>
          <App />
        </GameProvider>
      </SocketProvider>
    </BrowserRouter>
  </StrictMode>,
)
