import '../../../../../../jest/helpers/registerM8NativeMocks'

import React from 'react'
import { fireEvent, waitFor } from '@testing-library/react-native'

jest.mock('../../shared', () => require('../../../../../../jest/helpers/m8ProfileSharedMock'))

import { StudentSelector } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

const mockOrder: any = { cart: null }
const mockAssignStudent = jest.fn()

jest.mock('@components', () => {
  const m8 = require('../../../../../../jest/helpers/m8ProfileComponentsMock')
  return m8.getMock({
    useOrder: jest.fn(() => [
      { loading: false, options: { type: 1 }, carts: mockOrder.cart ? { 'businessId:1': mockOrder.cart } : {} },
      { setStateValues: jest.fn() }
    ]),
    useCartStudent: jest.fn(() => ({ assignStudent: mockAssignStudent }))
  })
})

describe('StudentSelector', () => {
  const m8 = require('../../../../../../jest/helpers/m8ProfileComponentsMock')
  const d = require('../../../../../../jest/helpers/m8ProfileDefaults')

  beforeEach(() => {
    m8.resetMockState()
    mockOrder.cart = { uuid: 'cart-1', student_id: 7, student: d.sampleStudent, business_id: 1 }
    mockAssignStudent.mockReset()
    mockAssignStudent.mockResolvedValue({ error: false, result: {} })
  })

  it('renders student dropdown for school businesses', () => {
    const { getByText } = renderWithProviders(
      <StudentSelector {...d.studentSelectorDefaults} />
    )
    expect(getByText('Ordering for')).toBeTruthy()
    expect(getByText('Add student')).toBeTruthy()
  })

  it('navigates to login when adding student while logged out', () => {
    const navigate = jest.fn()
    m8.setMockState({
      sessionState: { auth: false, user: null, token: null, loading: false }
    })
    const { getByText } = renderWithProviders(
      <StudentSelector {...d.studentSelectorDefaults} navigation={{ navigate }} />
    )
    fireEvent.press(getByText('Add student'))
    expect(navigate).toHaveBeenCalledWith('Login')
  })

  it('follows the cart when the same cart arrives without a student', async () => {
    const setStudentId = jest.fn()
    m8.setMockState({ selectedStudentState: { studentId: 7, setStudentId } })
    const { rerender } = renderWithProviders(<StudentSelector {...d.studentSelectorDefaults} />)
    expect(mockAssignStudent).not.toHaveBeenCalled()
    mockOrder.cart = { uuid: 'cart-1', student_id: null, business_id: 1 }
    rerender(<StudentSelector {...d.studentSelectorDefaults} />)
    await waitFor(() => expect(setStudentId).toHaveBeenCalledWith(null))
    expect(mockAssignStudent).not.toHaveBeenCalled()
  })

  it('assigns the remembered student to a new cart instead of clearing it', async () => {
    const setStudentId = jest.fn()
    m8.setMockState({ selectedStudentState: { studentId: 7, setStudentId } })
    const { rerender } = renderWithProviders(<StudentSelector {...d.studentSelectorDefaults} />)
    mockOrder.cart = { uuid: 'cart-2', student_id: null, business_id: 1 }
    rerender(<StudentSelector {...d.studentSelectorDefaults} />)
    await waitFor(() => expect(mockAssignStudent).toHaveBeenCalledWith('cart-2', 7))
    expect(setStudentId).not.toHaveBeenCalledWith(null)
  })

  it('returns null for non-school businesses', () => {
    const { queryByText } = renderWithProviders(
      <StudentSelector business={{ ...d.schoolBusiness, vertical: 'food' }} />
    )
    expect(queryByText('Ordering for')).toBeNull()
  })
})
