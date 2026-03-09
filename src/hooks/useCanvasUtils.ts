import { useEffect } from 'react';

// 封装Canvas通用工具函数（坐标转换、尺寸自适应）
export const useCanvasUtils = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
    // 转换鼠标坐标为Canvas相对坐标
    const getCanvasRelativeCoords = (e: React.MouseEvent) => {
        if (!canvasRef.current) return { x: 0, y: 0 }
        const rect = canvasRef.current.getBoundingClientRect()
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    }

    // Canvas尺寸自适应
    const resizeCanvas = () => {
        if (canvasRef.current) {
            // 基于父容器自适应（替代固定比例）
            const parent = canvasRef.current.parentElement
            if (parent) {
                canvasRef.current.width = parent.clientWidth * 0.9
                canvasRef.current.height = parent.clientHeight * 0.9
            } else {
                canvasRef.current.width = window.innerWidth * 0.8
                canvasRef.current.height = window.innerHeight * 0.8
            }
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