import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate()

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>手绘板工具 - 首页</h1>
            <p style={{ fontSize: '16px', color: '#666' }}>
                一个基于React + TypeScript开发的简易手绘板，支持矩形、箭头、手绘线、文本绘制，包含撤销/重做、颜色选择等功能
            </p>
            <button
                onClick={() => navigate('/drawing-board')}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#FCC58D',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                }}
            >
                进入绘图板
            </button>
        </div>
    )
}

export default Home