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
  const { View } = require('react-native')
  const OText = require('@/ui/src/components/shared/OText').default
  const OButton = require('@/ui/src/components/shared/OButton').default
  const OIcon = require('@/ui/src/components/shared/OIcon').default
  const { NotFoundSource } = jest.requireActual('@/ui/src/components/NotFoundSource/index')
  const { AnimatedItem } = jest.requireActual('@/ui/src/components/AnimatedItem/index')
  return {
    OText,
    OButton,
    OIcon,
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
    useToast: jest.fn(() => [, { showToast: jest.fn() }])
  }
})


import { FloatingButton } from '..'
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

describe('FloatingButton', () => {
  it('handles primary and secondary actions', () => {
        const handleClick = jest.fn()
        const handle2ndClick = jest.fn()
        const { getByText } = renderWithProviders(
          <FloatingButton
            text="Continue"
            text2nd="Cancel"
            handleClick={handleClick}
            handle2ndClick={handle2ndClick}
            flexDirection="row"
          />
        )
        fireEvent.press(getByText('Continue'))
        fireEvent.press(getByText('Cancel'))
        expect(handleClick).toHaveBeenCalled()
        expect(handle2ndClick).toHaveBeenCalled()
      })
  
      it('shows loading state on primary button', () => {
        const { getByText } = renderWithProviders(
          <FloatingButton text="Saving" loading handleClick={jest.fn()} />
        )
        expect(getByText('Saving')).toBeTruthy()
      })
})

