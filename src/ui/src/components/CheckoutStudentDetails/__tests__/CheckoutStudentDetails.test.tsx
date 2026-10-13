import '../../../../../../jest/helpers/registerM5NativeMocks'

import React from 'react'
import { fireEvent, waitFor } from '@testing-library/react-native'

import { CheckoutStudentDetails } from '..'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('../../StudentFormModal', () => {
  const { View } = require('react-native')
  return { StudentFormModal: () => <View testID="student-form-modal-stub" /> }
})

jest.mock('../../shared', () => require('../../../../../../jest/helpers/m8ProfileSharedMock'))

jest.mock('@components', () => {
  const m5 = require('../../../../../../jest/helpers/m5CheckoutComponentsMock')
  return m5.getMock()
})
jest.mock('@ui', () => require('../../../../../../jest/helpers/m5CheckoutUiMock').getUiMock())

const d = require('../../../../../../jest/helpers/m5CheckoutDefaults')
const ada = { id: 7, name: 'Ada', lastname: 'Lovelace', school_id: 1, allergies: [], dietary_tags: [] }
const grace = { id: 8, name: 'Grace', lastname: 'Hopper', school_id: 1, allergies: [], dietary_tags: [] }
const schoolCart = (overrides: any = {}) => ({
  ...d.sampleCart,
  business: { ...d.sampleBusiness, vertical: 'school', id: 1 },
  business_id: 1,
  student_id: null,
  student: null,
  ...overrides
})

const setup = ({ students = [ada, grace], selected = null, assignResult = { error: false, result: {} } }: any = {}) => {
  const { useSchoolStudents, useSelectedStudent, useCartStudent, useToast } = require('@components')
  const setStudentId = jest.fn()
  const assignStudent = jest.fn().mockResolvedValue(assignResult)
  const showToast = jest.fn()
  const onStudentAssigned = jest.fn()
  ;(useSchoolStudents as jest.Mock).mockReturnValue({ students, loading: false, loaded: true, refresh: jest.fn() })
  ;(useSelectedStudent as jest.Mock).mockReturnValue({ studentId: selected, setStudentId })
  ;(useCartStudent as jest.Mock).mockReturnValue({ assignStudent })
  ;(useToast as jest.Mock).mockReturnValue([{}, { showToast }])
  return { setStudentId, assignStudent, showToast, onStudentAssigned }
}

describe('CheckoutStudentDetails', () => {
  it('renders student selector for school cart', () => {
    setup({ students: [ada], selected: 7 })
    const { getAllByText } = renderWithProviders(
      <CheckoutStudentDetails {...d.checkoutStudentDetailsDefaults} />
    )
    expect(getAllByText(/Student/i).length).toBeGreaterThan(0)
  })

  it('shows add student when no school students match', () => {
    setup({ students: [] })
    const { getByText } = renderWithProviders(
      <CheckoutStudentDetails cart={schoolCart()} />
    )
    expect(getByText(/Add student/i)).toBeTruthy()
  })

  it('stores the selection only after the cart assign succeeds', async () => {
    const m = setup()
    const { getByTestId } = renderWithProviders(
      <CheckoutStudentDetails cart={schoolCart()} onStudentAssigned={m.onStudentAssigned} />
    )
    fireEvent.press(getByTestId('odropdown-8'))
    await waitFor(() => expect(m.assignStudent).toHaveBeenCalledWith('cart-1', 8))
    await waitFor(() => expect(m.setStudentId).toHaveBeenCalledWith(8))
    expect(m.onStudentAssigned).toHaveBeenCalledWith(8)
    expect(m.showToast).not.toHaveBeenCalled()
  })

  it('does not store the selection and warns when the cart assign fails', async () => {
    const m = setup({ assignResult: { error: true, result: ['STUDENT_NOT_ALLOWED'] } })
    const { getByTestId } = renderWithProviders(
      <CheckoutStudentDetails cart={schoolCart()} onStudentAssigned={m.onStudentAssigned} />
    )
    fireEvent.press(getByTestId('odropdown-8'))
    await waitFor(() => expect(m.assignStudent).toHaveBeenCalledWith('cart-1', 8))
    await waitFor(() => expect(m.showToast).toHaveBeenCalled())
    expect(m.setStudentId).not.toHaveBeenCalledWith(8)
    expect(m.onStudentAssigned).not.toHaveBeenCalled()
  })

  it('assigns a remembered student to a cart that has none before storing it', async () => {
    const m = setup({ selected: '8' })
    renderWithProviders(<CheckoutStudentDetails cart={schoolCart()} />)
    await waitFor(() => expect(m.assignStudent).toHaveBeenCalledWith('cart-1', '8'))
  })

  it('clears a remembered student that the cart assign rejects', async () => {
    const m = setup({ selected: '8', assignResult: { error: true, result: ['STUDENT_NOT_ALLOWED'] } })
    renderWithProviders(<CheckoutStudentDetails cart={schoolCart()} />)
    await waitFor(() => expect(m.assignStudent).toHaveBeenCalledWith('cart-1', '8'))
    await waitFor(() => expect(m.setStudentId).toHaveBeenCalledWith(null))
  })

  it('follows the cart when the same cart arrives without a student', async () => {
    const m = setup({ selected: '8' })
    const { rerender } = renderWithProviders(
      <CheckoutStudentDetails cart={schoolCart({ student_id: 8 })} onStudentAssigned={m.onStudentAssigned} />
    )
    expect(m.assignStudent).not.toHaveBeenCalled()
    rerender(<CheckoutStudentDetails cart={schoolCart({ student_id: null })} onStudentAssigned={m.onStudentAssigned} />)
    await waitFor(() => expect(m.setStudentId).toHaveBeenCalledWith(null))
    expect(m.onStudentAssigned).toHaveBeenCalledWith(null)
    expect(m.assignStudent).not.toHaveBeenCalled()
  })

  it('follows the cart when the same cart arrives with another student', async () => {
    const m = setup({ selected: '8' })
    const { rerender } = renderWithProviders(
      <CheckoutStudentDetails cart={schoolCart({ student_id: 8 })} onStudentAssigned={m.onStudentAssigned} />
    )
    rerender(<CheckoutStudentDetails cart={schoolCart({ student_id: 7 })} onStudentAssigned={m.onStudentAssigned} />)
    await waitFor(() => expect(m.setStudentId).toHaveBeenCalledWith(7))
    expect(m.onStudentAssigned).toHaveBeenCalledWith(7)
    expect(m.assignStudent).not.toHaveBeenCalled()
  })
})
