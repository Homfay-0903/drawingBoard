export type BaseElementsTypes = 'rectangle' | 'text'
export type LinesTypes = 'arrow' | 'hand'
export type ToolsTypes = 'rectangle' | 'text' | 'line'
export type ElementsTypes = ToolsTypes

export interface Elements {
    id: string
    type: ElementsTypes
    x: number
    y: number
    width: number
    height: number
    //rough.js
    roughness?: number
    stroke?: string
    strokeWidth?: number  // 画笔粗细
    points?: { x: number, y: number }[]
}

export interface TextElements extends Elements {
    type: 'text'
    content: string // 文本内容
}


export interface BaseElements extends Elements {
    type: Exclude<BaseElementsTypes, 'text'>
}

export interface LineElements extends Elements {
    type: 'line',
    lineShape?: LinesTypes
}

export type drawingBoardElements = BaseElements | LineElements | TextElements