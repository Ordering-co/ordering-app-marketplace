import React from 'react'

import { useLanguage, useUtils } from '@components'
import OText from '../shared/OText'
import {
  MessageContent,
  MessageRow,
  ProgressContainer,
  ProgressFill,
  ProgressTrack
} from './styles'

export interface FreeDeliveryProgressProps {
  status: 'hidden' | 'awareness' | 'progress' | 'unconfirmed' | 'unlocked'
  minimum?: number
  remainingAmount?: number
  progressPercent?: number
  variant?: 'compact' | 'full'
}

export const FreeDeliveryProgress = ({
  status,
  minimum = 0,
  remainingAmount = 0,
  progressPercent = 0,
  variant = 'full'
}: FreeDeliveryProgressProps) => {
  const [, t] = useLanguage()
  const [{ parsePrice }] = useUtils()

  if (status === 'hidden') return null

  const message = status === 'awareness'
    ? t('FREE_DELIVERY_MINIMUM', 'Free delivery on orders :amount+').replace(':amount', parsePrice(minimum))
    : status === 'progress'
      ? t('ADD_AMOUNT_FOR_FREE_DELIVERY', 'Add :amount for free delivery').replace(':amount', parsePrice(remainingAmount))
      : status === 'unconfirmed'
        ? t('FREE_DELIVERY_NOT_APPLIED', 'Free delivery has not been applied to this cart yet')
      : t('FREE_DELIVERY_UNLOCKED', 'Free delivery unlocked')

  const normalizedPercent = Math.max(0, Math.min(100, progressPercent))

  return (
    <ProgressContainer
      accessibilityLabel={message}
      accessible
      testID='free-delivery-progress'
      variant={variant}
    >
      <MessageRow>
        <MessageContent>
          <OText preset='body' weight={status === 'unlocked' ? '600' : undefined}>
            {message}
          </OText>
        </MessageContent>
      </MessageRow>
      {status === 'progress' && (
        <ProgressTrack
          accessibilityLabel={message}
          accessibilityRole='progressbar'
          accessibilityValue={{ min: 0, max: 100, now: normalizedPercent }}
          testID='free-delivery-progress-bar'
        >
          <ProgressFill progressPercent={normalizedPercent} />
        </ProgressTrack>
      )}
    </ProgressContainer>
  )
}
