import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import PurchaseFrequencyChart from './features/PurchaseFrequencyChart.tsx'
import CustomerList from './features/CustomerList.tsx'
import CustomerDetail from './features/CustomerDetail.tsx'
import Tabs from './components/Tabs.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import './App.css'

const queryClient = new QueryClient()

function App() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)

  const tabs = [
    {
      id: 'chart',
      label: '가격대별 구매 빈도',
      content: <PurchaseFrequencyChart />,
    },
    {
      id: 'customers',
      label: '고객 목록',
      content: <CustomerList onSelectCustomer={setSelectedCustomerId} />,
    },
  ]

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-neutral-50 text-neutral-900">
          <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-bold text-neutral-900">쇼핑몰 구매 데이터 대시보드</h1>
            </div>
          </header>
          <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="bg-white shadow-md rounded-xl border border-neutral-200">
                <div className="px-4 py-5 sm:p-6">
                  <ErrorBoundary
                    fallback={
                      <div className="text-center py-8">
                        <p className="text-neutral-500">대시보드를 로드하는 중 문제가 발생했습니다.</p>
                        <button
                          onClick={() => window.location.reload()}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          새로고침
                        </button>
                      </div>
                    }
                  >
                    <Tabs tabs={tabs} defaultTab="chart" />
                  </ErrorBoundary>
                </div>
              </div>
            </div>
          </main>

          {/* 고객 상세 정보 모달 */}
          {selectedCustomerId && (
            <div
              className="fixed inset-0 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
              onClick={() => setSelectedCustomerId(null)}
            >
              <div
                className="relative mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-xl bg-white"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-neutral-900">고객 상세 정보</h3>
                  <button
                    onClick={() => setSelectedCustomerId(null)}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <ErrorBoundary
                  fallback={
                    <div className="text-center py-8">
                      <p className="text-neutral-500">고객 상세 정보를 로드하는 중 문제가 발생했습니다.</p>
                      <button
                        onClick={() => setSelectedCustomerId(null)}
                        className="mt-4 px-4 py-2 bg-neutral-600 text-white rounded-md hover:bg-neutral-700"
                      >
                        닫기
                      </button>
                    </div>
                  }
                >
                  <CustomerDetail customerId={selectedCustomerId} />
                </ErrorBoundary>
              </div>
            </div>
          )}
        </div>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
