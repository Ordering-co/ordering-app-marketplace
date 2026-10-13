import '../../../../../../jest/helpers/registerM5NativeMocks'

import React from 'react'

import { PaymentOptionWallet } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => {
  const m5 = require('../../../../../../jest/helpers/m5CheckoutComponentsMock')
  const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
  return m5.getMock({
    PaymentOptionWallet: m5.renderUiController(d.paymentOptionWalletDefaults)
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m5CheckoutUiMock').getUiMock())

describe('PaymentOptionWallet', () => {
  it('renders cash and points wallet options', () => {
    const { getAllByText } = renderWithProviders(<PaymentOptionWallet />)
    expect(getAllByText(/Cash|Wallet|Points/i).length).toBeGreaterThan(0)
  })

  it('shows wallets with balances', () => {
    const { getAllByText } = renderWithProviders(<PaymentOptionWallet />)
    expect(getAllByText(/\$20|\$50|20|50/i).length).toBeGreaterThan(0)
  })

  it('keeps the original wallet rows when a maweja layout is passed', () => {
    const { getByText, queryByText } = renderWithProviders(
      <PaymentOptionWallet layout="maweja" loyaltyRewardRate={1} />
    )
    expect(getByText(/Pay with Cash Wallet/)).toBeTruthy()
    expect(getByText(/Pay with Credit Points Wallet/)).toBeTruthy()
    expect(queryByText('Loyalty Points')).toBeNull()
  })
})
