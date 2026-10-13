import React, { useCallback, useState } from 'react';
import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'
import { useSuppressProfileGate } from '../contexts/CheckoutFieldsContext';

import { useTheme } from 'styled-components/native'

import { useLanguage } from '@components'
import { NavBar, OrderDetails as OrderDetailsController } from '@ui';
import { resolveAppDesign } from '@/utils/appDesign'

const OrderDetails = ({ navigation, route }: any) => {
  useSuppressProfileGate();
  const isFromCheckout = route.params?.isFromCheckout
  const orderNumberId = route.params?.orderNumberId
  const fromHome = route.params?.fromHome

  const theme = useTheme()
  const isMaweja = resolveAppDesign(theme) === 'maweja'
  const [, t] = useLanguage()
  const [trackingHeader, setTrackingHeader] = useState<{ subtitle?: string } | null>(null)
  const onTrackingHeader = useCallback((header: { subtitle?: string } | null) => {
    setTrackingHeader(header)
  }, [])

  const orderDetailsProps = {
    navigation,
    ...route.params,
    onTrackingHeader,
    onGoBack: () => navigation?.canGoBack?.() && navigation.goBack(),
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return
      navigation.navigate(page, params)
    }
  }

  return (
    <>
      <NavBar
        title={isMaweja
          ? t('ORDER_TRACKING', 'Order tracking')
          : (orderNumberId ? `${t('ORDER_SHORT_TEXT', 'Order')} No. ${orderNumberId}` : '')}
        subtitle={isMaweja ? (trackingHeader?.subtitle || undefined) : undefined}
        textSubTitleStyle={isMaweja ? { color: theme.colors.textNormal } : undefined}
        style={isMaweja ? { minHeight: 72, alignItems: 'center' } : undefined}
        onActionLeft={() => (isFromCheckout || fromHome)
          ? navigation.navigate('BottomTab', { screen: 'Home' })
          : navigation?.canGoBack()
            ? navigation.goBack()
            : navigation.navigate('BottomTab', { screen: 'MyOrders' })}
      />
      <SafeAreaViewWrapper disableScrollView>
        <OrderDetailsController {...orderDetailsProps} />
      </SafeAreaViewWrapper>
    </>
  );
};

export default OrderDetails;
