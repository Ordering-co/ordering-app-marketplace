import styled from 'styled-components/native'

export const Container = styled.View`
  padding: 12px 0;
  margin-bottom: 10px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }: any) => theme.colors.backgroundGray200 || '#E9ECEF'};
`

export const Inner = styled.View`
  padding-horizontal: 20px;
`
