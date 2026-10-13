import styled from 'styled-components/native'
import { SafeAreaView } from 'react-native-safe-area-context'

export const ScreenContainer = styled(SafeAreaView)`
  flex: 1;
`;

export const ContentContainer = styled.ScrollView`
  flex: 1;
  padding: 20px;
`;

export const SettingsWrapper = styled.View`
  flex-grow: 1;
`;

export const SettingItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 18px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.backgroundGray200};
`;
