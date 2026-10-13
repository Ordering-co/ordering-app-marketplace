import '../../../../../../jest/helpers/registerM3NativeMocks'

import React from 'react'
import { act, fireEvent } from '@testing-library/react-native'
import { useOrder } from '@components'

import { FavoriteList } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m3DiscoveryComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m3DiscoveryUiMock').getUiMock())

describe('FavoriteList', () => {
  it('renders favorite businesses', () => {
    const { getByTestId } = renderWithProviders(
      <FavoriteList navigation={{ navigate: jest.fn() }} isBusiness />
    )
    expect(getByTestId('business-controller-stub')).toBeTruthy()
  })

  it('loads more favorites on pagination', () => {
    const getFavoriteList = jest.fn()
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').favoriteListDefaults
    const { getByText } = renderWithProviders(
      <FavoriteList
        {...defaults}
        pagination={{ currentPage: 1, totalPages: 3 }}
        getFavoriteList={getFavoriteList}
      />
    )
    fireEvent.press(getByText('Load more items'))
    expect(getFavoriteList).toHaveBeenCalledWith(2)
  })

  it('shows loading skeletons', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').favoriteListDefaults
    const { getAllByTestId } = renderWithProviders(
      <FavoriteList {...defaults} favoriteList={{ loading: true, favorites: [] }} isBusiness />
    )
    expect(getAllByTestId('placeholder-line').length).toBeGreaterThan(0)
  })

  it('shows empty state when there are no favorites', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').favoriteListDefaults
    const { getByText } = renderWithProviders(
      <FavoriteList {...defaults} favoriteList={{ loading: false, favorites: [] }} isBusiness />
    )
    expect(getByText('No favorites to show at this time.')).toBeTruthy()
  })

  it('renders product favorites and navigates on click', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').favoriteListProductDefaults
    const onNavigationRedirect = jest.fn()
    const { getByTestId } = renderWithProviders(
      <FavoriteList {...defaults} onNavigationRedirect={onNavigationRedirect} />
    )
    fireEvent.press(getByTestId('single-product-card'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('ProductDetails', expect.objectContaining({
      productId: 100
    }))
  })

  it('renders order favorites with reorder action', () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').favoriteListOrderDefaults
    const handleReorder = jest.fn()
    const { getByTestId } = renderWithProviders(
      <FavoriteList {...defaults} handleReorder={handleReorder} />
    )
    fireEvent.press(getByTestId('reorder-button'))
    expect(handleReorder).toHaveBeenCalled()
  })

  it('redirects to checkout when reorder succeeds with matching cart', async () => {
    const defaults = require('../../../../../../jest/helpers/m3DiscoveryDefaults').favoriteListOrderDefaults
    const onNavigationRedirect = jest.fn()
    ;(useOrder as jest.Mock).mockReturnValue([{
      carts: {
        'businessId:1': {
          products: [{ valid: true }]
        }
      }
    }, {}])
    const { rerender } = renderWithProviders(
      <FavoriteList
        {...defaults}
        onNavigationRedirect={onNavigationRedirect}
        reorderState={{ loading: false, error: null, result: null }}
      />
    )
    rerender(
      <FavoriteList
        {...defaults}
        onNavigationRedirect={onNavigationRedirect}
        reorderState={{
          loading: false,
          error: null,
          result: { business_id: 1, uuid: 'cart-uuid', orderId: 50 }
        }}
      />
    )
    await act(async () => {
      await Promise.resolve()
    })
    expect(onNavigationRedirect).toHaveBeenCalledWith('CheckoutPage', { cartUuid: 'cart-uuid' })
  })
})
