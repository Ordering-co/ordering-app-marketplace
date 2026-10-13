import React from 'react'
import { Text, View } from 'react-native'
import { act, fireEvent, waitFor } from '@testing-library/react-native'
import RNRestart from 'react-native-restart'
import { checkNotifications, openSettings } from 'react-native-permissions'

import {
  useApi,
  useConfig,
  useEvent,
  useOrder,
  useSession
} from '@components'
import { useCookieConsent } from '@/contexts/CookieConsentContext'

jest.mock('react-native-fast-image', () => {
  const React = require('react')
  const { View } = require('react-native')
  function FastImage (props: any) {
    return React.createElement(View, { testID: 'fast-image', ...props })
  }
  FastImage.resizeMode = { contain: 'contain', cover: 'cover' }
  return { __esModule: true, default: FastImage, resizeMode: FastImage.resizeMode }
})

jest.mock('react-native-webview', () => {
  const { View: RNView } = require('react-native')
  return { WebView: (props: any) => <RNView testID="webview" {...props} /> }
})

jest.mock('react-native-uuid', () => ({ v4: jest.fn(() => 'guest-token-uuid') }))

jest.mock('lottie-react-native', () => 'Lottie')

jest.mock('react-native-permissions', () => ({
  checkNotifications: jest.fn().mockResolvedValue({ status: 'granted' }),
  openSettings: jest.fn().mockResolvedValue(undefined)
}))

jest.mock('rn-placeholder', () => {
  const { View } = require('react-native')
  return {
    Placeholder: ({ children }: any) => <View testID="placeholder">{children}</View>,
    PlaceholderLine: () => <View testID="placeholder-line" />,
    Fade: {}
  }
})

jest.mock('react-native-loading-spinner-overlay', () => {
  const { View } = require('react-native')
  return (props: any) => <View testID="spinner-overlay" {...props} />
})

jest.mock('@/contexts/CookieConsentContext', () => ({
  useCookieConsent: jest.fn()
}))

jest.mock('@/ui/src/components/Help/functions', () => {
  const defaults = require('../../../../../../jest/helpers/m2ShellDefaults')
  return {
    CmsContent: (props: any) => {
      const UI = props.UIComponent
      if (!UI) return null
      return (
        <UI
          cmsState={defaults.helpCmsDefaults.cmsState}
          onRedirect={props.onRedirect}
          navigation={props.navigation}
        />
      )
    }
  }
})

jest.mock('@ui', () => {
  const { TextInput, View } = require('react-native')
  const OText = require('@/ui/src/components/shared/OText').default
  const OButton = require('@/ui/src/components/shared/OButton').default
  const OIcon = require('@/ui/src/components/shared/OIcon').default
  const { NotFoundSource } = jest.requireActual('@/ui/src/components/NotFoundSource/index')
  const { AnimatedItem } = jest.requireActual('@/ui/src/components/AnimatedItem/index')
  return {
    OText,
    OButton,
    OIcon,
    OInput: (props: any) => <TextInput placeholder={props.placeholder} value={props.value} onChangeText={props.onChange} />,
    LanguageSelector: () => <View testID="language-selector" />,
    NotFoundSource,
    AnimatedItem,
    LastOrders: () => <View testID="last-orders" />,
    SafeAreaViewWrapper: ({ children }: any) => children,
    Toast: () => null
  }
})

const renderUiController = (defaults: Record<string, unknown> = {}) => (props: any) => {
  const UI = props.UIComponent
  if (!UI) return null
  const { UIComponent, ...rest } = props
  return <UI {...defaults} {...rest} />
}

jest.mock('@components', () => {
  const base = require('../../../../../../jest/helpers/mockOrdering')
  const m1 = require('../../../../../../jest/helpers/m1AuthDefaults')
  const m2 = require('../../../../../../jest/helpers/m2ShellDefaults')
  return {
    ...base,
    WebsocketStatus: renderUiController(m2.websocketStatusDefaults),
    PageBanner: renderUiController(m2.pageBannerDefaults),
    UserFormDetails: renderUiController({
      ...m1.userFormDetailsDefaults,
      ...m2.notificationsListDefaults
    }),
    useEvent: jest.fn(() => [{ emit: jest.fn() }]),
    useUtils: jest.fn(() => [{
      parseDate: (value: string) => value,
      optimizeImage: (url: string) => url
    }]),
    useOrder: jest.fn(() => [{ loading: false, carts: [] }, { handleOrderStateLoading: jest.fn() }]),
    useToast: jest.fn(() => [, { showToast: jest.fn() }]),
    LoginForm: (props: any) => {
      const UI = props.UIComponent
      if (!UI) return null
      return (
        <UI
          {...props}
          formState={{ loading: false }}
          loginTab="email"
          useLoginByEmail
          handleButtonLoginClick={jest.fn()}
        />
      )
    }
  }
})


import { Home } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'


beforeEach(() => {
    jest.clearAllMocks()
    ;(useConfig as jest.Mock).mockReturnValue([{
      configs: { powered_by_ordering_module: { value: false } }
    }])
    ;(useCookieConsent as jest.Mock).mockReturnValue({
      consentStatus: 'unknown',
      acceptConsent: jest.fn(),
      optOutConsent: jest.fn(),
      isConsentEnabled: true,
      loading: false
    })
    ;(checkNotifications as jest.Mock).mockResolvedValue({ status: 'granted' })
  })

describe('Home', () => {
  it('renders login and signup actions', () => {
        const onNavigationRedirect = jest.fn()
        const { getByText } = renderWithProviders(
          <Home onNavigationRedirect={onNavigationRedirect} />
        )
        expect(getByText('Log in')).toBeTruthy()
        fireEvent.press(getByText('Sign up'))
        expect(onNavigationRedirect).toHaveBeenCalledWith('BottomTab', {
          screen: 'Home',
          params: { target: 'SIGNUP' }
        })
      })
  
      it('shows guest checkout when enabled', async () => {
        ;(useConfig as jest.Mock).mockReturnValue([{
          configs: { guest_checkout_enabled: { value: '1' } }
        }])
        const mockSave = jest.fn().mockResolvedValue({
          content: { error: false, result: { id: 9, session: { access_token: 'guest-token' } } }
        })
        const handleOrderStateLoading = jest.fn().mockResolvedValue(undefined)
        ;(useApi as jest.Mock).mockReturnValue([{
          users: () => ({ save: mockSave })
        }, {}])
        const login = jest.fn()
        ;(useOrder as jest.Mock).mockReturnValue([
          { loading: false, carts: [] },
          { handleOrderStateLoading }
        ])
        ;(useSession as jest.Mock).mockReturnValue([{ auth: false }, { login }])
        const onNavigationRedirect = jest.fn()
        const { getByText } = renderWithProviders(
          <Home onNavigationRedirect={onNavigationRedirect} />
        )
        await act(async () => {
          fireEvent.press(getByText('Guest'))
        })
        await waitFor(() => {
          expect(mockSave).toHaveBeenCalled()
        })
      })

  it('renders the Maweja login card when the design is maweja', () => {
    const { getByTestId, queryByText } = renderWithProviders(
      <Home onNavigationRedirect={jest.fn()} />,
      { themeOverrides: { app_design: { components: { layout: { type: 'maweja' } } } } }
    )
    expect(getByTestId('maweja-home')).toBeTruthy()
    expect(getByTestId('maweja-login-tab')).toBeTruthy()
    expect(queryByText('Shop')).toBeNull()
  })

  it('shows continue as guest on the Maweja login when guest checkout is enabled', async () => {
    ;(useConfig as jest.Mock).mockReturnValue([{
      configs: { guest_checkout_enabled: { value: '1' } }
    }])
    const handleOrderStateLoading = jest.fn().mockResolvedValue(undefined)
    ;(useOrder as jest.Mock).mockReturnValue([
      { loading: true, carts: [] },
      { handleOrderStateLoading }
    ])
    const themeOverrides = { app_design: { components: { layout: { type: 'maweja' } } } }
    const whileLoading = renderWithProviders(
      <Home onNavigationRedirect={jest.fn()} />,
      { themeOverrides }
    )
    expect(whileLoading.getByTestId('maweja-guest')).toBeTruthy()

    ;(useOrder as jest.Mock).mockReturnValue([
      { loading: false, carts: [] },
      { handleOrderStateLoading }
    ])
    const mockSave = jest.fn().mockResolvedValue({
      content: { error: false, result: { id: 9, session: { access_token: 'guest-token' } } }
    })
    ;(useApi as jest.Mock).mockReturnValue([{
      users: () => ({ save: mockSave })
    }, {}])
    ;(useSession as jest.Mock).mockReturnValue([{ auth: false }, { login: jest.fn() }])
    const ready = renderWithProviders(
      <Home onNavigationRedirect={jest.fn()} />,
      { themeOverrides }
    )
    await act(async () => {
      fireEvent.press(ready.getByTestId('maweja-guest'))
    })
    await waitFor(() => {
      expect(mockSave).toHaveBeenCalledWith({ guest_token: 'guest-token-uuid' })
    })
  })
})

