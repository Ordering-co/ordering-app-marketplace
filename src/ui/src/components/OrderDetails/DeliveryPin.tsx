import React from 'react'
import { useTheme } from 'styled-components/native'

import { useLanguage } from '@components'
import OText from '../shared/OText'
import { MawejaCardTitle } from '../Checkout/layouts/Maweja'
import { Card, CardBody } from '../Checkout/layouts/Maweja/styles'
import { DeliveryPinCode, DeliveryPinWrapper } from './styles'

export const DeliveryPin = (props: { pin: string, layout?: 'maweja' }) => {
  const { pin, layout } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const title = t('DELIVERY_PIN', 'Delivery PIN')
  const help = t('DELIVERY_PIN_HELP', 'Give this code to the driver when you receive your order')

  if (layout === 'maweja') {
    return (
      <Card testID="delivery-pin">
        <CardBody>
          <MawejaCardTitle icon="shield-key-outline" title={title} />
          <DeliveryPinCode size={theme.utils.tsize.xxl} weight="bold" color={theme.colors.black}>
            {pin}
          </DeliveryPinCode>
          <OText size={theme.utils.tsize.s} color={theme.colors.textSecondary}>
            {help}
          </OText>
        </CardBody>
      </Card>
    )
  }

  return (
    <DeliveryPinWrapper testID="delivery-pin">
      <OText size={theme.utils.tsize.s} weight={600}>
        {title}
      </OText>
      <DeliveryPinCode size={theme.utils.tsize.xxxl} weight="bold">
        {pin}
      </DeliveryPinCode>
      <OText size={theme.utils.tsize.xs} color={theme.colors.textSecondary} align="center">
        {help}
      </OText>
    </DeliveryPinWrapper>
  )
}
