import '../../../../../../jest/helpers/registerM3NativeMocks'

import React from 'react'
import { act, fireEvent } from '@testing-library/react-native'
import { useToast } from '@components'

import { BusinessListingSearch, BusinessListingSearchUI } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.spyOn(require('react-native'), 'FlatList').mockImplementation(({ ListHeaderComponent, data, renderItem, onScroll, onEndReached }: any) => {
  const { View, ScrollView } = require('react-native')
  const Header = ListHeaderComponent
  return (
    <ScrollView testID="flat-list" onScroll={onScroll} onEndReached={onEndReached}>
      {Header ? (typeof Header === 'function' ? <Header /> : Header) : null}
      {data?.map((item: any, index: number) => (
        <View key={`item-${index}`}>{renderItem?.({ item, index })}</View>
      ))}
    </ScrollView>
  )
})

jest.mock('../BusinessSearchHeader', () => {
  const { View } = require('react-native')
  return {
    BusinessSearchHeader: () => <View testID="business-search-header" />
  }
})

jest.mock('../../BusinessesListing/Layout/Original/HeaderContent', () => {
  const { View, Text } = require('react-native')
  return {
    HeaderContent: ({ title }: any) => (
      <View testID="header-content">
        <Text>{title}</Text>
      </View>
    )
  }
})

jest.mock('@components', () => require('../../../../../../jest/helpers/m3DiscoveryComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m3DiscoveryUiMock').getUiMock())

describe('BusinessListingSearch', () => {
  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('renders wired search listing shell', () => {
    const { getByTestId, getByText } = renderWithProviders(
      <BusinessListingSearch navigation={{ navigate: jest.fn() }} />
    )
    expect(getByTestId('header-content')).toBeTruthy()
    expect(getByText('Search')).toBeTruthy()
    expect(getByTestId('flat-list')).toBeTruthy()
  })

  it('renders business cards and navigates on store press', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').businessListingSearchDefaults
    const onBusinessClick = jest.fn()
    const { getByText } = renderWithProviders(
      <BusinessListingSearchUI {...defaults} onBusinessClick={onBusinessClick} termValue="" />
    )
    fireEvent.press(getByText('Pizza Place'))
    expect(onBusinessClick).toHaveBeenCalled()
  })

  it('shows closed label for closed businesses', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults')
    const business = { ...defaults.sampleBusiness, open: false }
    const { getByText } = renderWithProviders(
      <BusinessListingSearchUI
        {...defaults.businessListingSearchDefaults}
        termValue=""
        businessesSearchList={{ loading: false, businesses: [business], error: null }}
      />
    )
    expect(getByText('Closed')).toBeTruthy()
  })

  it('navigates to product details for valid product clicks', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').businessListingSearchDefaults
    const navigation = { navigate: jest.fn() }
    const { getByTestId } = renderWithProviders(
      <BusinessListingSearchUI {...defaults} navigation={navigation} termValue="piz" />
    )
    fireEvent.press(getByTestId('single-product-card'))
    expect(navigation.navigate).toHaveBeenCalledWith('ProductDetails', expect.objectContaining({
      productId: 100,
      businessId: 1
    }))
  })

  it('shows toast when product navigation data is incomplete', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults')
    const incompleteBusiness = {
      ...defaults.sampleBusiness,
      slug: null,
      categories: [{ id: 10, products: [{ id: 100, name: 'Slice' }] }]
    }
    const showToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue([, { showToast }])
    const { getByTestId } = renderWithProviders(
      <BusinessListingSearchUI
        {...defaults.businessListingSearchDefaults}
        termValue="piz"
        businessesSearchList={{ loading: false, businesses: [incompleteBusiness], error: null }}
      />
    )
    fireEvent.press(getByTestId('single-product-card'))
    expect(showToast).toHaveBeenCalled()
  })

  it('loads more results when the end is reached', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').businessListingSearchDefaults
    const handleSearchbusinessAndProducts = jest.fn()
    const { getByTestId } = renderWithProviders(
      <BusinessListingSearchUI
        {...defaults}
        termValue=""
        handleSearchbusinessAndProducts={handleSearchbusinessAndProducts}
        paginationProps={{ currentPage: 1, totalPages: 3 }}
      />
    )
    fireEvent(getByTestId('flat-list'), 'endReached')
    expect(handleSearchbusinessAndProducts).toHaveBeenCalled()
  })

  it('clears search term when shouldClearSearchTerm is set', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').businessListingSearchDefaults
    const handleChangeTermValue = jest.fn()
    const setShouldClearSearchTerm = jest.fn()
    renderWithProviders(
      <BusinessListingSearchUI
        {...defaults}
        termValue="pizza"
        handleChangeTermValue={handleChangeTermValue}
        shouldClearSearchTerm
        setShouldClearSearchTerm={setShouldClearSearchTerm}
      />
    )
    expect(handleChangeTermValue).toHaveBeenCalledWith('')
    expect(setShouldClearSearchTerm).toHaveBeenCalledWith(false)
  })

  it('shows businesses without categories as compact cards when search term is long enough', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults')
    const withCategories = defaults.sampleBusiness
    const withoutCategories = { ...defaults.sampleBusiness, id: 2, name: 'No Menu', categories: [] }
    const { queryByText } = renderWithProviders(
      <BusinessListingSearchUI
        {...defaults.businessListingSearchDefaults}
        termValue="pizza"
        businessesSearchList={{
          loading: false,
          businesses: [withCategories, withoutCategories],
          error: null
        }}
      />
    )
    expect(queryByText('Pizza Place')).toBeTruthy()
    expect(queryByText('No Menu')).toBeTruthy()
  })
})
