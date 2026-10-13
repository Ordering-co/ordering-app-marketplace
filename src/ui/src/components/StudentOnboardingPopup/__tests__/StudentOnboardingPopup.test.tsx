import '../../../../../../jest/helpers/registerM8NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

jest.mock('../../shared', () => require('../../../../../../jest/helpers/m8ProfileSharedMock'))

import { StudentOnboardingPopup } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m8ProfileComponentsMock').getMock())

describe('StudentOnboardingPopup', () => {
  const m8 = require('../../../../../../jest/helpers/m8ProfileComponentsMock')
  const d = require('../../../../../../jest/helpers/m8ProfileDefaults')

  beforeEach(() => {
    m8.resetMockState()
  })

  it('renders student picker when open', () => {
    const { getByText } = renderWithProviders(
      <StudentOnboardingPopup {...d.studentOnboardingDefaults} />
    )
    expect(getByText('Who are you ordering for?')).toBeTruthy()
    expect(getByText(/Ada Lovelace/)).toBeTruthy()
    expect(getByText(/Grace Hopper/)).toBeTruthy()
  })

  it('selects a student when option is pressed', () => {
    const setStudentId = jest.fn()
    const onForceClose = jest.fn()
    m8.setMockState({
      selectedStudentState: { studentId: null, setStudentId }
    })
    const { getByText } = renderWithProviders(
      <StudentOnboardingPopup
        {...d.studentOnboardingDefaults}
        onForceClose={onForceClose}
      />
    )
    fireEvent.press(getByText(/Ada Lovelace/))
    expect(setStudentId).toHaveBeenCalledWith(7)
    expect(onForceClose).toHaveBeenCalled()
  })
})
