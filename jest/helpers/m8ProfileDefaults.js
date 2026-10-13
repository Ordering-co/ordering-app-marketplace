const sessionUser = {
  id: 1,
  name: 'Jane',
  lastname: 'Doe',
  email: 'jane@test.com',
  cellphone: '5551234567',
  country_phone_code: '1',
  level: 3,
  photo: 'https://cdn.test/photo.jpg',
  birthdate: '1990-01-01'
}

const schoolBusiness = {
  id: 1,
  slug: 'test-school',
  vertical: 'school',
  name: 'Test School'
}

const sampleStudent = {
  id: 7,
  name: 'Ada',
  lastname: 'Lovelace',
  school_id: 1,
  school: { id: 1, name: 'Test School' },
  classroom: { id: 10, name: 'Room A' },
  grade: { id: 5, name: '5th' },
  allergies: [],
  dietary_tags: []
}

const secondStudent = {
  id: 8,
  name: 'Grace',
  lastname: 'Hopper',
  school_id: 1,
  school: { id: 1, name: 'Test School' },
  classroom: { id: 11, name: 'Room B' },
  grade: { id: 6, name: '6th' },
  allergies: [],
  dietary_tags: []
}

const sampleSchool = {
  id: 1,
  name: 'Test School',
  classrooms: [{ id: 10, name: 'Room A' }],
  grades: [{ id: 5, name: '5th' }]
}

module.exports = {
  sessionUser,
  schoolBusiness,
  sampleStudent,
  secondStudent,
  sampleSchool,

  userDetailsDefaults: {
    formState: {
      loading: false,
      result: { error: false, result: sessionUser },
      changes: {}
    },
    validationFields: { loading: false },
    isEdit: false,
    toggleIsEdit: jest.fn(),
    cleanFormState: jest.fn(),
    requiredFields: false,
    cartStatus: 0,
    phoneUpdate: false,
    togglePhoneUpdate: jest.fn(),
    verifyPhoneState: { loading: false, result: { error: false } },
    handleSendVerifyCode: jest.fn(),
    setFormState: jest.fn(),
    setIsOpen: jest.fn()
  },

  userFormDetailsUIDefaults: {
    isEdit: true,
    setIsEdit: jest.fn(),
    formState: {
      loading: false,
      result: { error: false, result: sessionUser },
      changes: { name: 'Jane' }
    },
    showField: jest.fn(() => true),
    requiredFields: false,
    setIsSubmit: jest.fn(),
    cleanFormState: jest.fn(),
    toggleIsEdit: jest.fn(),
    isRequiredField: jest.fn(() => false),
    validationFields: { loading: false, fields: {} },
    handleChangeInput: jest.fn(),
    handleButtonUpdateClick: jest.fn(),
    phoneUpdate: false,
    hideUpdateButton: false,
    setWillVerifyOtpState: jest.fn(),
    isProfile: true,
    isGuest: false,
    isCheckout: false,
    setIsOpen: jest.fn(),
    handleRemoveAccount: jest.fn()
  },

  userProfileDefaults: {
    notificationsGroup: { loading: false, result: { error: false, result: null } },
    handleRemoveAccount: jest.fn(),
    removeAccountState: {},
    goToBack: jest.fn(),
    onNavigationRedirect: jest.fn(),
    appVersion: '1.0.0',
    wallets: { result: { result: { cash: { balance: 10 }, points: { balance: 100 } } } },
    isWalletPointsEnabled: true
  },

  userProfileFormDefaults: {
    formState: {
      loading: false,
      result: { error: false, result: sessionUser },
      changes: {}
    },
    handleButtonUpdateClick: jest.fn(),
    handleSendVerifyCode: jest.fn(),
    verifyPhoneState: { loading: false, result: { error: false } },
    setFormState: jest.fn()
  },

  studentSelectorDefaults: {
    business: schoolBusiness,
    navigation: { navigate: jest.fn() }
  },

  studentFormModalDefaults: {
    open: true,
    onClose: jest.fn(),
    onSaved: jest.fn(),
    defaultSchoolId: 1
  },

  studentOnboardingDefaults: {
    business: schoolBusiness,
    forceOpen: true,
    onForceClose: jest.fn()
  }
}
