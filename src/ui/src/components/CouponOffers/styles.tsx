import { StyleSheet } from 'react-native'
import styled, { css } from 'styled-components/native'

export const ScreenContainer = styled.View`
  flex: 1;
  padding-horizontal: ${(props: any) => props.theme.utils.margins.horizontal}px;
`

export const ManualSection = styled.View`
  padding-bottom: 20px;
`

export const SectionHeader = styled.View`
  margin-bottom: 12px;
`

export const ManualForm = styled.View`
  align-items: center;
  flex-direction: row;
  gap: 10px;
`

export const InputWrapper = styled.View`
  flex: 1;
`

export const CompactButton = styled.TouchableOpacity<{
  $danger?: boolean
  $disabled?: boolean
}>`
  align-items: center;
  background-color: ${(props: any) => props.$danger
    ? props.theme.colors.dangerContrast
    : props.theme.colors.primary};
  border-color: ${(props: any) => props.$danger
    ? props.theme.colors.danger
    : props.theme.colors.primary};
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
  border-width: 1px;
  flex-direction: row;
  justify-content: center;
  min-height: 44px;
  min-width: 92px;
  opacity: ${(props: any) => props.$disabled ? 0.5 : 1};
  padding-horizontal: 12px;
`

export const CompactButtonText = styled.Text<{ $danger?: boolean }>`
  color: ${(props: any) => props.$danger
    ? props.theme.colors.danger
    : props.theme.colors.white};
  font-size: 13px;
  font-weight: 600;
`

export const AppliedCouponCard = styled.View`
  align-items: center;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  border-color: ${(props: any) => props.theme.colors.border};
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
  border-width: 1px;
  flex-direction: row;
  gap: 12px;
  padding: 12px;
`

export const AppliedCouponInfo = styled.View`
  flex: 1;
`

export const OfferIcon = styled.View`
  align-items: center;
  background-color: ${(props: any) => props.theme.colors.primaryContrast};
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
  height: 44px;
  justify-content: center;
  width: 48px;
`

export const OfferTabs = styled.View`
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
  flex-direction: row;
  margin-bottom: 14px;
  padding: 4px;
`

export const OfferTab = styled.TouchableOpacity<{ $active?: boolean }>`
  align-items: center;
  border-radius: ${(props: any) => props.theme.utils.radius.m}px;
  flex: 1;
  flex-direction: row;
  gap: 6px;
  justify-content: center;
  min-height: 40px;

  ${(props: any) => props.$active && css`
    background-color: ${props.theme.colors.backgroundPage};
    border-color: ${props.theme.colors.border};
    border-width: 1px;
  `}
`

export const OfferTabText = styled.Text<{ $active?: boolean }>`
  color: ${(props: any) => props.$active
    ? props.theme.colors.textNormal
    : props.theme.colors.textSecondary};
  font-size: 13px;
  font-weight: 600;
`

export const OfferTabCount = styled.Text`
  background-color: ${(props: any) => props.theme.colors.backgroundGray200};
  border-radius: 10px;
  color: ${(props: any) => props.theme.colors.textNormal};
  font-size: 11px;
  font-weight: 700;
  min-width: 20px;
  overflow: hidden;
  padding-horizontal: 6px;
  padding-vertical: 2px;
  text-align: center;
`

export const OfferCardContainer = styled.View<{ $unavailable?: boolean }>`
  align-items: center;
  background-color: ${(props: any) => props.$unavailable
    ? props.theme.colors.backgroundGray100
    : props.theme.colors.backgroundPage};
  border-color: ${(props: any) => props.theme.colors.border};
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
  border-width: 1px;
  flex-direction: row;
  gap: 12px;
  margin-bottom: 12px;
  padding: 14px;
`

export const OfferRate = styled.View`
  align-items: center;
  background-color: ${(props: any) => props.theme.colors.primary};
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
  height: 44px;
  justify-content: center;
  width: 48px;
`

export const OfferRateText = styled.Text`
  color: ${(props: any) => props.theme.colors.white};
  font-size: 14px;
  font-weight: 700;
`

export const OfferContent = styled.View`
  flex: 1;
  gap: 3px;
`

export const OfferTitle = styled.Text`
  color: ${(props: any) => props.theme.colors.textNormal};
  font-size: 14px;
  font-weight: 600;
`

export const OfferCode = styled.Text`
  color: ${(props: any) => props.theme.colors.primary};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
`

export const OfferDescription = styled.Text<{ $danger?: boolean }>`
  color: ${(props: any) => props.$danger
    ? props.theme.colors.danger
    : props.theme.colors.textSecondary};
  font-size: 12px;
  line-height: 17px;
`

export const OfferAction = styled.TouchableOpacity<{
  $danger?: boolean
  $disabled?: boolean
}>`
  align-items: center;
  background-color: ${(props: any) => props.$danger
    ? props.theme.colors.dangerContrast
    : props.theme.colors.primary};
  border-radius: ${(props: any) => props.theme.utils.radius.m}px;
  justify-content: center;
  min-height: 38px;
  min-width: 76px;
  opacity: ${(props: any) => props.$disabled ? 0.5 : 1};
  padding-horizontal: 10px;
`

export const OfferActionText = styled.Text<{ $danger?: boolean }>`
  color: ${(props: any) => props.$danger
    ? props.theme.colors.danger
    : props.theme.colors.white};
  font-size: 12px;
  font-weight: 600;
`

export const OfferState = styled.View`
  align-items: center;
  flex: 1;
  justify-content: center;
  min-height: 220px;
  padding-horizontal: 24px;
`

export const couponOffersStyles = StyleSheet.create({
  input: {
    borderRadius: 10,
    height: 44,
    marginBottom: 0
  },
  list: {
    paddingBottom: 40
  }
})
