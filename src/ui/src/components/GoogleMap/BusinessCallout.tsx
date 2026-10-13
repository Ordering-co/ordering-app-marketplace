import React from 'react';
import moment from 'moment'
import dayjs from 'dayjs'
import { useTheme } from 'styled-components/native';

import { GoogleMapUtils } from './utils';

import {
  ContainerCard,
  BusinessHero,
  BusinessNameContainer,
  Medadata,
  OrderButton
} from './styles';

import { useLanguage, useOrder, useUtils } from '@components';
import { OText } from '@ui';

export const BusinessCallout = ({ business, onPressButton }: any) => {

  if (!business) return null;

  const [orderState] = useOrder();
  const theme = useTheme();
  const [, t] = useLanguage();
  const [{ parsePrice, parseDistance, parseTime }] = useUtils()
  const { convertHoursToMinutes } = GoogleMapUtils();

  const checkTime = (val: number) => val < 10 ? `0${val}` : val

  const findTodayLapse = (business: any) => {
    if (business?.today?.enabled) {
      const currentDate = dayjs().tz(business?.timezone)
      const lapse = business?.today?.lapses?.find((lapse: any) => {
        const from = currentDate.hour(lapse.open.hour).minute(lapse.open.minute)
        const to = currentDate.hour(lapse.close.hour).minute(lapse.close.minute)
        return currentDate.unix() >= from.unix() && currentDate.unix() <= to.unix()
      })
      return lapse || business?.today?.lapses?.[0]
    }
  }

  return (
    <ContainerCard>
      <BusinessHero>
        <BusinessNameContainer>
          <OText color={theme.colors.black} weight={'bold'} numberOfLines={1}>
            {business?.description || business?.name}
          </OText>
          <OText color={theme.colors.black} numberOfLines={2}>
            {business?.address}
          </OText>
          <Medadata>
            {orderState?.options?.type === 1 && business?.delivery_price >= 0 && (
              <OText color={theme.colors.black} style={{ marginRight: 5 }}>
                {t('DELIVERY_FEE', 'Delivery Fee')} {parsePrice(business?.delivery_price)}
              </OText>
            )}
            <OText color={theme.colors.black} style={{ marginRight: 5 }}>
              {`${convertHoursToMinutes(orderState?.options?.type === 1 ? business?.delivery_time : business?.pickup_time)} •`}
            </OText>
            <OText color={theme.colors.black}>
              {parseDistance(business?.distance || 0)}
            </OText>
          </Medadata>
          <OText color={theme.colors.black} weight={'bold'} style={{ marginTop: 10 }}>
            {business?.open && business?.today?.enabled
              ? `${t('OPEN_AT', 'OPEN AT')} ${parseTime(moment(`${checkTime(findTodayLapse(business)?.open?.hour)}:${checkTime(findTodayLapse(business)?.open?.minute)}`, 'HH:mm'))} - ${parseTime(moment(`${checkTime(findTodayLapse(business)?.close?.hour)}:${checkTime(findTodayLapse(business)?.close?.minute)}`, 'HH:mm'))}`
              : t('STORE_CLOSED', 'Store Closed')}
          </OText>
          {business?.open && business?.today?.enabled && (
            <OrderButton onPress={onPressButton}>
              <OText color={theme.colors.white} size={10} weight={'bold'} style={{ textTransform: 'uppercase' }}>
                {t('ORDER_NOW', 'Order Now')}
              </OText>
            </OrderButton>
          )}
        </BusinessNameContainer>
      </BusinessHero>
    </ContainerCard>
  );
};
