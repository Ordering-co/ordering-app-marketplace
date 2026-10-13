import '../../../../../../../jest/helpers/registerM9NativeMocks'

import React from 'react'

import { RedeemGiftCard } from '..'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../../jest/helpers/m9IntegrationsComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../../jest/helpers/m9IntegrationsUiMock').getUiMock())

describe('RedeemGiftCard', () => {
  it('renders redeem form fields', () => {
    const { getByText } = renderWithProviders(
      <RedeemGiftCard onClose={jest.fn()} />
    )
    expect(getByText('Apply to your balance')).toBeTruthy()
  })
})
