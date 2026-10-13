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


import Favorite from '../Favorite'


beforeEach(() => {
    jest.clearAllMocks()
    ;(useBusiness as jest.Mock).mockReturnValue([{ business: { id: 42 } }, {}])
    ;(useApi as jest.Mock).mockReturnValue([{ ordering: 'mock-ordering' }, {}])
    Platform.OS = 'ios'
  })

describe('Favorite', () => {
  it('renders favorites and handles redirect and back', () => {
        const { getByTestId, navigation } = renderPage(Favorite)
        expect(getByTestId('navbar-title').props.children).toBe('Favorite')
        expect(getByTestId('favorite-controller')).toBeTruthy()
        fireEvent.press(getByTestId('favorite-redirect'))
        expect(navigation.navigate).toHaveBeenCalledWith('Business', { store: 'fav-store' })
        fireEvent.press(getByTestId('navbar-back'))
        expect(navigation.goBack).toHaveBeenCalled()
      })
  
      it('does not go back when cannot go back', () => {
        const { getByTestId, navigation } = renderPage(Favorite, {
          navigation: { canGoBack: jest.fn(() => false) }
        })
        fireEvent.press(getByTestId('favorite-back'))
        expect(navigation.goBack).not.toHaveBeenCalled()
      })
})

