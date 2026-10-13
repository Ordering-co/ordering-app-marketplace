import '../../../../../../jest/helpers/registerM5NativeMocks'

import React from 'react'

import { WalletTransactions } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m5CheckoutComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m5CheckoutUiMock').getUiMock())

describe('WalletTransactions', () => {
  it('renders transaction items for selected wallet', () => {
    const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
    const { getByTestId, getAllByTestId } = renderWithProviders(
      <WalletTransactions {...d.walletTransactionsDefaults} />
    )
    expect(getAllByTestId('wallet-transaction-item-stub').length).toBeGreaterThan(0)
  })

  it('shows empty state when no transactions', () => {
    const { getByText } = renderWithProviders(
      <WalletTransactions
        transactionsList={{ loading: false, error: null, list: { 'wallet:10': [] } }}
        currentWalletSelected={{ id: 10, type: 'cash' }}
      />
    )
    expect(getByText(/No transactions/i)).toBeTruthy()
  })
})
