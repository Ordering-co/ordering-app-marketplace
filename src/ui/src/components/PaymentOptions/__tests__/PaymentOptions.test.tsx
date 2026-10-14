import '../../../../../../jest/helpers/registerM5NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { PaymentOptions } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => {
  const m5 = require('../../../../../../jest/helpers/m5CheckoutComponentsMock')
  const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
  return m5.getMock({
    PaymentOptions: m5.renderUiController({
      ...d.paymentOptionsDefaults,
      paymethodV2Featured: []
    })
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m5CheckoutUiMock').getUiMock())

describe('PaymentOptions', () => {
  it('renders available payment methods', () => {
    const { getByText } = renderWithProviders(<PaymentOptions />)
    expect(getByText('Cash')).toBeTruthy()
    expect(getByText('Credit Card')).toBeTruthy()
  })

  it('selects cash payment method', () => {
    const { getByText } = renderWithProviders(<PaymentOptions />)
    fireEvent.press(getByText('Cash'))
    expect(getByText('Cash')).toBeTruthy()
  })

  it('does not render the saved cards list for cash', () => {
    const { queryByTestId } = renderWithProviders(
      <PaymentOptions isOpenMethod={{ paymethod: { id: 1, gateway: 'cash', name: 'Cash' } }} />
    )
    expect(queryByTestId('stripe-cards-list-stub')).toBeNull()
  })

  it.each(['stripe', 'stripe_connect_v2'])('renders the saved cards list for %s', (gateway) => {
    const paymethod = { id: 85, gateway, name: 'Card', credentials: { publishable: 'pk_test' } }
    const { getByTestId } = renderWithProviders(
      <PaymentOptions isOpenMethod={{ paymethod }} paySelected={paymethod} />
    )
    expect(getByTestId('stripe-cards-list-stub')).toBeTruthy()
  })

  it.each(['stripe', 'stripe_connect_v2'])('keeps the saved cards list open for a cart that already has %s', (gateway) => {
    const paymethod = { id: 85, gateway, name: 'Card', credentials: { publishable: 'pk_test' } }
    const { getByTestId } = renderWithProviders(
      <PaymentOptions
        isOpenMethod={{ paymethod: null }}
        paySelected={{ id: 85, paymethodId: 85, gateway, paymethod, data: { id: 'card_1' } }}
      />
    )
    expect(getByTestId('stripe-cards-list-stub')).toBeTruthy()
  })

  it('closes the saved cards list when another method is being picked', () => {
    const paymethod = { id: 85, gateway: 'stripe', name: 'Card', credentials: { publishable: 'pk_test' } }
    const { queryByTestId } = renderWithProviders(
      <PaymentOptions
        isOpenMethod={{ paymethod: { id: 2, gateway: 'stripe_direct', name: 'Stripe Direct' } }}
        paySelected={{ id: 85, paymethodId: 85, gateway: 'stripe', paymethod, data: { id: 'card_1' } }}
      />
    )
    expect(queryByTestId('stripe-cards-list-stub')).toBeNull()
  })

  it('labels card on delivery as Mobile Money in the maweja layout', () => {
    const { getByText, queryByText } = renderWithProviders(
      <PaymentOptions
        layout="maweja"
        paymethodsList={{
          loading: false,
          error: null,
          paymethods: [
            { id: 3, gateway: 'card_delivery', name: 'Card on delivery', enabled: true }
          ]
        }}
      />
    )
    expect(getByText('Mobile Money')).toBeTruthy()
    expect(getByText('M-Pesa, Orange Money, Airtel Money, IllicoCash')).toBeTruthy()
    expect(queryByText('Card on delivery')).toBeNull()
  })

  it('shows a distinct hint for each offline gateway in the maweja layout', () => {
    const { useLanguage } = require('@components')
    useLanguage.mockImplementation(() => [
      { loading: false, dictionary: {} },
      (key: string) => key
    ])
    const { getByText } = renderWithProviders(
      <PaymentOptions
        layout="maweja"
        paymethodsList={{
          loading: false,
          error: null,
          paymethods: [
            { id: 1, gateway: 'cash', name: 'Cash', enabled: true, description: 'cash copy' },
            { id: 3, gateway: 'card_delivery', name: 'Card on delivery', enabled: true, description: 'card copy' },
            { id: 2, gateway: 'stripe', name: 'Credit Card', enabled: true, description: 'stripe copy' }
          ]
        }}
      />
    )
    expect(getByText('Mobile Money')).toBeTruthy()
    expect(getByText('M-Pesa, Orange Money, Airtel Money, IllicoCash')).toBeTruthy()
    expect(getByText('CASH_PAYMENT_HINT')).toBeTruthy()
    expect(getByText('stripe copy')).toBeTruthy()
    useLanguage.mockImplementation(() => [
      { loading: false, dictionary: {} },
      (key: string, fallback?: string) => fallback ?? key
    ])
  })
})
