import React from 'react';
import { useLanguage } from '@components';
import { HelpOptions as HelpOptionsPage, NavBar, SafeAreaViewWrapper } from '@ui';

const HelpOptions = (props: any) => {
  const [, t] = useLanguage()
  const helpProps = {
    ...props,
    ...props.route?.params,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack()
  }
  return (
    <>
      <NavBar
        title={t('HELP', 'Help')}
        onActionLeft={() => helpProps.goToBack()}
      />
      <SafeAreaViewWrapper>
        <HelpOptionsPage {...helpProps} />
      </SafeAreaViewWrapper>
    </>
  );
};

export default HelpOptions;
