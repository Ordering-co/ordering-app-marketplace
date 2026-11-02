import '../../../../../../jest/helpers/registerM6NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { OrderDetails } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('../../../hooks/useDriverInterpolation', () => ({
  useDriverInterpolation: jest.fn(() => null)
}))

jest.mock('../OrderEta', () => {
  const { Text } = require('react-native')
  return { OrderEta: () => <Text testID="order-eta">ETA</Text> }
})

jest.mock('../Bill', () => {
  const { View } = require('react-native')
  return { Bill: () => <View testID="bill-stub" /> }
})

jest.mock('../DynamicProgressBar', () => ({
  DynamicProgressBar: () => null
}))

jest.mock('@components', () => {
  const m6 = require('../../../../../../jest/helpers/m6OrdersComponentsMock')
  const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
  return m6.getMock({
    OrderDetails: m6.renderUiController(d.orderDetailsDefaults)
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m6OrdersUiMock').getUiMock())

describe('OrderDetails', () => {
  it('renders in-progress order header and total', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <OrderDetails onNavigationRedirect={jest.fn()} />
    )
    expect(getByText(/Pick up completed by driver/i)).toBeTruthy()
    expect(getByText('Total')).toBeTruthy()
    expect(getByTestId('bill-stub')).toBeTruthy()
  })

  it('shows student info when order has student', () => {
    const { getByTestId } = renderWithProviders(
      <OrderDetails onNavigationRedirect={jest.fn()} />
    )
    expect(getByTestId('order-student-info-stub')).toBeTruthy()
  })

  it('opens help messages for business', () => {
    const onNavigationRedirect = jest.fn()
    const { getAllByTestId } = renderWithProviders(
      <OrderDetails onNavigationRedirect={onNavigationRedirect} />
    )
    fireEvent.press(getAllByTestId('fa-icon')[0])
    expect(onNavigationRedirect).toHaveBeenCalledWith(
      'MessageView',
      expect.objectContaining({ type: 'business' })
    )
  })
})

describe('OrderDetails delivery PIN', () => {
  const collectText = (node: any): string[] => {
    if (typeof node === 'string') return [node]
    if (Array.isArray(node)) return node.flatMap(collectText)
    return (node?.children || []).flatMap(collectText)
  }

  const renderWithOrder = (overrides: Record<string, unknown>) => {
    const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
    return renderWithProviders(
      <OrderDetails
        onNavigationRedirect={jest.fn()}
        order={{ loading: false, error: null, order: { ...d.sampleOrder, ...overrides } }}
      />
    )
  }

  it('shows the PIN with its leading zero while it is requested on an active order', () => {
    const { getByTestId, getByText, toJSON } = renderWithOrder({
      delivery_pin: '0427',
      delivery_pin_status: 'requested'
    })
    expect(getByTestId('delivery-pin')).toBeTruthy()
    expect(getByText('Delivery PIN')).toBeTruthy()
    expect(getByText('0427')).toBeTruthy()
    expect(getByText('Give this code to the driver when you receive your order')).toBeTruthy()
    const texts = collectText(toJSON())
    expect(texts.indexOf('0427')).toBeGreaterThan(-1)
    expect(texts.indexOf('0427')).toBeLessThan(texts.findIndex(text => /Pick up completed by driver/i.test(text)))
  })

  it('hides the PIN once it has been validated', () => {
    const { queryByTestId, queryByText } = renderWithOrder({
      delivery_pin: '0427',
      delivery_pin_status: 'validated'
    })
    expect(queryByTestId('delivery-pin')).toBeNull()
    expect(queryByText('0427')).toBeNull()
  })

  it('hides the PIN when the order has none', () => {
    const { queryByTestId } = renderWithOrder({
      delivery_pin: null,
      delivery_pin_status: 'requested'
    })
    expect(queryByTestId('delivery-pin')).toBeNull()
  })

  it('hides the PIN when the order is completed', () => {
    const { queryByTestId, queryByText } = renderWithOrder({
      status: 1,
      delivery_pin: '0427',
      delivery_pin_status: 'requested'
    })
    expect(queryByTestId('delivery-pin')).toBeNull()
    expect(queryByText('0427')).toBeNull()
  })
})
