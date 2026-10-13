import {
  deleteCartProduct,
  findCartByUuid,
  findGiftCart,
  giftCartStatePatch,
  listRemoteGiftCarts,
  isGiftCardCart,
  leaveGiftCardCheckout,
  purchaseGiftCard,
  shouldClearGiftCartOnLeave,
  shouldLeaveGiftCheckoutWhenCartMissing
} from '../giftCardCart'

describe('isGiftCardCart', () => {
  it('is true when business_id is null or missing', () => {
    expect(isGiftCardCart({ business_id: null, uuid: 'g1' })).toBe(true)
    expect(isGiftCardCart({ uuid: 'g1' })).toBe(true)
  })

  it('is false for food carts and empty values', () => {
    expect(isGiftCardCart({ business_id: 12, uuid: 'c1' })).toBe(false)
    expect(isGiftCardCart(null)).toBe(false)
    expect(isGiftCardCart(undefined)).toBe(false)
  })
})

describe('shouldClearGiftCartOnLeave', () => {
  it('requires a gift cart with a uuid', () => {
    expect(shouldClearGiftCartOnLeave({ business_id: null, uuid: 'g1' })).toBe(true)
    expect(shouldClearGiftCartOnLeave({ business_id: null, uuid: '' })).toBe(false)
    expect(shouldClearGiftCartOnLeave({ business_id: 1, uuid: 'c1' })).toBe(false)
  })
})

describe('findCartByUuid', () => {
  it('finds a cart by uuid in the order-state map', () => {
    const carts = {
      'businessId:1': { uuid: 'food-1', business_id: 1 },
      'businessId:null': { uuid: 'gift-1', business_id: null }
    }
    expect(findCartByUuid(carts, 'gift-1')).toEqual({ uuid: 'gift-1', business_id: null })
    expect(findCartByUuid(carts, 'missing')).toBeNull()
    expect(findCartByUuid(carts, null)).toBeNull()
  })
})

describe('deleteCartProduct', () => {
  it('clears a gift cart instead of removing one product', async () => {
    const removeProduct = jest.fn()
    const clearCart = jest.fn().mockResolvedValue({ error: false })
    await deleteCartProduct({
      cart: { business_id: null, uuid: 'gift-1' },
      product: { id: 80 },
      removeProduct,
      clearCart
    })
    expect(clearCart).toHaveBeenCalledWith('gift-1')
    expect(removeProduct).not.toHaveBeenCalled()
  })

  it('removes a product from a food cart', async () => {
    const product = { id: 9 }
    const cart = { business_id: 4, uuid: 'food-1' }
    const removeProduct = jest.fn().mockResolvedValue(true)
    const clearCart = jest.fn()
    await deleteCartProduct({ cart, product, removeProduct, clearCart })
    expect(removeProduct).toHaveBeenCalledWith(product, cart)
    expect(clearCart).not.toHaveBeenCalled()
  })
})

describe('leaveGiftCardCheckout', () => {
  it('leaves immediately without clearing a leftover gift cart', () => {
    const leave = jest.fn()
    expect(leaveGiftCardCheckout({ leave })).toBe(true)
    expect(leave).toHaveBeenCalled()
  })
})

describe('listRemoteGiftCarts', () => {
  it('returns only gift carts from the API list', async () => {
    await expect(listRemoteGiftCarts({
      getCarts: async () => ({
        content: {
          error: false,
          result: [
            { uuid: 'food-1', business_id: 1 },
            { uuid: 'gift-1', business_id: null, products: [{ id: 80 }] }
          ]
        }
      })
    })).resolves.toEqual([
      { uuid: 'gift-1', business_id: null, products: [{ id: 80 }] }
    ])
  })

  it('throws when the carts list request fails', async () => {
    await expect(listRemoteGiftCarts({
      getCarts: async () => ({ content: { error: true, result: 'boom' } })
    })).rejects.toThrow('failed to list gift carts')
  })
})

describe('findGiftCart', () => {
  it('finds the leftover gift cart in order state', () => {
    const carts = {
      'businessId:1': { uuid: 'food-1', business_id: 1 },
      'businessId:null': { uuid: 'gift-1', business_id: null, products: [{ id: 80 }] }
    }
    expect(findGiftCart(carts)).toEqual({
      uuid: 'gift-1',
      business_id: null,
      products: [{ id: 80 }]
    })
    expect(findGiftCart({ 'businessId:1': { uuid: 'food-1', business_id: 1 } })).toBeNull()
  })
})

describe('purchaseGiftCard', () => {
  it('reuses the leftover cart when the product id matches', async () => {
    const clearCart = jest.fn()
    const addProduct = jest.fn()
    await expect(purchaseGiftCard({
      product: { id: 80 },
      carts: {
        'businessId:null': { uuid: 'gift-1', business_id: null, products: [{ id: 80 }] }
      },
      clearCart,
      addProduct
    })).resolves.toEqual({ type: 'reuse', uuid: 'gift-1' })
    expect(clearCart).not.toHaveBeenCalled()
    expect(addProduct).not.toHaveBeenCalled()
  })

  it('clears a leftover cart then adds a different gift card', async () => {
    const clearCart = jest.fn().mockResolvedValue({ error: false })
    const addProduct = jest.fn().mockResolvedValue({ error: false, result: { uuid: 'gift-2' } })
    await expect(purchaseGiftCard({
      product: { id: 50 },
      carts: {
        'businessId:null': { uuid: 'gift-1', business_id: null, products: [{ id: 80 }] }
      },
      clearCart,
      addProduct
    })).resolves.toEqual({ type: 'created', uuid: 'gift-2' })
    expect(clearCart).toHaveBeenCalledWith('gift-1', { disableLoading: true })
    expect(addProduct).toHaveBeenCalledWith({ id: 50, quantity: 1 }, null, null, true)
  })

  it('adds a gift card when there is no leftover', async () => {
    const addProduct = jest.fn().mockResolvedValue({ error: false, result: { uuid: 'gift-3' } })
    await expect(purchaseGiftCard({
      product: { id: 80 },
      carts: {},
      clearCart: jest.fn(),
      addProduct
    })).resolves.toEqual({ type: 'created', uuid: 'gift-3' })
  })

  it('fails closed when the product id is missing', async () => {
    const clearCart = jest.fn()
    const addProduct = jest.fn()
    await expect(purchaseGiftCard({
      product: {},
      carts: {},
      clearCart,
      addProduct
    })).resolves.toEqual({ type: 'failed' })
    expect(clearCart).not.toHaveBeenCalled()
    expect(addProduct).not.toHaveBeenCalled()
  })

  it('stays on the gift list when clear or add fails', async () => {
    const addProduct = jest.fn()
    await expect(purchaseGiftCard({
      product: { id: 50 },
      carts: {
        'businessId:null': { uuid: 'gift-1', business_id: null, products: [{ id: 80 }] }
      },
      clearCart: jest.fn().mockResolvedValue({ error: true }),
      addProduct
    })).resolves.toEqual({ type: 'failed' })
    expect(addProduct).not.toHaveBeenCalled()
  })

  it('clears a leftover gift cart found only on the API after a cold start', async () => {
    const clearCart = jest.fn().mockResolvedValue({ error: false })
    const addProduct = jest.fn().mockResolvedValue({ error: false, result: { uuid: 'gift-2' } })
    await expect(purchaseGiftCard({
      product: { id: 50 },
      carts: {},
      listGiftCarts: jest.fn().mockResolvedValue([
        { uuid: 'gift-1', business_id: null, products: [{ id: 80 }] }
      ]),
      clearCart,
      addProduct
    })).resolves.toEqual({ type: 'created', uuid: 'gift-2' })
    expect(clearCart).toHaveBeenCalledWith('gift-1', { disableLoading: true })
    expect(addProduct).toHaveBeenCalledWith({ id: 50, quantity: 1 }, null, null, true)
  })

  it('reuses a leftover gift cart found only on the API when it is the same single product', async () => {
    const clearCart = jest.fn()
    const addProduct = jest.fn()
    await expect(purchaseGiftCard({
      product: { id: 80 },
      carts: {},
      listGiftCarts: jest.fn().mockResolvedValue([
        { uuid: 'gift-1', business_id: null, products: [{ id: 80 }] }
      ]),
      clearCart,
      addProduct
    })).resolves.toEqual({ type: 'reuse', uuid: 'gift-1' })
    expect(clearCart).not.toHaveBeenCalled()
    expect(addProduct).not.toHaveBeenCalled()
  })

  it('does not reuse a leftover cart that already stacked more than one gift card', async () => {
    const clearCart = jest.fn().mockResolvedValue({ error: false })
    const addProduct = jest.fn().mockResolvedValue({ error: false, result: { uuid: 'gift-3' } })
    await expect(purchaseGiftCard({
      product: { id: 50 },
      carts: {},
      listGiftCarts: jest.fn().mockResolvedValue([
        { uuid: 'gift-1', business_id: null, products: [{ id: 80 }, { id: 50 }] }
      ]),
      clearCart,
      addProduct
    })).resolves.toEqual({ type: 'created', uuid: 'gift-3' })
    expect(clearCart).toHaveBeenCalledWith('gift-1', { disableLoading: true })
    expect(addProduct).toHaveBeenCalledWith({ id: 50, quantity: 1 }, null, null, true)
  })

  it('fails closed when listing leftover gift carts fails', async () => {
    const clearCart = jest.fn()
    const addProduct = jest.fn()
    await expect(purchaseGiftCard({
      product: { id: 50 },
      carts: {},
      listGiftCarts: jest.fn().mockRejectedValue(new Error('network')),
      clearCart,
      addProduct
    })).resolves.toEqual({ type: 'failed' })
    expect(clearCart).not.toHaveBeenCalled()
    expect(addProduct).not.toHaveBeenCalled()
  })
})

describe('shouldLeaveGiftCheckoutWhenCartMissing', () => {
  it('stays when the API cart is already loaded', () => {
    expect(shouldLeaveGiftCheckoutWhenCartMissing({
      cart: null,
      isGiftCardCart: true,
      cartState: { loading: false, cart: { uuid: 'gift-1', business_id: null } }
    })).toBe(false)
  })

  it('stays while checkout is still loading the cart', () => {
    expect(shouldLeaveGiftCheckoutWhenCartMissing({
      cart: null,
      isGiftCardCart: true,
      cartState: { loading: true, cart: null }
    })).toBe(false)
  })

  it('leaves only after a gift checkout has no order cart and no loaded cart', () => {
    expect(shouldLeaveGiftCheckoutWhenCartMissing({
      cart: null,
      isGiftCardCart: true,
      cartState: { loading: false, cart: null }
    })).toBe(true)
    expect(shouldLeaveGiftCheckoutWhenCartMissing({
      cart: { business_id: null, uuid: 'gift-1' },
      isGiftCardCart: true,
      cartState: { loading: false, cart: null }
    })).toBe(false)
    expect(shouldLeaveGiftCheckoutWhenCartMissing({
      cart: null,
      isGiftCardCart: false,
      cartState: { loading: false, cart: null }
    })).toBe(false)
  })
})

describe('giftCartStatePatch', () => {
  it('maps a gift cart onto the order-state null-business key', () => {
    const cart = { business_id: null, uuid: 'gift-1' }
    expect(giftCartStatePatch(cart)).toEqual({
      'businessId:null': cart
    })
  })

  it('does not patch food carts or carts without a uuid', () => {
    expect(giftCartStatePatch({ business_id: 4, uuid: 'food-1' })).toBeNull()
    expect(giftCartStatePatch({ business_id: null })).toBeNull()
  })
})
