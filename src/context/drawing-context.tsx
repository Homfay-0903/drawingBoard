import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import rough from 'roughjs/bin/rough';
import type { ToolsTypes, LinesTypes, drawingBoardElements } from '../type/element';

interface DrawingContextType {
    tool: ToolsTypes
    setTool: (tool: ToolsTypes) => void
    lineShape: LinesTypes | undefined
    setLineShape: (shape: LinesTypes | undefined) => void
    strokeColor: string
    setStrokeColor: (color: string) => void
    strokeWidth: number
    setStrokeWidth: (width: number) => void
    elements: drawingBoardElements[]
    setElements: React.Dispatch<React.SetStateAction<drawingBoardElements[]>>
    drawingElement: drawingBoardElements | null
    setDrawingElement: React.Dispatch<React.SetStateAction<drawingBoardElements | null>>
    historyStack: drawingBoardElements[][] // 历史记录栈
    historyIndex: number // 当前历史索引
    undo: () => void // 撤销
    redo: () => void // 重做
    exportToImage: () => void // 导出为图片
}

const DrawingContext = createContext<DrawingContextType | null>(null)

export const DrawingProvider = ({ children }: React.PropsWithChildren) => {
    const [tool, setTool] = useState<ToolsTypes>('rectangle')
    const [lineShape, setLineShape] = useState<LinesTypes>()
    const [strokeColor, setStrokeColor] = useState<string>('#000000')
    const [strokeWidth, setStrokeWidth] = useState<number>(2) // 默认画笔粗细
    const [elements, setElements] = useState<drawingBoardElements[]>([])
    const [drawingElement, setDrawingElement] = useState<drawingBoardElements | null>(null)

    // 历史记录相关状态
    const [historyStack, setHistoryStack] = useState<drawingBoardElements[][]>([[]])
    const [historyIndex, setHistoryIndex] = useState(0)

    // 撤销功能
    const undo = useCallback(() => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1
            setHistoryIndex(newIndex)
            setElements(historyStack[newIndex])
        }
    }, [historyIndex, historyStack])

    // 重做功能
    const redo = useCallback(() => {
        if (historyIndex < historyStack.length - 1) {
            const newIndex = historyIndex + 1
            setHistoryIndex(newIndex)
            setElements(historyStack[newIndex])
        }
    }, [historyIndex, historyStack])

    // 更新元素时同步历史记录，支持函数式更新
    const updateElementsWithHistory = useCallback((newElements: React.SetStateAction<drawingBoardElements[]>) => {
        setElements((prev) => {
            const resolved = typeof newElements === 'function'
                ? (newElements as (prev: drawingBoardElements[]) => drawingBoardElements[])(prev)
                : newElements

            const newHistory = historyStack.slice(0, historyIndex + 1).concat([resolved])
            setHistoryStack(newHistory)
            setHistoryIndex(newHistory.length - 1)
            return resolved
        })
    }, [historyIndex, historyStack])

    // 导出为图片功能
    const exportToImage = useCallback(() => {
        // 创建临时canvas用于导出
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        if (!ctx) return;

        // 设置合适的尺寸（可以根据需要调整）
        tempCanvas.width = 1200;
        tempCanvas.height = 800;

        // 设置白色背景
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // 创建rough.js实例
        const rc = rough.canvas(tempCanvas);

        // 重新绘制所有元素
        elements.forEach((element) => {
            const adjustedElement = {
                ...element,
                // 调整坐标以适应新的画布尺寸，这里简单按比例缩放
                x: element.x,
                y: element.y,
                width: element.width,
                height: element.height
            };

            switch (element.type) {
                case 'rectangle':
                    rc.draw(
                        rc.rectangle(adjustedElement.x, adjustedElement.y, adjustedElement.width, adjustedElement.height, {
                            roughness: element.roughness || 2.5,
                            stroke: element.stroke || strokeColor,
                            strokeWidth: element.strokeWidth || strokeWidth
                        })
                    );
                    break;
                case 'text':
                    ctx.fillStyle = element.stroke || strokeColor;
                    ctx.font = `${element.height || 16}px Arial`;
                    ctx.fillText((element as any).content || '', adjustedElement.x, adjustedElement.y);
                    break;
                case 'line':
                    const x1 = adjustedElement.x;
                    const y1 = adjustedElement.y;
                    const x2 = adjustedElement.x + adjustedElement.width;
                    const y2 = adjustedElement.y + adjustedElement.height;

                    if (element.lineShape === 'arrow') {
                        // 绘制箭头
                        ctx.strokeStyle = element.stroke || strokeColor;
                        ctx.fillStyle = element.stroke || strokeColor;
                        ctx.lineWidth = element.strokeWidth || strokeWidth;

                        const headLen = 10;
                        const angle = Math.atan2(y2 - y1, x2 - x1);

                        // 画线
                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x2 - headLen * Math.cos(angle), y2 - headLen * Math.sin(angle));
                        ctx.stroke();

                        // 画箭头
                        ctx.beginPath();
                        ctx.moveTo(x2, y2);
                        ctx.lineTo(
                            x2 - headLen * Math.cos(angle - Math.PI / 6),
                            y2 - headLen * Math.sin(angle - Math.PI / 6)
                        );
                        ctx.lineTo(
                            x2 - headLen * Math.cos(angle + Math.PI / 6),
                            y2 - headLen * Math.sin(angle + Math.PI / 6)
                        );
                        ctx.closePath();
                        ctx.fill();
                    } else if (element.lineShape === 'hand') {
                        const lineEl = element as any;
                        if (lineEl.points && lineEl.points.length) {
                            const pathStr = lineEl.points.map((p: any, i: number) =>
                                i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
                            ).join(' ');

                            rc.draw(rc.path(pathStr, {
                                roughness: element.roughness || 2.5,
                                stroke: element.stroke || strokeColor,
                                strokeWidth: element.strokeWidth || strokeWidth
                            }));
                        }
                    } else {
                        rc.line(x1, y1, x2, y2, {
                            roughness: element.roughness || 2.5,
                            stroke: element.stroke || strokeColor,
                            strokeWidth: element.strokeWidth || strokeWidth
                        });
                    }
                    break;
                default:
                    break;
            }
        });

        // 导出图片
        const link = document.createElement('a');
        link.download = 'drawing-board-export.png';
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
    }, [elements, strokeColor, strokeWidth]);

    const contextValue = useMemo<DrawingContextType>(() => ({
        tool,
        setTool,
        lineShape,
        setLineShape,
        strokeColor,
        setStrokeColor,
        strokeWidth,
        setStrokeWidth,
        elements,
        setElements: updateElementsWithHistory, // 替换原setElements，自动同步历史
        drawingElement,
        setDrawingElement,
        historyStack,
        historyIndex,
        undo,
        redo,
        exportToImage
    }), [tool, lineShape, strokeColor, strokeWidth, elements, drawingElement, historyStack, historyIndex, undo, redo, updateElementsWithHistory, exportToImage])

    return (
        <DrawingContext.Provider value={contextValue}>
            {children}
        </DrawingContext.Provider>
    )
}

export const useDrawingContext = () => {
    const context = useContext(DrawingContext)
    if (!context) {
        throw new Error('useDrawingContext must be used within a DrawingProvider')
    }
    return context
}