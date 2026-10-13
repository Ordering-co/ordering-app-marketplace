import React from 'react'
import FastImage from 'react-native-fast-image'
import { useTheme } from 'styled-components/native'

import { OText } from '@ui'
import { PlaceholderContainer, LogoWrapper } from './styles'

interface BusinessHeaderPlaceholderProps {
  logo?: string
  name?: string
  height: number
  borderRadius?: number
  optimizeImage?: (url: string, params: string) => string
}

const getMonogram = (name?: string) => {
  const initial = name?.trim()?.charAt(0)
  return initial ? initial.toUpperCase() : '?'
}

/**
 * Branded fallback shown when a business has no header image.
 * Renders the logo centered (contained) over a single consistent neutral
 * background, or the business initial when there is no logo. The background
 * is the same app-theme token for every business — never derived from the brand.
 */
export const BusinessHeaderPlaceholder = ({ logo, name, height, borderRadius, optimizeImage }: BusinessHeaderPlaceholderProps) => {
  const theme = useTheme()
  const logoSize = height * 0.5

  return (
    <PlaceholderContainer radius={borderRadius} style={{ height }}>
      {logo ? (
        <LogoWrapper style={{ width: logoSize, height: logoSize }}>
          <FastImage
            style={{ width: logoSize, height: logoSize }}
            source={{
              uri: optimizeImage ? optimizeImage(logo, 'h_200,c_limit') : logo,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </LogoWrapper>
      ) : (
        <OText size={Math.round(height * 0.32)} weight={'600'} color={theme.colors.backgroundGray300}>
          {getMonogram(name)}
        </OText>
      )}
    </PlaceholderContainer>
  )
}
