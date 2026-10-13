import { Platform } from 'react-native';
import styled, { css } from 'styled-components/native'
const androidBorderColor = 'rgba(0, 0, 0, 0.1)';

export const Container = styled.View`
`

export const WrapHeader = styled.View`
  align-items: flex-start;
  flex-direction: column;
  ${({ addMargin }: any) => addMargin && css`
    padding: 10px ${({ theme }: any) => theme.utils.margins.horizontal}px;
  `};
  width: 80%;
`

export const AccordionTitle = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px ${({ theme }: any) => theme.utils.margins.horizontal}px;
  background-color: ${({ theme }: any) => theme.colors.safeAreaColor};
  width: 100%;
`

export const WrappAction = styled.View`
  height: 45px;
  width: 45px;
  border-radius: 10px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
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
`;

export const RequiredWrap = styled.View`
  background-color: ${({ theme }: any) => theme.colors.activeContrast};
  padding: 5px 10px;
  border-radius: 15px;
`
