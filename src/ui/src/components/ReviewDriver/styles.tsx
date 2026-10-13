import styled, { css } from 'styled-components/native'

export const ReviewDriverContainer = styled.ScrollView`
  padding: 20px;
  margin-bottom: 100px;
`

export const DriverPhotoContainer = styled.View`
  margin-vertical: 5px;
  flex-direction: column;
  align-items: center;
`

export const FormReviews = styled.View`
  flex: 1;
  height: 100%;
  margin-top: 30px;
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
export const CommentsButtonGroup = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`

export const ActionContainer = styled.View`
  padding: 3px 30px;
`

export const Content = styled.ScrollView`
  background-color: ${(props: any) => props.theme.colors.white};
  margin-bottom: 30px;
`;

export const DriverLogo = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;
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
