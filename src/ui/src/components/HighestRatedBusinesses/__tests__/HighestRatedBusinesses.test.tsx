import '../../../../../../jest/helpers/registerM3NativeMocks'

import React from 'react'

import { HighestRatedBusinesses } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

const mockBusinessList = jest.fn()

jest.mock('@components', () => {
  const m3 = require('../../../../../../jest/helpers/m3DiscoveryComponentsMock')
  const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults')
  return m3.getMock({
    BusinessList: (props: any) => {
      mockBusinessList(props)
      return m3.renderUiController(defaults.highestRatedDefaults)(props)
    }
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m3DiscoveryUiMock').getUiMock())

describe('HighestRatedBusinesses', () => {
  beforeEach(() => {
    mockBusinessList.mockClear()
  })

  it('renders top business section with cards', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <HighestRatedBusinesses navigation={{ navigate: jest.fn() }} />
    )
    expect(getByText('Top business')).toBeTruthy()
    expect(getByTestId('business-controller-stub')).toBeTruthy()
  })

  it('requests only featured businesses for the sponsored section', () => {
    renderWithProviders(
      <HighestRatedBusinesses navigation={{ navigate: jest.fn() }} />
    )

    expect(mockBusinessList).toHaveBeenCalled()
    const listProps = mockBusinessList.mock.calls[0][0]
    expect(listProps.isFeatured).toBe(true)
    expect(listProps.initialOrderByValue).toBeUndefined()
    expect(listProps.paginationSettings).toEqual({
      initialPage: 1,
      pageSize: 20,
      controlType: 'infinity'
    })
  })
})
