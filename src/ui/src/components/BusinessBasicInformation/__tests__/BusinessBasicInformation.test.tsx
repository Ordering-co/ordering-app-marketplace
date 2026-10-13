jest.mock('dayjs', () => {
  const instance = {
    format: () => '2026-01-01 12:00:00',
    tz: () => instance,
    unix: () => 1700000000,
    hour: () => instance,
    minute: () => instance
  }
  const dayjs = () => instance
  dayjs.extend = jest.fn()
  dayjs.tz = () => instance
  return dayjs
})

jest.mock('dayjs/plugin/timezone', () => jest.fn())
jest.mock('dayjs/plugin/isBetween', () => jest.fn())

jest.mock('../../BusinessInformation', () => {
  const { View, Text } = require('react-native')
  return {
    BusinessInformation: () => (
      <View testID="business-information-panel">
        <Text>Business details panel</Text>
      </View>
    )
  }
})

jest.mock('../../BusinessReviews', () => {
  const { View } = require('react-native')
  return {
    BusinessReviews: () => <View testID="business-reviews-panel" />
  }
})

import '../../../../../../jest/helpers/registerM3NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import { Image } from 'react-native'

import { BusinessBasicInformation } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.spyOn(Image, 'getSize').mockImplementation((_uri, success) => {
  success(320, 180)
})

jest.mock('@components', () => require('../../../../../../jest/helpers/m3DiscoveryComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m3DiscoveryUiMock').getUiMock())

describe('BusinessBasicInformation', () => {
  it('renders business name when loaded', () => {
    const sample = require('../../../../../../jest/helpers/m3DiscoveryDefaults').sampleBusiness
    const { getByText } = renderWithProviders(
      <BusinessBasicInformation
        navigation={{ navigate: jest.fn() }}
        businessState={{ loading: false, business: sample }}
        header={sample.header}
        logo={sample.logo}
        categoryState={{ loading: false, categories: [] }}
      />
    )
    expect(getByText('Pizza Place')).toBeTruthy()
  })

  it('shows loading placeholders while business is loading', () => {
    const { getAllByTestId } = renderWithProviders(
      <BusinessBasicInformation
        navigation={{ navigate: jest.fn() }}
        businessState={{ loading: true, business: null }}
        categoryState={{ loading: false, categories: [] }}
      />
    )
    expect(getAllByTestId('placeholder-line').length).toBeGreaterThan(0)
  })

  it('opens business information modal from the info action', () => {
    const sample = require('../../../../../../jest/helpers/m3DiscoveryDefaults').sampleBusiness
    const { getByText, getByTestId } = renderWithProviders(
      <BusinessBasicInformation
        navigation={{ navigate: jest.fn() }}
        businessState={{ loading: false, business: sample }}
        header={sample.header}
        logo={sample.logo}
        categoryState={{ loading: false, categories: [] }}
        isBusinessInfoShow
      />
    )
    fireEvent.press(getByText('Info'))
    expect(getByTestId('business-information-panel')).toBeTruthy()
  })

  it('opens reviews modal from reviews action', () => {
    const sample = require('../../../../../../jest/helpers/m3DiscoveryDefaults').sampleBusiness
    const { getByText, getByTestId } = renderWithProviders(
      <BusinessBasicInformation
        navigation={{ navigate: jest.fn() }}
        businessState={{ loading: false, business: sample }}
        header={sample.header}
        logo={sample.logo}
        categoryState={{ loading: false, categories: [] }}
      />
    )
    fireEvent.press(getByText('4.5'))
    expect(getByTestId('business-reviews-panel')).toBeTruthy()
  })

  it('navigates to preorder when business is closed with preorder enabled', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults')
    const business = {
      ...defaults.sampleBusiness,
      open: false,
      today: { enabled: false, lapses: [] }
    }
    const navigation = { navigate: jest.fn(), goBack: jest.fn() }
    const { getByText } = renderWithProviders(
      <BusinessBasicInformation
        navigation={navigation}
        businessState={{ loading: false, business }}
        header={business.header}
        logo={business.logo}
        categoryState={{ loading: false, categories: [] }}
        isPreOrder
      />
    )
    fireEvent.press(getByText('Preorder'))
    expect(navigation.navigate).toHaveBeenCalledWith('MomentOption', expect.any(Object))
  })
})
