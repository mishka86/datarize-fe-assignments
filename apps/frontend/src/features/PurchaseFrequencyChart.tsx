import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getPurchaseFrequency } from '../lib/api'
import { format } from 'date-fns'

/**
 * 가격대별 구매 빈도를 시각화하는 바 차트 컴포넌트
 *
 * 기능:
 * - 2만원 이하부터 10만원 이상까지 만원 단위로 가격대를 구분
 * - 날짜 범위 선택을 통한 기간별 조회 가능
 * - 바 차트 형태로 데이터 시각화
 *
 * @returns {JSX.Element} 구매 빈도 차트 컴포넌트
 */
export default function PurchaseFrequencyChart() {
  // 날짜 범위 상태 관리 (기본값: 2024년 7월 전체)
  const [dateRange, setDateRange] = useState({
    from: format(new Date('2024-07-01'), 'yyyy-MM-dd'),
    to: format(new Date('2024-07-31'), 'yyyy-MM-dd'),
  })

  // API 호출을 통한 구매 빈도 데이터 페칭
  // React Query를 사용하여 캐싱, 로딩 상태, 에러 처리 자동화
  const { data, isLoading, error } = useQuery({
    queryKey: ['purchaseFrequency', dateRange],
    queryFn: () => getPurchaseFrequency(dateRange.from, dateRange.to),
  })

  // 로딩 상태 처리
  if (isLoading) return <div className="text-center py-4">로딩 중...</div>

  // 에러 상태 처리
  if (error) {
    console.error('API Error:', error)
    return <div className="text-center py-4 text-red-500">데이터를 불러오는데 실패했습니다.</div>
  }

  // 빈 데이터 처리
  if (!data || data.length === 0) {
    return <div className="text-center py-4 text-neutral-500">데이터가 없습니다.</div>
  }

  // 백엔드에서 제공하는 데이터를 차트에 맞게 변환
  // 이미 가격대별로 분류된 데이터를 받아오므로 그대로 사용
  const chartData = data.map((item) => ({
    range: item.range, // 가격대 레이블 (예: "2만원 이하")
    count: item.count, // 해당 가격대의 구매 횟수
  }))

  return (
    <div>
      {/* 날짜 범위 선택 UI */}
      <div className="mb-6 flex gap-6">
        <div>
          <label htmlFor="from" className="block text-sm font-medium text-neutral-700 mb-1">
            시작일
          </label>
          <input
            type="date"
            id="from"
            value={dateRange.from}
            onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-neutral-300 bg-white text-neutral-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-2 py-1"
          />
        </div>
        <div>
          <label htmlFor="to" className="block text-sm font-medium text-neutral-700 mb-1">
            종료일
          </label>
          <input
            type="date"
            id="to"
            value={dateRange.to}
            onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-neutral-300 bg-white text-neutral-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-2 py-1"
          />
        </div>
      </div>

      {/* 바 차트 컨테이너 */}
      <div className="border border-neutral-200 rounded-lg bg-white p-4">
        <div style={{ width: '100%', height: '400px' }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              {/* 격자 배경 */}
              <CartesianGrid strokeDasharray="3 3" />

              {/* X축: 가격대 레이블 (45도 회전으로 가독성 향상) */}
              <XAxis dataKey="range" angle={-45} textAnchor="end" height={80} fontSize={12} />

              {/* Y축: 구매 횟수 */}
              <YAxis />

              {/* 툴크: 호버 시 상세 정보 표시 */}
              <Tooltip
                formatter={(value) => [value + '회', '구매 횟수']}
                labelFormatter={(label) => `가격대: ${label}`}
              />

              {/* 바 차트: 모서리 둥글게 처리 */}
              <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
