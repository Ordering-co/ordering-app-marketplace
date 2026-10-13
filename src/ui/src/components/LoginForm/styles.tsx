import styled, { css } from 'styled-components/native';

export const Container = styled.ScrollView`
  padding-top: 20px;
  padding-horizontal: ${(props: any) => props.theme.utils.margins.horizontal}px;
`

export const FormSide = styled.View`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  margin: auto;
`;

export const OTabs = styled.ScrollView`
  width: 100%;
  flex-direction: row;
`;

export const OTab = styled.View`
  margin-right: 10px;
  padding: 10px 15px;
  border-radius: 30px;
`;

export const TabBtn = styled.TouchableOpacity`
  /* height: 30px; */
`;

export const LoginWith = styled.View`
  width: 100%;
  align-items: flex-start;
`;

export const FormInput = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px 0px 15px;
`

export const ButtonsWrapper = styled.View`
  margin: 10px 0px 0px;
  width: 100%;
  display: flex;
  flex-direction: column;

  ${(props: any) => props.mBottom && css`
    margin-bottom: ${props.mBottom}px;
  `}
`

export const SocialButtons = styled.View`
  width: 100%;
  margin: 0px auto 20px;
`

export const OrSeparator = styled.View`
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

export const LineSeparator = styled.View`
  width: 40%;
  height: 1px;
  background-color: ${(props: any) => props.theme.colors.disabled};
`

export const SkeletonWrapper = styled.View`
  width: 90%;
`
export const RecaptchaButton = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`

export const ContainerFloatBtns = styled.View`
  padding: 10px 0;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  background-color: ${(props: any) => props.theme.colors.white};
`
