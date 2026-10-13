import React, { useState } from 'react';
import settings from '../config.js'
import { checkoutPaymentUtilities, getPaymethodGateway, getRedirectPaymentUrl, parseCartPaymethodData } from '../utils';
import { getPlaceOrderPaymentFollowUp } from '../utils/getPlaceOrderPaymentFollowUp';
import { getForterMobileUid } from '../ForterInit';
import { useSuppressProfileGate } from '../contexts/CheckoutFieldsContext';
import { leaveGiftCardCheckout } from '../utils/giftCardCart';

import {
  useOrder,
  useConfig,
  useLanguage,
  useUtils
} from '@components';
import { Checkout, NavBar, SafeAreaViewWrapper } from '@ui';

const stripePaymentOptions = ['stripe', 'stripe_direct', 'stripe_connect', 'google_pay', 'apple_pay'];

interface Config {
  key: string;
  value: string;
}

export const CheckoutPage = (props: any) => {
  useSuppressProfileGate();
  const [{ configs }] = useConfig()
  const [, t] = useLanguage()
  const [orderState] = useOrder();
  const [{ getMaxPreorderDays }] = useUtils();
  const { handleOrderRedirect, handleStripePayment, handleRedirectPaymentCheckout } = checkoutPaymentUtilities();
  const [showGateway, setShowGateway] = useState<any>({ closedByUser: false, open: false });

  const currentDate = new Date();
  const cateringTypes = [7, 8]
  const cateringTypeString = orderState?.options?.type === 7
    ? 'catering_delivery'
    : orderState?.options?.type === 8
      ? 'catering_pickup'
      : null
  const splitCateringValue = (configName: string) => {
    const _config = Object.values(configs)?.find((config: any) => config.key === configName) as Config;
    return _config?.value?.split('|')?.find((val: any) => val.includes(cateringTypeString))?.split(',')[1];
  }
  const preorderMaximumDays = parseInt(splitCateringValue('preorder_maximum_days') ?? '')
  const defaultLimitDays = getMaxPreorderDays(orderState?.options?.type)
  const limitDays = cateringTypes.includes(orderState?.options?.type) && Number.isFinite(preorderMaximumDays)
    ? preorderMaximumDays
    : defaultLimitDays;
  const time =
    limitDays > 1
      ? currentDate.getTime() + (limitDays - 1) * 24 * 60 * 60 * 1000
      : limitDays === 1
        ? currentDate.getTime()
        : currentDate.getTime() + 6 * 24 * 60 * 60 * 1000;

  currentDate.setTime(time);
  currentDate.setHours(23);
  currentDate.setMinutes(59);
  const cartUuid = props?.cartUuid || props.route?.params?.cartUuid
  const handleLeaveCheckout = () => {
    return leaveGiftCardCheckout({
      leave: () => {
        if (props?.navigation?.canGoBack()) {
          props.navigation.goBack()
          return
        }
        props.navigation.navigate('BottomTab')
      }
    })
  }
  const checkoutProps = {
    ...props,
    getForterMobileUid,
    cartUuid,
    businessLogo: props.route?.params?.businessLogo,
    businessName: props.route?.params?.businessName,
    cartTotal: props.route?.params?.cartTotal,
    fromProductsList: props.route?.params?.fromProductsList,
    stripePaymentOptions,
    isFranchiseApp: !!settings?.franchiseSlug,
    merchantId: settings?.merchantId,
    urlscheme: settings?.app_scheme,
    androidAppId: settings.android_app_id,
    maxDate: currentDate,
    fromMulti: props.route?.params?.fromMulti,
    showGateway,
    setShowGateway,
    onPlaceOrderClick: async (data: any, paymethod: any, cart: any, options: any = {}) => {
      const parsedPaymethodData = parseCartPaymethodData(cart);
      const cartWithParsedPaymethod = parsedPaymethodData
        ? { ...cart, paymethod_data: parsedPaymethodData }
        : cart;
      const followUp = getPlaceOrderPaymentFollowUp({
        hasPlacedOrder: !!cart?.order?.uuid,
        isPaymentPending: cart?.status === 2 || parsedPaymethodData?.status === 2,
        gateway: getPaymethodGateway(paymethod),
        redirectUrl: getRedirectPaymentUrl(cartWithParsedPaymethod),
        stripePaymentOptions
      });

      if (followUp.type === 'order') {
        setTimeout(() => {
          handleOrderRedirect({ orderId: cart?.order?.uuid, navigation: props.navigation, orderNumberId: cart?.order_id });
        }, 100);
        return;
      }

      if (followUp.type === 'stripe') {
        await handleStripePayment({ handleIsRedirect: props.handleIsRedirect, navigation: props.navigation, data, paymethod, cart: cartWithParsedPaymethod });
        return;
      }

      if (followUp.type === 'redirect') {
        options?.scrollToTop?.();
        await handleRedirectPaymentCheckout(followUp.url);
      }
    },
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return
      if (page === 'OrderDetails' && params?.isFromCheckout) {
        setTimeout(() => {
          handleOrderRedirect({ orderId: params.orderId, navigation: props.navigation, orderNumberId: params.orderNumberId });
        }, 100);
        return;
      }
      props.navigation.navigate(page, params);
    },
    onGoBack: handleLeaveCheckout,
  };
  return (
    <>
      <NavBar
        title={t('CHECKOUT', 'Checkout')}
        onActionLeft={handleLeaveCheckout}
      />
      <SafeAreaViewWrapper disableScrollView>
        <Checkout {...checkoutProps} />
      </SafeAreaViewWrapper>
    </>
  );
};

export default CheckoutPage;
