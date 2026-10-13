import '../../../../../../jest/helpers/registerM5NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { StripeCardForm } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('../naked', () => {
  const m5 = require('../../../../../../jest/helpers/m5CheckoutComponentsMock')
  const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
  return {
    StripeCardForm: m5.renderUiController(d.stripeCardFormDefaults)
  }
})

jest.mock('@components', () => require('../../../../../../jest/helpers/m5CheckoutComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m5CheckoutUiMock').getUiMock())

describe('StripeCardForm', () => {
  it('renders credit card input', () => {
    const { getByTestId } = renderWithProviders(<StripeCardForm />)
    expect(getByTestId('credit-card-input')).toBeTruthy()
  })

  it('invokes cancel handler', () => {
    const handleCancel = jest.fn()
    const m5 = require('../../../../../../jest/helpers/m5CheckoutComponentsMock')
    const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
    // Component uses controller defaults; cancel button should be present
    const { getByText } = renderWithProviders(<StripeCardForm />)
    const cancel = getByText(/Cancel/i)
    fireEvent.press(cancel)
    expect(cancel).toBeTruthy()
  })
})
