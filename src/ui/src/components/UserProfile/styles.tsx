import { Platform } from 'react-native'
import styled from 'styled-components/native'

const androidBorderColor = 'rgba(0, 0, 0, 0.1)';

export const Container = styled.View`
  flex: 1;
  height: 100%;
  padding-top: 20px;
`

export const WrapperOptions = styled.ScrollView`
  flex: 1;
`

export const QuickActionsContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  background-color: ${(props: any) => props.theme.colors.white};
  align-items: center;
  padding: 20px 10px;
  margin: 5px 15px 25px;
  border-radius: 12px;

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

export const QuickActionButtonStyle = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
`

export const WrapperIcon = styled.View`
  border-radius: 10px;
  padding: 8px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
`

export const Section = styled.View`
  margin-top: 10px;
  padding-horizontal: 20px;
`

export const ListItem = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`

export const ListItemStyle = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 18px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.backgroundGray200};
`

export const ListItemContent = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`
