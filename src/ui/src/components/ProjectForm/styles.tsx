import styled from 'styled-components/native'

export const Container = styled.View`
  width: 100%;
  flex: 1;
  height: ${(props: any) =>
    props?.orientation === 'Portrait' && props?.height
      ? `${props.height}px`
      : 'auto'};
`;

export const FormInput = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 50px;
  flex: 1;
  padding: 20px;
`;
