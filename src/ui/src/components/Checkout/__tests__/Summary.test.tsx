import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { Summary } from '../Summary'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

const mockCart: any = {
  uuid: 'cart-1',
  business_id: 1,
  status: 0,
  business: { name: 'Burger Guys', slug: 'burger-guys' },
  products: [{ id: 9, code: 'burger', name: 'Buffalo Ranch Chicken', price: 10.35, quantity: 1, total: 10.35 }]
}

jest.mock('@components', () => {
  const React = require('react')
  return {
    Cart: (props: any) => props.UIComponent ? React.createElement(props.UIComponent, props) : null,
    useOrder: () => [{ carts: { 'businessId:1': mockCart } }],
    useLanguage: () => [null, (_key: string, fallback: string) => fallback],
    useUtils: () => [{ parsePrice: (value: number) => `$${value}`, optimizeImage: (value: string) => value }]
  }
})

jest.mock('@ui', () => {
  const { Text } = require('react-native')
  return { OText: ({ children }: any) => <Text>{children}</Text> }
})

describe('Checkout summary', () => {
  const navigation = { navigate: jest.fn(), push: jest.fn() }

  const renderSummary = (layout?: string) => renderWithProviders(
    <Summary showComponent businessId={1} navigation={navigation} layout={layout} />
  )

  beforeEach(() => {
    navigation.navigate.mockClear()
    navigation.push.mockClear()
    mockCart.status = 0
  })

  it('opens the cart editor from the summary', () => {
    const { getByTestId } = renderSummary()
    fireEvent.press(getByTestId('checkout-edit-cart'))
    expect(navigation.navigate).toHaveBeenCalledWith('UpsellingPage', { businessId: 1 })
  })

  it('adds products and edits the cart from the maweja articles', () => {
    const { getByTestId, getByText } = renderSummary('maweja')
    fireEvent.press(getByTestId('maweja-checkout-add-products'))
    expect(navigation.navigate).toHaveBeenCalledWith('Business', { store: 'burger-guys' })
    fireEvent.press(getByText('Buffalo Ranch Chicken'))
    expect(navigation.push).toHaveBeenCalledWith('Cart', expect.objectContaining({ cartUuid: 'cart-1' }))
  })

  it.each([undefined, 'maweja'])('lists a pending cart without the ways to change it (layout: %s)', (layout) => {
    mockCart.status = 2
    const { getByText, queryByTestId } = renderSummary(layout)

    expect(queryByTestId('checkout-edit-cart')).toBeNull()
    expect(queryByTestId('maweja-checkout-add-products')).toBeNull()
    fireEvent.press(getByText('Buffalo Ranch Chicken'))
    expect(navigation.navigate).not.toHaveBeenCalled()
    expect(navigation.push).not.toHaveBeenCalled()
  })
})
