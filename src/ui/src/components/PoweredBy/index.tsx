import React from 'react'
import { ViewStyle } from 'react-native'

import { Container } from './styles'
import { OText } from '@ui'
import { usePoweredByOrdering } from '../../hooks/usePoweredByOrdering'

export const PoweredBy = ({ containerStyle }: { containerStyle?: ViewStyle }) => {
  const showPoweredByOrdering = usePoweredByOrdering()

  return (
    showPoweredByOrdering ? (
      <Container style={containerStyle}>
        <OText>
          Powered By Orderingplus
        </OText>
      </Container>
    ) : null
  )
}
