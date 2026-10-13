import { renderHook, act } from '@testing-library/react-native'
import { Linking } from 'react-native'
import { initStripe, useConfirmPayment } from '@stripe/stripe-react-native'

import { useLanguage, useOrder, useSession, useToast } from '@components'
import {
  parseCartPaymethodData,
  getPaymethodGateway,
  getRedirectPaymentUrl,
  checkoutPaymentUtilities,
  REDIRECT_PAYMETHODS
} from '../index'

const mockConfirmPayment = jest.fn()
const mockShowToast = jest.fn()
const mockChangeMoment = jest.fn()
const mockConfirmCart = jest.fn()

jest.mock('@stripe/stripe-react-native', () => ({
  initStripe: jest.fn(),
  useConfirmPayment: jest.fn(() => ({
    confirmPayment: mockConfirmPayment
  }))
}))

describe('U1 — app utils (src/utils/index.tsx)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(initStripe as jest.Mock).mockImplementation(() => {})
    ;(useOrder as jest.Mock).mockReturnValue([
      { options: {} },
      { confirmCart: mockConfirmCart, changeMoment: mockChangeMoment }
    ])
    ;(useToast as jest.Mock).mockReturnValue([, { showToast: mockShowToast }])
    ;(useSession as jest.Mock).mockReturnValue([
      { user: { email: 'user@test.com' } },
      {}
    ])
    mockConfirmPayment.mockResolvedValue({ error: null })
    mockConfirmCart.mockResolvedValue({
      result: { order: { uuid: 'order-uuid', id: 42 } }
    })
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true)
    jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('pure helpers', () => {
    it('exports redirect paymethod constants', () => {
      expect(REDIRECT_PAYMETHODS).toContain('epayco')
    })

    it('parseCartPaymethodData handles object, json string, and invalid data', () => {
      expect(parseCartPaymethodData({ paymethod_data: { status: 1 } })).toEqual({ status: 1 })
      expect(parseCartPaymethodData({ paymethod_data: '{"ok":true}' })).toEqual({ ok: true })
      expect(parseCartPaymethodData({ paymethod_data: 'not-json' })).toBeNull()
      expect(parseCartPaymethodData({})).toBeNull()
    })

    it('getPaymethodGateway resolves nested gateway', () => {
      expect(getPaymethodGateway({ gateway: 'stripe' })).toBe('stripe')
      expect(getPaymethodGateway({ paymethod: { gateway: 'epayco' } })).toBe('epayco')
      expect(getPaymethodGateway({})).toBeNull()
    })

    it('getRedirectPaymentUrl picks first available redirect field', () => {
      expect(
        getRedirectPaymentUrl({
          paymethod_data: { result: { action: { redirect_url: 'https://a.test' } } }
        })
      ).toBe('https://a.test')
      expect(
        getRedirectPaymentUrl({
          paymethod_data: { result: { redirect_url: 'https://b.test' } }
        })
      ).toBe('https://b.test')
      expect(
        getRedirectPaymentUrl({
          paymethod_data: { redirect_url: 'https://c.test' }
        })
      ).toBe('https://c.test')
      expect(getRedirectPaymentUrl({})).toBeNull()
    })
  })

  describe('checkoutPaymentUtilities', () => {
    it('handleOrderRedirect clears moment and resets navigation', () => {
      ;(useOrder as jest.Mock).mockReturnValue([
        { options: { moment: '2026-07-14' } },
        { confirmCart: mockConfirmCart, changeMoment: mockChangeMoment }
      ])
      const navigation = { reset: jest.fn() }
      const { result } = renderHook(() => checkoutPaymentUtilities())

      result.current.handleOrderRedirect({
        orderId: 'ord-1',
        orderNumberId: 9,
        navigation
      })

      expect(mockChangeMoment).toHaveBeenCalledWith(null)
      expect(navigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [
          { name: 'BottomTab' },
          {
            name: 'OrderDetails',
            params: {
              orderId: 'ord-1',
              orderNumberId: 9,
              isFromCheckout: true
            }
          }
        ]
      })
    })

    it('handleStripePayment confirms cart and replaces order details on success', async () => {
      const handleIsRedirect = jest.fn()
      const navigation = { replace: jest.fn() }
      const { result } = renderHook(() => checkoutPaymentUtilities())

      await act(async () => {
        await result.current.handleStripePayment({
          data: { amount: 10 },
          paymethod: {
            gateway: 'stripe',
            paymethod: { credentials: { publishable: 'pk_test' } }
          },
          cart: {
            uuid: 'cart-1',
            paymethod_data: {
              result: { client_secret: 'secret' },
              data: { source_id: 'pm_123' }
            }
          },
          handleIsRedirect,
          navigation
        })
      })

      expect(initStripe).toHaveBeenCalledWith({ publishableKey: 'pk_test' })
      expect(useConfirmPayment).toHaveBeenCalled()
      expect(mockConfirmPayment).toHaveBeenCalled()
      expect(handleIsRedirect).toHaveBeenCalledWith(true)
      expect(mockConfirmCart).toHaveBeenCalledWith('cart-1')
      expect(navigation.replace).toHaveBeenCalledWith('OrderDetails', {
        orderId: 'order-uuid',
        orderNumberId: 42,
        isFromCheckout: true
      })
    })

    it('handleStripePayment uses stripe_connect payment method id', async () => {
      const { result } = renderHook(() => checkoutPaymentUtilities())

      await act(async () => {
        await result.current.handleStripePayment({
          data: {},
          paymethod: {
            gateway: 'stripe_connect',
            paymethod: { credentials: { publishable_key: 'pk_connect', user: 'acct_1' } }
          },
          cart: {
            uuid: 'cart-2',
            paymethod_data: {
              result: { client_secret: 'secret', payment_method_id: 'pm_connect' }
            }
          },
          navigation: { replace: jest.fn() }
        })
      })

      expect(initStripe).toHaveBeenCalledWith({
        publishableKey: 'pk_connect',
        stripeAccountId: 'acct_1'
      })
      expect(mockConfirmPayment).toHaveBeenCalledWith(
        'secret',
        expect.objectContaining({
          paymentMethodData: expect.objectContaining({
            paymentMethodId: 'pm_connect'
          })
        })
      )
    })

    it('handleStripePayment shows toast when stripe init fails', async () => {
      ;(initStripe as jest.Mock).mockImplementation(() => {
        throw new Error('stripe init failed')
      })
      const { result } = renderHook(() => checkoutPaymentUtilities())

      await act(async () => {
        await result.current.handleStripePayment({
          data: {},
          paymethod: { paymethod: { credentials: { publishable: 'pk' } } },
          cart: { paymethod_data: { result: { client_secret: 's' } } },
          navigation: { replace: jest.fn() }
        })
      })

      expect(mockShowToast).toHaveBeenCalledWith('error', 'Error: stripe init failed')
    })

    it('handleStripePayment shows toast when confirm payment returns error', async () => {
      mockConfirmPayment.mockResolvedValue({ error: { message: 'Card declined' } })
      const { result } = renderHook(() => checkoutPaymentUtilities())

      await act(async () => {
        await result.current.handleStripePayment({
          data: {},
          paymethod: { paymethod: { credentials: { publishable: 'pk' } } },
          cart: { paymethod_data: { result: { client_secret: 's' } } },
          navigation: { replace: jest.fn() }
        })
      })

      expect(mockShowToast).toHaveBeenCalledWith('error', 'Card declined')
    })

    it('handleStripePayment maps failed payment errors', async () => {
      mockConfirmPayment.mockRejectedValue(new Error('failed'))
      const { result } = renderHook(() => checkoutPaymentUtilities())

      await act(async () => {
        await result.current.handleStripePayment({
          data: {},
          paymethod: { paymethod: { credentials: { publishable: 'pk' } } },
          cart: { paymethod_data: { result: { client_secret: 's' } } },
          navigation: { replace: jest.fn() }
        })
      })

      expect(mockShowToast).toHaveBeenCalledWith('error', 'The payment has failed')
    })

    it('handleStripePayment shows toast when confirm cart fails', async () => {
      mockConfirmCart.mockResolvedValue({ error: { message: 'Cart error' } })
      const { result } = renderHook(() => checkoutPaymentUtilities())

      await act(async () => {
        await result.current.handleStripePayment({
          data: {},
          paymethod: { paymethod: { credentials: { publishable: 'pk' } } },
          cart: {
            uuid: 'cart-3',
            paymethod_data: { result: { client_secret: 's' }, data: { source_id: 'pm' } }
          },
          navigation: { replace: jest.fn() }
        })
      })

      expect(mockShowToast).toHaveBeenCalledWith('error', 'Cart error')
    })

    it('handleRedirectPaymentCheckout opens supported urls', async () => {
      const { result } = renderHook(() => checkoutPaymentUtilities())

      await act(async () => {
        await result.current.handleRedirectPaymentCheckout('https://pay.test/checkout')
      })

      expect(Linking.canOpenURL).toHaveBeenCalledWith('https://pay.test/checkout')
      expect(Linking.openURL).toHaveBeenCalledWith('https://pay.test/checkout')
    })

    it('handleRedirectPaymentCheckout rejects invalid urls', async () => {
      const { result } = renderHook(() => checkoutPaymentUtilities())

      await act(async () => {
        await result.current.handleRedirectPaymentCheckout('')
      })

      expect(mockShowToast).toHaveBeenCalled()
      expect(Linking.openURL).not.toHaveBeenCalled()
    })

    it('handleRedirectPaymentCheckout shows toast when url cannot open', async () => {
      ;(Linking.canOpenURL as jest.Mock).mockResolvedValue(false)
      const { result } = renderHook(() => checkoutPaymentUtilities())

      await act(async () => {
        await result.current.handleRedirectPaymentCheckout('https://blocked.test')
      })

      expect(mockShowToast).toHaveBeenCalled()
      expect(Linking.openURL).not.toHaveBeenCalled()
    })
  })
})
