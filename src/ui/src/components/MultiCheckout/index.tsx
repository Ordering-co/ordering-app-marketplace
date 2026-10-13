/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { View, StyleSheet, ScrollView, AppState } from 'react-native'
import ReactNativeHapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components/native';

import {
  ChContainer,
  ChSection,
  ChHeader,
  CHMomentWrapper,
  ChUserDetails,
  ChAddress,
  ChCarts,
  CartsHeader,
  CCNotCarts,
  ChCartsTotal,
  ChErrors
} from './styles'

import {
  useLanguage,
  useConfig,
  useUtils,
  useOrder,
  useValidationFields,
  useSession,
  useToast,
  ToastType,
  MultiCheckout as MultiCheckoutController
} from '@components'

import { getTypesText } from '../../utils';
import { OSBill } from '../OrderSummary/styles';
import { Container } from '../../layouts/Container';
import { DriverTipsContainer } from '../Cart/styles'
import { MultiCart as MultiCartController } from '../MultiCart'
import { MultiCartsPaymethodsAndWallets } from '../MultiCartsPaymethodsAndWallets'
import { CheckoutLoginForm } from '../Checkout/CheckoutLoginForm'
import { parseDriverTipOptions } from '../Checkout/parseDriverTipOptions'
import { isStripeDirectMissingSource } from '../Checkout/isStripeDirectMissingSource'
import { CheckoutStudentDetails } from '../CheckoutStudentDetails'
import { doesAnySchoolCartNeedStudent, isSchoolCart } from '../CheckoutStudentDetails/schoolCartStudent'
import { useBusinessVerticals } from '../../hooks/useBusinessVerticals'

import {
  OText,
  OIcon,
  OModal,
  OButton,
  UserDetails,
  AddressDetails,
  Cart,
  FloatingButton,
  DriverTips,
  CouponControl,
  SignupForm
} from '@ui'

const mapConfigs = {
  mapZoom: 16,
  mapSize: {
    width: 640,
    height: 190
  }
}

const pickupTypes = [2, 8]

const MultiCheckoutUI = (props: any) => {
  const {
    navigation,
    placing,
    openCarts,
    handleGroupPlaceOrder,
    paymethodSelected,
    handleSelectPaymethod,
    handleSelectWallet,
    handlePaymethodDataChange,
    cartUuid,
    loyaltyPlansState,
    totalCartsFee,
    cartGroup,
    walletState,
    onNavigationRedirectReplace,
    merchantId,
    cartsInvalid,
    checkoutFieldsState,
    showGateway,
    getMultiCart
  } = props

  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = StyleSheet.create({
    pagePadding: {
      paddingLeft: 20,
      paddingRight: 20
    },
    pageBottom: {
      marginBottom: 100 + insets.bottom
    },
    wrapperNavbar: {
      paddingHorizontal: 20,
      backgroundColor: theme?.colors?.white,
      borderWidth: 0
    },
    detailWrapper: {
      paddingHorizontal: 20,
      width: '100%'
    },
  })

  const [, { showToast }] = useToast();
  const [, t] = useLanguage()
  const [{ configs }] = useConfig();
  const [{ parsePrice, parseDate, timeFormat, preorderDateFormat }] = useUtils();
  const [{ options, carts, loading }] = useOrder();
  const [validationFields] = useValidationFields();
  const [{ user, loading: userLoading }, { login }] = useSession()
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const notFields = ['coupon', 'driver_tip', 'mobile_phone', 'address', 'zipcode', 'address_notes', 'comments']
  const configTypes = configs?.order_types_allowed?.value.split('|').map((value: any) => Number(value)) || []
  const isPreOrder = configs?.preorder_status_enabled?.value === '1'
  const isMultiDriverTips = configs?.checkout_multi_business_enabled?.value === '1'
  const isGuestCheckoutEnabled = configs?.guest_checkout_enabled?.value === '1'

  const walletCarts = (Object.values(carts)?.filter((cart: any) => cart?.products && cart?.products?.length && cart?.status !== 2 && cart?.valid_schedule && cart?.valid_products && cart?.valid_address && cart?.valid_maximum && cart?.valid_minimum && cart?.wallets?.length > 0) || null) || []
  const cartsToShow = openCarts?.length > 0 ? openCarts : cartsInvalid
  const walletName: any = {
    cash: {
      name: t('PAY_WITH_CASH_WALLET', 'Pay with Cash Wallet'),
    },
    credit_point: {
      name: t('PAY_WITH_CREDITS_POINTS_WALLET', 'Pay with Credit Points Wallet'),
    }
  }

  const totalCartsPrice = cartGroup?.result?.balance

  const driverTipsOptions = parseDriverTipOptions(configs?.driver_tip_options?.value)
  const allowDriverTipPickup = configs?.driver_tip_allowed_at_pickup?.value === '1' && pickupTypes.includes(options?.type)
  const creditPointGeneralPlan = loyaltyPlansState?.result?.find((loyal: any) => loyal.type === 'credit_point')
  const loyalBusinessAvailable = creditPointGeneralPlan?.businesses?.filter((b: any) => b.accumulates) ?? []
  const checkoutFields = useMemo(() => checkoutFieldsState?.fields?.filter((field: any) => field.order_type_id === options?.type), [checkoutFieldsState, options])
  const accumulationRateBusiness = (businessId: number) => {
    const value = loyalBusinessAvailable?.find((loyal: any) => loyal.business_id === businessId)?.accumulation_rate ?? 0
    return value || (creditPointGeneralPlan?.accumulation_rate ?? 0)
  }

  const getIncludedTaxes = (cart: any) => {
    if (cart?.taxes === null || !cart?.taxes) {
      return cart.business.tax_type === 1 ? cart?.tax : 0
    } else {
      return cart?.taxes.reduce((taxIncluded: number, tax: any) => {
        return taxIncluded + (tax.type === 1 ? tax.summary?.tax : 0)
      }, 0)
    }
  }

  const clearAmount = (value: any) => parseFloat((Math.trunc(value * 100) / 100).toFixed(configs.format_number_decimal_length?.value ?? 2))

  const loyaltyRewardValue = openCarts
    ?.reduce((sum: any, cart: any) => sum + clearAmount((cart?.subtotal + getIncludedTaxes(cart)) * accumulationRateBusiness(cart?.business_id)), 0)
    ?.toFixed(configs.format_number_decimal_length?.value ?? 2)

  const [, setShowTitle] = useState(false)
  const [isUserDetailsEdit, setIsUserDetailsEdit] = useState(false);
  const [phoneUpdate, setPhoneUpdate] = useState(false);
  const [userErrors, setUserErrors] = useState<any>([]);
  const [cartsOpened, setCartsOpened] = useState<any>([])
  const [placeByMethodPay, setPlaceByMethodPay] = useState(false)
  const [allowedGuest, setAllowedGuest] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [requiredFields, setRequiredFields] = useState<any>([])
  const stripePaymethods: any = ['stripe', 'stripe_direct', 'stripe_connect', 'stripe_redirect']
  const [openModal, setOpenModal] = useState({ login: false, signup: false, isGuest: false })
  const [methodPaySupported, setMethodPaySupported] = useState({ enabled: false, message: null, loading: true })
  const methodsPay = ['global_google_pay', 'global_apple_pay']
  const [assignedStudents, setAssignedStudents] = useState<Record<string, any>>({})
  const businessVerticals = useBusinessVerticals((openCarts || []).map((cart: any) => cart?.business_id))
  const studentCarts = (openCarts || []).map((cart: any) => {
    const contextCart = carts?.[`businessId:${cart?.business_id}`]
    return {
      ...cart,
      business: {
        ...cart?.business,
        vertical: cart?.business?.vertical ?? contextCart?.business?.vertical ?? businessVerticals[String(cart?.business_id)],
        slug: cart?.business?.slug ?? contextCart?.business?.slug
      },
      student_id: cart?.student_id ?? contextCart?.student_id ?? null,
      student: cart?.student ?? contextCart?.student
    }
  })
  const studentCartByUuid: Record<string, any> = Object.fromEntries(studentCarts.map((cart: any) => [cart.uuid, cart]))
  const schoolNeedsStudent = doesAnySchoolCartNeedStudent(studentCarts, assignedStudents)
  const handleStudentAssigned = (uuid: string, studentId: any) => {
    setAssignedStudents((prev) => ({ ...prev, [uuid]: studentId }))
  }
  const isDisablePlaceOrderButton = cartGroup?.loading || placing || (!(paymethodSelected?.paymethod_id || paymethodSelected?.wallet_id) && cartGroup?.result?.balance > 0) ||
    (paymethodSelected?.paymethod?.gateway === 'stripe' && !paymethodSelected?.paymethod_data) ||
    isStripeDirectMissingSource({
      gateway: paymethodSelected?.paymethod?.gateway ?? paymethodSelected?.gateway,
      paymethodData: paymethodSelected?.paymethod_data ?? paymethodSelected?.data,
      cartPaymethodData: cartGroup?.result?.paymethod_data
    }) ||
    schoolNeedsStudent ||
    walletCarts.length > 0
    || (methodsPay.includes(paymethodSelected?.gateway) && (!methodPaySupported.enabled || methodPaySupported.loading)) || openCarts?.length === 0 ||
    (!isGuestCheckoutEnabled && !!user?.guest_id)

  const vibrateApp = (impact?: HapticFeedbackTypes) => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false
    }
    ReactNativeHapticFeedback.trigger(impact || 'impactLight', options)
  }

  const handleMomentClick = () => {
    if (isPreOrder) {
      navigation.navigate('MomentOption')
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
        userSelected && !userSelected[field?.validation_field?.code])
    const requiredFieldsCode = _requiredFields.map((item: any) => item?.validation_field?.code)
    const guestCheckoutCellPhone = checkoutFieldsState?.fields?.find((field: any) => field.order_type_id === options?.type && field?.validation_field?.code === 'mobile_phone')
    if (
      userSelected &&
      !userSelected?.cellphone &&
      ((guestCheckoutCellPhone?.enabled &&
        guestCheckoutCellPhone?.required_with_guest) ||
        configs?.verification_phone_required?.value === '1')
    ) {
      requiredFieldsCode.push('cellphone')
    }
    setRequiredFields(requiredFieldsCode)
  }

  const togglePhoneUpdate = (val: boolean) => {
    setPhoneUpdate(val)
  }

  const handlePlaceOrder = (confirmPayment?: any) => {
    if (schoolNeedsStudent) return
    if (stripePaymethods.includes(paymethodSelected?.gateway) && user?.guest_id) {
      setOpenModal({ ...openModal, signup: true, isGuest: true })
      return
    }

    if (!userErrors.length && !requiredFields?.length) {
      handleGroupPlaceOrder && handleGroupPlaceOrder(confirmPayment)
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
    if (schoolNeedsStudent) return
    setIsOpen(false)
    handleGroupPlaceOrder && handleGroupPlaceOrder()
  }

  const handleSuccessSignup = (user: any) => {
    login({
      user,
      token: user?.session?.access_token
    })
    openModal?.isGuest && handlePlaceOrderAsGuest()
    setOpenModal({ ...openModal, signup: false, isGuest: false })
  }

  const handleSuccessLogin = (user: any) => {
    if (user) setOpenModal({ ...openModal, login: false })
  }

  const handleScroll = ({ nativeEvent: { contentOffset } }: any) => {
    setShowTitle(contentOffset.y > 30)
  }

  useEffect(() => {
    if (checkoutFieldsState?.loading || userLoading) return
    if (user?.guest_id) {
      checkGuestValidationFields()
    } else {
      checkValidationFields()
    }
  }, [checkoutFieldsState, user, options?.type])

  useEffect(() => {
    if (cartsToShow?.length === 1) {
      onNavigationRedirectReplace('CheckoutPage', {
        cartUuid: cartsToShow[0]?.uuid,
        fromMulti: true
      })
      return
    }
  }, [cartsToShow])

  useEffect(() => {
    if (walletState.error) {
      showToast(ToastType.Error, t(walletState.error, walletState.error?.[0]?.replace(/_/g, ' ')))
    }
  }, [walletState.error])

  useEffect(() => {
    if (!cartUuid) {
      onNavigationRedirectReplace('Cart')
    }
  }, [cartUuid])

  useEffect(() => {
    if (paymethodSelected?.gateway === 'global_google_pay') {
      setMethodPaySupported({
        enabled: true,
        loading: false,
        message: null
      })
    }
  }, [paymethodSelected])

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
    if (appStateVisible === 'active' && cartUuid) {
      getMultiCart(true)
    }
  }, [appStateVisible, showGateway.open])

  const contextDriverTips = openCarts.map((cart: any) => Number(carts?.[`businessId:${cart?.business_id}`]?.driver_tip ?? 0)).join('|')
  const groupDriverTips = openCarts.map((cart: any) => Number(cart?.driver_tip ?? 0)).join('|')

  useEffect(() => {
    if (loading || cartGroup?.loading || !openCarts.length) return
    if (contextDriverTips !== groupDriverTips) getMultiCart()
  }, [contextDriverTips, loading])

  const changeActiveState = useCallback((isClosed: boolean, uuid: string) => {
    const isActive = cartsOpened?.includes?.(uuid)
    if (isActive || !isClosed) {
      setCartsOpened(cartsOpened?.filter?.((_uuid: any) => _uuid !== uuid))
    } else {
      setCartsOpened([
        ...cartsOpened,
        uuid
      ])
    }
  }, [cartsOpened])

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.backgroundPage }}>
      <Container pt={10} noPadding onScroll={handleScroll} showsVerticalScrollIndicator={false}>
        <ChContainer style={[styles.pagePadding, styles.pageBottom]} testID='multi-checkout-content'>
          <ChSection style={{ paddingTop: 0 }}>
            {cartGroup?.result?.status !== 'payment_incomplete' && (
              <ChHeader>
                <CHMomentWrapper onPress={() => navigation.navigate('OrderTypes', { configTypes: configTypes })}>
                  <OText
                    size={12}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    color={theme.colors?.textSecondary}
                  >
                    {t(getTypesText(options?.type || 1), 'Delivery')}
                  </OText>
                  <OIcon
                    src={theme.images.general.arrow_down}
                    width={10}
                    style={{ marginStart: 8 }}
                  />
                </CHMomentWrapper>
                <CHMomentWrapper
                  onPress={() => handleMomentClick()}
                  disabled={loading}
                >
                  <OText size={12} numberOfLines={1} ellipsizeMode='tail' color={theme.colors.textSecondary}>
                    {options?.moment
                      ? parseDate(options?.moment, { outputFormat: `${preorderDateFormat} ${timeFormat}` })
                      : t('ASAP_ABBREVIATION', 'ASAP')}
                  </OText>
                  {isPreOrder && (
                    <OIcon
                      src={theme.images.general.arrow_down}
                      width={10}
                      style={{ marginStart: 8 }}
                    />
                  )}
                </CHMomentWrapper>
              </ChHeader>
            )}
            <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginTop: 18, marginHorizontal: -40 }} />
          </ChSection>

          <ChSection>
            <ChUserDetails>
              {(user?.guest_id && !allowedGuest) ? (
                <View>
                  <OText size={14} numberOfLines={1} ellipsizeMode='tail' color={theme.colors.textNormal}>
                    {t('CUSTOMER_DETAILS', 'Customer details')}
                  </OText>
                  <OButton
                    text={t('LOGIN', 'Login')}
                    class='primary'
                    style={{ borderRadius: 7.6, marginTop: 20 }}
                    onClick={() => setOpenModal({ ...openModal, login: true })}
                  />
                  <OButton
                    text={t('SIGN_UP', 'Sign up')}
                    class='secondary'
                    style={{ borderRadius: 7.6, marginTop: 20 }}
                    onClick={() => setOpenModal({ ...openModal, signup: true })}
                  />
                  {isGuestCheckoutEnabled && (
                    <OButton
                      text={t('CONTINUE_AS_GUEST', 'Continue as guest')}
                      class='secondary'
                      style={{ borderRadius: 7.6, marginTop: 20 }}
                      onClick={() => setAllowedGuest(true)}
                    />
                  )}
                </View>
              ) : (
                <UserDetails
                  isUserDetailsEdit={isUserDetailsEdit}
                  useValidationFields
                  useDefualtSessionManager
                  useSessionUser
                  isCheckout
                  phoneUpdate={phoneUpdate}
                  togglePhoneUpdate={togglePhoneUpdate}
                  isOrderTypeValidationField
                  requiredFields={requiredFields}
                  checkoutFields={checkoutFields}
                  cartStatus={cartGroup?.result?.status}
                />
              )}
            </ChUserDetails>
            <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginHorizontal: -40 }} />
          </ChSection>

          {!cartGroup.loading && cartGroup?.result?.status === 'payment_incomplete' && (
            <ChSection style={{ paddingBottom: 20 }}>
              <ChErrors>
                <OText
                  style={{ textAlign: 'center' }}
                  color={theme.colors.error}
                  size={17}
                >
                  {t('CART_STATUS_PENDING_MESSAGE_APP', 'Your order is being processed, please wait a little more. if you\'ve been waiting too long, please reload the app')}
                </OText>
              </ChErrors>
            </ChSection>
          )}

          <ChSection>
            <ChAddress>
              <AddressDetails
                navigation={navigation}
                isMultiCheckout
                openCarts={openCarts}
                apiKey={configs?.google_maps_api_key?.value}
                mapConfigs={mapConfigs}
                isCartPending={cartGroup?.result?.status === 'payment_incomplete'}
              />
            </ChAddress>
            <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginTop: 13, marginHorizontal: -40 }} />
          </ChSection>
          {openCarts?.length > 0 && (
            <ChSection>
              {!cartGroup.loading && cartGroup?.result?.status === 'payment_failed' && (
                <OText
                  style={{ textAlign: 'center', marginTop: 20 }}
                  color={theme.colors.error}
                  size={17}
                >
                  {t('CART_STATUS_CANCEL_MESSAGE', 'The payment has not been successful, please try again')}
                </OText>
              )}
              <MultiCartsPaymethodsAndWallets
                openCarts={openCarts}
                paymethodSelected={paymethodSelected}
                walletsPaymethod={cartGroup?.result?.wallets}
                handleSelectPaymethod={handleSelectPaymethod}
                handleSelectWallet={handleSelectWallet}
                handlePaymethodDataChange={handlePaymethodDataChange}
                cartUuid={cartUuid}
                merchantId={merchantId}
                setMethodPaySupported={setMethodPaySupported}
                methodPaySupported={methodPaySupported}
                placeByMethodPay={placeByMethodPay}
                setPlaceByMethodPay={setPlaceByMethodPay}
                cartTotal={totalCartsPrice}
                handlePlaceOrder={handlePlaceOrder}
                cartGroup={cartGroup}
                individualWalletsCarts={walletCarts}
              />
              <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginTop: 13, marginHorizontal: -40 }} />
            </ChSection>
          )}
          {
            isMultiDriverTips &&
            (options?.type === 1 || allowDriverTipPickup) &&
            validationFields?.fields?.checkout?.driver_tip?.enabled &&
            openCarts.every((cart: any) => cart.business_id && cart.status !== 2) &&
            driverTipsOptions && driverTipsOptions?.length > 0 &&
            (
              <ChSection>
                <DriverTipsContainer>
                  <OText size={14} lineHeight={20} color={theme.colors.textNormal}>
                    {t('DRIVER_TIPS', 'Driver Tips')}
                  </OText>
                  <DriverTips
                    isMulti
                    isLoading={loading || cartGroup?.loading || contextDriverTips !== groupDriverTips}
                    carts={openCarts}
                    businessIds={openCarts.map((cart: any) => cart.business_id)}
                    driverTipsOptions={driverTipsOptions}
                    isFixedPrice={parseInt(configs?.driver_tip_type?.value, 10) === 1}
                    isDriverTipUseCustom={!!parseInt(configs?.driver_tip_use_custom?.value, 10)}
                    driverTip={parseInt(configs?.driver_tip_type?.value, 10) === 1
                      ? openCarts?.reduce((sum: any, cart: any) => sum + (cart?.driver_tip || 0), 0)
                      : openCarts[0]?.driver_tip_rate}
                    useOrderContext
                  />
                </DriverTipsContainer>
                <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginTop: 13, marginHorizontal: -40 }} />
              </ChSection>
            )}

          {
            validationFields?.fields?.checkout?.coupon?.enabled &&
            openCarts.every((cart: any) => cart.business_id && cart.status !== 2) &&
            configs?.multi_business_checkout_coupon_input_style?.value === 'group' &&
            openCarts?.length > 0 && (
              <ChSection>
                <OSBill>
                  <View>
                    <View style={{ paddingVertical: 5 }}>
                      <CouponControl
                        isMulti
                        carts={openCarts}
                        businessIds={openCarts.map((cart: any) => cart.business_id)}
                        price={openCarts.reduce((total: any, cart: any) => total + cart.total, 0)}
                      />
                    </View>
                  </View>
                </OSBill>
                <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginTop: 13, marginHorizontal: -40 }} />
              </ChSection>
            )}

          <ChSection>
            <ChCarts>
              <CartsHeader>
                <OText size={16} lineHeight={24} color={theme.colors.textNormal} style={{ fontWeight: '500' }}>
                  {t('MOBILE_FRONT_YOUR_ORDER', 'Your order')}
                </OText>
              </CartsHeader>
              {cartsToShow.map((cart: any) => (
                <React.Fragment key={cart.uuid}>
                  <Cart
                    cart={cart}
                    cartuuid={cart.uuid}
                    isMultiCheckout
                    showBillDetails
                    hideCouponInput={configs?.multi_business_checkout_coupon_input_style?.value === 'group'}
                    hideDeliveryFee={configs?.checkout_multi_business_enabled?.value === '1' && configs?.multi_business_checkout_show_combined_delivery_fee?.value === '1'}
                    hideDriverTip={configs?.checkout_multi_business_enabled?.value === '1' && configs?.multi_business_checkout_show_combined_driver_tip?.value === '1'}
                    onNavigationRedirect={(route: string, params: any) => props.navigation.navigate(route, params)}
                    businessConfigs={cart?.business?.configs}
                    cartsOpened={cartsOpened}
                    changeActiveState={changeActiveState}
                    isActive={cartsOpened?.includes?.(cart?.uuid)}
                    callbackAfterUpdateCart={getMultiCart}
                  />
                  {isSchoolCart(studentCartByUuid[cart?.uuid]) && (
                    <CheckoutStudentDetails
                      cart={studentCartByUuid[cart?.uuid]}
                      onStudentAssigned={(studentId: any) => handleStudentAssigned(cart?.uuid, studentId)}
                    />
                  )}
                  {openCarts.length > 1 && (
                    <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginTop: 13, marginHorizontal: -40 }} />
                  )}
                </React.Fragment>
              ))}
              {!cartGroup?.loading && openCarts.length === 0 && cartsInvalid?.length === 0 && (
                <CCNotCarts>
                  <OText size={24} style={{ textAlign: 'center' }}>
                    {t('CARTS_NOT_FOUND', 'You don\'t have carts available')}
                  </OText>
                </CCNotCarts>
              )}
              {walletCarts.length > 0 && (
                <OText size={14} color={theme.colors.danger5} style={{ marginVertical: 20 }}>
                  {t('WARNING_PARTIAL_WALLET_CARTS', 'Important: One or more carts can`t be completed due a partial payment with cash/points wallet and requires to be paid individually')}
                </OText>
              )}
              {openCarts.length > 1 && (
                <ChCartsTotal>
                  {!!totalCartsFee && configs?.multi_business_checkout_show_combined_delivery_fee?.value === '1' && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <OText size={14} lineHeight={24} color={theme.colors.textNormal} weight={'400'}>
                        {t('TOTAL_DELIVERY_FEE', 'Total delivery fee')}
                      </OText>
                      <OText size={14} lineHeight={24} color={theme.colors.textNormal} weight={'400'}>
                        {parsePrice(totalCartsFee)}
                      </OText>
                    </View>
                  )}
                  {openCarts.reduce((sum: any, cart: any) => sum + (cart?.driver_tip || 0), 0) > 0 &&
                    configs?.multi_business_checkout_show_combined_driver_tip?.value === '1' && (
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <OText size={14} lineHeight={24} color={theme.colors.textNormal} weight={'400'}>
                          {t('DRIVER_TIP', 'Driver tip')}
                        </OText>
                        <OText size={14} lineHeight={24} color={theme.colors.textNormal} weight={'400'}>
                          {parsePrice(openCarts.reduce((sum: any, cart: any) => sum + (cart?.driver_tip || 0), 0))}
                        </OText>
                      </View>
                    )}
                  {!cartGroup?.loading && cartGroup?.result?.payment_events?.length > 0 && cartGroup?.result?.payment_events?.map((event: any) => (
                    <View key={event.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <OText size={14} lineHeight={24} color={theme.colors.textNormal} weight={'400'}>
                        {walletName[cartGroup?.result?.wallets?.find((wallet: any) => wallet.wallet_id === event.wallet_id)?.type]?.name}
                      </OText>
                      <OText size={14} lineHeight={24} color={theme.colors.textNormal} weight={'400'}>
                        -{parsePrice(event.amount, { isTruncable: true })}
                      </OText>
                    </View>
                  ))}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <OText size={16} lineHeight={24} color={theme.colors.textNormal} weight={'500'}>
                      {t('TOTAL_FOR_ALL_CARTS', 'Total for all Carts')}
                    </OText>
                    <OText size={16} lineHeight={24} color={theme.colors.textNormal} weight={'500'}>{parsePrice(totalCartsPrice)}</OText>
                  </View>
                  {!!loyaltyRewardValue && (
                    <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'flex-end' }}>
                      <OText size={12} color={theme.colors.textNormal}>
                        {t('REWARD_LOYALTY_POINT', 'Reward :amount: on loyalty points').replace(':amount:', loyaltyRewardValue)}
                      </OText>
                    </View>
                  )}

                  <OText size={12} color={theme.colors.mediumGray} mRight={70} style={{ marginTop: 10 }}>
                    {t('MULTI_CHECKOUT_DESCRIPTION', 'You will receive a receipt for each business. The payment is not combined between multiple stores. Each payment is processed by the store')}
                  </OText>
                </ChCartsTotal>
              )}
            </ChCarts>
          </ChSection>
          {cartsToShow?.some((cart: any) => !cart?.valid_products && cart?.status !== 2) && (
            <OText
              color={theme.colors.error}
              size={12}
            >
              {t('WARNING_INVALID_PRODUCTS_CHECKOUT', 'To continue with your checkout, please remove from your cart the products that are not available.')}
            </OText>
          )}
          {(!isGuestCheckoutEnabled && !!user?.guest_id) && (
            <OText
              color={theme.colors.error}
              size={12}
            >
              {t('LOGIN_SIGN_UP_COMPLETE_ORDER', 'Login/Sign up to complete your order.')}
            </OText>
          )}
        </ChContainer>

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
        <OModal
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <View style={styles.detailWrapper}>
            <UserDetails
              isUserDetailsEdit
              useValidationFields
              useDefualtSessionManager
              useSessionUser
              isCheckout
              isEdit
              phoneUpdate={phoneUpdate}
              togglePhoneUpdate={togglePhoneUpdate}
              hideUpdateButton
              handlePlaceOrderAsGuest={handlePlaceOrderAsGuest}
              isCheckoutPlace
              isOrderTypeValidationField
              requiredFields={requiredFields}
              checkoutFields={checkoutFields}
              onClose={() => {
                setIsOpen(false)
                handlePlaceOrder()
              }}
              setIsOpen={setIsOpen}
            />
          </View>
        </OModal>
      </Container>
      {cartGroup?.result?.status !== 'payment_incomplete' && !showGateway.open && (
        <FloatingButton
          text={schoolNeedsStudent
            ? t('SCHOOL_SELECT_STUDENT', 'Select a student')
            : placing ? t('PLACING', 'Placing') : t('PLACE_ORDER', 'Place Order')}
          loading={placing}
          reverseOrder
          flexDirection='row'
          disabled={isDisablePlaceOrderButton}
          containerStyle={{ paddingBottom: insets.bottom }}
          handleClick={isDisablePlaceOrderButton
            ? () => vibrateApp()
            : methodsPay.includes(paymethodSelected?.gateway)
              ? () => setPlaceByMethodPay(true)
              : () => handlePlaceOrder()}
        />
      )}
    </View>
  )
}

export const MultiCheckout = (props: any) => {
  const [loadMultiCarts, setLoadMultiCarts] = useState(!!props.route?.params?.checkCarts)
  const [cartUuid, setCartUuid] = useState('')

  const multiCheckoutProps = {
    ...props,
    cartUuid: props.route?.params?.cartUuid ?? cartUuid,
    UIComponent: MultiCheckoutUI
  }

  const multiCartProps = {
    ...props,
    handleOnRedirectMultiCheckout: (cartUuid: string) => {
      setCartUuid(cartUuid)
      setLoadMultiCarts(false)
    },
    handleOnRedirectCheckout: (cartUuid: string) => {
      props.navigation.navigate('CheckoutPage', {
        cartUuid
      })
    }
  }

  return (
    loadMultiCarts ? (
      <MultiCartController {...multiCartProps} />
    ) : (
      <MultiCheckoutController {...multiCheckoutProps} />
    )
  )
}
