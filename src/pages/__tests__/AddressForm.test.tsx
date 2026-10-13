import React from 'react'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { TouchableOpacity, Vibration } from 'react-native'
import Intercom from '@intercom/intercom-react-native'

import { useConfig, useOrder, useSession } from '@components'
import { _retrieveStoreData } from '@ui'
import { renderPage } from '../../../jest/helpers/renderPage'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

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

import AddressForm from '../AddressForm'


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

describe('AddressForm', () => {
  it('renders address form with route params and guest storage', async () => {
        ;(_retrieveStoreData as jest.Mock).mockResolvedValue(true)
        const onSaveAddress = jest.fn()
        const { getByTestId } = renderPage(AddressForm, {
          route: {
            params: {
              address: { id: 3 },
              isEditing: true,
              isGuestUser: false,
              onSaveAddress
            }
          }
        })
        expect(getByTestId('navbar-title').props.children).toBe('Add address')
        await waitFor(() => {
          expect(getByTestId('address-form-guest-store').props.children).toBe('true')
        })
        fireEvent.press(getByTestId('address-form-nav'))
      })
  
      it('forwards isGoBack from the route to the form', () => {
        const { getByTestId } = renderPage(AddressForm, {
          route: { params: { isGoBack: true } }
        })
        expect(getByTestId('address-form-go-back').props.children).toBe('true')
      })

      it('navbar back only when can go back', () => {
        const { getByTestId, navigation } = renderPage(AddressForm)
        fireEvent.press(getByTestId('navbar-back'))
        expect(navigation.goBack).toHaveBeenCalled()
      })
})

