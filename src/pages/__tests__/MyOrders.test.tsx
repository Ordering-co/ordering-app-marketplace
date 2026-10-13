import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { useBusiness } from '@components'
import { renderPage } from '../../../jest/helpers/renderPage'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

jest.mock('../../config.js', () => ({
  __esModule: true,
  default: {
    franchiseSlug: 'demo-franchise'
  }
}))

jest.mock('../../layouts/SafeAreaViewWrapper', () => {
  const React = require('react')
  const { View } = require('react-native')
  return {
    SafeAreaViewWrapper: ({ children }: any) => (
      <View testID="layout-safe-area">{children}</View>
    )
  }
})


import MyOrders from '../MyOrders'


beforeEach(() => {
    jest.clearAllMocks()
    ;(useBusiness as jest.Mock).mockReturnValue([
      { business: { id: 99 } }
    ])
  })

describe('MyOrders', () => {
  it('renders orders list with business context and refresh', () => {
        const { getByTestId } = renderPage(MyOrders)
        expect(getByTestId('navbar-title').props.children).toBe('My Orders')
        expect(getByTestId('my-orders-controller')).toBeTruthy()
        fireEvent.press(getByTestId('safe-area-refresh'))
        fireEvent.press(getByTestId('my-orders-refresh'))
      })
  
      it('navigates on redirect and skips empty page', () => {
        const { getByTestId, navigation } = renderPage(MyOrders)
        fireEvent.press(getByTestId('my-orders-nav'))
        expect(navigation.navigate).toHaveBeenCalledWith('OrderDetails', { orderId: 5 })
        fireEvent.press(getByTestId('my-orders-nav-empty'))
        expect(navigation.navigate).toHaveBeenCalledTimes(1)
      })
  
      it('redirects to checkout when cart uuid is provided', () => {
        const { getByTestId, navigation } = renderPage(MyOrders)
        fireEvent.press(getByTestId('my-orders-checkout'))
        expect(navigation.navigate).toHaveBeenCalledWith('CheckoutPage', {
          cartUuid: 'cart-uuid'
        })
        fireEvent.press(getByTestId('my-orders-checkout-empty'))
        expect(navigation.navigate).toHaveBeenCalledTimes(1)
      })
  
      it('goes back only when navigation can go back', () => {
        const { getByTestId, navigation } = renderPage(MyOrders, {
          navigation: { canGoBack: jest.fn(() => false) }
        })
        fireEvent.press(getByTestId('my-orders-back'))
        expect(navigation.goBack).not.toHaveBeenCalled()
      })
})

