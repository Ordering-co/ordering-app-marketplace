import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import { useOrder } from '@components'

import { CartChargesRows, CartTaxesAndFeesRows } from '../BillRows'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m4MenuComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m4MenuUiMock').getUiMock())

const cart = {
  business_id: 1,
  delivery_price_with_discount: 4,
  driver_tip: 2,
  taxes: [
    { id: 1, name: 'IVA', type: 2, rate: 16, target: 'product', summary: { tax: 1.6 } },
    { id: 2, name: 'Included', type: 1, rate: 8, target: 'product', summary: { tax: 0.8 } },
    { id: 3, name: 'City', type: 2, rate: 5, target: 'order', summary: { tax: 0.5 } }
  ],
  fees: [{ id: 9, name: 'Service', fixed: 1, percentage: 0, summary: { fixed: 1, percentage: 0 } }],
  offers: []
}

const renderCharges = (props: any = {}) => renderWithProviders(
  <CartChargesRows
    cart={cart}
    setOpenTaxModal={jest.fn()}
    renderOfferRemove={() => null}
    {...props}
  />
)

describe('Cart bill rows', () => {
  beforeEach(() => {
    ;(useOrder as jest.Mock).mockReturnValue([{ loading: false, options: { type: 1 }, carts: {} }, {}])
  })

  it('groups product taxes and fees under one expandable line', () => {
    const { getByText, queryByText } = renderWithProviders(
      <CartTaxesAndFeesRows cart={cart} setOpenTaxModal={jest.fn()} />
    )

    expect(getByText('Taxes and fees')).toBeTruthy()
    expect(getByText('$2.6')).toBeTruthy()
    expect(queryByText(/IVA/)).toBeNull()

    fireEvent.press(getByText('Taxes and fees'))

    expect(getByText(/IVA/)).toBeTruthy()
    expect(getByText(/Service/)).toBeTruthy()
    expect(queryByText(/Included/)).toBeNull()
  })

  it('shows order taxes, delivery fee and driver tip for the cart', () => {
    const { getByText } = renderCharges()

    expect(getByText(/City/)).toBeTruthy()
    expect(getByText('Delivery Fee')).toBeTruthy()
    expect(getByText('$4')).toBeTruthy()
    expect(getByText('Driver tip')).toBeTruthy()
    expect(getByText('$2')).toBeTruthy()
  })

  it('leaves delivery fee and driver tip to the combined summary when configured', () => {
    const { queryByText } = renderCharges({ hideDeliveryFee: true, hideDriverTip: true })

    expect(queryByText('Delivery Fee')).toBeNull()
    expect(queryByText('Driver tip')).toBeNull()
  })

  it('hides the delivery fee for pickup orders', () => {
    ;(useOrder as jest.Mock).mockReturnValue([{ loading: false, options: { type: 2 }, carts: {} }, {}])

    const { queryByText } = renderCharges()

    expect(queryByText('Delivery Fee')).toBeNull()
  })

  it('marks the delivery fee as free when a partner metafield covers it', () => {
    const { getByText } = renderCharges({
      cart: { ...cart, metafields: [{ key: 'extra_value_free_delivery', value: '-4' }] }
    })

    expect(getByText('Free')).toBeTruthy()
  })
})
