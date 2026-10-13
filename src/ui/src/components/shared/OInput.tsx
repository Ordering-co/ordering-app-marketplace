import * as React from 'react';
import { ImageSourcePropType, ImageStyle, ViewStyle, TextInputProps, TextStyle, Platform } from 'react-native';
import styled from 'styled-components/native';
import OIcon from './OIcon';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { useTheme, css } from 'styled-components/native';

const androidBorderColor = 'rgba(0, 0, 0, 0.1)';

interface Props extends TextInputProps {
  borderColor?: string;
  isRequired?: boolean;
  requiredMsg?: string;
  isDisabled?: boolean;
  isSecured?: boolean;
  style?: ViewStyle;
  placeholder?: string;
  icon?: ImageSourcePropType | string;
  iconRight?: ImageSourcePropType;
  iconColor?: string;
  iconRightColor?: string;
  iconStyle?: ImageStyle;
  iconRightStyle?: ImageStyle;
  iconCustomRight?: any;
  value?: string;
  onChange?: any;
  name?: string;
  type?: string;
  multiline?: boolean;
  vertorIcon?: string;
  vectorIconColor?: string;
  forwardRef?: any;
  inputStyle?: TextStyle;
  wrapperRef?: any;
  onPress?: any;
  isFocusHighlight?: boolean
  autoCompleteType?: string,
  isValueSync?: boolean,
  isLazyLoad?: boolean,
  customIcon?: any
}

const Wrapper = styled.Pressable`
  flex-direction: row;
  align-items: center;
  border-radius: 15px;
  background-color: ${(props: any) => props.theme.colors.white};
  padding-horizontal: 20px;
  padding-vertical: 5px;
  margin-bottom: 20px;
  width: 100%;
  height: 55px;

  /* iOS Shadow */
  ${Platform.OS === 'ios' ? `
    shadow-color: #000;
    shadow-offset: 0px 2px; /* x, y */
    shadow-opacity: 0.15;
    shadow-radius: 4px;
  ` : ''}

  /* Android Shadow */
  ${Platform.OS === 'android' ? `
    border-width: 1px;
    border-color: ${androidBorderColor};
  ` : ''}

  ${(props: any) => props.isFocused && css`
    border-width: 1px;
    border-color: ${props.theme.colors.primary};
  `}

  ${(props: any) => props.borderColor && css`
    border-width: 1px;
    border-color: ${props.borderColor};
  `}
`;

const Input = styled.TextInput`
  flex: 1;
  color: ${(props: any) => props.theme.colors.black};
  font-size: 16px;
  height: 55px;
  padding-vertical: 10px;
`;

const OInput = (props: Props): React.ReactElement => {
  const theme = useTheme();
  const [inputFocused, setInputFocused] = React.useState(false)

  const onFocus = (e: any) => {
    props.onFocus && props.onFocus(e)
    setInputFocused(true)
  }

  const onBlur = (e: any) => {
    props.onBlur && props.onBlur(e)
    setInputFocused(false)
  }

  let timeout: null | any = null
  const onChange = (e: any) => {
    if (!props.isLazyLoad) {
      props.onChange(e)
    } else {
      clearTimeout(timeout)
      timeout = setTimeout(function () {
        props.onChange(e)
      }, 750)
    }
  }

  return (
    <Wrapper
      isFocused={inputFocused}
      borderColor={props.borderColor}
      onPress={() => {
        props.forwardRef?.current?.focus?.();
        props.onPress && props.onPress()
      }}
      style={props.style}
    >
      {props.icon ? (
        <OIcon
          src={props.icon}
          color={props.iconColor === 'none' ? undefined : props.iconColor}
          width={16}
          height={20}
          style={{ marginRight: 10, ...props.iconStyle }}
        />
      ) : null}
      {props.customIcon && <props.customIcon />}
      {props.vertorIcon && (
        <MaterialIcon name={props?.vertorIcon} size={20} color={props?.vectorIconColor} style={{ marginHorizontal: 10 }} />
      )}
      <Input
        autoFocus={props?.autoFocus}
        name={props.name}
        secureTextEntry={props.isSecured}
        onChangeText={(txt: any) => props.name ? onChange({ target: { name: props.name, value: txt } }) : onChange(txt)}
        defaultValue={props.value}
        placeholder={props.placeholder ? props.placeholder : ''}
        keyboardType={props.type || 'default'}
        multiline={props.multiline}
        scrollEnabled={props.multiline}
        editable={!props.isDisabled}
        autoCapitalize={props.autoCapitalize}
        autoCompleteType={props.autoCompleteType}
        autoCorrect={props.autoCorrect}
        returnKeyType={props.returnKeyType}
        onSubmitEditing={props.onSubmitEditing}
        clearButtonMode={props.clearButtonMode ?? 'never'}
        blurOnSubmit={props.blurOnSubmit}
        maxLength={props.maxLength}
        placeholderTextColor={theme.colors.backgroundGray300}
        ref={(e: any) => {
          props.forwardRef && (typeof props.forwardRef === 'function' ? props.forwardRef(e) : props.forwardRef.current = e)
        }}
        style={{
          color: theme?.colors?.textNormal,
          ...(theme?.general?.components?.inputs?.color && {
            color: theme?.general?.components?.inputs?.color
          }),
          ...props?.inputStyle
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        value={props.isValueSync && props.value}
      />
      {props.iconRight && (
        <OIcon
          src={props.iconRight}
          color={props.iconRightColor}
          width={16}
          height={16}
          style={{ ...props.iconRightStyle }}
        />
      )}
      {props.iconCustomRight}
    </Wrapper>
  );
};

OInput.defaultProps = {
  iconColor: '#959595',
  isFocusHighlight: false
};

export default OInput;
