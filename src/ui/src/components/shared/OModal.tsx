import * as React from 'react';
import { Modal } from "react-native";
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { useTheme } from 'styled-components/native'

import { CenteredView, ModalCloseButton, ModalTitle } from './styles';
import { OText, SafeAreaViewWrapper, Toast } from '@ui'

interface Props {
  open?: boolean;
  title?: string;
  subtitle?: string;
  children?: any;
  onClose?: any;
  style?: any;
  isTransparent?: boolean;
  titleSectionStyle?: any;
  isAvoidKeyBoardView?: boolean;
  styleContainerCloseButton?: any;
  showToastInsideModal?: boolean;
}

const OModal = (props: Props): React.ReactElement => {
  const theme = useTheme()
  const {
    open,
    title,
    subtitle,
    children,
    onClose,
    isTransparent,
    showToastInsideModal
  } = props

  return (
    <Modal
      animationType="slide"
      transparent={isTransparent}
      visible={open}
      onRequestClose={() => onClose && onClose()}
    >
      {showToastInsideModal && (
        <Toast />
      )}
      <SafeAreaViewWrapper pt disableScrollView>
        <CenteredView>
          <ModalTitle>
            <OText size={20} weight='bold' numberOfLines={1} ellipsizeMode='tail'>{title || ''}</OText>
            {subtitle && <OText size={14}>{subtitle}</OText>}
          </ModalTitle>
          <ModalCloseButton onPress={onClose}>
            <AntDesignIcon name='close' size={26} color={theme.colors.textNormal} />
          </ModalCloseButton>
        </CenteredView>
        {children}
      </SafeAreaViewWrapper>
    </Modal>
  );
};

export default OModal;
