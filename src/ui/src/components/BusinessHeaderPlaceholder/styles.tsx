import styled from 'styled-components/native'

export const PlaceholderContainer = styled.View`
  width: 100%;
  border-radius: ${(props: any) => props.radius ?? 30}px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: ${(props: any) => props.theme.colors.businessHeaderPlaceholder};
`

export const LogoWrapper = styled.View`
  align-items: center;
  justify-content: center;
`
