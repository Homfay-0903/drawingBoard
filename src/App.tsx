import './App.css';
import { useState, useCallback } from 'react'
import Canvas from './components/canvas'
import type { ToolsTypes, LinesTypes } from './type/element'

function App() {
  const [tool, setTool] = useState<ToolsTypes>('rectangle')
  const [lineShape, setLineShape] = useState<LinesTypes>()
  const [clearCanvas, setclearCanvas] = useState<() => void>(() => () => { })

  const registerClear = useCallback((fn: () => void) => {
    setclearCanvas(() => fn)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: '#f0f0f0'
      }}>
        <button
          onClick={() => { setTool('rectangle'); setLineShape(undefined) }}
          style={{ fontWeight: tool === 'rectangle' ? 'bold' : 'normal' }}
        >
          画矩形
        </button>

        {/* 线条工具组 */}
        <span style={{ margin: '0 10px' }}>
          <button
            onClick={() => { setTool('line'); setLineShape('arrow') }}
            style={{ fontWeight: lineShape === 'arrow' ? 'bold' : 'normal', marginRight: '10px' }}
          >
            箭头线
          </button>
          <button
            onClick={() => { setTool('line'); setLineShape('hand') }}
            style={{ fontWeight: lineShape === 'hand' ? 'bold' : 'normal' }}
          >
            手绘线
          </button>
        </span>

        <button
          onClick={() => {
            if (window.confirm('确定要清空画布吗？清空后无法恢复！')) {
              clearCanvas()
            }
          }}
          style={{ backgroundColor: 'red' }}
        >
          清空画布
        </button>
      </div>

      <Canvas selectedTool={tool} lineShape={lineShape} registerClear={registerClear}></Canvas>
    </div >
  )
}

export default App
