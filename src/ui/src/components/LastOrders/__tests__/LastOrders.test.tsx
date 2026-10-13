import '../../../../../../jest/helpers/registerM6NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { LastOrders } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => {
  const m6 = require('../../../../../../jest/helpers/m6OrdersComponentsMock')
  const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
  return m6.getMock({
    OrderList: m6.renderUiController(d.lastOrdersDefaults)
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m6OrdersUiMock').getUiMock())

describe('LastOrders', () => {
  it('renders completed orders list', () => {
    const { getByText } = renderWithProviders(
      <LastOrders onRedirect={jest.fn()} />
    )
    expect(getByText('Pizza Place')).toBeTruthy()
    expect(getByText(/Order Completed/i)).toBeTruthy()
  })

  it('navigates to order details on press', () => {
    const onRedirect = jest.fn()
    const { getByText } = renderWithProviders(
      <LastOrders onRedirect={onRedirect} />
    )
    fireEvent.press(getByText('Pizza Place'))
    expect(onRedirect).toHaveBeenCalledWith('OrderDetails', { orderId: 'order-uuid-41' })
  })

  it('reloads orders when refresh flag is set', () => {
    const m6 = require('../../../../../../jest/helpers/m6OrdersComponentsMock')
    const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
    const loadOrders = jest.fn()
    const setRefresh = jest.fn()
    jest.spyOn(require('@components'), 'OrderList').mockImplementation(
      m6.renderUiController({
        ...d.lastOrdersDefaults,
        loadOrders,
        refresh: true,
        setRefresh
      })
    )
    renderWithProviders(<LastOrders onRedirect={jest.fn()} refresh setRefresh={setRefresh} />)
    expect(loadOrders).toHaveBeenCalledWith(false, false, false, true)
    expect(setRefresh).toHaveBeenCalledWith(false)
  })
})
