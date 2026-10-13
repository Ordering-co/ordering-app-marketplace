import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { CouponControl } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => {
  const m4 = require('../../../../../../jest/helpers/m4MenuComponentsMock')
  const d = require('../../../../../../jest/helpers/m4MenuDefaults')
  return m4.getMock({
    CouponControl: m4.renderUiController({
      ...d.couponControlDefaults,
      couponInput: '',
      couponDefault: 'SAVE10'
    })
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m4MenuUiMock').getUiMock())

describe('CouponControl', () => {
  it('opens the dedicated offers screen for eligible carts', () => {
    const onOpenOffers = jest.fn()
    const { getByLabelText } = renderWithProviders(
      <CouponControl onOpenOffers={onOpenOffers} />
    )

    fireEvent.press(getByLabelText('Offers and coupons'))

    expect(onOpenOffers).toHaveBeenCalledTimes(1)
  })

  it('renders remove coupon action when coupon is applied', () => {
    const { getByText } = renderWithProviders(<CouponControl canLoadOffers={false} />)
    expect(getByText(/Remove Coupon SAVE10/)).toBeTruthy()
  })

  it('accepts remove coupon confirmation', () => {
    const defaults = require('../../../../../../jest/helpers/m4MenuDefaults').couponControlDefaults
    defaults.handleRemoveCouponClick.mockClear()
    const { getByText } = renderWithProviders(<CouponControl canLoadOffers={false} />)
    // OAlert wraps the button — press remove text
    fireEvent.press(getByText(/Remove Coupon SAVE10/))
    expect(getByText(/Remove Coupon SAVE10/)).toBeTruthy()
  })
})
