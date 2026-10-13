import styled, { css } from 'styled-components/native'

export const ProductContainer = styled.View`
  margin-bottom: 15px;
`

export const ProductHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  margin-left: -15px;
`

export const LikeHandsActionContainer = styled.View`
  flex-direction: row;
`

export const LogoWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

`

export const LikeHandsButton = styled.TouchableOpacity`
  width: 54px;
  height: 54px;
  align-items: center;
  justify-content: center;
  ${(props: any) => props.isLike && css`
    margin-horizontal: 15px;
  `}
  shadow-color: rgba(0, 0, 0, 0.2);
  shadow-offset: 0px 1px;
  shadow-opacity: 1;
  shadow-radius: 4px;
  elevation: 4;
  border-radius: 8px;
  overflow: hidden;
`

export const CommentsButtonGroup = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`

export const LogoContainer = styled.View`
  shadow-radius: 3px;
  shadow-offset: 1px 4px;
  elevation: 3;
  border-radius: 8px;
  shadow-opacity: 0.1;
  overflow: hidden;
  width: 44px;
`
