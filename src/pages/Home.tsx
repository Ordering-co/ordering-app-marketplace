import React from 'react';
import Intercom from '@intercom/intercom-react-native'
import RNRestart from 'react-native-restart'

import settings from '../config';
import { HomeView, _removeStoreData } from '@ui';
import { useApi, useConfig, useEvent, useSession } from '@components';
import { useCookieConsent } from '../contexts/CookieConsentContext';
import { fetchUserAddressesList, getPostAuthNavigateArgs, resolvePostAuthAddressScreen } from '../utils/getPostAuthAddressScreen';

const navigateToAddress = async (navigation: any, ordering: any, user: any) => {
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
    return
  }
  navigation.navigate(destination.name)
}

export const Home = (props: any) => {
  const [events] = useEvent()
  const [ordering] = useApi()
  const [{ configs }] = useConfig()
  const [, { login }] = useSession()
  const { hasConsented } = useCookieConsent()
  const projectChanged = props.route?.params?.projectChanged

  const registerIntercom = async (user: any) => {
    if (!hasConsented) return
    const interParams: any = { userId: user?.id?.toString() }
    user?.email && (interParams.email = user?.email)
    try {
      await Intercom.registerIdentifiedUser(interParams)
    } catch (error) {
      // Intercom not configured/initialized, ignore
    }
  }

  const homeProps = {
    ...props,
    notificationState: props.route?.params?.notification_state,
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) {
        return;
      }
      props.navigation.navigate(page, params);
    },
    handleSuccessLogin: async (user: any) => {
      await registerIntercom(user)
      if (projectChanged) {
        setTimeout(() => {
          RNRestart.restart()
        }, 300)
      }
      events.emit('login', user?.id)
      await navigateToAddress(props.navigation, ordering, user)
    },
    handleSuccessSignup: async (user: any) => {
      await _removeStoreData('isGuestUser')
      if (user?.id) {
        await login({
          user,
          token: user.session.access_token
        })
      }
      await registerIntercom(user)
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
        await navigateToAddress(props.navigation, ordering, user)
      }
    },
    businessSlug: settings?.businessSlug,
    useRootPoint: settings.use_root_point
  };

  return (
    <HomeView {...homeProps} />
  );
};

export default Home;
