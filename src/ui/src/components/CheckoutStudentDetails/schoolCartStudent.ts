const hasValue = (value: unknown) => value !== null && value !== undefined && value !== ''

export function isSchoolCart (cart: unknown) {
  if (!cart || typeof cart !== 'object') return false
  const record = cart as Record<string, any>
  return record.vertical === 'school' || record.business?.vertical === 'school'
}

export function doesSchoolCartNeedStudent ({
  isSchool,
  studentId
}: {
  isSchool: boolean
  studentId?: unknown
}) {
  if (!isSchool) return false
  return !hasValue(studentId)
}

export function doesAnySchoolCartNeedStudent (carts: unknown, assignedByCart: Record<string, unknown> = {}) {
  if (!Array.isArray(carts)) return false
  return carts.some((cart) => {
    if (!cart || typeof cart !== 'object') return false
    const record = cart as Record<string, any>
    return doesSchoolCartNeedStudent({
      isSchool: isSchoolCart(record),
      studentId: record.student_id ?? record.student?.id ?? assignedByCart?.[record.uuid]
    })
  })
}

export async function assignCartStudentIfChanged ({
  cartUuid,
  nextStudentId,
  assignedStudentId,
  assignStudent
}: {
  cartUuid?: unknown
  nextStudentId?: unknown
  assignedStudentId?: unknown
  assignStudent: (cartUuid: string, studentId: unknown) => Promise<{ error?: unknown, result?: unknown } | void>
}) {
  const current = assignedStudentId ?? null
  if (!cartUuid) {
    return { assignedStudentId: current, didAssign: false, error: null }
  }
  const next = nextStudentId ?? null
  if (String(current ?? '') === String(next ?? '')) {
    return { assignedStudentId: current, didAssign: false, error: null }
  }
  try {
    const response = await assignStudent(String(cartUuid), next)
    if (response && typeof response === 'object' && response.error) {
      const result = response.result
      return { assignedStudentId: current, didAssign: false, error: Array.isArray(result) ? result : [result ?? 'ERROR'] }
    }
    return { assignedStudentId: next, didAssign: true, error: null }
  } catch (err: any) {
    return { assignedStudentId: current, didAssign: false, error: [err?.message ?? 'ERROR'] }
  }
}
