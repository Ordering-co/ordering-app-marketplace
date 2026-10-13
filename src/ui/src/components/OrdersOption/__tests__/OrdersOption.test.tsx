import '../../../../../../jest/helpers/registerM6NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { OrdersOption } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('../PreviousBusinessOrdered', () => {
  const { View } = require('react-native')
  return { PreviousBusinessOrdered: () => <View testID="previous-business-ordered-stub" /> }
})

jest.mock('../PreviousProductsOrdered', () => {
  const { View } = require('react-native')
  return { PreviousProductsOrdered: () => <View testID="previous-products-ordered-stub" /> }
})

jest.mock('@components', () => {
  const m6 = require('../../../../../../jest/helpers/m6OrdersComponentsMock')
  const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
  return m6.getMock({
    OrderList: m6.renderUiController(d.ordersOptionDefaults)
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m6OrdersUiMock').getUiMock())

describe('OrdersOption', () => {
  it('renders past orders list stub', () => {
    const { getByTestId, getByText } = renderWithProviders(
      <OrdersOption onNavigationRedirect={jest.fn()} />
    )
    expect(getByTestId('previous-orders-stub')).toBeTruthy()
    expect(getByText('1')).toBeTruthy()
  })

  it('loads orders when refresh flag is set', () => {
    const m6 = require('../../../../../../jest/helpers/m6OrdersComponentsMock')
    const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
    const loadOrders = jest.fn()
    const setRefreshOrders = jest.fn()
    jest.spyOn(require('@components'), 'OrderList').mockImplementation(
      m6.renderUiController({
        ...d.ordersOptionDefaults,
        loadOrders,
        refreshOrders: true,
        setRefreshOrders
      })
    )
    renderWithProviders(
      <OrdersOption onNavigationRedirect={jest.fn()} refreshOrders setRefreshOrders={setRefreshOrders} />
    )
    expect(loadOrders).toHaveBeenCalledWith(false, false, false, true)
    expect(setRefreshOrders).toHaveBeenCalledWith(false)
  })

  it('renders business tab content when isBusiness', () => {
    const m6 = require('../../../../../../jest/helpers/m6OrdersComponentsMock')
    const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
    jest.spyOn(require('@components'), 'OrderList').mockImplementation(
      m6.renderUiController({
        ...d.ordersOptionDefaults,
        isBusiness: true,
        hideOrders: true,
        businesses: d.previousBusinessOrderedDefaults.businesses
      })
    )
    const { getByTestId } = renderWithProviders(
      <OrdersOption isBusiness hideOrders onNavigationRedirect={jest.fn()} />
    )
    expect(getByTestId('previous-business-ordered-stub')).toBeTruthy()
  })
})

describe('OrdersOption reorder redirect', () => {
  const renderReorder = (orders: any[], cartProducts: any[]) => {
    const m6 = require('../../../../../../jest/helpers/m6OrdersComponentsMock')
    const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
    const { useOrder } = require('@components')
    const onNavigationRedirect = jest.fn()
    ;(useOrder as jest.Mock).mockReturnValue([{
      loading: false,
      options: { type: 1 },
      carts: { 'businessId:1': { uuid: 'cart-1', products: cartProducts } }
    }])
    const withReorder = (reorderState: any) => {
      jest.spyOn(require('@components'), 'OrderList').mockImplementation(
        m6.renderUiController({
          ...d.ordersOptionDefaults,
          orderList: { loading: false, error: null, orders },
          reorderState
        })
      )
      return <OrdersOption onNavigationRedirect={onNavigationRedirect} />
    }
    const { rerender } = renderWithProviders(withReorder({ loading: false, error: null, result: null }))
    rerender(withReorder({ loading: false, error: null, result: { business_id: 1, orderId: 10, uuid: 'cart-1' } }))
    return onNavigationRedirect
  }

  it('sends a single-store order with several products to its checkout', () => {
    const products = [{ id: 1, order_id: 10, valid: true }, { id: 2, order_id: 10, valid: true }]
    const onNavigationRedirect = renderReorder([{ id: 10, status: 1, products }], products)

    expect(onNavigationRedirect).toHaveBeenCalledWith('CheckoutPage', { cartUuid: 'cart-1' })
  })

  it('sends a multi-store order to the multi-business cart', () => {
    const orders = [
      { id: 10, status: 1, cart_group_id: 5, summary: { total: 10 }, business_id: 1, products: [{ id: 1, order_id: 10, valid: true }] },
      { id: 11, status: 1, cart_group_id: 5, summary: { total: 12 }, business_id: 2, products: [{ id: 2, order_id: 11, valid: true }] }
    ]
    const onNavigationRedirect = renderReorder(orders, [{ id: 1, order_id: 10, valid: true }])

    expect(onNavigationRedirect).toHaveBeenCalledWith('Cart')
  })
})
