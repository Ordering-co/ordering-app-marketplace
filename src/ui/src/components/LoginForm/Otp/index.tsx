import React, { useEffect, useRef } from 'react'
import { StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import OtpInputs, { OtpInputsRef } from 'react-native-otp-inputs';
import { useTheme } from 'styled-components/native';

import { formatSeconds } from '../../../utils'
import { otpParams } from '../../../types'

import { OTPContainer } from './styles';
import { useCountdownTimer, OText, OButton } from '@ui';

import { useLanguage } from '@components';

export const Otp = (props: otpParams) => {
  const {
    pinCount,
    otpError,
    setOtpError,
    setAlertState,
    willVerifyOtpState,
    isCheckingCode,
    setCheckingCode,
    setWillVerifyOtpState,
    handleLoginOtp,
    onSubmit,
  } = props

  const theme = useTheme();
  const [, t] = useLanguage();
  const [otpLeftTime, _, resetOtpLeftTime]: any = useCountdownTimer(
    600, willVerifyOtpState)

  const inputRef = useRef<OtpInputsRef | any>(null)

  const handleOnSubmit = () => {
    setAlertState({
      open: true,
      title: t('CODE_SENT', 'The code has been sent'),
    })
    resetOtpLeftTime()
    onSubmit()
  }

  const handleChangeCode = (code: string) => {
    if (code?.length === pinCount) {
      setCheckingCode && setCheckingCode(true)
      handleLoginOtp(code)
      inputRef.current?.reset && inputRef.current.reset()
      setTimeout(() => inputRef.current?.focus && inputRef.current.focus(), 100)
    }
    setOtpError && setOtpError(null)
  }

  const handleCloseOtp = () => {
    setWillVerifyOtpState(false)
    setOtpError && setOtpError(null)
  }

  useEffect(() => {
    if (otpLeftTime === 0) {
      setAlertState({
        open: true,
        title: t('TIME_IS_UP', 'Time is up'),
        content: t('PLEASE_RESEND_CODE', 'Please resend code again')
      })
    }
  }, [otpLeftTime])

  const loginStyle = StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 30
    },
    underlineStyleBase: {
      width: 45,
      height: 50,
      borderWidth: 1,
      fontSize: 16,
      borderRadius: 8,
      borderColor: theme.colors.lightGray,
      textAlign: 'center'
    },
    underlineStyleHighLighted: {
      borderColor: theme.colors.primary,
      color: theme.colors.primary,
      fontSize: 16
    },
    wrapperIcon: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingRight: 20
    },
    closeContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center'
    },
    checkingCode: {
      height: 50,
      width: '100%',
      marginVertical: 30,
      justifyContent: 'center',
      alignItems: 'center'
    }
  });

  return (
    // The native Modal is a separate view hierarchy, so it needs its own provider
    // or the safe area insets resolve to zero.
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundPage }}>
        <OTPContainer>
          <OText size={24}>
            {formatSeconds(otpLeftTime)}
          </OText>
          {isCheckingCode && (
            <View style={loginStyle.checkingCode}>
              <OText size={18}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </OText>
            </View>
          )}
          {!isCheckingCode && (
            <OtpInputs
              ref={inputRef}
              autofillFromClipboard={true}
              numberOfInputs={pinCount}
              style={loginStyle.container}
              returnKeyType={'done'}
              inputStyles={loginStyle.underlineStyleBase}
              handleChange={handleChangeCode}
            />
          )}
          {!!otpError && (
            <OText
              color={theme?.colors?.error}
              size={20}
              mBottom={10}
            >
              {t(otpError, otpError)}
            </OText>
          )}
          <TouchableOpacity onPress={() => handleOnSubmit()} disabled={otpLeftTime > 520}>
            <OText size={16} mBottom={30} color={otpLeftTime > 520 ? theme.colors.disabled : theme.colors.primary}>
              {t('RESEND_CODE', 'Resend code')}
            </OText>
          </TouchableOpacity>
          <OButton
            onClick={() => handleCloseOtp()}
            text={t('CANCEL', 'Cancel')}
          />
        </OTPContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

Otp.defaultProps = {
  pinCount: 6
}
