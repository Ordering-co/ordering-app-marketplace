import React, { useEffect } from 'react';
import { useTheme } from 'styled-components/native';
import Intercom from '@intercom/intercom-react-native'
import RNRestart from 'react-native-restart'

import { LoginForm, _setStoreData, SafeAreaViewWrapper, NavBar } from '@ui';
import { useLanguage, useEvent, useApi } from '@components';
import { useCookieConsent } from '../contexts/CookieConsentContext';
import { BackHandler } from 'react-native';
import { fetchUserAddressesList, getPostAuthNavigateArgs, resolvePostAuthAddressScreen } from '../utils/getPostAuthAddressScreen';

export const Login = ({ navigation, route, ...props }: any) => {
  const [, t] = useLanguage();
  const theme = useTheme();
  const [events] = useEvent()
  const [ordering] = useApi()
  const { hasConsented } = useCookieConsent()
  const projectChanged = route?.params?.projectChanged
  const notificationState = props.route?.params?.notification_state ?? props.notificationState

  const loginProps = {
    ...props,
    navigation,
    useLoginByCellphone: true,
    notificationState,
    projectChanged,
    loginButtonText: t('LOG_IN', 'Log in'),
    loginButtonBackground: theme.colors.primary,
    forgotButtonText: t('FORGOT_YOUR_PASSWORD', 'Forgot your password?'),
    registerButtonText: t('SIGNUP', 'Signup'),
    handleSuccessLogin: async (user: any) => {
      if (hasConsented) {
        const interParams: any = { userId: user?.id?.toString() }
        user?.email && (interParams.email = user?.email)
        try {
          await Intercom.registerIdentifiedUser(interParams)
        } catch (error) {
          // Intercom not configured/initialized, ignore
        }
      }
      if (projectChanged) {
        setTimeout(() => {
          RNRestart.restart()
        }, 300)
      }
      events.emit('login', user?.id)
      const screen = await resolvePostAuthAddressScreen({
        addresses: user?.addresses,
        fetchAddresses: () => fetchUserAddressesList({
          ordering,
          accessToken: user?.session?.access_token,
          userId: user?.id
        })
      })
      const destination = getPostAuthNavigateArgs(screen)
      if ('params' in destination) {
        navigation.navigate(destination.name, destination.params)
      } else {
        navigation.navigate(destination.name)
      }
    },
    onNavigationRedirect: (page: string) => {
      if (!page) return
      navigation.navigate(page);
    }
  };

  useEffect(() => {
    if (notificationState) {
      _setStoreData('notification_state', notificationState)
    }
  }, [notificationState]);

  useEffect(() => {
    const handleArrowBack: any = () => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }]
      })
      return true
    }
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleArrowBack)
    return () => {
      backHandler.remove()
    }
  }, [navigation]);

  return (
    <>
      <NavBar
        title={t('LOG_IN', 'Log in')}
      />
      <SafeAreaViewWrapper disableScrollView>
        <LoginForm {...loginProps} />
      </SafeAreaViewWrapper>
    </>
  );
};

export default Login;
