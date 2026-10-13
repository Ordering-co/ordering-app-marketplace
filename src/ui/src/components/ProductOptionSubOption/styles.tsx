import styled, { css } from 'styled-components/native'

export const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const IconControl = styled.TouchableOpacity`
  flex-direction: row;
  padding: 10px 0;
  width: 100%;
  align-items: center;
`

export const LeftContent = styled.View`
  flex-direction: column;
  justify-content: flex-start;
  width: 60%;
`

export const QuantityControl = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 62px;
`

export const PositionControl = styled.View`
  flex-direction: row;
  align-items: center;
`

export const Checkbox = styled.TouchableOpacity`
`

export const Circle = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
  background-color: ${({ theme, active }: any) => active ? theme.colors.activeContrast : theme.colors.backgroundGray100};
  ${({ idx }: any) => idx === 0 && css`
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
  `}
  ${({ idx }: any) => idx === 2 && css`
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
  `}
`

export const Logo = styled.View`
  height: 35px;
  width: 35px;
  border-radius: 10px;
  margin-right: 10px;
`;

export const WrapperOptionName = styled.View`
  flex-direction: column;
  justify-content: center;
`
