import '../../../../../../jest/helpers/registerM5NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { PaymentOptionCash } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m5CheckoutComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m5CheckoutUiMock').getUiMock())

describe('PaymentOptionCash', () => {
  it('renders cash amount prompt', () => {
    const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
    const { getByText } = renderWithProviders(
      <PaymentOptionCash {...d.paymentOptionCashDefaults} />
    )
    expect(getByText(/Don't have exact amount/i)).toBeTruthy()
  })

  it('marks error when cash is below order total', () => {
    jest.useFakeTimers()
    const setErrorCash = jest.fn()
    const onChangeData = jest.fn()
    const { getByPlaceholderText } = renderWithProviders(
      <PaymentOptionCash
        orderTotal={20}
        setErrorCash={setErrorCash}
        onChangeData={onChangeData}
        defaultValue="5"
      />
    )
    const input = getByPlaceholderText('0')
    fireEvent.changeText(input, '5')
    jest.advanceTimersByTime(800)
    expect(setErrorCash).toHaveBeenCalled()
    jest.useRealTimers()
  })
})
