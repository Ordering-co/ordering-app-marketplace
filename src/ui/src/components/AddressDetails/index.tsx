import React from 'react';
import FastImage from 'react-native-fast-image'
import { StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import {
  AddressDetails as AddressDetailsController,
  useOrder,
  useLanguage,
  useConfig,
} from '@components';

import { getTypesText } from '../../utils';
import { ADContainer, ADHeader, ADAddress, ADMap } from './styles';
import { OText } from '../shared';
import { PressableScale } from '../shared/PressableScale';
import { Card, CardBody } from '../Checkout/layouts/Maweja/styles';
import { MawejaCardTitle } from '../Checkout/layouts/Maweja';

const AddressDetailsUI = (props: any) => {
  const {
    navigation,
    addressToShow,
    isCartPending,
    googleMapsUrl,
    apiKey,
    uuid
  } = props;

  const theme = useTheme();
  const [orderState] = useOrder();
  const [{ options }] = useOrder();
  const [{ configs }] = useConfig()
  const [, t] = useLanguage();
  const { width } = useWindowDimensions();
  const useAlternativeMap = configs?.use_alternative_to_google_maps?.value === '1'

  const orderTypeText = {
    key: getTypesText(options?.type || 1),
    value: t(getTypesText(options?.type || 1), 'Delivery')
  }
  const addressText = addressToShow || orderState?.options?.address?.address
  const openAddressList = () => navigation.navigate('AddressList', { isFromCheckout: true, cartUuid: uuid })

  if (props.layout === 'maweja') {
    return (
      <PressableScale disabled={isCartPending} onPress={openAddressList}>
        <Card>
          <CardBody>
            <MawejaCardTitle
              icon="map-marker"
              title={t(`${orderTypeText.key}_ADDRESS`, `${orderTypeText.value} address`)}
            />
            <OText size={15} color={theme.colors.black}>{addressText}</OText>
            {!!orderState?.options?.address?.address_notes && (
              <OText size={13} color={theme.colors.textSecondary}>
                {orderState?.options?.address?.address_notes}
              </OText>
            )}
          </CardBody>
        </Card>
      </PressableScale>
    )
  }

  const styles = StyleSheet.create({
    productStyle: {
      width,
      height: 151,
      marginVertical: 10
    }
  })

  return (
    <ADContainer>
      <ADHeader>
        {props.HeaderTitle ?? (
          <OText
            size={16}
            lineHeight={24}
            color={theme.colors.textNormal}
          >
            {t(`${orderTypeText.key}_ADDRESS`, `${orderTypeText.value} address`)}
          </OText>
        )}
      </ADHeader>
      {!useAlternativeMap && !!apiKey && googleMapsUrl && (
        <ADMap
          style={{ width, flex: 1, marginStart: -20, marginEnd: -20, }}>
          <FastImage
            style={styles.productStyle}
            source={{
              uri: googleMapsUrl,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </ADMap>
      )}
      <ADAddress>
        <View style={{ flexDirection: 'column', alignItems: 'flex-start', width: '85%' }}>
          <OText
            color={theme.colors.textNormal}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ width: '100%' }}>
            {addressToShow || orderState?.options?.address?.address}
          </OText>
          {!!orderState?.options?.address?.address_notes && (
            <OText color={theme.colors.textNormal}>
              {orderState?.options?.address?.address_notes}
            </OText>
          )}
        </View>
        {orderState?.options?.type === 1 && !isCartPending && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AddressList', { isFromCheckout: true, cartUuid: uuid })
            }>
            <MaterialCommunityIcon
              name='pencil-outline'
              size={24}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </ADAddress>
    </ADContainer>
  );
};

export const AddressDetails = (props: any) => {
  const addressDetailsProps = {
    ...props,
    UIComponent: AddressDetailsUI,
  };
  return <AddressDetailsController {...addressDetailsProps} />;
};
