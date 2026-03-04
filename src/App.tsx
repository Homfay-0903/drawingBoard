import './App.css';
import { useState, useCallback } from 'react'
import Canvas from './components/canvas'
import type { ToolsTypes, LinesTypes } from './type/element'

function App() {
  const [tool, setTool] = useState<ToolsTypes>('rectangle')
  const [lineShape, setLineShape] = useState<LinesTypes>()
  const [clearCanvas, setClearCanvas] = useState<() => void>(() => () => { })
  const [strokeColor, setStrokeColor] = useState<string>('#000')

  const registerClear = useCallback((fn: () => void) => {
    setClearCanvas(() => fn)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: '#EAE0CD'
      }}>
        <div style={{
          marginRight: '10px',
          backgroundColor: '#FCC58D',
          padding: '8px 18px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center'
        }}>
          画笔颜色
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            style={{ width: '24px', height: '24px', border: 'none', cursor: 'pointer', padding: '0', backgroundColor: '#FCC58D' }}

            title="点击选择颜色"
          />
        </div>

        <button
          onClick={() => { setTool('rectangle'); setLineShape(undefined) }}
          style={{ fontWeight: tool === 'rectangle' ? 'bold' : 'normal', backgroundColor: '#FCC58D' }}
        >
          画矩形
        </button>

        {/* 线条工具组 */}
        <span style={{ margin: '0 10px' }}>
          <button
            onClick={() => { setTool('line'); setLineShape('arrow') }}
            style={{ fontWeight: lineShape === 'arrow' ? 'bold' : 'normal', marginRight: '10px', backgroundColor: '#FCC58D' }}
          >
            箭头线
          </button>
          <button
            onClick={() => { setTool('line'); setLineShape('hand') }}
            style={{ fontWeight: lineShape === 'hand' ? 'bold' : 'normal', backgroundColor: '#FCC58D' }}
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

      <Canvas strokeColor={strokeColor} selectedTool={tool} lineShape={lineShape} registerClear={registerClear}></Canvas>
    </div >
  )
}

export default App
