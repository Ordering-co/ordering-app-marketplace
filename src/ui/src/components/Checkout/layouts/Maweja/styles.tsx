import styled from 'styled-components/native'

import { themeBrandColor } from '@/utils/themeBrandColor'

const cardColor = (props: any) => props.theme.colors.backgroundCard || props.theme.colors.white

const brandTint = (props: any) => {
  const brand = themeBrandColor(props.theme)
  return typeof brand === 'string' && /^#[0-9A-Fa-f]{6}$/.test(brand) ? `${brand}14` : props.theme.colors.lightPrimary
}

export const Card = styled.View`
  margin-bottom: 12px;
  border-radius: 18px;
  background-color: ${cardColor};
  overflow: hidden;
`

export const BannerHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background-color: ${(props: any) => themeBrandColor(props.theme)};
`

export const CardBody = styled.View`
  padding: 14px 16px 16px;
`

export const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`

export const ProductLine = styled.View`
  flex-direction: row;
  align-items: center;
`

export const ProductPhoto = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray200};
`

export const AddProducts = styled.View`
  margin-top: 14px;
  min-height: 46px;
  border-radius: 14px;
  border-width: 1px;
  border-color: ${(props: any) => themeBrandColor(props.theme)};
  align-items: center;
  justify-content: center;
`

export const ProductCopy = styled.View`
  flex: 1;
  min-width: 0;
  margin-left: 12px;
  margin-right: 12px;
`

export const FieldLabel = styled.View`
  margin-bottom: 6px;
  margin-top: 8px;
`

export const PaySection = styled.View`
  margin-bottom: 12px;
  padding: 14px 14px 6px;
  border-radius: 18px;
  background-color: ${cardColor};
`

export const PayCard = styled.TouchableOpacity<{ $selected?: boolean }>`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
  padding: 12px;
  border-radius: 14px;
  border-width: 1px;
  border-color: ${(props: any) => props.$selected ? themeBrandColor(props.theme) : '#D8DCE3'};
  background-color: ${(props: any) => props.$selected ? brandTint(props) : cardColor(props)};
`

export const PayIconWrap = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`

export const ZoneBadge = styled.View`
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 10px;
  background-color: ${(props: any) => props.theme.colors.success500};
`

export const TotalRule = styled.View`
  margin-top: 8px;
  margin-bottom: 12px;
  border-top-width: 1px;
  border-style: dashed;
  border-color: ${(props: any) => themeBrandColor(props.theme)};
`

export const Notice = styled.View<{ $tone: 'time' | 'secure' | 'alert' }>`
  width: 100%;
  margin-top: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  background-color: ${(props: any) => {
    if (props.$tone === 'time') return props.theme.colors.warning1
    if (props.$tone === 'alert') {
      const error = props.theme.colors.error
      return typeof error === 'string' && /^#[0-9A-Fa-f]{6}$/.test(error) ? `${error}14` : props.theme.colors.dangerContrast
    }
    return typeof props.theme.colors.success === 'string' && /^#[0-9A-Fa-f]{6}$/.test(props.theme.colors.success)
      ? `${props.theme.colors.success}33`
      : props.theme.colors.lightPrimary
  }};
`
