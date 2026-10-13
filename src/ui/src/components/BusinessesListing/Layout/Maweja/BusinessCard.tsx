import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { useTheme } from 'styled-components/native'

import { OText } from '@ui'
import { PressableScale } from '../../../shared/PressableScale'
import { BusinessHeaderPlaceholder } from '../../../BusinessHeaderPlaceholder'

import {
  BusinessBody,
  BusinessCard as Card,
  BusinessCopy,
  BusinessFavorite,
  BusinessIdentity,
  BusinessImage,
  BusinessMark,
  BusinessMarkImage,
  BusinessMedia,
  BusinessMeta,
  BusinessMetaItem,
  BusinessOffer,
  BusinessOverlay,
  BusinessRating
} from './styles'

export const MawejaBusinessCard = (props: any) => {
  const {
    name,
    compact,
    headerSource,
    logoSource,
    logoUrl,
    optimizeImage,
    categoryName,
    ratingLabel,
    distanceLabel,
    cityName,
    offerLabel,
    timeLabel,
    priceLabel,
    isOpen,
    closedLabel,
    preorderLabel,
    favorite,
    showFavorite,
    onPress,
    onFavorite
  } = props
  const theme = useTheme()
  const facts = [timeLabel, priceLabel, distanceLabel].filter(Boolean)

  const meta = (
    <BusinessMeta $inline={!compact}>
      {isOpen ? facts.map((fact: string, index: number) => (
        <BusinessMetaItem key={fact}>
          {index === 0 && !!timeLabel && (
            <SimpleLineIcons name="clock" size={13} color={theme.colors.backgroundGray300} />
          )}
          <OText size={12} color={theme.colors.backgroundGray300} mLeft={index === 0 && timeLabel ? 4 : 0}>
            {index > 0 ? `|  ${fact}` : fact}
          </OText>
        </BusinessMetaItem>
      )) : (
        <OText size={12} weight="600" color={theme.colors.red}>{closedLabel}</OText>
      )}
    </BusinessMeta>
  )

  const identity = (
    <BusinessIdentity>
      {!!logoSource && (
        <BusinessMark $compact={compact}>
          <BusinessMarkImage source={logoSource} resizeMode="cover" />
        </BusinessMark>
      )}
      <BusinessCopy testID="maweja-business-copy">
        <OText size={compact ? 14 : 16} weight="bold" numberOfLines={1} color={compact ? theme.colors.white : theme.colors.black}>
          {name}
        </OText>
        {!!categoryName && (
          <OText size={12} color={compact ? theme.colors.white : theme.colors.backgroundGray300} numberOfLines={1} mTop={2}>
            {categoryName}
          </OText>
        )}
        {!compact && !!cityName && (
          <OText size={12} color={theme.colors.backgroundGray300} numberOfLines={1} mTop={2}>
            {cityName}
          </OText>
        )}
        {!compact && meta}
      </BusinessCopy>
    </BusinessIdentity>
  )

  return (
    <PressableScale testID="maweja-business-card" onPress={onPress}>
      <Card $compact={compact}>
        <BusinessMedia $compact={compact}>
          {headerSource ? (
            <BusinessImage source={headerSource} resizeMode="cover" />
          ) : (
            <BusinessHeaderPlaceholder logo={logoUrl} name={name} height={compact ? 132 : 210} optimizeImage={optimizeImage} />
          )}
          {!!(preorderLabel || offerLabel) && (
            <BusinessOffer>
              <OText size={11} weight="600" numberOfLines={1}>{preorderLabel || offerLabel}</OText>
            </BusinessOffer>
          )}
          {showFavorite && (
            <BusinessFavorite
              testID="maweja-business-favorite"
              onPress={onFavorite}
              accessibilityRole="button"
            >
              <Ionicons
                name={favorite ? 'heart' : 'heart-outline'}
                size={16}
                color={favorite ? theme.colors.danger : theme.colors.black}
              />
            </BusinessFavorite>
          )}
          {!!ratingLabel && !compact && (
            <BusinessRating>
              <Ionicons name="star" size={12} color={theme.colors.star} />
              <OText size={12} weight="600" mLeft={4}>{ratingLabel}</OText>
            </BusinessRating>
          )}
          {compact && (
            <BusinessOverlay>
              <View style={{ flex: 1 }}>
                {identity}
              </View>
              {!!ratingLabel && (
                <BusinessMetaItem>
                  <Ionicons name="star" size={12} color={theme.colors.star} />
                  <OText size={12} weight="600" color={theme.colors.white} mLeft={4}>{ratingLabel}</OText>
                </BusinessMetaItem>
              )}
            </BusinessOverlay>
          )}
        </BusinessMedia>
        <BusinessBody>
          {compact ? meta : identity}
        </BusinessBody>
      </Card>
    </PressableScale>
  )
}
