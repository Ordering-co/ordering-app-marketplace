import styled, { css } from 'styled-components/native'

export const Container = styled.View`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.white};
`

export const WrapperBackBtn = styled.View`
  background-color: ${(props: any) => props.theme.colors.white};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0,0,0,0.1);
  height: 50px;
`

export const ContentBackBtn = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  width: 100%;
  margin-left: 80px;
`

export const QuickMessageContainer = styled.ScrollView`
  margin-top: 8px;
`

export const MessageTypeItem = styled.View`
  justify-content: center;
  align-items: center;
  padding-horizontal: 5px;
  padding-bottom: 5px;
  padding-top: 5px;
  margin-right: 5px;
  border-radius: 7.6px;
  overflow: hidden;

  ${({ active }: any) => active && css`
    background-color: ${(props: any) => props.theme.colors.whiteGray};
  `}
`
