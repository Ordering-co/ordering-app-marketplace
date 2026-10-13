import React, { useEffect, useState } from 'react'
import { Modal, TouchableWithoutFeedback, StyleSheet, View, Text, StatusBar, Pressable, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import { ModalCloseButton } from './styles'
import { useTheme } from 'styled-components/native';

interface Props {
  open: boolean;
  transparent?: boolean;
  title?: string;
  children?: any;
  onClose?: any;
  isStatusBar?: boolean;
  bottomContainerStyle?: any;
  containerStyle?: any;
  titleStyle?: any;
  closeIcon?: boolean;
  presentationStyle?: "fullScreen" | "pageSheet" | "formSheet" | "overFullScreen" | undefined;
  showHandleBar?: boolean;
  animationType?: "slide" | "fade" | "none";
  childenOutsideContainer?: boolean; //
}
const OBottomPopup = (props: Props) => {
  const {
    open,
    transparent,
    title,
    onClose,
    children,
    isStatusBar,
    titleStyle,
    bottomContainerStyle,
    closeIcon,
    presentationStyle,
    showHandleBar,
    animationType,
    childenOutsideContainer
  } = props

  const insets = useSafeAreaInsets()
  const theme = useTheme();

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        if (Platform.OS === 'android') {
          setIsKeyboardVisible(true);
        }
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Modal
      animationType={animationType || 'fade'}
      transparent={transparent}
      visible={open}
      onRequestClose={() => onClose()}
      presentationStyle={presentationStyle || 'fullScreen'}
    >
      {isStatusBar && <StatusBar translucent={false} />}
      <View style={styles.container}>
        {showHandleBar && (
          <Pressable
            style={{
              position: 'absolute',
              bottom: 5,
              zIndex: 100,
              width: '100%',
              height: 20
            }}
            onPress={() => onClose()}>
            <View style={{
              backgroundColor: theme.colors.border,
              height: 5,
              width: 50,
              alignSelf: 'center',
            }} />
          </Pressable>
        )}
        <TouchableWithoutFeedback
          style={styles.touchableOutsideStyle}
          onPress={() => onClose()}
        >
          <View style={styles.touchableOutsideStyle} />
        </TouchableWithoutFeedback>
        <View style={{ ...styles.bottomContainer, ...bottomContainerStyle }}>
          <View style={{ paddingBottom: insets.bottom }}>
            <View style={styles.modalTitleStyle}>
              {!!title && (
                <Text style={{ ...styles.titleStyle, ...titleStyle }}>
                  {title}
                </Text>
              )}
              {closeIcon && (
                <ModalCloseButton onPress={onClose}>
                  <AntDesignIcon name='close' size={26} color={'#000'} />
                </ModalCloseButton>
              )}
            </View>
            {!childenOutsideContainer && children}
          </View>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={30}
      >
        {childenOutsideContainer && children}
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000AA',
    justifyContent: 'flex-end'
  },
  touchableOutsideStyle: {
    flex: 1,
    width: '100%'
  },
  bottomContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#ffffff',
    width: '100%',
    paddingHorizontal: 0,
  },
  titleStyle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  closeIconStyle: {
    position: 'absolute',
    left: 25,
    top: 25,
    zIndex: 100
  },
  modalTitleStyle: {
    position: 'relative',
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

export default OBottomPopup
