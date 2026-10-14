import '../../../../../../jest/helpers/registerM5NativeMocks'

import React from 'react'
import { Alert, AppState } from 'react-native'
import { act, fireEvent, waitFor } from '@testing-library/react-native'

import { Checkout } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

const mawejaTheme = {
  themeOverrides: { app_design: { components: { layout: { type: 'maweja' } } } }
}

const guestSession = {
  auth: true,
  user: { id: 2, name: 'Guest', email: 'guest@example.com', guest_id: 44 },
  token: 'token',
  loading: false
}
const mockCheckout: any = { paymentOptionsProps: null }

const useCheckoutHooks = () => {
  const { useConfig, useSession } = require('@components')
  return { useConfig, useSession }
}

jest.mock('../../../../../utils', () => ({
  parseCartPaymethodData: (cart: any) => cart?.paymethod_data ?? null,
  REDIRECT_PAYMETHODS: ['stripe_redirect', 'paypal']
}))

jest.mock('../../BusinessesListing/Layout/Original/HeaderContent', () => {
  const { View } = require('react-native')
  return { HeaderContent: () => <View testID="header-content-stub" /> }
})

jest.mock('../BusinessDetails', () => {
  const { View } = require('react-native')
  return { BusinessDetailsComponent: () => <View testID="business-details-stub" /> }
})

jest.mock('../Summary', () => {
  const { View } = require('react-native')
  return { Summary: () => <View testID="summary-stub" /> }
})

jest.mock('../DeliveryOptions', () => {
  const { View } = require('react-native')
  return { DeliveryOptionsComponent: () => <View testID="delivery-options-stub" /> }
})

jest.mock('@components', () => {
  const m5 = require('../../../../../../jest/helpers/m5CheckoutComponentsMock')
  const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
  return m5.getMock({
    Checkout: m5.renderUiController(d.checkoutDefaults)
  })
})
jest.mock('@ui', () => {
  const React = require('react')
  const { Text, TouchableOpacity } = require('react-native')
  const ui = require('../../../../../../jest/helpers/m5CheckoutUiMock').getUiMock()
  return {
    ...ui,
    PaymentOptions: (props: any) => {
      mockCheckout.paymentOptionsProps = props
      return null
    },
    FloatingButton: (props: { disabled?: boolean, handleClick?: () => void, text?: string }) => (
      <TouchableOpacity
        testID="floating-button"
        accessibilityState={{ disabled: !!props.disabled }}
        onPress={props.handleClick}
      >
        <Text>{props.text}</Text>
      </TouchableOpacity>
    )
  }
})

describe('Checkout', () => {
  const originalFetch = global.fetch
  let restoreHooks = () => {}

  beforeAll(() => {
    const { useConfig, useSession } = require('@components')
    const configImpl = useConfig.getMockImplementation()
    const sessionImpl = useSession.getMockImplementation()
    restoreHooks = () => {
      useConfig.mockImplementation(configImpl)
      useSession.mockImplementation(sessionImpl)
    }
  })

  beforeEach(() => {
    Object.defineProperty(AppState, 'currentState', {
      configurable: true,
      get: () => 'active'
    })
    restoreHooks()
  })

  afterEach(() => {
    restoreHooks()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('shows not found when cart uuid is missing', () => {
    const { getByTestId, getByText } = renderWithProviders(
      <Checkout onNavigationRedirect={jest.fn()} />
    )
    expect(getByTestId('not-found-source')).toBeTruthy()
    expect(getByText(/could not load your order/i)).toBeTruthy()
  })

  it('does not add a 0 tip option when the dashboard disabled it', async () => {
    const { getByTestId } = renderWithProviders(
      <Checkout
        cartUuid="cart-1"
        onNavigationRedirect={jest.fn()}
        checkoutFieldsState={{
          loading: false,
          fields: [
            {
              order_type_id: 1,
              enabled: true,
              required: false,
              required_with_guest: false,
              validation_field: { code: 'driver_tip' }
            }
          ]
        }}
      />
    )
    await waitFor(() => expect(getByTestId('driver-tips-options')).toBeTruthy())
    expect(getByTestId('driver-tips-options').props.children).toBe('10,15,20')
  })

  it('shows loading skeleton while cart is unresolved', () => {
    const { getByTestId } = renderWithProviders(
      <Checkout
        cartUuid="missing-cart"
        onNavigationRedirect={jest.fn()}
        stripePaymentOptions={['stripe']}
      />
    )
    expect(getByTestId('placeholder')).toBeTruthy()
  })

  it('writes a gift cart from the API into order state', async () => {
    const giftCart = {
      uuid: 'gift-1',
      business_id: null,
      status: 0,
      products: [{ id: 80, name: 'Gift 80' }]
    }
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ result: giftCart })
    }) as any
    const { useOrder } = require('@components')
    const [, { setStateValues }] = useOrder()
    renderWithProviders(
      <Checkout cartUuid="gift-1" onNavigationRedirect={jest.fn()} />
    )
    await waitFor(() => {
      expect(setStateValues).toHaveBeenCalledWith({
        carts: { 'businessId:null': expect.objectContaining({ uuid: 'gift-1', business_id: null }) }
      })
    })
  })

  const renderGuestCheckout = (design: 'maweja' | 'original', guestCheckout: '0' | '1', allowedTypes = 'delivery') => {
    const { useConfig, useSession } = useCheckoutHooks()
    const [configState] = useConfig()
    useConfig.mockImplementation(() => [{
      ...configState,
      configs: {
        ...configState.configs,
        guest_checkout_enabled: { value: guestCheckout },
        allowed_order_types_guest_checkout: { value: allowedTypes }
      }
    }])
    useSession.mockImplementation(() => [guestSession, { login: jest.fn() }])
    return renderWithProviders(
      <Checkout cartUuid="cart-1" onNavigationRedirect={jest.fn()} />,
      design === 'maweja' ? mawejaTheme : undefined
    )
  }

  it('hides continue as guest and blocks place on maweja when guest checkout is enabled', async () => {
    const { getByText, queryByText, getByTestId } = renderGuestCheckout('maweja', '1')
    await waitFor(() => expect(getByText('Login')).toBeTruthy())
    expect(getByText('Sign up')).toBeTruthy()
    expect(queryByText('Continue as guest')).toBeNull()
    expect(getByText('Login/Sign up to complete your order.')).toBeTruthy()
    expect(getByTestId('floating-button').props.accessibilityState.disabled).toBe(true)
  })

  it('shows continue as guest on the original design when guest checkout is enabled', async () => {
    const { getByText, queryByText, getByTestId } = renderGuestCheckout('original', '1')
    await waitFor(() => expect(getByText('Continue as guest')).toBeTruthy())
    expect(queryByText('Login/Sign up to complete your order.')).toBeNull()
    expect(getByTestId('floating-button').props.accessibilityState.disabled).toBe(false)
  })

  it('blocks a guest in both designs when guest checkout is disabled', async () => {
    const maweja = renderGuestCheckout('maweja', '0')
    await waitFor(() => expect(maweja.getByText('Login/Sign up to complete your order.')).toBeTruthy())
    expect(maweja.queryByText('Continue as guest')).toBeNull()
    expect(maweja.getByTestId('floating-button').props.accessibilityState.disabled).toBe(true)

    const original = renderGuestCheckout('original', '0')
    await waitFor(() => expect(original.getByText('Login/Sign up to complete your order.')).toBeTruthy())
    expect(original.queryByText('Continue as guest')).toBeNull()
    expect(original.getByTestId('floating-button').props.accessibilityState.disabled).toBe(true)
  })

  it('requires an exact allowed order type', async () => {
    const checkout = renderGuestCheckout('original', '1', 'not_delivery')
    await waitFor(() => expect(checkout.getByText('Login/Sign up to complete your order.')).toBeTruthy())
    expect(checkout.queryByText('Continue as guest')).toBeNull()
    expect(checkout.getByTestId('floating-button').props.accessibilityState.disabled).toBe(true)
  })

  it('rechecks a retained payment callback after permission is revoked', async () => {
    const checkout = renderGuestCheckout('original', '1')
    const retainedPlaceOrder = mockCheckout.paymentOptionsProps.handlePlaceOrder
    const defaults = require('../../../../../../jest/helpers/m5CheckoutDefaults')
    defaults.checkoutDefaults.handlerClickPlaceOrder.mockClear()
    const { useConfig } = useCheckoutHooks()
    useConfig.mockImplementation(() => [{ configs: {} }])
    checkout.rerender(<Checkout cartUuid="cart-1" onNavigationRedirect={jest.fn()} />)

    retainedPlaceOrder()

    expect(defaults.checkoutDefaults.handlerClickPlaceOrder).not.toHaveBeenCalled()
  })

  it('does not block a signed-in customer', async () => {
    const { queryByText, getByTestId } = renderWithProviders(
      <Checkout cartUuid="cart-1" onNavigationRedirect={jest.fn()} />,
      mawejaTheme
    )
    await waitFor(() => expect(getByTestId('floating-button')).toBeTruthy())
    expect(queryByText('Continue as guest')).toBeNull()
    expect(queryByText('Login/Sign up to complete your order.')).toBeNull()
    expect(getByTestId('floating-button').props.accessibilityState.disabled).toBe(false)
  })

  it('hides wallets on the maweja checkout and keeps them on the original checkout', async () => {
    const maweja = renderWithProviders(
      <Checkout cartUuid="cart-1" onNavigationRedirect={jest.fn()} />,
      mawejaTheme
    )
    await waitFor(() => expect(maweja.getByTestId('floating-button')).toBeTruthy())
    expect(maweja.queryByTestId('payment-option-wallet-stub')).toBeNull()
    expect(maweja.queryByText('Wallets')).toBeNull()

    const original = renderWithProviders(
      <Checkout cartUuid="cart-1" onNavigationRedirect={jest.fn()} />
    )
    await waitFor(() => expect(original.getByTestId('payment-option-wallet-stub')).toBeTruthy())
    expect(original.getByText('Wallets')).toBeTruthy()
  })

  describe('pending cart', () => {
    const { sampleCart, sampleBusiness } = require('../../../../../../jest/helpers/m5CheckoutDefaults')
    const pendingCart = { ...sampleCart, status: 2, paymethod_id: 5 }
    const businessDetails = {
      loading: false,
      error: null,
      business: {
        ...sampleBusiness,
        paymethods: [{ paymethod_id: 5, paymethod: { id: 5, gateway: 'mercado_pago_checkout_pro', name: 'Mercado Pago' } }]
      }
    }
    const pendingMessage = /Your order is being processed/

    const checkout = (props: any = {}) => (
      <Checkout
        cartUuid="cart-1"
        onNavigationRedirect={jest.fn()}
        cart={pendingCart}
        businessDetails={businessDetails}
        isPendingCartReleasable
        handleReleasePendingCart={jest.fn()}
        {...props}
      />
    )

    const confirmCancelAttempt = async (alertSpy: jest.SpyInstance) => {
      const buttons = alertSpy.mock.calls[alertSpy.mock.calls.length - 1][2]
      await act(async () => {
        await buttons.find((button: any) => button.text === 'Yes, cancel').onPress()
      })
    }

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it.each(['maweja', 'original'])('offers to cancel the payment attempt on the %s checkout', async (design) => {
      const { getByText, queryByText, queryByTestId } = renderWithProviders(
        checkout(),
        design === 'maweja' ? mawejaTheme : undefined
      )
      await waitFor(() => expect(getByText('Your payment with Mercado Pago is still pending')).toBeTruthy())
      expect(getByText('Cancel payment attempt')).toBeTruthy()
      expect(queryByText(pendingMessage)).toBeNull()
      expect(queryByTestId('floating-button')).toBeNull()
    })

    it('keeps the generic message when the cart cannot be released', async () => {
      const { getByText, queryByText } = renderWithProviders(checkout({ isPendingCartReleasable: false }))
      await waitFor(() => expect(getByText(pendingMessage)).toBeTruthy())
      expect(queryByText('Cancel payment attempt')).toBeNull()
    })

    it('keeps the generic message for a cart placed from this screen until the customer comes back', async () => {
      const listeners: any[] = []
      const emitAppState = (state: string) => listeners.forEach((listener) => listener(state))
      jest.spyOn(AppState, 'addEventListener').mockImplementation((_type: any, listener: any) => {
        listeners.push(listener)
        return { remove: jest.fn() } as any
      })
      const { getByText, queryByText, rerender } = renderWithProviders(checkout({ cart: sampleCart, placing: true }))
      await waitFor(() => expect(getByText('Placing')).toBeTruthy())

      rerender(checkout({ placing: false }))
      expect(getByText(pendingMessage)).toBeTruthy()
      expect(queryByText('Cancel payment attempt')).toBeNull()

      act(() => emitAppState('background'))
      act(() => emitAppState('active'))
      expect(getByText('Cancel payment attempt')).toBeTruthy()
      expect(queryByText(pendingMessage)).toBeNull()
    })

    it('asks for a payment method again after the attempt was cancelled', async () => {
      const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {})
      const handleReleasePendingCart = jest.fn().mockResolvedValue({ outcome: 'released' })
      const { getByText, queryByText, rerender } = renderWithProviders(checkout({ handleReleasePendingCart }))
      await waitFor(() => expect(getByText('Cancel payment attempt')).toBeTruthy())

      fireEvent.press(getByText('Cancel payment attempt'))
      await confirmCancelAttempt(alertSpy)
      expect(handleReleasePendingCart).toHaveBeenCalledTimes(1)

      rerender(checkout({ handleReleasePendingCart, cart: { ...pendingCart, status: 4, paymethod_id: null }, isPendingCartReleasable: false }))
      expect(getByText('The payment attempt was cancelled. Choose a payment method to try again.')).toBeTruthy()
      expect(queryByText('The payment has not been successful, please try again')).toBeNull()
      expect(queryByText('Cancel payment attempt')).toBeNull()
    })

    it('keeps the failed payment message on a cancelled cart that was not released here', async () => {
      const { getByText, queryByText } = renderWithProviders(
        checkout({ cart: { ...pendingCart, status: 4 }, isPendingCartReleasable: false })
      )
      await waitFor(() => expect(getByText('The payment has not been successful, please try again')).toBeTruthy())
      expect(queryByText('The payment attempt was cancelled. Choose a payment method to try again.')).toBeNull()
    })

    it('goes to the order when the payment had been approved', async () => {
      const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {})
      const onNavigationRedirect = jest.fn()
      const handleReleasePendingCart = jest.fn().mockResolvedValue({
        outcome: 'order_created',
        order: { uuid: 'order-uuid', id: 77 }
      })
      const { getByText } = renderWithProviders(checkout({ handleReleasePendingCart, onNavigationRedirect }))
      await waitFor(() => expect(getByText('Cancel payment attempt')).toBeTruthy())

      fireEvent.press(getByText('Cancel payment attempt'))
      await confirmCancelAttempt(alertSpy)

      expect(onNavigationRedirect).toHaveBeenCalledWith('OrderDetails', {
        orderId: 'order-uuid',
        orderNumberId: 77,
        isFromCheckout: true
      })
    })
  })
})
