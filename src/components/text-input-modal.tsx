import { useState, useRef, useEffect } from 'react';

interface TextInputModalProps {
    visible: boolean
    x: number
    y: number
    onConfirm: (text: string) => void
    onCancel: () => void
}

// 文本输入弹窗（覆盖表单处理、条件渲染）
const TextInputModal = ({ visible, x, y, onConfirm, onCancel }: TextInputModalProps) => {
    const [text, setText] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    // 弹窗显示时自动聚焦输入框
    useEffect(() => {
        if (visible && inputRef.current) {
            inputRef.current.focus()
        }
    }, [visible])

    // 回车确认
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && text.trim()) {
            onConfirm(text.trim())
        }
    }

    if (!visible) return null

    return (
        <div
            style={{
                position: 'absolute',
                left: x,
                top: y,
                padding: '8px',
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                zIndex: 1000
            }}
        >
            <input
                ref={inputRef}
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入文本..."
                style={{ padding: '4px', marginRight: '8px' }}
            />
            <button onClick={() => text.trim() && onConfirm(text.trim())} style={{ marginRight: '4px' }}>确认</button>
            <button onClick={onCancel}>取消</button>
        </div>
    )
}

export default TextInputModal