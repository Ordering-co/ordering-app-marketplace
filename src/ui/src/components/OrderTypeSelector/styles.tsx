import styled from 'styled-components/native'

export const GridContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding-horizontal: ${(props: any) => props.theme.utils.margins.horizontal}px;
  padding-top: 20px;
`;

export const TypeCard = styled.TouchableOpacity`
  width: ${(props: any) => props.cardWidth}px;
  aspect-ratio: 1;
  background-color: ${(props: any) => props.theme.colors.white};
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
  border-width: 2px;
  border-color: ${(props: any) => props.isSelected ? props.theme.colors.active : props.theme.colors.border};
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin-bottom: ${(props: any) => props.marginBottomValue}px;
  margin-right: ${(props: any) => props.marginRightValue}px;

  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
  elevation: 2;
`;

export const TypeIconWrapper = styled.View`
  margin-bottom: 8px;
`;
