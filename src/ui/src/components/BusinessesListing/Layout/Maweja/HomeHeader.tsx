import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTheme } from 'styled-components/native'

import { useConfig, useLanguage, useOrder, useSession, useUtils } from '@components'
import { OText } from '@ui'
import { resolveThemeLogo } from '@/utils/logoSource'
import { getTypesText } from '../../../../utils'

import {
  AddressLabel,
  AddressPill,
  CartBadge,
  CartWrap,
  ControlPill,
  ControlsRow,
  HeaderBand,
  IconButton,
  Logo,
  SearchField,
  SearchLabel,
  TopRow
} from './styles'

export const HomeHeader = (props: any) => {
  const {
    navigation,
    isGuestUser,
    onHandleCart,
    setOrderTypeValue,
    orderTypeValue,
    showBusinessSearchMap,
    part = 'all'
  } = props

  const theme = useTheme()
  const [{ auth }] = useSession()
  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [{ configs }] = useConfig()
  const [{ parseDate, timeFormat, preorderDateFormat }] = useUtils()

  const logo = resolveThemeLogo({
    images: {
      logos: {
        logotype: require('../../../../../../assets/images/logotype.png'),
        logotypeInvert: require('../../../../../../assets/images/logo-long.png')
      }
    }
  })
  const address = orderState?.options?.address?.address
  const totalCartItems = (Object.values(orderState?.carts || {}) as any[]).reduce(
    (sum, cart) => sum + (cart?.products?.reduce((count: number, product: any) => count + (product?.quantity || 0), 0) || 0),
    0
  )

  const openAddress = () => {
    if (auth) {
      navigation.navigate('AddressList', { isFromBusinesses: true })
      return
    }
    navigation.navigate('AddressForm', {
      address: orderState.options?.address,
      isFromBusinesses: true,
      isGuestUser
    })
  }

  const showSticky = part === 'all' || part === 'sticky'
  const showFilters = part === 'all' || part === 'filters'
  const isPreorderEnabled = (configs?.preorder_status_enabled?.value === '1' || configs?.preorder_status_enabled?.value === 'true') &&
    Number(configs?.max_days_preorder?.value) > 0
  const momentLabel = orderState?.options?.moment
    ? parseDate(orderState.options.moment, { outputFormat: `${preorderDateFormat} ${timeFormat}` })
    : t('ASAP_ABBREVIATION', 'ASAP')

  return (
    <HeaderBand
      testID="maweja-home-header"
      $scrolled={props.scrolled}
      $topInset={part === 'sticky' ? props.topInset : 0}
    >
      {showSticky && (
        <>
          <TopRow>
            {!!logo && <Logo testID="maweja-header-logo" source={logo} resizeMode="contain" />}
            <AddressPill testID="maweja-address" onPress={openAddress} activeOpacity={0.8}>
              <Ionicons name="location-sharp" size={16} color={theme.colors.primary} />
              <AddressLabel>
                <OText numberOfLines={1} ellipsizeMode="tail" size={theme.utils.tsize.s}>
                  {address || t('WHAT_IS_YOUR_ADDRESS', 'What\'s your address?')}
                </OText>
              </AddressLabel>
              <Ionicons name="chevron-down" size={16} color={theme.colors.black} />
            </AddressPill>
            <IconButton
              testID="maweja-notifications"
              onPress={() => navigation.navigate('Notifications')}
              accessibilityRole="button"
              accessibilityLabel={t('NOTIFICATIONS', 'Notifications')}
            >
              <Ionicons name="notifications-outline" size={18} color={theme.colors.black} />
            </IconButton>
            <CartWrap>
              <IconButton
                testID="maweja-cart"
                onPress={() => onHandleCart?.()}
                accessibilityRole="button"
                accessibilityLabel={t('CART', 'Cart')}
              >
                <Ionicons name="bag-outline" size={18} color={theme.colors.black} />
              </IconButton>
              {totalCartItems > 0 && (
                <CartBadge>
                  <OText size={10} weight="600" color={theme.colors.white}>
                    {totalCartItems > 99 ? '99+' : totalCartItems}
                  </OText>
                </CartBadge>
              )}
            </CartWrap>
          </TopRow>

          <SearchField
            testID="maweja-search"
            onPress={() => navigation.navigate('BusinessSearch')}
            activeOpacity={0.8}
          >
            <Ionicons name="search" size={18} color={theme.colors.backgroundGray300} />
            <SearchLabel>
              <OText size={theme.utils.tsize.s} color={theme.colors.backgroundGray300}>
                {t('SEARCH', 'Search')}
              </OText>
            </SearchLabel>
          </SearchField>
        </>
      )}

      {showFilters && (
        <ControlsRow>
          <ControlPill
            testID="maweja-order-type"
            onPress={() => navigation.navigate('OrderTypes', {
              configTypes: configs?.order_types_allowed?.value?.split('|').map((value: string) => Number(value)) || [],
              setOrderTypeValue
            })}
          >
            <OText size={theme.utils.tsize.s} weight="600" numberOfLines={1}>
              {t(getTypesText(orderTypeValue || orderState?.options?.type || 1))}
            </OText>
          </ControlPill>
          {isPreorderEnabled && (
            <ControlPill
              testID="maweja-moment"
              $tall={!!orderState?.options?.moment}
              onPress={() => navigation.navigate('MomentOption')}
              accessibilityRole="button"
              accessibilityLabel={momentLabel}
            >
              <OText
                size={theme.utils.tsize.s}
                weight="600"
                numberOfLines={orderState?.options?.moment ? 2 : 1}
              >
                {momentLabel}
              </OText>
            </ControlPill>
          )}
          {showBusinessSearchMap && (
            <ControlPill
              testID="maweja-map"
              onPress={() => navigation.navigate('BusinessSearchMap')}
            >
              <Ionicons name="map-outline" size={16} color={theme.colors.black} />
            </ControlPill>
          )}
        </ControlsRow>
      )}
    </HeaderBand>
  )
}
