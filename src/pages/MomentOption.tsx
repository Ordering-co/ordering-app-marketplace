import React from 'react';
import { useConfig, useLanguage, useOrder, useUtils } from '@components';
import { businessEndOfDay } from '../utils/dayjsTimezone';
import { MomentOption as MomentOptionController, NavBar, SafeAreaViewWrapper } from '@ui';

interface Config {
  key: string;
  value: string;
}

const MomentOption = ({ navigation, route }: any) => {
  // When opened from inside a business (pre-order), the business + go-to-menu
  // callback arrive as route params; checkout / listing entries pass none.
  const params = route?.params ?? {}
  const [{ configs }] = useConfig();
  const [orderState] = useOrder()
  const [, t] = useLanguage();
  const [{ getMaxPreorderDays }] = useUtils();
  const cateringTypes = [7, 8]
  const cateringTypeString = orderState?.options?.type === 7
    ? 'catering_delivery'
    : orderState?.options?.type === 8
      ? 'catering_pickup'
      : null
  const splitCateringValue = (configName: string) => (Object.values(configs) as Config[])?.find((config: any) => config.key === configName)?.value?.split('|')?.find((val: any) => val.includes(cateringTypeString))?.split(',')[1] ?? ''
  const preorderSlotInterval = parseInt(splitCateringValue('preorder_slot_interval'))
  const preorderLeadTime = parseInt(splitCateringValue('preorder_lead_time'))
  const preorderTimeRange = parseInt(splitCateringValue('preorder_time_range'))
  const preorderMaximumDays = parseInt(splitCateringValue('preorder_maximum_days'))
  const preorderMinimumDays = parseInt(splitCateringValue('preorder_minimum_days'))
  const defaultLimitDays = getMaxPreorderDays(orderState?.options?.type)
  const limitDays = Number(cateringTypes.includes(orderState?.options?.type) && Number.isFinite(preorderMaximumDays)
    ? preorderMaximumDays
    : defaultLimitDays);
  const daysAhead = limitDays > 1 ? limitDays - 1 : limitDays === 1 ? 0 : 6
  const maxDate = params?.business?.timezone
    ? businessEndOfDay(params.business.timezone, daysAhead)
    : (() => {
        const currentDate = new Date();
        const time =
          limitDays > 1
            ? currentDate.getTime() + (limitDays - 1) * 24 * 60 * 60 * 1000
            : limitDays === 1
              ? currentDate.getTime()
              : currentDate.getTime() + 6 * 24 * 60 * 60 * 1000;
        currentDate.setTime(time);
        currentDate.setHours(23);
        currentDate.setMinutes(59);
        return currentDate;
      })();
  const momentOptionProps = {
    ...params,
    navigation: navigation,
    maxDate,
    cateringPreorder: cateringTypes.includes(orderState?.options?.type),
    preorderSlotInterval,
    preorderLeadTime,
    preorderTimeRange,
    preorderMinimumDays,
    preorderMaximumDays,
    isPage: true,
    goToBack: () => navigation?.canGoBack() && navigation.goBack(),
  };
  return (
    <>
      {maxDate ? (
        <>
          <NavBar
            title={t('DELIVERY_TIME', 'Delivery time')}
            onActionLeft={() => momentOptionProps.goToBack()}
          />
          <SafeAreaViewWrapper disableScrollView>
            <MomentOptionController {...momentOptionProps} />
          </SafeAreaViewWrapper>
        </>
      ) : null}
    </>
  );
};

export default MomentOption;
