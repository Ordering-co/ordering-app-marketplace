const noop = () => {}

module.exports = {
  loginFormDefaults: {
    loginTab: 'email',
    formState: { loading: false, result: {} },
    useLoginByEmail: true,
    useLoginByCellphone: false,
    useLoginOtp: false,
    useLoginOtpEmail: false,
    useLoginOtpCellphone: false,
    useLoginOtpWhatsapp: false,
    loginButtonText: 'Login',
    forgotButtonText: 'Forgot password?',
    registerButtonText: 'Sign up',
    handleChangeTab: noop,
    handleButtonLoginClick: jest.fn(),
    onNavigationRedirect: jest.fn(),
    onNavigateToSignup: jest.fn(),
    enableReCaptcha: false,
    otpType: 'email',
    setOtpType: noop,
    generateOtpCode: jest.fn(),
    numOtpInputs: 6,
    setCellphoneStartZero: noop,
    handleSuccessLogin: jest.fn()
  },
  forgotPasswordDefaults: {
    navigation: { goBack: jest.fn(), canGoBack: jest.fn(() => true) },
    formState: { loading: false, result: {} },
    handleButtonForgotPasswordClick: jest.fn(),
    handleReCaptcha: jest.fn(),
    enableReCaptcha: false,
    reCaptchaValue: null
  },
  signupFormDefaults: {
    navigation: { navigate: jest.fn() },
    loginButtonText: 'Login',
    signupButtonText: 'Sign up',
    formState: { loading: false, result: { result: null, error: false } },
    validationFields: {
      loading: false,
      fields: {
        checkout: {
          email: { code: 'email', enabled: true, required: true, name: 'Email' },
          name: { code: 'name', enabled: true, required: true, name: 'Name' },
          password: { code: 'password', enabled: true, required: true, name: 'Password' }
        }
      }
    },
    showField: (code) => ['email', 'name', 'password'].includes(code),
    isRequiredField: (code) => code !== 'middle_name',
    useChekoutFileds: true,
    handleButtonSignupClick: jest.fn(),
    handleSuccessSignup: jest.fn(),
    onNavigationRedirect: jest.fn(),
    onNavigateToLogin: jest.fn(),
    enableReCaptcha: false,
    signUpTab: 'default',
    setSignUpTab: noop,
    useSignUpFullDetails: true,
    useSignUpOtpEmail: false,
    useSignUpOtpCellphone: false,
    useSignUpOtpWhatsapp: false,
    handleChangePromotions: noop,
    numOtpInputs: 6
  },
  userVerificationDefaults: {
    verifyEmailState: { loadingSendCode: false, resultSendCode: false },
    verifyPhoneState: { loadingSendCode: false, resultSendCode: false },
    sendVerifyEmailCode: jest.fn(),
    sendVerifyPhoneCode: jest.fn(),
    checkVerifyEmailCode: jest.fn(),
    checkVerifyPhoneCode: jest.fn(),
    cleanErrorsState: jest.fn(),
    useWhatsappVerification: false
  },
  sessionsDefaults: {
    sessionsList: {
      loading: false,
      sessions: [
        { id: 1, created_at: '2026-01-01', valid_thru: '2026-12-31', current: true },
        { id: 2, created_at: '2026-02-01', valid_thru: '2026-12-31', current: false }
      ]
    },
    actionState: { loading: false },
    handleDeleteSession: jest.fn(),
    handleDeleteAllSessions: jest.fn()
  },
  languageSelectorDefaults: {
    languagesState: {
      loading: false,
      languages: [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' }
      ]
    },
    currentLanguage: 'en',
    handleChangeLanguage: jest.fn(),
    onNavigationRedirect: jest.fn()
  },
  languagesDefaults: {
    languagesState: {
      loading: false,
      languages: [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' }
      ]
    },
    currentLanguage: 'en',
    handleChangeLanguage: jest.fn(),
    goToBack: jest.fn()
  },
  projectFormDefaults: {
    navigation: { goBack: jest.fn(), canGoBack: jest.fn(() => true) },
    onNavigationRedirect: jest.fn(),
    onSubmit: jest.fn(),
    projectState: { data: null, loading: false },
    setProjectState: jest.fn()
  },
  userFormDetailsDefaults: {
    user: { id: 1, email: 'user@test.com', email_verified: false },
    isEdit: true,
    dontToggleEditMode: true,
    isVerifiedPhone: true,
    formState: { loading: false, changes: {}, result: { error: false } },
    userState: {
      loading: false,
      result: { error: false, result: { id: 1, email: 'user@test.com' } }
    },
    validationFields: {
      loading: false,
      fields: {
        checkout: {
          name: { code: 'name', enabled: true, required: true, name: 'Name' },
          email: { code: 'email', enabled: true, required: true, name: 'Email' }
        }
      }
    },
    showField: () => true,
    isRequiredField: () => true,
    setIsEdit: jest.fn(),
    cleanFormState: jest.fn(),
    handleChangeInput: jest.fn(),
    handleButtonUpdateClick: jest.fn(),
    toggleIsEdit: jest.fn(),
    onCloseProfile: jest.fn(),
    phoneUpdate: jest.fn(),
    setWillVerifyOtpState: jest.fn(),
    handlePlaceOrderAsGuest: jest.fn(),
    handleRemoveAccount: jest.fn(),
    hideUpdateButton: true
  }
}
