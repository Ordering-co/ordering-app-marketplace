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


import BusinessesListing from '../BusinessesListing'


beforeEach(() => {
    jest.clearAllMocks()
    ;(useBusiness as jest.Mock).mockReturnValue([{ business: { id: 42 } }, {}])
    ;(useApi as jest.Mock).mockReturnValue([{ ordering: 'mock-ordering' }, {}])
    Platform.OS = 'ios'
  })

describe('BusinessesListing', () => {
  it('renders listing and navigates to business', () => {
        const { getByTestId, navigation } = renderPage(BusinessesListing, {
          route: { params: { isGuestUser: true, store: 'route-store' } }
        })
        expect(getByTestId('businesses-listing')).toBeTruthy()
        fireEvent.press(getByTestId('businesses-listing-business'))
        expect(navigation.navigate).toHaveBeenCalledWith('Business', {
          store: 'route-store',
          header: 'Header',
          logo: 'logo.png'
        })
      })
})

