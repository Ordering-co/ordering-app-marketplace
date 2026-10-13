import React from 'react'
import { act, fireEvent } from '@testing-library/react-native'
import { StackActions } from '@react-navigation/native'
import { initStripe, useConfirmPayment } from '@stripe/stripe-react-native'

import { useConfig, useOrder, useSession } from '@components'
import { renderPage } from '../../../jest/helpers/renderPage'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

const mockHandleOrderRedirect = jest.fn()
const mockHandleStripePayment = jest.fn()
const mockHandleRedirectPaymentCheckout = jest.fn()

jest.mock('../../utils', () => ({
  checkoutPaymentUtilities: jest.fn(() => ({
    handleOrderRedirect: mockHandleOrderRedirect,
    handleStripePayment: mockHandleStripePayment,
    handleRedirectPaymentCheckout: mockHandleRedirectPaymentCheckout
  })),
  parseCartPaymethodData: (cart: any) => {
    const data = cart?.paymethod_data
    if (data == null) return null
    if (typeof data === 'string') {
      try {
        return JSON.parse(data)
      } catch {
        return null
      }
    }
    return data
  },
  getPaymethodGateway: (paymethod: any) =>
    paymethod?.gateway ?? paymethod?.paymethod?.gateway ?? null,
  getRedirectPaymentUrl: (cart: any) => {
    const data = cart?.paymethod_data
    return data?.result?.redirect_url ?? data?.result?.url ?? null
  }
}))

jest.mock('../../ForterInit', () => ({
  getForterMobileUid: jest.fn(() => 'forter-uid-test')
}))

jest.mock('../../config.js', () => ({
  __esModule: true,
  default: {
    franchiseSlug: null,
    merchantId: 'merchant-test',
    app_scheme: 'orderingapp',
    android_app_id: 'com.test.app'
  }
}))

jest.mock('@stripe/stripe-react-native', () => ({
  initStripe: jest.fn(),
  useConfirmPayment: jest.fn(() => ({
    confirmPayment: jest.fn().mockResolvedValue({
      paymentIntent: { id: 'pi_test' },
      error: null
    })
  }))
}))

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


import CheckoutPage from '../Checkout'


const confirmMultiCarts = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useOrder as jest.Mock).mockReturnValue([
      { options: { type: 1 } },
      { confirmMultiCarts }
    ])
    ;(useConfig as jest.Mock).mockReturnValue([{
      configs: {
        max_days_preorder: { key: 'max_days_preorder', value: '3' },
        preorder_maximum_days: {
          key: 'preorder_maximum_days',
          value: 'catering_delivery,5|catering_pickup,7'
        }
      }
    }])
    ;(useSession as jest.Mock).mockReturnValue([
      { user: { id: 42, email: 'user@test.com' } },
      {}
    ])
    confirmMultiCarts.mockResolvedValue({ result: { id: 123 } })
  })

describe('CheckoutPage', () => {
  it('renders checkout with route params and catering max date', () => {
        ;(useOrder as jest.Mock).mockReturnValue([
          { options: { type: 7 } },
          {}
        ])
        const { getByTestId } = renderPage(CheckoutPage, {
          route: {
            params: {
              cartUuid: 'cart-abc',
              businessLogo: 'logo.png',
              businessName: 'Store',
              cartTotal: 25,
              fromProductsList: true,
              fromMulti: false
            }
          }
        })
        expect(getByTestId('navbar-title').props.children).toBe('Checkout')
        expect(getByTestId('checkout-controller')).toBeTruthy()
      })
  
      it('navbar back goes back or falls back to bottom tab', () => {
        const { getByTestId, navigation } = renderPage(CheckoutPage, {
          navigation: { canGoBack: jest.fn(() => false) }
        })
        fireEvent.press(getByTestId('navbar-back'))
        expect(navigation.navigate).toHaveBeenCalledWith('BottomTab')
      })

      it('leaves a gift checkout immediately without clearing', async () => {
        const clearCart = jest.fn()
        ;(useOrder as jest.Mock).mockReturnValue([
          {
            options: { type: 1 },
            carts: {
              'businessId:null': { uuid: 'gift-1', business_id: null }
            }
          },
          { confirmMultiCarts, clearCart }
        ])
        const { getByTestId, navigation } = renderPage(CheckoutPage, {
          route: { params: { cartUuid: 'gift-1' } }
        })
        await act(async () => {
          fireEvent.press(getByTestId('navbar-back'))
        })
        expect(clearCart).not.toHaveBeenCalled()
        expect(navigation.goBack).toHaveBeenCalled()
      })

      it('does not clear a food cart when navbar back is pressed', async () => {
        const clearCart = jest.fn()
        ;(useOrder as jest.Mock).mockReturnValue([
          {
            options: { type: 1 },
            carts: {
              'businessId:9': { uuid: 'food-1', business_id: 9 }
            }
          },
          { confirmMultiCarts, clearCart }
        ])
        const { getByTestId, navigation } = renderPage(CheckoutPage, {
          route: { params: { cartUuid: 'food-1' } }
        })
        await act(async () => {
          fireEvent.press(getByTestId('navbar-back'))
        })
        expect(clearCart).not.toHaveBeenCalled()
        expect(navigation.goBack).toHaveBeenCalled()
      })
 
      it('redirects existing order on place order click', () => {
        jest.useFakeTimers()
        const { getByTestId } = renderPage(CheckoutPage)
        fireEvent.press(getByTestId('checkout-place-order-existing'))
        act(() => {
          jest.runAllTimers()
        })
        expect(mockHandleOrderRedirect).toHaveBeenCalledWith(
          expect.objectContaining({
            orderId: 'ord-1',
            orderNumberId: 42
          })
        )
        jest.useRealTimers()
      })
  
      it('handles stripe payment when cart is payment pending', async () => {
        const { getByTestId } = renderPage(CheckoutPage)
        await act(async () => {
          fireEvent.press(getByTestId('checkout-place-order-stripe'))
        })
        expect(mockHandleStripePayment).toHaveBeenCalled()
      })
  
      it('handles redirect payment checkout for pending carts', async () => {
        const { getByTestId } = renderPage(CheckoutPage)
        await act(async () => {
          fireEvent.press(getByTestId('checkout-place-order-redirect'))
        })
        expect(mockHandleRedirectPaymentCheckout).toHaveBeenCalledWith('https://pay.test')
      })

      it('opens a redirect URL when the API returns one without a gateway', async () => {
        const { getByTestId } = renderPage(CheckoutPage)
        await act(async () => {
          fireEvent.press(getByTestId('checkout-place-order-redirect-no-gateway'))
        })
        expect(mockHandleRedirectPaymentCheckout).toHaveBeenCalledWith('https://pay-no-gateway.test')
      })
  
      it('navigates on redirect and handles order details from checkout', () => {
        jest.useFakeTimers()
        const { getByTestId, navigation } = renderPage(CheckoutPage)
        fireEvent.press(getByTestId('checkout-nav'))
        expect(navigation.navigate).toHaveBeenCalledWith('SavedCards', { userId: 1 })
        fireEvent.press(getByTestId('checkout-nav-empty'))
        expect(navigation.navigate).toHaveBeenCalledTimes(1)
        fireEvent.press(getByTestId('checkout-nav-order-details'))
        act(() => {
          jest.runAllTimers()
        })
        expect(mockHandleOrderRedirect).toHaveBeenCalled()
        jest.useRealTimers()
      })
  
      it('onGoBack falls back when cannot go back', async () => {
        const { getByTestId, navigation } = renderPage(CheckoutPage, {
          navigation: { canGoBack: jest.fn(() => false) }
        })
        await act(async () => {
          fireEvent.press(getByTestId('checkout-go-back'))
        })
        expect(navigation.navigate).toHaveBeenCalledWith('BottomTab')
      })
})

