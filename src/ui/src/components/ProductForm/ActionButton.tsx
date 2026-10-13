import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useTheme } from 'styled-components/native'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';

import { useSession, useOrder, useLanguage, useConfig } from '@components'
import { OButton, OText } from '../shared';

export const ActionButton = (props: any) => {
  const {
    navigation,
    isHaveWeight,
    isSoldOut,
    maxProductQuantity,
    productCart,
    handleSaveProduct,
    editMode,
    product,
    errors,
    productAddedToCartLength,
    handleRedirectLogin,
    guestCheckoutEnabled,
    orderTypeEnabled,
    handleUpdateGuest,
    actionStatus,
    needsStudent,
    onSelectStudent
  } = props

  const [, t] = useLanguage()
  const [{ auth }] = useSession()
  const [orderState] = useOrder()
  const theme = useTheme()
  const [{ configs }] = useConfig()
  const unaddressedTypes = configs?.unaddressed_order_types_allowed?.value.split('|').map((value: any) => Number(value)) || []
  const isAllowUnaddressOrderType = unaddressedTypes.includes(orderState?.options?.type)
  const saveErrors =
    orderState.loading ||
    maxProductQuantity === 0 ||
    Object.keys(errors)?.length > 0;
  const buttonColor = saveErrors || isSoldOut || maxProductQuantity <= 0 || (product?.minimum_per_order && ((productCart?.quantity + productAddedToCartLength) < product?.minimum_per_order)) || (product?.maximum_per_order && ((productCart?.quantity + productAddedToCartLength) > product?.maximum_per_order))

  return (
    <View
      style={{ width: isHaveWeight ? '100%' : ((isSoldOut || maxProductQuantity <= 0) ? '60%' : '40%') }}
    >
      {auth && needsStudent && (
        <OButton
          class='primary'
          onClick={() => onSelectStudent && onSelectStudent()}
          text={t('SCHOOL_SELECT_STUDENT', 'Select a student')}
          textStyle={{ fontSize: 14 }}
        />
      )}

      {(productCart &&
        auth &&
        !needsStudent &&
        ((orderState.options?.address_id || isAllowUnaddressOrderType) || (isSoldOut || maxProductQuantity <= 0))) && (
          <OButton
            class='primary'
            onClick={() => handleSaveProduct()}
            text={`${orderState.loading
              ? t('LOADING', 'Loading')
              : (isSoldOut || maxProductQuantity <= 0)
                ? t('SOLD_OUT', 'Sold out')
                : editMode
                  ? t('UPDATE', 'Update')
                  : t('ADD', 'Add')
              }`}
            disabled={buttonColor}
            textStyle={{
              fontSize: orderState.loading || editMode ? 10 : 14
            }}
          />
        )}

      {auth && !needsStudent &&
        !orderState.options?.address_id && !isAllowUnaddressOrderType &&
        (orderState.loading ? (
          <OButton
            disabled
            text={t('LOADING', 'Loading')}
            textStyle={{ fontSize: 10 }}
          />
        ) : (
          <OButton testID="product-address-redirect" onClick={() => navigation.navigate('AddressList', { isGoBack: true })} />
        ))}

      {!auth && (
        <OButton
          class='primary'
          disabled={isSoldOut || maxProductQuantity <= 0}
          onClick={() => handleRedirectLogin()}
          text={
            isSoldOut || maxProductQuantity <= 0
              ? t('SOLD_OUT', 'Sold out')
              : t('LOGIN_SIGNUP', 'Login / Sign Up')
          }
          textStyle={{ fontSize: 13, textAlign: 'center' }}
          style={{
            height: 42,
            paddingLeft: 0,
            paddingRight: 0,
            borderRadius: 7.6
          }}
        />
      )}

      {!auth && guestCheckoutEnabled && orderTypeEnabled && (
        <TouchableOpacity style={{ marginTop: 10, alignItems: 'center' }} onPress={handleUpdateGuest} disabled={buttonColor}>
          {actionStatus?.loading ? (
            <Placeholder Animation={Fade}>
              <PlaceholderLine height={20} />
            </Placeholder>
          ) : (
            <OText color={buttonColor ? theme.colors.disabled : theme.colors.primary} size={13} style={{ textAlign: 'center' }}>{t('AS_GUEST_USER', 'As guest user')}</OText>
          )}
        </TouchableOpacity>
      )}
    </View>
  )
}
