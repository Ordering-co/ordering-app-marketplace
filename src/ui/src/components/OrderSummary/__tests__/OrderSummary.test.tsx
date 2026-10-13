import '../../../../../../jest/helpers/registerM6NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { OrderSummaryUI } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

const buildCart = (overrides = {}) => ({
  uuid: 'cart-1',
  status: 0,
  valid: true,
  valid_products: true,
  valid_schedule: true,
  valid_address: true,
  valid_maximum: true,
  valid_minimum: true,
  business_id: 1,
  business: { id: 1, name: 'Pizza Place', slug: 'pizza-place', tax_type: 1 },
  products: [{
    id: 100,
    code: 'prod-1',
    name: 'Cheese Slice',
    price: 5,
    quantity: 1,
    total: 5,
    tax: { id: 1 },
    fee: { id: 1 },
    offers: []
  }],
  subtotal: 10,
  total: 12.5,
  discount: 0,
  driver_tip: 0,
  delivery_price: 2.5,
  taxes: [],
  fees: [],
  offers: [],
  payment_events: [],
  comment: '',
  ...overrides
})

jest.mock('@components', () => {
  const m6 = require('../../../../../../jest/helpers/m6OrdersComponentsMock')
  const product = { id: 100, code: 'prod-1', name: 'Cheese Slice', price: 5, quantity: 1, total: 5, tax: { id: 1 }, fee: { id: 1 }, offers: [] }
  const cart = {
    uuid: 'cart-1',
    status: 0,
    valid: true,
    business_id: 1,
    business: { id: 1, name: 'Pizza Place', slug: 'pizza-place', tax_type: 1 },
    products: [product],
    subtotal: 10,
    total: 12.5,
    discount: 0,
    driver_tip: 0,
    delivery_price: 2.5,
    taxes: [],
    fees: [],
    offers: [],
    payment_events: [],
    comment: ''
  }
  return m6.getMock({
    useOrder: jest.fn(() => [{
      loading: false,
      options: { type: 1, moment: null },
      carts: { 'businessId:1': cart }
    }, {
      changeQuantity: jest.fn(),
      removeProduct: jest.fn().mockResolvedValue(),
      clearCart: jest.fn().mockResolvedValue()
    }])
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m6OrdersUiMock').getUiMock())

describe('OrderSummary', () => {
  it('renders cart products and subtotal', () => {
    const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
    const cart = buildCart()
    const { getByText, getAllByTestId } = renderWithProviders(
      <OrderSummaryUI {...d.orderSummaryDefaults} cart={cart} />
    )
    expect(getAllByTestId('product-item-accordion-stub').length).toBeGreaterThan(0)
    expect(getByText('Subtotal')).toBeTruthy()
    expect(getByText('Total')).toBeTruthy()
  })

  it('clears a gift cart when deleting its product', async () => {
    const { useOrder } = require('@components')
    const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
    const removeProduct = jest.fn()
    const clearCart = jest.fn().mockResolvedValue({ error: false })
    const cart = buildCart({ business_id: null, uuid: 'gift-1' })
    useOrder.mockReturnValue([{
      loading: false,
      options: { type: 1, moment: null },
      carts: { 'businessId:null': cart }
    }, {
      changeQuantity: jest.fn(),
      removeProduct,
      clearCart
    }])
    const { getByTestId } = renderWithProviders(
      <OrderSummaryUI
        {...d.orderSummaryDefaults}
        cart={cart}
        removeProduct={removeProduct}
        clearCart={clearCart}
      />
    )
    await fireEvent.press(getByTestId('product-delete'))
    expect(clearCart).toHaveBeenCalledWith('gift-1')
    expect(removeProduct).not.toHaveBeenCalled()
  })
})
