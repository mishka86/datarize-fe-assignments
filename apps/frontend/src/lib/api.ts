import { Customer, Purchase, PurchaseFrequency } from '../types/api'

// API 기본 URL 설정
const API_BASE_URL = 'http://localhost:4000/api'

/**
 * 가격대별 구매 빈도 데이터를 조회하는 API 함수
 *
 * @param {string} [from] - 조회 시작 날짜 (ISO 8601 형식, 선택적)
 * @param {string} [to] - 조회 종료 날짜 (ISO 8601 형식, 선택적)
 * @returns {Promise<PurchaseFrequency[]>} 가격대별 구매 빈도 데이터 배열
 * @throws {Error} API 요청 실패 시 에러 발생
 */
export async function getPurchaseFrequency(from?: string, to?: string): Promise<PurchaseFrequency[]> {
  // URL 쿼리 파라미터 생성
  const params = new URLSearchParams()
  if (from) params.append('from', from)
  if (to) params.append('to', to)

  // API 요청 및 응답 처리
  const response = await fetch(`${API_BASE_URL}/purchase-frequency?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch purchase frequency')
  return response.json()
}

/**
 * 고객 목록을 조회하는 API 함수
 *
 * @param {('id' | 'asc' | 'desc')} [sortBy] - 정렬 기준 (선택적)
 *   - 'id': ID 순 정렬
 *   - 'asc': 구매 금액 낮은순 정렬
 *   - 'desc': 구매 금액 높은순 정렬
 * @param {string} [name] - 검색할 고객 이름 (선택적, 부분 일치)
 * @returns {Promise<Customer[]>} 고객 데이터 배열
 * @throws {Error} API 요청 실패 시 에러 발생
 */
export async function getCustomers(sortBy?: 'id' | 'asc' | 'desc', name?: string): Promise<Customer[]> {
  // URL 쿼리 파라미터 생성
  const params = new URLSearchParams()
  if (sortBy) params.append('sortBy', sortBy)
  if (name) params.append('name', name)

  // API 요청 및 응답 처리
  const response = await fetch(`${API_BASE_URL}/customers?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch customers')
  return response.json()
}

/**
 * 특정 고객의 구매 내역을 조회하는 API 함수
 *
 * @param {string} customerId - 조회할 고객의 ID
 * @returns {Promise<Purchase[]>} 해당 고객의 구매 내역 배열
 * @throws {Error} API 요청 실패 시 에러 발생
 */
export async function getCustomerPurchases(customerId: string): Promise<Purchase[]> {
  // API 요청 및 응답 처리
  const response = await fetch(`${API_BASE_URL}/customers/${customerId}/purchases`)
  if (!response.ok) throw new Error('Failed to fetch customer purchases')
  return response.json()
}
