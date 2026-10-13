import '../../../../../../../jest/helpers/registerM9NativeMocks'

import React from 'react'
import { act, fireEvent } from '@testing-library/react-native'

import { useApi, useOrder } from '@components'
import { PurchaseGiftCard } from '..'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../../jest/helpers/m9IntegrationsComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../../jest/helpers/m9IntegrationsUiMock').getUiMock())

const products = [
  { id: 80, name: 'Gift 80', price: 80 },
  { id: 50, name: 'Gift 50', price: 50 }
]

describe('PurchaseGiftCard', () => {
  const clearCart = jest.fn()
  const addProduct = jest.fn()
  const goToCheckout = jest.fn()
  const getCarts = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    clearCart.mockResolvedValue({ error: false })
    addProduct.mockResolvedValue({ error: false, result: { uuid: 'gift-new' } })
    getCarts.mockResolvedValue({ content: { error: false, result: [] } })
    ;(useOrder as jest.Mock).mockReturnValue([
      { carts: {} },
      { clearCart, addProduct }
    ])
    ;(useApi as jest.Mock).mockReturnValue([{
      setAccessToken: () => ({
        carts: () => ({ get: getCarts })
      })
    }])
  })

  it('renders gift card products (smoke)', () => {
    const d = require('../../../../../../../jest/helpers/m9IntegrationsDefaults')
    const { getByText } = renderWithProviders(
      <PurchaseGiftCard handleCustomGoToCheckout={jest.fn()} onClose={jest.fn()} />
    )
    expect(getByText('$25')).toBeTruthy()
    expect(getByText('Purchase')).toBeTruthy()
    expect(getByText(d.sampleGiftProduct.name)).toBeTruthy()
  })

  it('reuses a leftover cart when the same gift card is purchased', async () => {
    ;(useOrder as jest.Mock).mockReturnValue([
      {
        carts: {
          'businessId:null': { uuid: 'gift-1', business_id: null, products: [{ id: 80 }] }
        }
      },
      { clearCart, addProduct }
    ])
    const { getAllByText } = renderWithProviders(
      <PurchaseGiftCard
        handleCustomGoToCheckout={goToCheckout}
        productsListState={{ loading: false, products }}
      />
    )
    await act(async () => {
      fireEvent.press(getAllByText('Purchase')[0])
    })
    expect(clearCart).not.toHaveBeenCalled()
    expect(addProduct).not.toHaveBeenCalled()
    expect(goToCheckout).toHaveBeenCalledWith('gift-1')
  })

  it('clears a leftover cart before purchasing a different gift card', async () => {
    ;(useOrder as jest.Mock).mockReturnValue([
      {
        carts: {
          'businessId:null': { uuid: 'gift-1', business_id: null, products: [{ id: 80 }] }
        }
      },
      { clearCart, addProduct }
    ])
    const { getAllByText } = renderWithProviders(
      <PurchaseGiftCard
        handleCustomGoToCheckout={goToCheckout}
        productsListState={{ loading: false, products }}
      />
    )
    await act(async () => {
      fireEvent.press(getAllByText('Purchase')[1])
    })
    expect(clearCart).toHaveBeenCalledWith('gift-1', { disableLoading: true })
    expect(addProduct).toHaveBeenCalledWith({ id: 50, quantity: 1 }, null, null, true)
    expect(goToCheckout).toHaveBeenCalledWith('gift-new')
  })

  it('shows a spinner only on the selected purchase button', async () => {
    let resolveAdd
    addProduct.mockReturnValue(new Promise((resolve) => {
      resolveAdd = resolve
    }))
    const { getByTestId, getByText } = renderWithProviders(
      <PurchaseGiftCard
        handleCustomGoToCheckout={goToCheckout}
        productsListState={{ loading: false, products }}
      />
    )
    fireEvent.press(getByTestId('purchase-gift-80'))
    expect(getByText('Loading')).toBeTruthy()
    expect(getByText('Purchase')).toBeTruthy()
    expect(getByTestId('purchase-gift-50').props.disabled).toBeFalsy()
    await act(async () => {
      resolveAdd({ error: false, result: { uuid: 'gift-new' } })
    })
  })

  it('clears a leftover gift cart that exists only on the API after restart', async () => {
    getCarts.mockResolvedValue({
      content: {
        error: false,
        result: [{ uuid: 'gift-1', business_id: null, products: [{ id: 80 }] }]
      }
    })
    const { getAllByText } = renderWithProviders(
      <PurchaseGiftCard
        handleCustomGoToCheckout={goToCheckout}
        productsListState={{ loading: false, products }}
      />
    )
    await act(async () => {
      fireEvent.press(getAllByText('Purchase')[1])
    })
    expect(clearCart).toHaveBeenCalledWith('gift-1', { disableLoading: true })
    expect(addProduct).toHaveBeenCalledWith({ id: 50, quantity: 1 }, null, null, true)
    expect(goToCheckout).toHaveBeenCalledWith('gift-new')
  })
})
