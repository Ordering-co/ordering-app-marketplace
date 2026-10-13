import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import FastImage from 'react-native-fast-image';

import {
  CardContainer,
  TopRow,
  LogoContainer,
  InfoContainer,
  GoToOrdersButton,
  ProgressBarTrack,
  ProgressBarFill,
  BottomRow,
} from './styles'
import { OrderEta } from '../OrderDetails/OrderEta'

const deliveryTypes = [1, 7]

import { useLanguage, useUtils } from '@components'
import { OText } from '@ui'

const hasImageSource = (value: unknown) => (
  typeof value === 'number' || (typeof value === 'string' && value.trim().length > 0)
)

export const OrderCard = (props: any) => {
  const { lastOrder, statusToShow, progressBarObjt, handleGoToOrder } = props;

  const theme = useTheme();
  const [, t] = useLanguage()
  const [{ optimizeImage, parseTime, parseDate, timeFormat }] = useUtils()

  const businessLogo = lastOrder?.business?.logo
  const hasBusinessLogo = typeof businessLogo === 'string' && businessLogo.includes('http')
  const defaultBusinessImage = theme?.images?.dummies?.businessLogo
  const logoSource = hasBusinessLogo
    ? { uri: optimizeImage(businessLogo, 'h_96,c_limit'), priority: FastImage.priority.normal }
    : hasImageSource(defaultBusinessImage)
      ? (typeof defaultBusinessImage === 'string'
        ? { uri: defaultBusinessImage, priority: FastImage.priority.normal }
        : defaultBusinessImage)
      : null

  const progressPercentage = progressBarObjt(lastOrder.status)?.percentage ? `${(progressBarObjt(lastOrder.status) as any).percentage * 100}%` : '0%'

  return (
    <CardContainer style={{ backgroundColor: theme.colors.backgroundCard || theme.colors.white }}>
      <TopRow>
        {!!logoSource && (
          <LogoContainer>
            <FastImage
              style={{ width: '100%', height: '100%' }}
              source={logoSource}
              resizeMode={FastImage.resizeMode.contain}
            />
          </LogoContainer>
        )}

        <InfoContainer>
          <OText size={12} color={theme.colors.textGray}>
            {statusToShow.includes(lastOrder?.status) ? t('ORDER_IN_PROGRESS', 'Order in progress') : t('ORDER', 'Order')}
          </OText>
          <OText size={16} weight='bold'>{lastOrder?.business?.name || 'Coffee Shop'}</OText>
        </InfoContainer>

        <TouchableOpacity onPress={() => handleGoToOrder('OrderDetails', { orderId: lastOrder?.uuid, orderNumberId: lastOrder?.id })}>
          <GoToOrdersButton>
            <OText size={13} weight='bold'>{t('GO_TO_ORDER', 'Go to order')}</OText>
          </GoToOrdersButton>
        </TouchableOpacity>
      </TopRow>

      <ProgressBarTrack>
        <ProgressBarFill style={{ width: progressPercentage }} />
      </ProgressBarTrack>

      <BottomRow>
        <OText size={12} color={theme.colors.active} style={{ width: '50%' }}>{progressBarObjt(lastOrder.status)?.value}</OText>
        <OText size={11}>{deliveryTypes?.includes?.(lastOrder?.delivery_type) ? t('ESTIMATED_DELIVERY', 'Estimated delivery') : t('ESTIMATED_TIME', 'Estimated time')}</OText>
      </BottomRow>
      <View style={{ alignItems: 'flex-end' }}>
        <OText size={11} weight='bold'>
          {lastOrder?.delivery_datetime_utc
            ? parseTime(lastOrder?.delivery_datetime_utc, { outputFormat: timeFormat || 'HH:mm' })
            : parseTime(lastOrder?.delivery_datetime, { utc: false })}
          &nbsp;-&nbsp;
          {statusToShow.includes(lastOrder?.status) ? (
            <OrderEta order={lastOrder} outputFormat={timeFormat || 'HH:mm'} />
          ) : (
            parseDate(lastOrder?.reporting_data?.at[`status:${lastOrder.status}`], { outputFormat: timeFormat })
          )}
        </OText>
      </View>
    </CardContainer>
  );
};
