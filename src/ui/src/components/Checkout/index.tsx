/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Platform, ScrollView, BackHandler, AppState } from 'react-native';
import ReactNativeHapticFeedback, { HapticFeedbackTypes } from "react-native-haptic-feedback";
import { initStripe, useConfirmPayment, dismissPlatformPay } from '@stripe/stripe-react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from 'styled-components/native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';

import { parseCartPaymethodData, REDIRECT_PAYMETHODS } from '../../../../utils';
import { parseDriverTipOptions } from './parseDriverTipOptions';
import { parseReservationSetting } from './parseReservationSetting';
import { isStripeDirectMissingSource } from './isStripeDirectMissingSource';
import { getCardsGateway } from '../../utils/stripeCardsGateway';
import { handleCheckoutHardwareBack } from './handleCheckoutHardwareBack';
import { useCartPlacedHere } from './useCartPlacedHere';
import { giftCartStatePatch, shouldLeaveGiftCheckoutWhenCartMissing } from '../../../../utils/giftCardCart';
import { doesSchoolCartNeedStudent, isSchoolCart as isSchoolCartCheck } from '../CheckoutStudentDetails/schoolCartStudent';

import { HeaderContent } from '../BusinessesListing/Layout/Original/HeaderContent';
import { BusinessDetailsComponent } from './BusinessDetails';
import { Summary as SummaryComponent } from './Summary';
import { DeliveryOptionsComponent } from './DeliveryOptions';
import { CheckoutLoginForm } from './CheckoutLoginForm';
import { PendingCartNotice } from './PendingCartNotice';
import { resolveAppDesign } from '@/utils/appDesign';
import { isGuestOrderBlocked as guestOrderBlocked, showContinueAsGuest } from './isGuestOrderBlocked';
import { isGuestCheckoutAllowed as checkGuestCheckoutAllowed } from '@/utils/guestCheckout'
import { useGuestCheckoutPermission } from '../../../../hooks/useGuestCheckoutPermission'
import { CheckoutSectionOrder, MawejaCardTitle, MawejaCartNotice, PaySection } from './layouts/Maweja';
import { Card, CardBody } from './layouts/Maweja/styles';

import {
  ChContainer,
  ChSection,
  ChAddress,
  ChPaymethods,
  ChDriverTips,
  ChErrors,
  ChUserDetails,
  ChCart,
  WalletPaymentOptionContainer,
  DetailWrapper,
  Divider
} from './styles';

import {
  Checkout as CheckoutController,
  useOrder,
  useSession,
  useApi,
  useLanguage,
  useUtils,
  useConfig,
  useToast,
  ToastType,
  useEvent,
} from '@components';

import {
  OText,
  OModal,
  OButton,
  PaymentOptionsWebView,
  AddressDetails,
  PaymentOptions,
  DriverTips,
  NotFoundSource,
  UserDetails,
  PaymentOptionWallet,
  PlaceSpot,
  SignupForm,
  FloatingButton,
  OrderSummary,
  CartStoresListing,
  BusinessReservation,
  CheckoutStudentDetails
} from '@ui';

const mapConfigs = {
  mapZoom: 16,
  mapSize: {
    width: 640,
    height: 190
  }
};

const deliveryTypes = [1, 7]
const pickupTypes = [2, 8]
const driverTipsTypes = [...deliveryTypes, ...pickupTypes]

const manageErrorsToShow = (array = []) => {
  let stringError = ''
  const list = Array.isArray(array) ? array : Object.values(array)
  list.map((item: any, i: number) => {
    stringError += (i + 1) === array.length ? `- ${item?.message || item}` : `- ${item?.message || item}\n`
  })
  return stringError;
}

const methodsWithRequiredCards = ['globalpay', 'braintree', 'cybersource']
const GET_ORDER_COOLDOWN_MS = 2000

const CheckoutUI = (props: any) => {
  const {
    navigation,
    cart: orderCart,
    errors,
    placing,
    cartState,
    cartUuid,
    loyaltyPlansState,
    businessDetails,
    paymethodSelected,
    handlePaymethodChange,
    handlerClickPlaceOrder,
    onNavigationRedirect,
    deliveryOptionSelected,
    instructionsOptions,
    handleChangeDeliveryOption,
    currency,
    merchantId,
    setPlaceSpotNumber,
    maxDate,
    androidAppId,
    urlscheme,
    checkoutFieldsState,
    showGateway,
    setShowGateway,
    globalPayIFrameUrl,
    braintreeIFrameUrl,
    cybersourceIFrameUrl,
    createBusinessUserPaymethod,
    isPendingCartReleasable,
    releasingPendingCart,
    handleReleasePendingCart,
  } = props
  const cart = orderCart ?? cartState?.cart

  const theme = useTheme();
  const isMaweja = resolveAppDesign(theme) === 'maweja'
  const isFocused = useIsFocused();

  const [, { showToast }] = useToast();
  const [, t] = useLanguage();
  const cartMessage = (message: string, size = 12) => isMaweja
    ? <MawejaCartNotice message={message} />
    : <OText color={theme.colors.error} size={size}>{message}</OText>
  const [{ user, token, loading: userLoading }, { login }] = useSession();
  const [ordering] = useApi()
  const [{ configs }] = useConfig();
  const [{ parsePrice, isWalletEnabled: isWalletConfigEnabled }] = useUtils();
  const [{ options, carts, loading }, { confirmCart }] = useOrder();
  const [events] = useEvent()

  const scrollViewRef = useRef<ScrollView>(null)

  const [errorCash, setErrorCash] = useState(false);
  const [userErrors, setUserErrors] = useState<any>([]);
  const [isUserDetailsEdit, setIsUserDetailsEdit] = useState(false);
  const [phoneUpdate, setPhoneUpdate] = useState(false);
  const [openChangeStore, setOpenChangeStore] = useState(false)
  const [webviewPaymethod, setWebviewPaymethod] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [requiredFields, setRequiredFields] = useState<any>([])
  const [openModal, setOpenModal] = useState({ login: false, signup: false, isGuest: false })
  const [allowedGuest, setAllowedGuest] = useState(false)
  const [placeByMethodPay, setPlaceByMethodPay] = useState(false)
  const [methodPaySupported, setMethodPaySupported] = useState({ enabled: false, message: null, loading: true })
  const [paymethodClicked, setPaymethodClicked] = useState<any>(null)
  const [cardList, setCardList] = useState<any>({ cards: [], loading: false, error: null })
  const [isGiftCardCart, setIsGiftCardCart] = useState(cart != null && cart.business_id == null)
  const [userHasCards, setUserHasCards] = useState(false)
  const [isPaymentAttemptCancelled, setIsPaymentAttemptCancelled] = useState(false)
  const isCartPlacedHere = useCartPlacedHere(placing)
  const cardsMethods = ['credomatic']
  const redirectPaymethods = ['stripe_checkout', 'epayco', 'checkout_pro_mercadopago']
  const stripePaymethods: any = ['stripe', 'stripe_connect', 'stripe_connect_v2', 'stripe_redirect']
  const cardsPaymethods: any = ['stripe', 'stripe_connect', 'stripe_connect_v2']
  const stripeCardsMethods: any = ['stripe', 'stripe_connect_v2']
  const notFields = ['coupon', 'driver_tip', 'mobile_phone', 'address', 'zipcode', 'address_notes', 'comments']

  const checkoutFields = useMemo(() => checkoutFieldsState?.fields?.filter((field: any) => field.order_type_id === options?.type), [checkoutFieldsState, options])
  const guestCheckoutDriveTip = useMemo(() => checkoutFields?.find((field: any) => driverTipsTypes.includes(field.order_type_id) && field?.validation_field?.code === 'driver_tip'), [JSON.stringify(checkoutFields), options])
  const guestCheckoutComment = useMemo(() => checkoutFields?.find((field: any) => field.order_type_id === options?.type && field?.validation_field?.code === 'comments'), [JSON.stringify(checkoutFields), options])
  const guestCheckoutCoupon = useMemo(() => checkoutFields?.find((field: any) => field.order_type_id === options?.type && field?.validation_field?.code === 'coupon'), [JSON.stringify(checkoutFields), options])
  const guestCheckoutZipcode = useMemo(() => checkoutFields?.find((field: any) => field.order_type_id === options?.type && field?.validation_field?.code === 'zipcode'), [JSON.stringify(checkoutFields), options])

  const placeSpotTypes = [3, 4, 5]
  const placeSpotsEnabled = placeSpotTypes.includes(options?.type)
  const businessConfigs = businessDetails?.business?.configs ?? []
  const isWalletCashEnabled = businessConfigs.find((config: any) => config.key === 'wallet_cash_enabled')?.value === '1'
  const isWalletCreditPointsEnabled = businessConfigs.find((config: any) => config.key === 'wallet_credit_point_enabled')?.value === '1'
  const isWalletEnabled = configs?.cash_wallet?.value && isWalletConfigEnabled(configs) && (isWalletCashEnabled || isWalletCreditPointsEnabled)
  const isGuestCheckoutEnabled = checkGuestCheckoutAllowed(configs, options?.type)
  const { guestCheckoutAllowed, canUseGuestCheckout, canPlaceOrder } = useGuestCheckoutPermission({
    configs,
    orderType: options?.type,
    user,
    requiresAccount: isMaweja
  })
  useEffect(() => {
    if (!guestCheckoutAllowed) setAllowedGuest(false)
  }, [guestCheckoutAllowed])
  const isGuestOrderBlocked = guestOrderBlocked({
    guestId: user?.guest_id,
    isGuestCheckoutEnabled,
    isMaweja
  })
  const continueAsGuestVisible = showContinueAsGuest({ isGuestCheckoutEnabled, isMaweja })
  const hideCustomerDetails = theme?.checkout?.components?.customer?.hidden

  const creditPointPlan = loyaltyPlansState?.result?.find((loyal: any) => loyal.type === 'credit_point')
  const creditPointPlanOnBusiness = creditPointPlan?.businesses?.find((b: any) => b.business_id === cart?.business_id && b.accumulates)
  const methodsPay = ['google_pay', 'apple_pay']
  const cartPaymethod = businessDetails?.business?.paymethods?.find((pm: any) => pm?.paymethod_id === cart?.paymethod_id)?.paymethod
  const cartStatusCancelMessage = isPaymentAttemptCancelled
    ? t('PAYMENT_ATTEMPT_CANCELLED', 'The payment attempt was cancelled. Choose a payment method to try again.')
    : t('CART_STATUS_CANCEL_MESSAGE', 'The payment has not been successful, please try again')

  const commentDelayTime = 1500
  const allowDriverTipPickup = configs?.driver_tip_allowed_at_pickup?.value === '1' && pickupTypes.includes(options?.type)
  const validateCommentsCartField = (guestCheckoutComment?.enabled && (user?.guest_id ? guestCheckoutComment?.required_with_guest : guestCheckoutComment?.required)) && (cart?.comment === null || cart?.comment?.trim().length === 0)
  const validateDriverTipField = (deliveryTypes.includes(options?.type) || allowDriverTipPickup) && (guestCheckoutDriveTip?.enabled && (user?.guest_id ? guestCheckoutDriveTip?.required_with_guest : guestCheckoutDriveTip?.required)) && (Number(cart?.driver_tip) <= 0)
  const validateCouponField = (guestCheckoutCoupon?.enabled && (user?.guest_id ? guestCheckoutCoupon?.required_with_guest : guestCheckoutCoupon?.required)) && !cart?.offers?.some((offer: any) => offer?.type === 2)
  const validateZipcodeCard = (guestCheckoutZipcode?.enabled && (user?.guest_id ? guestCheckoutZipcode?.required_with_guest : guestCheckoutZipcode?.required)) && stripeCardsMethods.includes(paymethodSelected?.gateway) && paymethodSelected?.data?.card && !paymethodSelected?.data?.card?.zipcode

  const businessConfig = businessDetails?.business?.configs?.find((config: any) => config?.key === 'reservation_setting')

  const reservationSetting = parseReservationSetting(businessConfig ? businessConfig?.value : configs?.reservation_setting?.value)
  const isFreeOrder = Number(cart?.balance) === 0

  const validateCardRequired = cardsMethods.includes(paymethodSelected?.gateway) && cardList?.cards?.length === 0
  const validateRequiredCardSelection = methodsWithRequiredCards.includes(paymethodSelected?.gateway) &&
    !(paymethodSelected?.data?.card_token || paymethodSelected?.data?.transient_token || cart?.paymethod_data?.card_token || cart?.paymethod_data?.transient_token)

  const isInitialCartLoad = cartState.loading && !cartState.cart
  const showAddressSkeleton = isInitialCartLoad || (!isGiftCardCart && businessDetails?.loading && !businessDetails?.business)
  const isOrderContextBlockingPlace = loading && !cart

  const isSchoolCart = businessDetails?.business?.vertical === 'school' || isSchoolCartCheck(cart)
  const [assignedStudentId, setAssignedStudentId] = useState<any>(null)
  const schoolNeedsStudent = doesSchoolCartNeedStudent({
    isSchool: isSchoolCart,
    studentId: cart?.student_id ?? cart?.student?.id ?? assignedStudentId
  })

  const isDisabledButtonPlace = schoolNeedsStudent || isOrderContextBlockingPlace || !cart?.valid || (!paymethodSelected && cart?.balance > 0) ||
    placing || errorCash ||
    !cart?.valid_maximum ||
    (!cart?.valid_minimum && !(cart?.discount_type === 1 && cart?.discount_rate === 100)) ||
    validateCardRequired ||
    (validateCommentsCartField) ||
    (validateDriverTipField && !isGiftCardCart) ||
    (validateZipcodeCard) ||
    (methodsPay.includes(paymethodSelected?.gateway) && (!methodPaySupported.enabled || methodPaySupported.loading)) ||
    validateCommentsCartField ||
    validateDriverTipField ||
    validateCouponField ||
    validateZipcodeCard ||
    (!userHasCards && cardsPaymethods.includes(paymethodSelected?.gateway)) ||
    isStripeDirectMissingSource({
      gateway: paymethodSelected?.gateway,
      paymethodData: paymethodSelected?.data,
      cartPaymethodData: cart?.paymethod_data
    }) ||
    (!cart?.reservation && options?.type === 9) ||
    (!!cart?.products?.length && !reservationSetting?.allow_preorder_reservation && options?.type === 9) ||
    isGuestOrderBlocked ||
    validateRequiredCardSelection

  const driverTipsOptions = parseDriverTipOptions(configs?.driver_tip_options?.value)
  const driverTipsField = cart && cart?.business_id && (deliveryTypes.includes(options.type) || allowDriverTipPickup) && cart?.status !== 2 && (guestCheckoutDriveTip?.enabled) && driverTipsOptions.length > 0

  const cartsWithProducts = carts && Object.values(carts).filter((cart: any) => cart?.products?.length) || null

  const isSandboxCredomatic = configs?.credomatic_integration_sandbox?.value === '1'
  const credomaticKeyId = isSandboxCredomatic ? configs?.credomatic_integration_public_sandbox_key?.value : configs?.credomatic_integration_public_production_key?.value
  const credomaticUrl = `https://integrations.ordering.co/credomatic/front/auth_mobile.html?title=${t('CREDOMATIC_PAYMENT', 'Credomatic payment')}&body=${t('CREDOMATIC_PROCESSING', 'Processing transaction')}`
  const deliveryOptions = instructionsOptions?.result &&
    instructionsOptions?.result?.filter((option: any) => option?.enabled)?.map((option: any) => ({
      value: option?.id,
      key: option?.id,
      label: t(option?.name.toUpperCase().replace(/\s/g, '_'), option?.name)
    }))

  const vibrateApp = (impact?: HapticFeedbackTypes) => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false
    };
    ReactNativeHapticFeedback.trigger(impact || "impactLight", options);
  }

  const handleSuccessSignup = async (user: any) => {
    await login({
      user,
      token: user?.session?.access_token
    })
    setOpenModal({ ...openModal, signup: false, isGuest: false })
  }

  const handleSuccessLogin = (user: any) => {
    if (user) setOpenModal({ ...openModal, login: false })
  }

  const handleOpenGuestSignup = () => {
    setOpenModal({ ...openModal, signup: true, isGuest: true })
  }

  const handlePlaceOrder = (confirmPayment: any, forcePlace: boolean = false) => {
    if (!canPlaceOrder()) return
    if (isGuestOrderBlocked) return
    if (schoolNeedsStudent) return
    if (stripePaymethods.includes(paymethodSelected?.gateway) && user?.guest_id) {
      setOpenModal({ ...openModal, signup: true, isGuest: true })
      return
    }

    if (!userErrors.length && (!requiredFields?.length) || forcePlace) {
      vibrateApp()
      handlerClickPlaceOrder?.(
        null,
        { isNative: true },
        confirmPayment,
        dismissPlatformPay,
        null,
        {
          scrollToTop: () => { scrollViewRef?.current?.scrollTo({ y: 0, animated: true }) },
          ...(redirectPaymethods.includes(paymethodSelected?.gateway) && {
            returnUrl: `${urlscheme}://checkout/${cart?.uuid}`,
            urlscheme,
          }),
        }
      )
      return
    }
    if (requiredFields?.length) {
      setIsOpen(true)
      return
    }
    let stringError = ''
    Object.values(userErrors).map((item: any, i: number) => {
      stringError += (i + 1) === userErrors.length ? `- ${item?.message || item}` : `- ${item?.message || item}\n`
    })
    showToast(ToastType.Error, stringError)
    setIsUserDetailsEdit(true)
  }

  const handlePlaceOrderAsGuest = () => {
    if (!canPlaceOrder(true)) return
    if (isGuestOrderBlocked) return
    if (schoolNeedsStudent) return
    setIsOpen(false)
    handlerClickPlaceOrder && handlerClickPlaceOrder()
  }

  const handlePaymentMethodClick = (paymethod: any) => {
    setShowGateway({ closedByUser: false, open: true })
    setWebviewPaymethod(paymethod)
  }

  const onFailPaypal = async () => {
    if (showGateway.closedByUser === true) {
      await confirmCart(cart.uuid)
    }
  }

  const checkValidationFields = () => {
    setUserErrors([])
    const errors: Array<string> = []
    const userSelected = user
    const _requiredFields: Array<string> = []
    Object.values(checkoutFieldsState?.fields).map((field: any) => {
      if (options?.type === field?.order_type_id &&
        field?.enabled &&
        field?.required &&
        !notFields.includes(field?.validation_field?.code)
      ) {
        if (userSelected && !userSelected[field?.validation_field?.code]) {
          _requiredFields.push(field?.validation_field?.code)
        }
      }
    })
    const mobilePhoneField: any = Object.values(checkoutFieldsState?.fields)?.find((field: any) => field?.order_type_id === options?.type && field?.validation_field?.code === 'mobile_phone')
    if (
      userSelected &&
      !userSelected?.cellphone &&
      ((mobilePhoneField?.enabled &&
        mobilePhoneField?.required) ||
        configs?.verification_phone_required?.value === '1')
    ) {
      _requiredFields.push('cellphone')
    }
    setRequiredFields(_requiredFields)

    setUserErrors(errors)
  }

  const checkGuestValidationFields = () => {
    const userSelected = user
    const _requiredFields = checkoutFieldsState?.fields
      .filter((field: any) => (field?.order_type_id === options?.type) && field?.enabled && field?.required_with_guest &&
        !notFields.includes(field?.validation_field?.code) &&
        field?.validation_field?.code !== 'email' &&
        userSelected && !userSelected[field?.validation_field?.code])
    const requiredFieldsCode = _requiredFields.map((item: any) => item?.validation_field?.code)
    const guestCheckoutCellPhone = checkoutFieldsState?.fields?.find((field: any) => field.order_type_id === options?.type && field?.validation_field?.code === 'mobile_phone')
    const guestCheckoutEmail = checkoutFieldsState?.fields?.find((field: any) => field.order_type_id === options?.type && field?.validation_field?.code === 'email')
    if (
      userSelected &&
      !userSelected?.guest_cellphone &&
      ((guestCheckoutCellPhone?.enabled &&
        guestCheckoutCellPhone?.required_with_guest) ||
        configs?.verification_phone_required?.value === '1')
    ) {
      requiredFieldsCode.push('cellphone')
    }
    if (
      userSelected &&
      !userSelected?.guest_email &&
      guestCheckoutEmail?.enabled &&
      guestCheckoutEmail?.required_with_guest
    ) {
      requiredFieldsCode.push('email')
    }
    setRequiredFields(requiredFieldsCode)
  }

  const togglePhoneUpdate = (val: boolean) => {
    setPhoneUpdate(val)
  }

  const handleCommentFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  useEffect(() => {
    if (checkoutFieldsState?.loading || userLoading) return
    if (user?.guest_id) {
      checkGuestValidationFields()
    } else {
      checkValidationFields()
    }
  }, [checkoutFieldsState, user, options?.type])

  useEffect(() => {
    if (errors) {
      const errorText = manageErrorsToShow(errors)
      showToast(ToastType.Error, errorText)
    }
  }, [errors])

  useEffect(() => {
    if (cart?.products?.length === 0 || !userLoading) return
    if (cart?.business_id !== null) {
      onNavigationRedirect('Business', { store: cart?.business?.slug, header: null, logo: null, fromMulti: props.fromMulti })
      return
    }
    if (isGiftCardCart) {
      onNavigationRedirect('Wallets')
      return
    }
  }, [cart?.products?.length])

  useEffect(() => {
    if (cart?.products?.length > 0) {
      if (cart?.uuid && cart?.business_id === null) {
        setIsGiftCardCart(true)
      } else {
        setIsGiftCardCart(false)
      }
    }
  }, [cart?.uuid, cart?.products?.length])

  useEffect(() => {
    onFailPaypal()
  }, [showGateway.closedByUser])

  useEffect(() => {
    if (cart?.status === 2) setIsPaymentAttemptCancelled(false)
  }, [cart?.status])

  const HeaderTitle = (props: any) => {
    const { text } = props
    return (
      <OText preset="sectionTitle" mBottom={props.mb ?? 10}>
        {text}
      </OText>
    )
  }

  useEffect(() => {
    cart && events.emit('checkout_started', cart)
  }, [])

  useEffect(() => {
    if (['credomatic', 'computop'].includes(cart?.paymethod_data?.gateway)) {
      if (cart?.paymethod_data?.status === 2) {
        setShowGateway({ ...showGateway, open: true })
      } else if (['credomatic', 'computop'].includes(cart?.paymethod_data?.gateway) && cart?.paymethod_data?.status === 4) {
        setShowGateway({ ...showGateway, open: false })
      }
    }
  }, [cart?.paymethod_data])

  useEffect(() => {
    if (cart?.paymethod_id && businessDetails?.business?.paymethods) {
      const currentPaymethodId = paymethodSelected?.paymethodId || paymethodSelected?.id
      if (currentPaymethodId !== cart.paymethod_id) {
        const matched = businessDetails.business.paymethods.find(
          (pm: any) => pm.paymethod_id === cart.paymethod_id
        )
        if (matched?.paymethod?.id) {
          handlePaymethodChange({
            paymethodId: matched.paymethod.id,
            gateway: matched.paymethod.gateway,
            paymethod: {
              ...matched.paymethod,
              credentials: {
                ...matched.data
              }
            },
            data: cart?.paymethod_data,
            id: matched.paymethod.id
          })
        }
      }
    }
  }, [cart?.paymethod_id])

  useEffect(() => {
    if (!isFocused) return
    if (!cartState?.loading && (cartState?.error || typeof cartState?.cart === 'string')) {
      const error = cartState?.error || typeof cartState.cart === 'string' && cartState.cart
      if (error) {
        showToast(ToastType.Error, cartState?.error || cartState.cart)
        navigation.navigate('BottomTab', { screen: 'Home' })
      }
    }
  }, [cartState?.error, cartState?.cart, cartState?.loading, isFocused])

  useEffect(() => {
    const onBackFunction = () => {
      return handleCheckoutHardwareBack({
        isPaypalWebviewOpen: webviewPaymethod?.gateway === 'paypal' && showGateway.open,
        closePaypalWebview: () => setShowGateway({ open: false, closedByUser: true }),
        cart,
        leave: () => {
          if (navigation?.canGoBack?.()) {
            navigation.goBack()
            return
          }
          onNavigationRedirect('BottomTab')
        }
      })
    }
    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackFunction)
    return () => {
      backHandler.remove()
    }
  }, [BackHandler, webviewPaymethod?.gateway, showGateway.open, cart, navigation, onNavigationRedirect])

  useEffect(() => {
    if (shouldLeaveGiftCheckoutWhenCartMissing({ cart: orderCart, isGiftCardCart, cartState })) {
      onNavigationRedirect('BottomTab', { screen: 'Profile' })
    }
  }, [orderCart, isGiftCardCart, cartState])

  return (
    <>
      <>
        {!isGiftCardCart && !isMaweja && (
          <HeaderContent
            navigation={navigation}
          />
        )}
        <ChContainer
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          style={isMaweja ? { backgroundColor: theme.colors.backgroundPage } : undefined}
        >
          <CheckoutSectionOrder
            isMaweja={isMaweja}
            business={(
          <BusinessDetailsComponent
            showComponent={!isGiftCardCart && businessDetails?.business}
            business={businessDetails?.business}
            loading={showAddressSkeleton}
            error={businessDetails?.error}
            layout={isMaweja ? 'maweja' : undefined}
          />
            )}
            address={(
          <>
          {!isGiftCardCart && (
            <ChSection style={isMaweja ? { paddingTop: 0 } : undefined}>
              <ChAddress style={isMaweja ? { borderBottomWidth: 0, paddingBottom: 0 } : undefined}>
                {showAddressSkeleton ? (
                  <Placeholder Animation={Fade}>
                    <PlaceholderLine height={20} width={80} style={{ marginBottom: 8 }} />
                    <PlaceholderLine height={20} width={40} style={{ marginBottom: 8 }} />
                    <PlaceholderLine height={20} width={89} style={{ marginBottom: 8 }} />
                  </Placeholder>
                ) : (
                  <AddressDetails
                    cart={cart}
                    navigation={navigation}
                    location={options?.address?.location}
                    businessLogo={businessDetails?.business?.logo}
                    isCartPending={cart?.status === 2}
                    uuid={cartUuid}
                    businessCellphone={businessDetails?.business?.cellphone}
                    mapConfigs={mapConfigs}
                    layout={isMaweja ? 'maweja' : undefined}
                    HeaderTitle={<HeaderTitle text={t('DELIVERY_ADDRESS', 'Delivery address')} mb={0} />}
                  />
                )}
              </ChAddress>
            </ChSection>
          )}
          </>
            )}
            articles={(
          <SummaryComponent
            showComponent={!isGiftCardCart}
            businessId={cart?.business_id}
            loading={isInitialCartLoad}
            layout={isMaweja ? 'maweja' : undefined}
            HeaderTitle={<HeaderTitle text={t('SUMMARY', 'Summary')} mb={0} />}
            navigation={navigation}
          />
            )}
            customer={!hideCustomerDetails && (
            <ChSection style={isMaweja ? { paddingTop: 0 } : undefined}>
              <ChUserDetails style={isMaweja ? { borderBottomWidth: 0, backgroundColor: theme.colors.backgroundCard || theme.colors.white, borderRadius: 18, marginBottom: 12, paddingTop: 16, paddingHorizontal: 16, paddingBottom: 20 } : undefined}>
                {isInitialCartLoad ? (
                  <Placeholder Animation={Fade}>
                    <PlaceholderLine height={20} width={80} style={{ marginBottom: 8 }} />
                    <PlaceholderLine height={20} width={40} style={{ marginBottom: 8 }} />
                    <PlaceholderLine height={20} width={89} style={{ marginBottom: 8 }} />
                  </Placeholder>
                ) : (
                  (user?.guest_id && (!allowedGuest || !guestCheckoutAllowed)) ? (
                    <View>
                      <HeaderTitle text={t('CUSTOMER_DETAILS', 'Customer details')} />
                      <OButton
                        text={t('LOGIN', 'Login')}
                        class='primary'
                        style={{ borderRadius: 15, marginTop: 20 }}
                        onClick={() => setOpenModal({ ...openModal, login: true })}
                      />
                      <OButton
                        text={t('SIGN_UP', 'Sign up')}
                        class='secondary'
                        style={{ borderRadius: 15, marginTop: 20 }}
                        onClick={() => setOpenModal({ ...openModal, signup: true })}
                      />
                      {continueAsGuestVisible && guestCheckoutAllowed && (
                        <OButton
                          text={t('CONTINUE_AS_GUEST', 'Continue as guest')}
                          class='secondary'
                          style={{ borderRadius: 15, marginTop: 20 }}
                          onClick={() => canUseGuestCheckout() && setAllowedGuest(true)}
                        />
                      )}
                    </View>
                  ) : (
                    <>
                      <UserDetails
                        isUserDetailsEdit={isUserDetailsEdit}
                        mawejaCheckout={isMaweja}
                        HeaderTitle={isMaweja ? undefined : <HeaderTitle text={t('CUSTOMER_DETAILS', 'Customer Details')} mb={0} />}
                        cartStatus={cart?.status}
                        businessId={cart?.business_id}
                        useValidationFields
                        useDefualtSessionManager
                        useSessionUser
                        isCheckout
                        phoneUpdate={phoneUpdate}
                        togglePhoneUpdate={togglePhoneUpdate}
                        isOrderTypeValidationField
                        requiredFields={requiredFields}
                        checkoutFields={checkoutFields}
                      />
                      {isSchoolCart && (
                        <CheckoutStudentDetails cart={cart} onStudentAssigned={setAssignedStudentId} />
                      )}
                    </>
                  )
                )}
              </ChUserDetails>
            </ChSection>
          )}
            beforePay={(
          <>
          <DeliveryOptionsComponent
            showComponent={!isGiftCardCart && deliveryTypes.includes(options?.type) && !isSchoolCart}
            cartUuid={cartUuid}
            deliveryOptions={deliveryOptions}
            deliveryOptionSelected={deliveryOptionSelected}
            loading={isInitialCartLoad || instructionsOptions?.loading}
            HeaderTitle={<HeaderTitle text={t('DELIVERY_OPTIONS', 'Delivery options')} mb={0} />}
            handleChangeDeliveryOption={handleChangeDeliveryOption}
          />

          {(cart?.status === 2 || cart?.status === 4) && (
            <ChSection style={{ paddingBottom: 20 }}>
              <ChErrors style={isMaweja ? { alignItems: 'stretch' } : undefined}>
                {cart?.status === 2 && (
                  <PendingCartNotice
                    isMaweja={isMaweja}
                    isPlacedHere={placing || isCartPlacedHere}
                    paymethodName={cartPaymethod?.gateway && t(cartPaymethod.gateway.toUpperCase(), cartPaymethod?.name)}
                    isPendingCartReleasable={isPendingCartReleasable}
                    releasingPendingCart={releasingPendingCart}
                    handleReleasePendingCart={handleReleasePendingCart}
                    onOrderCreated={(order: any) => onNavigationRedirect('OrderDetails', { orderId: order.uuid, orderNumberId: order.id, isFromCheckout: true })}
                    onReleased={() => setIsPaymentAttemptCancelled(true)}
                  />
                )}
              </ChErrors>
            </ChSection>
          )}

          {cart?.reservation && cart?.business_id && options?.type === 9 && (
            <ChSection>
              <BusinessReservation
                isCheckout
                cart={cart}
                business={{
                  ...cart?.business,
                  id: cart?.business_id
                }}
                scheduleList={cart?.business?.schedule}
              />
              <Divider />
            </ChSection>
          )}
          </>
            )}
            payments={(
          <>
          {cart && cart?.status !== 2 && cart?.valid && isFreeOrder && (
            <ChSection style={isMaweja ? { paddingTop: 0 } : undefined}>
              <ChPaymethods
                style={isMaweja
                  ? { borderBottomWidth: 0, backgroundColor: theme.colors.backgroundCard || theme.colors.white, borderRadius: 18, padding: 16, marginBottom: 12 }
                  : { borderBottomWidth: 1, borderBottomColor: theme.colors.border }}
              >
                {isMaweja
                  ? <MawejaCardTitle compact icon="currency-usd" title={t('PAYMENT_METHOD', 'Payment Method')} />
                  : <HeaderTitle text={t('PAYMENT_METHOD', 'Payment Method')} mb={0} />}
                <OText style={{ marginTop: 15 }} size={14}>
                  {t('NO_PAYMENT_METHOD_NEEDED', 'No payment needed for this order.')}
                </OText>
              </ChPaymethods>
            </ChSection>
          )}

          {cart && cart?.status !== 2 && cart?.valid && !isFreeOrder && (
            <ChSection style={isMaweja ? { paddingTop: 0 } : undefined}>
              {isMaweja ? (
                <PaySection>
                  <MawejaCardTitle compact icon="currency-usd" title={t('PAYMENT_METHOD', 'Payment Method')} />
                  {cart?.status === 4 && (
                    <OText
                      style={{ textAlign: 'center', marginBottom: 8 }}
                      color={theme.colors.error}
                      size={14}
                    >
                      {cartStatusCancelMessage}
                    </OText>
                  )}
                  <PaymentOptions
                    cart={cart}
                    isDisabled={cart?.status === 2}
                    businessId={!isGiftCardCart ? businessDetails?.business?.id : -1}
                    isLoading={!isGiftCardCart ? Boolean(businessDetails?.loading && !businessDetails?.business) : false}
                    paymethods={businessDetails?.business?.paymethods}
                    onPaymentChange={handlePaymethodChange}
                    errorCash={errorCash}
                    setErrorCash={setErrorCash}
                    onNavigationRedirect={onNavigationRedirect}
                    paySelected={paymethodSelected}
                    handlePaymentMethodClickCustom={handlePaymentMethodClick}
                    handlePlaceOrder={handlePlaceOrder}
                    merchantId={merchantId}
                    urlscheme={urlscheme}
                    androidAppId={androidAppId}
                    setMethodPaySupported={setMethodPaySupported}
                    methodPaySupported={methodPaySupported}
                    placeByMethodPay={placeByMethodPay}
                    setPlaceByMethodPay={setPlaceByMethodPay}
                    cardList={cardList}
                    setCardList={setCardList}
                    requiredFields={requiredFields}
                    openUserModal={setIsOpen}
                    paymethodClicked={paymethodClicked}
                    setPaymethodClicked={setPaymethodClicked}
                    setUserHasCards={setUserHasCards}
                    handleOpenGuestSignup={handleOpenGuestSignup}
                    guestDisabledError={isGuestOrderBlocked}
                    returnUrl={`${urlscheme}://checkout/${cart?.uuid}`}
                    globalPayIFrameUrl={globalPayIFrameUrl}
                    braintreeIFrameUrl={braintreeIFrameUrl}
                    cybersourceIFrameUrl={cybersourceIFrameUrl}
                    createBusinessUserPaymethod={createBusinessUserPaymethod}
                    showGateway={showGateway}
                    setShowGateway={setShowGateway}
                    layout="maweja"
                  />
                </PaySection>
              ) : (
              <ChPaymethods
                style={{ borderBottomWidth: 1, borderBottomColor: theme.colors.border }}
              >
                <HeaderTitle text={t('PAYMENT_METHOD', 'Payment Method')} mb={0} />
                {cart?.status === 4 && (
                  <OText
                    style={{ textAlign: 'center', marginTop: 20 }}
                    color={theme.colors.error}
                    size={17}
                  >
                    {cartStatusCancelMessage}
                  </OText>
                )}
                <PaymentOptions
                  cart={cart}
                  isDisabled={cart?.status === 2}
                  businessId={!isGiftCardCart ? businessDetails?.business?.id : -1}
                  isLoading={!isGiftCardCart ? Boolean(businessDetails?.loading && !businessDetails?.business) : false}
                  paymethods={businessDetails?.business?.paymethods}
                  onPaymentChange={handlePaymethodChange}
                  errorCash={errorCash}
                  setErrorCash={setErrorCash}
                  onNavigationRedirect={onNavigationRedirect}
                  paySelected={paymethodSelected}
                  handlePaymentMethodClickCustom={handlePaymentMethodClick}
                  handlePlaceOrder={handlePlaceOrder}
                  merchantId={merchantId}
                  urlscheme={urlscheme}
                  androidAppId={androidAppId}
                  setMethodPaySupported={setMethodPaySupported}
                  methodPaySupported={methodPaySupported}
                  placeByMethodPay={placeByMethodPay}
                  setPlaceByMethodPay={setPlaceByMethodPay}
                  cardList={cardList}
                  setCardList={setCardList}
                  requiredFields={requiredFields}
                  openUserModal={setIsOpen}
                  paymethodClicked={paymethodClicked}
                  setPaymethodClicked={setPaymethodClicked}
                  setUserHasCards={setUserHasCards}
                  handleOpenGuestSignup={handleOpenGuestSignup}
                  guestDisabledError={isGuestOrderBlocked}
                  returnUrl={`${urlscheme}://checkout/${cart?.uuid}`}
                  globalPayIFrameUrl={globalPayIFrameUrl}
                  braintreeIFrameUrl={braintreeIFrameUrl}
                  cybersourceIFrameUrl={cybersourceIFrameUrl}
                  createBusinessUserPaymethod={createBusinessUserPaymethod}
                  showGateway={showGateway}
                  setShowGateway={setShowGateway}
                />
              </ChPaymethods>
              )}
            </ChSection>
          )}
          </>
            )}
            wallet={(
          <>
          {cart && !isMaweja && isWalletEnabled && businessDetails?.business?.configs && (
            <WalletPaymentOptionContainer>
              <HeaderTitle text={t('WALLETS', 'Wallets')} mb={0} />
              <PaymentOptionWallet
                cart={cart}
                loyaltyPlansState={loyaltyPlansState}
                businessId={cart?.business_id}
                businessConfigs={businessDetails?.business?.configs}
              />
            </WalletPaymentOptionContainer>
          )}
          </>
            )}
            afterWallet={(
          <>
          {driverTipsField &&
            (
              <ChSection style={isMaweja ? { paddingTop: 0 } : undefined}>
                {isMaweja ? (
                  <Card>
                    <CardBody>
                      <ChDriverTips>
                        <HeaderTitle text={t('DRIVER_TIPS', 'Driver Tips')} mb={0} />
                        <DriverTips
                          uuid={cartUuid}
                          businessId={cart?.business_id}
                          driverTipsOptions={driverTipsOptions}
                          isFixedPrice={parseInt(configs?.driver_tip_type?.value, 10) === 1}
                          isDriverTipUseCustom={!!parseInt(configs?.driver_tip_use_custom?.value, 10)}
                          driverTip={parseInt(configs?.driver_tip_type?.value, 10) === 1
                            ? cart?.driver_tip
                            : cart?.driver_tip_rate}
                          useOrderContext
                          cart={cart}
                        />
                      </ChDriverTips>
                    </CardBody>
                  </Card>
                ) : (
                <ChDriverTips>
                  <HeaderTitle text={t('DRIVER_TIPS', 'Driver Tips')} mb={0} />
                  <DriverTips
                    uuid={cartUuid}
                    businessId={cart?.business_id}
                    driverTipsOptions={driverTipsOptions}
                    isFixedPrice={parseInt(configs?.driver_tip_type?.value, 10) === 1}
                    isDriverTipUseCustom={!!parseInt(configs?.driver_tip_use_custom?.value, 10)}
                    driverTip={parseInt(configs?.driver_tip_type?.value, 10) === 1
                      ? cart?.driver_tip
                      : cart?.driver_tip_rate}
                    useOrderContext
                    cart={cart}
                  />
                </ChDriverTips>
                )}
                {!isMaweja && <Divider />}
              </ChSection>
            )}

          {placeSpotsEnabled && !isGiftCardCart && (
            <>
              <Divider />
              <PlaceSpot
                isCheckout
                isInputMode
                cart={cart}
                spotNumberDefault={cartState?.cart?.spot_number ?? cart?.spot_number}
                setPlaceSpotNumber={setPlaceSpotNumber}
                vehicleDefault={cart?.vehicle}
              />
              <Divider />
            </>
          )}

          {cart && (reservationSetting?.allow_preorder_reservation || !cart?.reservation || Number(cart?.total) > 0) && (
            <ChSection style={{ paddingTop: 0 }}>
              <ChCart style={isMaweja ? { paddingBottom: 0 } : undefined}>
                {cartsWithProducts?.length > 0 && cart?.products?.length === 0 && !cart?.reservation ? (
                  <NotFoundSource
                    content={t('NOT_FOUND_CARTS', 'Sorry, You don\'t seem to have any carts.')}
                    btnTitle={t('SEARCH_REDIRECT', 'Go to Businesses')}
                  />
                ) : (
                  <OrderSummary
                    cart={cart}
                    hideProducts
                    hideTotal={!isGiftCardCart}
                    isCartPending={cart?.status === 2}
                    onNavigationRedirect={onNavigationRedirect}
                    commentDelayTime={commentDelayTime}
                    placeSpotTypes={placeSpotTypes}
                    businessConfigs={businessConfigs}
                    maxDate={maxDate}
                    loyaltyRewardRate={
                      creditPointPlanOnBusiness?.accumulation_rate ??
                      (!!creditPointPlanOnBusiness && creditPointPlan?.accumulation_rate) ?? 0
                    }
                    hideCommentsByValidationCheckout={!guestCheckoutComment?.enabled}
                    hideCouponByValidationCheckout={!guestCheckoutCoupon?.enabled}
                    onCommentFocus={handleCommentFocus}
                    layout={isMaweja ? 'maweja' : undefined}
                    businessName={businessDetails?.business?.name}
                    deliveryTime={deliveryTypes.includes(options?.type)
                      ? businessDetails?.business?.delivery_time
                      : businessDetails?.business?.pickup_time}
                  />
                )}
              </ChCart>
            </ChSection>
          )}
          </>
            )}
          />

          {cart && (
            <View>
              <ChErrors style={{ marginBottom: Platform.OS === 'ios' ? 35 : 10, ...(isMaweja ? { alignItems: 'stretch' } : {}) }}>
                {!cart?.valid_address && cart?.status !== 2 && (
                  cartMessage(t('INVALID_CART_ADDRESS', 'Selected address is invalid, please select a closer address.'))
                )}

                {(!paymethodSelected && cart?.balance > 0) && cart?.status !== 2 && cart?.valid && (
                  cartMessage(t('WARNING_NOT_PAYMENT_SELECTED', 'Please, select a payment method to place order.'))
                )}

                {!cart?.valid_products && cart?.status !== 2 && cart?.total !== 0 && (
                  cartMessage(t('WARNING_INVALID_PRODUCTS_CHECKOUT', 'To continue with your checkout, please remove from your cart the products that are not available.'))
                )}
                {cart?.valid_preorder !== undefined && !cart?.valid_preorder && (
                  cartMessage(t('INVALID_CART_MOMENT', 'Selected schedule time is invalid, please select a schedule into the business schedule interval.'))
                )}
                {validateDriverTipField && !isGiftCardCart &&
                  cartMessage(t('WARNING_INVALID_DRIVER_TIP', 'Driver Tip is required.'))}
                {validateCommentsCartField && (
                  cartMessage(t('WARNING_INVALID_CART_COMMENTS', 'Cart comments is required.'))
                )}

                {validateZipcodeCard && (
                  cartMessage(t('WARNING_CARD_ZIPCODE_REQUIRED', 'Your card selected has not zipcode'))
                )}

                {validateCardRequired && cart?.status !== 2 && (
                  cartMessage(t('WARNING_CARD_REQUIRED', 'Please, add a card to place your order.'))
                )}

                {validateRequiredCardSelection && cart?.status !== 2 && (
                  cartMessage(t('WARNING_CARD_SELECTION_REQUIRED', 'Please, select a card to place your order.'))
                )}

                {validateCouponField &&
                  cartMessage(t('WARNING_INVALID_COUPON_FIELD', 'Coupon is required.'))}
                {isGuestOrderBlocked && (
                  cartMessage(t('LOGIN_SIGN_UP_COMPLETE_ORDER', 'Login/Sign up to complete your order.'))
                )}
              </ChErrors>
            </View>
          )}
          <OModal
            open={openChangeStore}
            onClose={() => setOpenChangeStore(false)}
          >
            <CartStoresListing
              cartuuid={cart?.uuid}
              onClose={() => setOpenChangeStore(false)}
            />
          </OModal>
          <OModal
            open={isOpen}
            onClose={() => setIsOpen(false)}
            showToastInsideModal
          >
            <DetailWrapper>
              <UserDetails
                isUserDetailsEdit
                cartStatus={cart?.status}
                businessId={cart?.business_id}
                useDefualtSessionManager
                useSessionUser
                isCheckout
                isEdit
                phoneUpdate={phoneUpdate}
                togglePhoneUpdate={togglePhoneUpdate}
                isOrderTypeValidationField
                requiredFields={requiredFields}
                checkoutFields={checkoutFields}
                isCheckoutPlace
                hideUpdateButton
                handlePlaceOrderAsGuest={handlePlaceOrderAsGuest}
                onClose={() => {
                  if (!canPlaceOrder()) return
                  setIsOpen(false)
                  if (paymethodClicked) {
                    setPaymethodClicked({
                      ...paymethodClicked,
                      confirmed: true
                    })
                  } else {
                    handlePlaceOrder(null, true)
                  }
                }}
                setIsOpen={setIsOpen}
              />
            </DetailWrapper>
          </OModal>
          <OModal
            open={openModal.signup}
            onClose={() => setOpenModal({ ...openModal, signup: false, isGuest: false })}
            showToastInsideModal
          >
            <ScrollView style={{ paddingHorizontal: 20, width: '100%' }}>
              <SignupForm
                handleSuccessSignup={handleSuccessSignup}
                isGuest
                signupButtonText={t('SIGNUP', 'Signup')}
                useSignupByEmail
                useChekoutFileds
              />
            </ScrollView>
          </OModal>
          <OModal
            open={openModal.login}
            onClose={() => setOpenModal({ ...openModal, login: false })}
            showToastInsideModal
          >
            <CheckoutLoginForm
              navigation={navigation}
              theme={theme}
              t={t}
              onSuccessLogin={handleSuccessLogin}
              onCloseLogin={() => setOpenModal({ ...openModal, login: false })}
              onOpenSignup={() => setOpenModal({ login: false, signup: true, isGuest: true })}
            />
          </OModal>
        </ChContainer>
      </>
      {cart && cart?.status !== 2 && (
        <FloatingButton
          text={schoolNeedsStudent
            ? t('SCHOOL_SELECT_STUDENT', 'Select a student')
            : !cart?.valid_maximum
              ? (
                `${t('MAXIMUM_SUBTOTAL_ORDER', 'Maximum subtotal order')}: ${parsePrice(cart?.maximum)}`
              )
              : (!cart?.valid_minimum && !(cart?.discount_type === 1 && cart?.discount_rate === 100))
                ? (
                  `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(cart?.minimum)}`
                )
                : placing
                  ? t('PLACING', 'Placing')
                  : options?.type === 9
                    ? t('PLACE_RESERVATION', 'Place Reservation')
                    : t('PLACE_ORDER', 'Place Order')
          }
          loading={placing}
          reverseOrder
          flexDirection='row'
          disabled={isDisabledButtonPlace}
          secondElement={isFreeOrder
            ? undefined
            : (
            <View>
              <OText>
                {t('ORDER_TOTAL', 'Order total')}
              </OText>
              <OText size={20} weight='bold'>
                {parsePrice(cart?.balance ?? cart?.total)}
              </OText>
            </View>
              )}
          handleClick={isDisabledButtonPlace
            ? () => vibrateApp()
            : methodsPay.includes(paymethodSelected?.gateway)
              ? () => setPlaceByMethodPay(true)
              : () => handlePlaceOrder(null)}
        />
      )}
      {webviewPaymethod?.gateway === 'paypal' && showGateway.open && (
        <PaymentOptionsWebView
          onNavigationRedirect={onNavigationRedirect}
          uri={`${ordering.root}/html/paypal_react_native`}
          user={user}
          token={token}
          cart={cart}
          currency={currency}
          webviewPaymethod={webviewPaymethod}
          setShowGateway={setShowGateway}
        />
      )}
      {webviewPaymethod?.gateway === 'square' && showGateway.open && (
        <PaymentOptionsWebView
          onNavigationRedirect={onNavigationRedirect}
          uri={`https://test-square-f50f7.web.app`}
          user={user}
          token={token}
          cart={cart}
          currency={currency}
          webviewPaymethod={webviewPaymethod}
          setShowGateway={setShowGateway}
          locationId={'L1NGAY5M6KJRX'}
        />
      )}
      {cart?.paymethod_data?.gateway === 'credomatic' && cart?.paymethod_data?.status === 2 && showGateway.open && (
        <PaymentOptionsWebView
          title={t('CREDOMATIC_PAYMENT', 'Credomatic payment')}
          onNavigationRedirect={onNavigationRedirect}
          uri={credomaticUrl}
          user={user}
          cart={cart}
          additionalParams={{
            type: 'auth',
            key_id: credomaticKeyId,
            hash: cart?.paymethod_data?.result?.hash,
            time: cart?.paymethod_data?.result?.time,
            amount: cart?.total,
            orderid: cart?.uuid,
            ccnumber: cardList?.cards?.[0]?.number,
            ccexp: cardList?.cards?.[0]?.expiryString,
            cvv: cardList?.cards?.[0]?.cvc,
            redirect: credomaticUrl
          }}
          webviewPaymethod={webviewPaymethod}
          setShowGateway={setShowGateway}
        />
      )}
      {cart?.paymethod_data?.gateway === 'computop' && cart?.paymethod_data?.status === 2 && showGateway.open && (
        <PaymentOptionsWebView
          isAvoidRerender
          title={t('COMPUTOP_PAYMENT', 'Computop payment')}
          onNavigationRedirect={onNavigationRedirect}
          uri={`https://integrations.ordering.co/computop_paymethod/views/payment_form.html?title=${t('COMPUTOP_PAYMENT', 'Computop payment')}&body=${t('COMPUTOP_PROCESSING', 'Processing transaction')}`}
          user={user}
          cart={cart}
          additionalParams={cart?.paymethod_data?.result}
          webviewPaymethod={webviewPaymethod}
          setShowGateway={setShowGateway}
        />
      )}
    </>
  )
}

export { handleCheckoutHardwareBack } from './handleCheckoutHardwareBack'

export const Checkout = (props: any) => {
  const {
    errors,
    clearErrors,
    cartUuid,
    stripePaymentOptions,
    onNavigationRedirect,
  } = props

  const [, { showToast }] = useToast();
  const [, t] = useLanguage();
  const [{ token }] = useSession();
  const [ordering] = useApi();
  const [orderState, { confirmCart, setStateValues }] = useOrder();
  const { confirmPayment } = useConfirmPayment();

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [cartState, setCartState] = useState<any>({ loading: true, error: null, cart: null });
  const isFocused = useIsFocused();
  const getOrderInFlightRef = useRef<string | null>(null);
  const lastGetOrderAtRef = useRef(0);
  const hasCartLoadedRef = useRef(false);

  const fetchCartFromApi = async (cartId: string) => {
    const url = `${ordering.root}/carts/${cartId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const content = await response.json();
    return content.result;
  };

  const normalizeCartResult = (result: any) => {
    if (!result || Array.isArray(result)) return result;
    const parsedPaymethodData = parseCartPaymethodData(result);
    if (!parsedPaymethodData) return result;
    return { ...result, paymethod_data: parsedPaymethodData };
  };

  const getOrder = async (cartId: any) => {
    if (!cartId) return

    const now = Date.now()
    if (getOrderInFlightRef.current === cartId) return
    if (hasCartLoadedRef.current && now - lastGetOrderAtRef.current < GET_ORDER_COOLDOWN_MS) return

    getOrderInFlightRef.current = cartId
    lastGetOrderAtRef.current = now

    try {
      setCartState((prev: any) => {
        if (prev.cart) {
          hasCartLoadedRef.current = true
          return prev
        }
        return { ...prev, loading: true }
      });
      const cartsWithProducts = orderState?.carts && (Object.values(orderState?.carts)?.filter((cart: any) => cart?.products && cart?.products?.length) || null);
      const cartInState = cartsWithProducts?.find((cart: any) => cart.uuid === cartId);

      let result = cartInState?.status === 2
        ? await fetchCartFromApi(cartId)
        : cartInState ?? await fetchCartFromApi(cartId);

      result = normalizeCartResult(result);

      if (!result || Array.isArray(result)) {
        setCartState({ loading: false, cart: null, error: ['Cart not found'] });
        return;
      }

      const giftPatch = giftCartStatePatch(result)
      if (giftPatch) {
        setStateValues({ carts: giftPatch })
      }

      const publicKey = await getPublicKey(result.paymethod_data?.gateway);

      if (result.status === 1 && result.order?.uuid) {
        onNavigationRedirect('OrderDetails', { orderId: result.order.uuid, orderNumberId: result.order.id, isFromCheckout: true });
        setCartState((prev: any) => ({ ...prev, loading: false }));
        return;
      }

      const paymethodDataStatus = result.paymethod_data?.status;
      if (result.status === 2 || paymethodDataStatus === 2) {
        await handleStatusTwo(result, publicKey);
        return;
      }

      hasCartLoadedRef.current = true
      setCartState({
        loading: false,
        cart: result,
        error: null
      });

    } catch (e: any) {
      setCartState((prev: any) => ({
        loading: false,
        error: [e.toString()],
        cart: prev.cart ?? null
      }));
    } finally {
      if (getOrderInFlightRef.current === cartId) {
        getOrderInFlightRef.current = null
      }
    }
  };

  const getPublicKey = async (gateway?: string) => {
    try {
      const { content } = await ordering.setAccessToken(token).paymentCards(undefined, undefined, null, getCardsGateway(gateway)).getCredentials();
      return content.error ? null : content.result.publishable;
    } catch {
      return null;
    }
  };

  const handleStatusTwo = async (result: any, publicKey: string) => {
    const gateway = result.paymethod_data?.gateway;
    const isRedirectGateway = REDIRECT_PAYMETHODS.includes(gateway);
    const isRedirectAction = result.paymethod_data?.result?.action?.type === 'redirect';

    if (isRedirectGateway || isRedirectAction) {
      await handleRedirectPaymethod(result);
      return;
    }

    if (stripePaymentOptions.includes(gateway)) {
      await handleStripePayment(result, publicKey);
      return;
    }

    hasCartLoadedRef.current = true
    setCartState({
      loading: false,
      cart: result,
      error: null
    });
  };

  const handleRedirectPaymethod = async (result: any) => {
    try {
      const confirmCartRes = await confirmCart(cartUuid);
      if (confirmCartRes.error) {
        const response = await fetch(`${ordering.root}/orders/${cartUuid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        const orderResult = await response.json();
        if (orderResult.error) {
          showToast(ToastType.Error, confirmCartRes.error.message || confirmCartRes.result?.[0]);
          setCartState({ loading: false, cart: result, error: null });
        } else {
          onNavigationRedirect('OrderDetails', { orderId: orderResult?.result?.uuid, orderNumberId: orderResult?.result?.id, isFromCheckout: true });
          setCartState({ loading: false, cart: result, error: null });
        }
      } else if (confirmCartRes.result.order?.uuid) {
        onNavigationRedirect('OrderDetails', { orderId: confirmCartRes.result.order.uuid, orderNumberId: confirmCartRes.result.order.id, isFromCheckout: true });
        setCartState({ loading: false, cart: result, error: null });
      } else {
        setCartState({ loading: false, cart: result, error: null });
      }
    } catch (err: any) {
      showToast(ToastType.Error, err?.toString() || err.message);
      setCartState({ loading: false, cart: result, error: null });
    }
  };

  const handleStripePayment = async (result: any, publicKey: string) => {
    const clientSecret = result.paymethod_data?.result?.client_secret;
    const paymentMethodId = result.paymethod_data?.data?.source_id;

    initStripe({ publishableKey: publicKey });

    try {
      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          paymentMethodId
        }
      });

      const confirmCartRes = await confirmCart(cartUuid);
      if (confirmCartRes.error) {
        showToast(ToastType.Error, confirmCartRes.error.message);
        setCartState({
          ...cartState,
          loading: false,
          cart: result
        });
        return;
      }

      if (confirmCartRes.result.order?.uuid) {
        onNavigationRedirect('OrderDetails', { orderId: confirmCartRes.result.order.uuid, orderNumberId: confirmCartRes.result.order.id, isFromCheckout: true });
        setCartState({ ...cartState, loading: false });
      } else {
        showToast(ToastType.Error, t('FAILED_PAYMENT', 'The payment has failed'));
        setCartState({
          ...cartState,
          loading: false,
          cart: Array.isArray(result) ? null : result,
          error: result ? null : result
        });
      }
    } catch (error: any) {
      showToast(ToastType.Error, t('FAILED_PAYMENT', 'The payment has failed'));
      setCartState({
        ...cartState,
        loading: false,
        cart: Array.isArray(result) ? null : result,
        error: result ? null : result
      });
    }
  };

  useEffect(() => {
    if (errors) {
      const errorText = manageErrorsToShow(errors)
      showToast(ToastType.Error, errorText)
      clearErrors && clearErrors()
    }
  }, [errors])


  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    hasCartLoadedRef.current = false
    lastGetOrderAtRef.current = 0
    getOrderInFlightRef.current = null
  }, [cartUuid])

  useEffect(() => {
    if (token && cartUuid && appStateVisible === 'active' && isFocused) {
      getOrder(cartUuid)
    }
  }, [token, cartUuid, appStateVisible, isFocused])

  const checkoutProps = {
    ...props,
    UIComponent: CheckoutUI,
    cartState,
    uuid: cartUuid
  }

  return (
    <>
      {!cartUuid && !cartState.cart ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <NotFoundSource
            content={t('CHECKOUT_CART_NOT_FOUND', 'We could not load your order. Please go back and try again.')}
            btnTitle={t('GO_BACK', 'Go back')}
            onClickButton={() => onNavigationRedirect('BottomTab')}
          />
        </View>
      ) : (
        <>
          {cartState.loading && !cartState.cart && (
            <View style={{ flex: 1 }}>
              <Placeholder Animation={Fade}>
                <PlaceholderLine height={20} width={80} style={{ marginBottom: 8, marginTop: 20, marginHorizontal: 20 }} />
                <PlaceholderLine height={20} width={60} style={{ marginBottom: 8, marginHorizontal: 20 }} />
                <PlaceholderLine height={50} width={90} style={{ marginBottom: 16, marginHorizontal: 20 }} />
                <PlaceholderLine height={20} width={70} style={{ marginBottom: 8, marginHorizontal: 20 }} />
                <PlaceholderLine height={50} width={90} style={{ marginBottom: 16, marginHorizontal: 20 }} />
              </Placeholder>
            </View>
          )}
          {cartState.cart && cartState.cart?.status !== 1 && (
            <CheckoutController {...checkoutProps} />
          )}
        </>
      )}
    </>
  )
}
