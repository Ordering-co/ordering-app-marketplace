import '../../../../../../jest/helpers/registerM9NativeMocks'

import React from 'react'
import { Text } from 'react-native'

import { FacebookPixel } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m9IntegrationsComponentsMock').getMock())

describe('FacebookPixel', () => {
  it('renders children', () => {
    const { getByText } = renderWithProviders(
      <FacebookPixel>
        <Text>Marketplace</Text>
      </FacebookPixel>
    )
    expect(getByText('Marketplace')).toBeTruthy()
  })
})
