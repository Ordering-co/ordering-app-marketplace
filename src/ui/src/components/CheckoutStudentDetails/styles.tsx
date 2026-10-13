import styled from 'styled-components/native'

export const Container = styled.View`
  border-top-width: 1px;
  border-top-color: ${({ theme }: any) => theme.colors.backgroundGray200 || '#E9ECEF'};
  margin-top: 18px;
  padding-top: 16px;
`

export const Header = styled.View`
  margin-bottom: 10px;
`

export const Info = styled.View`
  margin: 10px 0 4px;
`

export const EditLink = styled.TouchableOpacity`
  align-self: flex-start;
  margin-top: 10px;
`
