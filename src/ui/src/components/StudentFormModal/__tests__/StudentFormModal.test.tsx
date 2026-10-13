import '../../../../../../jest/helpers/registerM8NativeMocks'

import React from 'react'
import { fireEvent, waitFor } from '@testing-library/react-native'

jest.mock('../../shared', () => require('../../../../../../jest/helpers/m8ProfileSharedMock'))

import { StudentFormModal } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

const mockSchools: any = { state: null }
const mockShowToast = jest.fn()

jest.mock('@components', () => {
  const m8 = require('../../../../../../jest/helpers/m8ProfileComponentsMock')
  const base = m8.getMock()
  const baseUseSchools = base.useSchools
  return {
    ...base,
    useSchools: jest.fn(() => mockSchools.state || baseUseSchools()),
    useToast: jest.fn(() => [{}, { showToast: mockShowToast }])
  }
})

const saveButton = (utils: any) => utils.getByTestId('obutton')

describe('StudentFormModal', () => {
  const d = require('../../../../../../jest/helpers/m8ProfileDefaults')
  const { useSchoolStudents, useSchools } = require('@components')

  beforeEach(() => {
    mockSchools.state = null
    mockShowToast.mockClear()
    useSchoolStudents().createStudent.mockClear()
  })

  it('renders add student form fields', () => {
    const { getByText } = renderWithProviders(
      <StudentFormModal {...d.studentFormModalDefaults} />
    )
    expect(getByText('Add student')).toBeTruthy()
    expect(getByText('School')).toBeTruthy()
    expect(getByText('Name')).toBeTruthy()
  })

  it('renders edit mode when student is provided', () => {
    const { getByText } = renderWithProviders(
      <StudentFormModal
        {...d.studentFormModalDefaults}
        student={d.sampleStudent}
      />
    )
    expect(getByText('Edit student')).toBeTruthy()
    expect(getByText('Test School')).toBeTruthy()
  })

  it('names the missing field on the save button and only enables it when the form is complete', async () => {
    const utils = renderWithProviders(<StudentFormModal {...d.studentFormModalDefaults} />)
    expect(saveButton(utils)).toHaveTextContent('Name is required')
    expect(saveButton(utils)).toBeDisabled()

    fireEvent.changeText(utils.getByPlaceholderText('Name'), 'Ada')
    fireEvent.changeText(utils.getByPlaceholderText('Lastname'), 'Lovelace')
    expect(saveButton(utils)).toHaveTextContent('Classroom is required')
    expect(saveButton(utils)).toBeDisabled()

    fireEvent.press(utils.getByTestId('odropdown-10'))
    expect(saveButton(utils)).toHaveTextContent('Grade is required')
    expect(saveButton(utils)).toBeDisabled()
    fireEvent.press(saveButton(utils))
    expect(useSchoolStudents().createStudent).not.toHaveBeenCalled()

    fireEvent.press(utils.getByTestId('odropdown-5'))
    expect(saveButton(utils)).toHaveTextContent('Save')
    expect(saveButton(utils)).not.toBeDisabled()
  })

  it('creates the student with the picked grade', async () => {
    const utils = renderWithProviders(<StudentFormModal {...d.studentFormModalDefaults} />)
    fireEvent.changeText(utils.getByPlaceholderText('Name'), 'Ada')
    fireEvent.changeText(utils.getByPlaceholderText('Lastname'), 'Lovelace')
    fireEvent.press(utils.getByTestId('odropdown-10'))
    fireEvent.press(utils.getByTestId('odropdown-5'))
    fireEvent.press(saveButton(utils))
    await waitFor(() => expect(useSchoolStudents().createStudent).toHaveBeenCalledWith(expect.objectContaining({ grade_id: 5, classroom_id: 10 })))
  })

  it('does not require a grade when the school has none configured', async () => {
    const base = useSchools()
    mockSchools.state = { ...base, schools: [{ ...base.schools[0], grades: [] }] }
    const utils = renderWithProviders(<StudentFormModal {...d.studentFormModalDefaults} />)
    fireEvent.changeText(utils.getByPlaceholderText('Name'), 'Ada')
    fireEvent.changeText(utils.getByPlaceholderText('Lastname'), 'Lovelace')
    fireEvent.press(utils.getByTestId('odropdown-10'))
    expect(saveButton(utils)).toHaveTextContent('Save')
    fireEvent.press(saveButton(utils))
    await waitFor(() => expect(useSchoolStudents().createStudent).toHaveBeenCalled())
  })
})
