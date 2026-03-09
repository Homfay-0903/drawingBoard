import { useDrawingContext } from "../context/drawing-context";

const HistoryControls = () => {
    const { undo, redo, historyIndex, historyStack } = useDrawingContext()

    return (
        <span style={{ margin: '0 10px' }}>
            <button
                onClick={undo}
                disabled={historyIndex === 0}
                style={{ marginRight: '10px', backgroundColor: '#FCC58D' }}
            >
                撤销
            </button>
            <button
                onClick={redo}
                disabled={historyIndex === historyStack.length - 1}
                style={{ backgroundColor: '#FCC58D' }}
            >
                重做
            </button>
        </span>
    )
}

export default HistoryControls