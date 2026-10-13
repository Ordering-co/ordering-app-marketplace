import '../../../../../../../../jest/helpers/registerM3NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { BusinessesListing } from '..'
import { renderWithProviders } from '../../../../../../../../jest/helpers/renderWithProviders'

jest.mock('../FlatListBusinessListing', () => {
  const { View, TouchableOpacity } = require('react-native')
  return {
    FlatListBusinessListing: (props: any) => (
      <View testID="flat-list-business-listing">
        <TouchableOpacity testID="refresh-list" onPress={() => props.handleOnRefresh?.()} />
      </View>
    )
  }
})

jest.mock('@components', () => require('../../../../../../../../jest/helpers/m3DiscoveryComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../../../jest/helpers/m3DiscoveryUiMock').getUiMock())

describe('BusinessesListing Original layout', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('renders flat list and handles refresh', () => {
    const getBusinesses = jest.fn()
    const { getByTestId } = renderWithProviders(
      <BusinessesListing
        navigation={{ navigate: jest.fn() }}
        businessesList={{
          loading: false,
          businesses: [require('../../../../../../../../jest/helpers/m3DiscoveryDefaults').sampleBusiness]
        }}
        getBusinesses={getBusinesses}
        paginationProps={{ currentPage: 1, totalPages: 2 }}
        citiesState={{ cities: [] }}
        logosLayout={false}
      />
    )
    expect(getByTestId('flat-list-business-listing')).toBeTruthy()
    fireEvent.press(getByTestId('refresh-list'))
    expect(getBusinesses).toHaveBeenCalledWith(true)
  })
})
