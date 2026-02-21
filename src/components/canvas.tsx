import React, { useEffect, useRef, useState } from "react";
import rough from 'roughjs/bin/rough';
import type { ToolsTypes, drawingBoardElements } from '../type/element'

interface CanvCanvasProps {
    selectedTool: ToolsTypes
    lineShape: 'hand' | 'arrow' | undefined
}

const Canvas = ({ selectedTool, lineShape }: CanvCanvasProps) => {
    //Canvas DOM 元素
    const canvasRef = useRef<HTMLCanvasElement>(null)

    //已完成的内容
    const [elements, setElements] = useState<drawingBoardElements[]>([])

    //正在绘制的内容
    const [drawingElement, setDrawingElement] = useState<drawingBoardElements | null>(null)

    //选取的工具
    //const [selectedTool, setSelectedTool] = useState<ElementsTypes>('rectangle')

    const getCanvasRelativeCoords = (e: React.MouseEvent) => {
        if (!canvasRef.current) return { x: 0, y: 0 }
        const rect = canvasRef.current.getBoundingClientRect()
        // 减去Canvas元素在视口中的偏移量，得到Canvas内部坐标
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        return { x, y }
    }

    const resizeCanvas = () => {
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth * 0.8
            canvasRef.current.height = window.innerHeight * 0.8
        }
    }

    //初始化画笔 + 窗口大小监听
    useEffect(() => {
        // 初始化Canvas尺寸
        resizeCanvas()
        // 监听窗口大小变化，更新Canvas尺寸
        window.addEventListener('resize', resizeCanvas)

        return () => {
            window.removeEventListener('resize', resizeCanvas)
        }
    }, [])

    //初始化画笔
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        //清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        //创建画笔
        const rc = rough.canvas(canvas)

        //先绘制所有已固化的图形
        elements.forEach((element) => {
            if (element.type === 'rectangle') {
                rc.draw(
                    rc.rectangle(element.x, element.y, element.width, element.height, {
                        roughness: 2.5,
                        stroke: '#000'
                    })
                )
            } else if (element.type === 'line') {
                const x1 = element.x
                const y1 = element.y
                const x2 = element.x + element.width
                const y2 = element.y + element.height

                if (element.lineShape === 'arrow') {
                    drawArrow(ctx, x1, y1, x2, y2, element.stroke || '#000')
                } else {
                    rc.line(x1, y1, x2, y2, {
                        roughness: element.roughness || 2.5,
                        stroke: element.stroke || '#000',
                    })
                }
            }
        })

        //再画正在画的图形（预览）
        if (drawingElement) {
            const x1 = drawingElement.x
            const y1 = drawingElement.y
            const x2 = drawingElement.x + drawingElement.width
            const y2 = drawingElement.y + drawingElement.height


            if (drawingElement.type === 'rectangle') {
                rc.draw(
                    rc.rectangle(drawingElement.x, drawingElement.y, drawingElement.width, drawingElement.height, {
                        roughness: 2.5,
                        stroke: '#000'
                    })
                )
            } else if (drawingElement.type === 'line') {
                if (drawingElement.lineShape === 'arrow') {
                    drawArrow(ctx, x1, y1, x2, y2, '#000')
                } else {
                    rc.draw(
                        rc.line(x1, y1, x2, y2, { roughness: 2.5, stroke: '#000' })
                    )
                }
            }
        }
    }, [elements, drawingElement])

    //鼠标按下：开始画图
    const handleMouseDown = (e: React.MouseEvent) => {
        const { x, y } = getCanvasRelativeCoords(e)

        const newElement: drawingBoardElements = {
            id: Math.random().toString(36).substr(2, 9),
            type: selectedTool,
            x: x,
            y: y,
            width: 0,
            height: 0,
            roughness: 2.5,
            lineShape: lineShape

        }

        setDrawingElement(newElement)
    }

    //鼠标移动
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!drawingElement) return

        const { x, y } = getCanvasRelativeCoords(e)
        const width = x - drawingElement.x
        const height = y - drawingElement.y

        setDrawingElement({
            ...drawingElement,
            width,
            height
        })
    }

    //结束绘制
    const handleMouseUp = () => {
        if (drawingElement) {
            if (Math.abs(drawingElement.width) > 5 || Math.abs(drawingElement.height) > 5) {
                setElements((prev) => [...prev, drawingElement])
            }
            setDrawingElement(null)
        }
    }

    //画箭头线
    const drawArrow = (
        ctx: CanvasRenderingContext2D,
        fromX: number,
        fromY: number,
        toX: number,
        toY: number,
        color: string
    ) => {
        ctx.strokeStyle = color
        ctx.fillStyle = color
        ctx.lineWidth = 1

        //计算线的长度和角度
        const headLen = 10 //箭头长度
        const angle = Math.atan2(toY - fromY, toX - fromX)

        //画线
        ctx.beginPath()
        ctx.moveTo(fromX, fromY)
        ctx.lineTo(toX - headLen * Math.cos(angle), toY - headLen * Math.sin(angle))
        ctx.stroke()

        //画箭头
        ctx.beginPath()
        ctx.moveTo(toX, toY)
        ctx.lineTo(
            toX - headLen * Math.cos(angle - Math.PI / 6),
            toY - headLen * Math.sin(angle - Math.PI / 6)
        )
        ctx.lineTo(
            toX - headLen * Math.cos(angle + Math.PI / 6),
            toY - headLen * Math.sin(angle + Math.PI / 6)
        )

        ctx.closePath()
        ctx.fill()
    }

    return (
        <canvas
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
                width: '80%',
                margin: 'auto',
                border: '10px solid #885f22',
                borderRadius: '5px',
                display: 'block',
                backgroundColor: '#fff'
            }}>
        </canvas>
    )
}

export default Canvas