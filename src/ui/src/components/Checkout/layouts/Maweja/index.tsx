import React from 'react'
import { View } from 'react-native'
import { useTheme } from 'styled-components/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { themeBrandColor } from '@/utils/themeBrandColor'
import OText from '../../../shared/OText'
import { PressableScale } from '../../../shared/PressableScale'
import {
  AddProducts,
  BannerHeader,
  Card,
  CardBody,
  Notice,
  PayCard,
  PayIconWrap,
  ProductCopy,
  ProductLine,
  ProductPhoto,
  TitleRow,
  TotalRule,
  ZoneBadge
} from './styles'

type SectionOrderProps = {
  isMaweja: boolean
  business: React.ReactNode
  address: React.ReactNode
  articles: React.ReactNode
  customer: React.ReactNode
  beforePay: React.ReactNode
  payments: React.ReactNode
  wallet: React.ReactNode
  afterWallet: React.ReactNode
}

export const CheckoutSectionOrder = (props: SectionOrderProps) => {
  const {
    isMaweja,
    business,
    address,
    articles,
    customer,
    beforePay,
    payments,
    wallet,
    afterWallet
  } = props

  if (!isMaweja) {
    return (
      <>
        {business}
        {address}
        {articles}
        {customer}
        {beforePay}
        {payments}
        {wallet}
        {afterWallet}
      </>
    )
  }

  return (
    <>
      {articles}
      {business}
      {customer}
      {address}
      {wallet}
      {payments}
      {beforePay}
      {afterWallet}
    </>
  )
}

export { PaySection } from './styles'
export const MawejaCardTitle = ({ icon, title, trailing, compact }: { icon: string, title: string, trailing?: React.ReactNode, compact?: boolean }) => {
  const theme = useTheme() as any
  return (
    <TitleRow style={compact ? { marginBottom: 12 } : undefined}>
      <MaterialCommunityIcons name={icon} size={18} color={themeBrandColor(theme)} />
      <OText size={16} weight="bold" color={theme.colors.black} style={{ flex: 1, marginLeft: 8 }}>
        {title}
      </OText>
      {trailing}
    </TitleRow>
  )
}

export const MawejaArticles = ({
  products,
  businessName,
  loading,
  parsePrice,
  optimizeImage,
  title,
  addLabel,
  onAddProducts,
  onEditCart
}: any) => {
  const theme = useTheme() as any
  const lines = Array.isArray(products) ? products : []
  if (loading) return null

  return (
    <Card>
      <BannerHeader>
        <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1, minWidth: 0 }}>
          <MaterialCommunityIcons name="receipt" size={18} color={theme.colors.white} />
          <OText size={16} weight="bold" color={theme.colors.white} numberOfLines={1} style={{ flexShrink: 1, marginLeft: 8 }}>
            {title}
          </OText>
        </View>
        {!!businessName && (
          <OText size={12} weight="bold" color={theme.colors.white} numberOfLines={1} align="right" style={{ flexShrink: 1, maxWidth: '46%', marginLeft: 12 }}>
            {businessName}
          </OText>
        )}
      </BannerHeader>
      <CardBody>
        {lines.map((product: any, index: number) => {
          const quantity = product?.quantity || 0
          const unit = product?.price ?? product?.total
          const photo = product?.images
          const row = (
            <ProductLine style={{ marginBottom: index === lines.length - 1 && !onAddProducts ? 0 : 12 }}>
              {photo ? (
                <ProductPhoto source={{ uri: optimizeImage ? optimizeImage(photo, 'h_200,c_limit') : photo }} />
              ) : (
                <ProductPhoto />
              )}
              <ProductCopy>
                <OText size={14} weight="bold" color={theme.colors.black} numberOfLines={2}>
                  {product?.name}
                </OText>
                <OText size={12} color={theme.colors.textSecondary} numberOfLines={1}>
                  {`${quantity} x ${parsePrice(unit)}`}
                </OText>
              </ProductCopy>
              <OText size={14} weight="bold" color={theme.colors.black} numberOfLines={1} style={{ flexShrink: 0 }}>
                {parsePrice(product?.total || product?.price)}
              </OText>
            </ProductLine>
          )
          if (!onEditCart) return <View key={product?.code || product?.id || index}>{row}</View>
          return (
            <PressableScale key={product?.code || product?.id || index} onPress={onEditCart}>
              {row}
            </PressableScale>
          )
        })}
        {!!onAddProducts && (
          <PressableScale onPress={onAddProducts} testID="maweja-checkout-add-products">
            <AddProducts>
              <OText size={15} weight="bold" color={themeBrandColor(theme)}>{`+ ${addLabel}`}</OText>
            </AddProducts>
          </PressableScale>
        )}
      </CardBody>
    </Card>
  )
}

export const MawejaPaymethodCard = ({
  title,
  hint,
  warning,
  selected,
  disabled,
  onPress,
  icon,
  section
}: any) => {
  const theme = useTheme() as any
  return (
    <PayCard
      $selected={selected}
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected, disabled: !!disabled }}
      style={section ? { marginBottom: 12 } : undefined}
    >
      <PayIconWrap>
        <MaterialCommunityIcons name={icon || 'credit-card-outline'} size={20} color={theme.colors.black} />
      </PayIconWrap>
      <View style={{ flex: 1 }}>
        <OText size={15} weight="bold" color={theme.colors.black}>{title}</OText>
        {!!hint && <OText size={12} color={theme.colors.textSecondary}>{hint}</OText>}
        {!!warning && <OText size={12} color={themeBrandColor(theme)}>{warning}</OText>}
      </View>
      {selected && (
        <MaterialCommunityIcons name="check-circle" size={22} color={themeBrandColor(theme)} />
      )}
    </PayCard>
  )
}

export const MawejaZoneBadge = ({ name }: { name: string }) => {
  const theme = useTheme() as any
  if (!name) return null
  return (
    <ZoneBadge>
      <OText size={11} weight="bold" color={theme.colors.white}>{name}</OText>
    </ZoneBadge>
  )
}

export const MawejaTotalRule = () => <TotalRule />

export const MawejaCartNotice = ({ message }: { message: string }) => {
  const theme = useTheme() as any
  if (!message) return null
  return (
    <Notice $tone="alert">
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <MaterialCommunityIcons name="alert-circle-outline" size={18} color={theme.colors.error} />
        <OText size={13} color={theme.colors.black} style={{ flex: 1, marginLeft: 8 }}>{message}</OText>
      </View>
    </Notice>
  )
}

export const MawejaNotices = ({ timeTitle, timeBody, secureTitle, secureBody }: any) => {
  const theme = useTheme() as any
  return (
    <>
      {!!timeBody && (
        <Notice $tone="time">
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="clock-outline" size={18} color={theme.colors.warning5} />
            <OText size={14} weight="bold" color={theme.colors.black} style={{ marginLeft: 8 }}>{timeTitle}</OText>
          </View>
          <OText size={13} color={theme.colors.textNormal} style={{ marginTop: 4, marginLeft: 26 }}>{timeBody}</OText>
        </Notice>
      )}
      {!!secureBody && (
        <Notice $tone="secure">
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="shield-check" size={18} color={theme.colors.success} />
            <OText size={14} weight="bold" color={theme.colors.black} style={{ marginLeft: 8 }}>{secureTitle}</OText>
          </View>
          <OText size={13} color={theme.colors.textNormal} style={{ marginTop: 4, marginLeft: 26 }}>{secureBody}</OText>
        </Notice>
      )}
    </>
  )
}

export const MawejaInvoiceHeader = ({ title, brand }: { title: string, brand?: string }) => {
  const theme = useTheme() as any
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1, minWidth: 0 }}>
        <MaterialCommunityIcons name="cash" size={18} color={themeBrandColor(theme)} />
        <OText size={16} weight="bold" color={theme.colors.black} numberOfLines={1} style={{ flexShrink: 1, marginLeft: 8 }}>{title}</OText>
      </View>
      {!!brand && (
        <OText size={12} weight="bold" color={themeBrandColor(theme)} numberOfLines={1} align="right" style={{ flexShrink: 1, maxWidth: '46%', marginLeft: 12 }}>{brand}</OText>
      )}
    </View>
  )
}
