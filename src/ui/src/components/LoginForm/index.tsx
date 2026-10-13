import React, { useEffect, useState, useRef } from 'react';
import { View, Keyboard, Modal } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useForm, Controller } from 'react-hook-form';
import { PhoneInputNumber } from '../PhoneInputNumber';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Recaptcha from 'react-native-recaptcha-that-works'
import ReCaptcha from '@fatnlazycat/react-native-recaptcha-v3'
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { useTheme } from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import RNRestart from 'react-native-restart'

import {
  Container,
  ButtonsWrapper,
  FormSide,
  FormInput,
  ContainerFloatBtns,
  RecaptchaButton
} from './styles';

import {
  LoginForm as LoginFormController,
  useLanguage,
  useConfig,
  ToastType,
  useToast,
} from '@components';

import { usePoweredByOrdering } from '../../hooks/usePoweredByOrdering'
import { Tabs } from '../../Forms/Tabs'
import { SocialButtons } from '../../Forms/SocialButtons'
import { LoginParams } from '../../types';
import { Otp } from './Otp'
import {
  VerifyPhone,
  OModal,
  OText,
  OButton,
  OInput,
  Alert
} from '@ui'

const LoginFormUI = (props: LoginParams) => {
  const {
    loginTab,
    formState,
    useLoginByEmail,
    useLoginByCellphone,
    useLoginOtp,
    loginButtonText,
    forgotButtonText,
    verifyPhoneState,
    checkPhoneCodeState,
    registerButtonText,
    setCheckPhoneCodeState,
    handleButtonLoginClick,
    handleSendVerifyCode,
    handleCheckPhoneCode,
    onNavigationRedirect,
    notificationState,
    handleReCaptcha,
    enableReCaptcha,
    otpType,
    setOtpType,
    generateOtpCode,
    useLoginOtpEmail,
    useLoginOtpCellphone,
    useLoginOtpWhatsapp,
    isGuest,
    setCellphoneStartZero,
    projectChanged,
    numOtpInputs,
    handleSuccessLogin,
  } = props;

  const [, { showToast }] = useToast();
  const [, t] = useLanguage();
  const [{ configs }] = useConfig();
  const { control, handleSubmit, errors, reset, register, setValue } = useForm();
  const [passwordSee, setPasswordSee] = useState(false);
  const [isLoadingVerifyModal, setIsLoadingVerifyModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFBLoading, setIsFBLoading] = useState(false);
  const [willVerifyOtpState, setWillVerifyOtpState] = useState(false)
  const [phoneInputData, setPhoneInputData] = useState({
    error: '',
    phone: {
      country_phone_code: null,
      cellphone: null,
    },
  });
  const [recaptchaConfig, setRecaptchaConfig] = useState<any>({})
  const [recaptchaVerified, setRecaptchaVerified] = useState(false)
  const [alertState, setAlertState] = useState({ open: false, title: '', content: [] })
  const [otpError, setOtpError] = useState(null)
  const enabledPoweredByOrdering = usePoweredByOrdering()
  const theme = useTheme();
  const isOtpEmail = loginTab === 'otp' && otpType === 'email'
  const isOtpCellphone = loginTab === 'otp' && otpType === 'cellphone'

  const [isCheckingCode, setCheckingCode] = useState(false)

  const emailRef = useRef<any>({});
  const passwordRef = useRef<any>({});
  const recaptchaRef = useRef<any>({});
  const otpChannelRef = useRef<number>(2);

  const handleChangeTab = (val: string, otpType?: string) => {
    props.handleChangeTab(val);
    setPasswordSee(false);
  };

  const vibrateApp = (impact?: any) => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false
    };
    ReactNativeHapticFeedback.trigger(impact || "impactLight", options);
  }

  const onSubmit = (values?: any) => {
    Keyboard.dismiss();
    if (loginTab === 'otp') {
      if (phoneInputData.error && (loginTab !== 'otp' || (otpType === 'cellphone' && loginTab === 'otp'))) {
        showToast(ToastType.Error, t('INVALID_PHONE_NUMBER', 'Invalid phone number'));
        vibrateApp()
        return
      }
      if (otpType === 'cellphone' && phoneInputData?.error && !phoneInputData?.phone?.cellphone) {
        showToast(ToastType.Error, t('PHONE_NUMBER_REQUIRED', 'Phone number is required'));
        return
      }
      if (loginTab === 'otp') {
        generateOtpCode({
          ...values,
          ...phoneInputData.phone
        }, otpChannelRef.current)
      }
      setWillVerifyOtpState(true)
    } else {
      if (phoneInputData.error) {
        showToast(ToastType.Error, phoneInputData.error);
        vibrateApp()
        return;
      }
      handleButtonLoginClick({
        ...values,
        ...phoneInputData.phone,
      });
    }

  };
  const handleVerifyCodeClick = () => {
    if (phoneInputData.error) {
      showToast(ToastType.Error, phoneInputData.error);
      vibrateApp()
      return;
    }
    if (
      !phoneInputData.error &&
      !phoneInputData.phone.country_phone_code &&
      !phoneInputData.phone.cellphone
    ) {
      showToast(
        ToastType.Error,
        t(
          'VALIDATION_ERROR_MOBILE_PHONE_REQUIRED',
          'The field Mobile phone is required.',
        ),
      );
      vibrateApp()
      return;
    }
    handleSendVerifyCode && handleSendVerifyCode(phoneInputData.phone);
    setIsLoadingVerifyModal(true);
  };

  const handleChangeInputEmail = (value: string, onChange: any) => {
    onChange(value.toLowerCase().trim().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''));
  };

  const handleOpenRecaptcha = () => {
    setRecaptchaVerified(false)
    if (!recaptchaConfig?.siteKey) {
      showToast(ToastType.Error, t('NO_RECAPTCHA_SITE_KEY', 'The config doesn\'t have recaptcha site key'));
      vibrateApp()
      return
    }
    if (!recaptchaConfig?.baseUrl) {
      showToast(ToastType.Error, t('NO_RECAPTCHA_BASE_URL', 'The config doesn\'t have recaptcha base url'));
      vibrateApp()
      return
    }

    recaptchaRef.current.open()
  }

  const onRecaptchaVerify = (token: any) => {
    setRecaptchaVerified(true)
    handleReCaptcha({ code: token, version: recaptchaConfig?.version })
  }

  const handleChangeOtpType = (type: string) => {
    handleChangeTab('otp', type)
    setOtpType(type)
  }

  const handleLoginOtp = async (code: string) => {
    if (!code) return
    const logged = await handleButtonLoginClick({ code })
    setCheckingCode(false)
    if (logged) {
      setWillVerifyOtpState(false)
    } else {
      setOtpError(t('OTP_CODE_INCORRECT', 'Otp code incorrect'))
    }
  }

  const closeAlert = () => {
    setAlertState({
      open: false,
      title: '',
      content: []
    })
  }

  const handleChangePhoneNumber = (number: any, rawNumber: any) => {
    setPhoneInputData(number)
    setCellphoneStartZero && setCellphoneStartZero(rawNumber?.number && rawNumber?.countryCallingCode ? rawNumber?.number : null)
  }

  useEffect(() => {
    if (configs && Object.keys(configs).length > 0 && enableReCaptcha) {
      if (configs?.security_recaptcha_type?.value === 'v3' &&
        configs?.security_recaptcha_score_v3?.value > 0 &&
        configs?.security_recaptcha_site_key_v3?.value
      ) {
        setRecaptchaConfig({
          version: 'v3',
          siteKey: configs?.security_recaptcha_site_key_v3?.value || null,
          baseUrl: configs?.security_recaptcha_base_url?.value || null
        })
        return
      }
      if (configs?.security_recaptcha_site_key?.value) {
        setRecaptchaConfig({
          version: 'v2',
          siteKey: configs?.security_recaptcha_site_key?.value || null,
          baseUrl: configs?.security_recaptcha_base_url?.value || null
        })
      }
    }
  }, [configs, enableReCaptcha])

  useEffect(() => {
    if (!formState.loading && formState.result?.error) {
      if (formState.result?.result?.[0] === 'ERROR_AUTH_VERIFICATION_CODE') {
        setRecaptchaVerified(false)
        setRecaptchaConfig({
          version: 'v2',
          siteKey: configs?.security_recaptcha_site_key?.value || null,
          baseUrl: configs?.security_recaptcha_base_url?.value || null
        })
        showToast(ToastType.Info, t('TRY_AGAIN', 'Please try again'))
        vibrateApp()
        return
      }
      formState.result?.result &&
        showToast(
          ToastType.Error,
          typeof formState.result?.result === 'string'
            ? formState.result?.result
            : formState.result?.result[0],
        );
      formState.result?.result && vibrateApp()
    }
  }, [formState]);

  useEffect(() => {
    if (verifyPhoneState && !verifyPhoneState?.loading) {
      if (verifyPhoneState.result?.error) {
        const message =
          typeof verifyPhoneState?.result?.result === 'string'
            ? verifyPhoneState?.result?.result
            : verifyPhoneState?.result?.result[0];
        verifyPhoneState.result?.result && showToast(ToastType.Error, message);
        verifyPhoneState.result?.result && vibrateApp();
        setIsLoadingVerifyModal(false);
        return;
      }

      const okResult = verifyPhoneState.result?.result === 'OK';
      if (okResult) {
        !isModalVisible && setIsModalVisible(true);
        setIsLoadingVerifyModal(false);
      }
    }
  }, [verifyPhoneState]);

  useEffect(() => {
    if (phoneInputData?.phone?.cellphone) setValue('cellphone', phoneInputData?.phone?.cellphone)
    else setValue('cellphone', '')
  }, [phoneInputData?.phone?.cellphone])

  useEffect(() => {
    register('cellphone', {
      required: loginTab === 'cellphone'
        ? t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Mobile phone is required').replace('_attribute_', t('CELLPHONE', 'Cellphone'))
        : null
    })
  }, [register])

  useEffect(() => {
    reset()
  }, [loginTab])

  useEffect(() => {
    if (checkPhoneCodeState?.result?.error) {
      setAlertState({
        open: true,
        content: t(checkPhoneCodeState?.result?.error, checkPhoneCodeState?.result?.error),
        title: ''
      })
    }
  }, [checkPhoneCodeState])

  useEffect(() => {
    if (!!Object.values(errors)?.length) vibrateApp()
  }, [errors])

  return (
    <>
      <Container>
        <FormSide>
          {(useLoginByEmail ||
            useLoginByCellphone ||
            useLoginOtpEmail ||
            useLoginOtpCellphone) &&
            (
              <Tabs
                defaultTab={loginTab}
                isOtpEmail={isOtpEmail}
                isOtpCellphone={isOtpCellphone}
                useLoginByEmail={useLoginByEmail}
                useLoginByCellphone={useLoginByCellphone}
                useOtpEmail={useLoginOtpEmail}
                useOtpCellphone={useLoginOtpCellphone}
                handleChangeTab={handleChangeTab}
                handleChangeOtpType={handleChangeOtpType}
              />
            )}

          {(useLoginByCellphone || useLoginByEmail || useLoginOtp) && (
            <FormInput>
              {((useLoginByEmail && loginTab === 'email') || (loginTab === 'otp' && otpType === 'email')) && (
                <>
                  {errors?.email && (
                    <OText
                      size={14}
                      color={theme.colors.danger}
                      weight={'normal'}
                    >
                      {errors?.email?.message}{errors?.email?.type === 'required' && '*'}
                    </OText>
                  )}
                  <Controller
                    control={control}
                    render={({ onChange, value }: any) => (
                      <OInput
                        placeholder={t('EMAIL', 'Email')}
                        value={value}
                        autoCapitalize="none"
                        autoCorrect={false}
                        type="email-address"
                        autoCompleteType="email"
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current?.focus()}
                        blurOnSubmit={false}
                        forwardRef={emailRef}
                        borderColor={!!errors?.email ? theme.colors.danger5 : null}
                        onChange={(e: any) => {
                          handleChangeInputEmail(e, onChange);
                        }}
                        style={{ marginBottom: 10 }}
                      />
                    )}
                    name="email"
                    rules={{
                      required: {
                        value: true,
                        message: t(
                          'VALIDATION_ERROR_EMAIL_REQUIRED',
                          'The field Email is required',
                        ).replace('_attribute_', t('EMAIL', 'Email'))
                      },
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: t(
                          'INVALID_ERROR_EMAIL',
                          'Invalid email address',
                        ).replace('_attribute_', t('EMAIL', 'Email')),
                      }
                    }}
                    defaultValue=""
                  />
                </>
              )}

              {((useLoginByCellphone && loginTab === 'cellphone') || (loginTab === 'otp' && otpType === 'cellphone')) && (
                <View style={{ marginBottom: 15 }}>
                  <PhoneInputNumber
                    data={phoneInputData}
                    handleData={handleChangePhoneNumber}
                    textInputProps={{
                      returnKeyType: 'next',
                      onSubmitEditing: () => passwordRef?.current?.focus?.(),
                    }}
                    isStartValidation={errors?.cellphone}
                  />
                </View>
              )}
              {errors?.password && (
                <OText
                  size={14}
                  color={theme.colors.danger5}
                  weight={'normal'}>
                  {errors?.password?.message}{errors?.password?.type === 'required' && '*'}
                </OText>
              )}
              {loginTab !== 'otp' && (
                <Controller
                  control={control}
                  render={({ onChange, value }: any) => (
                    <OInput
                      isSecured={!passwordSee ? true : false}
                      placeholder={t('PASSWORD', 'Password')}
                      autoCapitalize='none'
                      value={value}
                      forwardRef={passwordRef}
                      returnKeyType="done"
                      blurOnSubmit
                      iconCustomRight={
                        <MaterialCommunityIcons
                          name={passwordSee ? "eye-off-outline" : "eye-outline"}
                          size={24}
                          onPress={() => setPasswordSee(!passwordSee)}
                          color={theme.colors.disabled}
                        />
                      }
                      borderColor={!!errors?.password ? theme.colors.danger5 : null}
                      onChange={(val: any) => onChange(val)}
                      onSubmitEditing={handleSubmit(onSubmit)}
                    />
                  )}
                  name="password"
                  rules={{
                    required: {
                      value: true,
                      message: t(
                        'VALIDATION_ERROR_PASSWORD_REQUIRED',
                        'The field Password is required',
                      ).replace('_attribute_', t('PASSWORD', 'Password'))
                    }
                  }}
                  defaultValue=""
                />
              )}

              {onNavigationRedirect && forgotButtonText && loginTab !== 'otp' && (
                <TouchableOpacity onPress={() => onNavigationRedirect('Forgot')}>
                  <OText size={14} mBottom={18} weight='bold'>
                    {forgotButtonText}
                  </OText>
                </TouchableOpacity>
              )}

              {(enableReCaptcha && recaptchaConfig?.version) && (
                <>
                  {recaptchaConfig?.version === 'v3' ? (
                    <ReCaptcha
                      url={recaptchaConfig?.baseUrl}
                      siteKey={recaptchaConfig?.siteKey}
                      containerStyle={{ height: 40 }}
                      onExecute={onRecaptchaVerify}
                      reCaptchaType={1}
                    />
                  ) : (
                    <>
                      <TouchableOpacity
                        onPress={handleOpenRecaptcha}
                      >
                        <RecaptchaButton>
                          {recaptchaVerified ? (
                            <MaterialCommunityIcons
                              name="checkbox-marked"
                              size={26}
                              color={theme.colors.primary}
                            />
                          ) : (
                            <MaterialCommunityIcons
                              name="checkbox-blank-outline"
                              size={26}
                              color={theme.colors.mediumGray}
                            />
                          )}
                          <OText size={14} mLeft={8}>{t('VERIFY_ReCAPTCHA', 'Verify reCAPTCHA')}</OText>
                        </RecaptchaButton>
                      </TouchableOpacity>
                      <Recaptcha
                        ref={recaptchaRef}
                        siteKey={recaptchaConfig?.siteKey}
                        baseUrl={recaptchaConfig?.baseUrl}
                        onVerify={onRecaptchaVerify}
                        onExpire={() => setRecaptchaVerified(false)}
                      />
                    </>)
                  }
                </>
              )}

              {onNavigationRedirect && registerButtonText && (
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <OText size={14}>
                    {t('NEW_ON_PLATFORM', 'New on Ordering?')}
                  </OText>
                  <TouchableOpacity onPress={() => props.onNavigateToSignup?.()}>
                    <OText size={14} mLeft={5} color={theme.colors.primary} weight={'bold'}>
                      {t('CREATE_ACCOUNT', 'Create account')}
                    </OText>
                  </TouchableOpacity>
                </View>
              )}
            </FormInput>
          )}

          {useLoginByCellphone &&
            loginTab === 'cellphone' &&
            configs && Object.keys(configs).length > 0 &&
            (configs?.twilio_service_enabled?.value === 'true' ||
              configs?.twilio_service_enabled?.value === '1') &&
            configs?.twilio_module?.value && (
              <ButtonsWrapper mBottom={20}>
                <OButton
                  text={t('GET_VERIFY_CODE', 'Get Verify Code')}
                  loading={isLoadingVerifyModal}
                  onClick={handleVerifyCodeClick}
                />
              </ButtonsWrapper>
            )}
          {enabledPoweredByOrdering && (<OText>Powered By Orderingplus</OText>)}
        </FormSide>
        <OModal
          open={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          title={t('VERIFY_PHONE', 'Verify Phone')}
        >
          <VerifyPhone
            phone={phoneInputData.phone}
            verifyPhoneState={verifyPhoneState}
            checkPhoneCodeState={checkPhoneCodeState}
            handleCheckPhoneCode={handleCheckPhoneCode}
            setCheckPhoneCodeState={setCheckPhoneCodeState}
            handleVerifyCodeClick={handleVerifyCodeClick}
            onClose={() => setIsModalVisible(false)}
          />
        </OModal>
        <Modal
          visible={willVerifyOtpState}
          onDismiss={() => setWillVerifyOtpState(false)}
          animationType='slide'
        >
          <Otp
            pinCount={numOtpInputs}
            isCheckingCode={isCheckingCode}
            setCheckingCode={setCheckingCode}
            willVerifyOtpState={willVerifyOtpState}
            otpError={otpError}
            setOtpError={setOtpError}
            setWillVerifyOtpState={setWillVerifyOtpState}
            handleLoginOtp={handleLoginOtp}
            onSubmit={onSubmit}
            setAlertState={setAlertState}
          />
        </Modal>
        <Alert
          open={alertState.open}
          content={alertState.content}
          title={alertState.title || ''}
          onAccept={closeAlert}
          onClose={closeAlert}
        />
        <Spinner visible={isFBLoading} />
        <ContainerFloatBtns>
          {(loginTab === 'otp' && otpType === 'cellphone' && useLoginOtpWhatsapp)
            ? (
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <OButton
                  text={t('SEND_BY_SMS', 'Send by SMS')}
                  loading={formState?.loading}
                  onClick={() => { otpChannelRef.current = 2; handleSubmit(onSubmit)() }}
                  parentStyle={{ flex: 1 }}
                  style={{ flex: 1 }}
                />
                <OButton
                  text={t('SEND_BY_WHATSAPP', 'Send by WhatsApp')}
                  loading={formState?.loading}
                  onClick={() => { otpChannelRef.current = 4; handleSubmit(onSubmit)() }}
                  parentStyle={{ flex: 1 }}
                  style={{ flex: 1 }}
                />
              </View>
            )
            : (
              <OButton
                text={loginTab !== 'otp' ? loginButtonText : t('GET_VERIFY_CODE', 'Get verify code')}
                loading={formState?.loading}
                onClick={() => {
                  if (loginTab === 'otp' && otpType === 'cellphone') {
                    otpChannelRef.current = 2
                  }
                  handleSubmit(onSubmit)()
                }}
              />
            )}
          <SocialButtons
            isGuest={isGuest}
            notificationState={notificationState}
            setIsFBLoading={setIsFBLoading}
            onHandleSuccess={(user: any) => {
              if (projectChanged) {
                setTimeout(() => {
                  RNRestart.restart()
                }, 300)
              }
              handleSuccessLogin?.(user)
            }}
          />
        </ContainerFloatBtns>
      </Container>
    </>
  );
};

export const LoginForm = (props: any) => {
  const _numOtpInputs = 6

  const loginProps = {
    ...props,
    numOtpInputs: _numOtpInputs,
    isRecaptchaEnable: true,
    UIComponent: LoginFormUI,
  };
  return <LoginFormController {...loginProps} />;
};
