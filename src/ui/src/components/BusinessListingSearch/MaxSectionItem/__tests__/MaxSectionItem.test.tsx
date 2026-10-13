jest.mock('@/ui/src/components/shared', () => ({
  OText: require('@/ui/src/components/shared/OText').default
}))

import '../../../../../../../jest/helpers/registerM3NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { MaxSectionItem } from '..'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../../jest/helpers/m3DiscoveryComponentsMock').getMock())

describe('MaxSectionItem', () => {
  it('renders title and distance options', () => {
    const handleChangeFilters = jest.fn()
    const { getByText } = renderWithProviders(
      <MaxSectionItem
        title="Max distance"
        filter="max_distance"
        options={[1000, 3000, 5000, 'default']}
        filters={{ max_distance: 3000 }}
        handleChangeFilters={handleChangeFilters}
      />
    )
    expect(getByText('Max distance')).toBeTruthy()
    expect(getByText('1 Km')).toBeTruthy()
    fireEvent.press(getByText('3 Km'))
    expect(handleChangeFilters).toHaveBeenCalledWith('max_distance', 3000)
  })

  it('shows default label with plus suffix', () => {
    const { getByText } = renderWithProviders(
      <MaxSectionItem
        filter="max_distance"
        options={[1000, 3000, 'default']}
        filters={{ max_distance: 'default' }}
        handleChangeFilters={jest.fn()}
      />
    )
    expect(getByText('3 Km+')).toBeTruthy()
  })
})
