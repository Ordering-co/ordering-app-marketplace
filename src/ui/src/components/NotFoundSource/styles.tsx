import styled from 'styled-components/native'

export const NotFound = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  margin: 10px auto;
  padding: 10px;
`

export const NotFoundImage = styled.View`
  max-width: 300px;
`

export const IconBadge = styled.View`
  width: 88px;
  height: 88px;
  border-radius: 44px;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
`
