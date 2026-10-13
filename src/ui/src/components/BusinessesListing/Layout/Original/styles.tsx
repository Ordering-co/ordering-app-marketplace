import { Platform } from 'react-native'
import styled, { css } from 'styled-components/native'

const androidBorderColor = 'rgba(0, 0, 0, 0.1)';

export const Search = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-horizontal: ${(props: any) => props.theme.utils.margins.horizontal}px;
`

export const BackArrow = styled.TouchableOpacity`
  height: 30px;
  width: 30px;
  border-radius: 10px;
  background-color: ${(props: any) => props.theme.colors.white};
  justify-content: center;
  align-items: center;

  /* iOS Shadow */
  ${Platform.OS === 'ios' ? `
    shadow-color: #000;
    shadow-offset: 0px 2px; /* x, y */
    shadow-opacity: 0.15;
    shadow-radius: 4px;
  ` : ''}

  /* Android Shadow */
  ${Platform.OS === 'android' ? `
    border-width: 1px;
    border-color: ${androidBorderColor};
  ` : ''};
`

export const AddressInput = styled.View`
  flex-direction: row;
  align-items: center;
  width: 80%;
  height: 44px;
`

export const WrapperCartIcon = styled.TouchableOpacity`
  height: 40px;
  width: 40px;
  border-radius: 12px;
  background-color: ${(props: any) => props.theme.colors.white};
  justify-content: center;
  align-items: center;

  /* iOS Shadow */
  ${Platform.OS === 'ios' ? `
    shadow-color: #000;
    shadow-offset: 0px 2px; /* x, y */
    shadow-opacity: 0.15;
    shadow-radius: 4px;
  ` : ''}

  /* Android Shadow */
  ${Platform.OS === 'android' ? `
    border-width: 1px;
    border-color: ${androidBorderColor};
  ` : ''}
`

export const CartIconWrapper = styled.View`
  position: relative;
`

export const CartBadge = styled.View`
  position: absolute;
  top: -2px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  background-color: ${(props: any) => props.theme.colors.primary};
  justify-content: center;
  align-items: center;
  padding-horizontal: 4px;
`

export const AddressInputContainer = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
`

export const OrderControlContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding-horizontal: ${(props: any) => props.theme.utils.margins.horizontal}px;
`

export const WrapMomentOption = styled.TouchableOpacity`
  border-radius: 15px;
  width: ${(props: any) => props.width}%;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  height: 45px;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding-horizontal: 20px;
`

export const HeaderWrapper = styled.ImageBackground`
  height: ${({ bgHeaderHeight }: any) => bgHeaderHeight || '270px'};
	padding: 20px;
	background-color: transparent;
`;

export const ListWrapper = styled.View`
	background-color: ${(props: any) => props.theme.colors.backgroundLight};
`;

export const FeaturedWrapper = styled.View`
	background-color: ${(props: any) => props.theme.colors.backgroundLight};
	paddingVertical: 30px;
`;

export const FarAwayMessage = styled.View`
  flex-direction: row;
  align-items: center;
	background-color: ${(props: any) => props.theme.colors.warning1};
  margin-bottom: 10px;
  border-radius: 7.6px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.warning5};
  padding-vertical: 6px;
  padding-horizontal: 20px;
`

export const PreorderInput = styled(AddressInput)`
  justify-content: center;
`

export const OTabs = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: -1px;
  width: 100%;
`;

export const OTab = styled.TouchableOpacity`
  padding-bottom: 10px;
  border-bottom-width: 1px;
  margin-end: 14px;
  padding-horizontal: 5px;
`;

export const OrderTypesContainer = styled.View`
  flex-direction: row;
  font-size: 14px;
  width: 180px;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.border};
  margin-top: 10px;
  align-self: center;
`

export const BusinessLogosContainer = styled.ScrollView`
  padding-bottom: 10px;
`

export const PopoverContainer = styled.TouchableOpacity`
  padding-horizontal: ${(props: any) => props.theme.utils.margins.horizontal}px;
  margin-top: -10px;
`;

export const Bubble = styled.View`
  background-color: ${(props: any) => props.theme.colors.black};
  border-radius: 20px;
  padding: 15px;
  width: 100%;
`;

export const Pointer = styled.View`
  width: 0;
  height: 0;
  background-color: transparent;
  border-style: solid;
  border-left-width: 10px;
  border-right-width: 10px;
  border-bottom-width: 10px;
  border-left-color: transparent;
  border-right-color: transparent;
  border-bottom-color: ${(props: any) => props.theme.colors.black};
  margin-left: 30px;
`;
