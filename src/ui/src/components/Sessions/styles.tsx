import { Platform } from 'react-native'
import styled from 'styled-components/native'

const androidBorderColor = 'rgba(0, 0, 0, 0.1)';

export const Container = styled.ScrollView`
  padding: ${(props: any) => props.theme.utils.margins.horizontal}px;
`

export const SessionsWrapper = styled.View`
  margin-bottom: 40px;
  gap: 20px;
`
export const SessionItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 15px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.backgroundGray200};
  border-radius: 15px;
  padding-horizontal: 20px;
`

export const DeleteSessionBtn = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors?.white};
  border-radius: 10px;
  padding: 8px;

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
