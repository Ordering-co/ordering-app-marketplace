import '../../../../../../jest/helpers/registerM9NativeMocks'

jest.mock('../../shared', () => require('../../../../../../jest/helpers/m9IntegrationsSharedMock'))

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { AddressDetails } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m9IntegrationsComponentsMock').getMock())

describe('AddressDetails', () => {
  it('renders delivery address and map image', () => {
    const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')
    const { getByText, getByTestId } = renderWithProviders(
      <AddressDetails {...d.addressDetailsDefaults} />
    )
    expect(getByText('Delivery address')).toBeTruthy()
    expect(getByText('123 Main St')).toBeTruthy()
    expect(getByTestId('fast-image')).toBeTruthy()
  })

  it('shows edit control for delivery orders', () => {
    const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')
    const { getByTestId } = renderWithProviders(
      <AddressDetails {...d.addressDetailsDefaults} />
    )
    expect(getByTestId('mci-icon')).toBeTruthy()
  })

  it('opens the address list from the pickup card', () => {
    const components = require('@components')
    const previous = components.useOrder.getMockImplementation()
    components.useOrder.mockReturnValue([{
      loading: false,
      options: {
        type: 2,
        address: { address: 'New York, NY, USA' }
      },
      carts: {}
    }, { setStateValues: jest.fn() }])
    const navigate = jest.fn()
    const { getByText } = renderWithProviders(
      <AddressDetails
        layout="maweja"
        navigation={{ navigate }}
        uuid="cart-1"
        isCartPending={false}
        addressToShow="New York, NY, USA"
      />
    )
    fireEvent.press(getByText('New York, NY, USA'))
    expect(navigate).toHaveBeenCalledWith('AddressList', { isFromCheckout: true, cartUuid: 'cart-1' })
    components.useOrder.mockImplementation(previous)
  })

  it('does not render businessCellphone under the delivery address', () => {
    const d = require('../../../../../../jest/helpers/m9IntegrationsDefaults')
    const { queryByText, getByText } = renderWithProviders(
      <AddressDetails {...d.addressDetailsDefaults} />
    )
    expect(getByText('123 Main St')).toBeTruthy()
    expect(queryByText('555-0100')).toBeNull()
  })
})
