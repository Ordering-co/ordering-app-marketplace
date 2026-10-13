import styled, { css } from 'styled-components/native'

export const Container = styled.View`
  display: flex;
  flex-direction: row;
  position: relative;
  padding-horizontal: 20px;
  padding-bottom: 10px;
  margin-bottom: 20px;
  ${({ isLast }: { isLast: boolean }) => isLast ? css`
    border-bottom-width: 0px;
  ` : css`
    border-bottom-color: ${({ theme }: { theme: any }) => theme.colors.border};
    border-bottom-width: 1px;
  `}
`

export const DateBlock = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const MessageBlock = styled.View`
  display: flex;
  font-size: 14px;
`

export const Dot = styled.View`
  position: absolute;
  top: ${(props: any) => props.isTop ? 0 : 6}px;
  left: -4px;
  width: 6px;
  height: 6px;
  border-radius: 50px;
  background-color: ${(props: any) => props.theme.colors.disabled};
`

export const DescriptionBlock = styled(MessageBlock)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

export const IconWrapper = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 55px;
  height: 55px;
  border-radius: 10px;
  background-color: ${({ theme }: { theme: any }) => theme.colors.backgroundGray100};
  margin-right: 10px;
`
