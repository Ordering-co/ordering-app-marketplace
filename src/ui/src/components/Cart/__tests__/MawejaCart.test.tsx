import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { MawejaCartList, MawejaCartPage } from '../layouts/Maweja'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

const onNavigationRedirect = jest.fn()
const mockSession: any = { auth: true, user: { name: 'Chris', email: 'chris@example.com', cellphone: '0814058638' } }
const mockCartPatch: any = {}
const mockClearCart = jest.fn()

jest.mock('../../CartStudentAlert', () => ({ CartStudentAlert: () => null }))
jest.mock('../../CouponControl', () => ({ CouponControl: () => null }))
jest.mock('../../NotFoundSource', () => ({ NotFoundSource: () => null }))
jest.mock('../../UpsellingProducts', () => ({ UpsellingProducts: () => null }))

jest.mock('@components', () => {
  const React = require('react')
  const cart = {
    uuid: 'cart-1',
    business_id: 1,
    business: { name: 'Burger Guys', slug: 'burger-guys' },
    products: [{ id: 9, code: 'burger', name: 'Buffalo Ranch Chicken', price: 10.35, quantity: 1, total: 10.35, images: 'https://img.test/burger.jpg' }],
    subtotal: 10.35,
    total: 11.35,
    delivery_price_with_discount: 0,
    valid_address: true,
    valid_maximum: true,
    minimum: 0,
    maximum: 100,
    taxes: [],
    fees: [{ summary: { amount: 1 } }]
  }
  const otherCart = {
    ...cart,
    uuid: 'cart-2',
    business_id: 2,
    business: { name: 'Dono Pizza', slug: 'dono-pizza' },
    products: [{ id: 10, code: 'pizza', name: 'Meatballs', price: 14.19, quantity: 1, total: 14.19 }],
    total: 14.19
  }
  return {
    Cart: (props: any) => props.UIComponent ? React.createElement(props.UIComponent, {
      ...props,
      changeQuantity: jest.fn(),
      getProductMax: () => 5,
      removeProduct: jest.fn(),
      handleChangeComment: jest.fn()
    }) : null,
    useOrder: () => [{
      carts: { a: { ...cart, ...mockCartPatch }, b: otherCart },
      options: { type: 1, address: { address: 'Hotel Pullman, Gombe' } }
    }, { clearCart: mockClearCart }],
    useLanguage: () => [null, (_key: string, fallback: string) => fallback],
    useSession: () => [mockSession],
    useUtils: () => [{ parsePrice: (value: number) => `$${value}`, optimizeImage: (value: string) => value }],
    useConfig: () => [{ configs: {} }],
    useValidationFields: () => [{}]
  }
})

describe('Maweja cart', () => {
  it('moves the address into the page and keeps checkout full width below the list', () => {
    const { getByTestId, getByText } = renderWithProviders(
      <MawejaCartPage
        businessSlug="burger-guys"
        navigation={{ canGoBack: () => true, goBack: jest.fn() }}
        onNavigationRedirect={onNavigationRedirect}
      />
    )

    expect(getByTestId('maweja-cart-title')).toBeTruthy()
    expect(getByText('Buffalo Ranch Chicken')).toBeTruthy()
    expect(getByTestId('maweja-cart-clear')).toBeTruthy()
    expect(getByTestId('maweja-cart-address')).toBeTruthy()
    expect(getByText('Hotel Pullman, Gombe')).toBeTruthy()
    expect(getByTestId('maweja-cart-checkout')).toBeTruthy()

    fireEvent.press(getByTestId('maweja-add-products'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('Business', { store: 'burger-guys' })

    fireEvent.press(getByTestId('maweja-cart-change-address'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('AddressList', { isGoBack: true })
  })

  it('sends a guest to the address form and back to the cart', () => {
    mockSession.auth = false
    const { getByTestId } = renderWithProviders(
      <MawejaCartPage
        businessSlug="burger-guys"
        navigation={{ canGoBack: () => true, goBack: jest.fn() }}
        onNavigationRedirect={onNavigationRedirect}
      />
    )

    fireEvent.press(getByTestId('maweja-cart-change-address'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('AddressForm', {
      address: { address: 'Hotel Pullman, Gombe' },
      isGoBack: true
    })
    mockSession.auth = true
  })

  it('lists carts from the header, one row per business', () => {
    const push = jest.fn()
    const { getByTestId, getByText, queryByTestId, queryByText } = renderWithProviders(
      <MawejaCartList navigation={{ canGoBack: () => true, goBack: jest.fn(), push }} />
    )

    expect(getByText('My carts')).toBeTruthy()
    expect(getByText('2 Carts')).toBeTruthy()
    expect(getByText('Burger Guys')).toBeTruthy()
    expect(getByText('Dono Pizza')).toBeTruthy()
    expect(queryByText('Buffalo Ranch Chicken')).toBeNull()
    expect(queryByTestId('maweja-cart-checkout')).toBeNull()

    fireEvent.press(getByTestId('maweja-cart-row-cart-1'))
    expect(push).toHaveBeenCalledWith('Cart', { businessSlug: 'burger-guys' })
  })

  describe('with a cart pending of payment', () => {
    beforeEach(() => {
      mockCartPatch.status = 2
    })

    afterEach(() => {
      delete mockCartPatch.status
    })

    it('shows the cart without the controls the API rejects and keeps the way to its checkout', () => {
      const { getByTestId, getByText, queryByTestId } = renderWithProviders(
        <MawejaCartPage
          businessSlug="burger-guys"
          navigation={{ canGoBack: () => true, goBack: jest.fn() }}
          onNavigationRedirect={onNavigationRedirect}
        />
      )

      expect(getByText('Buffalo Ranch Chicken')).toBeTruthy()
      expect(queryByTestId('maweja-cart-clear')).toBeNull()
      expect(queryByTestId('maweja-add-products')).toBeNull()
      expect(queryByTestId('maweja-qty-minus-9')).toBeNull()
      expect(queryByTestId('maweja-qty-plus-9')).toBeNull()
      expect(getByTestId('maweja-cart-comment').props.editable).toBe(false)
      expect(getByTestId('maweja-cart-checkout')).toBeTruthy()
    })

    it('only lets the other carts be cleared from the list', () => {
      const { getByTestId, queryByTestId } = renderWithProviders(
        <MawejaCartList navigation={{ canGoBack: () => true, goBack: jest.fn(), push: jest.fn() }} />
      )

      expect(getByTestId('maweja-cart-row-cart-1')).toBeTruthy()
      expect(queryByTestId('maweja-cart-row-clear-cart-1')).toBeNull()
      expect(getByTestId('maweja-cart-row-clear-cart-2')).toBeTruthy()
    })
  })
})
