import React from 'react'
import { Image, View } from 'react-native'
import { useTheme } from 'styled-components/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { themeBrandColor } from '@/utils/themeBrandColor'
import OText from '../../../shared/OText'
import { MawejaCardTitle } from '../../../Checkout/layouts/Maweja'
import { Card, CardBody, PayIconWrap } from '../../../Checkout/layouts/Maweja/styles'
import { Caption, Hero, StepCircle, StepItem, StepRow, TrackCard } from './styles'

const DELIVERED = [1, 11, 15]
const ON_THE_WAY = [3, 8, 9, 18, 19, 22, 23, 24, 25, 26]
const CONFIRMED = [4, 7, 14]

export const mawejaStepIndex = (status: number) => {
  if (DELIVERED.includes(status)) return 3
  if (ON_THE_WAY.includes(status)) return 2
  if (CONFIRMED.includes(status)) return 1
  return 0
}

const stepColor = (theme: any, index: number) => {
  if (index === 0) return theme.colors.warning5 || theme.colors.editColor
  if (index === 3) return themeBrandColor(theme)
  return theme.colors.skyBlue
}

export const MawejaStatusHero = ({
  tone,
  kicker,
  title,
  subtitle
}: {
  tone: 'brand' | 'success'
  kicker?: string
  title: string
  subtitle?: string
}) => {
  const theme = useTheme() as any
  return (
    <Hero $tone={tone}>
      {!!kicker && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <MaterialCommunityIcons
            name={tone === 'success' ? 'check-circle' : 'circle'}
            size={tone === 'success' ? 28 : 10}
            color={theme.colors.white}
          />
          {tone !== 'success' && (
            <OText size={13} color={theme.colors.white} style={{ marginLeft: 8 }}>{kicker}</OText>
          )}
        </View>
      )}
      <OText size={26} weight="bold" color={theme.colors.white}>{title}</OText>
      {!!subtitle && (
        <OText size={14} color={theme.colors.white} style={{ marginTop: 8 }}>{subtitle}</OText>
      )}
    </Hero>
  )
}

export const MawejaProgress = ({
  title,
  labels,
  caption,
  activeLabel,
  step
}: {
  title: string
  labels: string[]
  caption?: string
  activeLabel?: string
  step: number
}) => {
  const theme = useTheme() as any
  const icons = ['clock-outline', 'check', 'truck-outline', 'map-marker-outline']
  const active = stepColor(theme, step)
  const done = theme.colors.green || theme.colors.success

  return (
    <TrackCard>
      <View style={{ paddingTop: 16, paddingHorizontal: 12, paddingBottom: 14 }}>
        <OText size={16} weight="bold" color={theme.colors.black} style={{ marginBottom: 16, marginLeft: 4 }}>{title}</OText>
        <View>
          <View style={{ position: 'absolute', top: 17, left: 36, right: 36, height: 2, backgroundColor: theme.colors.backgroundGray400 || theme.colors.lightGray }} />
          {step > 0 && (
            <View style={{ position: 'absolute', top: 17, left: 36, width: `${(step / 3) * 70}%`, height: 2, backgroundColor: done }} />
          )}
        <StepRow>
          {labels.map((label, index) => {
            const reached = index <= step
            const current = index === step
            const color = current ? active : reached ? done : (theme.colors.backgroundGray400 || theme.colors.lightGray)
            return (
              <StepItem key={label}>
                <StepCircle style={{ backgroundColor: current ? `${color}22` : reached ? `${done}22` : theme.colors.backgroundGray100 }}>
                  <MaterialCommunityIcons name={icons[index]} size={18} color={color} />
                </StepCircle>
                <OText size={11} weight={current ? 'bold' : 'normal'} color={current ? theme.colors.black : theme.colors.textSecondary} align="center" style={{ marginTop: 8, alignSelf: 'stretch' }}>
                  {label}
                </OText>
                {current && !!activeLabel && (
                  <OText size={11} weight="bold" color={color} align="center" style={{ marginTop: 2, alignSelf: 'stretch' }}>{activeLabel}</OText>
                )}
              </StepItem>
            )
          })}
        </StepRow>
        </View>
        {!!caption && (
          <Caption>
            <OText size={13} color={theme.colors.textSecondary} align="center" style={{ width: '100%' }}>{caption}</OText>
          </Caption>
        )}
      </View>
    </TrackCard>
  )
}

export const MawejaMapCard = ({
  title,
  hint,
  children
}: {
  title: string
  hint?: string
  children?: React.ReactNode
}) => {
  const theme = useTheme() as any
  return (
    <TrackCard>
      <View style={{ paddingTop: 16, paddingHorizontal: 16, paddingBottom: children ? 12 : 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: children || hint ? 10 : 0 }}>
          <OText size={16} weight="bold" color={theme.colors.black}>{title}</OText>
          {!!hint && (
            <OText size={12} color={theme.colors.textSecondary} style={{ flex: 1, marginLeft: 12, textAlign: 'right' }}>{hint}</OText>
          )}
        </View>
        {children}
      </View>
    </TrackCard>
  )
}

export const MawejaPlaceCard = ({
  title,
  name,
  address,
  icon = 'map-marker-outline',
  logo
}: {
  title: string
  name?: string
  address?: string
  icon?: string
  logo?: string
}) => {
  const theme = useTheme() as any
  const logoUri = typeof logo === 'string' && logo.includes('http') ? logo : ''

  return (
    <Card>
      <CardBody>
        <MawejaCardTitle icon="map-marker" title={title} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: 12,
            paddingBottom: 12,
            paddingLeft: 12,
            paddingRight: 12,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: '#D8DCE3'
          }}
        >
          {logoUri ? (
            <Image
              source={{ uri: logoUri }}
              style={{ width: 36, height: 36, borderRadius: 10, marginRight: 12 }}
            />
          ) : (
            <PayIconWrap>
              <MaterialCommunityIcons name={icon} size={20} color={theme.colors.black} />
            </PayIconWrap>
          )}
          <View style={{ flex: 1, minWidth: 0 }}>
            {!!name && (
              <OText size={15} weight="bold" color={theme.colors.black} numberOfLines={2}>{name}</OText>
            )}
            {!!address && (
              <OText size={13} color={theme.colors.textSecondary} numberOfLines={2}>{address}</OText>
            )}
          </View>
        </View>
      </CardBody>
    </Card>
  )
}

export const MawejaSectionTitle = ({ icon, title }: { icon: string, title: string }) => {
  const theme = useTheme() as any
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
      <MaterialCommunityIcons name={icon} size={18} color={themeBrandColor(theme)} />
      <OText size={16} weight="bold" color={theme.colors.black} style={{ marginLeft: 8 }}>{title}</OText>
    </View>
  )
}
