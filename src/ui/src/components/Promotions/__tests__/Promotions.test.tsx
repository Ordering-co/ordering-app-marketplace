import '../../../../../../jest/helpers/registerM3NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { Promotions } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m3DiscoveryComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m3DiscoveryUiMock').getUiMock())

const baseProps = () => {
  const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').promotionsDefaults
  return { ...defaults }
}

describe('Promotions', () => {
  it('renders offer list and opens details modal', () => {
    const { getByText } = renderWithProviders(<Promotions {...baseProps()} />)
    expect(getByText('Summer Deal')).toBeTruthy()
    fireEvent.press(getByText('View'))
    expect(getByText('Offer Details')).toBeTruthy()
  })

  it('shows loading skeletons while offers are loading', () => {
    const props = baseProps()
    const { getAllByTestId } = renderWithProviders(
      <Promotions {...props} offersState={{ loading: true, offers: [], error: null }} />
    )
    expect(getAllByTestId('placeholder-line').length).toBeGreaterThan(0)
  })

  it('shows empty state when there are no offers', () => {
    const props = baseProps()
    const { getByText } = renderWithProviders(
      <Promotions {...props} offersState={{ loading: false, offers: [], error: null }} />
    )
    expect(getByText('No promotions available right now')).toBeTruthy()
  })

  it('shows error message when offers fail to load', () => {
    const props = baseProps()
    const { getByText } = renderWithProviders(
      <Promotions {...props} offersState={{ loading: false, offers: [], error: 'Network error' }} />
    )
    expect(getByText('Network error')).toBeTruthy()
  })

  it('filters offers by search value', () => {
    const props = baseProps()
    const { queryByText } = renderWithProviders(
      <Promotions {...props} searchValue="winter" />
    )
    expect(queryByText('Summer Deal')).toBeNull()
  })

  it('opens coupon details and navigates to a business', () => {
    const props = baseProps()
    const couponOffer = {
      id: 2,
      name: 'SAVE10',
      coupon: 'SAVE10',
      type: 2,
      rate: 10,
      rate_type: 1,
      target: 2,
      auto: true,
      minimum: 15,
      max_discount: 5,
      end: '2026-12-31',
      image: 'https://cdn.test/offer.jpg',
      businesses: [require('../../../../../../jest/helpers/m3DiscoveryDefaults').sampleBusiness]
    }
    const navigation = { navigate: jest.fn() }

    const Harness = () => {
      const [offerSelected, setOfferSelected] = React.useState<any>(null)
      return (
        <Promotions
          {...props}
          navigation={navigation}
          offersState={{ loading: false, error: null, offers: [couponOffer] }}
          offerSelected={offerSelected}
          setOfferSelected={setOfferSelected}
        />
      )
    }

    const { getByText } = renderWithProviders(<Harness />)
    fireEvent.press(getByText('View'))
    expect(getByText('Coupon code')).toBeTruthy()
    fireEvent.press(getByText('Go to business'))
    expect(navigation.navigate).toHaveBeenCalledWith('Business', { store: 'pizza-place' })
  })
})
