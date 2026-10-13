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


import BusinessProductsList from '../BusinessProductsList'


beforeEach(() => {
    jest.clearAllMocks()
    ;(useBusiness as jest.Mock).mockReturnValue([{ business: { id: 42 } }, {}])
    ;(useApi as jest.Mock).mockReturnValue([{ ordering: 'mock-ordering' }, {}])
    Platform.OS = 'ios'
  })

describe('BusinessProductsList', () => {
  it('wires product route params and navigation handlers', () => {
        const { getByTestId, navigation } = renderPage(BusinessProductsList, {
          route: {
            params: {
              store: '15',
              productId: 99,
              categoryId: 3,
              header: 'Store Header',
              logo: 'store-logo',
              fromMulti: true
            }
          }
        })
        expect(getByTestId('business-products-listing')).toBeTruthy()
        fireEvent.press(getByTestId('bpl-search-redirect'))
        expect(navigation.navigate).toHaveBeenCalledWith('BottomTab', { screen: 'Home' })
        fireEvent.press(getByTestId('bpl-go-back'))
        expect(navigation.goBack).toHaveBeenCalled()
        fireEvent.press(getByTestId('bpl-nav-replace'))
        expect(StackActions.replace).toHaveBeenCalledWith('Checkout', { cartId: 1 })
        expect(navigation.dispatch).toHaveBeenCalled()
        fireEvent.press(getByTestId('bpl-nav'))
        expect(navigation.navigate).toHaveBeenCalledWith('Cart', {})
        fireEvent.press(getByTestId('bpl-business'))
        expect(navigation.navigate).toHaveBeenCalledWith('Business', {
          store: 'product-store',
          header: 'H',
          logo: 'L'
        })
      })
  
      it('uses productLogin when productId is absent', () => {
        const productLogin = { store_slug: 'login-store', id: 7 }
        const { getByTestId } = renderPage(BusinessProductsList, {
          route: { params: { productLogin } }
        })
        expect(getByTestId('business-products-listing')).toBeTruthy()
      })
  
      it('skips goBack when navigation cannot go back', () => {
        const { getByTestId, navigation } = renderPage(BusinessProductsList, {
          navigation: { canGoBack: jest.fn(() => false) }
        })
        fireEvent.press(getByTestId('bpl-go-back'))
        expect(navigation.goBack).not.toHaveBeenCalled()
      })
})

