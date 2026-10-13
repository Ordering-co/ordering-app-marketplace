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


import ReviewProducts from '../ReviewProducts'


beforeEach(() => {
    jest.clearAllMocks()
    ;(useBusiness as jest.Mock).mockReturnValue([
      { business: { id: 99 } }
    ])
  })

describe('ReviewProducts', () => {
  it('renders review products and navigates', () => {
        const { getByTestId, navigation } = renderPage(ReviewProducts, {
          route: { params: { order: { id: 30 } } }
        })
        expect(getByTestId('navbar-title').props.children).toBe('Review Product')
        fireEvent.press(getByTestId('review-products-nav'))
        expect(navigation.navigate).toHaveBeenCalledWith('Home', {})
      })
  
      it('navbar back when can go back', () => {
        const { getByTestId, navigation } = renderPage(ReviewProducts)
        fireEvent.press(getByTestId('navbar-back'))
        expect(navigation.goBack).toHaveBeenCalled()
      })
})

