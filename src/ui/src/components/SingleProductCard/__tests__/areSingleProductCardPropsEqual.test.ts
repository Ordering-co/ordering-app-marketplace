import {
  areMenuProductsEqual,
  areSingleProductCardPropsEqual
} from '../areSingleProductCardPropsEqual'

const menuProduct = {
  id: 100,
  name: 'Cheese Slice',
  price: 5,
  description: 'Melted cheddar',
  images: 'https://example.com/cheese.png',
  favorite: false,
  quantity: 12,
  inventoried: true,
  maximum_per_order: 4,
  extras: [{ id: 1, name: 'Toppings', suboptions: [{ id: 9, name: 'Bacon'.repeat(200) }] }]
}

describe('areMenuProductsEqual', () => {
  it('is true for the same object reference', () => {
    expect(areMenuProductsEqual(menuProduct, menuProduct)).toBe(true)
  })

  it('is true when only nested extras differ', () => {
    expect(areMenuProductsEqual(
      menuProduct,
      { ...menuProduct, extras: [{ id: 2, name: 'Sauces' }] }
    )).toBe(true)
  })

  it('is false when name changes', () => {
    expect(areMenuProductsEqual(menuProduct, { ...menuProduct, name: 'Ham Slice' })).toBe(false)
  })

  it('is false when price changes', () => {
    expect(areMenuProductsEqual(menuProduct, { ...menuProduct, price: 6 })).toBe(false)
  })

  it('is false when favorite changes', () => {
    expect(areMenuProductsEqual(menuProduct, { ...menuProduct, favorite: true })).toBe(false)
  })

  it('is false when ribbon text changes', () => {
    expect(areMenuProductsEqual(
      { ...menuProduct, ribbon: { enabled: true, text: 'New', color: '#000', shape: 1 } },
      { ...menuProduct, ribbon: { enabled: true, text: 'Sale', color: '#000', shape: 1 } }
    )).toBe(false)
  })

  it('is false when a tag image changes', () => {
    expect(areMenuProductsEqual(
      { ...menuProduct, tags: [{ image: 'a.png' }] },
      { ...menuProduct, tags: [{ image: 'b.png' }] }
    )).toBe(false)
  })
})

describe('areSingleProductCardPropsEqual', () => {
  const baseProps = {
    product: menuProduct,
    isSoldOut: false,
    productAddedToCartLength: 1,
    categoryState: { products: [menuProduct] }
  }

  it('does not JSON.stringify product objects', () => {
    const spy = jest.spyOn(JSON, 'stringify')
    areSingleProductCardPropsEqual(baseProps, {
      ...baseProps,
      product: { ...menuProduct, extras: [{ id: 99 }] },
      categoryState: { products: [{ ...menuProduct }] }
    })
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  it('is true when only nested extras and categoryState identity differ', () => {
    expect(areSingleProductCardPropsEqual(baseProps, {
      ...baseProps,
      product: { ...menuProduct, extras: [{ id: 99 }] },
      categoryState: { products: [{ ...menuProduct }] }
    })).toBe(true)
  })

  it('is false when cart quantity on this product changes', () => {
    expect(areSingleProductCardPropsEqual(baseProps, {
      ...baseProps,
      productAddedToCartLength: 2
    })).toBe(false)
  })

  it('is false when sold out changes', () => {
    expect(areSingleProductCardPropsEqual(baseProps, {
      ...baseProps,
      isSoldOut: true
    })).toBe(false)
  })

  it('is false when product name changes', () => {
    expect(areSingleProductCardPropsEqual(baseProps, {
      ...baseProps,
      product: { ...menuProduct, name: 'Ham Slice' }
    })).toBe(false)
  })
})
