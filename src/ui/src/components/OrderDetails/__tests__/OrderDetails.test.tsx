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
