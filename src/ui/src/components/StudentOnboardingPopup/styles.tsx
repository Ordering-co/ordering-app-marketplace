import styled from 'styled-components/native'

export const Content = styled.View`
  padding: 8px 20px 28px;
`

export const StudentButton = styled.TouchableOpacity`
  padding: 14px 16px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${({ theme }: any) => theme.colors.backgroundGray200 || '#E9ECEF'};
  margin-bottom: 10px;
`

export const EmptyMessage = styled.View`
  padding: 6px 0 16px;
`

export const CreateButton = styled.TouchableOpacity`
  padding: 14px 16px;
  border-radius: 8px;
  align-items: center;
  margin-top: 6px;
  background-color: ${({ theme }: any) => theme.colors.primary};
`
