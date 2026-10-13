import styled from 'styled-components/native'

export const ReviewProductsContainer = styled.ScrollView`
  padding: 20px;
  margin-bottom: 100px;
`

export const ActionContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 3px 30px;
`

export const SkipButton = styled.TouchableOpacity`
`

export const Content = styled.ScrollView`
  background-color: ${(props: any) => props.theme.colors.white};
  margin-bottom: 30px;
`;

export const ProductsReviewsContainer = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;
`
