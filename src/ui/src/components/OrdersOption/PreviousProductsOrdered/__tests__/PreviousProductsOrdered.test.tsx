import '../../../../../../../jest/helpers/registerM6NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { PreviousProductsOrdered } from '..'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'

jest.mock('../../../SingleProductCard', () => {
  const { TouchableOpacity, Text } = require('react-native')
  return {
    SingleProductCard: (props: any) => (
      <TouchableOpacity testID="single-product-card-stub" onPress={() => props.onProductClick?.()}>
        <Text>{props.product?.name}</Text>
      </TouchableOpacity>
    )
  }
})

jest.mock('@components', () => require('../../../../../../../jest/helpers/m6OrdersComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../../jest/helpers/m6OrdersUiMock').getUiMock())

describe('PreviousProductsOrdered', () => {
  it('renders available products', () => {
    const d = require('../../../../../../../jest/helpers/m6OrdersDefaults')
    const { getByText, getByTestId } = renderWithProviders(
      <PreviousProductsOrdered {...d.previousProductsOrderedDefaults} />
    )
    expect(getByText('Cheese Slice')).toBeTruthy()
    expect(getByTestId('single-product-card-stub')).toBeTruthy()
  })

  it('calls onProductClick when product pressed', () => {
    const d = require('../../../../../../../jest/helpers/m6OrdersDefaults')
    const onProductClick = jest.fn()
    const { getByTestId } = renderWithProviders(
      <PreviousProductsOrdered {...d.previousProductsOrderedDefaults} onProductClick={onProductClick} />
    )
    fireEvent.press(getByTestId('single-product-card-stub'))
    expect(onProductClick).toHaveBeenCalled()
  })
})
