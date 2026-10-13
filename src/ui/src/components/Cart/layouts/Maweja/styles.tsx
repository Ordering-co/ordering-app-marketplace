import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'

import { themeBrandColor } from '@/utils/themeBrandColor'

const cardColor = (props: any) => props.theme.colors.backgroundCard || props.theme.colors.white

export const Screen = styled.View`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`

export const PageHeader = styled.View`
  flex-direction: row;
  align-items: flex-start;
  padding: 8px 16px 12px;
`

export const HeaderCopy = styled.View`
  flex: 1;
  margin-left: 8px;
`

export const HeaderBack = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
`

export const ClearButton = styled.View`
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
`

export const Card = styled.View`
  margin: 0 16px 12px;
  border-radius: 18px;
  background-color: ${cardColor};
  overflow: hidden;
`

export const StoreBanner = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px 14px;
  background-color: ${(props: any) => {
    const brand = themeBrandColor(props.theme)
    return typeof brand === 'string' && /^#[0-9A-Fa-f]{6}$/.test(brand) ? `${brand}14` : props.theme.colors.lightPrimary
  }};
`

export const ProductRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  padding: 12px 14px 4px;
`

export const ProductPhoto = styled(FastImage)`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray200};
`

export const ProductBody = styled.View`
  flex: 1;
  margin-left: 12px;
`

export const ProductTop = styled.View`
  flex-direction: row;
  align-items: flex-start;
`

export const Stepper = styled.View`
  flex-direction: row;
  align-items: center;
  align-self: flex-end;
  margin-top: 10px;
  margin-bottom: 8px;
`

export const QuantityValue = styled.View`
  width: 36px;
  height: 32px;
  align-items: center;
  justify-content: center;
`

export const StepButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: ${(props: any) => props.$square ? 8 : 16}px;
  background-color: ${(props: any) => props.$square ? themeBrandColor(props.theme) : props.theme.colors.backgroundGray100};
  border-width: ${(props: any) => props.$square ? 0 : 1}px;
  border-color: ${(props: any) => props.theme.colors.border};
`

export const AddMore = styled.TouchableOpacity`
  margin: 4px 14px 14px;
  min-height: 46px;
  border-radius: 14px;
  border-width: 1px;
  border-color: ${(props: any) => themeBrandColor(props.theme)};
  align-items: center;
  justify-content: center;
`

export const SectionCard = styled(Card)`
  padding: 14px;
`

export const SectionTitle = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`

export const CommentInput = styled.TextInput`
  min-height: 72px;
  border-radius: 12px;
  padding: 12px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  color: ${(props: any) => props.theme.colors.black};
  font-size: 14px;
`

export const InfoLine = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`

export const AddressPill = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  padding: 12px;
  border-radius: 12px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
`

export const TotalRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`

export const CartListCard = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 0 16px 12px;
  padding: 14px;
  border-radius: 18px;
  background-color: ${cardColor};
`

export const CartListCopy = styled.View`
  flex: 1;
  margin-right: 8px;
`

export const CheckoutBar = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 16px;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`
