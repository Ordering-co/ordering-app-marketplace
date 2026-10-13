import '../../../../../../../jest/helpers/registerM3NativeMocks'

import React from 'react'
import { BusinessControllerSkeletons } from '..'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../../jest/helpers/m3DiscoveryComponentsMock').getMock())

describe('BusinessControllerSkeletons', () => {
  it('renders default three skeleton cards', () => {
    const { getAllByTestId } = renderWithProviders(
      <BusinessControllerSkeletons paginationProps={{}} />
    )
    expect(getAllByTestId('placeholder')).toHaveLength(3)
  })

  it('renders nextPageItems skeleton cards when provided', () => {
    const { getAllByTestId } = renderWithProviders(
      <BusinessControllerSkeletons paginationProps={{ nextPageItems: 2 }} />
    )
    expect(getAllByTestId('placeholder')).toHaveLength(2)
  })
})
