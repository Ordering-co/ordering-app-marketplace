import '../../../../../../jest/helpers/registerM3NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { BusinessTypeFilter } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m3DiscoveryComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m3DiscoveryUiMock').getUiMock())

describe('BusinessTypeFilter', () => {
  it('renders loading placeholders', () => {
    const { getAllByTestId } = renderWithProviders(
      <BusinessTypeFilter
        typesState={{ loading: true }}
        handleChangeBusinessType={jest.fn()}
        setBusinessTypes={jest.fn()}
        filters={{ business_types: [] }}
        handleChangeFilters={jest.fn()}
      />
    )
    expect(getAllByTestId('placeholder-line').length).toBeGreaterThan(0)
  })

  it('renders categories and handles selection', () => {
    const handleChangeBusinessType = jest.fn()
    const { getByText } = renderWithProviders(
      <BusinessTypeFilter
        typesState={{
          loading: false,
          types: [
            { id: null, name: 'All', enabled: true },
            { id: 1, name: 'Food', enabled: true }
          ]
        }}
        currentTypeSelected={null}
        handleChangeBusinessType={handleChangeBusinessType}
        setBusinessTypes={jest.fn()}
        filters={{ business_types: [] }}
        handleChangeFilters={jest.fn()}
      />
    )
    fireEvent.press(getByText('Food'))
    expect(handleChangeBusinessType).toHaveBeenCalledWith(1)
  })

  it('renders icons when at least one business type has an image', () => {
    const { getAllByTestId, getByText } = renderWithProviders(
      <BusinessTypeFilter
        typesState={{
          loading: false,
          types: [
            { id: null, name: 'All', enabled: true, image: null },
            { id: 1, name: 'Food', enabled: true, image: 'https://cdn.test/food.png' },
            { id: 2, name: 'Drinks', enabled: true, image: 'https://cdn.test/drinks.png' }
          ]
        }}
        currentTypeSelected={null}
        handleChangeBusinessType={jest.fn()}
        setBusinessTypes={jest.fn()}
        filters={{ business_types: [] }}
        handleChangeFilters={jest.fn()}
      />
    )
    expect(getAllByTestId('category-icon').length).toBe(2)
    expect(getByText('All')).toBeTruthy()
  })

  const buildTypes = (count: number, withImage: boolean) => ([
    { id: null, name: 'All', enabled: true, image: null },
    ...[...Array(count)].map((_, i) => ({
      id: i + 1,
      name: `Type ${i + 1}`,
      enabled: true,
      image: withImage ? `https://cdn.test/${i + 1}.png` : null
    }))
  ])

  it('splits into two rows at 10+ categories with images', () => {
    const { getAllByTestId } = renderWithProviders(
      <BusinessTypeFilter
        typesState={{ loading: false, types: buildTypes(11, true) }}
        currentTypeSelected={null}
        handleChangeBusinessType={jest.fn()}
        setBusinessTypes={jest.fn()}
        filters={{ business_types: [] }}
        handleChangeFilters={jest.fn()}
      />
    )
    expect(getAllByTestId('category-row').length).toBe(2)
    expect(getAllByTestId('category-icon').length).toBe(11)
  })

  it('keeps a single row below 10 categories with images', () => {
    const { getAllByTestId } = renderWithProviders(
      <BusinessTypeFilter
        typesState={{ loading: false, types: buildTypes(5, true) }}
        currentTypeSelected={null}
        handleChangeBusinessType={jest.fn()}
        setBusinessTypes={jest.fn()}
        filters={{ business_types: [] }}
        handleChangeFilters={jest.fn()}
      />
    )
    expect(getAllByTestId('category-row').length).toBe(1)
  })

  it('renders text-only pills when no business type has an image', () => {
    const { queryAllByTestId, getByText } = renderWithProviders(
      <BusinessTypeFilter
        typesState={{
          loading: false,
          types: [
            { id: null, name: 'All', enabled: true, image: null },
            { id: 1, name: 'Food', enabled: true, image: null }
          ]
        }}
        currentTypeSelected={null}
        handleChangeBusinessType={jest.fn()}
        setBusinessTypes={jest.fn()}
        filters={{ business_types: [] }}
        handleChangeFilters={jest.fn()}
      />
    )
    expect(queryAllByTestId('category-icon').length).toBe(0)
    expect(getByText('Food')).toBeTruthy()
  })

  it('translates API All variants (e.g. All :)) via ALL', () => {
    const { getByText, queryByText } = renderWithProviders(
      <BusinessTypeFilter
        typesState={{
          loading: false,
          types: [
            { id: 99, name: 'All :)', enabled: true, image: null },
            { id: 1, name: 'Food', enabled: true, image: null }
          ]
        }}
        currentTypeSelected={99}
        handleChangeBusinessType={jest.fn()}
        setBusinessTypes={jest.fn()}
        filters={{ business_types: [] }}
        handleChangeFilters={jest.fn()}
      />
    )
    expect(getByText('All')).toBeTruthy()
    expect(queryByText('All :)')).toBeNull()
  })

  it('resolves synthetic All via ALL (ignores polluted BUSINESS_TYPE_ALL)', () => {
    const { getByText, queryByText } = renderWithProviders(
      <BusinessTypeFilter
        typesState={{
          loading: false,
          types: [
            { id: null, name: 'Todos', enabled: true, image: null },
            { id: 1, name: 'Food', enabled: true, image: null }
          ]
        }}
        currentTypeSelected={null}
        handleChangeBusinessType={jest.fn()}
        setBusinessTypes={jest.fn()}
        filters={{ business_types: [] }}
        handleChangeFilters={jest.fn()}
      />
    )
    // Mock t returns fallback; name fallback is Todos when dictionary miss
    expect(getByText('Todos')).toBeTruthy()
    expect(queryByText('All :)')).toBeNull()
  })
})
