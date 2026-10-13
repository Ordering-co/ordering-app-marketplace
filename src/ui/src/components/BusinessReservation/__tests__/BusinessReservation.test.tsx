import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import { useOrder } from '@components'

import { BusinessReservation } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m4MenuComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m4MenuUiMock').getUiMock())

const reservationOrderState = {
  loading: false,
  options: { type: 9 },
  carts: {}
}

describe('BusinessReservation', () => {
  beforeEach(() => {
    ;(useOrder as jest.Mock).mockReturnValue([reservationOrderState, {}])
  })

  it('renders reservation shell without crashing', () => {
    const { toJSON, getAllByTestId } = renderWithProviders(
      <BusinessReservation cart={require('../../../../../../jest/helpers/m4MenuDefaults').sampleCart} />
    )
    expect(toJSON()).toBeTruthy()
    expect(getAllByTestId('select-dropdown').length).toBeGreaterThan(0)
  })

  it('renders checkout reservation mode', () => {
    const { toJSON } = renderWithProviders(
      <BusinessReservation
        cart={require('../../../../../../jest/helpers/m4MenuDefaults').sampleCart}
        isCheckout
      />
    )
    expect(toJSON()).toBeTruthy()
  })

  it('selects guest count and continues', () => {
    const { getAllByTestId, toJSON } = renderWithProviders(
      <BusinessReservation cart={require('../../../../../../jest/helpers/m4MenuDefaults').sampleCart} />
    )
    expect(toJSON()).toBeTruthy()
    const items = getAllByTestId(/select-dropdown-item/)
    if (items.length) fireEvent.press(items[0])
  })
})
