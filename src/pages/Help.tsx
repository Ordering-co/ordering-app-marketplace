import React from 'react';
import settings from '../config.js'
import { useBusiness, useLanguage } from '@components'
import { Help as HelpPage, SafeAreaViewWrapper, NavBar } from '@ui';

const Help = (props: any) => {
  const [businessState] = useBusiness();
  const [, t] = useLanguage();
  const helpProps = {
    ...props,
    businessId: businessState?.business?.id,
    franchiseId: settings?.franchiseSlug,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    onRedirect: (route: string, params?: any) => {
      props.navigation.navigate(route, params)
    }
  }
  return (
    <>
      <NavBar
        title={t('HELP', 'Help')}
        onActionLeft={() => helpProps.goToBack()}
      />
      <SafeAreaViewWrapper>
        <HelpPage {...helpProps} />
      </SafeAreaViewWrapper>
    </>
  );
};

export default Help;
