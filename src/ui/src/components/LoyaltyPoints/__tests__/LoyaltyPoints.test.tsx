import '../../../../../../jest/helpers/registerM5NativeMocks'

import React from 'react'

import { LoyaltyPoints } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => {
  const m5 = require('../../../../../../jest/helpers/m5CheckoutComponentsMock')
  const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
  return m5.getMock({
    WalletList: m5.renderUiController(d.loyaltyPointsDefaults)
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m5CheckoutUiMock').getUiMock())

describe('LoyaltyPoints', () => {
  it('renders loyalty points balance', () => {
    const { getAllByText } = renderWithProviders(<LoyaltyPoints />)
    expect(getAllByText(/Available|Points|100/i).length).toBeGreaterThan(0)
  })

  it('renders loyalty level when present', () => {
    const { getByText } = renderWithProviders(<LoyaltyPoints />)
    expect(getByText(/Gold/i)).toBeTruthy()
  })
})
