import styled from 'styled-components/native'

export const Wrapper = styled.View`
  flex: 1;
  padding: 16px 20px;
`

export const Header = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 16px;
`

export const AddButton = styled.TouchableOpacity`
  padding: 9px 14px;
  border-radius: 20px;
  background-color: ${({ theme }: any) => theme.colors.primary};
`

export const StudentCard = styled.TouchableOpacity`
  padding: 14px 16px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${({ theme }: any) => theme.colors.backgroundGray200 || '#E9ECEF'};
  margin-bottom: 12px;
`

export const Empty = styled.View`
  padding: 20px 0;
`
