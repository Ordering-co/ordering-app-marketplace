import { ScrollView } from 'react-native'
import styled, { css } from 'styled-components/native'

export const PreOrderContainer = styled(ScrollView)
  .attrs(({ contentContainerStyle }: any) => ({
    contentContainerStyle: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      ...contentContainerStyle
    }
  }))`
`;

export const BusinessInfoWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const PreorderTypeWrapper = styled.View`
  margin-top: 20px;
`

export const MenuWrapper = styled(PreorderTypeWrapper)``

export const OrderTimeWrapper = styled.View`
`

export const TimeListWrapper = styled.ScrollView`
  margin-top: 30px;
  max-height: 160px;
  ${({ cateringPreorder }: any) => cateringPreorder && css`
    max-height: 210px;
    height: 210px;
  `}
`

export const TimeContentWrapper = styled.View`
  flex: 1;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
`

export const TimeItem = styled.View`
  width: 86px;
  height: 34px;
  background: #E9ECEF;
  border-radius: 7.6px;
  justify-content: center;
  align-items: center;
  margin: 10px 0px;
  ${({ cateringPreorder }: any) => cateringPreorder && css`
    background: #fff;
    width: 100%;
    min-width: 100%;
    height: 50px;
    flex-direction: row;
    justify-content: flex-start;
    padding-left: 10px;
    margin: 0;
  `}
  ${({ active }: any) => active && css`
    background: #F5F9FF;
  `}
`

export const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }: any) => theme.colors.border};
  margin: 20px 0;
`
