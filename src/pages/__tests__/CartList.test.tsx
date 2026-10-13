import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import { StackActions } from '@react-navigation/native'

import { useConfig, useOrder } from '@components'
import { renderPage } from '../../../jest/helpers/renderPage'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native')
  return {
    ...actual,
    StackActions: {
      replace: jest.fn((name: string, params: unknown) => ({
        type: 'REPLACE',
        payload: { name, params }
      }))
    }
  }
})


import CartList from '../CartList'


beforeEach(() => {
    jest.clearAllMocks()
    ;(useOrder as jest.Mock).mockReturnValue([
      { options: { type: 1 } },
      {}
    ])
    ;(useConfig as jest.Mock).mockReturnValue([{
      configs: {
        max_days_preorder: { key: 'max_days_preorder', value: '3' },
        preorder_slot_interval: { key: 'preorder_slot_interval', value: 'catering_delivery,30|catering_pickup,45' },
        preorder_lead_time: { key: 'preorder_lead_time', value: 'catering_delivery,60|catering_pickup,90' },
        preorder_time_range: { key: 'preorder_time_range', value: 'catering_delivery,120|catering_pickup,180' },
        preorder_maximum_days: { key: 'preorder_maximum_days', value: 'catering_delivery,5|catering_pickup,7' },
        preorder_minimum_days: { key: 'preorder_minimum_days', value: 'catering_delivery,1|catering_pickup,2' }
      }
    }])
  })

describe('CartList', () => {
  it('renders my carts title and refresh handler', () => {
        const refreshOrderOptions = jest.fn()
        const { getByTestId } = renderPage(CartList, {
          route: { params: { refreshOrderOptions } }
        })
        expect(getByTestId('navbar-title').props.children).toBe('My carts')
        expect(getByTestId('cart-content')).toBeTruthy()
        fireEvent.press(getByTestId('safe-area-refresh'))
        expect(refreshOrderOptions).toHaveBeenCalled()
      })
  
      it('handles cart navigation replace and navigate', () => {
        const { getByTestId, navigation } = renderPage(CartList)
        fireEvent.press(getByTestId('cart-nav-replace'))
        expect(StackActions.replace).toHaveBeenCalledWith('Checkout', { cartId: 2 })
        expect(navigation.dispatch).toHaveBeenCalled()
        fireEvent.press(getByTestId('cart-nav'))
        expect(navigation.navigate).toHaveBeenCalledWith('Home', {})
      })
  
      it('returns to checkout when the cart was opened from checkout', () => {
        const { getByTestId, navigation } = renderPage(CartList, {
          route: { params: { fromCheckout: true, cartUuid: 'cart-9' } }
        })
        fireEvent.press(getByTestId('navbar-back'))
        expect(navigation.navigate).toHaveBeenCalledWith('CheckoutPage', { cartUuid: 'cart-9' })
        expect(navigation.goBack).not.toHaveBeenCalled()
        fireEvent.press(getByTestId('cart-nav'))
        expect(StackActions.replace).toHaveBeenCalledWith('Home', {
          fromCheckout: true,
          cartUuid: 'cart-9'
        })
      })

      it('navbar back respects canGoBack', () => {
        const { getByTestId, navigation } = renderPage(CartList, {
          navigation: { canGoBack: jest.fn(() => false) }
        })
        fireEvent.press(getByTestId('navbar-back'))
        expect(navigation.goBack).not.toHaveBeenCalled()
      })
})

