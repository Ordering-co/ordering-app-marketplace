import '../../../../../../jest/helpers/registerM6NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { MultiCheckout } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

const mockMulti: any = {
  openCarts: null,
  verticals: {},
  orderCarts: null,
  config: { configs: {} },
  session: { user: { id: 1 }, loading: false },
  paymentProps: null
}

jest.mock('../../MultiCart', () => {
  const { View } = require('react-native')
  return { MultiCart: () => <View testID="multi-cart-loading-stub" /> }
})

jest.mock('../../Checkout/CheckoutLoginForm', () => {
  const { View } = require('react-native')
  return { CheckoutLoginForm: () => <View testID="checkout-login-form-stub" /> }
})
jest.mock('../../MultiCartsPaymethodsAndWallets', () => ({
  MultiCartsPaymethodsAndWallets: (props: any) => {
    mockMulti.paymentProps = props
    return null
  }
}))

jest.mock('../../CheckoutStudentDetails', () => {
  const React = require('react')
  const { TouchableOpacity, Text } = require('react-native')
  return {
    CheckoutStudentDetails: ({ cart, onStudentAssigned }: any) => (
      <TouchableOpacity testID={`student-details-${cart?.uuid}`} onPress={() => onStudentAssigned(7)}>
        <Text>{cart?.business?.slug}</Text>
      </TouchableOpacity>
    )
  }
})

jest.mock('../../../hooks/useBusinessVerticals', () => ({
  useBusinessVerticals: () => mockMulti.verticals
}))

jest.mock('@components', () => {
  const React = require('react')
  const m6 = require('../../../../../../jest/helpers/m6OrdersComponentsMock')
  const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
  const base = m6.getMock({
    MultiCheckout: (props: any) => {
      const UI = props.UIComponent
      if (!UI) return null
      const { UIComponent, ...rest } = props
      const extra = mockMulti.openCarts
        ? { openCarts: mockMulti.openCarts, paymethodSelected: { id: 1, paymethod_id: 1, gateway: 'cash', name: 'Cash' } }
        : {}
      return React.createElement(UI, { ...d.multiCheckoutDefaults, ...rest, ...extra })
    }
  })
  const baseUseOrder = base.useOrder
  return {
    ...base,
      useOrder: jest.fn(() => {
        const [state, actions] = baseUseOrder()
        return [mockMulti.orderCarts ? { ...state, carts: mockMulti.orderCarts } : state, actions]
      }),
      useConfig: jest.fn(() => [mockMulti.config]),
      useSession: jest.fn(() => [mockMulti.session, { login: jest.fn() }])
  }
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m6OrdersUiMock').getUiMock())

const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
const schoolBusiness = { ...d.sampleBusiness, id: 3103, slug: 'secundaria_17', vertical: 'school' }
const schoolCartWithoutStudent = { ...d.sampleCart, uuid: 'school-cart', business_id: 3103, business: schoolBusiness, student_id: null }
const schoolCartWithStudent = { ...schoolCartWithoutStudent, student_id: 7 }
const foodCart = { ...d.sampleCart, uuid: 'food-cart', business_id: 2, business: { ...d.sampleBusiness, id: 2, vertical: 'food' } }
const secondSchoolCart = { ...d.sampleCart, uuid: 'school-cart-2', business_id: 3169, business: { ...d.sampleBusiness, id: 3169, slug: 'los_carrisos', vertical: 'school' }, student_id: null }

const renderMulti = () => renderWithProviders(
  <MultiCheckout navigation={{ navigate: jest.fn() }} onNavigationRedirect={jest.fn()} />
)

describe('MultiCheckout', () => {
  beforeEach(() => {
    mockMulti.openCarts = null
    mockMulti.verticals = {}
    mockMulti.orderCarts = null
    mockMulti.config = { configs: {} }
    mockMulti.session = { user: { id: 1 }, loading: false }
    mockMulti.paymentProps = null
    d.multiCheckoutDefaults.handleGroupPlaceOrder.mockClear()
  })

  it('renders multi-cart checkout summary', () => {
    const { getByText } = renderMulti()
    expect(getByText(/Pizza Place/i)).toBeTruthy()
  })

  it('leaves room below the content for the floating place button', () => {
    const { getByTestId } = renderMulti()
    expect(getByTestId('multi-checkout-content')).toHaveStyle({ marginBottom: 100 })
  })

  it('shows multi-cart loader when checkCarts param is set', () => {
    const { getByTestId } = renderWithProviders(
      <MultiCheckout
        navigation={{ navigate: jest.fn() }}
        route={{ params: { checkCarts: true } }}
      />
    )
    expect(getByTestId('multi-cart-loading-stub')).toBeTruthy()
  })

  it('keeps place order enabled for non-school carts', () => {
    mockMulti.openCarts = [foodCart]
    const { getByText, queryByTestId, getByTestId } = renderMulti()
    expect(getByText('Place Order')).toBeTruthy()
    expect(queryByTestId('student-details-food-cart')).toBeNull()
    fireEvent.press(getByTestId('floating-button'))
    expect(d.multiCheckoutDefaults.handleGroupPlaceOrder).toHaveBeenCalled()
  })

  it('blocks persisted guest checkout when guest permission is disabled', () => {
    mockMulti.openCarts = [foodCart]
    mockMulti.session = { user: { guest_id: 'guest-1' }, loading: false }
    const { getByTestId } = renderMulti()
    fireEvent.press(getByTestId('floating-button'))
    expect(d.multiCheckoutDefaults.handleGroupPlaceOrder).not.toHaveBeenCalled()
  })

  it('rechecks a retained payment callback after permission is revoked', () => {
    mockMulti.openCarts = [foodCart]
    mockMulti.session = { user: { guest_id: 'guest-1' }, loading: false }
    mockMulti.config = {
      configs: {
        guest_checkout_enabled: { value: '1' },
        allowed_order_types_guest_checkout: { value: 'delivery' }
      }
    }
    const { rerender } = renderMulti()
    const retainedPlaceOrder = mockMulti.paymentProps.handlePlaceOrder
    mockMulti.config = { configs: {} }
    rerender(<MultiCheckout navigation={{ navigate: jest.fn() }} onNavigationRedirect={jest.fn()} />)

    retainedPlaceOrder()

    expect(d.multiCheckoutDefaults.handleGroupPlaceOrder).not.toHaveBeenCalled()
  })

  it('blocks place order and explains when a school cart has no student', () => {
    mockMulti.openCarts = [foodCart, schoolCartWithoutStudent]
    const { getByText, getByTestId } = renderMulti()
    expect(getByText('Select a student')).toBeTruthy()
    expect(getByTestId('student-details-school-cart')).toBeTruthy()
    fireEvent.press(getByTestId('floating-button'))
    expect(d.multiCheckoutDefaults.handleGroupPlaceOrder).not.toHaveBeenCalled()
  })

  it('opens the gate once the school cart reports a successful assign', () => {
    mockMulti.openCarts = [schoolCartWithoutStudent]
    const { getByText, getByTestId } = renderMulti()
    expect(getByText('Select a student')).toBeTruthy()
    fireEvent.press(getByTestId('student-details-school-cart'))
    expect(getByText('Place Order')).toBeTruthy()
    fireEvent.press(getByTestId('floating-button'))
    expect(d.multiCheckoutDefaults.handleGroupPlaceOrder).toHaveBeenCalled()
  })

  it('renders one selector per school cart and waits for all of them', () => {
    mockMulti.openCarts = [schoolCartWithStudent, secondSchoolCart]
    const { getByText, getByTestId } = renderMulti()
    expect(getByTestId('student-details-school-cart')).toBeTruthy()
    expect(getByTestId('student-details-school-cart-2')).toBeTruthy()
    expect(getByText('Select a student')).toBeTruthy()
    fireEvent.press(getByTestId('student-details-school-cart-2'))
    expect(getByText('Place Order')).toBeTruthy()
  })

  it('detects the school from the order context when the cart group omits the vertical', () => {
    const groupCart = { ...d.sampleCart, uuid: 'school-cart', business_id: 1, business: { id: 1, name: 'School' }, student_id: null }
    mockMulti.openCarts = [groupCart]
    mockMulti.orderCarts = { 'businessId:1': { ...groupCart, business: { id: 1, slug: 'the-school', vertical: 'school' } } }
    const { getByText } = renderMulti()
    expect(getByText('the-school')).toBeTruthy()
    expect(getByText('Select a student')).toBeTruthy()
  })

  it('detects the school from the business lookup when neither payload carries the vertical', () => {
    const groupCart = { ...d.sampleCart, uuid: 'school-cart', business_id: 3169, business: { id: 3169, slug: 'los_carrisos' }, student_id: null }
    mockMulti.openCarts = [groupCart]
    mockMulti.verticals = { 3169: 'school' }
    const { getByText } = renderMulti()
    expect(getByText('los_carrisos')).toBeTruthy()
    expect(getByText('Select a student')).toBeTruthy()
  })

  it('trusts the order context student when the cart group omits it', () => {
    const groupCart: any = { ...d.sampleCart, uuid: 'school-cart', business_id: 1, business: { id: 1, name: 'School' } }
    delete groupCart.student_id
    mockMulti.openCarts = [groupCart]
    mockMulti.orderCarts = { 'businessId:1': { ...groupCart, business: { id: 1, slug: 'the-school', vertical: 'school' }, student_id: 9 } }
    const { getByText } = renderMulti()
    expect(getByText('Place Order')).toBeTruthy()
  })

  it('refreshes the cart group once the driver tip lands in the order context', () => {
    mockMulti.openCarts = [{ ...foodCart, driver_tip: 0 }]
    mockMulti.orderCarts = { 'businessId:2': { ...foodCart, driver_tip: 5 } }
    d.multiCheckoutDefaults.getMultiCart.mockClear()

    renderMulti()

    expect(d.multiCheckoutDefaults.getMultiCart).toHaveBeenCalledWith()
  })

  it('does not refetch the cart group when the driver tips already match', () => {
    mockMulti.openCarts = [{ ...foodCart, driver_tip: 5 }]
    mockMulti.orderCarts = { 'businessId:2': { ...foodCart, driver_tip: 5 } }
    d.multiCheckoutDefaults.getMultiCart.mockClear()

    renderMulti()

    expect(d.multiCheckoutDefaults.getMultiCart).not.toHaveBeenCalledWith()
  })
})
