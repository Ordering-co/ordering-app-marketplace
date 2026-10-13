import { Platform } from 'react-native';
import styled from 'styled-components/native';

const androidBorderColor = 'rgba(0, 0, 0, 0.1)';

export const Wrapper = styled.Pressable``

export const WrapperPhoneTextNumber = styled.View`
  flex-direction: row;
  gap: 15px;
  align-items: center;
  border-radius: 15px;
  background-color: ${(props: any) => props.theme.colors.white};
  padding-horizontal: 20px;
  padding-vertical: 5px;
  margin-bottom: 20px;
  width: 100%;
  height: 55px;

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
