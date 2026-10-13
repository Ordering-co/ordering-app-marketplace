import { Dimensions } from 'react-native';
import styled, { css } from 'styled-components/native';

const { width } = Dimensions.get('window');

export const OTabs = styled.View`
  flex-direction: row;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  border-radius: 30px;
`;

export const OTab = styled.TouchableOpacity`
  padding-vertical: 10px;
  padding-horizontal: 15px;
  border-radius: 30px;
  ${(props: any) => props.selected && css`
    background-color: ${props.bgColorSelected ?? props.theme.colors.activeContrast};
  `}
`;

export const SkeletonWrapper = styled.View`
  width: 90%;
`

export const Line = styled.View`
  height: 1px;
  background-color: ${(props: any) => props.theme.colors.border};
  flex-grow: 1;
  margin-bottom: 5px;
`

export const ContainerButtons = styled.View`
  margin-bottom: 10px;
`

export const SocialButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-vertical: 12px;
  border-radius: 30px;
  border-width: 2px;
  border-color: ${(props: any) => props.theme.colors.black};
  background-color: #fff;
  min-width: ${width * 0.3}px;
  padding-horizontal: 10px;
`
