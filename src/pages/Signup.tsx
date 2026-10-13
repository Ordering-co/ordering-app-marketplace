import React from 'react';
import Intercom from '@intercom/intercom-react-native';
import RNRestart from 'react-native-restart'

import { useLanguage, useSession, useEvent, useConfig, useApi } from '@components';
import { useCookieConsent } from '../contexts/CookieConsentContext';
import { fetchUserAddressesList, getPostAuthNavigateArgs, resolvePostAuthAddressScreen } from '../utils/getPostAuthAddressScreen';
import {
  SignupForm,
  _setStoreData,
  _removeStoreData,
  SafeAreaViewWrapper,
  NavBar,
} from '@ui';

export const Signup = (props: any) => {
  const [, t] = useLanguage();
  const [events] = useEvent()
  const [, { login }] = useSession();
  const [{ configs }] = useConfig();
  const [ordering] = useApi()
  const { hasConsented } = useCookieConsent()

  const projectChanged = props.route?.params?.projectChanged

  const signupProps = {
    ...props,
    useChekoutFileds: true,
    loginButtonText: t('LOG_IN', 'Log in'),
    signupButtonText: t('CREATE_AN_ACCOUNT', 'Create an account'),
    useSignupByEmail: true,
    notificationState: props.route?.params?.notification_state,
    projectChanged,
    onNavigationRedirect: (page: string) => {
      if (!page) {
        return;
      }
      props.navigation.navigate(page);
    },
    handleSuccessSignup: async (user: any) => {
      await _removeStoreData('isGuestUser');
      if (user?.id) {
        await login({
          user,
          token: user.session.access_token,
        });
      }
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
      const needsVerification =
        (configs?.verification_email_required?.value === '1' && !user?.email_verified) ||
        (configs?.verification_phone_required?.value === '1' && !user?.phone_verified)
      if (!needsVerification) {
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
          props.navigation.navigate(destination.name, destination.params)
        } else {
          props.navigation.navigate(destination.name)
        }
      }
    },
  };

  _setStoreData('notification_state', props.route?.params?.notification_state);

  return (
    <>
      <NavBar
        title={t('SIGN_UP', 'Sign up')}
      />
      <SafeAreaViewWrapper>
        <SignupForm {...signupProps} />
      </SafeAreaViewWrapper>
    </>
  );
};

export default Signup;
