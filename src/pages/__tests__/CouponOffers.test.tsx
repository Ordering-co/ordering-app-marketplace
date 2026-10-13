import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { useOrder } from '@components'
import { renderPage } from '../../../jest/helpers/renderPage'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

import CouponOffers from '../CouponOffers'

describe('CouponOffers page', () => {
  beforeEach(() => {
    ;(useOrder as jest.Mock).mockReturnValue([{
      carts: {
        'businessId:1': {
          business_id: 1,
          uuid: 'cart-1',
          total: 20,
          offers: []
        }
      }
    }, {}])
  })

  it('renders the matching cart and returns through navigation', () => {
    const { getByTestId, navigation } = renderPage(CouponOffers, {
      route: { params: { businessId: 1, cartUuid: 'cart-1' } }
    })

    expect(getByTestId('navbar-title').props.children).toBe('Offers and coupons')
    expect(getByTestId('coupon-offers-business-id').props.children).toBe(1)

    fireEvent.press(getByTestId('coupon-offers-back'))
    expect(navigation.goBack).toHaveBeenCalledTimes(1)
  })
})
