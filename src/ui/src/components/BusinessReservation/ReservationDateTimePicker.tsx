import React from 'react'
import moment from 'moment'
import { ScrollView, Pressable, Dimensions } from 'react-native'
import { useTheme } from 'styled-components/native'

import {
  DayTabsRow,
  DayTabCard,
  DayTabLabels,
  SectionWrapper,
  EmptyWrapper,
  OptionRow,
  OptionLabels
} from '../MomentOption/styles'
import { monthsEnum } from '../../utils'
import { useLanguage } from '@components'
import { OIcon, OText } from '../shared'

export const ReservationDateTimePicker = (props: any) => {
  const {
    datesList,
    hoursList,
    dateSelected,
    timeSelected,
    isEnabled,
    handleChangeDate,
    handleChangeTime
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()

  const getDayTabLabels = (dateStr: string) => {
    const date = moment(dateStr, 'YYYY-MM-DD')
    const diffDays = date.clone().startOf('day').diff(moment().startOf('day'), 'days')
    const label = diffDays === 0
      ? t('TODAY', 'Today')
      : diffDays === 1
        ? t('TOMORROW', 'Tomorrow')
        : t(date.format('dddd').toUpperCase(), date.format('dddd'))
    const sub = `${t(monthsEnum[date.format('MMM')], date.format('MMM'))} ${date.format('D')}`
    return { label, sub }
  }

  const onSelectDay = (dateStr: string) => {
    if (dateStr === dateSelected) return
    handleChangeDate && handleChangeDate(dateStr)
  }

  const showTimes = (isEnabled ?? true) && !!dateSelected && hoursList?.length > 0

  return (
    <>
      {datesList?.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <DayTabsRow>
            {datesList.map((dateStr: string) => {
              const active = dateStr === dateSelected
              const { label, sub } = getDayTabLabels(dateStr)
              return (
                <Pressable key={dateStr} onPress={() => onSelectDay(dateStr)}>
                  <DayTabCard active={active}>
                    <DayTabLabels>
                      <OText
                        size={15}
                        weight={active ? '600' : '500'}
                        color={active ? theme.colors.primary : theme.colors.textNormal}
                      >
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
      )}

      {showTimes
        ? (
          <ScrollView
            style={{ maxHeight: Dimensions.get('window').height * 0.35 }}
            nestedScrollEnabled
            showsVerticalScrollIndicator
          >
            <SectionWrapper>
              {hoursList.map((time: any, i: number) => {
                const selected = timeSelected === time.value
                const label = time.endText ? `${time.text} – ${time.endText}` : time.text
                return (
                  <Pressable key={i} onPress={() => handleChangeTime(time.value)}>
                    <OptionRow>
                      <OIcon
                        src={selected ? theme.images.general.option_checked : theme.images.general.option_normal}
                        width={20}
                        style={{ marginEnd: 16 }}
                      />
                      <OptionLabels>
                        <OText size={16} weight={selected ? '600' : '400'} color={theme.colors.textNormal} lineHeight={22}>
                          {label}
                        </OText>
                      </OptionLabels>
                    </OptionRow>
                  </Pressable>
                )
              })}
            </SectionWrapper>
          </ScrollView>
          )
        : (
          <SectionWrapper>
            <EmptyWrapper>
              <OText size={15} weight='500' color={theme.colors.textSecondary} align='center'>
                {t('NOT_AVAILABLE_HOURS_DAY', 'Not available hours for this day')}
              </OText>
            </EmptyWrapper>
          </SectionWrapper>
          )}
    </>
  )
}
