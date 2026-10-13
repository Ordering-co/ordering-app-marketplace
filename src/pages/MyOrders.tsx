import React, { useState } from 'react';

import settings from '../config.js'
import { useBusiness, useLanguage } from '@components';
import { MyOrders as MyOrdersController, NavBar, SafeAreaViewWrapper } from '@ui';

const MyOrders = ({ navigation }: any) => {
  const [, t] = useLanguage();
  const [businessState] = useBusiness();
  const myOrderProps = {
    navigation,
    businessId: businessState?.business?.id,
    franchiseId: settings?.franchiseSlug,
    goToBack: () => navigation?.canGoBack() && navigation.goBack(),
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) {
        return;
      }
      navigation.navigate(page, params);
    },
    handleRedirectToCheckout: (uuid: number) => {
      if (!uuid) return
      navigation.navigate('CheckoutPage', { cartUuid: uuid })
    }
  };

  const [refreshOrders, setRefreshOrders] = useState(false)

  return (
    <>
      <NavBar
        title={t('MY_ORDERS', 'My Orders')}
      />
      <SafeAreaViewWrapper
        refreshing={refreshOrders}
        onRefresh={() => setRefreshOrders(true)}
      >
        <MyOrdersController
          {...myOrderProps}
          refreshOrders={refreshOrders}
          setRefreshOrders={setRefreshOrders}
        />
      </SafeAreaViewWrapper>
    </>
  );
};

export default MyOrders;
