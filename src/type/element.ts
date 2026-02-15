export type ElementsTypes = 'rectangle' | 'line' | 'text'

interface BaseElements {
    id: number
    type: ElementsTypes
    x: number
    y: number
    width: number
    height: number
    //rough.js
    roughness?: number
    stroke?: number
}

export type drawingBoardElements = BaseElements