import React from 'react';
import {
  ActivityIndicator,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import styled, { css, useTheme } from 'styled-components/native';

interface Props {
  testID?: string;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  style?: ViewStyle | ViewStyle[];
  parentStyle?: ViewStyle;
  textStyle?: TextStyle;
  activeOpacity?: number;
  text?: string;
  class?: 'primary' | 'secondary' | 'third' | 'fourth' | 'active' | 'mandatory' | 'alert';
}

const buttonRadius = (props: any) => {
  const radius = props.style?.borderRadius
  return typeof radius === 'number' ? `${radius}px` : '30px'
}

const StyledButton = styled.View<Props>`
  border-radius: ${buttonRadius};
  border-width: 2px;
  min-height: 60px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  position: relative;

  ${(props: any) => {
    switch (props.class) {
      case 'primary':
        return css`
          background-color: ${props.theme.colors.black};
          border-color: ${props.theme.colors.black};
        `;
      case 'secondary':
        return css`
          background-color: ${props.theme.colors.white};
          border-color: ${props.theme.colors.black};
        `;
      case 'third':
        return css`
          background-color: transparent;
          border-color: ${props.theme.colors.white};
        `;
      case 'fourth':
        return css`
          background-color: ${props.theme.colors.backgroundGray200};
          border-color: ${props.theme.colors.backgroundGray200};
        `;
      case 'active':
        return css`
          background-color: ${props.theme.colors.activeContrast};
          border-color: ${props.theme.colors.activeContrast};
        `;
      case 'mandatory':
        return css`
          background-color: ${props.theme.colors.dangerContrast};
          border-color: ${props.theme.colors.dangerContrast};
        `;
      case 'alert':
        return css`
          background-color: ${props.theme.colors.alert};
          border-color: ${props.theme.colors.alert};
        `;
      default:
        return css`
          background-color: ${props.theme.colors.primary};
          border-color: ${props.theme.colors.primary};
        `;
    }
  }}
`;

const StyledButtonDisabled = styled(StyledButton)`
  background-color: ${(props: any) => props.theme.colors.alert};
  border-color: ${(props: any) => props.theme.colors.alert};
`;

const StyledText = styled.Text<Props>`
  font-size: 16px;
  margin-left: 10px;
  margin-right: 10px;
  font-weight: 600;
  text-align: center;
  flex-shrink: 1;

  ${(props: any) => {
    switch (props.class) {
      case 'primary':
        return css`
          color: ${props.theme.colors.white};
        `;
      case 'secondary':
        return css`
          color: ${props.theme.colors.black};
        `;
      case 'third':
        return css`
          color: ${props.theme.colors.white};
        `;
      case 'fourth':
        return css`
          color: ${props.theme.colors.black};
        `;
      case 'active':
        return css`
          color: ${props.theme.colors.active};
        `;
      case 'mandatory':
        return css`
          color: ${props.theme.colors.danger};
        `;
      case 'alert':
        return css`
          color: ${props.theme.colors.alertText};
        `;
      default:
        return css`
          color: ${props.theme.colors.white};
        `;
    }
  }}
`;

const StyledTextDisabled = styled(StyledText)`
  color: ${(props: any) => props.theme.colors.disabled};
`;

const OButton = (props: Props): React.ReactElement => {
  const theme = useTheme();

  if (props.disabled) {
    return (
      <View style={props.parentStyle}>
        <StyledButtonDisabled class={props.class} style={{ ...props.style }}>
          <StyledTextDisabled class={props.class} style={{ ...props.textStyle }}>
            {props.text}
          </StyledTextDisabled>
        </StyledButtonDisabled>
      </View>
    );
  }

  if (props.loading) {
    return (
      <StyledButton class={props.class} style={props.style}>
        <ActivityIndicator size="small" color={theme.colors[props.class === 'primary' ? 'white' : 'black']} />
        {props.text ? (
          <StyledText class={props.class} style={{ ...props.textStyle }}>
            {props.text}
          </StyledText>
        ) : null}
      </StyledButton>
    );
  }

  return (
    <TouchableOpacity
      testID={props.testID}
      activeOpacity={props.activeOpacity}
      style={props.parentStyle}
      disabled={props.disabled}
      onPress={props.onClick}
    >
      <StyledButton
        class={props.class}
        style={props.style}
      >
        {props.text ? (
          <StyledText
            class={props.class}
            style={{
              ...props.textStyle
            }}>
            {props.text}
          </StyledText>
        ) : null}
      </StyledButton>
    </TouchableOpacity>
  );
}

OButton.defaultProps = {
  loading: false,
  disabled: false,
  activeOpacity: 0.5,
  class: 'primary',
};

export default OButton;
