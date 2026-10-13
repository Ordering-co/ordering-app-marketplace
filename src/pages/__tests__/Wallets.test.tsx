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


import Wallets from '../Wallets'


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

describe('Wallets', () => {
  it('renders wallets list with pull-to-refresh', () => {
        const { getByTestId } = renderPage(Wallets)
        expect(getByTestId('wallets-controller')).toBeTruthy()
        fireEvent.press(getByTestId('container-refresh'))
        fireEvent.press(getByTestId('wallets-refresh'))
      })
})

