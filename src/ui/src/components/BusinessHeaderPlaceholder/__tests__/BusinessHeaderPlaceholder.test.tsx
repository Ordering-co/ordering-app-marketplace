import '../../../../../../jest/helpers/registerM3NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import { useConfig, useOrder, useSession } from '@components'

import { BusinessHeaderPlaceholder } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m3DiscoveryComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m3DiscoveryUiMock').getUiMock())

describe('BusinessHeaderPlaceholder', () => {
  it('renders monogram when no logo', () => {
    const { getByText } = renderWithProviders(
      <BusinessHeaderPlaceholder name="Pizza Place" height={200} />
    )
    expect(getByText('P')).toBeTruthy()
  })

  it('renders logo image when logo is provided', () => {
    const { getByTestId } = renderWithProviders(
      <BusinessHeaderPlaceholder
        name="Pizza Place"
        logo="https://cdn.test/logo.jpg"
        height={200}
        optimizeImage={(url) => url}
      />
    )
    expect(getByTestId('fast-image')).toBeTruthy()
  })

  it('uses question mark fallback when name is empty', () => {
    const { getByText } = renderWithProviders(
      <BusinessHeaderPlaceholder height={120} />
    )
    expect(getByText('?')).toBeTruthy()
  })
})
