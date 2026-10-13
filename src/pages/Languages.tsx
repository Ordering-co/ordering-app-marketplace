import React from 'react';
import { useLanguage } from '@components'
import { Languages, SafeAreaViewWrapper, NavBar } from '@ui';

const LanguagesPage = (props: any) => {
  const [, t] = useLanguage();
  const languagesProps = {
    ...props,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    onRedirect: (route: string, params?: any) => {
      props.navigation.navigate(route, params)
    }
  }
  return (
    <>
      <NavBar
        title={t('LANGUAGES', 'Languages')}
        onActionLeft={() => languagesProps.goToBack()}
      />
      <SafeAreaViewWrapper>
        <Languages {...languagesProps} />
      </SafeAreaViewWrapper>
    </>
  );
};

export default LanguagesPage;
