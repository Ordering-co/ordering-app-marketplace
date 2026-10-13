const React = require('react')

const mockState = {
  sessionState: null,
  selectedStudentState: null
}

const renderUiController = (defaults = {}) => (props) => {
  const UI = props.UIComponent
  if (!UI) return null
  const { UIComponent, ...rest } = props
  return React.createElement(UI, { ...defaults, ...rest })
}

module.exports = {
  renderUiController,
  setMockState: (state) => {
    Object.assign(mockState, state)
  },
  resetMockState: () => {
    mockState.sessionState = null
    mockState.selectedStudentState = null
  },
  getMock: (overrides = {}) => {
    const m7 = require('./m7ReviewsComponentsMock')
    const d = require('./m8ProfileDefaults')

    const getSessionState = () => mockState.sessionState || {
      auth: true,
      user: d.sessionUser,
      token: 'token',
      loading: false
    }

    const getSelectedStudentState = () => mockState.selectedStudentState || {
      studentId: null,
      setStudentId: jest.fn()
    }

    const schoolStudentsState = {
      students: [d.sampleStudent, d.secondStudent],
      loading: false,
      loaded: true,
      refresh: jest.fn(),
      createStudent: jest.fn().mockResolvedValue({ id: 9, name: 'New', lastname: 'Student', school_id: 1 }),
      updateStudent: jest.fn().mockResolvedValue({})
    }

    const schoolsState = {
      schools: [d.sampleSchool],
      loading: false
    }

    const api = {
      root: 'https://api.test',
      project: 'test-project',
      appId: 'app',
      appInternalName: 'ordering_app',
      language: 'en',
      languages: jest.fn(() => ({
        where: jest.fn(() => ({
          get: jest.fn().mockResolvedValue({ content: { error: false, result: [{ id: 1, name: 'English' }] } })
        }))
      }))
    }

    const orderState = {
      loading: false,
      options: { type: 1 },
      carts: {
        'businessId:1': {
          uuid: 'cart-1',
          student_id: 7,
          student: d.sampleStudent,
          business_id: 1
        }
      }
    }

    return {
      ...m7.getMock(),
      UserFormDetails: (props) => {
        const UI = props.UIComponent
        if (!UI) return null
        let defaults = d.userDetailsDefaults
        if (UI.name === 'ProfileListUI') defaults = d.userProfileDefaults
        if (UI.name === 'ProfileUI') defaults = d.userProfileFormDefaults
        const { UIComponent, ...rest } = props
        return React.createElement(UI, { ...defaults, ...rest })
      },
      useSession: jest.fn(() => [getSessionState(), { login: jest.fn(), logout: jest.fn() }]),
      useApi: jest.fn(() => [api]),
      useSchoolStudents: jest.fn(() => schoolStudentsState),
      useSchools: jest.fn(() => schoolsState),
      useSelectedStudent: jest.fn(() => getSelectedStudentState()),
      useCartStudent: jest.fn(() => ({ assignStudent: jest.fn() })),
      useOrder: jest.fn(() => [orderState, { setStateValues: jest.fn() }]),
      SCHOOL_ALLERGENS: [
        { value: 'dairy', name: 'Dairy' },
        { value: 'nuts', name: 'Nuts' }
      ],
      SCHOOL_DIETARY_TAGS: [
        { value: 'vegan', name: 'Vegan' },
        { value: 'vegetarian', name: 'Vegetarian' }
      ],
      ...overrides
    }
  }
}
