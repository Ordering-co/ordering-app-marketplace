import React, { useEffect, useState, useRef } from 'react'
import { useTheme } from 'styled-components/native'
import { useSchoolStudents, useLanguage, useOrder, useCartStudent, useSelectedStudent, useSession } from '@components'
import { ODropDown, OText } from '../shared'
import { StudentFormModal } from '../StudentFormModal'
import { assignCartStudentIfChanged } from '../CheckoutStudentDetails/schoolCartStudent'
import { Container, Label, Notice, AddStudentLink } from './styles'

export const StudentSelector = (props: any) => {
  const { business, navigation } = props
  const [, t] = useLanguage()
  const theme: any = useTheme()
  const [{ auth }] = useSession()
  const { students, loading, loaded, refresh }: any = useSchoolStudents()
  const [orderState]: any = useOrder()
  const { assignStudent } = useCartStudent()
  const { studentId: selected, setStudentId } = useSelectedStudent(business?.slug)
  const [formOpen, setFormOpen] = useState(false)
  const [selectKey, setSelectKey] = useState(0)

  const cart = business?.id ? orderState?.carts?.[`businessId:${business.id}`] : null
  const cartStudentId = cart?.student_id ?? cart?.student?.id ?? null
  const isSchool = business?.vertical === 'school'
  const schoolStudents = students.filter((s: any) => Number(s.school_id ?? s.school?.id) === Number(business?.id))
  const selectedStudent = selected ? students.find((s: any) => s.id === Number(selected)) : null
  const assignedRef = useRef(cartStudentId)
  const seenCartRef = useRef({ uuid: cart?.uuid ?? null, studentId: cartStudentId })

  const syncCart = async (sid: any) => {
    const result = await assignCartStudentIfChanged({
      cartUuid: cart?.uuid,
      nextStudentId: sid ?? null,
      assignedStudentId: assignedRef.current,
      assignStudent
    })
    assignedRef.current = result.assignedStudentId
  }

  useEffect(() => {
    const seen = seenCartRef.current
    const uuidChanged = (seen.uuid ?? null) !== (cart?.uuid ?? null)
    const studentChanged = String(seen.studentId ?? '') !== String(cartStudentId ?? '')
    if (uuidChanged || studentChanged) {
      seenCartRef.current = { uuid: cart?.uuid ?? null, studentId: cartStudentId }
      assignedRef.current = cartStudentId
      if (!uuidChanged && isSchool) {
        if (String(selected ?? '') !== String(cartStudentId ?? '')) setStudentId(cartStudentId)
        return
      }
    }
    if (!cart?.uuid) return
    if (!isSchool) {
      syncCart(null)
      if (selected) setStudentId(null)
      return
    }
    if (loading || !loaded) return
    if (selected) {
      if (schoolStudents.some((s: any) => s.id === Number(selected))) syncCart(selected)
      else setStudentId(null)
      return
    }
    if (cartStudentId && schoolStudents.some((s: any) => s.id === Number(cartStudentId))) setStudentId(cartStudentId)
    else if (schoolStudents.length === 1) setStudentId(schoolStudents[0].id)
    else if (cartStudentId) syncCart(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSchool, selected, cart?.uuid, cartStudentId, loading, loaded, students])

  if (!isSchool) return null

  const studentOptions = schoolStudents.map((student: any) => ({ value: student.id, content: `${student.name} ${student.lastname}` }))

  const handleChange = (value: any) => {
    setStudentId(value)
  }

  const handleAddStudent = () => {
    if (!auth) {
      navigation?.navigate('Login')
      return
    }
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setSelectKey((k) => k + 1)
  }

  const handleSaved = (createdStudent: any) => {
    refresh()
    if (createdStudent?.id) setStudentId(createdStudent.id)
    closeForm()
  }

  return (
    <Container>
      {schoolStudents.length > 0 && (
        <>
          <Label>{t('SCHOOL_ORDERING_FOR', 'Ordering for')}</Label>
          <ODropDown
            secondary
            key={selectKey}
            options={studentOptions}
            defaultValue={selected ? Number(selected) : null}
            placeholder={loading ? t('LOADING', 'Loading') : t('SCHOOL_SELECT_STUDENT', 'Select a student')}
            onSelect={(value: any) => handleChange(value)}
            isModal
          />
        </>
      )}
      <AddStudentLink onPress={handleAddStudent}>
        <OText size={18} color={theme.colors.primary}>{t('SCHOOL_ADD_STUDENT', 'Add student')}</OText>
      </AddStudentLink>
      {selectedStudent && (
        <Notice>
          <OText size={13}>
            {t('SCHOOL_MENU_FILTERED_FOR', 'Showing the menu filtered for')} {selectedStudent.name} {selectedStudent.lastname}, {t('SCHOOL_BASED_ON_ALLERGIES_DIET', 'based on their allergies and dietary needs.')}
          </OText>
        </Notice>
      )}
      {formOpen && (
        <StudentFormModal
          open={formOpen}
          onClose={closeForm}
          defaultSchoolId={business?.id}
          onSaved={handleSaved}
        />
      )}
    </Container>
  )
}
