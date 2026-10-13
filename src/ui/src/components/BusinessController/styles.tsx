import styled, { css } from 'styled-components/native';

export const BusinessHero = styled.View`
  margin-bottom: 10px;
`

export const BusinessContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const BusinessCategory = styled.View`
`;

export const Metadata = styled.View`
  flex-direction: row;
`;

export const BusinessState = styled.View`
  position: absolute;
  top: 50px;
	right: 5px;
`

export const BusinessLogo = styled.View`
  border-radius: 15px;
  justify-content: center;
  align-items: center;
`

export const BusinessRightFooter = styled.View`
`

export const BusinessRightFooterTitle = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`

export const BusinessInfoContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`

export const Reviews = styled.View`
  flex-direction: row;
  align-items: center;
`

export const RibbonBox = styled.View`
  position: absolute;
  z-index: 1;
  top: 0px;
  right: 0px;
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

export const OfferBox = styled.View`
  position: absolute;
  z-index: 1;
  border-radius: 50px;
  top: 25px;
  right: 5px;
  background: ${(props: any) => props.theme.colors.inputBorderColor};
  padding: 3px 8px;
  max-width: 180px;
`

export const SimpleCardCardContainer = styled.TouchableOpacity`
  flex-direction: row;
  border-radius: 15px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
  padding: 12px;
  margin-bottom: 20px;
  align-items: center;
`;

export const SimpleCardLogoContainer = styled.View`
  width: 60px;
  height: 60px;
  border-radius: ${(props: any) => props.theme.utils.radius.s || 4}px;
  margin-right: 12px;
  overflow: hidden;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100 || '#F0F0F0'};
`;

export const SimpleCardBusinessDetailsContainer = styled.View`
  flex: 1;
  justify-content: center;
`;

export const BusinessStateView = styled.View`
  background-color: #DEE2E6;
  border-radius: 50px;
  height: 20px;
  align-items: center;
  justify-content: center;
  padding-horizontal: 8px;
`
