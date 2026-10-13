import '../../../../../../jest/helpers/registerM5NativeMocks'

import React from 'react'

import { PaymentOptionStripe } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => {
  const m5 = require('../../../../../../jest/helpers/m5CheckoutComponentsMock')
  const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
  return m5.getMock({
    PaymentOptionStripe: m5.renderUiController(d.paymentOptionStripeDefaults)
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m5CheckoutUiMock').getUiMock())

describe('PaymentOptionStripe', () => {
  it('renders saved cards list', () => {
    const { getByText } = renderWithProviders(<PaymentOptionStripe />)
    expect(getByText(/4242/)).toBeTruthy()
  })

  it('mounts stripe payment option without crashing', () => {
    const { toJSON } = renderWithProviders(<PaymentOptionStripe />)
    expect(toJSON()).toBeTruthy()
  })
})
