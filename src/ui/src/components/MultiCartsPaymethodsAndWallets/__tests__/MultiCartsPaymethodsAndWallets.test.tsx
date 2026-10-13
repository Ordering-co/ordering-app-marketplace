import '../../../../../../jest/helpers/registerM6NativeMocks'

import React from 'react'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { MultiCartsPaymethodsAndWallets } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => {
  const m6 = require('../../../../../../jest/helpers/m6OrdersComponentsMock')
  const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
  return m6.getMock({
    MultiCartsPaymethodsAndWallets: m6.renderUiController(d.multiCartsPaymethodsDefaults)
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m6OrdersUiMock').getUiMock())

describe('MultiCartsPaymethodsAndWallets', () => {
  it('renders payment methods heading and cash option', () => {
    const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
    const { getByText, getAllByText } = renderWithProviders(
      <MultiCartsPaymethodsAndWallets {...d.multiCartsPaymethodsDefaults} />
    )
    expect(getByText('Payment Methods')).toBeTruthy()
    expect(getAllByText(/CASH/i).length).toBeGreaterThan(0)
  })

  it('selects paymethod on press', () => {
    const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
    const handleSelectPaymethod = jest.fn()
    const { getAllByText } = renderWithProviders(
      <MultiCartsPaymethodsAndWallets {...d.multiCartsPaymethodsDefaults} handleSelectPaymethod={handleSelectPaymethod} />
    )
    fireEvent.press(getAllByText(/CASH/i)[0])
    expect(handleSelectPaymethod).toHaveBeenCalled()
  })

  it('does not crash or auto-place when Apple Pay paymethod_data is malformed', () => {
    const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
    const handlePlaceOrder = jest.fn()
    const { getByText } = renderWithProviders(
      <MultiCartsPaymethodsAndWallets
        {...d.multiCartsPaymethodsDefaults}
        handlePlaceOrder={handlePlaceOrder}
        paymethodSelected={{
          id: 9,
          gateway: 'global_apple_pay',
          paymethod_data: '{not-json'
        }}
      />
    )
    expect(getByText('Payment Methods')).toBeTruthy()
    expect(handlePlaceOrder).not.toHaveBeenCalled()
  })

  it('auto-places Apple Pay only when source_id parses', async () => {
    const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
    const handlePlaceOrder = jest.fn()
    renderWithProviders(
      <MultiCartsPaymethodsAndWallets
        {...d.multiCartsPaymethodsDefaults}
        handlePlaceOrder={handlePlaceOrder}
        paymethodSelected={{
          id: 9,
          gateway: 'global_apple_pay',
          paymethod_data: '{"source_id":"pm_123"}'
        }}
      />
    )
    await waitFor(() => {
      expect(handlePlaceOrder).toHaveBeenCalled()
    })
  })
})
