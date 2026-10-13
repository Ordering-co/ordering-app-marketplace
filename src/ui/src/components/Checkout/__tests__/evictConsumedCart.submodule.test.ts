import { evictConsumedCart } from '../../../../../@/components/src/contexts/OrderContext/evictConsumedCart'

describe('submodule evictConsumedCart', () => {
  it('drops a leftover PayPal cart after confirm returns an order', () => {
    const leftover = {
      uuid: 'cart-paypal',
      business_id: 12,
      status: 2,
      products: [{ id: 100 }]
    }

    const next = evictConsumedCart(
      { 'businessId:12': leftover },
      {
        cartUuid: 'cart-paypal',
        error: false,
        result: { status: 2, order: { uuid: 'order-2' }, business_id: 12 }
      }
    )

    expect(next['businessId:12']).toBeUndefined()
  })
})
