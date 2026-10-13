import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { useTheme } from 'styled-components/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { useLanguage } from '@components'
import { OText } from '@ui'
import { resolveThemeLogo } from '@/utils/logoSource'
import { useKeyboardInset } from '../../../../hooks/useKeyboardInset'

import { MawejaLogin } from './MawejaLogin'

const MawejaSignup = (props: any) => {
  const [, t] = useLanguage()
  const { SignupForm } = require('../../../SignupForm')
  return (
    <SignupForm
      embedded
      useChekoutFileds
      useSignupByEmail
      notificationState={props.notificationState}
      signupButtonText={t('SIGN_UP', 'Sign up')}
      onNavigationRedirect={props.onNavigationRedirect}
      handleSuccessSignup={props.handleSuccessSignup}
    />
  )
}
import {
  Body,
  Brand,
  Card,
  GuestButton,
  GuestFill,
  GuestLabel,
  Logo,
  LogoFrame,
  Screen,
  SwitchRow,
  TabButton,
  TabRow
} from './styles'

export const MawejaHome = (props: any) => {
  const {
    onGuest,
    guestEnabled,
    loading,
    onNavigationRedirect,
    handleSuccessLogin,
    handleSuccessSignup,
    notificationState
  } = props
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const [, t] = useLanguage()
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const keyboardInset = useKeyboardInset()
  const brandName = theme?.my_products?.components?.website_settings?.components?.values?.name
  const brandDescription = theme?.my_products?.components?.website_settings?.components?.values?.description
  const logo = resolveThemeLogo({
    images: {
      logos: {
        logotype: require('../../../../../../assets/images/logotype.png'),
        logotypeInvert: require('../../../../../../assets/images/logo-long.png')
      }
    }
  })
  return (
    <Screen testID="maweja-home">
      <Body
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 48 + keyboardInset,
          paddingHorizontal: theme.utils.margins.horizontal
        }}
      >
        <Brand>
          {!!logo && (
            <LogoFrame>
              <Logo source={logo} resizeMode="contain" />
            </LogoFrame>
          )}
          {!!brandName && (
            <OText color={theme.colors.white} size={theme.utils.tsize.xxl} weight="bold" mTop={16}>
              {String(brandName).toUpperCase()}
            </OText>
          )}
          {!!brandDescription && (
            <OText color={theme.colors.white} size={theme.utils.tsize.s} mTop={6} align="center">
              {brandDescription}
            </OText>
          )}
        </Brand>

        <Card>
          <TabRow>
            <TabButton testID="maweja-login-tab" $active={tab === 'login'} onPress={() => setTab('login')}>
              <OText
                size={theme.utils.tsize.s}
                weight="bold"
                color={tab === 'login' ? theme.colors.white : theme.colors.black}
              >
                {t('LOG_IN', 'Log in')}
              </OText>
            </TabButton>
            <TabButton testID="maweja-signup-tab" $active={tab === 'signup'} onPress={() => setTab('signup')}>
              <OText
                size={theme.utils.tsize.s}
                weight="bold"
                color={tab === 'signup' ? theme.colors.white : theme.colors.black}
              >
                {t('SIGN_UP', 'Sign up')}
              </OText>
            </TabButton>
          </TabRow>

          {tab === 'login' ? (
            <MawejaLogin
              notificationState={notificationState}
              loginButtonText={t('LOG_IN', 'Log in')}
              forgotButtonText={t('FORGOT_YOUR_PASSWORD', 'Forgot your password?')}
              onNavigationRedirect={onNavigationRedirect}
              handleSuccessLogin={handleSuccessLogin}
            />
          ) : (
            <MawejaSignup
              notificationState={notificationState}
              onNavigationRedirect={onNavigationRedirect}
              handleSuccessSignup={handleSuccessSignup}
            />
          )}
        </Card>

        <SwitchRow>
          <OText color={theme.colors.white} size={theme.utils.tsize.s}>
            {tab === 'login'
              ? t('NEW_ON_PLATFORM', 'New on Ordering?')
              : t('ALREADY_HAVE_ACCOUNT', 'Already have an account?')}
          </OText>
          <TouchableOpacity onPress={() => setTab(tab === 'login' ? 'signup' : 'login')}>
            <OText color={theme.colors.white} size={theme.utils.tsize.s} weight="bold" mLeft={6}>
              {tab === 'login' ? t('SIGN_UP', 'Sign up') : t('LOG_IN', 'Log in')}
            </OText>
          </TouchableOpacity>
        </SwitchRow>

        {guestEnabled && (
          <GuestButton testID="maweja-guest" onPress={onGuest} disabled={loading}>
            <GuestFill />
            <GuestLabel>
              <Ionicons name="person-outline" size={16} color={theme.colors.white} />
              <OText color={theme.colors.white} size={theme.utils.tsize.s} mLeft={8}>
                {t('CONTINUE_AS_GUEST', 'Continue as guest')}
              </OText>
            </GuestLabel>
          </GuestButton>
        )}
      </Body>
    </Screen>
  )
}
