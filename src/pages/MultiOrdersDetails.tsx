import React from 'react'
import { Platform, View } from 'react-native'
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MultiOrdersDetails as MultiOrdersDetailsController, NavBar } from '@ui'
import { useLanguage } from '@components'
import { useSuppressProfileGate } from '../contexts/CheckoutFieldsContext';

const SafeAreaContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  padding-top: ${Platform.OS === 'ios' ? '0px' : '24px'};
`;

const MultiOrdersDetails = ({ navigation, route }: any) => {
  useSuppressProfileGate();
  const [, t] = useLanguage()
  const multiOrdersDetailsProps = {
    navigation,
    orderId: route?.params?.orderId,
    isFromMultiCheckout: route.params?.isFromMultiCheckout,
    onRedirectPage: () => navigation.navigate('BottomTab', { screen: 'Home' })
  }

  return (
    <View style={{ flex: 1 }}>
    <NavBar
      title={t('MULTI_ORDERS_DETAILS', 'Multi Orders Details')}
      onActionLeft={() => navigation?.canGoBack() ? navigation?.goBack() : navigation?.navigate('BottomTab')}
    />
      <SafeAreaContainer disableScrollView>
        <MultiOrdersDetailsController {...multiOrdersDetailsProps} />
      </SafeAreaContainer>
    </View>
  )
}

export default MultiOrdersDetails
