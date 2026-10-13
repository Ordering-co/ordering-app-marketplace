import React, { useState } from 'react'
import { Keyboard } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { useTheme } from 'styled-components/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { TouchableOpacity } from 'react-native'

import { LoginForm as LoginFormController, useLanguage } from '@components'
import { OButton, OInput, OText } from '@ui'

import { FieldWrap } from './styles'
import { themeBrandColor } from '@/utils/themeBrandColor'

const MawejaLoginUI = (props: any) => {
  const {
    formState,
    loginTab,
    loginButtonText,
    forgotButtonText,
    handleButtonLoginClick,
    onNavigationRedirect
  } = props
  const theme = useTheme()
  const [, t] = useLanguage()
  const { control, handleSubmit, errors } = useForm()
  const [passwordSee, setPasswordSee] = useState(false)
  const brandColor = themeBrandColor(theme)
  const fieldName = loginTab === 'cellphone' ? 'cellphone' : 'email'

  const onSubmit = (values: any) => {
    Keyboard.dismiss()
    handleButtonLoginClick?.(values)
  }

  const errorText = formState?.result?.error
    ? (typeof formState.result.result === 'string' ? formState.result.result : '')
    : ''

  return (
    <>
      <FieldWrap>
        <Controller
          control={control}
          name={fieldName}
          defaultValue=""
          rules={{
            required: t('VALIDATION_ERROR_EMAIL_REQUIRED', 'The field Email is required')
          }}
          render={({ onChange, value }: any) => (
            <OInput
              placeholder={t('EMAIL_OR_PHONE', 'Email or phone')}
              value={value}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType={fieldName === 'email' ? 'email-address' : 'phone-pad'}
              onChange={onChange}
              borderColor={errors?.[fieldName] ? theme.colors.danger : theme.colors.border}
            />
          )}
        />
      </FieldWrap>
      {loginTab !== 'otp' && (
        <FieldWrap>
          <Controller
            control={control}
            name="password"
            defaultValue=""
            rules={{
              required: t('VALIDATION_ERROR_PASSWORD_REQUIRED', 'The field Password is required')
            }}
            render={({ onChange, value }: any) => (
              <OInput
                placeholder={t('PASSWORD', 'Password')}
                value={value}
                autoCapitalize="none"
                isSecured={!passwordSee}
                onChange={onChange}
                borderColor={errors?.password ? theme.colors.danger : theme.colors.border}
                iconCustomRight={
                  <MaterialCommunityIcons
                    name={passwordSee ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={theme.colors.disabled}
                    onPress={() => setPasswordSee(!passwordSee)}
                  />
                }
              />
            )}
          />
        </FieldWrap>
      )}
      {!!errorText && (
        <OText size={14} color={theme.colors.danger} mBottom={8}>
          {errorText}
        </OText>
      )}
      <OButton
        text={loginTab === 'otp' ? t('GET_VERIFY_CODE', 'Get verify code') : loginButtonText}
        loading={formState?.loading}
        onClick={handleSubmit(onSubmit)}
        style={{ backgroundColor: brandColor, borderColor: brandColor }}
      />
      {loginTab !== 'otp' && !!forgotButtonText && (
        <TouchableOpacity onPress={() => onNavigationRedirect?.('Forgot')}>
          <OText size={14} align="center" mTop={14} color={theme.colors.backgroundGray300}>
            {forgotButtonText}
          </OText>
        </TouchableOpacity>
      )}
    </>
  )
}

export const MawejaLogin = (props: any) => (
  <LoginFormController
    {...props}
    numOtpInputs={6}
    isRecaptchaEnable
    UIComponent={MawejaLoginUI}
  />
)
