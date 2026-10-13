import '../../../../../../jest/helpers/registerM5NativeMocks'

import React from 'react'

import { WalletTransactionItem } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m5CheckoutComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m5CheckoutUiMock').getUiMock())

describe('WalletTransactionItem', () => {
  it('renders credit transaction with description', () => {
    const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
    const { getByText } = renderWithProviders(
      <WalletTransactionItem {...d.walletTransactionItemDefaults} />
    )
    expect(getByText('Top up')).toBeTruthy()
    expect(getByText(/\+ \$5|\$5/)).toBeTruthy()
  })

  it('renders debit transaction amount', () => {
    const { getByText } = renderWithProviders(
      <WalletTransactionItem
        item={{ id: 2, amount: -3, created_at: '2026-01-02', description: 'Spend' }}
        withFormatPrice
        isLast
      />
    )
    expect(getByText('Spend')).toBeTruthy()
    expect(getByText('$-3')).toBeTruthy()
  })
})
