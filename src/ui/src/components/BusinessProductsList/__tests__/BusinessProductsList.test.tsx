import '../../../../../../jest/helpers/registerM4NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { BusinessProductsList } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m4MenuComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m4MenuUiMock').getUiMock())

jest.mock('../FeaturedProducts', () => {
  const { View, Text } = require('react-native')
  return {
    FeaturedProducts: (props) => (
      <View testID="featured-products-stub">
        <Text>{props.categoryState?.products?.[0]?.name}</Text>
      </View>
    )
  }
})

describe('BusinessProductsList', () => {
  it('renders featured products when category is All', () => {
    const { getByTestId, getAllByText } = renderWithProviders(
      <BusinessProductsList
        businessId={1}
        category={{ id: null, name: 'All' }}
        featured
        previouslyProducts={[]}
      />
    )
    expect(getByTestId('featured-products-stub')).toBeTruthy()
    expect(getAllByText('Cheese Slice').length).toBeGreaterThan(0)
  })

  it('renders category products and subcategories', () => {
    const onProductClick = jest.fn()
    const category = {
      id: 10,
      name: 'Pizzas',
      description: 'Fresh pizzas',
      image: 'https://cdn.test/cat.jpg',
      subcategories: [{ id: 11, name: 'Classic', parent_category_id: 10 }]
    }
    const { getByText, getAllByTestId } = renderWithProviders(
      <BusinessProductsList
        businessId={1}
        category={category}
        featured={false}
        previouslyProducts={[{ id: 200, name: 'Past Slice', price: 4 }]}
        onProductClick={onProductClick}
        subcategoriesSelected={[]}
        setSubcategoriesSelected={jest.fn()}
      />
    )
    expect(getByText('Classic')).toBeTruthy()
    expect(getByText('All')).toBeTruthy()
    expect(getAllByTestId('order-it-again-stub').length).toBeGreaterThan(0)
    fireEvent.press(getAllByTestId('single-product-card')[0])
    expect(onProductClick).toHaveBeenCalled()
  })

  it('renders empty search not found state', () => {
    const { getByText } = renderWithProviders(
      <BusinessProductsList
        businessId={1}
        category={{ id: null, name: 'All' }}
        featured={false}
        searchValue="zzz"
        categoryState={{ loading: false, products: [], error: null, pagination: {} }}
        errorQuantityProducts={false}
        isBusinessLoading={false}
      />
    )
    expect(getByText(/No products found/i)).toBeTruthy()
  })

  it('renders loading placeholders', () => {
    const { getAllByTestId, toJSON } = renderWithProviders(
      <BusinessProductsList
        businessId={1}
        category={{ id: null, name: 'All' }}
        featured={false}
        categoryState={{
          loading: true,
          products: [],
          error: null,
          pagination: { nextPageItems: 3 }
        }}
        isBusinessLoading={false}
      />
    )
    expect(toJSON()).toBeTruthy()
    expect(getAllByTestId('placeholder').length).toBeGreaterThan(0)
  })
})
