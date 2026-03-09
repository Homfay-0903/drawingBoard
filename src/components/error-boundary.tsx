import React, { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
    chilren: ReactNode
    fallback?: ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
    error?: Error
}

// 错误边界
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    // 捕获子组件错误
    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
    }

    // 记录错误日志
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Canvas组件错误:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#ffebee' }}>
                    <h3>画布加载出错了 😢</h3>
                    <p>{this.state.error?.message}</p>
                    <button onClick={() => this.setState({ hasError: false })}>刷新重试</button>
                </div>
            )
        }

        return this.props.chilren
    }
}

export default ErrorBoundary