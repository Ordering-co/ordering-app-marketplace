import styled, { css } from 'styled-components/native'
import { OText } from '../shared';
import { themeBrandColor } from '@/utils/themeBrandColor';

export const CategoriesContainer = styled.View`
  padding-vertical: 10px;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`;

export const CategoryItemContainer = styled.TouchableOpacity`
  flex-direction: ${(props: any) => props.$maweja ? 'row' : 'column'};
  justify-content: center;
  align-items: center;
  margin-right: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  background-color: ${({ theme, isSelected, $maweja }: any) => {
    if ($maweja && isSelected) return themeBrandColor(theme)
    return isSelected ? theme.colors.activeContrast : theme.colors.backgroundGray200
  }};
`;

export const CategoryName = styled(OText)`
  text-align: center;
  font-size: 14px;
  font-weight: ${(props: any) => props.isSelected ? '600' : '500'};
  color: ${(props: any) => {
    if (props.$maweja && props.isSelected) return props.theme.colors.white
    return props.isSelected ? props.theme.colors.active : props.theme.colors.textNormal
  }};
`;

export const CategoryCardContainer = styled.TouchableOpacity`
  align-items: center;
  margin-right: ${(props: any) => props.$maweja ? 14 : 25}px;
  width: ${(props: any) => props.$maweja ? 76 : 65}px;
  min-height: 96px;
  border-radius: 12px;
  padding: 5px 0;
  ${({ isSelected }: any) => isSelected && css`
    background-color: ${({ theme }: any) => theme.colors.activeContrast};
  `}
`;

export const IconWrapper = styled.View`
  width: ${(props: any) => props.$maweja ? 64 : 56}px;
  height: ${(props: any) => props.$maweja ? 64 : 56}px;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  border-radius: ${(props: any) => props.$maweja ? 18 : 0}px;
  overflow: hidden;
  ${({ $maweja, isSelected, theme }: any) => $maweja && isSelected && css`
    border-width: 2px;
    border-color: ${themeBrandColor(theme)};
  `}
`;

export const CategoryCardName = styled(OText)`
  align-self: stretch;
  text-align: center;
  font-size: 12px;
  font-weight: ${(props: any) => props.isSelected ? 'bold' : 'normal'};
  color: ${(props: any) => props.isSelected ? props.theme.colors.primary : props.theme.colors.textSecondary};
`;

export const CategoryRowScrollView = styled.ScrollView.attrs(({ isCardMode }: any) => ({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: isCardMode
    ? {
      paddingVertical: 10,
    }
    : {
      paddingVertical: 6,
      paddingHorizontal: 16,
      alignItems: 'center',
    },
}))``;
