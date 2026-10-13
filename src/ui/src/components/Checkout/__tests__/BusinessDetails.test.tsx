import '../../../../../../jest/helpers/registerM5NativeMocks'

import React from 'react'

import { BusinessDetailsComponent } from '../BusinessDetails'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@ui', () => require('../../../../../../jest/helpers/m9IntegrationsUiMock').getUiMock())

describe('BusinessDetailsComponent', () => {
  it('renders the store phone in the business info', () => {
    const { getByText } = renderWithProviders(
      <BusinessDetailsComponent
        showComponent
        loading={false}
        business={{ name: 'Le Comptoir', cellphone: '555-0100' }}
      />
    )
    expect(getByText('Le Comptoir')).toBeTruthy()
    expect(getByText('555-0100')).toBeTruthy()
  })

  it('hides the phone when the business has no cellphone', () => {
    const { getByText, queryByText } = renderWithProviders(
      <BusinessDetailsComponent
        showComponent
        loading={false}
        business={{ name: 'Le Comptoir' }}
      />
    )
    expect(getByText('Le Comptoir')).toBeTruthy()
    expect(queryByText('555-0100')).toBeNull()
  })
})
