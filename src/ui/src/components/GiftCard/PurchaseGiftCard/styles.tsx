import styled from 'styled-components/native'

export const Container = styled.View`
  width: 100%;
`

export const GiftCardItem = styled.View`
  padding: 12px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.disabled};
  border-radius: 15px;
  margin-bottom: 10px;
  overflow: hidden;
`

export const GiftCardHeader = styled.View`
  flex-direction: row;
  align-items: flex-start;
`

export const GiftCardCopy = styled.View`
  flex: 1;
  margin-left: 10px;
`

export const PurchaseButtonWrap = styled.View`
  align-self: stretch;
  margin-top: 12px;
`
