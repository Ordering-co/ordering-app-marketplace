import {
  getHomeDeepLinkPlan,
  getMyAccountDeepLinkNavigateArgs
} from '../getHomeDeepLinkPlan'

describe('getHomeDeepLinkPlan', () => {
  it('opens Order Details when an order id param is present', () => {
    expect(getHomeDeepLinkPlan({
      orderIdParam: 'ord-42'
    })).toEqual({
      screen: 'OrderDetails',
      routeParams: { orderId: 'ord-42' }
    })
  })

  it('opens Checkout when a cart uuid param is present', () => {
    expect(getHomeDeepLinkPlan({
      cartUuidParam: 'cart-9'
    })).toEqual({
      screen: 'CheckoutPage',
      routeParams: { cartUuid: 'cart-9' }
    })
  })

  it('opens Business when a store param is present', () => {
    expect(getHomeDeepLinkPlan({
      storeParam: 'pizza-place',
      productParam: { productId: 3, categoryId: 1 }
    })).toEqual({
      screen: 'Business',
      routeParams: {
        store: 'pizza-place',
        productId: 3,
        categoryId: 1
      }
    })
  })

  it('prefers order over cart or store', () => {
    expect(getHomeDeepLinkPlan({
      orderIdParam: 'ord-42',
      cartUuidParam: 'cart-9',
      storeParam: 'pizza-place'
    }).screen).toBe('OrderDetails')
  })

  it('does not open when params are empty', () => {
    expect(getHomeDeepLinkPlan({})).toEqual({
      screen: null,
      routeParams: null
    })
    expect(getHomeDeepLinkPlan({
      orderIdParam: '',
      cartUuidParam: null,
      storeParam: undefined
    }).screen).toBeNull()
  })
})

describe('getMyAccountDeepLinkNavigateArgs', () => {
  it('returns null when there is nothing to apply after login', () => {
    expect(getMyAccountDeepLinkNavigateArgs({})).toBeNull()
  })

  it('merges deep-link params onto the already mounted MyAccount screen', () => {
    expect(getMyAccountDeepLinkNavigateArgs({
      orderIdParam: 'ord-42'
    })).toEqual({
      name: 'MyAccount',
      params: {
        orderIdParam: 'ord-42',
        cartUuidParam: null,
        storeParam: null,
        productParam: null
      },
      merge: true
    })
  })
})
