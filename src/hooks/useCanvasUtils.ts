import { useEffect } from 'react';

// 封装Canvas通用工具函数（坐标转换、尺寸自适应）
export const useCanvasUtils = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
    // 转换鼠标坐标为Canvas相对坐标（返回 CSS 像素坐标）
    const getCanvasRelativeCoords = (e: React.MouseEvent) => {
        if (!canvasRef.current) return { x: 0, y: 0 }
        const canvas = canvasRef.current
        const rect = canvas.getBoundingClientRect()
        const style = window.getComputedStyle(canvas)
        const borderLeft = parseFloat(style.borderLeftWidth) || 0
        const borderTop = parseFloat(style.borderTopWidth) || 0

        // 减去边框宽度，返回相对于canvas内容区（CSS像素）的坐标
        const x = e.clientX - rect.left - borderLeft
        const y = e.clientY - rect.top - borderTop
        return { x, y }
    }

    // Canvas尺寸自适应：同时处理设备像素比（DPR），并设置上下文变换
    const resizeCanvas = () => {
        if (!canvasRef.current) return
        const canvas = canvasRef.current
        const parent = canvas.parentElement

        // 目标 CSS 尺寸
        const cssWidth = parent ? parent.clientWidth * 0.6 : window.innerWidth * 0.8
        const cssHeight = parent ? parent.clientHeight * 0.9 : window.innerHeight * 0.8

        // 设备像素比（为高清屏做处理）
        const dpr = window.devicePixelRatio || 1

        // 将 canvas 的内置像素尺寸设置为 CSS 大小 * DPR
        canvas.style.width = `${cssWidth}px`
        canvas.style.height = `${cssHeight}px`
        canvas.width = Math.round(cssWidth * dpr)
        canvas.height = Math.round(cssHeight * dpr)

        // 确保内容绘制以 CSS 像素为坐标系（上下文做缩放）
        const ctx = canvas.getContext('2d')
        if (ctx) {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }
    }

    // 监听窗口大小变化
    useEffect(() => {
        resizeCanvas()
        const resizeHandler = () => resizeCanvas()
        window.addEventListener('resize', resizeHandler)
        return () => window.removeEventListener('resize', resizeHandler)
    }, [])

    return { getCanvasRelativeCoords, resizeCanvas }
}