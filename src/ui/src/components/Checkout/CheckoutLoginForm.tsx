/* eslint-disable react-native/no-inline-styles */
import React from 'react'
import { ScrollView } from 'react-native'

import { LoginForm } from '@ui'

type CheckoutLoginFormProps = {
  navigation: any
  theme: any
  t: (key: string, fallback: string) => string
  onSuccessLogin: (user: any) => void
  onCloseLogin: () => void
  onOpenSignup: () => void
}

export const CheckoutLoginForm = ({
  navigation,
  theme,
  t,
  onSuccessLogin,
  onCloseLogin,
  onOpenSignup
}: CheckoutLoginFormProps) => {
  return (
    <ScrollView
      style={{ paddingHorizontal: 20, width: '100%' }}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <LoginForm
        navigation={navigation}
        isGuest
        loginButtonText={t('LOGIN', 'Login')}
        loginButtonBackground={theme.colors.primary}
        forgotButtonText={t('FORGOT_YOUR_PASSWORD', 'Forgot your password?')}
        registerButtonText={t('SIGNUP', 'Signup')}
        handleSuccessLogin={onSuccessLogin}
        onNavigationRedirect={(page: string) => {
          if (!page) return
          onCloseLogin()
          navigation.navigate(page)
        }}
        onNavigateToSignup={onOpenSignup}
      />
    </ScrollView>
  )
}
