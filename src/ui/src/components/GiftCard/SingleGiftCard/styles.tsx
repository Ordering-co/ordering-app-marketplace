import styled from 'styled-components/native';

export const CardContainer = styled.TouchableOpacity``

export const SingleGiftCardContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px;
`

export const GiftCardInfoContainer = styled.View`
  flex: 1;
`

export const LogoContainer = styled.View`
  width: 70px;
  height: 70px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
  align-items: center;
  justify-content: center;
`

export const SingleGiftCardPriceContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 70%;
  margin-top: 5px;
`
