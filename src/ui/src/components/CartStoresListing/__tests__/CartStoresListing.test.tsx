import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { CartStoresListing } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m4MenuComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m4MenuUiMock').getUiMock())

describe('CartStoresListing', () => {
  it('renders available stores', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <CartStoresListing cartuuid="cart-1" />
    )
    expect(getByTestId('business-cart-stub')).toBeTruthy()
    expect(getByText('Pizza Place')).toBeTruthy()
  })

  it('invokes store change handler', () => {
    const defaults = require('../../../../../../jest/helpers/m4MenuDefaults').cartStoresListingDefaults
    defaults.handleCartStoreChange.mockClear()
    const { getByTestId } = renderWithProviders(
      <CartStoresListing cartuuid="cart-1" />
    )
    fireEvent.press(getByTestId('business-cart-stub'))
    expect(defaults.handleCartStoreChange).toHaveBeenCalled()
  })
})
