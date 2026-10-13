import React from 'react';
import { StackActions } from '@react-navigation/native';

import { useLanguage, useOrder, useSession } from '@components';
import { AddressList as AddressListController, NavBar, SafeAreaViewWrapper } from '@ui';
import { leaveToCheckoutOrBack, openFromCheckout } from '@/utils/checkoutReturn';

const AddressList = ({ route, navigation }: any) => {
  const [{ options }] = useOrder()
  const [{ user }] = useSession();
  const [, t] = useLanguage();

  const addressListProps = {
    navigation,
    route,
    userId: user?.id,
    isGoBack: route?.params?.isGoBack,
    isFromBusinesses: route?.params?.isFromBusinesses,
    isFromProductsList: route?.params?.isFromProductsList,
    isFromCheckout: route?.params?.isFromCheckout,
    afterSignup: route?.params?.afterSignup,
    goToBack: () => route?.params?.fromCheckout
      ? leaveToCheckoutOrBack(navigation, route)
      : navigation?.canGoBack() ? navigation.goBack() : navigation.navigate('BottomTab', { screen: 'Home' }),
    onNavigationRedirect: (page: string, params?: any) => {
      if (route?.params?.fromCheckout) {
        openFromCheckout(navigation, route, page, params)
        return
      }
      if (page === 'AddressForm' && route?.params?.isGoBack) {
        navigation.dispatch(StackActions.replace(page, { ...params, isGoBack: true }))
        return
      }
      navigation.navigate(page, params)
    }
  };

  return (
    <>
      <NavBar
        title={t('ADDRESSES', 'Addresses')}
        {...(options?.address_id && { onActionLeft: () => addressListProps.goToBack() })}
      />
      <SafeAreaViewWrapper>
        <AddressListController {...addressListProps} />
      </SafeAreaViewWrapper>
    </>
  )
};

export default AddressList;
