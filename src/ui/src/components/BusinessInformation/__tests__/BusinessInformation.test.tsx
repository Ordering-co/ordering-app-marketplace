import '../../../../../../jest/helpers/registerM3NativeMocks'

import React from 'react'

import { BusinessInformation } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m3DiscoveryComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m3DiscoveryUiMock').getUiMock())

describe('BusinessInformation', () => {
  it('renders business address and schedule', () => {
    const { getByText } = renderWithProviders(
      <BusinessInformation navigation={{ navigate: jest.fn() }} />
    )
    expect(getByText('123 Main St')).toBeTruthy()
    expect(getByText('Monday')).toBeTruthy()
  })
})
