export interface Purchase {
  id: string
  customerId: string
  productId: string
  productName: string
  price: number
  purchaseDate: string
  thumbnail: string
}

export interface Customer {
  id: string
  name: string
  totalPurchases: number
  totalAmount: number
}

export interface PurchaseFrequency {
  range: string
  count: number
}
