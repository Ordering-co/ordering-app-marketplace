import React from 'react'
import { useTheme } from 'styled-components/native'
import { useLanguage, useUtils } from '@components'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import {
  Container,
  DateBlock,
  DescriptionBlock,
  IconWrapper
} from './styles'
import { OText } from '../shared';
import { View } from 'react-native';

export const WalletTransactionItem = (props: any) => {
  const {
    item,
    withFormatPrice,
    isLast
  } = props

  const theme = useTheme()
  const [{ parsePrice, parseDate }] = useUtils()
  const [, t] = useLanguage()

  return (
    <Container isLast={isLast}>
      <IconWrapper>
        {item?.amount > 0 && <AntDesignIcon name='arrowup' size={25} color={theme.colors.success500} />}
        {item?.amount < 0 && <AntDesignIcon name='arrowdown' size={25} color={theme.colors.danger} />}
      </IconWrapper>
      <View style={{ flex: 1 }}>
        <DateBlock>
          <OText color={theme.colors.disabled}>{parseDate(item?.created_at)}</OText>
          <OText
            style={{
              color: item?.amount > 0 ? theme.colors.success500 : theme.colors.danger,
              fontWeight: 'bold'
            }}
          >
            {item?.amount > 0 && '+ '}{withFormatPrice ? parsePrice(item?.amount) : item?.amount}
          </OText>
        </DateBlock>
        {!!item?.description && (
          <DescriptionBlock>
            <OText>{item?.description}</OText>
          </DescriptionBlock>
        )}
      </View>
    </Container>
  )
}
