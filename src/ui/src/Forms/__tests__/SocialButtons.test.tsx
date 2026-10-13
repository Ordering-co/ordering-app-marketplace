import React from 'react'
import { Platform } from 'react-native'
import { useConfig } from '@components'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { renderWithProviders } from '../../../../../jest/helpers/renderWithProviders'
import { SocialButtons } from '../SocialButtons'

jest.mock('@ui', () => ({
  FacebookLogin: jest.requireActual('../../components/FacebookLogin').FacebookLogin,
  GoogleLogin: jest.requireActual('../../components/GoogleLogin').GoogleLogin,
  AppleLogin: jest.requireActual('../../components/AppleLogin').AppleLogin
}))
jest.mock('react-native-vector-icons/FontAwesome5', () => 'Icon')
jest.mock('react-native-haptic-feedback', () => ({ trigger: jest.fn() }))
jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: { configure: jest.fn() },
  statusCodes: {}
}))
jest.mock('react-native-fbsdk-next', () => ({ AccessToken: {}, LoginManager: {} }))
jest.mock('react-native-uuid', () => ({ v4: jest.fn() }))
jest.mock('@invertase/react-native-apple-authentication', () => ({
  appleAuth: { isSupported: false },
  appleAuthAndroid: { isSupported: false }
}))
jest.mock('rn-placeholder', () => {
  const { View } = require('react-native')
  return {
    Placeholder: ({ children }: any) => <View testID="social-loading">{children}</View>,
    PlaceholderLine: () => null,
    Fade: {}
  }
})

const credentials = {
  google_login_client_id: { value: 'test-web-client-id' },
  google_login_ios_client_id: { value: 'test-ios-client-id' },
  facebook_id: { value: 'test-facebook-id' },
  apple_login_enabled: { value: '0', enabled: true },
  apple_login_client_id: { value: 'test-apple-client-id' }
}

const setConfigs = (configs: Record<string, any>) => {
  ;(useConfig as jest.Mock).mockReturnValue([{ loading: false, configs }])
}

describe('SocialButtons configuration', () => {
  const originalPlatform = Platform.OS

  beforeEach(() => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android' })
  })

  afterEach(() => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: originalPlatform })
  })

  it.each(['android', 'ios'])('hides disabled providers from first_load on %s', platform => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: platform })
    // first_load omits metadata such as enabled; value is the saved login setting.
    setConfigs({
      ...credentials,
      google_login_enabled: { value: '0' },
      facebook_login_enabled: { value: '0' }
    })
    const { queryByText, toJSON } = renderWithProviders(<SocialButtons />)

    expect(queryByText('Google')).toBeNull()
    expect(queryByText('Facebook')).toBeNull()
    expect(toJSON()).toBeNull()
    expect(GoogleSignin.configure).not.toHaveBeenCalled()
  })

  it.each([
    ['0', false, false],
    ['0', true, false],
    ['1', false, true],
    ['1', true, true]
  ])('uses saved value %s rather than enabled metadata %s', (value, enabled, visible) => {
    setConfigs({
      ...credentials,
      google_login_enabled: { value, enabled },
      facebook_login_enabled: { value, enabled }
    })
    const { queryByText } = renderWithProviders(<SocialButtons />)

    expect(!!queryByText('Google')).toBe(visible)
    expect(!!queryByText('Facebook')).toBe(visible)
  })

  it.each([
    ['1', '0', true, false],
    ['0', '1', false, true],
    ['1', '1', true, true]
  ])('controls Google %s and Facebook %s independently', (google, facebook, showGoogle, showFacebook) => {
    setConfigs({
      ...credentials,
      google_login_enabled: { value: google },
      facebook_login_enabled: { value: facebook }
    })
    const { queryByText } = renderWithProviders(<SocialButtons />)

    expect(!!queryByText('Google')).toBe(showGoogle)
    expect(!!queryByText('Facebook')).toBe(showFacebook)
  })

  it('hides providers until their login settings are available', () => {
    setConfigs(credentials)
    const { queryByText } = renderWithProviders(<SocialButtons />)

    expect(queryByText('Google')).toBeNull()
    expect(queryByText('Facebook')).toBeNull()
  })

  it.each([undefined, null, ''])('hides Google without a web client ID (%s)', clientId => {
    setConfigs({
      ...credentials,
      google_login_enabled: { value: '1' },
      facebook_login_enabled: { value: '0' },
      google_login_client_id: { value: clientId }
    })
    const { queryByText } = renderWithProviders(<SocialButtons />)

    expect(queryByText('Google')).toBeNull()
    expect(GoogleSignin.configure).not.toHaveBeenCalled()
  })

  it('requires the iOS client ID only on iOS', () => {
    setConfigs({
      ...credentials,
      google_login_enabled: { value: '1' },
      facebook_login_enabled: { value: '0' },
      google_login_ios_client_id: { value: '' }
    })
    const { queryByText, rerender } = renderWithProviders(<SocialButtons />)
    expect(queryByText('Google')).not.toBeNull()

    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'ios' })
    rerender(<SocialButtons />)
    expect(queryByText('Google')).toBeNull()
  })

  it.each([
    ['0', undefined, false],
    ['0', true, false],
    ['1', undefined, true],
    ['1', false, true]
  ])('uses saved Apple value %s rather than enabled metadata %s on iOS', (value, enabled, visible) => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'ios' })
    setConfigs({
      ...credentials,
      google_login_enabled: { value: '0' },
      facebook_login_enabled: { value: '0' },
      apple_login_enabled: { value, enabled }
    })
    const { queryByText } = renderWithProviders(<SocialButtons />)

    expect(!!queryByText('Apple')).toBe(visible)
  })

  it.each([undefined, null, ''])('hides Apple without a client ID (%s)', clientId => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'ios' })
    setConfigs({
      ...credentials,
      google_login_enabled: { value: '0' },
      facebook_login_enabled: { value: '0' },
      apple_login_enabled: { value: '1' },
      apple_login_client_id: { value: clientId }
    })
    const { queryByText, toJSON } = renderWithProviders(<SocialButtons />)

    expect(queryByText('Apple')).toBeNull()
    expect(toJSON()).toBeNull()
  })

  it('never shows Apple on Android', () => {
    setConfigs({
      ...credentials,
      google_login_enabled: { value: '0' },
      facebook_login_enabled: { value: '0' },
      apple_login_enabled: { value: '1' }
    })
    const { queryByText } = renderWithProviders(<SocialButtons />)

    expect(queryByText('Apple')).toBeNull()
  })

  it('requires a Facebook app ID', () => {
    setConfigs({
      ...credentials,
      google_login_enabled: { value: '0' },
      facebook_login_enabled: { value: '1' },
      facebook_id: { value: '' }
    })
    const { queryByText } = renderWithProviders(<SocialButtons />)
    expect(queryByText('Facebook')).toBeNull()
  })

  it('updates visible providers when configuration is refreshed', () => {
    setConfigs({
      ...credentials,
      google_login_enabled: { value: '1' },
      facebook_login_enabled: { value: '1' }
    })
    const { queryByText, rerender } = renderWithProviders(<SocialButtons />)
    expect(queryByText('Google')).not.toBeNull()
    expect(queryByText('Facebook')).not.toBeNull()

    setConfigs({
      ...credentials,
      google_login_enabled: { value: '0' },
      facebook_login_enabled: { value: '0' }
    })
    rerender(<SocialButtons />)
    expect(queryByText('Google')).toBeNull()
    expect(queryByText('Facebook')).toBeNull()

    setConfigs({
      ...credentials,
      google_login_enabled: { value: '1' },
      facebook_login_enabled: { value: '0' }
    })
    rerender(<SocialButtons />)
    expect(queryByText('Google')).not.toBeNull()
    expect(queryByText('Facebook')).toBeNull()
  })

  it('keeps the placeholder while configuration is loading', () => {
    setConfigs({})
    const { queryByText, getByTestId } = renderWithProviders(<SocialButtons />)
    expect(getByTestId('social-loading')).toBeTruthy()
    expect(queryByText('Google')).toBeNull()
    expect(queryByText('Facebook')).toBeNull()
  })
})
