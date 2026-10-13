import '../../../../../../jest/helpers/registerM6NativeMocks'

import React from 'react'

import { OrderStudentInfo } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => require('../../../../../../jest/helpers/m6OrdersComponentsMock').getMock())
jest.mock('@ui', () => require('../../../../../../jest/helpers/m6OrdersUiMock').getUiMock())

describe('OrderStudentInfo', () => {
  it('renders student name from order payload', () => {
    const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
    const { getByText } = renderWithProviders(
      <OrderStudentInfo order={d.sampleOrder} />
    )
    expect(getByText('Student')).toBeTruthy()
    expect(getByText(/Ada Lovelace/)).toBeTruthy()
  })

  it('returns null when student is missing', () => {
    const d = require('../../../../../../jest/helpers/m6OrdersDefaults')
    const { queryByText } = renderWithProviders(
      <OrderStudentInfo order={{ ...d.sampleOrder, student_id: null, student: null }} />
    )
    expect(queryByText('Student')).toBeNull()
  })
})
