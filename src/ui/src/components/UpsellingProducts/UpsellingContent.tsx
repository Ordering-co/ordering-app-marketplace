import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useTheme } from 'styled-components/native';
import { ScrollView } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';

import { UpsellingLayout } from './UpsellingLayout';
import { HeaderContent } from '../BusinessesListing/Layout/Original/HeaderContent';

import { Divider } from './styles'

import { useLanguage, useOrder } from '@components'
import { OText, OrderSummary, FloatingButton, ProductItemAccordion, CartStudentAlert } from '@ui'

export const UpsellingContent = (props: any) => {
  const {
    navigation,
    businessId,
    handleUpsellingPage,
    onNavigationRedirect,
    productsList
  } = props

  const theme = useTheme();
  const [, t] = useLanguage()
  const [{ carts, loading }] = useOrder()
  const isFocused = useIsFocused()

  const cartExists = !!carts?.[`businessId:${businessId}`]
  const cart = carts?.[`businessId:${businessId}`] ?? {}

  useEffect(() => {
    if (loading || !isFocused) return
    if (!cartExists) return
    if (cart?.products?.length === 0 || !cart?.products) {
      navigation.goBack()
    }
  }, [cart?.products, loading, isFocused, cartExists])

  const handleClickCheckout = () => {
    if (handleUpsellingPage) {
      handleUpsellingPage(cart)
    } else {
      navigation.navigate('CheckoutPage', {
        cartUuid: cart?.uuid
      })
    }
  }

  return (
    <>
      {cart?.business?.vertical === 'school' && (
        <CartStudentAlert cart={cart} />
      )}
      <HeaderContent
        isCart
        navigation={navigation}
        onGoBack={() => navigation.goBack()}
      />
      <ScrollView
        style={{ marginTop: 20, marginBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <OrderSummary
            cart={cart}
            isCartProductView
            showOnlyProducts
            isCartPending={cart?.status === 2}
            onNavigationRedirect={onNavigationRedirect}
          />
        </View>
        {productsList.length > 0 && (
          <>
            <Divider />
            <View style={{ paddingHorizontal: 20, marginTop: 20, overflow: 'visible' }}>
              <OText size={18} weight={'500'}>{t('COMPLEMENT_YOUR_ORDER', 'Complement your order')}</OText>
              <OText color={theme.colors.textSecondary}>{t('COMPLEMENT_YOUR_ORDER_DESCRIPTION', 'Users often include these products in their orders.')}</OText>
              <UpsellingLayout {...props} />
            </View>
          </>
        )}
      </ScrollView>
      <FloatingButton
        text={t('CHECKOUT', 'Checkout')}
        text2nd={t('ADD_MORE_PRODUCTS', 'Add more products')}
        reverseOrder
        flexDirection='row'
        classBtn2='secondary'
        handle2ndClick={() => navigation.goBack()}
        handleClick={() => handleClickCheckout()}
      />
    </>
  )
}
