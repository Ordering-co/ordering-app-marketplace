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


import ReviewDriver from '../ReviewDriver'


beforeEach(() => {
    jest.clearAllMocks()
    ;(useBusiness as jest.Mock).mockReturnValue([
      { business: { id: 99 } }
    ])
  })

describe('ReviewDriver', () => {
  it('renders review driver with order param and navigates', () => {
        const order = { id: 10, driver: { name: 'Driver' } }
        const { getByTestId, navigation } = renderPage(ReviewDriver, {
          route: { params: { order } }
        })
        expect(getByTestId('navbar-title').props.children).toBe('Review Product')
        expect(getByTestId('review-driver-controller')).toBeTruthy()
        fireEvent.press(getByTestId('review-driver-nav'))
        expect(navigation.navigate).toHaveBeenCalledWith('OrderDetails', { orderId: 2 })
      })
  
      it('navbar back only when can go back', () => {
        const { getByTestId, navigation } = renderPage(ReviewDriver, {
          navigation: { canGoBack: jest.fn(() => false) }
        })
        fireEvent.press(getByTestId('navbar-back'))
        expect(navigation.goBack).not.toHaveBeenCalled()
      })
})

