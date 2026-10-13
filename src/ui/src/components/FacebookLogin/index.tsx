import React from 'react';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import { useLanguage, useSession, useApi } from '@components';
import { useTheme } from 'styled-components/native';

export const FacebookLogin = (props: any) => {
  const {
    UIButton,
    handleErrors,
    handleLoading,
    handleSuccessFacebookLogin,
    notificationState
  } = props

  const [, t] = useLanguage()
  const [ordering] = useApi()
  const [{ auth, user }] = useSession()

  const theme = useTheme();

  const buttonText = auth && !user?.guest_id
    ? t('LOGOUT_WITH_FACEBOOK', 'Logout with Facebook')
    : t('FACEBOOK', 'Facebook');

  const logoutWithFacebook = () => {
    LoginManager && LoginManager.logOut();
  };

  const handleLoginClick = async (accessToken: string) => {
    try {
      const body: any = {
        access_token: accessToken
      }
      if (notificationState?.notification_token) {
        body.notification_token = notificationState.notification_token
        body.notification_app = notificationState.notification_app
      }
      const response = await ordering.users().authFacebook(body)
      if (!response.content.error) {
        if (handleSuccessFacebookLogin) {
          handleSuccessFacebookLogin(response.content.result)
          handleLoading && handleLoading(false)
        }
      } else {
        handleLoading && handleLoading(false)
        handleErrors && handleErrors(response.content.result)
        logoutWithFacebook()
      }
    } catch (err: any) {
      handleLoading && handleLoading(false)
      handleErrors && handleErrors(t('FACEBOOK_LOGIN_DISABLED', 'Facebook login is disabled, please contact the app owner'))
    }
  }

  const loginWithFacebook = () => {
    handleLoading && handleLoading(true)
    LoginManager && LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      (login: any) => {
        if (login.isCancelled) {
          const err = t('LOGIN_WITH_FACEBOOK_CANCELLED', 'Login cancelled')
          handleLoading && handleLoading(false)
          handleErrors && handleErrors(err)
        } else {
          AccessToken.getCurrentAccessToken().then((data: any) => {
            const accessToken = data.accessToken.toString();
            handleLoginClick(accessToken)
          }).catch((err: any) => {
            handleErrors && handleErrors(t('FACEBOOK_LOGIN_DISABLED', 'Facebook login is disabled, please contact the app owner'))
            handleLoading && handleLoading(false)
          });
        }
      },
      (error: any) => {
        const err = error
          ? t(error?.replace(/ /g, '_').toUpperCase(), 'Login cancelled')
          : t('LOGIN_FAIL_WITH_FACEBOOK', 'Login fail with facebook')
        handleLoading && handleLoading(false)
        handleErrors && handleErrors(err)
      },
    ).catch((err: any) => {
      handleErrors && handleErrors(t('FACEBOOK_LOGIN_DISABLED', 'Facebook login is disabled, please contact the app owner'))
      handleLoading && handleLoading(false)
    });
  };

  const onPressButton = auth && !user?.guest_id
    ? logoutWithFacebook
    : loginWithFacebook;

  return (
    <UIButton
      onPress={onPressButton}
      iconName="facebook"
      iconSize={16}
      iconColor={theme.colors.skyBlue}
      buttonText={buttonText}
    />
  );
}
