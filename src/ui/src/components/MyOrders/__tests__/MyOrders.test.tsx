import '../../../../../../jest/helpers/registerM6NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { MyOrders } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('../../GiftCard/GiftCardOrdersList', () => {
  const { View, TouchableOpacity } = require('react-native')
  return {
    GiftCardOrdersList: (props: any) => (
      <View testID="gift-card-orders-list">
        <TouchableOpacity testID="gift-card-tab-refresh" onPress={() => props.setRefreshOrders?.(true)} />
      </View>
    )
  }
})

jest.mock('@components', () => require('../../../../../../jest/helpers/m6OrdersComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m6OrdersUiMock').getUiMock())

describe('MyOrders', () => {
  it('renders orders tab with OrdersOption sections', () => {
    const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
    const { getByText, getAllByTestId } = renderWithProviders(
      <MyOrders {...d.myOrdersDefaults} />
    )
    expect(getByText('Orders')).toBeTruthy()
    expect(getAllByTestId('orders-option-stub').length).toBeGreaterThan(0)
  })

  it('switches to business tab', () => {
    const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
    const { getByText, getAllByTestId } = renderWithProviders(
      <MyOrders {...d.myOrdersDefaults} />
    )
    fireEvent.press(getByText('Business'))
    expect(getAllByTestId('orders-option-stub').length).toBe(1)
  })

  it('switches to gift card tab when enabled', () => {
    const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
    const { getByText, getByTestId } = renderWithProviders(
      <MyOrders {...d.myOrdersDefaults} />
    )
    fireEvent.press(getByText('Gift card'))
    expect(getByTestId('gift-card-orders-list')).toBeTruthy()
  })
})
