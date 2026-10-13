import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import { StackActions } from '@react-navigation/native'

import { useConfig, useOrder } from '@components'
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


import UpsellingPage from '../UpsellingPage'


beforeEach(() => {
    jest.clearAllMocks()
    ;(useOrder as jest.Mock).mockReturnValue([
      { options: { type: 1 } },
      {}
    ])
    ;(useConfig as jest.Mock).mockReturnValue([{
      configs: {
        max_days_preorder: { key: 'max_days_preorder', value: '3' },
        preorder_slot_interval: { key: 'preorder_slot_interval', value: 'catering_delivery,30|catering_pickup,45' },
        preorder_lead_time: { key: 'preorder_lead_time', value: 'catering_delivery,60|catering_pickup,90' },
        preorder_time_range: { key: 'preorder_time_range', value: 'catering_delivery,120|catering_pickup,180' },
        preorder_maximum_days: { key: 'preorder_maximum_days', value: 'catering_delivery,5|catering_pickup,7' },
        preorder_minimum_days: { key: 'preorder_minimum_days', value: 'catering_delivery,1|catering_pickup,2' }
      }
    }])
  })

describe('UpsellingPage', () => {
  it('renders upselling with route params and navigates', () => {
        const { getByTestId, navigation } = renderPage(UpsellingPage, {
          route: { params: { cartUuid: 'abc', businessId: 3 } }
        })
        expect(getByTestId('upselling-products')).toBeTruthy()
        fireEvent.press(getByTestId('upselling-nav'))
        expect(navigation.navigate).toHaveBeenCalledWith('ProductDetails', { productId: 9 })
      })
  
      it('goes back or falls back to bottom tab', () => {
        const { getByTestId, navigation } = renderPage(UpsellingPage, {
          navigation: { canGoBack: jest.fn(() => false) }
        })
        fireEvent.press(getByTestId('upselling-go-back'))
        expect(navigation.navigate).toHaveBeenCalledWith('BottomTab')
      })
})

