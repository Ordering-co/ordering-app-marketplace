import React, { useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTheme } from 'styled-components/native'
import FastImage from 'react-native-fast-image';

import {
  ReviewOrderContainer,
  BusinessLogo,
  ActionContainer,
  RatingStarContainer,
  MultiLogosContainer,
  LogoWrapper
} from './styles'

import { useLanguage } from '@components'
import { OButton, OText } from '@ui'

export const ReviewTrigger = (props: any) => {
  const { order, handleOpenOrderReview } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [star, setStar] = useState(5)

  return (
    <ReviewOrderContainer>
      <ActionContainer>
        <OText color={theme.colors.textGray}>
          {t('REVIEW_TRIGGER_TEXT', 'Your feedback is very important to us. Help us improve by rating your last order—it only takes a few seconds!')}
        </OText>
      </ActionContainer>
      <BusinessLogo>
        {typeof order?.logo === 'string' || !order?.logo ? (
          <LogoWrapper>
            <FastImage
              style={{ width: '100%', height: '100%' }}
              source={{ uri: order?.logo }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </LogoWrapper>
        ) : (
          <MultiLogosContainer>
            {order?.logo?.map((logo: string, i: number) => (
              <LogoWrapper key={logo}>
                <FastImage
                  style={{ width: '100%', height: '100%' }}
                  source={{ uri: logo }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </LogoWrapper>
            ))}
          </MultiLogosContainer>
        )}
      </BusinessLogo>

      {!!order?.business_name && (
        <ActionContainer>
          <OText style={{ textAlign: 'center' }} weight='bold' size={16}>
            {order?.business_name}
          </OText>
        </ActionContainer>
      )}

      <RatingStarContainer>
        {[...Array(5).keys()].map((index: number) => (
          <FontAwesome
            key={`star-symbol-${index}`}
            name={(index <= (star - 1)) ? 'star' : 'star-o'}
            size={35}
            onPress={() => setStar(index + 1)}
            color={theme?.colors?.primary}
          />
        ))}
      </RatingStarContainer>
      <ActionContainer>
        <OButton
          class='alert'
          text={t('REVIEW', 'Review')}
          style={{ height: 40, marginTop: 10 }}
          onClick={() => handleOpenOrderReview(star)}
        />
      </ActionContainer>
    </ReviewOrderContainer>
  )
}
