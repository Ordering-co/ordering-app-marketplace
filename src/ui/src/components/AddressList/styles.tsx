import { Platform } from 'react-native'
import styled from 'styled-components/native'
const androidBorderColor = 'rgba(0, 0, 0, 0.1)';

export const Container = styled.ScrollView`
  position: relative;
  flex: 1;
  padding: ${({ theme }: any) => theme.utils.margins.horizontal}px;
  margin-bottom: 40px;
  padding-top: 20px;
`

export const AddressItem = styled.TouchableOpacity`
  padding-vertical: 10px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

export const ContainerButtons = styled.View`
  margin-vertical: 50px;
`

export const WrapperIconActions = styled.View`
  height: 30px;
  width: 30px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: ${(props: any) => props.theme.colors.white};
  margin: 3px;

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
