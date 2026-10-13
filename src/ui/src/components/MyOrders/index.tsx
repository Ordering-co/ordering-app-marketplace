import React, { useState } from 'react'
import { useTheme } from 'styled-components/native';
import { View } from 'react-native';

import { GiftCardOrdersList } from '../GiftCard/GiftCardOrdersList'
import { Tabs } from '../../Forms/Tabs'

import { useConfig, useLanguage } from '@components';
import { OrdersOption } from '@ui'

export const MyOrders = (props: any) => {
  const {
    hideOrders,
    businessesSearchList,
    refreshOrders,
    setRefreshOrders
  } = props

  const [{ configs }] = useConfig()
  const [, t] = useLanguage()
  const theme = useTheme()
  const [businessOrderIds, setBusinessOrderIds] = useState([])
  const [ordersLength, setOrdersLength] = useState({
    activeOrdersLength: null,
    previousOrdersLength: 0,
    preordersLength: 0
  });
  const [selectedOption, setSelectedOption] = useState(!hideOrders ? 'orders' : 'business')

  const hideProductsTab = theme?.orders?.components?.products_tab?.hidden
  const hideBusinessTab = theme?.orders?.components?.business_tab?.hidden

  const isGiftCardDisabled = configs?.platform_store_giftcard_enabled?.value === '0' || configs?.platform_store_giftcard_enabled?.value === false

  const tabs = [
    { tab: 'orders', type: 'orders', text: t('ORDERS', 'Orders'), enabled: true },
    { tab: 'business', type: 'business', text: t('BUSINESS', 'Business'), enabled: !hideBusinessTab },
    { tab: 'products', type: 'products', text: t('PRODUCTS', 'Products'), enabled: !hideProductsTab },
    { tab: 'giftCards', type: 'giftCards', text: t('GIFT_CARD', 'Gift card'), enabled: !isGiftCardDisabled }
  ]

  return (
    <View style={{ paddingHorizontal: theme.utils.margins.horizontal, marginTop: 20 }}>
      <View style={{ marginBottom: 16 }}>
        <Tabs
          defaultTab={selectedOption}
          defaultTabs={tabs}
          bgColorSelected={theme.colors.active}
          textColorSelected={theme.colors.white}
          textColorUnselected={theme.colors.black}
          handleChangeTab={setSelectedOption}
        />
      </View>
      {selectedOption === 'orders' && (
        <>
          <OrdersOption
            {...props}
            preOrders
            ordersLength={ordersLength}
            setOrdersLength={setOrdersLength}
            setRefreshOrders={setRefreshOrders}
            refreshOrders={refreshOrders}
          />
          <OrdersOption
            {...props}
            activeOrders
            ordersLength={ordersLength}
            setOrdersLength={setOrdersLength}
            setRefreshOrders={setRefreshOrders}
            refreshOrders={refreshOrders}
          />
          <OrdersOption
            {...props}
            ordersLength={ordersLength}
            setOrdersLength={setOrdersLength}
            setRefreshOrders={setRefreshOrders}
            refreshOrders={refreshOrders}
          />
        </>
      )}
      {selectedOption === 'business' && (
        <OrdersOption
          {...props}
          isBusiness
          titleContent={t('PRE_ORDERED', 'Pre-ordered')}
          hideOrders
          horizontal
          activeOrders
          pastOrders
          preOrders
          businessesSearchList={businessesSearchList}
          businessOrderIds={businessOrderIds}
          setBusinessOrderIds={setBusinessOrderIds}
          ordersLength={ordersLength}
          setOrdersLength={setOrdersLength}
        />
      )}
      {selectedOption === 'products' && (
        <OrdersOption
          {...props}
          isProducts
          titleContent={t('PRE_ORDERED', 'Pre-ordered')}
          hideOrders
          horizontal
          activeOrders
          pastOrders
          preOrders
          businessesSearchList={businessesSearchList}
          businessOrderIds={businessOrderIds}
          setBusinessOrderIds={setBusinessOrderIds}
          ordersLength={ordersLength}
          setOrdersLength={setOrdersLength}
        />
      )}

      {selectedOption === 'giftCards' && (
        <GiftCardOrdersList
          onNavigationRedirect={props?.onNavigationRedirect}
          refreshOrders={refreshOrders}
          setRefreshOrders={setRefreshOrders}
        />
      )}
    </View>
  )
}
