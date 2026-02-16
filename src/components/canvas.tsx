import { useEffect, useRef, useState } from "react";
import rough from 'roughjs/bin/rough';
import type { ElementsTypes, LinesTypes, drawingBoardElements } from '../type/element'

interface CanvCanvasProps {
    selectedTool: ElementsTypes
}

const Canvas = ({ selectedTool }: CanvCanvasProps) => {
    //Canvas DOM 元素
    const canvasRef = useRef<HTMLCanvasElement>(null)

    //已完成的内容
    const [elements, setElements] = useState<drawingBoardElements[]>([])

    //正在绘制的内容
    const [drawingElement, setDrawingElement] = useState<drawingBoardElements | null>(null)

    //选取的工具
    //const [selectedTool, setSelectedTool] = useState<ElementsTypes>('rectangle')

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
                const x2 = element.y
            }
        })

        //再画正在画的图形（预览）
        if (drawingElement) {
            if (drawingElement.type === 'rectangle') {
                rc.draw(
                    rc.rectangle(drawingElement.x, drawingElement.y, drawingElement.width, drawingElement.height, {
                        roughness: 2.5,
                        stroke: '#000'
                    })
                )
            }
        }
    }, [elements, drawingElement])

    //鼠标按下：开始画图
    const handleMouseDown = (e: React.MouseEvent) => {
        const { clientX, clientY } = e

        const newElement: drawingBoardElements = {
            id: Math.random().toString(36).substr(2, 9),
            type: selectedTool,
            x: clientX,
            y: clientY,
            width: 0,
            height: 0,
            roughness: 2.5
        }

        setDrawingElement(newElement)
    }

    //鼠标移动
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!drawingElement) return

        const { clientX, clientY } = e
        const width = clientX - drawingElement.x
        const height = clientY - drawingElement.y

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
            style={{ border: '1px solid #eee', display: 'block', backgroundColor: '#fff' }}>
        </canvas>
    )
}

export default Canvas