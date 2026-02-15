import { useState } from 'react'
import Canvas from './components/canvas'
import type { ElementsTypes } from './type/element'

function App() {
  const [tool, setTool] = useState<ElementsTypes>('rectangle')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
        <button
          onClick={() => setTool('rectangle')}
          style={{ fontWeight: tool === 'rectangle' ? 'bold' : 'normal' }}
        >
          画矩形
        </button>
        <button
          onClick={() => setTool('line')}
          style={{ fontWeight: tool === 'line' ? 'bold' : 'normal' }}
        >
          画线条
        </button>
      </div>

      <Canvas selectedTool={tool}></Canvas>
    </div>
  )
}

export default App
