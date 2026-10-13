import styled from 'styled-components/native'

export const Container = styled.View`
  padding: 12px 0 4px;
`

export const Label = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: ${({ theme }: any) => theme.colors.textNormal || theme.colors.black};
`

export const Notice = styled.View`
  margin: 10px 0 14px;
  padding: 12px 14px;
  border-radius: 8px;
  background-color: ${({ theme }: any) => theme.colors.backgroundGray100 || '#F8F9FA'};
`

export const AddStudentLink = styled.TouchableOpacity`
  align-self: flex-start;
  padding: 8px 0;
`
