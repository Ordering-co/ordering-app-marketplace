import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import { Platform } from 'react-native'
import { StackActions } from '@react-navigation/native'

import { useApi, useBusiness } from '@components'
import { renderPage } from '../../../jest/helpers/renderPage'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native')
  return {
    ...actual,
    StackActions: {
      replace: jest.fn((name: string, params: unknown) => ({
        type: 'REPLACE',
        payload: { name, params }
      }))
    }
  }
})


import BusinessListingSearch from '../BusinessListingSearch'


beforeEach(() => {
    jest.clearAllMocks()
    ;(useBusiness as jest.Mock).mockReturnValue([{ business: { id: 42 } }, {}])
    ;(useApi as jest.Mock).mockReturnValue([{ ordering: 'mock-ordering' }, {}])
    Platform.OS = 'ios'
  })

describe('BusinessListingSearch', () => {
  it('renders search with route defaults and navigates', () => {
        const setShouldClearSearchTerm = jest.fn()
        const { getByTestId, navigation } = renderPage(BusinessListingSearch, {
          route: {
            params: {
              businessTypes: ['food'],
              defaultTerm: 'burger',
              store: 'search-store'
            }
          },
          pageProps: {
            shouldClearSearchTerm: true,
            setShouldClearSearchTerm
          }
        })
        expect(getByTestId('business-listing-search')).toBeTruthy()
        fireEvent.press(getByTestId('business-listing-search-business'))
        expect(navigation.navigate).toHaveBeenCalledWith('Business', {
          store: 'search-store',
          header: 'Header',
          logo: 'logo.png'
        })
        fireEvent.press(getByTestId('business-listing-search-nav'))
        expect(navigation.navigate).toHaveBeenCalledWith('BusinessListingSearch', { term: 'pizza' })
      })
})

