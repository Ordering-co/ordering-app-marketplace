import React from 'react';
import { useLanguage } from '@components';
import { NavBar, OrderTypeSelector, SafeAreaViewWrapper } from '@ui';

const OrderTypes = (props: any) => {
  const { route, navigation } = props;
  const [, t] = useLanguage();

  const typesProps = {
    ...props,
    configTypes: route?.params?.configTypes,
    setOrderTypeValue: route?.params?.setOrderTypeValue,
    goToBack: () => navigation?.canGoBack() && navigation.goBack(),
    onNavigationRedirect: (route: string, params?: any) => {
      navigation.navigate(route, params)
    }
  };

  return (
    <>
      <NavBar
        title={t('TYPE_DELIVERY', 'Type delivery')}
        onActionLeft={() => typesProps.goToBack()}
      />
      <SafeAreaViewWrapper disableScrollView>
        <OrderTypeSelector {...typesProps} />
      </SafeAreaViewWrapper>
    </>
  );
};

export default OrderTypes;
