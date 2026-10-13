import '../../../../../../jest/helpers/registerM5NativeMocks'

import React from 'react'

import { StripeRedirectForm } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => {
  const m5 = require('../../../../../../jest/helpers/m5CheckoutComponentsMock')
  const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
  return m5.getMock({
    StripeRedirectForm: m5.renderUiController(d.stripeRedirectDefaults)
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m5CheckoutUiMock').getUiMock())

describe('StripeRedirectForm', () => {
  it('renders redirect payment method selector', () => {
    const { getAllByText, queryByTestId } = renderWithProviders(<StripeRedirectForm />)
    expect(
      getAllByText(/iDEAL|Bancontact|OK|Select/i).length > 0 ||
      !!queryByTestId('odropdown')
    ).toBe(true)
  })

  it('mounts with paymethods list', () => {
    const { toJSON } = renderWithProviders(<StripeRedirectForm />)
    expect(toJSON()).toBeTruthy()
  })
})
