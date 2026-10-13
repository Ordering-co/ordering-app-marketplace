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


import OrderTypes from '../OrderTypes'


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

describe('OrderTypes', () => {
  it('renders order type selector with route callbacks', () => {
        const setOrderTypeValue = jest.fn()
        const { getByTestId, navigation } = renderPage(OrderTypes, {
          route: { params: { configTypes: ['delivery'], setOrderTypeValue } }
        })
        expect(getByTestId('navbar-title').props.children).toBe('Type delivery')
        expect(getByTestId('order-type-selector')).toBeTruthy()
        fireEvent.press(getByTestId('order-type-nav'))
        expect(navigation.navigate).toHaveBeenCalledWith('MomentOption', { business: { id: 1 } })
        fireEvent.press(getByTestId('order-type-back'))
        expect(navigation.goBack).toHaveBeenCalled()
      })
})

