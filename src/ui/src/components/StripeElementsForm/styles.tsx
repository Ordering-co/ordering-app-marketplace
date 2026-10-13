import styled, { css } from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
  justify-content: space-between;
`

export const ErrorMessage = styled.View`
  color: ${(props: any) => props.theme.colors.cancelColor};
  font-size: 24px;
  padding-left: 10px;
  font-weight: bold;
  opacity: 0.8;
`;
