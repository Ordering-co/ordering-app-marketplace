import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { UDContainer, UDHeader, UDInfo, EditBtn } from './styles';
import {
  UserFormDetails as UserFormController,
  useLanguage,
  useSession,
  ToastType,
  useToast
} from '@components';

import {
  OIcon,
  OText,
  OModal,
  VerifyPhone,
  UserFormDetailsUI
} from '@ui';

const UserDetailsUI = (props: any) => {
  const {
    isEdit,
    formState,
    cleanFormState,
    requiredFields,
    onClose,
    cartStatus,
    toggleIsEdit,
    validationFields,
    isUserDetailsEdit,
    phoneUpdate,
    togglePhoneUpdate,
    isCheckout,
    handleSendVerifyCode,
    verifyPhoneState,
    setFormState,
    setIsOpen,
    isCheckoutPlace
  } = props

  const theme = useTheme();

  const [, t] = useLanguage()
  const [{ user }] = useSession()
  const [, { showToast }] = useToast();

  const userData = props.userData || (!formState.result.error && formState.result?.result) || user

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false)
  const [willVerifyOtpState, setWillVerifyOtpState] = useState(false);
  const [checkPhoneCodeState, setCheckPhoneCodeState] = useState({ loading: false, result: { error: false } })
  const [phoneInputData, setPhoneInputData] = useState({
    error: '',
    phone: {
      country_phone_code: null,
      cellphone: null,
    },
  });

  useEffect(() => {
    if (isUserDetailsEdit) {
      !isEdit && toggleIsEdit()
    }
  }, [isUserDetailsEdit])

  const toggleEditState = () => {
    toggleIsEdit()
    cleanFormState({ changes: {} })
  }

  useEffect(() => {
    if (isSubmit && !isEdit && requiredFields) {
      onClose && onClose()
    }
  }, [isSubmit, requiredFields, isEdit])

  useEffect(() => {
    if (user?.cellphone && !user?.country_phone_code) {
      togglePhoneUpdate(true)
    } else {
      togglePhoneUpdate(false)
    }
  }, [user?.country_phone_code])

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

  return (
    <>
      {(validationFields.loading || formState.loading) && (
        <Placeholder Animation={Fade}>
          <PlaceholderLine height={20} width={70} />
          <PlaceholderLine height={15} width={60} />
          <PlaceholderLine height={15} width={60} />
          <PlaceholderLine height={15} width={80} style={{ marginBottom: 20 }} />
        </Placeholder>
      )}

      {!(validationFields.loading || formState.loading) && (
        <UDContainer>
          {props.mawejaCheckout ? (
            <View style={{ marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcon name="account" size={18} color={theme.colors.primary} />
                <OText size={16} weight="bold" color={theme.colors.black} style={{ flex: 1, marginLeft: 8 }}>
                  {t('RECIPIENT', 'Recipient')}
                </OText>
                {cartStatus !== 2 && cartStatus !== 'payment_incomplete' && !isCheckoutPlace && (
                  <TouchableOpacity
                    onPress={() => isEdit ? toggleEditState() : toggleIsEdit()}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityRole="button"
                  >
                    <OText size={14} color={theme.colors.primary} style={{ fontWeight: '700' }}>
                      {isEdit ? t('CLOSE', 'Close') : t('EDIT', 'Edit')}
                    </OText>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : (
          <UDHeader>
            {props.HeaderTitle ?? (
              <OText size={16} lineHeight={24} weight={'500'} color={theme.colors.textNormal}>
                {t('CUSTOMER_DETAILS', 'Customer Details')}
              </OText>
            )}
            {cartStatus !== 2 && cartStatus !== 'payment_incomplete' && !isCheckoutPlace && (
              <EditBtn onPress={() => isEdit ? toggleEditState() : toggleIsEdit()} activeOpacity={0.7}>
                <MaterialCommunityIcon
                  name={isEdit ? 'close' : 'pencil-outline'}
                  size={24}
                  color={theme.colors.textSecondary}
                />
              </EditBtn>
            )}
          </UDHeader>
          )}

          {!isEdit ? (
            <UDInfo>
              {props.mawejaCheckout ? (
                <>
                  {[userData?.name, userData?.middle_name, userData?.lastname, userData?.second_lastname].filter(Boolean).join(' ') ? (
                    <OText size={15} weight="bold" color={theme.colors.black}>
                      {[userData?.name, userData?.middle_name, userData?.lastname, userData?.second_lastname].filter(Boolean).join(' ')}
                    </OText>
                  ) : null}
                  {!!(userData?.guest_id ? userData?.guest_email : userData?.email) && (
                    <OText size={14} color={theme.colors.textSecondary} style={{ marginTop: 4 }}>
                      {userData?.guest_id ? userData?.guest_email : userData?.email}
                    </OText>
                  )}
                </>
              ) : (
                <>
              <OText size={12} lineHeight={18} weight={'400'}>
                {userData?.name} {userData?.middle_name} {userData?.lastname} {userData?.second_lastname}
              </OText>
              <OText size={12} lineHeight={18} weight={'400'}>
                {userData?.guest_id ? userData?.guest_email : userData?.email}
              </OText>
                </>
              )}
              {!!((userData?.cellphone ?? userData?.guest_cellphone) || (user?.cellphone ?? user?.guest_cellphone)) && (
                <>
                  <OText size={props.mawejaCheckout ? 14 : 12} lineHeight={18} weight={'400'} color={props.mawejaCheckout ? theme.colors.textSecondary : undefined} style={props.mawejaCheckout ? { marginTop: 4 } : undefined}>
                    {(userData?.country_phone_code) && `+${(userData?.country_phone_code)} `}{(userData?.guest_id ? user?.guest_cellphone : userData?.cellphone)}
                  </OText>
                  {!!phoneUpdate && (
                    <OText color={theme.colors.error} style={{ textAlign: 'center' }}>{t('NECESSARY_UPDATE_COUNTRY_PHONE_CODE', 'It is necessary to update your phone number')}</OText>
                  )}
                </>
              )}
            </UDInfo>
          ) : (
            <UserFormDetailsUI
              {...props}
              phoneUpdate={phoneUpdate}
              togglePhoneUpdate={togglePhoneUpdate}
              isCheckout={isCheckout}
              setWillVerifyOtpState={setWillVerifyOtpState}
              setIsSubmit={setIsSubmit}
              setIsOpen={setIsOpen}
            />
          )}
        </UDContainer>
      )}
      <OModal
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      >
        <VerifyPhone
          phone={phoneInputData.phone}
          verifyPhoneState={verifyPhoneState}
          checkPhoneCodeState={checkPhoneCodeState}
          handleCheckPhoneCode={handleSendPhoneCode}
          handleVerifyCodeClick={handleVerifyCodeClick}
          onClose={() => setIsModalVisible(false)}
        />
      </OModal>
      <Spinner visible={verifyPhoneState?.loading} />
    </>
  )
}

export const UserDetails = (props: any) => {
  const userDetailsProps = {
    ...props,
    UIComponent: UserDetailsUI
  }

  return <UserFormController {...userDetailsProps} />
}
