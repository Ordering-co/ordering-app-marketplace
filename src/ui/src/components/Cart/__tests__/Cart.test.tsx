import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import { useOrder, useFreeDeliveryProgress } from '@components'
import settings from '@/config'

import { Cart, CartUI } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => {
  const m4 = require('../../../../../../jest/helpers/m4MenuComponentsMock')
  const d = require('../../../../../../jest/helpers/m4MenuDefaults')
  return m4.getMock({
    Cart: m4.renderUiController({
      ...d.cartDefaults,
      cart: {
        ...d.sampleCart,
        business: { ...d.sampleBusiness, vertical: 'school', tax_type: 1 },
        discount: 1,
        discount_type: 1,
        discount_rate: 10,
        offers: [
          { id: 1, name: 'Promo', target: 1, rate_type: 1, rate: 10, summary: { discount: 1 } },
          { id: 2, name: 'Delivery offer', target: 3, rate_type: 2, rate: 1, summary: { discount: 0.5 } }
        ],
        taxes: [{ type: 1, target: 'product', summary: { tax: 0.5, tax_after_discount: 0.4 } }],
        fees: [{ name: 'Service', summary: { fixed: 1, percentage_after_discount: 0 } }],
        place: { name: 'Spot A' },
        valid_products: true,
        valid_address: true,
        valid_maximum: true,
        minimum: 0,
        maximum: 1000,
        subtotal_with_discount: 4
      },
      cateringTypes: [7],
      preorderMaximumDays: 3
    })
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m4MenuUiMock').getUiMock())

const baseCart = () => {
  const d = require('../../../../../../jest/helpers/m4MenuDefaults')
  return {
    ...d.cartDefaults,
    onNavigationRedirect: jest.fn(),
    clearCart: jest.fn().mockResolvedValue(),
    removeProduct: jest.fn().mockResolvedValue(),
    handleRemoveOfferClick: jest.fn(),
    setIsCartsLoading: jest.fn(),
    callbackAfterUpdateCart: jest.fn(),
    cateringTypes: []
  }
}

describe('Cart', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useFreeDeliveryProgress as jest.Mock).mockReturnValue({ status: 'hidden' })
  })

  it('renders full progress after product rows and before the bill on direct cart mount', () => {
    const props = {
      ...baseCart(),
      cart: {
        ...baseCart().cart,
        business: { ...baseCart().cart.business, id: 1 },
        valid_products: true,
        products: [baseCart().cart.products[0]]
      }
    }
    ;(useFreeDeliveryProgress as jest.Mock).mockReturnValue({
      status: 'progress', remainingAmount: 3.5, progressPercent: 80
    })

    const { getByTestId, toJSON } = renderWithProviders(<CartUI {...props} />)
    const serialized = JSON.stringify(toJSON())

    expect(getByTestId('free-delivery-progress')).toHaveProp('variant', 'full')
    expect(serialized.indexOf('product-item-accordion-stub')).toBeLessThan(serialized.indexOf('free-delivery-progress'))
    expect(serialized.indexOf('free-delivery-progress')).toBeLessThan(serialized.indexOf('Subtotal'))
    expect(useFreeDeliveryProgress).toHaveBeenLastCalledWith({
      business: props.cart.business,
      cart: props.cart,
      enabled: true,
      franchiseId: null
    })
  })
  it('scopes the cart offer lookup to the configured franchise', () => {
    const previousFranchiseSlug = settings.franchiseSlug
    settings.franchiseSlug = 'brand-91'
    try {
      renderWithProviders(<CartUI {...baseCart()} />)
      expect(useFreeDeliveryProgress).toHaveBeenLastCalledWith(
        expect.objectContaining({ franchiseId: 'brand-91' })
      )
    } finally {
      settings.franchiseSlug = previousFranchiseSlug
    }
  })
  it('does not look up offers for a collapsed cart', () => {
    const props = { ...baseCart(), isActive: false }
    renderWithProviders(<CartUI {...props} />)

    expect(useFreeDeliveryProgress).toHaveBeenLastCalledWith(
      expect.objectContaining({ enabled: false })
    )
  })
  it('renders cart business accordion products and bill', () => {
    const { getByText, getByTestId, getAllByTestId } = renderWithProviders(<Cart />)
    expect(getByTestId('business-item-accordion-stub')).toBeTruthy()
    expect(getByText('Pizza Place')).toBeTruthy()
    expect(getAllByTestId('product-item-accordion-stub').length).toBeGreaterThan(0)
    expect(getByText('Subtotal')).toBeTruthy()
  })

  it('renders coupon control and school student alert', () => {
    const { getByTestId } = renderWithProviders(<Cart />)
    expect(getByTestId('coupon-control-stub')).toBeTruthy()
    expect(getByTestId('cart-student-alert-stub')).toBeTruthy()
  })

  it('opens tax modal and place spot from UI', () => {
    ;(useOrder as jest.Mock).mockReturnValue([{
      loading: false,
      options: { type: 4, moment: null },
      carts: { 'businessId:1': require('../../../../../../jest/helpers/m4MenuDefaults').sampleCart }
    }, {}])

    const props = {
      ...baseCart(),
      cart: {
        ...baseCart().cart,
        business: { ...baseCart().cart.business, vertical: 'food', tax_type: 1 },
        discount: 2,
        discount_type: 1,
        discount_rate: 5,
        offers: [
          { id: 9, name: 'Percent offer', target: 1, rate_type: 1, rate: 5, summary: { discount: 1 } }
        ],
        taxes: [{ type: 1, target: 'product', summary: { tax: 0.5 } }],
        valid_products: true,
        valid_address: true,
        valid_maximum: true,
        place: { name: 'Curbside 1' },
        minimum: 0
      }
    }

    const { getByText, getByTestId } = renderWithProviders(<CartUI {...props} />)
    expect(getByText(/Spot/i)).toBeTruthy()
    fireEvent.press(getByText('Edit'))
    expect(getByTestId('place-spot-stub')).toBeTruthy()
  })

  it('handles checkout and invalid address states', () => {
    const onNavigationRedirect = jest.fn()
    const props = {
      ...baseCart(),
      onNavigationRedirect,
      isMultiCheckout: false,
      cart: {
        ...baseCart().cart,
        business_id: null,
        business: { ...baseCart().cart.business, id: null },
        valid_products: true,
        valid_address: false,
        valid_maximum: true,
        status: 1,
        minimum: 0,
        products: [baseCart().cart.products[0]]
      }
    }
    const { getByText } = renderWithProviders(<CartUI {...props} />)
    expect(getByText(/Selected address is invalid/i)).toBeTruthy()
    expect(getByText('Out of Coverage')).toBeTruthy()
  })

  it('shows invalid products warning', () => {
    const props = {
      ...baseCart(),
      cart: {
        ...baseCart().cart,
        valid_products: false,
        products: [baseCart().cart.products[0]]
      }
    }
    const { getByText } = renderWithProviders(<CartUI {...props} />)
    expect(getByText(/remove from your cart the products/i)).toBeTruthy()
  })

  it('clears a gift cart when deleting its product', async () => {
    const props = {
      ...baseCart(),
      cart: {
        ...baseCart().cart,
        business_id: null,
        uuid: 'gift-1',
        products: [baseCart().cart.products[0]]
      }
    }
    const { getByTestId } = renderWithProviders(<CartUI {...props} />)
    await fireEvent.press(getByTestId('product-delete'))
    expect(props.clearCart).toHaveBeenCalledWith('gift-1')
    expect(props.removeProduct).not.toHaveBeenCalled()
  })

  it('opens upselling when checkout clicked with business cart', () => {
    const props = {
      ...baseCart(),
      cart: {
        ...baseCart().cart,
        business_id: 1,
        valid_products: true,
        valid_address: true,
        valid_maximum: true,
        minimum: 0,
        products: [baseCart().cart.products[0]]
      }
    }
    const { getByText, getByTestId } = renderWithProviders(<CartUI {...props} />)
    fireEvent.press(getByText('Checkout'))
    expect(getByTestId('upselling-products-stub')).toBeTruthy()
  })
})
