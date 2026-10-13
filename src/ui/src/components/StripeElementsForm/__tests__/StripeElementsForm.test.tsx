import '../../../../../../jest/helpers/registerM5NativeMocks'

import React from 'react'

import { StripeElementsForm } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('../naked', () => {
  const m5 = require('../../../../../../jest/helpers/m5CheckoutComponentsMock')
  const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
  return {
    StripeElementsForm: m5.renderUiController(d.stripeElementsDefaults)
  }
})

jest.mock('@components', () => require('../../../../../../jest/helpers/m5CheckoutComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m5CheckoutUiMock').getUiMock())

describe('StripeElementsForm', () => {
  it('renders card field when public key is ready', () => {
    const { getByTestId } = renderWithProviders(<StripeElementsForm />)
    expect(getByTestId('card-field')).toBeTruthy()
  })

  it('mounts stripe elements form without crashing', () => {
    const { toJSON } = renderWithProviders(<StripeElementsForm />)
    expect(toJSON()).toBeTruthy()
  })
})
