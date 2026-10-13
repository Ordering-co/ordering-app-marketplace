import { Platform } from 'react-native';
import styled from 'styled-components/native';

const androidBorderColor = 'rgba(0, 0, 0, 0.1)';
export const ModalCloseButton = styled.TouchableOpacity`
  height: 30px;
  width: 30px;
  border-radius: 10px;
  background-color: ${(props: any) => props.theme.colors.white};
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 20px;

  /* iOS Shadow */
  ${Platform.OS === 'ios' ? `
    shadow-color: #000;
    shadow-offset: 0px 2px; /* x, y */
    shadow-opacity: 0.15;
    shadow-radius: 4px;
  ` : ''}

  /* Android Shadow */
  ${Platform.OS === 'android' && `
    borderWidth: 1px;
    borderColor: ${androidBorderColor};
  `}
`;

export const CenteredView = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  min-height: 30px;
  padding-left: 20px;
  margin-top: 20px;
`;

export const ModalTitle = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 85%;
`;
