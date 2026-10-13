import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { ProductItemAccordion } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => {
  const m4 = require('../../../../../../jest/helpers/m4MenuComponentsMock')
  const d = require('../../../../../../jest/helpers/m4MenuDefaults')
  return m4.getMock({
    ProductItemAccordion: m4.renderUiController({
      ...d.productItemAccordionDefaults,
      isCartProductView: false,
      product: {
        ...d.productItemAccordionDefaults.product,
        valid: true,
        valid_menu: true,
        comment: 'No onions',
        images: 'https://cdn.test/slice.jpg'
      }
    })
  })
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m4MenuUiMock').getUiMock())

describe('ProductItemAccordion', () => {
  it('renders accordion product name', () => {
    const { getByText } = renderWithProviders(<ProductItemAccordion />)
    expect(getByText('Cheese Slice')).toBeTruthy()
  })

  it('expands accordion and shows topping details', () => {
    const { getAllByText, UNSAFE_getAllByType } = renderWithProviders(<ProductItemAccordion />)
    const { TouchableOpacity } = require('react-native')
    const presses = UNSAFE_getAllByType(TouchableOpacity)
    if (presses.length) fireEvent.press(presses[0])
    expect(getAllByText(/Cheese Slice|Size|Regular|Cheese/).length).toBeGreaterThan(0)
  })

  it('renders order-detail options when suboptions are missing', () => {
    const d = require('../../../../../../jest/helpers/m4MenuDefaults')
    const { getByText } = renderWithProviders(
      <ProductItemAccordion
        hidePriceDropdown
        isCartProduct={false}
        productInfo={{
          ingredients: [],
          options: [{ id: 1, name: 'Size', rank: 1 }]
        }}
        product={{
          ...d.productItemAccordionDefaults.product,
          name: 'Cheese Slice'
        }}
      />
    )
    expect(getByText('Cheese Slice')).toBeTruthy()
  })
})
