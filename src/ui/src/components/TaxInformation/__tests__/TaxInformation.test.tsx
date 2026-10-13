import '../../../../../../jest/helpers/registerM5NativeMocks'

import React from 'react'

import { TaxInformation } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m5CheckoutComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m5CheckoutUiMock').getUiMock())

describe('TaxInformation', () => {
  it('renders tax name and rate', () => {
    const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
    const { getByText } = renderWithProviders(
      <TaxInformation {...d.taxInformationDefaults} />
    )
    expect(getByText(/Sales Tax/)).toBeTruthy()
    expect(getByText(/8%/)).toBeTruthy()
  })

  it('shows without description fallback', () => {
    const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
    const { getByText } = renderWithProviders(
      <TaxInformation
        type="tax"
        data={{ id: 1, name: 'VAT', rate: 10, type: 1 }}
        products={d.sampleProduct ? [d.sampleProduct] : []}
      />
    )
    expect(getByText(/Without description/i)).toBeTruthy()
  })
})
