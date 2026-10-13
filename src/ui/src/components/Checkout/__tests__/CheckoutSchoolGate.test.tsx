import '../../../../../../jest/helpers/registerM5NativeMocks'

import React from 'react'
import { AppState } from 'react-native'
import { fireEvent, waitFor } from '@testing-library/react-native'

import { Checkout } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

const mockGate: any = { cart: null }

jest.mock('../../../../../utils', () => ({
  parseCartPaymethodData: (cart: any) => cart?.paymethod_data ?? null,
  REDIRECT_PAYMETHODS: ['stripe_redirect', 'paypal']
}))

jest.mock('../../BusinessesListing/Layout/Original/HeaderContent', () => {
  const { View } = require('react-native')
  return { HeaderContent: () => <View testID="header-content-stub" /> }
})

jest.mock('../BusinessDetails', () => {
  const { View } = require('react-native')
  return { BusinessDetailsComponent: () => <View testID="business-details-stub" /> }
})

jest.mock('../Summary', () => {
  const { View } = require('react-native')
  return { Summary: () => <View testID="summary-stub" /> }
})

jest.mock('../DeliveryOptions', () => {
  const { View } = require('react-native')
  return { DeliveryOptionsComponent: () => <View testID="delivery-options-stub" /> }
})

jest.mock('@components', () => {
  const React = require('react')
  const m5 = require('../../../../../../jest/helpers/m5CheckoutComponentsMock')
  const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
  return m5.getMock({
    Checkout: (props: any) => {
      const UI = props.UIComponent
      if (!UI) return null
      const { UIComponent, ...rest } = props
      const cart = mockGate.cart
      return React.createElement(UI, {
        ...d.checkoutDefaults,
        ...rest,
        cart,
        cartState: { loading: false, cart, error: null },
        businessDetails: { loading: false, error: null, business: cart?.business }
      })
    }
  })
})
jest.mock('@ui', () => {
  const React = require('react')
  const { TouchableOpacity, Text } = require('react-native')
  const ui = require('../../../../../../jest/helpers/m5CheckoutUiMock').getUiMock()
  return {
    ...ui,
    FloatingButton: (props: any) => (
      <TouchableOpacity testID="floating-button" onPress={props.handleClick}>
        <Text>{props.text}</Text>
      </TouchableOpacity>
    ),
    CheckoutStudentDetails: ({ onStudentAssigned }: any) => (
      <TouchableOpacity testID="student-details-stub" onPress={() => onStudentAssigned(5)}>
        <Text>assign</Text>
      </TouchableOpacity>
    )
  }
})

const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
const schoolCart = (overrides: any = {}) => ({
  ...d.sampleCart,
  business: { ...d.sampleBusiness, vertical: 'school' },
  student_id: null,
  student: null,
  ...overrides
})

const renderCheckout = (cart: any) => {
  mockGate.cart = cart
  return renderWithProviders(<Checkout cartUuid="cart-1" onNavigationRedirect={jest.fn()} />)
}

describe('Checkout school gate', () => {
  beforeEach(() => {
    Object.defineProperty(AppState, 'currentState', { configurable: true, get: () => 'active' })
    const { useSelectedStudent } = require('@components')
    ;(useSelectedStudent as jest.Mock).mockReturnValue({ studentId: '5', setStudentId: jest.fn() })
    d.checkoutDefaults.handlerClickPlaceOrder.mockClear()
  })

  it('blocks place order on a school cart without a student even if one is remembered locally', async () => {
    const { findByTestId, getByText, getByTestId } = renderCheckout(schoolCart())
    const button = await findByTestId('floating-button')
    expect(getByText('Select a student')).toBeTruthy()
    expect(getByTestId('student-details-stub')).toBeTruthy()
    fireEvent.press(button)
    expect(d.checkoutDefaults.handlerClickPlaceOrder).not.toHaveBeenCalled()
  })

  it('allows place order once the cart carries the student', async () => {
    const { findByTestId, getByText } = renderCheckout(schoolCart({ student_id: 5 }))
    const button = await findByTestId('floating-button')
    expect(getByText('Place Order')).toBeTruthy()
    fireEvent.press(button)
    await waitFor(() => expect(d.checkoutDefaults.handlerClickPlaceOrder).toHaveBeenCalled())
  })

  it('opens the gate once the student details report a successful assign', async () => {
    const { findByTestId, getByText, getByTestId } = renderCheckout(schoolCart())
    await findByTestId('floating-button')
    expect(getByText('Select a student')).toBeTruthy()
    fireEvent.press(getByTestId('student-details-stub'))
    expect(getByText('Place Order')).toBeTruthy()
  })

  it('does not gate non-school carts', async () => {
    const { findByTestId, getByText, queryByTestId } = renderCheckout(schoolCart({ business: { ...d.sampleBusiness, vertical: 'food' } }))
    await findByTestId('floating-button')
    expect(getByText('Place Order')).toBeTruthy()
    expect(queryByTestId('student-details-stub')).toBeNull()
  })
})
