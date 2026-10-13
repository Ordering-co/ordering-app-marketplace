import { Platform } from 'react-native';
import styled, { css } from 'styled-components/native'
const androidBorderColor = 'rgba(0, 0, 0, 0.1)';

export const WrapHeader = styled.View`
  position: relative;
  z-index: 1;
`

export const TopActions = styled.TouchableOpacity`
	height: 60px;
	justify-content: center;
  min-width: 30px;
  padding-right: 15px;
`;

export const TopHeader = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
  height: 60px;
  min-height: 60px;
`

export const ProductHeader = styled.ImageBackground`
  flex-direction: row;
  width: 100%;
  position: relative;
  resize-mode: contain;
  min-height: 200px;
  z-index: 0;
`

export const WrapContent = styled.View`
  padding: 26px 40px;
  position: relative;
  bottom: 20px;
  background-color: white;
  z-index: 100;
`

export const ProductTitle = styled.View`
  justify-content: flex-start;
  padding-bottom: 7px;
`

export const ProductDescription = styled.View`
  padding-bottom: 20px;
`

export const ProductEditions = styled.View`
  padding-vertical: 0;
  background-color: white;
`

export const SectionTitle = styled.View`
  padding: 10px 0px;
`

export const WrapperIngredients = styled.View`
`

export const WrapperSubOption = styled.View`
  background-color: ${(props: any) => props.bgcolor};
  padding-horizontal: ${(props: any) => props.theme.utils.margins.horizontal}px;
`

export const ProductComment = styled.View`
  padding-bottom: ${(props: any) => props.pb || 60}px;
  padding-horizontal: 20px;
`

export const ProductActions = styled.View`
  position: absolute;
  bottom: 0px;
  padding-top: ${(props: any) => props.ios ? '20px' : '0'};
  padding-horizontal: 30px;
  padding-vertical: 20px;
  width: 100%;
  flex-direction: ${(props: any) => props.isColumn ? 'column' : 'row'};
  background-color: #FFF;
  z-index: 1000;
  border-top-width: 1px;
  border-top-color: ${(props: any) => props.theme.colors.border};
`
export const ExtraOptionWrap = styled.ScrollView`
  padding: ${(props: any) => props.theme.utils.margins.horizontal}px 10px;
  padding-bottom: 0px;
  background-color: ${(props: any) => props.theme.colors.white};
`;

export const WeightUnitSwitch = styled.View`
  margin-left: 10px;
`
export const WeightUnitItem = styled.View`
  padding: 1px 5px;
  border-radius: 4px;

  ${({ active }: any) => active && css`
    background-color: ${(props: any) => props.theme.colors.primary}20;
  `}
`
export const ProductSummary = styled.View`
  padding: 26px ${(props: any) => props.ph}px 0;
  position: relative;
  background-color: white;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
`

export const BackgroundImage = styled.ImageBackground`
  flex: 1;
  justify-content: center;
`

export const Line = styled.View`
  align-self: center;
  margin-bottom: 10px;
  height: 5px;
  width: 35px;
  border-radius: 10px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray200};
`

export const WrappAction = styled.TouchableOpacity`
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
  ` : ''}
`

export const WrapperHeaderActions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: ${(props: any) => props.theme.utils.margins.horizontal}px;
  padding-vertical: 10px;
  ${(props: any) => props.isSticky && css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: ${(props: any) => props.showBackground
      ? props.theme.colors.white
      : 'transparent'};
    border-bottom-width: ${(props: any) => props.showBackground ? '1px' : '0px'};
    border-bottom-color: ${(props: any) => props.theme.colors.border};

    /* iOS Shadow */
    ${(props: any) => props.showBackground && Platform.OS === 'ios' ? `
      shadow-color: #000;
      shadow-offset: 0px 2px;
      shadow-opacity: 0.1;
      shadow-radius: 3px;
    ` : ''}

    /* Android Shadow */
    ${(props: any) => props.showBackground && Platform.OS === 'android' ? `
      elevation: 4;
    ` : ''}
  `}
`

export const Divider = styled.View`
  height: 4px;
  background-color: ${(props: any) => props.theme.colors.border};
`

export const QuantityControl = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-right: ${(props: any) => props.isCentered ? 0 : 10}px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
  border-radius: 30px;
  padding: 0 20px;
`
