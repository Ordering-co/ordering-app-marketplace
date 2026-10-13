import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import { ScrollView, Pressable } from 'react-native';
import { useTheme } from 'styled-components/native';

import { MomentOptionParams } from '../../types';

import {
  Container,
  HeaderWrapper,
  DayTabsRow,
  DayTabCard,
  DayTabLabels,
  SectionWrapper,
  OptionRow,
  OptionLabels,
  EmptyWrapper,
  CancelButton
} from './styles';

import {
  useLanguage,
  useConfig,
  useOrder,
  useUtils,
  createDayjsWithTimezone,
  MomentOption as MomentOptionController,
} from '@components';
import { monthsEnum, setLocalMoment } from '../../utils';
import { TimeListItem } from './TimeListItem';
import {
  FloatingButton,
  OIcon,
  OText
} from '@ui'

const MomentOptionUI = (props: MomentOptionParams) => {
  const {
    navigation,
    datesList,
    hoursList,
    dateSelected,
    timeSelected,
    cateringPreorder,
    isCart,
    preorderLeadTime,
    business,
    handleBusinessClick,
    getActualSchedule,
    preorderMaximumDays,
    preorderMinimumDays,
    handleAsap,
    handleChangeDate,
    handleChangeTime,
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [{ configs }] = useConfig();
  const [orderState] = useOrder();
  const [{ is12Hours, getMaxPreorderDays }] = useUtils();

  const is12hours = is12Hours
  const maxPreorderDays = getMaxPreorderDays(orderState?.options?.type)

  const [isAsapSelected, setIsAsapSelected] = useState(false);
  const [selectedTime, setSelectedTime] = useState<any>(null);
  const [timeList, setTimeList] = useState<any>(hoursList);
  const [nextTime, setNextTime] = useState<any>(null);

  // Business clock, not the device's: `dateSelected` comes from the controller in
  // the business timezone. Not memoised — it must follow the business day rolling over.
  const businessNow: any = business?.timezone
    ? createDayjsWithTimezone(business.timezone)
    : moment()
  const todayStr = businessNow.format('YYYY-MM-DD')
  const isTodaySelected = dateSelected === todayStr
  const showAsapRow = !cateringPreorder && isTodaySelected
  const showFooter = !isCart && !cateringPreorder
  const isBusinessPreorder = !!handleBusinessClick
  const showTimeRange = !isBusinessPreorder && [1, 7].includes(orderState?.options?.type)
  const slotInterval = parseInt(configs?.preorder_slot_interval?.value, 10) > 0
    ? parseInt(configs?.preorder_slot_interval?.value, 10)
    : 30

  const goToBack = () => navigation?.canGoBack() && navigation.goBack();

  const formatHour = (hhmm: string) =>
    moment(hhmm, 'HH:mm').format(is12hours ? 'h:mm A' : 'HH:mm')

  const getDayTabLabels = (dateStr: string) => {
    const date = moment(dateStr, 'YYYY-MM-DD')
    const diffDays = date.clone().startOf('day').diff(moment(todayStr, 'YYYY-MM-DD').startOf('day'), 'days')
    const label = diffDays === 0
      ? t('TODAY', 'Today')
      : diffDays === 1
        ? t('TOMORROW', 'Tomorrow')
        : t(date.format('dddd').toUpperCase(), date.format('dddd'))
    const sub = `${t(monthsEnum[date.format('MMM')], date.format('MMM'))} ${date.format('D')}`
    return { label, sub }
  }

  const tabDates = useMemo(() => {
    const start = (cateringPreorder && preorderMinimumDays) || 0
    const end = Number(cateringPreorder
      ? (preorderMaximumDays || maxPreorderDays)
      : (maxPreorderDays ?? 6))
    return (datesList ?? []).slice(start, end)
  }, [JSON.stringify(datesList), cateringPreorder, preorderMinimumDays, preorderMaximumDays, maxPreorderDays])

  const leaveScreen = () => {
    if (handleBusinessClick && business) {
      handleBusinessClick(business)
    } else {
      goToBack()
    }
  }

  const onSelectDay = (dateStr: string) => {
    if (dateStr === dateSelected) return
    setSelectedTime(null)
    setIsAsapSelected(false)
    handleChangeDate && handleChangeDate(dateStr)
  }

  const onSelectTime = (time: any) => {
    setIsAsapSelected(false)
    if (cateringPreorder) {
      handleChangeTime(time)
    } else {
      setSelectedTime(time)
    }
  }

  const onSelectAsap = () => {
    setSelectedTime(null)
    setIsAsapSelected(true)
    if (!showFooter) handleAsap()
  }

  const handleConfirm = () => {
    if (isAsapSelected) handleAsap()
    else handleChangeTime(selectedTime)
    leaveScreen()
  }

  useEffect(() => {
    setIsAsapSelected(!orderState.options?.moment)
  }, [orderState.options?.moment]);

  useEffect(() => {
    setSelectedTime(timeSelected)
  }, [timeSelected])

  // Keep the controller's selected date in sync for the catering vertical
  useEffect(() => {
    if (cateringPreorder && dateSelected) {
      handleChangeDate && handleChangeDate(dateSelected)
    }
  }, [dateSelected])

  useEffect(() => {
    const hasBusiness = Object.keys(business || {}).length > 0
    const schedule = hasBusiness && getActualSchedule?.()
    if (cateringPreorder && hasBusiness && !schedule) {
      setTimeList([])
      return
    }
    // Both sides are wall clocks on the business's day — never parse them into
    // instants, that applies the device offset to one side only.
    const minutesOf = (hhmm: string) => {
      const [h, m] = String(hhmm).split(':').map(Number)
      return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : null
    }
    const leadTime = cateringPreorder && Number.isFinite(preorderLeadTime) ? preorderLeadTime : 0
    const lapses = (schedule?.lapses ?? []).filter((lapse: any) =>
      Number.isFinite(lapse?.open?.hour) && Number.isFinite(lapse?.close?.hour))
    const nowMinutes = businessNow.hour() * 60 + businessNow.minute()

    const slots = (hoursList ?? [])
      .filter((hour: any) => {
        const start = minutesOf(hour.startTime)
        const end = minutesOf(hour.endTime)
        if (start === null || end === null || start >= end) return false
        const openNow = !lapses.length || lapses.some((lapse: any) =>
          start >= lapse.open.hour * 60 + (lapse.open.minute ?? 0) + leadTime &&
          start <= lapse.close.hour * 60 + (lapse.close.minute ?? 0))
        const afterLeadTime = !cateringPreorder || dateSelected !== todayStr ||
          start > nowMinutes + leadTime
        return openNow && afterLeadTime
      })
      .map((hour: any) => ({ value: hour.startTime, text: formatHour(hour.startTime) }))

    if (isBusinessPreorder) {
      setTimeList(slots)
      return
    }
    const thinned: any[] = []
    let lastKept: number | null = null
    slots.forEach((slot: any) => {
      const start = minutesOf(slot.value)
      if (start === null || (lastKept !== null && start - lastKept < slotInterval)) return
      lastKept = start
      thinned.push({
        ...slot,
        endText: showTimeRange
          ? formatHour(moment(slot.value, 'HH:mm').add(slotInterval, 'minutes').format('HH:mm'))
          : undefined
      })
    })
    setTimeList(thinned)
  }, [dateSelected, hoursList?.length, JSON.stringify(business)])

  useEffect(() => {
    setLocalMoment(moment, t)
  }, [])

  useEffect(() => {
    if (preorderMinimumDays === 0 && preorderLeadTime === 0) return
    if (isCart && isTodaySelected && !orderState?.loading && timeList?.length > 0) {
      setNextTime(timeList?.[0] ?? null)
    }
  }, [timeList?.length])

  useEffect(() => {
    if (nextTime?.value && timeList?.length > 0 && isCart && !orderState?.loading && !(preorderMinimumDays === 0 && preorderLeadTime === 0)) {
      const notime = timeList?.filter((_: any, i: number) => i !== 0)?.find?.((time: any) => time?.value === timeSelected)
      if (!notime) {
        handleChangeTime(nextTime?.value)
      }
    }
  }, [nextTime?.value])

  return (
    <>
      <Container
        contentContainerStyle={{
          paddingHorizontal: theme.utils.margins.horizontal,
          paddingTop: 16,
          paddingBottom: showFooter ? 180 : 32
        }}
        showsVerticalScrollIndicator={false}
      >
        <HeaderWrapper>
          <OText size={14} color={theme.colors.textSecondary} lineHeight={20}>
            {t('CHOOSE_DELIVERY_TIME_SUBTITLE', 'Choose an available time for your delivery.')}
          </OText>
        </HeaderWrapper>

        {tabDates.length > 1 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <DayTabsRow>
              {tabDates.map((dateStr: string) => {
                const active = dateStr === dateSelected
                const { label, sub } = getDayTabLabels(dateStr)
                return (
                  <Pressable key={dateStr} onPress={() => onSelectDay(dateStr)} disabled={orderState.loading}>
                    <DayTabCard active={active}>
                      <DayTabLabels>
                        <OText size={15} weight={active ? '600' : '500'} color={active ? theme.colors.primary : theme.colors.textNormal}>
                          {label}
                        </OText>
                        <OText size={12} color={theme.colors.textSecondary}>
                          {sub}
                        </OText>
                      </DayTabLabels>
                      <OIcon
                        src={active ? theme.images.general.option_checked : theme.images.general.option_normal}
                        width={18}
                      />
                    </DayTabCard>
                  </Pressable>
                )
              })}
            </DayTabsRow>
          </ScrollView>
        ) : null}

        <SectionWrapper>
          {showAsapRow ? (
            <Pressable onPress={onSelectAsap} disabled={orderState.loading}>
              <OptionRow>
                <OIcon
                  src={isAsapSelected ? theme.images.general.option_checked : theme.images.general.option_normal}
                  width={20}
                  style={{ marginEnd: 16 }}
                />
                <OptionLabels>
                  <OText size={16} weight='600' color={theme.colors.textNormal} lineHeight={22}>
                    {t('STANDARD', 'Standard')}
                  </OText>
                  <OText size={13} color={theme.colors.textSecondary} lineHeight={18}>
                    {t('DELIVER_ASAP', 'Deliver as soon as possible')}
                  </OText>
                </OptionLabels>
              </OptionRow>
            </Pressable>
          ) : null}

          {timeList?.length > 0 ? (
            timeList.map((time: any, i: number) => (
              <TimeListItem
                key={i}
                time={time}
                selected={!isAsapSelected && selectedTime === time.value}
                onSelect={onSelectTime}
              />
            ))
          ) : (
            !showAsapRow ? (
              <EmptyWrapper>
                <OText size={15} weight='500' color={theme.colors.textSecondary} align='center'>
                  {t('NO_TIMES_AVAILABLE', 'No delivery times available for this day')}
                </OText>
              </EmptyWrapper>
            ) : null
          )}
        </SectionWrapper>
      </Container>

      {showFooter ? (
        <FloatingButton
          text={t('CONTINUE', 'Continue')}
          classBtn='primary'
          disabled={!isAsapSelected && !selectedTime}
          handleClick={handleConfirm}
          secondElement={
            <CancelButton onPress={goToBack} disabled={orderState.loading}>
              <OText size={16} weight='600' color={theme.colors.textNormal}>
                {t('CANCEL', 'Cancel')}
              </OText>
            </CancelButton>
          }
        />
      ) : null}
    </>
  );
};

export const MomentOption = (props: any) => {
  const momentOptionProps = {
    ...props,
    UIComponent: MomentOptionUI,
  };
  return <MomentOptionController {...momentOptionProps} />;
};
