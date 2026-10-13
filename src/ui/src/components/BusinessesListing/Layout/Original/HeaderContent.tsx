import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import Geolocation from '@react-native-community/geolocation'

import { AddressAlertPopover } from './AddressAlertPopover'

import { useConfig, useLanguage, useOrder, useSession, useUtils } from '@components';
import { OIcon, OText } from '@ui';
import {
  AddressInput,
  AddressInputContainer,
  OrderControlContainer,
  Search,
  WrapperCartIcon,
  CartIconWrapper,
  CartBadge,
  WrapMomentOption,
  BackArrow,
  FarAwayMessage
} from './styles';

import { getTypesText } from '../../../../utils';
import { Animated, TouchableOpacity, View } from 'react-native';

export const HeaderContent = (props: any) => {
  const {
    navigation,
    isCart,
    title,
    showAwayAddressPopover,
    hideOrderControl,
    onGoBack,
    onHandleCart,
    isGuestUser,
    hideAddress,
    setOrderTypeValue,
    orderTypeValue,
    showBusinessSearchMap,
    businessId,
    collapseControls
  } = props;

  const theme = useTheme();
  const [{ auth }] = useSession()
  const [, t] = useLanguage();
  const [orderState] = useOrder();
  const [{ configs }] = useConfig();
  const [{ parseDate, timeFormat, preorderDateFormat, getMaxPreorderDays }] = useUtils();

  const [isFarAway, setIsFarAway] = useState(false)
  const [openFarAwayPopover, setOpenFarAwayPopover] = useState(false)
  const [controlsHeight, setControlsHeight] = useState(0)
  const collapseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.timing(collapseAnim, {
      toValue: collapseControls ? 0 : 1,
      duration: 220,
      useNativeDriver: false
    }).start()
  }, [collapseControls])

  const totalCartItems = businessId != null
    ? (orderState?.carts?.[`businessId:${businessId}`]?.products?.reduce((s: number, p: any) => s + (p?.quantity || 0), 0) || 0)
    : (Object.values(orderState?.carts || {}) as any[]).reduce(
        (sum, cart) => sum + (cart?.products?.reduce((s: number, p: any) => s + (p?.quantity || 0), 0) || 0),
        0
      )

  const configTypes = configs?.order_types_allowed?.value.split('|').map((value: any) => Number(value)) || [];
  const maxPreorderDays = getMaxPreorderDays(orderState.options?.type)
  const isPreorderEnabled = (configs?.preorder_status_enabled?.value === '1' || configs?.preorder_status_enabled?.value === 'true') &&
    maxPreorderDays > 0

  const handleMomentClick = () => {
    if (isPreorderEnabled) {
      navigation.navigate('MomentOption')
    }
  }

  const convertToRadian = (value: number) => {
    return value * Math.PI / 180
  }

  const getDistance = (lat1: any, lon1: any, lat2: any, lon2: any) => {
    const R = 6371 // km
    const dLat = convertToRadian(lat2 - lat1)
    const dLon = convertToRadian(lon2 - lon1)
    const curLat1 = convertToRadian(lat1)
    const curLat2 = convertToRadian(lat2)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(curLat1) * Math.cos(curLat2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const checkUserLocation = async () => {
    if (hideAddress || !orderState?.options?.address?.location?.lat || !orderState?.options?.address?.location?.lng) return
    Geolocation.getCurrentPosition((pos) => {
      const crd = pos.coords
      const distance = getDistance(crd.latitude, crd.longitude, orderState?.options?.address?.location?.lat, orderState?.options?.address?.location?.lng)
      const isFarAway = distance > 20;
      setIsFarAway(isFarAway);
      setOpenFarAwayPopover(isFarAway && showAwayAddressPopover);
    }, (err) => {
      console.log(`ERROR(${err.code}): ${err.message}`)
    }, {
      enableHighAccuracy: true, timeout: 15000, maximumAge: 10000
    })
  }

  useEffect(() => {
    checkUserLocation()
  }, [hideAddress, JSON.stringify(orderState?.options?.address?.location)])

  return (
    <>
      <Search>
        {onGoBack && (
          <BackArrow onPress={() => onGoBack()}>
            <AntDesignIcon
              name="left"
              color={theme.colors.black}
              size={18}
            />
          </BackArrow>
        )}
        {title && (
          <OText
            preset="cardTitle"
            align="center"
            numberOfLines={2}
            ellipsizeMode={'tail'}
            style={{ flex: 1, marginHorizontal: 16 }}
          >
            {title}
          </OText>
        )}
        {!hideAddress && (
          <AddressInput>
            <AddressInputContainer>
              <TouchableOpacity activeOpacity={1} onPress={() => setOpenFarAwayPopover(!openFarAwayPopover)}>
                <OIcon
                  src={theme.images.general.pin}
                  color={isFarAway ? theme.colors.warning5 : theme.colors.active}
                  width={20}
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ width: '80%' }}
                onPress={() =>
                  auth
                    ? navigation.navigate('AddressList', { isFromBusinesses: true })
                    : navigation.navigate('AddressForm', {
                      address: orderState.options?.address,
                      isFromBusinesses: true,
                      isGuestUser: isGuestUser
                    })
                }
              >
                <OText numberOfLines={1} ellipsizeMode={'tail'} weight={'bold'} style={{}}>
                  {orderState?.options?.address?.address || t('WHAT_IS_YOUR_ADDRESS', 'What\'s your address?')}
                </OText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  auth
                    ? navigation.navigate('AddressList', { isFromBusinesses: true })
                    : navigation.navigate('AddressForm', {
                      address: orderState.options?.address,
                      isFromBusinesses: true,
                      isGuestUser: isGuestUser
                    })
                }
              >
                <Ionicons name='caret-down' size={20} />
              </TouchableOpacity>
            </AddressInputContainer>
          </AddressInput>
        )}
        {!isCart && onHandleCart && (
          <CartIconWrapper>
            <WrapperCartIcon
              onPress={() => onHandleCart()}
              activeOpacity={0.7}
              accessible
              accessibilityRole="button"
              accessibilityLabel={t('CART', 'Cart')}
            >
              <FontAwesomeIcon
                name="shopping-basket"
                size={22}
                color={totalCartItems > 0 ? theme.colors.primary : theme.colors.black}
              />
            </WrapperCartIcon>
            {totalCartItems > 0 && (
              <CartBadge>
                <OText size={10} weight="600" color={theme.colors.white}>
                  {totalCartItems > 99 ? '99+' : totalCartItems}
                </OText>
              </CartBadge>
            )}
          </CartIconWrapper>
        )}
      </Search>
      {openFarAwayPopover && (
        <AddressAlertPopover
          isVisible={isFarAway && !hideAddress}
          open={openFarAwayPopover}
          setOpen={setOpenFarAwayPopover}
          text={t('AWAY_FROM_ADDRESS', 'Is this the right address? It seems like you\'re a bit far away.')}
        />
      )}

      {!hideOrderControl && (
        <Animated.View
          style={{
            opacity: collapseAnim,
            overflow: 'hidden',
            height: controlsHeight
              ? collapseAnim.interpolate({ inputRange: [0, 1], outputRange: [0, controlsHeight] })
              : undefined
          }}
        >
          <View
            onLayout={(event) => {
              const measured = Math.round(event.nativeEvent.layout.height)
              // Only capture the natural (expanded) height and never shrink it:
              // mid-collapse the overflow-hidden parent clamps this child, and a
              // clamped measurement would otherwise lock in a too-small height,
              // leaving the row permanently clipped / its pills misaligned.
              if (measured && !collapseControls && measured > controlsHeight) setControlsHeight(measured)
            }}
          >
            <OrderControlContainer>
          <WrapMomentOption
            onPress={() => navigation.navigate('OrderTypes', { configTypes: configTypes, setOrderTypeValue })}
            width={orderState.options?.moment ? 35 : 45}
          >
            <OText size={theme.utils.tsize.m - 1} numberOfLines={1} weight={'600'} ellipsizeMode={'tail'}>
              {t(getTypesText(orderTypeValue || orderState?.options?.type || 1))}
            </OText>
            <OIcon
              src={theme.images.general.arrow_down}
              width={14}
              color={theme.colors.black}
            />
          </WrapMomentOption>
          {isPreorderEnabled && (
            <WrapMomentOption
              onPress={() => handleMomentClick()}
              width={orderState.options?.moment ? 40 : 25}
            >
              <OText
                size={orderState.options?.moment ? theme.utils.tsize.s : theme.utils.tsize.m}
                numberOfLines={orderState.options?.moment ? 2 : 1}
                weight={'600'}
                ellipsizeMode="tail"
              >
                {orderState.options?.moment
                  ? parseDate(orderState.options?.moment, { outputFormat: `${preorderDateFormat} ${timeFormat}` })
                  : t('ASAP_ABBREVIATION', 'ASAP')}
              </OText>
            </WrapMomentOption>
          )}
          {showBusinessSearchMap && (
            <WrapMomentOption
              onPress={() => navigation.navigate('BusinessSearchMap')}
              width={16}
              style={{ justifyContent: 'center' }}
            >
              <OIcon
                src={theme.images.general.pin_map}
                width={20}
                height={20}
              />
            </WrapMomentOption>
          )}
            </OrderControlContainer>
          </View>
        </Animated.View>
      )}
    </>
  );
};
