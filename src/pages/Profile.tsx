import * as React from 'react';
import { useSession, useLanguage } from '@components';
import { UserProfile as ProfileController, NavBar } from '@ui';

import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'

interface Props {
  navigation: any;
  route: any;
}

const Profile = (props: Props) => {
  const [{ auth, user }] = useSession()
  const [, t] = useLanguage()

  const pkg = require('../../package.json')

  const profileProps = {
    ...props,
    useSessionUser: true,
    useValidationFields: true,
    refreshSessionUser: true,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    onNavigationRedirect: (route: string, params: any) =>
      props.navigation.navigate(route, params),
    handleRemoveAccount: props?.route?.params?.handleRemoveAccount,
    appVersion: pkg.version
  };

  const fullName = `${user?.name ?? ''} ${user?.lastname ?? ''}`

  return (
    auth
      ? <>
        <NavBar title={`${t('HI', 'Hi')} ${fullName}`} />
        <SafeAreaViewWrapper disableScrollView>
          <ProfileController {...profileProps} />
        </SafeAreaViewWrapper>
      </>
      : null
  );
};

export default Profile;
