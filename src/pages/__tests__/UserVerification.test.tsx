import React from 'react'
import { act, fireEvent } from '@testing-library/react-native'
import { BackHandler, Dimensions, Platform } from 'react-native'
import RNRestart from 'react-native-restart'
import Intercom from '@intercom/intercom-react-native'

import { useConfig, useSession } from '@components'
import { _setStoreData, _removeStoreData } from '@ui'
import { renderPage } from '../../../jest/helpers/renderPage'
import { renderWithProviders } from '../../../jest/helpers/renderWithProviders'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

jest.mock('@/contexts/CookieConsentContext', () => ({
  useCookieConsent: jest.fn(() => ({ hasConsented: false }))
}))

jest.mock('react-native-loading-spinner-overlay', () => {
  const { View } = require('react-native')
  return (props: any) => <View testID="spinner-overlay" {...props} />
})

jest.mock('react-native-app-intro-slider', () => {
  const { View, Text, TouchableOpacity } = require('react-native')
  return function AppIntroSlider (props: any) {
    return (
      <View testID="intro-slider">
        <Text testID="intro-slide-title">{props.data?.[0]?.title}</Text>
        <TouchableOpacity testID="intro-done" onPress={props.onDone} />
        <TouchableOpacity
          testID="intro-slide-change"
          onPress={() => props.onSlideChange?.(1)}
        />
        {props.renderNextButton?.()}
        {props.renderSkipButton?.()}
      </View>
    )
  }
})

import { useCookieConsent } from '@/contexts/CookieConsentContext'

import UserVerification from '../UserVerification'


beforeEach(() => {
    jest.clearAllMocks()
    ;(useCookieConsent as jest.Mock).mockReturnValue({ hasConsented: false })
    ;(useConfig as jest.Mock).mockReturnValue([{
      loading: false,
      configs: {
        powered_by_ordering_module: { value: true },
        verification_email_required: { value: '0' },
        verification_phone_required: { value: '0' }
      }
    }])
    ;(useSession as jest.Mock).mockReturnValue([
      { auth: false, user: null },
      { login: jest.fn() }
    ])
    jest.spyOn(Dimensions, 'get').mockImplementation((dim: string) => {
      if (dim === 'window') return { width: 390, height: 844, scale: 2, fontScale: 2 }
      if (dim === 'screen') return { width: 390, height: 844, scale: 2, fontScale: 2 }
      return { width: 0, height: 0, scale: 1, fontScale: 1 }
    })
    Platform.OS = 'ios'
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

describe('UserVerification', () => {
  it('renders verification controller', () => {
        const { getByTestId } = renderPage(UserVerification)
        expect(getByTestId('user-verification-controller')).toBeTruthy()
      })
})

