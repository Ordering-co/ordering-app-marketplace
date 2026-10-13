import styled from 'styled-components/native';

export const ProgressBar = styled.View`
  height: 4px;
  background: ${(props: any) => props.theme.colors.active};
  z-index: 100;
`

export const Point = styled.View`
  width: 30px;
  height: 30px;
  background: ${(props: any) => props.theme.colors.active};
  border-radius: 50px;
  z-index: 100;
`

export const ProgressContentWrapper = styled.View`
  height: 4px;
  background: #F8F9FA;
  margin-bottom: 20px;
  flex: 1;
`
