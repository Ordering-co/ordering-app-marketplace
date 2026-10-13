import { Platform } from 'react-native'
import styled from 'styled-components/native'

export const Form = styled.View`
  padding: 6px 0 24px;
`

export const Field = styled.View`
  margin-bottom: 14px;
`

export const Label = styled.Text`
  font-size: 14px;
  margin-bottom: 8px;
  color: ${({ theme }: any) => theme.colors.textNormal || theme.colors.black};
`

export const ReadonlyField = styled.View`
  padding: 16px 20px;
  border-radius: 15px;
  background-color: ${({ theme }: any) => theme.colors.white};
  ${Platform.OS === 'ios'
    ? `
      shadow-color: #000;
      shadow-offset: 0px 2px;
      shadow-opacity: 0.15;
      shadow-radius: 4px;
    `
    : `
      border-width: 1px;
      border-color: rgba(0, 0, 0, 0.1);
    `}
`

export const ChipGroup = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`

export const Chip = styled.TouchableOpacity`
  padding: 8px 14px;
  border-radius: 20px;
  margin: 0 8px 8px 0;
  border-width: 1px;
`

export const Actions = styled.View`
  margin-top: 10px;
`
