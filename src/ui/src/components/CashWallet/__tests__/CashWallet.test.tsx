import '../../../../../../jest/helpers/registerM5NativeMocks'

import React from 'react'

import { CashWallet } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => {
  const m5 = require('../../../../../../jest/helpers/m5CheckoutComponentsMock')
  const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
  return m5.getMock({
    WalletList: m5.renderUiController(d.cashWalletDefaults)
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m5CheckoutUiMock').getUiMock())

describe('CashWallet', () => {
  it('renders cash wallet balance', () => {
    const { getByText } = renderWithProviders(<CashWallet />)
    expect(getByText(/Available/i)).toBeTruthy()
    expect(getByText(/\$25/)).toBeTruthy()
  })

  it('renders wallet transactions section', () => {
    const { getByTestId } = renderWithProviders(<CashWallet />)
    expect(getByTestId('wallet-transactions-stub')).toBeTruthy()
  })
})
