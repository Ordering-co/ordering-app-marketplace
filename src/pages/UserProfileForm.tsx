import React from 'react'
import { NavBar, SafeAreaViewWrapper, UserProfileForm as UserProfileFormController } from '@ui';
import { useLanguage } from '@components';

interface Props {
  navigation: any;
  route: any;
}

const UserProfileForm = (props: Props) => {
  const [, t] = useLanguage();
  const myAccountProps = {
    ...props,
    useSessionUser: true,
    useValidationFields: true,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    onNavigationRedirect: (route: string, params?: any) => {
      props.navigation.navigate(route, params)
    }
  }

  return (
    <>
      <NavBar
        title={t('MY_ACCOUNT', 'My account')}
        onActionLeft={() => myAccountProps.goToBack()}
      />
      <SafeAreaViewWrapper>
        <UserProfileFormController {...myAccountProps} />
      </SafeAreaViewWrapper>
    </>
  )
}

export default UserProfileForm;
