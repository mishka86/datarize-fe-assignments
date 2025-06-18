import { Component, ReactNode, ErrorInfo } from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * React 애플리케이션에서 발생하는 JavaScript 에러를 포착하고 처리하는 에러 바운더리 컴포넌트
 *
 * 기능:
 * - 하위 컴포넌트에서 발생하는 에러를 포착
 * - 에러 발생 시 대체 UI 표시
 * - 에러 정보를 콘솔에 기록
 * - 프로덕션/개발 환경에 따른 다른 에러 표시
 *
 * @class ErrorBoundary
 * @extends {Component<ErrorBoundaryProps, ErrorBoundaryState>}
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  /**
   * 에러가 발생했을 때 상태를 업데이트하는 정적 메서드
   * @param {Error} error - 발생한 에러
   * @returns {ErrorBoundaryState} 업데이트된 상태
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 에러가 발생하면 hasError를 true로 설정하여 fallback UI를 표시
    return { hasError: true, error }
  }

  /**
   * 에러 정보를 로깅하는 라이프사이클 메서드
   * @param {Error} error - 발생한 에러
   * @param {ErrorInfo} errorInfo - 에러 정보 (컴포넌트 스택 등)
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 에러 정보를 상태에 저장
    this.setState({ errorInfo })

    // 에러 정보를 콘솔에 기록 (로깅 서비스로 전송 가능)
    console.error('ErrorBoundary가 에러를 포착했습니다:', error)
    console.error('에러 정보:', errorInfo)

    // 향후 로깅 서비스 연동 시 이곳에서 전송
    // this.logErrorToService(error, errorInfo)
  }

  /**
   * 에러 상태를 리셋하여 애플리케이션을 다시 시도할 수 있게 하는 메서드
   */
  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    // 에러가 발생한 경우
    if (this.state.hasError) {
      // 사용자 정의 fallback UI가 제공된 경우 사용
      if (this.props.fallback) {
        return this.props.fallback
      }

      // 기본 에러 UI 표시
      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            {/* 에러 아이콘 */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>

            {/* 에러 메시지 */}
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">문제가 발생했습니다</h2>
            <p className="text-neutral-600 mb-6">
              죄송합니다. 예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 다시 시도해 주세요.
            </p>

            {/* 개발 환경에서만 에러 상세 정보 표시 */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm font-medium text-neutral-700 mb-2">
                  개발자 정보 (개발 환경에서만 표시)
                </summary>
                <div className="bg-neutral-100 rounded p-3 text-xs text-neutral-800">
                  <div className="mb-2">
                    <strong>에러:</strong> {this.state.error.message}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>컴포넌트 스택:</strong>
                      <pre className="whitespace-pre-wrap mt-1">{this.state.errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* 액션 버튼들 */}
            <div className="flex gap-3">
              <button
                onClick={this.resetError}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                다시 시도
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-neutral-200 text-neutral-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
              >
                새로고침
              </button>
            </div>
          </div>
        </div>
      )
    }

    // 에러가 없는 경우 정상적으로 children 렌더링
    return this.props.children
  }
}

export default ErrorBoundary
