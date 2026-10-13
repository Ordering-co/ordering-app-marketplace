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

import IntroductoryTutorial from '../IntroductoryTutorial'


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

describe('IntroductoryTutorial', () => {
  it('renders slides and completes tutorial', () => {
        const setTutorial = jest.fn()
        const { getByTestId } = renderPage(IntroductoryTutorial, {
          route: { params: { setTutorial } }
        })
        expect(getByTestId('intro-slider')).toBeTruthy()
        fireEvent.press(getByTestId('intro-done'))
        expect(_setStoreData).toHaveBeenCalledWith('isTutorial', false)
        expect(setTutorial).toHaveBeenCalledWith(false)
      })
  
      it('hides skip after first slide change', () => {
        const { getByTestId } = renderPage(IntroductoryTutorial, {
          route: { params: { setTutorial: jest.fn() } }
        })
        fireEvent.press(getByTestId('intro-slide-change'))
        expect(getByTestId('intro-slider')).toBeTruthy()
      })
})

