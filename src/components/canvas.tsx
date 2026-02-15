import { useEffect, useRef, useState } from "react";
import rough from 'roughjs/bin/rough';
import type { ElementsTypes, drawingBoardElements } from '../type/element'

const Canvas = () => {
    //Canvas DOM 元素
    const canvasRef = useRef<HTMLCanvasElement>(null)

    //已完成的内容
    const [elements, setElements] = useState<drawingBoardElements[]>([])

    //正在绘制的内容
    const [drawingElement, setDrawingElement] = useState<drawingBoardElements | null>(null)

    //选取的工具
    const [selectedTool, setSelectedTool] = useState<ElementsTypes | null>(null)

    //初始化画笔
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        //清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        //先绘制所有已固化的图形
        elements.forEach((element) => {
            const rc = rough.canvas(canvas)
            if (element.type === 'rectangle') {
                rc.draw(
                    rc.rectangle(element.x, element.y, element.width, element.height, {
                        roughness: 2.5,
                        stroke: '#000'
                    })
                )
            }

            //todo 线条
        })

        //再画正在画的图形（预览）
        if (drawingElement) {
            const rc = rough.canvas(canvas)
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

    return <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
}

export default Canvas