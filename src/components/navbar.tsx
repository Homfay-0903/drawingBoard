import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
    const location = useLocation()

    const navItems = [
        { path: '/', label: '首页' },
        { path: '/drawing-board', label: '绘图板' },
        { path: '/about', label: '关于' },
    ]

    return (
        <nav
            style={{
                backgroundColor: '#EAE0CD',
                padding: '15px',
                display: 'flex',
                gap: '20px',
                justifyContent: 'center'
            }}
        >
            {navItems.map(navItem => (
                <Link
                    key={navItem.path}
                    to={navItem.path}
                    style={{
                        textDecoration: 'none',
                        color: location.pathname === navItem.path ? '#885f22' : '#333', // 路由高亮
                        fontWeight: location.pathname === navItem.path ? 'bold' : 'normal',
                        fontSize: '16px',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        borderBottom: location.pathname === navItem.path ? '2px solid #885f22' : 'none'
                    }}
                >
                    {navItem.label}
                </Link>
            ))

            }
        </nav>
    )
}

export default Navbar