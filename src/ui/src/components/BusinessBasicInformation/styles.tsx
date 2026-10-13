import styled, { css } from 'styled-components/native';

export const BusinessContainer = styled.View`
  flex-direction: column;
`;
export const BusinessHeader = styled.ImageBackground`
  width: 100%;
  height: 210px;
  position: relative;
`;
export const BusinessInfo = styled.View`
  width: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  padding: 10px ${(props: any) => props.theme.utils.margins.horizontal}px;
`;
export const BusinessInfoHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: 10px;
`;
export const BusinessLogo = styled.View`
  border-radius: 15px;
  width: 20%;
`;
export const BusinessInfoItem = styled.View`
  width: 80%;
  flex-direction: row;
  align-items: center;
`;
export const BusinessInfoActions = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: 10px;
`;
export const BusinessInfoActionsItem = styled.TouchableOpacity`
  border-radius: 15px;
  width: ${(props: any) => props.width ? `${props.width}%` : 'auto'};
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
  padding: 10px 20px;
  gap: 5px;
`;
export const WrapReviews = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export const TitleWrapper = styled.View`
  width: 100%;
  flex-direction: column;
  margin-left: 10px;
`

export const RibbonBox = styled.View`
  background-color: ${(props: any) => props.theme.colors.primary};
  padding: 2px 8px;
  max-width: 180px;
  align-self: flex-start;
  margin-bottom: 5px;

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

export const SocialListWrapper = styled.ScrollView`
  flex-direction: row;
`

export const SocialIcon = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
`;

export const CardContainer = styled.View`
  width: 100%;
  flex-direction: row;
  border-radius: 20px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
  padding: 15px 20px;
  align-items: center;
  justify-content: center;
  align-self: center;
`;

export const InfoSection = styled.View`
  align-items: center;
  padding-horizontal: 25px;
`;

export const VerticalSeparator = styled.View`
  width: 1px;
  height: 100%;
  background-color: ${(props: any) => props.theme.colors.border};
`;
