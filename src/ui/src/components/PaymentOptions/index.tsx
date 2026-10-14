import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { usePlatformPay } from '@stripe/stripe-react-native';
import { useTheme } from 'styled-components/native';
import {
  Placeholder,
  PlaceholderLine,
  Fade
} from "rn-placeholder";

import { PMContainer, PMItem } from './styles'

import {
  PaymentOptions as PaymentOptionsController,
  useLanguage,
  ToastType,
  useToast,
  useSession
} from '@components';

import {
  OText,
  OIcon,
  OModal,
  OButton,
  PaymentOptionCash,
  StripeElementsForm,
  StripeCardsList,
  PaymentOptionCard
} from '@ui';
import { MawejaPaymethodCard } from '../Checkout/layouts/Maweja';

const methodsPay = ['google_pay', 'apple_pay']
const stripeDirectMethods = ['stripe_direct']
const webViewPaymentGateway: any = ['paypal', 'square']
const multiCheckoutMethods = ['global_google_pay', 'global_apple_pay']
const cardsPaymethods = ['credomatic']
const stripeCardsMethods = ['stripe', 'stripe_connect_v2']
const guestNotSupportedMethods = ['stripe', 'stripe_connect', 'stripe_connect_v2', 'stripe_redirect']
const popupMethods = [...guestNotSupportedMethods, 'stripe_direct', 'paypal']

const getPaymethodCustomImageUri = (paymethod: any): string | null => {
  const raw = paymethod?.image
  if (raw == null || typeof raw !== 'string') return null
  const url = raw.trim()
  return url || null
}

const PaymentOptionsUI = (props: any) => {
  const {
    cart,
    errorCash,
    isLoading,
    isDisabled,
    paymethodData,
    paymethodsList,
    setPaymethodData,
    onNavigationRedirect,
    handlePaymethodClick,
    handlePaymethodDataChange,
    isOpenMethod,
    handlePaymentMethodClickCustom,
    handlePlaceOrder,
    handleOpenGuestSignup,
    merchantId,
    urlscheme,
    setMethodPaySupported,
    placeByMethodPay,
    methodPaySupported,
    setPlaceByMethodPay,
    setCardList,
    onPaymentChange,
    requiredFields,
    openUserModal,
    paymethodClicked,
    setPaymethodClicked,
    androidAppId,
    setUserHasCards,
    guestDisabledError,
    paymethodV2Featured,
    globalPayIFrameUrl,
    braintreeIFrameUrl,
    cybersourceIFrameUrl,
    createBusinessUserPaymethod,
    showGateway,
    setShowGateway,
    layout
  } = props

  const theme = useTheme();
  const [, { showToast }] = useToast();
  const [{ user }] = useSession()
  const { confirmPlatformPayPayment } = usePlatformPay()

  const getPayIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return theme.images.general.cash
      case 'card_delivery':
        return theme.images.general.carddelivery
      case 'paypal':
        return theme.images.general.paypal
      case 'stripe':
        return theme.images.general.creditCard
      case 'stripe_direct':
        return theme.images.general.stripecc
      case 'stripe_connect':
        return theme.images.general.stripes
      case 'stripe_redirect':
        return theme.images.general.stripesb
      case 'apple_pay':
        return theme.images.general.applePayMark
      case 'google_pay':
        return theme.images.general.googlePayMark
      case 'paypal_braintree':
        return theme.images.general.paypal
      case 'apple_pay_braintree':
        return theme.images.general.applePayMark
      case 'google_pay_braintree':
        return theme.images.general.googlePayMark
      default:
        return theme.images.general.creditCard
    }
  }

  const [, t] = useLanguage();

  const [addCardOpen, setAddCardOpen] = useState({ stripe: false, stripeConnect: false, card: false });
  const paymethodSelected = props.paySelected || props.paymethodSelected || isOpenMethod?.paymethod
  // The cards list shows for the method being picked, or for the one the cart already has when none is open
  const cardsPaymethod = isOpenMethod?.paymethod ?? paymethodSelected?.paymethod ?? paymethodSelected
  const stripeCardsPaymethod = stripeCardsMethods.includes(cardsPaymethod?.gateway) ? cardsPaymethod : null

  const paymethodsFieldRequired = ['paypal', 'apple_pay', 'global_apple_pay']

  const handlePaymentMethodClick = (paymethod: any) => {
    const _guestNotSupportedMethods = guestDisabledError ? popupMethods : guestNotSupportedMethods
    if (handleOpenGuestSignup && _guestNotSupportedMethods.includes(paymethod?.gateway) && !!user?.guest_id) {
      handleOpenGuestSignup()
      return
    }
    if (cart?.balance > 0 || !!user?.guest_id) {
      if (paymethodsFieldRequired.includes(paymethod?.gateway) && requiredFields.length > 0) {
        openUserModal && openUserModal(true)
        setPaymethodClicked({
          confirmed: false,
          paymethod
        })
        return
      }
      const isPopupMethod = ['stripe', 'stripe_direct', 'stripe_connect', 'stripe_connect_v2', 'stripe_redirect', 'paypal'].includes(paymethod?.gateway)
      if (webViewPaymentGateway.includes(paymethod?.gateway)) {
        handlePaymentMethodClickCustom(paymethod)
      }
      handlePaymethodClick(paymethod, isPopupMethod)
      return
    }
    showToast(
      ToastType.Error,
      t('CART_BALANCE_ZERO', 'Sorry, the amount to pay is equal to zero and it is not necessary to select a payment method'))
      ;
  }

  useEffect(() => {
    if (cart?.balance === 0) {
      handlePaymethodClick(null)
    }
  }, [cart?.balance])

  useEffect(() => {
    if (paymethodsList.paymethods.length === 1) {
      handlePaymethodClick && handlePaymethodClick(paymethodsList.paymethods[0])
    }
  }, [paymethodsList.paymethods])

  useEffect(() => {
    if (paymethodSelected?.gateway !== 'cash' && errorCash) {
      props.setErrorCash(false)
    }
  }, [paymethodSelected])

  useEffect(() => {
    if (props.paySelected && props.paySelected?.data) {
      requestAnimationFrame(() => {
        setPaymethodData && setPaymethodData(props.paySelected?.data)
      })
    }
  }, [props.paySelected])

  useEffect(() => {
    if (methodsPay.includes(paymethodSelected?.gateway) && paymethodData?.id && paymethodSelected?.data?.card) {
      handlePlaceOrder(confirmPlatformPayPayment)
    }
  }, [paymethodData, paymethodSelected])

  useEffect(() => {
    if (paymethodClicked?.confirmed) {
      handlePaymentMethodClickCustom(paymethodClicked?.paymethod)
    }
  }, [paymethodClicked?.confirmed])


  const renderPaymethods = ({ item }: any) => {
    if (layout === 'maweja') {
      const title = item?.gateway === 'card_delivery'
        ? 'Mobile Money'
        : t(item?.gateway?.toUpperCase(), item.name)
      const hint = item?.gateway === 'cash'
        ? t('CASH_PAYMENT_HINT', 'Payment on delivery')
        : item?.gateway === 'card_delivery'
          ? 'M-Pesa, Orange Money, Airtel Money, IllicoCash'
          : (typeof item?.description === 'string' ? item.description : '')
      const icon = item?.gateway === 'cash'
        ? 'cash-multiple'
        : item?.gateway === 'card_delivery'
          ? 'credit-card-wireless'
          : item?.gateway === 'stripe' || item?.gateway === 'stripe_connect' || item?.gateway === 'stripe_connect_v2' || item?.gateway === 'stripe_direct'
            ? 'credit-card-outline'
            : 'credit-card-check-outline'
      return (
        <MawejaPaymethodCard
          title={title}
          hint={hint}
          icon={icon}
          selected={paymethodSelected?.id === item.id}
          disabled={isDisabled}
          onPress={() => handlePaymentMethodClick(item)}
        />
      )
    }
    const customImageUri = getPaymethodCustomImageUri(item)
    return (
      <>
        {(customImageUri || methodsPay.includes(item?.gateway)) ? (
          <TouchableOpacity
            onPress={() => handlePaymentMethodClick(item)}
          >
            {customImageUri ? (
              <Image
                source={{ uri: customImageUri }}
                style={{
                  width: 70,
                  height: 70,
                  marginRight: 10,
                  borderRadius: paymethodSelected?.id === item.id ? 10 : 0,
                  borderWidth: paymethodSelected?.id === item.id ? 1 : 0,
                  borderColor: paymethodSelected?.id === item.id ? theme.colors.border : 'transparent',
                }}
                resizeMode="contain"
              />
            ) : (
              <OIcon
                src={getPayIcon(item.gateway)}
                width={70}
                height={70}
                style={{ marginRight: 10 }}
              />
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => handlePaymentMethodClick(item)}
          >
            <PMItem
              key={item.id}
              isDisabled={isDisabled}
              isActive={paymethodSelected?.id === item.id}
            >
              {['apple_pay_braintree', 'google_pay_braintree', 'paypal_braintree'].includes(item?.gateway) ? (
                <Image
                  source={getPayIcon(item.gateway)}
                  style={{ width: 20, height: 20 }}
                  resizeMode='contain'
                />
              ) : (
                <OIcon
                  src={getPayIcon(item.gateway)}
                  width={20}
                  height={20}
                  color={item?.gateway === 'apple_pay' ? '' : paymethodSelected?.id === item.id ? theme.colors.white : theme.colors.backgroundDark}
                />
              )}
              <OText
                size={10}
                style={{ margin: 0, marginTop: 4 }}
                color={paymethodSelected?.id === item.id ? theme.colors.white : '#000'}
              >
                {t(item?.gateway?.toUpperCase(), item.name)}
              </OText>
            </PMItem>
          </TouchableOpacity>
        )}
      </>

    )
  }

  const excludeIds: any = [32]; //exclude paypal & connect & redirect
  const filterMethodsPay = (gateway: string) => Platform.OS === 'ios'
    ? !['google_pay', 'google_pay_braintree'].includes(gateway)
    : !['apple_pay', 'apple_pay_braintree'].includes(gateway)
  const visiblePaymethods = paymethodsList.paymethods
    .sort((a: any, b: any) => a.id - b.id)
    .filter((p: any) =>
      !multiCheckoutMethods.includes(p.gateway) &&
      filterMethodsPay(p.gateway) &&
      !excludeIds.includes(p.id))

  return (
    <PMContainer>
      {visiblePaymethods.length > 0 && layout === 'maweja' && (
        <View>
          {visiblePaymethods.map((item: any) => (
            <View key={item?.id?.toString?.()}>
              {renderPaymethods({ item })}
            </View>
          ))}
        </View>
      )}
      {visiblePaymethods.length > 0 && layout !== 'maweja' && (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={visiblePaymethods}
          renderItem={renderPaymethods}
          keyExtractor={(paymethod: any) => paymethod?.id?.toString?.()}
        />
      )}

      {(paymethodsList.loading || isLoading) && (
        <Placeholder style={{ marginTop: 10 }} Animation={Fade}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            {[...Array(3)].map((_, i) => (
              <PlaceholderLine
                key={i}
                width={37}
                height={80}
                noMargin
                style={{ borderRadius: 10, marginRight: 10 }}
              />
            ))}
          </View>
        </Placeholder>
      )}

      {paymethodsList.error && paymethodsList.error.length > 0 && (
        <OText size={12} style={{ margin: 0 }}>
          {paymethodsList?.error[0]?.message || paymethodsList?.error[0]}
        </OText>
      )}

      {!(paymethodsList.loading || isLoading) &&
        !paymethodsList.error &&
        (!paymethodsList?.paymethods || paymethodsList.paymethods.length === 0) &&
        (
          <OText size={12} style={{ margin: 0 }}>
            {t('NO_PAYMENT_METHODS', 'No payment methods!')}
          </OText>
        )}

      {paymethodSelected?.gateway === 'cash' && (
        <PaymentOptionCash
          orderTotal={cart.balance ?? cart.total}
          defaultValue={paymethodSelected?.data?.cash}
          onChangeData={handlePaymethodDataChange}
          setErrorCash={props.setErrorCash}
        />
      )}

      {/* Stripe, Stripe Connect v2 */}
      {stripeCardsPaymethod && (
        <View>
          <StripeCardsList
            key={stripeCardsPaymethod.gateway}
            gateway={stripeCardsPaymethod.gateway}
            toSave
            paymethod={stripeCardsPaymethod}
            businessId={props.businessId}
            publicKey={props.publicKey || stripeCardsPaymethod.credentials?.publishable}
            payType={paymethodsList?.name}
            onSelectCard={handlePaymethodDataChange}
            onNavigationRedirect={onNavigationRedirect}
            paymethodCardId={paymethodData?.id}
            onCancel={() => {
              handlePaymethodClick(null)
              setAddCardOpen({ ...addCardOpen, stripe: false })
            }}
            setAddCardOpen={setAddCardOpen}
            addCardOpen={addCardOpen}
            isOpenMethod={isOpenMethod}
            handleSource={handlePaymethodDataChange}
            clientSecret={props.clientSecret}
            onPaymentChange={onPaymentChange}
            paySelected={props.paySelected}
            setUserHasCards={setUserHasCards}
            openCarts={props.openCarts}
            businessIds={props.businessIds}
            setCardsList={setCardList}
            requirements={props.clientSecret}
            publicKeyAddCard={
              stripeCardsPaymethod.credentials?.stripe?.publishable ||
              stripeCardsPaymethod.credentials?.publishable
            }
          />
        </View>
      )}
      {/* Google pay, Apple pay */}
      {methodsPay.includes(isOpenMethod?.paymethod?.gateway) && (
        <StripeElementsForm
          cart={cart}
          paymethod={isOpenMethod?.paymethod?.gateway}
          methodsPay={methodsPay}
          businessId={props.businessId}
          publicKey={isOpenMethod?.paymethod?.credentials?.publishable || isOpenMethod?.paymethod?.credentials?.publishable_key}
          handleSource={handlePaymethodDataChange}
          onCancel={() => handlePaymethodClick(null)}
          merchantId={merchantId}
          urlscheme={urlscheme}
          androidAppId={androidAppId}
          setMethodPaySupported={setMethodPaySupported}
          methodPaySupported={methodPaySupported}
          placeByMethodPay={placeByMethodPay}
          setPlaceByMethodPay={setPlaceByMethodPay}
          publicKeyAddCard={isOpenMethod?.paymethod?.credentials?.stripe?.publishable || isOpenMethod?.paymethod?.credentials?.publishable}
        />
      )}

      {(cardsPaymethods.includes(isOpenMethod?.paymethod?.gateway) ||
        cardsPaymethods.includes(paymethodSelected?.gateway) ||
        paymethodV2Featured.includes('get_cards')) && (
          <PaymentOptionCard
            setCardList={setCardList}
            paymethodSelectedInfo={paymethodSelected}
            paymethod={isOpenMethod?.paymethod}
            businessId={props.businessId}
            publicKey={isOpenMethod?.paymethod?.credentials?.publishable}
            gateway={isOpenMethod?.paymethod?.gateway || paymethodSelected?.gateway}
            onPaymentChange={onPaymentChange}
            payType={isOpenMethod?.paymethod?.name}
            onSelectCard={handlePaymethodDataChange}
            addCardOpen={addCardOpen}
            setAddCardOpen={setAddCardOpen}
            onCancel={() => handlePaymethodClick(null)}
            paymethodSelected={paymethodSelected?.data?.id}
            handlePaymentMethodClick={handlePaymentMethodClick}
            paymethodV2Featured={paymethodV2Featured}
            globalPayIFrameUrl={globalPayIFrameUrl}
            braintreeIFrameUrl={braintreeIFrameUrl}
            cybersourceIFrameUrl={cybersourceIFrameUrl}
            createBusinessUserPaymethod={createBusinessUserPaymethod}
            showGateway={showGateway}
            setShowGateway={setShowGateway}
          />
        )}

      {/* Stripe direct */}
      {stripeDirectMethods?.includes(isOpenMethod?.paymethod?.gateway) && !paymethodData.id && (
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS == 'ios' ? 0 : 0}
          enabled={Platform.OS === 'ios' ? true : false}
          style={{ marginTop: 20 }}
        >
          <StripeElementsForm
            cart={cart}
            paymethod={isOpenMethod?.paymethod?.gateway}
            methodsPay={methodsPay}
            businessId={props.businessId}
            publicKey={isOpenMethod?.paymethod?.credentials?.publishable || isOpenMethod?.paymethod?.credentials?.publishable_key}
            handleSource={handlePaymethodDataChange}
            onCancel={() => handlePaymethodClick(null)}
            merchantId={merchantId}
            urlscheme={urlscheme}
            androidAppId={androidAppId}
            publicKeyAddCard={isOpenMethod?.paymethod?.credentials?.stripe?.publishable || isOpenMethod?.paymethod?.credentials?.publishable}
            paySelected={props.paySelected}
          />
        </KeyboardAvoidingView>
      )}

      {/* Stripe Connect */}
      {isOpenMethod?.paymethod?.gateway === 'stripe_connect' && (
        <StripeCardsList
          toSave
          gateway="stripe_connect"
          paymethod={isOpenMethod?.paymethod}
          openCarts={props.openCarts}
          businessId={props.businessId}
          payType={paymethodsList?.name}
          onSelectCard={handlePaymethodDataChange}
          onNavigationRedirect={onNavigationRedirect}
          onCancel={() => {
            handlePaymethodClick(null)
            setAddCardOpen({ ...addCardOpen, stripeConnect: false })
          }}
          publicKeyAddCard={isOpenMethod?.paymethod?.credentials?.stripe?.publishable || isOpenMethod?.paymethod?.credentials?.publishable}
          paySelected={props.paySelected}
          setUserHasCards={setUserHasCards}
          accountId={isOpenMethod?.paymethod?.credentials?.user}
        />
      )}
    </PMContainer>
  )
}

export const PaymentOptions = (props: any) => {
  const paymentOptions = {
    ...props,
    UIComponent: PaymentOptionsUI
  }
  return (
    <PaymentOptionsController {...paymentOptions} />
  )
}
