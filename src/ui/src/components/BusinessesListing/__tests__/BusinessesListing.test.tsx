import '../../../../../../jest/helpers/registerM3NativeMocks'

import React from 'react'
import { act, fireEvent } from '@testing-library/react-native'
import { useConfig, useOrder, useSession } from '@components'

import { BusinessesListing } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('../Layout/Original', () => {
  const { View } = require('react-native')
  return {
    BusinessesListing: (props: any) => <View testID="original-listing" {...props} />
  }
})

jest.mock('../Layout/Maweja', () => {
  const { View } = require('react-native')
  return {
    BusinessesListing: (props: any) => <View testID="maweja-listing" {...props} />
  }
})

jest.mock('@components', () => require('../../../../../../jest/helpers/m3DiscoveryComponentsMock').getMock({
  useOrder: jest.fn(() => [
    { loading: false },
    { getLastOrderHasNoReview: jest.fn().mockResolvedValue(null) }
  ])
}))
jest.mock('@ui', () => require('../../../../../../jest/helpers/m3DiscoveryUiMock').getUiMock())

describe('BusinessesListing', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSession as jest.Mock).mockReturnValue([{ auth: true, loading: false }, {}])
    ;(useConfig as jest.Mock).mockReturnValue([{
      loading: false,
      configs: { show_reviews_popups_enabled: { value: '0' } }
    }])
    ;(useOrder as jest.Mock).mockReturnValue([
      { loading: false },
      { getLastOrderHasNoReview: jest.fn().mockResolvedValue(null) }
    ])
  })

  it('renders listing after loading finishes', () => {
    const { getByTestId } = renderWithProviders(
      <BusinessesListing navigation={{ navigate: jest.fn() }} isLogin />
    )
    expect(getByTestId('original-listing')).toBeTruthy()
  })

  it('renders the Maweja homepage when the design is maweja', () => {
    const { getByTestId, queryByTestId } = renderWithProviders(
      <BusinessesListing navigation={{ navigate: jest.fn() }} isLogin />,
      {
        themeOverrides: {
          app_design: { components: { layout: { type: 'maweja' } } }
        }
      }
    )
    expect(getByTestId('maweja-listing')).toBeTruthy()
    expect(queryByTestId('original-listing')).toBeNull()
  })

  it('shows review popup when last order has no review', async () => {
    ;(useConfig as jest.Mock).mockReturnValue([{
      loading: false,
      configs: { show_reviews_popups_enabled: { value: '1' } }
    }])
    ;(useOrder as jest.Mock).mockReturnValue([
      { loading: false },
      {
        getLastOrderHasNoReview: jest.fn().mockResolvedValue({
          id: 99,
          business_id: 1,
          business: { name: 'Pizza Place', logo: 'logo.png' },
          products: [],
          review: {},
          user_review: {},
          delivery_datetime_utc: '2026-01-01'
        })
      }
    ])
    const { getByTestId } = renderWithProviders(
      <BusinessesListing navigation={{ navigate: jest.fn() }} isLogin />
    )
    fireEvent.press(getByTestId('notification-setting'))
    await act(async () => {
      await Promise.resolve()
    })
    expect(getByTestId('bottom-popup')).toBeTruthy()
  })
})
