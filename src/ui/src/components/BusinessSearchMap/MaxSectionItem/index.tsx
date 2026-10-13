import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme } from 'styled-components/native'

import { useLanguage, useUtils } from '@components'

import { OText } from '@ui'
import { ProgressContentWrapper, ProgressBar, Point } from './styles'

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

  const valueIndexWidth = (options.indexOf(filters?.[filter]) > 0) ? options.indexOf(filters?.[filter]) : 0

  return (
    <View style={{ marginBottom: 20 }}>
      {Boolean(title) && (
        <OText weight='bold' mBottom={20} size={16}>
          {title}
        </OText>
      )}
      <ProgressContentWrapper>
        <Point style={{
          top: -3,
          width: 10,
          height: 10,
          position: 'absolute',
          left: 0,
        }} />
        <ProgressBar style={{
          width: '100%',
          top: 1,
          backgroundColor: theme.colors.border,
          position: 'absolute',
          zIndex: -10,
          height: 4
        }} />
        <ProgressBar style={{ width: `${(valueIndexWidth / 3) * 100}%` }} />
        <Point style={{
          bottom: 15,
          marginLeft: -(valueIndexWidth * 10),
          left: `${(valueIndexWidth / 3) * 100}%`,
        }} />
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
