import styled from 'styled-components/native'

export const MessageListingWrapper = styled.View`
  position: relative;
  margin-top: 20px;
  padding-horizontal: ${(props: any) => props.theme.utils.margins.horizontal}px;
`

export const MessageContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  width: 100%;
  height: 100%;
`


