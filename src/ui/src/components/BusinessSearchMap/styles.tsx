import styled, { css } from 'styled-components/native'
import { Animated, Dimensions, Platform } from 'react-native'
import OText from '../shared/OText'

export const SHEET_EXPANDED_HEIGHT = Math.round(Dimensions.get('window').height * 0.72)
export const SHEET_PEEK_HEIGHT = 172
export const SHEET_COLLAPSED_TRANSLATE_Y = SHEET_EXPANDED_HEIGHT - SHEET_PEEK_HEIGHT

export const GoogleMapContainer = styled.View`
  flex: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

export const HeaderContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding-horizontal: 14px;
`

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`

const cardShadow = css`
  ${Platform.OS === 'ios' ? `
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.15;
    shadow-radius: 5px;
  ` : `
    elevation: 4;
  `}
`

export const CircleButton = styled.TouchableOpacity`
  height: 46px;
  width: 46px;
  border-radius: 23px;
  background-color: ${({ theme }: any) => theme.colors.white};
  justify-content: center;
  align-items: center;
  ${cardShadow}
`

export const SearchAreaWrapper = styled.View`
  align-items: center;
  margin-top: 12px;
`

export const SearchAreaButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }: any) => theme.colors.white};
  padding-vertical: 10px;
  padding-horizontal: 18px;
  border-radius: 22px;
  ${cardShadow}
`

export const WrapMomentOption = styled.TouchableOpacity`
  border-radius: 19px;
  background-color: ${({ theme }: any) => theme.colors.white};
  border-width: 1px;
  border-color: ${({ theme }: any) => theme.colors.border};
  height: 38px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  padding-horizontal: 14px;
  margin-right: 8px;
  ${cardShadow}
  ${({ active, theme }: any) => active && css`
    background-color: ${theme.colors.activeContrast};
    border-color: ${theme.colors.active};
  `}
`

export const BrandItem = styled.TouchableOpacity`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  cursor: pointer;
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  ${({ active }: any) => active && css`
    background-color: ${({ theme }: any) => theme.colors.activeContrast};
  `}
`

export const NoResult = styled.View`
  text-align: center;
`

export const BrandContainer = styled.View`
`

export const FilterContainer = styled.View`
  padding: 20px;
  background-color: ${({ theme }: any) => theme.colors.white};
`

export const PriceListContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

export const WrapperNotFound = styled.View`
  margin-top: 120px;
  height: 500px;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
`

export const SheetContainer = styled(Animated.View)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${SHEET_EXPANDED_HEIGHT}px;
  background-color: ${({ theme }: any) => theme.colors.white};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  shadow-color: #000;
  shadow-offset: 0px -3px;
  shadow-opacity: 0.12;
  shadow-radius: 8px;
  elevation: 12;
`

export const SheetHandleArea = styled.View`
  padding-top: 10px;
  padding-bottom: 8px;
  padding-horizontal: 20px;
`

export const SheetGrabber = styled.View`
  width: 44px;
  height: 5px;
  border-radius: 3px;
  align-self: center;
  background-color: ${({ theme }: any) => theme.colors.backgroundGray200};
  margin-bottom: 12px;
`

export const SheetTitle = styled(OText)`
  margin-bottom: 2px;
`

export const SheetCardWrapper = styled.View`
  border-radius: 16px;
  padding-top: 10px;
  ${({ selected, theme }: any) => selected && css`
    border-width: 2px;
    border-color: ${theme.colors.active};
    background-color: ${theme.colors.lightPrimary};
  `}
`

export const filterRowContent = {
  paddingTop: 12,
  paddingBottom: 4
}

export const sheetListContent = {
  paddingHorizontal: 20,
  paddingBottom: 32
}
