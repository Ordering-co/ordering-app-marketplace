import styled from 'styled-components/native';
import { OText } from '@ui';

export const BackgroundImage = styled.ImageBackground`
  flex: 1;
  justify-content: center;
`;

export const SafeContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding-top: ${({ pt }: any) => pt}px;
  padding-bottom: ${({ pb }: any) => pb}px;
  padding-horizontal: ${({ theme }: any) => theme.utils.margins.horizontal}px;
`;

export const TopContent = styled.View`
  width: 100%;
  align-items: center;
`;

export const Title = styled(OText)`
  margin-top: ${({ marginTop }: any) => marginTop}px;
  text-align: center;
  width: 100%;
`;

export const WrapperBtn = styled.View`
  width: 100%;
  margin-bottom: 20px;
`;
