import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCustomers } from '../lib/api'

interface CustomerListProps {
  onSelectCustomer: (customerId: string) => void
}

/**
 * 고객 목록을 표시하고 검색/정렬 기능을 제공하는 컴포넌트
 *
 * 기능:
 * - 고객 이름으로 검색
 * - ID순, 구매금액 오름차순/내림차순 정렬
 * - 고객 행 클릭 시 상세 정보 모달 열기
 * - 구매 횟수, 총 구매 금액 표시
 *
 * @param {CustomerListProps} props - 컴포넌트 props
 * @param {function} props.onSelectCustomer - 고객 선택 시 호출되는 콜백 함수
 * @returns {JSX.Element} 고객 목록 컴포넌트
 */
export default function CustomerList({ onSelectCustomer }: CustomerListProps) {
  // 검색 입력값 상태 (실시간 입력값)
  const [searchInput, setSearchInput] = useState('')

  // 실제 검색어 상태 (API 호출에 사용)
  const [searchTerm, setSearchTerm] = useState('')

  // 정렬 기준 상태 (id: ID순, asc: 구매금액 낮은순, desc: 구매금액 높은순)
  const [sortOrder, setSortOrder] = useState<'id' | 'asc' | 'desc'>('id')

  // 고객 목록 데이터 페칭
  // 검색어와 정렬 기준이 변경될 때마다 새로운 데이터 요청
  const { data, isLoading, error } = useQuery({
    queryKey: ['customers', searchTerm, sortOrder],
    queryFn: () => getCustomers(sortOrder, searchTerm),
  })

  /**
   * 검색 버튼 클릭 또는 엔터키 입력 시 실제 검색 실행
   * 입력값을 검색어 상태에 반영하여 API 호출 트리거
   */
  const handleSearch = () => {
    setSearchTerm(searchInput)
  }

  /**
   * 입력 필드에서 엔터키 입력 시 검색 실행
   * @param {React.KeyboardEvent} e - 키보드 이벤트
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // 로딩 상태 처리
  if (isLoading) return <div className="text-center py-4">로딩 중...</div>

  // 에러 상태 처리
  if (error) return <div className="text-center py-4 text-red-500">데이터를 불러오는데 실패했습니다.</div>

  return (
    <div>
      {/* 검색 및 정렬 컨트롤 영역 */}
      <div className="mb-6 flex gap-6 items-end">
        {/* 검색 입력 영역 */}
        <div className="flex-1 flex gap-2">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-neutral-700 mb-1">
              고객명 검색
            </label>
            <input
              type="text"
              id="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="고객명을 입력하세요"
              className="mt-1 block w-full h-10 rounded-md border border-neutral-300 bg-white text-neutral-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
            />
          </div>
          {/* 검색 실행 버튼 */}
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="h-10 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-colors duration-200"
            >
              검색
            </button>
          </div>
        </div>

        {/* 정렬 선택 드롭다운 */}
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-neutral-700 mb-1">
            정렬
          </label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'id' | 'asc' | 'desc')}
            className="mt-1 block w-full h-10 rounded-md border border-neutral-300 bg-white text-neutral-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-3 pr-10 py-2 cursor-pointer appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 12px center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '16px',
            }}
          >
            <option value="id">ID 순</option>
            <option value="desc">구매 금액 높은순</option>
            <option value="asc">구매 금액 낮은순</option>
          </select>
        </div>
      </div>

      {/* 고객 목록 테이블 */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200 bg-white rounded-lg overflow-hidden">
          {/* 테이블 헤더 */}
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                이름
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                구매 횟수
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                총 구매 금액
              </th>
            </tr>
          </thead>

          {/* 테이블 바디: 고객 데이터 행들 */}
          <tbody className="bg-white divide-y divide-neutral-200">
            {data?.map((customer) => (
              <tr
                key={customer.id}
                onClick={() => onSelectCustomer(customer.id.toString())}
                className="hover:bg-neutral-50 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{customer.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">{customer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{customer.totalPurchases}회</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                  {customer.totalAmount.toLocaleString()}원
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
