import styled from 'styled-components/native'

export const PageBannerWrapper = styled.View`
  align-self: stretch;
  overflow: hidden;
  position: relative;
  flex-direction: row;
  align-items: center;
  margin: 10px ${(props: any) => props.$flush ? 0 : 20}px 20px;
`
