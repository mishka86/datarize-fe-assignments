import Router from 'koa-router'
import { getPurchases, getProducts } from '../data'

const router = new Router()

router.get('/api/purchase-frequency', async (ctx) => {
  try {
    const { from, to } = ctx.query

    if ((from && !to) || (!from && to)) {
      ctx.status = 400
      ctx.body = { error: 'Both from and to must be provided' }
      return
    }

    let fromDate: Date
    let toDate: Date
    if (from && to) {
      if (typeof from !== 'string' || typeof to !== 'string') {
        ctx.status = 400
        ctx.body = { error: 'Invalid date format. Dates must be in ISO 8601 format' }
        return
      }

      if (isNaN(Date.parse(from)) || isNaN(Date.parse(to))) {
        ctx.status = 400
        ctx.body = { error: 'Invalid date format. Dates must be in ISO 8601 format' }
        return
      }

      fromDate = new Date(from)
      toDate = new Date(to)

      if (fromDate > toDate) {
        ctx.status = 400
        ctx.body = { error: 'From date must be before to date' }
        return
      }
    }

    const purchases = await getPurchases()
    const products = await getProducts()

    const priceRanges = [
      { min: 0, max: 20000, label: '2만원 이하' },
      { min: 20001, max: 30000, label: '2만원 초과 ~ 3만원' },
      { min: 30001, max: 40000, label: '3만원 초과 ~ 4만원' },
      { min: 40001, max: 50000, label: '4만원 초과 ~ 5만원' },
      { min: 50001, max: 60000, label: '5만원 초과 ~ 6만원' },
      { min: 60001, max: 70000, label: '6만원 초과 ~ 7만원' },
      { min: 70001, max: 80000, label: '7만원 초과 ~ 8만원' },
      { min: 80001, max: 90000, label: '8만원 초과 ~ 9만원' },
      { min: 90001, max: 99999, label: '9만원 초과 ~ 10만원 미만' },
      { min: 100000, max: Infinity, label: '10만원 이상' },
    ]

    const frequency = priceRanges.map((range) => ({ range: range.label, count: 0 }))

    purchases
      .filter((purchase) => {
        const purchaseDate = new Date(purchase.date)
        if (fromDate && toDate) return purchaseDate >= fromDate && purchaseDate <= toDate
        return true
      })
      .forEach((purchase) => {
        const product = products.find((p) => p.id === purchase.productId)
        if (product) {
          const productPrice = product.price
          const range = priceRanges.find((r) => productPrice >= r.min && productPrice <= r.max)
          if (range) {
            const rangeIndex = priceRanges.indexOf(range)
            frequency[rangeIndex].count += purchase.quantity
          }
        } else {
          ctx.status = 400
          ctx.body = { error: `Product with ID ${purchase.productId} not found` }
          return
        }
      })

    ctx.body = frequency
  } catch (error) {
    ctx.status = 500
    ctx.body = { error: `An error occurred while processing your request. ${error}` }
  }
})

export default router
