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


import BusinessSearchMap from '../BusinessSearchMap'


beforeEach(() => {
    jest.clearAllMocks()
    ;(useBusiness as jest.Mock).mockReturnValue([{ business: { id: 42 } }, {}])
    ;(useApi as jest.Mock).mockReturnValue([{ ordering: 'mock-ordering' }, {}])
    Platform.OS = 'ios'
  })

describe('BusinessSearchMap', () => {
  it('renders map search on android', () => {
        Platform.OS = 'android'
        const { getByTestId, navigation } = renderPage(BusinessSearchMap, {
          route: { params: { defaultTerm: 'tacos' } }
        })
        expect(getByTestId('business-search-map')).toBeTruthy()
        fireEvent.press(getByTestId('business-search-map-nav-empty'))
        expect(navigation.navigate).not.toHaveBeenCalled()
      })
})

