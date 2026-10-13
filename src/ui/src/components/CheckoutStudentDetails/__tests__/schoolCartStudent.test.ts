import {
  assignCartStudentIfChanged,
  doesAnySchoolCartNeedStudent,
  doesSchoolCartNeedStudent,
  isSchoolCart
} from '../schoolCartStudent'

describe('isSchoolCart', () => {
  it('detects the school vertical on the cart business', () => {
    expect(isSchoolCart({ business: { vertical: 'school' } })).toBe(true)
    expect(isSchoolCart({ vertical: 'school' })).toBe(true)
  })

  it('is false for other verticals and missing carts', () => {
    expect(isSchoolCart({ business: { vertical: 'food' } })).toBe(false)
    expect(isSchoolCart(null)).toBe(false)
  })
})

describe('doesSchoolCartNeedStudent', () => {
  it('does not block non-school carts', () => {
    expect(doesSchoolCartNeedStudent({ isSchool: false, studentId: null })).toBe(false)
  })

  it('blocks a school cart with no student id', () => {
    expect(doesSchoolCartNeedStudent({ isSchool: true, studentId: null })).toBe(true)
    expect(doesSchoolCartNeedStudent({ isSchool: true, studentId: undefined })).toBe(true)
    expect(doesSchoolCartNeedStudent({ isSchool: true, studentId: '' })).toBe(true)
  })

  it('allows a school cart after a student is assigned', () => {
    expect(doesSchoolCartNeedStudent({ isSchool: true, studentId: 42 })).toBe(false)
  })
})

describe('doesAnySchoolCartNeedStudent', () => {
  it('blocks multi-checkout when a school cart has no student', () => {
    expect(doesAnySchoolCartNeedStudent([
      { business: { vertical: 'food' }, student_id: null },
      { business: { vertical: 'school' }, student_id: null }
    ])).toBe(true)
  })

  it('allows multi-checkout when every school cart has a student', () => {
    expect(doesAnySchoolCartNeedStudent([
      { business: { vertical: 'school' }, student_id: 7 },
      { business: { vertical: 'school' }, student: { id: 8 } },
      { business: { vertical: 'food' } }
    ])).toBe(false)
  })

  it('accepts a student assigned in the session for a cart that still lacks one', () => {
    expect(doesAnySchoolCartNeedStudent(
      [{ uuid: 'cart-1', business: { vertical: 'school' }, student_id: null }],
      { 'cart-1': 9 }
    )).toBe(false)
  })

  it('ignores non-array input', () => {
    expect(doesAnySchoolCartNeedStudent(null)).toBe(false)
  })
})

describe('assignCartStudentIfChanged', () => {
  it('does not call assign when the student is already on the cart', async () => {
    const assignStudent = jest.fn()
    await expect(assignCartStudentIfChanged({
      cartUuid: 'cart-1',
      nextStudentId: 9,
      assignedStudentId: '9',
      assignStudent
    })).resolves.toEqual({ assignedStudentId: '9', didAssign: false, error: null })
    expect(assignStudent).not.toHaveBeenCalled()
  })

  it('does not call assign without a cart uuid', async () => {
    const assignStudent = jest.fn()
    await expect(assignCartStudentIfChanged({
      cartUuid: null,
      nextStudentId: 9,
      assignedStudentId: null,
      assignStudent
    })).resolves.toEqual({ assignedStudentId: null, didAssign: false, error: null })
    expect(assignStudent).not.toHaveBeenCalled()
  })

  it('keeps the previous student and reports the error when the API fails', async () => {
    const assignStudent = jest.fn().mockResolvedValue({ error: true, result: ['failed'] })
    await expect(assignCartStudentIfChanged({
      cartUuid: 'cart-1',
      nextStudentId: 9,
      assignedStudentId: null,
      assignStudent
    })).resolves.toEqual({ assignedStudentId: null, didAssign: false, error: ['failed'] })
    expect(assignStudent).toHaveBeenCalledWith('cart-1', 9)
  })

  it('keeps the previous student when assign throws', async () => {
    const assignStudent = jest.fn().mockRejectedValue(new Error('network'))
    await expect(assignCartStudentIfChanged({
      cartUuid: 'cart-1',
      nextStudentId: 9,
      assignedStudentId: 3,
      assignStudent
    })).resolves.toEqual({ assignedStudentId: 3, didAssign: false, error: ['network'] })
  })

  it('advances the assigned student only after assign succeeds', async () => {
    const assignStudent = jest.fn().mockResolvedValue({ error: false, result: {} })
    await expect(assignCartStudentIfChanged({
      cartUuid: 'cart-1',
      nextStudentId: 9,
      assignedStudentId: null,
      assignStudent
    })).resolves.toEqual({ assignedStudentId: 9, didAssign: true, error: null })
  })
})
