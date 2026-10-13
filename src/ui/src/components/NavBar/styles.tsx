import { Platform } from 'react-native'
import styled, { css } from 'styled-components/native'

const androidBorderColor = 'rgba(0, 0, 0, 0.1)';

export const Wrapper = styled.View`
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  flex-direction: row;
  align-items: center;
  height: 50px;
`

export const TitleTopWrapper = styled.View`
  flex: 1;
  min-width: 0;
  width: ${(props: any) => props.$shrink ? 'auto' : '100%'};
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding-left: ${(props: any) => props.theme.utils.margins.horizontal}px;
`

export const BackArrow = styled.TouchableOpacity`
  height: 30px;
  width: 30px;
  border-radius: 10px;
  background-color: ${(props: any) => props.theme.colors.white};
  justify-content: center;
  align-items: center;
  margin-left: ${(props: any) => props.theme.utils.margins.horizontal}px;

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

  ${(props: any) => props.isFocused && css`
    border-width: 1px;
    border-color: ${props.theme.colors.primary};
  `}

  ${(props: any) => props.borderColor && css`
    border-width: 1px;
    border-color: ${props.borderColor};
  `}
`
