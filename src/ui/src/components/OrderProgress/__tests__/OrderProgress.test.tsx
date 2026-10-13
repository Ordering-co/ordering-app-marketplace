import '../../../../../../jest/helpers/registerM6NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { OrderProgress } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('../OrderCard', () => {
  const { View, Text, TouchableOpacity } = require('react-native')
  return {
    OrderCard: (props: any) => (
      <View testID="order-progress-card">
        <Text>{props.lastOrder?.business?.name}</Text>
        <TouchableOpacity
          testID="order-progress-go"
          onPress={() => props.handleGoToOrder('OrderDetails', { orderId: props.lastOrder?.uuid })}
        />
      </View>
    )
  }
})

jest.mock('@components', () => {
  const m6 = require('../../../../../../jest/helpers/m6OrdersComponentsMock')
  const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
  return m6.getMock({
    OrderList: m6.renderUiController(d.orderProgressDefaults)
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m6OrdersUiMock').getUiMock())

describe('OrderProgress', () => {
  it('renders progress card for in-progress order', () => {
    const { getByTestId, getByText } = renderWithProviders(
      <OrderProgress navigation={{ navigate: jest.fn() }} isFocused />
    )
    expect(getByTestId('order-progress-card')).toBeTruthy()
    expect(getByText('Pizza Place')).toBeTruthy()
  })

  it('navigates to order details from card', () => {
    const navigate = jest.fn()
    const { getByTestId } = renderWithProviders(
      <OrderProgress navigation={{ navigate }} isFocused />
    )
    fireEvent.press(getByTestId('order-progress-go'))
    expect(navigate).toHaveBeenCalledWith('OrderDetails', expect.objectContaining({ orderId: 'order-uuid-43' }))
  })
})
