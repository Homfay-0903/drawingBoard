export type ElementsTypes = 'rectangle' | 'line' | 'text'

export type LinesTypes = 'arrow' | 'line'

interface BaseElements {
    id: string
    type: ElementsTypes
    x: number
    y: number
    width: number
    height: number
    //rough.js
    roughness?: number
    stroke?: number
}

interface LineElements extends BaseElements {
    type: 'line',
    lineShape?: LinesTypes
}

export type drawingBoardElements = BaseElements | LineElements