import '../../../../../../jest/helpers/registerM5NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { Wallets } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('../../GiftCard/GiftCardUI', () => {
  const { View } = require('react-native')
  return { GiftCardUI: () => <View testID="gift-card-ui-stub" /> }
})

jest.mock('@components', () => {
  const m5 = require('../../../../../../jest/helpers/m5CheckoutComponentsMock')
  const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
  return m5.getMock({
    WalletList: m5.renderUiController(d.walletsDefaults)
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m5CheckoutUiMock').getUiMock())

describe('Wallets', () => {
  it('renders cash wallet tab by default', () => {
    const { getByText } = renderWithProviders(<Wallets />)
    expect(getByText(/Cash Wallet/i)).toBeTruthy()
    expect(getByText(/\$25/)).toBeTruthy()
  })

  it('switches to points wallet tab', () => {
    const { getByText } = renderWithProviders(<Wallets />)
    fireEvent.press(getByText(/Points Wallet/i))
    expect(getByText(/100/) || getByText(/Points/i)).toBeTruthy()
  })
})
