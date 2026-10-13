import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import Icon2 from 'react-native-vector-icons/FontAwesome5'
import { useTheme } from 'styled-components/native';
import { useForm } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { ProfileParams } from '../../types';

import { Container, EditIconWrapper, ProfileHeader, ProfileImage, ProfilePictureContainer } from './styles';

import {
  UserFormDetails as UserProfileController,
  useSession,
  useLanguage,
  ToastType,
  useToast
} from '@components';

import {
  UserFormDetailsUI,
  VerifyPhone,
  OModal,
  OText
} from '@ui'

const ProfileUI = (props: ProfileParams) => {
  const {
    formState,
    handleButtonUpdateClick,
    handleSendVerifyCode,
    verifyPhoneState,
    setFormState
  } = props;

  const theme = useTheme();

  const [{ user }] = useSession();
  const [, t] = useLanguage();
  const [, { showToast }] = useToast();
  const { errors } = useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [willVerifyOtpState, setWillVerifyOtpState] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [phoneInputData, setPhoneInputData] = useState({
    error: '',
    phone: {
      country_phone_code: null,
      cellphone: null,
    },
  });

  const handleImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxHeight: 200,
        maxWidth: 200,
        includeBase64: true,
      },
      (response: any) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
          showToast(ToastType.Error, response.errorMessage);
        } else {
          if (response?.assets?.length > 0) {
            const image = response?.assets[0]
            const url = `data:${image.type};base64,${image.base64}`
            handleButtonUpdateClick(null, true, url);
          } else {
            showToast(ToastType.Error, t('IMAGE_NOT_FOUND', 'Image not found'));
          }
        }
      },
    );
  };


  const handleVerifyCodeClick = () => {
    if (formState?.changes?.cellphone && formState?.changes?.country_phone_code) {
      const { cellphone, country_phone_code: countryPhoneCode } = formState?.changes

      setPhoneInputData({
        error: '',
        phone: {
          country_phone_code: countryPhoneCode,
          cellphone: cellphone,
        },
      });
      handleSendVerifyCode({
        cellphone: cellphone,
        country_phone_code: countryPhoneCode
      })
    }
  }

  useEffect(() => {
    if (formState.result.result && !formState.loading) {
      if (formState.result?.error) {
        showToast(ToastType.Error, formState.result.result);
      } else {
        showToast(
          ToastType.Success,
          t('UPDATE_SUCCESSFULLY', 'Update successfully'),
        );
      }
    }
  }, [formState.result]);

  useEffect(() => {
    const errorMessages = Object.values(errors).map((item: any) => `- ${item.message}`).join('\n');
    if (errorMessages) {
      showToast(ToastType.Error, errorMessages);
    }
  }, [errors]);

  useEffect(() => {
    if (willVerifyOtpState) handleVerifyCodeClick()
  }, [willVerifyOtpState])

  useEffect(() => {
    if (verifyPhoneState && !verifyPhoneState?.loading) {
      if (verifyPhoneState.result?.error) {
        const message = typeof verifyPhoneState?.result?.result === 'string'
          ? verifyPhoneState?.result?.result
          : verifyPhoneState?.result?.result[0]
        verifyPhoneState.result?.result && showToast(
          ToastType.Error,
          message
        )
        setWillVerifyOtpState(false)
        return
      }

      const okResult = verifyPhoneState.result?.result === 'OK'
      if (okResult) {
        !isModalVisible && setIsModalVisible(true)
        setWillVerifyOtpState(false)
      }
    }
  }, [verifyPhoneState])

  const handleSendPhoneCode = (values: any) => {
    setWillVerifyOtpState(false)
    setIsModalVisible(false)
    setFormState({
      ...formState,
      changes: {
        ...formState?.changes,
        verification_code: values?.code
      }
    })
  }

  return (
    <>
      <Container>
        <ProfileHeader>
          <OText>{user?.name}{' '}{user?.lastname}</OText>
          <ProfilePictureContainer onPress={() => handleImagePicker()}>
            {user?.photo && (
              <>
                <ProfileImage
                  source={{ uri: user.photo }}
                />
                <EditIconWrapper>
                  <Icon name={'pencil'} size={20} color={theme.colors.white} />
                </EditIconWrapper>
              </>
            )}
            {!user?.photo && (
              <Icon2 name={'user-edit'} size={60} color={theme.colors.black} />
            )}
          </ProfilePictureContainer>
        </ProfileHeader>
        <UserFormDetailsUI
          {...props}
          isProfile
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          setWillVerifyOtpState={setWillVerifyOtpState}
        />
        <Spinner visible={formState?.loading || verifyPhoneState?.loading} />
      </Container>
      <OModal
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      >
        <VerifyPhone
          phone={phoneInputData.phone}
          verifyPhoneState={verifyPhoneState}
          handleCheckPhoneCode={handleSendPhoneCode}
          handleVerifyCodeClick={handleVerifyCodeClick}
          onClose={() => setIsModalVisible(false)}
        />
      </OModal>
    </>

  );
};

export const UserProfileForm = (props: any) => {
  const profileProps = {
    ...props,
    UIComponent: ProfileUI,
  };
  return <UserProfileController {...profileProps} />;
};
