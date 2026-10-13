import React from 'react'
import { useTheme } from 'styled-components/native'
import { Pressable } from 'react-native'
import { OptionRow, OptionLabels } from './styles'
import { OIcon, OText } from '../shared'

const timeListItemPropsAreEqual = (prevProps: any, nextProps: any) => {
  return JSON.stringify(prevProps.time) === JSON.stringify(nextProps.time) &&
    prevProps.selected === nextProps.selected
}

export const TimeListItem = React.memo((props: any) => {
  const {
    time,
    selected,
    onSelect
  } = props
  const theme = useTheme()

  const label = time.endText ? `${time.text} – ${time.endText}` : time.text

  return (
    <Pressable onPress={() => onSelect(time.value)}>
      <OptionRow>
        <OIcon
          src={selected ? theme.images.general.option_checked : theme.images.general.option_normal}
          width={20}
          style={{ marginEnd: 16 }}
        />
        <OptionLabels>
          <OText
            size={16}
            weight={selected ? '600' : '400'}
            color={theme.colors.textNormal}
            lineHeight={22}
          >
            {label}
          </OText>
        </OptionLabels>
      </OptionRow>
    </Pressable>
  )
}, timeListItemPropsAreEqual)
