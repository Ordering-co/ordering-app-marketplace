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

import ProjectForm from '../ProjectForm'


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

describe('ProjectForm', () => {
  it('renders project form and navigates when page is provided', () => {
        const { getByTestId, navigation } = renderPage(ProjectForm)
        expect(getByTestId('project-form-controller')).toBeTruthy()
        fireEvent.press(getByTestId('project-form-nav'))
        expect(navigation.navigate).toHaveBeenCalledWith('Home', { tab: 'profile' })
        fireEvent.press(getByTestId('project-form-nav-empty'))
        expect(navigation.navigate).toHaveBeenCalledTimes(1)
      })
})

