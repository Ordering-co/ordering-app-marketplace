import { initStripe, useConfirmPayment } from "@stripe/stripe-react-native";
import { Linking } from "react-native";
import { ToastType, useLanguage, useOrder, useSession, useToast } from "@components";

export const REDIRECT_PAYMETHODS = ['stripe_checkout', 'epayco', 'checkout_pro_mercadopago', 'stripe_redirect'];

export const parseCartPaymethodData = (cart: any) => {
  const data = cart?.paymethod_data;
  if (data == null) return null;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return data;
};

export const getPaymethodGateway = (paymethod: any) =>
  paymethod?.gateway ?? paymethod?.paymethod?.gateway ?? null;

export const getRedirectPaymentUrl = (cart: any) => {
  const paymethodData = parseCartPaymethodData(cart);
  if (!paymethodData) return null;
  return (
    paymethodData?.result?.action?.redirect_url ??
    paymethodData?.result?.redirect_url ??
    paymethodData?.result?.url ??
    paymethodData?.action?.redirect_url ??
    paymethodData?.redirect_url ??
    null
  );
};

export const checkoutPaymentUtilities = () => {
  const [, t] = useLanguage();
  const [, { showToast }] = useToast();
  const [orderState, { confirmCart, changeMoment }] = useOrder();
  const [{ user }] = useSession()
  const { confirmPayment } = useConfirmPayment();

  const handleOrderRedirect = ({ orderId, orderNumberId, navigation }: any) => {
    if (orderState?.options?.moment) {
      changeMoment(null);
    }
    navigation.reset({
      index: 0,
      routes: [
        { name: 'BottomTab' },
        {
          name: 'OrderDetails',
          params: {
            orderId,
            orderNumberId,
            isFromCheckout: true
          }
        }
      ],
    });
  };

  const handleStripePayment = async ({ data, paymethod, cart, handleIsRedirect, navigation }: any) => {
    const clientSecret = cart?.paymethod_data?.result?.client_secret;
    const paymentMethodId = getPaymentMethodId(paymethod, cart);
    const stripeAccountId = paymethod?.paymethod?.credentials?.user;
    const publicKey = paymethod.paymethod?.credentials?.publishable || paymethod?.paymethod?.credentials?.publishable_key;

    try {
      initStripe(getStripeParams(publicKey, stripeAccountId));
    } catch (error: any) {
      showToast(ToastType.Error, error?.toString() || error.message);
      return;
    }

    try {
      const paymentIntent = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          paymentMethodId,
          billingDetails: {
            email: user?.email,
            ...data
          },
        },
      });

      if (paymentIntent.error) {
        showToast(ToastType.Error, paymentIntent.error.message);
        return;
      }

      handleIsRedirect && handleIsRedirect(true);
      await confirmAndRedirect({ cart, navigation });
    } catch (error: any) {
      handlePaymentError(error);
    }
  };

  const getPaymentMethodId = (paymethod: any, cart: any) => {
    return paymethod?.gateway === 'stripe_connect'
      ? cart.paymethod_data?.result?.payment_method_id
      : cart.paymethod_data?.data?.source_id;
  };

  const getStripeParams = (publicKey: string, stripeAccountId: string | undefined) => {
    return stripeAccountId
      ? { publishableKey: publicKey, stripeAccountId }
      : { publishableKey: publicKey };
  };

  const confirmAndRedirect = async ({ cart, navigation }: any) => {
    try {
      const confirmCartRes = await confirmCart(cart?.uuid);
      if (confirmCartRes.error) {
        showToast(ToastType.Error, confirmCartRes.error.message);
        return;
      }
      if (confirmCartRes.result.order?.uuid) {
        navigation.replace('OrderDetails', {
          orderId: confirmCartRes.result.order.uuid,
          orderNumberId: confirmCartRes.result.order.id,
          isFromCheckout: true,
        });
      }
    } catch (error: any) {
      showToast(ToastType.Error, error?.toString() || error.message);
    }
  };

  const handlePaymentError = (error: any) => {
    const errorMessage = error?.message?.toLowerCase() === 'failed'
      ? t('FAILED_PAYMENT', 'The payment has failed')
      : error?.toString() || error.message;
    showToast(ToastType.Error, errorMessage);
  };


  const handleRedirectPaymentCheckout = async (url: string) => {
    if (!url || typeof url !== 'string') {
      showToast(ToastType.Error, t('VALIDATION_ERROR_ACTIVE_URL', 'The _attribute_ is not a valid URL.').replace('_attribute_', t('URL', 'URL')));
      return;
    }
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      showToast(ToastType.Error, t('VALIDATION_ERROR_ACTIVE_URL', 'The _attribute_ is not a valid URL.').replace('_attribute_', t('URL', 'URL')));
    }
  };

  return {
    handleOrderRedirect,
    handleStripePayment,
    handleRedirectPaymentCheckout
  }
}
