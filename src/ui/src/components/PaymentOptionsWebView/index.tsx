import React, { useRef, useState } from 'react'
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import WebView from 'react-native-webview';
import { ActivityIndicator } from 'react-native-paper';
import { useTheme } from 'styled-components/native';
import {
  ToastType,
  useToast,
  useApi,
  useLanguage,
  useConfig,
  useOrder
} from '@components';

import { OText } from '../shared';

interface PaymentOptionsWebViewParams {
  isAvoidRerender?: boolean,
  onNavigationRedirect?: Function,
  uri?: any,
  user?: any,
  token?: any,
  cart?: any,
  currency?: any,
  webviewPaymethod?: any,
  setShowGateway?: any,
  setOpenOrderCreating?: any,
  locationId?: any,
  additionalParams?: any,
  title?: string,
  hideHeader?: boolean,
  createBusinessUserPaymethod?: any,
  callbackAfterCardAction?: any,
  isInsideModal?: boolean,
  businessId?: any
}
export const PaymentOptionsWebView = (props: PaymentOptionsWebViewParams) => {
  const {
    isAvoidRerender,
    onNavigationRedirect,
    uri,
    user,
    token,
    cart,
    currency,
    webviewPaymethod,
    setShowGateway,
    setOpenOrderCreating,
    locationId,
    title,
    hideHeader,
    additionalParams = {},
    createBusinessUserPaymethod,
    callbackAfterCardAction,
    isInsideModal,
    businessId
  } = props

  const theme = useTheme();
  const webviewRef = useRef<any>(null)
  const [, { showToast }] = useToast();
  const [ordering] = useApi()
  const [{ configs }] = useConfig();
  const [, t] = useLanguage();
  const [, { confirmCart, changePaymethod }] = useOrder()
  const [hasLoaded, setHasLoaded] = useState(false);

  const [progClr, setProgClr] = useState('#424242');
  const [prog, setProg] = useState(true);

  const handleCloseWebview = () => {
    setProg(true);
    setShowGateway({ open: false, closedByUser: true, accepted: true })
  }

  const onMessage = async (e: any) => {
    if (e?.nativeEvent?.data && e?.nativeEvent?.data !== 'undefined') {
      let payment
      try {
        payment = JSON.parse(e.nativeEvent.data);
      } catch (error) {
        console.error('Error parsing message:', error);
        return
      }
      if (Object.keys(payment).length > 0) {
        let paymentData = null
        if (['credomatic', 'computop'].includes(cart?.paymethod_data?.gateway)) {
          paymentData = {
            [cart?.paymethod_data?.gateway]: {
              ...payment
            }
          }
        }
        if (payment?.action === 'card' && !payment?.data?.transient_token) {
          callbackAfterCardAction?.(payment.data)
          return
        }
        if (payment?.data?.transient_token) {
          const cybersourceData = {
            transient_token: payment?.data?.transient_token,
            transaction_type: payment?.data?.transaction_type || 'PAYMENT',
            billing: payment?.data?.billing,
            card_data: payment?.data?.card_data
          }
          try {
            await changePaymethod(businessId ?? cart?.business_id, webviewPaymethod?.id, JSON.stringify(cybersourceData))
          } catch (error) {
            console.error('Error updating Cybersource payment method:', error)
          }
          setShowGateway({ closedByUser: false, open: false, accepted: true })
          return
        }
        if (payment?.data?.card_token) {
          createBusinessUserPaymethod?.({
            external_id: payment?.data?.card_token,
            type_data: JSON.stringify(payment?.data?.card_data),
            type: 'card',
            paymethodId: webviewPaymethod?.id
          }, (result : any) => {
            callbackAfterCardAction?.(result)
          })
          return
        }
        const confirmCartRes = await confirmCart(payment.orderid ?? cart?.uuid, paymentData)
        if (confirmCartRes.error) {
          showToast(ToastType.Error, confirmCartRes.error.message)
        }
        if (confirmCartRes.result.order?.uuid) {
          onNavigationRedirect?.('OrderDetails', { orderId: confirmCartRes.result.order.uuid, orderNumberId: confirmCartRes.result.order.id, isFromCheckout: true })
        }
      }

      if (payment === 'api error' || payment === 'Cancelled by user') {
        setShowGateway({ closedByUser: true, open: false, accepted: true })
        setProg(true);
      }

      if (payment) {
        if (payment.error) {
          showToast(ToastType.Error, payment.result)
          setOpenOrderCreating && setOpenOrderCreating(false)
        } else if (payment?.result?.order?.uuid) {
          showToast(ToastType.Success, t('ORDER_PLACED_SUCCESSfULLY', 'The order was placed successfully'))
          onNavigationRedirect && onNavigationRedirect('OrderDetails', { orderId: payment?.result?.order?.uuid, orderNumberId: payment?.result?.order?.id, isFromCheckout: true })
        }
        setProg(true);
        setShowGateway({ closedByUser: false, open: false, accepted: true })
      }
    }
  }

  const handleChangedUrl = async (webViewState: any) => {
    if (webViewState.url.includes('https://secure.epayco.co/landingresume')) {
      const urlParams = webViewState.url.split('?')[1]
      const params = urlParams.split('&').reduce((acc: any, param: any) => {
        const [key, value] = param.split('=')
        acc[key] = value
        return acc
      }, {})
      setShowGateway({ closedByUser: false, open: false, accepted: true, params })
    }
  }

  return (
    <View style={isInsideModal
      ? { flex: 1, backgroundColor: 'white' }
      : { zIndex: 9999, height: '110%', width: '100%', position: 'absolute', backgroundColor: 'white' }
    }>
      {!hideHeader && (
        <>
          <Icon
            name="x"
            size={35}
            style={{ backgroundColor: 'white', paddingTop: 30, paddingLeft: 10 }}
            onPress={handleCloseWebview}
          />
          <OText
            style={{
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 'bold',
              color: '#00457C',
              marginBottom: 5,
              marginTop: 0
            }}>
            {title || (webviewPaymethod?.gateway === 'paypal' ? (t('PAYPAL_GATEWAY', 'PayPal GateWay')) : (t('SQUARE_PAYMENT', 'Square payment')))}
          </OText>
        </>
      )}
      {prog && (
        <View style={{ padding: 20, backgroundColor: 'white' }}>
          <ActivityIndicator size={24} color={progClr} />
        </View>
      )}
      <WebView
        source={{ uri: uri }}
        onMessage={onMessage}
        ref={webviewRef}
        javaScriptEnabled={true}
        javaScriptEnabledAndroid={true}
        cacheEnabled={false}
        cacheMode='LOAD_NO_CACHE'
        {...(isInsideModal ? { nestedScrollEnabled: true } : {})}
        style={{ flex: 1 }}
        onError={() => {
          showToast(ToastType.Error, t('ERROR_LOADING_PAYMETHOD_TRY_AGAIN', 'Error loading paymethod, please try again'))
          setShowGateway({ open: false, closedByUser: true, accepted: true })
        }}
        onNavigationStateChange={handleChangedUrl}
        onShouldStartLoadWithRequest={() => true}
        originWhitelist={["*"]}
        onLoadStart={() => {
          setProg(true);
          setProgClr('#424242');
        }}
        onLoadProgress={() => {
          setProg(true);
          setProgClr(theme?.colors?.primary);
        }}
        onLoad={() => {
          setProg(true);
          setProgClr(theme?.colors?.primary);
        }}
        onLoadEnd={(e) => {
          if (!hasLoaded) {
            isAvoidRerender && setHasLoaded(true)
            const messageParams = locationId ? { locationId, clientId: webviewPaymethod?.credentials?.application_id } : {}
            const message = {
              action: 'init',
              data: {
                urlPlace: `${ordering.root}/carts/${cart?.uuid}/place`,
                urlConfirm: `${ordering.root}/carts/${cart?.uuid}/confirm`,
                payData: {
                  paymethod_id: webviewPaymethod?.id,
                  amount: cart?.balance ?? cart?.total,
                  delivery_zone_id: cart?.delivery_zone_id,
                  user_id: user?.id,
                  user_name: user?.name
                },
                xappx: ordering?.appId,
                currency: configs?.stripe_currency?.value || currency,
                userToken: token,
                clientId: webviewPaymethod?.credentials?.client_id,
                ...messageParams,
                ...additionalParams
              }
            }
            webviewRef?.current?.postMessage?.(JSON.stringify(message))
          }
          setProg(false)
        }}
      />
    </View>
  )
}
