import { useQuery } from '@tanstack/react-query'
import { getCustomerPurchases } from '../lib/api'
import { format } from 'date-fns'

interface CustomerDetailProps {
  customerId: string
}

/**
 * 특정 고객의 구매 내역을 상세하게 표시하는 컴포넌트
 *
 * 기능:
 * - 선택된 고객의 모든 구매 내역 조회
 * - 구매 날짜, 제품명, 가격, 썸네일 이미지 표시
 * - 그리드 레이아웃으로 카드 형태 UI 제공
 *
 * @param {CustomerDetailProps} props - 컴포넌트 props
 * @param {string} props.customerId - 조회할 고객 ID
 * @returns {JSX.Element} 고객 상세 정보 컴포넌트
 */
export default function CustomerDetail({ customerId }: CustomerDetailProps) {
  // 선택된 고객의 구매 내역 데이터 페칭
  // customerId가 변경될 때마다 새로운 데이터 요청
  const { data, isLoading, error } = useQuery({
    queryKey: ['customerPurchases', customerId],
    queryFn: () => getCustomerPurchases(customerId),
  })

  // 로딩 상태 처리
  if (isLoading) return <div className="text-center py-4">로딩 중...</div>

  // 에러 상태 처리
  if (error) return <div className="text-center py-4 text-red-500">데이터를 불러오는데 실패했습니다.</div>

  return (
    <div className="space-y-4">
      {/* 구매 내역 그리드 레이아웃 */}
      {/* 반응형: 모바일 1열, 태블릿 2열, 데스크톱 3열 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((purchase) => (
          // 각 구매 항목을 카드 형태로 표시
          <div key={purchase.id} className="bg-white overflow-hidden shadow rounded-lg border border-neutral-200">
            <div className="p-4">
              {/* 상품 썸네일 이미지 */}
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
                <img
                  src={purchase.thumbnail}
                  alt={purchase.productName}
                  className="h-full w-full object-cover object-center"
                />
              </div>

              {/* 구매 정보 */}
              <div className="mt-4">
                {/* 상품명 */}
                <h3 className="text-lg font-medium text-neutral-900">{purchase.productName}</h3>

                {/* 구매 날짜 (한국어 형식으로 포맷팅) */}
                <p className="mt-1 text-sm text-neutral-500">
                  구매일: {format(new Date(purchase.purchaseDate), 'yyyy년 MM월 dd일')}
                </p>

                {/* 구매 가격 (천 단위 콤마 포맷팅) */}
                <p className="mt-1 text-sm font-medium text-neutral-900">{purchase.price.toLocaleString()}원</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
