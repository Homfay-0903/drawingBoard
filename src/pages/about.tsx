const About = () => {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>关于本项目</h1>
            <div style={{ maxWidth: '600px', margin: '20px auto', textAlign: 'left', lineHeight: '1.8' }}>
                <h3>技术栈</h3>
                <ul>
                    <li>React（核心Hook：useState/useEffect/useContext/useRef/useCallback/useMemo）</li>
                    <li>TypeScript（类型安全）</li>
                    <li>React Router（路由管理）</li>
                    <li>rough.js（手绘风格渲染）</li>
                </ul>
                <h3>核心功能</h3>
                <ul>
                    <li>多类型绘图（矩形、箭头线、手绘线、文本）</li>
                    <li>颜色自定义、撤销/重做、清空画布</li>
                    <li>路由切换、错误边界捕获</li>
                </ul>
            </div>
        </div>
    );
};

export default About;