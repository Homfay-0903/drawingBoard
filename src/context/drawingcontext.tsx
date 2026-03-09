import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import type { ToolsTypes, LinesTypes, drawingBoardElements } from '../type/element';

interface DrawingContextType {
    tool: ToolsTypes
    setTool: (tool: ToolsTypes) => void
    lineShape: LinesTypes | undefined
    setLineShape: (shape: LinesTypes | undefined) => void
    strokeColor: string
    setStrokeColor: (color: string) => void
    elements: drawingBoardElements[]
    setElements: (newElements: drawingBoardElements[]) => void
    drawingElement: drawingBoardElements | null
    setDrawingElement: React.Dispatch<React.SetStateAction<drawingBoardElements | null>>
    historyStack: drawingBoardElements[][] // 历史记录栈
    historyIndex: number // 当前历史索引
    undo: () => void // 撤销
    redo: () => void // 重做
}

const DrawingContext = createContext<DrawingContextType | null>(null)

export const DrawingProvider = ({ children }: React.PropsWithChildren) => {
    const [tool, setTool] = useState<ToolsTypes>('rectangle')
    const [lineShape, setLineShape] = useState<LinesTypes>()
    const [strokeColor, setStrokeColor] = useState<string>('#000')
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

    // 更新元素时同步历史记录
    const updateElementsWithHistory = useCallback((newElements: drawingBoardElements[]) => {
        setElements(newElements)

        const newHistory = historyStack.slice(0, historyIndex + 1).concat([newElements])
        setHistoryStack(newHistory)
        setHistoryIndex(historyStack.length - 1)
    }, [historyIndex, historyStack])

    const contextValue = useMemo<DrawingContextType>(() => ({
        tool,
        setTool,
        lineShape,
        setLineShape,
        strokeColor,
        setStrokeColor,
        elements,
        setElements: updateElementsWithHistory, // 替换原setElements，自动同步历史
        drawingElement,
        setDrawingElement,
        historyStack,
        historyIndex,
        undo,
        redo
    }), [tool, lineShape, strokeColor, elements, drawingElement, historyStack, historyIndex, undo, redo, updateElementsWithHistory])

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