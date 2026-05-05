import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSocketContext } from '../context/socket-context'
import { useGameContext } from '../context/game-context'
import { useAuthContext } from '../context/auth-context'
import ChatPanel from '../components/chat-panel'
import Timer from '../components/timer'
import WordSelector from '../components/word-selector'
import ScoreBoard from '../components/score-board'
import rough from 'roughjs/bin/rough'
import type { drawingBoardElements } from '../type/element'

const GameRoom: React.FC = () => {
  const navigate = useNavigate()
  const { roomId } = useParams()
  const { socket, isConnected } = useSocketContext()
  const { user } = useAuthContext()
  const {
    currentRoom, currentPlayer, isDrawer, gameStatus, timeLeft,
    wordHints, wordLength, messages, selectWords,
    canvasElements, toggleReady, leaveRoom, startGame, selectWord,
    sendMessage, sendCanvasElement, clearCanvas, resetGame, joinRoom
  } = useGameContext()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedTool, setSelectedTool] = useState<'rectangle' | 'line' | 'text'>('line')
  const [lineShape, setLineShape] = useState<'arrow' | 'hand'>('hand')
  const [strokeColor, setStrokeColor] = useState('#000000')
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [drawingElement, setDrawingElement] = useState<drawingBoardElements | null>(null)
  const [localElements, setLocalElements] = useState<drawingBoardElements[]>([])
  const [textModalVisible, setTextModalVisible] = useState(false)
  const [textModalPos, setTextModalPos] = useState({ x: 0, y: 0 })

  const canDraw = isDrawer && gameStatus === 'drawing'
  const canGuess = !isDrawer && gameStatus === 'drawing'

  useEffect(() => {
    if (!isConnected || !socket || !roomId) return
    if (!currentRoom) {
      joinRoom(roomId)
    }
  }, [isConnected, socket, roomId, currentRoom, joinRoom])

  useEffect(() => {
    if (!currentRoom && !roomId) navigate('/lobby')
  }, [currentRoom, roomId, navigate])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const dpr = window.devicePixelRatio || 1
    const cssWidth = canvas.parentElement?.clientWidth || 800
    const cssHeight = canvas.parentElement?.clientHeight || 600

    canvas.style.width = `${cssWidth}px`
    canvas.style.height = `${cssHeight}px`
    canvas.width = Math.round(cssWidth * dpr)
    canvas.height = Math.round(cssHeight * dpr)

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const rc = rough.canvas(canvas)

    const allElements = [...localElements, ...canvasElements.map(e => ({
      ...e,
      roughness: 2.5,
      lineShape: e.lineShape
    })) as drawingBoardElements[]]

    allElements.forEach((element) => {
      if (element.type === 'rectangle') {
        rc.draw(rc.rectangle(element.x, element.y, element.width, element.height, {
          roughness: 2.5,
          stroke: element.stroke,
          strokeWidth: element.strokeWidth
        }))
      } else if (element.type === 'line') {
        const x1 = element.x
        const y1 = element.y
        const x2 = element.x + element.width
        const y2 = element.y + element.height

        if (element.lineShape === 'hand' && (element as any).points) {
          const pathStr = (element as any).points.map((p: any, i: number) =>
            i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
          ).join(' ')
          rc.draw(rc.path(pathStr, {
            roughness: 2.5,
            stroke: element.stroke,
            strokeWidth: element.strokeWidth
          }))
        } else {
          rc.draw(rc.line(x1, y1, x2, y2, {
            roughness: 2.5,
            stroke: element.stroke,
            strokeWidth: element.strokeWidth
          }))
        }
      } else if (element.type === 'text') {
        ctx.fillStyle = element.stroke || '#000'
        ctx.font = `bold ${element.height || 16}px Arial`
        ctx.fillText((element as any).content || '', element.x, element.y)
      }
    })

    if (drawingElement) {
      if (drawingElement.type === 'rectangle') {
        rc.draw(rc.rectangle(drawingElement.x, drawingElement.y, drawingElement.width, drawingElement.height, {
          roughness: 2.5,
          stroke: drawingElement.stroke,
          strokeWidth: drawingElement.strokeWidth
        }))
      } else if (drawingElement.type === 'line' && drawingElement.lineShape === 'hand') {
        const de = drawingElement as any
        if (de.points && de.points.length) {
          const pathStr = de.points.map((p: any, i: number) =>
            i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
          ).join(' ')
          rc.draw(rc.path(pathStr, {
            roughness: 2.5,
            stroke: de.stroke,
            strokeWidth: de.strokeWidth
          }))
        }
      }
    }
  }, [localElements, canvasElements, drawingElement])

  const getCanvasCoords = (e: React.MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 }
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canDraw) return
    const { x, y } = getCanvasCoords(e)

    if (selectedTool === 'text') {
      setTextModalPos({ x, y })
      setTextModalVisible(true)
      return
    }

    const newElement: drawingBoardElements = {
      id: Math.random().toString(36).substr(2, 9),
      type: selectedTool,
      x, y,
      width: 0, height: 0,
      roughness: 2.5,
      lineShape,
      stroke: strokeColor,
      strokeWidth,
      ...(selectedTool === 'line' && lineShape === 'hand' ? { points: [{ x, y }] } : {})
    }
    setDrawingElement(newElement)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawingElement || !canDraw) return
    const { x, y } = getCanvasCoords(e)

    if (lineShape === 'hand') {
      setDrawingElement({
        ...drawingElement,
        points: [...(drawingElement.points || []), { x, y }]
      })
    } else {
      setDrawingElement({
        ...drawingElement,
        width: x - drawingElement.x,
        height: y - drawingElement.y
      })
    }
  }

  const handleMouseUp = () => {
    if (!drawingElement || !canDraw) return

    const isLineElement = drawingElement.type === 'line'
    const hasLineShape = isLineElement && (drawingElement as any).lineShape === 'hand'
    const hasContent = hasLineShape
      ? (drawingElement.points && drawingElement.points.length > 1)
      : (Math.abs(drawingElement.width) > 5 || Math.abs(drawingElement.height) > 5)

    if (hasContent) {
      setLocalElements(prev => [...prev, drawingElement])
      sendCanvasElement(drawingElement as any)
    }
    setDrawingElement(null)
  }

  const handleTextConfirm = (text: string) => {
    const newTextElement: drawingBoardElements = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'text',
      x: textModalPos.x,
      y: textModalPos.y,
      width: text.length * 10,
      height: 20,
      stroke: strokeColor,
      strokeWidth,
      content: text
    }
    setLocalElements(prev => [...prev, newTextElement])
    sendCanvasElement(newTextElement as any)
    setTextModalVisible(false)
  }

  const handleClearCanvas = () => {
    if (canDraw) {
      setLocalElements([])
      clearCanvas()
    }
  }

  const handleLeaveRoom = () => {
    if (confirm('确定要离开房间吗？')) {
      leaveRoom()
      navigate('/lobby')
    }
  }

  if (!currentRoom || !currentPlayer) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', backgroundColor: '#1a1a2e', color: '#fff', fontSize: '18px'
      }}>
        加载中...
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a2e' }}>
      {selectWords.length > 0 && isDrawer && (
        <WordSelector words={selectWords} onSelect={selectWord} timeLeft={timeLeft} />
      )}

      {/* 顶部栏 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
        backgroundColor: '#16213e',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2 style={{ margin: 0, color: '#fff' }}>{currentRoom.name}</h2>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>回合 {currentRoom.currentRound}/{currentRoom.maxRounds}</span>
        </div>

        {(gameStatus === 'selecting' || gameStatus === 'drawing') && (
          <Timer timeLeft={timeLeft} maxTime={gameStatus === 'selecting' ? 10 : 60} phase={gameStatus} />
        )}

        <button onClick={handleLeaveRoom} style={{
          padding: '8px 16px', backgroundColor: '#e94560', color: '#fff',
          border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
        }}>
          离开房间
        </button>
      </div>

      {/* 词语提示 */}
      {gameStatus === 'drawing' && wordHints.length > 0 && (
        <div style={{
          textAlign: 'center', padding: '12px',
          backgroundColor: '#0f3460', borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <span style={{
            fontSize: '24px', letterSpacing: '8px', fontWeight: 'bold', color: '#fff'
          }}>
            {isDrawer ? currentRoom.currentWord : wordHints.join(' ')}
          </span>
          {!isDrawer && (
            <span style={{ marginLeft: '16px', color: 'rgba(255,255,255,0.6)' }}>
              ({wordLength}个字)
            </span>
          )}
        </div>
      )}

      {/* 主内容区 */}
      <div style={{ flex: 1, display: 'flex', gap: '16px', padding: '16px', overflow: 'hidden' }}>
        {/* 左侧：玩家列表 */}
        <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            backgroundColor: '#16213e', borderRadius: '12px', padding: '12px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#fff' }}>玩家 ({currentRoom.players.length})</h4>
            {currentRoom.players.map(player => (
              <div key={player.id} style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px',
                backgroundColor: player.id === currentRoom.currentDrawerId ? 'rgba(233,69,96,0.2)' : 'transparent',
                borderRadius: '8px', marginBottom: '4px'
              }}>
                <span>{player.avatar}</span>
                <span style={{ flex: 1, color: '#fff' }}>{player.nickname}</span>
                {player.id === currentRoom.currentDrawerId && <span>🎨</span>}
                <span style={{ fontWeight: 'bold', color: '#81C784' }}>{player.score}</span>
              </div>
            ))}
          </div>

          {gameStatus === 'waiting' && (
            <div style={{
              backgroundColor: '#16213e', borderRadius: '12px', padding: '12px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {!currentPlayer.isHost ? (
                <button onClick={toggleReady} style={{
                  width: '100%', padding: '12px',
                  backgroundColor: currentPlayer.isReady ? '#FF9800' : '#4CAF50',
                  color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                }}>
                  {currentPlayer.isReady ? '取消准备' : '准备'}
                </button>
              ) : (
                <button onClick={startGame} disabled={!currentRoom.canStartGame} style={{
                  width: '100%', padding: '12px',
                  backgroundColor: currentRoom.canStartGame ? '#4CAF50' : '#555',
                  color: '#fff', border: 'none', borderRadius: '8px',
                  cursor: currentRoom.canStartGame ? 'pointer' : 'not-allowed', fontWeight: 'bold'
                }}>
                  开始游戏
                </button>
              )}
            </div>
          )}
        </div>

        {/* 中间：画布 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {canDraw && (
            <div style={{
              display: 'flex', gap: '8px', alignItems: 'center',
              backgroundColor: '#16213e', padding: '8px 12px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <input type="color" value={strokeColor} onChange={e => setStrokeColor(e.target.value)}
                style={{ width: '32px', height: '32px', border: 'none', cursor: 'pointer' }} />
              <select value={strokeWidth} onChange={e => setStrokeWidth(Number(e.target.value))}
                style={{ padding: '4px', backgroundColor: '#0f3460', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px' }}>
                {[1, 2, 3, 4, 5, 6, 8, 10].map(w => <option key={w} value={w}>{w}px</option>)}
              </select>
              <button onClick={() => { setSelectedTool('line'); setLineShape('hand') }}
                style={{
                  backgroundColor: lineShape === 'hand' && selectedTool === 'line' ? '#4CAF50' : 'rgba(255,255,255,0.1)',
                  color: lineShape === 'hand' && selectedTool === 'line' ? '#fff' : 'rgba(255,255,255,0.7)',
                  border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer'
                }}>✏️ 画笔</button>
              <button onClick={() => { setSelectedTool('rectangle'); setLineShape('hand') }}
                style={{
                  backgroundColor: selectedTool === 'rectangle' ? '#4CAF50' : 'rgba(255,255,255,0.1)',
                  color: selectedTool === 'rectangle' ? '#fff' : 'rgba(255,255,255,0.7)',
                  border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer'
                }}>⬜ 矩形</button>
              <button onClick={handleClearCanvas}
                style={{
                  backgroundColor: '#e94560', color: '#fff', border: 'none',
                  padding: '8px 12px', borderRadius: '4px', cursor: 'pointer'
                }}>🗑️ 清空</button>
            </div>
          )}

          <div style={{
            flex: 1, backgroundColor: '#FFFFF0', borderRadius: '12px',
            border: '4px solid #8B4513', overflow: 'hidden'
          }}>
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{ display: 'block', width: '100%', height: '100%', cursor: canDraw ? 'crosshair' : 'default' }}
            />
          </div>

          {textModalVisible && (
            <div style={{
              position: 'absolute', left: textModalPos.x, top: textModalPos.y,
              backgroundColor: '#16213e', padding: '12px', borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <input autoFocus onKeyDown={e => {
                if (e.key === 'Enter') handleTextConfirm((e.target as HTMLInputElement).value)
              }}
                style={{
                  padding: '8px', border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '4px', backgroundColor: '#0f3460', color: '#fff', outline: 'none'
                }}
                placeholder="输入文字" />
              <button onClick={() => setTextModalVisible(false)}
                style={{ marginLeft: '8px', color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', cursor: 'pointer' }}>
                取消
              </button>
            </div>
          )}
        </div>

        {/* 右侧：聊天 */}
        <div style={{ width: '300px' }}>
          <ChatPanel
            messages={messages}
            onSendMessage={sendMessage}
            canSend={canGuess}
            placeholder={canGuess ? '输入你的猜测...' : '等待游戏开始...'}
          />
        </div>
      </div>

      {/* 游戏结束弹窗 */}
      {gameStatus === 'gameEnd' && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#16213e', borderRadius: '20px', padding: '32px',
            maxWidth: '400px', width: '90%', border: '1px solid rgba(255,255,255,0.15)'
          }}>
            <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#fff' }}>🎉 游戏结束！</h2>
            <ScoreBoard players={currentRoom.players} title="最终排名" />
            <button onClick={() => { resetGame(); navigate('/lobby'); }}
              style={{
                width: '100%', marginTop: '24px', padding: '12px',
                backgroundColor: '#4CAF50', color: '#fff', border: 'none',
                borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px'
              }}>
              返回大厅
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameRoom
