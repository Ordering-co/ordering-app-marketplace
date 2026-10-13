import styled from 'styled-components/native';

export const CardContainer = styled.View`
  border-radius: 12px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
  background-color: ${(props: any) => props.theme.colors.backgroundCard || props.theme.colors.white};
  padding: 12px;
  margin-bottom: 20px;
  margin-top: 20px;
`;

export const TopRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

export const LogoContainer = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin-right: 12px;
`;

export const InfoContainer = styled.View`
  flex: 1;
`;

export const GoToOrdersButton = styled.View`
  background-color: #e8e8e8;
  padding: 12px 16px;
  border-radius: 20px;
`;

export const ProgressBarTrack = styled.View`
  height: 10px;
  width: 100%;
  border-radius: 5px;
  margin-bottom: 8px;
  background-color: ${(props: any) => props.theme.colors.activeContrast};
`;

export const ProgressBarFill = styled.View`
  height: 10px;
  background-color: ${(props: any) => props.theme.colors.active};
  border-radius: 5px;
`;

export const BottomRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Divider = styled.View`
  margin-bottom: 4px;
`
export const OrderProgressWrapper = styled.View`
  margin-bottom: 20px;
`
