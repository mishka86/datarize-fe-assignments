import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getPurchaseFrequency, getCustomers, getCustomerPurchases } from '../api'

// fetch API 모킹
global.fetch = vi.fn()

const mockFetch = vi.mocked(fetch)

describe('API 함수 테스트', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getPurchaseFrequency', () => {
    it('날짜 범위 없이 구매 빈도 데이터를 올바르게 가져와야 합니다', async () => {
      // Given: 모킹된 응답 데이터
      const mockData = [
        { range: '2만원 이하', count: 10 },
        { range: '2만원 초과 ~ 3만원', count: 15 },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response)

      // When: API 함수 호출
      const result = await getPurchaseFrequency()

      // Then: 올바른 URL로 요청하고 데이터를 반환해야 함
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/api/purchase-frequency?')
      expect(result).toEqual(mockData)
    })

    it('날짜 범위와 함께 구매 빈도 데이터를 올바르게 가져와야 합니다', async () => {
      // Given: 날짜 범위와 모킹된 응답 데이터
      const from = '2024-07-01'
      const to = '2024-07-31'
      const mockData = [{ range: '2만원 이하', count: 5 }]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response)

      // When: 날짜 범위와 함께 API 함수 호출
      const result = await getPurchaseFrequency(from, to)

      // Then: 쿼리 파라미터가 포함된 URL로 요청해야 함
      expect(mockFetch).toHaveBeenCalledWith(`http://localhost:4000/api/purchase-frequency?from=${from}&to=${to}`)
      expect(result).toEqual(mockData)
    })

    it('API 요청 실패 시 에러를 발생시켜야 합니다', async () => {
      // Given: 실패하는 API 응답
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as Response)

      // When & Then: 에러가 발생해야 함
      await expect(getPurchaseFrequency()).rejects.toThrow('Failed to fetch purchase frequency')
    })
  })

  describe('getCustomers', () => {
    it('정렬 및 검색 옵션 없이 고객 목록을 올바르게 가져와야 합니다', async () => {
      // Given: 모킹된 고객 데이터
      const mockData = [
        { id: '1', name: '김철수', totalPurchases: 5, totalAmount: 150000 },
        { id: '2', name: '이영희', totalPurchases: 3, totalAmount: 90000 },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response)

      // When: API 함수 호출
      const result = await getCustomers()

      // Then: 올바른 URL로 요청하고 데이터를 반환해야 함
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/api/customers?')
      expect(result).toEqual(mockData)
    })

    it('정렬 및 검색 옵션과 함께 고객 목록을 올바르게 가져와야 합니다', async () => {
      // Given: 정렬 및 검색 옵션과 모킹된 데이터
      const sortBy = 'desc'
      const name = '김철수'
      const mockData = [{ id: '1', name: '김철수', totalPurchases: 5, totalAmount: 150000 }]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response)

      // When: 옵션과 함께 API 함수 호출
      const result = await getCustomers(sortBy, name)

      // Then: 쿼리 파라미터가 포함된 URL로 요청해야 함 (URL 인코딩 고려)
      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost:4000/api/customers?sortBy=${sortBy}&name=${encodeURIComponent(name)}`,
      )
      expect(result).toEqual(mockData)
    })

    it('API 요청 실패 시 에러를 발생시켜야 합니다', async () => {
      // Given: 실패하는 API 응답
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as Response)

      // When & Then: 에러가 발생해야 함
      await expect(getCustomers()).rejects.toThrow('Failed to fetch customers')
    })
  })

  describe('getCustomerPurchases', () => {
    it('특정 고객의 구매 내역을 올바르게 가져와야 합니다', async () => {
      // Given: 고객 ID와 모킹된 구매 내역
      const customerId = '1'
      const mockData = [
        {
          id: '1-1-2024-07-01',
          customerId: '1',
          productId: '1',
          productName: '티셔츠',
          price: 25000,
          purchaseDate: '2024-07-01',
          thumbnail: '/images/tshirt.jpg',
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response)

      // When: API 함수 호출
      const result = await getCustomerPurchases(customerId)

      // Then: 올바른 URL로 요청하고 데이터를 반환해야 함
      expect(mockFetch).toHaveBeenCalledWith(`http://localhost:4000/api/customers/${customerId}/purchases`)
      expect(result).toEqual(mockData)
    })

    it('API 요청 실패 시 에러를 발생시켜야 합니다', async () => {
      // Given: 실패하는 API 응답
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as Response)

      // When & Then: 에러가 발생해야 함
      await expect(getCustomerPurchases('1')).rejects.toThrow('Failed to fetch customer purchases')
    })
  })
})
