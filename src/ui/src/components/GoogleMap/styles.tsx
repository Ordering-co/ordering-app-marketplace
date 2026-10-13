import styled, { css } from 'styled-components/native';
import FastImage from 'react-native-fast-image';

export const MarkerPin = styled.View`
  align-items: center;
  justify-content: center;
`;

export const MarkerBubble = styled.View`
  width: 54px;
  height: 54px;
  border-radius: 23px;
  background-color: ${({ theme }: any) => theme.colors.white};
  border-width: 2px;
  border-color: ${({ theme }: any) => theme.colors.white};
  align-items: center;
  justify-content: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 4;
  ${({ selected, theme }: any) => selected && css`
    border-color: ${theme.colors.active};
    width: 54px;
    height: 54px;
    border-radius: 27px;
  `}
`;

export const MarkerLogo = styled(FastImage)`
  width: 100%;
  height: 100%;
  border-radius: 22px;
`;

export const MarkerPointer = styled.View`
  width: 0px;
  height: 0px;
  background-color: transparent;
  border-style: solid;
  border-left-width: 6px;
  border-right-width: 6px;
  border-top-width: 8px;
  border-left-color: transparent;
  border-right-color: transparent;
  border-top-color: ${({ theme }: any) => theme.colors.white};
  margin-top: -2px;
  ${({ selected, theme }: any) => selected && css`
    border-top-color: ${theme.colors.active};
  `}
`;

export const ContainerCard = styled.View`
  border-radius: 10px;
  width: 280px;
  background-color: white;
  padding: 10px 15px;
`;

export const BusinessHero = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const Medadata = styled.View`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

export const BusinessNameContainer = styled.View`
  width: 100%;
`;

export const OrderButton = styled.TouchableOpacity`
  background-color: ${({ theme }: any) => theme.colors.primary};
  padding: 8px 12px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;
