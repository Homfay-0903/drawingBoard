import React, { useEffect, useRef, useState } from "react";
import rough from 'roughjs/bin/rough';
import type { drawingBoardElements } from '../type/element';
import { useDrawingContext } from "../context/drawing-context";
import { useCanvasUtils } from '../hooks/useCanvasUtils';
import TextInputModal from "./text-input-modal";

const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // 从Context获取状态（替代props传递）
    const {
        tool: selectedTool,
        lineShape,
        strokeColor,
        elements,
        setElements,
        drawingElement,
        setDrawingElement
    } = useDrawingContext();

    // 自定义Hook：画布工具函数
    const { getCanvasRelativeCoords } = useCanvasUtils(canvasRef);

    // 文本输入弹窗状态
    const [textModalVisible, setTextModalVisible] = useState(false);
    const [textModalPos, setTextModalPos] = useState({ x: 0, y: 0 });

    // 绘制箭头（抽离为独立函数，保持代码整洁）
    const drawArrow = (
        ctx: CanvasRenderingContext2D,
        fromX: number,
        fromY: number,
        toX: number,
        toY: number,
        color: string
    ) => {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1;
        const headLen = 10;
        const angle = Math.atan2(toY - fromY, toX - fromX);

        // 画线
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX - headLen * Math.cos(angle), toY - headLen * Math.sin(angle));
        ctx.stroke();

        // 画箭头
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(
            toX - headLen * Math.cos(angle - Math.PI / 6),
            toY - headLen * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            toX - headLen * Math.cos(angle + Math.PI / 6),
            toY - headLen * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
    };

    // 绘制画布（核心渲染逻辑，useEffect依赖变化时重绘）
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const rc = rough.canvas(canvas);

        // 绘制已完成的元素（列表渲染）
        elements.forEach((element) => {
            switch (element.type) {
                case 'rectangle':
                    rc.draw(
                        rc.rectangle(element.x, element.y, element.width, element.height, {
                            roughness: 2.5,
                            stroke: element.stroke || strokeColor
                        })
                    );
                    break;
                case 'text':
                    // 绘制文本
                    ctx.fillStyle = element.stroke || strokeColor;
                    ctx.font = '16px Arial';
                    ctx.fillText((element as any).content || '', element.x, element.y);
                    break;
                case 'line':
                    const x1 = element.x;
                    const y1 = element.y;
                    const x2 = element.x + element.width;
                    const y2 = element.y + element.height;

                    if (element.lineShape === 'arrow') {
                        drawArrow(ctx, x1, y1, x2, y2, element.stroke || strokeColor);
                    } else if (element.lineShape === 'hand') {
                        const lineEl = element as any;
                        if (lineEl.points && lineEl.points.length) {
                            const pathStr = lineEl.points.map((p: any, i: number) =>
                                i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
                            ).join(' ');
                            rc.draw(rc.path(pathStr, {
                                roughness: element.roughness || 2.5,
                                stroke: element.stroke || strokeColor,
                            }));
                        }
                    } else {
                        rc.line(x1, y1, x2, y2, {
                            roughness: element.roughness || 2.5,
                            stroke: element.stroke || strokeColor,
                        });
                    }
                    break;
                default:
                    break;
            }
        });

        // 绘制正在绘制的预览元素
        if (drawingElement) {
            const x1 = drawingElement.x;
            const y1 = drawingElement.y;
            const x2 = drawingElement.x + drawingElement.width;
            const y2 = drawingElement.y + drawingElement.height;

            if (drawingElement.type === 'rectangle') {
                rc.draw(
                    rc.rectangle(drawingElement.x, drawingElement.y, drawingElement.width, drawingElement.height, {
                        roughness: 2.5,
                        stroke: drawingElement.stroke || strokeColor
                    })
                );
            } else if (drawingElement.type === 'line') {
                if (drawingElement.lineShape === 'arrow') {
                    drawArrow(ctx, x1, y1, x2, y2, drawingElement.stroke || strokeColor);
                } else if (drawingElement.lineShape === 'hand') {
                    const de = drawingElement as any;
                    if (de.points && de.points.length) {
                        const pathStr = de.points.map((p: any, i: number) =>
                            i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
                        ).join(' ');
                        rc.draw(rc.path(pathStr, {
                            roughness: 2.5,
                            stroke: de.stroke || strokeColor
                        }));
                    }
                } else {
                    rc.draw(rc.line(x1, y1, x2, y2, { roughness: 2.5, stroke: drawingElement.stroke || strokeColor }));
                }
            }
        }
    }, [elements, drawingElement, strokeColor, lineShape, selectedTool]);

    // 鼠标按下：开始绘制
    const handleMouseDown = (e: React.MouseEvent) => {
        const { x, y } = getCanvasRelativeCoords(e);

        // 文本工具：打开输入弹窗
        if (selectedTool === 'text') {
            setTextModalPos({ x, y });
            setTextModalVisible(true);
            return;
        }

        // 其他工具：创建绘制元素
        const newElement: drawingBoardElements = {
            id: Math.random().toString(36).substr(2, 9),
            type: selectedTool,
            x: x,
            y: y,
            width: 0,
            height: 0,
            roughness: 2.5,
            lineShape: lineShape,
            stroke: strokeColor,
            ...(selectedTool === 'line' && lineShape === 'hand' ? { points: [{ x, y }] } : {})
        };
        setDrawingElement(newElement);
    };

    // 鼠标移动：更新绘制中元素
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!drawingElement) return;
        const { x, y } = getCanvasRelativeCoords(e);

        if (selectedTool === 'line' && lineShape === 'hand') {
            setDrawingElement({
                ...drawingElement,
                points: [...(drawingElement.points || []), { x, y }]
            });
        } else {
            const width = x - drawingElement.x;
            const height = y - drawingElement.y;
            setDrawingElement({
                ...drawingElement,
                width,
                height
            });
        }
    };

    // 鼠标抬起：完成绘制
    const handleMouseUp = () => {
        if (drawingElement) {
            const de: any = drawingElement;
            const isHandLine = drawingElement.type === 'line' && drawingElement.lineShape === 'hand';
            const hasEnoughPoints = isHandLine
                ? (de.points && de.points.length > 1)
                : (Math.abs(drawingElement.width) > 5 || Math.abs(drawingElement.height) > 5);

            if (hasEnoughPoints) {
                setElements((prev) => [...prev, drawingElement]);
            }
            setDrawingElement(null);
        }
    };

    // 文本确认：添加文本元素
    const handleTextConfirm = (text: string) => {
        const newTextElement: drawingBoardElements = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'text',
            x: textModalPos.x,
            y: textModalPos.y,
            width: text.length * 10, // 简单估算宽度
            height: 20,
            stroke: strokeColor,
            content: text // 文本内容
        } as any; // 兼容类型（element.ts可扩展Text类型）
        setElements((prev) => [...prev, newTextElement]);
        setTextModalVisible(false);
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{
                    border: '10px solid #885f22',
                    borderRadius: '5px',
                    display: 'block',
                    backgroundColor: '#FFFFF0',
                    margin: 'auto'
                }}
            />
            {/* 文本输入弹窗 */}
            <TextInputModal
                visible={textModalVisible}
                x={textModalPos.x}
                y={textModalPos.y}
                onConfirm={handleTextConfirm}
                onCancel={() => setTextModalVisible(false)}
            />
        </div>
    );
};

export default Canvas;