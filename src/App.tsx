import { useState } from 'react'
import Canvas from './components/canvas'
import type { ToolsTypes, LinesTypes } from './type/element'

function App() {
  const [tool, setTool] = useState<ToolsTypes>('rectangle')
  const [lineShape, setLineShape] = useState<LinesTypes>('line')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
        <button
          onClick={() => setTool('rectangle')}
          style={{ fontWeight: tool === 'rectangle' ? 'bold' : 'normal' }}
        >
          画矩形
        </button>

        {/* 线条工具组 */}
        <span style={{ margin: '0 10px' }}>
          <button
            onClick={() => { setTool('line'); setLineShape('arrow') }}
            style={{ fontWeight: lineShape === 'line' ? 'normal' : 'bold' }}
          >
            箭头线
          </button>
          <button
            onClick={() => { setTool('line'); setLineShape('line') }}
            style={{ fontWeight: lineShape === 'line' ? 'bold' : 'normal' }}
          >
            手绘线
          </button>
        </span>
      </div>

      <Canvas selectedTool={tool} lineShape={lineShape}></Canvas>
    </div>
  )
}

export default App
