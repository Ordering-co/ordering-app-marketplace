import React from 'react'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { TouchableOpacity, Vibration } from 'react-native'
import { StackActions } from '@react-navigation/native'
import Intercom from '@intercom/intercom-react-native'

import { useConfig, useOrder, useSession } from '@components'
import { _retrieveStoreData } from '@ui'
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

jest.mock('@intercom/intercom-react-native', () => ({
  registerIdentifiedUser: jest.fn(() => Promise.resolve()),
  registerUnidentifiedUser: jest.fn(() => Promise.resolve()),
  displayMessenger: jest.fn(() => Promise.resolve()),
  hideIntercom: jest.fn(),
  logout: jest.fn()
}))

jest.mock('@/contexts/CookieConsentContext', () => ({
  useCookieConsent: jest.fn(() => ({ hasConsented: false }))
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

import { useCookieConsent } from '@/contexts/CookieConsentContext'

import AddressList from '../AddressList'


beforeEach(() => {
    jest.clearAllMocks()
    ;(useConfig as jest.Mock).mockReturnValue([{
      configs: {
        intercom_enabled: { value: '0' }
      }
    }])
    ;(useSession as jest.Mock).mockReturnValue([
      {
        auth: true,
        user: { id: 7, name: 'Jane', lastname: 'Doe', email: 'jane@test.com' }
      },
      {}
    ])
    ;(useOrder as jest.Mock).mockReturnValue([
      { options: {} },
      {}
    ])
    ;(useCookieConsent as jest.Mock).mockReturnValue({ hasConsented: false })
    ;(_retrieveStoreData as jest.Mock).mockResolvedValue(false)
    jest.spyOn(Vibration, 'vibrate').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

describe('AddressList', () => {
  it('renders address list with user id and navigation', () => {
        const { getByTestId, navigation } = renderPage(AddressList, {
          route: { params: { isFromCheckout: true } }
        })
        expect(getByTestId('navbar-title').props.children).toBe('Addresses')
        fireEvent.press(getByTestId('address-list-nav'))
        expect(navigation.navigate).toHaveBeenCalledWith('AddressForm', { isEditing: true })
      })
  
      it('shows navbar back when order has address_id', () => {
        ;(useOrder as jest.Mock).mockReturnValue([
          { options: { address_id: 10 } },
          {}
        ])
        const { getByTestId } = renderPage(AddressList)
        expect(getByTestId('navbar-back')).toBeTruthy()
      })
  
      it('goes back or navigates to home tab', () => {
        const { getByTestId, navigation } = renderPage(AddressList, {
          navigation: { canGoBack: jest.fn(() => false) }
        })
        fireEvent.press(getByTestId('address-list-back'))
        expect(navigation.navigate).toHaveBeenCalledWith('BottomTab', { screen: 'Home' })
      })

      it('replaces itself with the form when it must return to the previous screen', () => {
        const { getByTestId, navigation } = renderPage(AddressList, {
          route: { params: { isGoBack: true } }
        })
        fireEvent.press(getByTestId('address-list-nav'))
        expect(StackActions.replace).toHaveBeenCalledWith('AddressForm', { isEditing: true, isGoBack: true })
        expect(navigation.dispatch).toHaveBeenCalled()
        expect(navigation.navigate).not.toHaveBeenCalled()
      })
})

