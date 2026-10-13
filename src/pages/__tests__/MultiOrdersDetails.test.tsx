import React from 'react'
import { fireEvent } from '@testing-library/react-native'

import { useBusiness } from '@components'
import { renderPage } from '../../../jest/helpers/renderPage'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

jest.mock('../../config.js', () => ({
  __esModule: true,
  default: {
    franchiseSlug: 'demo-franchise'
  }
}))

jest.mock('../../layouts/SafeAreaViewWrapper', () => {
  const React = require('react')
  const { View } = require('react-native')
  return {
    SafeAreaViewWrapper: ({ children }: any) => (
      <View testID="layout-safe-area">{children}</View>
    )
  }
})


import MultiOrdersDetails from '../MultiOrdersDetails'


beforeEach(() => {
    jest.clearAllMocks()
    ;(useBusiness as jest.Mock).mockReturnValue([
      { business: { id: 99 } }
    ])
  })

describe('MultiOrdersDetails', () => {
  it('renders multi orders details with route params', () => {
        const { getByTestId } = renderPage(MultiOrdersDetails, {
          route: {
            params: { orderId: 55, isFromMultiCheckout: true }
          }
        })
        expect(getByTestId('navbar-title').props.children).toBe('Multi Orders Details')
        expect(getByTestId('multi-orders-details-controller')).toBeTruthy()
      })
  
      it('navbar back goes back or falls back to bottom tab', () => {
        const { getByTestId, navigation } = renderPage(MultiOrdersDetails, {
          navigation: { canGoBack: jest.fn(() => false) }
        })
        fireEvent.press(getByTestId('navbar-back'))
        expect(navigation.navigate).toHaveBeenCalledWith('BottomTab')
      })
  
      it('redirects to home tab from controller', () => {
        const { getByTestId, navigation } = renderPage(MultiOrdersDetails)
        fireEvent.press(getByTestId('multi-orders-redirect'))
        expect(navigation.navigate).toHaveBeenCalledWith('BottomTab', { screen: 'Home' })
      })
})

