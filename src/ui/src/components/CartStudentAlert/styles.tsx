import styled from 'styled-components/native'

export const Content = styled.View`
  padding: 8px 20px 28px;
`

export const Intro = styled.View`
  margin-bottom: 14px;
`

export const ItemList = styled.View`
  margin-bottom: 16px;
`

export const Item = styled.View`
  padding: 10px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }: any) => theme.colors.backgroundGray200 || '#E9ECEF'};
`

export const Actions = styled.View``
