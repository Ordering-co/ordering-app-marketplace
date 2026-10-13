import '../../../../../../jest/helpers/registerM5NativeMocks'

import React from 'react'

import { PaymentOptionsWebView } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m5CheckoutComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m5CheckoutUiMock').getUiMock())

describe('PaymentOptionsWebView', () => {
  it('renders payment webview with uri', () => {
    const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
    const { getByTestId } = renderWithProviders(
      <PaymentOptionsWebView {...d.paymentOptionsWebViewDefaults} />
    )
    expect(getByTestId('webview')).toBeTruthy()
  })

  it('renders title header when provided', () => {
    const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
    const { getByText } = renderWithProviders(
      <PaymentOptionsWebView {...d.paymentOptionsWebViewDefaults} title="Complete payment" />
    )
    expect(getByText('Complete payment')).toBeTruthy()
  })
})
