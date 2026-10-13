import styled from 'styled-components/native';
import { FlatList } from 'react-native';

export const ScreenContainer = styled.View`
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  margin-top: 20px;
  margin-bottom: 30px;
`;

export const LanguageList = styled(FlatList)`
  padding-horizontal: ${(props: any) => props.theme.utils.margins.horizontal}px;
`;

export const LanguageItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-vertical: 15px;
`;

export const WrapperFlag = styled.View`
  border-radius: 10px;
  padding: 8px;
  margin-right: 10px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.disabled};
`;

export const FlagText = styled.Text`
  font-size: ${(props: any) => props.theme.utils.tsize.l}px;
  margin-right: 20px;
`;

export const RadioButtonOuter = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border-width: 2px;
  border-color: ${(props: any) => props.isSelected ? props.theme.colors.active : props.theme.colors.border};
  align-items: center;
  justify-content: center;
`;

export const RadioButtonInner = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${(props: any) => props.theme.colors.active};
`;
