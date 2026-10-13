import styled from 'styled-components/native';

export const FormSide = styled.View`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  margin: auto;
  padding-horizontal: ${(props: any) => props.theme.utils.margins.horizontal}px;
`;
export const FormInput = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px 0px 0px;
`
export const ButtonsSection = styled.View`
  margin: 10px 0px 0px;
  width: 100%;
  display: flex;
  flex-direction: column;
`

export const SocialButtons = styled.View`
   width: 100%;
   margin-top: 10px;
   padding-bottom: 50px;
`

export const ContainerFloatBtns = styled.View`
  padding: 10px ${(props: any) => props.theme.utils.margins.horizontal}px;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  background-color: ${(props: any) => props.theme.colors.white};
`
