import styled from 'styled-components/native'

export const AddressSuggestContainer = styled.Pressable`
  background: ${({ theme }: any) => theme?.colors?.white};
  width: 100%;
  z-index: 1000;
  padding: 10px;
  border-width: 1px;
  border-color: ${({ theme }: any) => theme?.colors?.border};
  bottom: 20px;
`
