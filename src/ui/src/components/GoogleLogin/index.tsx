import React, { useEffect } from 'react';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import { useTheme } from 'styled-components/native';

import { useLanguage, useApi, useSession } from '@components';

export const GoogleLogin = (props: any) => {
  const {
    UIButton,
    webClientId,
    handleErrors,
    handleLoading,
    handleSuccessGoogleLogin,
    notificationState,
    iosClientId
  } = props

  const [, t] = useLanguage()
  const [ordering] = useApi()
  const theme = useTheme()
  const [{ user, auth }] = useSession();

  const buttonText = auth && !user?.guest_id
    ? t('LOGOUT_WITH_GOOGLE', 'Logout with Google')
    : t('GOOGLE', 'Google');

  const performGoogleLogin = async (accessToken: string, userData: any) => {
    try {
      const body: any = {
        access_token: accessToken
      }
      if (userData) {
        body.email = userData.email
        body.name = userData.name
        body.lastname = userData.familyName || userData.givenName
        body.photo = userData.photo,
          body.platform = Platform.OS
      }

      if (notificationState?.notification_token) {
        body.notification_token = notificationState.notification_token
        body.notification_app = notificationState.notification_app
      }
      const response: any = await ordering.users().authGoogle(body)
      if (!response.content.error) {
        if (handleSuccessGoogleLogin) {
          handleSuccessGoogleLogin(response.content.result)
          handleLoading && handleLoading(false)
        }
      } else {
        handleLoading && handleLoading(false)
        onSignoutFromGoogle()
        handleErrors && handleErrors(response.content.result?.[0])
      }
    } catch (err: any) {
      handleLoading && handleLoading(false)
      handleErrors && handleErrors(err.message)
    }
  }

  const onLoginWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.idToken) {
        performGoogleLogin(userInfo.idToken, userInfo.user);
      }
    } catch (error: any) {
      const _error = (error.code === statusCodes.IN_PROGRESS || error.code === statusCodes.SIGN_IN_CANCELLED)
        ? ''
        : error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
          ? t('GOOGLE_LOGIN_ERROR_PLAY_SERVICES_NOT_AVAILABLE', 'play services not available or outdated')
          : t('GOOGLE_LOGIN_ERROR', 'Something went wrong with your Google account')
      handleErrors && _error && handleErrors(_error)
    }
  };

  const onSignoutFromGoogle = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error: any) {
      handleErrors && handleErrors(error.message)
    }
  }

  useEffect(() => {
    if (!webClientId) {
      handleErrors && handleErrors('Google Sign-In configuration error: Missing webClientId')
      return
    }

    if (!iosClientId && Platform.OS === 'ios') {
      handleErrors && handleErrors('Google Sign-In configuration error: Missing iosClientId')
      return
    }

    if (typeof webClientId !== 'string' || webClientId.trim() === '') {
      handleErrors && handleErrors('Google Sign-In configuration error: Invalid webClientId')
      return
    }

    try {
      GoogleSignin.configure({
        webClientId: Platform.OS === 'ios' ? iosClientId.trim() : webClientId.trim(),
        offlineAccess: false,
        forceCodeForRefreshToken: true,
        iosClientId: iosClientId, // only if you have an iOS app
        profileImageSize: 120,
        // Essential scopes for getting email, name, and givenName
        scopes: [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile',
          'profile',
          'email'
        ],
      })
    } catch (configError: any) {
      handleErrors && handleErrors(`Google Sign-In configuration error: ${configError.message}`)
    }
  }, [webClientId])


  return (
    <UIButton
      onPress={onLoginWithGoogle}
      iconName="google"
      iconSize={16}
      iconColor={theme.colors.black}
      buttonText={buttonText}
    />
  );
}
