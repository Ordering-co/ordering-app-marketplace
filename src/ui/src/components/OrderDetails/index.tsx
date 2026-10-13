import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, BackHandler, Linking, RefreshControl } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components/native';
import { Placeholder, PlaceholderLine } from 'rn-placeholder';
import FastImage from 'react-native-fast-image'
import { showLocation } from 'react-native-map-link'
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  OrderDetailsContainer,
  Header,
  OrderContent,
  OrderBusiness,
  OrderData,
  OrderInfo,
  StaturBar,
  OrderSection,
  InfoBlock,
  Customer,
  Icons,
  OrderDriver,
  Map,
  PlaceSpotWrapper,
  HeaderTitle,
  HelpBtn,
  WrapperOptions,
  WrapperPhoto,
  Table,
  WrapperAddress,
  WrapperFullTotal,
  ProgressInfo,
  BusinessInfoContainer,
  BusinessLogo,
  BusinessTextContainer,
  StatusCheckmark,
  Separator,
  ReviewContainer,
  StarsContainer,
  ReviewSection,
  IconContainer,
} from './styles'

import { getOrderStatuPickUp, getOrderStatus, getGoogleMapImage } from '../../utils'
import { resolveAppDesign } from '@/utils/appDesign'
import { themeBrandColor } from '@/utils/themeBrandColor'
import {
  MawejaMapCard,
  MawejaPlaceCard,
  MawejaProgress,
  MawejaStatusHero,
  mawejaStepIndex
} from './layouts/Maweja'
import { Card, CardBody } from '../Checkout/layouts/Maweja/styles'
import { MawejaCardTitle } from '../Checkout/layouts/Maweja'
import { PressableScale } from '../shared/PressableScale'
import { OrderDetailsParams } from '../../types';
import { OrderEta } from './OrderEta'
import { Bill } from './Bill'
import { DynamicProgressBar } from './DynamicProgressBar'

import {
  useLanguage,
  OrderDetails as OrderDetailsController,
  useToast,
  ToastType,
  useUtils,
  useConfig
} from '@components';

import {
  _setStoreData,
  OIcon, OText,
  GoogleMap,
  PlaceSpot,
  SendGiftCard,
  PoweredBy,
  FloatingButton,
  REVIEW_STATUS,
  REORDER_STATUS,
  OButton,
  OrderStudentInfo
} from '@ui'
import LinearGradient from 'react-native-linear-gradient';
import { useDriverInterpolation } from '../../hooks/useDriverInterpolation';

export const OrderDetailsUI = (props: OrderDetailsParams) => {
  const {
    messages,
    setMessages,
    readMessages,
    reorderState,
    driverLocation,
    getOrder,
    onGoBack,
    handleReorder,
    onNavigationRedirect
  } = props

  const theme = useTheme()
  const isMaweja = resolveAppDesign(theme) === 'maweja'
  const [, t] = useLanguage()
  const [{ parsePrice, parseDate, timeFormat }] = useUtils()
  const [, { showToast }] = useToast()
  const [{ configs }] = useConfig()
  const googleMapsApiKey = configs?.google_maps_api_key?.value

  const { order, loading } = props.order
  const declaredValueMeta = order?.metafields?.find?.((m: any) => m?.key === 'declared_value')
  const declaredValue = declaredValueMeta
    ? parseFloat(declaredValueMeta.value)
    : (order?.declared_value != null ? parseFloat(order.declared_value) : null)
  const isCustomOrder = declaredValue != null && declaredValue > 0
  const isGiftCardOrder = !order?.business_id && !isCustomOrder
  const isReservation = order?.delivery_type === 9

  const isOrderCompleted = REORDER_STATUS.includes(parseInt(order?.status, 10))
  const orderDisplayTotal = (order?.summary?.total ?? order?.total ?? 0) + (isCustomOrder ? (declaredValue || 0) : 0)
  const hideOrderPrices = Number(orderDisplayTotal) === 0

  const [isReviewed, setIsReviewed] = useState(false)
  const [isGiftCardSent, setIsGiftCardSent] = useState(false)
  const [refreshing] = useState(false);

  const isExternalDriver = !!order?.external_driver_id
  const externalDriverAsDriver = order?.external_driver
    ? {
      id: order.external_driver.id,
      name: order.external_driver.name,
      lastname: '',
      photo: order.external_driver.photo,
      cellphone: order.external_driver.phone,
      phone: order.external_driver.phone,
      location: (order.external_driver.latitude != null && order.external_driver.longitude != null)
        ? { lat: Number(order.external_driver.latitude), lng: Number(order.external_driver.longitude) }
        : null
    }
    : null
  const displayDriver = isExternalDriver ? externalDriverAsDriver : order?.driver

  const initialDriverLocation = useMemo(() => {
    const loc = displayDriver?.location
    if (!loc) return null
    if (typeof loc?.location === 'string') {
      const parts = loc.location.split(',')
      return {
        lat: parseFloat(parts[0].replace(/[^-.0-9]/g, '')),
        lng: parseFloat(parts[1].replace(/[^-.0-9]/g, ''))
      }
    }
    return loc?.lat && loc?.lng ? { lat: loc.lat, lng: loc.lng } : null
  }, [order?.id, isExternalDriver])
  const effectiveDriverLocation = driverLocation || displayDriver?.location

  const driverAnimatedCoordinate = useDriverInterpolation(driverLocation, initialDriverLocation)

  const mapValidStatuses = [9, 18, 19, 23, 26]
  const placeSpotTypes = [3, 4, 5]
  const deliveryTypes = [1, 7]
  const [isPickup, setIsPickup] = useState(order?.delivery_type === 2)
  const hideDeliveryProgress = theme?.confirmation?.components?.order?.components?.progress?.hidden
  const hideDriverName = theme?.confirmation?.components?.driver?.components?.name?.hidden
  const hideDriverPhone = theme?.confirmation?.components?.driver?.components?.phone?.hidden
  const hideDriverMessages = theme?.confirmation?.components?.driver?.components?.messages?.hidden
  const hideReorderButton = theme?.orders?.components?.reorder_button?.hidden
  const _formatTime = timeFormat

  const progressBarObjt = isPickup ? getOrderStatuPickUp : getOrderStatus
  const currentOrderStatus = progressBarObjt(order?.status, t, theme)
  const isReservationPreorder = isReservation && parseInt(order?.status, 10) === 13
  const currentOrderStatusText = isReservationPreorder
    ? t('RESERVATION', 'Reservation')
    : (currentOrderStatus?.value || t('YOUR_ORDER_IS_IN_PROGRESS', 'Your order is in progress'))
  const isDriverOnWayToCustomer = order?.delivery_position === 1 || order?.delivery_position == null
  const trackingStep = mawejaStepIndex(parseInt(order?.status, 10))
  const articleCount = (order?.products || []).reduce((sum: number, product: any) => sum + (Number(product?.quantity) || 0), 0)
  const showDriverMap = !!(
    displayDriver &&
    effectiveDriverLocation &&
    !isOrderCompleted &&
    mapValidStatuses.includes(parseInt(order?.status))
  )
  const trackingCaption = trackingStep === 3
    ? t('ORDER_DELIVERED', 'Delivered')
    : trackingStep === 2
      ? t('DRIVER_ON_THE_WAY_MESSAGE', 'Your driver is on the way')
      : trackingStep === 1
        ? t('RESTAURANT_PREPARING_ORDER', 'The restaurant is preparing your order')
        : (currentOrderStatus?.value || t('ORDER_AWAITING_VALIDATION', 'Order waiting for validation'))

  const styles = StyleSheet.create({
    photo: {
      height: 48,
      width: 48,
      borderRadius: isMaweja ? 24 : 10
    },
    statusBar: {
      height: 12,
      borderRadius: 8
    },
    buttonsActions: {
      paddingVertical: 7,
      paddingLeft: 0,
      paddingRight: 0,
      height: 'auto',
      borderRadius: 15,
      backgroundColor: theme.colors.backgroundGray200
    }
  })

  const resfreshOrder = () => getOrder && getOrder()

  const handleGoToMessages = (type: string) => {
    readMessages && readMessages()
    onNavigationRedirect(
      'MessageView',
      {
        type,
        order,
        messages,
        setMessages,
        orderId: order?.id,
        business: type === 'business',
        driver: type === 'driver',
        onClose: () => onGoBack?.()
      }
    )
  }

  const handleClickOrderReview = (order: any) => {
    onNavigationRedirect('ReviewOrder', { order, setIsReviewed })
  }

  const handleRedirectToCheckout = async (id: number) => {
    const result = await handleReorder(id)
    onNavigationRedirect('CheckoutPage', { cartUuid: result?.uuid })
  }

  useEffect(() => {
    const handleArrowBack: () => any = () => {
      if (props.isFromCheckout) {
        onNavigationRedirect('BottomTab', { screen: 'Business' })
        return true
      }
    }
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleArrowBack)
    return () => {
      backHandler.remove()
    }
  }, [])

  const driverLocationString = typeof order?.driver?.location?.location === 'string' && order?.driver?.location?.location?.split(',').map((l: string) => l.replace(/[^-.0-9]/g, ''))

  const parseLocationString = (loc: any) => {
    if (typeof loc?.location === 'string') {
      return {
        ...loc,
        lat: parseFloat(loc.location.split(',')[0].replace(/[^-.0-9]/g, '')),
        lng: parseFloat(loc.location.split(',')[1].replace(/[^-.0-9]/g, ''))
      }
    }
    return loc
  }

  const parsedLocations = useMemo(() => {
    const driverLoc = effectiveDriverLocation
    return [
      parseLocationString({
        ...driverLoc,
        title: t('DRIVER', 'Driver'),
        icon: displayDriver?.photo || theme?.images?.general?.driverPng,
      }),
      parseLocationString({
        ...order?.business?.location,
        title: order?.business?.name,
        icon: order?.business?.logo || theme.images.dummies.businessLogo,
      }),
      parseLocationString({
        ...order?.customer?.location,
        title: t('YOUR_LOCATION', 'Your Location'),
        icon: order?.customer?.photo || 'https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,r_max/d_avatar.png/non_existing_id.png',
      })
    ]
  }, [order?.id, driverLocation?.lat, driverLocation?.lng]);

  useEffect(() => {
    if (props?.order?.error && !props?.order?.loading) {
      showToast(ToastType.Error, props?.order?.error)
      onNavigationRedirect('BottomTab', { screen: 'Business' })
    }
  }, [props?.order?.error, props?.order?.loading])

  useEffect(() => {
    if (!order?.delivery_type) return
    setIsPickup(order?.delivery_type === 2)
  }, [order?.delivery_type])

  useEffect(() => {
    if (!isMaweja) return
    props.onTrackingHeader?.({
      subtitle: order?.id
        ? `# ${order.id}${articleCount ? ` · ${articleCount} ${t('ARTICLES', 'Articles')}` : ''}`
        : undefined
    })
  }, [isMaweja, order?.id, articleCount])

  return (
    <OrderDetailsContainer
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => resfreshOrder()}
        />
      }
    >
      {!loading && order && Object.keys(order).length > 0 && (
        <View style={{ flex: 1, justifyContent: isGiftCardOrder ? 'space-between' : 'flex-start' }}>
          <OrderContent style={{ marginBottom: isGiftCardOrder ? 0 : 150 }}>
            {isMaweja && !isGiftCardOrder && (
              <>
                {(([0, 13].includes(parseInt(order?.status, 10)) && trackingStep === 0) || trackingStep === 3) && (
                  <MawejaStatusHero
                    tone={trackingStep === 3 ? 'success' : 'brand'}
                    kicker={trackingStep === 3 ? undefined : t('LIVE_ORDER', 'Live order')}
                    title={trackingStep === 3
                      ? t('ORDER_DELIVERED_TITLE', 'Order delivered!')
                      : t('ORDER_AWAITING_VALIDATION', 'Order waiting for validation')}
                    subtitle={trackingStep === 3
                      ? t('ORDER_DELIVERED_THANKS', 'Thank you for trusting :name:').replace(':name:', order?.business?.name || '')
                      : order?.business?.name}
                  />
                )}
                <MawejaProgress
                  title={t('ORDER_PROGRESS', 'Progress')}
                  labels={[
                    t('ORDER_RECEIVED', 'Received'),
                    t('ORDER_CONFIRMED', 'Confirmed'),
                    t('OUT_FOR_DELIVERY', 'Out for delivery'),
                    t('ORDER_DELIVERED', 'Delivered')
                  ]}
                  caption={trackingCaption}
                  activeLabel={t('IN_PROGRESS', 'In Progress')}
                  step={trackingStep}
                />
              </>
            )}
            {!isOrderCompleted && !isMaweja && (
              <Header>
                <ProgressInfo>
                  <OText size={theme.utils.tsize.l} weight={600}>
                    {currentOrderStatusText}
                  </OText>
                  <HelpBtn
                    activeOpacity={0.7}
                    onPress={() => handleGoToMessages('business')}
                  >
                    <FontAwesomeIcon name="life-saver" size={24} color={theme.colors.black} />
                  </HelpBtn>
                </ProgressInfo>
                <OText>
                  <OrderEta order={order} outputFormat='dddd, MMMM D YYYY' />
                </OText>
                <StaturBar>
                  <LinearGradient
                    start={{ x: 0.0, y: 0.0 }}
                    end={{
                      x: currentOrderStatus?.percentage || 0,
                      y: 0,
                    }}
                    locations={[0.9999, 0.9999]}
                    colors={[theme.colors.active, theme.colors.activeContrast]}
                    style={styles.statusBar}
                  />
                </StaturBar>
                {parseInt(order?.status) === 23 && !isDriverOnWayToCustomer && (
                  <OText size={14} color={'#000'} style={{ textAlign: 'center', marginTop: 8 }}>
                    {t('DRIVER_ATTENDING_ANOTHER_ORDER', 'Driver is attending another order')}
                  </OText>
                )}
                {isReservation
                  ? (
                    order?.reservation && (
                      <HeaderTitle>
                        <View style={{ width: '100%', alignItems: 'flex-start' }}>
                          {parseInt(order?.status) === 0 && (
                            <OText size={theme.utils.tsize.s} weight={'bold'} mBottom={6}>
                              {t('WE_ARE_REVIEWING_YOUR_RESERVATION', 'We are reviewing your reservation')}
                            </OText>
                          )}
                          <OText size={theme.utils.tsize.s} weight={'bold'}>
                            {t('DATE_AND_TIME_RESERVATION', 'Date and time of reservation')}: {parseDate(order?.reservation?.reserve_date, { utc: false, outputFormat: `YYYY-MM-DD ${timeFormat}` })}
                          </OText>
                          <OText size={theme.utils.tsize.s}>
                            {t('NUMBER_OF_GUESTS', 'Number of guests')}: {order?.reservation?.guests_reservation}
                          </OText>
                        </View>
                      </HeaderTitle>
                    )
                  )
                  : (
                    <>
                      <HeaderTitle>
                        <OText size={theme.utils.tsize.xxxl} weight={'bold'}>
                          <OrderEta order={order} outputFormat={_formatTime ?? 'hh:mm a'} />
                        </OText>
                      </HeaderTitle>
                      <HeaderTitle>
                        <View style={{ width: '50%', alignItems: 'flex-start' }}>
                          <OText
                            size={theme.utils.tsize.s}
                          >
                            {isPickup ? t('PICKUP_ORDER', 'Pickup Order') : t('ESTIMATED_TIME', 'Estimated Time')}
                          </OText>
                        </View>
                      </HeaderTitle>
                    </>
                  )}
              </Header>
            )}

            {isOrderCompleted && !isMaweja && (
              <BusinessInfoContainer>
                {order?.business?.logo && (
                  <BusinessLogo source={{ uri: order?.business?.logo }} />
                )}
                <BusinessTextContainer>
                  <OText weight={'bold'}>{order.business.name}</OText>
                  <OText>
                    <OrderEta order={order} outputFormat='dddd, MMMM D YYYY' />
                  </OText>
                  <OText color={theme.colors.success500}>
                    {isReservationPreorder
                      ? t('RESERVATION', 'Reservation')
                      : (currentOrderStatus?.value || getOrderStatus(order?.status, t, theme)?.value)}
                  </OText>
                </BusinessTextContainer>
                <StatusCheckmark>
                  <Icon name="checkmark-outline" size={28} color={theme.colors.white} />
                </StatusCheckmark>
              </BusinessInfoContainer>
            )}

            {showDriverMap && (
              isMaweja ? (
                <MawejaMapCard title={t('DRIVER_POSITION', 'Driver position')}>
                  <Map>
                    <GoogleMap
                      readOnly
                      manualZoom
                      locations={parsedLocations}
                      location={typeof order?.driver?.location?.location === 'string'
                        ? {
                          lat: parseFloat(driverLocationString[0]),
                          lng: parseFloat(driverLocationString[1]),
                        } : effectiveDriverLocation
                      }
                      driverAnimatedCoordinate={driverAnimatedCoordinate}
                    />
                  </Map>
                </MawejaMapCard>
              ) : (
                <View style={{ marginHorizontal: theme.utils.margins.horizontal, borderRadius: 30 }}>
                  <Map>
                    <GoogleMap
                      readOnly
                      manualZoom
                      locations={parsedLocations}
                      location={typeof order?.driver?.location?.location === 'string'
                        ? {
                          lat: parseFloat(driverLocationString[0]),
                          lng: parseFloat(driverLocationString[1]),
                        } : effectiveDriverLocation
                      }
                      driverAnimatedCoordinate={driverAnimatedCoordinate}
                    />
                  </Map>
                </View>
              )
            )}
            {isMaweja && !!displayDriver && deliveryTypes.includes(order?.delivery_type) && !showDriverMap && !effectiveDriverLocation && !isGiftCardOrder && !isOrderCompleted && mapValidStatuses.includes(parseInt(order?.status)) && (
              <MawejaMapCard
                title={t('DRIVER_POSITION', 'Driver position')}
                hint={t('WAITING_DRIVER_GPS', "Waiting for the driver's GPS...")}
              />
            )}

            {isReservation && order?.business?.location?.lat != null && googleMapsApiKey && (
              <View style={{ marginHorizontal: theme.utils.margins.horizontal, marginBottom: 20 }}>
                <FastImage
                  source={{ uri: getGoogleMapImage(order?.business?.location, googleMapsApiKey), priority: FastImage.priority.normal }}
                  style={{ width: '100%', height: 190, borderRadius: 30 }}
                  resizeMode={FastImage.resizeMode.cover}
                />
                <OButton
                  text={t('GET_DIRECTIONS', 'Get Directions')}
                  class='secondary'
                  style={{ marginTop: 10, borderRadius: 8, minHeight: 44 }}
                  textStyle={{ fontSize: 14, fontWeight: 'bold' }}
                  onClick={() => showLocation({
                    latitude: order?.business?.location?.lat,
                    longitude: order?.business?.location?.lng,
                    title: order?.business?.name,
                    dialogTitle: t('OPEN_IN_MAPS', 'Open in Maps'),
                    dialogMessage: t('CHOOSE_MAPS_APP_DIRECTIONS', 'Choose an app to get directions'),
                    cancelText: t('CANCEL', 'Cancel')
                  })}
                />
              </View>
            )}

            {!isGiftCardOrder && placeSpotTypes.includes(order?.delivery_type) && !isOrderCompleted && (
              <PlaceSpotWrapper>
                <PlaceSpot
                  isInputMode
                  cart={order}
                  spotNumberDefault={order?.spot_number}
                  vehicleDefault={order?.vehicle}
                />
              </PlaceSpotWrapper>
            )}

            {!isOrderCompleted &&
              (
                (!isGiftCardOrder && order?.delivery_option !== undefined && deliveryTypes?.includes?.(order?.delivery_type)) ||
                (!isMaweja && !!order?.comment)
              ) && (
                <OrderSection>
                  {isMaweja ? (
                    <Card>
                      <CardBody>
                        <MawejaCardTitle icon="truck-outline" title={t('DELIVERY_PREFERENCE', 'Delivery Preference')} />
                        <OText size={14} color={theme.colors.black}>
                          {order?.delivery_option?.name ? t(order?.delivery_option?.name.toUpperCase().replace(/\s/g, '_'), order?.delivery_option?.name) : t('EITHER_WAY', 'Either way')}
                        </OText>
                      </CardBody>
                    </Card>
                  ) : (
                  <>
                  {!isGiftCardOrder && order?.delivery_option !== undefined && deliveryTypes?.includes?.(order?.delivery_type) && (
                    <View>
                      <OText size={theme.utils.tsize.m} weight={600} style={{ textAlign: 'left' }} >
                        {t('DELIVERY_PREFERENCE', 'Delivery Preference')}
                      </OText>
                      <OText size={12} style={{ textAlign: 'left' }} >
                        {order?.delivery_option?.name ? t(order?.delivery_option?.name.toUpperCase().replace(/\s/g, '_'), order?.delivery_option?.name) : t('EITHER_WAY', 'Either way')}
                      </OText>
                    </View>
                  )}
                  {!!order?.comment && (
                    <View style={{ marginTop: 20 }}>
                      <OText size={theme.utils.tsize.m} weight={600} style={{ textAlign: 'left' }} >
                        {t('COMMENT', 'Comment')}
                      </OText>
                      <OText size={12} style={{ textAlign: 'left' }} >{order?.comment}</OText>
                    </View>
                  )}
                  </>
                  )}
                </OrderSection>
              )}

            {!isOrderCompleted && !hideOrderPrices && !isMaweja && (
              <WrapperFullTotal>
                {isCustomOrder ? (
                  <View style={{ paddingBottom: 0 }}>
                    <OText size={theme.utils.tsize.xxl + 2} style={{ fontWeight: 'bold' }}>
                      {t('ESTIMATED_TOTAL', 'Estimated Total')}:
                    </OText>
                    <OText size={theme.utils.tsize.xxl + 2} style={{ fontWeight: 'bold' }}>
                      ~ {parsePrice((order?.summary?.total ?? order?.total ?? 0) + (declaredValue || 0))}
                    </OText>
                  </View>
                ) : (
                  <Table hideBackground style={{ paddingBottom: 0 }}>
                    <OText size={theme.utils.tsize.xxl + 2} style={{ fontWeight: 'bold' }}>
                      {t('TOTAL', 'Total')}
                    </OText>
                    <OText
                      size={
                        parsePrice(order?.summary?.total ?? order?.total).length > 11
                          ? theme.utils.tsize.m + 2
                          : theme.utils.tsize.xxl + 2
                      }
                      style={{ fontWeight: 'bold' }}
                    >
                      {parsePrice(order?.summary?.total ?? order?.total)}
                    </OText>
                  </Table>
                )}
              </WrapperFullTotal>
            )}

            {(order?.student_id || order?.student?.id) && (
              <OrderStudentInfo order={order} />
            )}
            {!hideOrderPrices && (
              <Bill
                hideTotal={isMaweja ? false : !isOrderCompleted}
                order={order}
                isPickup={isPickup}
                isGiftCardOrder={isGiftCardOrder}
                isCustomOrder={isCustomOrder}
                declaredValue={declaredValue}
                layout={isMaweja ? 'maweja' : undefined}
                showComment={isMaweja && !isOrderCompleted}
              />
            )}
            {(
              parseInt(order?.status) === 1 ||
              parseInt(order?.status) === 11 ||
              parseInt(order?.status) === 15
            ) && !order.review && !isReviewed && !isGiftCardOrder && (
                isMaweja ? (
                  <ReviewSection>
                    <Card>
                      <CardBody>
                        <MawejaCardTitle icon="star-outline" title={t('REVIEW_YOUR_ORDER', 'Review your order')} />
                        <PressableScale onPress={() => handleClickOrderReview(order)}>
                          <View
                            style={{
                              minHeight: 48,
                              borderRadius: 14,
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: themeBrandColor(theme)
                            }}
                          >
                            <OText size={15} weight="bold" color={theme.colors.white}>{t('REVIEW', 'Review')}</OText>
                          </View>
                        </PressableScale>
                      </CardBody>
                    </Card>
                  </ReviewSection>
                ) : (
                <ReviewSection>
                  <OText weight={'500'}>{order?.review ? t('ORDER_REVIEWED', 'Order Reviewed') : t('REVIEW_YOUR_ORDER', 'Review your order')}</OText>
                  {!order?.review && (
                    <ReviewContainer>
                      <OButton
                        text={t('REVIEW', 'Review')}
                        class='alert'
                        style={styles.buttonsActions}
                        textStyle={{ fontSize: 10, fontWeight: 'bold' }}
                        onClick={() => handleClickOrderReview(order)}
                      />
                    </ReviewContainer>
                  )}
                  <Separator />
                </ReviewSection>
                )
              )}
            {isCustomOrder && !!order?.business?.address && (
              <OrderSection>
                {isMaweja ? (
                  <MawejaPlaceCard
                    icon="store-outline"
                    title={t('PICKUP_ADDRESS', 'Pickup Address')}
                    name={order?.business?.name}
                    address={order.business.address}
                    logo={order?.business?.logo}
                  />
                ) : (
                  <>
                    <OText weight={600}>{t('PICKUP_ADDRESS', 'Pickup Address')}</OText>
                    <WrapperAddress>
                      {!!order?.business?.name && <OText>{order.business.name}</OText>}
                      <OText>{order.business.address}</OText>
                    </WrapperAddress>
                  </>
                )}
              </OrderSection>
            )}
            {!isCustomOrder && !!order?.business?.address && (
              <OrderSection>
                {isMaweja ? (
                  <MawejaPlaceCard
                    icon={isPickup ? 'store-outline' : 'map-marker-outline'}
                    title={isReservation
                      ? t('RESERVATION_ADDRESS', 'Reservation Address')
                      : isPickup ? t('PICKUP_ADDRESS', 'Pickup Address') : t('DELIVERY_ADDRESS', 'Delivery Address')}
                    name={isPickup ? order?.business?.name : undefined}
                    address={(isPickup || isReservation) ? order?.business?.address : order?.customer?.address}
                    logo={isPickup ? order?.business?.logo : undefined}
                  />
                ) : (
                  <>
                    <OText weight={600}>
                      {isReservation
                        ? t('RESERVATION_ADDRESS', 'Reservation Address')
                        : isPickup ? t('PICKUP_ADDRESS', 'Pickup Address') : t('DELIVERY_ADDRESS', 'Delivery Address')}
                    </OText>
                    <WrapperAddress>
                      {isPickup && <OText weight={'bold'}>{order?.business?.name}</OText>}
                      <OText>
                        {(isPickup || isReservation) ? order?.business?.address : order?.customer?.address}
                      </OText>
                    </WrapperAddress>
                  </>
                )}
              </OrderSection>
            )}
            {isCustomOrder && !!order?.customer?.address && (
              <OrderSection>
                {isMaweja ? (
                  <MawejaPlaceCard
                    icon="map-marker-outline"
                    title={t('DELIVERY_ADDRESS', 'Delivery Address')}
                    address={order.customer.address}
                  />
                ) : (
                  <>
                    <OText weight={600}>{t('DELIVERY_ADDRESS', 'Delivery Address')}</OText>
                    <WrapperAddress>
                      <OText>{order.customer.address}</OText>
                    </WrapperAddress>
                  </>
                )}
              </OrderSection>
            )}

            {displayDriver && (
              <OrderDriver>
                {!isMaweja && <Separator />}
                {isMaweja ? (
                  <Card>
                    <CardBody>
                      <MawejaCardTitle icon="account-outline" title={t('YOUR_DELIVERY_AGENT', 'Your delivery agent')} />
                      <Customer>
                  {!!displayDriver?.photo && (
                    <WrapperPhoto>
                      <FastImage
                        style={styles.photo}
                        source={{
                          uri: displayDriver?.photo,
                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    </WrapperPhoto>
                  )}
                  <InfoBlock>
                    <WrapperOptions>
                      <OText
                        size={theme.utils.tsize.s + 1}
                        lineHeight={18}
                        weight={600}
                        mBottom={2}
                      >
                        {displayDriver?.name} {displayDriver?.lastname}
                      </OText>
                      {!hideDriverMessages && (
                        <Icons>
                          {!isExternalDriver && (
                            <IconContainer
                              onPress={() => handleGoToMessages('driver')}
                              style={isMaweja ? { backgroundColor: `${theme.colors.skyBlue}22`, borderRadius: 18 } : undefined}
                            >
                              <MaterialCommunityIcons
                                name="chat"
                                size={24}
                                color={isMaweja ? theme.colors.skyBlue : theme.colors.black}
                              />
                            </IconContainer>
                          )}
                          {!!displayDriver?.cellphone && !hideDriverPhone && (
                            <IconContainer
                              onPress={() => displayDriver?.cellphone &&
                                Linking.openURL(`tel:${displayDriver?.cellphone}`)
                              }
                              style={isMaweja
                                ? { backgroundColor: `${theme.colors.green || theme.colors.success}22`, borderRadius: 18 }
                                : { paddingEnd: 5 }}
                            >
                              <MaterialCommunityIcons
                                name="phone-hangup"
                                size={24}
                                color={isMaweja ? (theme.colors.green || theme.colors.success) : theme.colors.black}
                                style={{ transform: [{ rotate: '220deg' }] }}
                              />
                            </IconContainer>
                          )}
                        </Icons>
                      )}
                    </WrapperOptions>
                    <OText lineHeight={18} mBottom={2}>
                      {t('YOUR_DRIVER', 'Your Driver')}
                    </OText>
                  </InfoBlock>
                </Customer>
                    </CardBody>
                  </Card>
                ) : (
                  <Customer>
                    {!!displayDriver?.photo && (
                      <WrapperPhoto>
                        <FastImage
                          style={styles.photo}
                          source={{
                            uri: displayDriver?.photo,
                            priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                        />
                      </WrapperPhoto>
                    )}
                    <InfoBlock>
                      <WrapperOptions>
                        <OText size={theme.utils.tsize.s + 1} lineHeight={18} weight={600} mBottom={2}>
                          {displayDriver?.name} {displayDriver?.lastname}
                        </OText>
                        {!hideDriverMessages && (
                          <Icons>
                            {!isExternalDriver && (
                              <IconContainer onPress={() => handleGoToMessages('driver')}>
                                <MaterialCommunityIcons name="chat" size={24} color={theme.colors.black} />
                              </IconContainer>
                            )}
                            {!!displayDriver?.cellphone && !hideDriverPhone && (
                              <IconContainer
                                onPress={() => displayDriver?.cellphone && Linking.openURL(`tel:${displayDriver.cellphone}`)}
                                style={{ paddingEnd: 5 }}
                              >
                                <MaterialCommunityIcons
                                  name="phone-hangup"
                                  size={24}
                                  color={theme.colors.black}
                                  style={{ transform: [{ rotate: '220deg' }] }}
                                />
                              </IconContainer>
                            )}
                          </Icons>
                        )}
                      </WrapperOptions>
                      <OText lineHeight={18} mBottom={2}>{t('YOUR_DRIVER', 'Your Driver')}</OText>
                    </InfoBlock>
                  </Customer>
                )}
              </OrderDriver>
            )}

            {isGiftCardOrder && order?.products[0]?.gift_card?.status === 'pending' && !isGiftCardSent && (
              <SendGiftCard
                giftCardId={order?.products[0]?.gift_card?.id}
                setIsGiftCardSent={setIsGiftCardSent}
              />
            )}
          </OrderContent>
          <PoweredBy containerStyle={{ paddingTop: 20, paddingBottom: isGiftCardOrder ? 20 : 150 }} />
        </View>
      )}

      {loading && (
        <Placeholder>
          <Header>
            <OrderInfo style={{ paddingBottom: 0 }}>
              <OrderData>
                <PlaceholderLine width={60} height={15} />
                <PlaceholderLine width={60} height={10} />
                <StaturBar style={{ marginBottom: 0 }}>
                  <PlaceholderLine height={15} />
                  <PlaceholderLine width={40} height={20} />
                </StaturBar>
              </OrderData>
            </OrderInfo>
          </Header>
          <OrderContent>
            <OrderBusiness>
              <PlaceholderLine width={30} height={20} />
              <PlaceholderLine width={60} height={15} />
              <PlaceholderLine width={75} height={10} />
              <PlaceholderLine width={40} height={10} />
              <PlaceholderLine width={95} height={10} />
              <PlaceholderLine width={20} height={20} />
              <PlaceholderLine width={70} height={15} />
              <PlaceholderLine width={65} height={10} />
              <PlaceholderLine width={80} height={10} />
              <PlaceholderLine width={70} height={10} />
              <View>
                <PlaceholderLine width={60} height={20} />
                <PlaceholderLine width={40} height={10} />
              </View>
              <PlaceholderLine width={20} height={20} />
              <PlaceholderLine width={70} height={15} />
              <PlaceholderLine width={65} height={10} />
              <PlaceholderLine width={80} height={10} />
              <PlaceholderLine width={70} height={10} />
              <View>
                <PlaceholderLine width={60} height={20} />
                <PlaceholderLine width={40} height={10} />
              </View>
            </OrderBusiness>
          </OrderContent>
        </Placeholder>
      )}
    </OrderDetailsContainer>
  )
}

export const OrderDetails = (props: OrderDetailsParams) => {
  const orderDetailsProps = {
    ...props,
    disabledLeaveOrderSocket: true,
    UIComponent: OrderDetailsUI,
  }

  return <OrderDetailsController {...orderDetailsProps} />;
}
