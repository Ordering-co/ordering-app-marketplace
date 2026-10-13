import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';
import FastImage from 'react-native-fast-image';

import { OText } from '@ui';
import { useUtils, useOrder, useLanguage } from '@components';
import { convertHoursToMinutes } from '../../utils';
import {
  SimpleCardCardContainer,
  SimpleCardLogoContainer,
  SimpleCardBusinessDetailsContainer
} from './styles'

const deliveryTypes = [1, 7];

export const BusinessSimpleCard = (props: any) => {
  const {
    business,
    isBusinessOpen,
    handleClick,
    businessLogo,
    businessDeliveryTime,
    businessPickupTime,
  } = props;

  const theme = useTheme();
  const [{ optimizeImage }] = useUtils();
  const [orderState] = useOrder();
  const [, t] = useLanguage();

  const handleCardClick = () => {
    if (handleClick) {
      handleClick(business);
    }
  };

  return (
    <SimpleCardCardContainer onPress={handleCardClick} activeOpacity={0.8}>
      <SimpleCardLogoContainer>
        <FastImage
          style={StyleSheet.absoluteFill}
          source={
            (businessLogo || business?.logo || typeof theme.images.dummies.businessLogo === 'string')
              ? {
                uri: optimizeImage(businessLogo || business?.logo || theme.images.dummies.businessLogo, 'w_120,h_120,c_limit'),
                priority: FastImage.priority.normal,
              }
              : theme.images.dummies.businessLogo
          }
          resizeMode={FastImage.resizeMode.cover}
        />
      </SimpleCardLogoContainer>
      <SimpleCardBusinessDetailsContainer>
        <OText size={theme.utils.tsize.m + 2} weight={'bold'} numberOfLines={1} ellipsizeMode="tail">
          {business?.name}
        </OText>

        <OText color={theme.colors.textSecondary}>
          {`${convertHoursToMinutes(
            deliveryTypes.includes(orderState?.options?.type)
              ? (businessDeliveryTime ?? business?.delivery_time)
              : (businessPickupTime ?? business?.pickup_time),
          )} \u2022 `}
        </OText>

        <OText color={isBusinessOpen ? theme.colors.success500 : theme.colors.danger}>
          {isBusinessOpen ? t('OPEN', 'Open') : t('CLOSED', 'Closed')}
        </OText>
      </SimpleCardBusinessDetailsContainer>
    </SimpleCardCardContainer>
  );
};
