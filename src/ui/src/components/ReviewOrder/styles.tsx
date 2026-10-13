import styled, { css } from 'styled-components/native'

export const ReviewOrderContainer = styled.ScrollView`
  padding: 20px;
  margin-bottom: 100px;
`

export const BusinessLogo = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;
`

export const FormReviews = styled.View`
  flex: 1;
  height: 100%;
  margin-top: 30px;
`

export const CommentsButtonGroup = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`

export const ActionContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 3px 30px;
  flex: 1;
`

export const SkipButton = styled.TouchableOpacity`
`

export const RatingBarContainer = styled.View`
  margin-top: 10px;
  margin-bottom: 25px;
`

export const RatingTextContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`

export const MultiLogosContainer = styled.View`
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  width: 100%;
`

export const Content = styled.ScrollView`
  background-color: ${(props: any) => props.theme.colors.white};
  margin-bottom: 30px;
`;

export const ActionButtonWrapper = styled.View`
  justify-content: center;
  align-items: center;
  margin-horizontal: 20px;
  margin-bottom: 40px;
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
