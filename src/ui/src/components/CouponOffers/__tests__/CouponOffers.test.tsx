import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { Alert } from 'react-native'
import { fireEvent, waitFor } from '@testing-library/react-native'

import { CouponOffers } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => {
  const m4 = require('../../../../../../jest/helpers/m4MenuComponentsMock')
  return m4.getMock()
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m4MenuUiMock').getUiMock())

const cart = {
  business_id: 1,
  uuid: 'cart-uuid',
  total: 25,
  offers: []
}

describe('CouponOffers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('loads and applies an available offer', async () => {
    const handleLoadOffers = jest.fn()
    const handleOfferApplyClick = jest.fn().mockResolvedValue(true)
    const onGoBack = jest.fn()
    const offer = {
      id: 15,
      name: 'Lunch reward',
      coupon: 'LUNCH15',
      applicable: true,
      stackable: true,
      rate_type: 1,
      rate: 15
    }
    const { getByLabelText } = renderWithProviders(
      <CouponOffers
        cart={cart}
        canLoadOffers
        offersState={{ offers: [offer], loading: false, error: null }}
        handleLoadOffers={handleLoadOffers}
        handleOfferApplyClick={handleOfferApplyClick}
        onGoBack={onGoBack}
      />
    )

    expect(handleLoadOffers).toHaveBeenCalledTimes(1)
    fireEvent.press(getByLabelText('Apply Lunch reward'))

    await waitFor(() => {
      expect(handleOfferApplyClick).toHaveBeenCalledWith(offer)
      expect(onGoBack).toHaveBeenCalledTimes(1)
    })
  })

  it('confirms removal from the current offers tab', () => {
    const handleOfferRemoveClick = jest.fn()
    const alertSpy = jest.spyOn(Alert, 'alert')
    const appliedOffer = {
      id: 21,
      name: 'Current reward',
      coupon: 'CURRENT15',
      rate_type: 1,
      rate: 15
    }
    const { getByText } = renderWithProviders(
      <CouponOffers
        cart={{ ...cart, offers: [appliedOffer] }}
        canLoadOffers
        offersState={{ offers: [], loading: false, error: null }}
        handleOfferRemoveClick={handleOfferRemoveClick}
      />
    )

    fireEvent.press(getByText('Current offers'))
    fireEvent.press(getByText('Remove'))

    const actions = alertSpy.mock.calls[0][2] || []
    actions.find(action => action.text === 'Remove')?.onPress?.()

    expect(handleOfferRemoveClick).toHaveBeenCalledWith(21)
  })

  it('shows a stable loading state while offers load', () => {
    const { getByText } = renderWithProviders(
      <CouponOffers
        cart={cart}
        canLoadOffers
        offersState={{ offers: [], loading: true, error: null }}
      />
    )

    expect(getByText('Loading...')).toBeTruthy()
  })
})
