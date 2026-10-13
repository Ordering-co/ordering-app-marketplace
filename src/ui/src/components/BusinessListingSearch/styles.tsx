import styled, { css } from 'styled-components/native'

export const BContainer = styled.View`
  padding: 20px;
`

export const ProductsList = styled.View`

`

export const SingleBusinessSearch = styled.View`
  width: 100%;
  padding-bottom: 20px;
`

export const BusinessInfo = styled.View`
  width: 15%;
  flex-direction: row;
`

export const BusinessLogo = styled.View`

`

export const BusinessInfoItem = styled.View`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 12px;
  margin-left: 10px;
`

export const Metadata = styled.View`
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

export const SingleBusinessContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`

export const TagsContainer = styled.View`
  padding-bottom: 10px;
`

export const SortContainer = styled.View`
  margin-bottom: 10px;
`

export const BrandContainer = styled.View``

export const BrandItem = styled.TouchableOpacity`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  ${({ active }: any) => active && css`
    background-color: ${({ theme }: any) => theme.colors.activeContrast};
  `}
`

export const PriceFilterWrapper = styled.View`
  margin-bottom: 12px;
`

export const WrapperButtons = styled.View`
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding-horizontal: 20px;
  padding-bottom: 20px;
`

export const BusinessTypesContainer = styled.View`
  width: '100%';
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`

export const PriceContainer = styled.View`
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`

export const FilterButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${(props: any) => props.isActive ? props.theme.colors.activeContrast : props.theme.colors.backgroundGray100};
  border-radius: 50px;
  padding-vertical: 8px;
  padding-horizontal: 15px;
  margin-right: 10px;
  border-width: 1px;
  border-color: ${(props: any) => props.isActive ? props.theme.colors.activeContrast : props.theme.colors.backgroundGray100};
  gap: 5px;
`;

export const ClearButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding-right: 10px;
`;

export const WrapperResults = styled.View`
  margin-top: 20px;
`;

export const FiltersActionBar = styled.ScrollView.attrs(() => ({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
}))`
  width: 100%;
`;


