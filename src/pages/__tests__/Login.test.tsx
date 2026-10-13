import React from 'react'
import { act, fireEvent } from '@testing-library/react-native'
import { BackHandler, Dimensions, Platform } from 'react-native'
import RNRestart from 'react-native-restart'
import Intercom from '@intercom/intercom-react-native'

import { useApi, useConfig, useSession } from '@components'
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

import Login from '../Login'


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
    ;(useApi as jest.Mock).mockReturnValue([{}, {}])
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

describe('Login', () => {
  it('renders login form with navbar title', () => {
        const { getByTestId } = renderPage(Login)
        expect(getByTestId('navbar-title').props.children).toBe('Log in')
        expect(getByTestId('login-form')).toBeTruthy()
      })
  
      it('stores notification state on mount', () => {
        renderPage(Login, {
          route: { params: { notification_state: 'pending' } },
          pageProps: { notificationState: 'pending' }
        })
        expect(_setStoreData).toHaveBeenCalledWith('notification_state', 'pending')
      })
  
      it('navigates home after successful login with default address', async () => {
        const { getByTestId, navigation } = renderPage(Login)
        await act(async () => {
          fireEvent.press(getByTestId('login-success-home'))
        })
        expect(navigation.navigate).toHaveBeenCalledWith('BottomTab', { screen: 'Home' })
      })
  
      it('navigates to address list when user has no default address', async () => {
        const { getByTestId, navigation } = renderPage(Login)
        await act(async () => {
          fireEvent.press(getByTestId('login-success-address'))
        })
        expect(navigation.navigate).toHaveBeenCalledWith('AddressList')
      })

      it('does not force AddressList when the auth payload has no addresses array', async () => {
        const { getByTestId, navigation } = renderPage(Login)
        await act(async () => {
          fireEvent.press(getByTestId('login-success-missing-addresses'))
        })
        expect(navigation.navigate).toHaveBeenCalledWith('BottomTab', { screen: 'Home' })
        expect(navigation.navigate).not.toHaveBeenCalledWith('AddressList')
      })

      it('navigates home when fetched addresses include a default', async () => {
        ;(useApi as jest.Mock).mockReturnValue([{
          setAccessToken: () => ({
            users: () => ({
              addresses: () => ({
                get: async () => ({ content: { error: false, result: [{ default: true }] } })
              })
            })
          })
        }, {}])
        const { getByTestId, navigation } = renderPage(Login)
        await act(async () => {
          fireEvent.press(getByTestId('login-success-missing-addresses'))
        })
        expect(navigation.navigate).toHaveBeenCalledWith('BottomTab', { screen: 'Home' })
      })

      it('opens AddressList when fetched addresses have no default', async () => {
        ;(useApi as jest.Mock).mockReturnValue([{
          setAccessToken: () => ({
            users: () => ({
              addresses: () => ({
                get: async () => ({ content: { error: false, result: [] } })
              })
            })
          })
        }, {}])
        const { getByTestId, navigation } = renderPage(Login)
        await act(async () => {
          fireEvent.press(getByTestId('login-success-missing-addresses'))
        })
        expect(navigation.navigate).toHaveBeenCalledWith('AddressList')
      })
  
      it('registers intercom and restarts when consented and project changed', async () => {
        jest.useFakeTimers()
        ;(useCookieConsent as jest.Mock).mockReturnValue({ hasConsented: true })
        const { getByTestId } = renderPage(Login, {
          route: { params: { projectChanged: true } }
        })
        await act(async () => {
          fireEvent.press(getByTestId('login-success-home'))
        })
        expect(Intercom.registerIdentifiedUser).toHaveBeenCalled()
        act(() => {
          jest.advanceTimersByTime(300)
        })
        expect(RNRestart.restart).toHaveBeenCalled()
        jest.useRealTimers()
      })
  
      it('handles hardware back to reset home', () => {
        const remove = jest.fn()
        jest.spyOn(BackHandler, 'addEventListener').mockReturnValue({ remove })
        const { navigation } = renderPage(Login)
        const handler = (BackHandler.addEventListener as jest.Mock).mock.calls[0][1]
        handler()
        expect(navigation.reset).toHaveBeenCalledWith({
          index: 0,
          routes: [{ name: 'Home' }]
        })
      })
  
      it('redirects through onNavigationRedirect', () => {
        const { getByTestId, navigation } = renderPage(Login)
        fireEvent.press(getByTestId('login-redirect'))
        expect(navigation.navigate).toHaveBeenCalledWith('Signup')
      })
})

