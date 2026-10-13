import styled, { css } from 'styled-components/native'
import { View } from 'react-native'
import FastImage from 'react-native-fast-image'
export const CardInfo = styled.View`
  flex: 1;
`
export const SoldOut = styled.View`
  position: absolute;
  background: ${(props: any) => props.theme.colors.backgroundGray100} 0% 0% no-repeat padding-box;
  border-radius: 23px;
  padding: 5px 10px;
  top: 37px;
  end: 10px;
`

export const QuantityContainer = styled.View`
  position: absolute;
  right: 10px;
  top: 10px;
  width: 25px;
  height: 25px;
  background-color: ${(props: any) => props.theme.colors.primary};
  border-radius: 12.5px;
  justify-content: center;
  align-items: center;
  z-index: 1;
`
export const PricesContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-vertical: 6px;
`

export const LogoWrapper = styled.View`
  position: relative;
  margin-left: ${(props: any) => !props.logoPosition || props.logoPosition === 'right' ? '12px' : '0px'};
`
export const WrapTags = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-left: 10px;
`
export const TagsContainer = styled.View`
    display: flex;
    margin: auto;
`

export const RibbonBox = styled.View`
  position: absolute;
  z-index: 1;
  top: -4px;
  right: -4px;
  background-color: ${(props: any) => props.theme.colors.primary};
  padding: 1px 8px;
  max-width: 180px;

  ${(props: any) => props.bgColor && css`
    background-color: ${props.bgColor};
  `}

  ${(props: any) => props.isRoundRect && css`
    border-radius: 7.6px;
  `}

  ${(props: any) => props.isCapsule && css`
    border-radius: 50px;
  `}

  ${(props: any) => props.colorText && css`
    color: ${props.colorText ? 'black' : 'white'};
  `}

  ${(props: any) => props.borderRibbon && css`
    border-width: 1px;
    border-color: ${props.borderRibbon ? 'black' : 'white'};
  `}
`

export const AdaptedCardContainer = styled(View)`
  border-radius: 10px;
  padding: 12px;
  flex-direction: row;
  align-items: center;
  ${(props: any) => !props.hideBorder && `
    border-bottom-width: 1px;
    border-bottom-color: ${props.theme.colors.border};
  `}
`;

export const ContentContainer = styled.View`
  flex: 1;
  margin-right: 12px;
`;

export const BottomRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

export const PriceFavoriteContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ProductImageContainer = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 20px;
  overflow: hidden;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
`;

export const ProductImageStyled = styled(FastImage)`
  width: 100%;
  height: 100%;
`;
