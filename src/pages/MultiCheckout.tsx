import React, { useState } from 'react'
import { View } from 'react-native'
import { initStripe, useConfirmPayment } from '@stripe/stripe-react-native';
import { StackActions } from '@react-navigation/native';
import settings from '../config';
import { checkoutPaymentUtilities, getRedirectPaymentUrl } from '../utils';
import { getForterMobileUid } from '../ForterInit';
import { useSuppressProfileGate } from '../contexts/CheckoutFieldsContext';
import {
  useOrder,
  useLanguage,
  ToastType,
  useToast,
  useApi,
  useSession,
} from '@components';
import { MultiCheckout as MultiCheckoutController, NavBar, SafeAreaViewWrapper } from '@ui'

const stripePaymentOptions = ['stripe', 'stripe_connect', 'stripe_direct', 'google_pay', 'apple_pay']

const MultiCheckout = (props: any) => {
  useSuppressProfileGate();

  const [, { showToast }] = useToast();
  const [, t] = useLanguage();
  const [, { confirmMultiCarts }] = useOrder();
  const [ordering] = useApi()
  const [{ user }] = useSession()
  const { confirmPayment } = useConfirmPayment();
  const [showGateway, setShowGateway] = useState<any>({ closedByUser: false, open: false, accepted: false });
  const { handleRedirectPaymentCheckout } = checkoutPaymentUtilities();

  const multiCheckoutProps = {
    ...props,
    getForterMobileUid,
    onPlaceOrderClick: (order: any) => {
      if (order?.status === 'payment_incomplete') return
      props.navigation.replace('MultiOrdersDetails', { orderId: order?.id, isFromMultiCheckout: true })
    },
    actionsBeforePlace: async (paymethod: any, cart: any) => {
      if (
        cart?.status === 'payment_incomplete' &&
        stripePaymentOptions.includes(paymethod?.gateway)
      ) {
        const publicKey = paymethod?.data?.publishable || paymethod.paymethod?.credentials?.publishable || paymethod?.paymethod?.credentials?.publishable_key
        const paymentEvent = cart.payment_events.find((event: any) => event?.event === 'pending_payment')
        const clientSecret = paymentEvent?.data?.extra?.client_secret || cart.paymethod_data.result.client_secret
        const stripeAccountId = paymentEvent?.credentials?.user || paymentEvent?.data?.credentials?.user;
        try {
          const stripeParams = stripeAccountId
            ? {
              publishableKey: publicKey,
              stripeAccountId: stripeAccountId,
            }
            : { publishableKey: publicKey };
          initStripe(stripeParams);
        } catch (error: any) {
          showToast(ToastType.Error, error?.toString() || error.message);
        }

        try {
          const { paymentIntent, error } = await confirmPayment(clientSecret, {
            paymentMethodType: 'Card',
            paymentMethodData: {
              paymentMethodId: paymethod?.paymethod_data?.id,
              billingDetails: {
                email: user?.email,
                ...{
                  amount: cart?.total,
                  paymethod_data: { source_id: paymethod.paymethod_data?.id },
                  paymethod_id: paymethod.paymethod_id,
                }
              },
            }
          });

          if (error) {
            showToast(ToastType.Error, error.message);
          }

          props.handleIsRedirect && props.handleIsRedirect(true);
          try {
            const confirmCartRes = await confirmMultiCarts(props.route?.params?.cartUuid);
            if (confirmCartRes.error) {
              showToast(ToastType.Error, confirmCartRes.error.message);
            }
            if (confirmCartRes.result?.id) {
              props.navigation.replace('MultiOrdersDetails', {
                orderId: confirmCartRes.result?.id,
                isFromCheckout: true,
              });
              return;
            }
          } catch (error: any) {
            showToast(ToastType.Error, error?.toString() || error.message);
          }
          return;
        } catch (error: any) {
          const e =
            error?.message?.toLowerCase() === 'failed'
              ? t('FAILED_PAYMENT', 'The payment has failed')
              : error?.toString() || error.message;
          showToast(ToastType.Error, e);
        }
      } else {
        const redirectUrl = getRedirectPaymentUrl(cart);
        if (redirectUrl) {
          await handleRedirectPaymentCheckout(redirectUrl);
        }
      }
    },
    onNavigationRedirectReplace: (route: string, params: any) => {
      props.navigation.dispatch(StackActions.replace(route, params))
    },
    cartUuid: props.route?.params?.cartUuid,
    merchantId: settings?.merchantId,
    showGateway,
    setShowGateway,
    urlscheme: settings?.app_scheme,
    returnUrl: `${settings?.app_scheme}://checkout/${props.route?.params?.cartUuid ?? ''}`
  }

  return (
    <View style={{ flex: 1 }}>
      <NavBar
        title={t('MULTI_CHECKOUT', 'Multi Checkout')}
        onActionLeft={() => props?.navigation?.canGoBack() ? props?.navigation?.goBack() : props?.navigation?.navigate('BottomTab')}
      />
      <SafeAreaViewWrapper disableScrollView>
        <MultiCheckoutController {...multiCheckoutProps} />
      </SafeAreaViewWrapper>
    </View>
  )
}

export default MultiCheckout
