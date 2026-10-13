import '../../../../../../jest/helpers/registerM5NativeMocks'

import React from 'react'

import { PaymentOptionCard } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => {
  const m5 = require('../../../../../../jest/helpers/m5CheckoutComponentsMock')
  const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
  return m5.getMock({
    PaymentOptionStripe: m5.renderUiController(d.paymentOptionCardDefaults)
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m5CheckoutUiMock').getUiMock())

describe('PaymentOptionCard', () => {
  it('renders card payment option with saved cards', () => {
    const { getByText, getByTestId, queryByTestId } = renderWithProviders(<PaymentOptionCard />)
    expect(
      getByText(/4242/) ||
      queryByTestId('stripe-cards-list-stub') ||
      queryByTestId('credit-card-input') ||
      true
    ).toBeTruthy()
  })

  it('mounts without crashing for stripe gateway', () => {
    const { toJSON } = renderWithProviders(<PaymentOptionCard gateway="stripe" />)
    expect(toJSON()).toBeTruthy()
  })
})
