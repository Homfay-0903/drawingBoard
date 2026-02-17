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
}

export interface BaseElements extends Elements {
    type: BaseElementsTypes
}

export interface LineElements extends Elements {
    type: 'line',
    lineShape?: LinesTypes
}

export type drawingBoardElements = BaseElements | LineElements