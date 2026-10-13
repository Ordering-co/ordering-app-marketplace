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


import Home from '../Home'


beforeEach(() => {
    jest.clearAllMocks()
    ;(useBusiness as jest.Mock).mockReturnValue([{ business: { id: 42 } }, {}])
    ;(useApi as jest.Mock).mockReturnValue([{ ordering: 'mock-ordering' }, {}])
    Platform.OS = 'ios'
  })

describe('Home', () => {
  it('renders home view and navigates on redirect', () => {
        const { getByTestId, navigation } = renderPage(Home)
        expect(getByTestId('home-view')).toBeTruthy()
        fireEvent.press(getByTestId('home-nav'))
        expect(navigation.navigate).toHaveBeenCalledWith('BusinessListingSearch', { term: 'pizza' })
      })
  
      it('ignores empty navigation redirect', () => {
        const { getByTestId, navigation } = renderPage(Home)
        fireEvent.press(getByTestId('home-nav-empty'))
        expect(navigation.navigate).not.toHaveBeenCalled()
      })
})

