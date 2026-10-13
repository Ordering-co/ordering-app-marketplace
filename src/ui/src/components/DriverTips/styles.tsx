import styled, { css } from 'styled-components/native'

export const DTContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 100%;
`

export const DTWrapperTips = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
`

export const DTCard = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: capitalize;
  border-radius: 12px;
  padding: 10px 16px;
  min-width: 64px;
  border-width: ${(props: any) => props.isActive ? 2 : 1}px;
  border-color: ${(props: any) => props.isActive ? props.theme.colors.active : props.theme.colors.border};

  ${(props: any) => props.isActive && css`
    background-color: ${(props: any) => props.theme.colors.activeContrast};
  `}
`

export const DTForm = styled.View`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const DTLabel = styled.Text`
  font-size: 14px;
  align-self: flex-start;
  color: ${(props: any) => props.theme.colors.textSecondary};
  margin-top: 10px;

  ${(props: any) => props.theme?.rtl && css`
    margin-left: 20px;
    margin-right: 0;
  `}
`

export const DTWrapperInput = styled.View`
  gap: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-top: 16px;
`

export const DTCardLoader = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
`
