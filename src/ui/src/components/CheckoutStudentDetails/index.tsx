import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from 'styled-components/native'
import { useSchoolStudents, useCartStudent, useSelectedStudent, useLanguage, useToast, ToastType } from '@components'
import { ODropDown, OText } from '../shared'
import { StudentFormModal } from '../StudentFormModal'
import { assignCartStudentIfChanged } from './schoolCartStudent'
import { Container, Header, Info, EditLink } from './styles'

const toArray = (value: any) => {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch (err) {
      return []
    }
  }
  return []
}

export const CheckoutStudentDetails = (props: any) => {
  const { cart, onStudentAssigned } = props
  const [, t] = useLanguage()
  const [, { showToast }] = useToast()
  const theme: any = useTheme()
  const { students, loading, loaded, refresh }: any = useSchoolStudents()
  const { assignStudent } = useCartStudent()
  const { studentId: selectedStudentId, setStudentId } = useSelectedStudent(cart?.business?.slug)
  const cartStudentId = cart?.student_id ?? cart?.student?.id ?? null
  const [currentId, setCurrentId] = useState(cartStudentId)
  const [editOpen, setEditOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const assignedRef = useRef(cartStudentId)
  const seenCartRef = useRef({ uuid: cart?.uuid ?? null, studentId: cartStudentId })

  const schoolStudents = students.filter((s: any) => Number(s.school_id ?? s.school?.id) === Number(cart?.business_id ?? cart?.business?.id))

  const syncCart = async (sid: any) => {
    const result = await assignCartStudentIfChanged({
      cartUuid: cart?.uuid,
      nextStudentId: sid ?? null,
      assignedStudentId: assignedRef.current,
      assignStudent
    })
    assignedRef.current = result.assignedStudentId
    if (result.error) {
      const message = result.error[0]
      showToast(ToastType.Error, t(message, String(message).replace(/_/g, ' ')))
    } else if (result.didAssign) {
      onStudentAssigned?.(result.assignedStudentId)
    }
    return result
  }

  const selectStudent = async (value: any) => {
    setCurrentId(value)
    const result = await syncCart(value)
    if (String(result.assignedStudentId ?? '') === String(value ?? '')) {
      setStudentId(value)
      return
    }
    setCurrentId(result.assignedStudentId)
  }

  useEffect(() => {
    const seen = seenCartRef.current
    const uuidChanged = (seen.uuid ?? null) !== (cart?.uuid ?? null)
    const studentChanged = String(seen.studentId ?? '') !== String(cartStudentId ?? '')
    if (uuidChanged || studentChanged) {
      seenCartRef.current = { uuid: cart?.uuid ?? null, studentId: cartStudentId }
      assignedRef.current = cartStudentId
      if (!uuidChanged) {
        setCurrentId(cartStudentId)
        if (String(selectedStudentId ?? '') !== String(cartStudentId ?? '')) setStudentId(cartStudentId)
        onStudentAssigned?.(cartStudentId)
        return
      }
    }
    if (loading || !loaded) return
    const cartSid = cartStudentId
    if (selectedStudentId) {
      if (schoolStudents.some((s: any) => s.id === Number(selectedStudentId))) {
        syncCart(selectedStudentId).then((result) => {
          if (result.error) setStudentId(null)
        })
      } else {
        setStudentId(null)
      }
      return
    }
    if (cartSid && schoolStudents.some((s: any) => s.id === Number(cartSid))) setStudentId(cartSid)
    else if (schoolStudents.length === 1) selectStudent(schoolStudents[0].id)
    else if (cartSid) syncCart(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, loaded, selectedStudentId, cartStudentId, cart?.uuid, students])

  const studentId = selectedStudentId ?? currentId ?? cart?.student_id ?? cart?.student?.id
  const student = students.find((s: any) => s.id === Number(studentId)) || cart?.student
  const studentOptions = schoolStudents.map((s: any) => ({ value: s.id, content: `${s.name} ${s.lastname}` }))
  const allergies = toArray(student?.allergies)
  const dietary = toArray(student?.dietary_tags)

  const handleChange = (value: any) => {
    selectStudent(value)
  }

  const handleCreated = (createdStudent: any) => {
    refresh()
    if (createdStudent?.id) handleChange(createdStudent.id)
    setCreateOpen(false)
  }

  return (
    <Container>
      <Header>
        <OText size={18} weight='bold'>{t('SCHOOL_STUDENT', 'Student')}</OText>
      </Header>
      {schoolStudents.length > 0 && (
        <ODropDown
          secondary
          options={studentOptions}
          defaultValue={studentId ? Number(studentId) : null}
          placeholder={t('SCHOOL_SELECT_STUDENT', 'Select a student')}
          onSelect={(value: any) => handleChange(value)}
          isModal
        />
      )}
      {student && (
        <Info>
          {!!student.classroom?.name && <OText size={15}>{t('SCHOOL_CLASSROOM', 'Classroom')}: {student.classroom.name}</OText>}
          {!!student.grade?.name && <OText size={15}>{t('SCHOOL_GRADE', 'Grade')}: {student.grade.name}</OText>}
          {allergies.length > 0 && <OText size={15}>{t('SCHOOL_ALLERGIES', 'Allergies')}: {allergies.join(', ')}</OText>}
          {dietary.length > 0 && <OText size={15}>{t('SCHOOL_DIETARY_TAGS', 'Dietary tags')}: {dietary.join(', ')}</OText>}
        </Info>
      )}
      {student && (
        <EditLink onPress={() => setEditOpen(true)}>
          <OText size={13} color={theme.colors.primary}>{t('SCHOOL_EDIT_STUDENT_DETAILS', 'Edit student details')}</OText>
        </EditLink>
      )}
      <EditLink onPress={() => setCreateOpen(true)}>
        <OText size={13} color={theme.colors.primary}>{t('SCHOOL_ADD_STUDENT', 'Add student')}</OText>
      </EditLink>
      {editOpen && (
        <StudentFormModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          student={student}
          onSaved={() => refresh()}
        />
      )}
      {createOpen && (
        <StudentFormModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          defaultSchoolId={cart?.business_id ?? cart?.business?.id}
          onSaved={handleCreated}
        />
      )}
    </Container>
  )
}
