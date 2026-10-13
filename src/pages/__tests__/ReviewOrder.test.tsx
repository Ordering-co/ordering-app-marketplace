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


import ReviewOrder from '../ReviewOrder'


beforeEach(() => {
    jest.clearAllMocks()
    ;(useBusiness as jest.Mock).mockReturnValue([
      { business: { id: 99 } }
    ])
  })

describe('ReviewOrder', () => {
  it('renders review order with route callbacks', () => {
        const setIsReviewed = jest.fn()
        const handleReviewState = jest.fn()
        const { getByTestId, navigation } = renderPage(ReviewOrder, {
          route: {
            params: {
              order: { id: 20 },
              setIsReviewed,
              handleReviewState
            }
          }
        })
        expect(getByTestId('navbar-title').props.children).toBe('Review your Order')
        fireEvent.press(getByTestId('review-order-nav'))
        expect(navigation.navigate).toHaveBeenCalledWith('ReviewProducts', {
          order: { id: 3 }
        })
      })
})

