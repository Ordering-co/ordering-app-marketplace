import styled, { css } from 'styled-components/native'

export const Block = styled.View`
  padding: 15px;
  border-radius: 7.6px;
  border-width: 0.5px;
  margin: 20px;
  ${({ isCheckout } : any) => isCheckout && css`
    margin: 0px;
    margin-bottom: 20px;
  `}
`

export const IconControl = styled.TouchableOpacity`
  flex-direction: row;
  padding: 10px 0 10px 0px;
  width: 50%;
  align-items: center;
`
