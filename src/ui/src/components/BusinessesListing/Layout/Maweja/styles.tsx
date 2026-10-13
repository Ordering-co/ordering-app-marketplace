import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'
import { themeBrandColor } from '@/utils/themeBrandColor'

export const HeaderBand = styled.View`
  padding-horizontal: ${(props: any) => props.theme.utils.margins.horizontal}px;
  padding-top: ${(props: any) => 8 + (props.$topInset || 0)}px;
  padding-bottom: 16px;
  background-color: ${(props: any) => props.$scrolled ? themeBrandColor(props.theme) : props.theme.colors.backgroundPage};
`

export const TopRow = styled.View`
  flex-direction: row;
  align-items: center;
`

export const Logo = styled.Image`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  margin-right: 10px;
`

export const AddressLabel = styled.View`
  flex: 1;
  margin-horizontal: 8px;
`

export const SearchLabel = styled.View`
  margin-left: 8px;
`

export const AddressPill = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  height: 36px;
  padding-horizontal: 12px;
  border-radius: 18px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray200};
`

export const IconButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  margin-left: 8px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  background-color: ${(props: any) => props.theme.colors.backgroundGray200};
`

export const CartWrap = styled.View`
  position: relative;
`

export const CartBadge = styled.View`
  position: absolute;
  top: -2px;
  right: 4px;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  padding-horizontal: 3px;
  align-items: center;
  justify-content: center;
  background-color: ${(props: any) => props.theme.colors.primary};
`

export const SearchField = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  height: 44px;
  margin-top: 12px;
  padding-horizontal: 14px;
  border-radius: 22px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray200};
`

export const ControlsRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 12px;
`

export const ControlPill = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  height: ${(props: any) => props.$tall ? 44 : 32}px;
  margin-right: 8px;
  padding-horizontal: 12px;
  border-radius: 16px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray200};
`

export const BusinessCard = styled.View`
  width: 100%;
  margin-bottom: ${(props: any) => props.$compact ? 0 : 24}px;
  padding: 10px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
  border-radius: 24px;
  background-color: ${(props: any) => props.theme.colors.backgroundCard || props.theme.colors.white};
`

export const BusinessMedia = styled.View`
  height: ${(props: any) => props.$compact ? 132 : 210}px;
  border-radius: 16px;
  overflow: hidden;
  background-color: ${(props: any) => props.theme.colors.backgroundGray200};
`

export const BusinessOverlay = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.45);
`

export const BusinessImage = styled(FastImage)`
  width: 100%;
  height: 100%;
`

export const BusinessRating = styled.View`
  position: absolute;
  right: 10px;
  bottom: 10px;
  flex-direction: row;
  align-items: center;
  height: 26px;
  padding-horizontal: 8px;
  border-radius: 13px;
  background-color: ${(props: any) => props.theme.colors.white};
`

export const BusinessOffer = styled.View`
  position: absolute;
  left: 10px;
  top: 10px;
  max-width: 70%;
  padding-horizontal: 10px;
  padding-vertical: 4px;
  border-radius: 12px;
  background-color: ${(props: any) => props.theme.colors.white};
`

export const BusinessFavorite = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  background-color: ${(props: any) => props.theme.colors.white};
`

export const BusinessBody = styled.View`
  padding-top: 10px;
`

export const BusinessIdentity = styled.View`
  flex-direction: row;
  align-items: center;
`

export const BusinessMark = styled.View`
  width: ${(props: any) => props.$compact ? 32 : 44}px;
  height: ${(props: any) => props.$compact ? 32 : 44}px;
  margin-right: 10px;
  border-radius: ${(props: any) => props.$compact ? 16 : 22}px;
  overflow: hidden;
  background-color: ${(props: any) => props.theme.colors.white};
`

export const BusinessMarkImage = styled(FastImage)`
  width: 100%;
  height: 100%;
`

export const BusinessCopy = styled.View`
  flex: 1;
`

export const BusinessMeta = styled.View`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  margin-top: ${(props: any) => props.$inline ? 4 : 8}px;
`

export const BusinessMetaItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 12px;
`
