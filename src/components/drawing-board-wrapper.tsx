import { DrawingProvider, useDrawingContext } from '../context/drawing-context'
import Canvas from './canvas'
import HistoryControls from './history-controls'
import ErrorBoundary from './error-boundary'
import Navbar from './navbar'
import { useCallback } from 'react'

const Toolbar = () => {
    const { tool, setTool, lineShape, setLineShape, strokeColor, setStrokeColor, strokeWidth, setStrokeWidth, setElements, setDrawingElement, exportToImage } = useDrawingContext()

    const handleClearCanvas = useCallback(() => {
        if (window.confirm('确定要清空画布吗？清空后无法恢复！')) {
            setElements([]);
            setDrawingElement(null);
        }
    }, [setElements, setDrawingElement])

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
            backgroundColor: '#EAE0CD'
        }}>
            {/* 颜色选择器 */}
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

            {/* 画笔粗细选择器 */}
            <div style={{
                marginRight: '10px',
                backgroundColor: '#FCC58D',
                padding: '8px 18px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center'
            }}>
                画笔粗细
                <select
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(Number(e.target.value))}
                    style={{ marginLeft: '8px', padding: '2px', backgroundColor: '#fff', color: '#000' }}
                >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(width => (
                        <option key={width} value={width}>{width}px</option>
                    ))}
                </select>
            </div>

            {/* 基础工具 */}
            <button
                onClick={() => { setTool('text'); setLineShape(undefined) }}
                style={{ fontWeight: tool === 'text' ? 'bold' : 'normal', backgroundColor: '#FCC58D', marginRight: '10px' }}
            >
                添加文本
            </button>

            {/* 线条工具组 */}
            <span style={{ margin: '0 10px' }}>
                <button
                    onClick={() => { setTool('rectangle'); setLineShape(undefined) }}
                    style={{ fontWeight: tool === 'rectangle' ? 'bold' : 'normal', backgroundColor: '#FCC58D', marginRight: '10px' }}
                >
                    画矩形
                </button>
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

            {/* 历史记录（撤销/重做） */}
            <HistoryControls />

            {/* 导出图片 */}
            <button
                onClick={exportToImage}
                style={{ backgroundColor: '#4CAF50', color: 'white', marginLeft: '10px' }}
            >
                导出图片
            </button>

            {/* 清空画布 */}
            <button
                onClick={handleClearCanvas}
                style={{ backgroundColor: 'red', marginLeft: '10px' }}
            >
                清空画布
            </button>
        </div>
    )
}

const DrawingBoard = () => {
    return (
        <DrawingProvider>
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ overflow: 'hidden' }}>
                    <Toolbar />
                </div>

                <div style={{ overflow: 'hidden', flex: '1' }}>
                    <ErrorBoundary>
                        <Canvas />
                    </ErrorBoundary>
                </div>

                <div style={{ overflow: 'hidden' }}>
                    <Navbar />
                </div>
            </div>
        </DrawingProvider>
    )
}

export default DrawingBoard