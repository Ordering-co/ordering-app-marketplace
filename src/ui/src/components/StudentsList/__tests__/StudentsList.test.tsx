import '../../../../../../jest/helpers/registerM8NativeMocks'

import React from 'react'
import { fireEvent } from '@testing-library/react-native'

jest.mock('../../shared', () => require('../../../../../../jest/helpers/m8ProfileSharedMock'))

import { StudentsList } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m8ProfileComponentsMock').getMock())

describe('StudentsList', () => {
  it('renders registered students', () => {
    const { getByText } = renderWithProviders(<StudentsList />)
    expect(getByText('Add student')).toBeTruthy()
    expect(getByText(/Ada Lovelace/)).toBeTruthy()
  })

  it('opens create form when add student is pressed', () => {
    const { getByText, getAllByText } = renderWithProviders(<StudentsList />)
    fireEvent.press(getByText('Add student'))
    expect(getAllByText('Add student').length).toBeGreaterThan(1)
  })
})
