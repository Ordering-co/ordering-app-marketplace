import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useOrder, useLanguage, useUtils, useConfig, useEvent } from '@components';
import { useTheme } from 'styled-components/native';
import {
  BIContainer,
  BIHeader,
  BIContent,
  BIInfo,
  BIContentInfo,
  BITotal,
  BIActions,
  PriceContainer
} from './styles';
import { OAlert, OButton, OIcon, OText } from '../shared';
import momentjs from 'moment'

export const BusinessItemAccordion = (props: any) => {
  const {
    cart,
    moment,
    handleClearProducts,
    handleClickCheckout,
    checkoutButtonDisabled,
    isMultiCheckout,
    isFromUpselling,
    changeActiveState,
    isActive,
    isGiftCart,
    cartReservation,
    hasCartReservation
  } = props

  const [orderState] = useOrder();
  const [, t] = useLanguage();
  const [{ parsePrice, is12Hours }] = useUtils();
  const [{ configs }] = useConfig()
  const theme = useTheme();
  const [events] = useEvent()

  const isCartPending = cart?.status === 2
  const isClosed = !cart?.valid_schedule
  const isProducts = cart?.products?.length
  const isBusinessChangeEnabled = configs?.cart_change_business_validation?.value === '1' && orderState?.options?.type !== 9
  const is12hours = is12Hours
  const isValidReservation = cartReservation && momentjs(cartReservation?.reserve_date).format('YYYY-MM-DD HH:mm:ss') > momentjs().format('YYYY-MM-DD HH:mm:ss')
  const [viewedCart, setViewedCart] = useState<any>(null)
  useEffect(() => {
    const cartsArray = Object.values(orderState?.carts)
    const cartsLength = cartsArray.filter((cart: any) => cart?.products?.length > 0)?.length ?? 0
    if (cartsLength === 1) {
      changeActiveState && changeActiveState(!isClosed, cart?.uuid)
    }
  }, [orderState?.carts?.length, isClosed])

  const subtotalWithTaxes = cart?.taxes?.reduce((acc: any, item: any) => {
    if (item?.type === 1)
      return acc = acc + item?.summary?.tax
    return acc = acc
  }, cart?.subtotal)

  const bgStyle = (subtotalWithTaxes < cart?.minimum || !cart?.valid_address) ? theme.colors.secundary : theme.colors.primary
  const textStyles = (subtotalWithTaxes < cart?.minimum || !cart?.valid_address) ? theme.colors.black : theme.colors.white

  useEffect(() => {
    if (isActive && !isFromUpselling) {
      if (cart?.uuid !== viewedCart?.uuid) {
        setViewedCart(cart)
        events.emit('cart_viewed', cart)
      }
    }
  }, [isActive, viewedCart])

  const handleGoToStore = () => {
    props.onNavigationRedirect('Business', { store: cart?.business?.slug })
  }

  return (
    <BIContainer isClosed={isClosed} isMultiCheckout={isMultiCheckout} checkoutVisible={!isActive && !isClosed && !!isProducts && !checkoutButtonDisabled}>
      <BIHeader
        isClosed={isClosed}
        onPress={() => !isClosed ? changeActiveState && changeActiveState(!isClosed, cart?.uuid) : isClosed}
        activeOpacity={1}
      >
        <BIInfo>
          <BIContentInfo>
            {isGiftCart && (
              <OText size={16} lineHeight={24} weight={'600'}>{t('GIFT_CARD_CHECKOUT', 'Gift card checkout')}</OText>
            )}
            {!!cart?.business?.name && (
              <OText size={16} lineHeight={24} weight={'600'}>{cart?.business?.name}</OText>
            )}
            <View style={{ flexDirection: 'row' }}>
              {props.onNavigationRedirect && !isClosed && !isGiftCart && (
                <>
                  <TouchableOpacity onPress={() => handleGoToStore()}>
                    <OText color={theme.colors.primary} size={12} lineHeight={18} style={{ textDecorationLine: 'underline' }}>{t('GO_TO_STORE', 'Go to store')}</OText>
                  </TouchableOpacity>
                </>
              )}
              {!isCartPending && (
                <>
                  {!isGiftCart && (
                    <OText color={theme.colors.textSecondary}>{' \u2022 '}</OText>
                  )}
                  <OAlert
                    title={t('DELETE_CART', 'Delete Cart')}
                    message={t('QUESTION_DELETE_CART', 'Are you sure to you wants delete the selected cart')}
                    onAccept={() => handleClearProducts()}
                  >
                    <OText size={12} lineHeight={18} color={theme.colors.primary} style={{ textDecorationLine: 'underline' }}>{t('CLEAR_CART', 'Clear cart')}</OText>
                  </OAlert>
                </>
              )}
              {isBusinessChangeEnabled && props.handleChangeStore && !isGiftCart && !isCartPending && (
                <>
                  <OText color={theme.colors.textSecondary}>{' \u2022 '}</OText>
                  <TouchableOpacity
                    onPress={props.handleChangeStore}
                  >
                    <OText
                      size={12}
                      lineHeight={18}
                      color={theme.colors.primary}
                      style={{ textDecorationLine: 'underline' }}
                    >
                      {t('CHANGE_STORE', 'Change store')}
                    </OText>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </BIContentInfo>
        </BIInfo>

        {isClosed && (
          <BITotal>
            <OText color={theme.colors.red} size={12}>{t('CLOSED', 'Closed')} {moment}</OText>
          </BITotal>
        )}

        {!isClosed && !isProducts && (
          <BITotal>
            <OText>{cartReservation && orderState?.options?.type === 9 ? t('ONLY_TABLE', 'Only table') : t('NO_PRODUCTS', 'No products')}</OText>
          </BITotal>
        )}

        <BIActions>

          {!isClosed && (!!isProducts || cartReservation && orderState?.options?.type === 9) && (
            <>
              <OIcon src={!isActive ? theme.images.general.drop_down : theme.images.general.drop_up} width={12} />
            </>
          )}
        </BIActions>
      </BIHeader>
      {!isActive && !isClosed && !!isProducts && !isMultiCheckout && ((hasCartReservation && isValidReservation)) && (
        <PriceContainer>
          <OText>{parsePrice(cart?.total)}</OText>
          {cart?.valid_products && (
            <OButton
              onClick={handleClickCheckout}
              textStyle={{ color: textStyles, textAlign: 'center', flex: 1 }}
              style={{ width: 180, flexDirection: 'row', justifyContent: 'center', borderRadius: 7.6, shadowOpacity: 0 }}
              text={t('CHECKOUT', 'Checkout')}
              disabled={checkoutButtonDisabled}
            />
          )}
        </PriceContainer>
      )}
      {isActive && cartReservation && orderState?.options?.type === 9 && (
        <View>
          <OText size={12} color={!isValidReservation ? theme.colors.danger5 : theme.colors.black}>
            {t('RESERVATION', 'Reservation')} • {is12hours ? momentjs(cartReservation?.reserve_date).format('YYYY-MM-DD hh:mm a') : cartReservation?.reserve_date} • {cartReservation?.guests_reservation} {t('GUESTS', 'Guests')}
          </OText>
        </View>
      )}
      <BIContent style={{ display: isActive ? 'flex' : 'none' }}>
        {props.children}
      </BIContent>
    </BIContainer>
  )
}
