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
}