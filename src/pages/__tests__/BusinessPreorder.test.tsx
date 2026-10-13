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


import BusinessPreorder from '../BusinessPreorder'


beforeEach(() => {
    jest.clearAllMocks()
    ;(useBusiness as jest.Mock).mockReturnValue([{ business: { id: 42 } }, {}])
    ;(useApi as jest.Mock).mockReturnValue([{ ordering: 'mock-ordering' }, {}])
    Platform.OS = 'ios'
  })

describe('BusinessPreorder', () => {
  it('renders preorder with navbar and goes back', () => {
        const handleBusinessClick = jest.fn()
        const { getByTestId, navigation } = renderPage(BusinessPreorder, {
          route: { params: { business: { id: 1 }, handleBusinessClick } }
        })
        expect(getByTestId('navbar-title').props.children).toBe('Preorder')
        expect(getByTestId('business-preorder-controller')).toBeTruthy()
        fireEvent.press(getByTestId('navbar-back'))
        expect(navigation.goBack).toHaveBeenCalled()
      })
})

