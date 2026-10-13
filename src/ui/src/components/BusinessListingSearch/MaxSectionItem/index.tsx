import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'

import { ProgressContentWrapper, ProgressBar } from './styles'
import { useLanguage, useUtils } from '@components'
import { OText } from '../../shared'
import { useTheme } from 'styled-components/native'

export const MaxSectionItem = (props: any) => {
  const {
    filters,
    handleChangeFilters,
    title,
    options,
    filter
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ parsePrice }] = useUtils();

  const styles = StyleSheet.create({
    maxContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  });

  const parseValue = (option: number) => {
    return filter === 'max_distance'
      ? `${option / 1000} ${t('KM', 'Km')}`
      : filter === 'max_eta'
        ? `${option} ${t('TIME_MIN', 'min')}`
        : parsePrice(option)
  }

  const progressWidth = ((options.indexOf(filters?.[filter]) / 3) * 100)

  return (
    <View style={{ marginBottom: 20 }}>
      {!!title && (
        <OText weight='bold' mBottom={10} size={16}>
          {title}
        </OText>
      )}
      <ProgressContentWrapper>
        <ProgressBar style={{ width: `${progressWidth ?? 100}%` }} />
      </ProgressContentWrapper>
      <View style={styles.maxContainer}>
        {options.map((option: any, i: number) => (
          <TouchableOpacity
            onPress={() => handleChangeFilters(filter, option)}
            key={option}
          >
            <OText
              weight='bold'
              color={filters?.[filter] === option || (option === 'default' && (filters?.[filter] === 'default' || !filters?.[filter])) ? theme.colors.active : theme.colors.black}
            >
              {option === 'default' ? `${parseValue(options[i - 1])}+` : parseValue(option)}
            </OText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}
