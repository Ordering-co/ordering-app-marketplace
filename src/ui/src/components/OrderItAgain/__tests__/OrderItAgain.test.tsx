import '../../../../../../jest/helpers/registerM6NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { OrderItAgain } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m6OrdersComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m6OrdersUiMock').getUiMock())

describe('OrderItAgain', () => {
  it('renders previously ordered products', () => {
    const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
    const { getByText, getByTestId } = renderWithProviders(
      <OrderItAgain {...d.orderItAgainDefaults} />
    )
    expect(getByText('Order it again')).toBeTruthy()
    expect(getByText('Cheese Slice')).toBeTruthy()
    expect(getByTestId('single-product-card-stub')).toBeTruthy()
  })

  it('calls onProductClick when product is pressed', () => {
    const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
    const onProductClick = jest.fn()
    const { getByTestId } = renderWithProviders(
      <OrderItAgain {...d.orderItAgainDefaults} onProductClick={onProductClick} />
    )
    fireEvent.press(getByTestId('single-product-card-stub'))
    expect(onProductClick).toHaveBeenCalled()
  })

  it('returns null when product list is empty', () => {
    const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
    const { queryByText } = renderWithProviders(
      <OrderItAgain {...d.orderItAgainDefaults} productList={[]} />
    )
    expect(queryByText('Order it again')).toBeNull()
  })
})
